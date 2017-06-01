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

/**
 * Layout builder custom form field.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class JFormFieldSunFwNiches extends JFormFieldList
{
	/**
	 * The form field type.
	 *
	 * @var  string
	 */
	protected $type = 'sunfw-niches';

	/**
	 * Available niche styles.
	 *
	 * @var  array
	 */
	protected static $niches;

	/**
	 * Method to get the field options.
	 *
	 * @return  array  The field option objects.
	 */
	protected function getOptions()
	{
		// Add an empty option first.
		$option = $this->element->addChild( 'option', JText::_( 'SUNFW_CLICK_TO_SELECT' ) );

		$option->addAttribute( 'value', '' );

		// Get all available niche styles.
		if ( ! isset( self::$niches ) )
		{
			self::$niches = glob( JPATH_SITE . '/templates/' . SunFwAdmin::getInstance()->template . '/niches/*' );
		}

		// Add niche styles as options.
		if ( self::$niches )
		{
			foreach ( self::$niches as $niche )
			{
				if ( ! is_dir( $niche ) )
				{
					continue;
				}

				$niche  = basename( $niche );
				$option = $this->element->addChild( 'option', ucwords( preg_replace( '/[^a-zA-Z0-9\s]+/', ' ', $niche ) ) );

				$option->addAttribute( 'value', $niche );
			}
		}

		return parent::getOptions();
	}
}
