jQuery(document).ready(function(){

  new Ajax.Updater('results', '/main/selling_list' , {asynchronous:true, evalScripts:true});
  jQuery("form").submit(function(){
 
  jQuery(".error").each(function(){
    jQuery(this).text("");
  })

  var user_name = jQuery("#name").val();
  var email = jQuery("#email").val();
  var title = jQuery("#title").val();
  var details = jQuery("#details").val();
  var price = jQuery("#price").val();
 
  jQuery("#name").css('border','1px solid #7F7F7F');
  jQuery("#email").css('border','1px solid #7F7F7F');
  jQuery("#title").css('border','1px solid #7F7F7F');
  jQuery("#details").css('border','1px solid #7F7F7F');
  jQuery("#price").css('border','1px solid #7F7F7F');

  var status = true; 
  if (user_name=="" || Number(user_name))
  {
    jQuery("#name").css('border','3px solid red');
    jQuery("#name").after("<i class='error'>Name Should not be blank or a number</i>");
    status = false;
  }

  if (email =="" || !email.match(/^([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})$/i))
  {
    jQuery("#email").after("<i class='error'>Email should not be blank or invalid");
    jQuery("#email").css('border','3px solid red');
    status = false;
  }

  if (title=="" || title.length > 140)
  {
    jQuery("#title").after("<i class='error'>Title should not be left blank or greater than 140 characters");
    jQuery("#title").css('border','3px solid red');
    status = false;
  }

  if (details.length > 700)
  {
    jQuery("#details").after("<i class='error'>Details should not be more than 700 characters");
    jQuery("#details").css('border','3px solid red');
    status = false;
  }

  if ((price == "" && !jQuery("#sell_fields").attr('style')=="display: none;") || Number(price) > 1000 ||  !Number(price))
  {
    jQuery("#price").after("<i class='error'>Price should not be blank or greater than 1000");
    jQuery("#price").css('border','3px solid red');
    status = false;
  }

  if(status==true){
    return true;
  }
  return false;
  });
  list = "selling_list"

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
      new Ajax.Updater('results', '/main/selling_list', {asynchronous:true, evalScripts:true});
    });
  jQuery("#selling").click(function(){
    jQuery('#sell_fields').show();
    new Ajax.Updater('results', '/main/selling_list', {asynchronous:true, evalScripts:true});
  });

});

