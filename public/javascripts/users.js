$('document').ready(function(){

  $('#messages-link').click(function() {
    $('#earnings-link').css("text-decoration","none");
  });

  $('#purchase-link').click(function() {
    $.ajax({
      url: "/users/purchases",
      success: function(data){
        $("#purchases").show();
        $("#purchases").html(data);
      }
    })
    $('#earnings-link').css("text-decoration","none");
  });

  $('#listings-link').click(function() {
    $.ajax({
      url: "/users/listings",
      success: function(data){
        $("#listings").html(data);
        $("#listings").show();
      }
    })
    $('#earnings-link').css("text-decoration","none");
  });

  $('#current-earnings-link, #earnings-link').click(function() {
    $('#current-earnings-link').css("text-decoration","underline");

    $.ajax({
      url: "/users/pending_earnings",
      success: function(data){
        $("#previous-earnings").hide();
        $("#preferences").hide();

        $("#current-earnings").show();
        $("#current-earnings").html(data);

        bind_functions();
      }
    })
  });

  $('#previous-earnings-link').click(function() {
    $.ajax({
      url: "/users/monthly_paid_earnings",
      success: function(data){
        $("#current-earnings").hide();
        $("#preferences").hide();

        $("#previous-earnings").show();
        $("#previous-earnings").html(data);


        $('a[id*="earnings-link-"]').bind('click', function() {
          $('div[id="monthly-payments-header"]').hide();
          $('div[id*="earnings-container"]').hide();
          $($(this).attr('value')).show();
        });

        $('a[id*="hide-earnings-"]').bind('click', function() {
          $('div[id*="earnings-container"]').show();
          $('div[id="monthly-payments-header"]').show();
          $($(this).attr('value')).hide();
        });

        bind_functions();
      }
    })
  });

  $('#preferences-link').click(function() {
    $.ajax({
      url: "/users/payment_preferences",
      success: function(data){
        $("#current-earnings").hide();
        $("#previous-earnings").hide();

        $("#preferences").show();
        $("#preferences").html(data);

        bind_functions();
      }
    })
  });

});

function showTab(value)
{
	if(value == "signup")
	{
		$("#signup-tab").addClass("active");
		document.getElementById('signup-body').style.display = "block"

		$("#login-tab").removeClass("active");
		document.getElementById('login-body').style.display = "none"
		return true;
	}
	else if(value == "login")
	{
		document.getElementById('signup-body').style.display = "none"
		document.getElementById('login-body').style	.display = "block"

		$("#login-tab").addClass("active");
		$("#signup-tab").removeClass("active");
	}
}


function bind_functions() {

  $('#previous-earnings-link').bind('click', function() {
    $('#preferences-link').css("text-decoration","none");
    $('a[id*=earnings-link]').css("text-decoration","none");
    $(this).css("text-decoration","underline");
    $($(this).attr('href')).show();

    $('#earnings-link').css("text-decoration","underline");
  });

  $('#preferences-link').bind('click', function() {
    $('#preferences-link').css("text-decoration","none");
    $('a[id*=earnings-link]').css("text-decoration","none");
    $(this).css("text-decoration","underline");
    $($(this).attr('href')).show();

    $('#earnings-link').css("text-decoration","underline");
  });

  $('#current-earnings-link').bind('click', function() {
    $('a[id*=earnings-link]').css("text-decoration","none");
    $('#preferences-link').css("text-decoration","none");
    $(this).css("text-decoration","underline");
    $($(this).attr('href')).show();

    $('#earnings-link').css("text-decoration","underline");
  });
}
