$('document').ready(function(){

  $("#new_profile").submit(function(){
    return validate_form();
  });

  $(".interests input:checkbox").change(function(){
    var interests = new Array();
    $(".interests input:checkbox:checked").each(function(){
      interests.push($(this).val());
      $("#interested_in").val(interests.join(","));
    });
  });

  $("#skype").click(function(){
      $('#key_individual_skype_availability').val($(this).attr("checked"));
  })

  $("#user_image").change(function(){
    $("#picture_path").val($("#user_image").val());
  });

  $(".interests input:checkbox").trigger('change');

  $("#user_image").trigger('change');
});
