count = 0;
  jQuery('document').ready(function(){
    
   profile_type = ["individual","company"];

   jQuery('input').click(function() {
    jQuery(this).trigger("focus");
   });

   jQuery('#profile_type').autocomplete(profile_type);

   jQuery('#profile_type').result(function(event, data, formatted) {
     url = "/profiles/filter_by_profile_type?profile_type="+ formatted;
     new Ajax.Updater('left_content', url, {asynchronous: true,});
     jQuery("#profile_type_result").append('<p> ' + formatted +'</p> <span id="profile_tag'+count+'"></span>');
   });


   jQuery('#location').autocomplete('/profiles/get_locations');

   jQuery('#location').result(function(event, data, formatted) {
     url = "/profiles/filter_by_location?location="+ formatted;
     new Ajax.Updater('left_content', url, {asynchronous: true,});
    jQuery("#location_result").append('<p> ' + formatted +'</p> <span id="location_tag'+count+'"></span>');
   });


   jQuery('#industry_focus').autocomplete('/profiles/get_industry_focus');
   jQuery('#industry_focus').result(function(event, data, formatted) {
     url = "/profiles/filter_by_industry_focus?industry="+ formatted;
     new Ajax.Updater('left_content', url, {asynchronous: true,});
     jQuery("#industry_focus_result").append('<p> ' + formatted +'</p> <span id="industry_focus_tag'+count+'"></span>');
   });

   jQuery('#interested_in').autocomplete('/profiles/get_interests');
   jQuery('#industry_focus').result(function(event, data, formatted) {
     url = "/profiles/filter_by_interests?interests="+ formatted;
     new Ajax.Updater('left_content', url, {asynchronous: true,});
     jQuery("#interested_result").append('<p> ' + formatted +'</p> <span id="interested_in_tag'+count+'"></span>');
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
});
