$(document).ready(function(){
	showTab(location.href.split("=")[1]);

	var first_name_validation = new LiveValidation('first_name');
	first_name_validation.add( Validate.Presence );
	first_name_validation.add( Validate.Length, { minimum : 2 } );

	var last_name_validation = new LiveValidation('last_name');
	last_name_validation.add( Validate.Presence );
	last_name_validation.add( Validate.Length, { minimum : 2 } );

	var email_validation = new LiveValidation('email');
	email_validation.add( Validate.Presence );
	email_validation.add( Validate.Email );

	var password_validation = new LiveValidation('password');
	password_validation.add( Validate.Presence );
	password_validation.add( Validate.Length,{ minimum : 6 } );


	$(".check_box input:checkbox").change(function(){
		if (!($(this).is(":checked"))){
			$(this).val("no");
			}
		else{
			$(this).val("yes");
		}
		});
});
