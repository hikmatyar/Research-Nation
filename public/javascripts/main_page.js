$(document).ready(function(){

	if ($("#new_user")) {
    var prevValue = "";

	  $("#new_user").find(":input").focus(function(){
      prevValue = $('label[for='+$(this).attr('id')+']').text();

      $('label[for='+$(this).attr('id')+']').text("");
      $('label[for='+$(this).attr('id')+']').css("padding","8px");
	  });

    $("#new_user").find(":input").blur(function(){
      if ($(this).val() == ""){
        $('label[for='+$(this).attr('id')+']').css("padding","0px");
        $('label[for='+$(this).attr('id')+']').text(prevValue);
      }
	  });

	  $("#new_user").submit(function(){
		  return validate_form();
	  });
	}

});

