jQuery(document).ready(function(){

   new Validation('purchase-resource');
   jQuery("#purchase-resource :input.tip").tooltip({

        position: "center right", // place tooltip on the right edge
        offset: [-2, 10], // a little tweaking of the position
        effect: "fade", //use the built-in fadeIn/fadeOut effect
        opacity: 0.7  // custom opacity setting

    });

   if (document.getElementById("terms_link"))
   {
     document.getElementById("terms_link").onclick = show_terms;
   }

   function show_terms()
   {
     window.open("/resources/user_terms_and_conditions/<%= @resource.id %>","terms_and_conditions","location=1,status=1,scrollbars=1, width=250,height=250, screenX=900, screenY=250");
   }

});
