$(document).ready(function() {

  var global_search = $('input.avs-autocomplete').typeahead({
    minLength: 3,
    highlight: true,
    // Override highlighter method to allow case insensitive highlighting.
    highlighter: function (item) {
      var text = this.query;
      if(text===""){
        return item;
      }
      var matches = item.match(/(>)([^<]*)(<)/g);
      var first = [];
      var second = [];
      var i;
      if(matches && matches.length){
        //html
        for (i = 0; i < matches.length; ++i) {
          if (matches[i].length > 2) {//escape '><'
            first.push(matches[i]);
          }
        }
      }else{
        //text
        first = [];
        first.push(item);
      }
      text = text.replace((/[\(\)\/\.\*\+\?\[\]]/g), function(mat) {
          return '\\' + mat;
      });
      // Patch is here.
      var reg = new RegExp(text, "gi");
      var m;
      for (i = 0; i < first.length; ++i) {
        m = first[i].match(reg);
        if(m && m.length>0){//find all text nodes matches
          second.push(first[i]);
        }
      }
      for (i = 0; i < second.length; ++i) {
        item = item.replace(second[i],second[i].replace(reg, '<strong>$&</strong>'));
      }
      return item;
    },
    // Override matcher method to allow fuzzy search.
    matcher: function() {return true},
    // transform: $.toUpperCase,
    source:  function (query, process) {
      return $.get('data/autocomplete.php', { query: query }, function (data) {
        data = $.parseJSON(data);
        return process(data);
      });
    }
  }).bind('keyup.bootstrap3Typeahead', function(e) {
    var dropdown = $(e.currentTarget).next(".dropdown-menu");
    if (dropdown.is(":visible")) {

        var doc_w = $(window).width();
        var dropdown_w = doc_w - dropdown.offset().left - 20;
        dropdown.css({
            'max-width':dropdown_w,
            'width':'auto'
        })

    }
  });
  $(window).resize(function(){
    global_search.trigger('blur');
  })


});