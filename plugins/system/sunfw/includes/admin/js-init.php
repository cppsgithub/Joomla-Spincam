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

// Get root URL.
$root = JUri::root( true );

// Define base assets URL.
$base = "{$root}/plugins/system/sunfw/assets";

// Define base Ajax URL.
$ajaxBase = "{$root}/administrator/index.php?option=com_ajax&format=json&plugin=sunfw&template_name={$this->template}"
	. '&style_id=' . $this->app->input->getInt('id')
	. '&' . JSession::getFormToken() . '=1';

// Define base widget URL.
$widgetBase = "{$root}/administrator/index.php?author=joomlashine&rformat=raw&template_name={$this->template}"
	. '&style_id=' . $this->app->input->getInt('id')
	. '&' . JSession::getFormToken() . '=1';
?>
<script type="text/javascript">
	// Declare neccessary information for client-side apps.
	window.SunFw = <?php echo json_encode( array(
		'hasData' => ! empty($sunFwStyle),
		'urls' => array(
			'root' => $root,
			'plugin' => "{$root}/plugins/system/sunfw",
			'ajaxBase' => $ajaxBase,
			'widgetBase' => $widgetBase,
			'getComponentAlerts' => '&context=admin&action=getComponentAlerts',
			'getComponentHeader' => '&context=admin&action=getComponentHeader',
			'getComponentBody' => '&context=admin&action=getComponentBody',
			'getComponentFooter' => '&context=admin&action=getComponentFooter',
			'getComponentUpdate' => '&context=admin&action=getComponentUpdate',
			'getPaneLayout' => '&context=layout&action=get',
			'getPaneStyles' => '&context=styles&action=get',
			'getPaneMegaMenu' => '&context=navigation&action=get',
			'getPaneCookieLaw' => '&context=cookielaw&action=get',
			'getPaneSampleData' => '&context=sampledata&action=get',
			'getPaneSystem' => '&context=advanced&action=get',
			'getPaneAssignment' => '&context=assignment&action=get',
			'getPaneMaintenance' => '&context=maintenance&action=get',
			'getPaneTokenKey' => '&context=tokenkey&action=get',
			'getPaneAbout' => '&context=about&action=get',
			'babel' => 'https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.24/browser.min.js'
		),
		'text' => array(
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
			'failed-to-install-some-extensions' => JText::_('SUNFW_FAILED_TO_INSTALL_SOME_EXTENSIONS'),
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

			'sample-data-unavailable-due-to-product-outdated' => JText::_('SUNFW_SAMPLE_DATA_UNAVAILABLE_DUE_TO_PRODUCT_OUTDATED'),
			'update-product' => JText::_('SUNFW_UPDATE_PRODUCT'),

			'powered-by' => JText::_('SUNFW_POWERED_BY'),
			'update-to' => JText::_('SUNFW_UPDATE_TO'),

			'missing-token' => JText::_('SUNFW_MISSING_TOKEN'),
			'set-token-key' => JText::_('SUNFW_SET_TOKEN_KEY'),

			'system' => JText::_('SUNFW_SYSTEM'),
			'save-system' => JText::_('SUNFW_SAVE_SYSTEM'),

			'fav-icon' => JText::_('SUNFW_ADVANCED_FAVICON'),
			'fav-icon-hint' => JText::_('SUNFW_ADVANCED_FAVICON_DESC'),

			'assets-compression' => JText::_('SUNFW_ADVANCED_ASSETS_COMPRESSION'),
			'compression-target' => JText::_('SUNFW_ADVANCED_COMPRESSION_TARGET'),
			'compression-target-hint' => JText::_('SUNFW_ADVANCED_COMPRESSION_TARGET_DESC'),
			'compress-css' => JText::_('SUNFW_ADVANCED_COMPRESS_CSS'),
			'compress-js' => JText::_('SUNFW_ADVANCED_COMPRESS_JS'),
			'max-compression-size' => JText::_('SUNFW_ADVANCED_COMPRESSION_MAX_SIZE'),
			'max-compression-size-hint' => JText::_('SUNFW_ADVANCED_COMPRESSION_MAX_SIZE_DESC'),
			'cache-directory' => JText::_('SUNFW_ADVANCED_CACHE_DIRECTORY'),
			'cache-directory-hint' => JText::_('SUNFW_ADVANCED_CACHE_DIRECTORY_DESC'),
			'verify' => JText::_('SUNFW_VERIFY'),
			'exclude-from-compression' => JText::_('SUNFW_ADVANCED_EXLUCDE_FROM_COMPRESSION'),
			'exclude-from-compression-hint' => JText::_('SUNFW_ADVANCED_EXLUCDE_FROM_COMPRESSION_DESC'),

			'custom-code' => JText::_('SUNFW_ADVANCED_CUSTOM_CODE'),
			'at-end-of-head-tag' => JText::_('SUNFW_ADVANCED_CUSTOM_BEFORE_ENDING_HEAD_TAG'),
			'at-end-of-head-tag-hint' => JText::_('SUNFW_ADVANCED_CUSTOM_BEFORE_ENDING_HEAD_TAG_DESC'),
			'at-end-of-body-tag' => JText::_('SUNFW_ADVANCED_CUSTOM_BEFORE_ENDING_BODY_TAG'),
			'at-end-of-body-tag-hint' => JText::_('SUNFW_ADVANCED_CUSTOM_BEFORE_ENDING_BODY_TAG_DESC'),

			'custom-files' => JText::_('SUNFW_ADVANCED_CUSTOM_FILES'),
			'custom-css-files' => JText::_('SUNFW_ADVANCED_CUSTOM_FIELS_CSS'),
			'custom-css-files-hint' => JText::_('SUNFW_ADVANCED_CUSTOM_FIELS_CSS_DESC'),
			'custom-js-files' => JText::_('SUNFW_ADVANCED_CUSTOM_FIELS_JS'),
			'custom-js-files-hint' => JText::_('SUNFW_ADVANCED_CUSTOM_FIELS_JS_DESC'),

			'assignment' => JText::_('SUNFW_MENU_ASSIGNMENT'),
			'save-assignment' => JText::_('SUNFW_SAVE_ASSIGNMENT'),

			'framework' => JText::_('SUNFW_FRAMEWORK'),
			'template' => JText::_('SUNFW_TEMPLATE'),
			'version' => JText::_('SUNFW_VERSION'),
			'update-available' => JText::_('SUNFW_FRAMEWORK_UPDATE_AVAILABEL'),
			'latest-version' => JText::_('SUNFW_FRAMEWORK_LATEST_VERSION'),
			'release-date' => JText::_('SUNFW_TEMPLATE_RELEASED_DATE'),
			'copyright-by' => JText::_('SUNFW_COPYRIGHT'),

			'settings-not-available' => JText::_('SUNFW_SETTINGS_NOT_AVAILABLE'),

			'enable-responsive-hint' => JText::_('SUNFW_ENABLE_RESPONSIVE_HIT'),
			'show-desktop-switcher-hint' => JText::_('SUNFW_SHOW_DESKTOP_SWITCHER_HINT'),
			'enable-boxed-layout-hint' => JText::_('SUNFW_ENABLE_BOXED_LAYOUT_HINT'),
			'margin-hint' => JText::_('SUNFW_MARGIN_HINT'),
			'show-go-to-top-hint' => JText::_('SUNFW_SHOW_GO_TO_TOP_HINT'),
			'go-to-top-icon-hint' => JText::_('SUNFW_GO_TO_TOP_ICON_HINT'),
			'go-to-top-text-hint' => JText::_('SUNFW_GO_TO_TOP_TEXT_HINT'),
			'go-to-top-text-color-hint' => JText::_('SUNFW_GO_TO_TOP_TEXT_COLOR_HINT'),
			'go-to-top-text-background-hint' => JText::_('SUNFW_GO_TO_TOP_TEXT_BACKGROUND_HINT'),
			'go-to-top-position-hint' => JText::_('SUNFW_GO_TO_TOP_POSITION_HINT'),
			'layout-section-name-hint' => JText::_('SUNFW_LAYOUT_SECTION_NAME_HINT'),
			'layout-section-enable-full-width-hint' => JText::_('SUNFW_LAYOUT_SECTION_ENABLE_FULL_WIDTH_HINT'),
			'layout-section-enable-sticky-hint' => JText::_('SUNFW_LAYOUT_SECTION_ENABLE_STICKY_HINT'),
			'layout-section-margin-hint' => JText::_('SUNFW_LAYOUT_SECTION_MARGIN_HINT'),
			'layout-section-padding-hint' => JText::_('SUNFW_LAYOUT_SECTION_PADDING_HINT'),
			'layout-section-custom-classes-hint' => JText::_('SUNFW_LAYOUT_SECTION_CUSTOM_CLASSES_HINT'),
			'layout-row-margin-hint' => JText::_('SUNFW_LAYOUT_ROW_MARGIN_HINT'),
			'layout-row-padding-hint' => JText::_('SUNFW_LAYOUT_ROW_PADDING_HINT'),
			'layout-row-custom-classes-hint' => JText::_('SUNFW_LAYOUT_ROW_CUSTOM_CLASSES_HINT'),
			'layout-column-margin-hint' => JText::_('SUNFW_LAYOUT_COLUMN_MARGIN_HINT'),
			'layout-column-padding-hint' => JText::_('SUNFW_LAYOUT_COLUMN_PADDING_HINT'),
			'layout-column-display-in-layouts-hint' => JText::_('SUNFW_LAYOUT_COLUMN_DISPLAY_IN_LAYOUTS_HINT'),
			'layout-column-custom-classes-hint' => JText::_('SUNFW_LAYOUT_COLUMN_CUSTOM_CLASSES_HINT'),

			'layout-logo-name-hint' => JText::_('SUNFW_LAYOUT_LOGO_NAME_HINT'),
			'layout-logo-hint' => JText::_('SUNFW_LAYOUT_LOGO_HINT'),
			'layout-mobile-logo-hint' => JText::_('SUNFW_LAYOUT_MOBILE_LOGO_HINT'),
			'layout-logo-alt-text-hint' => JText::_('SUNFW_LAYOUT_LOGO_ALT_TEXT_HINT'),
			'layout-logo-link-hint' => JText::_('SUNFW_LAYOUT_LOGO_LINK_HINT'),
			'layout-logo-display-in-layout-hint' => JText::_('SUNFW_LAYOUT_LOGO_DISPLAY_IN_LAYOUT_HINT'),
			'layout-logo-custom-classes-hint' => JText::_('SUNFW_LAYOUT_LOGO_CUSTOM_CLASSES_HINT'),

			'layout-menu-name-hint' => JText::_('SUNFW_LAYOUT_MENU_NAME_HINT'),
			'layout-menu-hint' => JText::_('SUNFW_LAYOUT_MENU_HINT'),
			'layout-menu-base-item-hint' => JText::_('SUNFW_LAYOUT_MENU_BASE_ITEM_HINT'),
			'layout-menu-start-level-item-hint' => JText::_('SUNFW_LAYOUT_MENU_START_LEVEL_ITEM_HINT'),
			'layout-menu-end-level-hint' => JText::_('SUNFW_LAYOUT_MENU_END_LEVEL_HINT'),
			'layout-menu-show-icon-hint' => JText::_('SUNFW_LAYOUT_MENU_SHOW_ICON_HINT'),
			'layout-menu-show-description-hint' => JText::_('SUNFW_LAYOUT_MENU_SHOW_DESCRIPTION_HINT'),
			'layout-menu-show-submenu-hint' => JText::_('SUNFW_LAYOUT_MENU_SHOW_SUBMENU_HINT'),
			'layout-menu-sub-effect-hint' => JText::_('SUNFW_LAYOUT_MENU_SUB_EFFECT_HINT'),
			'layout-menu-mobile-target-hint' => JText::_('SUNFW_LAYOUT_MENU_MOBILE_TARGET_HINT'),
			'layout-menu-display-in-layout-hint' => JText::_('SUNFW_LAYOUT_MENU_DISPLAY_IN_LAYOUT_HINT'),
			'layout-menu-custom-classes-hint' => JText::_('SUNFW_LAYOUT_MENU_CUSTOM_CLASSES_HINT'),

			'layout-module-position-name-hint' => JText::_('SUNFW_LAYOUT_MODULE_POSITION_NAME_HINT'),
			'layout-module-position-position-hint' => JText::_('SUNFW_LAYOUT_MODULE_POSITION_POSITION_HINT'),
			'layout-module-position-display-in-layout-hint' => JText::_('SUNFW_LAYOUT_MODULE_POSITION_DISPLAY_IN_LAYOUT_HINT'),
			'layout-module-position-custom-classes-hint' => JText::_('SUNFW_LAYOUT_MODULE_POSITION_CUSTOM_CLASSES_HINT'),

			'layout-joomla-module-name-hint' => JText::_('SUNFW_LAYOUT_JOOMLA_MODULE_NAME_HINT'),
			'layout-joomla-module-picker-hint' => JText::_('SUNFW_LAYOUT_JOOMLA_MODULE_PICKER_HINT'),
			'layout-joomla-module-display-in-layout-hint' => JText::_('SUNFW_LAYOUT_JOOMLA_MODULE_DISPLAY_IN_LAYOUT_HINT'),
			'layout-joomla-module-custom-classes-hint' => JText::_('SUNFW_LAYOUT_JOOMLA_MODULE_CUSTOM_CLASSES_HINT'),

			'layout-page-content-show-on-front-page' => JText::_('SUNFW_LAYOUT_PAGE_CONTENT_SHOW_ON_FRONT_PAGE'),

			'layout-social-icon-name-hint' => JText::_('SUNFW_LAYOUT_SOCIAL_ICON_NAME_HINT'),
			'layout-social-icon-icons-hint' => JText::_('SUNFW_LAYOUT_SOCIAL_ICON_ICONS_HINT'),
			'layout-social-icon-color-hint' => JText::_('SUNFW_LAYOUT_SOCIAL_ICON_COLOR_HINT'),
			'layout-social-icon-size-hint' => JText::_('SUNFW_LAYOUT_SOCIAL_ICON_SIZE_HINT'),
			'layout-social-icon-link-target-hint' => JText::_('SUNFW_LAYOUT_SOCIAL_ICON_LINK_TARGET_HINT'),
			'layout-social-icon-display-in-layout-hint' => JText::_('SUNFW_LAYOUT_SOCIAL_ICON_DISPLAY_IN_LAYOUT_HINT'),
			'layout-social-icon-custom-classes-hint' => JText::_('SUNFW_LAYOUT_SOCIAL_ICON_CUSTOM_CLASSES_HINT'),

			'layout-custom-html-name-hint' => JText::_('SUNFW_LAYOUT_CUSTOM_HTML_NAME_HINT'),
			'layout-custom-html-content-hint' => JText::_('SUNFW_LAYOUT_CUSTOM_HTML_CONTENT_HINT'),
			'layout-custom-html-display-in-layout-hint' => JText::_('SUNFW_LAYOUT_CUSTOM_HTML_DISPLAY_IN_LAYOUT_HINT'),
			'layout-custom-html-custom-classes-hint' => JText::_('SUNFW_LAYOUT_CUSTOM_HTML_CUSTOM_CLASSES_HINT'),

			'layout-flexible-space-name-hint' => JText::_('SUNFW_LAYOUT_FLEXIBLE_SPACE_NAME_HINT'),
			'layout-flexible-space-display-in-layout-hint' => JText::_('SUNFW_LAYOUT_FLEXIBLE_SPACE_DISPLAY_IN_LAYOUT_HINT'),
			'layout-flexible-space-custom-classes-hint' => JText::_('SUNFW_LAYOUT_FLEXIBLE_SPACE_CUSTOM_CLASSES_HINT'),


			'layout-outer-page-background-color-hint' => JText::_('SUNFW_LAYOUT_OUTER_PAGE_BACKGROUND_COLOR_HINT'),
			'layout-outer-page-background-image-hint' => JText::_('SUNFW_LAYOUT_OUTER_PAGE_BACKGROUND_IMAGE_HINT'),
			'layout-outer-page-background-image-setting-hint' => JText::_('SUNFW_LAYOUT_OUTER_PAGE_BACKGROUND_IMAGE_SETTING_HINT'),
			'layout-inner-page-background-color-hint' => JText::_('SUNFW_LAYOUT_INNER_PAGE_BACKGROUND_COLOR_HINT'),
			'layout-inner-page-border-settings-hint' => JText::_('SUNFW_LAYOUT_INNER_PAGE_BORDER_SETTINGS_HINT'),
			'layout-inner-page-box-shadow-settings-hint' => JText::_('SUNFW_LAYOUT_INNER_PAGE_BOX_SHADOW_SETTINGS_HINT'),

			'style-main-color-hint' => JText::_('SUNFW_STYLE_MAIN_COLOR_HINT'),
			'style-sub-color-hint' => JText::_('SUNFW_STYLE_SUB_COLOR_HINT'),

			'style-heading-color-hint' => JText::_('SUNFW_STYLE_HEADING_COLOR_HINT'),
			'style-heading-font-type-hint' => JText::_('SUNFW_STYLE_HEADING_FONT_TYPE_HINT'),
			'style-heading-font-family-hint' => JText::_('SUNFW_STYLE_HEADING_FONT_FAMILY_HINT'),
			'style-heading-font-file-hint' => JText::_('SUNFW_STYLE_HEADING_FONT_FILE_HINT'),
			'style-heading-font-weight-hint' => JText::_('SUNFW_STYLE_HEADING_FONT_WEIGHT_HINT'),
			'style-heading-font-style-hint' => JText::_('SUNFW_STYLE_HEADING_FONT_STYLE_HINT'),
			'style-heading-text-transform-hint' => JText::_('SUNFW_STYLE_HEADING_TEXT_TRANSFORM_HINT'),
			'style-heading-text-shadow-hint' => JText::_('SUNFW_STYLE_HEADING_TEXT_SHADOW_HINT'),
			'style-heading-base-size-hint' => JText::_('SUNFW_STYLE_HEADING_BASE_SIZE_HINT'),
			'style-heading-line-height-hint' => JText::_('SUNFW_STYLE_HEADING_LINE_HEIGHT_HINT'),
			'style-heading-letter-spacing-hint' => JText::_('SUNFW_STYLE_HEADING_LETTER_SPACING_HINT'),
			'style-heading-font-family-google-hint' => JText::_('SUNFW_STYLE_HEADING_FONT_FAMILY_GOOGLE_HINT'),

			'style-content-color-hint' => JText::_('SUNFW_STYLE_CONTENT_COLOR_HINT'),
			'style-content-font-type-hint' => JText::_('SUNFW_STYLE_CONTENT_FONT_TYPE_HINT'),
			'style-content-font-family-hint' => JText::_('SUNFW_STYLE_CONTENT_FONT_FAMILY_HINT'),
			'style-content-google-font-family-hint' => JText::_('SUNFW_STYLE_CONTENT_GOOGLE_FONT_FAMILY_HINT'),
			'style-content-font-file' => JText::_('SUNFW_STYLE_CONTENT_FONT_FILE'),
			'style-content-font-weight-file' => JText::_('SUNFW_STYLE_CONTENT_FONT_WEIGHT_FILE'),
			'style-content-font-size-file' => JText::_('SUNFW_STYLE_CONTENT_FONT_SIZE_FILE'),
			'style-content-line-height-file' => JText::_('SUNFW_STYLE_CONTENT_LINE_HEIGHT_FILE'),

			'style-default-button-padding-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_PADDING_HINT'),
			'style-default-button-background-color-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_BACKGROUND_COLOR_HINT'),
			'style-default-button-border-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_BORDER_HINT'),
			'style-default-button-border-radius-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_BORDER_RADIUS_HINT'),
			'style-default-button-box-shadow-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_BOX_SHADOW_HINT'),
			'style-default-button-text-color-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_TEXT_COLOR_HINT'),
			'style-default-button-font-weight-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_FONT_WEIGHT_HINT'),
			'style-default-button-font-style-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_FONT_STYLE_HINT'),
			'style-default-button-text-transform-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_TEXT_TRANSFORM_HINT'),
			'style-default-button-text-shadow-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_TEXT_SHADOW_HINT'),
			'style-default-button-font-size-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_FONT_SIZE_HINT'),
			'style-default-button-letter-spacing-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_LETTER_SPACING_HINT'),
			'style-default-button-background-color-hover-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_BACKGROUND_COLOR_HOVER_HINT'),
			'style-default-button-border-color-hover-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_BORDER_COLOR_HOVER_HINT'),
			'style-default-button-text-color-hover-hint' => JText::_('SUNFW_STYLE_DEFAULT_BUTTON_TEXT_COLOR_HOVER_HINT'),

			'style-primary-button-background-color-hint' => JText::_('SUNFW_STYLE_PRIMARY_BUTTON_BACKGROUND_COLOR_HINT'),
			'style-primary-button-border-hint' => JText::_('SUNFW_STYLE_PRIMARY_BUTTON_BORDER_HINT'),
			'style-primary-button-box-shadow-hint' => JText::_('SUNFW_STYLE_PRIMARY_BUTTON_BOX_SHADOW_HINT'),
			'style-primary-button-text-color-hint' => JText::_('SUNFW_STYLE_PRIMARY_BUTTON_TEXT_COLOR_HINT'),
			'style-primary-button-text-shadow-hint' => JText::_('SUNFW_STYLE_PRIMARY_BUTTON_TEXT_SHADOW_HINT'),
			'style-primary-button-border-color-hover-hint' => JText::_('SUNFW_STYLE_PRIMARY_BUTTON_BORDER_COLOR_HOVER_HINT'),
			'style-primary-button-text-color-hover-hint' => JText::_('SUNFW_STYLE_PRIMARY_BUTTON_TEXT_COLOR_HOVER_HINT'),
			'style-primary-button-background-color-hover-hint' => JText::_('SUNFW_STYLE_PRIMARY_BUTTON_BACKGROUND_COLOR_HOVER_HINT'),

			'style-link-normal-color-hint' => JText::_('SUNFW_STYLE_LINK_NORMAL_COLOR_HINT'),
			'style-link-hover-color-hint' => JText::_('SUNFW_STYLE_LINK_HOVER_COLOR_HINT'),

			'style-section-background-color-hint' => JText::_('SUNFW_STYLE_SECTION_BACKGROUND_COLOR_HINT'),
			'style-section-background-image-hint' => JText::_('SUNFW_STYLE_SECTION_BACKGROUND_IMAGE_HINT'),
			'style-section-background-image-settings-hint' => JText::_('SUNFW_STYLE_SECTION_BACKGROUND_IMAGE_SETTINGS_HINT'),
			'style-section-border-hint' => JText::_('SUNFW_STYLE_SECTION_BORDER_HINT'),

			'style-section-heading-color-hint' => JText::_('SUNFW_STYLE_SECTION_HEADING_COLOR_HINT'),
			'style-section-heading-font-weight-hint' => JText::_('SUNFW_STYLE_SECTION_HEADING_FONT_WEIGHT_HINT'),
			'style-section-heading-text-transform-hint' => JText::_('SUNFW_STYLE_SECTION_HEADING_TEXT_TRANSFORM_HINT'),
			'style-section-heading-text-shadow-hint' => JText::_('SUNFW_STYLE_SECTION_HEADING_TEXT_SHADOW_HINT'),
			'style-section-heading-base-size-hint' => JText::_('SUNFW_STYLE_SECTION_HEADING_BASE_SIZE_HINT'),
			'style-section-heading-line-height-hint' => JText::_('SUNFW_STYLE_SECTION_HEADING_LINE_HEIGHT_HINT'),
			'style-section-heading-letter-spacing-hint' => JText::_('SUNFW_STYLE_SECTION_HEADING_LETTER_SPACING_HINT'),

			'style-use-custom-settings-hint' => JText::_('SUNFW_STYLE_USE_CUSTOM_SETTINGS_HINT'),
			'style-section-content-color-hint' => JText::_('SUNFW_STYLE_SECTION_CONTENT_COLOR_HINT'),
			'style-section-content-font-size-hint' => JText::_('SUNFW_STYLE_SECTION_CONTENT_FONT_SIZE_HINT'),
			'style-section-content-line-height-hint' => JText::_('SUNFW_STYLE_SECTION_CONTENT_LINE_HEIGHT_HINT'),

			'style-module-padding-hint' => JText::_('SUNFW_STYLE_MODULE_PADDING_HINT'),
			'style-module-background-color-hint' => JText::_('SUNFW_STYLE_MODULE_BACKGROUND_COLOR_HINT'),
			'style-module-background-image-hint' => JText::_('SUNFW_STYLE_MODULE_BACKGROUND_IMAGE_HINT'),
			'style-module-background-image-settings-hint' => JText::_('SUNFW_STYLE_MODULE_BACKGROUND_IMAGE_SETTINGS_HINT'),
			'style-module-border-hint' => JText::_('SUNFW_STYLE_MODULE_BORDER_HINT'),

			'style-module-title-background-color-hint' => JText::_('SUNFW_STYLE_MODULE_TITLE_BACKGROUND_COLOR_HINT'),
			'style-module-title-text-color-hint' => JText::_('SUNFW_STYLE_MODULE_TITLE_TEXT_COLOR_HINT'),
			'style-module-title-font-weight-hint' => JText::_('SUNFW_STYLE_MODULE_TITLE_FONT_WEIGHT_HINT'),
			'style-module-title-text-transform-hint' => JText::_('SUNFW_STYLE_MODULE_TITLE_TEXT_TRANSFORM_HINT'),
			'style-module-title-font-size-hint' => JText::_('SUNFW_STYLE_MODULE_TITLE_FONT_SIZE_HINT'),
			'style-module-title-icon-size-hint' => JText::_('SUNFW_STYLE_MODULE_TITLE_ICON_SIZE_HINT'),
			'style-module-title-icon-color-hint' => JText::_('SUNFW_STYLE_MODULE_TITLE_ICON_COLOR_HINT'),

			'style-module-content-color-hint' => JText::_('SUNFW_STYLE_MODULE_CONTENT_COLOR_HINT'),
			'style-module-content-font-size-hint' => JText::_('SUNFW_STYLE_MODULE_CONTENT_FONT_SIZE_HINT'),

			'style-menu-font-size-hint' => JText::_('SUNFW_STYLE_MENU_FONT_SIZE_HINT'),
			'style-menu-text-transform-hint' => JText::_('SUNFW_STYLE_MENU_TEXT_TRANSFORM_HINT'),
			'style-menu-background-color-hint' => JText::_('SUNFW_STYLE_MENU_BACKGROUND_COLOR_HINT'),
			'style-menu-link-color-hint' => JText::_('SUNFW_STYLE_MENU_LINK_COLOR_HINT'),
			'style-menu-background-color-hover-hint' => JText::_('SUNFW_STYLE_MENU_BACKGROUND_COLOR_HOVER_HINT'),
			'style-menu-link-color-hover-hint' => JText::_('SUNFW_STYLE_MENU_LINK_COLOR_HOVER_HINT'),

			'megamenu-fixed-width-hint' => JText::_('SUNFW_MEGAMENU_FIXED_WIDTH_HINT'),
			'megamenu-submenu-width-hint' => JText::_('SUNFW_MEGAMENU_SUBMENU_WIDTH_HINT'),
			'megamenu-submenu-align-hint' => JText::_('SUNFW_MEGAMENU_SUBMENU_ALIGN_HINT'),
			'megamenu-padding-hint' => JText::_('SUNFW_MEGAMENU_PADDING_HINT'),
			'megamenu-background-color-hint' => JText::_('SUNFW_MEGAMENU_BACKGROUND_COLOR_HINT'),
			'megamenu-background-image-hint' => JText::_('SUNFW_MEGAMENU_BACKGROUND_IMAGE_HINT'),
			'megamenu-background-image-settings-hint' => JText::_('SUNFW_MEGAMENU_BACKGROUND_IMAGE_SETTINGS_HINT'),
			'megamenu-border-hint' => JText::_('SUNFW_MEGAMENU_BORDER_HINT'),

			'megamenu-image-name-hint' => JText::_('SUNFW_MEGAMENU_IMAGE_NAME_HINT'),
			'megamenu-image-image-hint' => JText::_('SUNFW_MEGAMENU_IMAGE_IMAGE_HINT'),
			'megamenu-image-alt-text-hint' => JText::_('SUNFW_MEGAMENU_IMAGE_ALT_TEXT_HINT'),
			'megamenu-image-custom-classes-hint' => JText::_('SUNFW_MEGAMENU_IMAGE_CUSTOM_CLASSES_HINT'),

			'megamenu-submenu-name-hint' => JText::_('SUNFW_MEGAMENU_SUBMENU_NAME_HINT'),
			'megamenu-module-position-name-hint' => JText::_('SUNFW_MEGAMENU_MODULE_POSITION_NAME_HINT'),
			'megamenu-module-position-position-hint' => JText::_('SUNFW_MEGAMENU_MODULE_POSITION_POSITION_HINT'),
			'megamenu-module-position-custom-classes-hint' => JText::_('SUNFW_MEGAMENU_MODULE_POSITION_CUSTOM_CLASSES_HINT'),

			'megamenu-module-name-hint' => JText::_('SUNFW_MEGAMENU_MODULE_NAME_HINT'),
			'megamenu-module-module-hint' => JText::_('SUNFW_MEGAMENU_MODULE_MODULE_HINT'),
			'megamenu-module-custom-classes-hint' => JText::_('SUNFW_MEGAMENU_MODULE_CUSTOM_CLASSES_HINT'),

			'megamenu-custom-html-name-hint' => JText::_('SUNFW_MEGAMENU_CUSTOM_HTML_NAME_HINT'),
			'megamenu-custom-html-content-hint' => JText::_('SUNFW_MEGAMENU_CUSTOM_HTML_CONTENT_HINT'),
			'megamenu-custom-html-custom-classes-hint' => JText::_('SUNFW_MEGAMENU_CUSTOM_HTML_CUSTOM_CLASSES_HINT'),

			'megamenu-cookie-law-enable-cookie-consent-hint' => JText::_('SUNFW_MEGAMENU_COOKIE_LAW_ENABLE_COOKIE_CONSENT_HINT'),
			'megamenu-cookie-law-style-hint' => JText::_('SUNFW_MEGAMENU_COOKIE_LAW_STYLE_HINT'),
			'megamenu-cookie-law-banner-placement-hint' => JText::_('SUNFW_MEGAMENU_COOKIE_LAW_BANNER_PLACEMENT_HINT'),
			'megamenu-cookie-law-message-hint' => JText::_('SUNFW_MEGAMENU_COOKIE_LAW_MESSAGE_HINT'),
			'megamenu-cookie-law-accept-button-text-hint' => JText::_('SUNFW_MEGAMENU_COOKIE_LAW_ACCEPT_BUTTON_TEXT_HINT'),
			'megamenu-cookie-law-read-more-button-text-hint' => JText::_('SUNFW_MEGAMENU_COOKIE_LAW_READ_MORE_BUTTON_TEXT_HINT'),
			'megamenu-cookie-law-cookie-policy-link-hint",' => JText::_('SUNFW_MEGAMENU_COOKIE_LAW_COOKIE_POLICY_LINK_HINT'),
		),
	) ); ?>;

	// Handle 'onBeforeUnload' event.
	window.onbeforeunload = function() {
		var hasChange = document.querySelector('#template-admin a.toggle-pane.changed');

		if (hasChange) {
			return '<?php echo JText::_('SUNFW_CONFIRM_LEAVE_PAGE'); ?>'
		}
	}

	// Fix compatibility problem with MooTools loaded by the admin bar of JSN PowerAdmin.
	if (window.MooTools !== undefined) {
		Element.implement({
			hide: function() {
				return this;
			},
			show: function(v) {
				return this;
			},
			slide: function(v) {
				return this;
			}
		});
	}

	// Render Template Admin React app.
	(function renderTemplateAdmin() {
		if (window.SunFwTemplateAdmin) {
			ReactDOM.render( React.createElement(SunFwTemplateAdmin), document.getElementById('template-admin') );
		} else {
			setTimeout(renderTemplateAdmin, 100);
		}
	})();
</script>

<!-- Load Template Admin React app -->
<script type="text/javascript" src="<?php echo $base?>/joomlashine/admin/js/core.js"></script>
<script type="text/javascript" src="<?php echo $base?>/joomlashine/admin/js/pane.js"></script>
<script type="text/javascript" src="<?php echo $base?>/joomlashine/admin/js/render.js"></script>
