<?php
/**
 * @package J2Store
 * @copyright Copyright (c)2014-17 Ramesh Elamathi / J2Store.org
 * @license GNU GPL v3 or later
 */

// No direct access
defined('_JEXEC') or die;

if(!empty($this->product->addtocart_text)) {
	$cart_text = JText::_($this->product->addtocart_text);
} else {
	$cart_text = JText::_('J2STORE_ADD_TO_CART');
}

if($this->product->variant->availability || J2Store::product()->backorders_allowed($this->product->variant)) {
	$show = true;
} else {
	$show = false;
}

if($this->product->product_type == 'variable') {
	if($this->product->all_sold_out){
		$show = false;
	}else{
		$show = true;
	}
}
?>
	<?php echo J2Store::plugin()->eventWithHtml('BeforeAddToCartButton', array($this->product, J2Store::utilities()->getContext('default_cart'))); ?>
	<?php echo J2Store::plugin()->eventWithHtml('AfterAddToCartButton', array($this->product, J2Store::utilities()->getContext('default_cart'))); ?>
	<?php if($show): ?>

		<div id="add-to-cart-<?php echo $this->product->j2store_product_id; ?>" class="j2store-add-to-cart 111">

		<?php if($this->params->get('show_qty_field', 1)): ?>
			 <div class="product-qty">
		 		<input type="number" name="product_qty" value="<?php echo (int) $this->product->quantity; ?>" class="input-mini form-control" min="<?php echo (int) $this->product->quantity; ?>" step='1' />
			</div>
		<?php else: ?>
			<input type="hidden" name="product_qty" value="<?php echo (int) $this->product->quantity; ?>" />
		<?php endif; ?>

			<input type="hidden" name="product_id" value="<?php echo $this->product->j2store_product_id; ?>" />

				<button class="button j2store_cart_button <?php echo $this->params->get('addtocart_button_class', 'btn btn-primary');?>">
						<i class="fa fa-shopping-bag"></i><span><?php echo $cart_text; ?></span>
					</button>
			
	   </div>

   		<div class="cart-action-complete" style="display:none;">
				<p class="text-success">
					<?php echo JText::_('J2STORE_ITEM_ADDED_TO_CART');?>
					<a href="<?php echo $this->product->checkout_link; ?>" class="j2store-checkout-link">
						<?php echo JText::_('J2STORE_CHECKOUT'); ?>
					</a>
				</p>
		</div>
	<?php else: ?>
			<input value="<?php echo JText::_('J2STORE_OUT_OF_STOCK'); ?>" type="button" class="j2store_button_no_stock btn btn-warning" />
	<?php endif; ?>

	

	<input type="hidden" name="option" value="com_j2store" />
	<input type="hidden" name="view" value="carts" />
	<input type="hidden" name="task" value="addItem" />
	<input type="hidden" name="ajax" value="0" />
	<?php echo JHTML::_( 'form.token' ); ?>
	<input type="hidden" name="return" value="<?php echo base64_encode( JUri::getInstance()->toString() ); ?>" />
	<div class="j2store-notifications"></div>
