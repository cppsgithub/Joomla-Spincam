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
class JFormFieldSunFwPadding extends SunFwFormField
{
	public $type = 'SunFwPadding';
	protected $inputClass = array('');
	protected $inputAttrs = '';


	public function getInput ()
	{

		if (isset($this->element['readonly']) && $this->element['readonly'] == 'true') {
			$this->inputAttrs .= ' readonly="readonly"';
		}

		if (isset($this->element['disabled']) && $this->element['disabled'] == 'true') {
			$this->inputClass[] = 'disabled';
			$this->inputAttrs .= ' disabled="disabled"';
		}

		return $this->renderLayout();
	}
}
