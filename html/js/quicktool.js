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
    url:'http://127.0.0.1:9999/save',
    success:function(data){
      x = data
    }
  })
}