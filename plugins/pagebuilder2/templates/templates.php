<?php
/**
 * @version    $Id$
 * @package    JSN_PageBuilder2
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
 * JSN PageBuilder2 extension plugin.
 *
 * @package  JSN_PageBuilder2
 * @since    1.0.0
 */
class PlgPageBuilder2Templates extends JPlugin
{
	function getElementList() {
		return array(
			'name' => 'templates',
			'title' => 'Addons',
		);
	}
}
