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

$class = isset($component['settings']['class-prefix']) ? $component['settings']['class-prefix'] : '';
$contacts = isset($component['settings']['contacts']) ? $component['settings']['contacts'] : [];
$title = isset($component['settings']['title']) ? $component['settings']['title'] : '';
?>

<div class="<?php echo $class; ?>">
	<?php if($title != '') { ?>
	<h4><?php echo $title; ?></h4>
	<?php } ?>
	<ul class="list-unstyled sunfw-item-contact">
		<?php foreach ($contacts as $contact) {
			$linkIcon = '';
			if (isset($item['link']))
			{
				$linkIcon = $contact['link'];
			}

			if( isset($linkIcon) && $linkIcon != '' ): ?>

				<li><a href="<?php echo $linkIcon;?>"> <i class="widht-20 fa fa-<?php echo $contact['icon']; ?>"></i><?php echo $contact['text']; ?></a></li>

			<?php else: ?>

				<li><i class="widht-20 fa fa-<?php echo $contact['icon']; ?>"></i><?php echo $contact['text']; ?></li>

			<?php endif; ?>

		<?php } ?>
	</ul>
</div>
