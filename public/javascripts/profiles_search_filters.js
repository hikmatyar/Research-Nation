count = 0;
$('document').ready(function(){

// selecting the choices and storing them globally for select field function
   choices = new Array();
   $(".field input:checkbox:checked").each(function(){
			choices.push($(this).val());
		});

// Changes to the select field of anytype
   $('.field select').live("change" , function(){
      url = callback_url(choices);
      $.ajax({
        url: url,
        success: function(data){
          $("#left_content").html(data);
        }
      });
   });

// Changes to the checkboxes
   $(".field input:checkbox").change(function(){
     choices = new Array();
     $(".field input:checkbox:checked").each(function(){
       choices.push($(this).val());
     });

      url = callback_url(choices);
      $.ajax({
        url: url,
        success: function(data){
          $("#left_content").html(data);
        }
      });
	});

  var callback_url = function(choices){
    var call_to_url = "/profiles/search_results?country="+ $("#location_country").val() + "&company_type=" + $("#company_type").val();
    
    if(choices.length  > 0) {
      return (call_to_url +"&choices="+choices);
    }    
    return call_to_url;
  }

});
