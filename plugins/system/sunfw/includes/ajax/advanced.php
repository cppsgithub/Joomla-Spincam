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

// Import necessary Joomla libraries
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.path');
jimport('joomla.filesystem.file');

/**
 * Handle Ajax requests from advanced params pane.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxAdvanced extends SunFwAjax
{
	public function getAction()
	{
		/**
		 * Get system data.
		 */
		$style = SunFwHelper::getSunFwStyle($this->styleID);

		$this->setResponse(
			array(
				'data'     => $style ? json_decode($style->system_data, true) : null,
				'settings' => SunFwHelper::findTemplateAdminJsonSettings(
					JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/system',
					'settings.json',
					true
				)
			)
		);
	}

	/**
	 * Save data to database
	 *
	 * @throws Exception
	 */
	public function saveAction()
	{
		// Prepare input data.
		$data = $this->input->get( 'data', '', 'raw' );

		if ( empty( $data ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Build query to save advanced data.
		$style = SunFwHelper::getSunFwStyle( $this->styleID );
		$query = $this->dbo->getQuery( true );

		if ( count($style) )
		{
			$query
				->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->set( $this->dbo->quoteName( 'system_data' ) . '=' . $this->dbo->quote( $data ) )
				->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
				->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
		}
		else
		{
			$columns = array( 'style_id', 'system_data', 'template' );
			$values  = array( intval( $this->styleID ), $this->dbo->quote( $data ), $this->dbo->quote( $this->templateName ) );

			$query
				->insert( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->columns( $this->dbo->quoteName( $columns ) )
				->values( implode( ',', $values ) );
		}

		// Execute query to save advanced data.
		try
		{
			$this->dbo->setQuery( $query );

			if ( ! $this->dbo->execute() )
			{
				throw new Exception( $this->dbo->getErrorMsg() );
			}

			if ($data['cacheDirectory'] != '')
			{
				// Generate path to cache directory
				if ( ! preg_match('#^(/|\\|[a-z]:)#i', $data['cacheDirectory']))
				{
					$cacheDirectory = JPATH_ROOT . '/' . rtrim($data['cacheDirectory'], '\\/');
				}
				else
				{
					$cacheDirectory = rtrim($data['cacheDirectory'], '\\/');
				}

				// Remove entire cache directory
				! is_dir($cacheDirectory . '/' . $this->templateName) OR JFolder::delete($cacheDirectory . '/' . $this->templateName);
			}
		}
		catch ( Exception $e )
		{
			throw $e;
		}

		$this->setResponse( array( 'message' => JText::_( 'SUNFW_SYSTEM_CONFIG_SAVED_SUCCESSFULLY' ) ) );
	}

	public function verifyCacheFolderAction()
	{
		$folder = $this->input->getString( 'folder', '' );

		if ( empty( $folder ) )
		{
			$this->setResponse(array(
				'pass'    => false,
				'message' => JText::_('SUNFW_INVALID_REQUEST')
			));

			return;
		}

		if ( ! preg_match('#^(/|\\|[a-z]:)#i', $folder))
		{
			$folder = JPATH_ROOT . '/' . $folder;
		}

		// Check if directory exist
		if ( ! is_dir($folder))
		{
			$this->setResponse(array(
				'pass'    => false,
				'message' => JText::_('SUNFW_DIRECTORY_NOT_FOUND')
			));

			return;
		}

		// TODO issue related to compress css on rc demo
		// Check if folder is outside of document root directory
		if ( ! realpath($folder) OR strpos(realpath($folder), realpath($_SERVER['DOCUMENT_ROOT'])) === false)
		{
			$this->setResponse(array(
				'pass'    => false,
				'message' => JText::_('SUNFW_DIRECTORY_OUT_OF_ROOT')
			));

			return;
		}

		// Check if directory is writable
		$config = JFactory::getConfig();

		if ( ! $config->get('ftp_enable') AND ! is_writable($folder))
		{
			$this->setResponse(array(
				'pass'    => false,
				'message' => JText::_('SUNFW_DIRECTORY_NOT_WRITABLE')
			));

			return;
		}

		$this->setResponse(array(
			'pass'    => true,
			'message' => JText::_('SUNFW_DIRECTORY_READY')
		));
	}
}
