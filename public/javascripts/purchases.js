jQuery(document).ready(function(){

   new Validation('purchase-resource');
   jQuery("#purchase-resource :input.tip").tooltip({

        position: "center right", // place tooltip on the right edge
        offset: [-2, 10], // a little tweaking of the position
        effect: "fade", //use the built-in fadeIn/fadeOut effect
        opacity: 0.7  // custom opacity setting

    });

    jQuery("#order_first_name").click(function(){
        jQuery(this).val("");
        jQuery(this).unbind("click");
    });
    jQuery("#order_last_name").click(function(){
        jQuery(this).val("");
        jQuery(this).unbind("click");
    });

});
