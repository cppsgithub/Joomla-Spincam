<?php
/**
 * @version   $Id$
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
 * General ScssRender class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */

class SunFwScssrender
{

    /**
     * @var array
     * @since version
     */
    private $_scssVars = array();



    /**
     * @param $styleID
     * @param $templateName
     * @param string $s
     *
     *
     * @since version
     * @throws Exception
     */

    public function padding($array){
        $arr = array('top' => 'false','bottom' => 'false', 'right' => 'false', 'left' => 'false');
        if(is_array($array)) {
            return array_merge($arr,array_filter($array,'strlen'));
        }
        else{
            return $arr;
        }

    }

    public function bgImageSetting($array){
        $arr = array('repeat' => 'false', 'attachment' => 'false', 'size' => 'false', 'position' => 'false');
        if(is_array($array)) {
            return array_merge($arr,array_filter($array,'strlen'));
        }
        else{
            return $arr;
        }
    }

    public function border($array){
        $arr = array(   'universal'=> 0, 'width' =>'false', 'style' => 'false', 'color' => 'false',
                        'top-width' =>'false', 'top-style' => 'false', 'top-color' => 'false',
                        'right-width' => 'false', 'right-style' => 'false', 'right-color' => 'false',
                        'bottom-width' => 'false', 'bottom-style' => 'false', 'bottom-color' => 'false',
                        'left-width' => 'false', 'left-style' => 'false', 'left-color' => 'false'

            );
        if(is_array($array)) {
            return array_merge($arr,array_filter($array,'strlen'));
        }
        else{
            return $arr;
        }
    }

    public function borderRadius($array){
        $arr = array('top-left' => 'false','top-right' => 'false', 'bottom-right' => 'false', 'bottom-left' => 'false');
        if(is_array($array)) {
            return array_merge($arr,array_filter($array,'strlen'));
        }
        else{
            return $arr;
        }
    }
    public function boxShadow($array){
        $arr = array('h-shadow' => 0,'v-shadow' => 0, 'blur' => 0, 'spread' => 0, 'color' => 'false', 'inset' => 'false');
        if(is_array($array)) {
            return array_merge($arr,array_filter($array,'strlen'));
        }
        else{
            return $arr;
        }
    }
    public function textShadow($array){
        $arr = array('h-shadow' => 0,'v-shadow' => 0, 'blur' => 0, 'color' => 'false');
        if(is_array($array)) {
            return array_merge($arr,array_filter($array,'strlen'));
        }
        else{
            return $arr;
        }
    }

    public function flatten($array, $prefix = '') {
        $result = array();
            foreach($array as $key=>$value) {
            if(is_array($value)) {
                $result = $result + $this->flatten($value, $prefix . $key . '-');
            }
            else {
                $result[$prefix.$key] = $value;
            }
        }
        return $result;
    }

