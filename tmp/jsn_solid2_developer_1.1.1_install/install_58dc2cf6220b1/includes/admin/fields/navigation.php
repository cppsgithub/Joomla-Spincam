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

/**
 * Navigation custom form field.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class JFormFieldNavigation extends JFormField
{
	/**
	 * Define menus.
	 *
	 * @var array
	 */
	protected static $menus = array();

	/**
	 * Define default supported items.
	 *
	 * @var array
	 */
	protected static $items_path = 'assets/apps/menu-builder/items';

	/**
	 * Define default supported items.
	 *
	 * @var array
	 */
	protected static $items = array();

	/**
	 * Define default supported input fields.
	 *
	 * @var array
	 */
	protected static $fields_path = 'assets/apps/share/input';

	/**
	 * Define default supported input fields.
	 *
	 * @var array
	 */
	protected static $fields = array();

	/**
	 * Prepare available menus.
	 *
	 * @return array
	 */
	protected function getMenus()
	{
		// Get all available menus once.
		if ( ! count( self::$menus ) )
		{
			foreach ( SunFwHelper::getAllAvailableMenus( true ) as $menu )
			{
				self::$menus[ $menu->value ] = $menu;
			}
		}

		return self::$menus;
	}

	/**
	 * Prepare supported mega menu items.
	 *
	 * @return array
	 */
	protected function getItems()
	{
		// Get all available mega menu's items.
		if ( ! count( self::$items ) )
		{
			self::$items = array(
				'image'           => '',
				'sub-menu'        => '',
				'module-position' => '',
				'joomla-module'   => '',
				'custom-html'     => '',
			);

			foreach ( ( array ) self::$items_path as $items_path )
			{
				foreach ( glob( SUNFW_PATH . '/' . $items_path . '/*' ) as $item )
				{
					$type = substr( basename( $item ), 0, -3 );
					$text = strtoupper( str_replace( '-', '_', $type ) );
					$file = str_replace( '\\', '/', str_replace( SUNFW_PATH, '', $item ) );

					self::$items[ $type ] = array(
						'label' => JText::_( 'SUNFW_ITEM_' . $text ),
						'icon'  => JText::_( 'SUNFW_ITEM_' . $text . '_ICON' ),
						'file'  => $file,
					);
				}
			}
		}

		// Prepare mega menu's supported items.
		$items = $this->getAttribute( 'items', array_keys( self::$items ) );

		if ( ! is_array( $items ) )
		{
			$items = array_map( 'trim', explode( ',', $items ) );
		}

		foreach ( $items as $k => $v )
		{
			if ( is_int( $k ) && isset( self::$items[ $v ] ) )
			{
				$items[ $v ] = self::$items[ $v ];

				unset( $items[ $k ] );
			}
		}

		return $items;
	}

	/**
	 * Prepare custom editable fields.
	 *
	 * @return array
	 */
	protected function getFields()
	{
		// Get all available mega menu's editable fields.
		if ( ! count( self::$fields ) )
		{
			foreach ( ( array ) self::$fields_path as $fields_path )
			{
				foreach ( glob( SUNFW_PATH . '/' . $fields_path . '/*.js' ) as $field )
				{
					if ( is_file( $field ) )
					{
						$type = substr( basename( $field ), 0, -3 );
						$file = str_replace( '\\', '/', str_replace( SUNFW_PATH, '', $field ) );

						// Generate a random number to prevent client browser from caching script file.
						self::$fields[ $type ] = array(
							'file'  => $file,
						);
					}
				}
			}
		}

		// Prepare mega menu's supported editable fields.
		$fields = $this->getAttribute( 'fields', array_keys( self::$fields ) );

		if ( ! is_array( $fields ) )
		{
			$fields = array_map( 'trim', explode( ',', $fields ) );
		}

		foreach ( $fields as $k => $v )
		{
			if ( is_int( $k ) && isset( self::$fields[ $v ] ) )
			{
				$fields[ $v ] = self::$fields[ $v ];

				unset( $fields[ $k ] );
			}
		}

		return $fields;
	}

	/**
	 * Return label for the input control.
	 *
	 * @return  string
	 */
	protected function getLabel ()
	{
		return;
	}

	/**
	 * Return HTML for the input control.
	 *
	 * @return  string
	 */
	protected function getInput()
	{
		// Get Joomla's input object.
		$this->input = JFactory::getApplication()->input;

		// Print HTML for the mega menu field.
		ob_start();
		?>
		<div id="<?php echo $this->id; ?>"></div>
		<script type="text/babel">
			(function($) {
				$(document).ready(function() {
					function init_navigation() {
						setTimeout( function() {
							var tab = document.getElementById( 'navigation' );

							if ( tab.classList.contains( 'active' ) ) {
								if ( ! window.SunFwMenu ) {
									var <?php echo $this->id; ?> = {
										menus: <?php echo json_encode( $this->getMenus() ); ?>,
										items: <?php echo json_encode( $this->getItems() ); ?>,
										editable: <?php echo json_encode( $this->getFields() ); ?>,
									};

									window.SunFwMenu = ReactDOM.render(
										<MenuBuilder
											id="<?php echo $this->name; ?>"
											menus={ <?php echo $this->id; ?>.menus }
											items={ <?php echo $this->id; ?>.items }
											editable={ <?php echo $this->id; ?>.editable }
											style_id="<?php echo $this->input->getInt( 'id', 0 ); ?>"
										/>,
										document.getElementById('<?php echo $this->id; ?>')
									);
								} else {
									SunFwMenu.forceUpdate();
								}
							}
						}, 5 );
					}

					$('a[data-toggle="tab"]').on( 'shown.bs.tab', function(event) {
						var target = event.target;

						if ( target.href.substr( -11 ) == '#navigation' ) {
							init_navigation();
						}
					} );

					init_navigation();
				});
			})(jQuery);
		</script>
		<?php
		$html = ob_get_contents();

		ob_end_clean();

		return $html;
	}
}
