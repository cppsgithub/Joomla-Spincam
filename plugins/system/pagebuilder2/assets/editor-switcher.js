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

window.addEventListener('load', function () {
	var editor_switcher = document.getElementById('jsn-pb2-editor-switcher');


	if (editor_switcher && document.querySelector('textarea')) {

		// If user is create new article, pass the editor data check
		!pb2_editor_switcher.isNewContent && checkEditorData();

		// if jommla version >= 3.7, change style of editor button
		if(pb2_editor_switcher.isJoomla37) editor_switcher.style.lineHeight = '24px';

		// Show button to switch editor
		editor_switcher.classList.remove('hidden');

		// Handle click event to switch editor
		editor_switcher.nextElementSibling.addEventListener('click', function (event) {
			if (event.target.nodeName == 'A') {
				event.preventDefault();

				// Show processing state
				editor_switcher.innerHTML = pb2_editor_switcher.switching_label + ' <span class="jsn-pb2-loading"></span>';

				// Send Ajax request to switch editor
				jQuery.ajax({
					url: 'index.php?pb2ajax=1&task=switchEditor',
					data: {
						editor: event.target.href.substr(event.target.href.indexOf('#') + 1)
					},
					complete: function () {
						insertParam('switchFrom', pb2_editor_switcher.current_editor);
					}
				});

				return false;
			}
		});
	}

	function insertParam(key, value) {
		key = encodeURI(key);
		value = encodeURI(value);

		var kvp = document.location.search.substr(1).split('&');

		var i = kvp.length;
		var x;
		while (i--) {
			x = kvp[i].split('=');

			if (x[0] == key) {
				x[1] = value;
				kvp[i] = x.join('=');
				break;
			}
		}

		if (i < 0) {
			kvp[kvp.length] = [key, value].join('=');
		}

		//this will reload the page, it's likely better to store this until finished
		document.location.search = kvp.join('&');
	}

	function checkEditorData() {
		var content = document.querySelector("textarea[id^='jform']") || document.querySelector("textarea[id^='text']");
		var urlQuery = JSON.parse('{"' + decodeURI(window.location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');


		/**
		 * Minh PT on March 17, 2017: If user open article with content not from
		 * PB2 then warn them about it.
		 */
		if (!content.value.test(/<\!-- Start PageBuilder Data\|([^\r\n]+)\|End PageBuilder Data -->/) && urlQuery.hasOwnProperty('switchFrom') && pb2_editor_switcher.current_editor == 'pagebuilder2') {
			if (!confirm('This article content is not from Pagebuilder 2, editing this may cause layout broken, are you sure to edit?')) {
				window.stop();
				// Send Ajax request to switch editor
				jQuery.ajax({
					url: 'index.php?pb2ajax=1&task=switchEditor',
					data: {editor: urlQuery.switchFrom},
					success: function () {
						window.location.reload()
					}
				});
			}
		}
		else if (content.value.test(/<\!-- Start PageBuilder Data\|([^\r\n]+)\|End PageBuilder Data -->/) && urlQuery.hasOwnProperty('switchFrom') && pb2_editor_switcher.current_editor != 'pagebuilder2') {
			if (!confirm('This article content is from Pagebuilder 2, editing this may cause layout broken, are you sure to edit?')) {
				window.stop();
				// Send Ajax request to switch editor
				jQuery.ajax({
					url: 'index.php?pb2ajax=1&task=switchEditor',
					data: {editor: urlQuery.switchFrom},
					success: function () {
						window.location.reload()
					}
				});
			}
		}
	}
});

