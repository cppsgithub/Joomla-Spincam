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

// Import necessary library.
jimport('joomla.filesystem.file');

/**
 * Handle Ajax requests from layout builder.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxLayout extends SunFwAjax
{
	/**
	 * Get layout data from database.
	 *
	 * @return  void
	 */
	public function getAction() {
		// Get style data.
		$style = SunFwHelper::getSunFwStyle($this->styleID);

		$this->setResponse( SunFwHelper::getLayoutData($style, $this->templateName) );
	}

	/**
	 * Save layout builder data to database.
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

		// Build query to save layout builder data.
		$style = SunFwHelper::getSunFwStyle( $this->styleID );
		$query = $this->dbo->getQuery( true );

		if ( $style )
		{
			$query
				->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->set( $this->dbo->quoteName( 'layout_builder_data' ) . '=' . $this->dbo->quote( $data ) )
				->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
				->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
		}
		else
		{
			$columns = array( 'style_id', 'layout_builder_data', 'template' );
			$values  = array( intval( $this->styleID ), $this->dbo->quote( $data ), $this->dbo->quote( $this->templateName ) );

			$query
				->insert( $this->dbo->quoteName( '#__sunfw_styles' ) )
				->columns( $this->dbo->quoteName( $columns ) )
				->values( implode( ', ', $values ) );
		}

		// Execute query to save layout builder data.
		try
		{
			$this->dbo->setQuery( $query );

			if ( ! $this->dbo->execute() )
			{
				throw new Exception( $this->dbo->getErrorMsg() );
			} else {
				$this->processAppearanceData();

				$sufwrender = new SunFwScssrender();

				$sufwrender->compile( $this->styleID, $this->templateName, 'layout' );
				$sufwrender->compile($this->styleID, $this->templateName);
			}
		}
		catch ( Exception $e )
		{
			throw $e;
		}
	}

	/**
	 * Save layout builder data as prebuilt layout.
	 *
	 * @throws  Exception
	 */
	public function saveAsAction()
	{
		// Prepare input data.
		$data         = $this->input->get( 'data', '', 'raw' );
		$name         = $this->input->getString( 'layout_name', '' );
		$setAsDefault = $this->input->getInt( 'default_layout', 0 );

		if ( empty( $data ) || empty( $name ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Get a writtable directory to save prebuilt layout.
		$directory = SunFwHelper::getWritableDirectory(
			SunFwHelper::getLayoutDirectories( $this->templateName, true )
		);

		if ( ! $directory ) {
			throw new Exception(
				JText::sprintf(
					'SUNFW_NOT_FOUND_WRITABLE_DIRECTORY',
					implode( "\n\n", $directories )
				)
			);
		}

		// Write layout builder data to prebuilt layout file.
		$file = "{$directory}/" . preg_replace( '/[^a-zA-Z0-9\-_]+/', '_', $name ) . '.json';

		if ( ! JFile::write( $file, $data ) )
		{
			throw new Exception( JText::sprintf( 'SUNFW_ERROR_FAILED_TO_SAVE_FILENAME', $file ) );
		}

		// Set default layout if requested.
		$name = substr( basename( $file ), 0, -5 );

		if ( $setAsDefault )
		{
			$this->setDefaultLayoutAction( $name );
		}

		$this->setResponse( $name );
	}

	/**
	 * Remove prebuilt layout.
	 *
	 * @return  void
	 */
	public function removeAction()
	{
		// Prepare input data.
		$layout = $this->input->getString( 'layout' );

		if ( empty( $layout ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Find prebuilt layout file.
		foreach ( SunFwHelper::getLayoutDirectories( $this->templateName ) as $dir )
		{
			if ( is_file( $file = "{$dir}/{$layout}.json" ) ) {
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
	 * Set default layout.
	 *
	 * @param   string  $layout  File name without extension of the layout to set as default.
	 *
	 * @return  void
	 */
	public function setDefaultLayoutAction( $layout = '' )
	{
		// Prepare input data.
		$layout = empty( $layout ) ? $this->input->getString( 'layout_name', '' ) : $layout;

		if ( empty( $layout ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Prepare template's XML manifest data.
		$manifest = SunFwHelper::getManifest( $this->templateName, true );

		if ( ! isset( $manifest->defaultLayout ) )
		{
			$manifest->addChild( 'defaultLayout', $layout );
		}
		else
		{
			$manifest->defaultLayout = $layout;
		}

		// Save updated XML data to manifest file.
		try
		{
			SunFwHelper::updateManifest( $this->templateName, $manifest );
		}
		catch ( Exception $e )
		{
			throw $e;
		}
	}

	/**
	 * Change section ID in appearance data.
	 *
	 * @throws  Exception
	 */
	public function changeSectionIDForTemplateAction()
	{
		// Prepare input data.
		$old = $this->input->getString( 'old_data', '' );
		$new = $this->input->getString( 'new_data', '' );

		if ( empty( $new ) || empty( $old ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		if ($new == $old)
		{
			throw new Exception( 'Old value is equal new value' );
		}

		// Build query to save layout builder data.
		$style = SunFwHelper::getSunFwStyle( $this->styleID );
		$query = $this->dbo->getQuery( true );
		if ( count($style) )
		{

			$this->changeSectionIDForCustomCssFiles($style, $old, $new);

			if ($style->appearance_data !='')
			{
				$appearanceData = json_decode($style->appearance_data, true);

				if (count($appearanceData))
				{
					if (!isset($appearanceData['sections']))
					{
						$this->setResponse( array( 'message' => JText::_( 'SUNFW_SAVED_SUCCESSFULLY' ) ) );
						return;
					}

					$isUpdate 		= false;
					$sections 		= $appearanceData['sections'];

					foreach ($sections as $key => $item)
					{
						if ($key == $old)
						{
							$isUpdate = true;
							$sections [$new] = $item;
							unset($sections[$old]);
							break;
						}
					}

					if ($isUpdate)
					{
						$appearanceData['sections'] = $sections;
						$tmpAppearanceData = $appearanceData;
						$query
							->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
							->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( json_encode($tmpAppearanceData) ) )
							->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
							->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
						// Execute query to save layout builder data.
						try
						{
							$this->dbo->setQuery ( $query );

							if (! $this->dbo->execute ())
							{
								throw new Exception ( $this->dbo->getErrorMsg () );
							}

							//$sunFwPresetsObj  = new SunFwPresets();
							//$sunFwPresetsObj->updatePresetSection($this->styleID, $old, $new);
						}
						catch ( Exception $e )
						{
							throw $e;
						}
					}

				}
			}
		}

		$this->setResponse( array( 'message' => JText::_( 'SUNFW_SAVED_SUCCESSFULLY' ) ) );
		return;
	}

	/**
	 * Delete section ID in appearance data.
	 *
	 * @throws  Exception
	 */
	public function deleteSectionIDInAppearanceAction()
	{
		// Prepare input data.
		$sid = $this->input->getString( 'section_id', '' );

		if ( empty( $sid ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Build query to save layout builder data.
		$style = SunFwHelper::getSunFwStyle( $this->styleID );
		$query = $this->dbo->getQuery( true );

		if ( count($style) )
		{
			if ($style->appearance_data !='')
			{
				$appearanceData = json_decode($style->appearance_data, true);
				if (count($appearanceData))
				{
					$appearanceData = $appearanceData['appearance'];
					if (count($appearanceData))
					{
						if (!isset($appearanceData['sections']))
						{
							$this->setResponse( array( 'message' => JText::_( 'SUNFW_LAYOUT_BUILDER_SECTION_IS_NOT_EXISTED' ) ) );
							return;
						}

						$isDelete 		= false;
						$sections 		= $appearanceData['sections'];

						foreach ($sections as $key => $item)
						{
							if ($key == $sid)
							{
								$isDelete = true;
								unset($sections[$key]);
								break;
							}
						}

						if ($isDelete)
						{
							$appearanceData['sections'] = $sections;
							$tmpAppearanceData['appearance'] = $appearanceData;

							$query
								->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
								->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( json_encode($tmpAppearanceData) ) )
								->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
								->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
							// Execute query to save layout builder data.
							try
							{
								$this->dbo->setQuery ( $query );

								if (! $this->dbo->execute ())
								{
									throw new Exception ( $this->dbo->getErrorMsg () );
								}
							}
							catch ( Exception $e )
							{
								throw $e;
							}
						}
					}
				}
			}
		}

		$this->setResponse( array( 'message' => JText::_( 'SUNFW_SAVED_SUCCESSFULLY' ) ) );
		return;
	}

	/**
	 * Proccess Appearance data
	 *
	 * @throws Exception
	 * @return boolean
	 */
	public function processAppearanceData()
	{
		// Build query to save layout builder data.
		$style = SunFwHelper::getSunFwStyle( $this->styleID );
		$layoutBuilderSectionsID = array();
		$query = $this->dbo->getQuery( true );

		if (count($style))
		{
			$layoutBuilderData 	= $style->layout_builder_data;
			$appearanceData 	= $style->appearance_data;

			if ($layoutBuilderData != '' && $appearanceData != '')
			{
				$layoutBuilderData 	= json_decode($layoutBuilderData, true);
				$appearanceData 	= json_decode($appearanceData, true);

				if (count($layoutBuilderData) && count($appearanceData))
				{
					foreach ($layoutBuilderData['sections'] as $section)
					{
						if ($section != null && is_array($section))
						{
							$layoutBuilderSectionsID [] = $section['id'];
						}
					}

					if (!count($layoutBuilderSectionsID))
					{
						if (isset($appearanceData['appearance']['sections']))
						{
							unset($appearanceData['appearance']['sections']);
						}
					}
					else
					{

						if (isset($appearanceData['appearance']['sections']))
						{
							foreach ($appearanceData['appearance']['sections'] as $key => $item)
							{
								if (!in_array($key, $layoutBuilderSectionsID))
								{
									unset($appearanceData['appearance']['sections'][$key]);
								}
							}

							if (!count($appearanceData['appearance']['sections']))
							{
								unset($appearanceData['appearance']['sections']);
							}
						}
					}

					$query = $this->dbo->getQuery( true );
					$query
						->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
						->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( json_encode($appearanceData) ) )
						->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
						->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
					// Execute query to save appearance data.
					try
					{
						$this->dbo->setQuery( $query );
						if ( ! $this->dbo->execute() )
						{
							throw new Exception( $this->dbo->getErrorMsg() );
						}

						return true;
					}
					catch ( Exception $e )
					{
						return false;
					}
				}
			}
		}
	}

	/**
	 * Auto Change section ID form Customer Css Files
	 *
	 * @param object $style
	 * @param string $this->templateName	the template name
	 * @param unknown $old			the old ID
	 * @param unknown $new			the new ID
	 * @return boolean
	 */

	public function changeSectionIDForCustomCssFiles($style, $old, $new)
	{
		// Import necessary Joomla libraries
		jimport('joomla.filesystem.folder');
		jimport('joomla.filesystem.file');

		if ($old == $new) return true;

		$files	= array();
		$custom	= JPATH_ROOT . '/templates/' . $this->templateName . '/css/custom/custom.css';

		if (JFile::exists($custom))
		{
			$files [] = $custom;
		}

		if (count($style))
		{
			$systemData 	= $style->system_data;
			if ($systemData != '')
			{
				$systemData = json_decode($systemData, true);
				if (count($systemData))
				{
					if (isset($systemData['niche-style']))
					{
						if ($systemData['niche-style'] != '')
						{
							$niche = JPATH_ROOT . '/templates/' . $this->templateName . '/niches/' . $systemData['niche-style'] . '/scss';
							if (JFolder::exists($niche))
							{
								$nicheFiles = glob( $niche .'/*.scss' );
								if (count($nicheFiles))
								{
									$files = array_merge($files, $nicheFiles);
								}
							}
						}
					}
				}
			}
		}

		if (count($files))
		{
			foreach ($files as $file)
			{
				if (JFile::exists($file))
				{
					if ( ! is_writable( $file ) )
					{
						// Try to change ownership of the file.
						$user = get_current_user();

						chown( $file, $user );

						if ( ! JPath::setPermissions( $file, '0644' ) )
						{
							continue;
						}

						if ( ! JPath::isOwner( $file ) )
						{
							continue;
						}
					}

					$content = file_get_contents($file);
					$content = preg_replace('#' . $old . '#', $new, $content);

					if ( ! JFile::write( $file, $content ) )
					{
						continue;
					}
				}
			}
		}

		return true;
	}
}
