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

/**
 * Installer class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class PlgSystemSunFwInstallerScript
{
	/**
	 * Implement postflight hook.
	 *
	 * @param   string  $route  Route type: install, update or uninstall.
	 * @param   object  $_this  The installer object.
	 *
	 * @return  boolean
	 */
	public function postflight($route, $_this)
	{
		// Get a database connector object.
		$db = JFactory::getDbo();

		try
		{
			// Enable plugin by default.
			$sql = $db->getQuery(true);

			$sql->update('#__extensions')
                ->set(array('enabled = 1', 'protected = 1', 'ordering = 9999'))
				->where("element = 'sunfw'")
				->where("type = 'plugin'")
				->where("folder = 'system'");

			$db->setQuery($sql)->execute();
		}
		catch (Exception $e)
		{
			throw $e;
		}
	}
}
