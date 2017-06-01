<?php
/**
 * @version    2.7.x
 * @package    K2
 * @author     JoomlaWorks http://www.joomlaworks.net
 * @copyright  Copyright (c) 2006 - 2016 JoomlaWorks Ltd. All rights reserved.
 * @license    GNU/GPL license: http://www.gnu.org/copyleft/gpl.html
 */

// no direct access
defined('_JEXEC') or die;

// Define default image size (do not change)
K2HelperUtilities::setDefaultImage($this->item, 'itemlist', $this->params);

?>

<!-- Start K2 Item Layout -->
<div class="catItemView group<?php echo ucfirst($this->item->itemGroup); ?><?php echo ($this->item->featured) ? ' catItemIsFeatured' : ''; ?><?php if($this->item->params->get('pageclass_sfx')) echo ' '.$this->item->params->get('pageclass_sfx'); ?>">
	<div class="catItemHeader">
	  <?php if($this->item->params->get('catItemTitle')): ?>
	  <!-- Item title -->
	  <h3 class="catItemTitle">
			<?php if(isset($this->item->editLink)): ?>
			<!-- Item edit link -->
			<span class="catItemEditLink">
				<a data-k2-modal="edit" href="<?php echo $this->item->editLink; ?>">
					<?php echo JText::_('K2_EDIT_ITEM'); ?>
				</a>
			</span>
			<?php endif; ?>

	  	<?php if ($this->item->params->get('catItemTitleLinked')): ?>
			<a href="<?php echo $this->item->link; ?>">
	  		<?php echo $this->item->title; ?>
	  	</a>
	  	<?php else: ?>
	  	<?php echo $this->item->title; ?>
	  	<?php endif; ?>

	  	<?php if($this->item->params->get('catItemFeaturedNotice') && $this->item->featured): ?>
	  	<!-- Featured flag -->
	  	<span>
		  	<sup>
		  		<?php echo JText::_('K2_FEATURED'); ?>
		  	</sup>
	  	</span>
	  	<?php endif; ?>
	  </h3>
	  <?php endif; ?>
		<?php if($this->item->params->get('catItemAuthor')): ?>
			<!-- Item Author -->
			<span class="catItemAuthor">
			<i class="fa fa-user"></i>
				<?php if(isset($this->item->author->link) && $this->item->author->link): ?>
					<a rel="author" href="<?php echo $this->item->author->link; ?>"><?php echo $this->item->author->name; ?></a>
				<?php else: ?>
					<?php echo $this->item->author->name; ?>
				<?php endif; ?>
		</span>
		<?php endif; ?>
		<?php if($this->item->params->get('catItemDateCreated')): ?>
			<!-- Date created -->
			<span class="catItemDateCreated">
			<i class="fa fa-calendar"></i>
			<?php echo JHTML::_('date', $this->item->created, "F d,Y"); ?>
		</span>
		<?php endif; ?>
	</div>
	<div class="catItemBody">
		<?php if($this->item->params->get('catItemImage')): ?>
		<!-- Item Image -->
		<div class="catItemImageBlock">
		  <span class="catItemImage">
		    <a href="<?php echo $this->item->link; ?>" title="<?php if(!empty($this->item->image_caption)) echo K2HelperUtilities::cleanHtml($this->item->image_caption); else echo K2HelperUtilities::cleanHtml($this->item->title); ?>">
		    	<img class="img-responsive" src="<?php if(!empty($this->item->image)) { echo $this->item->image; } else { echo 'http://placehold.it/580x436/28272c/ffffff?text=JSN+SHINE+NO+IMAGE'; } ?>" alt="<?php if(!empty($this->item->image_caption)) echo K2HelperUtilities::cleanHtml($this->item->image_caption); else echo K2HelperUtilities::cleanHtml($this->item->title); ?>" />
		    </a>
		  </span>
		</div>
		<?php endif; ?>
	</div>
</div>
<!-- End K2 Item Layout -->
