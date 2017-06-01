<?php
/**
 * Kunena Component
 * @package     Kunena.Template
 * @subpackage  Layout.Widget
 *
 * @copyright   (C) 2008 - 2016 Kunena Team. All rights reserved.
 * @license     http://www.gnu.org/copyleft/gpl.html GNU/GPL
 * @link        https://www.kunena.org
 **/
defined('_JEXEC') or die;
?>

<?php if (($time = $this->getTime()) !== null) : ?>
<div class="center">
	<?php echo JText::sprintf('COM_KUNENA_VIEW_COMMON_FOOTER_TIME', $time); ?>
</div>
<?php endif;
