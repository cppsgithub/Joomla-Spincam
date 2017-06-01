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
 * Handle Widget requests from layout builder.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwWidgetModules extends SunFwWidgetBase
{

	public function listAction()
	{
		JSession::checkToken( 'get' ) or die( 'Invalid Token' );
		$this->session   	= JFactory::getSession();

		$state 		= $this->input->getCmd('state', '');
		$position 	= $this->input->getCmd('position', '');
		$module 	= $this->input->getCmd('module', '');
		$access 	= $this->input->getCmd('access', '');
		$language 	= $this->input->getCmd('language', '');
		$search 	= $this->input->getString('search', '');

		$this->session->set('filters.sunfw.widget.modules.list.state', $state);
		$this->session->set('filters.sunfw.widget.modules.list.position', $position);
		$this->session->set('filters.sunfw.widget.modules.list.module', $module);
		$this->session->set('filters.sunfw.widget.modules.list.access', $access);
		$this->session->set('filters.sunfw.widget.modules.list.language', $language);
		$this->session->set('filters.sunfw.widget.modules.list.search', $search);

		$this->modules	= $this->getModuleList();

		$this->render('list');
	}

	/**
	 * Get a list of modules positions Options
	 *
	 * @param   integer  $clientId       Client ID
	 * @param   boolean  $editPositions  Allow to edit the positions
	 *
	 * @return  array  A list of positions
	 */
	public function getModulePositionOptions($clientId = 0)
	{
		$query = $this->dbo->getQuery(true)
		->select('DISTINCT(position)')
		->from('#__modules')
		->where($this->dbo->quoteName('client_id') . ' = ' . (int) $clientId)
		->order('position');

		$this->dbo->setQuery($query);

		try
		{
			$positions = $this->dbo->loadColumn();
			$positions = is_array($positions) ? $positions : array();
		}
		catch (RuntimeException $e)
		{
			//JError::raiseWarning(500, $e->getMessage());
			return;
		}

		// Build the list
		$options = array();
		$options[] = JHtml::_('select.option', '', JText::_('SUNFW_SELECT_MODULE_POSITION'));

		foreach ($positions as $position)
		{
			if (!$position)
			{
				$options[] = JHtml::_('select.option', 'none', JText::_('SUNFW_MODULES_NONE'));
			}
			else
			{
				$options[] = JHtml::_('select.option', $position, $position);
			}
		}
		return $options;
	}

	/**
	 *
	 * @param unknown $selected
	 * @param unknown $name
	 * @param string $parameters
	 *
	 * Render Module Position ComboBox
	 */
	public function renderModulePositionComboBox($selected, $name, $parameters = '')
	{
		$positions = $this->getModulePositionOptions();
		return JHTML::_('select.genericlist', $positions, $name, $parameters, 'value', 'text', $selected);
	}

	/**
	 * Get a list of filter options for the state of a module.
	 *
	 * @return  array  An array of JHtmlOption elements.
	 */
	public function getModuleStateOptions()
	{
		// Build the filter options.
		$options   = array();
		$options[] = JHtml::_('select.option', '*', JText::_('SUNFW_ANY_STATUS'));
		$options[] = JHtml::_('select.option', '1', JText::_('JPUBLISHED'));
		$options[] = JHtml::_('select.option', '0', JText::_('JUNPUBLISHED'));
		$options[] = JHtml::_('select.option', '-2', JText::_('JTRASHED'));
		//$options[] = JHtml::_('select.option', '*', JText::_('JALL'));

		return $options;
	}

	/**
	 *
	 * @param unknown $selected
	 * @param unknown $name
	 * @param string $parameters
	 *
	 * Render Module State ComboBox
	 */
	public function renderModuleStateComboBox($selected, $name, $parameters = '')
	{
		$states = $this->getModuleStateOptions();
		return JHTML::_('select.genericlist', $states, $name, $parameters, 'value', 'text', $selected);
	}

	/**
	 * Get a list of the unique modules installed in the client application.
	 *
	 * @param   int  $clientId  The client id.
	 *
	 * @return  array  Array of unique modules
	 */
	public function getModuleTypeOptions($clientId = 0)
	{
		$query = $this->dbo->getQuery(true)
		->select('element AS value, name AS text')
		->from('#__extensions as e')
		->where('e.client_id = ' . (int) $clientId)
		->where('type = ' . $this->dbo->quote('module'))
		->join('LEFT', '#__modules as m ON m.module=e.element AND m.client_id=e.client_id')
		->where('m.module IS NOT NULL')
		->group('element,name');

		$this->dbo->setQuery($query);
		$modules = $this->dbo->loadObjectList();
		$lang = JFactory::getLanguage();

		foreach ($modules as $i => $module)
		{
			$extension = $module->value;
			$path = $clientId ? JPATH_ADMINISTRATOR : JPATH_SITE;
			$source = $path . "/modules/$extension";
			$lang->load("$extension.sys", $path, null, false, true)
			||	$lang->load("$extension.sys", $source, null, false, true);
			$modules[$i]->text = JText::_($module->text);
		}

		$modules = Joomla\Utilities\ArrayHelper::sortObjects($modules, 'text', 1, true, true);

		return $modules;
	}

	/**
	 *
	 * @param unknown $selected
	 * @param unknown $name
	 * @param string $parameters
	 *
	 * Render Module State ComboBox
	 */
	public function renderModuleTypeComboBox($selected, $name, $parameters = '')
	{
		$types		= array();
		$items 		= $this->getModuleTypeOptions();
		$types [] 	=  JHtml::_('select.option', '', JText::_('SUNFW_ANY_TYPE'));
		$types 		= array_merge($types, $items);

		return JHTML::_('select.genericlist', $types, $name, $parameters, 'value', 'text', $selected);
	}

	/**
	 * Get a list of access options
	 *
	 * @return  array  An array of JHtmlOption elements.
	 */
	public function getModuleAccessOptions()
	{
		$query = $this->dbo->getQuery(true)
		->select($this->dbo->quoteName('a.id', 'value') . ', ' . $this->dbo->quoteName('a.title', 'text'))
		->from($this->dbo->quoteName('#__viewlevels', 'a'))
		->group($this->dbo->quoteName(array('a.id', 'a.title', 'a.ordering')))
		->order($this->dbo->quoteName('a.ordering') . ' ASC')
		->order($this->dbo->quoteName('title') . ' ASC');

		// Get the options.
		$this->dbo->setQuery($query);
		$options = $this->dbo->loadObjectList();
		return $options;
	}

	/**
	 *
	 * @param unknown $selected
	 * @param unknown $name
	 * @param string $parameters
	 *
	 * Render Module Access ComboBox
	 */
	public function renderModuleAccessComboBox($selected, $name, $parameters = '')
	{
		$types		= array();
		$items 		= $this->getModuleAccessOptions();
		$types [] 	=  JHtml::_('select.option', '', JText::_('SUNFW_ANY_ACCESS'));
		$types 		= array_merge($types, $items);

		return JHTML::_('select.genericlist', $types, $name, $parameters, 'value', 'text', $selected);
	}

	/**
	 * Get a list of language options
	 *
	 * @return  array  An array of JHtmlOption elements.
	 */
	public function getModuleContentLanguage()
	{
		// Get the database object and a new query object.
		$query = $this->dbo->getQuery(true);

		// Build the query.
		$query->select('a.lang_code AS value, a.title AS text, a.title_native')
		->from('#__languages AS a')
		->where('a.published >= 0')
		->order('a.title');

		// Set the query and load the options.
		$this->dbo->setQuery($query);
		$item = $this->dbo->loadObjectList();

		//$tmp = new stdClass;
		//$tmp->value = '*';
		//$tmp->text = JText::_('JALL_LANGUAGE');
		$allOption = array();

		return array_merge($allOption, $item);
	}

	/**
	 *
	 * @param unknown $selected
	 * @param unknown $name
	 * @param string $parameters
	 *
	 * Render Module Content Language ComboBox
	 */
	public function renderModuleContentComboBox($selected, $name, $parameters = '')
	{
		$types		= array();
		$items 		= $this->getModuleContentLanguage();
		$types [] 	=  JHtml::_('select.option', '*', JText::_('SUNFW_ANY_LANGUAGE'));
		$types 		= array_merge($types, $items);
		return JHTML::_('select.genericlist', $types, $name, $parameters, 'value', 'text', $selected);
	}

	/**
	 * Get Module query
	 *
	 * @return string
	 */
	public function getModuleListQuery()
	{
		$this->session   	= JFactory::getSession();
		// Create a new query object.
		$query = $this->dbo->getQuery(true);

		// Select the required fields.
		$query->select('a.id, a.title, a.note, a.position, a.module, a.language, a.checked_out, a.checked_out_time, a.published AS published, e.enabled AS enabled, a.access, a.ordering, a.publish_up, a.publish_down');

		// From modules table.
		$query->from($this->dbo->quoteName('#__modules', 'a'));

		// Join over the language
		$query->select($this->dbo->quoteName('l.title', 'language_title'))
		->select($this->dbo->quoteName('l.image', 'language_image'))
		->join('LEFT', $this->dbo->quoteName('#__languages', 'l') . ' ON ' . $this->dbo->quoteName('l.lang_code') . ' = ' . $this->dbo->quoteName('a.language'));

		// Join over the users for the checked out user.
		$query->select($this->dbo->quoteName('uc.name', 'editor'))
		->join('LEFT', $this->dbo->quoteName('#__users', 'uc') . ' ON ' . $this->dbo->quoteName('uc.id') . ' = ' . $this->dbo->quoteName('a.checked_out'));

		// Join over the asset groups.
		$query->select($this->dbo->quoteName('ag.title', 'access_level'))
		->join('LEFT', $this->dbo->quoteName('#__viewlevels', 'ag') . ' ON ' . $this->dbo->quoteName('ag.id') . ' = ' . $this->dbo->quoteName('a.access'));

		// Join over the module menus
		$query->select('MIN(mm.menuid) AS pages')
		->join('LEFT', $this->dbo->quoteName('#__modules_menu', 'mm') . ' ON ' . $this->dbo->quoteName('mm.moduleid') . ' = ' . $this->dbo->quoteName('a.id'));

		// Join over the extensions
		$query->select($this->dbo->quoteName('e.name', 'name'))
		->join('LEFT', $this->dbo->quoteName('#__extensions', 'e') . ' ON ' . $this->dbo->quoteName('e.element') . ' = ' . $this->dbo->quoteName('a.module'));

		// Group (careful with PostgreSQL)
		$query->group(
				'a.id, a.title, a.note, a.position, a.module, a.language, a.checked_out, ' .
				'a.checked_out_time, a.published, a.access, a.ordering, l.title, l.image, uc.name, ag.title, e.name, ' .
				'l.lang_code, uc.id, ag.id, mm.moduleid, e.element, a.publish_up, a.publish_down, e.enabled'
				);

		// Filter by client.
		$clientId = 0;
		$query->where($this->dbo->quoteName('a.client_id') . ' = ' . (int) $clientId . ' AND ' . $this->dbo->quoteName('e.client_id') . ' = ' . (int) $clientId);

		// Filter by access level.
		if ($access = $this->session->get('filters.sunfw.widget.modules.list.access', ''))
		{
			$query->where($this->dbo->quoteName('a.access') . ' = ' . (int) $access);
		}

		// Filter by published state.
		$state = $this->session->get('filters.sunfw.widget.modules.list.state', '');
		if (is_numeric($state))
		{
			$query->where($this->dbo->quoteName('a.published') . ' = ' . (int) $state);
		}
		elseif ($state === '')
		{
			$query->where($this->dbo->quoteName('a.published') . ' IN (0, 1)');
		}

		// Filter by position.
		if ($position = $this->session->get('filters.sunfw.widget.modules.list.position', ''))
		{
			$query->where($this->dbo->quoteName('a.position') . ' = ' . $this->dbo->quote(($position === 'none') ? '' : $position));
		}

		// Filter by module.
		if ($module = $this->session->get('filters.sunfw.widget.modules.list.module', ''))
		{
			$query->where($this->dbo->quoteName('a.module') . ' = ' . $this->dbo->quote($module));
		}

		// Filter by search in title or note or id:.
		$search = $this->session->get('filters.sunfw.widget.modules.list.search', '');

		if (!empty($search))
		{
			if (stripos($search, 'id:') === 0)
			{
				$query->where($this->dbo->quoteName('a.id') . ' = ' . (int) substr($search, 3));
			}
			else
			{
				$search = $this->dbo->quote('%' . strtolower($search) . '%');
				$query->where('(LOWER(a.title) LIKE ' . $search . ' OR LOWER(a.note) LIKE ' . $search . ')');
			}
		}

		// Filter on the language.
		if ($language = $this->session->get('filters.sunfw.widget.modules.list.language', ''))
		{
			if ($language === 'current')
			{
				$query->where($this->dbo->quoteName('a.language') . ' IN (' . $this->dbo->quote(JFactory::getLanguage()->getTag()) . ',' . $this->dbo->quote('*') . ')');
			}
			else
			{
				$query->where($this->dbo->quoteName('a.language') . ' = ' . $this->dbo->quote($language));
			}
		}

		return $query;
	}

	/**
	 * Get Module list
	 *
	 * @return ObjectList
	 */
	public function getModuleList()
	{
		$strQuery = $this->getModuleListQuery();

		$this->dbo->setQuery($strQuery);
		return $this->dbo->loadObjectList();
	}
}
