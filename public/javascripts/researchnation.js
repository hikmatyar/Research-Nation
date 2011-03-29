function validate(){
  status = true;
  if (jQuery("#name").val()=="")
  {
    jQuery("#name").css('border','3px solid #7F7F7F');
    status = false;
  }
  if (jQuery("#email").val()==""||!jQuery("#email").val().match(/^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})$/i))
  {
    jQuery("#email").css('border','3px solid #7F7F7F');
    status = false;
  }
  if (jQuery("#title").val()=="")
  {
    jQuery("#title").css('border','3px solid #7F7F7F');
    status = false;
  }
  if (jQuery("#details").val()=="")
  {
    jQuery("#details").css('border','3px solid #7F7F7F');
    status = false;
  }
  if (jQuery("#price").val()==""&&jQuery("#price").atrr('display','none'))
  {
    jQuery("#price").css('border','3px solid #7F7F7F');
    status = false;
  }
  return status;
}

jQuery(document).ready(function(){

  validate();
  jQuery('#option').change(function(){
    if(jQuery(this).val()=="Buy"){
      jQuery('#sell_fields').hide();
    }
    else
    {
      jQuery('#sell_fields').show();
    }
  });
  jQuery("#buying").click(function(){
      jQuery('#sell_fields').hide();
      new Ajax.Updater('results', '/main/buying_list', {asynchronous:true, evalScripts:true});
    });
  jQuery("#selling").click(function(){
    jQuery('#sell_fields').show();
    new Ajax.Updater('results', '/main/selling_list', {asynchronous:true, evalScripts:true});
  });
  new Ajax.Updater('results', '/main/buying_list', {asynchronous:true, evalScripts:true});

});

