//translations should be the first thing in this file
var Translations = {
    'clear_dates' : 'Clear Dates',
    'entire_place' : 'Entire Place',
    'friend' : 'friend',
    'friends' : 'friends',
    'loading' : 'Loading',
    'neighborhoods' : 'Neighborhoods',
    'private_room' : 'Private Room',
    'review' : 'review',
    'reviews' : 'reviews',
    'superhost' : 'superhost',
    'shared_room' : 'Shared Room',
    'today' : 'Today',
    'you_are_here' : 'You are Here',
    'a_friend' : 'a friend',
    'distance_away' : 'away',
    'instant_book' : 'Instant Book',
	'social_connections' : 'Social Connections',

    //these are for filter labels
    'amenities' : 'Amenities',
    'room_type' : 'Room Type',
    'price' : 'Price',
    'keywords' : 'Keywords',
    'property_type' : 'Property Type',
    'bedrooms' : 'Bedrooms',
    'bathrooms' : 'Bathrooms',
    'beds' : 'Beds',
    'languages' : 'Languages',
    'collection' : 'Collection',
    'host' : 'Host',
    'group' : 'Group',
	'connections' : 'Connections',

    'redo_search_in_map_tip' : '"Redo search in map" must be checked to see new results as you move the map',
    'zoom_in_to_see_more_properties' : 'Zoom in to see more properties',

    //used when map search is too specific
    'your_search_was_too_specific' : 'Your search was a little too specific.',
    'we_suggest_unchecking_a_couple_filters' : 'We suggest unchecking a couple filters, zooming out, or searching for a different city.'
};

/* unused for now... this might be incorrect */
function clearUnfilledInputs(){
    for(x = 0; x < fields_to_clear_on_submit.length; x++){
        //f is a jQuery object
        f = fields_to_clear_on_submit[x];
        if(f.attr('defaultValue') == f.val()){
            f.val('');
        }
    }
}

function clean_up_and_submit_search_request(){
    //clearUnfilledInputs();

    AirbnbSearch.loadNewResults();
    return false;
}

function select_search_type_button(jQueryEl){
    jQuery('.search_type_option').removeClass("search_type_option_active");
    jQueryEl.addClass("search_type_option_active");
    jQueryEl.removeClass("search_type_option_hover");
}


//pass in false to render_results if this is called from render_results - SLOPPY -Chris
function display_search_type(searchTypeString, renderResults){

    jQuery('#map_message').hide();

    renderResults = (typeof(renderResults) == 'undefined') ? true : renderResults;


    var changingFromType = AirbnbSearch.currentViewType;

    //make sure this comes before calling select_search_type_button()
    if(changingFromType == searchTypeString.replace('search_type_', '')){
        return false;
    }
    select_search_type_button(jQuery('#' + searchTypeString));

    AirbnbSearch.changing_display_type = true;

    if(searchTypeString == 'search_type_photo'){
        SS.initOnce();
        
        AirbnbSearch.currentViewType = 'photo';
        jQuery('#v3_search').removeClass('list_view map_view');
        jQuery('#v3_search').addClass('photo_view');
    }
    else if(searchTypeString == 'search_type_list'){
        AirbnbSearch.currentViewType = 'list';
        jQuery('#v3_search').removeClass('map_view photo_view');
        jQuery('#v3_search').addClass('list_view');

    }
    else if(searchTypeString == 'search_type_map'){
        //enable
        SS.initOnce();

        AirbnbSearch.currentViewType = 'map';

        AirbnbSearch.hideBannerForRemainderOfSession = true;

        var center = AMM.map.getCenter();
        var zoom = AMM.map.getZoom();

        if(zoom < 13){
            zoom = zoom + 2;
        }

        if(renderResults === false && render_results(AirbnbSearch.resultsJson)){
            render_results_oncomplete(AirbnbSearch.resultsJson);
        }

        jQuery('#v3_search').removeClass('list_view photo_view');
        jQuery('#v3_search').addClass('map_view');
        jQuery('#v3_search').addClass('condensed_header_view'); //makes top image go away
		if (jQuery('#cc_attribution_link')){
			jQuery('#cc_attribution_link').addClass('force_hide');
		}

        //one time map listener to handle the zoom
        google.maps.event.addListenerOnce(AMM.map, 'resize', function(){
            AMM.map.setCenter(center);
            AMM.map.setZoom(zoom);
        }); 

        google.maps.event.trigger(AMM.map, 'resize'); //size has changed due to class changing

        jQuery('#results_filters').insertAfter('#standby_action_area'); //move #results_header to inside of map_wrapper
        jQuery('#results_save').insertAfter('#applied_filters');

        jQuery('#map_wrapper').appendTo('#v3_search'); //move the map from the right column to the main content column

        jQuery('#map_options').prependTo('#search_filters');// keep 'redo search in map' in place
        append_to_map_div(jQuery('#search_filters_wrapper'));
        append_to_map_div(jQuery('#search_filters_toggle'));

        //since we are changing from photo / list, then we need to redraw the markers with map functionality
        AMM.clearOverlays();
        jQuery.each(AirbnbSearch.resultsJson.properties, function(i, hosting) {
            AMM.queue.push(hosting.id);
        });
        AMM.showOverlays();

        //always force a reload when switching to map view
        //if(!redoSearchInMapIsChecked()){
         //   AirbnbSearch.loadNewResults(true);
        //}

    }
    

    //Shared actions for list & photo
    if(searchTypeString == 'search_type_list' || searchTypeString == 'search_type_photo'){
        if(renderResults){
            AMM.closeInfoWindow();
        }

        var savedCenter = AMM.map.getCenter();
        var savedZoom = AMM.map.getZoom();

        if(savedZoom > 10){
            savedZoom = savedZoom - 2;
        }

        //one time map listener to handle the zoom
        google.maps.event.addListenerOnce(AMM.map, 'resize', function(){
            AMM.map.setCenter(savedCenter);
            AMM.map.setZoom(savedZoom);
        }); 

        //we want to make sure to reload results if necessary unless we're toggling between photo and map view
        if(changingFromType == 'map'){
            google.maps.event.trigger(AMM.map, 'resize');

            jQuery('#results_filters').insertAfter('#results_header'); //move #results_filters back below #results_header
            jQuery('#results_save').appendTo('#results_header');

            if(renderResults && !redoSearchInMapIsChecked()){
                AirbnbSearch.loadNewResults();
            }

        }

        jQuery('#search_filters_wrapper').appendTo('#v3_search');
        jQuery('#map_wrapper').prependTo('#search_filters'); //move the map back to the right filter column
        jQuery('#map_options').prependTo('#search_filters'); // keep "redo search in map" in place
    }

    //send a dummy request to save recent search
    if(changingFromType == 'map' && (searchTypeString == 'list' || searchTypeString == 'photo') || (changingFromType != 'map' && searchTypeString != 'map')){
        AirbnbSearch.loadNewResultsWithNoResponse();
    }

    if(changingFromType == 'map'){
        jQuery('#map_message').width(507);
        jQuery('#search_filters_toggle').addClass("search_filters_toggle_off");
        jQuery('#search_filters_toggle').removeClass("search_filters_toggle_on");
        jQuery('#search_filters').show();
    } else {
        if(jQuery('#search_filters').is(':visible')){
            jQuery('#search_filters_toggle').addClass("search_filters_toggle_on");
            jQuery('#search_filters_toggle').removeClass("search_filters_toggle_off");
        } else {
            jQuery('#search_filters_toggle').addClass("search_filters_toggle_off");
            jQuery('#search_filters_toggle').removeClass("search_filters_toggle_on");
        }
    }

    AirbnbSearch.$.trigger('finishedrendering');
    AirbnbSearch.changing_display_type = false;
    return false;
}

function append_to_map_div(jqElement){
    jqElement.appendTo('#map_wrapper');
    return false;
}

function reset_params_to_defaults(){
    AirbnbSearch.newSearch = true;
    AirbnbSearch.locationHasChanged = false;
    AirbnbSearch.results_changed_by_map_action = false;
    jQuery('#page').val('1');
}

function redoSearchInMapIsChecked(){
    return jQuery('#redo_search_in_map').is(':checked');
}

function showLoadingOverlays(){
    clearTimeout(AirbnbSearch.loadingMessageTimeout);

    AirbnbSearch.loadingMessageTimeout = setTimeout(function() {
		if (window.google && window.google.maps) {
			$('#small_map_loading').show();
		}
        jQuery('#list_view_loading, #map_view_loading').show();
    }, 250);
}

function hideLoadingOverlays(){
    clearTimeout(AirbnbSearch.loadingMessageTimeout);

    jQuery('#results_header, #results_filters, #results, #results_footer').removeClass('search_grayed');
    jQuery('#small_map_loading, #list_view_loading, #map_view_loading').hide();
}

function clearResultsList(){
    jQuery('#results').empty();
}

//banner_info is an obj that could be empty
//or contain :url, :attribution_text, and :attribution_url
// can also contain :airtv_url
function setBannerImage(banner_info){
    if(banner_info.url === undefined){
        jQuery('#v3_search').addClass('condensed_header_view');

        //set background to default image (should already be loaded)
//        banner_info.url = AirbnbSearch.DEFAULT_BANNER_IMAGE_URL;
        //also set default attribution text......
    } else {

        //hide current banner image

        //preload the banner image before doing anything
        var objImagePreloader = new Image();

        objImagePreloader.src = banner_info.url;

        if(objImagePreloader.complete){
            bannerImageLoadComplete(banner_info);
            objImagePreloader.onload = function(){};
        } else {
            objImagePreloader.onload = function() {
                bannerImageLoadComplete(banner_info);

                //clear onLoad, IE behaves erratically with animated gifs otherwise
                objImagePreloader.onload=function(){};
            };
        }
    }

    setAirtvVideo(banner_info);
}

function setAirtvVideo(banner_info){
    if(jQuery('#airtv_promo').length !== 0){
        jQuery('#airtv_promo').remove();
    }

    if(banner_info.airtv_url !== undefined && AirbnbSearch.resultsJson.show_airtv_in_search_results && AirbnbSearch.resultsJson.show_airtv_in_search_results === 'true'){

        var template_hash = {}

        template_hash.airtv_url = banner_info.airtv_url;
        template_hash.airtv_headline = banner_info.airtv_headline || "Check Out AirTV!";
        template_hash.airtv_description = banner_info.airtv_description || "A video from nearby!";

        jQuery('#results').before(
            jQuery('#list_view_airtv_template').jqote(template_hash, '*')
        );

        initAirtvSearchVideoLightBox('#airtv_promo', banner_info.airtv_url, banner_info.airtv_headline);
    }
}

function initAirtvSearchVideoLightBox(jQuerySelector, videoUrl, videoTitle) {
    if(jQuery('#video_lightbox_content').length == 0){
        jQuery('body').append('<div id="video_lightbox_content"></div>');
    }

    jQuery(jQuerySelector).colorbox({inline:true, href:"#video_lightbox_content", onLoad:function(){
          var embedContent = ['<object id="video" width="764" height="458"><param name="movie" value="',videoUrl, '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="',videoUrl, '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="764" height="458"></embed></object>'].join('');

          jQuery('#video_lightbox_content').html(embedContent);
        }, 
        onComplete:function(){
          jQuery('#cboxTitle').html(videoTitle);
        },
        onCleanup:function(){
            jQuery('#video_lightbox_content').html('');
            jQuery('#cboxTitle').html('');
        }
    });

}

function bannerImageLoadComplete(banner_info){
    //log(banner_info.url);
    //log('banner image load complete');
    jQuery('#search_header').css('background-image', ['url(', banner_info.url, ')'].join(''));

    if(banner_info.height){
        jQuery('#search_header').css('height', banner_info.height);
    } else {
        jQuery('#search_header').css('height', 150);
    }

    jQuery('#v3_search').removeClass('condensed_header_view');

    var attr_text = banner_info.attribution_text || 'CC licensed photo from Flickr';
    var attr_url = banner_info.attribution_url || 'http://www.flickr.com';

    //set attribution text & update URL
    jQuery('#cc_attribution_link').html(attr_text).attr('href', attr_url).show();

	AirbnbSearch.$.trigger("finishedrendering");
}

function render_results_oncomplete(json){
    if(json.banner_info && AirbnbSearch.hideBannerForRemainderOfSession === false){
        setBannerImage(json.banner_info);
    } else {
        jQuery('#cc_attribution_link').hide();
    }

    var userImg;
    jQuery('div.user_thumb a img').each(function(index, el){
          userImg = jQuery(el);   
          if(userImg.attr('src') == AirbnbSearch.BLANK_USER_PHOTO_URL){
               userImg.remove();
          }
    });

    AMM.centerLat = false;
    AMM.centerLng = false;
    AMM.geocodePrecision = false;

    if(json.center_lat && json.center_lng){
        AMM.centerLat = json.center_lat;
        AMM.centerLng = json.center_lng;

        if(json.geocode_precision){
            AMM.geocodePrecision = json.geocode_precision;
        }
    }

    AMM.drawCenterMarker();

    reset_params_to_defaults();
    setTimeout(function(){
        AMM.turnMapListenersOn();
    }, 1000);

    AirbnbSearch.markViewedPageLinks();

    AirbnbSearch.trackSearch();

    AirbnbSearch.activeAjaxRequest = null;

    AirbnbSearch.initialLoadComplete = true;

    AirbnbSearch.$.trigger('finishedrendering');
}

