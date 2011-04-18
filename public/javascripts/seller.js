		jQuery(document).ready(function(){

		jQuery("#tab1").click(function(){
			jQuery("#tabOne").show();
			jQuery("#tabTwo").hide();
			jQuery("#tabThree").hide();
			jQuery("#tabFour").hide();

			jQuery('#tab2').css("background" ,"#FFFFFF");
			jQuery('#tab2').css("color", "#245a83");

			jQuery('#tab1').css("background", "#bfbfb5");
			jQuery('#tab1').css("color", "#FFFFFF");

			jQuery('#tab3').css("background", "#FFFFFF");
			jQuery('#tab3').css("color", "#245a83");

			jQuery('#tab4').css("background" ,"#FFFFFF");
			jQuery('#tab4').css("color", "#245a83");
		});
		jQuery("#tab2").click(function(){
			jQuery("#tabOne").hide();
			jQuery("#tabTwo").show();
			jQuery("#tabThree").hide();
			jQuery("#tabFour").hide();
			
			jQuery('#tab2').css("background", "#bfbfb5");
			jQuery('#tab2').css("color", "#FFFFFF");

			jQuery('#tab1').css("background" ,"#FFFFFF");
			jQuery('#tab1').css("color", "#245a83");

			jQuery('#tab3').css("background", "#FFFFFF");
			jQuery('#tab3').css("color", "#245a83");

			jQuery('#tab4').css("background" ,"#FFFFFF");
			jQuery('#tab4').css("color", "#245a83");
		});
		jQuery("#tab3").click(function(){
			jQuery("#tabOne").hide();
			jQuery("#tabTwo").hide();
			jQuery("#tabThree").show();
			jQuery("#tabFour").hide();
			
			jQuery('#tab2').css("background", "#FFFFFF");
			jQuery('#tab2').css("color", "#245a83");

			jQuery('#tab1').css("background" ,"#FFFFFF");
			jQuery('#tab1').css("color", "#245a83");

			jQuery('#tab3').css("background", "#bfbfb5");
			jQuery('#tab3').css("color", "#FFFFFF");

			jQuery('#tab4').css("background" ,"#FFFFFF");
			jQuery('#tab4').css("color", "#245a83");
		});

		jQuery("#tab4").click(function(){
			jQuery("#tabOne").hide();
			jQuery("#tabTwo").hide();
			jQuery("#tabThree").hide();
			jQuery("#tabFour").show();
			
			jQuery('#tab2').css("background", "#FFFFFF");
			jQuery('#tab2').css("color", "#245a83");

			jQuery('#tab1').css("background" ,"#FFFFFF");
			jQuery('#tab1').css("color", "#245a83");

			jQuery('#tab3').css("background" ,"#FFFFFF");
			jQuery('#tab3').css("color", "#245a83");

			jQuery('#tab4').css("background", "#bfbfb5");
			jQuery('#tab4').css("color", "#FFFFFF");
		});
		jQuery(".fbFooterBorder").css("display","none");
	});
