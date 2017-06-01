<?php
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.htmlx
 */

// No direct access to this file.
defined('_JEXEC') or die;

// Prepare class for offcanvas container.
$container_class	= 'off-canvas-base';
$styleCanvas	 	= '';

switch ( $position )
{
	case 'top':

		$container_class .= ' off-canvas-top top-0 right-0 left-0';

		// Check class Prefix
		if ( isset($component['settings']['class-prefix']) ) {
			$container_class .= ' '.$component['settings']['class-prefix'];
		}

		// Add css Padding
		if ( isset($component['settings']['padding']) && is_array($component['settings']['padding']) ) {

			foreach ($component['settings']['padding'] as $k => $value) {
				$styleCanvas .= '.off-canvas-top .offcanvas-content {padding-' . $k . ': ' . $value . 'px;}';
			}
		}

		// Set Height
		if ( isset($component['settings']['height']) && $component['settings']['height'] != '' ) {
			$cvTopHeight = $component['settings']['height'];
		}else {
			$cvTopHeight = 300;
		}

		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-top {height: ' . $cvTopHeight . 'px}';

		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-top {-webkit-transform: translate3d(0, -' . $cvTopHeight . 'px, 0)}';
		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-top {transform: translate3d(0, -' . $cvTopHeight . 'px, 0)}';

		$styleCanvas .= 'body.sunfw-offCanvas.is-top-open > .off-canvas-top {-webkit-transform: translate3d(0px, 0px, 0px)}';
		$styleCanvas .= 'body.sunfw-offCanvas.is-top-open > .off-canvas-top {transform: translate3d(0px, 0px, 0px)}';

		break;

	case 'right':
		$container_class .= ' off-canvas-right top-0 right-0 bottom-0';

		// Check class Prefix
		if ( isset($component['settings']['class-prefix']) ) {
			$container_class .= ' '.$component['settings']['class-prefix'];
		}

		// Add css Padding
		if ( isset($component['settings']['padding']) && is_array($component['settings']['padding']) ) {

			foreach ($component['settings']['padding'] as $k => $value) {
				$styleCanvas .= '.off-canvas-right .offcanvas-content {padding-' . $k . ': ' . $value . 'px;}';
			}
		}

		// Set Width
		if ( isset($component['settings']['width']) && $component['settings']['width'] != '' ) {
			$cvRightWidth = $component['settings']['width'];
		}else {
			$cvRightWidth = 300;
		}

		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-right {width: ' . $cvRightWidth . 'px}';

		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-right {-webkit-transform: translate3d(' . $cvRightWidth . 'px, 0, 0)}';
		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-right {transform: translate3d(' . $cvRightWidth . 'px, 0, 0)}';
		$styleCanvas .= 'body.sunfw-offCanvas.sunfw-direction-rtl > .off-canvas-right {-webkit-transform: translate3d(-' . $cvRightWidth . 'px, 0, 0)}';
		$styleCanvas .= 'body.sunfw-offCanvas.sunfw-direction-rtl > .off-canvas-right {transform: translate3d(-' . $cvRightWidth . 'px, 0, 0)}';

		$styleCanvas .= 'body.sunfw-offCanvas.is-right-open > .off-canvas-right {-webkit-transform: translate3d(0px, 0px, 0px)}';
		$styleCanvas .= 'body.sunfw-offCanvas.is-right-open > .off-canvas-right {transform: translate3d(0px, 0px, 0px)}';

		break;

	case 'bottom':
		$container_class .= ' off-canvas-bottom right-0 bottom-0 left-0';

		// Check class Prefix
		if ( isset($component['settings']['class-prefix']) ) {
			$container_class .= ' '.$component['settings']['class-prefix'];
		}

		// Add css Padding
		if ( isset($component['settings']['padding']) && is_array($component['settings']['padding']) ) {

			foreach ($component['settings']['padding'] as $k => $value) {
				$styleCanvas .= '.off-canvas-bottom .offcanvas-content {padding-' . $k . ': ' . $value . 'px;}';
			}
		}

		// Set Height
		// Set Width
		if ( isset($component['settings']['height']) && $component['settings']['height'] != '' ) {
			$cvBottomHeight = $component['settings']['height'];
		}else {
			$cvBottomHeight = 300;
		}

		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-bottom {height: ' . isset($component['settings']['height']) ? $component['settings']['height'] : 300 . 'px}';

		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-bottom {-webkit-transform: translate3d(0, ' . $cvBottomHeight . 'px, 0)}';
		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-bottom {transform: translate3d(0, ' . $cvBottomHeight . 'px, 0)}';

		$styleCanvas .= 'body.sunfw-offCanvas.is-bottom-open > .off-canvas-bottom {-webkit-transform: translate3d(0px, 0px, 0px)}';
		$styleCanvas .= 'body.sunfw-offCanvas.is-bottom-open > .off-canvas-bottom {transform: translate3d(0px, 0px, 0px)}';

		break;

	case 'left':
		$container_class .= ' off-canvas-left top-0 bottom-0 left-0';

		// Check class Prefix
		if ( isset($component['settings']['class-prefix']) ) {
			$container_class .= ' '.$component['settings']['class-prefix'];
		}

		// Add css Padding
		if ( isset($component['settings']['padding']) && is_array($component['settings']['padding'])  ) {
			foreach ($component['settings']['padding'] as $k => $value) {
				$styleCanvas .= '.off-canvas-left .offcanvas-content {padding-' . $k . ': ' . $value . 'px;}';
			}
		}

		// Set Width
		if ( isset($component['settings']['width']) && $component['settings']['width'] != '' ) {
			$cvLeftWidth = $component['settings']['width'];
		}else {
			$cvLeftWidth = 300;
		}
		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-left {width: ' . $cvLeftWidth . 'px}';

		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-left {-webkit-transform: translate3d(-' .$cvLeftWidth. 'px, 0, 0)}';
		$styleCanvas .= 'body.sunfw-offCanvas > .off-canvas-left {transform: translate3d(-' . $cvLeftWidth . 'px, 0, 0)}';
		$styleCanvas .= 'body.sunfw-offCanvas.sunfw-direction-rtl > .off-canvas-left {-webkit-transform: translate3d(' .$cvLeftWidth. 'px, 0, 0)}';
		$styleCanvas .= 'body.sunfw-offCanvas.sunfw-direction-rtl > .off-canvas-left {transform: translate3d(' . $cvLeftWidth . 'px, 0, 0)}';

		$styleCanvas .= 'body.sunfw-offCanvas.is-left-open > .off-canvas-left {-webkit-transform: translate3d(0px, 0px, 0px)}';
		$styleCanvas .= 'body.sunfw-offCanvas.is-left-open > .off-canvas-left {transform: translate3d(0px, 0px, 0px)}';

		break;
}

