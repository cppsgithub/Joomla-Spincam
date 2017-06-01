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
 * Handle Ajax requests from menu builder.
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
		// Get style data.
		$style = SunFwHelper::getSunFwStyle( $this->styleID );

		if ( count( $style ) )
		{
			$this->setResponse( json_decode( $style->mega_menu_data ) );
		}
		else
		{
			$this->setResponse( null );
		}
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

		// Build query to save mega menu data.
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
	}
}
