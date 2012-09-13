////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Finalize.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////


$('#finalize').click(function(){
  saveFacility()
  var state= document.getElementById("state").value
  var town= document.getElementById("town").value
  var kW_curtailment = document.getElementById('your_curtailment_capability_kw_curtailment').value
  var adv_notice = document.getElementById('your_curtailment_capability_response_time').value

   $('#options_table').html('<br/><br/><div id="progress"><img src="img/loading.gif">Loading...</div><br/><br/>')
   
   
$.ajax({
  url: 'getProgramsView',
  data: {state:state,town:town,kW_curtailment:kW_curtailment,adv_notice:adv_notice},
 
  success: function(data) {
  
  $('#options_table').html('')

  None = 'N/A'
  final_data = eval(data)
  createOptionsTable(final_data)
  },
  error: function(xhr, ajaxOptions, thrownError)
  {
  $('#options_table').html('<br/><br/><br/><br/><br/><div id="not_progress"><b>"Based on the information we have collected there are no applicable programs available for your facility!"</b></div><br/><br/><br/><br/><br/>')
  }
  
});

 
});


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// AJAX!!!
//
////////////////////////////////////////////////////////////////////////////////////////////////////////


function saveFacility()
{
    if (typeof(subregion) == 'undefined')
    {
      subregion = null
    }
$.ajax({
    url: 'saveFacility',
    
    data: {zipcode:$('#zip_code_input').val(),manage_facilties:$('#manage_facilties').val(),zip_loc:$('#location_name').val(), utility:$('#utility').val(), meter_resolution:$('#meter_resolution').val(), your_curtailment_capability_kw_curtailment_lighting_reduction:$('#your_curtailment_capability_kw_curtailment_lighting_reduction').val(),your_curtailment_capability_kw_curtailment_hvac_reduction:$('#your_curtailment_capability_kw_curtailment_hvac_reduction').val(),building_square_footage:$('#building_square_footage').val(),curtailment_load:$('#your_curtailment_capability_kw_curtailment').val(), facility_type:$('#facility_type').val(), annual_freq:$('#your_curtailment_capability_kw_curtailment_frequency').val(), notification_time:$('#your_curtailment_capability_response_time').val(), max_event_duration:$('#your_curtailment_capability_kw_curtailment_duration').val(), risk_penalty:$('#program_parameters_regular_payments').val(), risk_disqualification:$('#program_parameters_disqualification').val()},


    data: {zipcode:$('#zip_code_input').val(),subregion:subregion,zip_loc:$('#location_name').val(), curtailment_load:$('#your_curtailment_capability_kw_curtailment').val(), facility_type:$('#facility_type').val(), annual_freq:$('#your_curtailment_capability_kw_curtailment_frequency').val(), notification_time:$('#your_curtailment_capability_response_time').val(), max_event_duration:$('#your_curtailment_capability_kw_curtailment_frequency').val(), risk_penalty:$('#program_parameters_regular_payments').val(), risk_disqualification:$('#program_parameters_disqualification').val()},
    success: function(data) 
    {
   
    
  },
  
});
}
 
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

 function getOther1(sel){
    if (sel.value=='other')
    {
    
	    $('#other').html('<div class="'+sel.id+'_old" <br><br/><b>Other:</b><input id="'+sel.id+'" name="'+sel.id+'">')
      sel.id = sel.id +'_old';
      
      console.log(sel.id)
     }
     else
     {
       

       $('.'+sel.id).hide();
        sel.id = sel.id.split('_')[0]
     }
 
}

 /* function getOther1(sel){
    if (sel.value=='other')
    {
    
	    $('#'+sel.id).parent().append('<div class="'+sel.id+'__old" <br><b>other</b><input id="'+sel.id+'" name="'+sel.id+'">')
      sel.id = sel.id +'__old';
      console.log(sel.id)
     }
     else
     {
       

       $('.'+sel.id).hide();
        sel.id = sel.id.split('__')[0]
     }
 
}*/



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Utility functions.
//
// This function is taken from:
//   http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
////////////////////////////////////////////////////////////////////////////////////////////////////////


var geocoder;
    var map;
    var poly;
    var latitude = 40.729448;
    var longitude = -73.993671;
    var latlong;
    var bounds;

      function initialize() {

      geocoder = new google.maps.Geocoder();
    var latlong = new google.maps.LatLng(latitude,longitude);
        var myOptions = {
          center: latlong,
          zoom: 20,
          mapTypeId: google.maps.MapTypeId.SATELLITE,
          mapTypeControl: false,
          streetViewControl: false
        };
    map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
      }
    function codeAddress() {
      var address = document.getElementById("zip_code_input").value;
       var state= document.getElementById("state")
       var town= document.getElementById("town")
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          final = results
          map.setCenter(results[0].geometry.location);
      len = results[0].address_components.length
      latlong = results[0].geometry.location;
      state.value = results[0].address_components[len-2].short_name
      town.value = results[0].address_components[len-3].short_name
      
       makeUtilities(state,town)
       
      $.ajax({
      
  url: 'getZoneView',
  data: {state:state.value,town:town.value},
  success: function(data) {
  
  $('#zone').html(data)
  zone = data
  }
});
      $.ajax({
      
  url: 'getSubRegionView',
  data: {state:state.value,town:town.value},
  success: function(data) {
  

  subregion = data
  }
});
 






      
        } else {
          
        }
      }); 
    }
