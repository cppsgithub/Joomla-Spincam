<?php
/**
 * @package J2Store
 * @copyright Copyright (c)2014-17 Ramesh Elamathi / J2Store.org
 * @license GNU GPL v3 or later
 *
 * Bootstrap 2 layout of products
 */
// No direct access
defined('_JEXEC') or die;
JFactory::getDocument()->addScript(JURI::root(true).'/media/j2store/js/filter.js');
$actionURL = JRoute::_('index.php?option=com_j2store&view=products');
$filter_position = $this->params->get('list_filter_position', 'right');
$col=$this->params->get('list_no_of_columns', 3);
$total = count($this->products); $counter = 0;
$cols='.col-md-'.round((12 / $col));
$class_array =  array(
	$cols => '.col-sm-12'
);
?>
<script>
    function products1(){
		 var gridlistview = document.getElementById("main-j2store-product-list").classList;
		 if (gridlistview.contains("grid-layout")) {
			gridlistview.remove("grid-layout");
			gridlistview.add("list-layout");
		 }
		 (function($){
			var classarray = <?php echo json_encode($class_array); ?>;			
			var productgrid = $('.j2store-products-row');	
			$.each(classarray,function( key,value ) {
				var new_class = productgrid.find(key);	
				console.log(new_class);			
				$( new_class ).each(function( index ) {
					$(this).attr('class',value.slice(1));  
				});
			});
		})(jQuery);
    }
     function products2(){
		var gridlistview = document.getElementById("main-j2store-product-list").classList;
		 if (gridlistview.contains("list-layout")) {
			gridlistview.remove("list-layout");
			gridlistview.add("grid-layout");
		 }
		(function($){
			var classarray = <?php echo json_encode($class_array); ?>;
			var productgrid = $('.j2store-products-row');
			$.each(classarray,function( key,value ) {
				var old_class = productgrid.find(value);
				console.log(old_class);	
				$( old_class ).each(function( index ) {
					$(this).attr('class',key.slice(1));  
				});
			});
		})(jQuery);
	 }
