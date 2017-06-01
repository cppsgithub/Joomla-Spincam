<?php
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

// No direct access to this file.
defined('_JEXEC') or die('Restricted access');
?>
<div class="sunfw-favicon">
	<div class="sunfw-favicon-image">
		<div class="form-group">
			<div class="controls control-image">
				<input type="text" value="<?php echo $this->value; ?>" id="<?php echo $this->id; ?>" class="form-control" name="<?php echo $this->name;?>">
				<a data-src="index.php?sunfwwidget=images&action=index&author=joomlashine&rformat=raw&handler=sunFwInsertFavIconValue&style_id=<?php
					echo $this->input->getInt('id');
				?>&template_name=<?php
					echo SunFwAdmin::getInstance()->template;
				?>&<?php echo JSession::getFormToken(); ?>=1" class="btn sunfw-favicon-selector" data-toggle="modal" data-target="#sunfw_favicon_selector_modal" data-height="500" data-width="800">
					...
				</a>
			</div>
		</div>
	</div>
</div>
<?php if ( ! defined( 'SUNFW_FAVICON_MODAL_RENDERED' ) ) : ?>
<div class="modal fade" id="sunfw_favicon_selector_modal" tabindex="-1" role="dialog">
	<div class="modal-dialog sunfw-bg-image-modal" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<?php echo JText::_('SUNFW_CHOOSE_IMAGE'); ?>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
 				<iframe frameborder="0"></iframe>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
	(function($) {
		$(document).ready(function() {
			window.sunFwInsertFavIconValue = function( value, element ) {
				$(element).val( value );
				$($(element).next().attr('data-target') + ' .close').trigger('click');
			};

			$('a.sunfw-favicon-selector').click( function(event) {
				event.preventDefault();

				// Get current data.
				var src = $(this).attr('data-src'),
					width = $(this).attr('data-width') || 400,
					height = $(this).attr('data-height') || 300,
					selected = $(this).prev().val(),
					element_id = $(this).prev().attr('id');

				// Build link to open media selector.
				src += '&selected=' + selected + '&element=' + element_id;

				// Load media selector.
				$($(this).attr('data-target') + ' iframe').attr( {
					src: src,
					height: height,
					width: width
				} );
			} );
		});
	})(jQuery);
</script>
<?php define( 'SUNFW_FAVICON_MODAL_RENDERED', 1 ); endif; ?>
