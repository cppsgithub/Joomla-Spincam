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
$btnModalID 	= $this->id . '_btn_shadow_modal';
$modalTarget 	= $this->id . '_shadow_modal_target';
?>
<script type="text/javascript">
	(function($) {
		$(document).ready(function() {
			var inputID = $('#<?php echo $inputID; ?>');
			inputID.sunFwBoxShadow();
		});
	})(jQuery);
</script>

<div class="sunfw-box-shadow input-group">
	<input type="text" name="<?php echo $this->name; ?>" data-btn-modal-id="<?php echo $btnModalID; ?>" id="<?php echo $this->id; ?>" value="<?php echo $this->value; ?>" class="<?php echo $this->element['class'] ?>" <?php echo $this->inputAttrs; ?>  />
<!-- Button trigger modal -->
	<div class="input-group-addon sunfw-box-shadow-btn-modal" id="<?php echo $btnModalID; ?>" data-toggle="modal" data-target="#<?php echo $modalTarget; ?>"><i class="fa fa-magic" aria-hidden="true"></i></div>
</div>
<div class="modal fade" id="<?php echo $modalTarget; ?>" tabindex="-1" role="dialog">
	<div class="modal-dialog sunfw-box-shadow-modal" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="form-group">

					<label class="title" for="horizontal-length"><?php echo JText::_('SUNFW_APPEARANCE_SHADOWBOX_HORIZONTAL_LENGTH');?></label>
					<div class="sunfw-slider-range">
						<div class="sunfw-boxshadow-slider-horizontal-length-slider"></div>
						<div class="input-group">
							<input class="sunfw-boxshadow-horizontal-length form-control" type="text" value="10">
							<div class="input-group-addon">px</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="title" for="vertical-length"><?php echo JText::_('SUNFW_APPEARANCE_SHADOWBOX_VERTICAL_LENGTH');?></label>
					<div class="sunfw-slider-range">
						<div class="sunfw-boxshadow-slider-vertical-length-slider"></div>
						<div class="input-group">
							<input class="sunfw-boxshadow-vertical-length form-control" type="text" value="10">
							<div class="input-group-addon">px</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="title"><?php echo JText::_('SUNFW_APPEARANCE_SHADOWBOX_BLUR_RADIUS');?></label>
					<div class="sunfw-slider-range">
						<div class="sunfw-boxshadow-slider-blur-radius"></div>
						<div class="input-group">
							<input class="sunfw-boxshadow-blur-radius form-control" type="text" value="10">
							<div class="input-group-addon">px</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="title"><?php echo JText::_('SUNFW_APPEARANCE_SHADOWBOX_SPREAD_RADIUS');?></label>
					<div class="sunfw-slider-range">
						<div class="sunfw-boxshadow-slider-spread-radius"></div>
						<div class="input-group">
							<input class="sunfw-boxshadow-spread-radius form-control" type="text" value="10">
							<div class="input-group-addon">px</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="title"><?php echo JText::_('SUNFW_APPEARANCE_SHADOWBOX_OPACITY'); ?></label>
					<div class="sunfw-slider-range">
						<div class="sunfw-boxshadow-slider-shadow-opacity"></div>
						<div class="input-group">
							<input class="sunfw-boxshadow-shadow-opacity form-control" type="text" value="0.6">
							<div class="input-group-addon">px</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="title"><?php echo JText::_('SUNFW_APPEARANCE_SHADOWBOX_SHADOW_COLOR'); ?></label>
					<input class="sunfw-boxshadow-shadow-color form-control" type="text" value="#000000" />
				</div>
                <div class="form-group">
                    <label class="title sunfw_boxshadow_inset" for="shadow-color"><?php echo JText::_('SUNFW_APPEARANCE_SHADOWBOX_INSET'); ?></label>
                    <input type="radio" class="sunfw_boxshadow_inset_yes" name="sunfw_boxshadow_inset" value="1"> <?php echo JText::_('JYES');?>
                    <input type="radio" class="sunfw_boxshadow_inset_no" name="sunfw_boxshadow_inset" value="0" checked="checked">  <?php echo JText::_('JNO');?>
                </div>
			</div>
		</div>
	</div>
</div>