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
 * Layout custom form field.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class JFormFieldLayout extends JFormField
{
	/**
	 * Define default supported screens.
	 *
	 * @var array
	 */
	protected static $screens = array(
		'lg' => 'SUNFW_DESKTOP',
		'md' => 'SUNFW_LATOP',
		'sm' => 'SUNFW_TABLET',
		'xs' => 'SUNFW_SMARTPHONE',
	);

	/**
	 * Define default layout builder offcanvas positions.
	 *
	 * @var array
	 */
	protected static $offcanvas = array(
		'top'    => 'SUNFW_OFFCANVAS_TOP',
		'right'  => 'SUNFW_OFFCANVAS_RIGHT',
		'bottom' => 'SUNFW_OFFCANVAS_BOTTOM',
		'left'   => 'SUNFW_OFFCANVAS_LEFT',
	);

	/**
	 * Define default supported items.
	 *
	 * @var array
	 */
	protected static $items_path = 'assets/apps/layout-builder/items';

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
	protected static $fields_path = array(
		'assets/apps/share/input',
		'assets/apps/layout-builder/input',
	);

	/**
	 * Define default supported input fields.
	 *
	 * @var array
	 */
	protected static $fields = array();

	/**
	 * Define prebuilt layouts.
	 *
	 * @var array
	 */
	protected static $layouts = array();

	/**
	 * Prepare supported screens.
	 *
	 * @return array
	 */
	protected function getScreens()
	{
		$screens = $this->getAttribute( 'screens', array_keys( self::$screens ) );

		if ( ! is_array( $screens ) )
		{
			$screens = array_map( 'trim', explode( ',', $screens ) );
		}

		foreach ( $screens as $k => $v )
		{
			if ( is_int( $k ) && isset( self::$screens[ $v ] ) )
			{
				$screens[ $v ] = JText::_( self::$screens[ $v ] );

				unset( $screens[ $k ] );
			}
		}

		return $screens;
	}

	/**
	 * Prepare supported offcanvas positions.
	 *
	 * @return array
	 */
	protected function getOffcanvas()
	{
		$offcanvas = $this->getAttribute( 'offcanvas', array_keys( self::$offcanvas ) );

		if ( ! is_array( $offcanvas ) )
		{
			$offcanvas = array_map( 'trim', explode( ',', $offcanvas ) );
		}

		foreach ( $offcanvas as $k => $v )
		{
			if ( is_int( $k ) && isset( self::$offcanvas[ $v ] ) )
			{
				$offcanvas[ $v ] = JText::_( self::$offcanvas[ $v ] );

				unset( $offcanvas[ $k ] );
			}
		}

		return $offcanvas;
	}

	/**
	 * Prepare supported layout builder items.
	 *
	 * @return array
	 */
	protected function getItems()
	{
		// Get all available layout builder's items.
		if ( ! count( self::$items ) )
		{
			self::$items = array(
				'logo'            => '',
				'menu'            => '',
				'module-position' => '',
				'joomla-module'   => '',
				'page-content'    => '',
				'social-icon'     => '',
				'custom-html'     => '',
				'flexible-space'  => '',
			);

			foreach ( ( array ) self::$items_path as $items_path )
			{
				foreach ( glob( SUNFW_PATH . '/' . $items_path . '/*.js' ) as $item )
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

		// Prepare layout builder's supported items.
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
		// Get all available layout builder's editable fields.
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

		// Prepare layout builder's supported editable fields.
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
	 * Prepare prebuilt layouts.
	 *
	 * @return  array
	 */
	protected function getLayouts()
	{
		// Get all available layout builder's prebuilt layouts.
		if ( ! count( self::$layouts ) )
		{
			// Loop thru supported directories to look for prebuilt layouts.
			$directories = SunFwHelper::getLayoutDirectories( SunFwAdmin::getInstance()->template );

			foreach ( $directories as $directory )
			{
				foreach ( glob( "{$directory}/*.json" ) as $layout )
				{
					if ( is_file( $layout ) )
					{
						$name = substr( basename( $layout ), 0, -5 );
						$text = 'SUNFW_PREBUILD_LAYOUT_' . strtoupper( str_replace( '-', '_', $name ) );
						$file = str_replace( '\\', '/', str_replace( JPATH_ROOT, '', $layout ) );

						if ( $text == JText::_( $text ) )
						{
							$text = trim( preg_replace( '/([A-Z])/', ' \\1', $name ) );

							if ( preg_match( '/[^a-zA-Z0-9]/', $text ) )
							{
								$text = preg_replace( '/[^a-zA-Z0-9]+/', ' ', $text );
							}

							$text = ucwords( $text );
						}

						self::$layouts[ $name ] = array(
							'label' => $text,
							'file'  => $file,
						);
					}
				}
			}
		}

		// Prepare layout builder's supported prebuilt layouts.
		$layouts = $this->getAttribute( 'layouts', array_keys( self::$layouts ) );

		if ( ! is_array( $layouts ) )
		{
			$layouts = array_map( 'trim', explode( ',', $layouts ) );
		}

		foreach ( $layouts as $k => $v )
		{
			if ( is_int( $k ) && isset( self::$layouts[ $v ] ) )
			{
				$layouts[ $v ] = self::$layouts[ $v ];

				unset( $layouts[ $k ] );
			}
		}

		return $layouts;
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

		// Print HTML for the layout builder field.
		ob_start();
		?>
		<div id="<?php echo $this->id; ?>"></div>
		<script type="text/babel">
			(function($) {
				$(document).ready(function() {
					function init_layout() {
						setTimeout( function() {
							if ( ! window.SunFwLayout ) {
								var <?php echo $this->id; ?> = {
									items: <?php echo json_encode( $this->getItems() ); ?>,
									screens: <?php echo json_encode( $this->getScreens() ); ?>,
									layouts: <?php echo json_encode( $this->getLayouts() ); ?>,
									editable: <?php echo json_encode( $this->getFields() ); ?>,
									offcanvas: <?php echo json_encode( $this->getOffcanvas() ); ?>,
								};

								window.SunFwLayout = ReactDOM.render(
									<LayoutBuilder
										id="<?php echo $this->name; ?>"
										items={ <?php echo $this->id; ?>.items }
										screens={ <?php echo $this->id; ?>.screens }
										layouts={ <?php echo $this->id; ?>.layouts }
										editable={ <?php echo $this->id; ?>.editable }
										offcanvas={ <?php echo $this->id; ?>.offcanvas }
										style_id="<?php echo $this->input->getInt( 'id', 0 ); ?>"
									/>,
									document.getElementById('<?php echo $this->id; ?>')
								);
							} else {
								SunFwLayout.forceUpdate();
							}
						}, 5 );
					}

					$('a[data-toggle="tab"]').on( 'shown.bs.tab', function(event) {
						var target = event.target;

						if ( target.href.substr( -7 ) == '#layout' ) {
							init_layout();
						}
					} );

					init_layout();
				});
			})(jQuery);
		</script>
		<?php
		$html = ob_get_contents();

		ob_end_clean();

		return $html;
	}
}
