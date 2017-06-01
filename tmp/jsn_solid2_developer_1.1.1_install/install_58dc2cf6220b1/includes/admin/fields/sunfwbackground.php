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
class JFormFieldSunFwBackground extends SunFwFormField
{
	public $type = 'SunFwBackground';

	public function getInput ()
	{
		$this->app 		= JFactory::getApplication();
		$this->input 	= $this->app->input;
		$this->params 	= $this->getConfigData();
		$this->data		= array();
		if (count($this->params))
		{
			foreach ($this->params  as $key => $items )
			{
				if (count($items))
				{
					foreach ($items as $subKey => $item)
					{
						$this->data [$subKey] = $item;
					}
				}
			}
		}

		return $this->renderLayout();
	}

	/**
	 * Get config data
	 *
	 * @return Array
	 */
	protected function getConfigData()
	{
		$result 			= array();
		$styleID 			= $this->app->input->getInt( 'id', 0 );
		$data 	 			= SunFwHelper::getSunFwStyle( $styleID );

		if (!count($data)) return $result;

		$data = json_decode($data->appearance_data, true);

		$data = $data['appearance'];

		if (!count($data)) return $result;

		if (isset($data['general']))
		{
			$general['general'] = $data['general'];

			foreach ($general as $key => $items)
			{
				if (is_array($items) && count($items))
				{
					foreach ($items as $subKey => $subItems)
					{
						foreach ($subItems as $subSubKey => $subSubItem)
						{
							$result['appearance.' . $key . '.params'][$key . '-' . $subKey . '-' . $subSubKey] = $subSubItem;
						}
					}
				}
				else
				{
					$result['appearance.' . $key . '.params'] = $items;
				}
			}
		}

		if (isset($data['sections']))
		{
			$section = $data['sections'];
			foreach ($section as $key => $items)
			{
				if (is_array($items) && count($items))
				{
					foreach ($items as $subKey => $subItems)
					{
						foreach ($subItems as $subSubKey => $subSubItem)
						{
							$result['appearance.' . $key . '.params'][$key . '-' . $subKey . '-' . $subSubKey] = $subSubItem;
						}
					}
				}
				else
				{
					$result['appearance.' . $key . '.params'] = $items;
				}
			}
		}

		if (isset($data['modules']))
		{
			$module = $data['modules'];
			foreach ($module as $key => $items)
			{
				if (is_array($items) && count($items))
				{
					foreach ($items as $subKey => $subItems)
					{
						foreach ($subItems as $subSubKey => $subSubItem)
						{
							$result['appearance.' . $key . '.params'][$key . '-' . $subKey . '-' . $subSubKey] = $subSubItem;
						}
					}
				}
				else
				{
					$result['appearance.' . $key . '.params'] = $items;
				}
			}
		}

		return $result;
	}
}
