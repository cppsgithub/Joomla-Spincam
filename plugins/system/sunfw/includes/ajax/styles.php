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
 * Handle Ajax requests from styles pane.
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
		// Get site URL.
		$root = JUri::root(true);

		/**
		 * Get styles editor's items.
		 */
		$items = SunFwHelper::findTemplateAdminJsonSettings(
			JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/styles/settings/items'
		);

		// Allow 3rd-party to add their own items into styles editor.
		$items = array_merge( $items, JEventDispatcher::getInstance()->trigger('SunFwGetStylesItems') );

		/**
		 * Get styles editor's groups.
		 */
		$groups = array_merge(
			array(
				'general'  => JText::_('SUNFW_GENERAL_SETTINGS_BUTTON_TEXT'),
				'sections' => JText::_('SUNFW_SECTION_SETTINGS_BUTTON_TEXT'),
				'module'   => JText::_('SUNFW_MODULE_SETTINGS_BUTTON_TEXT'),
				'menu'     => JText::_('SUNFW_MENU_SETTINGS_BUTTON_TEXT')
			),
			// Allow 3rd-party to add additional screens into layout builder.
			JEventDispatcher::getInstance()->trigger('SunFwGetStylesGroups')
		);

		/**
		 * Get styles editor's style presets.
		 */
		$style   = SunFwHelper::getSunFwStyle($this->styleID);
		$presets = SunFwHelper::findTemplateAdminJsonSettings(
			SunFwHelper::getStyleDirectories($this->templateName, false, $style),
			'*.json',
			false,
			'SUNFW_PREBUILD_STYLE_'
		);

		// Allow 3rd-party to add their own style presets into styles editor.
		$presets = array_merge( $presets, JEventDispatcher::getInstance()->trigger('SunFwGetStylePresets') );

		/**
		 * Get custom input components.
		 */
		$inputs = array();
		$path   = JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/styles/inputs';

		foreach (glob("{$path}/*.js") as $input)
		{
			$inputs[substr(basename($input), 0, -3)] = $root . str_replace(JPATH_ROOT, '', $input);
		}

		// Allow 3rd-party to add their own custom inputs into styles editor.
		$inputs = array_merge( $inputs, JEventDispatcher::getInstance()->trigger('SunFwGetStylesInputs') );

		/**
		 * Synchronize color values for editing.
		 */
		$style = SunFwHelper::getStyleData($style, $this->templateName);
		$style = SunFwHelper::synchronizeColorValues($style, $style, null, true);

		$this->setResponse(
			array(
				'data'     => $style,
				'items'    => $items,
				'inputs'   => $inputs,
				'groups'   => $groups,
				'presets'  => $presets,
				'settings' => SunFwHelper::findTemplateAdminJsonSettings(
					JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/styles/settings',
					'page.json',
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

		// Prepare values for color related options.
		$data = SunFwHelper::synchronizeColorValues($data, $data);

		// Prepare some values for backward compatible.
		if ( isset( $data['general'] ) && isset( $data['general']['content'] ) )
		{
			if ( isset( $data['general']['content']['color'] ) && ! isset( $data['general']['content']['text-color'] ) )
			{
				$data['general']['content']['text-color'] = $data['general']['content']['color'];
			}
		}

		// Synchronize color values with layout and mega menu.
		$style = SunFwHelper::getSunFwStyle( $this->styleID );

		if ($style)
		{
			$style->appearance_data = SunFwHelper::getStyleData($style, $this->templateName);

			$style->layout_builder_data = SunFwHelper::getLayoutData($style, $this->templateName);
			$style->layout_builder_data = SunFwHelper::synchronizeColorValues($style->appearance_data, $style->layout_builder_data, null, true);
			$style->layout_builder_data = SunFwHelper::synchronizeColorValues($data, $style->layout_builder_data);
			$style->layout_builder_data = json_encode($style->layout_builder_data);

			$style->mega_menu_data = SunFwHelper::synchronizeColorValues($style->appearance_data, $style->mega_menu_data, null, true);
			$style->mega_menu_data = SunFwHelper::synchronizeColorValues($data, $style->mega_menu_data);
			$style->mega_menu_data = json_encode($style->mega_menu_data);
		}

		// Build query to save style data.
		$data  = json_encode( $data );
		$query = $this->dbo->getQuery( true );

		if ( $style )
		{
			$query
				->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( $data ) )
				->set( $this->dbo->quoteName( 'layout_builder_data' ) . '=' . $this->dbo->quote( $style->layout_builder_data ) )
				->set( $this->dbo->quoteName( 'mega_menu_data' ) . '=' . $this->dbo->quote( $style->mega_menu_data ) )
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
			}
			else
			{
				$sufwrender = new SunFwScssrender();

				if ($style)
				{
					$sufwrender->compile( $this->styleID, $this->templateName, 'layout' );
				}

				$sufwrender->compile( $this->styleID, $this->templateName, 'appearance' );
			}
		}
		catch ( Exception $e )
		{
			throw $e;
		}

		$this->setResponse( array( 'message' => JText::_( 'SUNFW_STYLES_SAVED_SUCCESSFULLY' ) ) );
	}

	/**
	 * Save lstyle data as style preset.
	 *
	 * @throws  Exception
	 */
	public function saveAsAction()
	{
		// Prepare input data.
		$data  = $this->input->get( 'data', '', 'raw' );
		$name  = $this->input->getString( 'style_name', '' );
		$style = SunFwHelper::getSunFwStyle( $this->styleID );

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

		$this->setResponse( array(
			'name'    => $name,
			'message' => JText::_( 'SUNFW_STYLE_PRESET_SAVED_SUCCESSFULLY' )
		) );
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
}
