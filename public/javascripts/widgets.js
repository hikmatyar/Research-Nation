(function($){
  $.fn.clickStar = function(callback){
    var starCountElement = $('#star_count');
    var starCount = parseInt(starCountElement.html());

    return this.each(function(){ 
      // store the hosting ID
      var hosting_id = $(this).data('hosting_id');

      if(hosting_id == undefined || hosting_id == null)
        $(this).data('hosting_id', parseInt($(this).attr('id').substring(5)));
      // a handler was already added to the star, so we don't need to do anything else
      else
        return;

      // search the array of starred hosting IDs for this hosting
      if($.inArray($(this).data('hosting_id'), Airbnb.Bookmarks.starredIds) != -1)
        $(this).find('div.star_icon').addClass('starred');

      // add click handler to the star
      $(this).click(function(){
        if(!Airbnb.Utils.isUserLoggedIn){
          if(confirm("You must create a free account or login to use this feature. Continue?"))
            window.location = "/signup_login";

          return;
        }

        var starElement = $(this).find('div.star_icon');

        var isStarred = starElement.hasClass('starred');

        // pre-set the star state, to increase responsiveness
        if(isStarred){
          var elIdx = $.inArray($(this).data('hosting_id'), Airbnb.Bookmarks.starredIds);

          if(elIdx != -1)
            Airbnb.Bookmarks.starredIds.splice(elIdx, 1);

          starCount--;
          starElement.removeClass('starred'); 
        }
        else {
          Airbnb.Bookmarks.starredIds.push($(this).data('hosting_id'));
          starCount++;
          starElement.addClass('starred');
        }

        starCountElement.fadeOut(100, function(){ 
          starCountElement.html(starCount); 
          starCountElement.fadeIn(300, function(){
            var headerStarCount = jQuery('#star-indicator');

            if(headerStarCount.is(':visible') && starCount == 0)
              headerStarCount.fadeOut(500);
            else if(!headerStarCount.is(':visible') && starCount > 0)
              headerStarCount.fadeIn(500);
          }); 
        });

        // fire off an ajax handler to notify the backend
        jQuery.ajax({url: '/favorites/' + $(this).data('hosting_id') + '/star', 
                     type: isStarred ? "DELETE" : "POST",
                     dataType: 'json',
                     async: true, 
                     context: this, 
                     success: function(response){ 

          var starElement = $(this).find('div.star_icon');

          if(response['result'] == 'login'){
            starElement.removeClass('starred');

            if(confirm("You must create a free account to use this feature. Continue?"))
              window.location = response['redirect_to'];
          }
          else if(response['result'] == 'deleted' && starElement.hasClass('starred')){
            starElement.removeClass('starred');
          }
          else if(response['result'] == 'created' && !starElement.hasClass('starred')){
            starElement.addClass('starred');
          }
        }});

        isStarred = !isStarred;

        if(callback)
          callback(this, isStarred);

        return false;
      });
    });
  };
})(jQuery);
