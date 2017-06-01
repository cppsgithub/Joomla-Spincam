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

require_once SUNFW_PATH . '/includes/admin/fields/helper.php';

/**
 * Custom field to output about section for the framework
 *
 * @package     SUN Framework
 * @subpackage  Form
 * @since       1.0.0
 */
class JFormFieldSunFwFolder extends SunFwFormField
{
	public $type = 'SunFwFolder';

	/**
	 * Return HTML markup for the field
	 *
	 * @return  string
	 */
	public function getInput ()
	{
		// Prepare field attributes
		$this->disabled = (string) $this->element['disabled'] == 'true';

		$attrs = array(
			'id'	=> $this->id,
			'class'	=> (string) $this->element['class']
		);

		! $this->disabled OR $attrs['disabled'] = 'disabled';

		$label = JText::_(isset($this->element['verifyLabel']) ? $this->element['verifyLabel'] : 'SUNFW_VERIFY');

		$html[] = '<div class="input-group">';

		$html[] = SunFwFieldHelper::input(
			$this->name,
			$this->value,
			$attrs
		);

		if ($this->disabled)
		{
			$html[] = '	<div class="input-group-addon">' . $label . '</div>';
		}
		else
		{
			$html[] = '	<a href="javascript:void(0)" class="input-group-addon btn btn-verify-folder">' . $label . '</a>';
		}

		$html[] = '</div>';
		$html[] = '<div class="clear"></div>';
		$html[] = '<p class="pull-left label hide" style="margin-bottom:0"></p>';

		return implode("\n", $html);
	}
}
