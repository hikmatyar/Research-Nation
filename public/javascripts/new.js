$(function(){
  /* show budget & deadline form options */
  $("#addBudgetLink").click(function(){
    $("#budget").toggle();
    $("#budget #request_budget").focus();
    $("#addBudgetLink").toggle();
  });

  $("#addDeadlineLink").click(function(){
    $("#deadline").toggle();
    $("#deadline #request_deadline").focus();
    $("#addDeadlineLink").toggle();
  });

  /* close budget & deadline form options */
  $("#closeBudgetLink").click(function(){
    $("#budget").toggle();
    $("#addBudgetLink").toggle();

    /* reset value to nothing */
    $("input#request_budget").val('');
  });

  $("#closeDeadlineLink").click(function(){
    $("#deadline").toggle();
    $("#addDeadlineLink").toggle();

    /* reset selected item to first item in list */

    $("select#request_deadline option").removeAttr('selected');
    $('select#request_deadline option[value=""]').attr('selected', 'selected');

  });
});
