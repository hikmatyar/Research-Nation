jQuery('document').ready(function(){


  jQuery('#pending-earnings-link').click(function() {
    jQuery.ajax({
      url: "/users/monthly_pending_earnings",
      data: "user_id=" + getParameterByName("user_id"),
      success: function(data){
        jQuery("#pending-earnings").show();
        jQuery("#pending-earnings").html(data);

        jQuery('a[id^="earnings-link-"]').bind('click', function() {
          jQuery(jQuery(this).attr('href')).show();
        });

        jQuery('a[id^="hide-earnings-"]').bind('click', function() {
          jQuery(jQuery(this).attr('href')).hide();
        });

      }
    })
  });

  jQuery('#paid-earnings-link').click(function() {
    jQuery.ajax({
      url: "/users/monthly_paid_earnings",
      data: "user_id=" + getParameterByName("user_id"),
      success: function(data){
        jQuery("#paid-earnings").show();
        jQuery("#paid-earnings").html(data);

        jQuery('a[id^="earnings-link-"]').bind('click', function() {
          jQuery(jQuery(this).attr('href')).show();
        });

        jQuery('a[id^="hide-earnings-"]').bind('click', function() {
          jQuery(jQuery(this).attr('href')).hide();
        });

      }
    })
  });


});

function getParameterByName( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}
