$(document).ready(function(){

 $("#summary_link").addClass("active");

 $("#message_link").fancybox({
    'hideOnOverlayClick' : false
  });

  $("#message_link").click(function(){
     $("#register_form").addClass("seller_popup_message");
     $("#register_form").removeClass("how_it_work_left_side");
     $("#register_form").removeClass("margin_bottom");
   });


	$("#summary_link").click(function(){
		$(".seller_blocks").hide();
		$("#summary_details").show();

		$('.seller_links').removeClass("active");
		$('#summary_link').addClass("active");
	});

	$("#seller_link").click(function(){
		$(".seller_blocks").hide();
		$("#about_seller").show();

		$('.seller_links').removeClass("active");
		$('#seller_link').addClass("active");
	});

	$("#sample_link").click(function(){
		$(".seller_blocks").hide();
		$("#view_sample").show();

		$('.seller_links').removeClass("active");
		$('#sample_link').addClass("active");
	});

	$("#sources_link").click(function(){
		$(".seller_blocks").hide();
		$("#sources").show();
		$('.seller_links').removeClass("active");
		$('#sources_link').addClass("active");
	});

	$(".fbFooterBorder").css("display","none");
});
