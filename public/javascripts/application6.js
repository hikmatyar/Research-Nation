// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function textCounter(field,cntfield,maxlimit) {
	if (field.value.length > maxlimit) {
		// if too long...trim it!
		field.value = field.value.substring(0, maxlimit);
	} else {
		// otherwise, update 'characters left' counter
		cntfield.innerHTML = maxlimit - field.value.length;
	}
}

function rollover(element, original_state_class, new_state_class) {
	jQuery("#" + element)
		.addClass(new_state_class)
		.removeClass(original_state_class);
}

/* Calendar Stuff */

function calendar_is_not_set_date(date_field) { return (!date_field.value || ('mm/dd/yyyy'==date_field.value)) }

function calendar_process_onfocus(field) {
	if (calendar_is_not_set_date(field)) field.onclick();
}

function process_checkin_onclick(checkout_field){
    $(checkout_field).onclick();
}

function calendar_helper_simple_today() {
	var dt = new Date();
	dt.setHours(0);
	dt.setMinutes(0);
	dt.setSeconds(0);
	dt.setMilliseconds(0);
	return dt;
}

function calendar_show_cal(field,position,checkout_field) {
    if(arguments.length < 3){
        checkout_field = 'checkout';
    }

	position = typeof(position) != 'undefined' ? position : 'absolute';
	
	var default_offset = 0;

	/* Override for special offers
	 *   and
	 * Only popup checkout calendar if checkout date is not already set
	 */
    if(checkout_field == 'one_calendar_override' || !calendar_is_not_set_date($(checkout_field))){
        return new CalendarDateSelect(field, {/*popup_by:$('lwlb_date_span_start'), */position:position,month_year:'label',buttons:true, clear_button:true,default_date_offset:default_offset, year_range:[new Date().getFullYear(),new Date().getFullYear()+2], valid_date_check:function (dt){ return(dt >= calendar_helper_simple_today()); } /*, onchange:function(){return true;} */ } );
    }else{
        return new CalendarDateSelect(field, {/*popup_by:$('lwlb_date_span_start'), */position:position,month_year:'label',buttons:true, clear_button:true,default_date_offset:default_offset, year_range:[new Date().getFullYear(),new Date().getFullYear()+2], valid_date_check:function (dt){ return(dt >= calendar_helper_simple_today()); }, onchange:function(){process_checkin_onclick(checkout_field);} } );
    }
}

function calendar_show_cal_checkout(field,checkin_field,position) {
	position = typeof(position) != 'undefined' ? position : 'absolute';

	var must_be_after_this_date = new Date();
	if (!calendar_is_not_set_date($(checkin_field))) {
		must_be_after_this_date = Date.parse($(checkin_field).value);
	}
	if (isNaN(must_be_after_this_date)) {
		must_be_after_this_date = new Date();
	}

	var default_offset = Math.ceil((must_be_after_this_date - new Date())/(24*60*60*1000)) + 1;
	return new CalendarDateSelect(field, {/*popup_by:$('lwlb_date_span_start'),*/ position:position,month_year:'label',buttons:true, clear_button:true, default_date_offset:default_offset, year_range:[new Date().getFullYear(),new Date().getFullYear()+2], valid_date_check:function (dt){ return(dt > must_be_after_this_date); } } );
}

/* Censoring */

var re_airbnb = /airbnb\.com/;


// Very simplified --- any of these things probably signifiy a website
var re_http = /(ftp|http|https):\/\//i;
var re_www = /www\.\w+/i;
var re_domain_ext = /\w+\.(com|net|org|biz|ws|name)/i;

//var re_phone_number = /[0-9 \-\(\)\.\+\\=]{9,100}\d/; // allow / since it commonly used in dates 1/1/2010
var re_phone_number = /([0-9]{3,9}[\- ]?){3,9}/; 

var re_phone_word = /((zero|one|two|three|four|five|six|seven|eight|nine)\W+){6,100}/i;

var re_email = /\w+(\.\w+){0,1}(@)[\w|\-]+(\.|\W{1,3}dot\W{1,3})\w+/;
var re_email_domain = /( aol|gmail|hotmail|msn|yahoo)(\.com){0,1}/i;

var censor_attempt_counter = 0;

function censor_validate_content(message,show_warning) {

    if (re_airbnb.test(message)) {
      return(true); // if the message refers to airbnb.com, then we give it a free pass
    }

    var is_website = (re_http.test(message) || re_www.test(message) || re_domain_ext.test(message));
	var is_phone = (re_phone_number.test(message) || re_phone_word.test(message));
	var is_email = (re_email.test(message) || re_email_domain.test(message));
	
	if (is_website || is_phone || is_email) {
		censor_attempt_counter++;
		
		if ((censor_attempt_counter>3) && show_warning) {
			alert("Warning: It appears you trying to send contact information. 100% of scams begin with contact information being exchanged and ultimately exchanging money offline. If you follow the rules, you are 100% protected against scams. If you believe your message does not contain a website, phone number, or e-mail address, then e-mails us at contact@airbnb.com and we can help.");
		} else {
			alert('It appears as though you entered a website, phone number, or e-mail address. This information cannot be exchanged until after the booking is complete for your protection. Scams can only occur if you exchange money outside of the system. Please edit your message and try again.');
		}
		return(false);
	}

    // make sure there is a message
    //if ((message=="Type message here...") || (message==""))  {
    //    alert('Please enter a message to send.');
    //    return (false);
    //}

	return(true);
}


/* Lightweight lightbox */

function lwlb_show(id,options) {
    if (!options) options = {};
    
	$('lwlb_overlay').style.display = 'block';
	$(id).style.display = 'block';
	if (!options.no_scroll) window.scroll(0,0);
}
function lwlb_hide(id) {
	$(id).hide();
	$('lwlb_overlay').hide();
}

