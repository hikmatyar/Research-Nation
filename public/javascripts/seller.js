jQuery(document).ready(function(){

 jQuery("#summary_link").addClass("active");
 jQuery("#message_link").fancybox({
    'hideOnOverlayClick' : false
  });

  if (location.href.match("reveal_message"))
  {
    jQuery("#message_link").trigger("click");
  }
	jQuery("#summary_link").click(function(){
		jQuery(".seller_blocks").hide();
		jQuery("#summary_details").show();
		/*jQuery("#about_seller").hide();
		jQuery("#view_sample").hide();
		jQuery("#sources").hide();*/

		/*jQuery('#seller_link').css("background" ,"#FFFFFF");
		jQuery('#seller_link').css("color", "#245a83");

		jQuery('#summary_link').css("background", "#bfbfb5");
		jQuery('#summary_link').css("color", "#FFFFFF");
		jQuery('#summary_link').addClass("active");

		jQuery('#sample_link').css("background", "#FFFFFF");
		jQuery('#sample_link').css("color", "#245a83");

		jQuery('#sources_link').css("background" ,"#FFFFFF");
		jQuery('#sources_link').css("color", "#245a83");*/
		jQuery('.seller_links').removeClass("active");
		jQuery('#summary_link').addClass("active");
	});
	jQuery("#seller_link").click(function(){
		/*jQuery("#summary_details").hide();
		jQuery("#about_seller").show();
		jQuery("#view_sample").hide();
		jQuery("#sources").hide();*/
		jQuery(".seller_blocks").hide();
		jQuery("#about_seller").show();

		/*jQuery('#seller_link').css("background", "#bfbfb5");
		jQuery('#seller_link').css("color", "#FFFFFF");
		jQuery('#seller_link').addClass("active");

		jQuery('#summary_link').css("background" ,"#FFFFFF");
		jQuery('#summary_link').css("color", "#245a83");

		jQuery('#sample_link').css("background", "#FFFFFF");
		jQuery('#sample_link').css("color", "#245a83");

		jQuery('#sources_link').css("background" ,"#FFFFFF");
		jQuery('#sources_link').css("color", "#245a83");*/
		jQuery('.seller_links').removeClass("active");
		jQuery('#seller_link').addClass("active");
	});
	jQuery("#sample_link").click(function(){
		jQuery(".seller_blocks").hide();
		jQuery("#view_sample").show();
		/*jQuery("#summary_details").hide();
		jQuery("#about_seller").hide();
		jQuery("#view_sample").show();
		jQuery("#sources").hide();*/

		/*jQuery('#seller_link').css("background", "#FFFFFF");
		jQuery('#seller_link').css("color", "#245a83");

		jQuery('#summary_link').css("background" ,"#FFFFFF");
		jQuery('#summary_link').css("color", "#245a83");

		jQuery('#sample_link').css("background", "#bfbfb5");
		jQuery('#sample_link').css("color", "#FFFFFF");
		jQuery('#sample_link').addClass("active");

		jQuery('#sources_link').css("background" ,"#FFFFFF");
		jQuery('#sources_link').css("color", "#245a83");*/
		jQuery('.seller_links').removeClass("active");
		jQuery('#sample_link').addClass("active");
	});

	jQuery("#sources_link").click(function(){
		jQuery(".seller_blocks").hide();
		jQuery("#sources").show();
		/*
		jQuery("#summary_details").hide();
		jQuery("#about_seller").hide();
		jQuery("#view_sample").hide();
		jQuery("#sources").show();
		*/
		/*jQuery('#seller_link').css("background", "#FFFFFF");
		jQuery('#seller_link').css("color", "#245a83");

		jQuery('#summary_link').css("background" ,"#FFFFFF");
		jQuery('#summary_link').css("color", "#245a83");

		jQuery('#sample_link').css("background" ,"#FFFFFF");
		jQuery('#sample_link').css("color", "#245a83");

		jQuery('#sources_link').css("background", "#bfbfb5");
		jQuery('#sources_link').css("color", "#FFFFFF");*/
		jQuery('.seller_links').removeClass("active");
		jQuery('#sources_link').addClass("active");
	});
	jQuery(".fbFooterBorder").css("display","none");
});