$doc = JFactory::getDocument();
$doc->addStyleDeclaration( $styleCanvas );

$visible_in		= isset($component['settings']['visible_in']) ? $component['settings']['visible_in'] : '';

if (is_array($visible_in) && count($visible_in) > 0)
{
	foreach ($visible_in as $k => $value)
	{
		$container_class .= ' visible-'.$value;
	}
}

// Prepare class for offcanvas anchor.
$anchor_class = 'close-offcanvas toggle-offcanvas';
$close_class  = 'close-offcanvas';

if ( isset( $component['settings']['anchor-position'] ) ) {
	$anchor_class .= " {$component['settings']['anchor-position']}";
	$close_class  .= " {$component['settings']['anchor-position']}";
}
else
{
	$anchor_class .= ' ' . ( in_array( $position, array( 'top', 'bottom' ) ) ? 'center' : 'middle' );
	$close_class  .= ' ' . ( in_array( $position, array( 'top', 'bottom' ) ) ? 'center' : 'middle' );
}

// Print style and script to open / close offcanvas.
if ( ! defined( 'OFFCANVAS_SCRIPT_PRINTED' ) ) :
	?>
	<script type="text/javascript">
		(function($) {
			$(document).ready(function() {
				$('.toggle-offcanvas').on('click', function(event) {
					event.preventDefault();
					var position = $(this).closest('.off-canvas-base').attr('class').match(/off-canvas-base off-canvas-([^\s]+)/)[1];
				
						$('body').toggleClass('is-' + position + '-open offcanvas-open');
					
					
				});

				$(window).on("click", function(e) {					
					var btnoffcanvas = document.querySelector( '.toggle-offcanvas' );
					if( e.target !== btnoffcanvas && !$(e.target).closest('.off-canvas-base').length) {
						$('body').removeClass('offcanvas-open is-right-open is-top-open is-left-open is-bottom-open');
						
					}
				});
				// Hover off-canvas-top
				if( $('.off-canvas-top.open-on-hover').length > 0 ) {

					$(".off-canvas-top, .off-canvas-top > a.toggle-offcanvas").mouseover(function(){
						$('body').addClass('is-top-open');
					});
					$(".off-canvas-top").mouseout(function(){
						$('body').removeClass('is-top-open');
					});
				}

				// Hover off-canvas-left
				if( $('.off-canvas-left.open-on-hover').length > 0 ) {

					$(".off-canvas-left, .off-canvas-left > a.toggle-offcanvas").mouseover(function(){
						$('body').addClass('is-left-open');
					});
					$(".off-canvas-left").mouseout(function(){
						$('body').removeClass('is-left-open');
					});
				}

				// Hover off-canvas-right
				if( $('.off-canvas-right.open-on-hover').length > 0 ) {

					$(".off-canvas-right, .off-canvas-right > a.toggle-offcanvas").mouseover(function(){
						$('body').addClass('is-right-open');
					});
					$(".off-canvas-right").mouseout(function(){
						$('body').removeClass('is-right-open');
					});
				}

				// Hover off-canvas-bottom
				if( $('.off-canvas-bottom.open-on-hover').length > 0 ) {

					$(".off-canvas-bottom, .off-canvas-bottom > a.toggle-offcanvas").mouseover(function(){
						$('body').addClass('is-bottom-open');
					});
					$(".off-canvas-bottom").mouseout(function(){
						$('body').removeClass('is-bottom-open');
					});
				}


			});
		})(jQuery);
	</script>
	<?php
	define( 'OFFCANVAS_SCRIPT_PRINTED', true );

endif;
?>
<div class="<?php echo $container_class; ?>">
	<a class="<?php echo $anchor_class; ?>" href="#"><i class="fa fa-bars" aria-hidden="true"></i></a>

	<div class="clearfix"></div>

	<div class="offcanvas-content">
		<?php
		// Render sections in offcanvas.
		if ( @count( $component['rows'] ) )
		{
			foreach ( $component['rows'] as $sectionIndex )
			{
				SunFwSite::renderRow( $layout['rows'][ $sectionIndex ] );
			}
		}
		?>
	</div>
</div>
