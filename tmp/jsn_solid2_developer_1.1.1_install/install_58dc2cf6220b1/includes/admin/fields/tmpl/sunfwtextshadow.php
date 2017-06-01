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
$inputID 		= $this->id;
$btnModalID 	= $this->id . '_btn_text_modal';
$modalTarget 	= $this->id . '_text_modal_target';
?>
<script type="text/javascript">
	(function($) {
		$(document).ready(function() {
			var inputID = $('#<?php echo $inputID; ?>');
			inputID.sunFwTextShadow();
		});
	})(jQuery);
</script>
<div class="sunfw-text-shadow input-group">
	<input type="text" name="<?php echo $this->name; ?>" data-btn-modal-id="<?php echo $btnModalID; ?>" id="<?php echo $this->id; ?>" value="<?php echo $this->value; ?>" class="<?php echo $this->element['class'] ?>" <?php echo $this->inputAttrs; ?>  />
<!-- Button trigger modal -->
	<div class="input-group-addon sunfw-text-shadow-btn-modal" id="<?php echo $btnModalID; ?>" data-toggle="modal" data-target="#<?php echo $modalTarget; ?>"><i class="fa fa-magic" aria-hidden="true"></i></div>
</div>
<div class="modal fade" id="<?php echo $modalTarget; ?>" tabindex="-1" role="dialog">
	<div class="modal-dialog sunfw-text-shadow-modal" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="form-group">

					<label class="title" for="horizontal-length"><?php echo JText::_('SUNFW_APPEARANCE_TEXTSHADOW_HORIZONTAL_LENGTH');?></label>
					<div class="sunfw-slider-range">
						<div class="sunfw-textshadow-slider-horizontal-length-slider"></div>
						<div class="input-group">
							<input class="sunfw-textshadow-horizontal-length form-control" type="text" value="10">
							<div class="input-group-addon">px</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="title" for="vertical-length"><?php echo JText::_('SUNFW_APPEARANCE_TEXTSHADOW_VERTICAL_LENGTH');?></label>
					<div class="sunfw-slider-range">
						<div class="sunfw-textshadow-slider-vertical-length-slider"></div>
						<div class="input-group">
							<input class="sunfw-textshadow-vertical-length form-control" type="text" value="10">
							<div class="input-group-addon">px</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="title"><?php echo JText::_('SUNFW_APPEARANCE_TEXTSHADOW_BLUR_RADIUS');?></label>
					<div class="sunfw-slider-range">
						<div class="sunfw-textshadow-slider-blur-radius"></div>
						<div class="input-group">
							<input class="sunfw-textshadow-blur-radius form-control" type="text" value="10">
							<div class="input-group-addon">px</div>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label class="title"><?php echo JText::_('SUNFW_APPEARANCE_TEXTSHADOW_SHADOW_COLOR'); ?></label>
					<input class="sunfw-textshadow-shadow-color form-control" type="text" value="#000000" />
				</div>

			</div>
		</div>
	</div>
</div>