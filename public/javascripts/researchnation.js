jQuery('document').ready(function(){
	if(jQuery('.flash')){

		if (location.href.match("profiles")){
			setTimeout("jQuery('.flash').fadeOut(15000);",1000);
		}
		else{
			setTimeout("jQuery('.flash').fadeOut(7500);",1000);
		}
		setTimeout("jQuery('.flash').remove();",15000);
	}

	s = location.pathname.split("/")
	jQuery("."+s[s.length-1]).addClass("active");
        jQuery("."+s[s.length-1]).addClass("pushed_button");

	if($('.email_address')){
		$('.email_address').blur(function(){
		$(this).removeClass("error_field");
	});

	$('.email_address').click(function(){
		$(this).val("");
		$(this).css("color","#000");
	});

	$("form").submit(function(){
	  if ($(".email_address").val()==""){
	  	$('.email_address').addClass("error_field");
	  	return false;	
	  }
	});
	}
	if ($(".tab_content"))
	{
		$(".tab_content").hide(); //Hide all content
		$("ul.tabs li:first").addClass("active").show(); //Activate first tab
		$(".tab_content:first").show(); //Show first tab content

		//On Click Event
			$("ul.tabs li").click(function() {

				$("ul.tabs li").removeClass("active"); //Remove any "active" class
				$(this).addClass("active"); //Add "active" class to selected tab
				$(".tab_content").hide(); //Hide all tab content

				var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
				$(activeTab).fadeIn(); //Fade in the active ID content
				return false;
			});
		}

});
function showTab(value) 
	{
		if(value == "signup")
		{
			document.getElementById('tabOne').style.display = "block"
			document.getElementById('tabTwo').style.display = "none"

			document.getElementById('tab1').style.background = "#FFFFFF"
			document.getElementById('tab1').style.color = "#245a83"

			document.getElementById('tab2').style.background = "#bfbfb5"
			document.getElementById('tab2').style.color = "#FFFFFF"

			return true;
		}
		if(value == "login")
		{
			document.getElementById('tabOne').style.display = "none"
			document.getElementById('tabTwo').style.display = "block"

			document.getElementById('tab2').style.background = "#FFFFFF"
			document.getElementById('tab2').style.color = "#245a83"

			document.getElementById('tab1').style.background = "#bfbfb5"
			document.getElementById('tab1').style.color = "#FFFFFF"

			return true;
		}
	}
