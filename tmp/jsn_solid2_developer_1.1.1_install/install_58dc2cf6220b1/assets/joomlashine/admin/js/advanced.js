/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

(function($){
	$.SunFwAdvanced = function(params) {
		// Initialize parameters
		this.params = $.extend({}, params);

		// Initialize functionality
		$(document).ready($.proxy(this.init(), this));
	};

	$.SunFwAdvanced.prototype = {
			init : function() {
				var self = this;
				var token        = document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      = document.querySelector( '#jsn-style-id'  ).value;
				var templateName = document.querySelector( '#jsn-tpl-name'  ).value;
				var inputFile = $('#sunfw-advanced-export-params-form').children('input[type="file"]');
				var iframe = $('#sunfw-iframe-silent');
				self.addEventChangeToAllElement();
				$('#sunfw_advanced_niche_style').parent().parent().hide();
				
				$('#sunfw_advanced_exportTemplateSettings').attr('href', 'index.php?option=com_ajax&format=json&plugin=sunfw&context=advanced&'
						+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=export');
				
				$('.btn-verify-folder').on('click', function (e) {
					e.preventDefault();
					self.verifyCacheFolder(e, $(this));
				});
				
				$('#sunfw_advanced_importTemplateSettings').on('click', function (e)
				{
					e.preventDefault();
					
					// Trigger click event for the hidden file field
					inputFile.trigger('click');					
				});

				// Setup iframe to silently restore template parameters
				inputFile.change(function() {
					// Handle iframe load event
					iframe.unbind('load').bind('load', function() {
						// Parse response data
						if (response = $(this).contents().text().match(/\{"type":[^,]+,"data":[^\}]+\}/)) {
							response = $.parseJSON(response[0]);
						} else {
							response = {type: 'failure', data: $(this).contents().text()};
						}
				
						if (response.type == 'success') {
							// Show success message
							alert(response.data);
				
							window.location.reload();
						} else {
							// Show error message
							alert(response.data);
						}
					});
				
					// Set form action
					inputFile.parent().attr('action', 'index.php?option=com_ajax&format=json&plugin=sunfw&context=advanced&'
							+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=import');
				
					// Submit form to iframe
					inputFile.parent().submit();
				});
				
				$('#sunfw-save-advanced-button').on('click', function(e) {
					e.preventDefault();
					self.saveSystemData($(this));
				});				
			},
			saveSystemData: function (e)
			{
				var token        = document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      = document.querySelector( '#jsn-style-id'  ).value;
				var templateName = document.querySelector( '#jsn-tpl-name'  ).value;
				var btnSelf = e;
				var icon = e.children();
				//icon.removeClass('fa-floppy-o').addClass('fa-spinner fa-spin');
				var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=advanced&'
					+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=save';
			
				//self.showOverlay();
				
				var postData = [];
				var data = $('#style-form').serializeArray();
				$.each(data, function (index, value) {

					if (value.name != 'module')
					{	
						postData.push(value);
					}
				});
				$( '#sunfw-admin-tab span[data-tab="#advanced"]' ).removeClass('sunfwhide');
				
				$.ajax({
					url: server,
					data: postData,
					type: 'POST',
					dataType: 'html',
					complete: function(data, status) {
						//icon.addClass('fa-floppy-o').removeClass('fa-spinner fa-spin');
						var resp = $.parseJSON(data.responseText);
						if (resp.type == 'success') 
						{
							if (window.show_noty)
							{	
					           noty({
					        	   text: window.sunfw_advanced.text['save-data-successfully'],
					        	   theme: 'relax', // or 'relax'
					        	   layout: 'top',
					                type: 'success',
					                timeout: 2000,
					                animation: {
								        open: 'animated fadeIn', // Animate.css class names
								        close: 'animated fadeOut', // Animate.css class names
	
					                }
					            });	
							}
				           var tab = $('#sunfw-admin-tab').find("a[href='#advanced']");
				           var html = tab.html().trim();
				           tab.html(html.replace(" *", ""));
				           btnSelf.prop("disabled",true);
                        }
						else
						{
							bootbox.alert(resp.data, function() {});
						}
						$( '#sunfw-admin-tab span[data-tab="#advanced"]' ).addClass('sunfwhide');
						window.save_all_is_processing = false;
						window.save_all_step = 6;
						window.systemHasChange = false;
						//self.hideOverlay();
						
					}
				});				
			},
			verifyCacheFolder: function (event, element)
			{
				var token        = document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      = document.querySelector( '#jsn-style-id'  ).value;
				var templateName = document.querySelector( '#jsn-tpl-name'  ).value;
				
				var target = $(event.target),
					markup = target.html();
				
				// Switch loading status
				target.html('Checking...');
				
				var link = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=advanced&'
					+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&folder=' + target.prev().attr('value') + '&action=verifyCacheFolder';					
				$.ajax({
					url: link,
					type: 'GET',
					dataType: 'JSON',
					complete: function(data, status) {
						var resp = $.parseJSON(data.responseText);
						if (resp.type == 'success')
						{
							// Switch status
							target.html(markup);
							if (resp.data.pass) {
								target.parent().next().next()
									.removeClass('label-danger').addClass('label-success')
									.removeClass('hide').html(resp.data.message);
							} else {
								target.parent().next().next()
									.removeClass('label-success').addClass('label-danger')
									.removeClass('hide').html(resp.data.message);
							}
						}
						else 
						{
							target.parent().next().next()
								.removeClass('label-success').addClass('label-danger')
								.removeClass('hide').html('Unable to connect with server to verify directory.');
						}	
					}
				});				
			},
	        showOverlay: function() {
	            if (!$('.sunfw-modal-overlay').length) 
	            {
	                $("body").append($("<div/>", {
	                    "class":"sunfw-modal-overlay",
	                    "style":"z-index: 1000; display: inline;"
	                })).append($("<div/>", {
	                    "class":"sunfw-modal-indicator",
	                    "style":"display:block"
	                })).addClass("jsn-loading-page");
	                
	            }
	            $('.sunfw-modal-overlay, .sunfw-modal-indicator').show();
	        },
	        
	        hideOverlay: function() {
	        	 $(".sunfw-modal-overlay,.sunfw-modal-indicator").remove();
	        },	
	        
	        addEventChangeToAllElement: function () {
	        	var saveAllButton =  $( '#sunfw-save-all' );
	        	var tab = $('#sunfw-admin-tab').find("a[href='#advanced']");
	        	$('#advanced').find(':input').on('change', function () {
	        		var html = tab.html().trim();
	        		tab.html(html.replace(" *", "") + ' *')
	        		$('#sunfw-save-advanced-button').prop("disabled",false);
	        		saveAllButton.removeClass('disabled');
	        		window.systemHasChange = true;
	        	})
	        }
	}
})(jQuery);