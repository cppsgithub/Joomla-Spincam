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
?>
<div class="<?php echo implode(' ', $this->inputClass); ?>">
	<?php if (!empty($this->textPrefix)){ ?>
	<div class="input-group-addon"><?php echo $this->textPrefix; ?></div>>
	<?php } ?>

	<input type="<?php echo $this->dataType; ?>"
		name="<?php echo $this->name; ?>"
		id="<?php echo $this->id; ?>"
		value="<?php echo $this->value; ?>"
		class="<?php echo $this->element['class'] ?>" <?php echo $this->inputAttrs; ?> />

	<?php if (!empty($this->textSuffix)) { ?>
	<div class="input-group-addon"><?php echo $this->textSuffix; ?></div>
	<?php } ?>
</div>