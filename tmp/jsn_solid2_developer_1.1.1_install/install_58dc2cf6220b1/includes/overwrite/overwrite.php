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
 * Class that register overrides for some built-in classes of Joomla.
 */
class SunFwOverwrite
{
	/**
	 * initialize
	 */
	public static function initialize()
	{
		if ( JFactory::getApplication()->isSite() )
		{
			// Override the built-in JViewLegacy class of Joomla.
			JLoader::register( 'JViewLegacy', SUNFW_PATH_INCLUDES . '/overwrite/j3x/libraries/legacy/view/legacy.php' );

			// Override the built-in JModuleHelper class of Joomla.
			JLoader::register ( 'JModuleHelper', SUNFW_PATH_INCLUDES . '/overwrite/j3x/libraries/cms/module/helper.php' );

			// Override the built-in JLayoutFile class of Joomla.
			JLoader::register( 'JLayoutFile', SUNFW_PATH_INCLUDES . '/overwrite/j3x/libraries/cms/layout/file.php' );

			// If SH404Sef is not installed, load pagination template override.
			if ( ! SunFwUltils::checkSH404SEF() )
			{
				// Override the built-in JPagination class of Joomla.
				JLoader::register( 'JPagination', SUNFW_PATH_INCLUDES . '/overwrite/j3x/libraries/cms/pagination/pagination.php' );
			}

			// Override the built-in VmView class of Virtue Mart extension.
			JLoader::register( 'VmView', SUNFW_PATH_INCLUDES . '/overwrite/j3x/components/com_virtuemart/helpers/vmview.php' );
		}
	}
}
