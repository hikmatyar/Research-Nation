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
