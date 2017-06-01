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
?>
<div class="sunfw_appearance_preview_menu_wrapper">
	<div class="sunfw_appearance_preview_menu_container navbar navbar-default">
		<div class="sunfw_appearance_preview_menu_main_menu collapse navbar-collapse" id="sunfw-mainmenu">
			<ul class="nav navbar-nav">
				<li class="active">
					<a href="#"><span>Home</span></a>
				</li>
				<li>
					<a href="#"><span>Menu Item 1</span></a>
				</li>
				<li>
					<a href="#"><span>Menu Item 2</span></a>
				</li>
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
						<span>Menu Item 3</span>
						<span class="caret"></span>
					</a>
					<ul class="dropdown-menu">
						<li><a href="#"><span>Menu SubItem 1</span></a></li>
						<li><a href="#"><span>Menu SubItem 2</span></a></li>
						<li><a href="#"><span>Menu SubItem 3</span></a></li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</div>