//  json.properties - an array of hostings
function render_results(json, override_bounds){
    AMM.turnMapListenersOff();

    clearResultsList();

    if(window.google && window.google.maps &&
			(arguments.length == 1 || override_bounds.ea === undefined)) { //fast way to detect if we have a bounds object
        bounds = new google.maps.LatLngBounds();
    } else {
        bounds = override_bounds;
    }

	jQuery('.results_count').html(json.results_count_html);
	jQuery('#results_count_top').html(json.results_count_top_html);
	jQuery('#results_pagination').html(json.results_pagination_html);
	jQuery('#sort').val(json.sort);

    AMM.clearQueue();

    var view_type = false;

    if(AirbnbSearch.forcedViewType !== false && (AirbnbSearch.initialLoadComplete === false || AirbnbSearch.searchHasBeenModified() === false)){
        view_type = AirbnbSearch.forcedViewType;
    } else if(json.view_type){
        view_type = json.view_type;
    }

    if(view_type !== false) {
        display_search_type('search_type_' + AirbnbSearch.viewTypes[view_type], false);
        AirbnbSearch.currentViewType = AirbnbSearch.viewTypes[view_type];
        AirbnbSearch.params.search_view = view_type;
    }

    if(json.present_standby_option && json.present_standby_option === true && json.standby_url) {
        jQuery('#standby_link').attr('href', json.standby_url);
        AirbnbSearch.presentStandbyOption();
    } else {
        jQuery('#standby_link').attr('href', '/messaging/standby');
        AirbnbSearch.hideStandbyOption();
    }

    var template_hash;
    jQuery.each(json.properties, function(i, hosting) {
		if (window.google && window.google.maps) {
	        ll = new google.maps.LatLng(hosting.lat, hosting.lng);
	        AMM.add(ll, hosting);
	        if(bounds !== override_bounds){ 
	            bounds.extend(ll); 
	        }
		}

        //set up hosting.picture_ids
        if(SS){
            if(hosting.picture_ids){
                SS.addHostingAndIds(hosting.id, hosting.picture_ids);

                //do this so when refreshing results, the default image does not jump back to the beginning
                if(SS.pictureArrays && SS.pictureArrays[hosting.id][0] !== undefined){
                    hosting.hosting_thumbnail_url = SS.fullImageUrl(SS.pictureArrays[hosting.id][0]);
                } else {
                    SS.pictureArrays[hosting.id] = [];
                }
            }
        }

        if(AirbnbSearch.currentViewType == 'list' || AirbnbSearch.currentViewType == 'photo'){
            template_hash = {
                hosting_name: hosting.name,
                user_name: hosting.user_name,
                hosting_id: hosting.id,
                result_number: (i + 1),
                address: hosting.address,
                usd_price: hosting.usd_price,
                price: hosting.price,
                hosting_thumbnail_url: hosting.hosting_thumbnail_url,
                user_thumbnail_url: hosting.user_thumbnail_url,
                connections: hosting.relationships || []
            };

			if (hosting.distance) {
				template_hash["distance"] = hosting.distance;
			}

            jQuery('#results').append(
                jQuery('#list_view_item_template').jqote(template_hash, '*')
            );

			var reputation_ul = jQuery('#results li.search_result:last').children('div.room_details').children('ul.reputation');
			if(hosting.review_count > 0){ add_badge(reputation_ul, 'reviews', hosting.review_count, (hosting.review_count == 1 ? Translations.review : Translations.reviews)); }
			if(hosting.recommendation_count > 0){ add_badge(reputation_ul, 'friends', hosting.recommendation_count, (hosting.recommendation_count == 1 ? Translations.friend :  Translations.friends)); }
			if(hosting.user_is_superhost > 0){ add_badge(reputation_ul, 'superhost', '', Translations.superhost); }
			if(hosting.has_guidebook){ add_badge(reputation_ul, 'guidebook', '', 'guidebook'); }

            if(hosting.is_new_hosting && hosting.is_new_hosting === true){
                jQuery('#results li.search_result:last h2.room_title').append('<span class="new_icon"></span><span class="new_icon new_icon_bg"></span>');
            }
            
            if(hosting.instant_book && hosting.instant_book === true){
                var instantBookString = ['<a class="instant_book_icon_p2" href="/rooms/', hosting.id, '">',Translations.instant_book, ' <span class="sm_instant_book_arrow"></span></a>'].join('');
                jQuery('#results li.search_result:last .price').after(instantBookString);
            }

        } else if(AirbnbSearch.currentViewType == 'map'){
        }
    });

    if(AirbnbSearch.currentViewType == 'map'){
        if((json.properties && json.properties.length == AirbnbSearch.params.per_page) || !redoSearchInMapIsChecked()){
            //we want to tell the user to zoom in more!
            if(redoSearchInMapIsChecked()){
                jQuery('#map_message').html(['<span class="zoom_in_to_see_more_properties">',Translations.zoom_in_to_see_more_properties, '</span>'].join(''));
            } else {
                jQuery('#map_message').html(['<h3>',Translations.zoom_in_to_see_more_properties, '</h3>', '<span id="redo_search_in_map_tip">', Translations.redo_search_in_map_tip, '</span>'].join(''));
            }

            jQuery('#map_message').removeClass('tall_message');
            jQuery('#map_message').addClass('short_message');

            jQuery('#map_message').show();
        } else {
            if(!(json.properties) || json.properties.length == 0){
                //the search is too specific, no results
                jQuery('#map_message').html(['<h3>',Translations.your_search_was_too_specific, '</h3>', '<p>', Translations.we_suggest_unchecking_a_couple_filters, '</p>'].join(''));
                jQuery('#map_message').removeClass('short_message');
                jQuery('#map_message').addClass('tall_message');
                jQuery('#map_message').show();
            } else {
                jQuery('#map_message').hide();
            }
        }
    } else {
        jQuery('#map_message').hide();
    }

    AMM.currentBounds = bounds;

    AMM.clearOverlays(true);
    AMM.showOverlays();

    if((json.properties && json.properties.length > 0) && (AirbnbSearch.results_changed_by_map_action === false || AirbnbSearch.changing_display_type === true) && (!redoSearchInMapIsChecked() || AirbnbSearch.locationHasChanged)){
        AMM.fitBounds(bounds);
    }

    if(json.properties && json.properties.length > 0){
        jQuery('#results_footer').show();
    } else {
        jQuery('#results_footer').hide();
        AirbnbSearch.showBlankState();
    }

    hideLoadingOverlays();

    return true;
}

function add_badge(reputation_ul_container, badge_type_val, badge_text_val, badge_name_val){
    reputation_ul_container.append(
        jQuery('#badge_template').jqote({badge_type : badge_type_val, badge_text : badge_text_val, badge_name : badge_name_val}, '*')
    );
}

function killActiveAjaxRequest(){
    if(AirbnbSearch.activeAjaxRequest !== null){
        AirbnbSearch.activeAjaxRequest.abort();
        AirbnbSearch.activeAjaxRequest = null;

        hideLoadingOverlays();
    } else {
    }
}


/* move these vars into AMM once they are definitely needed */
//pink icons
var numberedMapIcons = [];
var numberedMapIconsStarred = [];
var numberedMapIconsHover = [];
var numberedMapIconsStarredHover = [];
//gray icons
var numberedMapIconsVisited = [];
var numberedMapIconsVisitedStarred = [];
var numberedMapIconsVisitedHover = [];
var numberedMapIconsVisitedStarredHover = [];

//map icons
var MapIcons = {
    //center point
    centerPoint : false,
    //numbered
    numbered : [],
    numberedHover : [],
    numberedStarred : [],
    numberedStarredHover : [],
    numberedVisited : [],
    numberedVisitedHover: [],
    numberedVisitedStarred: [],
    numberedVisitedStarredHover : [],
    //small dots
    small : false,
    smallHover : false,
    smallStarred : false,
    smallStarredHover : false,
    smallVisited : false,
    smallVisitedHover : false,
    smallVisitedStarred : false,
    smallVisitedStarredHover : false,
    //shadows
    shadowStandard : false,
    shadowSmall : false,
    shadowCenterPoint : false,
    init : function(){
        //center point
        MapIcons.centerPoint = new google.maps.MarkerImage('/images/page2/v3/map_icons/icon_center_point.png',
            new google.maps.Size(15, 36),
            new google.maps.Point(0, 0));

        //set up small icons
        MapIcons.small =  new google.maps.MarkerImage('/images/page2/v3/map_icons/small_pins.png',
            new google.maps.Size(9, 9),
            new google.maps.Point(0, 0)
        );
        MapIcons.smallHover =  new google.maps.MarkerImage('/images/page2/v3/map_icons/small_pins.png',
            new google.maps.Size(9, 9),
            new google.maps.Point(9, 0)
        );

        MapIcons.smallStarred =  new google.maps.MarkerImage('/images/page2/v3/map_icons/small_pins.png',
            new google.maps.Size(9, 9),
            new google.maps.Point(0, 9)
        );
        MapIcons.smallStarredHover =  new google.maps.MarkerImage('/images/page2/v3/map_icons/small_pins.png',
            new google.maps.Size(9, 9),
            new google.maps.Point(9, 9)
        );

        MapIcons.smallVisited =  new google.maps.MarkerImage('/images/page2/v3/map_icons/small_pins.png',
            new google.maps.Size(9, 9),
            new google.maps.Point(18, 0)
        );
        MapIcons.smallVisitedHover =  new google.maps.MarkerImage('/images/page2/v3/map_icons/small_pins.png',
            new google.maps.Size(9, 9),
            new google.maps.Point(27, 0)
        );

        MapIcons.smallVisitedStarred =  new google.maps.MarkerImage('/images/page2/v3/map_icons/small_pins.png',
            new google.maps.Size(9, 9),
            new google.maps.Point(18, 9)
        );
        MapIcons.smallVisitedStarredHover =  new google.maps.MarkerImage('/images/page2/v3/map_icons/small_pins.png',
            new google.maps.Size(9, 9),
            new google.maps.Point(27, 9)
        );

    //set up all numbered pin states from the big pin sprite
        for(var i = 0; i < 21; i++){
            //numbered unvisited
            MapIcons.numbered[i + 1] = new google.maps.MarkerImage('/images/page2/v3/map_icons/map_pins_sprite_001.png',
                new google.maps.Size(22, 34),
                new google.maps.Point(0, (i * 34))
            );
            MapIcons.numberedHover[i + 1] = new google.maps.MarkerImage('/images/page2/v3/map_icons/map_pins_sprite_001.png',
                new google.maps.Size(22, 34),
                new google.maps.Point(44, (i * 34))
            );

            //numbered unvisited starred
            MapIcons.numberedStarred[i + 1] = new google.maps.MarkerImage('/images/page2/v3/map_icons/map_pins_sprite_001.png',
                new google.maps.Size(22, 34),
                new google.maps.Point(22, (i * 34))
            );
            MapIcons.numberedStarredHover[i + 1] = new google.maps.MarkerImage('/images/page2/v3/map_icons/map_pins_sprite_001.png',
                new google.maps.Size(22, 34),
                new google.maps.Point(66, (i * 34))
            );

            //numbered visited
            MapIcons.numberedVisited[i + 1] = new google.maps.MarkerImage('/images/page2/v3/map_icons/map_pins_sprite_001.png',
                new google.maps.Size(22, 34),
                new google.maps.Point(88, (i * 34))
            );
            MapIcons.numberedVisitedHover[i + 1] = new google.maps.MarkerImage('/images/page2/v3/map_icons/map_pins_sprite_001.png',
                new google.maps.Size(22, 34),
                new google.maps.Point(132, (i * 34))
            );

            //numbered visited starred
            MapIcons.numberedVisitedStarred[i + 1] = new google.maps.MarkerImage('/images/page2/v3/map_icons/map_pins_sprite_001.png',
                new google.maps.Size(22, 34),
                new google.maps.Point(110, (i * 34))
            );
            MapIcons.numberedVisitedStarredHover[i + 1] = new google.maps.MarkerImage('/images/page2/v3/map_icons/map_pins_sprite_001.png',
                new google.maps.Size(22, 34),
                new google.maps.Point(154, (i * 34))
            );

        }

        //shadows
        MapIcons.shadowCenterPoint = new google.maps.MarkerImage('/images/page2/v3/map_icons/icon_center_point_shadow.png',
            new google.maps.Size(35, 27),
            new google.maps.Point(0,0),
            new google.maps.Point(4, 27));

        MapIcons.shadowSmall = new google.maps.MarkerImage('/images/page2/v3/map_icons/icon_small_dot_shadow.png',
            new google.maps.Size(11, 11),
            new google.maps.Point(0, 0),
            new google.maps.Point(5, 9));

        MapIcons.shadowStandard = new google.maps.MarkerImage('/images/page2/v3/map_icons/default_shadow.png',
            new google.maps.Size(33, 26),
            new google.maps.Point(0, 0),
            new google.maps.Point(5,23));

    }
};

/* ******************* */

