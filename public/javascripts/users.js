jQuery('document').ready(function(){

  jQuery('#purchase-link').click(function() {
    jQuery.ajax({
      url: "/users/purchases",
      success: function(data){
        jQuery("#purchases").show();
        jQuery("#purchases").html(data);
      }
    })
  });

  jQuery('#listings-link').click(function() {
    jQuery.ajax({
      url: "/users/listings",
      success: function(data){
        jQuery("#listings").show();
        jQuery("#listings").html(data);
      }
    })
  });

  jQuery('#pending-earnings-link').click(function() {
    jQuery.ajax({
      url: "/users/pending_earnings",
      success: function(data){
        jQuery("#pending-earnings").show();
        jQuery("#pending-earnings").html(data);
      }
    })
  });

  jQuery('#paid-earnings-link').click(function() {
    jQuery.ajax({
      url: "/users/monthly_paid_earnings",
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

  jQuery('#preferences-link').click(function() {
    jQuery.ajax({
      url: "/users/payment_preferences",
      success: function(data){
        jQuery("#preferences").show();
        jQuery("#preferences").html(data);
      }
    })
  });

});

function showTab(value)
{
	if(value == "signup")
	{
		jQuery("#signup-tab").addClass("active");
		document.getElementById('signup-body').style.display = "block"

		jQuery("#login-tab").removeClass("active");
		document.getElementById('login-body').style.display = "none"
		return true;
	}
	else if(value == "login")
	{
		document.getElementById('signup-body').style.display = "none"
		document.getElementById('login-body').style	.display = "block"

		jQuery("#login-tab").addClass("active");
		jQuery("#signup-tab").removeClass("active");
	}
}
