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

window.SunFwInputBorderSettings = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: {
				universal: '1',
				width: '',
				style: '',
				color: '',
				'top-width': '',
				'top-style': '',
				'top-color': '',
				'right-width': '',
				'right-style': '',
				'right-color': '',
				'bottom-width': '',
				'bottom-style': '',
				'bottom-color': '',
				'left-width': '',
				'left-style': '',
				'left-color': '',
			},
		};
	},

	render: function() {
		// Prepare value.
		if ( typeof this.state.value != 'object' || ( this.state.value instanceof Array ) ) {
			this.state.value = {
				universal: '1'
			};
		} else {
			this.state.value = {
				universal: '0'
			};
		}

		if ( ! this.openingModal ) {
			// Build representation string.
			this.value = ( this.state.value.width ? this.state.value.width + 'px' : '-' )
				+ ' ' + ( this.state.value.style ? this.state.value.style : '-' )
				+ ' ' + ( this.state.value.color ? this.state.value.color : '-' );
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
						<a href="#" onClick={ this.popupForm.bind( this, 'border-settings' ) }>
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
		var popup = {
			rows: [
				{
					'class': 'separator-after',
					cols: [
						{
							'class': 'col-xs-12',
							settings: {
								universal: {
									type: 'radio',
									inline: true,
									options: [
										{
											label: 'universal-settings',
											value: 1
										},
										{
											label: 'individual-settings',
											value: 0
										}
									]
								}
							}
						}
					]
				},
				{
					cols: [
						{
							'class': 'col-xs-4',
							settings: {
								width: {
									type: 'number',
									label: 'border-width',
									suffix: 'px'
								}
							}
						},
						{
							'class': 'col-xs-4',
							settings: {
								style: {
									type: 'select',
									chosen: false,
									label: 'border-style',
									options: [
										{ label: 'initial', value: 'initial' },
										{ label: 'none', value: 'none' },
										{ label: 'hidden', value: 'hidden' },
										{ label: 'dotted', value: 'dotted' },
										{ label: 'dashed', value: 'dashed' },
										{ label: 'solid', value: 'solid' },
										{ label: 'double', value: 'double' },
										{ label: 'groove', value: 'groove' },
										{ label: 'ridge', value: 'ridge' },
										{ label: 'inset', value: 'inset' },
										{ label: 'outset', value: 'outset' },
										{ label: 'inherit', value: 'inherit' }
									]
								}
							}
						},
						{
							'class': 'col-xs-4',
							settings: {
								color: {
									type: 'color-picker',
									label: 'border-color'
								}
							}
						}
					],
					requires: {
						universal: 1
					}
				}
			]
		};

		['top', 'right', 'bottom', 'left'].map( ( pos ) => {
			var width = {}, style = {}, color = {};

			width[ pos + '-width' ] = {
				type: 'number',
				label: 'border-width',
				suffix: 'px'
			};

			style[ pos + '-style' ] = {
				type: 'select',
				chosen: false,
				label: 'border-style',
				options: [
					{ label: 'initial', value: 'initial' },
					{ label: 'none', value: 'none' },
					{ label: 'hidden', value: 'hidden' },
					{ label: 'dotted', value: 'dotted' },
					{ label: 'dashed', value: 'dashed' },
					{ label: 'solid', value: 'solid' },
					{ label: 'double', value: 'double' },
					{ label: 'groove', value: 'groove' },
					{ label: 'ridge', value: 'ridge' },
					{ label: 'inset', value: 'inset' },
					{ label: 'outset', value: 'outset' },
					{ label: 'inherit', value: 'inherit' }
				]
			};

			color[ pos+ '-color' ] = {
				type: 'color-picker',
				label: 'border-color'
			};

			popup.rows.push( {
				title: 'border-' + pos,
				cols: [
					{
						'class': 'col-xs-4',
						settings: width
					},
					{
						'class': 'col-xs-4',
						settings: style
					},
					{
						'class': 'col-xs-4',
						settings: color
					}
				],
				requires: {
					universal: 0
				}
			} );
		} );

		return popup;
	}
} );
