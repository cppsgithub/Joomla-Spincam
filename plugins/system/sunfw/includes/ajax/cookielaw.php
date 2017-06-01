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
 * Handle Ajax requests from cookie law pane.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxCookieLaw extends SunFwAjax
{
	/**
	 * Get cookie law data from database.
	 *
	 * @return  void
	 */
	public function getAction() {
		// Get site URL.
		$root = JUri::root(true);

		/**
		 * Get custom input components.
		 */
		$inputs = array();
		$path   = JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/cookie-law/inputs';

		foreach (glob("{$path}/*.js") as $input)
		{
			$inputs[substr(basename($input), 0, -3)] = $root . str_replace(JPATH_ROOT, '', $input);
		}

		// Allow 3rd-party to add their own custom inputs into cookie law.
		$inputs = array_merge( $inputs, JEventDispatcher::getInstance()->trigger('SunFwGetCookieLawInputs') );

		/**
		 * Get cookie law data.
		 */
		$style = SunFwHelper::getSunFwStyle($this->styleID);

		$this->setResponse(
			array(
				'data'     => $style ? json_decode($style->cookie_law_data, true) : null,
				'inputs'   => $inputs,
				'settings' => SunFwHelper::findTemplateAdminJsonSettings(
					JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/cookie-law',
					'settings.json',
					true
				)
			)
		);
	}

	/**
	 * Save style data to database.
	 *
	 * @return  void
	 */
	public function saveAction()
	{
		// Prepare input data.
		$data = $this->input->get( 'data', '', 'raw' );

		if ( empty( $data ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Build query to save style data.
		$style = SunFwHelper::getSunFwStyle( $this->styleID );
		$query = $this->dbo->getQuery( true );

		if ( $style )
		{
			$query
				->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->set( $this->dbo->quoteName( 'cookie_law_data' ) . '=' . $this->dbo->quote( $data ) )
				->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
				->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
		}
		else
		{
			$columns = array( 'style_id', 'cookie_law_data', 'template' );
			$values  = array( intval( $this->styleID ), $this->dbo->quote( $data ), $this->dbo->quote( $this->templateName ) );

			$query
				->insert( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->columns( $this->dbo->quoteName( $columns ) )
				->values( implode( ', ', $values ) );
		}

		// Execute query to save cookie law data.
		try
		{
			$this->dbo->setQuery( $query );

			if ( ! $this->dbo->execute() )
			{
				throw new Exception( $this->dbo->getErrorMsg() );
			} else {
				$sufwrender = new SunFwScssrender();

				$sufwrender->compile( $this->styleID, $this->templateName, 'cookie_law' );
			}
		}
		catch ( Exception $e )
		{
			throw $e;
		}

		$this->setResponse( array( 'message' => JText::_( 'SUNFW_COOKIE_LAW_SAVED_SUCCESSFULLY' ) ) );
	}
}
