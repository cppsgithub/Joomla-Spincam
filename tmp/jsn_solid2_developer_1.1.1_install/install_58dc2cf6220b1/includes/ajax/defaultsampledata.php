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
jimport('joomla.filesystem.archive');
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.file');
jimport('joomla.cache.cache');

/**
 * Sample data (un-)installer.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxDefaultSampleData extends SunFwAjax
{

	/**
	 * Sample data package.
	 *
	 * @var  array
	 */
	protected $sample;

	/**
	 * Sample data XML definition.
	 *
	 * @var  SimpleXMLElement
	 */
	protected $xml;

	/**
	 * Temporary path where sample data package is extracted to.
	 *
	 * @var  string
	 */
	protected $temporary_path = '';

	/**
	 * Download sample data package.
	 *
	 * @return  void
	 */

	/**
	 * Download sample data package.
	 *
	 * @return  void
	 */
	public function downloadPackageAction()
	{
		try
		{
			// Verify request.
			$this->verify();

			// Generate path to store sample data package.
			$tmpPath = JFactory::getConfig()->get( 'tmp_path' ) . "/{$this->template->id}/sample-data.zip";

			// Get sample data package.
			$http = new JHttp;
			$data = $http->get( $this->sample['download'] );

			// Verify response headers.
			if ( $data->headers['Content-Type'] != 'application/zip' )
			{
				throw new Exception( JText::_( 'Cannot locate sample data package on JoomlaShine server' ) );
			}

			// Write sample data to file.
			JFile::write( $tmpPath, $data->body );

			$this->setResponse( $tmpPath );
		}
		catch ( Exception $e )
		{
			throw $e;
		}
	}

	public function importPackageAction()
	{

		try
		{
			// Verify request.
			$this->verify();

			// Extract sample data.
			$this->extract();

			// Get Joomla configuration.
			$config = JFactory::getConfig();

			// Create a backup of the current Joomla database.
			$this->backupDatabase();

			// Support for Mysql < 5.5.3
			$databaseVersion 	= $this->dbo->getVersion();
			$databaseVersion	= preg_match('/[0-9]\.[0-9]+\.[0-9]+/', $databaseVersion, $dbMatch);
			$databaseVersion	= @$dbMatch[0];

			if (count($databaseVersion))
			{
				$expDatabaseVersion = explode('.', $databaseVersion);
				if (isset($expDatabaseVersion[2]))
				{
					if ((int) $expDatabaseVersion[2] < 10)
					{
						$expDatabaseVersion[2] = $expDatabaseVersion[2] * 10;
						$databaseVersion = implode('.', $expDatabaseVersion);
					}
				}
			}

			// Temporary backup data.
			$this->backupThirdPartyModules();
			$this->backupThirdPartyAdminModules();
			$this->backupThirdPartyMenus();

			// Delete admin modules.
			$this->deleteThirdPartyAdminModules();

			foreach ( $this->xml->xpath( '//extension' ) as $extension )
			{
				// Get sample data queries.
				$queries = $extension->xpath( 'task[@name="dbinstall"]/parameters/parameter' );

				// Verify extension.
				$canInstall    = true;
				$extensionType = ( string ) $extension['type'];
				$namePrefix    = array( 'component' => 'com_', 'module' => 'mod_' );
				$extensionName = isset( $namePrefix[ $extensionType ] )
					? $namePrefix[ $extensionType ] . $extension['name']
					: ( string ) $extension['name'];

				if ( isset( $extension['author'] ) && $extension['author'] == 'joomlashine' )
				{
					// Check if JoomlaShine extension is installed.
					$canInstall = SunFwHelper::isExtensionInstalled( $extensionName, $extensionType );
				}

				if ( $canInstall )
				{
					// Clear the current default template style then backup current template styles.
					if ( 'sunfw' == ( string ) $extension['name'] && ! isset( $stylesBackup ) )
					{
						// Clear the current default template style.
						$q = $this->dbo->getQuery( true );

						$q->update( '#__template_styles' )->set( 'home = 0' )->where( 'client_id = 0' )->where( 'home = 1' );

						$this->dbo->setQuery( $q );
						$this->dbo->execute();

						// Backup current template styles.
						$q = $this->dbo->getQuery( true );

						$q->select( '*' )->from( '#__template_styles' )->where( '1' );

						$this->dbo->setQuery( $q );

						$stylesBackup = $this->dbo->loadObjectList();
					}

					// Execute sample data queries.
					$pattern = '#(http://demo.joomlashine.com/[^\s\t\r\n]+/media/joomlashine/)[^\s\t\r\n]+\.(js|css|bmp|gif|ico|jpg|png|svg|ttf|otf|eot|woff)#';
					$http    = new JHttp;

					foreach ( $queries as $query )
					{
						// Find remote assets then download to local system.
						if ( preg_match_all( $pattern, $query, $matches, PREG_SET_ORDER ) )
						{
							foreach ( $matches as $match )
							{
								$keepAsIs = false;

								if ( ! isset( $this->mediaFolder ) )
								{
									// Detect a writable folder to store demo assets.
									foreach ( array( 'media', 'cache', 'tmp' ) as $folder )
									{
										$folder = JPATH_ROOT . "/{$folder}";

										if (
											is_dir( $folder )
											&&
											is_writable( $folder )
											&&
											JFolder::create( "{$folder}/joomlashine" )
										)
										{
											$this->mediaFolder = "{$folder}/joomlashine";

											break;
										}
									}
								}

								if ( isset( $this->mediaFolder ) )
								{
									// Generate path to store demo asset.
									$mediaFile = str_replace( $match[1], "{$this->mediaFolder}/", $match[0] );

									// Download demo asset once.
									if ( ! is_file( $mediaFile ) )
									{
										try
										{
											$data = $http->get( $match[0] );

											// Write downloaded data to local file.
											if ( ! JFile::write( $mediaFile, $data->body ) )
											{
												throw new Exception( JText::_( 'Failed to store downloaded data to local file' ) );
											}
										}
										catch ( Exception $e )
										{
											$keepAsIs = true;
										}
									}

									// Alter sample data query.
									if ( ! $keepAsIs )
									{
										$query = str_replace(
											$match[0],
											str_replace( JPATH_ROOT . '/', '', $mediaFile ),
											$query
										);
									}
								}
							}
						}

						// Support for Mysql < 5.5.3
						if (version_compare($databaseVersion, '5.5.30', '<'))
						{
							$tmpQuery = (string) $query;
							$query = str_replace('utf8mb4_unicode_ci', 'utf8_general_ci', $tmpQuery);
							$query = str_replace('utf8mb4', 'utf8', $query);
						}

						// Execute query.
						$this->dbo->setQuery( ( string ) $query );

						if ( ! $this->dbo->execute() )
						{
							throw new Exception( $this->dbo->getErrorMsg() );
						}
					}

				}
			}

		}
		catch ( Exception $e )
		{
			$error = $e;
		}

		//Copy sampe image
		$this->copySampleImage();

		// Restore backed up data.
		$this->restoreThirdPartyData();
		$this->rebuildMenus();

		// Clean up temporary data.
		$tmpPath = $config->get( 'tmp_path' ) . "/{$this->template->id}/sample-data";

		JInstallerHelper::cleanupInstall( "$tmpPath.zip", $tmpPath );

		// Check if there is any error catched?
		if ( isset( $error ) )
		{
			throw $error;
		}

		// Store installed sample data package.
		SunFwHelper::updateExtensionParams(
			array(
				'installedSamplePackage' => $this->sample['id'] ,
			),
			'template',
			$this->template->template
		);

		// Get ID of the default template style.
		$q = $this->dbo->getQuery( true );

		$q->select( 'id' )->from( '#__template_styles' )->where( 'client_id = 0' )->where( 'home = 1' );

		$this->dbo->setQuery( $q );

		$styleId = ( int ) $this->dbo->loadResult();

		try
		{
			// re-compile Sass
			$sunStyles = SunFwHelper::getSunFwStyleListByName($this->template->template);

			if (count($sunStyles))
			{
				foreach($sunStyles as $sunStyle)
				{
					$sufwrender = new SunFwScssrender();
					$sufwrender->compile($sunStyle->style_id, $this->template->template);
					$sufwrender->compile($sunStyle->style_id, $this->template->template, "layout");
				}
			}
		}
		catch (Exception $e)
		{
			throw new Exception( $e->getMessage());
		}

		// Set final response.
		$this->setResponse( array(
			'styleId'   => $styleId
		) );
	}

	/**
	 * Verify sample data installation request.
	 *
	 * @return  void
	 */
	protected function verify()
	{
		// Prepare input data.
		$this->template = $this->input->getString( 'template_name' , '' );
		$this->sample   = $this->input->getString( 'sample_package', '' );

		if ( empty( $this->template ) || empty( $this->sample ) )
		{
			throw new Exception( 'Invalid Parameter' );
		}

		// Get sample data definition.
		$defines = SunFwHelper::getSampleDataList( $this->template );

		foreach ( $defines as $define )
		{
			if ( $this->sample == $define['id'] )
			{
				$this->sample = $define;

				break;
			}
		}

		if ( ! is_array( $this->sample ) )
		{
			throw new Exception( 'Invalid Package' );
		}

		// Get template details.
		$this->template = SunFwRecognization::detect( $this->template );

		if ( ! $this->template ) {
			throw new Exception( 'Invalid Template' );
		}

		// Disable max execution time.
		if ( function_exists( 'set_time_limit' ) )
		{
			set_time_limit( 0 );
		}
	}

	/**
	 * Extract sample data package and load definition.
	 *
	 * @return  SimpleXMLElement
	 */
	protected function extract()
	{

		if ( ! isset( $this->xml ) )
		{

			// Look for sample data package in temporary directory.
			$tmpPath = JFactory::getConfig()->get( 'tmp_path' ) . "/{$this->template->id}/sample-data";

			if ( ! is_file( "{$tmpPath}.zip" ) )
			{
				throw new Exception( JText::_( 'Not found sample data package in temporary directory' ) );
			}

			// Extract sample data package.
			if ( ! JArchive::extract( "{$tmpPath}.zip", $tmpPath ) )
			{
				throw new Exception( JText::_( 'Failed to extract sample data package' ) );
			}

			$this->temporary_path = $tmpPath;

			// Look for sample data definition file.
			$xmlFiles = glob( "{$tmpPath}/*.xml" );

			if ( ! $xmlFiles || ! count( $xmlFiles ) )
			{
				throw new Exception( JText::_( 'Invalid sample data package' ) );
			}

			// Verify sample data definition.
			$xml        = simplexml_load_file( current( $xmlFiles ) );

			$tpl_id     = str_replace( array( ' ', 'jsn_' ), array( '_', 'tpl_', ), strtolower( ( string ) $xml['name'] ) );
			$tpl_ver    = ( string ) $xml['version'];
			$joomla_ver = ( string ) $xml['joomla-version'];

			if ( $tpl_id != $this->template->id )
			{
				throw new Exception(
					sprintf( "Sample data package, was made for <strong>%s</strong>, is not compatible with the template <strong>%s</strong>", ( string ) $xml['name'], $this->template->title )
				);
			}

			if ( version_compare( $this->template->version, $tpl_ver, '<' ) )
			{
				throw new Exception( sprintf( "The current template <strong>%s</strong> is outdated. Please update your template first", $this->template->title ) );
			}

			if ( ! empty( $joomla_ver ) )
			{
				$jversion = new JVersion;
				$jversion = $jversion->getShortVersion();

				if ( version_compare( $jversion, $joomla_ver, '<' ) )
				{
					throw new Exception( sprintf( "Sample data package requires Joomla version <strong>%s</strong>, but your Joomla version is <strong>%s</strong>.", $joomla_ver, $jversion ) );
				}
			}

			$this->xml = $xml;

		}
	}

	/**
	 * Backup the current Joomla database.
	 *
	 * @return  void
	 */
	protected function backupDatabase()
	{
		// Preset backup buffer.
		$buffer = '';

		// Generate file path to write SQL backup.
		$numb = 1;
		$file = JFactory::getConfig()->get( 'tmp_path' )
			. "/{$this->template->id}/{$this->sample['id']}/backups/original_data.sql";

		// Get all tables in Joomla database.
		$this->dbo->setQuery( 'SHOW TABLE STATUS;' );

		$tables = $this->dbo->loadObjectList();

		// Loop thru all tables to backup table structure and data.
		foreach ( $tables as $table )
		{
			// Create drop table statement.
			if ( empty( $table->Engine ) && $table->Comment == 'VIEW' )
			{
				$table   = $table->Name;
				$buffer .= ( empty( $buffer ) ? '' : "\n" ) . "DROP VIEW IF EXISTS `{$table}`;";
			} else {
				$table   = $table->Name;
				$buffer .= ( empty( $buffer ) ? '' : "\n" ) . "DROP TABLE IF EXISTS `{$table}`;";
			}

			// Re-create create table statement.
			$create = $this->dbo->getTableCreate( $table );

			$buffer .= "\n" . array_shift( $create ) . ';';

			// Get all table columns.
			$columns = '`' . implode( '`, `', array_keys( $this->dbo->getTableColumns( $table, false ) ) ) . '`';

			// Get the total number of row in the current table.
			$q = $this->dbo->getQuery( true );

			$q->select( 'COUNT(*)' )->from( $table )->where( '1' );

			$this->dbo->setQuery( $q );

			if ( $max = ( int ) $this->dbo->loadResult() )
			{
				for ( $offset = 0, $limit = 50; $max - $offset > 0; $offset += $limit )
				{
					// Query for all table data.
					$q = $this->dbo->getQuery( true );

					$q->select( '*' )->from( $table )->where( '1' );

					$this->dbo->setQuery( $q, $offset, $limit );

					if ( $rows = $this->dbo->loadRowList() )
					{
						$data = array();

						foreach ( $rows as $row )
						{
							$tmp = array();

							// Prepare data to create insert statement for each row.
							foreach ( $row as $value )
							{
								$tmp[] = $this->dbo->quote( $value );
							}

							$data[] = implode( ', ', $tmp );
						}

						// Create insert statement for fetched rows.
						$q = $this->dbo->getQuery( true );

						$q->insert( $table )->columns( $columns )->values( $data );

						// Store insert statement.
						$insert = "\n" . str_replace('),(', "),\n(", ( string ) $q ) . ';';

						// Write generated SQL statements to file if reached 2MB limit.
						if ( strlen( $buffer ) + strlen( $insert ) > 2097152 )
						{
							if ( ! JFile::write( $file, $buffer ) )
							{
								throw new Exception( JText::_( 'Failed to create database backup file' ) );
							}

							// Rename the current backup file if neccessary.
							if ( $numb == 1 )
							{
								JFile::move( $file, substr( $file, 0, -4 ) . '.01.sql' );
							}

							// Increase the total number of backup file.
							$numb++;

							// Generate new backup file name.
							$file = preg_replace( '/(\.\d+)*\.sql$/', '', $file )
								. '.' . ( $numb < 10 ? '0' : '' ) . $numb . '.sql';

							// Reset backup buffer.
							$buffer = trim( $insert );
						}
						else
						{
							$buffer .= $insert;
						}
					}
					else
					{
						break;
					}
				}
			}
		}

		if ( ! JFile::write( $file, $buffer ) )
		{
			throw new Exception( JText::_( 'Failed to create database backup file' ) );
		}

		// Get list of backup file.
		$files = glob( preg_replace( '/(\.\d+)*\.sql$/', '*.sql', $file ) );

		foreach ( $files as $k => $file )
		{
			// Create array of file name and content for making archive later.
			$files[ $k ] = array(
				'name' => basename( $file ),
				'data' => JFile::read( $file ),
			);
		}

		// Create backup archive.
		$archiver = new SunFwArchiveZip();
		$zip_path = JPATH_SITE . "/templates/{$this->template->template}/backups/{$this->sample['id']}";

		if ( ! JFolder::create( $zip_path ) )
		{
			throw new Exception( JText::sprintf(
				'SUNFW_CANNOT_CREATE_BACKUP_DIRECTORY',
				str_replace( JPATH_SITE, '', $zip_path )
			) );
		}

		$zip_path .= '/' . date( 'Y-m-d_H-i-s' ) . '.zip';

		if ( ! $archiver->create( $zip_path, $files ) )
		{
			throw new Exception( JText::sprintf(
				'Failed to create database backup file at <strong>%1$s</strong>.',
				str_replace( JPATH_SITE, '', $zip_path )
			) );
		}
	}

	/**
	 * Backup data for 3rd-party extensions.
	 *
	 * @return  void
	 */
	protected function backupThirdPartyModules()
	{
		$builtInModules = array(
			'mod_login', 'mod_stats', 'mod_users_latest',
			'mod_footer', 'mod_stats', 'mod_menu', 'mod_articles_latest', 'mod_languages', 'mod_articles_category',
			'mod_whosonline', 'mod_articles_popular', 'mod_articles_archive', 'mod_articles_categories',
			'mod_articles_news', 'mod_related_items', 'mod_search', 'mod_random_image', 'mod_banners',
			'mod_wrapper', 'mod_feed', 'mod_breadcrumbs', 'mod_syndicate', 'mod_custom', 'mod_weblinks'
		);

		$q = $this->dbo->getQuery( true );

		$q
			->select( '*' )
			->from( '#__modules' )
			->where( sprintf( 'module NOT IN (\'%s\')', implode( '\', \'', $builtInModules ) ) )
			->where( 'id NOT IN (2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 70)' )
			->order( 'client_id ASC' );

		$this->dbo->setQuery( $q );

		$this->temporaryModules = $this->dbo->loadAssocList();
	}

	/**
	 * Backup menu assignment for 3rd-party admin modules.
	 *
	 * @return  void
	 */
	protected function backupThirdPartyAdminModules()
	{
		$builtInModules = array(
			'mod_login', 'mod_stats', 'mod_users_latest',
			'mod_footer', 'mod_stats', 'mod_menu', 'mod_articles_latest', 'mod_languages', 'mod_articles_category',
			'mod_whosonline', 'mod_articles_popular', 'mod_articles_archive', 'mod_articles_categories',
			'mod_articles_news', 'mod_related_items', 'mod_search', 'mod_random_image', 'mod_banners',
			'mod_wrapper', 'mod_feed', 'mod_breadcrumbs', 'mod_syndicate', 'mod_custom', 'mod_weblinks'
		);

		$q = $this->dbo->getQuery( true );

		$q
			->select( 'id' )
			->from( '#__modules' )
			->where( 'module NOT IN ("' . implode( '", "', $builtInModules ) . '")' )
			->where( 'client_id = 1' );

		$this->dbo->setQuery( $q );

		if ( $results = $this->dbo->loadColumn() )
		{
			$q = $this->dbo->getQuery( true );

			$q
				->select( '*' )
				->from( '#__modules_menu' )
				->where( 'moduleid IN ("' . implode( '", "', $results ) . '")' );

			$this->dbo->setQuery( $q );

			$this->temporaryAdminModules = $this->dbo->loadAssocList();
		}
	}

	/**
	 * Backup menus data for 3rd-party extensions.
	 *
	 * @return  void
	 */
	protected function backupThirdPartyMenus()
	{
		$q = $this->dbo->getQuery( true );

		$q
			->select( '*' )
			->from( '#__menu' )
			->where( 'client_id=1' )
			->where( 'parent_id=1' )
			->order( 'id ASC' );

		$this->dbo->setQuery( $q );

		$this->temporaryMenus = array();

		foreach ( $this->dbo->loadAssocList() as $row )
		{
			// Fetch children menus.
			$q = $this->dbo->getQuery( true );

			$q
				->select( '*' )
				->from( '#__menu' )
				->where( 'client_id=1' )
				->where( 'parent_id=' . $row['id'] )
				->order( 'lft' );

			$this->dbo->setQuery( $q );

			$childrenMenus = $this->dbo->loadAssocList();

			// Save temporary menus data.
			$this->temporaryMenus[] = array(
				'data'     => $row,
				'children' => $childrenMenus,
			);
		}
	}

	/**
	 * Remove all 3rd-party modules in administrator.
	 *
	 * @return  void
	 */
	protected function deleteThirdPartyAdminModules()
	{
		$q = $this->dbo->getQuery( true );

		$q
			->delete( '#__modules' )
			->where( 'id NOT IN (2, 3, 4, 8, 9, 10, 12, 13, 14, 15)' )
			->where( 'client_id = 1' );

		$this->dbo->setQuery( $q );

		if ( ! $this->dbo->execute() )
		{
			throw new Exception( $this->dbo->getErrorMsg() );
		}
	}

	/**
	 * Copy sample image if has
	 *
	 * @return void
	 */
	protected function copySampleImage()
	{
		$sample 		=  $this->temporary_path . "/images/joomlashine/sample";
		$placeholder 	=  $this->temporary_path . "/images/joomlashine/placeholder";

		if (JFolder::exists($sample))
		{
			try
			{
				JFolder::copy($sample, JPATH_ROOT . '/images/joomlashine/sample', '', true);
			}
			catch (Exception $e)
			{

			}
		}

		if (JFolder::exists($placeholder))
		{
			try
			{
				JFolder::copy($placeholder, JPATH_ROOT . '/images/joomlashine/placeholder', '', true);
			}
			catch (Exception $e)
			{

			}
		}
	}

	/**
	 * Restore data for 3rd-party extensions.
	 *
	 * @return  void
	 */
	protected function restoreThirdPartyData()
	{
		// Preset an array to hold module id mapping.
		$moduleIdMapping = array();

		// Restore 3rd-party modules.
		foreach ( $this->temporaryModules as $module )
		{
			// Store old module id.
			$oldModuleId = $module['id'];

			// Unset old module id to create new record.
			unset( $module['id'] );

			$tblModule = JTable::getInstance( 'module' );
			$tblModule->bind( $module );

			// Disable all restored front-end modules.
			$tblModule->client_id == 1 OR $tblModule->published = 0;

			if ( ! $tblModule->store() )
			{
				if ( $tblModule->getDbo()->getErrorMsg() != '' )
				{
					throw new Exception( $tblModule->getDbo()->getErrorMsg() );
				}
				else
				{
					throw new Exception(
						JText::sprintf( 'SUNFW_FAILED_TO_EXECUTE_SQL_QUERY', ( string ) $tblModule->getDbo()->getQuery() )
					);
				}
			}

			// Map new id to old module id.
			$moduleIdMapping[ $oldModuleId ] = isset( $tblModule->id ) ? $tblModule->id : $this->dbo->insertid();
		}

		// Restore menu assignment for 3rd-party admin modules.
		foreach ( $this->temporaryAdminModules as $module )
		{
			if ( isset( $moduleIdMapping[ $module['moduleid'] ] ) )
			{
				$q = $this->dbo->getQuery( true );

				$q
					->insert( '#__modules_menu' )
					->columns( 'moduleid, menuid' )
					->values( $moduleIdMapping[ $module['moduleid'] ] . ', ' . $module['menuid'] );

				$this->dbo->setQuery( $q );

				try
				{
					$this->dbo->execute();
				}
				catch ( Exception $e )
				{
					// Do nothing
				}
			}
		}

		// Restore administrator menu.
		foreach ( $this->temporaryMenus as $menu )
		{
			unset( $menu['data']['id'] );

			$mainmenu = JTable::getInstance( 'menu' );

			$mainmenu->setLocation( 1, 'last-child' );
			$mainmenu->bind( $menu['data'] );

			if ( ! $mainmenu->store() )
			{
				if ( $mainmenu->getDbo()->getErrorMsg() != '' )
				{
					throw new Exception( $mainmenu->getDbo()->getErrorMsg() );
				}
				else
				{
					throw new Exception(
						JText::sprintf( 'SUNFW_FAILED_TO_EXECUTE_SQL_QUERY', ( string ) $mainmenu->getDbo()->getQuery() )
					);
				}
			}

			if ( ! empty( $menu['children'] ) )
			{
				foreach ( $menu['children'] as $children )
				{
					$children['id'       ] = null;
					$children['parent_id'] = $mainmenu->id;

					$submenu = JTable::getInstance( 'menu' );

					$submenu->setLocation( $mainmenu->id, 'last-child' );
					$submenu->bind( $children );

					if ( ! $submenu->store() )
					{
						if ( $submenu->getDbo()->getErrorMsg() != '' )
						{
							throw new Exception( $submenu->getDbo()->getErrorMsg() );
						}
						else
						{
							throw new Exception(
								JText::sprintf( 'SUNFW_FAILED_TO_EXECUTE_SQL_QUERY', ( string ) $submenu->getDbo()->getQuery() )
							);
						}
					}
				}
			}
		}
	}

	/**
	 * Rebuild menu structure.
	 *
	 * @return  boolean
	 */
	protected function rebuildMenus()
	{
		$table = JTable::getInstance( 'Menu', 'JTable' );

		if ( ! $table->rebuild() )
		{
			if ( $table->getDbo()->getErrorMsg() != '' )
			{
				throw new Exception( $table->getDbo()->getErrorMsg() );
			}
			else
			{
				throw new Exception(
					JText::sprintf( 'SUNFW_FAILED_TO_EXECUTE_SQL_QUERY', ( string ) $table->getDbo()->getQuery() )
				);
			}
		}

		$q = $this->dbo->getQuery( true );

		$q
			->select( 'id, params' )
			->from( '#__menu' )
			->where( 'params NOT LIKE ' . $this->dbo->quote( '{%' ) )
			->where( 'params <> ' . $this->dbo->quote( '' ) );

		$this->dbo->setQuery( $q );

		$items = $this->dbo->loadObjectList();

		if ( $error = $this->dbo->getErrorMsg() )
		{
			throw new Exception( $error );
		}

		foreach ( $items as & $item )
		{
			$registry = new JRegistry;

			$registry->loadString( $item->params );

			$q = $this->dbo->getQuery( true );

			$q
				->update( '#__menu' )
				->set( 'params = ' . $q->quote( ( string ) $registry ) )
				->where( 'id = ' . ( int ) $item->id );

			$this->dbo->setQuery( $q );

			if ( ! $this->dbo->execute() )
			{
				throw new Exception( $this->dbo->getErrorMsg() );
			}

			unset( $registry );
		}

		// Clean the cache.
		$this->cleanCache( 'com_modules' );
		$this->cleanCache( 'mod_menu' );

		return true;
	}

	/**
	 * Clean cache data for an extension.
	 *
	 * @param   string  $extension  Name of extension to clean cache.
	 *
	 * @return  void
	 */
	protected function cleanCache( $extension )
	{
		$options = array(
			'defaultgroup' => $extension,
			'cachebase'    => JFactory::getConfig()->get( 'cache_path', JPATH_SITE . '/cache' )
		);

		$cache = JCache::getInstance( 'callback', $options );

		$cache->clean();
	}
}