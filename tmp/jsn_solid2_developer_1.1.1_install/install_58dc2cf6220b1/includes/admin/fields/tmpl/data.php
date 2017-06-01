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
// Get extension template parameters.
$params = SunFwHelper::getExtensionParams( 'template', SunFwAdmin::getInstance()->template );
?>
<!-- Nav tabs -->
<div class="jsn-nav" id="sunfw-global-parameters-nav-tab">
	<div class="container-fluid">
		<nav class="navbar navbar-default">
			<div class="navbar-form navbar-left">
				<h3 class="margin-0 line-height-30"><?php echo JText::_('SUNFW_DATA_HEADING');?></h3>
			</div>
			<ul class="nav navbar-nav navbar-left" id="sunfw-data-tab">
				<li role="presentation">
					<a href="#data-sample-data" aria-controls="data-sample-data" role="tab" data-toggle="tab">
						<?php echo JText::_('SUNFW_SAMPLE_DATA_TAB');?>
					</a>
				</li>
				<li role="presentation">
					<a href="#data-maintencance-data" aria-controls="data-maintencance-data" role="tab" data-toggle="tab">
						<?php echo JText::_('SUNFW_MAINTENANCE_TAB');?>
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
<div class="tab-content" id="sunfw-data-tab-content">
	<div role="tabpanel" id="data-sample-data" class="tab-pane">
		<div class="container-fluid padding-top-20">
			<div class="col-xs-12 col-md-12">
				<?php
				$packages = $this->getPackages();

				if ($packages !== false) :
				?>
				<div id="sample_data"></div>
				<script type="text/babel">
					(function($) {
						$(document).ready(function() {
							function init_sample_data() {
								setTimeout( function() {
									if ( ! window.SunFwSampleData ) {
										var sample_data = {
											packages: <?php echo json_encode( $packages ); ?>,
											lastInstalled: '<?php
												echo isset( $params['installedSamplePackage'] ) ? $params['installedSamplePackage'] : '';
											?>',
										};

										window.SunFwSampleData = ReactDOM.render(
											<SampleData
												id="sample_data"
												data={ sample_data }
											/>,
											document.getElementById('sample_data')
										);
									} else {
										SunFwSampleData.forceUpdate();
									}
								}, 5 );
							}

							$('a[data-toggle="tab"]').on( 'shown.bs.tab', function(event) {
								var target = event.target;

								if ( target.href.substr( -16 ) == '#data-sample-data' ) {
									init_layout();
								}
							} );

							init_sample_data();
						});
					})(jQuery);
				</script>
				<?php
				else :

				echo '<div class="could-not-connect-server">' . JText::_('SUNFW_COULD_NOT_CONNECT_TO_OUR_SERVER') . '</div>';

				endif;
				?>
			</div>
		</div>
	</div>
	<div role="tabpanel" id="data-maintencance-data" class="tab-pane">
		<div class="container-fluid padding-top-20">
			<div class="col-xs-12 col-md-6 col-md-offset-3">
				<div class="panel panel-default">
					<div class="panel-body">
						<p><?php echo JText::_('SUNFW_EXPORT_IMPORT_DESC'); ?></p>
						<div class="text-center">
							<a href="javascript: void(0);" class="btn btn-default" id="sunfw_advanced_importTemplateSettings"><i class="fa fa-upload"></i> <?php echo JText::_( 'SUNFW_ADVANCED_IMPORT' ); ?></a>
							<a href="javascript: void(0);" class="btn btn-default" id="sunfw_advanced_exportTemplateSettings"><i class="fa fa-download"></i> <?php echo JText::_( 'SUNFW_ADVANCED_EXPORT' ); ?></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
