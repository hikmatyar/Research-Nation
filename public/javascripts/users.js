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

  jQuery('#current-earnings-link, #earnings-link').click(function() {
    jQuery('#current-earnings-link').css("text-decoration","underline");

    jQuery.ajax({
      url: "/users/pending_earnings",
      success: function(data){
        jQuery("#previous-earnings").hide();
        jQuery("#preferences").hide();

        jQuery("#current-earnings").show();
        jQuery("#current-earnings").html(data);

        bind_functions();
      }
    })
  });

  jQuery('#previous-earnings-link').click(function() {
    jQuery.ajax({
      url: "/users/monthly_paid_earnings",
      success: function(data){
        jQuery("#current-earnings").hide();
        jQuery("#preferences").hide();

        jQuery("#previous-earnings").show();
        jQuery("#previous-earnings").html(data);


        jQuery('a[id*="earnings-link-"]').bind('click', function() {
          jQuery('div[id*="earnings-container"]').hide();
          jQuery(jQuery(this).attr('value')).show();
        });

        jQuery('a[id*="hide-earnings-"]').bind('click', function() {
          jQuery('div[id*="earnings-container"]').show();
          jQuery(jQuery(this).attr('value')).hide();
        });

        bind_functions();
      }
    })
  });

  jQuery('#preferences-link').click(function() {
    jQuery.ajax({
      url: "/users/payment_preferences",
      success: function(data){
        jQuery("#current-earnings").hide();
        jQuery("#previous-earnings").hide();

        jQuery("#preferences").show();
        jQuery("#preferences").html(data);

        bind_functions();
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


function bind_functions() {

  jQuery('#previous-earnings-link').bind('click', function() {
    jQuery('#preferences-link').css("text-decoration","none");
    jQuery('a[id*=earnings-link]').css("text-decoration","none");
    jQuery(this).css("text-decoration","underline");
    jQuery(jQuery(this).attr('href')).show();

    jQuery('#earnings-link').css("text-decoration","underline");
  });

  jQuery('#preferences-link').bind('click', function() {
    jQuery('#preferences-link').css("text-decoration","none");
    jQuery('a[id*=earnings-link]').css("text-decoration","none");
    jQuery(this).css("text-decoration","underline");
    jQuery(jQuery(this).attr('href')).show();

    jQuery('#earnings-link').css("text-decoration","underline");
  });

  jQuery('#current-earnings-link').bind('click', function() {
    jQuery('a[id*=earnings-link]').css("text-decoration","none");
    jQuery('#preferences-link').css("text-decoration","none");
    jQuery(this).css("text-decoration","underline");
    jQuery(jQuery(this).attr('href')).show();

    jQuery('#earnings-link').css("text-decoration","underline");
  });
}
