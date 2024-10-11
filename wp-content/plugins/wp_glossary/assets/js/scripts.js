"use strict";

jQuery( document ).ready(function($) {

	// MixItUp
	if( $('.wpg-list-wrapper').length ) {
		$('.wpg-list-wrapper').each(function() {
			var $elem = $(this);
			
			var $active_filter = $elem.find('.wpg-list-filter .filter.active').data('filter');
			if( $active_filter == '' || typeof $active_filter == 'undefined' ) {
				$active_filter = 'all';
			}
			
			mixitup($elem, {
				animation: {
					enable: wpg.animation
				},
				load: {
					filter: $active_filter
				},
				controls: {
					scope: 'local'
				},
				callbacks: {
					onMixEnd: function(state) {
						$('#'+state.container.id).find('.wpg-list-block.wpg-removed').hide();
					}
				}
			});
		});
		
		if( $('.wpg-list-search-form').length ) {
			$('.wpg-list-search-form input').on('input',function(e) {
				var $elem = $(this).closest('.wpg-list-wrapper');
				var $keyword = $(this).val().toLowerCase();
					
				$elem.find('.wpg-list-block').each(function() {
					var $elem_list_block = $(this);
					var $block_visible_items = 0;
					
					$elem_list_block.find('.wpg-list-item').each(function() {
						if( $(this).text().toLowerCase().match( $keyword ) ) {
							$(this).show();
							$block_visible_items++;
						} else {
							$(this).hide();
						}
					});
					
					var $filter_base = $elem_list_block.data('filter-base');
					var $filter_source = $elem.find('.wpg-list-filter a[data-filter=".wpg-filter-'+$filter_base+'"]');
					var $active_block = $elem.find('.wpg-list-filter a.mixitup-control-active').data('filter');
					
					if ( $block_visible_items > 0 ) {
						$elem_list_block.removeClass('wpg-removed');
						
						if ( $active_block != 'all' ) {
							if ( $elem_list_block.is( $elem.find( $active_block ) ) ) {
								$elem.find( $active_block ).show();
							}
						} else {
							$elem_list_block.show();
						}
						
						$filter_source.removeClass('filter-disable').addClass('filter');
					} else {
						$elem_list_block.addClass('wpg-removed');
						
						if ( $active_block != 'all' ) {
							if ( $elem_list_block.is( $elem.find( $active_block ) ) ) {
								$elem.find( $active_block ).hide();
							}
						} else {
							$elem_list_block.hide();
						}
						
						$filter_source.removeClass('filter').addClass('filter-disable');
					}
				});
				
				if( $keyword == '' ) {
					$elem.find('.wpg-list-block').show();
					$elem.find('.wpg-list-item').show();
				}
			});
			
			$('.wpg-list-search-form input').val('');
		}
	}
	
	// ToolTipSter
	if( wpg.is_tooltip ) {
		
		// Initiate Tooltipster
		$('.wpg-tooltip').tooltipster({
			//trigger: 'click',
			contentAsHTML: true,
			interactive: true,
			theme: 'tooltipster-' + wpg.tooltip_theme,
			animation: wpg.tooltip_animation,
			arrow: wpg.tooltip_is_arrow,
			minWidth: parseInt( wpg.tooltip_min_width ),
			maxWidth: parseInt( wpg.tooltip_max_width ),
			position: wpg.tooltip_position,
			speed: parseInt( wpg.tooltip_speed ),
			delay: parseInt( wpg.tooltip_delay ),
			touchDevices: wpg.tooltip_is_touch_devices,
			functionReady: function(origin) {
				$( 'img' ).on( 'load', function() {
					origin.tooltipster( 'reposition' );
				});
			}
		});
		
		// Fix: Tootltip requires double click sometimes to trigger click
		$('.wpg-tooltip').click(function(e) {
			if( typeof $(this).attr('href') != 'undefined' ) {
				if( typeof $(this).attr('target') != 'undefined' ) {
					e.preventDefault();
					window.open( $(this).attr('href'), $(this).attr('target') );
				}
			}
		});
		
		// Touch Device Double Click Hack 
		if( wpg.tooltip_is_touch_devices ) {
			if ( wpg_glossary_touch_device() ) {
				var touchtime = 0;
				$('.wpg-tooltip').on('click', function(e) {
					if( touchtime == 0 ) {
						e.preventDefault();
						touchtime = new Date().getTime();
					} else {
						if( ( ( new Date().getTime() )-touchtime ) < 800 ) {
							touchtime = 0;
						} else {
							e.preventDefault();
							touchtime = new Date().getTime();
						}
					}
				});
			}
		
			function wpg_glossary_touch_device() {
				if( 'ontouchstart' in window || navigator.maxTouchPoints ) {
					return true;
				} else {
					return false;
				}
			}
		}
		
	}

});
