window.SunFwInputSelectStyle = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value,
			new_style: ''
		};
	},
	render: function () {
		SunFw.parent();
		var classContainer = 'row style-selector',
		    styles = [],
		    className,
		    keyName;
		for (var style in this.props.form.props.rel.editor.config.presets) {
			className = 'thumbnail ' + (style == this.state.value ? 'selected' : '');
			keyName = 'preview_' + style;
			if (this.props.form.props.rel.editor.config.presets[style].settings) {
				var action = [];
				if (this.props.control.action == 'save') {
					action = React.createElement('input', {
						type: 'radio',
						name: this.props.setting,
						value: style,
						checked: style == this.state.value ? true : false,
						onClick: this.select
					});
				}
				styles.push(React.createElement(
					'div',
					{ className: 'pull-left' },
					React.createElement(
						'a',
						{
							href: '#',
							onClick: this.select,
							className: className,
							'data-value': style
						},
						React.createElement(SunFwPaneStylesPreview, {
							key: this.props.form.props.rel.editor.props.id + '_' + keyName,
							ref: keyName,
							data: this.props.form.props.rel.editor.config.presets[style].settings,
							parent: this,
							editor: this.props.form.props.rel.editor
						}),
						React.createElement(
							'div',
							{ className: 'caption clearfix' },
							action,
							this.props.form.props.rel.editor.config.presets[style].label,
							React.createElement(
								'a',
								{
									href: '#',
									onClick: this.remove,
									className: 'pull-right',
									'data-value': style
								},
								React.createElement('i', { className: 'fa fa-trash' })
							)
						)
					)
				));
			}
		}
		var input = [];
		if (this.props.control.action == 'save') {
			input = React.createElement(
				'div',
				{ className: 'row new-style' },
				React.createElement(
					'div',
					{ className: 'col-xs-12' },
					React.createElement(
						'div',
						{ className: 'radio' },
						React.createElement(
							'label',
							null,
							React.createElement('input', {
								type: 'radio',
								name: this.props.setting,
								value: this.state.new_style,
								checked: this.state.new_style == this.state.value ? true : false,
								onClick: this.select
							}),
							SunFwString.parse('new-style')
						)
					),
					React.createElement(
						'div',
						{ className: 'form-group' },
						React.createElement('input', {
							type: 'text',
							name: this.props.setting,
							value: this.state.new_style,
							className: 'form-control',
							placeholder: SunFwString.parse('style-preset-name'),
							onChange: this.select
						})
					)
				)
			);
		}
		if (!styles.length && this.props.control.action != 'save') {
			classContainer += ' empty-prestyle';
		}
		return React.createElement(
			'div',
			{ ref: 'wrapper' },
			React.createElement(
				'div',
				{ className: classContainer },
				React.createElement(
					'div',
					{ className: 'style-list' },
					React.createElement('input', {
						ref: 'field',
						type: 'hidden',
						name: this.props.setting,
						value: this.state.value ? this.state.value : this.props.value,
						onChange: this.change
					}),
					!styles.length && this.props.control.action != 'save' ? SunFwString.parse('no-pre-style') : styles
				)
			),
			input
		);
	},
	initActions: function () {
		SunFw.parent();
		if (this.lastChecked === undefined) {
			this.lastChecked = this.state.value ? this.state.value : this.props.value;
		}
		if (this.lastChecked != this.state.value) {
			this.lastChecked = this.state.value;
			setTimeout(function () {
				this.setState(this.state);
			}.bind(this), 5);
		}
		setTimeout(function () {
			var previews = this.refs.wrapper.querySelectorAll('.preview-style'),
			    preview_css,
			    width = 0,
			    height = 0;
			if (!previews.length) {
				this.refs.wrapper.querySelector('.style-list').style.width = '100%';
				return false;
			}
			for (var i = 0; i < previews.length; i++) {
				if (height < previews[i].offsetHeight) {
					height = previews[i].offsetHeight;
				}
			}
			for (var i = 0; i < previews.length; i++) {
				previews[i].style.height = height + 'px';
				preview_css = window.getComputedStyle(previews[i].parentNode.parentNode);
				width += previews[i].parentNode.parentNode.offsetWidth + parseInt(preview_css.getPropertyValue('margin-left')) + parseInt(preview_css.getPropertyValue('margin-right'));
			}
			var list = this.refs.wrapper.querySelector('.style-list'),
			    list_css = window.getComputedStyle(list);
			list.style.width = width + parseInt(list_css.getPropertyValue('padding-left')) + parseInt(list_css.getPropertyValue('padding-right')) + 'px';
			list.style.height = preview_css.getPropertyValue('height');
		}.bind(this), 5);
	},
	select: function (event) {
		event.preventDefault();
		var target = event.target,
		    value = this.state.value;
		if (target.nodeName == 'INPUT') {
			value = target.value;
			if (target.type == 'text') {
				this.setState({ new_style: target.value });
			}
		} else {
			while (target.nodeName != 'A' && target.nodeName != 'BODY') {
				target = target.parentNode;
			}
			value = target.getAttribute('data-value');
		}
		this.change(this.props.setting, value);
	},
	remove: function (event) {
		var target = event.target;
		while (target.nodeName != 'A' && target.nodeName != 'BODY') {
			target = target.parentNode;
		}
		var server = this.props.form.props.rel.editor.props.url + '&action=remove&style_name=' + target.getAttribute('data-value');
		target.firstElementChild.className = 'fa fa-circle-o-notch fa-spin';
		SunFwAjax.request(server, function (req) {
			var response = req.responseJSON;
			target.firstElementChild.className = 'fa fa-trash';
			if (response.type == 'success') {
				delete this.props.form.props.rel.editor.config.presets[target.getAttribute('data-value')];
				this.setState(this.state);
			} else {
				bootbox.alert(response.data);
			}
		}.bind(this));
	}
});