function pluralize(count,word) {
	return(count+" "+word+((count==1) ? '' : 's'));			
}

/* Dashboard */

function show_options(thread_id){
    star_el = jQuery("div#thread_"+thread_id+"_starred");
    if(!star_el.hasClass('permashow')){
        star_el.fadeIn(50); 
    }
    hidden_el = jQuery("div#thread_"+thread_id+"_hidden")
    if(!hidden_el.hasClass('permashow')){
        hidden_el.fadeIn(50); 
    }

}
function hide_options(thread_id){
    hidden_el = jQuery("div#thread_"+thread_id+"_hidden")
    if(!hidden_el.hasClass('permashow')){
        hidden_el.fadeOut(50); 

        star_el = jQuery("div#thread_"+thread_id+"_starred");
        if(!star_el.hasClass('permashow')){
            star_el.fadeOut(50); 
        }
    }
}

/* Page 3 */
function select_tab(category, content_id, selected_li){
    jQuery('.' + category + '_link').removeClass('selected');
    selected_li.addClass('selected');
    jQuery('#' + content_id).show();
    jQuery('.' + category + '_content').hide();
    jQuery('#' + content_id).show();
}

var newWin = null;
function popup(strURL, strType, strHeight, strWidth) {  
    if (newWin != null && !newWin.closed) { 
        newWin.close();
        var strOptions=""; 
    }

    if (strType=="console"){ strOptions="resizable,height="+strHeight+",width="+strWidth;  }
    if (strType=="fixed") { strOptions="status,height="+  strHeight+",width="+strWidth;  }
    if (strType=="elastic"){ strOptions="toolbar,menubar,scrollbars,"+  "resizable,location,height="+  strHeight+",width="+strWidth; } 

    newWin = window.open(strURL, 'newWin', strOptions);  
    newWin.focus();  
}

/* 
 * extend jQuery to support cookies
*/
var DEFAULT_COOKIE_OPTIONS = { path: '/', expires: 30 };

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // NOTE Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

function save_page3_view_to_cookie(hosting_id){
    add_data_to_cookie('viewed_page3_ids', hosting_id);
}

/* 
 * mark_viewed_page_links();
 *
 * 1) Grab each text link on the page that matches rooms/[0-9]+
 * 2) Add class='visited' to those links if the room ID is stored in 'viewed_page3_ids' cookie
*/

function mark_viewed_page_links(){
    page3_ids = get_viewed_page3_ids();

    if(page3_ids == false){
        return false;
    }

    $$('a').each(function(e){
        e.href.scan(/rooms\/([0-9]+)/, function(match){
            if((e.down() == null) || (e.down().tagName.toLowerCase() != 'img')){
                if(page3_ids.indexOf(match[1]) != -1){
                    e.addClassName('visited');
                    e.up().previous('a').addClassName('visited');
                }
            }
        });
    });
}

function get_viewed_page3_ids(){
    comma_separated_page3_ids = jQuery.cookie('viewed_page3_ids');

    if(comma_separated_page3_ids != null){
        array_of_page3_ids = comma_separated_page3_ids.split(',');
        array_of_page3_ids = array_of_page3_ids.uniq();

        return array_of_page3_ids;
    }

    return false;
}

//assumes cookie exists
function add_data_to_cookie(cookie_name, val){
    existing_data = jQuery.cookie(cookie_name);

    if(existing_data == null){
        new_data = val;
    }else{
        //Note: you can lose 1 piece of data when viewing your 75 place, if you view it twice in a row. Performance tradeoff.
        new_data = existing_data + ',' + val;
        new_data = new_data.split(',');

        while(new_data.length > 75){
            new_data.splice(0,1);
        }

        new_data = new_data.uniq();
        new_data = new_data.join(',');
    }

    jQuery.cookie(cookie_name, new_data, DEFAULT_COOKIE_OPTIONS);
}

function show_super_lightbox(lb_id){
    jQuery('#transparent_bg_overlay').fadeIn(40);
    jQuery('#'+lb_id).fadeIn(40);
    jQuery('#transparent_bg_overlay').click(function(){
        hide_super_lightbox(lb_id);
    });
}

function hide_super_lightbox(lb_id){
    jQuery('#'+lb_id).fadeOut(40);
    jQuery('#transparent_bg_overlay').fadeOut(40);
    jQuery('#transparent_bg_overlay').unbind('click');
}

//console log wrapper, will only log into firebug, preventing breakage in other browsers
function log(dataToLog){
    if (window.console && window.console.firebug) {
        console.log(dataToLog);
    }
}

Array.prototype.unique = function(){
    var vals = this;
    var uniques = [];
    for(var i=vals.length;i--;){
        var val = vals[i];  
        if(jQuery.inArray( val, uniques )===-1){
            uniques.unshift(val);
        }
    }
    return uniques;
} 

//left string pad only
jQuery.leftPad = function(input, totalStringLength, paddingChar) {
    var output = input.toString();
    if (!paddingChar) { paddingChar = '0'; }
    while (output.length < totalStringLength) {
        output = paddingChar + output;
    }
    return output;
};


function scrollToById(el_id){
    jQuery('html,body').animate({scrollTop: jQuery("#"+el_id).offset().top},'fast');
}



