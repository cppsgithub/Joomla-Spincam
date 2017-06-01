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
$btnFontStyleClass= "btn-sunfw-font-style-" . uniqid();
$containerFontStyleClass= "container-sunfw-font-style-" . uniqid();
?>
<script type="text/javascript">
	(function($) {
		$(document).ready(function() {
			var btnFontStyleClass = $(".<?php echo $btnFontStyleClass; ?>");
			var containerFontStyleClass = $(".<?php echo $containerFontStyleClass; ?>");
			var inputID = $("#<?php echo $this->id; ?>");

			containerFontStyleClass.find('button[data-font-style="<?php echo $this->value; ?>"]').addClass('active');

			inputID.on('change', function (e) {
				btnFontStyleClass.removeClass('active');
				containerFontStyleClass.find('button[data-font-style="'+ $(this).val() + '"]').addClass('active');
			});

			btnFontStyleClass.on('click', function (e) {
				btnFontStyleClass.removeClass('active');
				var dataInptID = $(this).attr('data-input-id');
				var dataFontStyle = $(this).attr('data-font-style');
				$('#' + dataInptID).val(dataFontStyle);
				$(this).addClass('active');
			});
		});
	})(jQuery);
</script>

<div aria-label="Justified button group" role="group" class="btn-group <?php echo $containerFontStyleClass; ?>">
	<button type="button" class="btn btn-default <?php echo $btnFontStyleClass; ?>" data-input-id="<?php echo $this->id; ?>" data-font-style="bold" style="font-weight: bold;">B</button>
	<button type="button" class="btn btn-default <?php echo $btnFontStyleClass; ?>" data-input-id="<?php echo $this->id; ?>" data-font-style="underline" style="text-decoration: underline;">U</button>
	<button type="button" class="btn btn-default <?php echo $btnFontStyleClass; ?>" data-input-id="<?php echo $this->id; ?>" data-font-style="italic" style="font-style: italic;">I</button>
	<input type="text" name="<?php echo $this->name; ?>" id="<?php echo $this->id; ?>" value="<?php echo $this->value; ?>" class="<?php echo $this->element['class']; ?> sunfwfontstyle"/>
</div>