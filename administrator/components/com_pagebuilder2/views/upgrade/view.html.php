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
 * Upgrade view.
 *
 * @package  JSN_PageBuilder2
 * @since    1.0.0
 */
class JSNPageBuilder2ViewUpgrade extends JSNUpgradeView
{
	/**
	 * Method for display page.
	 *
	 * @param   boolean  $tpl  The name of the template file to parse; automatically searches through the template paths.
	 *
	 * @return  mixed  A string if successful, otherwise an Exception object.
	 */
	function display($tpl = null)
	{
		// Set the toolbar
		JToolBarHelper::title(JText::_('JSN_PAGEBUILDER2_UPGRADE_PRODUCT'));

		// Add assets
		JSNPageBuilder2Helper::addAssets();

		// Display the template
		parent::display($tpl);
	}
}
