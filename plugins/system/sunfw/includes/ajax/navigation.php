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
 * Handle Ajax requests from mega menu pane.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxNavigation extends SunFwAjax
{
	/**
	 * Get mega menu data from database.
	 *
	 * @return  void
	 */
	public function getAction() {
		// Get site URL.
		$root = JUri::root(true);

		/**
		 * Get mega menu's items.
		 */
		$items = array(
			'image'           => '',
			'sub-menu'        => '',
			'module-position' => '',
			'joomla-module'   => '',
			'custom-html'     => '',
		);

		// Get path to mega menu item's setting files.
		$items = SunFwHelper::findTemplateAdminJsonSettings(
			JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/mega-menu/settings/items'
		);

		// Allow 3rd-party to add their own items into styles editor.
		$items = array_merge( $items, JEventDispatcher::getInstance()->trigger('SunFwGetMegaMenuItems') );

		/**
		 * Get all Joomla menus.
		 */
		$menus = array();

		foreach ( SunFwHelper::getAllAvailableMenus(true) as $menu )
		{
			$menus[$menu->value] = $menu;
		}

		// Allow 3rd-party to add their own menu-a-like items into mega menu.
		$menus = array_merge( $menus, JEventDispatcher::getInstance()->trigger('SunFwGetMegaMenuMenus') );

		/**
		 * Get custom input components.
		 */
		$inputs = array();
		$path   = JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/mega-menu/inputs';

		foreach (glob("{$path}/*.js") as $input)
		{
			$inputs[substr(basename($input), 0, -3)] = $root . str_replace(JPATH_ROOT, '', $input);
		}

		// Allow 3rd-party to add their own custom inputs into mega menu.
		$inputs = array_merge( $inputs, JEventDispatcher::getInstance()->trigger('SunFwGetMegaMenuInputs') );

		/**
		 * Synchronize color values for editing.
		 */
		$style = SunFwHelper::getSunFwStyle($this->styleID);
		$style = SunFwHelper::synchronizeColorValues($this->styleID, $style->mega_menu_data, $this->templateName, true);

		$this->setResponse(
			array(
				'data'     => $style,
				'grid'      => 12,
				'items'    => $items,
				'menus'    => $menus,
				'inputs'   => $inputs,
				'settings' => SunFwHelper::findTemplateAdminJsonSettings(
					JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/mega-menu/settings',
					'root.json',
					true
				)
			)
		);
	}

	/**
	 * Save mega menu data to database.
	 *
	 * @throws  Exception
	 */
	public function saveAction()
	{
		// Prepare input data.
		$data = $this->input->get( 'data', '', 'raw' );

		if ( empty( $data ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Prepare values for color related options.
		$data = SunFwHelper::synchronizeColorValues($this->styleID, $data, $this->templateName);

		// Build query to save mega menu data.
		$data  = json_encode( $data );
		$style = SunFwHelper::getSunFwStyle( $this->styleID );
		$query = $this->dbo->getQuery( true );

		if ( $style )
		{
			$query
				->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->set( $this->dbo->quoteName( 'mega_menu_data' ) . '=' . $this->dbo->quote( $data ) )
				->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
				->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
		}
		else
		{
			$columns = array( 'style_id', 'mega_menu_data', 'template' );
			$values  = array( intval( $this->styleID ), $this->dbo->quote( $data ), $this->dbo->quote( $this->templateName ) );

			$query
				->insert( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->columns( $this->dbo->quoteName( $columns ) )
				->values( implode( ',', $values ) );
		}

		// Execute query to save layout builder data.
		try
		{
			$this->dbo->setQuery( $query );

			if ( ! $this->dbo->execute() )
			{
				throw new Exception( $this->dbo->getErrorMsg() );
			}
		}
		catch ( Exception $e )
		{
			throw $e;
		}

		$this->setResponse( array( 'message' => JText::_( 'SUNFW_MEGA_MENU_SAVED_SUCCESSFULLY' ) ) );
	}
}
