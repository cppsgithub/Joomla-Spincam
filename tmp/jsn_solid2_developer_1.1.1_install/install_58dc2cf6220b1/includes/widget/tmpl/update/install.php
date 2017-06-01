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

// No direct access to this file
defined('_JEXEC') or die('Restricted access');
$token = JSession::getFormToken();

?>
<p><?php echo JText::_('SUNFW_AUTO_UPDATE_INSTALLATION_DESC') ?></p>

<form id="sunfw-update-install">
	<ul id="sunfw-update-processes">
		<li id="sunfw-download-package" class="sunfw-loading sunfwhide">
			<span class="sunfw-title"><?php echo JText::_('SUNFW_AUTO_UPDATE_DOWNLOAD_PACKAGE') ?> <i class="sunfw-icon16 sunfw-icon-status"></i></span>
			<span class="sunfw-status"></span>
		</li>
		<li id="sunfw-backup-modified-files" class="sunfw-loading sunfwhide">
			<span class="sunfw-title"><?php echo JText::_('SUNFW_AUTO_UPDATE_CREATE_LIST_UPDATED') ?> <i class="sunfw-icon16 sunfw-icon-status"></i></span>
			<span class="sunfw-status"></span>
			<p id="sunfw-download-backup-of-modified-files" class="sunfwhide">
				<?php echo JText::_('SUNFW_AUTO_UPDATE_FOUND_MODIFIED_FILE_BEING_UPDATED'); ?>
				<a href="<?php echo JRoute::_('index.php?sunfwwidget=integrity&action=download&type=update&style_id=' . $styleID. '&' . $token . '=1&template_name=' . $template['name'] . '&author=joomlashine'); ?>" class="btn btn-xs btn-danger"><?php echo JText::_('SUNFW_AUTO_UPDATE_DOWNLOAD_MODIFIED_FILES'); ?></a>
			</p>
		</li>
		<li id="sunfw-download-framework" class="sunfw-loading sunfwhide">
			<span class="sunfw-title"><?php echo JText::_('SUNFW_AUTO_UPDATE_FRAMEWORK_DOWNLOAD_PACKAGE') ?> <i class="sunfw-icon16 sunfw-icon-status"></i></span>
			<span class="sunfw-status"></span>
		</li>
		<li id="sunfw-install-framework" class="sunfw-loading sunfwhide">
			<span class="sunfw-title"><?php echo JText::_('SUNFW_AUTO_UPDATE_FRAMEWORK_INSTALL') ?> <i class="sunfw-icon16 sunfw-icon-status"></i></span>
			<span class="sunfw-status"></span>
		</li>
		<li id="sunfw-install-update" class="sunfw-loading sunfwhide">
			<span class="sunfw-title"><?php echo JText::_('SUNFW_AUTO_UPDATE_INSTALL') ?> <i class="sunfw-icon16 sunfw-icon-status"></i></span>
			<span class="sunfw-status"></span>
		</li>
	</ul>

	<div id="sunfw-success-message" class="sunfwhide">
		<h3><?php echo JText::_('SUNFW_AUTO_UPDATE_INSTALL_SUCCESS'); ?></h3>
		<p><?php echo JText::sprintf('SUNFW_AUTO_UPDATE_INSTALL_SUCCESS_DESC', $template['realName']); ?></p>

		<div id="sunfw-backup-information" class="alert alert-warning sunfwhide">
			<span class="label label-danger"><?php echo JText::_('SUNFW_IMPORTANT_INFORMATION'); ?></span>
			<p>
				<?php echo JText::_('SUNFW_AUTO_UPDATE_INSTALL_DOWNLOAD_BACKUP'); ?>
				<a href="<?php echo JRoute::_('index.php?sunfwwidget=integrity&action=download&type=update&style_id=' . $styleID. '&' . $token . '=1&template_name=' . $template['name'] . '&author=joomlashine'); ?>" class="btn btn-xs btn-danger"><?php echo JText::_('SUNFW_AUTO_UPDATE_DOWNLOAD_MODIFIED_FILES'); ?></a>
			</p>
		</div>
	</div>

	<div class="sunfw-toolbar sunfwhide">
		<hr />

		<div id="sunfw-put-update-on-hold" class="sunfwhide">
			<button id="btn-continue-install" class="btn btn-primary"><?php echo JText::_('SUNFW_CONTINUE') ?></button>
			&nbsp;
			<button id="btn-cancel-install" class="btn"><?php echo JText::_('SUNFW_CANCEL') ?></button>
		</div>
		<button id="btn-finish-install" class="btn btn-primary sunfwhide"><?php echo JText::_('SUNFW_FINISH') ?></button>
	</div>
</form>