/* LazyLoad 2.0 http://wonko.com/post/lazyload-200-released */
LazyLoad=function(){var f=document,g,b={},e={css:[],js:[]},a;function j(l,k){var m=f.createElement(l),d;for(d in k){if(k.hasOwnProperty(d)){m.setAttribute(d,k[d])}}return m}function h(d){var l=b[d];if(!l){return}var m=l.callback,k=l.urls;k.shift();if(!k.length){if(m){m.call(l.scope||window,l.obj)}b[d]=null;if(e[d].length){i(d)}}}function c(){if(a){return}var k=navigator.userAgent,l=parseFloat,d;a={gecko:0,ie:0,opera:0,webkit:0};d=k.match(/AppleWebKit\/(\S*)/);if(d&&d[1]){a.webkit=l(d[1])}else{d=k.match(/MSIE\s([^;]*)/);if(d&&d[1]){a.ie=l(d[1])}else{if((/Gecko\/(\S*)/).test(k)){a.gecko=1;d=k.match(/rv:([^\s\)]*)/);if(d&&d[1]){a.gecko=l(d[1])}}else{if(d=k.match(/Opera\/(\S*)/)){a.opera=l(d[1])}}}}}function i(r,q,s,m,t){var n,o,l,k,d;c();if(q){q=q.constructor===Array?q:[q];if(r==="css"||a.gecko||a.opera){e[r].push({urls:[].concat(q),callback:s,obj:m,scope:t})}else{for(n=0,o=q.length;n<o;++n){e[r].push({urls:[q[n]],callback:n===o-1?s:null,obj:m,scope:t})}}}if(b[r]||!(k=b[r]=e[r].shift())){return}g=g||f.getElementsByTagName("head")[0];q=k.urls;for(n=0,o=q.length;n<o;++n){d=q[n];if(r==="css"){l=j("link",{href:d,rel:"stylesheet",type:"text/css"})}else{l=j("script",{src:d})}if(a.ie){l.onreadystatechange=function(){var p=this.readyState;if(p==="loaded"||p==="complete"){this.onreadystatechange=null;h(r)}}}else{if(r==="css"&&(a.gecko||a.webkit)){setTimeout(function(){h(r)},50*o)}else{l.onload=l.onerror=function(){h(r)}}}g.appendChild(l)}}return{css:function(l,m,k,d){i("css",l,m,k,d)},js:function(l,m,k,d){i("js",l,m,k,d)}}}();

jQuery(document).ready(function() {
   
   jQuery("#language_currency_display").toggle(function(){
      jQuery('#language_currency_selector_container').show();
       jQuery('#language_currency_display').addClass('selected');
   }, function(){
      jQuery('#language_currency_selector_container').hide();
       jQuery('#language_currency_display').removeClass('selected');

   });

   jQuery("#language_currency").mouseleave(function(ev) {
     
        if (jQuery('#language_currency_selector_container').is(':visible') && !(jQuery(ev.relatedTarget).parents().index(jQuery('#language_currency_selector_container')) >= 0) ) {
       jQuery('#language_currency_display').click();
        }
        });



    jQuery("#language_currency_selector li.language").click(function() {
        jQuery(this).effect('pulsate', {times:10}, 1000);
        jQuery("#language_currency_selector").css('cursor', 'progress');
      jQuery.post('/users/change_locale', {new_locale: jQuery(this).attr('name')}, function(response){
          window.location.reload(true);
      });
    });

    jQuery("#language_currency_selector li.currency").click(function() {
           jQuery(this).effect('pulsate', {times:10}, 1000);
        jQuery("#language_currency_selector").css('cursor', 'progress');
      jQuery.post('/users/change_currency', {new_currency: jQuery(this).attr('name')}, function(response){
          window.location.reload(true);
      });
    });
});

/* implement indexOf for ie7 */
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}