var AirbnbSearch = {
    hideBannerForRemainderOfSession : false, //set this to true once you've viewed the map
    forcedViewType : false,
    code : false,
    eventId : false,
    hostId : false,
    hostName : '',
    forceHideHost : false,
    groupId : false,
    groupName : '',
    forceHideGroup : false,
    isViewingStarred : false,
    collectionId : false,
    collectionName : '',
    forceHideCollection : false,
    viewTypes : {'1' : 'list', '2' : 'photo', '3' : 'map'},
    activeAjaxRequest : null,
    loadingMessageTimeout : false,
    newSearch : false,
    currentViewType:  'list', //'list', 'map', or 'photo'
    results_changed_by_map_action: false,
    changing_display_type: false, //this is true while loading different display types
    shareLightbox: false,
    airTvEnabled : false,
    params: {},
    currencySymbolLeft: '$',
    currencySymbolRight: '',
    initialLoadComplete : false,
    resultsJson : false,
    locationHasChanged : false,
    BLANK_USER_PHOTO_URL : 'http://www.airbnb.com/images/user_pic.gif',
    DEFAULT_BANNER_IMAGE_URL : '/images/landing_pages/backgrounds/default_landing_page_background.jpg',
    viewedIds : [], //a cache of viewed ids from cookie that we store here and can add / remove to on a per-page-view visit. used to set links as visited before a page 2 is finished loading in a new window.

    openShareLightbox : function(){
        if(AirbnbSearch.params.location){
            jQuery('#share_email_city_name').html(AirbnbSearch.params.location);
        } else {
            jQuery('#share_email_city_name').html(Translations.a_friend);
        }

        AirbnbSearch.shareLightbox = AirbnbSearch.shareLightbox || jQuery('#share_lightbox').dialog({ 
            autoOpen : false,
            height : 200,
            width : 600
        });

        AirbnbSearch.shareLightbox.dialog('open');
    },

    closeShareLightbox : function(){
        jQuery('#share_email_address').val('');
        if(AirbnbSearch.shareLightbox){
            AirbnbSearch.shareLightbox.dialog('close');
        }
    },


    init : function(opts){
        AirbnbSearch.viewedIds = AirbnbSearch.getViewedPage3Ids();

        opts = opts || {};

        if(opts.min_bathrooms){ jQuery('#min_bathrooms').val(opts.min_bathrooms); }
        if(opts.min_bedrooms){ jQuery('#min_bedrooms').val(opts.min_bedrooms); }
        if(opts.min_beds){ jQuery('#min_beds').val(opts.min_beds); }
        if(opts.page){ AirbnbSearch.params.page = opts.page; }
        if(opts.sort){ jQuery('#sort').val(opts.sort); AirbnbSearch.params.sort = opts.sort; }
        if(opts.neighborhoods){AirbnbSearch.params.neighborhoods = opts.neighborhoods; }
        if(opts.hosting_amenities){AirbnbSearch.params.hosting_amenities = opts.hosting_amenities; }
        if(opts.room_types){AirbnbSearch.params.room_types = opts.room_types; }
        if(opts.property_type_id){AirbnbSearch.params.property_type_id = opts.property_type_id; }

        //number_of_guests is legacy
        //so we support both, but will let opts.guests override opts.number_of_guests
        if(opts.number_of_guests){jQuery('#number_of_guests').val(opts.number_of_guests); AirbnbSearch.params.guests = opts.number_of_guests;}
        if(opts.guests){jQuery('#number_of_guests').val(opts.guests); AirbnbSearch.params.guests = opts.guests;}

        if(opts.price_min){ AirbnbSearch.params.price_min = opts.price_min;}
        if(opts.price_max){ AirbnbSearch.params.price_max = opts.price_max;}

        jQuery('.search_type_option').hover(
            function () {
                if(!jQuery(this).hasClass('search_type_option_active')){
                    jQuery(this).addClass("search_type_option_hover");
                }
            },
            function () { jQuery(this).removeClass("search_type_option_hover"); }
        );

        jQuery('.search_type_option').click(
            function () {
                display_search_type(this.id); //'search_type_list', 'search_type_photo',  'search_type_map'
            }
        );

        jQuery('#reinstate_collections').live('click', 
            function () { SearchFilters.reinstateCollections(); 
                jQuery(this).remove();
            }
        );

        jQuery('#reinstate_user').live('click', 
            function () { SearchFilters.reinstateHost(); 
                jQuery(this).remove();
            }
        );

        jQuery('#reinstate_group').live('click', 
            function () { SearchFilters.reinstateGroup(); 
                jQuery(this).remove();
            }
        );

        jQuery('#share_results_link').click(
            function() {
                jQuery('#share_url').val([Translations['loading'], '...'].join(''));
                AirbnbSearch.openShareLightbox();

                AirbnbSearch.setParamsFromDom(); //might be redundant
                AirbnbSearch.activeAjaxRequest = jQuery.getJSON("/search/create", AirbnbSearch.params, function(json) {
                    //jQuery('#share_url').val(["http://en.localhost.airbnb.com:3000/search/v3?code=", json.search.code].join(''));
                    jQuery('#share_url').val(["http://www.airbnb.com/search?code=", json.search.code].join(''));
                    jQuery('#share_url').select();
                });
            }
        );

        //keywords - hit enter
        jQuery('#keywords').live('keyup', function(e){
            var code = (e.keyCode ? e.keyCode : e.which);
            if(code == 13) { //User hit the "Enter" key

                var keywords = jQuery('#keywords');

                if(keywords.attr('defaultValue') !== keywords.val()){
                    AirbnbSearch.loadNewResults();
                } else {
                    //notify user the need to enter something
                }
            }
        });

        //first time map interaction
        jQuery('#redo_search_in_map_link_on').live('click', function(e){
            jQuery('#redo_search_in_map').attr('checked', true);

            if(AMM.redoSearchPromptTimeout){
                clearTimeout(AMM.redoSearchPromptTimeout);
                AMM.redoSearchPromptTimeout = false;
            }

            jQuery('#first_time_map_question').fadeOut(500);

            AMM.closeInfoWindow();
            AirbnbSearch.results_changed_by_map_action = true;
            AirbnbSearch.loadNewResults();

            return false;
        });

        jQuery('#redo_search_in_map_link_off').live('click', function(e){
            if(AMM.redoSearchPromptTimeout){
                clearTimeout(AMM.redoSearchPromptTimeout);
                AMM.redoSearchPromptTimeout = false;
            }

            jQuery('#first_time_map_question').fadeOut(500);
            
            return false;
        });

        jQuery('#share_url').live('focus', function () {
            jQuery(this).select();
        });

        //pagination links
        jQuery('.pagination a').live('click', function () {
            var el = jQuery(this);
            var pageNumber = el.html();

            if(el.attr('rel') == 'next'){ pageNumber = parseInt(jQuery('div.pagination span.current').html()) + 1; } 
            else if(el.attr('rel') == 'prev'){ pageNumber = parseInt(jQuery('div.pagination span.current').html()) - 1; } 
            else { pageNumber = parseInt(pageNumber); }

            //always pass a number
            if(isNaN(pageNumber) || pageNumber < 1){
                pageNumber = 1;
            }

            jQuery('#page').val(pageNumber);

            AirbnbSearch.loadNewResults();

            return false; //important so link click is intercepted
        });

		var searchBodyBottom, searchBodyHeight;
		var $searchFilters = jQuery("#search_filters");
		var $searchBody = jQuery("#search_body");
		var searchFiltersOrigTop = $searchFilters.position().top;
		var searchFiltersHeight = $searchFilters.height();

		function adjustSearchFiltersPosition() {
			var scrollTop = jQuery(window).scrollTop();
			var searchFiltersCurrTop = $searchFilters.position().top;

			if ((scrollTop >= searchFiltersOrigTop) && (searchFiltersHeight < searchBodyHeight)) {
				if (!$searchFilters.hasClass("fixed")) {
					$searchFilters.addClass("fixed");
				}
				if (((searchFiltersHeight + searchFiltersCurrTop) >= searchBodyBottom) &&
						scrollTop >= searchFiltersCurrTop) {
					$searchFilters.css({
						position: "absolute",
						top: searchBodyBottom - searchFiltersHeight + 1 + "px" // +1 for IE calculation weirdness
					});
				} else if ($searchFilters.css("position") === "absolute") {
					$searchFilters.css({
						position: "",
						top: "0"
					});
				}
			} else {
				resetSearchFiltersPosition();
			}
		}

		function resetSearchFiltersPosition() {
			if ($searchFilters.hasClass("fixed")) {
				$searchFilters.removeClass("fixed");
			}

			if ($searchFilters.css("position") === "absolute") {
				$searchFilters.css({
					position: "",
					top: "0"
				});
			}
		}

		function searchFiltersHeightChange() {
			searchFiltersHeight = $searchFilters.height();
			adjustSearchFiltersPosition();
			adjustSearchFiltersPosition();
		}

		AirbnbSearch.$.bind("finishedrendering", function() {
			// Use search body top in case page is scrolled when finished
			// rendering and the map filters are already fixed position
			searchFiltersOrigTop = $searchBody.position().top;

			searchFiltersHeight = $searchFilters.height();
			searchBodyHeight = $searchBody.height();
			searchBodyBottom = searchFiltersOrigTop + searchBodyHeight;

			if ((searchBodyHeight > searchFiltersHeight) &&
					AirbnbSearch.currentViewType !== "map") {
				jQuery(window).scroll(adjustSearchFiltersPosition).scroll();
				AirbnbSearch.$.bind("filtertoggle", searchFiltersHeightChange);
			} else {
				jQuery(window).unbind("scroll", adjustSearchFiltersPosition);
				AirbnbSearch.$.unbind("filtertoggle", searchFiltersHeightChange);
				resetSearchFiltersPosition();
			}
		});

		jQuery('#search_filters_toggle').live('click', function () {
			var $this = jQuery(this);
			
			if ($this.hasClass('search_filters_toggle_off')) {
				jQuery('#map_message').width(507);
				jQuery('#search_map').width(729);
			} else {
				jQuery('#search_map').width(980);
				jQuery('#map_message').width(752);
			}

			$this.toggleClass("search_filters_toggle_on search_filters_toggle_off");
			jQuery('#search_filters').toggle();
			google.maps.event.trigger(AMM.map, 'resize');
		});

        jQuery('.filter_x_container').live('click', function () {
            SearchFilters.appliedFilterXCallback(this);
        });

        fields_to_clear_on_submit = [];

        $.each($('.inner_text'), function(index, e){

            var inputField = $(e).next('input');
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
                if($(inputField).val() == inputField.attr('defaultValue')) { 
                    $(inputField).val(''); 
                    global_test_var = $(inputField);
                    $(inputField).addClass('active'); 
                }

                $(inputField).removeClass('error');

                return true;
            });

            inputField.bind('blur', function(){

                if($(inputField).val() === '') { 
                    $(inputField).removeClass('active');
                    $(inputField).val(inputField.attr('defaultValue'));
                } else { 
                    $(inputField).removeClass('error'); 
                }
            });

            fields_to_clear_on_submit.push(inputField);

            $(e).remove(); 
        });

        //for non JS browsers, location label is hidden by default to prevent layout flicker
        if(jQuery('#location_label')){ 
            jQuery('#location_label').show(); 
        }

        if(opts.location !== undefined){
            jQuery('#location').val(opts.location);
            jQuery('#location').addClass('active');
        }

        if(AirbnbSearch.initialLoadComplete === false){
            var defaultCalendarOptions = {
                dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                minDate: 0, 
                maxDate: '+2Y',
                nextText: '', //intentionally blank
                prevText: '', //intentionally blank
                numberOfMonths: 1,
                showButtonPanel: true,
                closeText: Translations.clear_dates,
                currentText: Translations.today
            };

            //we have to extend a deep copy of defaultCalendarOptions otherwise bad things happen
            var checkinCalendarOptions = jQuery.extend(true, {}, defaultCalendarOptions);
            var checkoutCalendarOptions = jQuery.extend(true, {}, defaultCalendarOptions);

            if(opts.checkin !== undefined && opts.checkout !== undefined && opts.checkin != 'mm/dd/yyyy' && opts.checkout != 'mm/dd/yyyy'){
                jQuery('#checkin').val(opts.checkin);
                jQuery('#checkout').val(opts.checkout);
                checkinCalendarOptions = jQuery.extend(checkinCalendarOptions, { defaultDate: opts.checkin });
                checkoutCalendarOptions = jQuery.extend(checkoutCalendarOptions, { defaultdate: opts.checkout });
            } else {
                jQuery('#checkin').val('mm/dd/yyyy');
                jQuery('#checkout').val('mm/dd/yyyy');

                jQuery('#search_inputs').css("background-color", '#ffe75f');
            }

            jQuery('#search_form').airbnbInputDateSpan({defaultsCheckin: checkinCalendarOptions,
                                                            defaultsCheckout: checkoutCalendarOptions,
                                                            onSuccess: function(){ AirbnbSearch.loadNewResults(); }});

            jQuery('#search_form').airbnbInputDateSpan('enableClearDatesButton');

            //SearchFilters.render();
            jQuery('ul.collapsable_filters li input:checkbox, ul#lightbox_filters input:checkbox').live('click', function(){
                var performSearch = false;

                var id = jQuery(this).attr('id');

                var checkboxName = jQuery(this).attr('name');
                var checkboxValue = jQuery(this).attr('value');

                if(id.indexOf('lightbox') === -1){
                    id = ['#lightbox_', id].join('');
                    performSearch = true;
                } else {
                    id = ['#', id.replace('lightbox_', '')].join('');
                }

                if(jQuery(id)){
                    if(jQuery(this).is(':checked')){
                        jQuery(['input:checkbox[name=', checkboxName,'][value=',checkboxValue,']'].join('')).attr('checked', true);
                    } else {
                        jQuery(['input:checkbox[name=', checkboxName,'][value=',checkboxValue,']'].join('')).attr('checked', false);
                    }
                }

                if(performSearch === true){
                    AirbnbSearch.loadNewResults();
                }
            });
            jQuery('a.show_more_link').live('click', function(event){
                SearchFilters.openFiltersLightbox();

                var tabToSelect = jQuery(this).closest('.search_filter').attr('id').replace('_container', '');

                SearchFilters.selectLightboxTab(tabToSelect);

            });

            jQuery('#lightbox_search_button').live('click', function(){AirbnbSearch.loadNewResults();});

            jQuery('.filters_lightbox_nav_element').live('click', function(){
                var tabToSelect = jQuery(this).attr('id').replace('lightbox_nav_', '');
                SearchFilters.selectLightboxTab(tabToSelect);
            });

            jQuery('#sort').change(function(){AirbnbSearch.loadNewResults();});
            jQuery('#number_of_guests').change(function(){AirbnbSearch.loadNewResults();});

			//handle toggling
			jQuery('a.filter_header, a.filter_toggle').live('click', function(){
				jQuery(this).closest('.search_filter').toggleClass("closed open");
				AirbnbSearch.$.trigger("filtertoggle");
			});

            jQuery('.search_result').live('mouseenter', function(event){
                AirbnbSearch.hoverListResult((event.currentTarget.id).split('_')[1]);
            });

            jQuery('.search_result').live('mouseleave', function(event){
                AirbnbSearch.unHoverListResult((event.currentTarget.id).split('_')[1]);
            });

            /* move this into search filters */
            /* ----- slider ----- */
            jQuery("#slider-range").slider({
                range: true,
                min: SearchFilters.minPrice,
                max: SearchFilters.maxPrice,
                step: 5,
                values: [(opts.price_min ? parseInt(opts.price_min) : SearchFilters.minPrice), (opts.price_max ? parseInt(opts.price_max) : SearchFilters.maxPrice)],
                slide: function(event, ui) {
                    SearchFilters.applyPriceSliderChanges(ui);
                },
                change: function(){
                    AirbnbSearch.loadNewResults();
                }
            });

            jQuery("#slider_min").html([AirbnbSearch.currencySymbolLeft, SearchFilters.minPrice, AirbnbSearch.currencySymbolRight].join(''));
            jQuery("#slider_max").html([AirbnbSearch.currencySymbolLeft, SearchFilters.maxPrice, AirbnbSearch.currencySymbolRight].join(''));

            SearchFilters.applyPriceSliderChanges();
            if(window.google && window.google.maps &&
					opts.search_by_map && opts.ne_lng && opts.ne_lat && opts.sw_lng && opts.sw_lat) {
                AMM.initMapOnce('search_map');

                var forceBounds = {
                    sw_lat: opts.sw_lat,
                    sw_lng: opts.sw_lng,
                    ne_lat: opts.ne_lat,
                    ne_lng: opts.ne_lng
                };

                AirbnbSearch.params.forceBounds = forceBounds;

                var sw = new google.maps.LatLng(forceBounds.sw_lat, forceBounds.sw_lng);
                var ne = new google.maps.LatLng(forceBounds.ne_lat, forceBounds.ne_lng);

                AMM.fitBounds(new google.maps.LatLngBounds(sw, ne));

                //jQuery('#redo_search_in_map_link_on').click()
                jQuery('#redo_search_in_map').attr('checked', true);

                AirbnbSearch.params = opts;
            }

            AirbnbSearch.loadNewResults(true);

            /* NEW STUFF */
            AirbnbSearch.params = opts;

            jQuery('#redo_search_in_map').bind('change', function(){
                if(AMM.redoSearchPromptTimeout){
                    clearTimeout(AMM.redoSearchPromptTimeout);
                    AMM.redoSearchPromptTimeout = false;
                    jQuery('#first_time_map_question').fadeOut(250); //this fadeout should match the delay for showing loading screens
                }
                if(redoSearchInMapIsChecked()){
                    AMM.closeInfoWindow();
                    AirbnbSearch.results_changed_by_map_action = true;
                    AirbnbSearch.loadNewResults();
                } else{
                    AMM.turnMapListenersOff();
                }
            });
        } else {
            //document load is incomplete
        }
    },

    performNewSearch: function() {
        return(AirbnbSearch.newSearch || AirbnbSearch.initialLoadComplete);
    },

    searchHasBeenModified: function() {
        try{
            var hash = window.location.hash;

            if(hash){
                var modified = (((hash).split('#')[1]).split('&')[0]).split('modified=')[1];

                if(modified == 'true'){
                    return true;
                }
            }

            return false;
        } catch(err) {
            return false;
        }
    },

    //start fresh and then iterate through the DOM
    setParamsFromDom : function(){
        var oldParams = AirbnbSearch.params;

        AirbnbSearch.params = {};

        //reads from after the #, looking for #modified=true
        if(AirbnbSearch.initialLoadComplete === false && AirbnbSearch.code && (AirbnbSearch.searchHasBeenModified() === false)){
            AirbnbSearch.params.code = AirbnbSearch.code;
        }

        if (AirbnbSearch.eventId && (AirbnbSearch.searchHasBeenModified() === false)){
            AirbnbSearch.params.event_id = AirbnbSearch.eventId;
        }

        if(AirbnbSearch.performNewSearch()){
            AirbnbSearch.params.new_search = true;
        }

        AMM.new_bounds = AMM.mapLoaded ? (AMM.map.getBounds() || false) : false;

        switch(AirbnbSearch.currentViewType){
        case 'list':
            AirbnbSearch.params.search_view = 1;
            break;
        case 'photo':
            AirbnbSearch.params.search_view = 2;
            break;
        case 'map':
            AirbnbSearch.params.search_view = 3;
            break;
        default:
            AirbnbSearch.params.search_view = 1;
        }

        //LOCATION
        AirbnbSearch.params.min_bedrooms = jQuery('#min_bedrooms').val() || '0';
        AirbnbSearch.params.min_bathrooms = jQuery('#min_bathrooms').val() || '0';
        AirbnbSearch.params.min_beds = jQuery('#min_beds').val() || '0';

        AirbnbSearch.params.page = jQuery('#page').val() || '1';

        var locationVal = jQuery('#location').val();

        if(locationVal == jQuery('#location').attr('defaultValue')){
            //AirbnbSearch.params.location = 'SF bay area'; //default
            //AirbnbSearch.params.location = 'United States of America'; //default
        } else {
            AirbnbSearch.params.location = locationVal || '';
        }

        if(!oldParams || !(oldParams.location) || (oldParams.location != AirbnbSearch.params.location)){
            AirbnbSearch.locationHasChanged = true;

            //if you go from list -> map -> list (then change location), we want to show the banner again
            AirbnbSearch.hideBannerForRemainderOfSession = false;
        }

        if (AirbnbSearch.includeCollectionParam() === true){
            AirbnbSearch.params.collection_id = AirbnbSearch.collectionId;
        } else {
            SearchFilters.clearCollections(false);
        }

        if (AirbnbSearch.includeHostParam()) {
            AirbnbSearch.params.host_id = AirbnbSearch.hostId;
        } else {
            SearchFilters.clearHost();
        }

        if (AirbnbSearch.includeGroupParam()) {
            AirbnbSearch.params.group_id = AirbnbSearch.groupId;
        } else {
            SearchFilters.clearGroup();
        }

        //DATES
        var checkin_date = jQuery('#checkin').val();
        var checkout_date = jQuery('#checkout').val();

        if(checkin_date != 'mm/dd/yyyy'){ //TODO:Validate dates a little better here :)
            AirbnbSearch.params.checkin = jQuery('#checkin').val() || '';
        }
        if(checkout_date != 'mm/dd/yyyy'){
            AirbnbSearch.params.checkout = jQuery('#checkout').val() || '';
        }

        AirbnbSearch.params.guests = jQuery('#number_of_guests').val() || '1';

        AirbnbSearch.params.room_types = [];
        jQuery("input[name=room_types]").each(function(i, el){
            if(jQuery(el).is(':checked')){
                AirbnbSearch.params.room_types.push(jQuery(el).val());
            }
        });

        AirbnbSearch.params.property_type_id = [];
        jQuery("input[name=property_type_id]").each(function(i, el){
            if(jQuery(el).is(':checked')){
                AirbnbSearch.params.property_type_id.push(jQuery(el).val());
            }
        });

        AirbnbSearch.params.hosting_amenities = [];
        jQuery("input[name=amenities]").each(function(i, el){
            if(jQuery(el).is(':checked')){
                AirbnbSearch.params.hosting_amenities.push(jQuery(el).val());
            }
        });

		if (AirbnbSearch.isViewingStarred) {
			AirbnbSearch.params.starred = true;
		}

		if (jQuery("input[name=connected]").is(":checked")) {
			AirbnbSearch.params.connected = true;
		}

        AirbnbSearch.params.languages = [];
        jQuery("input[name=languages]").each(function(i, el){
            if(jQuery(el).is(':checked')){
                AirbnbSearch.params.languages.push(jQuery(el).val());
            }
        });

        AirbnbSearch.params.neighborhoods = [];

        //This is where we set params when using the back button
        // --- or params sent in via the URL
        if(AirbnbSearch.initialLoadComplete === false){
            overridable_vars = ['neighborhoods', 'room_types', 'min_bedrooms', 'price_min', 'price_max', 'guests', 'property_type_id'];
            jQuery(overridable_vars).each(function(i, el){
                if(oldParams[el]){
                    AirbnbSearch.params[el] = oldParams[el];
                }
            });
        }

        //if the user types in a different location, we do not want to include any existing neighbohood filters
        if(!AirbnbSearch.locationHasChanged){
	        AirbnbSearch.params.sort = jQuery('#sort').val();
            jQuery("input[name=neighborhoods]").each(function(i, el){
                if(jQuery(el).is(':checked')){
                    AirbnbSearch.params.neighborhoods.push(jQuery(el).val());
                }
            });
        }

        AirbnbSearch.params.hosting_amenities = AirbnbSearch.params.hosting_amenities.unique();
        AirbnbSearch.params.neighborhoods = AirbnbSearch.params.neighborhoods.unique();
        AirbnbSearch.params.room_types = AirbnbSearch.params.room_types.unique();

        var keywords = jQuery('#keywords');

        if(keywords.attr('defaultValue') !== keywords.val()){
            AirbnbSearch.params.keywords = keywords.val();
        }

        //PRICE SLIDER
        var slider_absolute_min = jQuery("#slider-range").slider("option", "min"); //TODO: store these in global object so we don't repeat the lookup
        var slider_absolute_max = jQuery("#slider-range").slider("option", "max");

        var slider_min = jQuery("#slider-range").slider("values", 0);
        var slider_max = jQuery("#slider-range").slider("values", 1);

        if(slider_absolute_max != slider_max || slider_absolute_min != slider_min ){ //at least one slider has been moved from the default, so we want to pass the pair of prices
            AirbnbSearch.params.price_min = slider_min.toString();
            AirbnbSearch.params.price_max = slider_max.toString();
        }

        //BOUNDING BOX?
        //log(AirbnbSearch.locationHasChanged);
        if(redoSearchInMapIsChecked()){
            //log('redo search in map is checked');
            if(AMM.new_bounds && (!(AirbnbSearch.locationHasChanged) || AirbnbSearch.results_changed_by_map_action)){
                AirbnbSearch.params.sw_lat = AMM.new_bounds.getSouthWest().lat();
                AirbnbSearch.params.sw_lng = AMM.new_bounds.getSouthWest().lng();
                AirbnbSearch.params.ne_lat = AMM.new_bounds.getNorthEast().lat();
                AirbnbSearch.params.ne_lng = AMM.new_bounds.getNorthEast().lng();

                AirbnbSearch.params.search_by_map = true;
            } else if(oldParams && oldParams.forceBounds){
                //log('forcebounds be here');
                AirbnbSearch.params.sw_lat = oldParams.forceBounds.sw_lat;
                AirbnbSearch.params.sw_lng = oldParams.forceBounds.sw_lng;

                AirbnbSearch.params.ne_lat = oldParams.forceBounds.ne_lat;
                AirbnbSearch.params.ne_lng = oldParams.forceBounds.ne_lng;

                var sw = new google.maps.LatLng(oldParams.forceBounds.sw_lat, oldParams.forceBounds.sw_lng);
                var ne = new google.maps.LatLng(oldParams.forceBounds.ne_lat, oldParams.forceBounds.ne_lng);

                AMM.new_bounds = new google.maps.LatLngBounds(sw, ne);
                AMM.fitBounds(AMM.new_bounds);

                AirbnbSearch.params.search_by_map = true;
            }
        }

        //PER PAGE
        if(AirbnbSearch.currentViewType == 'photo'){ AirbnbSearch.params.per_page = 21; }
        else if(AirbnbSearch.currentViewType == 'list'){ AirbnbSearch.params.per_page = 21; }
        else if(AirbnbSearch.currentViewType == 'map'){ AirbnbSearch.params.per_page = 40; }

        return AirbnbSearch.params;
    },

    markUrlAsModified : function(){
        try {
            window.location.hash = 'modified=true';
        } catch(err) {}
    },

    //send a request so we save the current tab you are on, but ignore the results :)
    loadNewResultsWithNoResponse : function(){
        AirbnbSearch.setParamsFromDom();
        AirbnbSearch.params.suppress_response = true;

        AirbnbSearch.markUrlAsModified();

        AirbnbSearch.activeAjaxRequest = jQuery.getJSON("/search/ajax_get_results", AirbnbSearch.params, function(json) {
            AirbnbSearch.params.suppress_response = false;
        });
    },


    loadNewResults: function(forceLoad) {
        if(AirbnbSearch.initialLoadComplete === true){
            AirbnbSearch.markUrlAsModified();
        }

        var force = forceLoad || false;

        AMM.initMapOnce('search_map');

        //redo search in map
        if(AirbnbSearch.results_changed_by_map_action === true && !redoSearchInMapIsChecked() && force === false){

            reset_params_to_defaults();
            setTimeout(function(){
                AMM.turnMapListenersOn();
            }, 1000);

            return true;
        }

        killActiveAjaxRequest();

        SearchFilters.closeFiltersLightbox();

        var bigHeader = jQuery('#search_header').is(':visible');
        var scrollOffsetFromTop = jQuery(window).scrollTop();
        if((bigHeader === true && scrollOffsetFromTop > 275) || (bigHeader === false && scrollOffsetFromTop > 129)){
            scrollToById('search_params');
        }

        showLoadingOverlays();

        AirbnbSearch.setParamsFromDom();
        AirbnbSearch.activeAjaxRequest = jQuery.getJSON("/search/ajax_get_results", AirbnbSearch.params, function(json) {
            if(!json){
                AirbnbSearch.resultsJson = false;
                hideLoadingOverlays();
                AirbnbSearch.trackSearch();
                return false;
            }

            AirbnbSearch.resultsJson = json; //save this for later, so we can re-render when switching from list/photo to map

            if (render_results(json, AMM.new_bounds)) {
                if (json.params) {
                    SearchFilters.update(json.params);
                } else if (json.facets) {
                    SearchFilters.update(json.facets);
                }
                render_results_oncomplete(json);
            }
        });

        // hide the 'share results' link if the user is viewing starred items
        if(AirbnbSearch.isViewingStarred)
          jQuery('#share_results_link').hide();
        else
          jQuery('#share_results_link').show();

        return true;
    },

    hoverListResult : function(hosting_id){
        var parentId = ['#room_', hosting_id].join('');
		var marker = AMM.markers[hosting_id];
        jQuery(parentId).addClass('hover');

        if(SS.initialized === true){
            SS.show(parentId, hosting_id);
        }

		if (marker) {
	        if(marker.numbered_pin === false){
	            //AMM.markers[hosting_id].marker.setIcon();
	        } else { //this is a numbered pin
	            var icon;

	            if(jQuery.inArray(hosting_id.toString(), AirbnbSearch.viewedIds) !== -1){
	                icon = MapIcons.numberedVisitedHover[marker.numbered_pin + 1];
	            } else {
	                icon = MapIcons.numberedHover[marker.numbered_pin + 1];
	            }

	            marker.marker.setIcon(icon);
	        }
		}
    },

    unHoverListResult : function(hosting_id){
		var marker = AMM.markers[hosting_id];
        jQuery(['#room_', hosting_id].join('')).removeClass('hover');

        if(SS.initialized === true){
            SS.reset();
        }

		if (marker) {
	        if(marker.numbered_pin === false){
	            //AMM.markers[hosting_id].marker.setIcon();
	        } else { //this is a numbered pin
	            //AMM.markers[hosting_id].marker.setIcon(numberedMapIcons[AMM.markers[hosting_id].numbered_pin + 1]);
	            var icon;

	            if(jQuery.inArray(hosting_id.toString(), AirbnbSearch.viewedIds) !== -1){
	                icon = MapIcons.numberedVisited[marker.numbered_pin + 1];
	            } else {
	                icon = MapIcons.numbered[marker.numbered_pin + 1];
	            }

	            marker.marker.setIcon(icon);
	        }
		}
    },

    is_map_search: function(){
        return AirbnbSearch.results_changed_by_map_action && !(AirbnbSearch.changing_display_type);
    },

    showBlankState : function(){
        jQuery('#results').html(jQuery('#blank_state_content').html());
    },

    /* 
     * mark_viewed_page_links();
     *
     * 1) Grab each text link on the page that matches rooms/[0-9]+
     * 2) Add class='visited' to those links if the room ID is stored in 'viewed_page3_ids' cookie
    */

    markViewedPageLinks : function (){
        if(AirbnbSearch.viewedIds === false || AirbnbSearch.viewedIds.size === 0){
            return false;
        }

        jQuery("#results .search_result").each(function(i, el){
             el = jQuery(el);
             var room_id = el.attr('id').replace('room_', '');
             if(jQuery.inArray(room_id, AirbnbSearch.viewedIds) !== -1){
                 el.addClass('visited');
             }
        });
    },

    getViewedPage3Ids : function(){
        var commaSeparatedPage3Ids = jQuery.cookie('viewed_page3_ids');

        if(commaSeparatedPage3Ids !== null){
            var arrayOfPage3Ids = commaSeparatedPage3Ids.split(',');
            arrayOfPage3Ids = arrayOfPage3Ids.unique();

            return arrayOfPage3Ids;
        }

        return [];
    },

    //we can track things any number of ways here
    trackSearch : function(){
        TrackingPixel.track();
    },

    presentStandbyOption : function(){
        jQuery('#standby_action_area').show();
    },

    hideStandbyOption : function(){
        jQuery('#standby_action_area').hide();
    },

    includeCollectionParam : function() {
        return (AirbnbSearch.collectionId !== false) &&
            (AirbnbSearch.forceHideCollection === false) &&
            (AirbnbSearch.searchHasBeenModified() === false ||
                (!(AirbnbSearch.params.location) || AirbnbSearch.params.location == ''));
    },

    includeHostParam : function() {
        return (AirbnbSearch.hostId !== false) &&
            (AirbnbSearch.forceHideHost === false) &&
            (AirbnbSearch.searchHasBeenModified() === false ||
                (!(AirbnbSearch.params.location) || AirbnbSearch.params.location == ''));
    },

    includeGroupParam : function() {
        return (AirbnbSearch.groupId !== false) &&
            (AirbnbSearch.forceHideGroup === false) &&
            (AirbnbSearch.searchHasBeenModified() === false ||
                (!(AirbnbSearch.params.location) || AirbnbSearch.params.location == ''));
    },

    // expose a property that gives you access to a scoped jQuery object
    // this is used to give us the ability to bind multiple handlers to
    // a trigger
    $ : jQuery(this)
};

