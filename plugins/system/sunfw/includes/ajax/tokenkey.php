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
 * Handle Ajax requests from token key pane.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxTokenKey extends SunFwAjax
{
	public function getAction() {
		// Get update token.
		$pluginParams = SunFwHelper::getExtensionParams('plugin', 'sunfw', 'system');

		$this->setResponse( array(
			'token' => empty($pluginParams['token']) ? '' : $pluginParams['token'],
			'description' => JText::_('SUNFW_TOKEN_KEY_DESC'),
			'usernameLabel' => JText::_('SUNFW_USERNAME'),
			'passwordLabel' => JText::_('SUNFW_PASSWORD'),
			'getTokenLabel' => JText::_('SUNFW_GET_TOKEN_KEY'),
			'currentTokenLabel' => JText::_('SUNFW_CURRENT_TOKEN_KEY'),
			'tokenInputPlaceholder' => JText::_('SUNFW_TOKEN_KEY_IS_NOT_SET'),
			'verifyLabel' => JText::_('SUNFW_FRAMEWORK_VERIFY')
		) );
	}

	/**
	 * Get token key.
	 */
	public function getTokenKeyAction()
	{
		// Check token
		if (!JSession::checkToken('get'))
		{
			exit(json_encode(array('message' => 'Invalid Token', 'result' => 'error')));
		}

		$method = $this->input->getMethod();

		// Checking customer information
		$username = $this->input->getUsername('username', '');
		$password = $this->input->$method->get('password', '', 'RAW');

		if ($username == '' || $password == '')
		{
			exit(json_encode(array('message' => JText::_('SUNFW_LIGHTCART_ERROR_TOKEN_ERR01'), 'result' => 'error')));
		}

		$isAllowedUser = JFactory::getUser()->authorise('core.admin');

		if (!$isAllowedUser)
		{
			exit(json_encode(array('message' => JText::_('JGLOBAL_AUTH_ACCESS_DENIED'), 'result' => 'error')));
		}


		$randCode		= SunFwUltils::generateRandString();
		$domain			= JURI::root();

		preg_match('@^(?:http://www\.|http://|www\.|http:|https://www\.|https://|www\.|https:)?([^/]+)@i', $domain, $domainFilter);
		$domain 		= $domainFilter[1];
		$secretKey 		= md5($randCode . $domain);
		$query 			= array();

		$query['rand_code'] 	= $randCode;
		$query['domain'] 		= $domain;
		$query['secret_key'] 	= $secretKey;
		$query['username'] 		= $username;
		$query['password'] 		= $password;

		// Get results
		try
		{
			$http = new JHttp;
			$data = $http->post(SUNFW_GET_TOKEN_URL, $query);

			// JSON-decode the result
			$result = json_decode($data->body);

			if (is_null($result))
			{
				exit(json_encode(array('message' => JText::_('SUNFW_ERROR_FAILED_TO_CONNECT_OUR_SERVER'), 'result' => 'error')));
			}

			if ((string) $result->result == 'error')
			{
				exit(json_encode(array('message' => JText::_('SUNFW_LIGHTCART_ERROR_' . $result->message), 'result' => 'error')));
			}

			// Store installed sample data package.
			SunFwHelper::updateExtensionParams(
					array(
							'token' => $result->token ,
					),
					'plugin',
					'sunfw',
					'system'
			);

			require_once JPATH_ROOT . '/plugins/system/sunfw/includes/client/client.php';

			try
			{
				// Post client information
				SunFwClientInformation::postClientInformation($result->token);
			}
			catch (Exception $e)
			{
				exit(json_encode(array('message' => JText::_('SUNFW_TOKEN_IS_VALID'), 'result' => 'success', 'token' => $result->token)));
			}

			exit(json_encode(array('message' => JText::_('SUNFW_TOKEN_IS_VALID'), 'result' => 'success', 'token' => $result->token)));
		}
		catch (Exception $e)
		{
			exit(json_encode(array('message' => JText::_('SUNFW_ERROR_FAILED_TO_CONNECT_OUR_SERVER'), 'type' => 'error')));
		}
	}
}
