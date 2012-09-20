import psycopg2
import psycopg2
from psycopg2 import extras
import datetime

host = '72.167.42.223'
user = 'postgres'
dbname = 'joule'
password = 'listeriusB2'

def initialize():
  conn = psycopg2.connect(host=host, dbname=dbname, user=user, password=password)
  cur = conn.cursor(cursor_factory=extras.NamedTupleCursor)
  return conn, cur

def group(number):
    s = '%d' % number
    groups = []
    while s and s[-1].isdigit():
        groups.append(s[-3:])
        s = s[:-3]
    return s + ','.join(reversed(groups))

def query(fn):
  def wrapper():
    conn, cur = initialize()
    cur.execute(fn())

class Prototype(dict):
  pass
def makePrototype(record):
  prototype = Prototype()
  for field_name in record._fields:
    value = getattr(record,field_name)
    prototype[field_name] = value
    setattr(prototype,field_name,value)
  return prototype

def makePrototypeList(records):
  final_list = []
  for record in records:
    prototype = makePrototype(record)
    final_list.append(prototype)
  return final_list




def getProgramOptions(cur,model,programs):
 '''Return list of all possible program combinations
 '''
 #if (str(programs[0])[0] != '6' and str(programs[0])[0] != '5' or len(str(programs))!=4) or (str(programs[0])[0] != '6' and str(programs[0])[0] != '5'):
 if 5<4:
  out_list =[]
  for i in range(1, len(programs)+1):
    out_list.extend(itertools.combinations(programs, i))
  final_set = Set(out_list)
  final_final_set = copy.deepcopy(final_set)
  for program in programs:
    cur.execute("select option_excluded from exclusions where program = %s"%(program))
    exclusion_sets = cur.fetchall()
    for exclusion_set in exclusion_sets:
      excluded_set = exclusion_set.option_excluded
      excluded_set.append(program)
      excluded_set = Set(excluded_set)
      exclusion_length = len(excluded_set)
      for option in final_set:
        exclusion_length = len(excluded_set)
        if exclusion_length == len(excluded_set&Set(option)):
          option_set_str = 'set([' + str(option) + '])'
          option_set = eval(option_set_str)
          final_final_set = final_final_set - option_set
  final_set = final_final_set 
  return final_final_set
 else:
  #cur.execute(''' select * from programs where service_provider = 'Southern California Edison Co' ''')
  final_set = set()
  for program in programs:
    cur.execute(''' select * from inclusions where program='%s' '''%(program))
    option_list = cur.fetchall()
    for item in option_list:
      try:   
        item.options.append(program)
        standard_list = item.options
      except: 
        standard_list = [program]
      final_set.add(frozenset(standard_list))
 '''for item in final_set:
   for other_item in final_set:
     if len(other_item) < len(item): 
       bigger_item = set(item)
       smaller_item = set(other_item)
     else:
       bigger_set = set(other_item)
       smaller_set = set(item)
     if bigger_set & smaller_set == smaller_set:
       final_set = final_set - smaller_set
  '''
 return final_set
  
  


def getAllOptionsEarnings(options,model):
  for option in options:
    option.total_earnings = getTotalOptionEarnings(programs,model)
  return options


def getTotalOptionEarnings(programs,model):
  '''Get total program option earnings
  '''
  programs.total_earnings = 0
  for program in programs:
    earnings = program.getYearlyEarnings(program,model)
    programs.total_earnings += earnings

  return programs.total_earnings


def getYearlyEarnings(program,model):
  try: total_kW_hours = model.curtailment_duration * model.annual_frequency * model.curtailment_load
  except: pass
  try:
    total_earnings = (program.value_kwhr_avg * total_kw_hours) + (model.curtailment_load * program.value_kwyear)
  except:
    try:
      total_earnings = program.estimated_annual_earnings * model.value_kwyear
    except:
      try: total_earnings = float(model.curtailment_load) * float(program.value_kwyear)
      except: total_earnings = 0
  program.yearly_earnings = '$' + group(int(total_earnings))
  program['yearly_earnings'] = '$' + group(int(total_earnings))
  program.yearly_earnings_int = int(total_earnings)
  program['yearly_earnings_int'] = int(total_earnings)
  return total_earnings

  
class List(list):
  pass



