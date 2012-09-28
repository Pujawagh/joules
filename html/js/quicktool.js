
$(function(){
 $('.consumption_period').hide();
 $('#meter_usage_data') .change(function(){
   
   $('.consumption_period').hide();
   $('#'+(this.value)).show();

 })



});



function validate(val)
{
   final_val = val.value
   // check to see if input value is of the number datatype
   if ($(val).attr('class').search('number')!=-1) 
   {
     final_val = parseFloat(final_val)
     if (isNaN(final_val))
     {
       final_val = 'NULL'
     } 
   }
   return final_val
}

function  save(){
  data = {}
  $.each($('form :input'),function(key,val)
    {
      data[val.name] = validate(val)
    });
  $.ajax({
    data:data,
    url:'http://72.167.42.223:9999/save',
    success:function(data)
	{
	
	 $('#options_table').html('')

      table_data = JSON.parse(data)
	   createOptionsTable(table_data)
    }
  });
}

function scrollToElement(selector, time, verticalOffset) {
   time = typeof(time) != 'milliseconds' ? time : 1000;
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $(selector);
    offset = element.offset();
    offsetTop = offset.top + verticalOffset;
    $('html, body').animate({
        scrollTop: offsetTop
    }, time, jQuery.easing.def = "easeInOutQuad");
  

}

$('div#dropp').click(function () {
    scrollToElement('#dropportunity');
});
$('a#location').click(function () {
    scrollToElement('#fac_loc');
});
$('a#type').click(function () {
    scrollToElement('#fac_type');
});
$('a#curtailment').click(function () {
    scrollToElement('#curtailment_capability');
});
$('a#generator').click(function () {
    scrollToElement('#standbygen');
});
$('a#top').click(function () {
    scrollToElement('#header');
});


function check(){

var accepted=null;

if (form.zip.value.length == 0) {
alert("Please enter Zipcode.");
form.zip.focus();
return false;
}

if (form.utility.selectedIndex == 0) {
alert("Please enter utility.");
form.utility.focus();
return false;
}
if (form.advanced_notice.selectedIndex == 0) {
alert("Please enter Advanced Notice.");
form.advanced_notice.focus();
return false;
}

if (form.facility_curtail.value.length == 0) {
alert("Please enter Curtailable Load .");
form.facility_curtail.focus();
return false;
}
if (form.duration.selectedIndex == 0) {
alert("Please enter Duration.");
form.duration.focus();
return false;
}
if (form.frequency.selectedIndex == 0) {
alert("Please enter times a year.");
form.frequency.focus();
return false;
}
else
{
$('#dropp').html('<li><a href="file:///C:/Users/Asus3/joules/html/quicktool.html#dr" id="DR"><font size="3.7px">DR opportunity</a></li>')
$('#dropport').html('<p id="dropportunity"><font size="6" color="#000000">DR Opportunity</font></p>')
$('#options_table').html('<br/><br/><div id="progress"><img src="img/loading.gif" width="23px" height="23px">Loading...</div><br/><br/>')
$('#submit').hide();
save()  
}
}

var defaultMsg = 'List the loads, if known(Elevators, Computers, lighting, etc)...';
function setMessage (txt, active) {
    if (txt == null) return;
    
    if (active) {
        if (txt.value == defaultMsg) txt.value = '';
    } else {
        if (txt.value == '') txt.value = defaultMsg;
    }
}

 
window.onload=function() { setMessage(document.getElementById('txtArea', false)); }


  function getOther(sel){
    if (sel.value=='Other')
    {
    
      $('#'+sel.id).parent().append('<div class="'+sel.id+'__old" <br><b>Other</b><input id="'+sel.id+'" name="'+sel.id+'">')
      sel.id = sel.id +'__old';
      console.log(sel.id)
     }
     else
     {
       

       $('.'+sel.id).hide();
        sel.id = sel.id.split('__')[0]
     }
 
}





 jQuery(document).ready(function(){
  jQuery(".chosen").chosen();
});





