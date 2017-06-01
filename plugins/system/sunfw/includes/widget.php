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
 * Handle Ajax requests.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwWidget
{
	/**
	 * Execute the requested Ajax action.
	 *
	 * @return  boolean
	 */
	public static function dispatch()
	{
		// Get Joomla's application instance.
		$app = JFactory::getApplication();

		// Execute widget action if needed
		$widget = $app->input->getCmd( 'sunfwwidget', '' );
		$action  = $app->input->getCmd( 'action', '' );
		$author  = $app->input->getCmd( 'author', '' );
		$rformat = $app->input->getCmd( 'rformat', 'json' );

		if ( empty( $widget ) OR empty( $action ) OR $author != 'joomlashine')
		{
			return false;
		}

		try
		{
			// Checking user permission.
			if ( ! JFactory::getUser()->authorise('core.manage', 'com_templates') )
			{
				// Set 403 header.
				header( 'HTTP/1.1 403 Forbidden' );

				throw new Exception( 'JERROR_ALERTNOAUTHOR' );
			}

			// Generate context class.
			$widgetClass = 'SunFwWidget' . ucfirst( $widget );

			if ( ! class_exists( $widgetClass ) )
			{
				throw new Exception( "The requested context {$widget} is invalid" );
			}

			// Create a new instance of the request context.
			$widgetObject = new $widgetClass;
			$method        = str_replace( '-', '', $action ) . 'Action';

			if ( method_exists( $widgetObject, $method ) )
			{
				call_user_func( array( $widgetObject, $method ) );
			}
			elseif ( method_exists( $widgetObject, 'invoke' ) )
			{
				call_user_func( array( $widgetObject, 'invoke'), $action );
			}
			else
			{
				throw new Exception( "The requested action {$action} is invalid" );
			}

			// Send response back.
			if ( $rformat == 'raw' )
			{
				echo $widgetObject->getResponse();
			}
			else
			{
				header('Content-Type: application/json');

				echo json_encode(
					array(
						'type' => 'success',
						'data' => $widgetObject->getResponse(),
					)
				);
			}
		}
		catch ( Exception $e )
		{
			if ( $rformat == 'raw' )
			{
				echo $e->getMessage();
			}
			else
			{
				header('Content-Type: application/json');

				echo json_encode(
					array(
						'type' => $e->getCode() == 99 ? 'outdate' : 'error',
						'data' => $e->getMessage(),
					)
				);
			}
		}

		return true;
	}
}
