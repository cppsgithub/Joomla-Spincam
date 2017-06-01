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

// Import necessary Joomla libraries.
jimport('joomla.filesystem.file');

/**
 * Handle Ajax requests from style editor.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxStyles extends SunFwAjax
{
	/**
	 * Get style data from database.
	 *
	 * @return  void
	 */
	public function getAction() {
		// Get style data.
		$style = SunFwHelper::getSunFwStyle($this->styleID);

		// Prepare color values.
		$style = $this->prepareColorValues(SunFwHelper::getStyleData($style, $this->templateName), true);

		$this->setResponse($style);
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

		// Prepare values for color related options.
		$data = json_encode( $this->prepareColorValues( $data ) );

		// Prepare some values for backward compatible.
		if ( isset( $data['general'] ) && isset( $data['general']['content'] ) )
		{
			if ( isset( $data['general']['content']['color'] ) && ! isset( $data['general']['content']['text-color'] ) )
			{
				$data['general']['content']['text-color'] = $data['general']['content']['color'];
			}
		}

		// Build query to save style data.
		$style = SunFwHelper::getSunFwStyle( $this->styleID );
		$query = $this->dbo->getQuery( true );

		if ( $style )
		{
			$query
				->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( $data ) )
				->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
				->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
		}
		else
		{
			$columns = array( 'style_id', 'appearance_data', 'template' );
			$values  = array( intval( $this->styleID ), $this->dbo->quote( $data ), $this->dbo->quote( $this->templateName ) );

			$query
				->insert( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->columns( $this->dbo->quoteName( $columns ) )
				->values( implode( ', ', $values ) );
		}

		// Execute query to save style data.
		try
		{
			$this->dbo->setQuery( $query );

			if ( ! $this->dbo->execute() )
			{
				throw new Exception( $this->dbo->getErrorMsg() );
			} else {
				$sufwrender = new SunFwScssrender();

				$sufwrender->compile( $this->styleID, $this->templateName, 'appearance' );
			}
		}
		catch ( Exception $e )
		{
			throw $e;
		}
	}

	/**
	 * Save lstyle data as style preset.
	 *
	 * @throws  Exception
	 */
	public function saveAsAction()
	{
		// Prepare input data.
		$data   = $this->input->get( 'data', '', 'raw' );
		$name   = $this->input->getString( 'style_name', '' );
		$style 	= SunFwHelper::getSunFwStyle( $this->styleID );

		if ( empty( $data ) || empty( $name ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Get a writtable directory to save style preset.
		$directory = SunFwHelper::getWritableDirectory(
			SunFwHelper::getStyleDirectories( $this->templateName, true, $style )
		);

		if ( ! $directory ) {
			throw new Exception(
				JText::sprintf(
					'SUNFW_NOT_FOUND_WRITABLE_DIRECTORY',
					implode( "\n\n", $directories )
				)
			);
		}

		// Write style data to style preset file.
		$file = "{$directory}/" . preg_replace( '/[^a-zA-Z0-9\-_]+/', '_', $name ) . '.json';

		if ( ! JFile::write( $file, $data ) )
		{
			throw new Exception( JText::sprintf( 'SUNFW_ERROR_FAILED_TO_SAVE_FILENAME', $file ) );
		}

		// Set response data.
		$name = substr( basename( $file ), 0, -5 );

		$this->setResponse( $name );
	}

	/**
	 * Method to get list of Google fonts.
	 *
	 * @return  void
	 */
	public function getGoogleFontsAction()
	{
		// Get dynamic list of Google fonts.
		$link = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCHuPGfMBxIWzmUz_CeqAJ7_X8INFG8h5Q';
		$http = new JHttp;
		$data = $http->get( $link );

		if ( $data = json_decode( $data->body, true ) )
		{
			if ( ! isset( $data['error'] ) )
			{
				$this->setResponse( $data );
			}
			else
			{
				// Get list of Google fonts from static file.
				if ( is_file( SUNFW_PATH . '/googlefonts/googlefonts.json' ) )
				{
					$this->setResponse( json_decode( JFile::read( SUNFW_PATH . '/googlefonts/googlefonts.json' ), true ) );
				}
				else
				{
					throw new Exception( JText::_( 'SUNFW_FAILED_TO_GET_GOOGLE_FONTS_LIST' ) );
				}
			}
		}
	}

	/**
	 * Method to get list of module styles.
	 *
	 * @return  void
	 */
	public function getModuleStylesAction()
	{
		// Get default module styles.
		$defaultModuleStyles = SunFwHelper::getDefaultModuleStyle( $this->styleID );

		if ( ! count( $defaultModuleStyles ) )
		{
			throw new Exception( JText::_( 'SWNFW_HAS_NO_DEFAULT_MODULE_STYLE' ) );
		}

		if (
			( isset( $defaultModuleStyles['appearance'] ) && ! isset( $defaultModuleStyles['appearance']['modules'] ) )
			||
			( ! isset( $defaultModuleStyles['appearance'] ) && ! isset( $defaultModuleStyles['module'] ) )
		) {
			throw new Exception( JText::_( 'SWNFW_HAS_NO_DEFAULT_MODULE_STYLE' ) );
		}

		$this->setResponse( array_keys(
			isset( $defaultModuleStyles['appearance'] )
				? $defaultModuleStyles['appearance']['modules']
				: $defaultModuleStyles['module']
		) );
	}

	/**
	 * Remove prebuilt layout.
	 *
	 * @return  void
	 */
	public function removeAction()
	{
		// Prepare input data.
		$styleName   = $this->input->getString( 'style_name', '' );

		$style 	= SunFwHelper::getSunFwStyle( $this->styleID );
		if ( empty( $styleName ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Find prebuilt layout file.
		foreach ( SunFwHelper::getStyleDirectories( $this->templateName, false, $style ) as $dir )
		{
			if ( is_file( $file = "{$dir}/{$styleName}.json" ) ) {
				if ( ! JFile::delete( $file ) )
				{
					throw new Exception(
							JText::sprintf(
									'SUNFW_FAILED_TO_REMOVE_FILE',
									$file
							)
					);
				}
			}
		}
	}

	/**
	 * Prepare values for color related options.
	 *
	 * @param   mixed    $data  Data array.
	 * @param   boolean  $edit  Whether to prepare for editing.
	 *
	 * @return  array
	 */
	protected function prepareColorValues( $data, $edit = false )
	{
		// Prepare data array.
		if ( is_string( $data ) )
		{
			$data = json_decode( $data, true );
		}

		// Get value of main and sub color.
		static $colors;

		if ( ! isset( $colors ) )
		{
			if ( ! isset( $data['general']['color'] ) )
			{
				return $data;
			}

			$colors['main'] = $data['general']['color']['main-color'];
			$colors['sub' ] = $data['general']['color']['sub-color' ];
		}

		// Loop thru data array to set values for color related parameters.
		foreach ( $data as $k => $v )
		{
			if ( in_array( $k, array( 'main-color', 'sub-color' ) ) )
			{
				continue;
			}

			if ( is_array( $v ) )
			{
				$data[ $k ] = $this->prepareColorValues( $v, $edit );
			}
			elseif ( false !== strpos( $k, 'color' ) || false !== strpos( $k, 'bg' ) )
			{
				switch ( $v )
				{
					case 'main' :
						$data[ $k ] = $colors['main'];
					break;

					case 'sub' :
						$data[ $k ] = $colors['sub'];
					break;

					default :
						if ( $edit )
						{
							if ( $v == $colors['main'] )
							{
								$data[ $k ] = 'main';
							}
							elseif ( $v == $colors['sub'] )
							{
								$data[ $k ] = 'sub';
							}
						}
					break;
				}
			}
		}

		return $data;
	}
}
