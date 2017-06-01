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
class SunFwWidgetUpdate extends SunFwWidgetBase
{
	/**
	 * Checking template version for auto update
	 *
	 * @return  void
	 */

	public function checkUpdateAction()
	{
		$response = array();

		try
		{
			$templateVersion	= SunFwHelper::getTemplateVersion($this->template['name']);
			$templateInfo		= SunFwApiLightcart::getProductDetails('cat_template', $this->template['id']);

			$response['template'] = array(
					'currentVersion'	=> $templateVersion,
					'newVersion'		=> $templateInfo->version,
					'hasUpdate'			=> version_compare($templateInfo->version, $templateVersion, '>')
			);
		}
		catch (Exception $ex)
		{
			$response['template'] = array(
					'currentVersion'	=> $templateVersion,
					'newVersion'		=> $templateVersion,
					'hasUpdate'			=> false
			);
		}

		try
		{
			$frameworkInfo = SunFwApiLightcart::getProductDetails('cat_template', SUNFW_ID);

			$response['framework'] = array(
					'currentVersion'	=> SUNFW_VERSION,
					'newVersion'		=> $frameworkInfo->version,
					'hasUpdate'			=> version_compare($frameworkInfo->version, SUNFW_VERSION, '>')
			);
		}
		catch (Exception $ex)
		{
			$response['framework'] = array(
					'currentVersion'	=> SUNFW_VERSION,
					'newVersion'		=> SUNFW_VERSION,
					'hasUpdate'			=> false
			);
		}

		$this->setResponse($response);
		return ;
	}
	/**
	 * Authentication action before update
	 *
	 * @return  void
	 */
	public function confirmAction ()
	{
		JSession::checkToken( 'get' ) or die( 'Invalid Token' );
		$target = $this->input->getString('target', '');

		if ($target == 'framework')
		{
			// Check if template has update also
			$this->checkUpdateAction();
			$result = $this->getResponse();

			$this->render('framework_confirm', array(
				'manifest'			=> SunFwHelper::getManifestCache('sunfw'),
				'template'			=> $this->template['name'],
				'templateHasUpdate'	=> $result['template']['hasUpdate']
			));

			return;
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
				if ((isset($item['edition']) AND ! empty($item['edition'])) OR (@is_array($item['editions']) AND count($item['editions']) == 1))
				{
					$template = @is_array($item['editions']) ? $item['editions'][0] : $item;

					// Render login view
					$this->render('confirm', array(
						'template' => $this->template,
						'authenticate' => $template['authentication']
					));
				}
				else
				{
					foreach ($item['editions'] AS $template)
					{
						$edition = trim($template['edition']);

						if (str_replace('PRO ', '', $this->template['edition']) == str_replace('PRO ', '', $edition))
						{
							// Render login view
							$this->render('confirm', array(
								'template' => $this->template,
								'authenticate' => $template['authentication']
							));

							break;
						}
					}
				}

				break;
			}
		}
	}

	/**
	 * Render UI for install update screen
	 *
	 * @return  void
	 */
	public function installAction ()
	{
		JSession::checkToken( 'get' ) or die( 'Invalid Token' );
		$token = JSession::getFormToken();
		$target = $this->input->getString('target');
		$styleID = $this->input->getInt('style_id', 0);
		if ($target == 'framework') {
			$this->render('framework_install', array(
				'manifest' => SunFwHelper::getManifestCache('sunfw'),
				'token' => $token
			));

			return;
		}

		$this->render('install', array('template' => $this->template, 'token' => $token, 'styleID' => $styleID));
	}
}
