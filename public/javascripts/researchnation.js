jQuery('document').ready(function(){
	if (location.href.match("login")){
		if(jQuery(".sign_up_terms")){
			jQuery("#tab2").addClass("active");
		}
		else
		{
			jQuery("#tab1").addClass("active");
		}
	}

	if(jQuery('.flash')){

		if (location.href.match("profile")){
			setTimeout("jQuery('.flash').fadeOut(120000);",1000);
		}
		else{
			setTimeout("jQuery('.flash').fadeOut(7500);",1000);
		}
		setTimeout("jQuery('.flash').remove();",150000);
	}

		s = location.pathname.split("/");
    jQuery("."+s[s.length-1]).addClass("active");
    jQuery("."+s[s.length-1]).addClass("pushed_button");

	//When page loads...

	if (jQuery(".tab_content")){
		jQuery(".tab_content").hide(); //Hide all content
		jQuery("ul.tabs li:first").addClass("active").show(); //Activate first tab
		jQuery(".tab_content:first").show(); //Show first tab content

		//On Click Event
		jQuery("ul.tabs li").click(function() {

			jQuery("ul.tabs li").removeClass("active"); //Remove any "active" class
			jQuery(this).addClass("active"); //Add "active" class to selected tab
			jQuery(".tab_content").hide(); //Hide all tab content

			var activeTab = jQuery(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
			jQuery(activeTab).fadeIn(); //Fade in the active ID content
			return false;
		});
	}

  if(jQuery('.email_address')){
    jQuery('.email_address').blur(function(){
    jQuery(this).removeClass("error_field");
	});

	jQuery('.email_address').click(function(){
		jQuery(this).val("");
		jQuery(this).css("color","#000");
	});

	jQuery("form").submit(function(){
    if (jQuery(".email_address").val()==""){
      jQuery('.email_address').addClass("error_field");
      return false;
	  }
	});
	}

});

function showTab(value) 
	{
		if(value == "signup")
		{
			document.getElementById('tabOne').style.display = "block"
			document.getElementById('tabTwo').style.display = "none"

			jQuery("#tab1").removeClass("active");
			jQuery("#tab2").addClass("active");
			//document.getElementById('tab1').style.background = "#FFFFFF"
			//document.getElementById('tab1').style.color = "#245a83"

			//document.getElementById('tab2').style.background = "#bfbfb5"
			//document.getElementById('tab2').style.color = "#FFFFFF"

			return true;
		}
		if(value == "login")
		{
			document.getElementById('tabOne').style.display = "none"
			document.getElementById('tabTwo').style.display = "block"

			jQuery("#tab1").addClass("active");
			jQuery("#tab2").removeClass("active");
			/*document.getElementById('tab2').style.background = "#FFFFFF"
			document.getElementById('tab2').style.color = "#245a83"

			document.getElementById('tab1').style.background = "#bfbfb5"
			document.getElementById('tab1').style.color = "#FFFFFF"*/

			return true;
		}
	}
