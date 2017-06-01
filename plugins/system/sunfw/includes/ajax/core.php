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
 * Handle common Ajax requests from template admin.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxCore extends SunFwAjax
{
	/**
	 * Save data to database
	 *
	 * @throws Exception
	 */
	public function saveStyleSettingsAction()
	{
		$styleTitle = $this->input->getString( 'style_title', '' );
		$home = $this->input->getString( 'home', '' );

		if ( empty( $styleTitle ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		if ($home == '1')
		{
			$query = $this->dbo->getQuery( true );
			$query = $this->dbo->getQuery( true );
			$query
			->update( $this->dbo->quoteName( '#__template_styles' ) )
			->set( $this->dbo->quoteName( 'home' ) . '=' . $this->dbo->quote( 0 ) )
			->where( $this->dbo->quoteName( 'client_id' ) . '=' . intval( 0 ) );
			// Execute query to save advanced data.
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
		}

		$query = $this->dbo->getQuery( true );
		$query
			->update( $this->dbo->quoteName( '#__template_styles' ) )
			->set( $this->dbo->quoteName( 'title' ) . '=' . $this->dbo->quote( $styleTitle ) )
			->set( $this->dbo->quoteName( 'home' ) . '=' . $this->dbo->quote( $home ) )
			->where( $this->dbo->quoteName( 'id' ) . '=' . intval( $this->styleID ) )
			->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );

		// Execute query to save advanced data.
		try
		{
			$this->dbo->setQuery( $query );
			if ( ! $this->dbo->execute() )
			{
				throw new Exception( $this->dbo->getErrorMsg() );
			}

			$this->setResponse( array( 'message' => '' ) );
			return;
		}
		catch ( Exception $e )
		{
			throw $e;
		}
	}

	/**
	 * Save data to database
	 *
	 * @throws Exception
	 */
	public function saveAsCopyAction()
	{
		// Detect disabled extension
		$extension = JTable::getInstance('Extension');

		if ($extension->load(array('enabled' => 0, 'type' => 'template', 'element' => $this->templateName, 'client_id' => 0)))
		{
			throw new Exception(JText::_('SUNFW_ERROR_SAVE_DISABLED_TEMPLATE'));

		}

		// Load Table Style Core
 		$path 		= JPATH_ADMINISTRATOR  . '/components/com_templates/tables';
 		JTable::addIncludePath($path);
 		$styleTbl 	= JTable::getInstance('Style', 'TemplatesTable');
 		$styleTbl->load(0);

		$currentStyle = SunFwHelper::getTemplateStyle($this->styleID);

		if (!count($currentStyle))
		{
			throw new Exception(JText::_('SUNFW_ERROR_STYLE_IS_INVALID'));
		}

		$currentStyle->title 		=  $this->generateNewTitle(null, null, $currentStyle->title);
		$currentStyle 				= (array) $currentStyle;
		$currentStyle['id']     	= 0;
		$currentStyle['home']     	= 0;
		$currentStyle['assigned'] 	= '';

		if (!$styleTbl->bind($currentStyle))
		{
			throw new Exception($styleTbl->getError());
			return;
		}

		// Store the data.
		if (!$styleTbl->store())
		{
			throw new Exception($styleTbl->getError());
			return;
		}

		$currentSunFwStyle = SunFwHelper::getSunFwStyle($this->styleID);

		if (count($currentSunFwStyle))
		{
			$query = $this->dbo->getQuery( true );
			$columns  = array( 'style_id', 'layout_builder_data', 'appearance_data', 'system_data', 'mega_menu_data', 'cookie_law_data', 'template' );
			$values   = array( intval( $styleTbl->id ), $this->dbo->quote( $currentSunFwStyle->layout_builder_data ),
								$this->dbo->quote( $currentSunFwStyle->appearance_data ),  $this->dbo->quote( $currentSunFwStyle->system_data ),
								$this->dbo->quote( $currentSunFwStyle->mega_menu_data ), $this->dbo->quote( $currentSunFwStyle->cookie_law_data ), $this->dbo->quote( $this->templateName ));

			$query
			->insert( $this->dbo->quoteName( '#__sunfw_styles' ) )
			->columns( $this->dbo->quoteName( $columns ) )
			->values( implode( ',', $values ) );
			$this->dbo->setQuery( $query );
			$this->dbo->execute();
		}

		try
		{
			$sufwrender = new SunFwScssrender();
			$sufwrender->compile($styleTbl->id, $this->templateName);
			$sufwrender->compile($styleTbl->id, $this->templateName, "layout");
		}
		catch ( Exception $e )
		{
			//throw $e;
		}

		$this->setResponse( array( 'id' => $styleTbl->id ) );
		return;
	}

	/**
	 * Method to change the title.
	 *
	 * @param   integer  $category_id  The id of the category.
	 * @param   string   $alias        The alias.
	 * @param   string   $title        The title.
	 *
	 * @return  string  New title.
	 *
	 * @since   1.7.1
	 */
	protected function generateNewTitle($categoryId, $alias, $title)
	{
		$path = JPATH_ADMINISTRATOR  . '/components/com_templates/tables';
		JTable::addIncludePath($path);
		$table = JTable::getInstance('Style', 'TemplatesTable');

		while ($table->load(array('title' => $title)))
		{
			$title = \Joomla\String\StringHelper::increment($title);
		}

		return $title;
	}
}
