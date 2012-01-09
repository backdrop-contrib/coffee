(function ($) {
  
  var label         = $('<label for="coffee-q" class="element-invisible" />').text(Drupal.t('Query')),
      field         = $('<input id="coffee-q" type="text" autocomplete="off" />'),
      results       = $('<ol id="coffee-results" />'),
      form          = $('<form id="coffee-form" />'),
      focusedResult = 0;
  
  $(document).ready(function () {
    form.append(label).append(field).append(results).wrapInner('<div id="coffee-form-inner" />').appendTo('body').hide();
  })
  .keydown(function (event) {
    
    // Show the form with ALT + D
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
    else if (form.is(':visible') && ( event.keyCode == 13 || event.keyCode === 27 || (event.altKey === true && event.keyCode === 68) )) {
      event.preventDefault();
      field.val('');
      results.empty();
      form.hide();
      focusedResult = 0;
      
      if (event.keyCode == 13 && !event.srcElement.href && results.children().length) {
        document.location = results.find('a:first').attr('href');
      }
    }
    
    // Use the arrow up key to navigate up in the results
    else if (form.is(':visible') && results.children().length && event.keyCode === 38) {
      event.preventDefault();
      
      // Go to the last result if at the first result or at the search box
      if (focusedResult < 2) {
        focusedResult = results.children().length;
        results.find('a:last').focus();
      }
      else {
        --focusedResult;
        results.find('li:nth-child(' + focusedResult + ') a').focus();
      }
    }
    
    // Use the arrow down key to navigate down in the results
    else if (form.is(':visible') && results.children().length && event.keyCode === 40) {
      event.preventDefault();
      
      // Go to the first result if at the last result
      if (focusedResult === results.children().length) {
        focusedResult = 1;
        results.find('a:first').focus();
      }
      else {
        ++focusedResult;
        results.find('li:nth-child(' + focusedResult + ') a').focus();
      }
    }
    
  });

}(jQuery));