(function($){

 /**
  * This plugin initializes two jQuery datepicker widgets, one representing the start date,
  * and the other representing the end date. It does a lot of stuff to make sure that
  * the date ranges specified are valid (e.g. that the start date isn't after the end date).
  *
  * It expects the following DOM structure (note the class names on the input fields):
  *
  *     <form id="my_awesome_form">
  *         <input class="checkin" type="text" />
  *         <input class="checkout" type="text" />
  *     </form>
  *
  * You initialize it via the following:
  *
  *     jQuery('#my_awesome_form').airbnbInputDateSpan();
  *
  * This plugin takes the following options into the initializer:
  *
  * defaultsCheckin:    an options hash to the checkin datepicker object
  * defaultsCheckout:   an options hash to the checkout datepicker object
  * onCheckinClose:     (OPTIONAL) a handler for the 'close' event of the checkin datepicker object
  * onCheckoutClose:    (OPTIONAL) a handler for the 'close' event of the checkout datepicker object
  * onSuccess:          (OPTIONAL) a handler for when all date fields are valid
  * checkin:            (OPTIONAL) a selector for the the DOM element representing the start date field
  * checkout:           (OPTIONAL) a selector for the the DOM element representing the end date field
  * 
  * This plugin also responds to the following methods:
  *
  * enableClearDatesButton - enables the 'clear dates' button in the datepicker
  */
  $.fn.airbnbInputDateSpan = function(options){
    var defaultCalendarOptions = { dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                                   minDate: 0, 
                                   maxDate: '+2Y',
                                   nextText: '', //intentionally blank
                                   prevText: '', //intentionally blank
                                   numberOfMonths: 1,
                                   showButtonPanel: true,
                                   closeText: "Clear Dates",
                                   currentText: "Today" }; 

    if(options == null)
      options = {};

    if(typeof options == "string"){
      var settings = jQuery(this).data('airbnb-datepickeroptions');

      if(options == "enableClearDatesButton"){
        jQuery('.ui-datepicker-close').live('click', function () {
          var checkinEl = settings['checkinDatePicker'];
          var checkoutEl = settings['checkoutDatePicker'];

          checkinEl.datepicker('option', 'minDate', '+0');
          checkinEl.val('mm/dd/yyyy');

          checkoutEl.datepicker('option', 'minDate', '+1');
          checkoutEl.val('mm/dd/yyyy');

          jQuery('#search_inputs').css("background-color", '#ffe75f');
        });
      }
    }
    else if(typeof options == "object"){
      var _ref = jQuery(this);

      var dateRegex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/;

      var defOpts = {checkinDatePicker: jQuery(options['checkin']),
                     checkoutDatePicker: jQuery(options['checkout']),
                     onSuccessCallback: options['onSuccess'],
                     onCheckinClose: options['onCheckinClose'],
                     onCheckoutClose: options['onCheckoutClose']};

      // set the default behavior if none was specified
      if(options['defaultsCheckin'] == null)
        options['defaultsCheckin'] = defaultCalendarOptions;

      if(options['defaultsCheckout'] == null)
        options['defaultsCheckout'] = defaultCalendarOptions;

      if(options['checkin'] == null)
        defOpts['checkinDatePicker'] = _ref.find('input.checkin');

      if(options['checkout'] == null)
        defOpts['checkoutDatePicker'] = _ref.find('input.checkout');

      // initialize the callback handlers to blank functions if the user didn't pass any in
      // the options hash
      jQuery.each(["onSuccessCallback", "onCheckinClose", "onCheckoutClose"], function(i, val){
        if(defOpts[val] == null)
          defOpts[val] = function(){};
      });

      // save datepicker settings in a reference
      _ref.data('airbnb-datepickeroptions', defOpts);

      //we have to extend a deep copy of defaultCalendarOptions otherwise bad things happen
      var checkinCalendarOptions = jQuery.extend(jQuery.extend(true, {}, options['defaultsCheckin']), { 
        onClose: function(dateText, inst) { 
          var opts = _ref.data('airbnb-datepickeroptions');

          if(dateText === 'mm/dd/yyyy') {
          } else {
              var nextDate = new Date(dateText);

              nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));

              var checkoutEl = opts['checkoutDatePicker'];

              if((checkoutEl.val().toString()).match(dateRegex)){
                  var checkoutDate = new Date(checkoutEl.val());

                  checkoutEl.datepicker('option', 'minDate', nextDate);

                  if(nextDate > checkoutDate){
                      checkoutEl.val([jQuery.leftPad(nextDate.getMonth() + 1, 2), jQuery.leftPad(nextDate.getDate(), 2), nextDate.getFullYear()].join('/'));
                      checkoutEl.datepicker('show');
                  }
              } else {
                  checkoutEl.datepicker('option', 'minDate', nextDate);
                  checkoutEl.val([jQuery.leftPad(nextDate.getMonth() + 1, 2), jQuery.leftPad(nextDate.getDate(), 2), nextDate.getFullYear()].join('/'));

                  checkoutEl.datepicker('show');
              }
          }

          opts['onCheckinClose']();
        }
      });

      var checkoutCalendarOptions = jQuery.extend(jQuery.extend(true, {}, options['defaultsCheckout']), {
        onClose: function(dateText, inst) { 
          var opts = _ref.data('airbnb-datepickeroptions');

          if(dateText === 'mm/dd/yyyy') {
          } else {
              var prevDate = new Date(dateText);
              prevDate = new Date(prevDate.setDate(prevDate.getDate() - 1));

              var checkinEl = opts['checkinDatePicker'];

              if((checkinEl.val().toString()).match(dateRegex)){
                  var checkinDate = new Date(checkinEl.val());

                  if(prevDate < checkinDate){
                      checkinEl.val([jQuery.leftPad(prevDate.getMonth() + 1, 2), jQuery.leftPad(prevDate.getDate(), 2), prevDate.getFullYear()].join('/'));
                      checkinEl.datepicker('show');
                  } 
                  else {
                    jQuery('#search_inputs').css("background-color", '#ececec');
                    opts['onSuccessCallback']();
                  }
              } else {
                  jQuery('#search_inputs').css("background-color", '#ffe75f');
                  checkinEl.val([jQuery.leftPad(prevDate.getMonth() + 1, 2), jQuery.leftPad(prevDate.getDate(), 2), prevDate.getFullYear()].join('/'));

                  checkinEl.datepicker('show');
              }
          }
          opts['onCheckoutClose']();
        }
      });

      defOpts['checkinDatePicker'].datepicker(checkinCalendarOptions);
      defOpts['checkoutDatePicker'].datepicker(checkoutCalendarOptions);
  
      var settings = _ref.data('airbnb-datepickeroptions');
      
      jQuery('.ui-datepicker-close').live('click', function () {
        var checkinEl = settings['checkinDatePicker'];
        var checkoutEl = settings['checkoutDatePicker'];

        checkinEl.datepicker('option', 'minDate', '+0');
        checkinEl.val('mm/dd/yyyy');

        checkoutEl.datepicker('option', 'minDate', '+1');
        checkoutEl.val('mm/dd/yyyy');

        jQuery('#search_inputs').css("background-color", '#ffe75f');
      });

    }
  };

})(jQuery);

