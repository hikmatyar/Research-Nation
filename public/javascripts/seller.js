jQuery(document).ready(function(){

 jQuery("#summary_link").addClass("active");
 jQuery("#message_link").fancybox({
    'hideOnOverlayClick' : false
  });

  jQuery("#message_link").click(function(){
     jQuery("#register_form").addClass("seller_popup_message");
     jQuery("#register_form").removeClass("how_it_work_left_side");
     jQuery("#register_form").removeClass("margin_bottom");
   });

  if (location.href.match("reveal_message"))
  {
    jQuery("#message_link").trigger("click");
  }

	jQuery("#summary_link").click(function(){
		jQuery(".seller_blocks").hide();
		jQuery("#summary_details").show();

		jQuery('.seller_links').removeClass("active");
		jQuery('#summary_link').addClass("active");
	});

	jQuery("#seller_link").click(function(){
		jQuery(".seller_blocks").hide();
		jQuery("#about_seller").show();

		jQuery('.seller_links').removeClass("active");
		jQuery('#seller_link').addClass("active");
	});

	jQuery("#sample_link").click(function(){
		jQuery(".seller_blocks").hide();
		jQuery("#view_sample").show();

		jQuery('.seller_links').removeClass("active");
		jQuery('#sample_link').addClass("active");
	});

	jQuery("#sources_link").click(function(){
		jQuery(".seller_blocks").hide();
		jQuery("#sources").show();
		jQuery('.seller_links').removeClass("active");
		jQuery('#sources_link').addClass("active");
	});

	jQuery(".fbFooterBorder").css("display","none");
});
