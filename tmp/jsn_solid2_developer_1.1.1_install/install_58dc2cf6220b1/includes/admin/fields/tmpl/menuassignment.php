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

// Initiasile related data.
require_once JPATH_ADMINISTRATOR.'/components/com_menus/helpers/menus.php';

$menuTypes 	= MenusHelper::getMenuLinks();
$user 		= JFactory::getUser();
$styleId 	= JFactory::getApplication()->input->getInt('id');

?>
<script type="text/javascript">
	window.sunfw_menu_assignment = <?php echo json_encode( array(
	'text' => array(
		'save-data-successfully' => JText::_( 'SUNFW_MENU_ASSIGNMENT_SAVE_DATA_SUCCESSFULLY' ),
	)) ); ?>;

	(function($) {
		$(document).ready(function() {
			window.SunFwMenuAssignment = new $.SunFwMenuAssignment();
		});
	})(jQuery);
</script>
<div class="jsn-pageheader padding-top-10 padding-bottom-10">
	<div class="container-fluid">
		<div class="pull-left">
			<h3 class="margin-0 line-height-30"><?php echo JText::_('SUNFW_MENU_ASSIGNMENT'); ?></h3>
		</div>
		<div class="pull-right">
			<button type="button" class="btn btn-warning text-uppercase" id="sunfw-save-menu-assignment-button"><i class="icon-apply icon-white margin-right-5"></i><?php echo JText::_('SUNFW_SAVE_ASSIGNMENT'); ?></button>
		</div>
	</div>
</div>
<div class="container-fluid padding-top-20">
	<div class="control-label sunfwhide">
		<label id="jform_menuselect-lbl" for="jform_menuselect"><?php echo JText::_('JGLOBAL_MENU_SELECTION'); ?></label>
	</div>
	<div class="controls">
		<div class="row-fluid sunfwhide">
			<div class="span12 btn-toolbar">
				<button class="btn btn-primary" type="button" id="jsn-toggle-menu">
					<?php echo JText::_('JGLOBAL_SELECTION_INVERT'); ?>
				</button>
			</div>
		</div>
		<div id="menu-links" class="row sunfw-menu-assignment">
			<?php foreach (MenusHelper::getMenuLinks() as $menuType): ?>
			<div class="col-xs-3 box">
				<div class="content">
					<ul id="menu-type-<?php echo $menuType->menutype ?>">
					<li class="menu-type-header">
						<label class="checkbox menu-type">
							<input type="checkbox" name="checkAll" />
							<?php echo !empty($menuType->title) ? $menuType->title : $menuType->menutype; ?>
						</label>
						<hr />
					</li>
					<?php
						$i = 0;
						$countType = count ($menuType->links);
					?>
					<?php foreach ($menuType->links as $link): ?>
					<?php
						$next = $i < $countType - 1 ? $menuType->links[$i+1] : null;

					?>
					<li>
						<?php $checked = $link->template_style_id == $styleId ? 'checked' : '' ?>
						<?php $disabled = !empty($link->checked_out) && $link->checked_out != $user->id ? 'disabled' : '' ?>
						<?php $prefix = str_repeat('- ', $link->level); ?>
						<label class="checkbox level<?php echo $link->level ?>" data-level="<?php echo $link->level ?>" for="link<?php echo (int) $link->value;?>" >
							<input type="checkbox" id="link<?php echo (int) $link->value;?>" name="sunfw-menu-assignment[assigned][]"
								value="<?php echo (int) $link->value ?>"
								class="menu-item"
								<?php echo $checked ?>
								<?php echo $disabled ?>
							/>
							<?php echo $link->text ?>
							<?php

						?>
							<?php if ($next && $next->level > $link->level) : ?>
								<a href="javascript://" class="sunfw-menu-assignment-toggle">
									<i class="fa fa-check-square"></i>
								</a>
								<a href="javascript://">
									<i class="sunfw-menu-tree-toggle fa fa-minus"></i>
								</a>
							<?php endif ?>
						</label>
					</li>
					<?php $i++; ?>
					<?php endforeach ?>
				</ul>
				</div>
			</div>
			<?php endforeach ?>

			<div class="clearfix"></div>
		</div>
	</div>
</div>