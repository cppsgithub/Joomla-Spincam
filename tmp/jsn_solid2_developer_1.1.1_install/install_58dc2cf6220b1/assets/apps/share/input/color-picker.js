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

window.SunFwInputColorPicker = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: '',
		};
	},

	handleComponentWillMount: function( state ) {
		// Load Spectrum.
		SunFwHelper.loadStylesheetFile( sunfw.sunfw_url + '/assets/3rd-party/spectrum/spectrum.css' );

		SunFwHelper.loadScriptFile(
			sunfw.sunfw_url + '/assets/3rd-party/spectrum/spectrum.js',
			this.handleInitActions
		);

		return state;
	},

	render: function() {
		var html;

		if ( this.props.control.custom_only !== true && ['main', 'sub'].indexOf( this.state.value ) > -1 ) {
			html = (
				<select
					key={ this.props.id + '-select-only' }
					name={ this.props.setting }
					onChange={ this.parent.change }
					className="form-control"
				>
					<option value="main" selected={ this.state.value == 'main' }>
						{ sunfw.text['color-picker-main-color'] }
					</option>
					<option value="sub" selected={ this.state.value == 'sub' }>
						{ sunfw.text['color-picker-sub-color'] }
					</option>
					<option value="custom">
						{ sunfw.text['color-picker-custom-color'] }
					</option>
				</select>
			);
		} else {
			var control;

			if ( this.props.control.custom_only === true ) {
				control = (
					<input
						type="text"
						name={ this.props.setting }
						value={ this.state.value != '' ? this.state.value : '' }
						onChange={ this.parent.change }
						className="form-control"
					/>
				);
			} else {
				control = (
					<select
						key={ this.props.id + '-select-with-picker' }
						name={ this.props.setting }
						onChange={ this.parent.change }
						className="form-control custom-input"
					>
						<option value="main">
							{ sunfw.text['color-picker-main-color'] }
						</option>
						<option value="sub">
							{ sunfw.text['color-picker-sub-color'] }
						</option>
						<option
							value={ ( this.state.value != '' && this.state.value != 'custom' ) ? this.state.value : 'custom' }
							selected={ true }
						>
							{ sunfw.text['color-picker-custom-color'] }
						</option>
					</select>
				);
			}

			html = (
				<div className="input-group">
					{ control }
					<span className="input-group-addon">
						<input
							id={ this.props.id }
							ref="field"
							type="hidden"
							name={ this.props.setting }
							value={ this.state.value != 'custom' ? this.state.value : '' }
							onChange={ this.parent.change }
						/>
					</span>
				</div>
			);
		}

		return (
			<div
				key={ this.props.id }
				ref="wrapper"
				className="form-group color-picker"
			>
				<label forName={ this.props.id }>
					{ sunfw.text[ this.props.control.label ] || this.props.control.label }
					{ this.parent.tooltip }
				</label>
				{ html }
			</div>
		);
	},

	handleInitActions: function() {
		if ( this.refs.field && jQuery.fn.spectrum !== undefined ) {
			// If color picker is initialized before, remove it.
			if ( this.refs.field.nextElementSibling && this.refs.field.nextElementSibling.classList.contains( 'sp-replacer' ) ) {
				jQuery( this.refs.field ).spectrum( 'destroy' );

				if ( this.refs.field.nextElementSibling && this.refs.field.nextElementSibling.classList.contains( 'sp-replacer' ) ) {
					this.refs.field.nextElementSibling.parentNode.removeChild( this.refs.field.nextElementSibling );
				}
			}

			jQuery( this.refs.field ).spectrum( {
				color: this.refs.field.value,
				showInput: true,
				showInitial: true,
				allowEmpty: this.props.control.allowempty ? this.props.control.allowempty : true,
				showAlpha: this.props.control.showalpha ? this.props.control.showalpha : true,
				clickoutFiresChange: true,
				preferredFormat: this.props.control.format ? this.props.control.format : 'hex',
				change: function( picker ) {
					// Call the parent's 'change' event handle.
					this.parent.change(
						this.props.setting,
						picker ? ( picker.getAlpha() == 1 ? picker.toHexString() : picker.toRgbString() ) : ''
					);
				}.bind( this ),
			} );
		}
	}
} );