var TrackingPixel = {
    params : {
        /* these should not be modified after page load */
        uuid: '', //behaviorial userId
        user : '', //user_id
        af : '', //affiliate_id
        c : '', //affiliate_campaign
        pg : '', //page (e.g. '2' for search)

        /* these should be modified after page load */
        checkin : '', //checkin date
        ngt: '', //nights
        gc: '1', //guests
        bc: '', //????
        lat: '',
        lng: ''
    },

    imgId : '#page2_v3_tp', //use '#' before id    (e.g. '#image_id')
    BASE_URL : 'http://pluto.airbnb.com/t/t.php?',

    //run this before updating the image source
    updateParamsFromDom : function(){
        //lat & lng
        if(AMM.map){
            var mapCenter = AMM.map.getCenter();
            TrackingPixel.params.lat = mapCenter.lat();
            TrackingPixel.params.lng = mapCenter.lng();
        }

        //checkin & ngt
        var checkin = jQuery('#checkin').val();
        var checkout = jQuery('#checkout').val();
        if(checkin == 'mm/dd/yyyy' || checkout == 'mm/dd/yyyy'){
            TrackingPixel.params.checkin = '';
            TrackingPixel.params.checkout = '';
        }else{
            TrackingPixel.params.checkin = checkin;

            var _checkin = new Date(checkin);
            var _checkout = new Date(checkout);

            var ONE_DAY_MS = 86400000;

            var difference_ms = Math.abs(_checkin.getTime() - _checkout.getTime());
            var length_of_stay = Math.round(difference_ms / ONE_DAY_MS);

            TrackingPixel.params.ngt = length_of_stay || '';
        }

        //gc
        TrackingPixel.params.gc = jQuery('#number_of_guests').val() || '1';
    },

    serializedParams : function() {
        return jQuery.param(TrackingPixel.params);
    },

    updateImgSrc : function(){
        var imageEl = jQuery(TrackingPixel.imgId);

        if(imageEl){
            var newImgSrc = [TrackingPixel.BASE_URL, TrackingPixel.serializedParams()].join('');
            imageEl.attr('src', newImgSrc);
        }
    },

    track : function(){
        TrackingPixel.updateParamsFromDom();
        TrackingPixel.updateImgSrc();
    }
};

