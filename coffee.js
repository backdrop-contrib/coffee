(function ($) {
  
  var label     = $('<label for="coffee-q" class="element-invisible" />').text(Drupal.t('Query')),
      field     = $('<input id="coffee-q" type="text" autocomplete="off" />'),
      results   = $('<ol id="coffee-results" />'),
      form      = $('<form id="coffee-form" />'),
      bg        = $('<div id="coffee-bg" />').click(function () { closeForm(); }),
  
      // Close the form and get rid of all data
      closeForm = function () {
        field.val('');
        results.empty();
        form.hide();
        bg.hide();
      },
  
      // Move the focus up or down the results list
      moveFocus = function (direction) {
        var activeElement = $(document.activeElement);
    
        // Loop around the results when at the first or last, or at the search field.
        // Skip the first result if it already has the fake focus class.
        if (activeElement[0] === results.find('a:' + (direction === 'up' ? 'first' : 'last'))[0] || activeElement[0] === field[0]) {
          results.find((direction === 'down' && $('#coffee-results .focus').length ? 'li:nth-child(2) ' : '') + 'a:' + (direction === 'up' ? 'last' : 'first')).focus();
        }
        else if (direction === 'up') {
          activeElement.parent().prev().find('a').focus();
        }
        else {
          activeElement.parent().next().find('a').focus();
        }
      };

  // Prevent multiple highlighted results with :hover and :focus.
  // .live() is deprecated ==>> convert to .on() when Drupal gets jQuery 1.7+
  // http://api.jquery.com/live/
  $('#coffee-results a').live('hover', function () {
    $(this).focus();
  // Remove the fake focus class once actual focus is used
  }).live('focus', function () {
    $('#coffee-results .focus').removeClass('focus');
  });
  
  
  $(document).ready(function () {
    bg.appendTo('body').hide();
    form.append(label).append(field).append(results).wrapInner('<div id="coffee-form-inner" />').appendTo('body').hide();
  })
  .keydown(function (event) {
    
    // Show the form with alt + D
    if (!form.is(':visible') && event.altKey === true && event.keyCode === 68) {
      form.show();
      bg.show();
      
      field.focus().keyup(function () {
        var query = field.val(),
            placeholder = $('<ol />');

        $.getJSON(Drupal.settings.basePath + 'admin/coffee/result/' + query, function (data) {
          if (data) {
            $.each(data, function (key, value) {
              var description = $('<small class="description" />').text(value.path);
              $('<a />').text(value.title)
                .attr('href', Drupal.settings.basePath + value.path)
                .append(description)
                .appendTo(placeholder)
                .wrap('<li />');
            });
          
            // Highlight the first result as if it were focused as a visual hint for using the enter key from the search field
            results.html(placeholder.children()).find('a:first').addClass('focus');
          }
        });
      });
      
      event.preventDefault();
    }

    // Redirect to a result when the enter key is used on the link for it.
    // Redirect to the first result when the enter key is used in the search field.
    // Close the form automatically when redirecting or manually with esc or alt + D.
    else if (form.is(':visible') && ( event.keyCode === 13 || event.keyCode === 27 || (event.altKey === true && event.keyCode === 68) )) {

      var redirectPath = null;

      // We assume that the active element is the search field when srcElement.href isn't available
      if (event.keyCode === 13 && results.children().length) {
        redirectPath = event.srcElement.href ? event.srcElement.href : results.find('a:first').attr('href');
      }
      
      closeForm();
      
      if (redirectPath) {
        document.location = redirectPath;
      }
      event.preventDefault();
    }
    
    // Use the arrow up/down keys to navigate trough the results
    else if (form.is(':visible') && results.children().length && (event.keyCode === 38 || event.keyCode === 40)) {
      moveFocus(event.keyCode === 38 ? 'up' : 'down');
      event.preventDefault();
    }
    
  });

}(jQuery));
