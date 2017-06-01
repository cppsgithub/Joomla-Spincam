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
class SunFwAjaxSampleData extends SunFwAjax
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
    public function downloadPackageAction()
    {
        try
        {
            // Verify request.
            $this->verify();

            // Generate path to store sample data package.
            $tmpPath = JFactory::getConfig()->get( 'tmp_path' ) . "/{$this->template->id}/sample-data.zip";
            $task    = $this->input->getCmd('task', 'download');

            if ( in_array( $task, array('download', 'status') ) )
            {
                $downloader = new SunFwWidgetDownloader;

                if ( ! $downloader->indexAction($this->sample['download'], $tmpPath) )
                {
                	throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_SAMPLE_DATA' ) );
                }
            }
            elseif ( ! JFile::exists($tmpPath) )
            {
                throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_SAMPLE_DATA' ) );
            }

            // Get extensions.
            $extensions = $this->getExtensions();

            // Get 3rd-extensions
            $thirdExtensions = $this->get3rdExtensions();

            $extensions = array_merge($extensions, $thirdExtensions);

            $this->setResponse( $extensions );
        }
        catch ( Exception $e )
        {
            throw $e;
        }
    }

    /**
     * Upload sample data package.
     *
     * @return  void
     */
    public function uploadPackageAction()
    {
        try
        {
            // Verify request.
            $this->verify();

            // Verify uploaded file.
            if ( ! isset( $_FILES['package'] ) )
            {
                throw new Exception( JText::_( 'SUNFW_FAILED_TO_UPLOAD_SAMPLE_DATA' ) );
            }

            // Verify file type.
            if ( ! preg_match( '/.zip$/i', $_FILES['package']['name'] ) )
            {
                throw new Exception( JText::_( 'SUNFW_FAILED_TO_UPLOAD_SAMPLE_DATA' ) );
            }

            // Generate path to store sample data package.
            $tmpPath = JFactory::getConfig()->get( 'tmp_path' ) . "/{$this->template->id}/sample-data.zip";

            if ( ! move_uploaded_file( $_FILES['package']['tmp_name'], $tmpPath ) )
            {
                throw new Exception( JText::_( 'SUNFW_FAILED_TO_MOVE_SAMPLE_DATA' ) );
            }

            // Get extensions.
            $extensions = $this->getExtensions();

            // Get 3rd-extensions
            $thirdExtensions = $this->get3rdExtensions();

            $extensions = array_merge($extensions, $thirdExtensions);

            $this->setResponse( $extensions );
        }
        catch ( Exception $e )
        {
            throw $e;
        }
    }

    /**
     * Install an extension.
     *
     * @return  void
     */
    public function installExtensionAction($id = null)
    {
        try
        {
            // Verify request.
            $this->verify();

            // Extract sample data.
            $this->extract();

            // Get extension to install.
            if ( empty( $id ) )
            {
                $id = $this->input->getString( 'id' );
            }

            // Get necessary variables.
            $config  = JFactory::getConfig();
            $user    = JFactory::getUser();

            // Disable debug system.
            $config->set( 'debug', 0 );

            // Get extension details.
            $extension = $this->xml->xpath( "//extension[@identifiedname=\"{$id}\"]" );

            if ( ! $extension || ! count( $extension ) )
            {
                $extension = $this->xml->xpath( "//extension//dependency//parameter[@identifiedname=\"{$id}\"]" );
            }

            if ( ! $extension || ! count( $extension ) )
            {
                throw new Exception( 'Invalid Parameter' );
            }

            $extension = current( $extension );

            $name = ( string ) $extension['name'];
            $type = ( string ) $extension['type'];

            switch ( $type )
            {
                case 'component':
                    $name = 'com_' . $name;
                    break;

                case 'module':
                    $name = 'mod_' . $name;
                    break;

                case 'plugin':
                    $name = 'plg_' . $name;
                    break;
            }

            // Clean up all junk data left by the extension.
            $this->cleanExtensionJunk( $name );

            // Install JSN Extension Framework if not already installed.
            if ( $type == 'component' )
            {
                // Get details about JSN Extension Framework.
                $extfw = $this->xml->xpath( '//extension[@identifiedname="ext_framework"]' );

                if ( $extfw && count( $extfw ) )
                {
                    $extfw = current( $extfw );
                    $state = $this->getExtensionState(
                        ( string ) $extfw['name'],
                        ( string ) $extfw['version'],
                        false,
                        'plugin-system'
                    );

                    if ( $state != 'installed' )
                    {
                        // Install JSN Extension Framework.
                        $this->installExtensionAction( 'ext_framework' );
                    }
                }
            }

            // Download package from JoomlaShine server.
            if (( string ) $extension['author'] == '3rd')
            {
                $packageFile = SunFwApiLightcart::download3rdPackage(
                    $id, ( string ) $extension['version'],( string ) $extension['parentidentifiedname'], $config->get( 'tmp_path' ) . "/{$this->template->id}/"
                );
            }
            else
            {
                $packageFile = SunFwApiLightcart::downloadPackage(
                    $id, 'FREE', null, null, $config->get( 'tmp_path' ) . "/{$this->template->id}/"
                );
            }

            if ( ! is_file( $packageFile ) )
            {
                throw new Exception( sprintf(
                        JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_EXTENSION_PACKAGE' ), ( string ) $extension['description'] )
                );
            }

            // Load extension installation library.
            jimport( 'joomla.installer.helper' );

            // Rebuild menu structure.
            $this->rebuildMenus();

            // Extract downloaded package.
            $unpackedInfo = JInstallerHelper::unpack( $packageFile );
            $installer = JInstaller::getInstance();

            if ( empty( $unpackedInfo ) || ! isset( $unpackedInfo['dir'] ) )
            {
                throw new Exception( sprintf(
                        JText::_('SUNFW_FAILED_TO_EXTRACT_EXTENSION_PACKAGE' ), ( string ) $extension['description'] )
                );
            }

            // Install extracted package.
            $installResult = $installer->install( $unpackedInfo['dir'] );

            if ( $installResult === false )
            {
                foreach ( JError::getErrors() as $e )
                {
                    throw $e;
                }
            }

            // Clean up temporary data.
            JInstallerHelper::cleanupInstall( $packageFile, $unpackedInfo['dir'] );

            $this->activateExtension(
                array(
                    'type' => $type,
                    'name' => $name
                )
            );

            // Rebuild menu structure.
            $this->rebuildMenus();
        }
        catch ( Exception $e )
        {
            throw $e;
        }
    }

    /**
     * Import sample data package.
     *
     * @return  void
     */
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

            if(count($databaseVersion))
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

            // Loop thru all 3rd-party extensions get installation state.
            $thirdPartyExtensions = array();
            $thirdPartyExtErrors  = array();

            foreach ( $this->xml->xpath( '//extension[@author="3rd_party"]' ) as $component )
            {
                if ( isset( $component['author'] ) && $component['author'] == '3rd_party' )
                {
                    $attrs = ( array ) $component->attributes();
                    $attrs = $attrs['@attributes'];

                    $extensionType = ( string ) $attrs['type'];
                    $namePrefix    = array( 'component' => 'com_', 'module' => 'mod_' );
                    $componentName = isset( $namePrefix[ $extensionType ] )
                        ? $namePrefix[ $extensionType ] . $attrs['name']
                        : ( string ) $attrs['name'];

                    $state = $this->getExtensionState(
                        $componentName,
                        ( string ) $attrs['version'],
                        true,
                        ( string ) $attrs['type']
                    );

                    $thirdPartyExtensions[] = array(
                        'id'        => ( string ) $attrs['name'],
                        'state'     => $state,
                        'full_name' => ( string ) $attrs['full_name'],
                        'version'   => ( string ) $attrs['version'],
                        'type'      => $extensionType,
                    );
                }
            }

            if ( count( $thirdPartyExtensions ) )
            {
                foreach ( $thirdPartyExtensions as $thirdPartyExtension )
                {
                    if ( $thirdPartyExtension['state'] == 'install' )
                    {
                        $thirdPartyExtErrors[] = JText::sprintf(
                            'SUNFW_ERROR_3RD_PARTY_EXTENSION_NOT_INSTALLED',
                            strtoupper( $thirdPartyExtension['full_name'] ) . ' ' . $thirdPartyExtension['type'],
                            $thirdPartyExtension['version']
                        );
                    }
                    elseif ( $thirdPartyExtension['state'] == 'update' )
                    {
                        $thirdPartyExtErrors[] = JText::sprintf(
                            'SUNFW_ERROR_3RD_PARTY_EXTENSION_NEED_TO_UPDATE',
                            strtoupper( $thirdPartyExtension['full_name'] ) . ' ' . $thirdPartyExtension['type'],
                            $thirdPartyExtension['version']
                        );
                    }
                    elseif( $thirdPartyExtension['state'] == 'unsupported' )
                    {
                        $thirdPartyExtErrors[] = JText::sprintf(
                            'SUNFW_ERROR_3RD_PARTY_EXTENSION_NOT_SUPPORTED',
                            strtoupper( $thirdPartyExtension['full_name'] ) . ' ' . $thirdPartyExtension['type'],
                            $thirdPartyExtension['version']
                        );
                    }
                }
            }

            if ( count( $thirdPartyExtErrors ) )
            {
                $thirdPartyExtErrorMessage = '<ul>';

                foreach ( $thirdPartyExtErrors as $thirdPartyExtensionError )
                {
                    $thirdPartyExtErrorMessage .= '<li>' . $thirdPartyExtensionError . '</li>';
                }

                $thirdPartyExtErrorMessage .= '</ul>';

                throw new Exception( JText::sprintf( 'SUNFW_ERROR_3RD_PARTY_EXTENSION', $thirdPartyExtErrorMessage ) );
            }

            // Temporary backup data.
            $this->backupThirdPartyModules();
            $this->backupThirdPartyAdminModules();
            $this->backupThirdPartyMenus();

            // Delete admin modules.
            $this->deleteThirdPartyAdminModules();

            // Loop thru all extensions to import data.
            $attentions = array();

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

                    if ( $canInstall == false && $extensionType == 'component' )
                    {
                        // Add to attention list when extension is not installed
                        $attentions[] = array(
                            'id'   => ( string ) $extension['name'],
                            'name' => ( string ) $extension['description'],
                            'url'  => ( string ) $extension['producturl'],
                            'author'  => ( string ) $extension['author'],
                        );
                    }
                }
                elseif ( $extension['type'] == 'component' )
                {
                    // Check if 3rd-party component is installed.
                    $canInstall = SunFwHelper::isExtensionInstalled( $extensionName );

                    if ( ! $canInstall )
                    {
                        // Add to attention list.

                        $tmpAttentions = array(
                            'id'      			=> ( string ) $extension['name'],
                            'name'    			=> ( string ) $extension['title'],
                            'url' 	  			=> ( string ) $extension['producturl'],
                            'author'  			=> ( string ) $extension['author'],
                            'autoinstall' 	  	=> ( string ) $extension['autoinstall'],
                            'commercial' 	  	=> ( string ) $extension['commercial'],
                            'modules' 			=> $extension->xpath( 'modules/module' ),
                            'plugins' 			=> $extension->xpath( 'plugins/plugin' ),
                            'display' 			=> count( $queries ) ? true : false,
                            'version' 			=> JText::sprintf('SUNFW_SAMPLE_DATA_SUGGEST_SUPPORTED_VERSION', ( string ) $extension['version']),
                        );

                        if (( string ) $extension['author'] == '3rd' && ( string ) $extension['commercial'] == 'false')
                        {
                        	if ( empty($tmpAttentions['url']) ) {
                        		$tmpAttentions['url'] = $this->get3rdPackageURL(( string ) $extension['identifiedname'], ( string ) $extension['version'], ( string ) $extension['parentidentifiedname']);
                        	}
                        }

                        $attentions[]	= $tmpAttentions;
                    }
                    else
                    {
                        // Verify installed 3rd-party extension's version.
                        $state = $this->getExtensionState( $extensionName, ( string ) $extension['version'], true );

                        if ( 'update' == $state )
                        {
                            // Add to attention list.
                            $tmpAttentions = array(
                                'id'     			=> ( string ) $extension['name'],
                                'name'   			=> ( string ) $extension['title'],
                                'url' 	  			=> ( string ) $extension['producturl'],
                                'author' 			=> ( string ) $extension['author'],
                                'autoinstall' 		=> ( string ) $extension['autoinstall'],
                                'commercial' 	  	=> ( string ) $extension['commercial'],
                                'modules' 			=> $extension->xpath( 'modules/module' ),
                                'plugins' 			=> $extension->xpath( 'plugins/plugin' ),
                                'message' 			=> JText::sprintf(
                                    'SUNFW_UPDATE_3RD_PARTY_EXTENSION_FIRST',
                                    $this->getExtensionVersion( $extensionName ),
                                    ( string ) $extension['version']
                                ),
                                'display' => count( $queries ) ? true : false,
                                'outdate' => true,
                            );

                            if (( string ) $extension['author'] == '3rd' && ( string ) $extension['commercial'] == 'false')
                            {
                            	if ( empty($tmpAttentions['url']) ) {
                            		$tmpAttentions['url'] = $this->get3rdPackageURL(( string ) $extension['identifiedname'], ( string ) $extension['version'], ( string ) $extension['parentidentifiedname']);
                            	}
                            }

                            $attentions[] = $tmpAttentions;
                            $canInstall = false;
                        }
                        elseif ( 'unsupported' == $state )
                        {
                            // Add to attention list.
                            $tmpAttentions = array(
                                'id'      => ( string ) $extension['name'],
                                'name'    => ( string ) $extension['title'],
                                'url' 	  => ( string ) $extension['producturl'],
                                'author'  => ( string ) $extension['author'],
                                'autoinstall' 	  => ( string ) $extension['autoinstall'],
                                'commercial' 	  => ( string ) $extension['commercial'],
                                'modules' => $extension->xpath( 'modules/module' ),
                                'plugins' => $extension->xpath( 'plugins/plugin' ),
                                'message' => JText::sprintf(
                                    'SUNFW_UNSUPPORTED_3RD_PARTY_EXTENSION_VERSION',
                                    $this->getExtensionVersion( $extensionName ),
                                    ( string ) $extension['version']
                                ),
                                'display' => count( $queries ) ? true : false,
                                'outdate' => true,
                            );


                            if (( string ) $extension['author'] == '3rd' && ( string ) $extension['commercial'] == 'false')
                            {
                            	if ( empty($tmpAttentions['url']) ) {
                            		$tmpAttentions['url'] = $this->get3rdPackageURL(( string ) $extension['identifiedname'], ( string ) $extension['version'], ( string ) $extension['parentidentifiedname']);
                            	}
                            }
                            $attentions[] = $tmpAttentions;
                            $canInstall = false;
                        }
                        else
                        {
                            // Make sure all required modules are installed also.
                            $missing = array();

                            foreach ( $extension->xpath('modules/module') as $module )
                            {
                                if ( ! @is_dir( JPATH_ROOT . '/modules/' . ( string ) $module ) )
                                {
                                    if ( ( string ) $module['title'] != '' )
                                    {
                                        $missing[] = ( string ) $module['title'];
                                    }
                                }
                            }

                            foreach ( $extension->xpath('plugins/plugin') as $plugin )
                            {
                                if ( ! @is_dir( JPATH_ROOT . '/plugins/' . ( string ) $plugin['group'] . '/' . ( string ) $plugin ) )
                                {
                                    if ( ( string ) $plugin['title'] != '' )
                                    {
                                        $missing[] = ( string ) $plugin['title'];
                                    }
                                }
                            }

                            if ( count( $missing ) )
                            {
                                // Add to attention list.
                                $tmpAttentions = array(
                                    'id'      => ( string ) $extension['name'],
                                    'name'    => ( string ) $extension['title'],
                                    'url' 	  => '',
                                    'author'  => ( string ) $extension['author'],
                                    'modules' => $extension->xpath( 'modules/module' ),
                                    'plugins' => $extension->xpath( 'plugins/plugin' ),
                                    'missing' => $missing,
                                    'message' => JText::_( 'SUNFW_MISSING_3RD_PARTY_EXTENSION_DEPENDENCIES' ),
                                    'display' => count( $queries ) ? true : false,
                                );
                                $attentions[] = $tmpAttentions;
                                $canInstall = false;
                            }
                        }
                    }
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
                                                throw new Exception( JText::_( 'SUNFW_FAILED_TO_STORE_DOWNLOADED_FILE' ) );
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

                    // Update component ID for linked menu items.
                    if ( $extension['type'] == 'component' )
                    {
                        // Get component ID.
                        $q = $this->dbo->getQuery( true );

                        $q
                            ->select( 'extension_id' )
                            ->from( '#__extensions' )
                            ->where( 'type = ' . $q->quote( 'component' ) )
                            ->where( 'element = ' . $q->quote( $extensionName ) );

                        $this->dbo->setQuery( $q );

                        $component_id = $this->dbo->loadResult();

                        // Update component ID for all menu items that link to this component.
                        $q = $this->dbo->getQuery( true );

                        $q
                            ->update( '#__menu' )
                            ->set( 'component_id = ' . $q->quote( $component_id ) )
                            ->where( 'type = ' . $q->quote( 'component' ) )
                            ->where( "link LIKE 'index.php?option={$extensionName}&%'" );

                        $this->dbo->setQuery( $q );

                        if ( ! $this->dbo->execute() )
                        {
                            throw new Exception( $this->dbo->getErrorMsg() );
                        }
                    }

                    // Copy images if has.
                    if (
                        isset( $extension['images'] )
                        &&
                        @is_dir( $this->temporary_path . '/' . ( string ) $extension['images'] )
                    )
                    {
                        // Backup existing folder.
                        JFolder::move(
                            JPATH_ROOT . '/' . ( string ) $extension['images'],
                            JPATH_ROOT . '/' . ( string ) $extension['images'] . '-backup-' . date('y-m-d_H-i-s')
                        );

                        // Delete current folder.
                        JFolder::delete( JPATH_ROOT . '/' . ( string ) $extension['images'] );

                        // Move sample images folder.
                        JFolder::move(
                            $this->temporary_path . '/' . ( string ) $extension['images'],
                            JPATH_ROOT . '/' . ( string ) $extension['images']
                        );
                    }

                    // Download and install extended style if has.
                    if ( isset( $extension['ext-style-package'] ) )
                    {
                        // Download extended style package.
                        $fileUrl = 'https://www.joomlashine.com/index.php?option=com_lightcart'
                            . '&controller=remoteconnectauthentication&task=authenticate'
                            . '&tmpl=component&upgrade=yes&identified_name=ext_style&edition='
                            . '&joomla_version=' . SunFwHelper::getJoomlaVersion( 2 )
                            . '&file_attr='
                            . '{"identified_template_name":"' . $this->template->id . '"'
                            . ',"ext_style":"' . ( string ) $extension['ext-style-package'] . '"}';

                        // Download file to temporary folder.
                        $data = $http->get( $fileUrl );
                        $path = $config->get( 'tmp_path' ) . "/{$this->template->id}/"
                            . ( string ) $extension['ext-style-package'] . '_ext_style.zip';

                        // Check download response headers.
                        if ( $data->headers['Content-Type'] != 'application/zip' )
                        {
                            throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_EXTENDED_STYLE_PACKAGE' ) . '<br/>' . $fileUrl );
                        }

                        // Write downloaded data to local file.
                        if ( ! JFile::write( $path, $data->body ) )
                        {
                            throw new Exception( JText::_( 'SUNFW_FAILED_TO_STORE_DOWNLOADED_FILE' ) );
                        }

                        // Install extended style.
                        JArchive::extract( $path, JPATH_ROOT . '/' . ( string ) $extension['ext-style-path'] );

                        // Fix for old extended style package of OS Property.
                        if ( false !== strpos( ( string ) $extension['ext-style-path'], '/com_osproperty/' ) )
                        {
                            $tpl = $this->template->template;

                            if ( @file_exists(
                                JPATH_ROOT . '/' . ( string ) $extension['ext-style-path'] . "/{$tpl}/template.xml"
                            ) )
                            {
                                JFile::copy(
                                    JPATH_ROOT . '/' . ( string ) $extension['ext-style-path'] . "/{$tpl}/template.xml",
                                    JPATH_ROOT . '/' . ( string ) $extension['ext-style-path'] . "/{$tpl}/{$tpl}.xml"
                                );
                            }
                        }
                    }

                    // Manipulate data for K2.
                    if ( 'com_k2' == $extensionName )
                    {
                        // Update user mapping for K2 items table.
                        $user = JFactory::getUser();
                        $q    = $this->dbo->getQuery( true );

                        $q->update( '#__k2_items' )->set( 'created_by = ' . $q->quote( $user->id ) );

                        $this->dbo->setQuery( $q );

                        if ( ! $this->dbo->execute() )
                        {
                            throw new Exception( $this->dbo->getErrorMsg() );
                        }

                        // Update user mapping for K2 users table.
                        $q = $this->dbo->getQuery( true );

                        $q->update( '#__k2_users' )->set( 'userID = ' . $q->quote( $user->id ) );

                        $this->dbo->setQuery( $q );

                        if ( ! $this->dbo->execute() )
                        {
                            throw new Exception( $this->dbo->getErrorMsg() );
                        }

                        // Update user mapping for K2 comments table.
                        $q = $this->dbo->getQuery( true );

                        $q->update( '#__k2_comments' )->set( 'userID = ' . $q->quote( $user->id ) );

                        $this->dbo->setQuery( $q );

                        if ( ! $this->dbo->execute() )
                        {
                            throw new Exception( $this->dbo->getErrorMsg() );
                        }

                        // Update user mapping for K2 items table.
                        $q = $this->dbo->getQuery( true );

                        $q->update( '#__k2_items' )->set( 'modified_by = ' . $q->quote( $user->id ) );

                        $this->dbo->setQuery( $q );

                        if ( ! $this->dbo->execute() )
                        {
                            throw new Exception( $this->dbo->getErrorMsg() );
                        }
                    }

                    // Manipulate data for OS Property.
                    if ( 'com_osproperty' == $extensionName )
                    {
                        // Update user mapping for agents table.
                        $user = JFactory::getUser();
                        $q    = $this->dbo->getQuery( true );

                        $q->update( '#__osrs_agents' )->set( 'user_id = ' . $q->quote( $user->id ) );

                        $this->dbo->setQuery( $q );

                        if ( ! $this->dbo->execute() )
                        {
                            throw new Exception( $this->dbo->getErrorMsg() );
                        }
                    }

                    // Unpublish menu item replacement published before.
                    if ( isset( $extension['menu-replacement'] ) )
                    {
                        $items = array_map( 'intval', explode( ',', ( string ) $extension['menu-replacement'] ) );
                        $q     = $this->dbo->getQuery( true );

                        $q
                            ->update( '#__menu')
                            ->set( 'published = 0' )
                            ->where( 'id IN (' . implode( ', ', $items ) . ')' )
                            ->where( 'published = 1' );

                        $this->dbo->setQuery( $q );

                        if ( ! $this->dbo->execute() )
                        {
                            throw new Exception( $this->dbo->getErrorMsg() );
                        }
                    }

                    // Unpublish module replacement published before.
                    if ( isset( $extension['module-replacement'] ) )
                    {
                        $items = array_map( 'intval', explode( ',', ( string ) $extension['module-replacement'] ) );
                        $q     = $this->dbo->getQuery( true );

                        $q
                            ->update( '#__modules' )
                            ->set( 'published = 0' )
                            ->where( 'id IN (' . implode( ', ', $items ) . ')' )
                            ->where( 'published = 1' );

                        $this->dbo->setQuery($q);

                        if ( ! $this->dbo->execute() )
                        {
                            throw new Exception( $this->dbo->getErrorMsg() );
                        }
                    }
                }
                else
                {
                    // Check if sample data contains menu item replacement for use when extension is missing.
                    if ( isset( $extension['menu-replacement'] ) )
                    {
                        if ( isset( $menu_replacement ) )
                        {
                            $menu_replacement = array_merge(
                                $menu_replacement,
                                array_map( 'intval', explode( ',', ( string ) $extension['menu-replacement'] ) )
                            );
                        }
                        else
                        {
                            $menu_replacement = array_map(
                                'intval', explode( ',', ( string ) $extension['menu-replacement'] )
                            );
                        }
                    }

                    // Check if sample data contains module replacement for use when extension is missing.
                    if ( isset( $extension['module-replacement'] ) )
                    {
                        if ( isset( $module_replacement ) )
                        {
                            $module_replacement = array_merge(
                                $module_replacement,
                                array_map( 'intval', explode( ',', ( string ) $extension['module-replacement'] ) )
                            );
                        }
                        else
                        {
                            $module_replacement = array_map(
                                'intval', explode( ',', ( string ) $extension['module-replacement'] )
                            );
                        }
                    }
                }
            }

            // Publish menu item replacement.
            if ( isset( $menu_replacement ) )
            {
                $q = $this->dbo->getQuery( true );

                $q
                    ->update( '#__menu' )
                    ->set( 'published = 1' )
                    ->where( 'id IN (' . implode( ', ', $menu_replacement ) . ')' );

                $this->dbo->setQuery( $q );

                if ( ! $this->dbo->execute() )
                {
                    throw new Exception( $this->dbo->getErrorMsg() );
                }
            }

            // Publish module replacement.
            if ( isset( $module_replacement ) )
            {
                $q = $this->dbo->getQuery( true );

                $q
                    ->update( '#__modules' )
                    ->set( 'published = 1' )
                    ->where( 'id IN (' . implode( ', ', $module_replacement ) . ')' );

                $this->dbo->setQuery( $q );

                if ( ! $this->dbo->execute() )
                {
                    throw new Exception( $this->dbo->getErrorMsg() );
                }
            }

            // Restore styles backup.
            if ( isset( $stylesBackup ) )
            {
                foreach ( $stylesBackup as $style )
                {
                    // Check if style record is replaced by sample data.
                    $style = ( array ) $style;
                    $q     = $this->dbo->getQuery( true );

                    $q
                        ->select( 'id' )
                        ->from( '#__template_styles' );

                    foreach ( $style as $key => $val )
                    {
                        $q->where( "`{$key}` = " . $this->dbo->quote( $val ) );
                    }

                    $this->dbo->setQuery( $q );

                    if ( ! $this->dbo->loadResult() )
                    {
                        // Clear previous ID and home status.
                        unset( $style['id'  ] );
                        unset( $style['home'] );

                        // Build insert query.
                        $q = $this->dbo->getQuery( true );

                        $q
                            ->insert( '#__template_styles' )
                            ->columns( array_keys( $style ) )
                            ->values( '"' . implode( '","', array_values( $style )) . '"');
                        $this->dbo->setQuery( $q );
                        $this->dbo->execute();
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
        //$tmpPath = $config->get( 'tmp_path' ) . "/{$this->template->id}/sample-data";

        //JInstallerHelper::cleanupInstall( "$tmpPath.zip", $tmpPath );

        // Clean up junk data for extension that is not installed.

        if ( count( $attentions ) )
        {
            foreach ( $attentions as $i => $attention )
            {
                // Clean up junk data imported during sample data installation.
                $this->cleanExtensionJunk(
                    'com_' . $attention['id'],
                    isset( $attention['modules'] ) ? $attention['modules'] : null,
                    isset( $attention['plugins'] ) ? $attention['plugins'] : null
                );

                // Make sure extension has name defined.
                if ( ! isset( $attention['name'] ) || empty( $attention['name'] ) )
                {
                    unset( $attentions[ $i ] );
                }
                elseif ( isset( $attention['display'] ) && ! $attention['display'] )
                {
                    unset( $attentions[ $i ] );
                }
                else
                {
                    // Remove data that are not necessary any more.
                    if ( isset( $attention['modules'] ) ) {
                        unset( $attentions[ $i ]['modules'] );
                    }

                    if ( isset( $attention['plugins'] ) ) {
                        unset( $attentions[ $i ]['plugins'] );
                    }
                }
            }
        }

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
        $editing = $this->input->getInt( 'style_id' );

        if ( $styleId && $styleId != $editing ) {
            $editing = $styleId;
        }

        // Set edit ID.
        $this->app->setUserState( 'com_templates.edit.style.id', $editing );

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
            'attention' => array_values( $attentions ),
            'styleId'   => $editing
        ) );
    }

    /**
     * Restore database backup.
     *
     * @return  void
     */
    public function restoreBackupAction()
    {
        try
        {
            // Verify request.
            $this->verify();

            // Look for the latest backup file.
            $backups = glob( JPATH_SITE . "/templates/{$this->template->template}/backups/{$this->sample['id']}/*.zip" );

            if ( ! $backups || ! count( $backups ) )
            {
                throw new Exception( JText::_( 'SUNFW_NOT_FOUND_ANY_DATABASE_BACKUP_FILE' ) );
            }

            rsort( $backups );
            reset( $backups );

            // Extract backup file to temporary directory.
            $tmpPath = JFactory::getConfig()->get( 'tmp_path' ) . "/{$this->template->id}/{$this->sample['id']}/backups";

            if ( ! JArchive::extract( current( $backups ), $tmpPath ) )
            {
                throw new Exception( JText::_( 'SUNFW_FAILED_TO_EXTRACT_DATABASE_BACKUP_FILE' ) );
            }

            // Loop thru extracted backup files to restore.
            $backups = glob( "{$tmpPath}/*.sql" );

            if ( ! $backups || ! count( $backups ) )
            {
                throw new Exception( JText::_( 'SUNFW_NOT_FOUND_ANY_DATABASE_BACKUP_FILE' ) );
            }

            rsort( $backups );
            reset( $backups );

            foreach ( $backups as $backup )
            {
                $query = '';

                foreach ( explode( "\n", JFile::read( $backup ) ) as $line )
                {
                    $line = trim( $line );

                    if ( substr( $line, -1 ) != ';' )
                    {
                        $query .= "\n" . $line;
                    }
                    else
                    {
                        $this->dbo->setQuery( "{$query}\n{$line}" );

                        if ( ! $this->dbo->execute() )
                        {
                            throw new Exception( $this->dbo->getErrorMsg() );
                        }

                        $query = '';
                    }
                }
            }

            // Get extension template params.
            $params = SunFwHelper::getExtensionParams( 'template', $this->template->template );

            // Set last installed sample package to response.
            $this->setResponse( isset( $params['installedSamplePackage'] ) ? $params['installedSamplePackage'] : '' );
        }
        catch ( Exception $e )
        {
            throw $e;
        }
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
                throw new Exception( JText::_( 'SUNFW_NOT_FOUND_SAMPLE_DATA_PACKAGE' ) );
            }

            // Extract sample data package.
            if ( ! JArchive::extract( "{$tmpPath}.zip", $tmpPath ) )
            {
                throw new Exception( JText::_( 'SUNFW_FAILED_TO_EXTRACT_SAMPLE_DATA_PACKAGE' ) );
            }

            $this->temporary_path = $tmpPath;

            // Look for sample data definition file.
            $xmlFiles = glob( "{$tmpPath}/*.xml" );

            if ( ! $xmlFiles || ! count( $xmlFiles ) )
            {
                throw new Exception( JText::_( 'SUNFW_INVALID_SAMPLE_DATA_PACKAGE' ) );
            }

            // Verify sample data definition.
            $xml        = simplexml_load_file( current( $xmlFiles ) );
            $tpl_id     = str_replace( array( ' ', 'jsn_' ), array( '_', 'tpl_', ), strtolower( ( string ) $xml['name'] ) );
            $tpl_ver    = ( string ) $xml['version'];
            $joomla_ver = ( string ) $xml['joomla-version'];

            if ( $tpl_id != $this->template->id )
            {
                throw new Exception(
                    sprintf( JText::_( 'SUNFW_INCOMPATIBLE_SAMPLE_DATA' ), ( string ) $xml['name'], $this->template->title )
                );
            }

            if ( version_compare( $this->template->version, $tpl_ver, '<' ) )
            {
                throw new Exception( 'OUTDATED: ' . sprintf( JText::_( 'SUNFW_TEMPLATE_OUTDATED' ), $this->template->title ) );
            }

            if ( ! empty( $joomla_ver ) )
            {
                $jversion = new JVersion;
                $jversion = $jversion->getShortVersion();

                if ( version_compare( $jversion, $joomla_ver, '<' ) )
                {
                    throw new Exception( 'OUTDATED: ' . sprintf( JText::_( 'SUNFW_JOOMLA_OUTDATED' ), $joomla_ver, $jversion ) );
                }
            }

            $this->xml = $xml;
        }
    }

    protected function get3rdExtensions()
    {
        try
        {
            // Extract sample data.
            $this->extract();

            // Get required components.
            $components = array();

            foreach ( $this->xml->xpath( '//extension[@author="3rd"][@type="component"][@autoinstall="true"][@commercial="false"]' ) as $component )
            {
                $attrs = ( array ) $component->attributes();
                $attrs = $attrs['@attributes'];

                $attrs['name'   ] = sprintf( 'com_%s', $attrs['name'] );
                $attrs['state'  ] = $this->getExtensionState( $attrs['name'], $attrs['version'] );
                $attrs['depends'] = array();

                if (isset($component->dependency))
                {
                    foreach ( $component->dependency->parameter as $parameter )
                    {
                        $dependencyAttrs          = ( array ) $parameter->attributes();
                        $dependencyAttrs          = $dependencyAttrs['@attributes'];

                        if ( $dependencyAttrs['type'] == 'module' )
                        {
                            $dependencyAttrs['name'] = sprintf( 'mod_%s', $dependencyAttrs['name'] );
                        }
                        elseif ($dependencyAttrs['type'] == 'plugin')
                        {
                            $dependencyAttrs['name'] = sprintf( 'plg_%s', $dependencyAttrs['name'] );
                        }
                        else
                        {
                            $dependencyAttrs['name'] = sprintf( 'com_%s', $dependencyAttrs['name'] );
                        }

                        $dependencyAttrs['state'] = $this->getExtensionState(
                            $dependencyAttrs['name'], $dependencyAttrs['version'], false, $dependencyAttrs['type']
                        );
                        $attrs['depends'][] = $dependencyAttrs;
                    }
                }
                $components[] = $attrs;
            }

            return $components;
        }
        catch ( Exception $e )
        {
            throw $e;
        }
    }

    /**
     * Extract extensions list from sample data package.
     *
     * @return  array
     */
    protected function getExtensions()
    {
        try
        {
            // Extract sample data.
            $this->extract();

            // Get required components.
            $components = array();

            foreach ( $this->xml->xpath( '//extension[@author="joomlashine"][@type="component"]' ) as $component )
            {
                $attrs = ( array ) $component->attributes();
                $attrs = $attrs['@attributes'];

                $attrs['name'   ] = sprintf( 'com_%s', $attrs['name'] );
                $attrs['state'  ] = $this->getExtensionState( $attrs['name'], $attrs['version'] );
                $attrs['depends'] = array();

                foreach ( $component->dependency->parameter as $name )
                {
                    $dependency = $this->xml->xpath( "//extension[@name=\"{$name}\"]" );

                    if ( $name == 'jsnframework' OR empty( $dependency ) )
                    {
                        continue;
                    }

                    $dependency               = current( $dependency );
                    $dependencyAttrs          = ( array ) $dependency->attributes();
                    $dependencyAttrs          = $dependencyAttrs['@attributes'];
                    $dependencyAttrs['state'] = $this->getExtensionState(
                        $dependencyAttrs['name'], $dependencyAttrs['version'], false, 'plugin'
                    );

                    if ( $dependencyAttrs['type'] == 'module' )
                    {
                        $dependencyAttrs['name'] = sprintf( 'mod_%s', $dependencyAttrs['name'] );
                    }

                    $attrs['depends'][] = $dependencyAttrs;
                }

                $components[] = $attrs;
            }

            return $components;
        }
        catch ( Exception $e )
        {
            throw $e;
        }
    }

    /**
     * Determine installation state of an extension.
     *
     * - Return "install"   if extension does not installed.
     * - Return "update"    if extension is installed but outdated.
     * - Return "installed" if extension is installed and up to date.
     *
     * @param   string  $name          The name of extension.
     * @param   string  $version       Version number that used to determine state.
     * @param   string  $isThirdParty  Whether this is a 3rd-party extension.
     * @param   string  $type          Either 'component', 'module' or 'plugin'.
     *
     * @return  string
     */
    protected function getExtensionState( $name, $version, $isThirdParty = false, $type = 'component' )
    {
        $installedExtensions = SunFwHelper::findInstalledExtensions();

        if ( 'plugin' == $type )
        {
            // Find first plugin that matchs the given name.
            foreach ( $installedExtensions as $_type => $exts )
            {
                if ( 0 === strpos( $_type, 'plugin' ) && isset( $installedExtensions[ $_type ][ $name ] ) )
                {
                    $installedExtension = $installedExtensions[ $_type ][ $name ];
                }
            }
        }
        elseif ( isset( $installedExtensions[ $type ][ $name ] ) )
        {
            $installedExtension = $installedExtensions[ $type ][ $name ];
        }

        if ( ! isset( $installedExtension ) )
        {
            return 'install';
        }

        if ( version_compare( $installedExtension->version, $version, '<' ) )
        {
            return 'update';
        }

        if ( $isThirdParty )
        {
            if ( version_compare( $installedExtension->version, $version, '>' ) )
            {
                return 'unsupported';
            }

        }

        return 'installed';
    }

    /**
     * Clean up all junk data left by the specified component.
     *
     * @param   string  $name     The component name.
     * @param   array   $modules  Additional modules to be removed.
     * @param   array   $plugins  Additional plugins to be removed.
     *
     * @return  void
     */
    protected function cleanExtensionJunk( $name, $modules = null, $plugins = null )
    {
        // Only clean-up junk data if the component is really missing.
        if ( ! SunFwHelper::isExtensionInstalled( $name ) )
        {
            // Get all menu items associated with the missing component.
            $q = $this->dbo->getQuery( true );

            $q
                ->select( 'id' )
                ->from( '#__menu' )
                ->where( "type = 'component'" )
                ->where( "link LIKE '%option=" . $name . "%'" );

            $this->dbo->setQuery( $q );

            $items = $this->dbo->loadColumn();

            if ( count( $items ) )
            {
                // Get all modules associated with all menu items of the missing component.
                $q = $this->dbo->getQuery( true );

                $q
                    ->select( 'moduleid' )
                    ->from( '#__modules_menu' )
                    ->where( 'menuid IN (' . implode( ', ', $items ) . ')' );

                $this->dbo->setQuery( $q );

                $mods = $this->dbo->loadColumn();

                // Clean up menu table.
                $q = $this->dbo->getQuery( true );

                $q->delete( '#__menu' )->where( 'id IN (' . implode( ', ', $items ) . ')' );

                $this->dbo->setQuery( $q );

                if ( ! $this->dbo->execute() )
                {
                    throw new Exception( $this->dbo->getErrorMsg() );
                }

                // Clean up menu item alias also.
                $q = $this->dbo->getQuery( true );

                $q
                    ->delete( '#__menu' )
                    ->where( "type = 'alias'" )
                    ->where( '(params LIKE \'%"aliasoptions":"' . implode(
                            '"%\' OR params LIKE \'%"aliasoptions":"', $items
                        ) . '"%\')' );

                $this->dbo->setQuery( $q );

                if ( ! $this->dbo->execute() )
                {
                    throw new Exception( $this->dbo->getErrorMsg() );
                }

                // Clean up module menu mapping table.
                $q = $this->dbo->getQuery( true );

                $q->delete( '#__modules_menu' )->where( 'menuid IN (' . implode( ', ', $items ) . ')' );

                $this->dbo->setQuery( $q );

                if ( ! $this->dbo->execute() )
                {
                    throw new Exception( $this->dbo->getErrorMsg() );
                }
            }

            if ( isset( $mods ) && count( $mods ) )
            {
                // Make sure queried modules does not associate with menu items of other component.
                $q = $this->dbo->getQuery( true );

                $q
                    ->select( 'moduleid' )
                    ->from( '#__modules_menu' )
                    ->where( 'moduleid IN (' . implode( ', ', $mods ) . ')' );

                $this->dbo->setQuery( $q );

                if ( $items = $this->dbo->loadColumn() )
                {
                    $mods = array_diff( $mods, $items );
                }

                // Clean up modules table.
                if ( count( $mods ) )
                {
                    $q = $this->dbo->getQuery( true );

                    $q->delete( '#__modules' )->where( 'id IN (' . implode( ', ', $mods ) . ')' );

                    $this->dbo->setQuery( $q );

                    if ( ! $this->dbo->execute() )
                    {
                        throw new Exception( $this->dbo->getErrorMsg() );
                    }
                }
            }

            // Clean up modules associated with the missing component but not associated with its menu items.
            $q = $this->dbo->getQuery( true );

            $q
                ->delete( '#__modules' )
                ->where( "params LIKE '%\"moduleclass_sfx\":\"%jsn-demo-module-for-{$name}\"%'" );

            $this->dbo->setQuery( $q );

            if ( ! $this->dbo->execute() )
            {
                throw new Exception( $this->dbo->getErrorMsg() );
            }

            // Clean up assets table.
            $q = $this->dbo->getQuery( true );

            $q->delete( '#__assets' )->where( 'name = ' . $q->quote( $name ) );

            $this->dbo->setQuery( $q );

            if ( ! $this->dbo->execute() )
            {
                throw new Exception( $this->dbo->getErrorMsg() );
            }

            // Clean up extensions table.
            $q = $this->dbo->getQuery( true );

            $q->delete( '#__extensions' )->where( 'element = ' . $q->quote( $name ) );

            $this->dbo->setQuery( $q );

            if ( ! $this->dbo->execute() )
            {
                throw new Exception( $this->dbo->getErrorMsg() );
            }
        }

        // Clean up additional modules if specified.
        if ( $modules && @count( $modules ) )
        {
            foreach ( $modules as $module )
            {
                // Only clean-up junk data if module is really missing.
                if ( ! @is_dir( JPATH_ROOT . '/modules/' . ( string ) $module ) )
                {
                    // Clean up modules table.
                    $q = $this->dbo->getQuery( true );

                    $q->delete( '#__modules' )->where( 'module = ' . $q->quote( ( string ) $module ) );

                    $this->dbo->setQuery( $q );

                    if ( ! $this->dbo->execute() )
                    {
                        throw new Exception( $this->dbo->getErrorMsg() );
                    }

                    // Clean up extensions table.
                    $q = $this->dbo->getQuery( true );

                    $q
                        ->delete( '#__extensions' )
                        ->where( "type = 'module'" )
                        ->where( 'element = ' . $q->quote( ( string ) $module ) );

                    $this->dbo->setQuery( $q );

                    if ( ! $this->dbo->execute() )
                    {
                        throw new Exception( $this->dbo->getErrorMsg() );
                    }
                }
            }
        }

        // Clean up additional plugins if specified.
        if ( $plugins && @count( $plugins ) )
        {
            foreach ( $plugins as $plugin )
            {
                // Only clean-up junk data if plugin is really missing.
                if ( ! @is_dir( JPATH_ROOT . '/plugins/' . ( string ) $plugin['group'] . '/' . ( string ) $plugin ) )
                {
                    // Clean up extensions table.
                    $q = $this->dbo->getQuery( true );

                    $q
                        ->delete( '#__extensions' )
                        ->where( "type = 'plugin'" )
                        ->where( 'folder = ' . $q->quote( ( string ) $plugin['group'] ) )
                        ->where( 'element = ' . $q->quote( ( string ) $plugin ) );

                    $this->dbo->setQuery( $q );

                    if ( ! $this->dbo->execute() )
                    {
                        throw new Exception( $this->dbo->getErrorMsg() );
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
        $this->cleanCache( 'mod_menu'    );

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

    /**
     * Enable an extension.
     *
     * @param   array  $extension  Extension details.
     *
     * @return  void
     */
    protected function activateExtension( $extension )
    {
        $namePrefix    = array( 'component' => 'com_', 'module' => 'mod_', 'plugin' => '' );
        $extensionName = $extension['name'];

        if ( isset( $namePrefix[ $extension['type'] ] ) )
        {
            $extensionName = $namePrefix[ $extension['type'] ] . $extension['name'];
        }

        $extensionFolder = '';

        if ( preg_match( '/^plugin-([a-z0-9]+)$/i', $extension['type'], $matched ) )
        {
            $extensionFolder = $matched[1];
        }

        $q = $this->dbo->getQuery( true );

        $q
            ->update( '#__extensions' )
            ->set( 'enabled = 1' )
            ->where( 'element = ' . $q->quote( $extensionName ) )
            ->where( 'folder = ' . $q->quote( $extensionFolder ) );

        $this->dbo->setQuery( $q );

        if ( ! $this->dbo->execute() )
        {
            throw new Exception( $this->dbo->getErrorMsg() );
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
                                throw new Exception( JText::_( 'SUNFW_CANNOT_CREATE_BACKUP_FILE' ) );
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
            throw new Exception( JText::_( 'SUNFW_CANNOT_CREATE_BACKUP_FILE' ) );
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
                'SUNFW_CANNOT_CREATE_BACKUP_FILE',
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
     * Get version of installed extension.
     *
     * @param   string  $name  The name of extension.
     * @param   string  $type  The type of extension.
     *
     * @return  string
     */
    protected function getExtensionVersion( $name, $type = 'component' )
    {
        $installedExtensions = SunFwHelper::findInstalledExtensions();

        if ( ! isset( $installedExtensions[ $type ][ $name ] ) ) {
            return null;
        }

        return $installedExtensions[ $type ][ $name ]->version;
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

    protected function get3rdPackageURL($id, $version, $parentID = '')
    {
        $joomlaVersion 	= SunFwHelper::getJoomlaVersion(2);

        if ($parentID != '')
        {
            $tmpID 	= $id;
            $id 	= $parentID;
        }
        // Send request to joomlashine server to checking customer information
        $downloadUrl = SUNFW_LIGHTCART_URL;
        $downloadUrl .= '&controller=remoteconnectauthentication&task=authenticate';
        $downloadUrl .= '&tmpl=component&upgrade=yes&identified_name=' . $id;
        $downloadUrl .= '&joomla_version=' . $joomlaVersion;

        if ($parentID != '')
        {
            $downloadUrl .= '&file_attr={"package_type":"3rd","version":"' . (string) $version . '","dependency_identifiedname":"' . (string) $tmpID . '"}';

        }
        else
        {
            $downloadUrl .= '&file_attr={"package_type":"3rd","version":"' . (string) $version . '"}';

        }

        return $downloadUrl;
    }
}
