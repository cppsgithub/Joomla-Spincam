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
 * Styles custom form field.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class JFormFieldStyles extends JFormField
{
	/**
	 * Define default supported items.
	 *
	 * @var array
	 */
	protected static $items_path = 'assets/apps/style-editor/items';

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
		'assets/apps/style-editor/input',
	);

	/**
	 * Define default supported input fields.
	 *
	 * @var array
	 */
	protected static $fields = array();

	/**
	 * Define prebuilt styles.
	 *
	 * @var array
	 */
	protected static $styles = array();

	/**
	 * Prepare supported style editor items.
	 *
	 * @return array
	 */
	protected function getItems()
	{
		// Get all available style editor's items.
		if ( ! count( self::$items ) )
		{
			foreach ( ( array ) self::$items_path as $items_path )
			{
				foreach ( glob( SUNFW_PATH . '/' . $items_path . '/*.js' ) as $item )
				{
					$type = substr( basename( $item ), 0, -3 );
					$text = strtoupper( str_replace( '-', '_', $type ) );
					$file = str_replace( '\\', '/', str_replace( SUNFW_PATH, '', $item ) );

					// Generate a random stirng to prevent client browser from caching script file.
					self::$items[ $type ] = array(
						'label' => JText::_( 'SUNFW_ITEM_' . $text ),
						'icon'  => JText::_( 'SUNFW_ITEM_' . $text . '_ICON' ),
						'file'  => $file,
					);
				}
			}
		}

		// Prepare style editor's supported items.
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
		// Get all available style editor's editable fields.
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

		// Prepare style editor's supported editable fields.
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
	 * Prepare prebuilt styles.
	 *
	 * @return  array
	 */
	protected function getStyles()
	{
		// Get all available style editor's prebuilt styles.
		if ( ! count( self::$styles ) )
		{
			$app 			= JFactory::getApplication();
			$input 			= $app->input;
			$styleID 		= $input->getInt( 'id', 0 );
			$style 			= SunFwHelper::getSunFwStyle( $styleID );
			// Loop thru supported directories to look for prebuilt styles.
			$directories = SunFwHelper::getStyleDirectories( SunFwAdmin::getInstance()->template, false, $style );

			foreach ( $directories as $directory )
			{
				foreach ( glob( "{$directory}/*.json" ) as $style )
				{
					if ( is_file( $style ) )
					{
						$name = substr( basename( $style ), 0, -5 );
						$text = 'SUNFW_PREBUILD_STYLE_' . strtoupper( str_replace( '-', '_', $name ) );
						$file = str_replace( '\\', '/', str_replace( JPATH_ROOT, '', $style ) );

						$thumbName = JFilterOutput::stringURLSafe($text);
						// Prepare text label.
						if ( $text == JText::_( $text ) )
						{
							$text = trim( preg_replace( '/([A-Z])/', ' \\1', $name ) );

							if ( preg_match( '/[^a-zA-Z0-9]/', $text ) )
							{
								$text = preg_replace( '/[^a-zA-Z0-9]+/', ' ', $text );
							}

							$text = ucwords( $text );
						}

						// Look for thumbnail file.
						$thumb = 'https://placeholdit.imgix.net/~text?txtsize=30&txt=320%C3%97240&w=320&h=240';

						foreach ( array( 'png', 'jpg', 'gif', 'bmp' ) as $ext )
						{
							if ( is_file( JPATH_ROOT . dirname( $file ) . "/{$thumbName}.{$ext}" ) )
							{
								$thumb = dirname( $file ) . "/{$thumbName}.{$ext}";
								$thumb = str_replace( '\\', '/', $thumb);
								$thumb = JUri::root(true) . $thumb;
							}
						}

						self::$styles[ $name ] = array(
							'label' => $text,
							'file'  => $file,
							'thumb' => $thumb,
						);
					}
				}
			}
		}

		// Prepare style editor's supported prebuilt styles.
		$styles = $this->getAttribute( 'styles', array_keys( self::$styles ) );

		if ( ! is_array( $styles ) )
		{
			$styles = array_map( 'trim', explode( ',', $styles ) );
		}

		foreach ( $styles as $k => $v )
		{
			if ( is_int( $k ) && isset( self::$styles[ $v ] ) )
			{
				$styles[ $v ] = self::$styles[ $v ];

				unset( $styles[ $k ] );
			}
		}

		return $styles;
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

		// Print HTML for the style editor field.
		ob_start();
		?>
		<div id="<?php echo $this->id; ?>"></div>
		<script type="text/babel">
			(function($) {
				$(document).ready(function() {
					function init_styles() {
						setTimeout( function() {
							var tab = document.getElementById( 'styles' );

							if ( tab.classList.contains( 'active' ) ) {
								if ( ! window.SunFwStyle ) {
									var <?php echo $this->id; ?> = {
										items: <?php echo json_encode( $this->getItems() ); ?>,
										styles: <?php echo json_encode( $this->getStyles() ); ?>,
										editable: <?php echo json_encode( $this->getFields() ); ?>,
									};

									window.SunFwStyle = ReactDOM.render(
										<StyleEditor
											id="<?php echo $this->name; ?>"
											items={ <?php echo $this->id; ?>.items }
											styles={ <?php echo $this->id; ?>.styles }
											editable={ <?php echo $this->id; ?>.editable }
											style_id="<?php echo $this->input->getInt( 'id', 0 ); ?>"
										/>,
										document.getElementById('<?php echo $this->id; ?>')
									);
								} else {
									SunFwStyle.forceUpdate();
								}
							}
						}, 5 );
					}

					$('a[data-toggle="tab"]').on( 'shown.bs.tab', function(event) {
						var target = event.target;

						if ( target.href.substr( -7 ) == '#styles' ) {
							init_styles();
						}
					} );

					init_styles();
				});
			})(jQuery);
		</script>
		<?php
		$html = ob_get_contents();

		ob_end_clean();

		return $html;
	}
}
