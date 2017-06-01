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
 * Class that handles general template admin Ajax requests.
 *
 * @package  SUN Framework
 * @since    1.3.0
 */
class SunFwAjaxAdmin extends SunFwAjax
{
	/**
	 * Method to get alert data.
	 *
	 * @return  void
	 */
	public function getComponentAlertsAction()
	{
		// Allow 3rd-party plugins to add their own alerts.
		$items = array_merge( array(), JEventDispatcher::getInstance()->trigger('SunFwGetComponentAlerts') );

		$this->setResponse( array('items' => $items) );
	}

	/**
	 * Method to get data for header nav bar.
	 *
	 * @return  void
	 */
	public function getComponentHeaderAction()
	{
		// Get site URL.
		$root = JUri::root(true);

		// Define header nav bar.
		$items = array(
			'logo' => array(
				'link'  => $root,
				'image' => "{$root}/plugins/system/sunfw/assets/images/logo.png",
				'title' => htmlspecialchars($this->app->getCfg('sitename'), ENT_QUOTES, 'UTF-8')
			),
			'menu' => array(
				array(
					'href'   => '#',
					'icon'   => 'database',
					'type'   => 'trigger-other',
					'title'  => JText::_('SUNFW_DATA_TAB'),
					'target' => '#data, #sample-data',
					'items'  => array(
						array(
							'href'   => '#',
							'type'   => 'trigger-other',
							'title'  => JText::_('SUNFW_SAMPLE_DATA_TAB'),
							'target' => '#data, #sample-data'
						),
						array(
							'href'   => '#',
							'type'   => 'trigger-other',
							'title'  => JText::_('SUNFW_MAINTENANCE_TAB'),
							'target' => '#data, #maintenance'
						)
					)
				),
				array(
					'href'   => '#',
					'icon'   => 'gear',
					'type'   => 'trigger-other',
					'title'  => JText::_('SUNFW_GLOBAL_PARAMETERS'),
					'target' => '#global-parameters, #token-key',
					'items'  => array(
						array(
							'href'   => '#',
							'type'   => 'trigger-other',
							'title'  => JText::_('SUNFW_TOKEN_KEY_TAB'),
							'target' => '#global-parameters, #token-key'
						)
					)
				),
				array(
					'href'   => '#',
					'icon'   => 'info',
					'type'   => 'trigger-other',
					'title'  => JText::_('SUNFW_ABOUT'),
					'target' => '#about'
				),
				array(
					'id'     => 'sunfw-learn-more',
					'href'   => '#',
					'icon'   => 'life-ring',
					'title'  => JText::_('SUNFW_HELP'),
					'items'  => array(
						array(
							'id'     => 'sunfw-get-started',
							'href'   => '#',
							'icon'   => 'flag',
							'title'  => JText::_('SUNFW_GET_STARTED')
						),
						array(
							'href'   => SUNFW_DOCUMENTATION_URL,
							'icon'   => 'book',
							'title'  => JText::_('SUNFW_ABOUT_DOCUMENTATION'),
							'target' => '_blank'
						),
						array(
							'href'   => SUNFW_VIDEO_TUTORIALS_URL,
							'icon'   => 'video-camera',
							'title'  => JText::_('SUNFW_ABOUT_VIDEO_TUTORIALS'),
							'target' => '_blank'
						),
						array(
							'href'   => SUNFW_SUPPORT_URL,
							'icon'   => 'life-ring',
							'title'  => JText::_('SUNFW_ABOUT_SUPPPORT'),
							'target' => '_blank'
						)
					),
					'dropdownClass' => 'pull-right'
				)
			)
		);

		// Allow 3rd-party plugins to add their own menu items into header nav bar.
		$items = array_merge_recursive( $items, JEventDispatcher::getInstance()->trigger('SunFwGetComponentHeader') );

		$this->setResponse($items);
	}

