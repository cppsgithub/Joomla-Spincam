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
		$JVersion        = new JVersion;
		$mediaVersion    = $JVersion->getMediaVersion();
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

		// Load Font Awesome.
		$this->doc->addStyleSheet( "{$base}/3rd-party/font-awesome/css/font-awesome.min.css");

		// Load Font Fontello.
		$this->doc->addStyleSheet( "{$base}/3rd-party/fontello/css/fontello.css");

		// Load stylesheets for Template Admin.
		$this->doc->addStyleSheet( "{$base}/joomlashine/admin/css/general.css" );
		$this->doc->addStyleSheet( "{$base}/joomlashine/admin/css/admin.css" );

		// Load Noty.
		$this->doc->addStyleSheet( "{$base}/3rd-party/noty/animate.css");

		$this->doc->addScript( "{$base}/3rd-party/noty/jquery.noty.js" );

		// Load Bootbox.
		$this->doc->addScript( "{$base}/3rd-party/bootbox/bootbox.min.js" );

		// Load Interact.
		$this->doc->addScript( "{$base}/3rd-party/interact/interact.min.js" );

		// Load React.
		$this->doc->addScript( "{$base}/3rd-party/react/react.min.js" );
		$this->doc->addScript( "{$base}/3rd-party/react/react-dom.min.js" );
	}

	/**
	 * Render HTML for template administration screen.
	 *
	 * @return  void
	 */
	public function renderHtml()
	{
		// Get token and template data.
		$token  = JSession::getFormToken();
		$config = JFactory::getConfig();

		$sessionLifeTime = intval($config->get('lifetime') * 60 / 3 * 1000);

		$jVersion = new JVersion;
		$jShortVersion = $jVersion->getShortVersion();

		$styleID    = $this->app->input->getInt( 'id' , 0 );
		$sunFwStyle = SunFwHelper::getSunFwStyle( $styleID );

		// Generate HTML output.
		ob_start();
		?>
		<form id="style-form" method="post" name="adminForm" onSubmit="return false;" action="<?php
			echo JRoute::_( 'index.php?option=com_templates&layout=edit&id=' . $this->app->input->getInt( 'id' ) );
		?>">
			<div id="template-admin" class="sunfw-template-admin"></div>
			<div id="template-admin-form" class="hidden">
				<div class="form-group">
					<input type="text" name="style_title" value="<?php
						echo $this->style->title;
					?>" placeholder="<?php
						echo JText::_('SUNFW_STYLE_NAME');
					?>">
					<?php
					$home = $this->templateForm->getInput('home');
					$home = str_replace('id="jform_home" name=""', 'name="home"', $home);
					$home = preg_replace('#<input type="hidden"[^>]+/>#', '', $home);

					echo $home;
					?>
				</div>
			</div>
			<input type="hidden" name="task" value="" />
			<input type="hidden" id="jsn-tpl-root" value="<?php echo Juri::root();?>" />
			<input type="hidden" id="jsn-tpl-name" value="<?php echo $this->template; ?>" />
			<input type="hidden" id="jsn-tpl-token" value="<?php echo JSession::getFormToken();?>" />
			<input type="hidden" id="jsn-style-id" value="<?php echo $this->app->input->getInt( 'id' ); ?>" />
			<?php echo JHtml::_('form.token'); ?>
		</form>
		<form id="sunfw-maintenance-form" method="post" enctype="multipart/form-data" target="sunfw-hidden-iframe" class="hidden">
			<input type="file" name="sunfw-advanced-backup-upload" />
		</form>
		<iframe id="sunfw-hidden-iframe" name="sunfw-hidden-iframe" class="hidden" src="about:blank"></iframe>
		<div id="sunfw-loading" class="sunfw-loading-mask">
			<div class="sunfw-loading-indicator">
				<i class="fa fa-circle-o-notch fa-3x fa-spin"></i>
			</div>
		</div>
		<?php
		// Include Javascript initialization file.
		include_once SUNFW_PATH_INCLUDES . '/admin/js-init.php';

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
