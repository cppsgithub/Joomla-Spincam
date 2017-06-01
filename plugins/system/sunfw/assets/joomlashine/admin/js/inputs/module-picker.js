window.SunFwInputModulePicker = React.extendClass('SunFwMixinInput', {
	render: function () {
		var button;
		if (this.state.value != '') {
			var module_id = this.state.value.split(':').pop();
			if (parseInt(module_id)) {
				button = React.createElement(
					'a',
					{
						href: SunFw.urls.root + '/administrator/index.php?option=com_modules&task=module.edit&id=' + module_id,
						target: '_blank',
						rel: 'noopener noreferrer',
						className: 'btn btn-block btn-default margin-top-15'
					},
					SunFwString.parse('configure-module')
				);
			}
		}
		var value = this.state.value.split(':');
		value = value[0] + (value[1] ? ' (ID: ' + value[1] + ')' : '');
		return React.createElement(
			'div',
			{
				key: this.props.id,
				className: 'form-group'
			},
			React.createElement(
				'label',
				null,
				this.label,
				this.tooltip
			),
			React.createElement(
				'div',
				{ className: 'input-group snfw-input-popup' },
				React.createElement('input', {
					value: value,
					disabled: 'disabled',
					className: 'form-control',
					placeholder: SunFwString.parse('select-module')
				}),
				React.createElement(
					'span',
					{ className: 'input-group-addon' },
					React.createElement(
						'a',
						{ href: '#', onClick: this.popupForm },
						'...'
					)
				),
				React.createElement(
					'span',
					{ className: 'input-group-addon' },
					React.createElement(
						'a',
						{ href: '#', onClick: this.resetState },
						React.createElement('i', { className: 'fa fa-remove' })
					)
				)
			),
			button
		);
	},
	popupForm: function () {
		var href = SunFw.urls.widgetBase + '&sunfwwidget=modules&action=list',
		modal = SunFwModal.get({
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
		});
		modal.setState({
			buttons: [{
				text: 'close',
				onClick: modal.close,
				className: 'btn btn-default'
			}]
		});
		top.sunFwModulePickerInsert = function (id, name) {
			this.change(this.props.setting, name + ':' + id);
		}.bind(this);
		window.parent.sunFwModulePickerModalClose = function () {
			modal.close();
		};
	}
});