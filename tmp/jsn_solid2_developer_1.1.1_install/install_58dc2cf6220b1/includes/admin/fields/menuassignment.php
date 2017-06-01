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
// Load base class
require_once SUNFW_PATH . '/includes/admin/fields/field.php';
/**
 * Layout builder custom form field.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class JFormFieldMenuAssignment extends SunFwFormField
{
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
		//return 'Menu assignment go here...';
		return $this->renderLayout();
	}
}
