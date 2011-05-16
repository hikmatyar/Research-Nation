$('document').ready(function(){

  $("#new_profile").submit(function(){
    return validate_form();
  });

  if ($(".edit_profile")){

       $(".edit_profile").submit(function(){
           $("input:submit").val("Processing...");
				   $("input:submit").css("background","#e5a110");

				   validated =  validate_form();

				   if(!validated){
				    $("input:submit").val("Submit");
            $("input:submit").css("background","#8EAF32");
				   }

           if(!validated){
            $("#profile_submit").after("<p class='profile_error error' >Please fill in all required information</p>");
           }
           return validated;
       });
     }

  $(".interests input:checkbox").change(function(){
    var interests = new Array();
    $(".interests input:checkbox:checked").each(function(){
      interests.push($(this).val());
      $("#interested_in").val(interests.join(","));
    });
  });

  $("#user_image").change(function(){
    $("#picture_path").val($("#user_image").val());
  });

  $(".interests input:checkbox").trigger('change');

  $("#user_image").trigger('change');

  if ($("#message_link").length > 0){
    $("#message_link").fancybox({
        'hideOnOverlayClick' : false
     });
  }

  $("#message_link").click(function(){
    $("#register_form").addClass("seller_popup_message");
    $("#register_form").removeClass("how_it_work_left_side");
    $("#register_form").removeClass("margin_bottom");
  });

  if (location.href.match("reveal_message"))
  {
    $("#message_link").trigger("click");
  }

  if(location.href.match("edit"))
  {
    $("#profile_description").show_char_limit(2500);
    $("#profile_humor_me").show_char_limit(2500);
  }


	if($(".edit_profile :input.tip").length > 0){
		$(".edit_profile :input.tip").tooltip({
			position: "center right",
			offset: [-2, 10],
			opacity: 0.6
	  });
	}

});