<?php
/**
 * @version     $Id$
 * @package     JSNExtension
 * @subpackage  JSNTPLFramework
 * @author      JoomlaShine Team <support@joomlashine.com>
 * @copyright   Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license     GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file.
defined('_JEXEC') or die('Restricted access');

// Load Bootstrap.
JHtml::_('bootstrap.framework');

// Get Joomla document object.
$document = JFactory::getDocument();

// Load admin template's stylesheet.
$document->addStyleSheet(JUri::base(true) . '/templates/' . JFactory::getApplication()->getTemplate() . '/css/template' . ($this->direction == 'rtl' ? '-rtl' : '') . '.css');

// Get default editor.
$editor = JFactory::getConfig()->get('editor');

// Init and render editor.
$editor = JEditor::getInstance($editor);
$setter = $editor->setContent('editor', '%CONTENT%');
$editor = $editor->display( 'editor', '', '100%', '100%', '80', '25', array('readmore', 'pagebreak') );

// Load and render document head.
$head = $document->loadRenderer('head');

echo $head->render('');
?>
<style type="text/css">
	body {
		margin: 0;
		border: 0;
		padding: 0;
	}
	#sunfw-widget-editor {
		padding: 15px;
	}
	textarea#editor, .toggle-editor {
		margin-bottom: 0;
	}
</style>
<div id="sunfw-widget-editor">
	<?php echo $editor; ?>
</div>
<script type="text/javascript">
	jQuery(function($) {
		$(window).load(function() {
			var textArea = document.getElementById('editor'),
				iframe = document.getElementById('editor_ifr'),

			// Fit editor to window height.
			handle_resize = function() {
				var clientHeight = ( document.documentElement || document.body ).clientHeight,
					scrollHeight = ( document.documentElement || document.body ).scrollHeight;

				if (iframe && scrollHeight > clientHeight && textArea.style.display == 'none') {
					iframe.style.height = ( parseInt(iframe.style.height) - (scrollHeight - clientHeight) ) + 'px';
				}

				if (iframe) {
					var container = iframe.parentNode;

					while ( ! container.classList.contains('mce-tinymce') && container.nodeName != 'BODY' ) {
						container = container.parentNode;
					}

					if ( container.classList.contains('mce-tinymce') ) {
						var containerCss = window.getComputedStyle(container);

						textArea.style.margin = containerCss.getPropertyValue('margin');
						textArea.style.height = (
							parseInt( containerCss.getPropertyValue('height') )
							+ parseInt( containerCss.getPropertyValue('border-top-width') )
							+ parseInt( containerCss.getPropertyValue('border-bottom-width') )
							+ parseInt( containerCss.getPropertyValue('padding-top') )
							+ parseInt( containerCss.getPropertyValue('padding-bottom') )
						) + 'px';
					}
				} else {
					var textAreaCss = window.getComputedStyle(textArea);

					textArea.style.height = (
						parseInt( textAreaCss.getPropertyValue('height') ) - (scrollHeight - clientHeight)
					) + 'px';
				}
			};

			window.addEventListener('resize', function() {
				handle_resize.timer && clearTimeout(handle_resize.timer);

				handle_resize.timer = setTimeout(handle_resize, 100);
			});

			handle_resize();

			// Define function to set content for editor.
			window.sunFwEditorSetContent = function(content) {
				<?php echo preg_replace('/["\']*%CONTENT%["\']*/', 'content', $setter); ?>
			};
		});
	});
</script>
