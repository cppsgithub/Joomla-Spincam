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

// Get application object
$app = JFactory::getApplication();

// Get input object
$input = $app->input;

// Access check
if ( ! JFactory::getUser()->authorise('core.manage', $input->getCmd('option')))
{
	return JError::raiseWarning(404, JText::_('JERROR_ALERTNOAUTHOR'));
}

// Initialize common assets
require_once JPATH_COMPONENT_ADMINISTRATOR . '/bootstrap.php';

// Check if all dependency is installed
require_once JPATH_COMPONENT_ADMINISTRATOR . '/dependency.php';

// Register helper class
JLoader::register('JSNPageBuilder2Helper', JPATH_COMPONENT_ADMINISTRATOR . '/helpers/pagebuilder2.php');

if (strpos('installer + update + upgrade', $input->getCmd('view')) !== false OR JSNVersion::isJoomlaCompatible(JSN_PAGEBUILDER2_REQUIRED_JOOMLA_VER))
{
	// Get the appropriate controller
	$controller = JSNBaseController::getInstance('JSNPageBuilder2');

	// Perform the request task
	$controller->execute($input->getCmd('task'));

	// Redirect if set by the controller
	$controller->redirect();
}
