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
// Import necessary library.
jimport('joomla.filesystem.file');
/**
 * Layout builder custom form field.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class JFormFieldAppearance extends JFormField
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
		$this->language 		= JFactory::getLanguage();

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
		$html = $this->renderHTML();

		return $html;
	}

	/**
	 * Render HTML
	 *
	 * @return string
	 *
	 */
	protected function renderHTML()
	{
		$sunFwPresetsObj = new SunFwPresets();

		$styleID 					= $this->app->input->getInt( 'id', 0 );

		$typeHtml 					= '';
		$sectionHtml 				= '';
		$defaultModuleStyleHtml 	= '';
		$sunfwhideSelectedTypeField		= '<input id="sunfw_appearance_selected_type" type="hidden" name=sunfw-appearance[selected_type] value="" />';
		$sunfwhideSelectedModuleField	= '<input id="sunfw_appearance_selected_module_style" type="hidden" name=sunfw-appearance[selected_module_style] value="" />';
		$sunfwhideSelectedSectionIDField	= '<input id="sunfw_appearance_selected_section_id" type="hidden" name=sunfw-appearance[selected_section_id] value="" />';
		#Get layout Builder Section List
		//$sections 			= $this->getLayoutBuilderSectionList();

		#Get Default Modules Styles
		$defaultModuleStyles = SunFwHelper::getDefaultModuleStyle($styleID);
		$type 				= array (
							'0' => array ('data-type'=>'general', 'value' => 'general',
												'text'  =>  JText::_('SUNFW_APPEARANCE_GENERAL')),
							'1' => array ('data-type'=>'section', 'value' => 'section',
									'text'  =>  JText::_('SUNFW_APPEARANCE_SECTIONS')),
							'2'	  => array ('data-type'=>'module', 'value' => 'module',
									'text'  => JText::_('SUNFW_APPEARANCE_MODULE')),
							'3'	  => array ('data-type'=>'menu', 'value' => 'menu',
									'text'  => JText::_('SUNFW_APPEARANCE_MAIN_MENU'))	
					);


		#Build type ComboBox
		if (count($type))
		{
			$typeHtml .= '<select id="sunfw_appearance_type" class="form-control" name="sunfw-appearance[type]">';
			foreach ($type as $value)
			{
				$selected = 'general';
				$typeHtml .= '<option ' . $selected . ' data-type="' . $value['data-type']. '" value="' . $value['value']. '">' . $value['text']. '</option>';
			}
			$typeHtml .= '</select>' . $sunfwhideSelectedTypeField . $sunfwhideSelectedModuleField . $sunfwhideSelectedSectionIDField;
		}

		#Build Section ComboBox
		//array_unshift($sections , array('text' => '-- ' . JText::_('SUNFW_SELECT_SECTION') . ' --', 'value' => '', 'data-type' => 'section'));
		$sectionHtml .= '<select id="sunfw_appearance_section_name" class="sunfwhide form-control" name="sunfw-appearance[section_id]">';
// 		if (count($sections))
// 		{
// 			foreach ($sections as $value)
// 			{
// 				$sectionHtml .= '<option data-type="section" value="' . $value['value']. '">' . $value['text']. '</option>';
// 			}
// 		}
		$sectionHtml .= '</select>';

		#Build default Module Style ComboBox
		$defaultModuleStyleHtml .= '<select id="sunfw_appearance_module_style" class="sunfwhide form-control" name="sunfw-appearance[module_style]">';
		if (count($defaultModuleStyles))
		{
			$defaultModuleStyleHtml .= '<option data-type="module" value="">' . '-- ' . JText::_('SUNFW_SELECT_MODULE') . ' --' . '</option>';
			foreach ($defaultModuleStyles['appearance']['modules'] as $key => $value)
			{
				$defaultModuleStyleHtml .= '<option data-type="module" value="' . $key . '">' . ucfirst(str_replace('-', ' ', $key)) . '</option>';
			}
		}
		$defaultModuleStyleHtml .= '</select>';

		$html = '<script type="text/javascript">
				window.sunfw_appearance = ' . json_encode( array(
				'text' => array(
					'save-data-successfully' => JText::_( 'SUNFW_APPEARANCE_SAVE_DATA_SUCCESSFULLY' ),
					'are-you-sure-you-want-to-select-this-preset' => JText::_( 'SUNFW_APPEARANCE_ARE_YOU_SURE_YOU_WANT_TO_SELECT_THIS_PRESET' ),

				)) ) . ';

				(function($) {
					$(document).ready(function() {
						new $.SunFwAppearance({});
						$("#appearance-parameters-container, #appearance-preview-container").theiaStickySidebar({
							// Settings
							additionalMarginTop: 30
						});
					});
				})(jQuery);
				</script>';

		$html .= '<div class="jsn-pageheader padding-top-20 padding-bottom-20">
					<div class="container-fluid">
						<div class="pull-left">
							<h3 class="margin-0 line-height-30">' . JText::_('SUNFW_APPEARANCE') . '</h3>
						</div>
						<div class="pull-right">
							<button type="button" class="btn btn-warning text-uppercase" id="sunfw-save-appearance-button"><i class="fa fa-floppy-o font-size-14 margin-right-5"></i>' . JText::_('SUNFW_SAVE_APPEARANCE') . '</button>
						</div>
					</div>
				</div>';
		$html .= $sunFwPresetsObj->renderPreset();
		$html .= '<div class="container-fluid padding-top-20"> ' . $typeHtml . $sectionHtml . $defaultModuleStyleHtml . '</div>';

		#Get config form to render Acorrdion
		$forms  = $this->getConfigForm();
		if (count($forms))
		{
			$html .= '<div class="col-xs-6" id="appearance-parameters-container">';
			$html .= '<div class="theiaStickySidebar">';
			foreach ($forms as $key => $form)
			{
				$index = 0;
				$expKey = explode('.', $key);
				$id = $expKey[0] . '-' . $expKey[1];
				$heading = 'heading'. ucfirst($id) ;
				$collapse = 'collapse'. ucfirst($id);
				$html .= '<div class="sunfwhide container-fluid padding-top-20 apperance-type-container" id="' . $id . '-container"><div class="panel-group ' . $id . '" id="' . $id . '">';

				foreach ($form as $item)
				{
					$class = '';
					$classIn = '';
					if ($index == 0)
					{
						$class= ' class="collapsed"';
						$classIn = ' in ';
					}
					$heading = 'heading'. ucfirst($id) . ucfirst($item->name);
					$collapse = 'collapse'. ucfirst($id) . ucfirst($item->name);
					$html .= '<div class="panel panel-default">';
					$html .= '<div class="panel-heading" role="tab" id="'. $heading .'">
								<h4 class="panel-title">
									<a' . $class . ' role="button" data-toggle="collapse" data-parent="#' . $id . '" href="#' . $collapse . '" aria-expanded="false" aria-controls="' . $collapse . '">
										' . JText::_($item->label) .'
									</a>
								</h4>
							</div>';
					$html .= '<div id="' . $collapse . '" class="panel-collapse collapse' . $classIn . '" role="tabpanel" aria-labelledby="'. $heading .'">
							      <div class="panel-body">
							        ' . str_replace('class="control-group"', 'class="form-group"', $item->fields) . '
							      </div>
						    </div>';
					$html .= '</div>';
					$index ++;
				}
				$html .= '</div></div>';
			}
			$html .= '</div>';
			$html .= '</div>';

			$html .= '<div class="col-xs-6" id="appearance-preview-container">';
			$html .= '<div class="theiaStickySidebar">';
			foreach ($forms as $key => $form)
			{

				$content    = '';$expKey = explode('.', $key);
				$id 		= $expKey[0] . '-' . $expKey[1];
				$fileName	= str_replace('-', '', $id);
				$layoutPath = SUNFW_PATH . '/includes/admin/fields/tmpl/preview/' . $fileName . '.php';

				$html .= '<div class="sunfwhide container-fluid padding-top-20  apperance-preview-container" id="' . $id . '-container-preview">';


				if (is_file($layoutPath))
				{
					ob_start();
					include $layoutPath;
					$html .= ob_get_clean();
				}
				$html .= '</div>';
			}
			$html .= '</div>';
			$html .= '</div>';
		}

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
		$styleID 		= $this->app->input->getInt( 'id', 0 );
		$style 			= SunFwHelper::getTemplateStyle($styleID);
		$this->language->load( 'tpl_' . $style->template, JPATH_ROOT );

		$configFiles 	= glob( JPATH_PLUGINS . '/system/sunfw/includes/admin/config/appearance/*.xml' );

		$configModuleStyleFilePath 	= JPath::clean( JPATH_SITE . "/templates/" . $style->template . "/module-styles/module.xml" );

		if (JFile::exists($configModuleStyleFilePath))
		{
			$configModuleStyleFile = glob($configModuleStyleFilePath);
			$configFiles = array_merge($configFiles, $configModuleStyleFile);
		}

		foreach ($configFiles as $configFile)
		{
			$name = substr( basename( $configFile ), 0, -4 );
			$name = 'appearance.' . $name . '.params';
			// Instantiate a JForm object.
			$form = new JForm($name);
			// Add path to our custom fields.
			$form->addFieldPath( SUNFW_PATH . '/includes/admin/fields' );

			// Then, load config from the XML file.
			$form->loadFile( $configFile );

			// Bind value of parameters to form
			if (isset($this->params[$name]) && count($this->params[$name]))
			{
				foreach ($this->params[$name] as $key => $value)
				{
					$form->setValue($key, 'sunfw-appearance', $value);
				}
			}
			// Get all fieldsets.
			$fieldsets = $form->getFieldsets();
			foreach ( $fieldsets as $key => $fieldset )
			{
				$fieldset->fields = $form->renderFieldset( $fieldset->name );
				$html[$name][$key] = $fieldset;
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

		$data = json_decode($data->appearance_data, true);

		$data = $data['appearance'];

		if (!count($data)) return $result;

		if (isset($data['general']))
		{
			$general['general'] = $data['general'];

			foreach ($general as $key => $items)
			{
				if (is_array($items) && count($items))
				{
					foreach ($items as $subKey => $subItems)
					{
						foreach ($subItems as $subSubKey => $subSubItem)
						{
							$result['appearance.' . $key . '.params'][$key . '-' . $subKey . '-' . $subSubKey] = $subSubItem;
						}
					}
				}
				else
				{
					$result['appearance.' . $key . '.params'] = $items;
				}
			}
		}

		if (isset($data['sections']))
		{
			$section = $data['sections'];
			foreach ($section as $key => $items)
			{
				if (is_array($items) && count($items))
				{
					foreach ($items as $subKey => $subItems)
					{
						foreach ($subItems as $subSubKey => $subSubItem)
						{
							$result['appearance.' . $key . '.params'][$key . '-' . $subKey . '-' . $subSubKey] = $subSubItem;
						}
					}
				}
				else
				{
					$result['appearance.' . $key . '.params'] = $items;
				}
			}
		}

		if (isset($data['modules']))
		{
			$module = $data['modules'];
			foreach ($module as $key => $items)
			{
				if (is_array($items) && count($items))
				{
					foreach ($items as $subKey => $subItems)
					{
						foreach ($subItems as $subSubKey => $subSubItem)
						{
							$result['appearance.' . $key . '.params'][$key . '-' . $subKey . '-' . $subSubKey] = $subSubItem;
						}
					}
				}
				else
				{
					$result['appearance.' . $key . '.params'] = $items;
				}
			}
		}

		if (isset($data['menu']))
		{
			$menu['menu'] = $data['menu'];

			foreach ($menu as $key => $items)
			{
				if (is_array($items) && count($items))
				{
					foreach ($items as $subKey => $subItems)
					{
						foreach ($subItems as $subSubKey => $subSubItem)
						{
							$result['appearance.' . $key . '.params'][$key . '-' . $subKey . '-' . $subSubKey] = $subSubItem;
						}
					}
				}
				else
				{
					$result['appearance.' . $key . '.params'] = $items;
				}
			}
		}

		return $result;
	}

	/**
	 * Get Section List
	 *
	 * @return array
	 */
	protected function getLayoutBuilderSectionList()
	{
		$styleID 			= $this->app->input->getInt( 'id', 0 );
		$data 	 			= SunFwHelper::getSunFwStyle( $styleID );
		$sections			= array();

		if (!count($data)) return $sections;


		if ($data->layout_builder_data != '')
		{
			$layoutBuilder		= json_decode($data->layout_builder_data, true);
			if (isset($layoutBuilder['sections']) && count($layoutBuilder['sections']))
			{
				foreach ($layoutBuilder['sections'] as $section)
				{
					$tmp 				= array();
					$tmp['text'] 		= $section['label'];
					$tmp['value'] 		= $section['id'];
					$tmp['data-type'] 	= 'section';
					$sections [] 		= $tmp;
				}
			}

		}
		return $sections;
	}
}
