window.SunFwInputChooseImage = React.extendClass('SunFwMixinInput', {
	render: function () {
		return this.renderPopupInput();
	},
	popupForm: function () {
		var href = SunFw.urls.widgetBase + '&sunfwwidget=images&action=index&handler=jInsertFieldValue',
		modal = SunFwModal.get({
			id: 'file_manager_modal',
			title: 'choose-image',
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
				text: 'close',
				onClick: modal.close,
				className: 'btn btn-default'
			}]
		});
		top.jInsertFieldValue = function (value) {
			this.setState({ value: value });
			this.change(this.props.setting, value);
			modal.close();
		}.bind(this);
	}
});