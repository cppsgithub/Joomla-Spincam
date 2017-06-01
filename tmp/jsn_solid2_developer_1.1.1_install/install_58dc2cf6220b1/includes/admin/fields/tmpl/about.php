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
$sunfwParams = SunFwHelper::getExtensionParams( 'plugin', 'sunfw', 'system' );

?>
<!-- Nav tabs -->
<div class="jsn-nav" id="sunfw-about-sunfw-nav-tab">
	<div class="container-fluid">
		<nav class="navbar navbar-default">
			<div class="navbar-form navbar-left">
				<h3 class="margin-0 line-height-30"><?php echo JText::_('SUNFW_ABOUT');?></h3>
			</div>
			<div class="navbar-form navbar-right">
				<button class="btn btn-success text-uppercase back-to-edit-button" type="button"><i class="fa fa-chevron-left font-size-14 margin-right-5"></i> <?php echo JText::_( 'SUNFW_BACK' ) ?></button>
			</div>
		</nav>
	</div>
</div>
<!-- Tab panes -->
<div class="container-fluid padding-top-20">
	<div class="col-xs-12 col-md-8 col-md-offset-2">
		<div class="panel panel-default">
			<div class="panel-body">
				<?php include SUNFW_PATH_INCLUDES . '/template/tmpl/about.php'; ?>
			</div>
		</div>
	</div>
</div>
