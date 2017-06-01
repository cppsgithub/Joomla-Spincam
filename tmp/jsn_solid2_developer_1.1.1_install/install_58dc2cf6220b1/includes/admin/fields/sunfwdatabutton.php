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
 * Custom field to output button field
 * as a value
 *
 * @package     SUN Framework
 * @subpackage  Form
 * @since       1.0.0
 */
class JFormFieldSunFwDataButton extends SunFwFormField
{
	public $type = 'SunFwDataButton';
	protected $btnClass = array();
	protected $btnAttrs = '';

	public function getInput ()
	{
		if (!empty($this->element['class']))
		{
			$this->btnClass[] = $this->element['class'];
		}

		if (isset($this->element['disabled']) && $this->element['disabled'] == 'true') {
			$this->btnClass[] = 'disabled';
			$this->btnAttrs .= ' disabled="disabled"';
		}

		$html = '<a href="javascript: void(0);" id="sunfw_advanced_importTemplateSettings" class="margin-right-10 btn ' . implode(' ', $this->btnClass) . '">' .  JText::_('SUNFW_ADVANCED_IMPORT') . '</a>';
		$html .= '<a href="javascript: void(0);" id="sunfw_advanced_exportTemplateSettings" class="btn ' . implode(' ', $this->btnClass) . '">' .  JText::_('SUNFW_ADVANCED_EXPORT') . '</a>';
		return $html;
	}

	public function getlabel ()
	{
		return '';
	}
}
