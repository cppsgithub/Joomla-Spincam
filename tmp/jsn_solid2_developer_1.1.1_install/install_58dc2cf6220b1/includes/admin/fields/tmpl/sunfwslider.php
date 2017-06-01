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
$divSliderID 	= "sunfw-slider-range-" . uniqid();
$inputID 		= $this->id;
$showInputID 	= $this->id . '_show';
$resetSlider	= 'resetSlider' . uniqid() ;
?>
<script type="text/javascript">
	(function($) {
		$(document).ready(function() {
			var divSliderID = $("#<?php echo $divSliderID; ?>");
			var inputID = $("#<?php echo $inputID; ?>");
			var showInputID = $("#<?php echo $showInputID; ?>");
			var textSuffix = "<?php echo $this->textSuffix; ?>";

			inputID.on('change', function (e) {
				var value = 0;
				if ($(this).val() != '')
				{
					value = $(this).val();
				}

				divSliderID.slider({value: parseFloat(value)});
				showInputID.val(parseFloat(value));
			});

			showInputID.on('change', function (e) {

				var value = 0;
				if ($(this).val() != '')
				{
					value = $(this).val();
				}
				inputID.val(parseFloat(value) + textSuffix);
				inputID.trigger('change');
				divSliderID.slider({value: parseFloat(value)});
			})

			try
			{
				divSliderID[0].slide = null;
			}
			catch(err)
			{

			}

			divSliderID.slider({
		        range: "min",
		        value: <?php echo (int) $this->value; ?>,
		        min: <?php echo $this->minRange;?>,
		        max: <?php echo $this->maxRange;?>,
		        step: <?php echo $this->step;?>,
		        slide: function( event, ui ) {
		        	inputID.val(ui.value + textSuffix);
		        	showInputID.val(ui.value);
		        	inputID.trigger('change');
		        }
		      });
		});
	})(jQuery);
</script>
<div class="sunfw-slider-range">
	<div id="<?php echo $divSliderID;?>" class="sunfwslider-slider"></div>
	<div class="input-group">
		<input type="text" name="<?php echo $this->name; ?>" id="<?php echo $this->id; ?>" value="<?php echo (float) $this->value; ?><?php echo $this->textSuffix; ?>" class="sunfwinputslider sunfwhide" />
		<input type="text" id="<?php echo $showInputID; ?>" value="<?php echo (float) $this->value; ?>" class="<?php echo $this->element['class']; ?>" <?php echo $this->inputAttrs; ?> />
		<?php if ($this->textSuffix != '') { ?>
		<div class="input-group-addon"><?php echo $this->textSuffix; ?></div>
		<?php } ?>
	</div>
</div>