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
 * Base class for handling Ajax requests.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
abstract class SunFwWidgetBase
{
	/**
	 * Application instance.
	 *
	 * @var JApplication
	 */
	protected $app;

	/**
	 * Input object.
	 *
	 * @var JInput
	 */
	protected $input;

	/**
	 * Database object.
	 *
	 * @var JDatabase
	 */
	protected $dbo;

	/**
	 * Template detailed information
	 * @var array
	 */
	protected $template = array();
	/**
	 * Session handler.
	 *
	 * @var JSession
	 */
	protected $session;

	/**
	 * Language management library.
	 *
	 * @var JLanguage
	 */
	protected $language;

	/**
	 * Response content.
	 *
	 * @var mixed
	 */
	protected $responseContent;

	/**
	 * Constructor.
	 *
	 * @return  void
	 */
	public function __construct()
	{
		$this->app      = JFactory::getApplication();
		$this->dbo      = JFactory::getDBO();
		$this->input    = $this->app->input;
		$this->session  = JFactory::getSession();
		$this->language = JFactory::getLanguage();
		$this->template = $this->input->getCmd('template_name', '');

		if ( ! empty($this->template) )
		{
			$this->_parseTemplateInfo($this->template);
		}

		// Load template language file.
		$this->language->load( 'tpl_' . $this->input->getCmd( 'template_name' ), JPATH_ROOT );
		$this->language->load( 'lib_joomla' );
	}

	/**
	 * Set response content.
	 *
	 * @param   mixed  $content  Content will be sent to client
	 * @return  void
	 */
	public function setResponse( $content )
	{
		$this->responseContent = $content;
	}

	/**
	 * Get response content.
	 *
	 * @return mixed
	 */
	public function getResponse()
	{
		return $this->responseContent;
	}

	/**
	 * Render action template
	 *
	 * @param   string  $tmpl  Template file name to render
	 * @return  void
	 */
	public function render ($tmpl, $data = array())
	{
		$widgetName = $this->input->getCmd('sunfwwidget');
		$tmplFile   = SUNFW_PATH_INCLUDES . '/widget/tmpl/' . $widgetName . '/' . $tmpl . '.php';

		if ( ! is_file($tmplFile) || ! is_readable($tmplFile) )
		{
			throw new Exception('Template file not found: ' . $tmplFile);
		}

		// Extract data to seperated variables
		extract($data);

		// Start output buffer
		ob_start();

		// Load template file
		include $tmplFile;

		// Send rendered content to client
		$this->responseContent = ob_get_clean();
	}

	/**
	 * Retrieve template detailed information and store
	 * it in the memory
	 *
	 * @param   string  $name  The template name
	 * @return  void
	 */
	private function _parseTemplateInfo ($name)
	{
		if ( ! ($details = SunFwRecognization::detect($name)))
		{
			$this->app->enqueueMessage("The template {$name} is not a valid our template!");
		}

		$this->template = array(
			'name'		=> $name,
			'realName'	=> JText::_($name),
			'id'		=> SunFwHelper::getTemplateIdentifiedName($name),
			'edition'	=> SunFwHelper::getTemplateEdition($name),
			'version'	=> SunFwHelper::getTemplateVersion($name)
		);
	}
}
