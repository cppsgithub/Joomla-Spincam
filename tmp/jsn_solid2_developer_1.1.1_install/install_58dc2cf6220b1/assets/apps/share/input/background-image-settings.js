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

window.SunFwInputBackgroundImageSettings = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: {
				size: '',
				repeat: '',
				position: '',
				attachment: '',
			},
		};
	},

	render: function() {
		// Prepare value.
		if ( typeof this.state.value != 'object' || ( this.state.value instanceof Array ) ) {
			this.state.value = {};
		}

		if ( ! this.openingModal ) {
			// Build representation string.
			this.value = ( this.state.value.position ? this.state.value.position : '-' )
				+ ' ' + ( this.state.value.size ? ( ( this.state.value.position != '' ? '/' : '' ) + this.state.value.size ) : '-' )
				+ ' ' + ( this.state.value.repeat ? this.state.value.repeat : '-' )
				+ ' ' + ( this.state.value.attachment ? this.state.value.attachment : '-' );
		}

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

				<div className="input-group snfw-input-popup">
					<input
						id={ this.props.id }
						ref="field"
						name={ this.props.setting }
						value={ this.value }
						disabled="disabled"
						className="form-control"
					/>
					<span className="input-group-addon">
						<a href="#" onClick={ this.popupForm.bind( this, 'background-image-settings' ) }>
							...
						</a>
					</span>
					<span className="input-group-addon">
						<a href="#" onClick={ this.resetState }>
							<i className="fa fa-remove"></i>
						</a>
					</span>
				</div>
			</div>
		);
	},

	popupData: function() {
		return {
			rows: [
				{
					cols: [
						{
							'class': 'col-xs-6',
							settings: {
								repeat: {
									type: 'select',
									chosen: false,
									label: 'background-repeat',
									options: [
										{ label: 'initial', value: 'initial' },
										{ label: 'repeat', value: 'repeat' },
										{ label: 'repeat-x', value: 'repeat-x' },
										{ label: 'repeat-y', value: 'repeat-y' },
										{ label: 'no-repeat', value: 'no-repeat' },
										{ label: 'inherit', value: 'inherit' }
									]
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								size: {
									type: 'select',
									chosen: false,
									label: 'background-size',
									options: [
										{ label: 'initial', value: 'initial' },
										{ label: 'auto', value: 'auto' },
										{ label: 'cover', value: 'cover' },
										{ label: 'contain', value: 'contain' },
										{ label: 'inherit', value: 'inherit' }
									]
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								attachment: {
									type: 'select',
									chosen: false,
									label: 'background-attachment',
									options: [
										{ label: 'initial', value: 'initial' },
										{ label: 'scroll', value: 'scroll' },
										{ label: 'fixed', value: 'fixed' },
										{ label: 'local', value: 'local' },
										{ label: 'inherit', value: 'inherit' }
									]
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								position: {
									type: 'select',
									chosen: false,
									label: 'background-position',
									options: [
										{ label: 'initial', value: 'initial' },
										{ label: 'left top', value: 'left top' },
										{ label: 'left center', value: 'left center' },
										{ label: 'left bottom', value: 'left bottom' },
										{ label: 'right top', value: 'right top' },
										{ label: 'right center', value: 'right center' },
										{ label: 'right bottom', value: 'right bottom' },
										{ label: 'center top', value: 'center top' },
										{ label: 'center center', value: 'center center' },
										{ label: 'center bottom', value: 'center bottom' },
										{ label: 'inherit', value: 'inherit' }
									]
								}
							}
						}
					]
				}
			]
		};
	}
} );
