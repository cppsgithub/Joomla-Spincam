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

window.SunFwInputSlider = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: '',
		};
	},

	render: function() {
		// Prepare suffix.
		var suffix = this.props.control.suffix;

		if ( sunfw.text[ suffix ] ) {
			suffix = sunfw.text[ suffix ];
		}

		if ( suffix ) {
			suffix = (
				<span className="input-group-addon" style={ { padding: '6px 12px' } }>
					{ suffix }
				</span>
			);
		}

		// Prepare value.
		var value = this.state.value;

		if ( ! value || value == '' ) {
			value = this.props.control['default'];

			if ( ! value || value == '' ) {
				value = 0;
			}
		}

		return (
			<div
				key={ this.props.id }
				ref="wrapper"
				className="form-group"
			>
				<label forName={ this.props.id }>
					{ sunfw.text[ this.props.control.label ] || this.props.control.label }
					{ this.parent.tooltip }
				</label>

				<div className="container-fluid">
					<div className="row sunfw-slider">
						<div className="col-xs-8" style={ { 'padding-left': 0 } }>
							<div className="form-group">
								<input
									id={ this.props.id }
									ref="field"
									min={ this.props.control.min ? this.props.control.min : 0 }
									max={ this.props.control.max ? this.props.control.max : 100 }
									step={ this.props.control.step ? this.props.control.step : 1 }
									type="range"
									name={ this.props.setting }
									value={ value }
									onChange={ this.parent.change }
									className="form-control"
								/>
							</div>
						</div>

						<div className="col-xs-4" style={ { padding: 0 } }>
							<div className="form-group">
								<div className="input-group">
									<input
										min={ this.props.control.min ? this.props.control.min : 0 }
										max={ this.props.control.max ? this.props.control.max : 100 }
										step={ this.props.control.step ? this.props.control.step : 1 }
										type="number"
										name={ this.props.setting }
										value={ value }
										style={ { 'padding-right': 0 } }
										onChange={ this.parent.change }
										className="form-control"
									/>
									{ suffix }
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
} );
