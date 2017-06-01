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
$isValidToUpdate 	= false;
$sunfwParams 		= SunFwHelper::getExtensionParams( 'plugin', 'sunfw', 'system' );
?>
<?php if (SunFwHelper::isDisabledOpenSSL()) { ?>
	<div class="alert alert-warning">
		<?php echo JText::_('SUNFW_ENABLE_OPENSSL_EXTENSION'); ?>
	</div>
<?php } else { ?>
	<p><?php echo JText::_('SUNFW_AUTO_UPDATE_AUTH_DESC') ?></p>
	<div class="alert alert-warning">
		<span class="label label-danger"><?php echo JText::_('SUNFW_IMPORTANT_INFORMATION'); ?></span>
		<ul>
			<li><?php echo JText::_('SUNFW_AUTO_UPDATE_AUTH_NOTE_01'); ?></li>
			<li><?php echo JText::_('SUNFW_AUTO_UPDATE_AUTH_NOTE_02'); ?></li>
		</ul>
	</div>
	<form id="jsn-confirm-update" class="form-inline">
		<?php
		if ($authenticate)
		{
			if (count($sunfwParams))
			{
				if (isset($sunfwParams['token']) && $sunfwParams['token'] != '')
				{
					$isValidToUpdate = true;
				}
			}

			if (!$isValidToUpdate)
			{
				echo JText::_('SUNFW_MISSING_TOKEN');
			}
		}
		else
		{
			$isValidToUpdate = true;
		}
		?>
		<?php if ($isValidToUpdate) { ?>
		<div class="sunfw-toolbar">
			<button id="btn-confirm-update" class="btn btn-primary" type="button"><?php echo JText::_('SUNFW_UPDATE'); ?></button>
			<button id="btn-cancel-update" class="btn" type="button"><?php echo JText::_('SUNFW_CANCEL'); ?></button>
		</div>
		<?php } else { ?>
		<div class="sunfw-toolbar">
			<button id="btn-cancel-update-open-token-page" class="btn btn-primary" type="button"><?php echo JText::_('SUNFW_SET_TOKEN_KEY'); ?></button>
			<button id="btn-cancel-update" class="btn" type="button"><?php echo JText::_('SUNFW_CANCEL'); ?></button>
		</div>
		<?php } ?>
		<?php echo JHtml::_('form.token'); ?>
	</form>
<?php } ?>