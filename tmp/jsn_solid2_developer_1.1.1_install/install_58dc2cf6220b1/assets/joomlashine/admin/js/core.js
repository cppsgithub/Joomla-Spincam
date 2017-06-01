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

	var sunfwStickyNav = function () {

		var scrollTop    = jQuery(document).scrollTop();

		if ( scrollTop > 35 ) {

			jQuery('.jsn-pageheader').addClass('sunfw-sticky-open');

		} else {

			jQuery('.jsn-pageheader').removeClass('sunfw-sticky-open');

		}
	};

	$.SunFwCore = function(params) {
		// Initialize parameters
		this.params = $.extend({}, params);
		this.updateButton = $('.sunfw-update-link');
		this.getQuickstartButton = $('#get-quickstart-package');

		// Initialize functionality
		$(document).ready($.proxy(this.init(), this));
	};

	$.SunFwCore.prototype = {
			init : function() {
				var self = this;

	            // $(".sunfw-modal-overlay,.sunfw-modal-indicator").remove();

	            $('.sunfw-footer').addClass('sunfw-loading-fixed-footer');

	            $(".sunfw-modal-overlay,.sunfw-modal-indicator").delay(1200).queue(function () {
					$("body").addClass("sunfw-loading-page");
	                $(this).remove();
	                $('.sunfw-footer').removeClass('sunfw-loading-fixed-footer');
	                $('#sunfw-tab-content').removeClass('sunfwhide');
	            });

				var token        		= document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      		= document.querySelector( '#jsn-style-id'  ).value;
				var templateName 		= document.querySelector( '#jsn-tpl-name'  ).value;
				this.styleTitleButton 	= $('#sunfw-style-title-btn');
				this.styleTitle 		= $('#sunfw-style-title');
				this.saveAsCopyButton	= $('#sunfw-save-as-copy');
				this.homeSelectBox		= $('#jform_home');

				var cookieAlertUpdateFrameworkName = 'sunfw-alert-update-framework-'+templateName;
				var cookieAlertUpdateTemplateName = 'sunfw-alert-update-template-'+templateName;

				//self.setAutoHeightToMenuBuilderContainer();
				//$('#sunfw-megamenu-menu').on('click', function (e) {
					//$( "a[href='#navigation']" ).trigger('click');
					//$('#sunfw-nav-tab').addClass('sunfwhide');
					//self.setAutoHeightToMenuBuilderContainer();
				//});

				$('.alternative-tab-trigger').on('click', function(event) {
					event.preventDefault();

					// Hide nav tab.
					$('#sunfw-nav-tab').addClass('sunfwhide');

					// Trigger click on target tab.
					var tabs = $(this).attr('data-target').split(',');

					for (var i = 0, n = tabs.length; i < n; i++) {
						$('a[href="' + $.trim(tabs[i]) + '"]').trigger('click');
					}
				});

				$.initSunFwUpdate(this.updateButton, this.params);
				$.initDownloadQuickstartPackage(this.getQuickstartButton, this.params);

				$("#sunfw-admin-tab li").on("click", function() {
					var activeTab = $(this).find("a[role='tab']").attr("href");

					if (['#advanced', '#sample-data', '#menu-assignment', '#global-parameters', '#data', '#about'].indexOf(activeTab) > -1) {
						$('.sunfw-footer').addClass('sunfw-fixed-footer');
					} else {
						$('.sunfw-footer').removeClass('sunfw-fixed-footer');
					}
				});

				// Handle opening the first tab.
				setTimeout(function() {
					var activeTab = $('#sunfw-admin-tab li.active > a'), activeTabHref = activeTab.attr('href');

					if (['#data', '#global-parameters', '#about'].indexOf(activeTabHref) > -1) {
						$('#sunfw-nav-tab').addClass('sunfwhide');
					} else {
						$('#sunfw-nav-tab').removeClass('sunfwhide');
					}

					if (['#advanced', '#sample-data', '#menu-assignment', '#global-parameters', '#data', '#about'].indexOf(activeTabHref) > -1) {
						$('.sunfw-footer').addClass('sunfw-fixed-footer');
					} else {
						$('.sunfw-footer').removeClass('sunfw-fixed-footer');
					}
				}, 100);

				/*this.styleTitleButton.on('click', function (e) {
					e.preventDefault();
					self.allowEditStyleTitle(e, $(this));
				});*/

				this.styleTitle.on('change', function (e) {
					e.preventDefault();
					self.saveStyleSettings(e, $(this));
				});

				this.homeSelectBox.on('change', function (e) {
					e.preventDefault();
					self.saveStyleSettings(e, $(this));
				});

				this.styleTitle.keyup(function(e){
				    if(e.keyCode == 13)
				    {
				    	self.saveStyleSettings(e, $(this));
				    }
				});

				/*$('body').on('click', function (e) {
					var el = $(e.target);
                    if (el.hasClass('sunfw-style-title-btn') || el.hasClass('sunfw-style-title') || el.hasClass('sunfw-style-title-icon')) {

                    } else {
                    	self.styleTitle.prop('readonly', true);
                    }

				});	*/

				this.saveAsCopyButton.on('click', function (e) {
					e.preventDefault();
					self.saveAsCopy(e, $(this));
				});

				setInterval(function () {
					self.keepSessionAlive(self.params.pathRoot)
				}, parseFloat(self.params.sessionLifeTime));

				$('#sunfw-save-all').on('click', function (e) {
					var el = $(e.target);

					if (el.hasClass('isprocessing')) return false;

					window.save_all_step = 0;
					window.save_all_is_processing = false;
					window.show_noty = false;

					el.addClass('isprocessing');
					el.addClass('disabled');
					el.html(window.sunfw.text['saving-data']);
					//var icon = el.children();
					//icon.removeClass('fa-floppy-o').addClass('fa-spinner fa-spin');
					var saveAllInterval = setInterval(function(){
						if (window.save_all_step < 7 )
						{
							self.saveAll(this);
						}
						else
						{

							clearInterval(saveAllInterval);
							//icon.addClass('fa-check-square-o').removeClass('fa-spinner fa-spin');
							el.html(window.sunfw.text['save-all']);
							el.addClass('disabled');
							el.removeClass('isprocessing');
							noty({
								text: window.sunfw.text['save-success'],
								theme: 'relax', // or 'relax'
								layout: 'top',
								type: 'success',
								timeout: 2000,
								animation: {
								open: 'animated fadeIn', // Animate.css class names
								close: 'animated fadeOut', // Animate.css class names

								}
							});
							window.show_noty = true;
							window.save_all_step = 0;
							window.save_all_is_processing = false;
						}
					}, 500);


				});

				$('#sunfw-missing-token-btn').on('click', function (e) {
					$('#data-token-key').trigger('click');

				});

				$('#sunfw-verify-token-key-btn').on('click', function (e) {
					self.verifyToken(this);
				});

				$('#sunfw-get-token-key-btn').on('click', function (e) {
					self.getToken(this);
				});

				$('.back-to-edit-button').on('click', function (e) {
					var history = localStorage.getItem('active-tabs'), lastActive;

					if ( history && ( history = JSON.parse(history) ) ) {
						while (history.length) {
							lastActive = history.pop();

							if (lastActive.indexOf('#data') < 0 && lastActive.indexOf('#global') < 0 && lastActive.indexOf('#token') < 0 && lastActive.indexOf('#about') < 0) {
								break;
							} else {
								lastActive = '';
							}
						}
					}

					if (lastActive) {
						$("a[href='" + lastActive + "']").trigger('click');
					} else {
						$( "a[href=#layout]" ).trigger('click');
					}

					$('#sunfw-nav-tab').removeClass('sunfwhide');
					$('ul.sunfw-right-top-menu li a').removeClass('active');
				});

				if ($('#sunfw-token-key-input').val() == '')
				{
					if ( ! $.cookie('sunfw-token-message-shown') ) {
						$('.alert-sunfw-missing-token').removeClass('sunfwhide');
					}

					$('.alert-sunfw-missing-token').on('click', 'a.close', function() {
						$.cookie('sunfw-token-message-shown', 1);
					});
				}

				$('ul.sunfw-right-top-menu li').on('click', function (e) {
					 $(this).children('a').addClass('active');
					 $(this).siblings().children('a').removeClass('active');
				});

				$('#sunfw-alert-update-framework-close-btn').on('click', function (e) {
					$.cookie(cookieAlertUpdateFrameworkName, 1);
				});

				$('#sunfw-alert-update-template-close-btn').on('click', function (e) {
					$.cookie(cookieAlertUpdateTemplateName, 1);
				});

				if ($.cookie(cookieAlertUpdateFrameworkName) == 1 && typeof $.cookie(cookieAlertUpdateFrameworkName) != 'undefined')
				{
					$( ".alert-sunfw-framework-update" ).addClass('hide');
				}

				if ($.cookie(cookieAlertUpdateTemplateName) == 1 && typeof $.cookie(cookieAlertUpdateTemplateName) != 'undefined')
				{
					$( ".alert-sunfw-template-update" ).addClass('hide');
				}
			},

			allowEditStyleTitle: function (event, element) {
				var self = this;
				self.styleTitle.prop('readonly', false);
			},
			saveAll: function(e) {
				if (!window.save_all_is_processing)
				{
					switch(window.save_all_step)
					{
					    case 0:
					    case 1:
					    	// save Sunfw layout
					    	if (window.layoutBuilderHasChange)
					    	{
					    		window.save_all_is_processing = true;
					    		window.SunFwLayout.save();
					    	}
					    	else
					    	{
								window.save_all_is_processing = false;
								window.save_all_step = 2;
					    	}
					        break;
					    case 2:
					    	// save Sunfw style
					    	if (window.styleBuilderHasChange)
					    	{
					    		window.save_all_is_processing = true;
					    		window.SunFwStyle.save();
					    	}
					    	else
					    	{
								window.save_all_is_processing = false;
								window.save_all_step = 3;
					    	}
					        break;
					    case 3:
					    	// save Sunfw cookielaw
					    	if (window.cookieLawHasChange)
					    	{
					    		window.save_all_is_processing = true;
					    		window.SunFwCookieLaw.save();
					    	}
					    	else
					    	{
								window.save_all_is_processing = false;
								window.save_all_step = 4;
					    	}
					        break;
					    case 4:
					    	// save Sunfw Menu
					    	if (window.menuBuilderHasChange)
					    	{
					    		window.save_all_is_processing = true;
					    		window.SunFwMenu.save();
					    	}
					    	else
					    	{
								window.save_all_is_processing = false;
								window.save_all_step = 5;
					    	}
					        break;
					    case 5:
					    	// save system data
					    	if (window.systemHasChange)
					    	{
					    		window.SunFwAdvanced.saveSystemData($('#sunfw-save-advanced-button'));
					    		window.save_all_is_processing = true;
					    	}
					    	else
					    	{
								window.save_all_is_processing = false;
								window.save_all_step = 6;
					    	}
					        break;
					    case 6:
					    	// save menuassign data
					    	if (window.assignmentHasChange)
					    	{
					    		window.SunFwMenuAssignment.save('#sunfw-save-menu-assignment-button');
					    		window.save_all_is_processing = true;
					    	}
					    	else
					    	{
								window.save_all_is_processing = false;
								window.save_all_step = 7;
					    	}
					        break;
					    default:
					    	 break;
					}
				}

			},
			saveStyleSettings: function (event, element) {

				var self = this;
				//var icon = self.styleTitleButton.children();
				//element.prop('readonly', true);

				//icon.removeClass('fa-pencil').addClass('fa-spinner fa-spin');
				//self.styleTitleButton.removeClass('sunfwhide');
				var token        		= document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      		= document.querySelector( '#jsn-style-id'  ).value;
				var templateName 		= document.querySelector( '#jsn-tpl-name'  ).value;
				var language	 		= document.querySelector( '#jform_home'  ).value;
				var styleTitle	 		= document.querySelector( '#sunfw-style-title'  ).value;

				var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=core&'
					+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=saveStyleSettings';

				var dataForm 	= [];
				var item		= {};
				item.name		= 'style_title';
				item.value		= styleTitle;
				dataForm.push(item);

				var item		= {};
				item.name		= 'home';
				item.value		= language;
				dataForm.push(item);

				self.showOverlay();
				$.ajax({
					url: server,
					data: dataForm,
					type: 'POST',
					dataType: 'html',
					complete: function(data, status) {
						var resp = $.parseJSON(data.responseText);
						self.hideOverlay();
						//self.styleTitleButton.addClass('sunfwhide');
					}
				});
			},

			saveAsCopy: function (event, element) {
				var icon = element.children();
				icon.removeClass('fa-floppy-o').addClass('fa-spinner fa-spin');

				var self = this;

				var token        		= document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      		= document.querySelector( '#jsn-style-id'  ).value;
				var templateName 		= document.querySelector( '#jsn-tpl-name'  ).value;

				var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=core&'
					+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=saveAsCopy';

				var dataForm 	= [];
				var item		= {};
				item.name		= 'style_id';
				item.value		= styleID;
				dataForm.push(item);
				$.ajax({
					url: server,
					data: dataForm,
					type: 'POST',
					dataType: 'html',
					complete: function(data, status) {
						icon.addClass('fa-check-square-o').removeClass('fa-spinner fa-spin');
						var resp = $.parseJSON(data.responseText);
						if (resp.type == 'success')
						{
							 window.location="index.php?option=com_templates&task=style.edit&id=" + resp.data.id;
                        }
						else
						{
							alert(resp.data);
						}
					}
				});
			},
			keepSessionAlive: function (path)
			{
				var req = false;
	            if (window.XMLHttpRequest && !(window.ActiveXObject))
	            {
	                try {
	                    req = new XMLHttpRequest();
	                }
	                catch (e)
	                {
	                    req = false;
	                }
	            }
	            else if (window.ActiveXObject)
	            {
	                try {
	                    req = new ActiveXObject("Msxml2.XMLHTTP");
	                }
	                catch (e)
	                {
	                    try
	                    {
	                        req = ActiveXObject("Microsoft.XMLHTTP");
	                    }
	                    catch (e)
	                    {
	                        req = false
	                    }
	                }
	            }
	            if (req)
	            {
	                req.onreadystatechange = function () {
	                    // only if req show loaded
	                    if (req.readyState == 4)
	                    {
	                        // only if OK
	                        if (req.status == 200){

	                        }else{

	                        }
	                    }
	                }
	                req.open("HEAD", path, true);
	                req.send();
	            }
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

	        setAutoHeightToMenuBuilderContainer: function () {
				var autoHeight = $( window ).height() - $('.jsn-nav').height() - $('.jsn-pageheader').height() - $('.list-menu').height();
				$('#menu-builder-container').height(autoHeight - 250);
	        },
			verifyToken: function (e) {
				var self 	= this;
				var ele		= $(e);

				var token        	= document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      	= document.querySelector( '#jsn-style-id'  ).value;
				var templateName 	= document.querySelector( '#jsn-tpl-name'  ).value;
				var loading			= $('#sunfw-token-loading');
				var iconBtn			= ele.find('i');
				var tokenKey		= $('#sunfw-token-key-input').val();

				// Prepare.
				var server = 'index.php?option=com_ajax&plugin=sunfw&action=verifyToken&style_id=' + styleID + '&' + token + '=1&template_name=' + templateName + '&token=' + tokenKey + '&format=json';
				var msgEle = $('#sunfw-token-message');
				msgEle.html('');
				msgEle.removeClass('alert alert-danger alert-success sunfwhide');
				iconBtn.removeClass('fa-check-circle').addClass('fa-spinner fa-spin');

				$.ajax({
					type: 'GET',
					dataType: 'json',
					url: server,
					success: function (response) {
						if (response) {
							if (response.result == 'success')
							{
								msgEle.html(response.message);
								msgEle.addClass('alert alert-success');
								$('.alert-sunfw-missing-token').addClass('sunfwhide');
							}
							else
							{
								msgEle.html(response.message);
								msgEle.addClass('alert alert-danger');
							}
							iconBtn.removeClass('fa-spinner fa-spin').addClass('fa-check-circle');
						}
					}
				});
			},
			getToken: function (e) {
				var self 	= this;
				var ele		= $(e);

				var token        	= document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      	= document.querySelector( '#jsn-style-id'  ).value;
				var templateName 	= document.querySelector( '#jsn-tpl-name'  ).value;
				var iconBtn			= ele.find('i');

				// Prepare.
				var server = 'index.php?option=com_ajax&plugin=sunfw&action=getToken&style_id=' + styleID + '&' + token + '=1&template_name=' + templateName + '&format=json';
				var msgEle = $('#sunfw-get-token-message');
				msgEle.html('');
				msgEle.removeClass('alert alert-danger alert-success sunfwhide');
				iconBtn.removeClass('fa-key').addClass('fa-spinner fa-spin');

				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: server,
					data: {
						username: document.querySelector( '#sunfw-token-key-username'  ).value,
						password: document.querySelector( '#sunfw-token-key-password'  ).value,
					},
					success: function (response) {
						if (response) {
							if (response.result == 'success')
							{
								msgEle.html(response.message);
								msgEle.addClass('alert alert-success');
								$('#sunfw-token-key-input').val(response.token);
								$('.alert-sunfw-missing-token').addClass('sunfwhide');
								document.querySelector( '#sunfw-token-key-username'  ).value = '';
								document.querySelector( '#sunfw-token-key-password'  ).value = '';

							}
							else
							{
								msgEle.html(response.message);
								msgEle.addClass('alert alert-danger');
							}
							iconBtn.removeClass('fa-spinner fa-spin').addClass('fa-key');
						}
					}
				});
			},
	}

	$(document).ready(function () {
		$('#sunfw_advanced_compression-lbl').parents('.form-group').addClass('form-group-50');
		$('#sunfw_advanced_maxCompressionSize-lbl').parents('.form-group').addClass('form-group-50');
		$('#sunfw_advanced_cacheDirectory-lbl').parents('.form-group').addClass('form-group-clr');

		if ($('#sunfw-nav-tab').length > 0) {
			sunfwStickyNav();
		}
	});

	$(window).scroll(function() {
		sunfwStickyNav();
	});

})(jQuery);