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

$backgroundColorFieldName 	 		= $this->element['prefixName'] . '-background-color';
$backgroundTypeFieldName 	 		= $this->element['prefixName'] . '-background-type';
$backgroundSizeFieldName 	 		= $this->element['prefixName'] . '-background-size';
$backgroundImageFieldName 	 		= $this->element['prefixName'] . '-background-image';
$backgroundPositionFieldName 		= $this->element['prefixName'] . '-background-position';
$backgroundAttractmentFieldName	 	= $this->element['prefixName'] . '-background-attachment';
$backgroundRepeatFieldName	 		= $this->element['prefixName'] . '-background-repeat';

$idContailer 	= $this->id . '_' . uniqid();
$colorID 		= str_replace('-', '_', $this->element['fieldName'] . '-' . $this->element['prefixName'] . '-background-color');
$bgTypeID 		= str_replace('-', '_', $this->element['fieldName'] . '-' . $this->element['prefixName'] . '-background-type');
$imageID		= str_replace('-', '_', $this->element['fieldName'] . '-' . $this->element['prefixName'] . '-background-image');
$bgAttachmentID = str_replace('-', '_', $this->element['fieldName'] . '-' . $this->element['prefixName'] . '-background-attachment');
$bgSizeID 		= str_replace('-', '_', $this->element['fieldName'] . '-' . $this->element['prefixName'] . '-background-size');
$bgRepeatID 	= str_replace('-', '_', $this->element['fieldName'] . '-' . $this->element['prefixName'] . '-background-repeat');
$bgPositionID 	= str_replace('-', '_', $this->element['fieldName'] . '-' . $this->element['prefixName'] . '-background-position');

$modalTarget 	= $this->id . '_background_modal_target_' . uniqid();
$btnModalID 	= $this->id . '_background_modal_modal_' . uniqid();


$bgType 	= array();
$bgType[] 	= JHTML::_( 'select.option', 'image', 'Image' );
$bgType[] 	= JHTML::_( 'select.option', 'color', 'Color' ); // first parameter is value, second is text

$bgRepeat = array (
		'0' => array ('value' => 'repeat',
				'text'  => 'Repeat'),
		'1'	  => array ('value' => 'repeat-x',
				'text'  => 'Repeat X'),
		'2'	  => array ('value' => 'repeat-y',
				'text'  => 'Repeat Y'),
		'3'	  => array ('value' => 'no-repeat',
				'text'  => 'No Repeat'),
		'4'	  => array ('value' => 'initial',
				'text'  => 'Initial'),
		'5'	  => array ('value'		 => 'inherit',
				'text'		  => 'Inherit'));

$bgPosition = array (
		'0' => array ('value' => 'left top',
				'text'  => 'left top'),
		'1'	  => array ('value' => 'left center',
				'text'  => 'left center'),
		'2'	  => array ('value' => 'left bottom',
				'text'  => 'left bottom'),
		'3'	  => array ('value' => 'right top',
				'text'  => 'right top'),
		'4'	  => array ('value' => 'right center',
				'text'  => 'right center'),
		'5'	  => array ('value' => 'right bottom',
				'text'  => 'right bottom'),
		'6'	  => array ('value'	=> 'center top',
				'text'	=> 'center top'),
		'7'	  => array ('value'	=> 'center center',
				'text'	=> 'center center'),
		'8'	  => array ('value' => 'center bottom',
				'text'	=> 'center bottom'));

$bgAttachment = array (
		'0' => array ('value' => 'scroll',
				'text'  => 'scroll'),
		'1'	  => array ('value' => 'fixed',
				'text'  => 'fixed'),
		'2'	  => array ('value' => 'local',
				'text'  => 'local'),
		'3'	  => array ('value' => 'initial',
				'text'  => 'initial'),
		'4'	  => array ('value' => 'inherit',
				'text'  => 'inherit'));

$bgSize = array (
		'0' => array ('value' => 'auto',
				'text'  => 'auto'),
		'1'	  => array ('value' => 'cover',
				'text'  => 'cover'),
		'2'	  => array ('value' => 'contain',
				'text'  => 'contain'),
		'3'	  => array ('value' => 'initial',
				'text'  => 'initial'),
		'4'	  => array ('value' => 'inherit',
				'text'  => 'inherit'));
