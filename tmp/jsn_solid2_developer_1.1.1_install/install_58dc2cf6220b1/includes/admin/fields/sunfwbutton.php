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
class JFormFieldSunFwButton extends SunFwFormField
{
	public $type = 'SunFwButton';
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
		if ($this->element['htmlElement'] == 'link')
		{
			return '<a href="' . $this->element['href'] . '" id="' . $this->id . '" class="btn ' . implode(' ', $this->btnClass) . '" type="button">' .  JText::_($this->element['buttonLabel']) . '</a>';
		}
		return '<button id="' . $this->id . '" class="btn ' . implode(' ', $this->btnClass) . '" type="button">' .  JText::_($this->element['buttonLabel']) . '</button>';
	}
}