function genReport()
{
  final_array = []
  $.each($("#options_table input:checkbox:checked"),function(){
   console.log(this); 
   if (this.id.split('source').length<2) 
    {
      outer_class = $(this).attr('class');
      outer_index = outer_class.split('source')[1] -1
      inner_index = this.id
      final_array.push(table_data[outer_index][inner_index])
    } 
  })
  return final_array
}

function createOptionsTable(options)
{

$('#prog_table').html('')
  options_tables_string = '';
  
  n = 1;
  
  $.each(options,function(){

   if (n < 4) {

      that = this;
      var sourcename = "source"+n;
     
      options_tables_string += '<h1> Enrollment Option '+n+' </h1>'
      options_tables_string += '<table class="prog_table_'+n+'" id="prog_table" ><thead style="background-color: #6E6E6E; color: #ffffff;"><th>Select All<br/><input type="checkbox"  id="'+sourcename+'" name="'+sourcename+'"value="" onclick="toggle(this)";></th><th>Program Name</th><th>Aggregation</th><th>Max Event Duration</th><th>Average Event Duration year</th><th>Advanced Noticed</th><th>Average Number of Events/year</th><th>Annual Payment</th></thead>'
      row_num = 0
      $.each(this,function(){
        options_tables_string += sprintf('<tbody><tr id="row_'+row_num+'"><td><input type="checkbox" id="'+row_num+'" class="'+sourcename+'"  value="" onclick="change(this);"></td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr></tbody>',this.program_name,this.aggregation,this.maximum_event_duration,this.average_event_duration,this.time_to_respond,this.average_number_of_events,this.yearly_earnings)
        row_num++;
      });
      options_tables_string += '</table> '
      }
      n++
      });
    
  options_tables_string+= '<br><br><button type="button" id="genreport">Generate Full Report</button>'
     $('#options_table').html(options_tables_string);
	
     $('#genreport').click(function(){
    final_array = genReport()
    $.ajax({
    url: 'http://72.167.42.223:9999/generateReport',
    data: {data:JSON.stringify(final_array) },
    success: function(data) {
      window.location = data
    }
    });
    });

    }
   
	
    
function toggle(source) {

  checkboxes = document.getElementsByClassName(source.id);
  
  for(var i in checkboxes)
  {
  checkboxes[i].checked = source.checked;
 
}

    $('tbody :checkbox').change(function() {
        $(this).closest('tr').toggleClass('selected', this.checked);
	
    });
    $('thead :checkbox').change(function() {
	
        $('tbody :checkbox').trigger('change');
    });

}



function change(obj) {

var tr=obj.parentNode.parentNode; 
tr.style.backgroundColor=(obj.checked)? '#ACFAE9':'#ffffff ';
}



/*$("#type").click( function() {
    
    // Hide all the tab divs
    $(".generator").hide(); 
	 $(".location").hide(); 
	  $(".curtailment").hide(); 
} );
$("#curtailment").click( function() {
    
    // Hide all the tab divs
    $(".generator").hide(); 
	 $(".type").hide(); 
	  $(".location").hide(); 
} );*/

/*$("#location").click( function() {
     $(".location").show();
    // Hide all the tab divs
    $(".generator").hide(); 
	 $(".type").hide(); 
	  $(".curtailment").hide(); 
} );*/

/*$(".show_hide").click(function(){
      $(".show_hide").hide("fast");
      $(this).toggle("fast");
});*/


function makeUtilities(state,town) {

  $.ajax({
    url: 'getUtilityView',
    
    data: {state:state.value,town:town.value},
    success: function(data) 
    
    {
     
    
    $('#utility').html('')
    $('#other').html('')
    utilities = eval(data)
    
   
    $.each(utilities,function(){
      $('#utility').attr('name','utility')
      $('#utility').append(sprintf('<option value="%s">%s</option>',this.name,this.name))

    });
    
    
    $('#utility').append('<option value="other">Other (Utility name)</option>')
    if (utilities.length==0)
    {
      $('#other').html('<br/><br/><b>Other:</b><input id="utility" type="text" name="utility">')
    }
   
    
  },
  
  error:function (xhr, ajaxOptions, thrownError)
  {
               
                $('#other').html('<br/><br/><b>Other:</b><input id="utility" type="text" name="utility">')
                    }
                    
 
});

}

