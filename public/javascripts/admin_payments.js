$('document').ready(function(){

  if ($('#pending-earnings-link')){
    pending_earnings_container();
  }

  $('#pending-earnings-link').click(function() {
    pending_earnings_container();
  });

  $('#paid-earnings-link').click(function() {
    $.ajax({
      url: "/users/monthly_paid_earnings",
      data: "user_id=" + getParameterByName("user_id"),
      success: function(data){

        $('#paid-earnings-link').css("text-decoration","underline");
        $('#pending-earnings-link').css("text-decoration","none");

        $("#pending-earnings").hide();
        $("#paid-earnings").show();
        $("#paid-earnings").html(data);

        $('a[id^="paid-earnings-link-"]').bind('click', function() {
          $('div[id*="earnings-container"]').hide();
          $($(this).attr('value')).show();
        });

        $('a[id^="paid-hide-earnings-"]').bind('click', function() {
          $($(this).attr('value')).hide();
          $('div[id*="earnings-container"]').show();
        });

      }
    });
  });


  $('a[id^="pending-pay-button-"]').click(function() {
    $.ajax({
      url: "/admin/pay_pending_payments",
      data: "user_id=" + getParameterByName("user_id") + "&date=" + $(this).attr('value'),
      success: function(data){
        $('#paid-earnings-link').trigger('click');
      }
    });
  })

});

function pending_earnings_container(){
  $.ajax({
    url: "/users/monthly_pending_earnings",
    data: "user_id=" + getParameterByName("user_id"),
    success: function(data){
      $('#pending-earnings-link').css("text-decoration","underline");
      $('#paid-earnings-link').css("text-decoration","none");

      $("#paid-earnings").hide();
      $("#pending-earnings").show();
      $("#pending-earnings").html(data);

      $('a[id^="pending-earnings-link-"]').bind('click', function() {
        $('div[id*="earnings-container"]').hide();
        $($(this).attr('value')).show();
      });

      $('a[id^="pending-hide-earnings-"]').bind('click', function() {
        $($(this).attr('value')).hide();
        $('div[id*="earnings-container"]').show();
      });

      $('a[id^="pending-pay-button-"]').bind('click', function() {
        $.ajax({
          url: "/admin/pay_pending_payments",
          data: "user_id=" + getParameterByName("user_id") + "&date=" + $(this).attr('value'),
          success: function(data){
            $('#paid-earnings-link').trigger('click');
          }
        });
      });

    }
  })
}

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
