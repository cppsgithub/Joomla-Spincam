window.SunFwInputArticlePicker = React.extendClass('SunFwMixinInput', {
	render: function () {
		var button;
		if (this.state.value != '') {
			var article_id = this.state.value.split(':').pop();
			if (parseInt(article_id)) {
				button = React.createElement(
					'a',
					{
						href: SunFw.urls.root + '/administrator/index.php?option=com_content&task=article.edit&id=' + article_id,
						target: '_blank',
						rel: 'noopener noreferrer',
						className: 'btn btn-block btn-default margin-top-15'
					},
					SunFwString.parse('edit-article')
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
					placeholder: SunFwString.parse('select-article')
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
		var href = SunFw.urls.widgetBase + '&sunfwwidget=articles&action=list',
		modal = SunFwModal.get({
			id: 'choose_article_modal',
			title: 'choose-article',
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
		top.sunFwArticlePickerInsert = function (id, name) {
			this.change(this.props.setting, name + ':' + id);
		}.bind(this);
		window.parent.sunFwArticlePickerModalClose = function () {
			modal.close();
		};
	}
});