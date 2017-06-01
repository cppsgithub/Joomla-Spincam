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

window.SunFwInputBoxShadowSettings = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: {
				blur: '',
				color: '#000000',
				inset: '',
				spread: '',
				'h-shadow': 0,
				'v-shadow': 0,
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
			this.value = ( this.state.value['h-shadow'] ? this.state.value['h-shadow'] + 'px' : '-' )
				+ ' ' + ( this.state.value['v-shadow'] ? this.state.value['v-shadow'] + 'px' : '-' )
				+ ' ' + ( this.state.value.blur ? this.state.value.blur + 'px' : '-' )
				+ ' ' + ( this.state.value.spread ? this.state.value.spread + 'px' : '-' )
				+ ' ' + ( this.state.value.color ? this.state.value.color : '-' )
				+ ' ' + ( this.state.value.inset ? this.state.value.inset : '-' );
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
						<a href="#" onClick={ this.popupForm.bind( this, 'box-shadow-settings' ) }>
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
								'h-shadow': {
									type: 'slider',
									label: 'box-shadow-h-shadow',
									suffix: 'px'
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								'v-shadow': {
									type: 'slider',
									label: 'box-shadow-v-shadow',
									suffix: 'px'
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								'blur': {
									type: 'slider',
									label: 'box-shadow-blur',
									suffix: 'px'
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								'spread': {
									type: 'slider',
									label: 'box-shadow-spread',
									suffix: 'px'
								}
							}
						},
						{
							'class': 'col-xs-6',
							settings: {
								'color': {
									type: 'color-picker',
									label: 'box-shadow-color'
								}
							}
						},
						{
							'class': 'col-xs-6 box-shadow-setting-inset',
							settings: {
								'inset': {
									type: 'radio',
									label: 'box-shadow-inset',
									inline: true,
									options: [
										{ label: 'yes', value: 'inset' },
										{ label: 'no', value: '' }
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
