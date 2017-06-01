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
?>
<p><?php echo JText::_('SUNFW_AUTO_UPDATE_FRAMEWORK_INSTALLATION_DESC'); ?></p>

<ul id="sunfw-update-processes">
	<li id="sunfw-download-package" class="sunfw-loading">
		<span class="sunfw-title"><?php echo JText::_('SUNFW_AUTO_UPDATE_FRAMEWORK_DOWNLOAD_PACKAGE'); ?> <i class="sunfw-icon16 sunfw-icon-status"></i></span>
		<span class="sunfw-status"></span>
	</li>
	<li id="sunfw-install-update" class="sunfw-loading sunfwhide">
		<span class="sunfw-title"><?php echo JText::_('SUNFW_AUTO_UPDATE_FRAMEWORK_INSTALL'); ?> <i class="sunfw-icon16 sunfw-icon-status"></i></span>
		<span class="sunfw-status"></span>
	</li>
</ul>

<div id="sunfw-success-message" class="sunfwhide">
	<h3><?php echo JText::_('SUNFW_AUTO_UPDATE_FRAMEWORK_INSTALL_SUCCESS'); ?></h3>
	<p><?php echo JText::_('SUNFW_AUTO_UPDATE_FRAMEWORK_INSTALL_SUCCESS_DESC'); ?></p>
</div>

<hr />
<div class="sunfw-toolbar">
	<button id="btn-finish-install" class="btn btn-primary sunfwhide"><?php echo JText::_('SUNFW_FINISH'); ?></button>
</div>