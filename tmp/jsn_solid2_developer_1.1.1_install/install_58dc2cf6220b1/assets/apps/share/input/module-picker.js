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
window.SunFwInputModulePicker = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: '',
		};
	},

	render: function() {
		// Generate HTML for button to configure module.
		var button;

		if ( this.state.value != '' ) {
			var module_id = this.state.value.split( ':' ).pop();

			if ( parseInt( module_id ) ) {
				button = (
					<a
						ref="link"
						href={ 'index.php?option=com_modules&task=module.edit&id=' + module_id }
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-block btn-default margin-top-15"
					>
						{ sunfw.text['configure-module'] }
					</a>
				);
			}
		}

		// Prepare module label.
		var value = this.state.value.split( ':' );

		value = value[0] + ( value[1] ? ' (ID: ' + value[1] + ')' : '' );

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
						value= { value }
						disabled="disabled"
						className="form-control"
						placeholder={ sunfw.text['select-module'] }
					/>
					<span className="input-group-addon">
						<a href="#" onClick={ this.selectModule }>
							...
						</a>
					</span>
					<span className="input-group-addon">
						<a href="#" onClick={ this.resetState }>
							<i className="fa fa-remove"></i>
						</a>
					</span>
				</div>

				{ button }
			</div>
		);
	},

	selectModule: function(event) {
		event.preventDefault();

		// Generate link to choose module.
		var styleID = document.getElementById( 'jsn-style-id'  ).value,
			token = document.getElementById( 'jsn-tpl-token' ).value,
			templateName = document.getElementById( 'jsn-tpl-name' ).value,

		href = 'index.php?sunfwwidget=modules&action=list&style_id=' + styleID + '&' + token + '=1&template_name=' + templateName + '&author=joomlashine&rformat=raw',

		// Get a modal to show form.
		modal = this.editor.getModal( {
			id: 'choose_module_modal',
			title: 'choose-module',
			height: '90%',
			type: 'iframe',
			content: {
				src: href,
				width: '100%',
				height: '100%'
			},
			'class': 'fixed'
		} );

		// Override default modal buttons.
		modal.setState( {
			buttons: [
				{
					text: 'close',
					onClick: modal.close,
					className: 'btn btn-default'
				}
			]
		} );

		// Define functions to save selected module and close modal.
		top.sunFwModulePickerInsert = function( id, name ) {
			// Update parent settings.
			this.parent.change( this.props.setting, name + ':' + id );
		}.bind( this );

		window.parent.sunFwModulePickerModalClose = function() {
			modal.close();
		};
	}
} );
