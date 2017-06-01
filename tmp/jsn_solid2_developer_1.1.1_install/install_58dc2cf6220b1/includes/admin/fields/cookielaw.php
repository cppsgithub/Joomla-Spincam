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
 * Cookie law custom form field.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class JFormFieldCookieLaw extends JFormField
{
	/**
	 * Define default supported input fields.
	 *
	 * @var array
	 */
	protected static $fields_path = array(
		'assets/apps/share/input',
		'assets/apps/cookie-law/input',
	);

	/**
	 * Define default supported input fields.
	 *
	 * @var array
	 */
	protected static $fields = array();

	/**
	 * Prepare custom editable fields.
	 *
	 * @return array
	 */
	protected function getFields()
	{
		// Get all available cookie law's editable fields.
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

		// Prepare cookie law's supported editable fields.
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

		// Print HTML for the cookie law field.
		ob_start();
		?>
		<div id="<?php echo $this->id; ?>"></div>
		<script type="text/babel">
			(function($) {
				$(document).ready(function() {
					function init_cookie_law() {
						setTimeout( function() {
							var tab = document.getElementById( 'cookie-law' );

							if ( tab.classList.contains( 'active' ) ) {
								if ( ! window.SunFwCookieLaw ) {
									var <?php echo $this->id; ?> = {
										editable: <?php echo json_encode( $this->getFields() ); ?>,
									};

									window.SunFwCookieLaw = window.SunFwCookieLaw || ReactDOM.render(
										<CookieLaw
											id="<?php echo $this->name; ?>"
											editable={ <?php echo $this->id; ?>.editable }
											style_id="<?php echo $this->input->getInt( 'id', 0 ); ?>"
										/>,
										document.getElementById('<?php echo $this->id; ?>')
									);
								} else {
									SunFwCookieLaw.forceUpdate();
								}
							}
						}, 5 );
					}

					$('a[data-toggle="tab"]').on( 'shown.bs.tab', function(event) {
						var target = event.target;

						if ( target.href.substr( -11 ) == '#cookie-law' ) {
							init_cookie_law();
						}
					} );

					init_cookie_law();
				});
			})(jQuery);
		</script>
		<?php
		$html = ob_get_contents();

		ob_end_clean();

		return $html;
	}
}