//AirbnbMapManager (previously known as AirbnbMarkerManager)
var AMM = {
    map : '',
    isFirstMapInteraction : true, //if this is false, we will prompt with "Hey Do you want to turn redo search on?"
    redoSearchPromptTimeout : false,
    overlay : false, //empty overlay, used to access fromLatLngToContainerPixel()
    mapLoaded : false,
    new_bounds : false,
    currentBounds : false,
    currentHighestZIndex : 0,
    activeInfoWindow : false,
    activeInfoWindowMarker : false,
    queue : [], //an array that holds hosting IDs to show on the map - the queue generally gets updated and emptied every time an ajax search occurs
    activeHostingIds : [],
    markers : {}, //an array of map markers
    defaultMapOptions : {},
    centerLat : false,
    centerLng : false,
    centerMarker : false,
    geocodePrecision : false,

	initMapOnce: function(map_id, forceBounds) {
		if (AMM.mapLoaded === false) {
			if (window.google && window.google.maps) {
				$("#map_options").show();
				$("#map_wrapper").show();
				AMM.defaultMapOptions = {
					zoom: 6,
					center: new google.maps.LatLng(40.7442,-73.9861),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true,
					navigationControl: true,
					navigationControlOptions: { position: google.maps.ControlPosition.LEFT },
					scaleControl: false,
					scrollwheel: false
				};

				AMM.map = new google.maps.Map(document.getElementById(map_id), AMM.defaultMapOptions);

				//We need to set up an empty overlay to eventually access pixel locations using:
				//   AMM.overlay.getProjection().fromLatLngToContainerPixel(location);
				AMM.overlay = new google.maps.OverlayView();
				AMM.overlay.draw = function() {};
				AMM.overlay.setMap(AMM.map);

				MapIcons.init();
				AMM.mapLoaded = true;
	        } else {
				$("#map_options").hide();
				$("#map_wrapper").hide();
			}
		}
    },


    add : function(location, hosting) {
        if(AMM.markers[hosting.id] === undefined){
            AMM.markers[hosting.id] = {location : location, details : hosting, active : false};
        } else {
        }

        AMM.queue.push(hosting.id);
    },

    drawCenterMarker : function(){
        AMM.clearCenterMarker(); //because there should never ever be two centerMarkers, ya hear?
     //   return true;

        if(AMM.mapLoaded && AMM.centerLat && AMM.centerLng){
            //generally we want the center pin to be layered behind result markers
            var pinZIndex = 1;

            //but sometimes we want to force it to the front
            if(AMM.geocodePrecision){
                if(AMM.geocodePrecision == 'address'){
                    pinZIndex = 100;
                }
            }

            var centerPoint = new google.maps.LatLng(AMM.centerLat, AMM.centerLng);

            var marker = new google.maps.Marker({
                position : centerPoint,
                map : AMM.map,
                icon : MapIcons.centerPoint,
                shadow : MapIcons.shadowCenterPoint,
                title : Translations.you_are_here,
                zIndex: pinZIndex 
            });

            AMM.centerMarker = marker;

            var bounds = AMM.currentBounds;
            if(bounds === false){
                bounds = new google.maps.LatLngBounds();
            }

            bounds.extend(centerPoint);
        }
    },

    clearCenterMarker : function() {
        if(AMM.centerMarker !== false){
            AMM.centerMarker.setMap(null);
            AMM.centerMarker = false;
        }
    },


    // Removes the overlays from the map, but keeps them in the array for later use
    clearOverlays : function(force_all) {
      if (AMM.markers) {
            jQuery.each(AMM.markers, function(hosting_id, data){
                if(jQuery.inArray(parseInt(hosting_id), AMM.queue) === -1 || force_all === true){
                    //log(hosting_id + ' not in queue. Removing it.');
                    AMM.removeOverlay(hosting_id);
                } else {
                    //log('not removing because id in queue: ' + hosting_id);
                }
            });
      }
    },

    closeInfoWindow : function(){
        if(AMM.activeInfoWindow !== false){
            AMM.activeInfoWindow.close();

            AMM.activeInfoWindow = false;

            if(SS.initialized === true){
            //    WHICH ONE DO I WANT
                SS.hide();
           //     SS.reset();
            }

            return true; //window was closed
        } else {
            return false; //there was no window to close
        }
    },

    showOverlay : function(hosting_id){
    },

    removeOverlay : function(hosting_id){
        if(AMM.markers[hosting_id].active === true){
            AMM.markers[hosting_id].marker.setMap(null);
            AMM.markers[hosting_id].active = false;
        }
    },

    // Shows any overlays currently in the array
    showOverlays : function() {
        if(AirbnbSearch.currentViewType == 'map'){
            numberedPins = 21;
        } else {
            numberedPins = 21;
        }

        _queue_size = AMM.queue.length;

        if (_queue_size > 0) {
            var icon;
            var visited;
            var details;

            jQuery.each(AMM.queue, function(i, hosting_id){
                if(AMM.markers[hosting_id].active === false){

                    details = AMM.markers[hosting_id].details;
                    visited = jQuery.inArray(hosting_id.toString(), AirbnbSearch.viewedIds) !== -1;

                    if(i < numberedPins){

                        if(visited === true){
                            icon = MapIcons.numberedVisited[i + 1];
                        } else {
                            icon = MapIcons.numbered[i + 1];
                        }

                        var marker = new google.maps.Marker({
                            position : AMM.markers[hosting_id].location,
                            map : AMM.map,
                            icon : icon,
                            shadow : MapIcons.shadowStandard,
                            title : [(i + 1), '. ', details.name].join(''),
                            zIndex: (_queue_size - i)
                        });

                        AMM.markers[hosting_id].numbered_pin = i; //TODO use this!
                    } else {

                        if(visited){
                            icon = MapIcons.smallVisited;
                        } else {
                            icon = MapIcons.small;
                        }
                        var marker = new google.maps.Marker({
                            position : AMM.markers[hosting_id].location,
                            map : AMM.map,
                            icon : icon,
                            shadow : MapIcons.shadowSmall,
                            title : details.name,
                            zIndex: (_queue_size - i)
                        });

                        AMM.markers[hosting_id].numbered_pin = false; //TODO use this!
                    }

//                    var toolTip = ['<b>$', details.price, '</b> ', details.name].join('');
 //                   marker.attachTipTool(toolTip);

                    if(AirbnbSearch.currentViewType == 'map'){

                        var reviewWord = (details.review_count == 1 ? Translations.review : Translations.reviews);

                        var contentString = ['<div class="map_info_window">',
                                                '<a class="map_info_window_link_image" href="/rooms/', hosting_id, '" />',
                                                    '<img width="210" height="140" class="map_info_window_thumbnail" src="', details.hosting_thumbnail_url, '" />',
                                                '</a>',
                                                '<p class="map_info_window_details">',
                                                    '<a class="map_info_window_link" href="/rooms/', hosting_id, '" />',
                                                        details.name,
                                                    '</a>',
                                                    '<span class="map_info_window_review_count">', details.review_count, ' ', reviewWord, '</span>',
                                                    '<span class="map_info_window_price">',AirbnbSearch.currencySymbolLeft, details.price, AirbnbSearch.currencySymbolRight, '</span>',
                                                '</p>',
                                            '</div>'].join('');


                        var infowindow = new google.maps.InfoWindow({
                            content: contentString,
                            maxWidth: 241
                        });

                        google.maps.event.addListener(marker, 'click', function(event) {
                            AMM.closeInfoWindow();

                            //save this for later so we can retrieve pixel coordinates. this way we can intelligently hide the infowindow when it goes offscreen.
                            AMM.activeInfoWindowMarker = marker;

                            infowindow.open(AMM.map,marker);

                            if(SS.initialized === true){
                                //need to wait until domready, otherwise infowindow will be too tall (at least in FF)
                                google.maps.event.addListenerOnce(infowindow, 'domready', function() {
                                    if(SS.pictureArrays[hosting_id] !== undefined){
                                        jQuery('.map_info_window').find('img').attr('src', SS.fullImageUrl(SS.pictureArrays[hosting_id][0]));
                                    }

                                    SS.show('.map_info_window', hosting_id);
                                });
                            }

                            AMM.activeInfoWindow = infowindow;
                        });

                        google.maps.event.addListenerOnce(infowindow, 'closeclick', function() {
                            AMM.activeInfoWindow = false;
                        });

                        //google.maps.event.addListener(marker, 'mouseout', function() {
                         //     infowindow.close();
                        //});

                    } else { //list view
                        google.maps.event.addListener(marker, 'mouseover', function() {
                            AirbnbSearch.hoverListResult(hosting_id);
                        });

                        google.maps.event.addListener(marker, 'mouseout', function() {
                            AirbnbSearch.unHoverListResult(hosting_id);
                        });

                        google.maps.event.addListener(marker, 'click', function() {
                            AirbnbSearch.viewedIds.push(hosting_id.toString());

                            var icon = MapIcons.numberedVisitedHover[AMM.markers[hosting_id].numbered_pin + 1];
                            AMM.markers[hosting_id].marker.setIcon(icon);

                            //window.open(['/rooms/', hosting_id].join(''));
                            window.location = ['/rooms/', hosting_id].join('');
                        });

                    }


                    AMM.markers[hosting_id].marker = marker;
                    AMM.markers[hosting_id].active = true;
                } else {
                    //TEMPlog('trying to place existing marker twice');
                }
            });
        }

        AMM.clearQueue();
    },

    clearQueue : function() {
        AMM.queue = [];
    },

    // Deletes all markers in the array by removing references to them
    deleteOverlays : function() {
      if (AMM.markers) {
        for (i = 0; i < AMM.markers.size(); i++){ //THIS WON'T WORK
          AMM.markers[i].setMap(null);
        }
        AMM.markers.length = 0;
      }
    },

    initializeMapIcons : function(){
        
    },

    //convenience function
    turnMapListenersOn : function(){
        AMM.listenForMapChanges();
    },

    turnMapListenersOff: function() {
		if (AMM.mapLoaded) {
			google.maps.event.clearListeners(AMM.map, 'idle');
		}
    },

    listenForMapChanges: function() {
		if (AMM.mapLoaded) {
			google.maps.event.addListener(AMM.map, 'idle', function(){AMM.mapListenerCallback();});
		}
    },

	fitBounds: function(bounds) {
		if (AMM.mapLoaded) {
			AMM.map.fitBounds(bounds);
		}
	},

    //FIRST check to see if we should ask "Hey do you want to redo search in map?"
    //do not reload results if there is an info window open
    mapListenerCallback : function(){
        if(AMM.isFirstMapInteraction === true){
            AMM.isFirstMapInteraction = false;

            //if it's checked, let's assume they know what they are doing!
            if(!redoSearchInMapIsChecked()){
                AMM.redoSearchPromptTimeout = setTimeout(function(){
                    jQuery('#first_time_map_question').fadeOut(2000);
                }, 14000);

                jQuery('#first_time_map_question').show();

                return false;
            }
        }

        //check the marker coordinates so we can intelligently close the overlay if it is off screen
        if(AMM.activeInfoWindow && AMM.activeInfoWindowMarker){
            // this gives us pixel position of the infowindow's marker, relative to div#search_map. 0,0 is top left 
            var containerPixel = AMM.overlay.getProjection().fromLatLngToContainerPixel(AMM.activeInfoWindowMarker.getPosition());
            var x = containerPixel.x;
            var y = containerPixel.y;

            var xBias = 82; //distance in pixels from left of infowindow to center of marker

            var mapContainerDiv = jQuery('#search_map');
            var mapContainerWidth = mapContainerDiv.width();
            var mapContainerHeight = mapContainerDiv.height();

            var approxOverlayHeight = 260;
            var approxOverlayWidth = 250;

            var yOffset = approxOverlayHeight / 2;
            var xOffset = approxOverlayWidth / 2;

            if(redoSearchInMapIsChecked()){ //be liberal here, so the infowindow closes when it is ~halfway or more off the screen
                if((x < xOffset) || (y < yOffset) || (x > (mapContainerWidth - (xOffset) + (xBias / 2))) ||(y > (mapContainerHeight + (yOffset * 1.33))) ){
                    AMM.closeInfoWindow();
                }
            } else { 
                //this case happens when the user does not have redo search in map checked but is scrolling all over the map
                //if the icon is completely gone, we'll remove the overlay
                if(x < 0 || y < 0 || (x > (mapContainerWidth + xBias)) || y > (mapContainerHeight + approxOverlayHeight) ){
                    AMM.closeInfoWindow();
                }

            }
        }

        if(AMM.activeInfoWindow === false){
            AirbnbSearch.results_changed_by_map_action = true; 
            AirbnbSearch.loadNewResults(); 
        }
    }
};
/*** map actions ***/
var SearchFilters = {
    defaults : {callbackFunction: 'AirbnbSearch.loadNewResults', maxFilters: 4},
    has_photo : [],
    host_has_photo : [],
    languages : [],
    property_type_id : [],
    top_neighborhoods : [],
    neighborhoods : [],
    top_amenities : [],
    amenities : [],
    min_bedrooms : [],
    min_beds : [],
    min_bathrooms: [],
    group_ids: [],
    room_types: [[0, [Translations.private_room, 0]], [1, [Translations.shared_room, 0]], [2, [Translations.entire_place, 0]]],
    minPrice : 10,
    maxPrice : 300,
    
    filtersLightbox : false, //initializes as false until created

    applyPriceSliderChanges : function(ui){
        //if we can pass ui from the drag event, do it so we don't have to hit the dom
        if(ui !== undefined){ 
            jQuery("#slider_user_min").html([AirbnbSearch.currencySymbolLeft, ui.values[0], AirbnbSearch.currencySymbolRight].join(''));
            jQuery("#slider_user_max").html([AirbnbSearch.currencySymbolLeft, ui.values[1], (ui.values[1] == SearchFilters.maxPrice ? '+ ' : ''), AirbnbSearch.currencySymbolRight].join(''));
        } else {
            jQuery("#slider_user_min").html([AirbnbSearch.currencySymbolLeft, jQuery('#slider-range').slider('values')[0], AirbnbSearch.currencySymbolRight].join(''));
            jQuery("#slider_user_max").html([AirbnbSearch.currencySymbolLeft, jQuery('#slider-range').slider('values')[1], (jQuery('#slider-range').slider('values')[1] == SearchFilters.maxPrice ? '+ ' : ''), AirbnbSearch.currencySymbolRight].join(''));
        }
    },

    update: function(facets) {
        SearchFilters.setFacets(facets);
        SearchFilters.render();
    },

	/*
	 * What's inside the facets / data variable?
	 *
	 * data[0] == htmlValue (string or int)
	 * data[1][0] == 'Localized String' (string)
	 * data[1][1] == facetCount (int)
	 */
    setFacets: function(facets) {
		SearchFilters.connected = facets.connected || [];
        SearchFilters.room_types = facets.room_type || [];
        SearchFilters.top_neighborhoods = facets.top_neighborhoods || [];
        SearchFilters.neighborhoods = facets.neighborhood_facet || [];
        SearchFilters.top_amenities = facets.top_amenities || [];
        SearchFilters.amenities = facets.hosting_amenity_ids || [];
        SearchFilters.has_photo = facets.has_photo || [];
        SearchFilters.host_has_photo = facets.host_has_photo || [];
        SearchFilters.languages = facets.languages || [];
        SearchFilters.property_type_id = facets.property_type_id || [];
        SearchFilters.group_ids = facets.group_ids || [];
    },

    render: function(opts) {
        SearchFilters.renderSocialConnections();
        SearchFilters.renderRoomTypes();
        SearchFilters.renderAmenities();
        SearchFilters.renderNeighborhoods();

        SearchFilters.renderGenericLightboxFacet('property_type_id');
        SearchFilters.renderGenericLightboxFacet('languages');
        SearchFilters.renderGenericLightboxFacet('group_ids');
        SearchFilters.renderAppliedFilters();
        return true;
    },

    APPLIED_FILTER_NAMES : {
        'neighborhoods' : Translations.neighborhoods,
        'hosting_amenities' : Translations.amenities,
        'room_types' : Translations.room_type,
        'price' : Translations.price,
        'keywords' : Translations.keywords,
        'property_type_id' : Translations.property_type,
        'min_bedrooms' : Translations.bedrooms,
        'min_bathrooms' : Translations.bathrooms,
        'min_beds' : Translations.beds,
        'languages' : Translations.languages,
        'collection' : Translations.collection,
        'starred' : 'Starred Items',
        'host' : Translations.host,
        'group' : Translations.group,
		'connections' : Translations.connections
    },

    renderAppliedFilters : function(){
        jQuery('#applied_filters').empty();

        if(AirbnbSearch.params.neighborhoods && AirbnbSearch.params.neighborhoods.length > 0){
            SearchFilters.renderOneAppliedFilter('neighborhoods', SearchFilters.APPLIED_FILTER_NAMES.neighborhoods);
        }

        if(AirbnbSearch.params.price_max || AirbnbSearch.params.price_min){
            SearchFilters.renderOneAppliedFilter('price', SearchFilters.APPLIED_FILTER_NAMES.price);
        }

        if(AirbnbSearch.params.hosting_amenities && AirbnbSearch.params.hosting_amenities.length > 0){
            SearchFilters.renderOneAppliedFilter('hosting_amenities', SearchFilters.APPLIED_FILTER_NAMES.hosting_amenities);
        }

        if(AirbnbSearch.params.room_types && AirbnbSearch.params.room_types.length > 0){
            SearchFilters.renderOneAppliedFilter('room_types', SearchFilters.APPLIED_FILTER_NAMES.room_types);
        }

        if(AirbnbSearch.params.keywords && AirbnbSearch.params.keywords.length > 0){
            SearchFilters.renderOneAppliedFilter('keywords', SearchFilters.APPLIED_FILTER_NAMES.keywords);
        }

        if(AirbnbSearch.params.property_type_id && AirbnbSearch.params.property_type_id.length > 0){
            SearchFilters.renderOneAppliedFilter('property_type_id', SearchFilters.APPLIED_FILTER_NAMES.property_type_id);
        }

        if(AirbnbSearch.params.min_bedrooms && AirbnbSearch.params.min_bedrooms > 0){
            SearchFilters.renderOneAppliedFilter('min_bedrooms', SearchFilters.APPLIED_FILTER_NAMES.min_bedrooms);
        }

        if(AirbnbSearch.params.min_beds && AirbnbSearch.params.min_beds > 0){
            SearchFilters.renderOneAppliedFilter('min_beds', SearchFilters.APPLIED_FILTER_NAMES.min_beds);
        }

        if(AirbnbSearch.params.min_bathrooms && AirbnbSearch.params.min_bathrooms > 0){
            SearchFilters.renderOneAppliedFilter('min_bathrooms', SearchFilters.APPLIED_FILTER_NAMES.min_bathrooms);
        }

        if(AirbnbSearch.params.languages && AirbnbSearch.params.languages.length > 0){
            SearchFilters.renderOneAppliedFilter('languages', SearchFilters.APPLIED_FILTER_NAMES.languages);
        }

		if (AirbnbSearch.params.connected) {
			SearchFilters.renderOneAppliedFilter('connections', SearchFilters.APPLIED_FILTER_NAMES.connections);
		}

        if(AirbnbSearch.includeCollectionParam() === true){
            var label = AirbnbSearch.isViewingStarred ? SearchFilters.APPLIED_FILTER_NAMES.starred : SearchFilters.APPLIED_FILTER_NAMES.collection;
            if(AirbnbSearch.collectionName && AirbnbSearch.collectionName != ''){
                label = [label, AirbnbSearch.collectionName].join(': ');
            }

            SearchFilters.renderOneAppliedFilter('collections', label);
        }

        if(AirbnbSearch.isViewingStarred) {
            var label = SearchFilters.APPLIED_FILTER_NAMES.starred;
            SearchFilters.renderOneAppliedFilter('starred', label);
        }

        if(AirbnbSearch.includeHostParam()) {
            var hostLabel = SearchFilters.APPLIED_FILTER_NAMES.host;
            if(AirbnbSearch.hostName && AirbnbSearch.hostName !== ''){
                hostLabel = [hostLabel, AirbnbSearch.hostName].join(': ');
            }
            SearchFilters.renderOneAppliedFilter('host', hostLabel);
        }

        if(AirbnbSearch.includeGroupParam()) {
            var groupLabel = SearchFilters.APPLIED_FILTER_NAMES.group;
            if(AirbnbSearch.groupName && AirbnbSearch.groupName !== ''){
                groupLabel = [groupLabel, AirbnbSearch.groupName].join(': ');
            }

            SearchFilters.renderOneAppliedFilter('group', groupLabel);
        }

        //show or hide as necessary
        if(jQuery('#applied_filters').html() == ''){
            jQuery('#results_filters').hide();
        } else {
            jQuery('#results_filters').show();
        }

    },

    appliedFilterXCallback : function(xEl){
        var loadNewResultsAfter = true; //set to false if your clearing triggers a new search

        var appliedFilterLi = jQuery(xEl).closest('li');
        var appliedFilterId = jQuery(appliedFilterLi).attr('id').replace('applied_filter_', '');

        switch(appliedFilterId){
        case 'neighborhoods':
            SearchFilters.clearNeighborhoods();
            break;
        case 'price':
            loadNewResultsAfter = false;
            SearchFilters.clearPrice();
            break;
        case 'hosting_amenities':
            SearchFilters.clearAmenities();
            break;
        case 'room_types':
            SearchFilters.clearRoomTypes();
            break;
        case 'keywords':
            SearchFilters.clearKeywords();
            break;
        case 'property_type_id':
            SearchFilters.clearPropertyTypes();
            break;
        case 'min_bedrooms':
            SearchFilters.clearMinBedrooms();
            break;
        case 'min_bathrooms':
            SearchFilters.clearMinBathrooms();
            break;
        case 'min_beds':
            SearchFilters.clearMinBeds();
            break;
        case 'languages':
            SearchFilters.clearLanguages();
            break;
        case 'collections':
            SearchFilters.clearCollections();
            break;
        case 'starred':
            SearchFilters.clearStarred();
        case 'host':
            SearchFilters.clearHost();
            break;
        case 'group':
            SearchFilters.clearGroup();
            break;
		case 'connections':
			SearchFilters.clearConnections();
			break;
        default:
            //nothing
        }

        appliedFilterLi.remove(); //not strictly necessary, as the div will be refreshed after the ajax Call

        if(loadNewResultsAfter === true){
            AirbnbSearch.loadNewResults();
        }
    },

    clearStarred : function(){
      AirbnbSearch.isViewingStarred = false;  
    },

    clearCollections : function(forceHideCollection){
        forceHideCollection = forceHideCollection || true;

        if(AirbnbSearch.collectionId !== false && jQuery.trim(AirbnbSearch.collectionName).length != 0){
            setTimeout(function(){
                if(jQuery('#reinstate_collections').length == 0){
                    jQuery(["<a class='rounded_more reinstate_button' id='reinstate_collections'>Back to the  \"", AirbnbSearch.collectionName, "\" Collection</a>"].join('')).insertBefore('#v3_search');
                }
            }, 1000);
        }

        AirbnbSearch.forceHideCollection = forceHideCollection;
    },

    reinstateCollections : function(){

        AirbnbSearch.forceHideCollection = false;

        //blur will reset the autocomplete
        jQuery('#location').val('');

        AirbnbSearch.loadNewResults();
    },

    clearHost: function() {
        if(AirbnbSearch.hostId !== false && AirbnbSearch.hostName != '') {
            setTimeout(function(){
                if(jQuery('#reinstate_user').length == 0){
                    jQuery(["<a class='rounded_more reinstate_button' id='reinstate_user'>Back to properties from ", AirbnbSearch.hostName, "</a>"].join('')).insertBefore('#v3_search');
                }
            }, 1000);
        }

        AirbnbSearch.forceHideHost = true;
    },

    reinstateHost: function() {
        AirbnbSearch.forceHideHost = false;

        //blur will reset the autocomplete
        jQuery('#location').val('');
        AirbnbSearch.loadNewResults();
    },

    clearGroup: function() {
        if(AirbnbSearch.groupId !== false && AirbnbSearch.groupName !== '') {
            setTimeout(function(){
                if(jQuery('#reinstate_group').length == 0) {
                    jQuery(["<a class='rounded_more reinstate_button' id='reinstate_group'>Back to properties from ", AirbnbSearch.groupName, "</a>"].join('')).insertBefore('#v3_search');
                }
            }, 1000);
        }

        AirbnbSearch.forceHideGroup = true;
    },

    reinstateGroup: function() {
        AirbnbSearch.forceHideGroup = false;

        //blur will reset the autocomplete
        jQuery('#location').val('');
        AirbnbSearch.loadNewResults();
    },

    clearNeighborhoods : function(){
        jQuery("input[name=neighborhoods]").each(function(i, el){
            jQuery(el).attr('checked', false);
        });
    },

    clearAmenities : function(){
        jQuery("input[name=amenities]").each(function(i, el){
            jQuery(el).attr('checked', false);
        });
    },

    clearLanguages : function(){
        jQuery("input[name=languages]").each(function(i, el){
            jQuery(el).attr('checked', false);
        });
    },

	clearConnections: function() {
		$("input[name=connected]").attr("checked", false);
	},

    clearKeywords : function(){
        var keywords = jQuery('#keywords');
        if(AirbnbSearch.params.keywords !== undefined){
            delete AirbnbSearch.params.keywords;
        }

        keywords.val(keywords.attr('defaultValue'));
    },

    clearRoomTypes : function(){
        jQuery("input[name=room_types]").each(function(i, el){
            jQuery(el).attr('checked', false);
        });
    },

    clearPropertyTypes : function(){
        jQuery("input[name=property_type_id]").each(function(i, el){
            jQuery(el).attr('checked', false);
        });
    },

    clearMinBedrooms : function(){
        jQuery("#min_bedrooms").val('');
    },

    clearMinBathrooms : function(){
        jQuery("#min_bathrooms").val('');
    },

    clearMinBeds : function(){
        jQuery("#min_beds").val('');
    },

    clearPrice : function(){
        jQuery("#slider-range").slider("values", [jQuery("#slider-range").slider("option", "min"), jQuery("#slider-range").slider("option", "max")] );
        SearchFilters.applyPriceSliderChanges();
    },

    renderOneAppliedFilter: function(filterId, filterDisplayName) {
        jQuery('#applied_filters').append(
            jQuery('#applied_filters_template').jqote({filter_id : filterId, filter_display_name: filterDisplayName}, '*')
        );
    },

	renderSocialConnections: function() {
		var socialConnections = SearchFilters.connected && SearchFilters.connected[0];
		var selector = "#social_connections_container .search_filter_content";
		$(selector).empty();

		if (socialConnections) {
			SearchFilters.buildCheckbox({
				elementId: "connected",
				elementName: "connected",
				htmlValue: "connected",
				label: Translations.social_connections,
				facetCount: socialConnections[1],
				forceActive: true,
				appendToElementSelector: selector,
				checked: AirbnbSearch.params.connected
			});
		}
	},

    renderRoomTypes: function() {
        jQuery('#room_type_container ul.search_filter_content').empty();
        jQuery('#lightbox_filter_content_room_type').empty();

        jQuery.each(SearchFilters.room_types, function(index, data){
            if(AirbnbSearch.params.room_types && jQuery.inArray(data[0], AirbnbSearch.params.room_types) > -1){
                checked = true;
            } else {
                checked = false;
            }

            SearchFilters.buildCheckbox({elementId: ['room_type_', index].join(''), 
                                     elementName: 'room_types',
                                     htmlValue: data[0], 
                                     label: data[1][0], 
                                     facetCount: data[1][1],
                                     forceActive: true,
                                     appendToElementSelector: '#room_type_container ul.search_filter_content',
                                     checked: checked});

            SearchFilters.buildCheckbox({elementId: ['lightbox_room_type_', index].join(''), 
                                     elementName: 'room_types',
                                     htmlValue: data[0], 
                                     label: data[1][0], 
                                     forceActive: true,
                                     facetCount: data[1][1],
                                     appendToElementSelector: '#lightbox_filter_content_room_type',
                                     checked: checked});

        });

        SearchFilters.appendShowMoreLink('#room_type_container ul.search_filter_content');
    },

    renderAmenities: function() {
        var counter = 0;
        var checked;

        jQuery('#amenities_container ul.search_filter_content').empty();
        jQuery('#lightbox_container_amenities ul.search_filter_content').empty();

        //first do Top Amenities (if any)
        if(parseInt(SearchFilters.top_amenities.length) > 0){
            jQuery.each(SearchFilters.top_amenities, function(index, data){

                if(AirbnbSearch.params && AirbnbSearch.params.hosting_amenities && jQuery.inArray(data[0].toString(), AirbnbSearch.params.hosting_amenities) > -1){
                    checked = true;
                } else {
                    checked = false;
                }

                if(index < SearchFilters.defaults.maxFilters){
                    SearchFilters.buildCheckbox({elementId: 'amenity_' + index, 
                                             elementName: 'amenities',
                                             htmlValue: data[0], 
                                             label: data[1][0], 
                                             facetCount: data[1][1],
                                             checked : checked,
                                             appendToElementSelector: '#amenities_container ul.search_filter_content'});

                }

                counter++;
            });
        }

        if(parseInt(SearchFilters.amenities.length) > 0 && parseInt(SearchFilters.amenities.length) > counter){
            //next fill in with any other amenities and then populate the amenities lightbox
            jQuery.each(SearchFilters.amenities, function(index, data){

                if(AirbnbSearch.params && AirbnbSearch.params.hosting_amenities && jQuery.inArray(data[0].toString(), AirbnbSearch.params.hosting_amenities) > -1){
                    checked = true;
                } else {
                    checked = false;
                }

                if(counter === 0){
                    SearchFilters.buildCheckbox({elementId: 'amenity_' + counter, 
                                             elementName: 'amenities',
                                             htmlValue: data[0], 
                                             label: data[1][0], 
                                             facetCount: data[1][1],
                                             checked : checked,
                                             appendToElementSelector: '#amenities_container ul.search_filter_content'});

                }

                //always put the filter in the lightbox
                SearchFilters.buildCheckbox({elementId: 'lightbox_amenity_' + counter, 
                                             elementName: 'amenities',
                                             htmlValue: data[0], 
                                             label: data[1][0], 
                                             facetCount: data[1][1],
                                             checked : checked,
                                             appendToElementSelector: '#lightbox_container_amenities ul.search_filter_content'});

                counter++;
            });

            if(SearchFilters.amenities.length > SearchFilters.defaults.maxFilters){
                SearchFilters.appendShowMoreLink('#amenities_container ul.search_filter_content');
            }
        } else {
            jQuery('#amenities_container').hide();
        }

        if(counter > 0){
            jQuery('#amenities_container').show();
        }

        return true;
    },

    renderNeighborhoods : function(){

        var counter = 0;
        var checked;
        var htmlValueIsClean = true;

        jQuery('#neighborhood_container ul.search_filter_content').empty();
        jQuery('#lightbox_container_neighborhood ul.search_filter_content').empty();

        //first do Top Neighborhoods (if any)
        if(SearchFilters.top_neighborhoods && parseInt(SearchFilters.top_neighborhoods.length) > 0){
            jQuery.each(SearchFilters.top_neighborhoods, function(index, data){
                htmlValueIsClean = true;
                if(data[0].indexOf("'") > -1){
                    htmlValueIsClean = false;
                }


                if(AirbnbSearch.params && AirbnbSearch.params.neighborhoods && jQuery.inArray(data[0], AirbnbSearch.params.neighborhoods) > -1){
                    checked = true;
                } else {
                    checked = false;
                }

                if(index < SearchFilters.defaults.maxFilters && htmlValueIsClean){
                    SearchFilters.buildCheckbox({elementId: 'neighborhood_' + index, 
                                             elementName: 'neighborhoods',
                                             htmlValue: data[0], 
                                             label: data[1][0], 
                                             facetCount: data[1][1],
                                             checked : checked,
                                             appendToElementSelector: '#neighborhood_container ul.search_filter_content'});

                }

                counter++;
            });
        }

        if(SearchFilters.neighborhoods && parseInt(SearchFilters.neighborhoods.length) > 0 && parseInt(SearchFilters.neighborhoods.length) > counter){
            //next fill in with any other neighborhoods and then populate the neighborhoods lightbox
 

            jQuery.each(SearchFilters.neighborhoods, function(index, data){

                htmlValueIsClean = true;
                if(data[0].indexOf("'") > -1){
                    htmlValueIsClean = false;
                }



                if(AirbnbSearch.params && AirbnbSearch.params.neighborhoods && jQuery.inArray(data[0], AirbnbSearch.params.neighborhoods) > -1){
                    checked = true;
                } else {
                    checked = false;
                }

                if(counter === 0 && htmlValueIsClean){ //temporary hack to not include neighborhoods with '
                    SearchFilters.buildCheckbox({elementId: 'neighborhood_' + counter, 
                                             elementName: 'neighborhoods',
                                             htmlValue: data[0], 
                                             label: data[1][0], 
                                             facetCount: data[1][1],
                                             checked : checked,
                                             appendToElementSelector: '#neighborhood_container ul.search_filter_content'});

                }

                //always put the filter in the lightbox
                if(htmlValueIsClean){
                    SearchFilters.buildCheckbox({elementId: 'lightbox_neighborhood_' + counter, 
                                                 elementName: 'neighborhoods',
                                                 htmlValue: data[0], 
                                                 label: data[1][0], 
                                                 facetCount: data[1][1],
                                                 checked : checked,
                                                 appendToElementSelector: '#lightbox_container_neighborhood ul.search_filter_content'});

                }

                counter++;
            });

            if(SearchFilters.neighborhoods.length > SearchFilters.defaults.maxFilters){
                SearchFilters.appendShowMoreLink('#neighborhood_container ul.search_filter_content');
            }
        } else {
            jQuery('#neighborhood_container').hide();
        }

        if(counter > 0){
            jQuery('#neighborhood_container').show();
        }

        return true;
    },

    renderGenericLightboxFacet: function(facetName) {
        var checked;

        jQuery(['#lightbox_filter_content_', facetName].join('')).empty();
        jQuery.each(SearchFilters[facetName], function(index, data) {
            if(AirbnbSearch.params && AirbnbSearch.params[facetName] && AirbnbSearch.params[facetName] !== undefined && (jQuery.inArray(data[0].toString(), AirbnbSearch.params[facetName]) > -1)){
                checked = true;
            } else {
                checked = false;
            }

            SearchFilters.buildCheckbox({elementId: ['lightbox_', facetName, '_', index].join(''), 
                                     elementName: facetName,
                                     htmlValue: data[0], 
                                     label: data[1][0], 
                                     forceActive: true,
                                     facetCount: data[1][1],
                                     appendToElementSelector: ['#lightbox_filter_content_', facetName].join(''),
                                     checked: checked});

        });
    },

    /*
     *
     * This is a generic function to create a checkbox with labels and counts. It does not place the element anywhere on your page
     *
     * elementName - html name to give the newly created element, will default to elementId if not specified, will default to name
     * elementId - html id to give the newly created element
     * label - Descriptive text that appears to the right of the checkbox. should already be localized
     * htmlValue - corresponds to the HTML value element, will be passed
     * facetCount - number of results you'll get by drilling down
     *
     * appendToElementSelector - a jQuery selector to append the filter to. Will always go into the bottom
     *
     * returns a jQuery element (?) or a string (?)
     */
    buildCheckbox : function(options){
        options = options || {};
        var checked = typeof(options['checked']) == 'undefined' ?  false : options['checked'];

        var elementName = options['elementName'] || options['elementName'] || '';
        var elementId = options['elementId'] || '';
        var appendToElementSelector = options['appendToElementSelector'] || '';
        var label = options['label'] || '';
        var htmlValue = options['htmlValue'].toString() || '';
        var facetCount = options['facetCount'] || false;
        var forceActive = options['forceActive'] || false;
        var onChangecallbackFunction = options['onChangecallbackFunction'] || SearchFilters.defaults.callbackFunction;

        var html = ["<li>", "<input type='checkbox' id='", elementId, 
                        "' name='",elementName, "' value='", htmlValue, "'", 
                        ((facetCount > 0 || checked === true || forceActive === true)? '' : " disabled='disabled'"),
                        (checked == false ? '' : " checked='checked'"),
                        " /> ",
                        "<label ", ((facetCount > 0 || checked === true || forceActive === true) ? '' : ' class="disabled" '),"for='", elementId, "'>", label, "</label>", (facetCount > 0 ? ["<span class='facet_count'>", facetCount, "</span>"].join('') : ''),
                    '</li>'].join('');

        if(appendToElementSelector != ''){
            jQuery(appendToElementSelector).append(html);
        }

        return false;
    },

    appendShowMoreLink : function(appendToElementSelector){
        if(appendToElementSelector === undefined && unique_id === undefined){
            return false;
        }

        jQuery(appendToElementSelector).append("<li><a href='javascript:void(0);' id='show_more_' class='show_more_link'>Show More...</a></li>");

        return true;
    },

    openFiltersLightbox : function(){
        SearchFilters.filtersLightbox = SearchFilters.filtersLightbox || jQuery('#filters_lightbox').dialog({ 
            autoOpen : false,
            height : 500,
            width : 600
        });

        SearchFilters.filtersLightbox.dialog('open');
    },

    closeFiltersLightbox : function(){
        if(SearchFilters.filtersLightbox){
            SearchFilters.filtersLightbox.dialog('close');
        }
    },

    selectLightboxTab : function(tab){

        var tab = tab || 'room_type';

        jQuery('.filters_lightbox_nav_element').removeClass('active');
        jQuery('.lightbox_filter_container').hide();

        jQuery('#lightbox_nav_' + tab).addClass('active');
        jQuery('#lightbox_container_' + tab).show();
    }
};

