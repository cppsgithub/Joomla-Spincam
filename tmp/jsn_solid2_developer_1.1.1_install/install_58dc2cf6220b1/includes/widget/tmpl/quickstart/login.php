<?php
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2016 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');
?>
<?php if (SunFWHelper::isDisabledOpenssl()) { ?>
	<div class="alert alert-warning">
		<?php echo JText::_('SUNFW_TEMPLATE_ENABLE_OPENSSL_EXTENSION'); ?>
	</div>
<?php } else { ?>
	<form id="sunfw-quickstart-login">
		<h2><?php echo JText::_('SUNFW_TEMPLATE_AUTO_UPGRADE_LOGIN_TITLE'); ?></h2>
		<p><?php echo JText::_('SUNFW_TEMPLATE_AUTO_UPGRADE_LOGIN_DESC'); ?></p>

		<div class="form-inline">
			<label for="username"><?php echo JText::_('SUNFW_USERNAME'); ?>:</label>
			<input type="text" name="username" />

			<label for="password"><?php echo JText::_('SUNFW_PASSWORD'); ?>:</label>
			<input type="password" name="password" />
		</div>
		<!-- Error message after submit login information -->
		<p id="sunfw-login-error" class="alert alert-danger sunfwhide"></p>
		<hr />

		<div class="sunfw-toolbar">
			<button id="btn-login" class="btn btn-primary" type="button" disabled="disabled"><?php echo JText::_('SUNFW_TEMPLATE_DOWNLOAD_FILE'); ?></button>
		</div>
		<input type="hidden" name="quickstart_id" value="<?php echo $quickstartID; ?>"  />
		<?php echo JHtml::_('form.token'); ?>
	</form>
<?php } ?>