/* Migrate old and place new JS into this little guy */
var Airbnb = {
    init : function(options){
        Airbnb.Utils.formatPhoneNumbers();

        Airbnb.Utils.isUserLoggedIn = options == null || options['userLoggedIn'] == null || !options['userLoggedIn'] ? false : true;

        /* fadeaway any and all elements with class .fadeaway */
        setTimeout('jQuery(".fadeaway").fadeOut(4000)', 4000);
    },

    /*
     * function Validator
     * returns true if your input passes validation, false if it does not
     *
     * type - a string identifying what you want to match, use CAPS
     * item - can be anything you please - The code you write defines it
     *
     * *note - passing undefined in either param will return false
     *
     * example usage: StringValidator.validate('email', 'smarkle@userinput.com')
     */
    StringValidator : {
        Regexes : {
            url : /https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?/,
            //email : /^[a-zA-Z0-9\.\+]{1,63}@[a-zA-Z0-9]{2,63}(\.[a-zA-Z]{2,4}){1,2}$/, //get a real email validator!!!
            email : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            date : /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/,
            //This checks to see if there are at 10 - 15 digits in the phone number field
            phone : /((.*)?\d(.*?)){10,15}/
        },

        validate : function(type, item){
            if(type === undefined || item === undefined || typeof item != 'string'){ // || typeof Regex[type] != Regex
                return false;
            }

            return(item.match(Airbnb.StringValidator.Regexes[type]) !== null);

            return false;
        }
    },

    Bookmarks : {
        initializeStarIcons : function(callback){
            // add clickStar click handlers to the stars
            jQuery('.star_icon_container').clickStar(callback);
        },

        starredIds : []
    },

    Utils : {
        isUserLoggedIn : false,
        usingIosDevice : function() {
            return !((navigator.userAgent.indexOf('iPhone') == -1) && (navigator.userAgent.indexOf('iPod') == -1) && (navigator.userAgent.indexOf('iPad') == -1));
        },

        keyPressEventName : jQuery.browser.mozilla ? 'keypress' : 'keydown',

        /* takes labels with .inner_text class and puts them inside the text field */
        setInnerText : function(fieldsToClearOnSubmit){
            jQuery.each(jQuery('.inner_text'), function(index, e){

                var inputField = jQuery(e).next('input');
                var userVal = inputField.val();

                inputField.attr('defaultValue', e.innerHTML);
                inputField.val(e.innerHTML);

                if(userVal.length === 0){
                    //inputField.defaultValue = e.innerHTML;
                } else {
                    inputField.val(userVal);
                    inputField.addClass('active');
                }

                inputField.bind('focus', function(){
                    if(jQuery(inputField).val() == inputField.attr('defaultValue')) {
                        jQuery(inputField).val('');
                        global_test_var = jQuery(inputField);
                        jQuery(inputField).addClass('active');
                    }

                    jQuery(inputField).removeClass('error');

                    return true;
                });

                inputField.bind('blur', function(){

                    if(jQuery(inputField).val() === '') {
                        jQuery(inputField).removeClass('active');
                        jQuery(inputField).val(inputField.attr('defaultValue'));
                    } else {
                        jQuery(inputField).removeClass('error');
                    }
                });

                if(fieldsToClearOnSubmit){
                    fieldsToClearOnSubmit.push(inputField);
                }

                jQuery(e).remove();
            });

        },

        // if too long...trim it!
        // otherwise, update 'characters left' counter
        textCounter : function(field,countField,maxlimit) {
            if (field.val().length > maxlimit){
                field.val(field.val().substring(0, maxlimit));
            } else {
                countField.html(maxlimit - field.val().length);
            }
        },

        formatPhoneNumbers : function(){

            if(jQuery('.phone_number_to_format').length > 0){
         
                try {
                    var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
                }
                catch (err) {
                    log('validator not loaded...');

                    LazyLoad.js(['/javascripts/libphonenumber.compiled.js', '/javascripts/jquery.validatedphone.js'], function() {
                        //log('Loaded 2 files!');
                        Airbnb.Utils.formatPhoneNumbers();
                    });

                    return false;
                }

                jQuery('.phone_number_to_format').each(function(index, el){
                    el = jQuery(el);

                    try {
                        var number = phoneUtil.parseAndKeepRawInput(el.html(), 'US');
                        var formattedNumber = phoneUtil.format(number, i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);
                        el.html(formattedNumber);
                    }
                    catch (err) {
                        //log(err);
                    }
                });
            }
        },

        /*
         * selector = a jQuery CSS selector to target the element you want to cause a popup '#how_it_works_vid_screenshot'
         * */
        initHowItWorksLightbox : function(jQuerySelector) {
            var howItWorksEmbedCode = '<object id="video" width="764" height="458"><param name="movie" value="http://www.youtube.com/v/SaOFuW011G8?fs=1&amp;hl=en_US&amp;rel=0&amp;hd=1&amp;autoplay=1"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/SaOFuW011G8?fs=1&amp;hl=en_US&amp;rel=0&amp;hd=1&amp;autoplay=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="764" height="458"></embed></object>'

            Airbnb.Utils.initVideoLightbox(jQuerySelector, 'Airbnb.com - How It Works', howItWorksEmbedCode)

        },

        /*
         * selector = a jQuery CSS selector to target the element you want to cause a popup '#how_it_works_vid_screenshot'
         * */
        initVideoLightbox : function(jQuerySelector, title, embedCode) {
            if(jQuery('#video_lightbox_content').length == 0){
                jQuery('body').append('<div id="video_lightbox_content"></div>');
            }

            jQuery(jQuerySelector).colorbox({inline:true, href:"#video_lightbox_content", onLoad:function(){
                  jQuery('#video_lightbox_content').html(embedCode);
                }, 
                onComplete:function(){
                  jQuery('#cboxTitle').html(title);
                },
                onCleanup:function(){
                    jQuery('#video_lightbox_content').html('');
                    jQuery('#cboxTitle').html('');
                }
            });

        }


    },
    
    
    Currency : (function() {
        // Render shared currency partial to override default values - RL
      var my = {},
        currencyConversionTable,
        conversionValues = {'AUD' : 1.10004,'CAD' : 1.06408,'DKK' : 6.0803,'EUR' : 0.673737,'GBP' : 0.603590,'JPY' : 90.8836,'USD' : 1.0,'ZAR' : 7.64502615};
      
      currencyConversionTable = {
        'USD' : {
          symbol : "$",
          rate : 1
        },
        'EUR' : {
          symbol : "&euro;",
          rate : conversionValues.EUR
        },
        'DKK' : {
          symbol : "kr",
          rate : conversionValues.DKK
        },
        'CAD' : {
          symbol : "$",
          rate : conversionValues.CAD
        },
        'JPY' : {
          symbol : "&yen;",
          rate : conversionValues.JPY
        },
        'GBP' : {
          symbol : "&pound;",
          rate : conversionValues.GBP
        },
        'AUD' : {
          symbol : "$",
          rate : conversionValues.AUD
        },
        'ZAR' : {
          symbol : "R",
          rate : conversionValues.ZAR
        }
      };
      
      my.currencyConversionTable = currencyConversionTable;
      
      my.setCurrencyConversions = function(newTable) {
          for(var val in newTable) {
              if(newTable.hasOwnProperty(val)) {
                  currencyConversionTable[val].rate = newTable[val];
              }
          }
      };

      my.convert = function(amount, oldCurrency, newCurrency, rounded) {
        var value = amount * currencyConversionTable[newCurrency]['rate'] / currencyConversionTable[oldCurrency]['rate'];
        
        if(rounded) {
          return parseInt(Math.round(value));
        }
        return value;
      };

      my.getSymbolForCurrency = function(currency) {
        return currencyConversionTable[currency]['symbol'];
      };

      return my;
    }())
    

};

