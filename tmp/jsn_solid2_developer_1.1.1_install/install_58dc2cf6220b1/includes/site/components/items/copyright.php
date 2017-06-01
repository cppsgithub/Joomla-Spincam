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

// Generate HTML for copyright statement.
$copyright = 'Copyright ©';

if ( @isset( $component['settings']['start'] ) && $component['settings']['start'] != '' )
{
	$copyright .= ' ' . $component['settings']['start'];
}

if ( @isset( $component['settings']['end'] ) && $component['settings']['end'] != '' )
{
	if ( @isset( $component['settings']['start'] ) && $component['settings']['start'] != '' )
	{
		$copyright .= ' -';
	}

	$copyright .= ' ' . $component['settings']['end'];
}

if ( @isset( $component['settings']['link'] ) && $component['settings']['link'] != '' )
{
	$copyright .= ' <a href="' . $component['settings']['link'] . '"';
	$copyright .= ' target="' . ( @isset( $component['settings']['target'] ) ? $component['settings']['target'] : '_blank" rel="noopener noreferrer' ) . '">';
	$copyright .= @isset( $component['settings']['owner'] ) ? $component['settings']['owner'] : '';
	$copyright .= '</a>';
}
else
{
	$copyright .= @isset( $component['settings']['owner'] ) ? ' ' . $component['settings']['owner'] : '';
}

$copyright .= '. All rights reserved.';

$class = isset( $component['settings']['class-prefix'] ) ? $component['settings']['class-prefix'] : '';

?>
<div class="<?php echo $class; ?>">
	<?php echo $copyright; ?>
</div>