var SearchHelpers = {
    emailToAFriend : function(){
        //log('email sent');
        return true;
    }
};

var SS = {
    initialized : false,
    /* all in milliseconds */
    SHORT_TIMEOUT : 50, //delay for first entering a photo container
    LONG_TIMEOUT : 675, //delay between each photo load
    FADE_DURATION : 250, //fade duration
    containerEl : jQuery('#page2_inline_slideshow'),
    imgEl : jQuery('#page2_inline_slideshow_img'),
    isFirstHover : true,
    cloudFrontUrl : 'http://d3mjr4yb15zzlp.cloudfront.net/pictures/',
    //countEl : jQuery('#page2_inline_slideshow_count'),

    // containerEl
    // imgEl
    //
    // transition...
    // 1) set containerEl img src to currentUrl
    // 2) hide imgEl
    // 3) set imgEl src to nextUrl (or prevUrl)
    // 4) oncomplete of 3, set currentUrl to prevUrl
    // 5) fade in imgEl
    // 6) oncomplete of fade, set containerEl img src to currentUrl

    hoverTimeout : false,
    pictureArrays : {},
    currentUrls : [],
    currentParentDivId : undefined,
    currentHostingId : undefined,
    currentPosition : 0,
    _totalPicturesSizeCache : false,

    addHostingAndIds : function(hosting_id, arrayOfPictureIds){
        if(SS.pictureArrays[hosting_id] === undefined){
            SS.pictureArrays[hosting_id] = arrayOfPictureIds;
        }
    },

    fullImageUrl : function(imageId){
        var url = [SS.cloudFrontUrl, imageId, '/small.jpg'].join('');
        return url;
    },

    initOnce : function(){
        if(SS.initialized === false){
            SS.init();
        }
    },

    //attach listeners
    init: function() {
        jQuery('#page2_inline_slideshow, .map_info_window_link_image').live('hover', function(event){
            if (event.type == 'mouseover') {
                if(SS.hoverTimeout){
                    clearTimeout(SS.hoverTimeout);
                }

                if(SS.isFirstHover === true){
                    SS.hoverTimeout = setTimeout(function(){ SS.next(); }, SS.SHORT_TIMEOUT);

                    SS.isFirstHover = false;
                } else {
                    //change photo every 1 second
                    SS.hoverTimeout = setTimeout(function(){ SS.next(); }, SS.LONG_TIMEOUT);
                }
            } else {
                SS.reset();
            }
        });

        SS.initialized = true;
    },

    next : function(){
        //no need to shift if there is only one picture!
        if(SS.totalPicturesSize() <= 1){
            //log('size <= 1');
            return false;
        } else {
            var curUrl = SS.fullImageUrl(SS.pictureArrays[SS.currentHostingId][0]);

            //No time for the ol' in-out, love. I've just come to read the meter!
            SS.pictureArrays[SS.currentHostingId].push(SS.pictureArrays[SS.currentHostingId].shift());

            var newUrl = SS.fullImageUrl(SS.pictureArrays[SS.currentHostingId][0]);

            SS.imgEl.attr('src', curUrl);
            SS.imgEl.show();


            SS.preloadImage(newUrl, function(){
                //log('calling preload image function');
                if(AirbnbSearch.currentViewType == 'map'){
                    jQuery('.map_info_window').find('img').attr('src', newUrl);
                } else {
                    jQuery(SS.currentParentDivId).find('.search_thumbnail').attr('src', newUrl);
                }

                SS.imgEl.fadeOut(SS.FADE_DURATION, function(){
                    //log('fading out');
                    SS.imgEl.attr('src', "/images/uiwidgets/transparent1x1.gif");
                    SS.hoverTimeout = setTimeout(function(){ SS.next(); }, SS.LONG_TIMEOUT);
                });
            });
        }
    },

    show : function(parentDivId, hosting_id){
        SS.currentParentDivId = parentDivId;
        SS.currentHostingId = hosting_id;

        SS.attachToParent();

        SS.containerEl.show();
    },

    hide : function(){
        SS.containerEl.hide();
    },

    //sets up a href
    attachToParent : function(){
        //SS.reset();

        if(SS.currentParentDivId){
            if(AirbnbSearch.currentViewType == 'map'){
                SS.containerEl.appendTo(SS.currentParentDivId);
                SS.containerEl.attr('href', jQuery(SS.currentParentDivId).find('a.image_link').attr('href'));
            } else {
                SS.containerEl.appendTo(SS.currentParentDivId);
                SS.containerEl.attr('href', jQuery(SS.currentParentDivId).find('a.image_link').attr('href'));
            }
        }
    },

    reset : function(){
        //log('reset');
        SS.hide();
        SS.imgEl.hide();
        if(SS.hoverTimeout !== false){
            //log('clearing timeout from reset');
            clearTimeout(SS.hoverTimeout);
            SS.hoverTimeout = false;
        }

        SS.isFirstHover = true;
    },

    totalPicturesSize : function(){
        return SS._totalPicturesSizeCache ? SS._totalPicturesSizeCache : SS.pictureArrays[SS.currentHostingId].length;
    },

    preloadImage : function(imgSrc, callback){
        var objImagePreloader = new Image();

        objImagePreloader.src = imgSrc;

        if(objImagePreloader.complete){
            if(SS.hoverTimeout !== false){
                callback();
            }
            objImagePreloader.onload = function(){};
        } else {
            objImagePreloader.onload = function() {
                if(SS.hoverTimeout !== false){
                    callback();
                }

                //clear onLoad, IE behaves erratically with animated gifs otherwise
                objImagePreloader.onload=function(){};
            };
        }
    }

};
