jQuery(document).ready(function(){

   valid = new Validation('purchase-resource');
   var validator = new Validation('purchase-resource', { onFormValidate: show_processing });

   jQuery("#purchase-resource :input.tip").tooltip({

        position: "center right", // place tooltip on the right edge
        offset: [-2, 10], // a little tweaking of the position
        opacity: 0.7  // custom opacity setting
    });

});

function show_processing(validated, form){
   if(validated){
      jQuery("input:submit").val("Processing...");
      jQuery("input:submit").css("background","#e5a110");
   }
   else
   {
      jQuery("input:submit").val("Submit");
      jQuery("input:submit").css("background","#8EAF32");
   }
}
