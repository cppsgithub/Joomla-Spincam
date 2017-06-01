<?php
/**
 * @package         Sliders
 * @version         7.1.1
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

use RegularLabs\Sliders\Plugin;

/**
 * System Plugin that places a Sliders code block into the text
 */
class PlgSystemSliders extends Plugin
{
	public $_alias       = 'sliders';
	public $_title       = 'SLIDERS';
	public $_lang_prefix = 'SLD';

	public $_has_tags = true;
}
