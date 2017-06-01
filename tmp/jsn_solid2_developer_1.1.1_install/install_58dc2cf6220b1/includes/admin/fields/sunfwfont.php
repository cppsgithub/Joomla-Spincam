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

// Load base class
require_once SUNFW_PATH . '/includes/admin/fields/field.php';

/**
 * Custom field to output input field
 * as a value
 *
 * @package     SUN Framework
 * @subpackage  Form
 * @since       1.0.0
 */
class JFormFieldSunFwFont extends SunFwFormField
{
    public $type = 'SunFwTextAddon';

    protected $inputClass = array();
    protected $inputAttrs = '';
    protected $textSuffix = '';
    protected $textPrefix = '';
    protected $dataType   = 'text';

    public function getInput ()
    {
        $this->app 		= JFactory::getApplication();
        $this->input 	= $this->app->input;
        $this->data		= array();
        $this->params 	= $this->getConfigData();
        if (count($this->params))
        {
            foreach ($this->params  as $key => $items )
            {
                if (count($items))
                {
                    foreach ($items as $subKey => $item)
                    {
                        $this->data [$subKey] = $item;
                    }
                }
            }
        }

        if (isset($this->element['suffix']) && !empty($this->element['suffix'])) {
            $this->inputClass[] = 'input-group';
            $this->textSuffix = (string) $this->element['suffix'];
        }

        if (isset($this->element['dataType'])) {
            $this->dataType = (string) $this->element['dataType'];
        }

        if (isset($this->element['prefix']) && !empty($this->element['prefix'])) {
            $this->inputClass[] = 'input-prepend';
            $this->textPrefix = (string) $this->element['prefix'];
        }

        if (isset($this->element['disabled']) && $this->element['disabled'] == 'true') {
            $this->inputClass[] = 'disabled';
            $this->inputAttrs .= ' disabled="disabled"';
        }

        $this->fontWeight = $this->element['fontWeight'];
        $this->parentName = $this->element['parentName'];
        $this->fontStyle = $this->element['fontStyle'];
        $this->fontFamily = $this->element['fontFamily'];
        $this->fontType = $this->element['fontType'];

        $this->googleFontData = $this->getFonts();

        $fontTypeData 		= array();
        $fontTypeData[] 	= JHTML::_( 'select.option', 'standard', JText::_('SUNFW_APPEARANCE_TEXT_FONT_STANDARD') );
        $fontTypeData[] 	= JHTML::_( 'select.option', 'google', JText::_('SUNFW_APPEARANCE_TEXT_FONT_GOOGLE') ); // first parameter is value, second is text

        $fontFamilyStandard	= array();
        $fontFamilyStandardData [] = array('text' => 'Verdana', 'value' => 'Verdana');
        $fontFamilyStandardData [] = array('text' => 'Georgia', 'value' => 'Georgia');
        $fontFamilyStandardData [] = array('text' => 'Times New Roman', 'value' => 'Times New Roman');
        $fontFamilyStandardData [] = array('text' => 'Courier New', 'value' => 'Courier New');
        $fontFamilyStandardData [] = array('text' => 'Arial', 'value' => 'Arial');
        $fontFamilyStandardData [] = array('text' => 'Tahoma', 'value' => 'Tahoma');
        $fontFamilyStandardData [] = array('text' => 'Trebuchet MS', 'value' => 'Trebuchet MS');
        $fontFamilyStandardData [] = array('text' => 'Palatino Linotype', 'value' => 'Palatino Linotype');
        $fontFamilyStandardData [] = array('text' => 'Lucida Sans Unicode', 'value' => 'Lucida Sans Unicode');
        $fontFamilyStandardData [] = array('text' => 'Lucida Console', 'value' => 'Lucida Console');

        $fontWeightStandardData	= array();
        $fontWeightStandardData [] = array('text' => 'normal', 'value' => 'normal');
        $fontWeightStandardData [] = array('text' => 'bold', 'value' => 'bold');


        $fontStyleStandardData	= array();
        $fontStyleStandardData [] = array('text' => 'normal', 'value' => 'normal');
        $fontStyleStandardData [] = array('text' => 'italic', 'value' => 'italic');
        $fontStyleStandardData [] = array('text' => 'oblique', 'value' => 'oblique');

        $this->fontFamilyStandardData 	= $fontFamilyStandardData;
        $this->fontWeightStandardData 	= $fontWeightStandardData;
        $this->fontStyleStandardData 	= $fontStyleStandardData;
        $this->fontTypeData 			= $fontTypeData;

        $subsets 						= array();
        $items 							= json_decode($this->googleFontData);

        foreach ($items->items as $key => $font)
        {
       		$subsets = array_merge($font->subsets, $subsets);
        }
        $this->subsets 					= array_unique($subsets);
        return $this->renderLayout();
    }

    public function getFonts() {

        // more check load font ....

        //$apiKey = "AIzaSyAfW324ddyBMkoPd20ihaRH2bDD4PeEdYo";
        //$requestFont = "https://www.googleapis.com/webfonts/v1/webfonts?key=" . $apiKey;

		$path		= SUNFW_PATH . '/googlefonts/googlefonts.json';

        $googleFont = file_get_contents($path);

        return $googleFont;
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

        return $result;
    }
}
