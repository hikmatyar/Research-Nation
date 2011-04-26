$(document).ready(function(){

$("a").click(function(){
  $(".error").hide();
});
	showTab(location.href.split("=")[1]);

$("#new_user").submit(function(){
		$('.error').remove();
		valid = true;
		/*if($("#first_name").val()==""){
			$("#first_name").after("<p class='error'>First Name cannot be blank</p>");
		}
		if($("#last_name").val()==""){
			$("#last_name").after("<p class='error'>Last Name cannot be blank</p>");
		}*/
		if($("#email").val()==""){
			$("#email").after("<p class='error'>Email cannot be blank</p>");
		}
		validate_email( jQuery("#email").val())
		if($("#password").val().length < 6 || $("#password").val() == ""){
			$("#password").after("<p class='error'>Password must be at least 6 characters long</p>");
		}
		if($("#user_user_type").val()==""){
		  $(this).after("<p class='error'>Please select an option</p>");
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

function validate_email(email) {
   var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   var address = email
   if(reg.test(address) == false) {
      $("#email").after("<p class='error'>Email format should be valid</p>")
      return false;
   }
}
