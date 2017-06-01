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

// Import necessary Joomla library.
jimport('joomla.filesystem.file');

/**
 * Sample data custom form field.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
// Load base class
require_once SUNFW_PATH . '/includes/admin/fields/field.php';

class JFormFieldData extends SunFwFormField
{
	/**
	 * Variable to hold available sample data packages.
	 *
	 * @var array
	 */
	protected $packages;

	/**
	 * Prepare sample data packages.
	 *
	 * @return array
	 */
	protected function getPackages()
	{
		if ( ! isset( $this->packages ) )
		{
			$localNiches = $this->getNiches();
			$this->packages = SunFwHelper::getSampleDataList( SunFwAdmin::getInstance()->template );

			if ($this->packages === false)
			{
				return false;
			}

			if (count($localNiches))
			{
				foreach ($localNiches as $key => $localNiche)
				{
					foreach ($this->packages as $packages)
					{
						if ($localNiche['id'] == $packages['id'])
						{
							unset($localNiches[$key]);
						}
					}
				}
			}

			if (count($localNiches))
			{
				$this->packages = array_merge($this->packages, $localNiches);
			}
		}
		return $this->packages;
	}

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
	 * Return HTML for the input control.
	 *
	 * @return  string
	 */
	protected function getInput()
	{
		return $this->renderLayout();

	}

	protected function getNiches()
	{
		$niches = glob( JPATH_SITE . '/templates/' . SunFwAdmin::getInstance()->template . '/niches/*' );
		$rNiches = array();
		// Add niche styles as options.
		if ( count($niches) )
		{
			foreach ( $niches as $niche )
			{
				if ( ! is_dir( $niche ) )
				{
					continue;
				}

				$niche  = basename( $niche );

				$tmpObj = new stdClass();
				$tmpObj->id = strtolower($niche);
				$tmpObj->name = ucfirst($niche);
				$tmpObj->thumbnail = JUri::root(true) . '/plugins/system/sunfw/assets/images/no-image.png';
				$tmpObj->demo = '#';
				$tmpObj->download = '#';
				$tmpObj->tags = array();
				$rNiches [] = (array) $tmpObj;
			}
		}

		return $rNiches;
	}
}