    public function compile($styleID , $templateName, $s = "appearance") {

        $genaralPathRoot =  $sectionPathRoot = $modulePathRoot  = JURI::root() . '/';

        $urlPattern = '/^(http|https)/';

        $style = SunFwHelper::getSunFwStyle($styleID);
        if (!count($style)) return false;

        if ($s == "appearance") {

            $appearanceData = json_decode($style->appearance_data, true);

            try {

                // Compile General Style
                if (isset($appearanceData['general'])) {
                    $genaral = $this->_prevarUse($appearanceData['general']);

                    $scss_genaral_content = 'body {';

                    if (isset($genaral['page']['outer-background-image']) && $genaral['page']['outer-background-image'] != '') {

                        preg_match($urlPattern, $genaral['page']['outer-background-image'], $m);

                        if (count($m))
                        {
                            $genaralPathRoot = '';
                        }else {
                            $genaralPathRoot = '../../../../';
                        }

                        $scss_genaral_content .= "background-image: url('" . $genaralPathRoot . $genaral['page']['outer-background-image'] . "');";
                    }

                    // Style background
                    if (isset($genaral['page']['outer-background-image-settings'])) {

                        $outerBgImg = $genaral['page']['outer-background-image-settings'];

                        if (isset($outerBgImg['repeat']) && $outerBgImg['repeat'] != '')
                        {
                            $scss_genaral_content .= "background-repeat: " . $outerBgImg['repeat'] . ";";
                        }

                        if (isset($outerBgImg['size']) && $outerBgImg['size'] != '')
                        {
                            $scss_genaral_content .= "background-size: " . $outerBgImg['size'] . ";";
                        }

                        if (isset($outerBgImg['attachment']) && $outerBgImg['attachment'])
                        {
                            $scss_genaral_content .= "background-attachment: " . $outerBgImg['attachment'] . ";";
                        }

                        if (isset($outerBgImg['position']) && $outerBgImg['position'] != '')
                        {
                            $scss_genaral_content .= "background-position: " . $outerBgImg['position'] . ";";
                        }

                    }

                    $scss_genaral_content .= "}";

                    // Style border
                    $cssInnerBorder = '.sunfw-content.boxLayout {';

                    if (isset($genaral['page-inner']['inner-border'])) {

                        $innerBorder = $genaral['page-inner']['inner-border'];

                        // Check universal
                        if (isset($innerBorder['universal']) && intval( $innerBorder['universal'] ) ) {

                            if(isset($innerBorder['width']) && is_numeric($innerBorder['width'])) {
                                $cssInnerBorder .= 'border-width: '.$innerBorder['width'].'px;';
                            }

                            if(isset($innerBorder['style'])) {
                                $cssInnerBorder .= 'border-style: '.$innerBorder['style'].';';
                            }

                            if(isset($innerBorder['color'])) {
                                $cssInnerBorder .= 'border-color: '.$innerBorder['color'].';';
                            }

                        }else {

                            // Border Top
                            if(isset($innerBorder['top-width']) && is_numeric($innerBorder['top-width'])) {

                                $cssInnerBorder .= 'border-top-width: '.$innerBorder['top-width'].'px;';
                            }

                            if(isset($innerBorder['top-style']) && $innerBorder['top-style'] != '') {
                                $cssInnerBorder .= 'border-top-style: '.$innerBorder['top-style'].';';
                            }

                            if(isset($innerBorder['top-color']) && $innerBorder['top-color'] != '') {
                                $cssInnerBorder .= 'border-top-color: '.$innerBorder['top-color'].';';
                            }

                            // Border left
                            if(isset($innerBorder['left-width']) && is_numeric($innerBorder['left-width'])) {
                                $cssInnerBorder .= 'border-left-width: '.$innerBorder['left-width'].'px;';
                            }

                            if(isset($innerBorder['left-style']) && $innerBorder['left-style'] != '') {
                                $cssInnerBorder .= 'border-left-style: '.$innerBorder['left-style'].';';
                            }

                            if(isset($innerBorder['left-color']) && $innerBorder['left-color'] != '') {
                                $cssInnerBorder .= 'border-left-color: '.$innerBorder['left-color'].';';
                            }

                            // Border bottom
                            if(isset($innerBorder['bottom-width']) && is_numeric($innerBorder['bottom-width'])) {
                                $cssInnerBorder .= 'border-bottom-width: '.$innerBorder['bottom-width'].'px;';
                            }

                            if(isset($innerBorder['bottom-style']) && $innerBorder['bottom-style'] != '') {
                                $cssInnerBorder .= 'border-bottom-style: '.$innerBorder['bottom-style'].';';
                            }

                            if(isset($innerBorder['bottom-color']) && $innerBorder['bottom-color'] != '') {
                                $cssInnerBorder .= 'border-bottom-color: '.$innerBorder['bottom-color'].';';
                            }

                            // Border right
                            if(isset($innerBorder['right-width']) && is_numeric($innerBorder['right-width'])) {
                                $cssInnerBorder .= 'border-right-width: '.$innerBorder['right-width'].'px;';
                            }

                            if(isset($innerBorder['right-style']) && $innerBorder['right-style'] != '') {
                                $cssInnerBorder .= 'border-right-style: '.$innerBorder['right-style'].';';
                            }

                            if(isset($innerBorder['right-color']) && $innerBorder['right-color'] != '') {
                                $cssInnerBorder .= 'border-right-color: '.$innerBorder['right-color'].';';
                            }

                        }

                    }

                    $cssInnerBorder .= '}';

                    // Heading Text Shadow
                    if (isset($genaral['heading']['headings-text-shadow']) && is_array($genaral['heading']['headings-text-shadow'])) {

                        $headTextShadow = $genaral['heading']['headings-text-shadow'];

                        foreach ($headTextShadow as $k => $v) {
                            $genaral['heading']['headings-text-shadow-'.$k] = $v;
                        }

                    }

                    // Heading Font Google
                    if (isset($genaral['heading']['headings-google-font-family']) && is_array($genaral['heading']['headings-google-font-family'])) {

                        $headGoogleFont = $genaral['heading']['headings-google-font-family'];

                        foreach ($headGoogleFont as $k => $v) {
                            $genaral['heading']['headings-google-font-'.$k] = $v;
                        }
                    }

                    // Heading Font Custom
                    if (isset($genaral['heading']['headings-font-type']) && $genaral['heading']['headings-font-type'] == 'custom' && isset($genaral['heading']['headings-custom-font-file'])) {

                        $headCustomFont = basename($genaral['heading']['headings-custom-font-file']);
                        $headCFNameFile = explode('.',$headCustomFont);
                        $headCFName     = $headCFNameFile[0];

                        if(isset($headCFName) && $headCFName != '') {
                            $genaral['heading']['headings-custom-font-family'] = $headCFName;
                        }

                        $scss_genaral_content .= '@font-face {
                                                    font-family: '.$headCFName.';
                                                    src: url('.JURI::root().$genaral["heading"]["headings-custom-font-file"].');
                                                    font-weight: normal;
                                                }';
                    }

                    // Content Font
                    if (isset($genaral['content']['content-google-font-family']) && is_array($genaral['content']['content-google-font-family']) && $genaral['heading']['headings-font-type'] != 'standard' && $genaral['heading']['headings-font-type'] != 'google') {

                        $contentGoogleFont = $genaral['content']['content-google-font-family'];

                        foreach ($contentGoogleFont as $k => $v) {
                            $genaral['content']['content-google-font-'.$k] = $v;
                        }

                    }

                    // Content Font Custom
                    if (isset($genaral['content']['content-font-type']) && $genaral['content']['content-font-type'] == 'custom' && isset($genaral['content']['content-custom-font-file'])) {

                        $contentCustomFont = basename($genaral['content']['content-custom-font-file']);
                        $contentCFNameFile = explode('.',$contentCustomFont);
                        $contentCFName     = $contentCFNameFile[0];

                        if(isset($contentCFName) && $contentCFName != '') {
                            $genaral['content']['content-custom-font-family'] = $contentCFName;
                        }

                        $scss_genaral_content .= '@font-face {
                                                    font-family: '.$contentCFName.';
                                                    src: url('.JURI::root().$genaral["content"]["content-custom-font-file"].');
                                                    font-weight: normal;
                                                }';
                    }


                    if (isset($genaral['default-button'])) {

                        if (is_array($genaral['default-button']['btn-default-padding'])) {

                            $btnDefautPadding = $genaral['default-button']['btn-default-padding'];

                            foreach ($btnDefautPadding as $k => $v) {

                                $genaral['default-button']['btn-default-padding-'.$k] = $v;

                            }
                        }

                        if (is_array($genaral['default-button']['btn-default-box-shadow'])) {

                            $btnDefautBSD = $genaral['default-button']['btn-default-box-shadow'];

                            foreach ($btnDefautBSD as $k => $v) {

                                $genaral['default-button']['btn-default-box-shadow-'.$k] = $v;

                            }
                        }

                        if (is_array($genaral['default-button']['btn-default-text-shadow'])) {

                            $btnDefautBSD = $genaral['default-button']['btn-default-text-shadow'];

                            foreach ($btnDefautBSD as $k => $v) {

                                $genaral['default-button']['btn-default-text-'.$k] = $v;

                            }
                        }

                        if (is_array($genaral['default-button']['btn-default-border-all'])) {

                            $btnDefautBorder = $genaral['default-button']['btn-default-border-all'];

                            foreach ($btnDefautBorder as $k => $v) {

                                $genaral['default-button']['default-button-border-'.$k] = $v;

                            }
                        }

                        if (is_array($genaral['default-button']['btn-default-radius'])) {

                            $btnRadius = $genaral['default-button']['btn-default-radius'];

                            foreach ($btnRadius as $k => $v) {

                                $genaral['default-button']['button-radius-'.$k] = $v;

                            }
                        }
                    }

                    if (isset($genaral['primary-button'])) {

                        if (is_array($genaral['primary-button']['btn-primary-border-all'])) {

                            $btnDefautBorder = $genaral['primary-button']['btn-primary-border-all'];

                            foreach ($btnDefautBorder as $k => $v) {

                                $genaral['primary-button']['primary-button-border-'.$k] = $v;

                            }
                        }

                        if (is_array($genaral['primary-button']['btn-primary-box-shadow'])) {

                            $btnDefautBSD = $genaral['primary-button']['btn-primary-box-shadow'];

                            foreach ($btnDefautBSD as $k => $v) {

                                $genaral['primary-button']['btn-primary-box-shadow-'.$k] = $v;

                            }
                        }

                        if (is_array($genaral['primary-button']['btn-primary-text-shadow'])) {

                            $btnDefautBSD = $genaral['primary-button']['btn-primary-text-shadow'];

                            foreach ($btnDefautBSD as $k => $v) {

                                $genaral['primary-button']['btn-primary-text-'.$k] = $v;

                            }
                        }

                    }

                    // style boxshadow
                    if (isset($genaral['page']['inner-box-shadow'])) {

                        $innerBSD = $genaral['page']['inner-box-shadow'];
                        if ( is_array($innerBSD) ) {
                            foreach ($innerBSD as $k => $v) {

                                $genaral['page']['inner-bsd-'.$k] = $v;

                            }
                        }
                    }

                    $this->compileScss($genaral, 'general', $templateName, $scss_genaral_content.$cssInnerBorder, $styleID);

                    //Compile Color
                    if (isset($appearanceData['general']['color'])) {
                        $color = $this->_prevarUse($appearanceData['general']['color']);
                        $this->compileColor($color,'color',$templateName,$styleID);
                    }
                }

                // Compile Sections Style
                if (isset($appearanceData['sections'])) {
                    $sections = $appearanceData['sections'];

                    $scss_content = '';

                    // Section
                    foreach ($sections as $key => $section) {

                        $scss_content .= "#sunfw_" . $key . "{";

                        // Container
                        if (isset($section['container'])) {
                            $container = $this->_prevarUse($section['container']);

                            if (isset($container['background-image']) && $container['background-image'] != 'false')
                            {
                                preg_match($urlPattern, $container['background-image'], $m);
                                if (count($m))
                                {
                                    $sectionPathRoot = '';
                                }else {
                                    $sectionPathRoot = '../../../../';
                                }
                                $container['background-image'] = "'" . $sectionPathRoot . $container['background-image'] . "'";
                            }
                            if (isset($container['background-image-settings'])) {
                                $container['background-image-settings']  = $this->bgImageSetting($container['background-image-settings']);
                            }
                            if (isset($container['border'])) {
                                $container['border'] = $this->border($container['border']);
                            }

                            if ($container) $scss_content .= "@include section(" . implode(",", $this->flatten($container)) . ");";

                        }

                        // Heading
                        if (isset($section['heading'])) {
                            $heading = $this->_prevarUse($section['heading']);
                            if (isset($heading['headings-text-shadow']) ) {
                                $heading['headings-text-shadow'] = $this->textShadow($heading['headings-text-shadow']);
                            }
                            $heading = $this->resortArray($heading, 'headings-font-weight');
                            if ($heading) $scss_content .= "@include section-heading(" . implode(",", $this->flatten($heading)) . ");";

                        }

                        // Content
                        if (isset($section['content'])) {
                            $content = $this->_prevarUse($section['content']);
                            if ($content) $scss_content .= "@include content-section(" . implode(",", $content) . ");";
                        }

                        // Link
                        if (isset($section['link'])) {
                            $link = $this->_prevarUse($section['link']);
                            if ($link) $scss_content .= "@include section-link(" . implode(",", $link) . ");";
                        }

                        //  Default button
                        if (isset($section['default-button'])) {

                            $default_button = $this->_prevarUse($section['default-button']);

                            if (isset($default_button['btn-default-padding'])) {
                                $default_button['btn-default-padding']  = $this->padding($default_button['btn-default-padding']);
                            }
                            if (isset($default_button['btn-default-border-all'])) {
                                $default_button['btn-default-border-all'] = $this->border($default_button['btn-default-border-all']);
                            }
                            if (isset($default_button['btn-default-radius'])) {
                                $default_button['btn-default-radius'] = $this->borderRadius($default_button['btn-default-radius']);
                            }
                            if (isset($default_button['btn-default-box-shadow'])) {
                                $default_button['btn-default-box-shadow'] = $this->boxShadow($default_button['btn-default-box-shadow']);
                            }
                            if (isset($default_button['btn-default-text-shadow'])) {
                                $default_button['btn-default-text-shadow'] = $this->textShadow($default_button['btn-default-text-shadow']);
                            }
                            if ($default_button) {
                                $scss_content .= "@include btn-section-default(" . implode(",", $this->flatten($default_button)) . ");";
                            }
                        }

                        // Primary button
                         if (isset($section['primary-button'])) {

                            $primary_button = $this->_prevarUse($section['primary-button']);

                            if (isset($primary_button['btn-primary-border-all'])) {
                                $primary_button['btn-primary-border-all'] = $this->border($primary_button['btn-primary-border-all']);
                            }
                            if (isset($primary_button['btn-primary-box-shadow'])) {
                                $primary_button['btn-primary-box-shadow'] = $this->boxShadow($primary_button['btn-primary-box-shadow']);
                            }
                            if (isset($primary_button['btn-primary-text-shadow'])) {
                                $primary_button['btn-primary-text-shadow'] = $this->textShadow($primary_button['btn-primary-text-shadow']);
                            }
                            if ($primary_button) {
                                $scss_content .= "@include btn-section-primary(" . implode(",", $this->flatten($primary_button)) . ");";
                            }

                        }
                        $scss_content .= "}";


                    }

                    $this->compileScss(array(), 'sections', $templateName, $scss_content, $styleID);

                }


                // Compile Module Style
                if (isset($appearanceData['module'])) {
                    $modules = $appearanceData['module'];
                    $scss_content = '';

                    foreach ($modules as $key => $module_style) {

                        if (empty($module_style)) continue;

                        $scss_content .= "body#sunfw-master ." . $key . "{";

                        // Module container
                        if (isset($module_style['container'])) {

                            $module_container = $this->_prevarUse($module_style['container']);


                            if (isset($module_container['padding'])) {
                                $module_container['padding']  = $this->padding($module_container['padding']);
                            }

                            if (isset($module_container['background-image']) && $module_container['background-image'] != 'false')
                            {
                                preg_match($urlPattern, $module_container['background-image'], $m);

                                if (count($m))
                                {
                                    $modulePathRoot = '';
                                }else {
                                    $modulePathRoot = '../../../../';
                                }

                                $module_container['background-image'] = "'" . $modulePathRoot . $module_container['background-image'] . "'";
                            }


                            if (isset($module_container['background-image-settings'])) {
                                $module_container['background-image-settings']  = $this->bgImageSetting($module_container['background-image-settings']);
                            }

                            if (isset($module_container['border'])) {
                                $module_container['border'] = $this->border($module_container['border']);
                            }

                            if ($module_container) $scss_content .= "@include module-container(" . implode(",", $this->flatten($module_container)) . ");";

                        }

                        // Module title
                        if (isset($module_style['title'])) {
                            $module_title = $this->_prevarUse($module_style['title']);

                            $module_title = $this->resortArray($module_title, 'font-weight');
                            if ($module_title) $scss_content .= "@include module-title(" . implode(",", $module_title) . ");";
                        }

                        $scss_content .= ".module-body, .custom {";

                        // Module content
                        if (isset($module_style['content'])) {
                            $module_content = $this->_prevarUse($module_style['content']);
                            if ($module_content) $scss_content .= "@include module-content(" . implode(",", $module_content) . ");";
                        }

                        // Module link
                        if (isset($module_style['link'])) {
                            $module_link = $this->_prevarUse($module_style['link']);
                            if ($module_link) $scss_content .= "@include link(" . implode(",", $module_link) . ");";
                        }

                        $scss_content .= "}";

                        // Module default button
                        if (isset($module_style['default-button'])) {

                            $module_default_button = $this->_prevarUse($module_style['default-button']);

                            if (isset($module_default_button['btn-default-padding'])) {
                                $module_default_button['btn-default-padding']  = $this->padding($module_default_button['btn-default-padding']);
                            }
                            if (isset($module_default_button['btn-default-border-all'])) {
                                $module_default_button['btn-default-border-all'] = $this->border($module_default_button['btn-default-border-all']);
                            }
                            if (isset($module_default_button['btn-default-radius'])) {
                                $module_default_button['btn-default-radius'] = $this->borderRadius($module_default_button['btn-default-radius']);
                            }
                            if (isset($module_default_button['btn-default-box-shadow'])) {
                                $module_default_button['btn-default-box-shadow'] = $this->boxShadow($module_default_button['btn-default-box-shadow']);
                            }
                            if (isset($module_default_button['btn-default-text-shadow'])) {
                                $module_default_button['btn-default-text-shadow'] = $this->textShadow($module_default_button['btn-default-text-shadow']);
                            }
                            if ($module_default_button) {
                                $scss_content .= "@include btn-module-default(" . implode(",", $this->flatten($module_default_button)) . ");";
                            }
                        }

                        //Module primary button
                         if (isset($module_style['primary-button'])) {

                            $module_primary_button = $this->_prevarUse($module_style['primary-button']);

                            if (isset($module_primary_button['btn-primary-border-all'])) {
                                $module_primary_button['btn-primary-border-all'] = $this->border($module_primary_button['btn-primary-border-all']);
                            }
                            if (isset($module_primary_button['btn-primary-box-shadow'])) {
                                $module_primary_button['btn-primary-box-shadow'] = $this->boxShadow($module_primary_button['btn-primary-box-shadow']);
                            }
                            if (isset($module_primary_button['btn-primary-text-shadow'])) {
                                $module_primary_button['btn-primary-text-shadow'] = $this->textShadow($module_primary_button['btn-primary-text-shadow']);
                            }
                            if ($module_primary_button) {
                                $scss_content .= "@include btn-module-primary(" . implode(",", $this->flatten($module_primary_button)) . ");";
                            }

                        }

                        $scss_content .= "}";
                    }


                    $this->compileScss(array(), 'modules', $templateName, $scss_content, $styleID);

               }


                // Compile Menu Style
                if (isset($appearanceData['menu'])) {
                    //$menu = $this->_prevarUse($appearanceData['menu']);
                    $menus = $appearanceData['menu'];
                    $scss_content = '';

                    // Menu
                    foreach ($menus as $key => $menu) {

                        $scss_content .= "#menu_" . $key . "{";

                        // Root Menu
                        if (isset($menu['root'])) {
                            $root = $this->_prevarUse($menu['root']);
                            if ($root) $scss_content .= "@include menu-root(" . implode(",", $root) . ");";
                        }

                        // Dropdown Menu
                        if (isset($menu['dropdown'])) {
                            $dropdown = $this->_prevarUse($menu['dropdown']);

                            $dropdown = $this->resortArray($dropdown, 'width-dropdown');
                            if ($dropdown) $scss_content .= "@include menu-dropdown(" . implode(",", $dropdown) . ");";
                        }

                        $scss_content .= "}";

                    }
                    $this->compileScss(array(), 'menu', $templateName, $scss_content, $styleID);
                }

            } catch (Exception $e) {
                throw new Exception($e);
            }
        }elseif ($s == "layout") {

            // Define supported CSS properties.
            $css_properties = array(
                'padding-left',
                'padding-right',
                'padding-bottom',
                'padding-top',
                'margin-left',
                'margin-right',
                'margin-bottom',
                'margin-top',
            );

            $data_layout = json_decode($style->layout_builder_data, true);

            // Get scss content.

            $scss_content = file_get_contents( SUNFW_PATH . "/includes/scss/_layout.scss" );

            // Check if boxed layout is enabled?
            $boxed_layout = isset( $data_layout['settings']['enable_boxed_layout'] )
                ? $data_layout['settings']['enable_boxed_layout']
                : false;

            $width_boxed_layout = !empty( $data_layout['settings']['width_boxed_layout'] )
                ? $data_layout['settings']['width_boxed_layout']
                : 960;

            // Get width boxed layout
            if ( $boxed_layout && $width_boxed_layout > 768)
            {
                $scss_content .= '.sunfw-content { @include boxed-layout( '. $width_boxed_layout .'px); }';
            }

            // Get margin of page
            if (isset($data_layout['settings']['margin']))
            {
	            if (is_array($data_layout['settings']['margin'])) {

	                $page_margin = $data_layout['settings']['margin'];
	                $scss_content .= '.sunfw-content {';
	                foreach ($page_margin as $key => $value) {
	                    $scss_content .= 'margin-'. $key . ': ' . $value . 'px;';
	                }
	                $scss_content .= '}';
	            }
            }
            // Get all sections.
            $data_layout_sections = isset( $data_layout['sections'] ) ? $data_layout['sections'] : array();

            // Generate CSS rules for all sections.
            foreach ( $data_layout_sections as $key => $section )
            {
                if ( ! empty( $section ) && is_array( $section ) )
                {
                    $scss_content .= '#sunfw_' . $section['id'] . '{';

                    // Get section settings.
                    if (is_array($section['settings'])) {
                        $settings = $this->flatten($section['settings']);
                        foreach ( $settings as $key => $setting )
                        {
                            if ( in_array( $key, $css_properties ) && $setting != '' )
                            {
                                $scss_content .= $key . ': ' . $setting . 'px;';
                            }
                        }
                    }
                    $scss_content .= '}';

                }
            }

            //Get all rows
            $data_layout_columns = isset( $data_layout['rows'] ) ? $data_layout['rows'] : array();
            foreach ( $data_layout_columns as $key => $row )
            {
                if ( ! empty( $row ) && is_array( $row ) )
                {
                    $scss_content .= '#' . $row['id'] . '{';

                    // Get row settings.
                    if (is_array($row['settings'])) {
                        $settings = $this->flatten($row['settings']);
                        foreach ( $settings as $key => $setting )
                        {
                            if ( in_array( $key, $css_properties ) && $setting != '' )
                            {
                                $scss_content .= $key . ': ' . $setting . 'px;';
                            }
                        }
                    }

                    $scss_content .= '}';

                }
            }
            // Generate CSS rules for all rows.


            //Get all columns
            $data_layout_columns = isset( $data_layout['columns'] ) ? $data_layout['columns'] : array();

            // Generate CSS rules for all column.
            foreach ( $data_layout_columns as $key => $column )
            {
                if ( ! empty( $column ) && is_array( $column ) )
                {
                    $scss_content .= '#' . $column['id'] . '{';

                    // Get column settings.
                    if (is_array($column['settings'])) {
                        $settings = $this->flatten($column['settings']);
                        foreach ( $settings as $key => $setting )
                        {
                            if ( in_array( $key, $css_properties ) && $setting != '' )
                            {
                                $scss_content .= $key . ': ' . $setting . 'px;';
                            }
                        }
                    }

                    $scss_content .= '}';

                }
            }

            $this->compileScss(array(), 'layout', $templateName, $scss_content, $styleID);

        }
    }

    /**
     * @param array $vars
     * @param $file_name
     * @param $templateName
     * @param string $scss_content
     *
     * @return mixed
     *
     * @since version
     * @throws Exception
     */
    public function compileScss($vars = array(), $file_name, $templateName, $scss_content = '', $styleID)
    {

        try {

            //  handles variables
            $this->_scssVars = array();
            $this->_convertScssVar($vars);

            // Check empty var data
            foreach ($this->_scssVars as $key => $value) {
                if ($this->_scssVars[$key] == '') {
                    $this->_scssVars[$key] = 'false';
                }
            }
            $scss = new SunFwScsscompile();
            $content = file_get_contents( SUNFW_PATH . "/includes/scss/_" . $file_name . ".scss") . $scss_content;

            $scss->setPath( SUNFW_PATH . "/includes/scss/");
            $scss->setVars($this->_scssVars);
            $scss->setContent($content);
            $scss->scssCompile($templateName, "css/core/" . $file_name . '_' . md5($styleID));

            // Check overwrite sass General in template
            if ( $file_name == 'general' && file_exists( JPATH_SITE . "/templates/{$templateName}/scss/_general.scss" ) ) {
                $generalOverwrite = file_get_contents(JPATH_SITE . "/templates/{$templateName}/scss/_general.scss");
                $scss->setContent($generalOverwrite);
                $scss->scssCompile($templateName, "css/core/general_overwrite_" . md5($styleID));
            }

            return json_encode(array('type' => "success"));

        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function compileColor($vars = array(),$file_name, $templateName,$styleID){
        try{
            //  handles variables
            $this->_scssVars = array();
            $this->_convertScssVar($vars);

            // Check empty var data
            foreach ($this->_scssVars as $key => $value) {
                if ($this->_scssVars[$key] == '') {
                    $this->_scssVars[$key] = 'false';
                }
            }

            $scss = new SunFwScsscompile();
            $sunFwStyle = SunFwHelper::getOnlySunFwStyle($styleID);
            $systemData = json_decode($sunFwStyle->system_data,true);
            if (isset($systemData['niche-style']) && $systemData['niche-style'] != '') {
                $niche = $systemData['niche-style'];
                if ( file_exists( JPATH_SITE . "/templates/{$templateName}/niches/{$niche}/scss/" . $file_name . ".scss" ) ) {
                    $content = file_get_contents(JPATH_SITE . "/templates/{$templateName}/niches/{$niche}/scss/" . $file_name . ".scss");
                    $scss->setPath(JPATH_SITE . "/templates/{$templateName}/niches/{$niche}/scss/");
                    $scss->setVars($this->_scssVars);
                    $scss->setContent($content);
                    $scss->scssCompile($templateName,  "niches/{$niche}/css/" . $file_name . '_' . md5($styleID));
                }
            }else{
                if ( file_exists( JPATH_SITE . "/templates/{$templateName}/scss/" . $file_name . ".scss" ) ){
                    $content = file_get_contents(JPATH_SITE . "/templates/{$templateName}/scss/" . $file_name . ".scss");
                    $scss->setPath(JPATH_SITE . "/templates/{$templateName}/scss/");
                    $scss->setVars($this->_scssVars);
                    $scss->setContent($content);
                    $scss->scssCompile($templateName,"css/". $file_name . '_' . md5($styleID));
                }
            }

            return json_encode(array('type' => "success"));
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    /**
     * @param $data
     *
     *
     * @since version
     */
    private function _convertScssVar($data)
    {

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $this->_convertScssVar($value);
            } else {
                $this->_scssVars[$key] = trim($value);
            }
        }
    }


    /**
     * @param $data
     *
     * @return array|bool
     *
     * @since version
     */
    public function _prevarUse($data)
    {

        if (!isset($data)) return false;

        $new_data = array();

        foreach ($data as $key => $value) {
            if ($value == '') {
                $new_data[$key] = 'false';
            } else {
                $new_data[$key] = $value;
            }
        }

        return $new_data;
    }

    public function resortArray($source, $key)
    {
        if (isset($source[$key]))
        {
            $tmpWidthDropDown = $source[$key];
            unset($source[$key]);
        }
        else
        {
            $tmpWidthDropDown = '';
        }
        $tmpArray[$key] = $tmpWidthDropDown;

        array_push($source, $tmpArray[$key]);

        return $source;
    }

}
