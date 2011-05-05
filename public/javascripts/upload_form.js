$(document).ready(function(){

var count = 1;

$("#add_another_file").click(function(){
  if(count <= 3)
  {
    $("#documents").append("<label class='add_more_field'>Another File </label><br><input class='add_more_field' size='22' type='file' name='attachment[original]["+ count + "]' size='30'>")
    count++;
    if (count == 3) {
      $("#add_another_file").hide();
    }
  }
});

jQuery(document).keydown(function(e) {

    if (e.which == 0 || e.which == 27){
      location.replace("/users/register");
    }
	});

$(".loading").hide();
  show_text_count(Event);
  function show_text_count(e){
      var len = 2500 - $('#resource_description').val().length
      $('.field h5').text(len);
      if(len <= 0 ){
        if( e.which != 8){
          $("#resource_description").trigger("blur");
        }
      }
  }

  $('#resource_description').keydown(function(e){
     show_text_count(e);
  });

  $('#new_resource').submit(function(){
      validated = validate_form();
      if(validated)
      {
        $(".loading").show();
      }
      return validated;
  });
  $("#original").change(function(){
      $("#original_file_name").val($(this).val());
  });
  $("#sample").change(function(){
      $("#sample_file_name").val($(this).val());
  });
  $('input:checkbox').click(function(){
      $(this).val($(this).attr("checked"));
  })
  
  $("#login_link").fancybox({ 
        'hideOnOverlayClick' : false,
        'transitionIn'		: 'none',
        'transitionOut'		: 'none'
     });

  if (location.href.match("login")){
      $("#login_link").trigger("click");
      $("#register_form").addClass("popup_message");
      $("#register_form").removeClass("how_it_work_left_side");
  }
  $("#fancybox-close").click(function(){
      window.location.replace("/users/register?opt=login");
  });
});
