<?php
/**
 * @version    $Id$
 * @package    JSN_PageBuilder2
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined('_JEXEC') or die( 'Restricted access' );
include_once JPATH_ROOT . '/components/com_content/helpers/route.php';

/**
 * JSN PageBuilder2 content helper.
 *
 * @package  JSN_PageBuilder2
 * @since    1.0.0
 */
class JSNPageBuilder2ContentHelper
{
	/**
	 * @param array $params
	 *
	 * @return array
	 */
	public static function getArticles ( $params )
	{
		if ( isset($params) ) {

			JLoader::import('joomla.application.component.model');
			JModelLegacy::addIncludePath(JPATH_SITE . '/components/com_content/models', 'ContentModel');

			$model = JModelLegacy::getInstance('Articles', 'ContentModel');
			$model->getState();

			$model->setState('list.limit', isset($params->limit) ? $params->limit : 10);
			$model->setState('filter.published', 1);
			if ( isset($params->category) ) {

				$model->setState('filter.catid', $params->category);
			}

			// Access filter
//			$access = !JComponentHelper::getParams('com_content')->get('show_noauth');
//			$authorised = JAccess::getAuthorisedViewLevels(JFactory::getUser()->get('id'));
//			$model->setState('filter.access', $access);

//			$model->setState('list.limit', 10);
			$articleList =  $model->getItems();
			//build article link

			foreach ($articleList as $key => $article) {
				$articleList[$key]->direct_link = JRoute::_(ContentHelperRoute::getArticleRoute($articleList[$key]->id, $articleList[$key]->catid));
			}
			return $articleList;
		}

	}

	public static function fetchHttp($url)
	{
		$result = '';
		$arguments = array();
		$body = '';


		// Initialize HTTP client
		class_exists('http_class')
			OR require_once JPATH_ROOT . "/administrator/components/com_pagebuilder2/libraries/3rd-party/httpclient/http.php";


		$http = new http_class;
		$http->follow_redirect		= 1;
		$http->redirection_limit	= 5;
		$http->GetRequestArguments($url, $arguments);

		// Open connection
		if (($error = $http->Open($arguments)) == '')
		{
			if (($error = $http->SendRequest($arguments)) == '')
			{
				// Get response body
				while (true)
				{
					if (($error = $http->ReadReplyBody($body, 1000)) != '' OR strlen($body) == 0)
					{
						break;
					}
					$result .= $body;
				}
			}
			else
			{
				throw new Exception($error);
			}

			// Close connection
			$http->Close();
		}
		else
		{
			throw new Exception($error);
		}

		return $result;
	}

}
