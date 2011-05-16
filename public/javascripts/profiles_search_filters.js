count = 0;
jQuery('document').ready(function(){

// selecting the choices and storing them globally for select field function
   choices = new Array();
   jQuery(".field input:checkbox:checked").each(function(){
			choices.push(jQuery(this).val());
		});

// Changes to the select field of anytype
   jQuery('.field select').change(function(){
      url = callback_url(choices);
      jQuery.ajax({
        url: url,
        success: function(data){
          jQuery("#left_content").html(data);
        }
      });
   });

// Changes to the checkboxes
   jQuery(".field input:checkbox").change(function(){

     choices = new Array();
     jQuery(".field input:checkbox:checked").each(function(){
       choices.push(jQuery(this).val());
     });

      url = callback_url(choices);
      jQuery.ajax({
        url: url,
        success: function(data){
          jQuery("#left_content").html(data);
        }
      });
	});

  var callback_url = function(choices){
    var call_to_url = "/profiles/search_results?country="+ jQuery("#location_country").val()+"&profile_type= "+jQuery("#profile_type").val();
		if (choices.length  > 0) {
      return (call_to_url +"&choices="+choices);
    }
    return call_to_url;
  }

});
