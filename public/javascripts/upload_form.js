$(document).ready(function(){

var count = 1;

$("#add_another_file").click(function(){
  if(count <= 3)
  {
    $("#documents").append("<label>Another File </label><br><input type='file' name='attachment[original]["+ count + "]' size='30'>")
    count++;
    if (count == 3) {
      $("#add_another_file").hide();
    }
  }
});
$(".loading").hide();
  show_text_count();
  function show_text_count(){
      var len = 700 - $('#resource_description').val().length
      $('.field h5').text(len);
  }

  $('#resource_description').keypress(function(){
     show_text_count();
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
  }
  $("#fancybox-close").click(function(){
      window.location.replace("/users/register?opt=login");
  });
});
