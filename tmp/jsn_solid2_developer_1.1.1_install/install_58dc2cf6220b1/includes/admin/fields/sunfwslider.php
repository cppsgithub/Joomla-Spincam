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
class JFormFieldSunFwSlider extends SunFwFormField
{
	public $type = 'SunFwSlider';
	protected $inputClass = array('');
	protected $inputAttrs = '';
	protected $minRange = 0;
	protected $maxRange = 0;
	protected $textSuffix = '';
	protected $step = 1;

	public function getInput ()
	{

		if (isset($this->element['readonly']) && $this->element['readonly'] == 'true') {
			$this->inputAttrs .= ' readonly="readonly"';
		}

		if (isset($this->element['disabled']) && $this->element['disabled'] == 'true') {
			$this->inputClass[] = 'disabled';
			$this->inputAttrs .= ' disabled="disabled"';
		}

		if (isset($this->element['max-range']) && $this->element['max-range'] != '') {
			$this->maxRange = $this->element['max-range'];

		}

		if (isset($this->element['min-range']) && $this->element['min-range'] != '') {
			$this->minRange = $this->element['min-range'];

		}

		if (isset($this->element['suffix']) && !empty($this->element['suffix'])) {
			$this->textSuffix = (string) $this->element['suffix'];
		}
		if (isset($this->element['step']) && !empty($this->element['step'])) {
			$this->step = (float) $this->element['step'];
		}
		return $this->renderLayout();
	}
}
