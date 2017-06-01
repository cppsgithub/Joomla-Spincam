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

window.SunFwInputModulePosition = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: '',
			options: [],
			position: '',
		};
	},

	handleComponentWillMount: function( state ) {
		// Load Chosen.
		this.initChosen( true );

		// Set loading state.
		this.loading = true;

		// Get list of menu positions to choose from.
		var styleID = document.getElementById( 'jsn-style-id'  ).value,
			token = document.getElementById( 'jsn-tpl-token' ).value,
			templateName = document.getElementById( 'jsn-tpl-name' ).value;

		SunFwHelper.requestUrl(
			'index.php?option=com_ajax&plugin=sunfw&action=getTemplatePosition&style_id=' + styleID + '&' + token + '=1&template_name=' + templateName + '&format=json',
			function( req ) {
				var response = JSON.parse( req.responseText );

				// Unset loading state.
				this.loading = false;

				if ( response && response.type == 'success' ) {
					this.setState( { options: response.data } );
				}
			}.bind( this )
		);

		return state
	},

	render: function() {
		var options = [], selected;

		if ( this.loading ) {
			options.push(
				<option value="">
					{ sunfw.text['loading'] }
				</option>
			);
		}

		this.state.options.map( ( option ) => {
			selected = this.state.value == option.value ? true : false;

			options.push(
				<option value={ option.value } selected={ selected }>
					{ option.name }
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

				<button
					type="button"
					onClick={ this.popupForm.bind( this, 'create-position' ) }
					className="btn btn-default btn-block margin-top-15"
				>
					{ sunfw.text[ 'create-position' ] }
				</button>
			</div>
		);
	},

	handleInitActions: function() {
		if ( this.refs.field && this.hasOptions ) {
			// Init Chosen for select box.
			this.initChosen( false, { disable_search: false } );
		}
	},

	handleComponentDidUpdate: function() {
		if ( this.updateParent ) {
			// Update parent settings.
			this.parent.change( this.refs.field );

			this.updateParent = false;
		}
	},

	updateState: function( values ) {
		this.setState( { position: values.position } );
	},

	handleSaveSettings: function( values ) {
		var styleID = document.getElementById( 'jsn-style-id'  ).value,
			token = document.getElementById( 'jsn-tpl-token' ).value,
			templateName = document.getElementById( 'jsn-tpl-name' ).value;

		SunFwHelper.requestUrl(
			'index.php?option=com_ajax&plugin=sunfw&action=saveTemplatePosition&style_id=' + styleID + '&' + token + '=1&template_name=' + templateName + '&format=json',
			function( req ) {
				var response = JSON.parse( req.responseText );

				if ( response && response.type == 'success' ) {
					// State that parent should be updated.
					this.updateParent = true;

					// Update options and value in component state.
					var options = this.state.options;

					options.push( {
						name: this.state.position,
						value: this.state.position,
					} );

					// Destroy Chosen instance to re-synchronize options.
					delete this.refs.field._initialized_chosen;

					jQuery( this.refs.field ).chosen( 'destroy' );

					this.setState( {
						value: this.state.position,
						options: options,
						position: ''
					} );
				} else {
					bootbox.alert( ( response && response.data ) ? response.data : req.responseText );
				}
			}.bind( this ),
			{ position: values.position }
		);
	},

	popupData: function() {
		return {
			form: {
				rows: [
					{
						cols: [
							{
								'class': 'col-xs-12',
								settings: {
									'position': {
										type: 'text',
										label: 'position-name'
									}
								}
							}
						]
					}
				]
			},
			values: { position: this.state.position }
		};
	}
} );
