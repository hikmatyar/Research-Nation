$(document).ready(function(){

	showTab(location.href.split("=")[1]);

	$("#new_user").submit(function(){
			$('.error').text("");
			valid = true;
			if($("#first_name").val()==""){
				$("#first_name").after("<p class='error'>First Name cannot be blank</p>");
			}
			if($("#last_name").val()==""){
				$("#last_name").after("<p class='error'>Last Name cannot be blank</p>");
			}
			if($("#email").val()==""){
				$("#email").after("<p class='error'>Email cannot be blank</p>");
			}
			if(!($("#email").val()==$("#email").val().match(/^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})/)[0])){
				$("#email").after("<p class='error'>Email format is invalid</p>");
			}
			if($("#password").val().length < 6 || $("#password").val() == ""){
				$("#password").after("<p class='error'>Password must be at least 6 characters long</p>");
			}
			if($('.error').length>0){
				return false;
			}
	});

	$(".check_box input:checkbox").change(function(){
		if (!($(this).is(":checked"))){
			$(this).val("no");
			}
		else{
			$(this).val("yes");
		}
		});
});
