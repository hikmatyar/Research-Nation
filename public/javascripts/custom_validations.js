function validate_form(){
	$('.error').remove();
	$('.error_field').removeClass("error_field");

	$(".required").each(function(){
		if($(this).val()=="")
		{
			$(this).after("<span class='error'>Field Cannot be blank</span>");
			$(this).addClass("error_field");
		}
	});

	$(".email").each(function(){
		if (!($(this).hasClass("error_field")) && $(this).val() != $(this).val().match(/^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})/)[0]){
		  $(this).after("<span class='error'>Please enter a valid email address</span>");
		  $(this).addClass("error_field");
	  }
	});

	$(".max_len").each(function(){
		len = Number($(this).attr("max_length"));
		if ($(this).val().length > len){
			$(this).after("<span class='error'>Length exceeded</span>");
			$(this).addClass("error_field");
		}
	});
$(".file").each(function(){
		
		file_name = $(this).val();
		if (file_name && !file_name.match(/^.*\.(doc|DOC|ppt|PPT|xls|xls|pdf|PDF|docx|DOCX|pptx|PPTX|xlsx|XLSX)/))
		{
			$(this).after("<span class='error'>Please select a valid File format</span>");
			$(this).addClass("error_field");
		}
	});
	$(".min_len").each(function(){
		len = Number($(this).attr("min_length"));
		if ($(this).val().length < len){
			$(this).after("<span class='error'>Length should not be less than "+ len +" characters</span>");
			$(this).addClass("error_field");
		}
	});

	$(".valid_price").each(function(){
		price = Number($(this).val());
		if(price < 0 || price > 1000){
			$(this).after("<span class='error'>Price range should be between 0 and 1000</span>");
			$(this).addClass("error_field");
		}
		if (String(price).match(/[.]/))
		{
			$(this).after("<span class='error'>Price should be whole number</span>");
			$(this).addClass("error_field");
		}
	});

	if($(".error").length > 0)
	{
		return false;
	}
	else{
		image = '<img src="/images/loading_bar.gif" />'
		$('.register_form').append(image);
	}
}
