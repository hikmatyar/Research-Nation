var new_text = ["make money.","share your expertise.","build a reputation."];
var counter = 0;
$(document).ready(function(){


	if(location.pathname == "/"){
		change_text();
	}

	if($("#login-tab")){
	  $("#login-tab").addClass("active");
  }

	if (location.href.match("login")){
		if($(".sign_up_terms")){
			$("#login-tab").addClass("active");
			$("#signup-tab").removeClass("active");
		}
		else
		{
			$("#login-tab").removeClass("active");
			$("#signup-tab").addClass("active");
		}
	}

	if($('.flash')){

		if (location.href.match("profile")){
			setTimeout("$('.flash').fadeOut(20000);",1000);
		}
		else{
			setTimeout("$('.flash').fadeOut(7500);",1000);
		}
	}

		s = location.pathname.split("/").pop();
    if (s.length > 1){
      location_class = "."+s;
      if ($(location_class).length > 0) {
        $(location_class).addClass("active");
        $(location_class).addClass("pushed_button");
      }
    }

	//When page loads...

	if ($(".tab_content")){
		$(".tab_content").hide(); //Hide all content
		$("ul.tabs li:first").addClass("active").show(); //Activate first tab
		$(".tab_content:first").show(); //Show first tab content
	}

	//On Click Event
	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active"); //Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".active a").addClass("active");
		$(".tab_content").hide(); //Hide all tab content

		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active ID content
		return true;
	});

  if($('.email_address')){
    $('.email_address').blur(function(){
    $(this).removeClass("error_field");
	});

	$('.email_address').click(function(){
		$(this).val("");
		$(this).css("color","#000");
	});

	$('.attachment_details_link').click(function(){
    $(this).prev().hide();
		$(this).hide();
		$(this).next().show();
	});

	$("form").submit(function(){
      if ($(".email_address").val()==""){
        $('.email_address').addClass("error_field");
        return false;
	    }
	  });
	}

  if($("#edit_resource").length > 0){
    $("#resource_title").show_char_limit(140);
    $("#resource_description").show_char_limit(3000);
    $("#resource_industry").show_char_limit(25);
    $("#resource_geography").show_char_limit(25);
    $("#resource_terms_and_conditions").show_char_limit(3000);
    $("#resource_sources").show_char_limit(3000);

    $('#edit_resource').submit(function(){
        $("input:submit").val("Updating...");
				$("input:submit").css("background","#e5a110");
				validated =  validate_form();
				if(!validated){
				  $("input:submit").val("Submit");
				$("input:submit").css("background","#8EAF32");
				}
				return validated;
    });
   }

});

function showTab(value)
	{
		if(value == "signup")
		{
			$("#signup-tab").addClass("active");
			document.getElementById('signup-body').style.display = "block"

			$("#login-tab").removeClass("active");
			document.getElementById('login-body').style.display = "none"
			return true;
		}
		else if(value == "login")
		{
			document.getElementById('signup-body').style.display = "none"
			document.getElementById('login-body').style	.display = "block"

			$("#login-tab").addClass("active");
			$("#signup-tab").removeClass("active");
		}
	}

function change_text(){
  if ($("#text_to_change")) {
    if(counter < new_text.length){
      $("#text_to_change").html("<a href='/browse/posts'>" + new_text[counter++] + "</a>");
    }
    else{
      counter = 0;
    }
    setTimeout("change_text();",5000);
  }
}