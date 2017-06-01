(function ($) {
	"use strict";

	var SunFwQuickstart = function (button, params)
	{
		var
		self = this;
		self.params = $.extend({
			basePath: '/',
			title	: 'Get Quickstart Package',
			width: 800,
			height: 600
		}, params);

		// Sample data dialog options
		self.dialogOptions = {
			width		: self.params.width,
			height		: self.params.height,
			title		: self.params.title,
			resizable	: false,
			draggable	: false,
			autoOpen	: false,
			modal		: true,
			open		: loadQuickStartListScreen,
			closeOnEscape: false,
			buttons		: {
				'Close': function () {
					self.panel.dialog('close');
				}
			}
		};

		self.button = $(button);
		self.panel  = $('<div />', { 'class': 'sunfw-quickstart-package' });

		// Initialize modal window
		self.panel.dialog(self.dialogOptions);

		/**
		 * Initialize sample data installation
		 * 
		 * @return void
		 */
		function init ()
		{
			// Handle click event for install button to open dialog
			self.button.on('click', function (e) {
				e.preventDefault();
				self.panel.html('');
				self.panel.dialog('open');
			});

			// Handle window resize event to update modal position
			$(window).on('resize', function () {
				self.panel.dialog('option', 'position', 'center');
			});
		};

		function loadQuickStartListScreen()
		{
			self.panel.html('').addClass('sunfw-loading');
			
			$.getJSON('index.php?sunfwwidget=quickstart&action=loadQuickStartList&style_id=' + self.params.styleId + '&' + self.params.token + '=1&template_name=' + self.params.template + '&author=joomlashine' , function(response) {		
				self.panel.html(response.data);
				self.panel.removeClass('sunfw-loading');
				
				// Setup cancel button
				self.panel.find('.btn-download-quickstart').click(function(event) {
					event.preventDefault();
					loadLoginScreen($(this).attr('data-id'));
				});
			});			
		}
		/**
		 * Handle dialog opened event to load start
		 * page of sample data installation process
		 * 
		 * @return void
		 */
		function loadLoginScreen (quickstartID)
		{
			self.panel.html('').addClass('sunfw-loading');
			$.getJSON('index.php?sunfwwidget=quickstart&action=login&style_id=' + self.params.styleId + '&' + self.params.token + '=1&template_name=' + self.params.template + '&author=joomlashine&quickstart_id=' + quickstartID , function(response) {
				if (response.data != null && response.data.auth !== undefined && response.data.auth == false) {
					download(response.data);
					return;
				}		
				self.panel.html(response.data);
				self.panel.removeClass('sunfw-loading');
				
				self.panel.find('input[name="username"], input[name="password"]').on('keypress change', updateDownloadButton);
				self.panel.find('button#btn-login').on('click', checkLogin);
			});
		};

		/**
		 * Toggle state of button "Download"
		 * 
		 * @return void
		 */
		function updateDownloadButton ()
		{
			var
			username = self.panel.find('input[name="username"]').val(),
			password = self.panel.find('input[name="password"]').val(),
			download = self.panel.find('button#btn-login');

			username != '' && password != ''
				? download.removeAttr('disabled')
				: download.attr('disabled', 'disabled');
		};

		/**
		 * Send request to checking customer information
		 * 
		 * @return  void
		 */
		function checkLogin ()
		{
			var
			el = $(this),
			username = self.panel.find('input[name="username"]'),
			quickstartID = self.panel.find('input[name="quickstart_id"]'),
			password = self.panel.find('input[name="password"]');

			el.attr('disabled', 'disabled');
			username.attr('disabled', 'disabled');
			password.attr('disabled', 'disabled');

			// Send request to checking username and password
			$.ajax({
				url: 'index.php?sunfwwidget=quickstart&action=auth&template=' + self.params.template + '&' + self.params.token + '=1&author=joomlashine&template_name=' + self.params.template + '&quickstart_id=' + quickstartID.val(),
				type: 'POST',
				dataType: 'JSON',
				data: {
					username: username.val(),
					password: password.val()
				},
				success: function (response) {
					if (response.type == 'error') {
						var
						status = self.panel.find('#sunfw-login-error');
						status.text(response.data).removeClass('sunfwhide');

						el.removeAttr('disabled', 'disabled');
						username.removeAttr('disabled', 'disabled');
						password.removeAttr('disabled', 'disabled');

						return;
					}

					download(response.data);
				}
			});
		};

		function download (data)
		{
			var
			downloadUrl = "http://www.joomlashine.com/index.php?option=com_lightcart&controller=remoteconnectauthentication";
			downloadUrl+= "&task=authenticate&tmpl=component&identified_name=" + data.id;
			downloadUrl+= "&edition=" + data.edition + "&joomla_version=" + data.joomlaVersion + '&' + self.params.token + '=1';

			if (data.username !== undefined && data.password != undefined)
				downloadUrl+= "&username=" + data.username + "&password=" + data.password;
			
			downloadUrl+= '&upgrade=yes&language=en-GB&package_type=quickstart&&file_attr=' + encodeURIComponent('{"quickstart_id":"'+ data.quickstartID +'"}');

			setTimeout(function () {
				self.panel.dialog('close');
			}, 3000);
			window.location = downloadUrl;
		}

		init();
	};

	/**
	 * Register jQuery plugin
	 *
	 * @param   element  button  Button that will triggered event to start install sample data
	 * @param   object   params  Object parameters
	 * 
	 * @return  void
	 */
	$.initDownloadQuickstartPackage = function (button, params) {
		if ($.__template_admin_quickstart_package__ === undefined)
			$.__template_admin_quickstart_package__ = new SunFwQuickstart(button, params);
	};
})(jQuery);