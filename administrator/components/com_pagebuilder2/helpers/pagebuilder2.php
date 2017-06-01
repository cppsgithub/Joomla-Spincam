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
 * PageBuilder2 component helper.
 *
 * @package  JSN_PageBuilder2
 * @since    1.0.0
 */
class JSNPageBuilder2Helper
{
	/**
	 * Add toolbar button.
	 *
	 * @return	void
	 */
	public static function addToolbarMenu()
	{
		// Get 5 most-recent items
		//$items = self::getItems(5);

		// Create a toolbar button that drop-down a sub-menu when clicked
		JSNMenuHelper::addEntry(
			'toolbar-menu', 'Menu', '', false, 'icon-list-view', 'toolbar'
		);

		// Declare 1st-level menu items
		/*JSNMenuHelper::addEntry(
			'items',
			'JSN_MENU_ITEMS',
			'',
			false,
			'administrator/components/com_pagebuilder2/assets/images/icons-16/icon-items.png',
			'toolbar-menu'
		);*/

		JSNMenuHelper::addEntry(
			'configuration',
			'JSN_MENU_CONFIGURATION_AND_MAINTENANCE',
			'index.php?option=com_pagebuilder2&view=configuration',
			false,
			'administrator/components/com_pagebuilder2/assets/images/icons-16/icon-configuration.png',
			'toolbar-menu'
		);

		JSNMenuHelper::addEntry(
			'about',
			'JSN_MENU_ABOUT',
			'index.php?option=com_pagebuilder2&view=about',
			false,
			'administrator/components/com_pagebuilder2/assets/images/icons-16/icon-about.png',
			'toolbar-menu'
		);

		// Declare 2nd-level menu items	for 'items' entry
		/*JSNMenuHelper::addEntry(
			'item-new', 'Create new item', 'index.php?option=com_pagebuilder2&view=item&layout=edit', false, '', 'toolbar-menu.items'
		);

		JSNMenuHelper::addSeparator('toolbar-menu.items');

		if ($items)
		{
			JSNMenuHelper::addEntry(
				'recent-items', 'Recent Items', '', false, '', 'toolbar-menu.items'
			);

			foreach ($items AS $item)
			{
				JSNMenuHelper::addEntry(
					'item-' . $item->item_id,
					$item->item_title,
					'index.php?option=com_pagebuilder2&view=item&layout=edit&item_id=' . $item->item_id,
					false,
					'',
					'toolbar-menu.items.recent-items'
				);
			}
		}

		JSNMenuHelper::addEntry(
			'all-items', 'All Items', 'index.php?option=com_pagebuilder2&view=items', false, '', 'toolbar-menu.items'
		);*/
	}

	/**
	 * Configure the linkbar
	 *
	 * @param   string  $vName  The name of the active view
	 *
	 * @return	void
	 */
	public static function addSubmenu($vName)
	{
		if (JFactory::getApplication()->input->getCmd('tmpl', null) == null)
		{
			// Get 5 most-recent items
			//$items = self::getItems(5);

			// Declare 1st-level menu items
			/*JSNMenuHelper::addEntry(
				'items',
				'JSN_MENU_ITEMS',
				'',
				false,
				'administrator/components/com_pagebuilder2/assets/images/icons-16/icon-items.png',
				'sub-menu'
			);*/

			JSNMenuHelper::addEntry(
				'configuration',
				'JSN_MENU_CONFIGURATION_AND_MAINTENANCE',
				'',
				false,
				'administrator/components/com_pagebuilder2/assets/images/icons-16/icon-configuration.png',
				'sub-menu'
			);

			JSNMenuHelper::addEntry(
				'about',
				'JSN_MENU_ABOUT',
				'index.php?option=com_pagebuilder2&view=about',
				$vName == 'about',
				'administrator/components/com_pagebuilder2/assets/images/icons-16/icon-about.png',
				'sub-menu'
			);

			// Declare 2nd-level menu items	for 'items' entry
			/*JSNMenuHelper::addEntry(
				'item-new', 'Create New Item', 'index.php?option=com_pagebuilder2&view=item&layout=edit', false, '', 'sub-menu.items'
			);

			JSNMenuHelper::addSeparator('sub-menu.items');

			if ($items)
			{
				JSNMenuHelper::addEntry(
					'recent-items', 'Recent Items', '', false, '', 'sub-menu.items'
				);

				foreach ($items AS $item)
				{
					JSNMenuHelper::addEntry(
						'item-' . $item->item_id,
						$item->item_title,
						'index.php?option=com_pagebuilder2&view=item&layout=edit&item_id=' . $item->item_id,
						false,
						'',
						'sub-menu.items.recent-items'
					);
				}
			}

			JSNMenuHelper::addEntry(
				'all-items', 'All Items', 'index.php?option=com_pagebuilder2&view=items', false, '', 'sub-menu.items'
			);*/

			// Declare 2nd-level menu items	for 'configuration' entry
			JSNMenuHelper::addEntry(
				'global-params', 'Global Parameters', 'index.php?option=com_pagebuilder2&view=configuration&s=configuration&g=configs', false, '', 'sub-menu.configuration'
			);

			JSNMenuHelper::addEntry(
				'messages', 'Messages', 'index.php?option=com_pagebuilder2&view=configuration&s=configuration&g=msgs', false, '', 'sub-menu.configuration'
			);

			JSNMenuHelper::addEntry(
				'languages', 'Languages', 'index.php?option=com_pagebuilder2&view=configuration&s=configuration&g=langs', false, '', 'sub-menu.configuration'
			);
			// Render the sub-menu
			JSNMenuHelper::render('sub-menu');
		}
	}

