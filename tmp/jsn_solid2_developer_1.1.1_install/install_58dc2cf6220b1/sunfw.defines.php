<?php
/**
 * @version     $Id$
 * @package     JSNExtension
 * @subpackage  TPLFRAMEWORK2
 * @author      JoomlaShine Team <support@joomlashine.com>
 * @copyright   Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license     GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// Define base constants for the framework
define( 'SUNFW_PATH', dirname( __FILE__ ) );

define('SUNFW_PATH_INCLUDES', SUNFW_PATH . '/includes');

define( 'SUNFW_ID', 'tpl_sunframework' );
define( 'SUNFW_VERSION', '1.2.0' );
define( 'SUNFW_RELEASED_DATE', '03/27/2017' );

// Define remote URL for communicating with JoomlaShine server
define( 'SUNFW_LIGHTCART_URL', 'https://www.joomlashine.com/index.php?option=com_lightcart' );
define( 'SUNFW_VERSIONING_URL', 'https://www.joomlashine.com/versioning/product_version.php' );
define( 'SUNFW_UPGRADE_DETAILS', 'https://www.joomlashine.com/versioning/product_upgrade.php' );
define( 'SUNFW_POST_CLIENT_INFORMATION_URL', 'https://www.joomlashine.com/index.php?option=com_lightcart&view=clientinfo&task=clientinfo.getclientinfo');
define( 'SUNFW_CHECK_TOKEN_URL',	'https://www.joomlashine.com/index.php?option=com_lightcart&view=token&task=token.verify');
define( 'SUNFW_GET_TOKEN_URL',	'https://www.joomlashine.com/index.php?option=com_lightcart&view=token&task=token.gettoken');

define( 'SUNFW_DOCUMENTATION_URL', 'http://www.joomlashine.com/docs/' );
define( 'SUNFW_SUPPORT_URL', 'https://www.joomlashine.com/forum/' );
define( 'SUNFW_VIDEO_TUTORIALS', 'https://www.joomlashine.com/docs/joomla-templates/template-configuration-videos.html' );

define( 'SUNFW_TEMPLATE_URL', 'http://www.joomlashine.com/joomla-templates/jsn-%s.html' );
