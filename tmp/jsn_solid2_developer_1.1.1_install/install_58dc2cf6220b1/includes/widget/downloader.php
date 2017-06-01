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

// Import necessary libraries.
jimport('joomla.filesystem.folder');
jimport('joomla.filesystem.file');

/**
 * Widget for downloading a remote file.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwWidgetDownloader extends SunFwWidgetBase
{
	public function indexAction( $url = null, $file = null, $cookies = array() )
	{
		// Get URL of remote file.
		if ( empty($url) )
		{
			$url = urldecode( $this->input->getString('remote_url') );
		}

		// Verify request variables.
		if ( empty($url) )
		{
			die( JText::_('SUNFW_ERROR_INVALID_REQUEST') );
		}

		// Get name of local file.
		if ( empty($file) )
		{
			if (isset($_REQUEST['background_request']) && $_REQUEST['background_request'] == 'yes')
			{
				$file = urldecode( $this->input->getString('local_file') );
			}
			else
			{
				$file = $this->app->getCfg('tmp_path') . preg_replace( '/[^a-zA-Z0-9\-\._]+/', '_', basename($url) );
			}
		}

		// Parse remote file URL.
		$parts = parse_url( $url );
		$secure = ($parts['scheme'] == 'https') ? true : false;

		// Get requested task.
		$task = $this->input->getString('task', 'download');

		if ($task != 'status')
		{
			// Prepare directory to write local file.
			$dir = dirname($file);

			if ( ! JFolder::exists($dir) && ! JFolder::create($dir) )
			{
				die( JText::_('SUNFW_ERROR_DIRECTORY_NOT_FOUND') );
			}

			if ( function_exists('fsockopen') )
			{
				// Generate a token key to authorize background request.
				$token = md5($this->app->getCfg('secret') . __FILE__ . $url . $file);

				// Get target file type.
				$type = $this->input->getString('content_type', 'application/octet-stream');

				if ($this->input->getString('background_request') != 'yes')
				{
					// Open a socket connection to get the size of remote file.
					$fp = fsockopen(
						($secure ? 'ssl://' : '') . $parts['host'],
						isset($parts['port']) ? $parts['port'] : ($secure ? 443 : 80),
						$errno, $errstr, 5
					);

					if ( ! $fp )
					{
						die( JText::sprintf('SUNFW_ERROR_CANNOT_OPEN_CONNECTION', $parts['host']) );
					}

					// Create request header.
					$request  = "HEAD {$parts['path']}" . (empty($parts['query']) ? '' : "?{$parts['query']}") . " HTTP/1.0\r\n";
					$request .= "Host: {$parts['host']}\r\n";
					$request .= "Connection: Close\r\n\r\n";

					// Send request headers.
					fwrite($fp, $request);

					// Get response.
					$size = 0;

					while ( ! feof($fp) )
					{
						$response = fgets($fp);

						// Check if there is a 'Location' header?
						if ( preg_match( '/^Location: ([^\r\n]+)/', $response, $match ) )
						{
							// Close socket connection.
							fclose($fp);

							// Use new URL to download file.
							return $this->indexAction($match[1], $file);
						}

						// Get remote file type from headers.
						if ( preg_match('/^Content-Type: ([^\r\n]+)/', $response, $match) )
						{
							$type = $match[1];
						}

						// Get remote file size from headers.
						if ( preg_match('/^Content-Length: (\d+)/', $response, $match) )
						{
							$size = $match[1];
						}
					}

					// Close socket connection.
					fclose($fp);

					// Prepare parameters for sending background request.
					$parts = parse_url(JUri::base() . 'index.php');
					$secure = ($parts['scheme'] == 'https') ? true : false;

					$parts['query'] = http_build_query( array(
						'background_request' => 'yes',
						'content_type'       => $type,
						'sunfwwidget'        => 'downloader',
						'action'             => 'index',
						'author'             => 'joomlashine',
						'remote_url'         => $url,
						'local_file'         => $file,
						'token'              => $token,
					) );

					$cookies = $_COOKIE;
				}
				elseif ($this->input->getString('token') != $token)
				{
					die( JText::_('SUNFW_ERROR_INVALID_TOKEN') );
				}

				// Open a socket connection for sending request.
				$fp = fsockopen(
					($secure ? 'ssl://' : '') . $parts['host'],
					isset($parts['port']) ? $parts['port'] : ($secure ? 443 : 80),
					$errno, $errstr, 5
				);

				if ( ! $fp )
				{
					die( JText::sprintf('SUNFW_ERROR_CANNOT_OPEN_CONNECTION', $parts['host']) );
				}

				// Create request header.
				$request  = "GET {$parts['path']}" . (empty($parts['query']) ? '' : "?{$parts['query']}") . " HTTP/1.0\r\n";
				$request .= "Host: {$parts['host']}\r\n";
				$request .= "Content-Type: {$type}\r\n";
				$request .= "Connection: Close\r\n";

				if ( is_array($cookies) && count($cookies) )
				{
					$cookie_str = '';

					foreach ( $cookies as $k => $v )
					{
						$cookie_str .= urlencode($k) . '=' . urlencode($v) . '; ';
					}

					$request .= 'Cookie: ' . substr($cookie_str, 0, -2) . "\r\n";
				}

				$request .= "\r\n";

				// Send request headers.
				fwrite($fp, $request);

				// Create lock file.
				JFile::write( "{$file}.lock", print_r($request, true) );

				if ($this->input->getString('background_request') == 'yes')
				{
					if ( JFile::exists($file) )
					{
						// Delete existing local file.
						if ( ! JFile::delete($file) )
						{
							// Close socket connection.
							fclose($fp);

							// Remove lock file.
							JFile::delete("{$file}.lock");

							die( JText::_('SUNFW_ERROR_CANNOT_REMOVE_EXISTING_FILE') );
						}
					}

					// Get response.
					$end_of_header = false;
					$response = '';

					while ( ! feof($fp) )
					{
						// Read maximum 50KB at once.
						$line = fgets($fp, 50 * 1024);

						if ( ! $end_of_header )
						{
							// Check if there is a 'Location' header?
							if ( preg_match( '/^Location: ([^\r\n]+)/', $line, $match ) )
							{
								// Close socket connection.
								fclose($fp);

								// Remove lock file.
								JFile::delete("{$file}.lock");

								// Use new URL to download file.
								return $this->indexAction($match[1], $file);
							}

							// End of headers?
							$response .= $line;

							if ( false !== strpos($response, "\r\n\r\n") ) {
								$end_of_header = true;
							}
						}
						else
						{
							file_put_contents($file, $line, FILE_APPEND);
						}
					}

					// Remove lock file.
					JFile::delete("{$file}.lock");
				}

				// Close socket connection.
				fclose($fp);
			}
			else
			{
				// Socket connection is not available, download file normally.
				$http = new JHttp;
				$data = $http->get($url);

				// Write sample data to file.
				if ( ! JFile::write($file, $data->body) )
				{
					die( JText::_('SUNFW_ERROR_CANNOT_CREATE_LOCAL_FILE') );
				}
			}
		}

		// Set necessary header.
		header('Content-type: application/json; charset=utf-8');
		header("Cache-Control: no-cache, must-revalidate");
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header("Pragma: no-cache");

		// Send response back.
		echo json_encode( array(
			'file'   => basename($file),
			'size'   => isset($size) ? $size : (JFile::exists($file) ? filesize($file) : 0),
			'status' => ! JFile::exists("{$file}.lock")
		) );

		exit;
	}
}
