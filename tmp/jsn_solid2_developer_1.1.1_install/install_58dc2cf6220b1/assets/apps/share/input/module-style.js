/**
 * @version    $Id$
 * @package    SUN Framework
 * @subpackage Layout Builder
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

window.SunFwInputModuleStyle = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: '',
			options: [],
		};
	},

	handleComponentWillMount: function( state ) {
		// Load Chosen.
		this.initChosen( true );

		// Set loading state.
		this.loading = true;

		// Get list of module stypes to choose from.
		var styleID = document.getElementById( 'jsn-style-id'  ).value,
			token = document.getElementById( 'jsn-tpl-token' ).value,
			templateName = document.getElementById( 'jsn-tpl-name' ).value;

		SunFwHelper.requestUrl(
			'index.php?option=com_ajax&plugin=sunfw&action=getModuleStyle&style_id=' + styleID + '&' + token + '=1&template_name=' + templateName + '&format=json',
			function( req ) {
				var response = JSON.parse( req.responseText );

				// Unset loading state.
				this.loading = false;

				if ( response && response.type == 'success' ) {
					this.setState( { options: response.data } );
				}
			}.bind( this )
		);

		return state;
	},

	render: function() {
		var options = [], selected;

		options.push(
			<option value="">
				{ sunfw.text[ this.loading ? 'loading' : 'select-module-style' ] }
			</option>
		);

		this.state.options.map( ( option ) => {
			selected = this.state.value == option.value ? true : false;

			options.push(
				<option value={ option.value } selected={ selected }>
					{ option.text }
				</option>
			);

			this.hasOptions || ( this.hasOptions = true );
		} );

		return (
			<div
				key={ this.props.id }
				ref="wrapper"
				className="form-group"
			>
				<label>
					{ sunfw.text[ this.props.control.label ] || this.props.control.label }
					{ this.parent.tooltip }
				</label>

				<select
					id={ this.props.id }
					ref="field"
					name={ this.props.setting }
					onChange={ this.parent.change }
					className="form-control"
				>
					{ options }
				</select>
				<p className="alert alert-info margin-top-15">
					{ sunfw.text[ 'module-style-message' ] }
				</p>
			</div>
		);
	},

	handleInitActions: function() {
		if ( this.refs.field && this.hasOptions ) {
			// Init Chosen for select box.
			this.initChosen( false, { disable_search: false } );
		}
	}
} );
