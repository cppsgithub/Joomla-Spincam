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

// Define neccessary constants.
require_once dirname(__FILE__) . '/sunfw.defines.php';

/**
 * Plugin class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class PlgSystemSunFw extends JPlugin
{
    /**
     * Joomla application instance.
     *
     * @var  JApplication
     */
    protected $app;
    /**
     * Joomla input instance.
     *
     * @var  JInput
     */
    protected $input;
    /**
     * Define prefix for all classes of our framework.
     *
     * @var  string
     */
    private $prefix = 'SunFw';

    /**
     * Initialize the plugin at onAfterInitialise event.
     *
     * @return  void
     */
    public function onAfterInitialise()
    {
        // Register class auto-loader.
        spl_autoload_register(array(&$this, 'autoload'));

        // Get Joomla's application instance.
        $this->app = JFactory::getApplication();

        // Get Joomla's input object.
        $this->input = $this->app->input;

        $this->option = $this->input->getCmd('option');
        $this->view = $this->input->getCmd('view');
        $this->task = $this->input->getCmd('task');

        // Load plugin language file.
        $this->loadLanguage();

        if ($this->app->isAdmin()) {
            // If any widget is request, execute it then exit immediately.
            if ($this->option != 'com_mijoanalytics' && SunFwWidget::dispatch() === true) {
                exit;
            }

            if ($this->option == 'com_installer') {
                $db = JFactory::getDbo();

                //Set SunFw to unprotected if there is no Sun Framework Template based for user can uninstall it || else protected
                if (count($this->getAllSunfwTemplateId()) == 0) {
                    try {
                        $sql = $db->getQuery(true);
                        $sql->update('#__extensions')
                            ->set(array('protected = 0'))
                            ->where("element = 'sunfw'")
                            ->where("type = 'plugin'")
                            ->where("folder = 'system'");
                        $db->setQuery($sql)->execute();
                    } catch (Exception $e) {
                        throw $e;
                    }
                }

                // Redirect to update page if necessary
                if ($this->view == 'update' AND $this->task == 'update.update' AND count($cid = (array)$this->app->input->getVar('cid', array()))) {
                    // Check if extension to updated is JoomlaShine product
                    $q = $db->getQuery(true);

                    $q->select('e.extension_id, e.type, e.element, e.folder');
                    $q->from('#__extensions AS e');
                    $q->join('INNER', '#__updates AS u ON e.extension_id = u.extension_id');
                    $q->where('u.update_id IN (' . implode(', ', $cid) . ')');

                    $db->setQuery($q);

                    if ($exts = $db->loadObjectList()) {
                        foreach ($exts AS $ext) {
                            if (($ext->type == 'template' AND !SunFwRecognization::detect($ext->element)) OR $ext->element != basename(SUNFW_PATH)) {
                                continue;
                            }

                            // Get style id
                            $q = $db->getQuery(true);

                            $q->select('s.id');
                            $q->from('#__template_styles AS s');
                            $q->join('INNER', '#__extensions AS e ON s.template = e.element');

                            if ($ext->type == 'template') {
                                $q->where('e.extension_id = ' . $ext->extension_id);
                            } else {
                                $q->where('e.custom_data = "sunfw"', 'OR');
                                $q->where('e.manifest_cache LIKE \'%,"group":"sunfw"}\'');
                            }

                            $q->order('s.client_id, s.home DESC, s.id DESC');

                            $db->setQuery($q);

                            if ($styleId = $db->loadResult()) {
                                return $this->app->redirect('index.php?option=com_templates&task=style.edit&id=' . $styleId);
                            }
                        }
                    }
                }
            }
        }

        // Load library complied SCSS to CSS
        include_once dirname(__FILE__) . '/libraries/3rd-party/scssphp/scss.inc.php';
    }

    private function getAllSunfwTemplateId()
    {
        // Check if extension to updated is JoomlaShine product
        $db = JFactory::getDbo();
        $q = $db->getQuery(true);

        $q->select('e.extension_id, e.type, e.element, e.folder');
        $q->from('#__extensions AS e');

        $db->setQuery($q);

        $result = [];

        if ($exts = $db->loadObjectList()) {
            foreach ($exts AS $ext) {
                if (($ext->type != 'template' OR !SunFwRecognization::detect($ext->element))) {
                    continue;
                }

                // Get style id
                $q = $db->getQuery(true);

                $q->select('*');
                $q->from('#__template_styles AS s');
                $q->join('INNER', '#__extensions AS e ON s.template = e.element');

                $q->where('e.extension_id = ' . $ext->extension_id);

                $db->setQuery($q);

                $result [] = $db->loadResult();
            }
        }

        return $result;
    }

    /**
     * Handle onContentPrepareForm event to detect template that depends on our framework.
     *
     * @param   object $context Form context.
     * @param   object $data Form data.
     * @return  void
     */
    public function onContentPrepareForm($context, $data)
    {
        if ($context->getName() == 'com_templates.style' AND !empty($data)) {
            // Read manifest to check if template depends on our framework.
            $templateName = is_object($data) ? $data->template : $data['template'];

            if (SunFwRecognization::detect($templateName)) {
                $manifest = SunFwHelper::getManifest($templateName);
                // Initialize template administration if it depends on our framework.
                if (isset($manifest->group) && 'sunfw' == (string) $manifest->group) {
                    SunFwAdmin::getInstance();
                }
            }
        }

        if ($context->getName() == 'com_menus.item') {
            JForm::addFormPath(JPATH_PLUGINS . '/system/sunfw/params');
            $context->loadFile('menu', false);
        }
    }

    /**
     * Handle onBeforeCompileHead event to detect template that depends on our framework.
     *
     * @return  void
     */
    public function onBeforeCompileHead()
    {
        $app = JFactory::getApplication();
        $compressJS = false;
        $compressCSS = false;

        if ($app->isSite() && SunFwRecognization::detect()) {
            $document = JFactory::getDocument();

            // Remove default bootstrap
            unset($document->_scripts[JUri::root(true) . '/media/jui/js/bootstrap.min.js']);

            if (isset($document->helper) && $document->helper instanceOf SunFwSiteHelper) {
                $systemData = isset($document->system_data) ? $document->system_data : '';

                if (count($systemData) && isset($systemData['compression']) && count($systemData['compression'])) {
                    $config = JFactory::getConfig();

                    // Verify cache directory
                    if (!preg_match('#^(/|\\|[a-z]:)#i', $systemData['cacheDirectory'])) {
                        $cachePath = JPATH_ROOT . '/' . rtrim($systemData['cacheDirectory'], '\\/');
                    } else {
                        $cachePath = rtrim($systemData['cacheDirectory'], '\\/');
                    }

                    if ($config->get('ftp_enable') OR is_writable($cachePath)) {
                        if (is_array($systemData['compression'])) {
                            foreach ($systemData['compression'] as $value) {
                                if ($value == 'css') {
                                    $compressCSS = true;
                                }

                                if ($value == 'js') {
                                    $compressJS = true;
                                }
                            }
                        }

                        // Start compress CSS
                        if ($compressCSS) {
                            $styleSheets = array();

                            $compressedStyleSheets = SunFwSiteCompressCss::compress($document->_styleSheets);

                            foreach ($compressedStyleSheets as $compressedStyleSheet) {
                                $stylesheets[$compressedStyleSheet['file']] = array(
                                    'mime' => 'text/css',
                                    'media' => ($compressedStyleSheet['media'] == '' ? NULL : $compressedStyleSheet['media']),
                                    'attribs' => array()
                                );
                            }

                            $document->_styleSheets = $stylesheets;
                        }

                        // Start compress JS
                        if ($compressJS) {
                            $scripts = array();
                            $compressedScripts = SunFwSiteCompressJs::compress($document->_scripts);

                            foreach ($compressedScripts as $compressedScript) {
                                $scripts[$compressedScript] = array(
                                    'mime' => 'text/javascript',
                                    'defer' => false,
                                    'async' => false
                                );
                            }

                            $document->_scripts = $scripts;
                        }
                    }
                }
            }
        }
    }

    /**
     * Implement onAfterRender event to register all needed asset files
     *
     * @return  void
     */
    public function onAfterRender()
    {
        $app = JFactory::getApplication();

        if ($app->isAdmin()) {
            $user = JFactory::getUser();
            if ($user->authorise('core.admin')) {
                $plugin = $app->input->getString('plugin', '');
                $sunfwtab = $app->input->getString('sunfwtab', '');
                $option = $app->input->getString('option', '');
                $asset = $app->input->getString('asset', '');
                $view = $app->input->getString('view', '');
                $author = $app->input->getString('author', '');

                if ($view == 'images' && $asset == 'com_templates' && $plugin == 'sunfw' && $sunfwtab == 'appearance' && $option == 'com_media' ||
                    $option == 'com_media' && $view == 'images' && $author == 'created_by_sunfw'
                ) {
                    $buffer = $app->getBody();
                    $buffer = str_replace("window.parent.jInsertFieldValue", "window.parent.appearanceInsertFieldValue", $buffer);
                    $buffer = str_replace("window.parent.jModalClose", "window.parent.appearanceModalClose", $buffer);

                    $app->setBody($buffer);
                }
            }
        }

        if ($app->isSite() && SunFwRecognization::detect())
        {
            $this->replaceFavicon();
        }
    }

    /**
     * Handle Ajax requests.
     *
     * @return  void
     */
    public function onAjaxSunFw()
    {
        if ($this->app->isAdmin()) {
            header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
            header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
            header("Cache-Control: no-store, no-cache, must-revalidate");
            header("Cache-Control: post-check=0, pre-check=0", false);
            header("Pragma: no-cache");

            SunFwAjax::execute();
        }

        // Exit immediately to prevent Joomla from processing further.
        exit;
    }

    /**
     * Event handler to re-parse request URI.
     *
     * @return  void
     */
    public function onAfterRoute()
    {
        if ($this->app->isSite() AND SunFwRecognization::detect()) {
            // Initialize template override loaders.
            SunFwOverwrite::initialize();
        }
    }

    /**
     * Class auto-loader.
     *
     * @param   string $class_name Name of class to load declaration file for.
     *
     * @return  mixed
     */
    public function autoload($class_name)
    {
        // Verify class prefix.
        if (0 !== strpos($class_name, $this->prefix)) {
            return false;
        }

        // Generate file path from class name.
        $base = dirname(__FILE__) . '/includes';
        $path = strtolower(
            preg_replace('/([A-Z])/', '/\\1', substr($class_name, strlen($this->prefix)))
        );

        // Find class declaration file.
        $p1 = $path . '.php';

        $p2 = $path . '/' . basename($path) . '.php';

        while (true) {
            // Check if file exists in standard path.
            if (@is_file($base . $p1)) {
                $exists = $p1;

                break;
            }

            // Check if file exists in alternative path.
            if (@is_file($base . $p2)) {
                $exists = $p2;

                break;
            }

            // If there is no more alternative path, quit the loop.
            if (false === strrpos($p1, '/') || 0 === strrpos($p1, '/')) {
                break;
            }

            // Generate more alternative path.
            $p1 = preg_replace('#/([^/]+)$#', '-\\1', $p1);
            $p2 = dirname($p1) . '/' . substr(basename($p1), 0, -4) . '/' . basename($p1);
        }

        // If class declaration file is found, include it.
        if (isset($exists)) {
            return include_once $base . $exists;
        }

        return false;
    }

    /**
     * Implement onBeforeRender event to register all needed asset files
     *
     * @return  void
     */
    public function onBeforeRender()
    {
        $document = JFactory::getDocument();
        if ($this->app->isSite() && SunFwRecognization::detect()) {
            if (isset($document->helper) && $document->helper instanceOf SunFwSiteHelper) {
                //Load cookie law
                SunFwCookielaw::loadCookie();
            }
        }
    }

    /**
     * Implement onExtensionAfterSave event to register all needed actions
     *
     * @return  void
     */
    public function onExtensionAfterSave($context, $table, $isNew)
    {
        $task = $this->app->input->getString('task', '');

        // if context is not com_templates.style return immediately
        if ($context !== 'com_templates.style' || $table->client_id || !$isNew || $task != 'duplicate') {
            return;
        }

        $session = JFactory::getSession();
        $dbo = JFactory::getDBO();

        // if session SUNFW_CLONE_STYLE_ID is not existed then created and assign value to it
        if ($session->has('SUNFW_CLONE_STYLE_ID') == false) {
            $sessionData = $session->get('SUNFW_CLONE_STYLE_ID', array());
            if (!count($sessionData)) {
                $pks = $this->app->input->post->get('cid', array(), 'array');
                $session->set('SUNFW_CLONE_STYLE_ID', $pks);
                $sessionData = $session->get('SUNFW_CLONE_STYLE_ID', array());
            }
        } else {
            // if get session SUNFW_CLONE_STYLE_ID value if it is existed
            $sessionData = $session->get('SUNFW_CLONE_STYLE_ID', array());
        }

        // check if clone style is a of style of sunfw
        if (!SunFwRecognization::detect($table->template)) {
            unset($sessionData[0]);
            $sessionData = array_values($sessionData);
            $session->set('SUNFW_CLONE_STYLE_ID', $sessionData);
            $sessionData = $session->get('SUNFW_CLONE_STYLE_ID', array());

            if (!count($sessionData)) {
                $session->clear('SUNFW_CLONE_STYLE_ID');
            }
            return;
        }

        $currentSunFwStyle = SunFwHelper::getSunFwStyle($sessionData[0]);

        if (count($currentSunFwStyle)) {
            $query = $dbo->getQuery(true);
            $columns = array('style_id', 'layout_builder_data', 'appearance_data', 'system_data', 'mega_menu_data', 'cookie_law_data', 'template');
            $values = array(intval($table->id), $dbo->quote($currentSunFwStyle->layout_builder_data),
                $dbo->quote($currentSunFwStyle->appearance_data), $dbo->quote($currentSunFwStyle->system_data),
                $dbo->quote($currentSunFwStyle->mega_menu_data), $dbo->quote($currentSunFwStyle->cookie_law_data), $dbo->quote($table->template));

            $query
                ->insert($dbo->quoteName('#__sunfw_styles'))
                ->columns($dbo->quoteName($columns))
                ->values(implode(',', $values));
            $dbo->setQuery($query);
            $dbo->execute();

            $sufwrender = new SunFwScssrender();
            $sufwrender->compile($table->id, $table->template);
            $sufwrender->compile($table->id, $table->template, "layout");
        }

        unset($sessionData[0]);
        $sessionData = array_values($sessionData);
        $session->set('SUNFW_CLONE_STYLE_ID', $sessionData);
        $sessionData = $session->get('SUNFW_CLONE_STYLE_ID', array());

        if (!count($sessionData)) {
            $session->clear('SUNFW_CLONE_STYLE_ID');
        }
        return;
    }

    /**
     * Implement onExtensionAfterSave event to register all needed actions
     *
     * @return  void
     */
    public function onExtensionAfterDelete($context, $table)
    {
        $task = $this->app->input->getString('task', '');

        // if context is not com_templates.style return immediately
        if ($context !== 'com_templates.style' || $table->client_id || $task != 'delete') {
            return;
        }

        // check if clone style is a of style of sunfw
        if (!SunFwRecognization::detect($table->template)) {
            return;
        }

        SunFwHelper::deleteOrphanStyle(array($table->id));
        return;
    }

    /**
     * Method to replace favicon.
     *
     * @return  void
     */
    public function replaceFavicon()
    {
        $document = JFactory::getDocument();

        // Only site pages that are html docs
        if ($document->getType() !== 'html') return false;

        $app 	= JFactory::getApplication();
        $buffer = $app->getBody();

        // Prepare template parameters
        $templateParams = isset($document->params) ? $document->params : null;
        $templateName 	= (string) $templateParams->get('template');

        if (empty($templateParams))
        {
            $template		= $app->getTemplate(true);
            $templateName 	= (string) $template->template;
        }

        preg_match_all('/<link href=.* rel="shortcut icon" type=.*\/>/', $buffer, $matches, PREG_SET_ORDER);

        if (count($matches))
        {
            if (count($matches) == 2)
            {
                $buffer = preg_replace('/<link href="[^"]*\/' . $templateName . '\/favicon.ico" rel="shortcut icon" type=.*\/>/', '', $buffer);
                $app->setBody($buffer);
            }
        }
    }
}
