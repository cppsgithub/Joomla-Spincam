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
 * General helper class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwSiteHelper
{
	public static $_sunFwSiteHelper = null;

	/**
	 * Constructor
	 *
	 * @param   string  $name  Name of the template
	 */
	private function __construct ()
	{
		$this->_document = JFactory::getDocument();
	}

	/**
	 * Get active instance of template helper object
	 *
	 * @param   string  $name  Name of the template
	 *
	 * @return  SUN TemplateHelper
	 */
	public static function getInstance ()
	{
		if ( ! isset(self::$_sunFwSiteHelper))
		{
			self::$_sunFwSiteHelper = new SunFwSiteHelper;
		}

		return self::$_sunFwSiteHelper;
	}

	/**
	 * Alias of _prepare method
	 *
	 * @return  void
	 */
	public static function prepare ()
	{
		self::getInstance()->_prepare();
	}

	/**
	 * Get an article.
	 *
	 * @param   int     $id    Article ID.
	 * @param   string  $lang  If specified, article association for this language tag will be loaded.
	 *                         Otherwise, article association for the current language will be loaded.
	 *
	 * @return  object
	 */
	public static function getArticle($id, $lang = '')
	{
		// Get database object.
		$db = JFactory::getDbo();

		// Start building query.
		$query = $db->getQuery(true)
			->select(
				'a.id, a.asset_id, a.title, a.alias, a.introtext, a.fulltext, ' .
				'a.catid, a.created, a.created_by, a.created_by_alias, ' .
				'CASE WHEN a.modified = ' . $db->quote($db->getNullDate()) . ' THEN a.created ELSE a.modified END as modified, ' .
				'a.modified_by, a.checked_out, a.checked_out_time, a.publish_up, a.publish_down, ' .
				'a.images, a.urls, a.attribs, a.version, a.ordering, ' .
				'a.metakey, a.metadesc, a.access, a.hits, a.metadata, a.featured, a.language, a.xreference'
			)
			->from('#__content AS a');

		// Join on category table.
		$query
			->select('c.title AS category_title, c.alias AS category_alias, c.access AS category_access')
			->join('LEFT', '#__categories AS c on c.id = a.catid');

		// Join on user table.
		$query
			->select('u.name AS author')
			->join('LEFT', '#__users AS u on u.id = a.created_by');

		// Join over the categories to get parent category titles
		$query
			->select('parent.title as parent_title, parent.id as parent_id, parent.path as parent_route, parent.alias as parent_alias')
			->join('LEFT', '#__categories as parent ON parent.id = c.parent_id');

		// Join on voting table
		$query
			->select('ROUND(v.rating_sum / v.rating_count, 0) AS rating, v.rating_count as rating_count')
			->join('LEFT', '#__content_rating AS v ON a.id = v.content_id');

		// Where...
		$query->where('a.id = ' . (int) $id);

		// Get data.
		$db->setQuery($query);

		$data = $db->loadObject();

		if ( ! empty($data))
		{
			// Check article language.
			if ( empty($lang) )
			{
				$lang = JFactory::getLanguage()->getTag();
			}

			if ($data->language == $lang)
			{
				if ( class_exists('Registry') )
				{
					// Convert parameter fields to objects.
					$data->params = new Registry;
					$data->params->loadString($data->attribs);

					$registry = new Registry;
					$registry->loadString($data->metadata);
					$data->metadata = $registry;
				}
			}
			else
			{
				// Get associations of the specified article.
				$associations = JLanguageAssociations::getAssociations('com_content', '#__content', 'com_content.item', (int) $id);

				foreach ($associations as $tag => $association)
				{
					if ($tag == $lang)
					{
						return self::getArticle($association->id, $lang);
					}
				}
			}
		}

		return $data;
	}

	/**
	 * Preparing template parameters for the template
	 *
	 * @return  void
	 */
	private function _prepare ()
	{
		$app 		= JFactory::getApplication();
		$jinput 	= $app->input;
		$jcookie  	= $jinput->cookie;

		$templateParams	= isset($this->_document->params)	? $this->_document->params		: null;
		$templateName	= isset($this->_document->template)	? $this->_document->template	: null;

		// Assign helper object
		$this->_document->app				= JFactory::getApplication();
		$this->_document->template			= $templateName;

		if (isset ($app->getTemplate('template')->id))
		{
			$this->_document->style_id	= $app->getTemplate('template')->id;
		}
		else
		{
			$tmpTemplate = SunFwHelper::getTemplateStyleByName($app->getTemplate('template')->template);
			$this->_document->style_id = $tmpTemplate->id;
		}

		$this->_document->helper 			= $this;
		$this->_document->uri				= JUri::getInstance();
		$this->_document->rootUrl			= $this->_document->uri->root(true);
		$this->_document->templateUrl		= $this->_document->rootUrl . '/templates/' . $this->_document->template;
		$this->_document->templatePrefix	= $this->_document->template . '_';

		$this->_document->jcookie			= $jcookie;
		$this->_document->isMobileSwicher	= null;

		// Custom direction from url parameter
		$direction = $this->_document->app->input->getCmd('sunfw_setdirection', $this->_document->direction);
		$this->_document->direction = $direction;

		$switcher = $this->_document->jcookie->get($this->_document->templatePrefix . 'switcher_params', null, 'RAW');
		if ($switcher != null)
		{
			$switcher = json_decode($switcher, true);
			if ($switcher['mobile'] == 'yes')
			{
				$this->_document->isMobileSwicher = true;
			}
			else
			{
				$this->_document->isMobileSwicher = false;
			}
		}

		$params = $this->loadParams();

		// Prepare custom code
		if (isset($params['system_data']) && count($params['system_data']))
		{
			if (isset($params['customBeforeEndingHeadTag']) && trim($params['customBeforeEndingHeadTag']) != '')
			{
				$params['customBeforeEndingHeadTag'] = trim($params['customBeforeEndingHeadTag']);
				if (strpos($params['customBeforeEndingHeadTag'], '<script') === false)
				{
					$params['customBeforeEndingHeadTag'] = '<script type="text/javascript">' . $params['customBeforeEndingHeadTag'];
				}

				if (strpos($params['customBeforeEndingHeadTag'], '</script>') === false)
				{
					$params['customBeforeEndingHeadTag'] = $params['customBeforeEndingHeadTag'] . '</script>';
				}
			}

			if (isset($params['customBeforeEndingBodyTag']) && trim($params['customBeforeEndingBodyTag']) != '')
			{
				$params['customBeforeEndingBodyTag'] = trim($params['customBeforeEndingBodyTag']);

				if (strpos($params['customBeforeEndingBodyTag'], '<script') === false)
				{
					$params['customBeforeEndingBodyTag'] = '<script type="text/javascript">' . $params['customBeforeEndingBodyTag'];
				}

				if (strpos($params['customBeforeEndingBodyTag'], '</script>') === false)
				{
					$params['customBeforeEndingBodyTag'] = $params['customBeforeEndingBodyTag'] . '</script>';
				}
			}

			if (isset($params['customCSSFiles']) && trim($params['customCSSFiles']) != '')
			{
				$params ['customCSSFiles'] = trim($params['customCSSFiles']);
			}
		}


		// Binding parameters to document object
		$this->_document->params = new JRegistry();

		foreach ($params AS $key => $value)
		{
			$this->_document->params->set($key, $value);
			$this->_document->{$key} = $value;
		}

		// Binding template parameters to document object
		$this->_document->templateParams = SunFwHelper::getTemplateParams($templateName);

		// Prepare body class
		$this->_prepareBodyClass();

		// Prepare template styles
		$this->_prepareHead();
	}

	/**
	 * Generate class for body element
	 *
	 * @return  string
	 */
	private function _prepareBodyClass ()
	{
		// Generate body class
		$bodyClass = array();

		$bodyClass[] = "sunfw-direction-{$this->_document->direction}";


		// Add page class suffix
		$bodyClass[] = implode(' ', $this->_getPageClass());

		// Add class for requested component
		if (($option = substr($this->_document->app->input->getCmd('option', null), 4)) != null)
		{
			$bodyClass[] = "sunfw-com-{$option}";
		}

		// Add class for requested view
		if (($view = $this->_document->app->input->getCmd('view', null)) != null)
		{
			$bodyClass[] = "sunfw-view-{$view}";
		}

		// Add class for requested layout
		if (($layout = $this->_document->app->input->getCmd('layout', null)) != null)
		{
			$bodyClass[] = "sunfw-layout-{$layout}";
		}

		// Add class for requested Itemid
		if (($itemid = $this->_document->app->input->getInt('Itemid', null)) != null)
		{
			$bodyClass[] = "sunfw-itemid-{$itemid}";
		}

		// Add class for home page
		if (is_object($this->_document->activeMenu) && $this->_document->activeMenu->home == 1)
		{
			$bodyClass[] = 'sunfw-homepage';
		}

		// Set body class to document object
		$this->_document->bodyClass = preg_replace('/custom-[^\-]+width-span\d+/', '', implode(' ', $bodyClass));
	}

	/**
	 * Retrieve parameter pageclass_sfx from active menu
	 *
	 * @return string
	 */
	private function _getPageClass ()
	{
		$pageClass		= '';
		$notHomePage	= true;
		$menus			= $this->_document->app->getMenu();
		$menu			= $menus->getActive();
		$this->_document->activeMenu = $menu;

		if (is_object($menu))
		{
			// Set page class suffix
			$params = JMenu::getInstance('site')->getParams($menu->id);
			$pageClass = $params->get('pageclass_sfx', '');

			// Set homepage flag
			$lang = JFactory::getLanguage();
			$defaultMenu = $menus->getDefault($lang->getTag());

			if (is_object($defaultMenu)) {
				$notHomePage = ($menu->id != $defaultMenu->id);
			}
		}

		return explode(' ', $pageClass);
	}
	/**
	 * Preparing head section for the template
	 *
	 * @return void
	 */
	private function _prepareHead ()
	{
		// Only continue if requested return format is html
		if (strcasecmp(get_class($this->_document), 'JDocumentHTML') != 0)
		{
			return;
		}

		$appearanceData = array();
		$systemData = array();

		if (isset($this->_document->system_data) && count($this->_document->system_data))
		{
			$systemData 	= $this->_document->system_data;
		}

		if (isset($this->_document->appearance_data) && count($this->_document->appearance_data))
		{
			$appearanceData = $this->_document->appearance_data;
		}

		if (count($systemData))
		{
			// Load custom css files from the parameter
			if (isset($systemData['customCSSFiles']))
			{
				$customCSSFiles = $systemData['customCSSFiles'];
				if ($customCSSFiles != '')
				{
					foreach (preg_split('/[\r\n]+/', $customCSSFiles) AS $cssFile)
					{
						if (empty($cssFile) OR strcasecmp(substr($cssFile, -4), '.css') != 0)
						{
							continue;
						}

						preg_match('#^([a-z]+://|/)#i', $cssFile)
							? $this->_document->addStylesheet(trim($cssFile))
							: $this->_document->addStylesheet($this->_document->templateUrl . '/css/' . trim($cssFile));
					}
				}
			}
			// Load custom js files from the parameter
			if (isset($systemData['customJSFiles']))
			{
				$customJSFiles = $systemData['customJSFiles'];

				if ($customJSFiles != '')
				{
					foreach (preg_split('/[\r\n]+/', $customJSFiles) AS $jsFile)
					{
						if (empty($jsFile) OR strcasecmp(substr($jsFile, -3), '.js') != 0)
						{
							continue;
						}

						preg_match('#^([a-z]+://|/)#i', $jsFile)
							? $this->_document->addScript(trim($jsFile))
							: $this->_document->addScript($this->_document->templateUrl . '/js/' . trim($jsFile));
					}
				}
			}
		}

		if ( @count($appearanceData) && @count($appearanceData['general']) )
		{
			$general = $appearanceData['general'];

			// Load Google Fonts
			$fonts = array();

			if ( $general['heading']['headings-font-type'] == 'google'
				&& isset($general['heading']['headings-google-font-family'])
				&& ! empty($general['heading']['headings-google-font-family']) )
			{
				$tmpFont = $general['heading']['headings-google-font-family']['family'];

				if ( isset($general['heading']['headings-google-font-family']['subset'])
					&& ! empty($general['heading']['headings-google-font-family']['subset']) )
				{
					$tmpFont .= "&subset={$general['heading']['headings-google-font-family']['subset']}";
				}

				$fonts[] = $tmpFont;
			}

			if ( $general['content']['content-font-type'] == 'google'
				&& isset($general['content']['content-google-font-family'])
				&& ! empty($general['content']['content-google-font-family']) )
			{
				$tmpFont = $general['content']['content-google-font-family']['family'];

				if ( isset($general['content']['content-google-font-family']['subset'])
					&& ! empty($general['content']['content-google-font-family']['subset']) )
				{
					$tmpFont .= "&subset={$general['content']['content-google-font-family']['subset']}";
				}

				$fonts[] = $tmpFont;
			}

			if (count($fonts))
			{
				$fonts = $this->_prepareFont($fonts);

				foreach ($fonts as $font)
				{
					$this->_document->addStylesheet( 'https://fonts.googleapis.com/css?family=' . trim($font) );
				}
			}
		}

		// Right to left stylesheet
		if ($this->_document->direction == "rtl")
		{
			$this->_document->addStylesheet($this->_document->templateUrl . '/css/rtl/style-rtl.css');

			// Load RTL override in niche.
			$template = $this->_document->template;
			$niche = SunFwHelper::getActiveNicheStyle();
			if ( file_exists( JPATH_ROOT . "/templates/{$template}/niches/{$niche}/css/rtl/style-rtl.css" ) )
			{
				$this->_document->addStylesheet( $this->_document->templateUrl . "/niches/{$niche}/css/rtl/style-rtl.css" );
			}

		}

		// Auto load Custom CSS File
		$this->_autoLoadCustomCssFile();
	}

	/**
	 * Load template parameters
	 *
	 * @return  array
	 */
	public function loadParams ()
	{
		$sunFwStyle = SunFwHelper::getSunFwStyle($this->_document->style_id);

		if (!count($sunFwStyle)) return array();

		$params = (array) $sunFwStyle;

		foreach ($params as $key => $param)
		{
			$tmpValue = SunFwUltils::jsonValidate($param);
			if ($tmpValue !== false)
			{
				$params [$key] = json_decode($param, true);
			}

		}
		unset($params['id']);
		unset($params['style_id']);
		return $params;
	}

	/**
	 * Prepare font before add them to head tag
	 *
	 * @param array $fonts
	 * @return array
	 */
	private function _prepareFont($fonts)
	{
		$final = array();

		// Prepare links for loading the specified Google fonts.
		if ( $fonts )
		{
			foreach ( (array) $fonts as $font )
			{
				if ( preg_match('/([^:&]+)(:[^&]+)?(&subset=.+)?/', $font, $match) )
				{
					if ( ! isset($final[ $match[1] ]) )
					{
						$final[ $match[1] ] = array( 'weight' => array(), 'subset' => array() );
					}

					if ( ! empty($match[2]) )
					{
						$final[ $match[1] ]['weight'] = array_merge(
							$final[ $match[1] ]['weight'],
							explode( ',', substr( $match[2], strlen(':') ) )
						);
					}

					if ( ! empty($match[3]) )
					{
						$final[ $match[1] ]['subset'] = array_merge(
							$final[ $match[1] ]['subset'],
							explode(',', substr( $match[3], strlen('&subset=') ) )
						);
					}
				}
			}
		}

		foreach ($final as $tmp => $tmpAttrs)
		{
			$final[$tmp] = urlencode($tmp);

			if ( count($tmpAttrs['weight']) )
			{
				$final[$tmp] .= ':' . implode( ',', array_unique($tmpAttrs['weight']) );
			}

			if ( count($tmpAttrs['subset']) )
			{
				$final[$tmp] .= '&subset=' . implode( ',', array_unique($tmpAttrs['subset']) );
			}
		}

		return $final;
	}

	/**
	 * Get Google Font
	 * @return string
	 */
	public function getGoogleFonts()
	{

		$path		= SUNFW_PATH . '/googlefonts/googlefonts.json';

		$googleFont = file_get_contents($path);

		return $googleFont;
	}
	/**
	 * Auto load custom Css File
	 *
	 * @return void;
	 */
	private function _autoLoadCustomCssFile()
	{
		jimport('joomla.filesystem.file');
		if (isset($this->_document->templateParams))
		{
			if (isset($this->_document->templateParams['customCSSFileChecksum']))
			{
				if ($this->_document->templateParams['customCSSFileChecksum'] != '')
				{
					$customFile		= JPATH_ROOT . '/templates/' . $this->_document->template . '/css/custom/custom.css';

					if (JFile::exists($customFile))
					{
						$md5 = md5_file($customFile);
						if ($md5 != $this->_document->templateParams['customCSSFileChecksum'])
						{
							$this->_document->addStylesheet($this->_document->templateUrl . '/css/custom/custom.css');
						}
					}
				}
			}
		}
	}
}
