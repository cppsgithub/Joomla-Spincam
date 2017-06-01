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
 * This is helper class use to generate well-form format html
 *
 * @package     SUN Framework
 * @subpackage  Form
 * @since       1.0.0
 */
abstract class SunFwFieldHelper
{
	/**
	 * Return HTML markup of input element
	 *
	 * @param   string  $name     Name of the control
	 * @param   array   $data     Value of the control
	 * @param   string  $options  Options for input field
	 *
	 * @return  string
	 */
	public static function input ($name, $data, $options = array())
	{
		if (!is_array($options))
			$options = array();

		if (!isset($options['type']))
			$options['type'] = 'text';

		$attrs = array();
		foreach ($options as $_name => $_value)
			$attrs[] = sprintf('%s="%s"', $_name, htmlentities($_value));

		if (isset($options['disabled']) && $options['disabled'] == true) {
			$attrs['disabled'] = 'disabled';
			$attrs['class'] = 'disabled';
		}

		$attrs[] = 'name="' . $name . '"';
		$attrs[] = 'value="' . $data . '"';

		return sprintf('<input %s/>', implode(' ', $attrs));
	}
}
