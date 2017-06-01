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
$btnModalID 	= $this->id . '_btn_border_modal';
$modalTarget 	= $this->id . '_border_modal_target';
?>
<script type="text/javascript">
	(function($) {
		$(document).ready(function() {
			var inputID = $('#<?php echo $inputID; ?>');
			inputID.sunFwBorder();
		});
	})(jQuery);
</script>

<div class="sunfw-border input-group">
	<input type="text" name="<?php echo $this->name; ?>" data-btn-modal-id="<?php echo $btnModalID; ?>" id="<?php echo $this->id; ?>" value="<?php echo $this->value; ?>" class="<?php echo $this->element['class'] ?>" <?php echo $this->inputAttrs; ?>  />
<!-- Button trigger modal -->
	<div class="input-group-addon sunfw-border-btn-modal" id="<?php echo $btnModalID; ?>" data-toggle="modal" data-target="#<?php echo $modalTarget; ?>"><i class="fa fa-magic" aria-hidden="true"></i></div>
</div>
<div class="modal fade" id="<?php echo $modalTarget; ?>" tabindex="-1" role="dialog">
	<div class="modal-dialog sunfw-border-modal" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="form-group">
					<label class="title"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_BORDER_WIDTH');?></label>
					<div class="sunfw-slider-range">
						<div class="sunfw-border-slider-border-width"></div>
						<div class="input-group">
							<input class="sunfw-border-border-width form-control" type="text" value="10">
							<div class="input-group-addon">px</div>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="title"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_BORDER_STYLE');?></label>
						<select class="sunfw-border-border-style form-control">
							<option value="solid"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_SOLID');?></option>
							<option value="dotted"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_DOTTED');?></option>
							<option value="dashed"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_DASHED');?></option>
							<option value="double"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_DOUBLE');?></option>
							<option value="groove"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_GROOVE');?></option>
							<option value="ridge"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_RIDGE');?></option>
							<option value="inset"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_INSET');?></option>
							<option value="outset"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_OUTSET');?></option>
							<option value="inherit"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_INHERIT');?></option>
							<option value="hidden"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_HIDDEN');?></option>
							<option value="none"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_NONE');?></option>
						</select>
				</div>
				<div class="form-group">
					<label class="title"><?php echo JText::_('SUNFW_APPEARANCE_BORDER_BORDER_COLOR'); ?></label>
					<input class="sunfw-border-border-color form-control" type="text" value="#000000" />
				</div>
			</div>
		</div>
	</div>
</div>