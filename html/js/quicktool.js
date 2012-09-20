$(function(){
 $('.consumption_period').hide();
 $('#meter_usage_data') .change(function(){
   
   $('.consumption_period').hide();
   $('#'+(this.value)).show();

 })

$('#submit').click(function(){
  save();
$('#options_table').html('<br/><br/><div id="progress"><img src="img/loading.gif" width="23px" height="23px">Loading...</div><br/><br/>')
   
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
  //alert('asd')
  data = {}
  $.each($('form :input'),function(key,val)
    {
      data[val.name] = validate(val)
    });
  $.ajax({
    data:data,
    url:'http://127.0.0.1:9999/save',
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

$('a#DR').click(function () {
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
alert("Please enter Frequency.");
form.frequency.focus();
return false;
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
        options_tables_string += sprintf('<tr id="row_'+row_num+'"><td><input type="checkbox" id="'+row_num+'" class="'+sourcename+'"  value="" onclick="change(this);"></td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>',this.program_name,this.aggregation,this.maximum_event_duration,this.average_event_duration,this.time_to_respond,this.average_number_of_events,this.yearly_earnings)
        row_num++;
      });
      options_tables_string += '</table>'
      }
      n++
      });
  
     $('#options_table').html(options_tables_string);
    }
	
    
function toggle(source) {

  checkboxes = document.getElementsByClassName(source.id);
  
  for(var i in checkboxes)
  {
  checkboxes[i].checked = source.checked;
 
}

}

function change(obj) {

var tr=obj.parentNode.parentNode; 
tr.style.backgroundColor=(obj.checked)? '#ACFAE9':'#ffffff ';
}





