// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$(function(){
  /* preload some images */
  $.preloadImages(
    '/images/loading.gif',
    '/images/validation_success.png',
    '/images/validation_error.png'
  );

  /* flash messages */
  $("#flash .message a.close").click(function() {
    $(this).parents('.message').fadeOut("slow").remove();
    if ($('#flash .message').length == 0) {
      $('#flash').hide();
    }
  });

  /* feedback popup */
  $('#feedbackPopup').jqm().jqmAddTrigger('#feedbackLink, .feedbackLink');

  var $submit = $('#feedbackPopup form .submit input');

  var before_fn = function() {
    $submit.attr('disabled', 'disabled');
    $submit.after('<img class="formLoading" src="/images/loading.gif" alt="loading..." />');
  };

  var success_fn = function() {
    $submit.removeAttr('disabled');
    $submit.siblings('img').remove();
  };

  $('#feedbackPopup form').ajaxForm({dataType: 'script', beforeSubmit: before_fn, success: success_fn});
});
