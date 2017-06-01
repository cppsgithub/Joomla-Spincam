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
 * Template rendering class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwSite
{
    /**
     * A singleton instance of the class.
     *
     * @var  SunFwSite
     */
    private static $instance;

    /**
     * Joomla's application instance.
     *
     * @var  JApplicationSite
     */
    protected $app;

    /**
     * Joomla's document object.
     *
     * @var  JDocumentHTML
     */
    protected $doc;

    /**
     * Page type, either 'index', 'component' or 'error'.
     *
     * @var  string
     */
    protected $page;

    /**
     * Active template.
     *
     * @var  object
     */
    protected $template;

    /**
     * Current style.
     *
     * @var  object
     */
    protected $style;

    /**
     * Layout builder data.
     *
     * @var  array
     */
    protected $layout = array();

    /**
     * Mega menu data.
     *
     * @var  array
     */
    protected $megamenu = array();

    /**
     * Flag that states whether layout viewer is enabled.
     *
     * @var  boolean
     */
    protected $layoutViewer = false;

    /**
     * Constructor method.
     *
     * @return  void
     */
    public function __construct()
    {
        // Get Joomla's application instance.
        $this->app = JFactory::getApplication();

        // Get Joomla's document object.
        $this->doc = JFactory::getDocument();

        //Check System Requiremnts
        $resultCheckSystemRequirements = SunFwUltils::checkSystemRequirements();

        if (count($resultCheckSystemRequirements)) {
            $msgSystemRequirement = implode('<br />', $resultCheckSystemRequirements);
            die($msgSystemRequirement);
        }

        // Get active template.
        $this->template = $this->app->getTemplate(true);

        if (!isset($this->template->id)) {
            $tmpTemplate = SunFwHelper::getTemplateStyleByName($this->template->template);
            $this->template->id = $tmpTemplate->id;
        }

        // Get current style.
        $this->style = SunFwHelper::getSunFwStyle($this->template->id);

        // Get layout builder data.
	    $this->layout = SunFwHelper::getLayoutData($this->style, $this->template->template);

	    if ( ! count( $this->layout ) )
	    {
		    die( JText::_( 'SUNFW_MISSING_LAYOUT_DATA' ) );
	    }

        // Get mega menu data.
        if ($this->style && !empty($this->style->mega_menu_data)) {
            $this->megamenu = json_decode($this->style->mega_menu_data, true);
        }
    }

    /**
     * Render an offcanvas.
     *
     * @param   array $offcanvas The offcanvas data.
     * @param   string $position If rendering an offcanvas, can be either 'top', 'right', 'bottom' or 'left'.
     *
     * @return  void
     */
    public static function renderOffcanvas($offcanvas, $position)
    {
        self::renderComponent('offcanvas', $offcanvas, $position);
    }

    /**
     * Render template component.
     *
     * @param   string $type Type of component to render, either 'offcanvas', 'section', 'row', 'column' or 'item'.
     * @param   array $component The component data array.
     * @param   string $position If rendering an offcanvas, can be either 'top', 'right', 'bottom' or 'left'.
     *
     * @return  void
     */
    protected static function renderComponent($type, $component, $position = null)
    {
        // Only render if component is not disabled.
        if (isset($component['settings']['disabled']) && $component['settings']['disabled']) {
            return;
        }

        // Generate path to the template file that renders HTML for the component type.
        if ($type != 'item') {
            $template = SUNFW_PATH . '/includes/site/components/' . $type . '.php';
        } else {
            // Make sure item has type.
            if (!isset($component['type'])) {
                return;
            }

            $template = SUNFW_PATH . '/includes/site/components/items/' . $component['type'] . '.php';
        }

        // Get layout builder data.
        $layout = self::getInstance()->layout;

        // Load component template.
        if (@is_file($template)) {
            include $template;
        }
    }

    /**
     * Instantiate a singleton of the class then return.
     *
     * @return  SunFwSite
     */
    public static function &getInstance()
    {
        // Instantiate a singleton of the class if not already exists.
        if (!isset(self::$instance)) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    /**
     * Render a section.
     *
     * @param   array $section The section data.
     *
     * @return  void
     */
    public static function renderSection($section)
    {
        self::renderComponent('section', $section);
    }

    /**
     * Render a row.
     *
     * @param   array $row The row data.
     *
     * @return  void
     */
    public static function renderRow($row)
    {
        self::renderComponent('row', $row);
    }

    /**
     * Render a column.
     *
     * @param   array $column The column data.
     *
     * @return  void
     */
    public static function renderColumn($column)
    {
        self::renderComponent('column', $column);
    }

    /**
     * Render an item.
     *
     * @param   array $item The item data.
     *
     * @return  void
     */
    public static function renderItem($item)
    {
    	// Grab rendered content.
    	ob_start();

    	self::renderComponent('item', $item);

    	$html = ob_get_contents();

    	ob_end_clean();

		// Check if layout viewer is enabled?
		if ( ! empty($html) && self::getInstance()->layoutViewer) {
			$layoutViewer = ' ' . implode( ' ', array(
				'layout-element="item"',
				'layout-element-type="' . JText::_('SUNFW_ITEM') . '"',
				'layout-element-name="' . $item['settings']['name'] . '"'
			) );

			$html = '<div' . $layoutViewer . '>' . $html . '</div>';
		}

		echo $html;
    }

    /**
     * Render HTML for the template.
     *
     * @param   string $page Page type to render, either 'index', 'component' or 'error'.
     *
     * @return  void
     */
    public function render($page = 'index')
    {
        // Set page template.
        $this->page = $page;

        // Load template assets.
        $this->loadAssets();

        // Prepare template parameters.
        SunFwSiteHelper::prepare();

        // Check if responsive is enabled?
        $this->responsive = !empty($this->layout['settings']['enable_responsive'])
            ? intval($this->layout['settings']['enable_responsive'])
            : false;

        if (!is_null($this->isMobileSwicher)) {
            $this->responsive = $this->isMobileSwicher;
        }

        // Render template layout.
        $this->renderLayout();
    }

    /**
     * Load template assets.
     *
     * @return  void
     */
    public function loadAssets()
    {
        // Get template folder.
        $template = $this->template->template;

        // Get Style ID.
        $styleID = isset($this->style->style_id) ? md5($this->style->style_id) : '';

        // Get active niche style.
        $niche = SunFwHelper::getActiveNicheStyle();

        // Output as HTML5.
        $this->doc->setHtml5(true);

        // Avoid loading jQuery.
        JHtml::unregister('jquery');

        // Load Bootstrap.
        $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/css/bootstrap.css");

        // Load Bootstrap.
        $this->doc->addStyleSheet($this->baseurl . "/plugins/system/sunfw/assets/3rd-party/bootstrap/flexbt4_custom.css");

        // Load Font Awesome.
        $this->doc->addStyleSheet($this->baseurl . "/plugins/system/sunfw/assets/3rd-party/font-awesome/css/font-awesome.min.css");

        // Load template script bootstrap if available.
        if (file_exists(JPATH_ROOT . "/templates/{$template}/assets/bootstrap-sass/assets/javascripts/bootstrap.min.js")) {
            $this->doc->addScript($this->baseurl . "/templates/{$template}/assets/bootstrap-sass/assets/javascripts/bootstrap.min.js");
        }

        // Load Javascript files.
        $this->doc->addScript($this->baseurl . '/plugins/system/sunfw/assets/joomlashine/site/js/utils.js');

        // Load template script if available.
        if (file_exists(JPATH_ROOT . "/templates/{$template}/js/template.js")) {
            $this->doc->addScript($this->baseurl . "/templates/{$template}/js/template.js");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/niches/{$niche}/js/template.js")) {
            $this->doc->addScript($this->baseurl . "/templates/{$template}/niches/{$niche}/js/template.js");
        }

        // Load template stylesheet if available.
        if (file_exists(JPATH_ROOT . "/templates/{$template}/css/template.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/css/template.css");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/css/color_{$styleID}.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/css/color_{$styleID}.css");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/niches/{$niche}/css/template.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/niches/{$niche}/css/template.css");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/niches/{$niche}/css/color_{$styleID}.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/niches/{$niche}/css/color_{$styleID}.css");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/css/core/layout_{$styleID}.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/css/core/layout_{$styleID}.css");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/css/core/general_{$styleID}.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/css/core/general_{$styleID}.css");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/css/core/general_overwrite_{$styleID}.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/css/core/general_overwrite_{$styleID}.css");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/css/core/sections_{$styleID}.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/css/core/sections_{$styleID}.css");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/css/core/modules_{$styleID}.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/css/core/modules_{$styleID}.css");
        }

        if (file_exists(JPATH_ROOT . "/templates/{$template}/css/core/menu_{$styleID}.css")) {
            $this->doc->addStyleSheet($this->baseurl . "/templates/{$template}/css/core/menu_{$styleID}.css");
        }

        // Init layout viewer if URL contains 'suntp=1' in query string.
        if ( $this->app->input->getBool('suntp') )
        {
        	// Set a flag to state that layout viewer is enabled.
        	$this->layoutViewer = true;

        	// Load layout viewer assets.
        	$this->doc->addStyleSheet($this->baseurl . '/plugins/system/sunfw/assets/joomlashine/site/css/layout-viewer.css');
        	$this->doc->addScript($this->baseurl . '/plugins/system/sunfw/assets/joomlashine/site/js/layout-viewer.js');

        	$this->doc->addScriptDeclaration('
        		sunfw = window.sunfw || {};
        		sunfw.layout_viewer = ' . json_encode( array(
	        		'show-layout' => JText::_('SUNFW_LAYOUT_VIEWER_LABEL_SHOW'),
	        		'hide-layout' => JText::_('SUNFW_LAYOUT_VIEWER_LABEL_HIDE'),
        		) ) . ';
        	');
        }
    }

    /**
     * Render template layout.
     *
     * @return  void
     */
    public function renderLayout()
    {
        // Generate path to the requested page template.
        $template = SUNFW_PATH . '/includes/site/pages/' . $this->page . '.php';

        // Load page template.
        if (@is_file($template)) {
            include $template;
        }
    }

    /**
     * Method to provide access to JDocument instance's variables the way standard Joomla template does.
     *
     * @param   string $name Variable name to get value for.$this
     *
     * @return  mixed
     */
    public function __get($name)
    {
        if (isset($this->{$name})) {
            return $this->{$name};
        } elseif (isset($this->doc->{$name})) {
            return $this->doc->{$name};
        } elseif (isset($this->app->{$name})) {
            return $this->app->{$name};
        }

        return null;
    }
}
