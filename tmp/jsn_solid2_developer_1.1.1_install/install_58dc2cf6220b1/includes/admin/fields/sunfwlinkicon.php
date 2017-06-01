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
 * Custom field to output input field
 * as a value
 *
 * @package     SUN Framework
 * @subpackage  Form
 * @since       1.0.0
 */
class JFormFieldSunFwLinkIcon extends JFormField
{
	public $type = 'SunFwLinkIcon';

	public function getInput ()
	{
		$this->addAssets();

		$doc 						= JFactory::getDocument();
		$fontAwesomes 				= $this->getFontAwesomeList();
		$allFontAwesomes			= array();
		$tmpFontAwesomeCategories 	= array();
		$fontAwesomeCategories 		= array();
		$cbFontAwesomeCategories   	= array();
		if (count($fontAwesomes))
		{
			$tmpFontAwesomeCategories [] 	= 'all-icons';
			$tmpFontAwesomeCategories 		= array_merge($tmpFontAwesomeCategories, array_keys($fontAwesomes));

			foreach ($tmpFontAwesomeCategories as $tmpFontAwesomeCategory)
			{
				$fontAwesomeCategories [$tmpFontAwesomeCategory] = ucfirst(str_replace('-', ' ', $tmpFontAwesomeCategory));
				$cbFontAwesomeCategories [] = array('text' => ucfirst(str_replace('-', ' ', $tmpFontAwesomeCategory)), 'value' => $tmpFontAwesomeCategory);
			}

			foreach ($fontAwesomes as $fontAwesome)
			{
				$allFontAwesomes  = array_merge($allFontAwesomes ,$fontAwesome);
			}
		}

		$fontAwesomeCategoriesGenericList = JHTML::_('select.genericList', $cbFontAwesomeCategories, 'sunfw_font_category', 'class="inputbox"', 'value', 'text', 'all-icons');
		$script 	= "var fontAwesomes='" . json_encode($fontAwesomes) . "';" . "\n";
		$script 	.= "var fontAwesomeCategories='" . json_encode($fontAwesomeCategories) . "';" . "\n";
		$script 	.= "var allFontAwesomes='" . json_encode($allFontAwesomes) . "';" . "\n";

		$script .= '(function($) {
			$(document).ready(function() {
				new $.SunFwIconSelector({icons: fontAwesomes, categories: fontAwesomeCategories, allIcons: allFontAwesomes});
			});
		})(jQuery);';

		$doc->addScriptDeclaration($script);
		$html = '<div class="input-prepend input-append">';
		$html .= '<div class="add-on">';
		$html .= '<span><i id="sunfw-preview-icon" class="' . (htmlspecialchars($this->value, ENT_COMPAT, 'UTF-8') != '' ? htmlspecialchars($this->value, ENT_COMPAT, 'UTF-8') : '') .'"></i></span>';
		$html .= '</div>';
		$html .= '<input type="text" class="input-medium" name="' . $this->name . '" id="' . $this->id . '"' . ' value="'
				. htmlspecialchars($this->value, ENT_COMPAT, 'UTF-8') . '" />';

		$html .= '<input type="hidden" value="" id="sunfw-selected-icon"/>';
		$html .= '<a href="#sunFwModalIcon" data-toggle="modal" class="btn btn-default">...</a>';
		$html .= '</div>';

		$html .= '<div id="sunFwModalIcon" class="modal hide" tabindex="-1" role="dialog" aria-labelledby="mysunFwModalIconLabel" aria-hidden="true">
		  <div class="modal-header">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		    <h3 id="mysunFwModalIconLabel">' . JText::_('SUNFW_ICON_SELECTOR') . '</h3>
		  </div>
		  <div class="modal-body">
		    <div class="pull-left">
				' . $fontAwesomeCategoriesGenericList . '
			</div>
			<div class="pull-right">
				<input type="text" placeholder="Search..." value="" id="sunfw-quicksearch-icon"/>
			</div>
			<div id="sunfw-show-icon-container" class="sunfw-show-icon-container">

			</div>
		  </div>
		  <div class="modal-footer">
			<button class="btn btn-primary" type="button" id="select-icon-btn">' . JText::_('SUNFW_OK'). '</button>
		    <button class="btn" data-dismiss="modal" aria-hidden="true">' . JText::_('SUNFW_CANCEL'). '</button>
		  </div>
		</div>';


		return $html;
	}

	protected function getFontAwesomeList()
	{
		$path = JPATH_ROOT . '/plugins/system/sunfw/assets/3rd-party/font-awesome/font-list.json';

		if (file_exists($path))
		{
			$content = file_get_contents($path);
			$content = json_decode($content, true);
			return $content;
		}

		return array();
	}

	protected function addAssets()
	{
		$plgPath 	= JURI::root(true) . '/plugins/system/sunfw';
		$doc 		= JFactory::getDocument();

		$doc->addStyleSheet($plgPath . '/assets/3rd-party/font-awesome/css/font-awesome.min.css');
		$doc->addStyleSheet($plgPath .  '/assets/joomlashine/admin/css/field.css');
		$doc->addScript($plgPath .  '/assets/joomlashine/admin/js/iconselector.js');
	}
}
