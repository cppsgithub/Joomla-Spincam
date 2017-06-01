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

window.SunFwInputEditor = React.createClass( {
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

				<textarea
					id={ this.props.id }
					ref="field"
					name={ this.props.setting }
					value={ this.state.value }
					onChange={ this.parent.change }
		 			className="hidden"
				></textarea>

				<button
					onClick={ this.editContent }
					className="btn btn-default btn-block"
				>
					{ sunfw.text['set-html-content'] }
				</button>
			</div>
		);
	},

	editContent: function( event ) {
		event.preventDefault();

		// Generate link to load editor.
		var styleID = document.getElementById( 'jsn-style-id'  ).value,
			token = document.getElementById( 'jsn-tpl-token' ).value,
			templateName = document.getElementById( 'jsn-tpl-name' ).value,

		href = 'index.php?sunfwwidget=editor&action=index&author=joomlashine&rformat=raw'
			+ '&style_id=' + styleID + '&' + token + '=1&template_name=' + templateName,

		// Get a modal to show form.
		modal = this.editor.getModal( {
			id: 'html_content_modal',
			title: 'html-content',
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
					text: 'ok',
					onClick: function() {
						var iframeWindow = modal.refs.modal.querySelector('iframe').contentWindow,
							content = iframeWindow.document.getElementById('editor').value;

						if ( iframeWindow.tinyMCE !== undefined ) {
							content = iframeWindow.tinyMCE.activeEditor.getContent();
						} else if ( iframeWindow.CodeMirror !== undefined ) {
							content = iframeWindow.Joomla.editors.instances['editor'].getValue();
						}

						// Update component state.
						this.setState( { value: content } );

						// Update parent settings.
						this.parent.change( this.props.setting, content );

						// Close the modal.
						modal.close();
					}.bind( this ),
					className: 'btn btn-primary'
				},
				{
					text: 'cancel',
					onClick: modal.close,
					className: 'btn btn-default'
				}
			]
		} );

		// Set current content to editor.
		var setContent = function() {
			if (modal.refs.iframe) {
				if (modal.refs.iframe.contentWindow) {
					if (modal.refs.iframe.contentWindow.sunFwEditorSetContent) {
						// Set new content for editor.
						return modal.refs.iframe.contentWindow.sunFwEditorSetContent(this.state.value);
					}
				}
			}

			setTimeout(setContent, 100);
		}.bind(this);

		setContent();
	}
} );
