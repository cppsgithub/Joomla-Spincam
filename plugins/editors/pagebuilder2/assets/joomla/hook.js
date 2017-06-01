/**
 * @version    $Id$
 * @package    JSN_PageBuilder2
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

String.prototype.b64encode = function () {
	return btoa(unescape(encodeURIComponent(this)));
};

String.prototype.b64decode = function () {
	return decodeURIComponent(escape(atob(this)));
};

define(['jquery', 'jsn-pb-2'], function ($, PageBuilder) {
	
	const md5 = PageBuilder.md5

	if (!window.jQuery) {
		window.jQuery = window.$ = $;
	}

	function JSNPageBuilder2Hook(params) {
		// Define parameters.
		this.params = $.extend({
			id: '',
			rootURL: '/'
		}, params);

		// Create the container for PageBuilder editor.
		this.textarea = $('#' + this.params.id).hide();

		// Create necessary elements for PageBuilder editor.
		this.editor = $('<div>').insertAfter(this.textarea);

		this.initialize();
	}

	JSNPageBuilder2Hook.prototype = {
		initialize: function () {
			var self = this;

			$(document).ready(function () {
				setTimeout(function () {
					// Get the editor switcher of PageBuilder v1.
					self.pb1_editor_switcher = document.getElementById('pb-editor-switcher');

					// If PageBuilder v1 is running, listen to editor switcher buttons.
					if (self.pb1_editor_switcher) {
						self.pb1_editor_switcher.addEventListener('click', function (event) {
							if (event.target.nodeName == 'BUTTON') {
								if (event.target.classList.contains('pb-off')) {
									// Re-init PageBuilder editor with the most recent data.
									
									self.initEditor(self.textarea.val());

									// Hide the textarea.
									self.textarea.hide();

									// Show PageBuilder editor.
									self.editor.show();
								} else {
									// Hide PageBuilder editor.
									self.editor.hide();
								}
							}
						});

						if (self.pb1_editor_switcher.querySelector('.pb-on').classList.contains('active')) {
							// Hide PageBuilder editor.
							self.editor.hide();
						}
					}

					// Init PageBuilder editor.
					self.initEditor(self.textarea.val());
				}, 500);
			});

			// Override Joomla submit button handler.
			window.original_joomla_submit_handler = window.original_joomla_submit_handler || Joomla.submitbutton;

			Joomla.submitbutton = function (task) {
				let id = RegExp(/id=([0-9]*)/).exec(location.search);
				if (
					!self.pb1_editor_switcher
					||
					self.pb1_editor_switcher.querySelector('.pb-off').classList.contains('active')
				) {
					/**
					 * Thanh CH feb 22 2017
					 * add check if id of the article exist, app starts normally
					 * our app needs page id, be default, joomla does not provide article id)
					 */
					if(id && Joomla.editors.instances[ self.params.id ].page) {
						Joomla.editors.instances[ self.params.id ].page.renderHTML( function( html ) {
							self.textarea.val(
								self.params.startHTML
								+ html + self.params.endHTML
								+ self.params.startData
								+ Joomla.editors.instances[self.params.id].page.dataJSON.b64encode()
								+ self.params.endData
							);
							original_joomla_submit_handler(task);
						});
					} else {
						original_joomla_submit_handler(task);
					}
					//======//
				} else {
					original_joomla_submit_handler(task);
				}
			};
		},

		initEditor: function (content) {
			
			
			var self = this, id = RegExp(/id=([0-9]*)/).exec(location.search);
			var html;
			
			// Parse HTML
			try {
				html = content.replace(/\n|\r|\n\r/g, '').match(/<\!-- Start PageBuilder HTML -->(.*?)<\!-- End PageBuilder HTML -->/);
				html = html ? html[1] : ''
			}
			catch (e) {
				html = ''
			}

			// Parse data.
			try {
				data = content.match(/<\!-- Start PageBuilder Data\|([^\r\n]+)\|End PageBuilder Data -->/);
				data = ( data ? data[1] : '' ).b64decode();
				data = JSON.parse(data || '{}');
			}
			catch (e) {
				data = {};
			}
			
			
			
			// if (data && data.hash && html && data.hash !== md5(html)) {
			// 	data = {
			// 		"items": {
			// 			"1": {
			// 				"type": "Body",
			// 				"children": [
			// 					"l"
			// 				]
			// 			},
			// 			"l": {
			// 				"type": "Custom_HTML",
			// 				"code": html
			// 			}
			// 		}
			// 	};
			// }
			// else
			 if (JSON.stringify(data) == '{}' && content && content != '') {
				// Convert existing content to 'Custom HTML' element.
				if (content.indexOf('<!-- Start Original Data|') > -1) {
					content = content.split('<!-- Start Original Data|');
					content = content[1].split('|End Original Data -->');
					content = content[0];
				}

				data = {
					"items": {
						"1": {
							"type": "Body",
							"children": [
								"l"
							]
						},
						"l": {
							"type": "Custom_HTML",
							"code": content
						}
					}
				};
			}

			Joomla.editors.instances[self.params.id] = window.pb = PageBuilder.init(self.editor[0], {
				id: id ? id[1] : null,
				data: data,
				html: html,
				joomla: true,
				baseURL: self.params.rootURL + '/',
				sandboxURL: self.params.rootURL + ( id ? '/index.php?option=com_content&view=article&id=' + id[1] : '/index.php' ),
				resourceURL: self.params.rootURL + '/index.php?pb2ajax=1&task=getPackages'
			});
		}
	};

	return JSNPageBuilder2Hook;
});
