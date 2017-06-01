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

use Joomla\Registry\Registry;

/**
 * Cookie law class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwCookielaw
{
	/**
	 * Instance of template administrator object
	 *
	 * @var  SunFwCookielaw
	 */
	private static $_instance;

	/**
	 * Return an instance of SunFwCookielaw class.
	 *
	 * @return  SunFwCookielaw
	 */
	public static function getInstance()
	{
		if ( ! isset(self::$instance))
		{
			self::$instance = new SunFwCookielaw;
		}

		return self::$instance;
	}

	/**
	 * Load Cookie EU Law
	 *
	 */
	public static function loadCookie()
	{
		$document = JFactory::getDocument();

		if ($document->getType() !== 'html')
		{
			return false;
		}

		$cookieLawData = isset($document->cookie_law_data) ? $document->cookie_law_data : array();

		if (count($cookieLawData) && isset($cookieLawData['enabled']) && (int) $cookieLawData['enabled'])
		{
			self::loadCookieLibrary();

			// Prepare parameters.
			$jsParamsContent = array();

			// Banner position.
			if ( ! isset($cookieLawData['banner-placement']) || empty($cookieLawData['banner-placement']) )
			{
				$cookieLawData['banner-placement'] = 'top';
			}
			elseif ($cookieLawData['banner-placement'] == 'floating')
			{
				$cookieLawData['banner-placement'] = 'bottom-right';
			}
			elseif ($cookieLawData['banner-placement'] == 'floating-left')
			{
				$cookieLawData['banner-placement'] = 'bottom-left';
			}

			// Text for accept button.
			if ( isset($cookieLawData['accept-button-text']) && ! empty($cookieLawData['accept-button-text']) )
			{
				$jsParamsContent['dismiss'] = $cookieLawData['accept-button-text'];
			}

			// Text for read more button.
			if ( isset($cookieLawData['read-more-button-text']) && ! empty($cookieLawData['read-more-button-text']) )
			{
				$jsParamsContent['link'] = $cookieLawData['read-more-button-text'];
			}

			// The message...
			if ( isset($cookieLawData['message_type']) && $cookieLawData['message_type'] == 'article'
				&& isset($cookieLawData['article']) && ! empty($cookieLawData['article']) )
			{
				// Get the selected article.
				$item = explode(':', $cookieLawData['article']);
				$item = SunFwSiteHelper::getArticle( (int) array_pop($item) );

				// Add router helpers.
				$item->slug        = $item->alias ? ($item->id . ':' . $item->alias) : $item->id;
				$item->catslug     = $item->category_alias ? ($item->catid . ':' . $item->category_alias) : $item->catid;
				$item->parent_slug = $item->parent_alias ? ($item->parent_id . ':' . $item->parent_alias) : $item->parent_id;

				// No link for ROOT category.
				if ($item->parent_alias == 'root')
				{
					$item->parent_slug = null;
				}

				// Get read more link.
				$item->readmore_link = JRoute::_(ContentHelperRoute::getArticleRoute($item->slug, $item->catid, $item->language));

				// Process the content plugins.
				JPluginHelper::importPlugin('content');

				$item->text = $item->introtext;

				JEventDispatcher::getInstance()->trigger(
					'onContentPrepare',
					array('com_content.article', &$item, &$item->params)
				);

				// Set message.
				$jsParamsContent['message'] = $item->text;

				// Link for read more button.
				if ( ! empty($item->fulltext) )
				{
					$jsParamsContent ['href'] = $item->readmore_link;
				}
				else
				{
					$jsParamsContent ['link'] = null;
				}
			}
			elseif ( ( ! isset($cookieLawData['message_type']) || $cookieLawData['message_type'] == 'text' )
				&& isset($cookieLawData['message']) && ! empty($cookieLawData['message']) )
			{
				$jsParamsContent['message'] = $cookieLawData['message'];

				// Link for read more button.
				if ( isset($cookieLawData['cookie-policy-link']) && ! empty($cookieLawData['cookie-policy-link']) )
				{
					$jsParamsContent ['href'] = $cookieLawData['cookie-policy-link'];
				}
				else
				{
					$jsParamsContent ['link'] = null;
				}
			}

			// Prepare theme.
			if ( ! isset($cookieLawData['style']) || empty($cookieLawData['style']) ) {
				$cookieLawData['style'] = 'light';
			}

			$document->addStyleSheet(
				JUri::root(true) . "/plugins/system/sunfw/assets/3rd-party/cookieconsent/styles/{$cookieLawData['style']}.css"
			);

			// Print inline script to initialize Cookie Law.
			$document->addScriptDeclaration( '
				window.addEventListener("load", function() {
					window.cookieconsent.initialise({
						"position": "' . $cookieLawData['banner-placement'] . '",
						"content": ' . json_encode($jsParamsContent) . '
					});
				});
			' );
		}
	}

	/**
	 * Load Cookie Law library.
	 */
	public static function loadCookieLibrary()
	{
		JFactory::getDocument()->addScript(
			JUri::root(true) . '/plugins/system/sunfw/assets/3rd-party/cookieconsent/cookieconsent.min.js'
		);
	}
}
