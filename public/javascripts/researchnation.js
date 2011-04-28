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
