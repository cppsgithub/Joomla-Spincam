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

window.SunFwInputCustomFont = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: '',
		};
	},

	render: function() {
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
						value={ this.state.value }
						disabled="disabled"
						className="form-control"
					/>
					<span className="input-group-addon">
						<a href="#" onClick={ this.selectFont }>
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

	selectFont: function( event ) {
		event.preventDefault();

		// Generate link to choose font file.
		var styleID = document.getElementById( 'jsn-style-id'  ).value,
			token = document.getElementById( 'jsn-tpl-token' ).value,
			templateName = document.getElementById( 'jsn-tpl-name' ).value,

		href = 'index.php?sunfwwidget=fonts&action=index&author=joomlashine&rformat=raw&handler=jInsertFieldValue'
			+ '&style_id=' + styleID + '&' + token + '=1&template_name=' + templateName + '&selected=' + this.state.value,

		// Get a modal to show form.
		modal = this.editor.getModal( {
			id: 'file_manager_modal',
			title: 'choose-custom-font',
			height: '90%',
			type: 'iframe',
			content: {
				src: href,
				height: '100%',
				width: '100%'
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

		// Define functions to save selected font and close modal.
		top.jInsertFieldValue = function( value ) {
			// Update component state.
			this.setState( { value: value } );

			// Update parent settings.
			this.parent.change( this.props.setting, value );

			// Close the modal.
			modal.close();
		}.bind( this );
	}
} );
