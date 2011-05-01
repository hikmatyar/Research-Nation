jQuery('document').ready(function(){

  jQuery("#new_profile").submit(function(){
    return validate_form();
  });

  if (jQuery(".edit_profile")){
       jQuery(".edit_profile").submit(function(){
          return validate_form();
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

  if (location.href.match("reveal_message"))
  {
    jQuery("#message_link").trigger("click");
  }
});