	/**
	 * Method to get data for main workspace.
	 *
	 * @return  void
	 */
	public function getComponentBodyAction()
	{
		// Get site URL.
		$root = JUri::root(true);

		// Build URL to save a copy of the current template style.
		$saveAsCopy = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=core&action=saveAsCopy'
			. "&template_name={$this->templateName}&style_id={$this->styleID}"
			. '&' . JSession::getFormToken() . '=1';

		// Get all input components.
		$inputs = array();
		$path   = JPATH_ROOT . '/plugins/system/sunfw/assets/joomlashine/admin/js/inputs';

		foreach (glob("{$path}/*.js") as $input)
		{
			$inputs[substr(basename($input), 0, -3)] = $root . str_replace(JPATH_ROOT, '', $input);
		}

		// Define tabs and associated editors in main workspace.
		$items = array(
			'tabs' => array(
				array(
					'href'   => '#layout',
					'title'  => JText::_('SUNFW_LAYOUT_TAB'),
					'render' => array(
						'name' => 'SunFwPaneLayout',
						'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/layout/render.js"
					),
					'className' => 'toggle-pane'
				),
				array(
					'href'   => '#styles',
					'title'  => JText::_('SUNFW_STYLES_TAB'),
					'render' => array(
						'name' => 'SunFwPaneStyles',
						'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/styles/render.js"
					),
					'className' => 'toggle-pane'
				),
				array(
					'href'   => '#navigation',
					'title'  => JText::_('SUNFW_MEGAMENU_TAB'),
					'render' => array(
						'name' => 'SunFwPaneMegaMenu',
						'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/mega-menu/render.js"
					),
					'className' => 'toggle-pane'
				),
				array(
					'href'   => '#advanced',
					'title'  => JText::_('SUNFW_SYSTEM_TAB'),
					'render' => array(
						'name' => 'SunFwPaneSystem',
						'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/system/render.js"
					),
					'className' => 'toggle-pane'
				),
				array(
					'href'  => '#',
					'title' => JText::_('SUNFW_EXTRAS_TAB'),
					'items' => array(
						array(
							'href'   => '#cookie-law',
							'title'  => JText::_('SUNFW_COOKIE_LAW_TAB'),
							'render' => array(
								'name' => 'SunFwPaneCookieLaw',
								'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/cookie-law/render.js"
							),
							'className' => 'toggle-pane'
						)
					),
					'className' => 'toggle-pane'
				),
				array(
					'href'   => '#menu-assignment',
					'title'  => JText::_('SUNFW_MENU_ASSIGNMENT_TAB'),
					'render' => array(
						'name' => 'SunFwPaneAssignment',
						'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/assignment/render.js"
					),
					'className' => 'toggle-pane'
				),
				array(
					'href'      => '#data',
					'title'     => JText::_('SUNFW_DATA_TAB'),
					'listClass' => 'hidden',
					'items'     => array(
						array(
							'href'   => '#sample-data',
							'title'  => JText::_('SUNFW_SAMPLE_DATA'),
							'render' => array(
								'name' => 'SunFwPaneSampleData',
								'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/sample-data/render.js"
							)
						),
						array(
							'href'   => '#maintenance',
							'title'  => JText::_('SUNFW_MAINTENANCE_TAB'),
							'render' => array(
								'name' => 'SunFwPaneMaintenance',
								'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/maintenance/render.js"
							)
						)
					)
				),
				array(
					'href'      => '#global-parameters',
					'title'     => JText::_('SUNFW_GLOBAL_PARAMETERS_TAB'),
					'listClass' => 'hidden',
					'items'     => array(
						array(
							'href'   => '#token-key',
							'title'  => JText::_('SUNFW_TOKEN_KEY_TAB'),
							'render' => array(
								'name' => 'SunFwPaneTokenKey',
								'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/token-key/render.js"
							)
						)
					)
				),
				array(
					'href'   => '#about',
					'title'  => JText::_('SUNFW_ABOUT'),
					'render' => array(
						'name' => 'SunFwPaneAbout',
						'file' => "{$root}/plugins/system/sunfw/assets/joomlashine/admin/js/about/render.js"
					),
					'listClass' => 'hidden'
				)
			),
			'buttons' => array(
				array(
					array(
						'id'        => 'sunfw-save-all',
						'href'      => '#',
						'type'      => 'success',
						'icon'      => '<span class="icon-apply icon-white"></span>',
						'label'     => JText::_('SUNFW_SAVE_ALL'),
						'disabled'  => true,
						'className' => 'font-size-11 text-uppercase'
					),
					array(
						'type'  => 'success',
						'label' => '',
						'menu'  => array(
							array(
								'id'    => 'sunfw-save-as-copy',
								'href'  => $saveAsCopy,
								'title' => JText::_('SUNFW_SAVE_AS_COPY')
							)
						),
						'menuClass' => 'pull-right'
					)
				),
				array(
					'href'      => 'index.php?option=com_templates',
					'type'      => 'default',
					'icon'      => '<span class="icon-cancel"></span>',
					'label'     => JText::_('SUNFW_CLOSE'),
					'className' => 'text-uppercase'
				)
			),
			'inputs' => $inputs
		);

		// Allow 3rd-party plugins to add their own tabs into main workspace.
		$items = array_merge_recursive( $items, JEventDispatcher::getInstance()->trigger('SunFwGetComponentBody') );

		$this->setResponse($items);
	}

