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
 * Template administration class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAdmin
{
	/**
	 * A singleton instance of the class.
	 *
	 * @var  SunFwAdmin
	 */
	private static $instance;

	/**
	 * Joomla application instance.
	 *
	 * @var  JApplicationAdministrator
	 */
	protected $app;

	/**
	 * Joomla document instance.
	 *
	 * @var  JDocumentHTML
	 */
	protected $doc;

	/**
	 * Editing template style.
	 *
	 * @var  object
	 */
	public $style;

	/**
	 * Editing template.
	 *
	 * @var  string
	 */
	public $template;

	/**
	 * Editing template.
	 *
	 * @var  string
	 */
	public $templateInfo;

	/**
	 * The controller for Joomla's template style screen.
	 *
	 * @var  TemplatesControllerStyle
	 */
	protected $controller;

	/**
	 * The view for Joomla's template style screen.
	 *
	 * @var  TemplatesViewStyle
	 */
	protected $view;

	/**
	 * Template manifest Cache
	 */
	protected $templateManifestCache;

	/**
	 * Editing template.
	 *
	 * @var  string
	 */
	public $templateVersion;

	/**
	 * Original template admin form
	 * @var JForm
	 */
	protected $templateForm;

	/**
	 * Instantiate a singleton of the class then return.
	 *
	 * @return  SunFwAdmin
	 */
	public static function getInstance()
	{
		// Instantiate a singleton of the class if not already exists.
		if ( ! isset( self::$instance ) )
		{
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Constructor method.
	 *
	 * @return  void
	 */
	public function __construct()
	{
		// Get Joomla application instance.
		$this->app = JFactory::getApplication();

		// Get Joomla document instance.
		$this->doc = JFactory::getDocument();

		// Get editing template style.
		$this->style = SunFwHelper::getTemplateStyle( $this->app->input->getInt( 'id' ) );

		// Get editing template.
		$this->template = strtolower( trim( $this->style->template ) );

		// Get template info.
		$this->templateInfo = SunFwRecognization::detect( $this->template );

		// Get the controller for template style screen.
		$this->controller = JControllerLegacy::getInstance( 'Templates' );

		// Get the view for template style screen.
		$this->view = $this->controller->getView( 'style', 'html', '', array(
			'base_path' => JPATH_COMPONENT_ADMINISTRATOR,
			'layout'    => 'edit',
		) );

		// Get Template manifest Cache.
		$this->templateManifestCache = SunFwHelper::getManifestCache($this->template);

		// Get Template manifest Cache.
		$this->templateVersion = SunFwHelper::getTemplateVersion($this->template);

		$this->templateForm    = JForm::getInstance('com_templates.style', 'style', array('control' => 'jform', 'load_data' => true));

		$this->sunfwParams		= SunFwHelper::getExtensionParams( 'plugin', 'sunfw', 'system' );

		//Check System Requiremnts
		$resultCheckSystemRequirements = SunFwUltils::checkSystemRequirements();

		if (count($resultCheckSystemRequirements))
		{
			$msgSystemRequirement = implode('<br />', $resultCheckSystemRequirements);
			$this->app->enqueueMessage($msgSystemRequirement, 'warning');
			$this->app->redirect('index.php?option=com_templates');
			return;
		}

		//Check Browser Requiremnts
		$resultCheckBrowserRequirements = SunFwUltils::checkBrowserRequirements();
		if (count($resultCheckBrowserRequirements))
		{
			$msgBrowserRequirement = implode('<br />', $resultCheckBrowserRequirements);
			$this->app->enqueueMessage($msgBrowserRequirement, 'warning');
			$this->app->redirect('index.php?option=com_templates');
			return;
		}

		// Register event to load assets for template administration.
		$this->app->registerEvent( 'onBeforeRender', array( &$this, 'loadAssets' ) );

		// Register event to render template administration screen.
		$this->app->registerEvent( 'onAfterRender', array( &$this, 'renderHtml' ) );

	}

	/**
	 * Load assets for template administration screen.
	 *
	 * @return  void
	 */
	public function loadAssets()
	{
		$JVersion 		= new JVersion;
		$mediaVersion 	= $JVersion->getMediaVersion();
		$patternTemplate = 'template.js\?' . $mediaVersion;

		// Remove unnecessary Joomla's scripts.
		foreach ( array_keys( $this->doc->_scripts ) as $link )
		{
			if ( preg_match( '#media/(system/js/validate.js|system/js/html5fallback.js|jui/js/bootstrap.min.js)#', $link ) )
			{
				unset( $this->doc->_scripts[ $link ] );
			}

			if ( preg_match( '#' . $patternTemplate . '#', $link ) )
			{
				unset( $this->doc->_scripts[ $link ] );
			}
		}

		// Remove unnecessary Joomla's stylesheets.
		foreach ( array_keys( $this->doc->_styleSheets ) as $link )
		{
			if ( strrpos( $link, 'template.css' ) )
			{
				unset( $this->doc->_styleSheets[ $link ] );
			}
		}

		// Generate base for assets URL.
		$base = JUri::root( true ) . '/plugins/system/sunfw/assets';

		// Load Bootstrap.
		$this->doc->addStyleSheet( "{$base}/3rd-party/bootstrap/style.css" );

		$this->doc->addScript( "{$base}/3rd-party/bootstrap/js/bootstrap.min.js" );

		// Load Jquery UI.
		$this->doc->addScript( "{$base}/3rd-party/jquery-ui-1.12.0/jquery-ui.min.js" );
		$this->doc->addStyleSheet( "{$base}/3rd-party/jquery-ui-1.12.0/css/ui-bootstrap-1.10.0/jquery-ui-1.10.0.custom.css" );

		// Load Font Awesome.
		$this->doc->addStyleSheet( "{$base}/3rd-party/font-awesome/css/font-awesome.min.css");

		// Load Font fontello.
		$this->doc->addStyleSheet( "{$base}/3rd-party/fontello/css/fontello.css");

		// Load noty.
		$this->doc->addScript( "{$base}/3rd-party/noty/jquery.noty.js" );
		$this->doc->addStyleSheet( "{$base}/3rd-party/noty/animate.css");

		// Load Bootbox.
		$this->doc->addScript( "{$base}/3rd-party/bootbox/bootbox.min.js" );

		// Load Boxshadow.
		//$this->doc->addScript( "{$base}/3rd-party/box-shadow/box-shadow.js" );

		// Load update.
		$this->doc->addScript( "{$base}/joomlashine/admin/js/update.js" );

		// Load quickstart.
		$this->doc->addScript( "{$base}/joomlashine/admin/js/quickstart.js" );

		// Load core.
		$this->doc->addScript( "{$base}/joomlashine/admin/js/core.js" );

		// Load spectrum.
		$this->doc->addStyleSheet( "{$base}/3rd-party/spectrum/spectrum.css" );
		$this->doc->addScript( "{$base}/3rd-party/spectrum/spectrum.js" );

		// Load serialize all.
		$this->doc->addScript( "{$base}/3rd-party/serialize-all/serialize-all.js" );

		// Load JQuery Cookie.
		$this->doc->addScript( "{$base}/3rd-party/jquery-cookie/jquery.cookie.js" );

		// Load box shadow.
		//$this->doc->addScript( "{$base}/3rd-party/box-shadow/box-shadow.js" );

		// Load sticky sidebar.
		$this->doc->addScript( "{$base}/3rd-party/sticky-sidebar/theia-sticky-sidebar.js" );

		// Load Textshadow.
		//$this->doc->addScript( "{$base}/3rd-party/text-shadow/text-shadow.js" );

		// Load border radius.
		//$this->doc->addScript( "{$base}/3rd-party/border-radius/border-radius.js" );

		// Load padding.
		//$this->doc->addScript( "{$base}/3rd-party/padding/padding.js" );

		// Load border.
		//$this->doc->addScript( "{$base}/3rd-party/border/border.js" );

		$this->doc->addStyleSheet( "{$base}/joomlashine/admin/css/general.css" );
		$this->doc->addStyleSheet( "{$base}/joomlashine/admin/css/appearance.css" );

		// Load scripts for appearance and advanced tabs.
		$this->doc->addScript( "{$base}/joomlashine/admin/js/menuassignment.js" );
		$this->doc->addScript( "{$base}/joomlashine/admin/js/appearance.js" );
		$this->doc->addScript( "{$base}/joomlashine/admin/js/advanced.js" );
		$this->doc->addScript( "{$base}/joomlashine/admin/js/media.js" );
		//$this->doc->addScript( "{$base}/joomlashine/admin/js/googlefont.js" );
		//$this->doc->addScript( "{$base}/joomlashine/admin/js/font.js" );
		$this->doc->addScript( "{$base}/joomlashine/admin/js/about.js" );

		// Load Interact.
		$this->doc->addScript( "{$base}/3rd-party/interact/interact.min.js" );

		// Load React.
		$this->doc->addScript( "{$base}/3rd-party/react/react.min.js" );
		$this->doc->addScript( "{$base}/3rd-party/react/react-dom.min.js" );

		// Load Babel.
		$this->doc->addScript( "{$base}/3rd-party/babel-core/browser.min.js" );

		// Load shared library for React apps.
		$this->doc->addStyleSheet( "{$base}/apps/share/style.css" );

		$this->doc->addScript( "{$base}/apps/share/mixins.js", 'text/babel' );
		$this->doc->addScript( "{$base}/apps/share/common.js", 'text/babel' );

		// Load layout builder React app.
		$this->doc->addStyleSheet( "{$base}/apps/layout-builder/editor.css" );

		$this->doc->addScript( "{$base}/apps/layout-builder/editor.js", 'text/babel' );

		// Load style editor React app.
		$this->doc->addStyleSheet( "{$base}/apps/style-editor/editor.css" );

		$this->doc->addScript( "{$base}/apps/style-editor/editor.js", 'text/babel' );

		// Load menu builder React app.
		$this->doc->addStyleSheet( "{$base}/apps/menu-builder/editor.css" );

		$this->doc->addScript( "{$base}/apps/menu-builder/editor.js", 'text/babel' );

		// Load cookie law React app.
		$this->doc->addStyleSheet( "{$base}/apps/cookie-law/editor.css" );

		$this->doc->addScript( "{$base}/apps/cookie-law/editor.js", 'text/babel' );

		// Load sample data React app.
		$this->doc->addStyleSheet( "{$base}/apps/sample-data/installer.css" );

		$this->doc->addScript( "{$base}/apps/sample-data/installer.js", 'text/babel' );
	}

	/**
	 * Render HTML for template administration screen.
	 *
	 * @return  void
	 */
	public function renderHtml()
	{
		// Get token and template data.
		$token 	= JSession::getFormToken();
		$config = JFactory::getConfig();
		$sessionLifeTime = intval($config->get('lifetime') * 60 / 3 * 1000);

		$jVersion		= new JVersion;
		$jShortVersion 	= $jVersion->getShortVersion();

		$styleID    = $this->app->input->getInt( 'id' , 0 );
		$sunFwStyle = SunFwHelper::getSunFwStyle( $styleID );

		// Load all configuration tabs.
		$tabs        = array();
		$config_tabs = array(
			'layout',
			'styles',
			'navigation',
			'advanced',
			'extras' => array( 'cookie-law' ),
			'menu-assignment',
			'data',
			'global-parameters',
			'about'
		);

		foreach ( $config_tabs as $key => $tab )
		{
			if ( is_string( $tab ) )
			{
				$config_file  = dirname( __FILE__ ) . "/admin/config/{$tab}.xml";

				if ( is_file( $config_file ) )
				{
					$tabs[ $tab ] = $this->renderTab( $tab, $config_file );
				}
			}
			elseif ( is_array( $tab ) )
			{
				foreach ( $tab as $sub_tab )
				{
					$config_file  = dirname( __FILE__ ) . "/admin/config/{$sub_tab}.xml";

					if ( is_file( $config_file ) )
					{
						$tabs[ $key ][ $sub_tab ] = $this->renderTab( $sub_tab, $config_file );
					}
				}
			}
		}

		// Generate HTML output.
		ob_start();
		?>
		<script type="text/javascript">
			window.save_all_step 	= 0;
			window.layoutBuilderHasChange 		= false;
			window.menuBuilderHasChange 		= false;
			window.styleBuilderHasChange 		= false;
			window.systemHasChange 				= false;
			window.cookieLawHasChange 				= false;
			window.assignmentHasChange 			= false;
			window.show_noty 					= true;
			window.previousActiveTab = '';
			window.save_all_is_processing = false;
			//This default onbeforeunload event
			window.onbeforeunload = function(){
				if (window.cookieLawHasChange || window.layoutBuilderHasChange || window.styleBuilderHasChange || window.menuBuilderHasChange || window.systemHasChange || window.assignmentHasChange)
				{
					return 'Are you sure you want to leave this page?  You will lose any unsaved data.';
				}

				return;

			}
		</script>
		<script type="text/javascript">
			!function($) {
				"use strict";
				$(function () {
					new $.SunFwCore({
						token: '<?php echo $token; ?>',
						template: '<?php echo $this->template; ?>',
						root: '<?php echo JUri::base(true); ?>',
						pathRoot:'<?php echo JUri::base(true); ?>/index.php',
						sessionLifeTime: '<?php echo $sessionLifeTime; ?>',
						styleId: '<?php echo $this->app->input->getInt( 'id' ); ?>',
					});
				});
			}(jQuery);
		</script>
		<script type="text/javascript">
			window.sunfw = <?php echo json_encode( array(
				'base_url'  => JUri::root(),
				'sunfw_url' => JUri::root() . trim( str_replace( '\\', '/', str_replace( JPATH_ROOT, '', SUNFW_PATH ) ), '/' ),
				'has_data'  => ! empty( $sunFwStyle ),
				'text'      => array(
					'none' => JText::_('SUNFW_NONE'),
					'loading' => JText::_('SUNFW_LOADING'),
					'please-wait' => JText::_('SUNFW_PLEASE_WAIT'),
					'get-started' => JText::_('SUNFW_GET_STARTED'),
					'install-sample-data-intro' => JText::_('SUNFW_INSTALL_SAMPLE_DATA_INTRO'),
					'learn-more-intro' => JText::_('SUNFW_LEARN_MORE_INTRO'),

					'layout-builder' => JText::_('SUNFW_LAYOUT_BUILDER'),
					'empty-layout-message' => JText::_('SUNFW_LAYOUT_BUILDER_EMPTY_MESSAGE'),
					'empty-menu-message' => JText::_('SUNFW_MENU_BUILDER_EMPTY_MESSAGE'),

					'layout-page' => JText::_('SUNFW_LAYOUT_PAGE'),
					'layout-section' => JText::_('SUNFW_LAYOUT_SECTION'),
					'item-row' => JText::_('SUNFW_LAYOUT_ROW'),
					'item-column' => JText::_('SUNFW_LAYOUT_COLUMN'),

					'page-settings' => JText::_('SUNFW_PAGE_SETTINGS'),
					'section-settings' => JText::_('SUNFW_SECTION_SETTINGS'),
					'offcanvas-settings' => JText::_('SUNFW_OFFCANVAS_SETTINGS'),
					'row-settings' => JText::_('SUNFW_ROW_SETTINGS'),
					'column-settings' => JText::_('SUNFW_COLUMN_SETTINGS'),
					'item-settings' => JText::_('SUNFW_ITEM_SETTINGS'),

					'enable-responsive' => JText::_('SUNFW_ENABLE_RESPONSIVE'),
					'desktop-switcher' => JText::_('SUNFW_SHOW_DESKTOP_SWITCHER'),
					'boxed-layout' => JText::_('SUNFW_ENABLE_BOXED_LAYOUT'),
					'boxed-layout-width' => JText::_('SUNFW_BOXED_LAYOUT_WIDTH'),
					'show-go-to-top' => JText::_('SUNFW_SHOW_GO_TO_TOP'),

					'load-prebuilt-layout' => JText::_('SUNFW_LOAD_PREBUILT_LAYOUT'),
					'save-prebuilt-layout' => JText::_('SUNFW_SAVE_PREBUILT_LAYOUT'),
					'prebuilt-layout-name' => JText::_('SUNFW_PREBUILT_LAYOUT_NAME'),
					'new-layout' => JText::_('SUNFW_NEW_LAYOUT'),

					'save-layout' => JText::_('SUNFW_SAVE_LAYOUT'),
					'save-success' => JText::_('SUNFW_SAVE_DATA_SUCCESS'),
					'saving-data' => JText::_('SUNFW_SAVING_DATA'),
					'saved-data' => JText::_('SUNFW_SAVED_DATA'),

					'undo' => JText::_('SUNFW_UNDO'),
					'redo' => JText::_('SUNFW_REDO'),
					'ok' => JText::_('SUNFW_OK'),
					'cancel' => JText::_('SUNFW_CANCEL'),
					'close' => JText::_('SUNFW_CLOSE'),
					'save' => JText::_('SUNFW_SAVE'),
					'select' => JText::_('SUNFW_SELECT'),
					'normal' => JText::_('SUNFW_NORMAL'),

					'section' => JText::_('SUNFW_SECTION'),
					'row' => JText::_('SUNFW_ROW'),
					'column' => JText::_('SUNFW_COLUMN'),
					'block' => JText::_('SUNFW_BLOCK'),
					'item' => JText::_('SUNFW_ITEM'),

					'clone-label' => JText::_('SUNFW_CLONE_LABEL'),
					'no-settings' => JText::_('SUNFW_NO_SETTINGS'),
					'edit-item' => JText::_('SUNFW_EDIT_ITEM'),
					'edit-icon' => JText::_('SUNFW_EDIT_ICON'),
					'search-for' => JText::_('SUNFW_SEARCH_FOR'),
					'file-manager' => JText::_('SUNFW_FILE_MANAGER'),
					'choose-image' => JText::_('SUNFW_CHOOSE_IMAGE'),

					'enable-full-width' => JText::_('SUNFW_ENABLE_FULL_WIDTH'),
					'display-in-layout' => JText::_('SUNFW_DISPLAY_IN_LAYOUT'),
					'show-on-front-page' => JText::_('SUNFW_SHOW_ON_FRONT_PAGE'),

					'desktop' => JText::_('SUNFW_DESKTOP'),
					'latop' => JText::_('SUNFW_LATOP'),
					'tablet' => JText::_('SUNFW_TABLET'),
					'smartphone' => JText::_('SUNFW_SMARTPHONE'),

					'margin-top' => JText::_('SUNFW_MARGIN_TOP'),
					'margin-right' => JText::_('SUNFW_MARGIN_RIGHT'),
					'margin-bottom' => JText::_('SUNFW_MARGIN_BOTTOM'),
					'margin-left' => JText::_('SUNFW_MARGIN_LEFT'),

					'padding-top' => JText::_('SUNFW_PADDING_TOP'),
					'padding-right' => JText::_('SUNFW_PADDING_RIGHT'),
					'padding-bottom' => JText::_('SUNFW_PADDING_BOTTOM'),
					'padding-left' => JText::_('SUNFW_PADDING_LEFT'),

					'text-color' => JText::_('SUNFW_TEXT_COLOR'),
					'custom-classes' => JText::_('SUNFW_CUSTOME_CLASSES'),

					'text' => JText::_('SUNFW_TEXT'),
					'link' => JText::_('SUNFW_LINK'),
					'icon' => JText::_('SUNFW_ICON'),
					'name' => JText::_('SUNFW_NAME'),

					'joomla-module' => JText::_('SUNFW_SELECT_JOOMLA_MODULE'),
					'module-style' => JText::_('SUNFW_SELECT_MODULE_STYLE'),
					'configure-module' => JText::_('SUNFW_CONFIGURE_MODULE'),

					'search-icon' => JText::_('SUNFW_SEARCH_ICON'),
					'fixed-width-icon' => JText::_('SUNFW_FIXED_WIDTH_ICON'),
					'animated-icon' => JText::_('SUNFW_ANIMATED_ICON'),
					'icon-size' => JText::_('SUNFW_ICON_SIZE'),
					'icon-size-lg' => JText::_('SUNFW_ICON_LARGE'),
					'icon-size-2x' => JText::_('SUNFW_ICON_2X'),
					'icon-size-3x' => JText::_('SUNFW_ICON_3X'),
					'icon-size-4x' => JText::_('SUNFW_ICON_4X'),
					'icon-size-5x' => JText::_('SUNFW_ICON_5X'),
					'icon-rotate-flip' => JText::_('SUNFW_ICON_ROTATE_FLIP'),
					'icon-rotate-90' => JText::_('SUNFW_ICON_ROTATE_90'),
					'icon-rotate-180' => JText::_('SUNFW_ICON_ROTATE_180'),
					'icon-rotate-270' => JText::_('SUNFW_ICON_ROTATE_270'),
					'icon-flip-horizontal' => JText::_('SUNFW_ICON_FLIP_HORIZONTAL'),
					'icon-flip-vertical' => JText::_('SUNFW_ICON_FLIP_VERTICAL'),

					'icon-web-apps' => JText::_('SUNFW_ICON_WEB_APPS'),
					'icon-hands' => JText::_('SUNFW_ICON_HANDS'),
					'icon-transports' => JText::_('SUNFW_ICON_TRANSPORTS'),
					'icon-genders' => JText::_('SUNFW_ICON_GENDERS'),
					'icon-file-types' => JText::_('SUNFW_ICON_FILE_TYPES'),
					'icon-spinners' => JText::_('SUNFW_ICON_SPINNERS'),
					'icon-form-controls' => JText::_('SUNFW_ICON_FORM_CONTROLS'),
					'icon-payments' => JText::_('SUNFW_ICON_PAYMENTS'),
					'icon-charts' => JText::_('SUNFW_ICON_CHARTS'),
					'icon-currencies' => JText::_('SUNFW_ICON_CURRENCIES'),
					'icon-text-editors' => JText::_('SUNFW_ICON_TEXT_EDITORS'),
					'icon-directions' => JText::_('SUNFW_ICON_DIRECTIONS'),
					'icon-video-players' => JText::_('SUNFW_ICON_VIDEO_PLAYERS'),
					'icon-brands' => JText::_('SUNFW_ICON_BRANDS'),
					'icon-medicals' => JText::_('SUNFW_ICON_MEDICALS'),

					'select-module-position' => JText::_('SUNFW_SELECT_MODULE_POSITION'),
					'create-position' => JText::_('SUNFW_CREATE_POSITION'),
					'position-name' => JText::_('SUNFW_POSITION_NAME'),

					'select-menu-type' => JText::_('SUNFW_SELECT_MENU_TYPE'),
					'select-menu-item' => JText::_('SUNFW_SELECT_MENU_ITEM'),

					'select-module' => JText::_('SUNFW_SELECT_MODULE'),
					'choose-module' => JText::_('SUNFW_CHOOSE_MODULE'),

					'toggle-position' => JText::_('SUNFW_TOGGLE_POSITION'),
					'left' => JText::_('SUNFW_LEFT'),
					'top' => JText::_('SUNFW_TOP'),
					'center' => JText::_('SUNFW_CENTER'),
					'middle' => JText::_('SUNFW_MIDDLE'),
					'right' => JText::_('SUNFW_RIGHT'),
					'bottom' => JText::_('SUNFW_BOTTOM'),
					'open-on-hover' => JText::_('SUNFW_OPEN_ON_HOVER'),

					'logo' => JText::_('SUNFW_LOGO'),
					'mobile-logo' => JText::_('SUNFW_MOBILE_LOGO'),
					'logo-alt-text' => JText::_('SUNFW_LOGO_ALT_TEXT'),
					'logo-link' => JText::_('SUNFW_LOGO_LINK'),

					'html-content' => JText::_('SUNFW_HTML_CONTENT'),
					'set-html-content' => JText::_('SUNFW_SET_HTML_CONTENT'),

					'yes' => JText::_('SUNFW_YES'),
					'no' => JText::_('SUNFW_NO'),

					'full_width' => JText::_('SUNFW_FULL_WIDTH'),
					'visibility' => JText::_('SUNFW_ALWAYS_VISIBLE'),
					'desktop_and_mobile' => JText::_('SUNFW_DESKTOP_AND_MOBILE'),
					'mobile' => JText::_('SUNFW_MOBILE_ONLY'),

					'effect' => JText::_('SUNFW_OFF_CANVAS_EFFECT'),
					'push' => JText::_('SUNFW_PUSH'),
					'slide' => JText::_('SUNFW_SLIDE'),

					'module-position' => JText::_('SUNFW_MODULE_POSITION'),
					'section-name' => JText::_('SUNFW_SECTION_NAME'),
					'prefix-class' => JText::_('SUNFW_PREFIX_CLASS'),

					'title' => JText::_('SUNFW_TITLE'),
					'contact-item' => JText::_('SUNFW_CONTACT_ITEM'),

					'duplicate-id' => JText::_('SUNFW_DUPLICATE_ID'),
					'one-time-item' => JText::_('SUNFW_ONE_TIME_ITEM_NOTICE'),
					'clone-item-error' => JText::_('SUNFW_CLONE_ITEM_ERROR_MESSAGE'),
					'used-one-time-item' => JText::_('SUNFW_USED_ONE_TIME_ITEM'),

					'menu-builder' => JText::_('SUNFW_MENU_BUILDER'),
					'save-menu' => JText::_('SUNFW_SAVE_MENU'),

					'general' => JText::_('SUNFW_GENERAL'),
					'effects' => JText::_('SUNFW_EFFECTS'),
					'submenu_effects' => JText::_('SUNFW_SUBMENU_EFFECT'),
					'menu' => JText::_('SUNFW_MENU'),
					'megamenu' => JText::_('SUNFW_MEGAMENU'),
					'visibility_menu' => JText::_('SUNFW_VISIBILITY'),

					'language' => JText::_('SUNFW_LANGUAGE'),
					'language-*' => JText::_('SUNFW_LANGUAGE_ALL'),
					'click-to-select' => JText::_('SUNFW_CLICK_TO_SELECT'),

					'submenu-width' => JText::_('SUNFW_SUBMENU_LAYOUT_WIDTH'),
					'submenu-align' => JText::_('SUNFW_SUBMENU_ALIGN'),
					'submenu-icon' => JText::_('SUNFW_SUBMENU_ICON'),
					'submenu-desc' => JText::_('SUNFW_SUBMENU_DESC'),

					'title-cannot-be-blank' => JText::_('SUNFW_TITLE_CANNOT_BE_BLANK'),
					'select-module-style' => JText::_('SUNFW_SELECT_MODULE_STYLE'),
					'alt-text' => JText::_('SUNFW_ALT_TEXT'),
					'image' => JText::_('SUNFW_IMAGE'),

					'sample-data' => JText::_('SUNFW_SAMPLE_DATA_TAB'),
					'continue' => JText::_('SUNFW_CONTINUE'),

					'preview-sample' => JText::_('SUNFW_PREVIEW_SAMPLE'),
					'install-sample' => JText::_('SUNFW_INSTALL_SAMPLE'),
					'reinstall-sample' => JText::_('SUNFW_REINSTALL_SAMPLE'),
					'uninstall-sample' => JText::_('SUNFW_UNINSTALL_SAMPLE'),
					'install-label' => JText::_('SUNFW_INSTALL_LABEL'),
					'reinstall-label' => JText::_('SUNFW_REINSTALL_LABEL'),
					'uninstall-label' => JText::_('SUNFW_UNINSTALL_LABEL'),
					'important-notice' => JText::_('SUNFW_IMPORTANT_NOTICE'),

					'install-sample-data' => JText::_('SUNFW_INSTALL_SAMPLE_DATA'),
					'reinstall-sample-data' => JText::_('SUNFW_REINSTALL_SAMPLE_DATA'),
					'install-sample-notice-1' => JText::_('SUNFW_INSTALL_SAMPLE_NOTICE_1'),
					'install-sample-notice-2' => JText::_('SUNFW_INSTALL_SAMPLE_NOTICE_2'),
					'install-sample-notice-3' => JText::_('SUNFW_INSTALL_SAMPLE_NOTICE_3'),
					'install-sample-notice-4' => JText::_('SUNFW_INSTALL_SAMPLE_NOTICE_4'),
					'install-sample-confirm' => JText::_('SUNFW_INSTALL_SAMPLE_CONFIRMATION'),

					'install-sample-processing' => JText::_('SUNFW_INSTALL_SAMPLE_PROCESSING'),
					'install-structure-processing' => JText::_('SUNFW_INSTALL_STRUCTURE_PROCESSING'),
					'install-structure-data' => JText::_('SUNFW_INSTALL_STRUCTURE_DATA'),
					'download-sample-package' => JText::_('SUNFW_DOWNLOAD_SAMPLE_DATA_PACKAGE'),
					'upload-sample-package' => JText::_('SUNFW_UPLOAD_SAMPLE_DATA_PACKAGE'),
					'install-sample-package' => JText::_('SUNFW_INSTALL_SAMPLE_DATA_PACKAGE'),
					'recommend-extensions' => JText::_('SUNFW_RECOMMEND_EXTENSIONS'),
					'install-extensions' => JText::_('SUNFW_INSTALL_REQUIRED_EXTENSIONS'),
					'download-demo-assets' => JText::_('SUNFW_DOWNLOAD_DEMO_ASSETS'),
					'download-sample-package-m' => JText::_('SUNFW_DOWNLOAD_SAMPLE_DATA_PACKAGE_MANUALLY'),
					'download-file' => JText::_('SUNFW_DOWNLOAD_FILE'),
					'select-sample-package' => JText::_('SUNFW_SELECT_SAMPLE_DATA_PACKAGE'),
					'please-select-package' => JText::_('SUNFW_PLEASE_SELECT_SAMPLE_PACKAGE'),
					'cleaning' => JText::_('SUNFW_CLEANING'),
					'new-installation' => JText::_('SUNFW_NEW_INSTALLATION'),
					'update' => JText::_('SUNFW_UPDATE'),
					'read-more' => JText::_('SUNFW_READ_MORE'),

					'install-sample-success' => JText::_('SUNFW_SAMPLE_DATA_INSTALLED_SUCCESSFULLY'),
					'install-sample-attention' => JText::_('SUNFW_SAMPLE_DATA_INSTALLED_WITH_ATTENTION'),
					'install-sample-failure' => JText::_('SUNFW_FAILED_TO_INSTALL_SAMPLE_DATA'),
					'uninstall-sample-success' => JText::_('SUNFW_SAMPLE_DATA_UNINSTALLED_SUCCESSFULLY'),
					'uninstall-sample-failure' => JText::_('SUNFW_FAILED_TO_UNINSTALL_SAMPLE_DATA'),

					'attention' => JText::_('SUNFW_ATTENTION'),
					'notice-for-unchecked-extension' => JText::_('SUNFW_NOTICE_FOR_UNCHECKED_EXTENSION'),
					'get-it-now' => JText::_('SUNFW_GET_IT_NOW'),
					'start-editing' => JText::_('SUNFW_START_EDITING'),

					'uninstall-sample-data' => JText::_('SUNFW_UNINSTALL_SAMPLE_DATA'),
					'uninstall-sample-notice' => JText::_('SUNFW_UNINSTALL_SAMPLE_NOTICE'),
					'uninstall-sample-confirm' => JText::_('SUNFW_UNINSTALL_SAMPLE_CONFIRMATION'),

					'uninstall-sample-processing' => JText::_('SUNFW_UNINSTALL_SAMPLE_PROCESSING'),
					'restore-backed-up-data' => JText::_('SUNFW_RESTORE_BACKED_UP_DATA'),

					'sample-data-message' => JText::_('SUNFW_SAMPLE_DATA_MESSAGE'),
					'module-style-message' => JText::_('SUNFW_MODULE_STYLE_MESSAGE'),
					'install-structure' => JText::_('SUNFW_INSTALL_STRUCTURE'),

					'style-editor' => JText::_('SUNFW_STYLE_EDITOR'),

					'load-style-preset' => JText::_('SUNFW_PREBUILT_STYLES'),
					'save-style' => JText::_('SUNFW_SAVE_STYLE'),
					'save-style-preset' => JText::_('SUNFW_SAVE_PREBUILT_STYLE'),
					'style-preset-name' => JText::_('SUNFW_PREBUILT_STYLE_NAME'),

					'general-settings-button' => JText::_('SUNFW_GENERAL_SETTINGS_BUTTON_TEXT'),
					'section-settings-button' => JText::_('SUNFW_SECTION_SETTINGS_BUTTON_TEXT'),
					'module-settings-button' => JText::_('SUNFW_MODULE_SETTINGS_BUTTON_TEXT'),
					'menu-settings-button' => JText::_('SUNFW_MENU_SETTINGS_BUTTON_TEXT'),

					'no-section-found' => JText::_('SUNFW_NO_SECTION_FOUND'),
					'no-menu-found' => JText::_('SUNFW_NO_MENU_FOUND'),

					'universal-settings' => JText::_('SUNFW_UNIVERSAL_SETTINGS'),
					'individual-settings' => JText::_('SUNFW_INDIVIDUAL_SETTINGS'),

					'outer-page' => JText::_('SUNFW_OUTER_PAGE'),
					'inner-page' => JText::_('SUNFW_INNER_PAGE'),

					'section-title' => JText::_('SUNFW_SECTION_TITLE'),
					'module-style' => JText::_('SUNFW_MODULE_STYLE'),
					'menu-title' => JText::_('SUNFW_MENU_TITLE'),

					'background-color' => JText::_('SUNFW_BACKGROUND_COLOR'),
					'background-image' => JText::_('SUNFW_BACKGROUND_IMAGE'),
					'background-image-settings' => JText::_('SUNFW_BACKGROUND_IMAGE_SETTINGS'),
					'background-repeat' => JText::_('SUNFW_BACKGROUND_REPEAT'),
					'background-size' => JText::_('SUNFW_BACKGROUND_SIZE'),
					'background-attachment' => JText::_('SUNFW_BACKGROUND_ATTACHMENT'),
					'background-position' => JText::_('SUNFW_BACKGROUND_POSITION'),

					'border' => JText::_('SUNFW_BORDER'),
					'border-settings' => JText::_('SUNFW_BORDER_SETTINGS'),
					'border-width' => JText::_('SUNFW_BORDER_WIDTH'),
					'border-style' => JText::_('SUNFW_BORDER_STYLE'),
					'border-color' => JText::_('SUNFW_BORDER_COLOR'),
					'border-top' => JText::_('SUNFW_BORDER_TOP'),
					'border-right' => JText::_('SUNFW_BORDER_RIGHT'),
					'border-bottom' => JText::_('SUNFW_BORDER_BOTTOM'),
					'border-left' => JText::_('SUNFW_BORDER_LEFT'),
					'border-color-hover' => JText::_('SUNFW_BORDER_COLOR_HOVER'),

					'color' => JText::_('SUNFW_COLOR'),
					'main-color' => JText::_('SUNFW_MAIN_COLOR'),
					'sub-color' => JText::_('SUNFW_SUB_COLOR'),
					'font-type' => JText::_('SUNFW_FONT_TYPE'),
					'standard' => JText::_('SUNFW_STANDARD'),
					'google' => JText::_('SUNFW_GOOGLE'),
					'font-family' => JText::_('SUNFW_FONT_FAMILY'),
					'custom' => JText::_('SUNFW_CUSTOM'),
					'font-file' => JText::_('SUNFW_FONT_FILE'),
					'choose-custom-font' => JText::_('SUNFW_CHOOSE_CUSTOM_FONT'),
					'font-style' => JText::_('SUNFW_FONT_STYLE'),
					'font-style-normal' => JText::_('SUNFW_FONT_STYLE_NORMAL'),
					'font-style-italic' => JText::_('SUNFW_FONT_STYLE_ITALIC'),
					'font-style-oblique' => JText::_('SUNFW_FONT_STYLE_OBLIQUE'),
					'font-weight' => JText::_('SUNFW_FONT_WEIGHT'),
					'font-weight-bold' => JText::_('SUNFW_FONT_WEIGHT_BOLD'),

					'text-transform' => JText::_('SUNFW_TEXT_TRANSFORM'),
					'text-transform-capitalize' => JText::_('SUNFW_TEXT_TRANSFORM_CAPITALIZE'),
					'text-transform-uppercase' => JText::_('SUNFW_TEXT_TRANSFORM_UPPERCASE'),
					'text-transform-lowercase' => JText::_('SUNFW_TEXT_TRANSFORM_LOWERCASE'),

					'base-size' => JText::_('SUNFW_TEXT_BASE_SIZE'),
					'letter-spacing' => JText::_('SUNFW_TEXT_LETTER_SPACING'),

					'box-shadow' => JText::_('SUNFW_BOX_SHADOW'),
					'box-shadow-settings' => JText::_('SUNFW_BOX_SHADOW_SETTINGS'),
					'box-shadow-h-shadow' => JText::_('SUNFW_BOX_SHADOW_H_SHADOW'),
					'box-shadow-v-shadow' => JText::_('SUNFW_BOX_SHADOW_V_SHADOW'),
					'box-shadow-blur' => JText::_('SUNFW_BOX_SHADOW_BLUR'),
					'box-shadow-spread' => JText::_('SUNFW_BOX_SHADOW_SPREAD'),
					'box-shadow-color' => JText::_('SUNFW_BOX_SHADOW_COLOR'),
					'box-shadow-inset' => JText::_('SUNFW_BOX_SHADOW_INSET'),
					'box-shadow-opacity' => JText::_('SUNFW_BOX_SHADOW_OPACITY'),

					'text-shadow' => JText::_('SUNFW_TEXT_TEXT_SHADOW'),
					'text-shadow-settings' => JText::_('SUNFW_TEXT_SHADOW_SETTINGS'),

					'margin' => JText::_('SUNFW_MARGIN'),
					'margin-settings' => JText::_('SUNFW_MARGIN_SETTINGS'),
					'margin-top' => JText::_('SUNFW_MARGIN_TOP'),
					'margin-right' => JText::_('SUNFW_MARGIN_RIGHT'),
					'margin-bottom' => JText::_('SUNFW_MARGIN_BOTTOM'),
					'margin-left' => JText::_('SUNFW_MARGIN_LEFT'),

					'padding' => JText::_('SUNFW_PADDING'),
					'padding-settings' => JText::_('SUNFW_PADDING_SETTINGS'),
					'padding-top' => JText::_('SUNFW_PADDING_TOP'),
					'padding-right' => JText::_('SUNFW_PADDING_RIGHT'),
					'padding-bottom' => JText::_('SUNFW_PADDING_BOTTOM'),
					'padding-left' => JText::_('SUNFW_PADDING_LEFT'),

					'font-size' => JText::_('SUNFW_FONT_SIZE'),
					'line-height' => JText::_('SUNFW_LINE_HEIGHT'),

					'border-radius' => JText::_('SUNFW_TEXT_BORDER_RADIUS'),
					'border-radius-settings' => JText::_('SUNFW_BORDER_RADIUS_SETTINGS'),
					'border-radius-top' => JText::_('SUNFW_BORDER_RADIUS_TOP'),
					'border-radius-right' => JText::_('SUNFW_BORDER_RADIUS_RIGHT'),
					'border-radius-bottom' => JText::_('SUNFW_BORDER_RADIUS_BOTTOM'),
					'border-radius-left' => JText::_('SUNFW_BORDER_RADIUS_LEFT'),

					'normal-color' => JText::_('SUNFW_TEXT_NORMAL_COLOR'),
					'hover-color' => JText::_('SUNFW_TEXT_HOVER_COLOR'),

					'use-custom-settings' => JText::_('SUNFW_TEXT_USE_CUSTOM_SETTINGS'),
					'icon-size' => JText::_('SUNFW_TEXT_ICON_SIZE'),
					'icon-color' => JText::_('SUNFW_TEXT_ICON_COLOR'),
					'link-color' => JText::_('SUNFW_TEXT_LINK_COLOR'),

					'normal-state' => JText::_('SUNFW_TEXT_NORMAL_STATE'),
					'hover-state' => JText::_('SUNFW_TEXT_HOVER_STATE'),
					'hover-active-state' => JText::_('SUNFW_TEXT_HOVER_ACTIVE_STATE'),

					'google-font-selector' => JText::_('SUNFW_GOOGLE_FONT_SELECTOR'),
					'google-font-categories' => JText::_('SUNFW_GOOGLE_FONT_CATEGORIES'),
					'google-font-subsets' => JText::_('SUNFW_GOOGLE_FONT_SUBSETS'),
					'google-font-total' => JText::_('SUNFW_GOOGLE_FONT_TOTAL'),
					'google-font-search' => JText::_('SUNFW_GOOGLE_FONT_SEARCH'),
					'google-font-variants' => JText::_('SUNFW_GOOGLE_FONT_VARIANTS'),
					'google-font-variant' => JText::_('SUNFW_GOOGLE_FONT_VARIANT'),
					'google-font-subset' => JText::_('SUNFW_GOOGLE_FONT_SUBSET'),

					'base-item' => JText::_('SUNFW_TEXT_BASE_ITEM'),
					'start-level' => JText::_('SUNFW_TEXT_START_LEVEL'),
					'end-level' => JText::_('SUNFW_TEXT_END_LEVEL'),
					'show-sub-menu-items' => JText::_('SUNFW_TEXT_SHOW_SUB_MENU_ITEMS'),
					'all' => JText::_('SUNFW_TEXT_ALL'),
					'fading' => JText::_('SUNFW_TEXT_FADING'),
					'menu-sub-effect' => JText::_('SUNFW_TEXT_MENU_SUB_EFFECT'),
					'enable-sticky' => JText::_('SUNFW_TEXT_ENABLE_STICKY'),
					'mobile-target' => JText::_('SUNFW_TEXT_MOBILE_TARGET'),
					'show-icon' => JText::_('SUNFW_SHOW_ICON'),
					'show-description' => JText::_('SUNFW_SHOW_DESCRIPTION'),
					'show-submenu' => JText::_('SUNFW_SHOW_SUBMENU'),

					'container-settings' => JText::_('SUNFW_CONTAINER_SETTINGS'),
					'block-settings' => JText::_('SUNFW_BLOCK_SETTINGS'),

					'social-icons' => JText::_('SUNFW_SOCIAL_ICONS'),
					'icons' => JText::_('SUNFW_ICONS'),
					'icon-color' => JText::_('SUNFW_ICON_COLOR'),
					'icon-size' => JText::_('SUNFW_ICON_SIZE'),
					'link-target' => JText::_('SUNFW_LINK_TARGET'),
					'add-social-icon' => JText::_('SUNFW_SOCIAL_ICON_ADD'),
					'social-network' => JText::_('SUNFW_SOCIAL_NETWORK'),
					'social-icon' => JText::_('SUNFW_SOCIAL_ICON'),
					'profile-link' => JText::_('SUNFW_SOCIAL_PROFILE_LINK'),

					'show-module-title' => JText::_('SUNFW_TEXT_SHOW_MODULE_TITLE'),
					'social-icon-setting' => JText::_('SUNFW_SOCIAL_ICONS_SETTING'),

					'cookie-law' => JText::_('SUNFW_COOKIE_LAW'),
					'save-cookie-law' => JText::_('SUNFW_SAVE_COOKIE_LAW'),
					'cookie-law-settings' => JText::_('SUNFW_COOKIE_LAW_SETTINGS'),
					'cookie-law-default-message' => JText::_('SUNFW_COOKIE_LAW_DEFAULT_MESSAGE'),
					'cookie-law-article-message' => JText::_('SUNFW_COOKIE_LAW_ARTICLE_MESSAGE'),
					'cookie-law-select-article' => JText::_('SUNFW_COOKIE_LAW_SELECT_ARTICLE'),
					'cookie-law-not-enabled' => JText::_('SUNFW_COOKIE_LAW_NOT_ENABLED'),

					'style' => JText::_('SUNFW_STYLE'),
					'dark' => JText::_('SUNFW_DARK_STYLE'),
					'light' => JText::_('SUNFW_LIGHT_STYLE'),

					'banner-placement' => JText::_('SUNFW_BANNER_PLACEMENT'),
					'floating' => JText::_('SUNFW_FLOATING'),
					'floating-right' => JText::_('SUNFW_FLOATING_RIGHT'),
					'floating-left' => JText::_('SUNFW_FLOATING_LEFT'),
					'static' => JText::_('SUNFW_STATIC'),

					'message' => JText::_('SUNFW_MESSAGE'),
					'article' => JText::_('SUNFW_ARTICLE'),
					'accept-button-text' => JText::_('SUNFW_ACCEPT_BUTTON_TEXT'),
					'read-more-button-text' => JText::_('SUNFW_READ_MORE_BUTTON_TEXT'),
					'cookie-policy-link' => JText::_('SUNFW_COOKIE_POLICY_LINK'),
					'icon-picker' => JText::_('SUNFW_ICON_PICKER'),

					'module' => JText::_('SUNFW_MODULE'),
					'width' => JText::_('SUNFW_WIDTH'),
					'height' => JText::_('SUNFW_HEIGHT'),
					'save-megamenu' => JText::_('SUNFW_SAVE_MEGAMENU'),

					'enable-cookie-consent' => JText::_('SUNFW_ENABLE_COOKIE_CONSENT'),
					'back-to-style-settings' => JText::_('SUNFW_BACK_TO_STYLE_SETTINGS'),
					'fixed-width' => JText::_('SUNFW_FIXED_WIDTH'),
					'back' => JText::_('SUNFW_BACK'),
					'box-layout-min-width' => JText::_('SUNFW_MINIMUM_WIDTH_FOR_BOX_LAYOUT_IS_767'),
					'social-title' => JText::_('SUNFW_SOCIAL_TITLE'),
					'layout' => JText::_('SUNFW_LAYOUT'),
					'style' => JText::_('SUNFW_STYLE'),
					'item-navigation' => JText::_('SUNFW_CONTAINER'),
					'save-all' => JText::_('SUNFW_SAVE_ALL'),
					'skip' => JText::_('SUNFW_SKIP'),

					'megamenu-is-not-activated' => JText::_('SUNFW_MENU_BUILDER_MEGAMENU_IS_NOT_ACTIVATED'),
					'new-style' => JText::_('SUNFW_NEW_STYLE'),
					'no-pre-style' => JText::_('SUNFW_NO_PRE_STYLE'),
					'no-pre-layout' => JText::_('SUNFW_NO_PRE_LAYOUT'),
					'dropdown-width' => JText::_('SUNFW_DROPDOWN_WIDTH'),

					'notice-for-free-extention' => JText::_('SUNFW_NOTICE_FOR_FREE_EXTENSION'),
					'download-it' => JText::_('SUNFW_DOWNLOAD_IT'),
					'notice-for-commercial-extention' => JText::_('SUNFW_NOTICE_FOR_COMMERCIAL_EXTENSION'),
					'learn-more' => JText::_('SUNFW_LEARN_MORE'),

					'mobile-screen-can-have-only-2-columns-per-row' => JText::_('SUNFW_MOBILE_SCREEN_LIMITATION_REACHED'),

					'color-picker-main-color' => JText::_('SUNFW_MAIN_COLOR'),
					'color-picker-sub-color' => JText::_('SUNFW_SUB_COLOR'),
					'color-picker-custom-color' => JText::_('SUNFW_CUSTOM_COLOR'),

					'article-picker' => JText::_('SUNFW_ARTICLE_PICKER'),
					'edit-article' => JText::_('SUNFW_EDIT_ARTICLE'),
					'select-article' => JText::_('SUNFW_SELECT_ARTICLE'),
					'choose-article' => JText::_('SUNFW_CHOOSE_ARTICLE'),

					'session-expired-message' => sprintf(
						JText::_('SUNFW_SESSION_EXPIRED_MESSAGE'),
						JRoute::_( 'index.php?option=com_templates&task=style.edit&id=' . $this->app->input->getInt('id') )
					),

					'sample-data-unavailable-due-to-product-outdated' => JText::_('SUNFW_SAMPLE_DATA_UNAVAILABLE_DUE_TO_PRODUCT_OUTDATED'),
					'update-product' => JText::_('SUNFW_UPDATE_PRODUCT'),
				),
			) ); ?>
		</script>
		<script type="text/javascript">
		(function($)
				{
					$(document).ready(function(){
						//$('#sunfw-admin-tab a').tab('hide'); // Select last tab
						var mootoolsLoaded = (typeof MooTools != 'undefined');
					   	if (mootoolsLoaded)
					   	{
							Element.implement({
								hide: function () {
									return this;
								},
								show: function (v) {
									return this;
								},
								slide: function (v) {
									return this;
								}
							});
					   	}


					});
				})(jQuery);
		</script>
		<form action="<?php
			echo JRoute::_( 'index.php?option=com_templates&layout=edit&id=' . $this->app->input->getInt( 'id' ) );
		?>" method="post" name="adminForm" id="style-form" class="form-validate" onSubmit="return false;">
			<div class="jsn-layout">
				<div class="alert-sunfw-container">
					<!-- Alert Update Framework -->
					<div class="alert alert-sunfw-framework-update sunfwhide alert-sunfw-update">
						<a href="javascript:void(0)" id="sunfw-alert-update-framework-close-btn" class="close" data-dismiss="alert" aria-label="close">&times;</a>
						<div class="container-fluid">
							<div class="pull-left">
								<h4>
								<strong>
									<?php echo JText::_('PLG_SYSTEM_SUNFW_UPDATE_AVAILABLE'); ?>:
									<span class="sunfwhide"><?php echo JText::_('PLG_SYSTEM_SUNFW'); ?> <span class="sunfw-framework-new-version"></span></span>
								</strong>
								</h4>
							</div>
							<div class="pull-right">
								<a href="javascript:void(0)" id="sunfw-update-framework-now-btn" class="btn btn-primary sunfwhide"><?php echo JText::_('SUNFW_UPDATE'); ?></a>
							</div>
						</div>
					</div>
					<!-- Alert Update Framework-->

					<!-- Alert Update Template -->
					<div class="alert alert-sunfw-template-update sunfwhide alert-sunfw-update">
						<a href="javascript:void(0)" id="sunfw-alert-update-template-close-btn" class="close" data-dismiss="alert" aria-label="close">&times;</a>
						<div class="container-fluid">
							<div class="pull-left">
								<h4>
								<strong>
									<?php echo JText::_('PLG_SYSTEM_SUNFW_UPDATE_AVAILABLE'); ?>:
									<span class="sunfwhide"><?php echo strtoupper(str_replace('_', ' ', str_replace('pro', '', $this->templateManifestCache->name))); ?> <?php echo $this->templateInfo->edition; ?> <span class="sunfw-template-new-version"></span></span>

								</strong>
								</h4>
							</div>
							<div class="pull-right">
								<a href="javascript:void(0)" id="sunfw-update-template-now-btn" class="btn btn-primary sunfwhide"><?php echo JText::_('SUNFW_UPDATE'); ?></a>
							</div>
						</div>
					</div>
					<!-- Alert Update Template-->

					<!-- Missing token -->
					<div class="alert alert-sunfw-missing-token sunfwhide">
						<a href="javascript:void(0)" class="close" data-dismiss="alert" aria-label="close">&times;</a>
						<div class="container-fluid">
							<div class="pull-left">
								<h4>
									<strong><?php echo JText::_('SUNFW_MISSING_TOKEN'); ?></strong>
								</h4>
							</div>
							<div class="pull-right">
								<a href="javascript:void(0)" id="sunfw-missing-token-btn" class="btn btn-primary"><?php echo JText::_('SUNFW_SET_TOKEN_KEY'); ?></a>
							</div>
						</div>
					</div>
				</div>
				<!-- Missing token -->

				<!-- Top bar -->
				<?php
					// Gets the FrontEnd Main page Uri
					$app		 	= JFactory::getApplication();
					$frontEndUri 	= JUri::getInstance(JUri::root());
					$frontEndUri->setScheme(((int) $app->get('force_ssl', 0) === 2) ? 'https' : 'http');
					$mainPageUri 	= $frontEndUri->toString();
					$sitename 		= htmlspecialchars($app->get('sitename', ''), ENT_QUOTES, 'UTF-8');

				?>
				<div class="jsn-topbar sunfw-top">
					<div class="container-fluid">
						<span class="logo"><img src="<?php echo JURI::root(true) ?>/plugins/system/sunfw/assets/images/logo.png"></span>
						<a class="brand visible-desktop visible-tablet" href="<?php echo $mainPageUri; ?>" title="<?php echo JText::sprintf('TPL_ISIS_PREVIEW', $sitename); ?>" target="_blank" rel="noopener noreferrer">
							<?php echo JHtml::_('string.truncate', $sitename, 14, false, false); ?>
							<i class="fa fa-external-link" aria-hidden="true"></i>
						</a>
						<ul class="list-inline pull-right margin-bottom-0 top-right-menu sunfw-right-top-menu">
							<li class="dropdown">
								<a href="#" id="sunfw-data-menu" class="alternative-tab-trigger" data-target="#data, #data-sample-data">
									<i class="fa fa-database"></i><span><?php echo JText::_('SUNFW_DATA_TAB'); ?></span>
								</a>
								<ul class="dropdown-menu">
									<li>
										<a href="#" id="data-data-sample-data" class="alternative-tab-trigger" data-target="#data, #data-sample-data">
											<?php echo JText::_('SUNFW_SAMPLE_DATA_TAB');?>
										</a>
									</li>
									<li>
										<a href="#" id="data-data-maintencance-data" class="alternative-tab-trigger" data-target="#data, #data-maintencance-data">
											<?php echo JText::_('SUNFW_MAINTENANCE_TAB');?>
										</a>
									</li>
								</ul>
							</li>
							<li class="dropdown">
								<a href="#" id="sunfw-global-parameters-menu" class="alternative-tab-trigger" data-target="#global-parameters, #token-key">
									<i class="fa fa-gear" aria-hidden="true"></i><span><?php echo JText::_('SUNFW_GLOBAL_PARAMETERS'); ?></span>
								</a>
								<ul class="dropdown-menu">
									<li>
										<a href="#" id="data-token-key" class="alternative-tab-trigger" data-target="#global-parameters, #token-key">
											<?php echo JText::_('SUNFW_TOKEN_KEY_TAB');?>
										</a>
									</li>
								</ul>
							</li>
							<li>
								<a href="#" id="sunfw-about-sunfw-menu" class="alternative-tab-trigger" data-target="#about">
									<i class="fa fa-info" aria-hidden="true"></i><span><?php echo JText::_('SUNFW_ABOUT') ?></span>
								</a>
							</li>
							<li class="dropdown">
								<a href="#">
									<i class="fa fa-life-ring"></i><span><?php echo JText::_('SUNFW_HELP') ?></span>
								</a>
								<ul id="sunfw-learn-more" class="dropdown-menu pull-right">
									<li>
										<a id="sunfw-get-started" href="javascript:SunFwLayout.get_started.show();">
											<i class="fa fa-flag" aria-hidden="true"></i><?php echo JText::_('SUNFW_GET_STARTED'); ?>
										</a>
									</li>
									<li>
										<a id="sunfw-documentation" href="<?php echo SUNFW_DOCUMENTATION_URL; ?>" target="_blank" rel="noopener noreferrer">
											<i class="fa fa-book" aria-hidden="true"></i><?php echo JText::_('SUNFW_ABOUT_DOCUMENTATION'); ?>
										</a>
									</li>
									<li>
										<a id="sunfw-video-tutorials" href="<?php echo SUNFW_VIDEO_TUTORIALS; ?>" target="_blank" rel="noopener noreferrer">
											<i class="fa fa-video-camera" aria-hidden="true"></i><?php echo JText::_('SUNFW_ABOUT_VIDEO_TUTORIALS'); ?>
										</a>
									</li>
									<li>
										<a id="sunfw-support-forum" href="<?php echo SUNFW_SUPPORT_URL; ?>" target="_blank" rel="noopener noreferrer">
											<i class="fa fa-life-ring" aria-hidden="true"></i><?php echo JText::_('SUNFW_ABOUT_SUPPPORT'); ?>
										</a>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>

				<!-- Nav tabs -->
				<div class="jsn-nav" id="sunfw-nav-tab">
					<div class="container-fluid">
						<nav class="navbar navbar-default">
							<div class="navbar-form navbar-left" role="search">
								<div class="form-group">
									<input type="text" id="sunfw-style-title" class="form-control sunfw-style-title" value="<?php echo $this->style->title;?>" placeholder="<?php echo JText::_('SUNFW_STYLE_NAME'); ?>">
									<?php echo $this->templateForm->getInput('home'); ?>
								</div>
								<button type="button" id="sunfw-style-title-btn" class="sunfwhide btn btn-link disable-shadhow sunfw-style-title-btn"><i class="fa-spinner fa-spin font-size-14 sunfw-style-title-icon"></i></button>
							</div>
							<ul class="nav navbar-nav navbar-left" id="sunfw-admin-tab">
								<?php

								$first = true;

								foreach ( array_keys( $tabs ) as $tab ) :

								$tabName = $hideClass = '';

								// Generate tab name.
								if ( $tab == 'navigation' )
								{
									$tabName = 'SUNFW_MEGAMENU_TAB';
								}
								elseif ( $tab == 'data' )
								{
									$hideClass = 'sunfwhide';
								}
								elseif ( $tab == 'global-parameters' )
								{
									$hideClass = 'sunfwhide';
								}
								elseif ( $tab == 'advanced' )
								{
									$tabName = 'SUNFW_SYSTEM_TAB';
								}
								elseif ( $tab == 'about' )
								{
									$hideClass = 'sunfwhide';
									$tabName = 'SUNFW_ABOUT';
								}

								if ( empty($tabName) )
								{
									$tabName = 'SUNFW_' . strtoupper( str_replace( '-', '_', $tab ) ) . '_TAB';
								}

								if ( is_string( $tabs[ $tab ] ) ) :
								?>
								<li role="presentation" class="<?php if ( $first ) echo 'active'; else echo $hideClass; ?>">
									<a href="#<?php echo $tab; ?>" class="<?php if ( $first ) echo 'active'; ?>" aria-controls="<?php echo $tab; ?>" role="tab" data-toggle="tab">
										<?php echo JText::_( $tabName ); ?>
									</a>
									<span class="sunfw-loading sunfwhide" data-tab="#<?php echo $tab; ?>"></span>
								</li>
								<?php
								elseif ( is_array( $tabs[ $tab ] ) ) :
								?>
								<li role="presentation" class="dropdown">
									<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
										<?php echo JText::_( $tabName ); ?> <span class="caret"></span>
									</a>
									<ul class="dropdown-menu">
										<?php
										foreach ( array_keys( $tabs[ $tab ] ) as $sub_tab ) :

										// Generate tab name.
										$tabName = 'SUNFW_' . strtoupper( str_replace( '-', '_', $sub_tab ) ) . '_TAB';
										?>
										<li role="presentation">
											<a href="#<?php echo $sub_tab; ?>" aria-controls="<?php echo $sub_tab; ?>" role="tab" data-toggle="tab">
												<?php echo JText::_( $tabName ); ?>
											</a>

										</li>
										<?php endforeach; ?>
									</ul>
								</li>
								<?php
								endif;

								$first = false;

								endforeach;
								?>
							</ul>
							<div class="navbar-form navbar-right">
								<div class="btn-group">
									<a href="javascript: void(0);" id="sunfw-save-all" class="disabled font-size-11 btn btn-success text-uppercase">
										<span class="icon-apply icon-white"></span><?php echo JText::_('SUNFW_SAVE_ALL'); ?>
									</a>
									<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown">
										<span class="caret"></span>
									</button>

									<ul class="dropdown-menu pull-right">
										<li>
											<a href="javascript: void(0);" id="sunfw-save-as-copy"><?php echo JText::_('SUNFW_SAVE_AS_COPY'); ?></a>
										</li>
									</ul>
								</div>
								<a href="index.php?option=com_templates" class="btn btn-default text-uppercase"><span class="icon-cancel"></span><span><?php echo JText::_('SUNFW_CLOSE') ?></span></a>
							</div>
						</nav>
					</div>
				</div>

				<!-- Tab panes -->
				<div class="tab-content sunfwhide" id="sunfw-tab-content">
					<?php
					$first = true;

					foreach ( $tabs as $tab => $content ) :

					foreach ( ( array ) $content as $sub_tab => $tab_content ) :
					?>
					<div role="tabpanel" id="<?php echo is_string( $sub_tab ) ? $sub_tab : $tab; ?>" class="tab-pane<?php
						if ( $first )
							echo ' active';
					?>">
						<?php echo $tab_content; ?>
					</div>
					<?php
					$first = false;

					endforeach;

					endforeach;
					?>
				</div>
				<?php
				// Generate template introduction link
					$templateLink = "http://www.joomlashine.com/joomla-templates/jsn-{$this->templateInfo->name}.html";
				?>
				<div class="sunfw-clearbreak"></div>
				<!-- Footer -->

				<div class="sunfw-footer container-fluid">
					<div class="pull-left">
						<div class="sunfw-copyright">
							<span class="footer-template-update">
								<a target="_blank" rel="noopener noreferrer" href="<?php echo $templateLink; ?>">
									<?php echo strtoupper(str_replace('_', ' ', str_replace('pro', '', $this->templateManifestCache->name))); ?> <?php echo $this->templateInfo->edition; ?>
								</a>
								<?php echo $this->templateManifestCache->version; ?>
								<span class="update-availabel sunfwhide">(<a class="sunfw-update-link" id="sunfw-footer-update-template-link" data-target="template" href="javascript:void(0)"><?php echo JText::_('SUNFW_FRAMEWORK_UPDATE_TO'); ?> <span class="sunfw-footer-template-new-version"></span></a>)</span>
							</span>
							<span class="footer-framework-update">
								<?php echo JText::_('SUNFW_POWERED_BY'); ?>
								<a target="_blank" rel="noopener noreferrer" href="http://www.joomlashine.com/joomla-templates/jsn-sunframework.html">
									JSN Sun Framework
								</a>
								<?php echo SUNFW_VERSION; ?>
								<span class="update-availabel sunfwhide">(<a class="sunfw-update-link" id="sunfw-footer-update-template-link" data-target="framework" href="javascript:void(0)"><?php echo JText::_('SUNFW_FRAMEWORK_UPDATE_TO'); ?> <span class="sunfw-footer-framework-new-version"></span></a>)</span>
							</span>
						</div>
					</div>
					<div class="pull-right">
						<!-- ul class="sunfw-footer-other-products">
							<li class="sunfw-iconbar first">
								<a href="http://www.joomlashine.com/joomla-extensions/jsn-poweradmin.html" target="_blank" rel="noopener noreferrer" title="JSN PowerAdmin - Manage Joomla websites with ease and joy">
									<i class="sunfw-icon32 sunfw-icon-products sunfw-icon-poweradmin"></i>
								</a>
								<a href="http://www.joomlashine.com/joomla-extensions/jsn-imageshow.html" target="_blank" rel="noopener noreferrer" title="JSN ImageShow - One Joomla gallery extension for all image presentation needs">
									<i class="sunfw-icon32 sunfw-icon-products sunfw-icon-imageshow"></i>
								</a>
								<a href="http://www.joomlashine.com/joomla-extensions/jsn-uniform.html" target="_blank" rel="noopener noreferrer" title="JSN UniForm - The most easy, yet sophisticated Joomla form builder extension">
									<i class="sunfw-icon32 sunfw-icon-products sunfw-icon-uniform"></i>
								</a>
								<a href="http://www.joomlashine.com/joomla-extensions/jsn-mobilize.html" target="_blank" rel="noopener noreferrer" title="JSN Mobilize - Painless mobile site creator">
									<i class="sunfw-icon32 sunfw-icon-products sunfw-icon-mobilize"></i>
								</a>
								<a href="http://www.joomlashine.com/joomla-extensions/jsn-pagebuilder.html" target="_blank" rel="noopener noreferrer" title="JSN PageBuilder - Easiest way to build Joomla pages">
									<i class="sunfw-icon32 sunfw-icon-products sunfw-icon-pagebuilder"></i>
								</a>
								<a href="http://www.joomlashine.com/joomla-extensions/jsn-easyslider.html" target="_blank" rel="noopener noreferrer" title="JSN EasySlider - Multipurpose content slider with super user-friendly interface">
									<i class="sunfw-icon32 sunfw-icon-products sunfw-icon-easyslider"></i>
								</a>
							</li>
						</ul -->
						<span class="footer-other-products"><?php
							printf(
								JText::_('SUNFW_OTHER_PRODUCTS_PAGE_BUILDER'),
								'<a href="http://www.joomlashine.com/joomla-extensions/jsn-pagebuilder.html" target="_blank" rel="noopener noreferrer">JSN PageBuilder</a>'
							);
						?></span>
					</div>
					<div class="sunfwhide">
						<div class="sunfw-version sunfw-framework-version sunfw-version-checking" data-target="framework">
							<strong class="sunfw-current-version"><?php echo JText::_('SUNFW_FRAMEWORK_VERSION'); ?>:</strong> <span class="sunfw-framework-current-version"><?php echo SUNFW_VERSION; ?></span> -
							<span class="sunfw-status"><?php echo JText::_('SUNFW_TEMPLATE_DETAILS_CHECK_UPDATE'); ?></span>
							<a class="sunfw-update-link btn btn-danger btn-xs" data-target="framework" href="javascript:void(0)">
								<?php echo JText::_('SUNFW_TEMPLATE_DETAILS_UPDATE_TO'); ?>
								<span class="sunfw-new-version"></span>
							</a>
							<a class="sunfwhide sunfw-what-new-in" href="http://www.joomlashine.com/joomla-products/changelog.html" target="_blank" rel="noopener noreferrer">
								<?php echo JText::_('SUNFW_TEMPLATE_DETAILS_WHAT_NEW_IN'); ?>
								<span class="sunfw-new-version"></span> &raquo;
							</a>
						</div>
						<div class="sunfw-version sunfw-template-version sunfw-version-checking" data-target="template">
							<strong class="sunfw-current-version"><?php echo JText::_('SUNFW_TEMPLATE_VERSION'); ?>:</strong> <span class="sunfw-template-current-version"><?php echo $this->templateVersion; ?></span> -
							<span class="sunfw-status"><?php echo JText::_('SUNFW_TEMPLATE_DETAILS_CHECK_UPDATE'); ?></span>
							<a class="sunfw-update-link btn btn-danger btn-xs" data-target="template" href="javascript:void(0)">
								<?php echo JText::_('SUNFW_TEMPLATE_DETAILS_UPDATE_TO'); ?>
								<span class="sunfw-new-version"></span>
							</a>
							<a class="sunfwhide sunfw-what-new-in" href="http://www.joomlashine.com/joomla-products/changelog.html" target="_blank" rel="noopener noreferrer">
								<?php echo JText::_('SUNFW_TEMPLATE_DETAILS_WHAT_NEW_IN'); ?>
								<span class="sunfw-new-version"></span> &raquo;
							</a>
						</div>
					</div>
				</div>
				<input type="hidden" name="task" value="" />
				<input type="hidden" id="jsn-tpl-token" value="<?php echo JSession::getFormToken();?>" />
				<input type="hidden" id="jsn-tpl-root" value="<?php echo Juri::root();?>" />
				<input type="hidden" id="jsn-tpl-name" value="<?php echo $this->template; ?>" />
				<input type="hidden" id="jsn-style-id" value="<?php echo $this->app->input->getInt( 'id' ); ?>" />
				<?php echo JHtml::_('form.token'); ?>
			</div>
		</form>

		<!-- Hidden form for saving/restoring template parameters -->
		<form id="sunfw-advanced-export-params-form" method="post" enctype="multipart/form-data" target="sunfw-iframe-silent" class="hide">
			<input type="file" name="sunfw-advanced-backup-upload" />
		</form>
		<iframe id="sunfw-iframe-silent" name="sunfw-iframe-silent" class="hide" src="about:blank"></iframe>
		<div class="sunfw-modal-overlay">
			<div class="sunfw-modal-indicator"><i class="fa fa-circle-o-notch fa-3x fa-spin"></i></div>
		</div>

		<?php
		$body = ob_get_contents();
		ob_end_clean();

		// Parse current response body
		list( $header, $tmp ) = explode( '<!-- Header -->', $this->app->getBody(), 2 );
		list( $tmp, $footer ) = explode( '</body>', $tmp, 2 );

		if (version_compare($jShortVersion, '3.6.0', '>='))
		{
			// Remove all Joomla's inline script from document head.
			$tmp = explode( '<script type="text/javascript">', $header );
			$header = $tmp[0];

			for ( $i = 1, $n = count( $tmp ); $i < $n; $i++ ) {
				$header .= current( array_reverse( explode( '</script>', $tmp[ $i ], 2 ) ) );
			}
		}
		// Update response body.
		$this->app->setBody( "{$header}\n{$body}\n</body>{$footer}" );
	}

	/**
	 * Render HTML for a config tab using definition from XML file.
	 *
	 * @param   string  $name         Form name.
	 * @param   string  $config_file  XML file that defines a form.
	 *
	 * @return  string
	 */
	protected function renderTab( $name, $config_file )
	{
		// Instantiate a JForm object.
		$form = new JForm( $name );

		// Add path to our custom fields.
		$form->addFieldPath( dirname( __FILE__ ) . '/admin/fields' );

		// Then, load config from the XML file.
		$form->loadFile( $config_file );

		// Get all fieldsets.
		$fieldsets = $form->getFieldsets();

		// Then, loop thru fieldsets to render HTML.
		$html = array();

		foreach ( array_keys( $fieldsets ) as $fieldset )
		{
			$html[] = $form->renderFieldset( $fieldset );
		}

		return implode( "\n", $html );
	}
}