</script>
<div itemscope itemtype="http://schema.org/ItemList" id="main-j2store-product-list" class="j2store-product-list bs3 grid-layout"   data-link="<?php echo $this->active_menu->link.'&Itemid='.$this->active_menu->id;?>">

	<?php echo J2Store::plugin()->eventWithHtml('BeforeViewProductListDisplay',array($this->products));?>
	<?php echo J2Store::modules()->loadposition('j2store-product-list-top'); ?>
	<?php if ($this->params->get('show_page_heading')) : ?>
		<div class="page-header">
			<h1> <?php echo $this->escape($this->params->get('page_heading')); ?> </h1>
		</div>
	<?php endif; ?>


	<div class="row">
	<?php
		//make sure filter is enable
		if($this->params->get('list_show_filter', 0)):?>
		<?php if($filter_position == 'left'): ?>
			<div class="j2store-sidebar-filters-container col-sm-3">
				<?php echo J2Store::modules()->loadposition('j2store-filter-left-top'); ?>
				<?php echo $this->loadTemplate('filters');?>
				<?php echo J2Store::modules()->loadposition('j2store-filter-left-bottom'); ?>
			</div>
		<?php endif; ?>
	<?php endif; ?>

	<?php
		//make sure filter is enable
		if($this->params->get('list_show_filter', 0)):?>
		<div class="col-sm-9">
		<?php else:?>
			<div class="col-sm-12">
		<?php endif;?>
			<div class="top-bar-filters-container row">
				<?php if($this->params->get('list_show_top_filter', 1)):?>
					
					<div class="grid-list col-sm-2">
						<ul>
							<li><a id="grid" onclick="products2();" class="btn"><i class="fa fa-th"></i></a></li>
							<li><a id="list" onclick="products1();" class="btn"><i class="fa fa-th-list"></i></a></li>
						</ul>
						
					</div>
					
					<?php echo $this->loadTemplate('sortfilter');?>
				<?php endif; ?>
			</div>
			
			
			<?php if(isset($this->products) && $this->products):?>
				<?php
					$col=$this->params->get('list_no_of_columns', 3);

					$total = count($this->products); $counter = 0;?>

					<?php foreach($this->products as $product):?>

						<!-- Make sure product is enabled and visible @front end -->
						<?php //  if($product->enabled && $product->visibility):?>
							<?php $rowcount = ((int) $counter % (int) $col) + 1; ?>
								<?php if ($rowcount == 1) : ?>
									<?php $row = $counter / $col; ?>
										<div class="j2store-products-row <?php echo 'row-'.$row; ?> row">
								<?php endif;?>
											<div class="col-sm-6 col-xs-12 col-md-<?php echo round((12 / $col));?> ">
												<div itemprop="itemListElement" itemscope="" itemtype="http://schema.org/Product"
												     class="j2store-single-product multiple j2store-single-product-<?php echo $product->j2store_product_id; ?> product-<?php echo $product->j2store_product_id; ?> pcolumn-<?php echo $rowcount;?>">
													<?php $this->product = $product;
													 	$this->product_link = JRoute::_('index.php?option=com_j2store&view=product&id='.$this->product->j2store_product_id);
													?>
													<?php
													try {
														$type = $product->product_type;
														if(isset($type) && !empty($type)) {
															echo $this->loadTemplate(strtolower($type));
														}
													} catch (Exception $e) {
														echo $e->getMessage();
													}

													?>
														<!-- QUICK VIEW OPTION -->
													<?php if($this->params->get('list_enable_quickview',0)):?>
													<?php JHTML::_('behavior.modal', 'a.modal'); ?>	
													<a itemprop="url"
															class="modal j2store-product-quickview-modal button btn btn-primary"
															ref="{handler:'iframe',size:{x: window.innerWidth-180, y: window.innerHeight-180}}"
															href="<?php echo JRoute::_('index.php?option=com_j2store&view=products&task=view&id='.$this->product->j2store_product_id.'&tmpl=component'); ?>">
															<i class="fa fa-eye"></i>
														</a>
													<?php endif;?>
												</div>
											</div>
									<?php $counter++; ?>
								<?php if (($rowcount == $col) or ($counter == $total)) : ?>
									</div>
								<?php endif; ?>
							<?php // endif; ?>
						<?php endforeach;?>

					<form id="j2store-pagination" name="j2storepagination" action="<?php echo  JRoute::_('index.php?option=com_j2store&view=products&filter_catid='.$this->filter_catid); ?>" method="post">
						<?php echo J2Html::hidden('option','com_j2store');?>
						<?php echo J2Html::hidden('view','products');?>
						<?php echo J2Html::hidden('task','browse',array('id'=>'task'));?>
						<?php echo J2Html::hidden('boxchecked','0');?>
						<?php echo J2Html::hidden('filter_order','');?>
						<?php echo J2Html::hidden('filter_order_Dir','');?>
						<?php echo J2Html::hidden('filter_catid',$this->filter_catid);?>

						<?php echo JHTML::_( 'form.token' ); ?>
						<div class="pagination">
							<?php  echo $this->pagination->getPagesLinks(); ?>
						</div>
					</form>

				<?php else:?>
				<div class="row">
						<div class="col-sm-12">
							<h5> <?php echo JText::_('J2STORE_NO_RESULTS_FOUND');?></h5>
							</div>
						</div>
				<?php endif;?>
		</div>
	<?php
		//make sure filter is enable
		if($this->params->get('list_show_filter')):?>
		<?php if($filter_position == 'right'): ?>
			<div class="j2store-sidebar-filters-container col-sm-3">
				<?php echo J2Store::modules()->loadposition('j2store-filter-right-top'); ?>
				<?php echo $this->loadTemplate('filters');?>
				<?php echo J2Store::modules()->loadposition('j2store-filter-right-bottom'); ?>
			</div>
		<?php endif; ?>
	<?php endif; ?>

	</div> <!-- end of row-fluid -->
	<?php echo J2Store::modules()->loadposition('j2store-product-list-bottom'); ?>
</div> <!-- end of product list -->

<script type="text/javascript">
<!--
	function toggle_visibility(id){
		var e=document.getElementById(id);
		console.log(e.style.display);
		if(e.style.display == 'block'){
			e.style.display='none';
		}
		else if(e.style.display == 'none'){
			e.style.display='block';
		}
	}
//-->
</script>
