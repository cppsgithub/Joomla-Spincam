!function ($) {
	"use strict";

	var	SunFwUpdate = function (button, params)
	{
		var self = this;

		this.defaultParams = {
			basePath: '/',
			title: 'Update Template to the latest version',
			width: 800,
			height: 600
		};

		this.params = $.extend(this.defaultParams, params);
		this.button = $(button);
		this.panel  = $('<div />', { 'class': 'sunfw-template-update' });

		self.init = function() {

			// Initialize modal window
			self.panel.dialog({
				width: self.params.width,
				height: self.params.height,
				title: self.params.title,
				resizable: false,
				draggable: false,
				autoOpen : false,
				modal: true,
				open: self.loadConfirmScreen,
				closeOnEscape: false
			});

			// Handle click event for install button to open dialog
			self.button.on('click', function(event) {
				event.preventDefault();

				// Detect update target
				self.target = $(this).attr('data-target');
				self.target == 'framework'
					? self.panel.dialog('option', 'title', 'Update Framework to the latest version')
					: self.panel.dialog('option', 'title', 'Update Template to the latest version');

				// Show update panel
				self.panel.empty().dialog('open');
			});

			// Setup button to close update panel
			self.panel.delegate('button[id^="btn-finish"]', 'click', function(event) {
				event.preventDefault();
				self.finishUpdate();
			});

			// Handle window resize event to update modal position
			$(window).on('resize', function() {
				self.panel.dialog('option', 'position', 'center');
			});

			// Always check for latest update
			self.checkVersionUpdate();
		};

		self.checkVersionUpdate = function() {
			// Send ajax request to receive update information
			$.getJSON('index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=checkUpdate', function(result) {
				var container = jQuery('.sunfw-footer div.sunfw-version');

				container.each(function() {
					var	el = $(this),
						status = el.find('.sunfw-status'),
						version = el.find('.sunfw-new-version');

					if (result.type == 'success') {

						var info = result.data[el.attr('data-target')];
						if (info.hasUpdate == true) {
							el.toggleClass('sunfw-version-checking sunfw-version-outdated');
							status.text('');
							version.text(info.newVersion).parent().removeClass('sunfwhide');

							// Show update link in footer menu
							//$('#jsn-global-check-version-result').css('display', '');
						} else {
							el.toggleClass('sunfw-version-checking sunfw-version-latest');
							status.text('The latest version.');
						}

						self.versionData = result.data;
					} else {
						status.text(result.data);
					}
				});
				self.updateAboutVersion(result.data);
			});
		};
		self.updateAboutVersion = function(data) {

			if (data['template'].hasUpdate == true) {
				$('.about-template-update').find('.version-latest').addClass('sunfwhide');
				$('.about-template-update').find('.update-availabel').removeClass('sunfwhide');

				$('.footer-template-update').find('.update-availabel').removeClass('sunfwhide');
				$('.footer-template-update').find('.sunfw-footer-template-new-version').html(data['template'].newVersion);

				$('.alert-sunfw-template-update').find('.sunfw-template-new-version').text(data['template'].newVersion);
				$('.alert-sunfw-template-update').find('.sunfw-template-new-version').parent().removeClass('sunfwhide');
				$('.alert-sunfw-template-update').removeClass('sunfwhide');
			}

			if (data['framework'].hasUpdate == true) {
				$('.about-framework-update').find('.version-latest').addClass('sunfwhide');
				$('.about-framework-update').find('.update-availabel').removeClass('sunfwhide');

				$('.footer-framework-update').find('.update-availabel').removeClass('sunfwhide');
				$('.footer-framework-update').find('.sunfw-footer-framework-new-version').html(data['framework'].newVersion);

				$('.alert-sunfw-framework-update').find('.sunfw-framework-new-version').text(data['framework'].newVersion);
				$('.alert-sunfw-framework-update').find('.sunfw-framework-new-version').parent().removeClass('sunfwhide');
				$('.alert-sunfw-framework-update').removeClass('sunfwhide');
			}

			if (data['framework'].hasUpdate == true )
			{
				$('#sunfw-update-framework-now-btn').removeClass('sunfwhide');

				$('#sunfw-update-framework-now-btn').on('click', function (){
					$('.sunfw-footer').find('.sunfw-framework-version').find('a.sunfw-update-link').trigger('click');
				});
			}

			if(data['template'].hasUpdate == true)
			{
				$('#sunfw-update-template-now-btn').removeClass('sunfwhide');

				$('#sunfw-update-template-now-btn').on('click', function (){
					$('.sunfw-footer').find('.sunfw-template-version').find('a.sunfw-update-link').trigger('click');
				});
			}
		};
		self.loadConfirmScreen = function() {
			// Set loading state
			self.panel.html('').addClass('sunfw-loading');

			$.getJSON('index.php?sunfwwidget=update&action=confirm&style_id=' + self.params.styleId + '&' + self.params.token + '=1&template_name=' + self.params.template + '&author=joomlashine&target=' + self.target , function(response) {
				if (response.data == null) {
					self.loadInstallScreen();
				}

				self.panel.html(response.data);
				self.panel.removeClass('sunfw-loading');

				var	confirmUpdateButton = self.panel.find('button#btn-confirm-update'),
					updateBothButton = self.panel.find('button#btn-confirm-update-both'),
					customerInfoFields = self.panel.find('input[name="username"], input[name="password"]');

				// Setup cancel button
				self.panel.find('#btn-cancel-update').click(function(event) {
					event.preventDefault();
					self.panel.dialog('close');
				});
				self.panel.find('#btn-cancel-update-open-token-page').click(function(event) {
					event.preventDefault();
					self.panel.dialog('close');
					$('#data-token-key').trigger('click');
				});
				// Setup update both button
				if (updateBothButton.length) {
					updateBothButton.click(function() {
						// Switch to update template mode
						self.target = 'template';

						// Reload confirmation screen
						self.loadConfirmScreen();
					});
				}

				// Setup update button
				if (customerInfoFields.size() == 0) {
					// Setup event handler for confirm button when edition is FREE
					confirmUpdateButton.click(function() {
						confirmUpdateButton.attr('disabled', 'disabled');
						self.loadInstallScreen();
					});
				} else {
					customerInfoFields.on('keyup change', function(event) {
						self.customerInfo = {
							username: self.panel.find('input[name="username"]').val(),
							password: self.panel.find('input[name="password"]').val()
						};

						if (self.customerInfo.username != '' && self.customerInfo.password != '') {
							confirmUpdateButton.removeAttr('disabled');

							if (event.type == 'keyup' && event.keyCode == 13) {
								confirmUpdateButton.trigger('click');
							}
						} else {
							confirmUpdateButton.attr('disabled', 'disabled');
						}
					});

					confirmUpdateButton.click(function() {
						confirmUpdateButton.attr('disabled', 'disabled');

						// Send request to checking customer information
						$.ajax({
							url: 'index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=confirm',
							type: 'POST',
							dataType: 'JSON',
							data: {
								username: self.customerInfo.username,
								password: self.customerInfo.password
							},
							success: function(response) {
								if (response.type == 'success') {
									self.customerInfo = {
										username: self.customerInfo.username,
										password: self.customerInfo.password
									};

									self.loadInstallScreen();
								} else {
									alert(response.data);
								}
							}
						});
					});
				}
			});
		};

		self.loadInstallScreen = function() {
			self.panel.dialog('option', 'buttons', {});

			$.getJSON('index.php?sunfwwidget=update&action=install&style_id=' + self.params.styleId + '&' + self.params.token + '=1&template_name=' + self.params.template + '&author=joomlashine&target=' + self.target, function(response) {
				self.panel.html(response.data);

				if (self.target == 'framework') {
					// Start framework installation process
					self.startInstallFramework();
				} else {
					// Start download template package
					self.downloadPackage(self.customerInfo);
				}
			});
		};

		self.startInstallFramework = function() {
			var	downloadPackage = self.panel.find('li#sunfw-download-package'),
				downloadStatus = downloadPackage.find('.sunfw-status'),
				installUpdate = self.panel.find('li#sunfw-install-update'),
				installStatus = installUpdate.find('.sunfw-status');

			// Set in progress message
			self.inProgress(downloadStatus);

			$.getJSON('index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=downloadFramework', function(response) {
				// Unset in progress message
				self.inProgress(downloadStatus, true);

				if (response.type == 'success') {
					downloadPackage.toggleClass('sunfw-loading sunfw-success');
					installUpdate.removeClass('sunfwhide');

					// Set in progress message
					self.inProgress(installStatus);

					$.getJSON('index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=installFramework', function(result) {
						// Unset in progress message
						self.inProgress(installStatus, true);

						if (result.type == 'success') {
							self.panel.find('#sunfw-success-message').removeClass('sunfwhide');
							installUpdate.toggleClass('sunfw-loading sunfw-success');
						} else {
							installUpdate.toggleClass('sunfw-loading sunfw-error');
							installStatus.text(result.data);
						}

						// Stop update process
						self.panel.find('#btn-finish-install').removeClass('sunfwhide').click(function(event) {
							event.preventDefault();
							self.finishUpdate();
						}).parent().removeClass('sunfwhide');
					});
				} else {
					downloadPackage.toggleClass('sunfw-loading sunfw-error');
					downloadStatus.text(response.data);
				}
			});
		};

		self.downloadPackage = function(loginData) {
			var	liDownload = $('#sunfw-download-package').removeClass('sunfwhide'),
				spanStatus = liDownload.find('span.sunfw-status'),
				btnFinish = self.panel.find('#btn-finish-install');

			// Set in progress message
			self.inProgress(spanStatus);
			$.ajax({
				url: 'index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=download',
				type: 'POST',
				dataType: 'JSON',
				data: loginData,
				success: function(response) {
					// Unset in progress message
					self.inProgress(spanStatus, true);

					if (response.type == 'error') {
						liDownload.removeClass('sunfw-loading').addClass('sunfw-error');
						spanStatus.html(response.data).addClass('alert alert-error');

						// Stop update process
						btnFinish.removeClass('sunfwhide').parent().removeClass('sunfwhide');
					} else {
						liDownload.removeClass('sunfw-loading').addClass('sunfw-success');

						// Start checking for file integrity
						self.checkFilesModification();
					}
				}
			});
		};

		self.checkFilesModification = function() {
			var	liCreateList = self.panel.find('#sunfw-backup-modified-files').removeClass('sunfwhide'),
				spanStatus = liCreateList.find('span.sunfw-status'),
				putOnHold = self.panel.find('#sunfw-put-update-on-hold'),
				btnFinish = self.panel.find('#btn-finish-install');

			// Set in progress message
			self.inProgress(spanStatus);

			$.getJSON('index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=checkBeforeUpdate', function(response) {
				// Unset in progress message
				self.inProgress(spanStatus, true);

				liCreateList.removeClass('sunfw-loading').addClass('sunfw-success');

				if (response.type == 'success') {
					if (response.data.hasModification == true) {
						self.hasModification = true;

						// Temporary hold the update process
						liCreateList.find('#sunfw-download-backup-of-modified-files').removeClass('sunfwhide');

						// Setup continue and cancel button
						putOnHold.children('#btn-continue-install').click(function(event) {
							event.preventDefault();

							// Hide warning message
							liCreateList.find('#sunfw-download-backup-of-modified-files').addClass('sunfwhide');

							// Hide put-on-hold buttons
							putOnHold.addClass('sunfwhide');

							// Prepare for update installation
							self.prepareUpdate();
						});

						putOnHold.children('#btn-cancel-install').click(function(event) {
							event.preventDefault();
							self.finishUpdate();
						});

						// Show put-on-hold buttons
						putOnHold.removeClass('sunfwhide').parent().removeClass('sunfwhide');
					} else {
						// Prepare for update installation
						self.prepareUpdate();
					}
				} else {
					liCreateList.removeClass('sunfw-loading').addClass('sunfw-error');
					spanStatus.text(response.data).addClass('alert alert-error');

					// Stop update process
					btnFinish.removeClass('sunfwhide').parent().removeClass('sunfwhide');
				}
			});
		};

		self.prepareUpdate = function() {
			if (self.versionData['framework'].hasUpdate === true) {
				var	downloadPackage = self.panel.find('li#sunfw-download-framework').removeClass('sunfwhide'),
					downloadStatus = downloadPackage.find('.sunfw-status'),
					installUpdate = self.panel.find('li#sunfw-install-framework'),
					installStatus = installUpdate.find('.sunfw-status');

				// Set in progress message
				self.inProgress(downloadStatus);

				// Update template framework
				$.getJSON('index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=downloadFramework', function(response) {
					// Unset in progress message
					self.inProgress(downloadStatus, true);

					if (response.type == 'success') {
						downloadPackage.toggleClass('sunfw-loading sunfw-success');
						installUpdate.removeClass('sunfwhide');

						// Set in progress message
						self.inProgress(installStatus);

						$.getJSON('index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=installFramework', function(result) {
							// Unset in progress message
							self.inProgress(installStatus, true);

							if (result.type == 'success') {
								installUpdate.toggleClass('sunfw-loading sunfw-success');

								// Update the template
								self.installUpdate();
							} else {
								installUpdate.toggleClass('sunfw-loading sunfw-error');
								installStatus.text(result.data);

								// Stop update process
								self.panel.find('#btn-finish-install').removeClass('sunfwhide').click(function(event) {
									event.preventDefault();
									self.finishUpdate();
								}).parent().removeClass('sunfwhide');
							}
						});
					} else {
						downloadPackage.toggleClass('sunfw-loading sunfw-error');
						downloadStatus.text(response.data);
					}
				});
			} else {
				// Update the template
				self.installUpdate();
			}
		};

		self.installUpdate = function() {
			var	liInstall = self.panel.find('#sunfw-install-update').removeClass('sunfwhide'),
				successMessage = self.panel.find('#sunfw-success-message'),
				spanStatus = liInstall.find('span.sunfw-status'),
				btnFinish = self.panel.find('#btn-finish-install');

			// Set in progress message
			self.inProgress(spanStatus);

			// Send request to install template update
			$.getJSON('index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=installPackage', function(response) {
				// Unset in progress message
				self.inProgress(spanStatus, true);

				if (response.type == 'success') {
					liInstall.removeClass('sunfw-loading').addClass('sunfw-success');
					//successMessage.removeClass('sunfwhide');

					if (self.hasModification) {
						successMessage.find('#sunfw-backup-information').removeClass('sunfwhide');
					}
					// re-compile SASS
					$.ajax({
						url: 'index.php?option=com_ajax&format=json&plugin=sunfw&context=update&' + self.params.token + '=1&style_id=' + self.params.styleId + '&template_name=' + self.params.template + '&action=compileCss',
						type: 'GET',
						dataType: 'JSON',
						success: function(response) {
							// Unset in progress message
							successMessage.removeClass('sunfwhide');
							btnFinish.removeClass('sunfwhide').click(function(event) {
								event.preventDefault();
								self.finishUpdate();
							}).parent().removeClass('sunfwhide');
						}
					});
				} else {
					liInstall.removeClass('sunfw-loading').addClass('sunfw-error');
					spanStatus.html(response.data).addClass('alert alert-error');
					btnFinish.removeClass('sunfwhide').click(function(event) {
						event.preventDefault();
						self.finishUpdate();
					}).parent().removeClass('sunfwhide');
				}


			});
		};

		self.finishUpdate = function() {
			// Close the dialog
			self.panel.dialog('close');

			// Reload the page
			window.location.reload();
		};

		self.inProgress = function(element, stop) {
			stop = typeof stop == 'undefined' ? false : stop;

			if ( ! stop) {
				// Schedule still loading notice
				self.timer = setInterval(function() {
					var msg = element.html();

					if (msg == 'Still in progress...') {
						element.html('Please wait...');
					} else {
						element.html('Still in progress...');
					}
				}, 3000);
			} else if (self.timer) {
				clearInterval(self.timer);
				element.html('');
			}
		};

		self.init();
	};

	/**
	 * Register jQuery plugin
	 *
	 * @param   element  button  Button that will triggered event to start install sample data
	 * @param   object   params  Object parameters
	 *
	 * @return  void
	 */
	$.initSunFwUpdate = function (button, params) {
		if ($.__sunfw_admin_auto_update__ === undefined)
			$.__sunfw_admin_auto_update__ = new SunFwUpdate(button, params);
	};
}(jQuery);