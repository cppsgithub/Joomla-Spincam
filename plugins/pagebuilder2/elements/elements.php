<?php
/**
 * @version    $Id$
 * @package    JSN_PageBuilder2
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
 * JSN PageBuilder2 elements plugin.
 *
 * @package  JSN_PageBuilder2
 * @since    1.0.0
 */
class PlgPageBuilder2Elements extends JPlugin
{
	function getElementList() {
		$elements = array(
			'name' => 'elements',
			'title' => 'Basic',
			'scripts' => array(
				'build/core/core.js',
				'build/core2/core2.js',
				'build/joomla/joomla.js',
				'build/widgets/widgets.js',
			),
			'elements' => array(

				'Joomla' => array(
					'Joomla_Articles','Joomla_Module','K2_Items','EasyBlog_Posts'
				),
				'Advanced' => array(
					'Buttons2','Items2','Gallery','Tabs','Accordion','Testimonials2','PricingTables',
				),
				'Basic' => array(
					'Block2','Paragraph2','Heading2','List2',
					'Button2','Image2','Video2','Youtube2','Vimeo2','Divider',
					'GMap','Progress','Quote','SoundCloud','QRCode','Custom_HTML','Custom_CSS', 'Custom_JS',			
				),
				'Social' => array(
					'FBLikeButton', 'FBPageBox', 'TwitterFeed'
				),
				'__LEGACY__' => array(
					'Buttons','Button','Block','Heading','Paragraph','List','Items','Image','Youtube','Vimeo','Video','Testimonials'
				),
			),
		);

		return $elements;
	}
}
