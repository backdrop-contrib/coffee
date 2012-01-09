(function ($) {
  
  var label         = $('<label for="coffee-q" class="element-invisible" />').text(Drupal.t('Query')),
      field         = $('<input id="coffee-q" type="text" autocomplete="off" />'),
      results       = $('<ol id="coffee-results" />'),
      form          = $('<form id="coffee-form" />');
  
  $(document).ready(function () {
    form.append(label).append(field).append(results).wrapInner('<div id="coffee-form-inner" />').appendTo('body').hide();
  })
  .keydown(function (event) {
    
    // Show the form with alt + D
    if (!form.is(':visible') && event.altKey === true && event.keyCode === 68) {
      event.preventDefault();
      form.show();
      
      field.focus().keyup(function () {
        var query = field.val(),
            placeholder = $('<ol />');

        $.getJSON(Drupal.settings.basePath + 'admin/coffee/result/' + query, function (data) {
          $.each(data, function (key, value) {
            var description = $('<small class="description" />').text(value.path);
            $('<a />').text(value.title)
              .attr('href', Drupal.settings.basePath + value.path)
              .append(description)
              .appendTo(placeholder)
              .wrap('<li />');
          });
          results.html(placeholder.children());
        });
      });
    }

    // Form closing and redirect handling.
    // Use enter directly from the search field to go to the first result
    // Close the form manually with esc or alt + D
    else if (form.is(':visible') && ( event.keyCode === 13 || event.keyCode === 27 || (event.altKey === true && event.keyCode === 68) )) {
      event.preventDefault();

      var redirectPath = null;

      // Redirect to a result when enter is used on the link for it.
      // Redirect to the first result when no href is found; we assume that the active element is the search field.
      if (event.keyCode === 13 && results.children().length) {
        redirectPath = event.srcElement.href ? event.srcElement.href : results.find('a:first').attr('href');
      }
      
      field.val('');
      results.empty();
      form.hide();
      
      if (redirectPath) {
        document.location = redirectPath;
      }
    }
    
    // Use the arrow up key to navigate up in the results
    else if (form.is(':visible') && results.children().length && event.keyCode === 38) {
      event.preventDefault();
      
      var activeElement = $(document.activeElement);
      
      // Go to the last result if at the first result or at the search field
      if (activeElement[0] === results.find('a:first')[0] || activeElement[0] === field[0]) {
        results.find('a:last').focus();
      }
      else {
        activeElement.parent().prev().find('a').focus();
      }
    }
    
    // Use the arrow down key to navigate down in the results
    else if (form.is(':visible') && results.children().length && event.keyCode === 40) {
      event.preventDefault();
      
      var activeElement = $(document.activeElement);
      
      // Go to the first result if at the last result or at the search field
      if (activeElement[0] === results.find('a:last')[0] || activeElement[0] === field[0]) {
        results.find('a:first').focus();
      }
      else {
        activeElement.parent().next().find('a').focus();
      }
    }
    
  });
  
  // Fix bitch fights between :hover and :focus for results (prevent two highlighted results)
  // .live() is deprecated ==>> convert to .on() when Drupal gets jQuery 1.7+
  // http://api.jquery.com/live/
  $('#coffee-results a').live('hover', function () {
    $(this).focus();
  });

}(jQuery));