// ColorBox v1.3.15 - a full featured, light-weight, customizable lightbox based on jQuery 1.3+
// Copyright (c) 2010 Jack Moore - jack@colorpowered.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
(function(b,ib){var t="none",M="LoadedContent",c=false,v="resize.",o="y",q="auto",e=true,L="nofollow",m="x";function f(a,c){a=a?' id="'+i+a+'"':"";c=c?' style="'+c+'"':"";return b("<div"+a+c+"/>")}function p(a,b){b=b===m?n.width():n.height();return typeof a==="string"?Math.round(/%/.test(a)?b/100*parseInt(a,10):parseInt(a,10)):a}function U(b){return a.photo||/\.(gif|png|jpg|jpeg|bmp)(?:\?([^#]*))?(?:#(\.*))?$/i.test(b)}function cb(a){for(var c in a)if(b.isFunction(a[c])&&c.substring(0,2)!=="on")a[c]=a[c].call(l);a.rel=a.rel||l.rel||L;a.href=a.href||b(l).attr("href");a.title=a.title||l.title;return a}function w(c,a){a&&a.call(l);b.event.trigger(c)}function jb(){var b,e=i+"Slideshow_",c="click."+i,f,k;if(a.slideshow&&h[1]){f=function(){F.text(a.slideshowStop).unbind(c).bind(V,function(){if(g<h.length-1||a.loop)b=setTimeout(d.next,a.slideshowSpeed)}).bind(W,function(){clearTimeout(b)}).one(c+" "+N,k);j.removeClass(e+"off").addClass(e+"on");b=setTimeout(d.next,a.slideshowSpeed)};k=function(){clearTimeout(b);F.text(a.slideshowStart).unbind([V,W,N,c].join(" ")).one(c,f);j.removeClass(e+"on").addClass(e+"off")};a.slideshowAuto?f():k()}}function db(c){if(!O){l=c;a=cb(b.extend({},b.data(l,r)));h=b(l);g=0;if(a.rel!==L){h=b("."+G).filter(function(){return (b.data(this,r).rel||this.rel)===a.rel});g=h.index(l);if(g===-1){h=h.add(l);g=h.length-1}}if(!u){u=D=e;j.show();if(a.returnFocus)try{l.blur();b(l).one(eb,function(){try{this.focus()}catch(a){}})}catch(f){}x.css({opacity:+a.opacity,cursor:a.overlayClose?"pointer":q}).show();a.w=p(a.initialWidth,m);a.h=p(a.initialHeight,o);d.position(0);X&&n.bind(v+P+" scroll."+P,function(){x.css({width:n.width(),height:n.height(),top:n.scrollTop(),left:n.scrollLeft()})}).trigger("scroll."+P);w(fb,a.onOpen);Y.add(H).add(I).add(F).add(Z).hide();ab.html(a.close).show()}d.load(e)}}var gb={transition:"elastic",speed:300,width:c,initialWidth:"600",innerWidth:c,maxWidth:c,height:c,initialHeight:"450",innerHeight:c,maxHeight:c,scalePhotos:e,scrolling:e,inline:c,html:c,iframe:c,photo:c,href:c,title:c,rel:c,opacity:.9,preloading:e,current:"image {current} of {total}",previous:"previous",next:"next",close:"close",open:c,returnFocus:e,loop:e,slideshow:c,slideshowAuto:e,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",onOpen:c,onLoad:c,onComplete:c,onCleanup:c,onClosed:c,overlayClose:e,escKey:e,arrowKey:e},r="colorbox",i="cbox",fb=i+"_open",W=i+"_load",V=i+"_complete",N=i+"_cleanup",eb=i+"_closed",Q=i+"_purge",hb=i+"_loaded",E=b.browser.msie&&!b.support.opacity,X=E&&b.browser.version<7,P=i+"_IE6",x,j,A,s,bb,T,R,S,h,n,k,J,K,Z,Y,F,I,H,ab,B,C,y,z,l,g,a,u,D,O=c,d,G=i+"Element";d=b.fn[r]=b[r]=function(c,f){var a=this,d;if(!a[0]&&a.selector)return a;c=c||{};if(f)c.onComplete=f;if(!a[0]||a.selector===undefined){a=b("<a/>");c.open=e}a.each(function(){b.data(this,r,b.extend({},b.data(this,r)||gb,c));b(this).addClass(G)});d=c.open;if(b.isFunction(d))d=d.call(a);d&&db(a[0]);return a};d.init=function(){var l="hover",m="clear:left";n=b(ib);j=f().attr({id:r,"class":E?i+"IE":""});x=f("Overlay",X?"position:absolute":"").hide();A=f("Wrapper");s=f("Content").append(k=f(M,"width:0; height:0; overflow:hidden"),K=f("LoadingOverlay").add(f("LoadingGraphic")),Z=f("Title"),Y=f("Current"),I=f("Next"),H=f("Previous"),F=f("Slideshow").bind(fb,jb),ab=f("Close"));A.append(f().append(f("TopLeft"),bb=f("TopCenter"),f("TopRight")),f(c,m).append(T=f("MiddleLeft"),s,R=f("MiddleRight")),f(c,m).append(f("BottomLeft"),S=f("BottomCenter"),f("BottomRight"))).children().children().css({"float":"left"});J=f(c,"position:absolute; width:9999px; visibility:hidden; display:none");b("body").prepend(x,j.append(A,J));s.children().hover(function(){b(this).addClass(l)},function(){b(this).removeClass(l)}).addClass(l);B=bb.height()+S.height()+s.outerHeight(e)-s.height();C=T.width()+R.width()+s.outerWidth(e)-s.width();y=k.outerHeight(e);z=k.outerWidth(e);j.css({"padding-bottom":B,"padding-right":C}).hide();I.click(d.next);H.click(d.prev);ab.click(d.close);s.children().removeClass(l);b("."+G).live("click",function(a){if(!(a.button!==0&&typeof a.button!=="undefined"||a.ctrlKey||a.shiftKey||a.altKey)){a.preventDefault();db(this)}});x.click(function(){a.overlayClose&&d.close()});b(document).bind("keydown",function(b){if(u&&a.escKey&&b.keyCode===27){b.preventDefault();d.close()}if(u&&a.arrowKey&&!D&&h[1])if(b.keyCode===37&&(g||a.loop)){b.preventDefault();H.click()}else if(b.keyCode===39&&(g<h.length-1||a.loop)){b.preventDefault();I.click()}})};d.remove=function(){j.add(x).remove();b("."+G).die("click").removeData(r).removeClass(G)};d.position=function(f,d){function b(a){bb[0].style.width=S[0].style.width=s[0].style.width=a.style.width;K[0].style.height=K[1].style.height=s[0].style.height=T[0].style.height=R[0].style.height=a.style.height}var e,h=Math.max(document.documentElement.clientHeight-a.h-y-B,0)/2+n.scrollTop(),g=Math.max(n.width()-a.w-z-C,0)/2+n.scrollLeft();e=j.width()===a.w+z&&j.height()===a.h+y?0:f;A[0].style.width=A[0].style.height="9999px";j.dequeue().animate({width:a.w+z,height:a.h+y,top:h,left:g},{duration:e,complete:function(){b(this);D=c;A[0].style.width=a.w+z+C+"px";A[0].style.height=a.h+y+B+"px";d&&d()},step:function(){b(this)}})};d.resize=function(b){if(u){b=b||{};if(b.width)a.w=p(b.width,m)-z-C;if(b.innerWidth)a.w=p(b.innerWidth,m);k.css({width:a.w});if(b.height)a.h=p(b.height,o)-y-B;if(b.innerHeight)a.h=p(b.innerHeight,o);if(!b.innerHeight&&!b.height){b=k.wrapInner("<div style='overflow:auto'></div>").children();a.h=b.height();b.replaceWith(b.children())}k.css({height:a.h});d.position(a.transition===t?0:a.speed)}};d.prep=function(m){var c="hidden";function l(s){var p,f,m,c,l=h.length,q=a.loop;d.position(s,function(){function s(){E&&j[0].style.removeAttribute("filter")}if(u){E&&o&&k.fadeIn(100);k.show();w(hb);Z.show().html(a.title);if(l>1){typeof a.current==="string"&&Y.html(a.current.replace(/\{current\}/,g+1).replace(/\{total\}/,l)).show();I[q||g<l-1?"show":"hide"]().html(a.next);H[q||g?"show":"hide"]().html(a.previous);p=g?h[g-1]:h[l-1];m=g<l-1?h[g+1]:h[0];a.slideshow&&F.show();if(a.preloading){c=b.data(m,r).href||m.href;f=b.data(p,r).href||p.href;c=b.isFunction(c)?c.call(m):c;f=b.isFunction(f)?f.call(p):f;if(U(c))b("<img/>")[0].src=c;if(U(f))b("<img/>")[0].src=f}}K.hide();a.transition==="fade"?j.fadeTo(e,1,function(){s()}):s();n.bind(v+i,function(){d.position(0)});w(V,a.onComplete)}})}if(u){var o,e=a.transition===t?0:a.speed;n.unbind(v+i);k.remove();k=f(M).html(m);k.hide().appendTo(J.show()).css({width:function(){a.w=a.w||k.width();a.w=a.mw&&a.mw<a.w?a.mw:a.w;return a.w}(),overflow:a.scrolling?q:c}).css({height:function(){a.h=a.h||k.height();a.h=a.mh&&a.mh<a.h?a.mh:a.h;return a.h}()}).prependTo(s);J.hide();b("#"+i+"Photo").css({cssFloat:t,marginLeft:q,marginRight:q});X&&b("select").not(j.find("select")).filter(function(){return this.style.visibility!==c}).css({visibility:c}).one(N,function(){this.style.visibility="inherit"});a.transition==="fade"?j.fadeTo(e,0,function(){l(0)}):l(e)}};d.load=function(u){var n,c,s,q=d.prep;D=e;l=h[g];u||(a=cb(b.extend({},b.data(l,r))));w(Q);w(W,a.onLoad);a.h=a.height?p(a.height,o)-y-B:a.innerHeight&&p(a.innerHeight,o);a.w=a.width?p(a.width,m)-z-C:a.innerWidth&&p(a.innerWidth,m);a.mw=a.w;a.mh=a.h;if(a.maxWidth){a.mw=p(a.maxWidth,m)-z-C;a.mw=a.w&&a.w<a.mw?a.w:a.mw}if(a.maxHeight){a.mh=p(a.maxHeight,o)-y-B;a.mh=a.h&&a.h<a.mh?a.h:a.mh}n=a.href;K.show();if(a.inline){f().hide().insertBefore(b(n)[0]).one(Q,function(){b(this).replaceWith(k.children())});q(b(n))}else if(a.iframe){j.one(hb,function(){var c=b("<iframe frameborder='0' style='width:100%; height:100%; border:0; display:block'/>")[0];c.name=i+ +new Date;c.src=a.href;if(!a.scrolling)c.scrolling="no";if(E)c.allowtransparency="true";b(c).appendTo(k).one(Q,function(){c.src="//about:blank"})});q(" ")}else if(a.html)q(a.html);else if(U(n)){c=new Image;c.onload=function(){var e;c.onload=null;c.id=i+"Photo";b(c).css({border:t,display:"block",cssFloat:"left"});if(a.scalePhotos){s=function(){c.height-=c.height*e;c.width-=c.width*e};if(a.mw&&c.width>a.mw){e=(c.width-a.mw)/c.width;s()}if(a.mh&&c.height>a.mh){e=(c.height-a.mh)/c.height;s()}}if(a.h)c.style.marginTop=Math.max(a.h-c.height,0)/2+"px";h[1]&&(g<h.length-1||a.loop)&&b(c).css({cursor:"pointer"}).click(d.next);if(E)c.style.msInterpolationMode="bicubic";setTimeout(function(){q(c)},1)};setTimeout(function(){c.src=n},1)}else n&&J.load(n,function(d,c,a){q(c==="error"?"Request unsuccessful: "+a.statusText:b(this).children())})};d.next=function(){if(!D){g=g<h.length-1?g+1:0;d.load()}};d.prev=function(){if(!D){g=g?g-1:h.length-1;d.load()}};d.close=function(){if(u&&!O){O=e;u=c;w(N,a.onCleanup);n.unbind("."+i+" ."+P);x.fadeTo("fast",0);j.stop().fadeTo("fast",0,function(){w(Q);k.remove();j.add(x).css({opacity:1,cursor:q}).hide();setTimeout(function(){O=c;w(eb,a.onClosed)},1)})}};d.element=function(){return b(l)};d.settings=gb;b(d.init)})(jQuery,this);

/*
* jQote2 - client-side Javascript templating engine
* Copyright (C) 2010, aefxx
* http://aefxx.com/
*
* Licensed under the DWTFYWT PUBLIC LICENSE v2
* Copyright (C) 2004, Sam Hocevar
*
* Date: Sun, May 5th, 2010
* Version: 0.9.2
*/
(function($){var ARR='[object Array]',FUNC='[object Function]',STR='[object String]';var n=0,tag='%',type_of=Object.prototype.toString;$.fn.extend({jqote:function(data,t){var data=type_of.call(data)===ARR?data:[data],dom='';this.each(function(i){var f=(fn=$.jqotecache[this.jqote])?fn:$.jqotec(this,t||tag);for(var j=0;j<data.length;j++)
dom+=f.call(data[j],i,j,data,f);});return dom;},jqoteapp:function(elem,data,t){var dom=$.jqote(elem,data,t);return this.each(function(){$(this).append(dom);});},jqotepre:function(elem,data,t){var dom=$.jqote(elem,data,t);return this.each(function(){$(this).prepend(dom);});},jqotesub:function(elem,data,t){var dom=$.jqote(elem,data,t);return this.each(function(){$(this).html(dom);});}});$.extend({jqote:function(elem,data,t){var dom='',fn=[],t=t||tag,type=type_of.call(elem),data=type_of.call(data)===ARR?data:[data];if(type===FUNC)
fn=[elem];else if(type===ARR)
fn=type_of.call(elem[0])===FUNC?elem:$.map(elem,function(e){return $.jqotec(e,t);});else if(type===STR)
fn.push(elem.indexOf('<'+t)<0?$.jqotec($(elem),t):$.jqotec(elem,t));else fn=$.map($(elem),function(e){return $.jqotec(e,t);});for(var i=0,l=fn.length;i<l;i++)
for(var j=0;j<data.length;j++)
dom+=fn[i].call(data[j],i,j,data,fn[i]);return dom;},jqotec:function(elem,t){var fn,str='',t=t||tag,type=type_of.call(elem),tmpl=(type===STR&&elem.indexOf('<'+t)>=0)?elem:(elem=(type===STR||elem instanceof jQuery)?$(elem)[0]:elem).innerHTML;var arr=tmpl.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]/g,'').split('<'+t).join(t+'>\x1b').split(t+'>');for(var i=0,l=arr.length;i<l;i++)
str+=arr[i].charAt(0)!=='\x1b'?"out+='"+arr[i].replace(/([^\\])?(["'])/g,'$1\\$2')+"'":(arr[i].charAt(1)==='='?'+'+arr[i].substr(2)+';':';'+arr[i].substr(1));fn=new Function('i, j, data, fn','var out="";'+str+'; return out;');return type_of.call(elem)===STR?fn:$.jqotecache[elem.jqote=elem.jqote||n++]=fn;},jqotefn:function(elem){return $.jqotecache[$(elem)[0].jqote]||false;},jqotetag:function(str){tag=str;},jqotecache:[]});})(jQuery);
