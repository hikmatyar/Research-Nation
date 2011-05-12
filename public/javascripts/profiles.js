jQuery('document').ready(function(){

  jQuery("#new_profile").submit(function(){
    return validate_form();
  });

  if (jQuery(".edit_profile")){
       jQuery(".edit_profile").submit(function(){
           validated = validate_form();
           if(!validated){
            jQuery("#profile_submit").after("<p class='profile_error error' >Please fill in all required information</p>");
           }
           return validated;
       });
     }

  jQuery(".interests input:checkbox").change(function(){
    var interests = new Array();
    jQuery(".interests input:checkbox:checked").each(function(){
      interests.push(jQuery(this).val());
      jQuery("#interested_in").val(interests.join(","));
    });
  });

  jQuery("#user_image").change(function(){
    jQuery("#picture_path").val(jQuery("#user_image").val());
  });

  jQuery(".interests input:checkbox").trigger('change');

  jQuery("#user_image").trigger('change');

  jQuery("#message_link").fancybox({
      'hideOnOverlayClick' : false
   });

  jQuery("#message_link").click(function(){
    jQuery("#register_form").addClass("seller_popup_message");
    jQuery("#register_form").removeClass("how_it_work_left_side");
    jQuery("#register_form").removeClass("margin_bottom");
  });

  if (location.href.match("reveal_message"))
  {
    jQuery("#message_link").trigger("click");
  }
  if(location.href.match("edit"))
  {
    $("#profile_description").show_char_limit(2500);
    $("#profile_humor_me").show_char_limit(2500);
  }

	if(jQuery(".edit_profile :input.tip")){
		jQuery(".edit_profile :input.tip").tooltip({
			position: "center right",
			offset: [-2, 10],
			effect: "fade",
			opacity: 1
	});

	}

});

