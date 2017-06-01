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

$doc = JFactory::getDocument();
// Show switcher.
$showSwitch = isset( $this->layout['settings']['show_desktop_switcher'] ) ? $this->layout['settings']['show_desktop_switcher'] : false;
$boxLayout = isset( $this->layout['settings']['enable_boxed_layout'] ) ? $this->layout['settings']['enable_boxed_layout'] : false;
// Get advanced parameters.
$systemDataParams = ( count( $this->system_data ) ) ? $this->system_data : array();

?>
<!DOCTYPE html>
<html lang="<?php echo strtolower($this->language); ?>"  dir="<?php echo $this->direction; ?>">
	<head>
		<!-- If responsive is disabled, don't create viewport -->
		<?php if ( $this->responsive ) : ?>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php endif ?>

		<jdoc:include type="head" />

		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->

		<?php

		if ( isset( $systemDataParams['sunfwfavicon'] ) && ! empty( $systemDataParams['sunfwfavicon'] ) ) {

			$urlPattern = '/^(http|https)/';
			preg_match($urlPattern, $systemDataParams['sunfwfavicon'], $m);
			if ( count($m) ) {
				$doc->addFavicon($systemDataParams['sunfwfavicon']);
			} else {
				$doc->addFavicon(JURI::base(true) . '/' . $systemDataParams['sunfwfavicon']);
			}
		}

		if ( isset( $systemDataParams['customBeforeEndingHeadTag'] ) && ! empty( $systemDataParams['customBeforeEndingHeadTag'] ) )
			echo $systemDataParams['customBeforeEndingHeadTag'];
		?>
	</head>

	<?php
	// Get setting effect for offvancas.
	// If no setting specified, init the default setting.
	// !!! Check if offvancas is always visible !!!
	$body_class = '';

	foreach ( array( 'top', 'right', 'bottom', 'left' ) as $position )
	{
		if ( isset($this->layout['views'][ $position ]['settings']['effect']) && $this->layout['views'][ $position ]['settings']['effect'] != '') {
			$body_class .= $this->layout['views'][ $position ]['settings']['effect'].' ';
		}else {
			$body_class .= 'effect-' . $position . '-push sunfw-offCanvas ';
		}
	}
	// If responsive is not enabled, add an additional class to body tag.
	if ( ! $this->responsive )
		$body_class .= 'disable-responsive';
	?>

	<body id="sunfw-master" class="<?php echo $body_class . ' ' . $this->bodyClass; ?>">
		<?php
		if ( $showSwitch ) :
		?>
		<div class="sunfw-switcher setting hidden-lg hidden-md">
			<div class="btn-group" role="group" aria-label="...">
				<?php if ( $this->responsive ) : ?>
					<a href="#" class="btn" onclick="javascript: SunFwUtils.setTemplateAttribute('<?php echo $this->templatePrefix ?>switcher_','mobile','no'); return false;"><i class="fa fa-desktop" aria-hidden="true"></i></a>
					<a href="#" class="btn active" onclick="javascript: SunFwUtils.setTemplateAttribute('<?php echo $this->templatePrefix ?>switcher_','mobile','yes'); return false;"><i class="fa fa-mobile" aria-hidden="true"></i></a>
				<?php else : ?>
					<a href="#" class="btn active" onclick="javascript: SunFwUtils.setTemplateAttribute('<?php echo $this->templatePrefix ?>switcher_','mobile','no'); return false;"><i class="fa fa-desktop" aria-hidden="true"></i></a>
					<a href="#" class="btn" onclick="javascript: SunFwUtils.setTemplateAttribute('<?php echo $this->templatePrefix ?>switcher_','mobile','yes'); return false;"><i class="fa fa-mobile" aria-hidden="true"></i></a>
				<?php endif ?>
			</div>
		</div>
		<?php
		endif;
		?>

		<div id="sunfw-wrapper" class="sunfw-content <?php if( $boxLayout ) echo 'boxLayout'; ?>">
			<?php
			// Render sections.
			if ( isset( $this->layout['views']['main'] ) && @count( $this->layout['views']['main']['sections'] ) )
			{
				foreach ( $this->layout['views']['main']['sections'] as $sectionIndex )
				{
					SunFwSite::renderSection( $this->layout['sections'][ $sectionIndex ] );
				}
			}
			?>
		</div><!--/ #jsn-wrapper -->

		<?php
		// Render offcanvas.
		foreach ( array( 'top', 'right', 'bottom', 'left' ) as $position )
		{
			if ( isset( $this->layout['views'][ $position ] ) && @count( $this->layout['views'][ $position ]['rows'] ) )
				SunFwSite::renderOffcanvas( $this->layout['views'][ $position ], $position );
		}

		if ( isset( $systemDataParams['customBeforeEndingBodyTag'] ) && ! empty( $systemDataParams['customBeforeEndingBodyTag'] ) )
			echo $systemDataParams['customBeforeEndingBodyTag'];
		?>

	<?php
		// Check goto Top
		if ( isset($this->layout['settings']['go_to_top']) && $this->layout['settings']['go_to_top'] == 1) {

			$classGotoTop 	= isset( $this->layout['settings']['class_go_to_top'] ) ? $this->layout['settings']['class_go_to_top'] : '';
			$colorGotoTop 	= isset( $this->layout['settings']['color_go_to_top'] ) ? $this->layout['settings']['color_go_to_top'] : '';
			$bgGotoTop		= isset( $this->layout['settings']['bg_go_to_top'] ) ? $this->layout['settings']['bg_go_to_top'] : '';
			$psGotoTop		= isset( $this->layout['settings']['ps_go_to_top'] ) ? $this->layout['settings']['ps_go_to_top'] : 'right';
			if ( $psGotoTop == '' ) {
				$psGotoTop = 'right';
			}
			if ( $bgGotoTop != '' || $colorGotoTop != '' ) {

				$styleGoToTop = '.sunfw-scrollup {'
					. 'background: ' . $bgGotoTop . ';'
					. 'color: ' . $colorGotoTop . ';'
					. '}';
				$doc->addStyleDeclaration($styleGoToTop);

			}

	?>
		<a href="#" class="sunfw-scrollup position-<?php echo $psGotoTop;?> <?php echo $classGotoTop; ?>">
			<?php

			if ( isset( $this->layout['settings']['icon_go_to_top'] ) && $this->layout['settings']['icon_go_to_top'] != '' && $this->layout['settings']['icon_go_to_top'] != 'fa-ban' ) {
				?>
				<i class="fa <?php echo $this->layout['settings']['icon_go_to_top'];?>"></i>
				<?php
			}
			?>
			
			<?php
			if ( isset( $this->layout['settings']['text_go_to_top'] ) && $this->layout['settings']['text_go_to_top'] != '' ) {
				echo $this->layout['settings']['text_go_to_top'];
			}
			?>
		</a>
	<?php
		}
	?>
	</body>
</html>
