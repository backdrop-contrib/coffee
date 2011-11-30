(function ($) {
	Drupal.behaviors.coffee = {
			attach: function (context, settings) {
				var coffee_active = false;
				
				jQuery(document).keydown( function (e) {
					// show the search box when hitting alt + d (keyCode 68 + altKey = true)
					if(e.keyCode == 68 && e.altKey == true && coffee_active == false)
					{
						// prevent the default input of alt+d (∂)
						e.preventDefault();
						jQuery('body').append('<div class="coffee_box">' +
								'<form id="coffee">' + 
								'<input autocomplete="off" id="coffee_pot" type="text" />' +
								'</form>' +
								'<div id="coffee_cups">'+
								'</div>' + 
						'</div>');

						jQuery('.coffee_box').fadeIn(200);
						jQuery('#coffee_pot').focus();
						jQuery('#coffee_pot').keyup( function(event) {	

							var theInput = $('#coffee_pot').val();

							jQuery.getJSON(Drupal.settings.basePath + 'admin/coffee/result/' + theInput, function(data) {
								var coffee_content = '';
								coffee_content += '<ul>';
								$('#coffee_cups').fadeIn(200);
								var items = [];
								var tab = 0;
								$.each(data, function(key, value) {
									tab++;
									coffee_content += '<li><a id="result_'+ tab + '" href="' + Drupal.settings.basePath + value.path +'" alt="'+ value.title +'">' + value.title +'</a><span>'+ value.path +'</span></li>';
								});
								coffee_content += '</ul>';
								
								// clean up the result list and insert the new list
								jQuery('#coffee_cups').empty();
								jQuery('#coffee_cups').append(coffee_content);	
							});

						});
						// set the coffee box true
						coffee_active = true;
					} else {
						//console.log(e.keyCode);
						// alt + d || esc || enter
						if( ((e.keyCode == 68 && e.altKey == true) || e.keyCode == 27 || e.keyCode == 13) && coffee_active == true) {
							// if enter goto href from first result
							if(e.keyCode == 13) {
								// enter is pressed on a link, follow that link
								if(e.srcElement.href) {
									location.href = e.srcElement.href;
								} 
								// if enter is pressed in the input than follow the first result
								else {
									var linkFirstResult = $('#coffee_cups a#result_1').attr('href');
									if(linkFirstResult != '') {
										// if enter is given in the input box
										// go to the first result
										location.href = linkFirstResult;
									}
								}
							}

							// remove the coffee_box
							jQuery('.coffee_box').remove();
							coffee_active = false;
						}

						// on down focus the next element (instead using tab)
						if ( typeof currentElement == 'undefined' ) {
							// It has not... perform the initilization
							currentElement = 0;
						}
						if(coffee_active == true && e.keyCode == 40) {
							e.preventDefault();
							
							// the max of items == 7
							if(currentElement > 6) {
								currentElement = 6;
							}

							// counter for focus
							currentElement++;
							
							// if the focus is in the input
							
							if(e.target.id == 'coffee_pot') {
								jQuery('#coffee_cups a#result_'+currentElement).focus();
							} 
							else {
								jQuery('#coffee_cups a#result_'+currentElement).focus();
							}


							// if the focus is on a link #result_x

						}

						// on up focus the above element (instead using shift+tab)
						if(coffee_active == true && e.keyCode == 38) {
							currentElement--;
							
							if(currentElement < 2) {
								currentElement = 1;
							}
							
							jQuery('#coffee_cups a#result_'+currentElement).focus();
						}
					}

				});

			}
	};



}(jQuery));