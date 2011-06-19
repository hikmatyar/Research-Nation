$(document).ready(function(){

	if ($("#new_user")) {
    var email_label = "Your Email";
    var pass_label  = "Your Password";

	  $("#new_user").find(":input").focus(function(){
      $('label[for='+$(this).attr('id')+']').text("");

	  });

    $("#new_user").find(":input").blur(function(){
      if ($(this).val() == ""){
        if ($(this).attr('id') == "email"){
          $('label[for='+$(this).attr('id')+']').text(email_label);
        }
        else{
          $('label[for='+$(this).attr('id')+']').text(pass_label);
        }
        $('label[for='+$(this).attr('id')+']').css("padding","0px");
      }
	  });

    if ($("input:text").val() != "") {
      $('label[for='+ $("input:text").attr('id') +']').css("padding","8px");
      $('label[for='+ $("input:text").attr('id') +']').text("");
    }
    else{
      $('label[for='+ $("input:text").attr('id')+']').text(email_label);
      $('label[for='+ $("input:text").attr('id')+']').css("padding","0px");
    }

    if ($("input:password").val() != "") {
      $('label[for='+ $("input:password").attr('id') +']').css("padding","8px");
      $('label[for='+ $("input:password").attr('id') +']').text("");
    }
    else{
      $('label[for='+ $("input:password").attr('id') +']').text(pass_label);
      $('label[for='+ $("input:password").attr('id')+']').css("padding","0px");
    }

	  $("#new_user").submit(function(){
		  return validate_form();
	  });
	}

});

