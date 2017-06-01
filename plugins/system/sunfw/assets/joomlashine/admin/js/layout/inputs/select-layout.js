window.SunFwInputSelectLayout = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value,
			new_layout: ''
		};
	},
	render: function () {
		SunFw.parent();
		var classContainer = 'row layout-selector',
		    layouts = [],
		    className,
		    keyName;
		for (var layout in this.props.form.props.rel.editor.config.prebuilds) {
			className = 'thumbnail ' + (layout == this.state.value ? 'selected' : '');
			keyName = 'preview_' + layout;
			if (this.props.form.props.rel.editor.config.prebuilds[layout].settings) {
				var action = [];
				if (this.props.control.action == 'save') {
					action = React.createElement('input', {
						type: 'radio',
						name: this.props.setting,
						value: layout,
						checked: layout == this.state.value ? true : false,
						onClick: this.select
					});
				}
				layouts.push(React.createElement(
					'div',
					{ className: 'pull-left' },
					React.createElement(
						'a',
						{
							href: '#',
							onClick: this.select,
							className: className,
							'data-value': layout
						},
						React.createElement(SunFwPaneLayoutPreview, {
							key: this.props.form.props.rel.editor.props.id + '_' + keyName,
							ref: keyName,
							data: this.props.form.props.rel.editor.config.prebuilds[layout].settings,
							parent: this,
							editor: this.props.form.props.rel.editor
						}),
						React.createElement(
							'div',
							{ className: 'caption clearfix' },
							action,
							this.props.form.props.rel.editor.config.prebuilds[layout].label,
							React.createElement(
								'a',
								{
									href: '#',
									onClick: this.remove,
									className: 'pull-right',
									'data-value': layout
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
				{ className: 'row new-layout' },
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
								value: this.state.new_layout,
								checked: this.state.new_layout == this.state.value ? true : false,
								onClick: this.select
							}),
							SunFwString.parse('new-layout')
						)
					),
					React.createElement(
						'div',
						{ className: 'form-group' },
						React.createElement('input', {
							type: 'text',
							name: this.props.setting,
							value: this.state.new_layout,
							className: 'form-control',
							placeholder: SunFwString.parse('prebuilt-layout-name'),
							onChange: this.select
						})
					)
				)
			);
		}
		if (!layouts.length && this.props.control.action != 'save') {
			classContainer += ' empty-prelayout';
		}
		return React.createElement(
			'div',
			{ ref: 'wrapper' },
			React.createElement(
				'div',
				{ className: classContainer },
				React.createElement(
					'div',
					{ className: 'layout-list' },
					React.createElement('input', {
						ref: 'field',
						type: 'hidden',
						name: this.props.setting,
						value: this.state.value,
						onChange: this.change
					}),
					!layouts.length && this.props.control.action != 'save' ? SunFwString.parse('no-pre-layout') : layouts
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
			var previews = this.refs.wrapper.querySelectorAll('.preview-layout'),
			    preview_css,
			    width = 0,
			    height = 0;
			if (!previews.length) {
				this.refs.wrapper.querySelector('.layout-list').style.width = '100%';
				return;
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
			var list = this.refs.wrapper.querySelector('.layout-list'),
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
				this.setState({ new_layout: target.value });
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
		var server = this.props.form.props.rel.editor.props.url + '&action=remove&layout_name=' + target.getAttribute('data-value');
		target.firstElementChild.className = 'fa fa-circle-o-notch fa-spin';
		SunFwAjax.request(server, function (req) {
			var response = req.responseJSON;
			target.firstElementChild.className = 'fa fa-trash';
			if (response.type == 'success') {
				delete this.props.form.props.rel.editor.config.prebuilds[target.getAttribute('data-value')];
				this.setState(this.state);
			} else {
				bootbox.alert(response.data);
			}
		}.bind(this));
	}
});