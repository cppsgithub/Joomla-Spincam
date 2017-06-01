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
<div class="jsn-nav" id="sunfw-global-parameters-nav-tab">
	<div class="container-fluid">
		<nav class="navbar navbar-default">
			<div class="navbar-form navbar-left">
				<h3 class="margin-0 line-height-30"><?php echo JText::_('SUNFW_GLOBAL_PARAMETERS');?></h3>
			</div>
			<ul class="nav navbar-nav navbar-left" id="sunfw-global-parameters-tab">
				<li role="presentation">
					<a href="#token-key" aria-controls="token-key" role="tab" data-toggle="tab">
						<?php echo JText::_('SUNFW_TOKEN_KEY_TAB');?>
					</a>
				</li>
			</ul>
			<div class="navbar-form navbar-right">
				<button class="btn btn-success text-uppercase back-to-edit-button" type="button"><i class="fa fa-chevron-left font-size-14 margin-right-5"></i> <?php echo JText::_( 'SUNFW_BACK' ) ?></button>
			</div>
		</nav>
	</div>
</div>
<!-- Tab panes -->
<div class="tab-content" id="sunfw-global-parameters-tab-content">
	<div role="tabpanel" id="token-key" class="tab-pane">
		<div class="container-fluid padding-top-20">
			<div class="col-xs-12 col-md-6 col-md-offset-3">
				<div class="panel panel-default">
					<div class="panel-body">
					    <p><?php echo JText::_('SUNFW_TOKEN_KEY_DESC'); ?></p>
						<div class="padding-bottom-5">
							<div id="sunfw-get-token-message" class="sunfw-token-message sunfwhide"></div>
						</div>
						<div class="row">
							<div class="col-xs-4">
								<label for="sunfw-token-key-username"><?php echo JText::_('SUNFW_USERNAME');?>: </label>
								<input type="text" class="form-control" id="sunfw-token-key-username" placeholder="<?php echo JText::_('SUNFW_USERNAME');?>">
							</div>
							<div class="col-xs-4">
								<label for="sunfw-token-key-password"><?php echo JText::_('SUNFW_PASSWORD');?>: </label>
								<input type="password" class="form-control" id="sunfw-token-key-password" placeholder="<?php echo JText::_('SUNFW_PASSWORD');?>">
							</div>
							<div class="col-xs-4">
								<button type="button" class="btn btn-block btn-default" id="sunfw-get-token-key-btn"><i class="fa fa-key"></i> <?php echo JText::_('SUNFW_GET_TOKEN_KEY');?></button>
							</div>
						</div>
						<hr />
						<div class="current-token-key">
							<label for="sunfw-token-key-username"><?php echo JText::_('SUNFW_CURRENT_TOKEN_KEY');?>: </label>
							<input type="text" class="form-control" id="sunfw-token-key-input" value="<?php echo isset($sunfwParams['token']) ? $sunfwParams['token'] : '';?>" readonly="readonly" placeholder="<?php echo JText::_('SUNFW_TOKEN_KEY_IS_NOT_SET');?>">
						</div>
						<div class="row sunfwhide">
							<div class="col-xs-12 col-md-12 padding-top-5">
								<button type="button" id="sunfw-verify-token-key-btn" class="btn btn-default"><i class="fa fa-check-circle"></i> <?php echo JText::_('SUNFW_FRAMEWORK_VERIFY'); ?></button>
							</div>
							<div class="col-xs-12 col-md-12 padding-top-5">
								<div id="sunfw-token-message" class="sunfw-token-message sunfwhide"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>