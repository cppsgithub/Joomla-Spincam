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
 * General Module class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */

class SunFwModule
{
	public function __construct ()
	{

	}

	/**
	 * render Module
	 *
	 * @return string
	 */
	public static function render($mID)
	{
		$app 		= JFactory::getApplication();
		$Itemid		= $app->input->getInt('Itemid');
		$lang 		= JFactory::getLanguage()->getTag();
		$user 		= JFactory::getUser();
		$groups 	= implode(',', $user->getAuthorisedViewLevels());
		$clientId 	= (int) $app->getClientId();
		$date 		= JFactory::getDate();
		$now 		= $date->toSql();

		$document = JFactory::getDocument();
		$renderer = $document->loadRenderer('module');

		$db			= JFactory::getDbo();
		$nullDate 	= $db->getNullDate();

		$query = $db->getQuery(true);
		$query->clear();
		$query->select('m.id, m.title, m.module, m.position, m.ordering, m.content, m.showtitle, m.params, m.access');
		$query->from('#__modules AS m');
		$query->join('LEFT', '#__modules_menu AS mm ON mm.moduleid = m.id');
		$query->where('m.published = 1');
		$query->join('LEFT', '#__extensions AS e ON e.element = m.module AND e.client_id = m.client_id');
		$query->where('e.enabled = 1');
		$query->where('(m.publish_up = ' . $db->quote($nullDate) . ' OR m.publish_up <= ' . $db->quote($now) . ')');
		$query->where('(m.publish_down = ' . $db->quote($nullDate) . ' OR m.publish_down >= ' . $db->quote($now) . ')');
		$query->where('m.id=' . (int) $mID . ' AND m.client_id= ' . $clientId);
		$query->where('m.access IN (' . $groups . ')');
		$query->where('(mm.menuid = ' . (int) $Itemid . ' OR mm.menuid <= 0)');
		// Filter by language
		if ($app->isSite() && $app->getLanguageFilter())
		{
			$query->where('m.language IN (' . $db->quote($lang) . ',' . $db->quote('*') . ')');
		}

		$db->setQuery($query);

		try
		{
			$module = $db->loadObject();
		}
		catch (RuntimeException $e)
		{
			return '';
		}


		if (!count($module))
		{
			return '';
		}

		$module->user 	= '';
		$title			= $module->title;
		$content 		= $module->content;
		$id 			= $module->id;

		if (!is_object($module))
		{
			if (is_null($content))
			{
				return '';
			}
			else
			{
				$tmp = $module;
				$module = new stdClass;
				$module->params = null;
				$module->module = $tmp;
				$module->id = 0;
				$module->user = 0;
			}
		}

		if (!is_null($content))
		{
			$module->content = $content;
		}

		$params = new JRegistry;
		$params->loadString($module->params);
		$module->params = $params;
		$moduleclassSfx = $module->params->get('moduleclass_sfx', '');
		$header_class = $module->params->get('header_class', '');
		$icon 			= '';

		if (preg_match('/^(.+)?(fa fa-[^\s]+)(.+)?$/', $header_class, $match))
		{
			$header_class = $match[1] . ' ' . $match[3];
			$icon .= $match[2];
		}

		$html = '<div class="modulecontainer ' . trim($moduleclassSfx) . '">';


		$moduleHTML = $renderer->render($module, $params, $content);

		if (trim($moduleHTML) == "")
		{
			$html .= '<div class="alert alert-block">' . JText::sprintf('SUNFW_MODULE_HAS_NO_CONTENT', $module->title) . '</div>';
		}
		else
		{
			if ((int) $module->showtitle && $params->get('style', '0') == '0')
			{
				$html .= '<h3 class="module-title '. $header_class .'">' ;
				if ($icon != '')
				{
					$html .= '<i class="'. $icon .'"></i>';
				}
				$html .= $title . '</h3>';
			}
			$html .= $moduleHTML;
		}
		 $html .= '</div>';
		return $html;
	}
}