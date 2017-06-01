<?php
/**
 * @package         Tabs
 * @version         7.0.10
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2017 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

if (!is_file(__DIR__ . '/vendor/autoload.php'))
{
	return;
}

require_once __DIR__ . '/vendor/autoload.php';

use RegularLabs\Tabs\Plugin;

/**
 * System Plugin that places a Tabs code block into the text
 */
class PlgSystemTabs extends Plugin
{
	public $_alias       = 'tabs';
	public $_title       = 'TABS';
	public $_lang_prefix = 'TAB';

	public $_has_tags = true;
}

