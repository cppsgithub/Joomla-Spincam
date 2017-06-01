window.SunFwPaneSystemActions = React.extendClass('SunFwPaneMixinAction', {
	render: function () {
		return React.createElement(
			"button",
			{
				ref: "save",
				type: "button",
				onClick: this.editor.save,
				disabled: !this.editor.state.changed,
				className: "btn btn-success text-uppercase"
			},
			React.createElement("i", { className: "icon-apply icon-white margin-right-5" }),
			SunFwString.parse('save-system')
		);
	}
});
window.SunFwPaneSystem = React.extendClass('SunFwPaneMixinEditor', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getPaneSystem
		};
	},
	getInitialState: function () {
		return {
			changed: false
		};
	},
	render: function () {
		if (this.config === undefined) {
			return null;
		}
		return React.createElement(
			'div',
			{
				key: this.props.id,
				ref: 'wrapper',
				className: 'system'
			},
			React.createElement(
				'div',
				{ className: 'jsn-pageheader container-fluid padding-top-10 padding-bottom-10' },
				React.createElement(
					'div',
					{ className: 'row' },
					React.createElement(
						'div',
						{ className: 'col-xs-4' },
						React.createElement(
							'h3',
							{ className: 'margin-0 line-height-30' },
							SunFwString.parse('system')
						)
					),
					React.createElement('div', { className: 'col-xs-4' }),
					React.createElement(
						'div',
						{ className: 'col-xs-4 text-right' },
						React.createElement(SunFwPaneSystemActions, {
							key: this.props.id + '_actions',
							ref: 'actions',
							parent: this,
							editor: this
						})
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'jsn-main-content' },
				React.createElement(
					'div',
					{ className: 'container-fluid' },
					React.createElement(
						'div',
						{ className: 'row equal-height' },
						React.createElement(
							'div',
							{ className: 'col-xs-12 padding-top-15 padding-bottom-15' },
							React.createElement(SunFwComponentForm, {
								key: this.props.id + '_settings',
								ref: 'settings',
								parent: this,
								editor: this
							})
						)
					)
				)
			)
		);
	},
	preloadAssets: function () {
		if (typeof this.config.settings == 'string') {
			SunFwAjax.request(this.config.settings, function (req) {
				this.config.settings = req.responseJSON;
				SunFwEvent.add(this.refs.settings, 'FormRendered', this.setupForm);
				this.refs.settings.setState({
					rel: this,
					form: this.config.settings,
					values: this.getData()
				});
			}.bind(this));
		}
	},
	setupForm: function () {
		var button = this.refs.settings.refs.mountedDOMNode.querySelector('[id$="cacheDirectory"] .input-group-addon');
		if (!button) {
			return setTimeout(this.setupForm, 100);
		}
		button.style.cursor = 'pointer';
		SunFwEvent.add(button, 'click', this.verifyCacheDirectory);
	},
	verifyCacheDirectory: function (event) {
		SunFwAjax.request(this.props.url + '&action=verifyCacheFolder&folder=' + event.target.previousElementSibling.value, function (req) {
			if (req.responseJSON) {
				var alert = event.target.parentNode.parentNode.querySelector('p');
				if (!alert) {
					var alert = document.createElement('p');
					alert.className = 'pull-left label';
					alert.style.marginBottom = 0;
					event.target.parentNode.parentNode.appendChild(alert);
				}
				if (req.responseJSON.type == 'success') {
					alert.className = alert.className.replace(/label-[^\s]+/, '');
					alert.className += ' label-' + (req.responseJSON.data.pass ? 'success' : 'danger');
					alert.textContent = req.responseJSON.data.message;
				} else {
					alert.className = alert.className.replace(/label-[^\s]+/, '');
					alert.className += ' label-danger';
					alert.textContent = req.responseJSON.data;
				}
			}
		});
	},
	saveSettings: function (settings) {
		var data = this.getData();
		for (var p in settings) {
			data[p] = settings[p];
		}
		this.setData(data);
	}
});
