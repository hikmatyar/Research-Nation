		jQuery(document).ready(function(){

			var contact_name_validation = new LiveValidation('contact_name');
			contact_name_validation.add( Validate.Presence );
			contact_name_validation.add( Validate.Length, { minimum : 2 } );

			var contact_email_validation = new LiveValidation('contact_email');
			contact_email_validation.add( Validate.Presence );
			contact_email_validation.add( Validate.Email );

			var contact_subject_validation = new LiveValidation('contact_subject');
			contact_subject_validation.add( Validate.Presence );
			contact_subject_validation.add( Validate.Length, { minimum : 2 } );

			var contact_message_validation = new LiveValidation('contact_message');
			contact_message_validation.add( Validate.Presence );
			contact_message_validation.add( Validate.Length, { minimum : 2 } );

		jQuery("#tab2").click(function(){
			jQuery("#tabOne").show();
			jQuery("#tabTwo").hide();
			jQuery("#tabThree").hide();

			jQuery('#tab1').css("background" ,"#FFFFFF");
			jQuery('#tab1').css("color", "#245a83");

			jQuery('#tab2').css("background", "#bfbfb5");
			jQuery('#tab2').css("color", "#FFFFFF");

			jQuery('#tab3').css("background", "#FFFFFF");
			jQuery('#tab3').css("color", "#245a83");
		});
		jQuery("#tab1").click(function(){
			jQuery("#tabOne").hide();
			jQuery("#tabTwo").show();
			jQuery("#tabThree").hide();
			
			jQuery('#tab1').css("background", "#bfbfb5");
			jQuery('#tab1').css("color", "#FFFFFF");

			jQuery('#tab2').css("background" ,"#FFFFFF");
			jQuery('#tab2').css("color", "#245a83");

			jQuery('#tab3').css("background", "#FFFFFF");
			jQuery('#tab3').css("color", "#245a83");
		});
		jQuery("#tab3").click(function(){
			jQuery("#tabOne").hide();
			jQuery("#tabTwo").hide();
			jQuery("#tabThree").show();
			
			jQuery('#tab1').css("background", "#FFFFFF");
			jQuery('#tab1').css("color", "#245a83");

			jQuery('#tab2').css("background" ,"#FFFFFF");
			jQuery('#tab2').css("color", "#245a83");

			jQuery('#tab3').css("background", "#bfbfb5");
			jQuery('#tab3').css("color", "#FFFFFF");
		});
		jQuery(".fbFooterBorder").css("display","none");
	});