initialize()

       function zip() {
        
        }


function uniqueID() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var isNumberMoreThan = function(source, comparedNumber) {
  return isNumber(source) && parseInt(source) > parseInt(comparedNumber);
}

var transformToDictionay = function($inputs) {
  var values = {};
  $inputs.each(function() {
      values[this.id] = $(this).val();
  });
  return values;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Validation functions.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////

var validateZipCode = function(zipCode) {
  var zipCodeRegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
  return zipCodeRegex.test(zipCode);
}

var validateFacilityType = function(facilityType) {
  return true;
  //return !(facilityType === null || facilityType === "" || facilityType === undefined);
}

var validateUploadMeterDataFile = function(uploadMeterDataFile) {
  return !(uploadMeterDataFile === null || uploadMeterDataFile === "" || uploadMeterDataFile === undefined);
}

var validateUploadMeterDataInputs = function($uploadMeterDataInputs) {
  var result = true;
  var values = transformToDictionay($uploadMeterDataInputs);
  for(var index in values) {
    if (!isNumberMoreThan(values[index], 0)) {
      result = false;
    }
  }
  return result;
}

var validateKwCurtailmentResponseTime = function(responseTime) {
  return true;
  //return isNumberMoreThan(responseTime, 0);
}

var validateKwCurtailment = function(curtailment) {
  return true;
  //return isNumberMoreThan(curtailment, 0);
}

var validateKwCurtailmentRange = function(curtailmentRange) {
  return true;
  //return isNumberMoreThan(curtailmentRange, 0);
}

var validateKwCurtailmentDuration = function(curtailmentDuration) {
  return true;
  //return isNumberMoreThan(curtailmentDuration, 0);
}

var validateKwCurtailmentFrequency = function(curtailmentFrequency) {
  return true;
  //return isNumberMoreThan(curtailmentFrequency, 0);
}

var validateKwCurtailmentLightingReduction = function(curtailmentLightReduction) {
  return true;
  //return isNumberMoreThan(curtailmentLightReduction, 0);
}

var validateKwCurtailmentHvacReduction = function(curtailmentHvacReduction) {
  return true;
  //return isNumberMoreThan(curtailmentHvacReduction, 0);
}

var validateKwCurtailmentBmsModel = function(curtailmentBmsModel) {
  return true;
}
/*
$.tools.validator.fn(
    "[type=zipCode]",
    "Value must be Zipcode i.e. 10001",
    function(el, v) {
        return  validateZipCode(v);
    }
);
*/
$(window).load(function() {
  var $documentBody                                           = $("body");
  var zipCodeIndex                                            = 0, facilityTypeIndex = 1; 
  var uploadMeterDataIndex                                    = 2, yourCurtialmentCapabilityIndex = 3, generationCapability = 4, IndexprogramParticipationParametersIndex =5; DROpportunity =6;
                                                                
  var $state                                                  = $("input#state");
  var $zipCodeInput                                           = $("input#zip_code_input");
  var $zipCodeLeftPane                                        = $("a#zip_code_left_pane");
  var $facilityTypeInput                                      = $("form input[name='facility_type']");
  var $facilityTypeLeftPane                                   = $("a#type_of_facility_left_pane");
  var $uploadMeterDataFileInput                               = $("input#upload_meter_data_file_input");
  var $uploadMeterDataMonthlyInputs                           = $("div#upload_meter_consumption_data_table_by_month :input");
  var $uploadMeterDataYearlyInputs                            = $("div#upload_meter_consumption_data_table_by_year :input");
  var $uploadMeterDataLeftPane                                = $("a#upload_meter_data_left_pane");
  var $uploadMeterShowForm                                    = $("input#upload_meter_show_form");
  var $uploadMeterDataTable                                   = $("div#upload_meter_consumption_data_table");
  var $uploadMeterDataConsumptionPeriodInput                  = $("input[name=upload_meter_consumption_data_period]");
  var $uploadMeterDataConsumptionPeriodRadio                  = $("input[value=monthly]");
  var $uploadMeterConsumptionDataTableByMonthDiv              = $("div#upload_meter_consumption_data_table_by_month");
  var $uploadMeterConsumptionDataMonthlyInput                 = $("input[name=upload_meter_consumption_data_monthly]");
  var $uploadMeterConsumptionDataMonthlyPeakInput             = $("input[name=upload_meter_consumption_data_monthly_peak]");
  var $uploadMeterConsumptionDataTableBySeasonDiv             = $("div#upload_meter_consumption_data_table_by_season");
  var $uploadMeterConsumptionDataTableByYearDiv               = $("div#upload_meter_consumption_data_table_by_year");
  var $uploadMeterConsumptionDataYearlyInput                  = $("input[name=upload_meter_consumption_data_yearly]");
  var $uploadMeterConsumptionDataYearlyPeakInput              = $("input[name=upload_meter_consumption_data_yearly_peak]");
  var isUploadMeterDataFilled                                 = false;
  var isUploadMeterDataFilePresent                            = false;
  var $kwCurtailmentLeftPane                                  = $("a#your_curtailment_capability_left_pane");
  var $kwCurtailmentResponseTimeSelect                        = $("select#your_curtailment_capability_response_time");
  var $kwCurtailmentInput                                     = $("input#your_curtailment_capability_kw_curtailment");
  var $kwCurtailmentRangeInput                                = $("input#your_curtailment_capability_kw_curtailment_range");
  var $lightingkwCurtailmentRangeInput                        = $("input#your_curtailment_capability_kw_curtailment_lighting_reduction_range")
  var $hvackwCurtailmentRangeInput                            = $("input#your_curtailment_capability_kw_curtailment_hvac_reduction_range")
  var $kwCurtailmentBmsModelInput                             = $("input#your_curtailment_capability_kw_curtailment_bms_model");
  var $generationCapabilityInput                              =$("input#generator");
  
   var $generationCapability                                    =$("generation_capability_left_pane");
   
   
  var $CurtailmentStrategiesLeftPane                          = $("a#your_curtailment_strategies_left_pane");
  var $CurtailmentStrategiesEquipmentShed                     = $("div#equipment_shed_capabilities");
  var $kwCurtailmentLightingReductionInput                    = $("input#your_curtailment_capability_kw_curtailment_lighting_reduction");
  var $kwCurtailmentHvacReductionInput                        = $("input#your_curtailment_capability_kw_curtailment_hvac_reduction");
  var $kwCurtailmentDurationSelect                            = $("select#your_curtailment_capability_kw_curtailment_duration");
  var $kwCurtailmentFrequencySelect                           = $("select#your_curtailment_capability_kw_curtailment_frequency");
  var $kwCurtailmentBmsInstalledCheckBox                      = $("input#your_curtailment_capability_kw_curtailment_bms_installed");

 
  
  var $participationParametersLeftPane                        = $("a#program_participation_parameters_left_pane");
  var $participationParametersPaymentsInput                   = $("input[name=program_parameters_regular_payments]");
  var $participationParametersRevenueInput                    = $("input[name=program_parameters_higher_revenue]");
  var $participationParametersDisqualificationInput           = $("input[name=program_parameters_disqualification]");
  var $wizard                                                 = $("div#wizard_tabs");
  var $reportGenerationForm                                   = $("form#report_generation_form");
  
  
  var $DRopportunity                                           =$("DR_opportunities_left_pane");
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Reset the values in the form
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*
  $zipCodeInput.val("");
  $facilityTypeInput.attr("checked", false);
  $uploadMeterDataConsumptionPeriodRadio.attr("checked", true);
  $uploadMeterConsumptionDataMonthlyInput.val("kWh");
  $uploadMeterConsumptionDataMonthlyPeakInput.val("peak kW"); 
  $uploadMeterConsumptionDataYearlyInput.val("kWh");
  $uploadMeterConsumptionDataYearlyPeakInput.val("peak kW"); 
  $kwCurtailmentInput.val("");
  */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Enable and expose the wizard.
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  $wizard.click(function() {
    $(this).load();
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Enable and validate tabs that are contained within the wizard.
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

 $("ul.tabs", $wizard).tabs("div.panes > div", function(event, index) {
      //At each return false (not validated), we need to show the error messages.
    /*  if (index > zipCodeIndex && !validateZipCode($zipCodeInput.val()))  {
        $zipCodeInput.parent().addClass("error");
 alert('Enter Zip Code')
        // when false is returned, the user cannot advance to the next tab
        return false;
      }*/
      
      if (index > facilityTypeIndex && !validateFacilityType($facilityTypeInput.filter(":checked").val()))  {
        return false;
      }

      if (index > uploadMeterDataIndex) {
        if (isUploadMeterDataFilled) {
          if (!validateUploadMeterDataInputs($uploadMeterDataMonthlyInputs) && 
              !validateUploadMeterDataInputs($uploadMeterDataYearlyInputs)  && 
              !isUploadMeterDataFilePresent) {
              isUploadMeterDataFilled = false;
              $uploadMeterDataLeftPane.attr("style", "display:none;");
              $uploadMeterDataLeftPane.text("");
              return false;
          } else {
              isUploadMeterDataFilled = true;
              $uploadMeterDataLeftPane.attr("style", "display:block;");
              $uploadMeterDataLeftPane.text("Upload Meter Data Filled");
          }
        } else {
          $uploadMeterDataLeftPane.attr("style", "display:block;");
          $uploadMeterDataLeftPane.text("Upload Meter Data Not Filled");
        }
      }

      if (index > yourCurtialmentCapabilityIndex && !isUploadMeterDataFilled)  {
            if  (!validateKwCurtailmentResponseTime($kwCurtailmentResponseTimeSelect.val())           ||
                  !validateKwCurtailment($kwCurtailmentInput.val())                                   ||
                  !validateKwCurtailmentRange(kwCurtailmentRange)                                     ||                      
                  !validateKwCurtailmentDuration($kwCurtailmentDurationSelect.val())                  ||                   
                  !validateKwCurtailmentFrequency($kwCurtailmentFrequencySelect.val())                ||
                  !validateKwCurtailmentLightingReduction($kwCurtailmentLightingReductionInput.val()) ||
                  !validateKwCurtailmentHvacReduction($kwCurtailmentHvacReductionInput.val())         ||
                  !validateKwCurtailmentBmsModel($kwCurtailmentBmsModelInput.val())) {
                  $kwCurtailmentLeftPane.attr("style", "display:none;");
                  $kwCurtailmentLeftPane.text("");
                  $participationParametersLeftPane.attr("style", "display:none;");
                  $participationParametersLeftPane.text("");
                  return false
            } else {
                  $kwCurtailmentLeftPane.attr("style", "display:block;");
                  $kwCurtailmentLeftPane.text("Your Curtailment Data");
                  $participationParametersLeftPane.attr("style", "display:block;");
                  $participationParametersLeftPane.text("Program Participation Parameters");
            }
      } else if (index > yourCurtialmentCapabilityIndex && isUploadMeterDataFilled) {
            $kwCurtailmentLeftPane.attr("style", "display:block;");
            $kwCurtailmentLeftPane.text("Your Curtailment Data");
            $participationParametersLeftPane.attr("style", "display:block;");
            $participationParametersLeftPane.text("Program Participation Parameters");
      }

      // everything is ok. remove possible red highlight from the terms
	  
	  
      //$zipCodeInput.parent().removeClass("error");

  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Handle on the tabs API.
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  var $api                    = $("ul.tabs", $wizard).data("tabs");
   var $api2                    = $("ul.tabs", $wizard).data("gentabs"); 
  /*$api.onClick(function(index) {
  
  $('#wizard_tabs').slideUp(1000);
  console.log($api.getIndex());
  
  
  });*/
  



  // "next tab" button
  $("button.next", $wizard).click(function(event) {
  
      $api.next();
      event.preventDefault();
  });

  // "previous tab" button
  $("button.prev", $wizard).click(function(event) {
      $api.prev();
      event.preventDefault();
	  
  });
  
  $("#zip_code_input").keyup(function(event){
    if(event.keyCode == 13){
	$api.next();
       // $(".next").click();
    }
});

  $(document).ready(function() {
            document.onkeydown = function() 
                {
                    var j = event.keyIdentifier
					
                    if (j == "Right")
				   
                        $api.next();
						
						
                    else if (j == "Left")
                        $api.prev();    
						
                        }
                   });
				   
		   
				   
$('.next').click(function(){
    window.scrollTo(0, 0);
    $('html').animate({scrollTop:0}, 'slow');//IE, FF
    $('body').animate({scrollTop:0}, 'slow');
    return false;
    });



  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // ReactiveJS on the elements within form.  The final Report Generation Form will be appended with
  // hidden input elements that represent the valid inputs from within the wizard. 
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  
  
  
  

  var $zipCodeInputRx         = $zipCodeInput
                                  .toObservable("change")
                                  .Select(function (event) {
                                      return $(event.target).val();
                                  })
                                  .Where(function (text) {
                                      //validate the zipcode here.
                                      if (validateZipCode(text)) {
                                        $zipCodeLeftPane.attr("style", "display:block;");
                                        //$zipCodeLeftPane.text("Zip Code " + text);
                                        var $input = $zipCodeInput.clone(true);
                                        $input.attr("type", "hidden");
                                        $input.attr("id", "form_zip_code_input");
                                        $reportGenerationForm.append($input);
                                        codeAFddress();
                                    
                                        var $state_input = $state.clone(true);
                                        $input.attr("type", "hidden");
                                        $input.attr("id", "state");
                                        $reportGenerationForm.append($state_input);
                                
                                        return text;
                                      } else {
                                        $zipCodeLeftPane.attr("style", "display:none;");
                                        $zipCodeLeftPane.text("");
                                        $reportGenerationForm.find("input#form_zip_code_input").remove();
                                      }
                                  })
                                  .Subscribe(function (data) {});

  var $facilityTypeInputRx    = $facilityTypeInput
                                  .toObservable("click")
                                  .Select(function (event) {
                                      return $(event.target).val();
                                  })
                                  .Where(function (text) {
                                      if (validateFacilityType(text)) {
                                        $facilityTypeLeftPane.attr("style", "display:block;");
                                        $facilityTypeLeftPane.text("Facility Type " + text);
                                        $reportGenerationForm.find("input[name='facility_type']").remove();
                                        var $input = $facilityTypeInput.filter(":checked").clone(true);
                                        $input.attr("type", "hidden");
                                        $input.attr("id", "form_facility_type_input");
                                        $reportGenerationForm.append($input);
                                        return text;
                                      } else {
                                        $facilityTypeLeftPane.attr("style", "display:none;");
                                        $facilityTypeLeftPane.text("");
                                      }
                                  })
                                  .Subscribe(function (data) {});

  // var $uploadMeterDataFileInputRx = $uploadMeterDataFileInput
  //                                     .toObservable("change")
  //                                     .Select(function (event) {
  //                                       return $(event.target).val();
  //                                     })
  //                                     .Where(function (text) {
  //                                       if (validateUploadMeterDataFile(text)) {
  //                                         return text;
  //                                       } else {
  //                                         $uploadMeterDataLeftPane.attr("style", "display:none;");
  //                                         $uploadMeterDataLeftPane.text("");
  //                                         $reportGenerationForm.find("input#upload_meter_data_file_input").remove();
  //                                       }
  //                                     })
  //                                     .Subscribe(function (data) {
  //                                        $uploadMeterDataLeftPane.attr("style", "display:block;");
  //                                        $uploadMeterDataLeftPane.text("Uploaded File " + data);
  //                                        var $input = $uploadMeterDataFileInput.clone(true);
  //                                        $input.insertAfter($uploadMeterDataFileInput);
  //                                        $uploadMeterDataFileInput.hide();
  //                                        $reportGenerationForm.find("input#upload_meter_data_file_input").remove();
  //                                        $reportGenerationForm.append($uploadMeterDataFileInput);
  //                                     });

  var $uploadMeterDataConsumptionPeriodInputRx = $uploadMeterDataConsumptionPeriodInput
                                                    .toObservable("click")
                                                    .Select(function (event) {
                                                        return $(event.target).val();
                                                    })
                                                    .Subscribe(function (data) {
                                                         if (data === "yearly") {
                                                            $uploadMeterConsumptionDataTableByMonthDiv.slideUp();
                                                            $uploadMeterConsumptionDataTableBySeasonDiv.slideUp();
                                                            $uploadMeterConsumptionDataTableByYearDiv.slideDown();
                                                         } else if(data ==="seasonly") {
                                                            $uploadMeterConsumptionDataTableByMonthDiv.slideDown();
                                                            $uploadMeterConsumptionDataTableBySeasonDiv.slideUp();
                                                            $uploadMeterConsumptionDataTableByYearDiv.slideDown();
                                                         }
                                                         else
                                                         {
                                                            $uploadMeterConsumptionDataTableByMonthDiv.slideUp();
                                                            $uploadMeterConsumptionDataTableBySeasonDiv.slideDown();
                                                            $uploadMeterConsumptionDataTableByYearDiv.slideDown();
                                                         }
                                                    });

  var $uploadMeterConsumptionDataMonthlyInputRx = $uploadMeterConsumptionDataMonthlyInput
                                                    .toObservable("blur")
                                                    .Select(function (event) {
                                                        return event;
                                                    })
                                                    .Where(function(event) {
                                                        var text = $(event.target).val();
                                                        if (isNumberMoreThan(text, 0)) {
                                                            isUploadMeterDataFilled = true;
                                                            var $input = $(event.target).clone(true);
                                                            $input.attr("type", "hidden");
                                                            $input.attr("id", "form_" + $(event.target).attr("id"));
                                                            $reportGenerationForm.append($input);
                                                          return text;
                                                        } else {
                                                          if ((validateUploadMeterDataInputs($uploadMeterConsumptionDataMonthlyInput)     &&
                                                              validateUploadMeterDataInputs($uploadMeterConsumptionDataMonthlyPeakInput)) ||
                                                              (validateUploadMeterDataInputs($uploadMeterConsumptionDataYearlyInput)      &&
                                                              validateUploadMeterDataInputs($uploadMeterConsumptionDataYearlyPeakInput))) {
                                                              isUploadMeterDataFilled = true;
                                                          } else {
                                                              isUploadMeterDataFilled = false;
                                                          }
                                                          $reportGenerationForm.find("input#form_" + $(event.target).attr("id")).remove();
                                                          $(event.target).val("kWh");
                                                        }
                                                    }).Subscribe(function (data) {}); 

  var $uploadMeterConsumptionDataMonthlyPeakInputRx = $uploadMeterConsumptionDataMonthlyPeakInput
                                                        .toObservable("blur")
                                                        .Select(function (event) {
                                                            return event;
                                                        })
                                                        .Where(function(event) {
                                                            var text = $(event.target).val();
                                                            if (isNumberMoreThan(text, 0)) {
                                                              isUploadMeterDataFilled = true;
                                                              var $input = $(event.target).clone(true);
                                                              $input.attr("type", "hidden");
                                                              $input.attr("id", "form_" + $(event.target).attr("id"));
                                                              $reportGenerationForm.append($input);
                                                              return text;
                                                            } else {
                                                              if ((validateUploadMeterDataInputs($uploadMeterConsumptionDataMonthlyInput)     &&
                                                                  validateUploadMeterDataInputs($uploadMeterConsumptionDataMonthlyPeakInput)) ||
                                                                  (validateUploadMeterDataInputs($uploadMeterConsumptionDataYearlyInput)      &&
                                                                  validateUploadMeterDataInputs($uploadMeterConsumptionDataYearlyPeakInput))) {
                                                                  isUploadMeterDataFilled = true;
                                                              } else {
                                                                  isUploadMeterDataFilled = false;
                                                              }
                                                              $reportGenerationForm.find("input#form_" + $(event.target).attr("id")).remove();
                                                              $(event.target).val("peak kW");
                                                            }
                                                        }).Subscribe(function (data) {});


  var $uploadMeterConsumptionDataYearlyInputRx = $uploadMeterConsumptionDataYearlyInput
                                                    .toObservable("blur")
                                                    .Select(function (event) {
                                                        return event;
                                                    })
                                                    .Where(function(event) {
                                                        var text = $(event.target).val();
                                                        if (isNumberMoreThan(text, 0)) {
                                                          isUploadMeterDataFilled = true;
                                                          var $input = $(event.target).clone(true);
                                                          $input.attr("type", "hidden");
                                                          $input.attr("id", "form_" + $(event.target).attr("id"));
                                                          $reportGenerationForm.append($input);
                                                          return text;
                                                        } else {
                                                          if ((validateUploadMeterDataInputs($uploadMeterConsumptionDataMonthlyInput)     &&
                                                              validateUploadMeterDataInputs($uploadMeterConsumptionDataMonthlyPeakInput)) ||
                                                              (validateUploadMeterDataInputs($uploadMeterConsumptionDataYearlyInput)      &&
                                                              validateUploadMeterDataInputs($uploadMeterConsumptionDataYearlyPeakInput))) {
                                                              isUploadMeterDataFilled = true;
                                                          } else {
                                                              isUploadMeterDataFilled = false;
                                                          }
                                                          $reportGenerationForm.find("input#form_" + $(event.target).attr("id")).remove();
                                                          $(event.target).val("kWh");
                                                        }
                                                    }).Subscribe(function (data) {});

  var $uploadMeterConsumptionDataYearlyPeakInputRx = $uploadMeterConsumptionDataYearlyPeakInput
                                                        .toObservable("blur")
                                                        .Select(function (event) {
                                                            return event;
                                                        })
                                                        .Where(function(event) {
                                                            var text = $(event.target).val();
                                                            if (isNumberMoreThan(text, 0)) {
                                                              isUploadMeterDataFilled = true;
                                                              var $input = $(event.target).clone(true);
                                                              $input.attr("type", "hidden");
                                                              $input.attr("id", "form_" + $(event.target).attr("id"));
                                                              $reportGenerationForm.append($input);
                                                              return text;
                                                            } else {
                                                              if ((validateUploadMeterDataInputs($uploadMeterConsumptionDataMonthlyInput)     &&
                                                                  validateUploadMeterDataInputs($uploadMeterConsumptionDataMonthlyPeakInput)) ||
                                                                  (validateUploadMeterDataInputs($uploadMeterConsumptionDataYearlyInput)      &&
                                                                  validateUploadMeterDataInputs($uploadMeterConsumptionDataYearlyPeakInput))) {
                                                                  isUploadMeterDataFilled = true;
                                                              } else {
                                                                  isUploadMeterDataFilled = false;
                                                              }
                                                              $reportGenerationForm.find("input#form_" + $(event.target).attr("id")).remove();
                                                              $(event.target).val("peak kW");
                                                            }
                                                        }).Subscribe(function (data) {});
  var uploader = new qq.FileUploader({
                  element: document.getElementById('upload_meter_data_file_input'),
                  action: 'ajaxUpload',
                  debug: true,
                  button: null,
                  multiple: false,
                  maxConnections: 1,
                  // validation        
                  allowedExtensions: [],               
                  sizeLimit: 0,   
                  minSizeLimit: 0,                             
                  // events
                  // return false to cancel submit
                  onSubmit: function(id, fileName){},
                  onProgress: function(id, fileName, loaded, total){
                    console.log("total upload " + total);
                  },
                  onComplete: function(id, fileName, responseJSON){
                    //We set the upload file flag to true.
                    isUploadMeterDataFilled       = true;
                    isUploadMeterDataFilePresent  = true;
                  },
                  onCancel: function(id, fileName){}
              }); 

$(".show_button").click(function()
  {
    that = this
    
    $('.consumption_period').slideUp("slow")
      $('#upload_meter_consumption_data_table_by_' + that.id).slideDown("slow")

  }
  );

  /*$("#upload_meter_show_form").click(function(){
  
   $(".hide").slideToggle("slow");*/
   
  $documentBody.off("click", "input#upload_meter_show_form").on("click", "input#upload_meter_show_form", function(event) {
  
  $('#manual_data').css('overflow','visible');
      if ($uploadMeterShowForm.val() === "Show Form") {
          $uploadMeterShowForm.val("Hide Form");
      } else {
          $uploadMeterShowForm.val("Show Form");
      }
      $uploadMeterDataTable.slideToggle(1000);
      event.preventDefault();
  });

  var $kwCurtailmentResponseTimeSelectRx = $kwCurtailmentResponseTimeSelect
                                              .toObservable("change")
                                              .Select(function (event) {
                                                  return $(event.target).val();
                                              })
                                              .Where(function (text) {
                                                  $reportGenerationForm.find("input#form_" + $kwCurtailmentResponseTimeSelect.attr("id")).remove();
                                                  if (validateKwCurtailmentResponseTime(text)) {
                                                    $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentResponseTimeSelect.attr("name") + "' value='" + text + "' id='form_" + $kwCurtailmentResponseTimeSelect.attr("id") + "'>");
                                                    return text;
                                                  }
                                              })
                                              .Subscribe(function (data) {});

  var $kwCurtailmentInputRx   = $kwCurtailmentInput
                                  .toObservable("blur")
                                  .Select(function (event) {
                                      return $(event.target).val();
                                  })
                                  .Where(function (text) {
                                      $reportGenerationForm.find("input#form_" + $kwCurtailmentInput.attr("id")).remove();
                                      if (validateKwCurtailment(text)) {
                                        $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentInput.attr("name") + "' value='" + text + "' id='form_" + $kwCurtailmentInput.attr("id") + "'>");
                                        return text;
                                      }
                                  })
                                  .Subscribe(function (data) {});

  var $inputRange = $kwCurtailmentRangeInput.rangeinput();
  var $lightingInputRange = $lightingkwCurtailmentRangeInput.rangeinput();
  var $hvacInputRange = $hvackwCurtailmentRangeInput.rangeinput();
  var kwCurtailmentRange  = 0;
  $inputRange.change(function(event, value) {
      kwCurtailmentRange = value;
      $("#your_curtailment_capability_kw_curtailment").val(value);
      //x = ajaxRequest("request.model.estimateEarningsPerKW()")
      //y = x * value
      //$('#estimated_earnings').html(y)
      $reportGenerationForm.find("input#form_" + $kwCurtailmentRangeInput.attr("id")).remove();
      if (validateKwCurtailmentRange(kwCurtailmentRange)) {
        $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentRangeInput.attr("name") + "' value='" + kwCurtailmentRange + "' id='form_" + $kwCurtailmentRangeInput.attr("id") + "'>");
      }
  })

  $lightingInputRange.change(function(event, value) {
      kwCurtailmentRange = value;
      $("#your_curtailment_capability_kw_curtailment_lighting_reduction").val(value);
      $reportGenerationForm.find("input#form_" + $kwCurtailmentRangeInput.attr("id")).remove();
      if (validateKwCurtailmentRange(kwCurtailmentRange)) {
        $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentRangeInput.attr("name") + "' value='" + kwCurtailmentRange + "' id='form_" + $kwCurtailmentRangeInput.attr("id") + "'>");
      }
  })

  $hvacInputRange.change(function(event, value) {
      kwCurtailmentRange = value;
      $("#your_curtailment_capability_kw_curtailment_hvac_reduction").val(value);
      $reportGenerationForm.find("input#form_" + $kwCurtailmentRangeInput.attr("id")).remove();
      if (validateKwCurtailmentRange(kwCurtailmentRange)) {
        $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentRangeInput.attr("name") + "' value='" + kwCurtailmentRange + "' id='form_" + $kwCurtailmentRangeInput.attr("id") + "'>");
      }
  })

  var $kwCurtailmentDurationSelectRx   = $kwCurtailmentDurationSelect
                                            .toObservable("change")
                                            .Select(function (event) {
                                                return $(event.target).val();
                                            })
                                            .Where(function (text) {
                                                $reportGenerationForm.find("input#form_" + $kwCurtailmentDurationSelect.attr("id")).remove();
                                                if (validateKwCurtailment(text)) {
                                                  $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentDurationSelect.attr("name") + "' value='" + text + "' id='form_" + $kwCurtailmentDurationSelect.attr("id") + "'>");
                                                  return text;
                                                }
                                            })
                                            .Subscribe(function (data) {});

  var $kwCurtailmentFrequencySelectRx   = $kwCurtailmentFrequencySelect
                                            .toObservable("change")
                                            .Select(function (event) {
                                                return $(event.target).val();
                                            })
                                            .Where(function (text) {
                                                $reportGenerationForm.find("input#form_" + $kwCurtailmentFrequencySelect.attr("id")).remove();
                                                if (validateKwCurtailmentFrequency(text)) {
                                                  $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentFrequencySelect.attr("name") + "' value='" + text + "' id='form_" + $kwCurtailmentFrequencySelect.attr("id") + "'>");
                                                  return text;
                                                }
                                            })
                                            .Subscribe(function (data) {});

  var $kwCurtailmentLightingReductionInputRx = $kwCurtailmentLightingReductionInput
                                                .toObservable("change")
                                                .Select(function (event) {
                                                    return $(event.target).val();
                                                })
                                                .Where(function (text) {
                                                    $reportGenerationForm.find("input#form_" + $kwCurtailmentLightingReductionInput.attr("id")).remove();
                                                    if (validateKwCurtailmentLightingReduction(text)) {
                                                      $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentLightingReductionInput.attr("name") + "' value='" + text + "' id='form_" + $kwCurtailmentLightingReductionInput.attr("id") + "'>");
                                                      return text;
                                                    }
                                                })
                                                .Subscribe(function (data) {});

  var $kwCurtailmentHvacReductionInputRx = $kwCurtailmentHvacReductionInput
                                              .toObservable("change")
                                              .Select(function (event) {
                                                  return $(event.target).val();
                                              })
                                              .Where(function (text) {
                                                  $reportGenerationForm.find("input#form_" + $kwCurtailmentHvacReductionInput.attr("id")).remove();
                                                  if (validateKwCurtailmentHvacReduction(text)) {
                                                    $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentHvacReductionInput.attr("name") + "' value='" + text + "' id='form_" + $kwCurtailmentHvacReductionInput.attr("id") + "'>");
                                                    return text;
                                                  }
                                              })
                                              .Subscribe(function (data) {});
  //TODO: if the checkbox is not checked, nothing is pushed into the final submitted form.
  //The server code has to deal with that situation.   
  $documentBody.off("click", "input#your_curtailment_capability_kw_curtailment_bms_installed").on("click", "input#your_curtailment_capability_kw_curtailment_bms_installed", function(event) {
      $reportGenerationForm.find("input#form_" + $(this).attr("id")).remove();
      if ($(this).is(":checked")) {
        $reportGenerationForm.append("<input type='hidden' name='" + $(this).attr("name") + "' value='true' id='form_" + $(this).attr("id") + "'>");
      } else {
        $reportGenerationForm.append("<input type='hidden' name='" + $(this).attr("name") + "' value='false' id='form_" + $(this).attr("id") + "'>");
      }
  });  

  
 
  
  
  
  var $kwCurtailmentBmsModelInputRx = $kwCurtailmentBmsModelInput
                                        .toObservable("change")
                                        .Select(function (event) {
                                            return $(event.target).val();
                                        })
                                        .Where(function (text) {
                                            $reportGenerationForm.find("input#form_" + $kwCurtailmentBmsModelInput.attr("id")).remove();
                                            if (validateKwCurtailmentBmsModel(text)) {
                                              $reportGenerationForm.append("<input type='hidden' name='" + $kwCurtailmentBmsModelInput.attr("name") + "' value='" + text + "' id='form_" + $kwCurtailmentBmsModelInput.attr("id") + "'>");
                                              return text;
                                            }
                                        })
                                        .Subscribe(function (data) {});
										
										
										
		$(document).ready(function(){

		//Hide div w/id generation_options
	   $("#generation_options").css("display","none");

		// Add onclick handler to checkbox with id generator
	   $("#generator").click(function(){

		// If checked
		if ($("#generator").is(":checked"))
		{
			//show the hidden div
			$("#generation_options").slideDown(1000);
		}
		else
		{
			//otherwise, hide it
			$("#generation_options").slideUp(1000);
		}
	  });

	});								
	
  

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // The behaviors needed for the form and wizard. i.e. left pane links navigator.
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  $documentBody.off("click", "a#zip_code_left_pane").on("click", "a#zip_code_left_pane", function(event) {
      $api.click(zipCodeIndex);
      event.preventDefault();
  });

  $documentBody.off("click", "a#type_of_facility_left_pane").on("click", "a#type_of_facility_left_pane", function(event) {
      $api.click(facilityTypeIndex);
      event.preventDefault();
  });

  $documentBody.off("click", "a#upload_meter_data_left_pane").on("click", "a#upload_meter_data_left_pane", function(event) {
      $api.click(uploadMeterDataIndex);
      event.preventDefault();
  });

  $documentBody.off("click", "a#your_curtailment_capability_left_pane").on("click", "a#your_curtailment_capability_left_pane", function(event) {
      $api.click(yourCurtialmentCapabilityIndex);
      event.preventDefault();
  });
  
   $documentBody.off("click", "a#generation_capability_left_pane").on("click", "a#generation_capability_left_pane", function(event) {
      $api.click(generationCapability);
      event.preventDefault();
  });

  $documentBody.off("click", "a#program_participation_parameters_left_pane").on("click", "a#program_participation_parameters_left_pane", function(event) {
      $api.click(programParticipationParametersIndex);
      event.preventDefault();
  });

   $documentBody.off("click", "a#DR_opportunities_left_pane").on("click", "a#DR_opportunities_left_pane", function(event) {
      $api.click(DROpportunity);
      event.preventDefault();
  });
  
  
});