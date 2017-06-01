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
 * Layout builder custom form field.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class JFormFieldAdvanced extends JFormField
{
	/**
	 * Method to instantiate the form field object.
	 *
	 * @param   JForm  $form  The form to attach to the form field object.
	 *
	 * @since   11.1
	 */
	public function __construct($form = null)
	{
		// If there is a form passed into the constructor set the form and form control properties.
		$this->app 				= JFactory::getApplication();
		$this->input 			= $this->app->input;
		$this->params 			= $this->getConfigData();

		parent::__construct();
	}

	/**
	 * Return label for the input control.
	 *
	 * @return  string
	 */
	protected function getLabel ()
	{
		return;
	}
	/**
	 * Render HTML for input control.
	 *
	 * @return  string
	 */
	protected function getInput()
	{
		$html = '<script type="text/javascript">
				window.sunfw_advanced = ' . json_encode( array(
				'text' => array(
					'save-data-successfully' => JText::_( 'SUNFW_APPEARANCE_SAVE_DATA_SUCCESSFULLY' ),
				)) ) . ';

				(function($) {
					$(document).ready(function() {
						window.SunFwAdvanced = new $.SunFwAdvanced({});
					});
				})(jQuery);
				</script>';

		$html .= '<div class="jsn-pageheader padding-top-10 padding-bottom-10">
					<div class="container-fluid">
						<div class="pull-left">
							<h3 class="margin-0 line-height-30">' . JText::_('SUNFW_SYSTEM') . '</h3>
						</div>
						<div class="pull-right">
							<button type="button" class="btn btn-warning text-uppercase" id="sunfw-save-advanced-button"><i class="icon-apply icon-white margin-right-5"></i>' . JText::_('SUNFW_SAVE_SYSTEM') . '</button>
						</div>
					</div>
				</div>';

		$html .= '<div class="container-fluid padding-top-20">';
		$forms  = $this->getConfigForm();

		if (count($forms))
		{
			foreach ($forms['parent'] as $pKey => $pitem)
			{
				if (isset($pitem->columns))
				{
					$html .= $this->buildLayout($forms['children'][$pKey], $pitem->columns);
				}
				else
				{
					$html .= $this->buildLayout($forms['children'][$pKey], '1');
				}
			}
		}
		$html .= '</div>';
		return $html;
	}

	/**
	 * Get config Form
	 *
	 * @return array
	 */
	protected function getConfigForm()
	{
		$html 			= array();
		$children		= array();
		$parent			= array();
		$configFile 	= JPATH_PLUGINS . '/system/sunfw/includes/admin/config/advanced/advanced.xml';

		$name = substr( basename( $configFile ), 0, -4 );
		$name = 'advanced.' . $name . '.params';
		// Instantiate a JForm object.
		$form = new JForm($name);
		// Add path to our custom fields.
		$form->addFieldPath( SUNFW_PATH . '/includes/admin/fields' );

		// Then, load config from the XML file.
		$form->loadFile( $configFile );

		// Bind value of parameters to form
		if (count($this->params))
		{
			foreach ($this->params as $key => $value)
			{
				$form->setValue($key, 'sunfw-advanced', $value);
			}
		}
		// Get all fieldsets.
		$fieldsets = $form->getFieldsets();

		foreach ( $fieldsets as $key => $fieldset )
		{
			if ($fieldset->parent == '')
			{
				$parent[$fieldset->name] = $fieldset;
			}
			else
			{
				$fieldset->fields = $form->renderFieldset( $fieldset->name );
				$children[$fieldset->parent][$key] = $fieldset;
			}
		}
		$html['parent'] = $parent;
		$html['children'] = $children;

		return $html;
	}

	/**
	 *	Build layout
	 *
	 * @param array $items the item array
	 * @param bool $twoColumns
	 *
	 * @return string
	 */
	protected function buildLayout($items, $numberColumns = false)
	{
		$html = '';

		if ($numberColumns == '3')
		{
			$columns = array('left' => array(), 'center' => array(), 'right' => array());
			foreach ($items as $item)
			{
				$column = $item->column;
				$columns[(string) $column][] = $item;
			}
			foreach ($columns as $column)
			{
				$html .= '<div class="col-xs-12 col-md-4">';
				foreach ($column as $item)
				{
					$html .= '<fieldset class="' . $item->name . '">';
					$html .= '<legend>' . JText::_($item->label) . '</legend>';
					$html .= str_replace('class="control-group"', 'class="form-group"', $item->fields);
					$html .= '</fieldset>';
				}
				$html .= '</div>';
			}
		}
		elseif ($numberColumns == '2')
		{
			$columns = array('left' => array(), 'right' => array());
			foreach ($items as $item)
			{
				$column = $item->column;
				$columns[(string) $column][] = $item;
			}

			foreach ($columns as $column)
			{
				$html .= '<div class="col-xs-12 col-md-6">';
				foreach ($column as $item)
				{
					$html .= '<fieldset class="' . $item->name . '">';
					$html .= '<legend>' . JText::_($item->label) . '</legend>';
					$html .= str_replace('class="control-group"', 'class="form-group"', $item->fields);
					$html .= '</fieldset>';
				}
				$html .= '</div>';
			}
		}
		else
		{
			foreach ($items as $item)
			{
				$html .= '<div class="col-xs-12 col-md-12">';
				$html .= '<fieldset class="' . $item->name . '">';
				$html .= '<legend>' . JText::_($item->label) . '</legend>';
				$html .= str_replace('class="control-group"', 'class="form-group"', $item->fields);
				$html .= '</fieldset>';
				$html .= '</div>';
			}
		}

		return $html;
	}

	/**
	 * Get config data
	 *
	 * @return Array
	 */
	protected function getConfigData()
	{
		$result 			= array();
		$styleID 			= $this->app->input->getInt( 'id', 0 );
		$data 	 			= SunFwHelper::getSunFwStyle( $styleID );

		if (!count($data)) return $result;

		$data = json_decode($data->system_data, true);

		return $data;
	}
}
