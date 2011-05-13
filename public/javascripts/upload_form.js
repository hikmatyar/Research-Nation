$(document).ready(function(){

var count = 1;

$("#resource_title").show_char_limit(100);
$("#resource_description").show_char_limit(3000);
$("#resource_industry").show_char_limit(25);
$("#resource_geography").show_char_limit(25);
$("#resource_terms_and_conditions").show_char_limit(3000);
$("#resource_sources").show_char_limit(3000);
$("#profile_description").show_char_limit(3000);



$("#new_resource :input.tip").tooltip({

	position: "center right", // place tooltip on the right edge
	offset: [-2, 10], // a little tweaking of the position
	effect: "fade", //use the built-in fadeIn/fadeOut effect
	opacity: 0.6  // custom opacity setting

	});

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
  function show_text_count(e, elem, field){
      var len = 2500 - $('').val(field).length
      $(elem).text(len);
      if(len <= 0 ){
        if( e.which != 8){
          $(field).trigger("blur");
        }
      }
  }

  $('input').keypress(function(e){
     show_text_count(e, $(this), $(this));
  });

  $('#new_resource').submit(function(){
      $("input:submit").val("Processing...");
      $("input:submit").css("background","#e5a110");
      validated =  validate_form();
      if(!validated){
        $("input:submit").val("Submit");
      $("input:submit").css("background","#8EAF32");
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
