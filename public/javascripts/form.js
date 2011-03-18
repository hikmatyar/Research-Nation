$(function(){
  /* form input label overlays */
  $('input.overlay, textarea.overlay').each(function(){
    var $this = $(this);
    var $prev_label = $this.parent().hasClass('fieldWithErrors')
      ? $this.parent().prev().children('label.overlay')
      : $this.prev('label.overlay');

    var hideLabel = function() {
      if ($this.val() == '') {
        $prev_label.show();
      } else {
        $prev_label.hide();
      }
    };

    $this.change(hideLabel)
    $this.keyup(hideLabel);

    /* dim labels on input focus */
    $this.focus(function(){
      $prev_label.addClass('overlayFocused');
    });

    $this.blur(function(){
      $prev_label.removeClass('overlayFocused');
    });

  });

  /* initialize label overlays for empty fields */
  $('label.overlay').each(function(){
    var $next_input = $(this).parent().hasClass('fieldWithErrors')
      ? $(this).parent().next().children('input.overlay, textarea.overlay')
      : $(this).next('input.overlay, textarea.overlay');
    if ($next_input.val() == '') {
      $(this).show();
    }
  });

  /* focus first input on load */
  $('*[tabindex=1]').focus();
});
