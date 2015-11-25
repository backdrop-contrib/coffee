/**
 * @file
 * JavaScript file for the Coffee module.
 */

(function($) {
  // Remap the filter functions for autocomplete to recognise the
  // extra value "command".
  var proto = $.ui.autocomplete.prototype,
  	initSource = proto._initSource;

  function filter(array, term) {
  	var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), 'i');
  	return $.grep(array, function(value) {
                return matcher.test(value.command) || matcher.test(value.label) || matcher.test(value.value);
  	});
  }

  $.extend(proto, {
  	_initSource: function() {
  		if ($.isArray(this.options.source)) {
  			this.source = function(request, response) {
  				response(filter(this.options.source, request.term));
  			};
  		}
  		else {
  			initSource.call(this);
  		}
  	}
  });

  Backdrop.coffee = Backdrop.coffee || {};

  Backdrop.behaviors.coffee = {
    attach: function() {
      $('body').once('coffee', function() {
        var body = $(this);

        Backdrop.coffee.bg.appendTo(body).hide();

        Backdrop.coffee.form
        .append(Backdrop.coffee.label)
        .append(Backdrop.coffee.field)
        .append(Backdrop.coffee.results)
        .wrapInner('<div id="coffee-form-inner" />')
        .addClass('hide-form')
        .appendTo(body);

        // Load autocomplete data set, consider implementing
        // caching with local storage.
        Backdrop.coffee.dataset = [];

        var jquery_ui_version = $.ui.version.split('.');
        var jquery_ui_newer_1_9 = parseInt(jquery_ui_version[0]) >= 1 && parseInt(jquery_ui_version[1]) > 9;
        var autocomplete_data_element = (jquery_ui_newer_1_9) ? 'ui-autocomplete' : 'autocomplete';

        $.ajax({
          url: Backdrop.settings.basePath + '?q=admin/coffee/menu',
          dataType: 'json',
          success: function(data) {
            Backdrop.coffee.dataset = data;

            // Apply autocomplete plugin on show
            var $autocomplete = $(Backdrop.coffee.field).autocomplete({
              source: Backdrop.coffee.dataset,
              focus: function( event, ui ) {
                  // Prevents replacing the value of the input field
                  event.preventDefault();
              },
              select: function(event, ui) {
                Backdrop.coffee.redirect(ui.item.value, event.metaKey);
                event.preventDefault();
                return false;
              },
              delay: 0,
              appendTo: Backdrop.coffee.results
           });

           $autocomplete.data(autocomplete_data_element)._renderItem = function(ul, item) {
              return  $('<li></li>')
                      .data('item.autocomplete', item)
                      .append('<a>' + item.label + '<small class="description">' + item.value + '</small></a>')
                      .appendTo(ul);
            };

            // This isn't very nice, there are methods within that we need
            // to alter, so here comes a big wodge of text...
            var self = Backdrop.coffee.field;
            if (!jquery_ui_newer_1_9){
                $(Backdrop.coffee.field).data(autocomplete_data_element).menu = $('<ol></ol>')
                    .addClass('ui-autocomplete')
                    .appendTo(Backdrop.coffee.results)
                    // prevent the close-on-blur in case of a "slow" click on the menu (long mousedown).
                    .mousedown(function(event) {
                        event.preventDefault();
                    })
                    .menu({
                        selected: function(event, ui) {
                            var item = ui.item.data('item.autocomplete');
                            Backdrop.coffee.redirect(item.value, event.metaKey);
                            event.preventDefault();
                        }
                    })

                    .hide()
                    .data('menu');
            }

            // We want to limit the number of results.
            $(Backdrop.coffee.field).data(autocomplete_data_element)._renderMenu = function(ul, items) {
          		var self = this;
          		items = items.slice(0, 7); // @todo: max should be in Backdrop.settings var.
          		$.each( items, function(index, item) {
                    if (typeof(self._renderItemData) === "undefined"){
                        self._renderItem(ul, item);
                    }
                    else {
                        self._renderItemData(ul, item);
                    }

          		});
          	};

          	// On submit of the form select the first result if available.
          	Backdrop.coffee.form.submit(function() {
          	  var firstItem = jQuery(Backdrop.coffee.results).find('li:first').data('item.autocomplete');
          	  if (typeof firstItem == 'object') {
          	    Backdrop.coffee.redirect(firstItem.value, false);
          	  }

          	  return false;
          	});
          },
          error: function(error) {
            Backdrop.coffee.field.val('Could not load data, please refresh the page');
          }
        });

        // Key events
        $(document).keydown(function(event) {
          var activeElement = $(document.activeElement);

          // Show the form with alt + D. Use 2 keycodes as 'D' can be uppercase or lowercase.
          if (Backdrop.coffee.form.hasClass('hide-form') &&
        		  event.altKey === true &&
        		  // 68/206 = d/D, 75 = k.
        		  (event.keyCode === 68 || event.keyCode === 206  || event.keyCode === 75)) {
            Backdrop.coffee.coffee_show();
            event.preventDefault();
          }
          // Close the form with esc or alt + D.
          else if (!Backdrop.coffee.form.hasClass('hide-form') && (event.keyCode === 27 || (event.altKey === true && (event.keyCode === 68 || event.keyCode === 206)))) {
            Backdrop.coffee.coffee_close();
            event.preventDefault();
          }
        });
      });
    }
  };

  // Prefix the open and close functions to avoid
  // conflicts with autocomplete plugin.

  /**
   * Open the form and focus on the search field.
   */
  Backdrop.coffee.coffee_show = function() {
    Backdrop.coffee.form.removeClass('hide-form');
    Backdrop.coffee.bg.show();
    Backdrop.coffee.field.focus();
    $(Backdrop.coffee.field).autocomplete({enable: true});
  };

  /**
   * Close the form and destroy all data.
   */
  Backdrop.coffee.coffee_close = function() {
    Backdrop.coffee.field.val('');
    //Backdrop.coffee.results.empty();
    Backdrop.coffee.form.addClass('hide-form');
    Backdrop.coffee.bg.hide();
    $(Backdrop.coffee.field).autocomplete({enable: false});
  };

  /**
   * Close the Coffee form and redirect.
   * Todo: make it work with the overlay module.
   */
  Backdrop.coffee.redirect = function(path, openInNewWindow) {
    Backdrop.coffee.coffee_close();

    if (openInNewWindow) {
      window.open(Backdrop.settings.basePath + path);
    }
    else {
      document.location = Backdrop.settings.basePath + path;
    }
  };

  /**
   * The HTML elements.
   */
  Backdrop.coffee.label = $('<label for="coffee-q" class="element-invisible" />').text(Backdrop.t('Query'));

  Backdrop.coffee.results = $('<div id="coffee-results" />');

  // Instead of appending results one by one, we put them in a placeholder element
  // first and then append them all at once to prevent flickering while typing.
  Backdrop.coffee.resultsPlaceholder = $('<ol />');

  Backdrop.coffee.form = $('<form id="coffee-form" action="#" />');

  Backdrop.coffee.bg = $('<div id="coffee-bg" />').click(function() {
    Backdrop.coffee.coffee_close();
  });

  Backdrop.coffee.field = $('<input id="coffee-q" type="text" autocomplete="off" />');

}(jQuery));
