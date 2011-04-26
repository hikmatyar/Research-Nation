count = 0;
  jQuery('document').ready(function(){

   choices = new Array();

   jQuery(".field input:checkbox:checked").each(function(){
			choices.push(jQuery(this).val());
		});

   jQuery('input').click(function() {
    jQuery(this).trigger("focus");
   });

   jQuery('#profile_type').change(function(){
     url = "/profiles/filter_by_profile_type?profile_type="+ jQuery(this).val();
     new Ajax.Updater('left_content', url, {asynchronous: true,});
   });

   jQuery('#location').change(function(){
     url = "/profiles/search_results?location="+ jQuery("#location").val()+"&profile_type = "+jQuery("#profile_type").val()+"&industry="+jQuery("#industry_focus").val()+"&choices="+choices;
     new Ajax.Updater('left_content', url, {asynchronous: true,});
   });

   jQuery('#industry_focus').change(function(){
	 url = "/profiles/search_results?location="+ jQuery("#location").val()+"&profile_type = "+jQuery("#profile_type").val()+"&industry="+jQuery("#industry_focus").val()+"&choices="+choices;
     new Ajax.Updater('left_content', url, {asynchronous: true,});
   });

   jQuery(".field input:checkbox").change(function(){
		jQuery(".field input:checkbox:checked").each(function(){
			choices.push(jQuery(this).val());
		});
		url = "/profiles/search_results?location="+ jQuery("#location").val()+"&profile_type = "+jQuery("#profile_type").val()+"&industry="+jQuery("#industry_focus").val()+"&choices="+choices;
    new Ajax.Updater('left_content', url, {asynchronous: true,})
	});

   jQuery(".reset_button").click(function(){
     window.location.reload();
   });
   
   jQuery("#location").click(function(){
     jQuery(this).css("color","#000");
     jQuery(this).val("");
   });
   jQuery("#profile_type").click(function(){
     jQuery(this).css("color","#000");
     jQuery(this).val("");
   });
   jQuery("#interested_in").click(function(){
     jQuery(this).css("color","#000");
     jQuery(this).val("");
   });

   jQuery("#industry_focus").click(function(){
     jQuery(this).css("color","#000");
     jQuery(this).val("");
   });
   jQuery('#industry_focus').val("All");
   jQuery('#location').val("All");
});
