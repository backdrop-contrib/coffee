(function ($) {
  Drupal.behaviors.coffee = {
      attach: function (context, settings) {
        var coffee_active = false;

        $(document).keydown( function (e) {
          // initialize current element, so that everytime coffee is opened the resultlist will respond correctly
          
          // show the search box when hitting alt + d (keyCode 68 + altKey = true)
          if (e.keyCode == 68 && e.altKey == true && coffee_active == false)
          {
            currentElement = 0;
            // prevent the default input of alt+d ( it will generate the char: ∂)
            e.preventDefault();
            $('body').append('<div class="coffee_box">' +
                '<form id="coffee">' + 
                '<input autocomplete="off" id="coffee_pot" type="text" />' +
                '</form>' +
                '<div id="coffee_cups">'+
                '</div>' + 
            '</div>');

            $('.coffee_box').fadeIn(200);
            $('#coffee_pot').focus();
            $('#coffee_pot').keyup( function(event) {	

              var theInput = $('#coffee_pot').val();

              $.getJSON(Drupal.settings.basePath + 'admin/coffee/result/' + theInput, function(data) {
                var coffee_content = '';
                coffee_content += '<ol>';
                $('#coffee_cups').slideDown();
                var items = [];
                
                // initialize the index of the result list
                var tab = 0;
                $.each(data, function(key, value) {
                  tab++;
                  coffee_content += '<li><a id="result_'+ tab + '" href="' + Drupal.settings.basePath + value.path +'" alt="'+ value.title +'"><strong>' + value.title +'</strong><small>'+ value.path +'</small></a></li>';
                });
                
                coffee_content += '</ol>';

                // clean up the result list and insert the new list
                $('#coffee_cups').empty();
                $('#coffee_cups').append(coffee_content);	
              });

            });
            //          set the coffee box true
            coffee_active = true;

          } else {
            // alt + d || esc || enter
            if (((e.keyCode == 68 && e.altKey == true) || e.keyCode == 27 || e.keyCode == 13) && coffee_active == true) {
              // if enter goto href from first result
              if (e.keyCode == 13) {
                // enter is pressed on a link, follow that link
                if (e.srcElement.href) {
                  location.href = e.srcElement.href;
                } 
                // if enter is pressed in the input than follow the first result
                else {
                  var linkFirstResult = $('#coffee_cups a#result_1').attr('href');
                  if (linkFirstResult != '') {
                    // if enter is given in the input box
                    // go to the first result
                    location.href = linkFirstResult;
                  }
                }
              }

              // remove the coffee_box
              $('.coffee_box').remove();
              coffee_active = false;
            }

            // on down focus the next element (instead using tab)
            if ( typeof currentElement == 'undefined' ) {
              // perform the initilization
              currentElement = 0;
            }
            if (coffee_active == true && e.keyCode == 40) {
              e.preventDefault();

              // the max of items == 7
              if (currentElement > 6) {
                currentElement = 6;
              }

              currentElement++;

              // if the focus is in the input
              if (e.target.id == 'coffee_pot') {
                $('#coffee_cups a#result_'+currentElement).focus();
              } 
              else {
                $('#coffee_cups a#result_'+currentElement).focus();
              }
            }

            //  on key up focus the above element (instead using shift+tab)
            if (coffee_active == true && e.keyCode == 38) {
              currentElement--;

              if (currentElement < 2) {
                currentElement = 1;
              }

              $('#coffee_cups a#result_'+currentElement).focus();
            }
          }
        });
      }
  };

}(jQuery));