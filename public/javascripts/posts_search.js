var industries = new Array();
var geographies = new Array();
var count = 0;

function populate_array_text(){
  $('#industry_result p').each(function(){
        industries.push($(this).text());
    });

    $('#geography_result p').each(function(){
        geographies.push($(this).text());
    });
}

$('document').ready(function(){

  $('input').click(function() {
    $(this).trigger("focus");  
   });

  $('#author_name').autocomplete('/users/unique_users');
  $('#industry').autocomplete('/resources/get_industries', { autoFill : true});
  $('#geography').autocomplete('/resources/get_geography_list');

  $('#author_name').result(function(event, data, formatted) {
    url = "/resources/filter_by_author_name?name="+ formatted +"&price=" + $(":range").val();
    $.ajax({
      url: url,
      success: function(data){
        $("#left_content").html(data);
      }
    });
  });

  $(":range").rangeinput().change(function(){
      populate_array_text();

      url = "/resources/filter_results?industry="+ industries.join(",") +"&geography="+ geographies.join(",") +"&price=" + $(":range").val();

      $.ajax({
        url: url,
        success: function(data){
          $("#left_content").html(data);
        }
      });

      $(':range').val("$" + $(':range').val());
  });

  $('#industry').result(function(event, data, formatted) {
      
      industries.push(formatted);

      url = "/resources/filter_results?industry="+ industries.join(",") +"&geography="+ geographies.join(",") +"&price=" + $(":range").val().replace("$","");
      $("#industry_result").append('<div class="cross_tip"><p> ' + formatted +'</p> <span id="industry_tag'+count+'"></span><img src="/images/cross_tip.png" /></div>');

      $.ajax({
        url: "/resources/industries_count?industry="+formatted,
        success: function(data){
          update_item = '#industry_tag'+count;
          $(update_item).html(data);
          count++;
        }
      });

     $.ajax({
       url: url,
       success: function(data){
        $("#left_content").html(data);
       }
     });

    $("#industry_result img").click(function(){
      $(this).parent().remove();
      industries = [];
      populate_array_text();
      url = "/resources/filter_results?industry="+ industries.join(",") +"&geography="+ geographies.join(",") +"&price=" + $(":range").val();
      $.ajax({
        url: url,
        success: function(data){
          $("#left_content").html(data);
        }
      });
    });
    $('#industry').val("");
  });

  $('#geography').result(function(event, data, formatted) {

      populate_array_text();
      geographies.push(formatted);
      url = "/resources/filter_results?industry="+ industries.join(",") +"&geography="+ geographies.join(",") +"&price=" + $(":range").val();
      $("#geography_result").append('<div class="cross_tip"><p> ' + formatted +'</p> <span id="geography_tag'+count+'"></span><img src="/images/cross_tip.png" /></div>');

      $.ajax({
        url: "/resources/geography_count?geography="+formatted,
        success: function(data){
          update_item = '#geography_tag'+count;
          $(update_item).html(data);
          count++;
        }
      });

      $.ajax({
        url: url,
        success: function(data){
          $("#left_content").html(data);
        }
      });

      $("#geography_result img").click(function(){
        $(this).parent().remove();
        geographies = [];
        populate_array_text();
        url = "/resources/filter_results?industry="+ industries.join(",") +"&geography="+ geographies.join(",") +"&price=" + $(":range").val();
        $.ajax({
          url: url,
          success: function(data){
            $("#left_content").html(data);
          }
        });
      });

      $('#geography').val("");
  });

  $(".reset_button").click(function(){
    window.location.reload();
  });

  $("#geography").click(function(){
    $(this).css("color","#000");
    $(this).val("");
  });

  $("#industry").click(function(){
    $(this).css("color","#000");
    $(this).val("");
  });

  $(":range").val("$1000");
  $('.handle').css("left","183px");
});
