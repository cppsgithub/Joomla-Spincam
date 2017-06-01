window.SunFwInputEditor = React.extendClass('SunFwMixinInput', {
	render: function () {
		return React.createElement(
			"div",
			{
				key: this.props.id,
				className: "form-group"
			},
			React.createElement(
				"label",
				null,
				this.label,
				this.tooltip
			),
			React.createElement("textarea", {
				ref: "field",
				name: this.props.setting,
				value: this.state.value,
				onChange: this.change,
				className: "hidden"
			}),
			React.createElement(
				"button",
				{
					onClick: this.popupForm,
					className: "btn btn-default btn-block"
				},
				SunFwString.parse('set-html-content')
			)
		);
	},
	popupForm: function () {
		var href = SunFw.urls.widgetBase + '&sunfwwidget=editor&action=index',
		modal = SunFwModal.get({
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
		});
		modal.setState({
			buttons: [{
				text: 'ok',
				onClick: function () {
					var iframeWindow = modal.refs.mountedDOMNode.querySelector('iframe').contentWindow,
					    content = iframeWindow.document.getElementById('editor').value;
					if (iframeWindow.tinyMCE !== undefined) {
						content = iframeWindow.tinyMCE.activeEditor.getContent();
					} else if (iframeWindow.CodeMirror !== undefined) {
						content = iframeWindow.Joomla.editors.instances['editor'].getValue();
					}
					this.setState({ value: content });
					this.change(this.props.setting, content);
					modal.close();
				}.bind(this),
				className: 'btn btn-primary'
			}, {
				text: 'cancel',
				onClick: modal.close,
				className: 'btn btn-default'
			}]
		});
		var setContent = function () {
			if (modal.refs.iframe) {
				if (modal.refs.iframe.contentWindow) {
					if (modal.refs.iframe.contentWindow.sunFwEditorSetContent) {
						return modal.refs.iframe.contentWindow.sunFwEditorSetContent(this.state.value);
					}
				}
			}
			setTimeout(setContent, 100);
		}.bind(this);
		setContent();
	}
});