$(document).ready(function(){

	$("input").keypress(function(){
    $(this).siblings().text("");
    $(this).siblings().css("padding","8px");
	})
	$("#new_user").submit(function(){
		return validate_form();
	});

});

