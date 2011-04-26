var industries = new Array();
var geographies = new Array();
var count = 0;

function populate_array_text(){
  jQuery('#industry_result p').each(function(){
        industries.push(jQuery(this).text());
    });

    jQuery('#geography_result p').each(function(){
        geographies.push(jQuery(this).text());
    });
}

jQuery('document').ready(function(){

  jQuery('input').click(function() {
    jQuery(this).trigger("focus");  
   });

  jQuery('#author_name').autocomplete('/users/unique_users');
  jQuery('#industry').autocomplete('/resources/get_industries', { autoFill : true});
  jQuery('#geography').autocomplete('/resources/get_geography_list');

  jQuery('#author_name').result(function(event, data, formatted) {
    url = "/resources/filter_by_author_name?name="+ formatted +"&price=" + jQuery(":range").val();
    new Ajax.Updater('left_content', url, {asynchronous: true,});
  });

  jQuery(":range").rangeinput().change(function(){
      populate_array_text();

      url = "/resources/filter_results?industry="+ industries.join(",") +"&geography="+ geographies.join(",") +"&price=" + jQuery(":range").val();

      new Ajax.Updater('left_content', url, {asynchronous: true,});
      jQuery(':range').val("$" + jQuery(':range').val());
    });
    jQuery('#industry').result(function(event, data, formatted) {

      
      industries.push(formatted);

      url = "/resources/filter_results?industry="+ industries.join(",") +"&geography="+ geographies.join(",") +"&price=" + jQuery(":range").val().replace("$","");

      jQuery("#industry_result").append('<p> ' + formatted +'</p> <span id="industry_tag'+count+'"></span>');
      new Ajax.Updater('industry_tag'+count, "/resources/industries_count?industry="+formatted, {asynchronous: true,});
      count++;
      new Ajax.Updater('left_content', url, {asynchronous: true,});
      jQuery('#industry').val("");
  });

  jQuery('#geography').result(function(event, data, formatted) {

      populate_array_text();
      geographies.push(formatted);

      url = "/resources/filter_results?industry="+ industries.join(",") +"&geography="+ geographies.join(",") +"&price=" + jQuery(":range").val();

      jQuery("#geography_result").append('<p> ' + formatted +'</p> <span id="geography_tag'+count+'"></span>');
      new Ajax.Updater('geography_tag'+count, "/resources/geography_count?geography="+formatted, {asynchronous: true,});
      count++;
      new Ajax.Updater('left_content', url, {asynchronous: true,});
      jQuery('#geography').val("");
  });

  jQuery(".reset_button").click(function(){
    window.location.reload();
  });
  jQuery("#geography").click(function(){
    jQuery(this).css("color","#000");
    jQuery(this).val("");
  });
  jQuery("#industry").click(function(){
    jQuery(this).css("color","#000");
    jQuery(this).val("");
  });
  jQuery(":range").val("$1000");
  jQuery('.handle').css("left","331px");
});