def genQuery(model):
  model['advanced_notice'] = str(eval('datetime.timedelta' +model['advanced_notice']).seconds) + ' sec'
  query_extension = ''
  white_list = ['advanced_notice','facility_curtailment','utility']
  translate_dict = {'advanced_notice':['time_to_respond','>='],'facility_curtailment':['minimum_curtailment','<='],'utility':['service_provider','=']}
  for item in white_list:
    if model[item] != None and model[item] != '':
      query_extension += '''AND (%s %s '%s' OR %s IS NULL) '''%(translate_dict[item][0],translate_dict[item][1],str(model[item]),translate_dict[item][0])
  return query_extension


def filterDuplicates(final_options,final_option):
  add_program = True
  i = 0
  for option in final_options:
    option_set = set(map(lambda x: x.id, option))
    final_set = set(map(lambda x: x.id, final_option))
    if option_set & final_set == final_set: add_program = False
    elif option_set & final_set == option_set: final_options.pop(i)
    else: i+=1
  if add_program ==True: final_options.append(final_option)
  return final_options



def filterOptions(model,options,cur,conn):
  query_extension = genQuery(model)
  final_options = []
  for option in options:
    final_option = []
    programs = option.options
    for prog_id in programs:
      estring = ''' SELECT * FROM programs WHERE id='%d' '''%(prog_id)
      estring = estring + query_extension
      cur.execute(estring)
      program = cur.fetchone()
      if program != None:
        final_option.append(program)
    final_options = filterDuplicates(final_options,final_option)
  return final_options







def getPrograms(get_data,conn,cur):
  query_string = ''' 
  SELECT options.*
  FROM zip_region INNER JOIN (((region_zone INNER JOIN region ON region_zone.region = region.id) INNER JOIN zone ON region_zone.zone = zone.id) INNER JOIN options ON zone.id = options.zone) ON zip_region.region = region.id
  WHERE (((zip_region.zip)='%s')); '''%(get_data['zip_code'])
  
  cur.execute(query_string)
  options = cur.fetchall()
  selected_options = filterOptions(get_data,options,cur,conn)
  final_list = List()
  for option in selected_options:
    option_list = List()
    option_list.total_value = 0
    for program in option:
      prototype = makePrototype(program)
      getYearlyEarnings(prototype,get_data)
      option_list.total_value += prototype.yearly_earnings_int
      option_list.append(prototype)
      option_list.option = option
    final_list.append(option_list)
  sorted_final_list = sorted(final_list, lambda x,y: 1 if x.total_value>y.total_value else -1 if x.total_value<y.total_value else 0)
  sorted_final_list.reverse()
  return sorted_final_list


  

