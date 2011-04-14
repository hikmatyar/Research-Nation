function validate_form(){
	jQuery('.error').remove();
	jQuery('.error_field').removeClass("error_field");

	jQuery(".required").each(function(){
		if(jQuery(this).val()=="")
		{
			jQuery(this).after("<span class='error'>Field Cannot be blank</span>");
			jQuery(this).addClass("error_field");
		}
	});

	jQuery(".email").each(function(){
		if (!(jQuery(this).hasClass("error_field")) && jQuery(this).val() != jQuery(this).val().match(/^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})/)[0]){
		  jQuery(this).after("<span class='error'>Please enter a valid email address</span>");
		  jQuery(this).addClass("error_field");
	  }
	});

	jQuery(".max_len").each(function(){
		len = Number(jQuery(this).attr("max_length"));
		if (jQuery(this).val().length > len){
			jQuery(this).after("<span class='error'>Length exceeded</span>");
			jQuery(this).addClass("error_field");
		}
	});
jQuery(".file").each(function(){
		
		file_name = jQuery(this).val();
		if (file_name && !file_name.match(/^.*\.(doc|DOC|ppt|PPT|xls|xls|pdf|PDF|docx|DOCX|pptx|PPTX|xlsx|XLSX)/))
		{
			jQuery(this).after("<span class='error'>Please select a valid File format</span>");
			jQuery(this).addClass("error_field");
		}
	});
	jQuery(".min_len").each(function(){
		len = Number(jQuery(this).attr("min_length"));
		if (jQuery(this).val().length < len){
			jQuery(this).after("<span class='error'>Length should not be less than "+ len +" characters</span>");
			jQuery(this).addClass("error_field");
		}
	});

	jQuery(".valid_price").each(function(){
		price = Number(jQuery(this).val());
		if(price < 0 || price > 1000){
			jQuery(this).after("<span class='error'>Price range should be between 0 and 1000</span>");
			jQuery(this).addClass("error_field");
		}
		if (String(price).match(/[.]/))
		{
			jQuery(this).after("<span class='error'>Price should be whole number</span>");
			jQuery(this).addClass("error_field");
		}
	});

	if(jQuery(".error").length > 0)
	{
		return false;
	}
	else{
		image = '<img src="/images/loading_bar.gif" />'
		jQuery('.register_form').append(image);
	}
}
