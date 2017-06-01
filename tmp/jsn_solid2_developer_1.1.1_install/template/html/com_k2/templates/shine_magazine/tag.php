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

?>

<!-- Start K2 Tag Layout -->
<div id="k2Container" class="tagView<?php if($this->params->get('pageclass_sfx')) echo ' '.$this->params->get('pageclass_sfx'); ?>">

	<?php if($this->params->get('show_page_title')): ?>
	<!-- Page title -->
	<div class="componentheading<?php echo $this->params->get('pageclass_sfx')?>">
		<?php echo $this->escape($this->params->get('page_title')); ?>
	</div>
	<?php endif; ?>

	<?php if($this->params->get('tagFeedIcon',1)): ?>
	<!-- RSS feed icon -->
	
	<div class="k2FeedIcon">
		<a href="<?php echo $this->feed; ?>" title="<?php echo JText::_('K2_SUBSCRIBE_TO_THIS_RSS_FEED'); ?>">
			<span><?php echo JText::_('K2_SUBSCRIBE_TO_THIS_RSS_FEED'); ?></span>
		</a>
		<div class="clr"></div>
	</div>
	<?php endif; ?>

	<?php if(count($this->items)): ?>
	<div class="tagItemList">
		<?php
			$col_tags = 3;
			$col_tags_class = 12 / $col_tags;
		?>
		<div  class="row">
		<?php foreach($this->items as $key=>$item): ?>
		<div class="col-lg-<?php echo $col_tags_class; ?> col-md-<?php echo $col_tags_class; ?> col-sm-<?php echo $col_tags_class; ?> col-xs-12">
		<!-- Start K2 Item Layout -->
		<div class="tagItemView">

			<div class="tagItemBody">
			  <?php if($item->params->get('tagItemImage',1) && !empty($item->imageGeneric)): ?>
			  <!-- Item Image -->
			  <div class="tagItemImageBlock">
				  <span class="tagItemImage">
				    <a href="<?php echo $item->link; ?>" title="<?php if(!empty($item->image_caption)) echo K2HelperUtilities::cleanHtml($item->image_caption); else echo K2HelperUtilities::cleanHtml($item->title); ?>">
				    	<img class="img-responsive" src="<?php echo $item->imageGeneric; ?>" alt="<?php if(!empty($item->image_caption)) echo K2HelperUtilities::cleanHtml($item->image_caption); else echo K2HelperUtilities::cleanHtml($item->title); ?>" />
				    </a>
				  </span>
			  </div>
			  <?php endif; ?>
			</div>
			
			<div class="tagItemHeader">

			  <?php if($item->params->get('tagItemTitle',1)): ?>
			  <!-- Item title -->
			  <h2 class="tagItemTitle">
			  	<?php if ($item->params->get('tagItemTitleLinked',1)): ?>
					<a href="<?php echo $item->link; ?>">
			  		<?php echo $item->title; ?>
			  	</a>
			  	<?php else: ?>
			  	<?php echo $item->title; ?>
			  	<?php endif; ?>
			  </h2>
			  <?php endif; ?>
				<?php if($item->params->get('tagItemDateCreated',1)): ?>
					<!-- Date created -->
					<span class="tagItemDateCreated">
					<i class="fa fa-calendar"></i>
						<?php echo JHTML::_('date', $item->created, "F d,Y"); ?>
				</span>
				<?php endif; ?>
				 <?php if($item->params->get('tagItemIntroText',1)): ?>
				  <!-- Item introtext -->
				  <div class="tagItemIntroText">
				  	<?php echo $item->introtext; ?>
				  </div>
				  <?php endif; ?>
			</div>

			<?php if($item->params->get('tagItemExtraFields',0) && count($item->extra_fields)): ?>
			<!-- Item extra fields -->
			<div class="tagItemExtraFields">
				<h4><?php echo JText::_('K2_ADDITIONAL_INFO'); ?></h4>
				<ul>
				<?php foreach ($item->extra_fields as $key=>$extraField): ?>
				<?php if($extraField->value != ''): ?>
				<li class="<?php echo ($key%2) ? "odd" : "even"; ?> type<?php echo ucfirst($extraField->type); ?> group<?php echo $extraField->group; ?>">
					<?php if($extraField->type == 'header'): ?>
					<h4 class="tagItemExtraFieldsHeader"><?php echo $extraField->name; ?></h4>
					<?php else: ?>
					<span class="tagItemExtraFieldsLabel"><?php echo $extraField->name; ?></span>
					<span class="tagItemExtraFieldsValue"><?php echo $extraField->value; ?></span>
					<?php endif; ?>
				</li>
				<?php endif; ?>
				<?php endforeach; ?>
				</ul>
			<div class="clr"></div>
			</div>
			<?php endif; ?>

			<?php if($item->params->get('tagItemCategory')): ?>
			<!-- Item category name -->
			<div class="tagItemCategory">
				<span><?php echo JText::_('K2_PUBLISHED_IN'); ?></span>
				<a href="<?php echo $item->category->link; ?>"><?php echo $item->category->name; ?></a>
			</div>
			<?php endif; ?>

			<?php if ($item->params->get('tagItemReadMore')): ?>
			<!-- Item "read more..." link -->
			<div class="tagItemReadMore">
				<a class="k2ReadMore" href="<?php echo $item->link; ?>">
					<?php echo JText::_('K2_READ_MORE'); ?>
				</a>
			</div>
			<?php endif; ?>
		</div>
		<!-- End K2 Item Layout -->
		</div>
		<?php if(($key+1) % $col_tags == 0): ?>
		<div class="clearfix"></div>
		<?php endif; ?>
		<?php endforeach; ?>
		</div>
	</div>

	<!-- Pagination -->
	<?php if($this->pagination->getPagesLinks()): ?>
	<div class="k2Pagination">
		<?php echo $this->pagination->getPagesLinks(); ?>
	</div>
	<?php endif; ?>

	<?php endif; ?>

</div>
<!-- End K2 Tag Layout -->
