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

/**
 * Handle Ajax requests from about pane.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxAbout extends SunFwAjax
{
	public function getAction() {
		// Get root URL.
		$root = JUri::root(true);

		// Get template manifest.
		$templateManifest = SunFwHelper::getManifest($this->templateName);

		$this->setResponse( array(
			'frameworkThumb' => "{$root}/plugins/system/sunfw/assets/images/sunfw_preview.png",
			'frameworkRelease' => date( 'd M, Y',strtotime(SUNFW_RELEASED_DATE) ),
			'templateThumb' => "{$root}/templates/{$this->templateName}/template_preview.png",
			'templateRelease' => date( 'd M, Y',strtotime($templateManifest->creationDate) )
		) );
	}
}