?>
<script type="text/javascript">
(function($) {
	$(document).ready(function() {
		var container = $("#<?php echo $idContailer; ?>");
		var colorContainer = $(".sunfw-background-color", container);
		var imageContainer = $(".sunfw-background-image", container);
		var btnModalID = $(".<?php echo $btnModalID; ?>", container);
		var modalTarget = $("#<?php echo $modalTarget?>");
		var colorType = $("#<?php echo $bgTypeID . 'color'?>");
		var imageType = $("#<?php echo $bgTypeID . 'image'?>");
		var bgTypeID = $("#<?php echo $bgTypeID; ?>");

		if (colorType.is(':checked'))
		{
			colorContainer.show();
			imageContainer.hide();
		}

		if (imageType.is(':checked'))
		{
			colorContainer.hide();
			imageContainer.show();
		}
		btnModalID.on('click', function(e) {
		    var src = $(this).attr('data-src');
		    var height = $(this).attr('data-height') || 300;
		    var width = $(this).attr('data-width') || 400;

		    modalTarget.find('iframe').attr({'src':src,
		                        'height': height,
		                        'width': width});
		});

		bgTypeID.on('change', function () {
			colorContainer.hide();
			imageContainer.hide();
			if ($(this).val() == 'image')
			{
				imageContainer.show();
				imageType.prop("checked", true);
			}
			else if ($(this).val() == 'color')
			{
				colorContainer.show();
				colorType.prop("checked", true);
			}
			else
			{

			}
		});
		$('.background-type', container).on('click', function () {
			colorContainer.hide();
			imageContainer.hide();
			if ($(this).val() == 'image')
			{
				imageContainer.show();
			}
			else if ($(this).val() == 'color')
			{
				colorContainer.show();
			}
			else
			{

			}
		});

		var input = $("#<?php echo $colorID; ?>");
		input.on("change", function (e) {
			 input.spectrum("set", $(this).val());
		});

		input.spectrum({
			color: "#000",
		    showInput: true,
			showButtons: false,
		    showInitial: true,
		    allowEmpty: true,
		    showAlpha: true,
		    showPalette: true,

 			preferredFormat: input.attr("data-color-type"),
		    palette: [
		        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
		        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
		        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
		        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
		        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
		        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
		        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
		        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
		    ],
			move: function(color) {
				if ( color == null )
				{
					input.val("");
				}
				else 
				{
					if (input.attr("data-color-type") == "hex")
					{
						input.val(color.toHexString());
					}
					else
					{
						input.val(color.toRgbString());
					}	
				}
			},
			change: function(color) {
				if ( color == null )
				{
					input.val("");
				}
				else 
				{
					if (input.attr("data-color-type") == "hex")
					{
						input.val(color.toHexString());
					}
					else
					{
						input.val(color.toRgbString());
					}	
				}
			},
		});
		input.css("display", "inline-block");
	});
})(jQuery);
</script>
<div class="sunfw-background padding-left-10" id="<?php echo $idContailer; ?>">
	<div class="sunfw-background-type">
		<div class="form-group">
			<div class="control-label font-size-11">
				<label><i class="fa fa-picture-o margin-right-5"></i><?php echo JText::_('SUNFW_APPEARANCE_BACKGROUND_BACKGROUND_TYPE');?></label>
			</div>
			<div class="controls">

				<?php echo JHTML::_('select.radiolist', $bgType, $this->element['fieldName'] . '[' . $this->element['prefixName'] . '-background-type' . ']', 'class="background-type"', 'value', 'text', isset($this->data[$backgroundTypeFieldName]) ? $this->data[$backgroundTypeFieldName] : 'color', $bgTypeID); ?>
			</div>
		</div>
	</div>
	<div class="sunfw-background-color border padding-10">
		<div class="form-group">
			<div class="control-label font-size-11">
				<label><?php echo JText::_('SUNFW_APPEARANCE_BACKGROUND_BACKGROUND_COLOR');?></label>
			</div>
			<div class="controls">
				<input type="text" data-color-type="rgb" class="form-control sunfwbackground" value="<?php echo isset($this->data[$backgroundColorFieldName]) ? $this->data[$backgroundColorFieldName] : '';?>" id="<?php echo  $colorID;?>" name="<?php echo $this->element['fieldName'] . '[' . $this->element['prefixName'] . '-background-color' . ']'; ?>">
			</div>
		</div>
	</div>
	<div class="sunfw-background-image border padding-10">
		<div class="form-group ">
			<div class="control-label font-size-11">
				<label><?php echo JText::_('SUNFW_APPEARANCE_BACKGROUND_IMAGE');?></label>
			</div>
			<div class="controls control-image">
				<input type="text" value="<?php echo isset($this->data[$backgroundImageFieldName]) ? $this->data[$backgroundImageFieldName] : '';?>" id="<?php echo $imageID; ?>" class="form-control" name="<?php echo $this->element['fieldName'] . '[' . $this->element['prefixName'] . '-background-image' . ']';?>">
				<a data-src="index.php?option=com_media&view=images&tmpl=component&asset=com_templates&author=created_by_sunfw&plugin=sunfw&sunfwtab=appearance&fieldid=<?php echo $imageID; ?>&folder=" class="btn <?php echo $btnModalID; ?>" id="" data-toggle="modal" data-target="#<?php echo $modalTarget; ?>" data-height="500" data-width="800"><i class="fa fa-picture-o" aria-hidden="true"></i></a>
			</div>
		</div>
		<div class="form-group">
			<div class="control-label font-size-11">
				<label><?php echo JText::_('SUNFW_APPEARANCE_BACKGROUND_BACKGROUND_REPEAT');?></label>
			</div>
			<div class="controls">
				<?php echo JHTML::_('select.genericList', $bgRepeat, $this->element['fieldName'] . '[' . $this->element['prefixName'] . '-background-repeat' . ']', 'class="form-control"', 'value', 'text', isset($this->data[$backgroundRepeatFieldName]) ? $this->data[$backgroundRepeatFieldName] : 'initial', $bgRepeatID); ?>
			</div>
		</div>
		<div class="form-group">
			<div class="control-label font-size-11">
				<label><?php echo JText::_('SUNFW_APPEARANCE_BACKGROUND_BACKGROUND_SIZE');?></label>
			</div>
			<div class="controls">
				<?php echo JHTML::_('select.genericList', $bgSize, $this->element['fieldName'] . '[' . $this->element['prefixName'] . '-background-size' . ']', 'class="form-control"', 'value', 'text', isset($this->data[$backgroundSizeFieldName]) ? $this->data[$backgroundSizeFieldName] : 'auto', $bgSizeID); ?>
			</div>
		</div>
		<div class="form-group">
			<div class="control-label font-size-11">
				<label><?php echo JText::_('SUNFW_APPEARANCE_BACKGROUND_BACKGROUND_ATTACTMENT');?></label>
			</div>
			<div class="controls">
				<?php echo JHTML::_('select.genericList', $bgAttachment, $this->element['fieldName'] . '[' . $this->element['prefixName'] . '-background-attachment' . ']', 'class="form-control"', 'value', 'text', isset($this->data[$backgroundAttractmentFieldName]) ? $this->data[$backgroundAttractmentFieldName] : 'initial', $bgAttachmentID); ?>
			</div>
		</div>
		<div class="form-group">
			<div class="control-label font-size-11">
				<label><?php echo JText::_('SUNFW_APPEARANCE_BACKGROUND_BACKGROUND_POSITION');?></label>
			</div>
			<div class="controls">
				<?php echo JHTML::_('select.genericList', $bgPosition, $this->element['fieldName'] . '[' . $this->element['prefixName'] . '-background-position' . ']', 'class="form-control"', 'value', 'text', isset($this->data[$backgroundPositionFieldName]) ? $this->data[$backgroundPositionFieldName] : 'center center', $bgPositionID); ?>
			</div>
		</div>
	</div>
	<input type="hidden" value="" id="<?php echo $bgTypeID;?>">
</div>

<div class="modal fade" id="<?php echo $modalTarget; ?>" tabindex="-1" role="dialog">
	<div class="modal-dialog sunfw-bg-image-modal" role="document">
		<div class="modal-content">
			<div class="modal-header">
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
