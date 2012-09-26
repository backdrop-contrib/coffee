(function ($) {

Drupal.coffee = Drupal.coffee || {};

Drupal.behaviors.coffee = {
  attach: function () {
    $('body').once('coffee', function () {

      var body = $(this);

      // Use a background element to make the form closable by clicking outside it
      Drupal.coffee.bg.appendTo(body);

      // Append the form, add an inner div for validation and styling
      Drupal.coffee.form.wrapInner('<div id="coffee-form-inner" />').appendTo(body);

      // Hide all elements until alt+D is pressed
      Drupal.coffee.hide();

      $(document).keydown(function (event) {

        var activeElement = $(document.activeElement);

        // Show the form with alt+D. We use 2 keycodes as 'D' can be upper- or lowercase
        if ( !Drupal.coffee.form.is(':visible') && event.altKey === true && (event.keyCode === 68 || event.keyCode === 206) ) {
          Drupal.coffee.show();
          event.preventDefault();
        }

        // Hide the form with esc or alt+D
        else if ( Drupal.coffee.form.is(':visible') && (event.keyCode === 27 || (event.altKey === true && (event.keyCode === 68 || event.keyCode === 206))) ) {
          Drupal.coffee.hide();
          event.preventDefault();
        }

        // Enter key handling for the search field: follow the first result link
        else if (Drupal.coffee.form.is(':visible') && event.keyCode === 13 && activeElement[0] === Drupal.coffee.field[0]) {
          if (Drupal.coffee.results.children().length) {
            Drupal.coffee.results.find('a:first').addClass('trigger').click();
          }
          event.preventDefault();
        }

        // Use the arrow up/down keys to navigate trough the results
        else if ( Drupal.coffee.form.is(':visible') && Drupal.coffee.results.children().length && (event.keyCode === 38 || event.keyCode === 40) ) {

          // From the search field: jump to the first (down) or last (up) result.
          // Skip the first result if it already has the fake focus class.
          if (activeElement[0] === Drupal.coffee.field[0]) {
            Drupal.coffee.results.find( event.keyCode === 38 ? 'a:last' : (Drupal.coffee.results.find('a:first').hasClass('focus') ? 'li:nth-child(2) a' : 'a:first') ).focus();
          }

          // Jump to the last result if 'up' is used on the first, and the other way around
          else if (activeElement[0] === Drupal.coffee.results.find(event.keyCode === 38 ? 'a:first' : 'a:last')[0]) {
            Drupal.coffee.results.find( event.keyCode === 38 ? 'a:last' : 'a:first' ).focus();
          }

          // Assuming we're on a result link
          else if (event.keyCode === 38) {
            activeElement.parent().prev().find('a').focus();
          } else {
            activeElement.parent().next().find('a').focus();
          }

          event.preventDefault();
        }

      });


      // .live() is deprecated ==>> convert to .on() when Drupal gets jQuery 1.7+ (http://api.jquery.com/live/)

      // Remove the fake focus class once actual focus is used
      $('#coffee-results a').live('focus', function () {
        Drupal.coffee.results.find('.focus').removeClass('focus');
      })
      // Hide the form explicitly after following a link as pages aren't reloaded when the overlay is used
      .live('click', function () {
        Drupal.coffee.hide();
      });

      // Simulate native click behavior when using .trigger()
      $('#coffee-results .trigger').live('click', function () {
        window.location.href = this.href;
        return false;
      });
    });
  }
};

Drupal.coffee.show = function () {
  Drupal.coffee.form.show();
  Drupal.coffee.bg.show();
  Drupal.coffee.field.focus();
};

Drupal.coffee.hide = function () {
  Drupal.coffee.field.val('');
  Drupal.coffee.results.empty();
  Drupal.coffee.form.hide();
  Drupal.coffee.bg.hide();
};

Drupal.coffee.bg = $('<div id="coffee-bg" />')
  .click(function () {
    Drupal.coffee.hide();
  });

Drupal.coffee.form = $('<form id="coffee-form" />');

Drupal.coffee.label = $('<label for="coffee-q" class="element-invisible" />')
  .appendTo(Drupal.coffee.form)
  .text(Drupal.t('Query'));

Drupal.coffee.field = $('<input id="coffee-q" type="text" autocomplete="off" />')
  .appendTo(Drupal.coffee.form)
  .keyup(function () {
    Drupal.coffee.resultsPlaceholder.empty();

    if (Drupal.coffee.field.val().length > 0) {
      $.getJSON(Drupal.settings.basePath + '?q=admin/coffee/result/' + Drupal.coffee.field.val(), function (data) {
        if (data) {
          $.each(data, function (key, value) {
            var description = $('<small class="description" />').text(value.path);
            $('<a />').text(value.title)
              .attr('href', Drupal.settings.basePath + value.path)
              .append(description)
              .appendTo(Drupal.coffee.resultsPlaceholder)
              .wrap('<li />');
          });

          // Highlight the first result as if it were focused, as a visual hint for
          // what will happen when the enter key is used in the search field.
          Drupal.coffee.results.html(Drupal.coffee.resultsPlaceholder.children()).find('a:first').addClass('focus');
        }
      });
    }
  });

// Instead of appending results one by one, we put them in a placeholder element
// and then append them all at once to prevent flickering while typing.
Drupal.coffee.results = $('<ol id="coffee-results" />').appendTo(Drupal.coffee.form);
Drupal.coffee.resultsPlaceholder = $('<ol />');

})(jQuery);
