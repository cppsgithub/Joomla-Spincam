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

// Get template info.
$templateInfo = SunFwRecognization::detect(SunFwAdmin::getInstance()->template);

// Get template manifest.
$templateManifest = SunFwHelper::getManifest($templateInfo->template);

// Generate template link at JSN server.
$templateLink = sprintf(SUNFW_TEMPLATE_URL, $templateInfo->name);
?>
<div class="sunfw-about-page">
	<div class="row">
		<div class="col-sm-6 col-md-6">
			<h2><?php echo JText::_('SUNFW_FRAMEWORK'); ?></h2>
			<div class="thumbnail">
				<a href="http://www.joomlashine.com/joomla-templates/jsn-sunframework.html" target="_blank" rel="noopener noreferrer">
					<img src="<?php echo JURI::root(true); ?>/plugins/system/sunfw/assets/images/sunfw_preview.png">
				</a>
				<div class="caption">
					<h3><a href="http://www.joomlashine.com/joomla-templates/jsn-sunframework.html" target="_blank" rel="noopener noreferrer">
						<?php echo JText::_('SUNFW_PLG_SUNFW_NAME'); ?>
					</a></h3>
					<div class="about-framework-update">
						<p class="version">
							<?php echo JText::_('SUNFW_VERSION'); ?>: <?php echo SUNFW_VERSION; ?>
							<span class="version-latest">(<?php echo JText::_('SUNFW_FRAMEWORK_LATEST_VERSION'); ?>)</span>
							<span class="update-availabel sunfwhide">(<a class="sunfw-update-link" id="sunfw-about-update-framework-link" data-target="framework" href="javascript:void(0)"><?php echo JText::_('SUNFW_FRAMEWORK_UPDATE_AVAILABEL'); ?></a>)</span>
						</p>
						<p class="about-released-date"><?php echo JText::_('SUNFW_TEMPLATE_RELEASED_DATE'); ?>: <?php echo date ('d M, Y',strtotime(SUNFW_RELEASED_DATE)); ?></p>
						<p class="about-copyright"><?php echo JText::_('SUNFW_COPYRIGHT'); ?>: <a href="http://joomlashine.com/">www.JoomlaShine.com</a></p>
					</div>
				</div>
			</div>
		</div>
		<div class="col-sm-6 col-md-6">
			<h2><?php echo JText::_('SUNFW_TEMPLATE'); ?></h2>
			<div class="thumbnail">
				<a href="<?php echo $templateLink; ?>"  target="_blank" rel="noopener noreferrer">
					<img src="<?php echo JUri::root(true); ?>/templates/<?php echo $templateInfo->template; ?>/template_preview.png">
				</a>
				<div class="caption">
					<h3><a href="<?php echo $templateLink; ?>"  target="_blank" rel="noopener noreferrer">
						<?php echo 'JSN ' . ucwords( str_replace('-', ' ', $templateInfo->name) ); ?> <?php echo $templateInfo->edition; ?>
					</a></h3>
					<div class="template-update about-template-update">
						<p class="version">
							<?php echo JText::_('SUNFW_VERSION'); ?>: <?php echo $templateInfo->version; ?>
							<span class="version-latest">(<?php echo JText::_('SUNFW_FRAMEWORK_LATEST_VERSION'); ?>)</span>
							<span class="update-availabel sunfwhide">(<a class="sunfw-update-link" id="sunfw-about-update-template-link" data-target="template" href="javascript:void(0)"><?php echo JText::_('SUNFW_FRAMEWORK_UPDATE_AVAILABEL'); ?></a>)</span>
						</p>
						<p class="about-released-date"><?php echo JText::_('SUNFW_TEMPLATE_RELEASED_DATE'); ?>: <?php echo date ('d M, Y',strtotime($templateManifest->creationDate)); ?></p>
						<p class="about-copyright"><?php echo JText::_('SUNFW_COPYRIGHT'); ?>: <a href="http://joomlashine.com/">www.JoomlaShine.com</a></p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