	/**
	 * Add assets
	 *
	 * @return	void
	 */
	public static function addAssets()
	{
		// Load common assets
		! class_exists('JSNBaseHelper') OR JSNBaseHelper::loadAssets();

		// Load proprietary assets
		if (class_exists('JSNHtmlAsset'))
		{
			JSNHtmlAsset::addStyle(JURI::root(true) . '/administrator/components/com_pagebuilder2/assets/css/pagebuilder2.css');
		}
		else
		{
			$doc = JFactory::getDocument();
			$doc->addStyleSheet(JURI::root(true) . '/administrator/components/com_pagebuilder2/assets/css/pagebuilder2.css');
		}
	}

	/**
	 * Get options forms
	 *
	 * @return object list
	 */
	public static function getOptionItems()
	{
		$db	= JFactory::getDbo();
		$q	= $db->getQuery(true);

		$q->select('item_id As value, item_title As text');
		$q->from('#__jsn_pagebuilder2_items');
		$q->order('item_title');

		$db->setQuery($q);

		try
		{
			$forms = $db->loadObjectList();
		}
		catch (Exception $e)
		{
			throw $e;
		}

		return $forms;
	}

	/**
	 * Get module info
	 *
	 * @return type
	 */
	public static function getModuleInfo()
	{
		$db	= JFactory::getDbo();
		$q	= $db->getQuery(true);

		$q->select('*');
		$q->from('#__extensions');
		$q->where('element=\'mod_uniform\' AND type=\'module\'');

		$db->setQuery($q);

		try
		{
			$result = $db->loadObject();
		}
		catch (Exception $e)
		{
			throw $e;
		}

		return $result;
	}

	/**
	 * get component info
	 *
	 * @return type
	 */
	public static function getComponentInfo()
	{
		$db	= JFactory::getDbo();
		$q	= $db->getQuery(true);

		$q->select('*');
		$q->from('#__extensions');
		$q->where('element=\'com_uniform\' AND type=\'component\'');

		$db->setQuery($q);

		try
		{
			$result = $db->loadObject();
		}
		catch (Exception $e)
		{
			throw $e;
		}

		return $result;
	}

	/**
	 * Get options Menus
	 *
	 * @return object list
	 */
	public static function getOptionMenus()
	{
		$db	= JFactory::getDbo();
		$q	= $db->getQuery(true);

		$q->select('menutype As value, title As text');
		$q->from('#__menu_types');
		$q->order('title');

		$db->setQuery($q);

		try
		{
			$menus = $db->loadObjectList();
		}
		catch (Exception $e)
		{
			throw $e;
		}

		return $menus;
	}

	/**
	 * Get data forms
	 *
	 * @param   integer  $limit  Results limitation.
	 *
	 * @return  object
	 */
	public static function getItems($limit = 0)
	{
		$db	= JFactory::getDbo();
		$q	= $db->getQuery(true);

		$q->select('*');
		$q->from('#__jsn_pagebuilder2_items');
		$q->order("item_id DESC");

		if ( ! $limit )
		{
			$db->setQuery($q);
		}
		else
		{
			$db->setQuery($q, 0, $limit);
		}

		try
		{
			$forms = $db->loadObjectList();
		}
		catch (Exception $e)
		{
			throw $e;
		}

		return $forms;
	}
	
    public static function getDependentExtensions()
	{
        $indentifiedNames = array();
        $indentifiedNames[JSNUtilsText::getConstant('IDENTIFIED_NAME', 'framework')] = JSNUtilsText::getConstant('VERSION', 'framework');
        $indentifiedNames[JSN_PAGEBUILDER2_IDENTIFIED_NAME] = JSN_PAGEBUILDER2_VERSION;
        return $indentifiedNames;
    }	
}
