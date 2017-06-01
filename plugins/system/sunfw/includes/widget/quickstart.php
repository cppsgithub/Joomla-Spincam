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
 * Template update widget
 *
 * @package     SUN Framework
 * @subpackage  Template
 * @since       1.0.0
 */
class SunFwWidgetQuickstart extends SunFwWidgetBase
{
	/**
	 * Render login form
	 *
	 * @return  void
	 */
	public function loginAction ()
	{
		JSession::checkToken( 'get' ) or die( 'Invalid Token' );

		$quickstartID = $this->input->getString('quickstart_id', '');

		if (SunFWHelper::isDisabledOpenssl())
		{
			throw new Exception(JText::_('SUNFW_TEMPLATE_ENABLE_OPENSSL_EXTENSION'));
		}

		// Retrieve version data
		try
		{
			$versionData = SunFWHelper::getVersionData();
		}
		catch (Exception $e)
		{
			throw $e;
		}

		// Find template information by identify name
		foreach ($versionData['items'] AS $item)
		{
			if ($item['identified_name'] == $this->template['id'])
			{
				$templateInfo = $item;

				break;
			}
		}

		if (isset($templateInfo))
		{
			if (isset($templateInfo['editions']) AND is_array($templateInfo['editions']))
			{
				foreach ($templateInfo['editions'] AS $info)
				{
					$edition = trim($info['edition']);

					if (str_replace('PRO ', '', $this->template['edition']) == str_replace('PRO ', '', $edition))
					{
						break;
					}
				}
			}
			elseif (isset($templateInfo['edition']) AND ! empty($templateInfo['edition']))
			{
				$edition = trim($templateInfo['edition']);

				if (str_replace('PRO ', '', $this->template['edition']) == str_replace('PRO ', '', $edition))
				{
					$info = $templateInfo;
				}
			}

			if ( ! isset($info) OR $info['authentication'] == false)
			{
				$this->setResponse(array(
					'auth'			=> false,
					'id'			=> $this->template['id'],
					'edition'		=> $info['edition'],
					'quickstartID'	=> $quickstartID,
					'joomlaVersion'	=> SunFWHelper::getJoomlaVersion(2)
				));
			}
			else
			{
				// Render login view
				$this->render('login', array('template' => $this->template, 'quickstartID' => $quickstartID));
			}
		}
	}

	/**
	 * Process checking customer information
	 *
	 * @return  void
	 */
	public function authAction ()
	{
		JSession::checkToken( 'get' ) or die( 'Invalid Token' );

		// Process posted back data that sent from client
		if ($this->input->getMethod() == 'POST')
		{
			$method = $this->input->getMethod();

			$username = $this->input->getUsername('username', '');
			$password = $this->input->$method->get('password', '', 'RAW');
			$quickstartID = $this->input->getString('quickstart_id', '');
			// Create new HTTP Request
			try
			{
				$orderedEditions = SunFwApiLightcart::getOrderedEditions($this->template['id'], $username, $password);
			}
			catch (Exception $e)
			{
				throw $e;
			}

			$edition = $this->template['edition'];
			if ($edition != 'FREE' AND strpos($edition, 'PRO ') === false)
			{
				$edition = 'PRO ' . $edition;
			}

			if (in_array($edition, $orderedEditions))
			{
				$this->setResponse(array(
					'id' => $this->template['id'],
					'edition' => $edition,
					'joomlaVersion' => SunFWHelper::getJoomlaVersion(2),
					'quickstartID'	=> $quickstartID,
					'username' => urlencode($username),
					'password' => urlencode($password)
				));
			}
			else
			{
				throw new Exception(JText::_('SUNFW_LIGHTCART_ERROR_ERR02'));
			}
		}
	}

	/**
	 * Get QuickStart definition for a template.
	 *
	 * @return  void
	 */
	public function loadQuickStartListAction()
	{
		// Verify token.
		JSession::checkToken( 'get' ) or die( 'Invalid Token' );

		$styleID      	= $this->input->getInt( 'style_id', 0 );
		$templateName 	= $this->input->getString( 'template_name', '' );
		$quickstart 	= SunFwHelper::getQuickStartList($templateName);
		// Render quickstart view
		$this->render('quickstart_list', array('template' => $this->template, 'quickstart' => $quickstart));
	}
}