def saveQuery(get_data):
  conn, cur = initialize()
  query_string = ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-01-01 00:00:00', '2011-01-31 23:59:59',%s,'false','%s'); '''%(get_data['january'],get_data['fa_id'])

  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-02-01 00:00:00', '2011-02-28 23:59:59',%s,'false','%s'); '''%(get_data['febuary'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-03-01 00:00:00', '2011-03-31 23:59:59',%s,'false','%s'); '''%(get_data['march'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-04-01 00:00:00', '2011-04-30 23:59:59',%s,'false','%s'); '''%(get_data['april'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-05-01 00:00:00', '2011-05-31 23:59:59',%s,'false','%s'); '''%(get_data['may'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-06-01 00:00:00', '2011-06-30 23:59:59',%s,'false','%s'); '''%(get_data['june'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-07-01 00:00:00', '2011-07-31 23:59:59',%s,'false','%s'); '''%(get_data['july'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-08-01 00:00:00', '2011-08-31 23:59:59',%s,'false','%s'); '''%(get_data['august'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-09-01 00:00:00', '2011-09-30 23:59:59',%s,'false','%s'); '''%(get_data['september'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-10-01 00:00:00', '2011-10-31 23:59:59',%s,'false','%s'); '''%(get_data['october'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-11-01 00:00:00', '2011-11-30 23:59:59',%s,'false','%s'); '''%(get_data['november'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-12-01 00:00:00', '2011-12-31 23:59:59',%s,'false','%s'); '''%(get_data['december'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-01-01 00:00:00', '2011-01-31 23:59:59',%s,'true','%s'); '''%(get_data['january_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-02-01 00:00:00', '2011-02-28 23:59:59',%s,'true','%s'); '''%(get_data['febuary_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-03-01 00:00:00', '2011-03-31 23:59:59',%s,'true','%s'); '''%(get_data['march_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-04-01 00:00:00', '2011-04-30 23:59:59',%s,'true','%s'); '''%(get_data['april_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-05-01 00:00:00', '2011-05-31 23:59:59',%s,'true','%s'); '''%(get_data['may_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-06-01 00:00:00', '2011-06-30 23:59:59',%s,'true','%s'); '''%(get_data['june_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-07-01 00:00:00', '2011-07-31 23:59:59',%s,'true','%s'); '''%(get_data['july_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-08-01 00:00:00', '2011-08-31 23:59:59',%s,'true','%s'); '''%(get_data['august_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-09-01 00:00:00', '2011-09-30 23:59:59',%s,'true','%s'); '''%(get_data['september_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-10-01 00:00:00', '2011-10-31 23:59:59',%s,'true','%s'); '''%(get_data['october_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-11-01 00:00:00', '2011-11-30 23:59:59',%s,'true','%s'); '''%(get_data['november_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-12-01 00:00:00', '2011-12-31 23:59:59',%s,'true','%s'); '''%(get_data['december_peak'], get_data['fa_id'])



  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-06-01 00:00:00', '2011-08-31 23:59:59',%s,'false','%s'); '''%(get_data['summer'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2011-06-01 00:00:00', '2011-08-31 23:59:59',%s,'true','%s'); '''%(get_data['summer_peak'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2010-12-01 00:00:00', '2011-02-28 23:59:59',%s,'false','%s'); '''%(get_data['winter'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2010-12-01 00:00:00', '2011-02-28 23:59:59',%s,'true','%s'); '''%(get_data['winter_peak'], get_data['fa_id'])



  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2010-01-01 00:00:00', '2011-12-31 23:59:59',%s,'false','%s'); '''%(get_data['yearly'], get_data['fa_id'])


  query_string += ''' INSERT INTO consumption (start_time, end_time, con_usage, peak, fa_id) VALUES ('2010-01-01 00:00:00', '2011-12-31 23:59:59',%s,'true','%s'); '''%(get_data['yearly_peak'], get_data['fa_id'])

  query_string += ''' INSERT INTO facility (username, address, city, state, zip_code, utility, facility_type) VALUES ('%s', '%s', '%s', '%s', %s, '%s', '%s'); '''%(get_data['user'],get_data['address'],get_data['city'],get_data['state'],get_data['zip_code'],get_data['utility'],get_data['facility_type'])

  query_string += ''' INSERT INTO generator (make, capacity, connected_load, comments, fuel_type, electrical_connection, fa_id) VALUES ('%s', %s, %s, '%s', '%s', '%s', '%s'); '''%(get_data['make1'],get_data['capacity1'],get_data['connected_load1'],get_data['comments1'],get_data['fuel_type1'],get_data['electrical_connection1'],get_data['fa_id'])

  query_string += ''' INSERT INTO generator (make, capacity, connected_load, comments, fuel_type, electrical_connection, fa_id) VALUES ('%s', %s, %s, '%s', '%s', '%s', '%s'); '''%(get_data['make2'],get_data['capacity2'],get_data['connected_load2'],get_data['comments2'],get_data['fuel_type2'],get_data['electrical_connection2'],get_data['fa_id'])

  query_string += ''' INSERT INTO generator (make, capacity, connected_load, comments, fuel_type, electrical_connection, fa_id) VALUES ('%s', %s, %s, '%s', '%s', '%s', '%s'); '''%(get_data['make3'],get_data['capacity3'],get_data['connected_load3'],get_data['comments3'],get_data['fuel_type3'],get_data['electrical_connection3'],get_data['fa_id'])

  query_string += ''' INSERT INTO curtailment_capabilities (advanced_notice, facility_curtailment, duration, frequency, fa_id) VALUES ('%s', %s, %s, %s, '%s'); '''%(get_data['advanced_notice'],get_data['facility_curtailment'],get_data['duration'],get_data['frequency'],get_data['fa_id'])
  cur.execute(query_string)
  conn.commit()
  programs = getPrograms(get_data,conn,cur)
  cur.close()
  conn.close()
  return programs
