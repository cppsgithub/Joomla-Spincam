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
$inheritFieldIds = array();
$inheritFields = explode(",", $this->element['inheritFields']);
$parentFieldName = $this->element['parentFieldName'];
foreach ($inheritFields as $inheritField)
{
	$inheritFieldIds[] = str_replace('-', '_', $parentFieldName . '-' . trim($inheritField));

}

$id 		= str_replace('[', '-', $this->name);
$id 		= str_replace(']', '-', $id);
$id 		= str_replace('-', '_', $id);
$yesID		= $id . 'yes';
$noID		= $id . 'no';
$value 		= array();
$value[] 	= JHTML::_( 'select.option', 'yes', JText::_('JYES') );
$value[] 	= JHTML::_( 'select.option', 'no', JText::_('JNO') ); // first parameter is value, second is text
//echo '<div id="' . $id . 'container">' . JHTML::_('select.radiolist', $value, $this->name, 'class="form-control sunfwinherit"', 'value', 'text', $this->value, $id) . '</div>';
$javascriptInhertFunctionName = 'sunfwInherit'. uniqid();
$containerID =  $id . 'container';
?>
<div id="<?php echo $containerID; ?>">
<?php echo JHTML::_('select.radiolist', $value, $this->name, 'class="sunfwinherit"', 'value', 'text', $this->value, $id); ?>
<input type="hidden" value="<?php echo $this->value; ?>" id="<?php echo $this->id;?>">
</div>
<script type="text/javascript">
(function($) {
	$(document).ready(function() {
		var inheritFieldIds = <?php echo json_encode($inheritFieldIds); ?>;
		var container 		= $('#<?php echo $containerID; ?>');
		var inputID			= $('#<?php echo $this->id; ?>');
		var yesID			= $('#<?php echo $yesID; ?>');
		var noID			= $('#<?php echo $noID; ?>');

		inputID.on('change', function () {

			if ($(this).val() == 'yes')
			{
				yesID.prop("checked", true);

			}
			else
			{
				noID.prop("checked", true);
			}

			<?php echo $javascriptInhertFunctionName; ?>(inheritFieldIds, $(this).val());
		});

		$('.sunfwinherit', container).on('click', function(e) {
			<?php echo $javascriptInhertFunctionName; ?>(inheritFieldIds, $(this).val());
		});

		function <?php echo $javascriptInhertFunctionName; ?>(inheritFieldIds, enable)
		{
			if (enable == 'yes')
			{
				$.each(inheritFieldIds, function (i, e) {
					var ele = $('#' + e);
					if (ele.hasClass('sunfwfontstyle'))
					{
						ele.parent().find('button').addClass('disabled');
					}
					else if (ele.hasClass('sunfwinputslider'))
					{
						ele.parent().find('input.sunfwslider').attr('readonly','readonly');
						var slider = ele.parent().parent().find('div.sunfwslider-slider');
						slider.slider('disable');
					}
					else if (ele.hasClass('sunfwcolorpicker'))
					{
						ele.spectrum("disable");
						ele.css("display", "inline-block");
						ele.prop("disabled", false);
						ele.prop("readonly", true);
					}
					else if (ele.prop("tagName").toLowerCase() == 'select')
					{
						ele.prop('disabled', true).trigger("liszt:updated");
					}
					else
					{
						ele.attr('readonly','readonly');
					}
				});
			}
			else
			{
				$.each(inheritFieldIds, function (i, e) {
					var ele = $('#' + e);
					if (ele.hasClass('sunfwfontstyle'))
					{
						ele.parent().find('button').removeClass('disabled');
					}
					else if (ele.hasClass('sunfwinputslider'))
					{
						ele.parent().find('input.sunfwslider').removeAttr("readonly");
						var slider = ele.parent().parent().find('div.sunfwslider-slider');
						slider.slider('enable');
					}
					else if (ele.hasClass('sunfwcolorpicker'))
					{
						ele.spectrum("enable");
						ele.css("display", "inline-block");
						ele.prop("readonly", false);
					}
					else if (ele.prop("tagName").toLowerCase() == 'select')
					{
						ele.prop('disabled', false).trigger("liszt:updated");
					}
					else
					{
						ele.removeAttr("readonly");
					}
				});
			}
		}
	});

})(jQuery);
</script>