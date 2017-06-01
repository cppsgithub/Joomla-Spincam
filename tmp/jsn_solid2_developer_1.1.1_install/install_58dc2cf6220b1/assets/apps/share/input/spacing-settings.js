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

window.SunFwInputSpacingSettings = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: {
				top: '',
				left: '',
				right: '',
				bottom: '',
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
			this.value = ( this.state.value.top ? this.state.value.top + 'px' : '-' )
				+ ' ' + ( this.state.value.right ? this.state.value.right + 'px' : '-' )
				+ ' ' + ( this.state.value.bottom ? this.state.value.bottom + 'px' : '-' )
				+ ' ' + ( this.state.value.left ? this.state.value.left + 'px' : '-' );
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
						<a href="#" onClick={ this.popupForm.bind( this, this.props.control.label + '-settings' ) }>
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
								top: {
									type: 'slider',
									label: this.props.control.label + '-top',
									suffix: 'px'
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								bottom: {
									type: 'slider',
									label: this.props.control.label + '-bottom',
									suffix: 'px'
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								left: {
									type: 'slider',
									label: this.props.control.label + '-left',
									suffix: 'px'
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								right: {
									type: 'slider',
									label: this.props.control.label + '-right',
									suffix: 'px'
								}
							}
						}
					]
				}
			]
		};
	}
} );
