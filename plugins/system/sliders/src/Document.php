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

namespace RegularLabs\Sliders;

defined('_JEXEC') or die;

use JFactory;
use JHtml;
use RegularLabs\Library\Document as RL_Document;

class Document
{
	public static function addHeadStuff()
	{
		// do not load scripts/styles on feeds or print pages
		if (RL_Document::isFeed() || JFactory::getApplication()->input->getInt('print', 0))
		{
			return;
		}

		$params = Params::get();

		if (!$params->load_bootstrap_framework && $params->load_jquery)
		{
			JHtml::_('jquery.framework');
		}

		if ($params->load_bootstrap_framework)
		{
			JHtml::_('bootstrap.framework');
		}


		$script = '
			var rl_sliders_use_hash = ' . (int) $params->use_hash . ';
			var rl_sliders_reload_iframes = ' . (int) $params->reload_iframes . ';
			var rl_sliders_init_timeout = ' . (int) $params->init_timeout . ';
		';
		RL_Document::scriptDeclaration($script, 'Sliders');

		RL_Document::script('sliders/script.min.js', ($params->media_versioning ? '7.1.1' : ''));

		if ($params->load_stylesheet)
		{
			RL_Document::style('sliders/style.min.css', ($params->media_versioning ? '7.1.1' : ''));
		}

	}

	public static function removeHeadStuff(&$html)
	{
		// Don't remove if sliders id is found
		if (strpos($html, 'id="set-rl_sliders') !== false)
		{
			return;
		}

		// remove style and script if no items are found
		RL_Document::removeScriptsStyles($html, 'Sliders');
	}
}
