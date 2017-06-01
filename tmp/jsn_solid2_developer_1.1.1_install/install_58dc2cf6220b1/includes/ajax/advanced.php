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
 * Handle Ajax requests from layout builder.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxAdvanced extends SunFwAjax
{
	/**
	 * Save data to database
	 *
	 * @throws Exception
	 */
	public function saveAction()
	{
		$post = $this->input->get('sunfw-advanced', array(), 'array');

		if ( ! count( $post ) )
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
				->set( $this->dbo->quoteName( 'system_data' ) . '=' . $this->dbo->quote( json_encode($post) ) )
				->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
				->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
		}
		else
		{
			$columns  = array( 'style_id', 'system_data', 'template' );
			$values   = array( intval( $this->styleID ), $this->dbo->quote( json_encode($post) ), $this->dbo->quote( $this->templateName ) );

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

			if ($post['cacheDirectory'] != '')
			{
				// Generate path to cache directory
				if ( ! preg_match('#^(/|\\|[a-z]:)#i', $post['cacheDirectory']))
				{
					$cacheDirectory = JPATH_ROOT . '/' . rtrim($post['cacheDirectory'], '\\/');
				}
				else
				{
					$cacheDirectory = rtrim($post['cacheDirectory'], '\\/');
				}

				// Remove entire cache directory
				! is_dir($cacheDirectory . '/' . $this->templateName) OR JFolder::delete($cacheDirectory . '/' . $this->templateName);

			}

			$this->setResponse( array( 'message' => JText::_( 'SUNFW_SAVED_SUCCESSFULLY' ) ) );
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
    public function verifyCacheFolderAction()
    {
        $folder = $this->input->getString( 'folder', '' );

        if ( empty( $folder ) )
        {
        	$this->setResponse(array(
        			'pass'		=> false,
        			'message'	=> JText::_('SUNFW_INVALID_REQUEST')
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
        			'pass'		=> false,
        			'message'	=> JText::_('SUNFW_DIRECTORY_NOT_FOUND')
        	));

        	return;
        }

        //TODO issue related to compress css on rc demo
        // Check if folder is outside of document root directory
        if ( ! realpath($folder) OR strpos(realpath($folder), realpath($_SERVER['DOCUMENT_ROOT'])) === false)
        {
        	$this->setResponse(array(
        			'pass'		=> false,
        			'message'	=> JText::_('SUNFW_DIRECTORY_OUT_OF_ROOT')
        	));

        	return;
        }

        // Check if directory is writable
        $config = JFactory::getConfig();

        if ( ! $config->get('ftp_enable') AND ! is_writable($folder))
        {
        	$this->setResponse(array(
        			'pass'		=> false,
        			'message'	=> JText::_('SUNFW_DIRECTORY_NOT_WRITABLE')
        	));

        	return;
        }

        $this->setResponse(array(
        		'pass'		=> true,
        		'message'	=> JText::_('SUNFW_DIRECTORY_READY')
        ));
    }
    /**
     * export template parameters
     *
     * @return  void
     */
    public function exportAction()
    {
    	// Get database and query object
    	$db	= JFactory::getDbo();
    	$q	= $db->getQuery(true);

    	// Build query to get template style parameters
    	$q->select('*');
    	$q->from('#__sunfw_styles');
    	$q->where('template = ' . $q->quote($this->templateName), 'AND');
    	$q->where('style_id = ' . (int) $this->styleID);
    	try
    	{
    		$db->setQuery($q);

    		if ( ! ($params = $db->loadObject()))
    		{
    			throw new Exception($db->getErrorMsg());
    		}
    	}
    	catch (Exception $e)
    	{
    		$params = $e->getMessage();
    	}


    	$params = json_encode($params);

    	// Force user to download backup
    	header('Content-Type: application/json');
    	header('Content-Length: ' . strlen($params));
    	header('Content-Disposition: attachment; filename=' . str_replace(' ', '_', JText::sprintf('SUNFW_ADVANCED_EXPORTED_FILE_NAME', JText::_($this->templateName))) . '.json');
    	header('Cache-Control: no-cache, must-revalidate, max-age=60');
    	header('Expires: Sat, 01 Jan 2000 12:00:00 GMT');

    	echo $params;

    	// Exit immediately
    	exit;
    }

    /**
     * Import template parameters
     *
     * @return  void
     */
    public function importAction()
    {
    	// Check if we have backup file uploaded
    	$backupFile = $this->input->files->get('sunfw-advanced-backup-upload', null, 'raw');

    	if ( $backupFile == null )
    	{
    		throw new Exception(JText::sprintf('SUNFW_UPLOAD_FAIL', ''));
    	}

    	// Check if file is uploaded successful
    	if ($backupFile['error'] != 0)
    	{
    		throw new Exception(JText::sprintf('SUNFW_UPLOAD_FAIL', $backupFile['error']));
    	}

		try
		{
		  $this->checkBackupFile($backupFile['tmp_name']);
		}
		catch(Exception $e)
		{
			throw new Exception($e->getMessage());
		}

    	// Read template parameters in uploaded file
    	$params = file_get_contents($backupFile['tmp_name']);

    	if ( ! $params)
    	{
    		throw new Exception(JText::_('SUNFW_ADVANCED_RESTORE_PARAMS_READ_FILE_FAIL'));
    	}

    	if (substr($params, 0, 1) != '{' OR substr($params, -1) != '}')
    	{
    		throw new Exception(JText::_('SUNFW_ADVANCED_RESTORE_PARAMS_INVALID_BACKUP'));
    	}

		$params 			= json_decode($params, true);
		unset($params['id']);
		$params				= (object) $params;
		$params->id			= null;
		$params->style_id	= $this->styleID;
		$params->template 	= $this->templateName;

    	try
    	{
    		$sunFwStyle = SunFwHelper::getOnlySunFwStyle($this->styleID);

    		if (count($sunFwStyle))
    		{
    			$result = $this->dbo->updateObject('#__sunfw_styles', $params, 'style_id');
    		}
    		else
    		{
    			$result = $this->dbo->insertObject('#__sunfw_styles', $params, 'style_id');
    		}

    		// re-compile Sass
    		$sufwrender = new SunFwScssrender();
    		$sufwrender->compile($this->styleID, $this->templateName);
    		$sufwrender->compile($this->styleID, $this->templateName, "layout");
    	}
    	catch (Exception $e)
    	{
    		throw $e;
    	}

    	$this->setResponse(JText::_('SUNFW_ADVANCED_RESTORE_PARAMS_SUCCESS'));
    }

	/**
	 * Check Backup file
	 *
	 * @param string $path
	 * @throws Exception
	 *
	 * @return true on success
	 */
    public function checkBackupFile($path)
    {
    	if (!is_file($path))
    	{
    		throw new Exception(JText::_('SUNFW_ADVANCED_RESTORE_PARAMS_PACKAGE_FILE_NOT_FOUND'));
    	}

    	$filetypes = explode('.', $path);

	   	array_shift($filetypes);

    	// Media file names should never have executable extensions buried in them.
    	$executable = array(
    			'php', 'js', 'exe', 'phtml', 'java', 'perl', 'py', 'asp','dll', 'go', 'ade', 'adp', 'bat', 'chm', 'cmd', 'com', 'cpl', 'hta', 'ins', 'isp',
    			'jse', 'lib', 'mde', 'msc', 'msp', 'mst', 'pif', 'scr', 'sct', 'shb', 'sys', 'vb', 'vbe', 'vbs', 'vxd', 'wsc', 'wsf', 'wsh'
    	);

    	$check = array_intersect($filetypes, $executable);

    	if (!empty($check))
    	{
    		JFile::delete($path);
    		throw new Exception(JText::_('SUNFW_ADVANCED_RESTORE_PARAMS_INSTALLER_PACKAGE_SAVING_FAILED'));
    	}

    	$filetype = array_pop($filetypes);


    	if ($filetype === false )
    	{
    		JFile::delete($path);
    		throw new Exception(JText::_('SUNFW_ADVANCED_RESTORE_PARAMS_INSTALLER_PACKAGE_SAVING_FAILED'));
    	}

    	$xssCheck = file_get_contents($path, false, null, -1, 256);
    	$htmlTags = array(
    			'abbr', 'acronym', 'address', 'applet', 'area', 'audioscope', 'base', 'basefont', 'bdo', 'bgsound', 'big', 'blackface', 'blink',
    			'blockquote', 'body', 'bq', 'br', 'button', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'comment', 'custom', 'dd', 'del',
    			'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'fn', 'font', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    			'head', 'hr', 'html', 'iframe', 'ilayer', 'img', 'input', 'ins', 'isindex', 'keygen', 'kbd', 'label', 'layer', 'legend', 'li', 'limittext',
    			'link', 'listing', 'map', 'marquee', 'menu', 'meta', 'multicol', 'nobr', 'noembed', 'noframes', 'noscript', 'nosmartquotes', 'object',
    			'ol', 'optgroup', 'option', 'param', 'plaintext', 'pre', 'rt', 'ruby', 's', 'samp', 'script', 'select', 'server', 'shadow', 'sidebar',
    			'small', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title',
    			'tr', 'tt', 'ul', 'var', 'wbr', 'xml', 'xmp', '!DOCTYPE', '!--'
    	);

    	foreach ($htmlTags as $tag)
    	{
    		// A tag is '<tagname ', so we need to add < and a space or '<tagname>'
    		if (stristr($xssCheck, '<' . $tag . ' ') || stristr($xssCheck, '<' . $tag . '>'))
    		{
    			JFile::delete($path);
    			throw new Exception(JText::_('SUNFW_ADVANCED_RESTORE_PARAMS_INSTALLER_PACKAGE_SAVING_FAILED'));
    		}
    	}

    	return true;
    }
}