	/**
	 * Method to get data for footer info bar.
	 *
	 * @return  void
	 */
	public function getComponentFooterAction()
	{
		// Prepare link to view template details at JSN server.
		$templateLink = sprintf( SUNFW_TEMPLATE_URL, substr($this->templateName, 4) );

		// Define footer info bar.
		$items = array(
			'credits' => array(
				'template' => array(
					'name'    => strtoupper( str_replace( '_', ' ', str_replace('pro', '', $this->templateName) ) ),
					'link'    => $templateLink,
					'edition' => $this->template['edition'],
					'version' => $this->template['version']
				),
				'framework' => array(
					'name'    => JText::_('PLG_SYSTEM_SUNFW'),
					'link'    => 'http://www.joomlashine.com/joomla-templates/jsn-sunframework.html',
					'version' => SUNFW_VERSION
				)
			),
			'others' => array(
				sprintf(
					JText::_('SUNFW_OTHER_PRODUCTS_PAGE_BUILDER'),
					'<a href="http://www.joomlashine.com/joomla-extensions/jsn-pagebuilder.html" target="_blank" rel="noopener noreferrer">JSN PageBuilder</a>'
				)
			)
		);

		// Allow 3rd-party plugins to add their own tabs into main workspace.
		$items = array_merge_recursive( $items, JEventDispatcher::getInstance()->trigger('SunFwGetComponentFooter') );

		$this->setResponse($items);
	}

	/**
	 * Method to get update data.
	 *
	 * @return  void
	 */
	public function getComponentUpdateAction()
	{
		$ajaxServer = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=update&'
			. "&style_id={$this->styleID}"
			. "&template_name={$this->templateName}"
			. '&' . JSession::getFormToken() . '=1&';

		$widgetServer = 'index.php?sunfwwidget=update&action=confirm&author=joomlashine&'
			. "&style_id={$this->styleID}"
			. "&template_name={$this->templateName}"
			. '&' . JSession::getFormToken() . '=1&';

		$this->setResponse( array(
			'ajaxServer'   => $ajaxServer,
			'widgetServer' => $widgetServer,
			'modalTitle'   => array(
				'framework' => JText::_('SUNFW_UPDATE_FRAMEWORK_TITLE'),
				'template'  => JText::_('SUNFW_UPDATE_TEMPLATE_TITLE')
			)
		) );
	}

	/**
	 * Method to load JSON settings file for template admin.
	 *
	 * @return  void
	 */
	public function loadJsonFileAction()
	{
		// Get requested JSON file.
		$file = $this->input->getString('file');

		if ( empty($file) || ! ( $file = realpath(JPATH_ROOT . "/{$file}") ) )
		{
			exit;
		}

		// Set response header.
		header( 'Content-Type: application/json' );

		// Read and print JSON file content.
		readfile( $file );

		exit;
	}
}
