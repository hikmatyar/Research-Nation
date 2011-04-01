function validate(){

  status = true;
  var user_name = jQuery("#name").val();
  var email = jQuery("#email").val();
  var title = jQuery("#title").val();
  var details = jQuery("#details").val();
  var price = jQuery("#price").val();

  if (jQuery("#option").val()=="Select One")
  {
    jQuery("#option").css('border','5px solid #7F7F7F');
    status = false;
  }
  if (user_name=="")
  {

    jQuery("#name").css('border','3px solid #7F7F7F');
    status = false;
  }

  if (email =="" || !email.match(/^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})$/i))
  {

    jQuery("#email").css('border','3px solid #7F7F7F');
    status = false;
  }

  if (title=="")
  {
    jQuery("#title").css('border','3px solid #7F7F7F');
    status = false;
  }

  if (details=="")
  {
    jQuery("#details").css('border','3px solid #7F7F7F');
    status = false;
  }

  if (price == "" && !jQuery("#sell_fields").attr('style')=="display: none;" || Number(price) > 1000 ||  !Number(price))
  {
    jQuery("#price").css('border','3px solid #7F7F7F');
    status = false;
  }
  return status;
}

jQuery(document).ready(function(){

  list = location.href.split("=")[1]
  if (!list){
    list = "buying_list"
  }
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
      new Ajax.Updater('results', '/main/'+list, {asynchronous:true, evalScripts:true});
    });
  jQuery("#selling").click(function(){
    jQuery('#sell_fields').show();
    new Ajax.Updater('results', '/main/'+list, {asynchronous:true, evalScripts:true});
  });
  new Ajax.Updater('results', '/main/'+list , {asynchronous:true, evalScripts:true});

});
