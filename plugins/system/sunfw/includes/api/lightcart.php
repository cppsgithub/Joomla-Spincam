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

// No direct access to this file.
defined('_JEXEC') or die('Restricted access');

/**
 * Lightcart class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
jimport('joomla.filesystem.file');
abstract class SunFwApiLightcart
{
	/**
	 * Retrieve all product editions
	 *
	 * @param   string  $category  Category of the product
	 * @param   string  $id        Identified name of the product
	 *
	 * @return  array
	 */
	public static function getProductDetails($category, $id)
	{
		$http = new JHttp;
		$data = $http->get(SUNFW_VERSIONING_URL . "?category={$category}");

		// Decoding content
		$responseContent = trim($data->body);
		$responseObject  = json_decode($responseContent);

		if ($responseObject == null)
		{
			throw new Exception($responseContent);
		}

		$productDetails = null;

		// Loop to each item to find product details
		foreach ($responseObject->items as $item)
		{
			if ( isset( $item->identified_name ) && $item->identified_name == $id )
			{
				$productDetails = $item;
				break;
			}
		}

		if (empty($productDetails))
		{
			throw new Exception(JText::_('SUNFW_INVALID_PRODUCT_ID'));
		}

		return $productDetails;
	}

	/**
	 * Retrieve all editions of the product that have bought by customer
	 *
	 * @param   string  $id        Identified name of the product
	 * @param   string  $username  Customer username
	 * @param   string  $password  Customer password
	 *
	 * @return  array
	 */
	public static function getOrderedEditions($id, $username, $password)
	{
		$joomlaVersion = SunFwHelper::getJoomlaVersion(2);

		// Send request to our server to checking customer information
		$query = array(
			'controller=remoteconnectauthentication',
			'task=authenticate',
			'tmpl=component',
			'identified_name=' . $id,
			'joomla_version=' . $joomlaVersion,
			'username=' . urlencode($username),
			'password=' . urlencode($password),
			'upgrade=no',
			'custom=1',
			'language=' . JFactory::getLanguage()->getTag()
		);

		$http = new JHttp;
		$link = SUNFW_LIGHTCART_URL . '&' . implode('&', $query);
		$data = $http->get($link);

		// Retrieve response content
		$responseContent	= trim($data->body);
		$responseObject		= json_decode($responseContent);

		if ($responseObject === null)
		{
			throw new Exception($responseContent);
		}

		return $responseObject->editions;
	}

	/**
	 * Download product installation package from our server.
	 * Return path to downloaded package when download successfull
	 *
	 * @param   string   $id        Identified name of the product
	 * @param   string   $edition   Product edition to download
	 * @param   string   $username  Customer username
	 * @param   string   $password  Customer password
	 * @param   string   $savePath  Path to save downloaded package
	 * @param   boolean  $direct    Whether to download directly instead of using Downloader widget?
	 *
	 * @return  string
	 */
	public static function downloadPackage($id, $edition = null, $username = null, $password = null, $savePath = null, $direct = true)
	{
		$joomlaVersion = SunFwHelper::getJoomlaVersion(2);

		// Send request to joomlashine server to checking customer information
		$query = array(
			'controller=remoteconnectauthentication',
			'task=authenticate',
			'tmpl=component',
			'identified_name=' . $id,
			'joomla_version=' . $joomlaVersion,
			'upgrade=yes',
			'custom=1',
			'language=' . JFactory::getLanguage()->getTag()
		);

		if (!empty($edition))
		{
			$query[] = 'edition=' . $edition;
		}

		if (!empty($username) && !empty($password))
		{
			$query[] = 'username=' . urlencode($username);
			$query[] = 'password=' . urlencode($password);
		}

		$config			= JFactory::getConfig();
		$tmpPath		= empty($savePath) && !is_dir($savePath) ? $config->get('tmp_path') : $savePath;
		$downloadUrl	= SUNFW_LIGHTCART_URL . '&' . implode('&', $query);
		$filePath		= $tmpPath . '/sunfw-' . $id . '.zip';

		if ( $direct )
		{
			$http = new JHttp;
			$data = $http->get($downloadUrl);

			// Verify response headers.
			if ( $data->headers['Content-Type'] != 'application/zip' )
			{
				throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_FROM_JSN_SERVER' ) );
			}

			// Write downloaded file.
			JFile::write($filePath, $data->body);
		}
		else
		{
			// Verify request data.
			$input = JFactory::getApplication()->input;

			// Get task.
			$task = $input->getCmd('task', 'download');

			if ( in_array( $task, array('download', 'status') ) )
			{
				$downloader = new SunFwWidgetDownloader;

				if ( ! $downloader->indexAction($downloadUrl, $filePath) )
				{
					throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_FROM_JSN_SERVER' ) );
				}
			}
		}

		// Verify downloaded file.
		if ( ! JFile::exists($filePath) )
		{
			throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_FROM_JSN_SERVER' ) );
		}
		elseif ( filesize($filePath) < 10 && preg_match('/^ERR[0-9]+$/', file_get_contents($filePath), $match) )
		{
			throw new Exception( JText::_('SUNFW_LIGHTCART_ERROR_' . $match[0]) );
		}

		return $filePath;
	}

	/**
	 * Download product installation package with token from our server.
	 * Return path to downloaded package when download successfull
	 *
	 * @param   string  $id        Identified name of the product
	 * @param   string  $edition   Product edition to download
	 * @param   string  $username  Customer username
	 * @param   string  $password  Customer password
	 * @param   string  $savePath  Path to save downloaded package
	 *
	 * @return  string
	 */
	public static function downloadPackageWithToken($id, $edition = null, $token = '', $savePath = null)
	{
		$joomlaVersion 	= SunFwHelper::getJoomlaVersion(2);
		$domain			= JURI::root();

		preg_match('@^(?:http://www\.|http://|www\.|http:|https://www\.|https://|www\.|https:)?([^/]+)@i', $domain, $domainFilter);
		$domain 		= $domainFilter[1];
		// Send request to joomlashine server to checking customer information
		$query = array(
				'controller=remoteconnectauthentication',
				'task=authenticate',
				'tmpl=component',
				'identified_name=' . $id,
				'joomla_version=' . $joomlaVersion,
				'token=' . urlencode($token),
				'domain=' . urlencode($domain),
				'upgrade=yes',
				'custom=1',
				'language=' . JFactory::getLanguage()->getTag()
		);

		if (!empty($edition))
		{
			$query[] = 'edition=' . urlencode($edition);
		}

		$config			= JFactory::getConfig();
		$tmpPath		= empty($savePath) && !is_dir($savePath) ? $config->get('tmp_path') : $savePath;
		$downloadUrl	= SUNFW_LIGHTCART_URL . '&' . implode('&', $query);
		$filePath		= $tmpPath . '/sunfw-' . $id . '.zip';

		// Verify request data.
		$input = JFactory::getApplication()->input;

		// Get task.
		$task = $input->getCmd('task', 'download');

		if ( in_array( $task, array('download', 'status') ) )
		{
			$downloader = new SunFwWidgetDownloader;

			if ( ! $downloader->indexAction($downloadUrl, $filePath) )
			{
				throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_FROM_JSN_SERVER' ) );
			}
		}
		elseif ( ! JFile::exists($filePath) )
		{
			throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_FROM_JSN_SERVER' ) );
		}
		elseif ( filesize($filePath) < 10 && preg_match('/^ERR[0-9]+$/', file_get_contents($filePath), $match) )
		{
			throw new Exception( JText::_('SUNFW_LIGHTCART_ERROR_' . $match[0]) );
		}

		return $filePath;
	}


    /**
     * Download 3rd product installation package from our server.
     * Return path to downloaded package when download successfull
     *
     * @param   string  $id        Identified name of the product
     * @param   string  $version   Product version to download
     * @param   string  $savePath  Path to save downloaded package
     *
     * @return  string
     */
    public static function download3rdPackage($id, $version, $parentID = '', $savePath = null)
    {
        $joomlaVersion = SunFwHelper::getJoomlaVersion(2);

        $config  = JFactory::getConfig();
        $tmpPath = empty($savePath) && !is_dir($savePath) ? $config->get('tmp_path') : $savePath;

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
            $filePath		= $tmpPath . '/sunfw-' . $tmpID . '-' . $version . '.zip';
        }
        else
        {
            $downloadUrl .= '&file_attr={"package_type":"3rd","version":"' . (string) $version . '"}';
            $filePath		= $tmpPath . '/sunfw-' . $id . '-' . $version . '.zip';
        }


        $filePath		= str_replace('//', '/', $filePath);

		// Verify request data.
		$input = JFactory::getApplication()->input;

		// Get task.
		$task = $input->getCmd('task', 'download');

		if ( in_array( $task, array('download', 'status') ) )
		{
			$downloader = new SunFwWidgetDownloader;

			if ( ! $downloader->indexAction($downloadUrl, $filePath) )
			{
				throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_FROM_JSN_SERVER' ) );
			}
		}
		elseif ( ! JFile::exists($filePath) )
		{
			throw new Exception( JText::_( 'SUNFW_FAILED_TO_DOWNLOAD_FROM_JSN_SERVER' ) );
		}
		elseif ( filesize($filePath) < 10 && preg_match('/^ERR[0-9]+$/', file_get_contents($filePath), $match) )
		{
			throw new Exception( JText::_('SUNFW_LIGHTCART_ERROR_' . $match[0]) );
		}

        return $filePath;
    }
}
