window.SunFwPaneCookieLawActions = React.extendClass('SunFwPaneMixinAction', {
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
			SunFwString.parse('save-cookie-law')
		);
	}
});
window.SunFwPaneCookieLaw = React.extendClass('SunFwPaneMixinEditor', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getPaneCookieLaw
		};
	},
	getInitialState: function () {
		return {
			changed: false
		};
	},
	getDefaultData: function () {
		return {
			style: '',
			message: 'This website uses cookies to ensure you get the best experience on our website.',
			'banner-placement': '',
			'cookie-policy-link': 'http://',
			'accept-button-text': 'Got It!',
			'read-more-button-text': 'More information'
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
				className: 'cookie-law'
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
							SunFwString.parse('cookie-law')
						)
					),
					React.createElement('div', { className: 'col-xs-4' }),
					React.createElement(
						'div',
						{ className: 'col-xs-4 text-right' },
						React.createElement(SunFwPaneCookieLawActions, {
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
							{ className: 'col-xs-8 padding-top-15 padding-bottom-15 workspace-container' },
							React.createElement(SunFwPaneCookieLawWorkspace, {
								key: this.props.id + '_workspace',
								ref: 'workspace',
								parent: this,
								editor: this
							})
						),
						React.createElement(
							'div',
							{ className: 'col-xs-4 parent-sidebar border-left padding-bottom-15 cookie-law-settings' },
							React.createElement(
								'div',
								{ className: 'jsn-sidebar settings-panel' },
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
			)
		);
	},
	preloadAssets: function () {
		if (typeof this.config.settings == 'string') {
			SunFwAjax.request(this.config.settings, function (req) {
				this.config.settings = req.responseJSON;
				this.refs.settings.setState({
					rel: this,
					form: this.config.settings,
					values: this.getData()
				});
			}.bind(this));
		}
	},
	saveSettings: function (settings) {
		var data = this.getData();
		for (var p in settings) {
			data[p] = settings[p];
		}
		this.setData(data);
		this.refs.workspace.forceUpdate();
	}
});
window.SunFwPaneCookieLawWorkspace = React.extendClass('SunFwPaneMixinBase', {
	render: function () {
		var data = this.editor.getData(),
		    className = '',
		    content;
		if (data.enabled) {
			if (data.style) {
				className = data.style + ' jsn-panel cookies-law';
			} else {
				className = 'jsn-panel';
			}
			content = React.createElement(
				'div',
				{ className: 'jsn-panel-body cookies-content-preview' },
				React.createElement(
					'p',
					{ ref: 'message' },
					React.createElement('span', { className: 'fa fa-circle-o-notch fa-spin' })
				),
				React.createElement(
					'button',
					{ className: 'btn btn-default', type: 'button' },
					data['accept-button-text'] ? data['accept-button-text'] : 'Got It!'
				),
				React.createElement(
					'a',
					{ href: data['cookie-policy-link'] ? data['cookie-policy-link'] : '#' },
					data['read-more-button-text'] ? data['read-more-button-text'] : 'More information'
				)
			);
		} else {
			className = 'cookie-law-not-enabled';
		}
		return React.createElement(
			'div',
			{ ref: 'wrapper', className: className },
			content ? content : SunFwString.parse('cookie-law-not-enabled')
		);
	},
	initActions: function () {
		var data = this.editor.getData();
		if (data.enabled) {
			if (data.message_type == 'text') {
				if (this.refs.message.innerHTML != (data.message || SunFwString.parse('cookie-law-default-message'))) {
					this.refs.message.innerHTML = data.message || SunFwString.parse('cookie-law-default-message');
				}
			} else if (data.article) {
				var info = data.article.split(':');
				if (!this.loaded || this.loaded != info[1]) {
					this.refs.message.innerHTML = SunFw.text['cookie-law-article-message'].replace('%s', info[0]);
					if (data.message_type == 'article' && data.article != '') {
						SunFwAjax.request(SunFw.urls.ajaxBase + '&action=getArticle&articleId=' + info[1], function (req) {
							var response = req.responseJSON;
							if (response.type == 'success') {
								this.refs.message.innerHTML = response.data.introtext;
								this.loaded = info[1];
							}
						}.bind(this));
					}
				}
			} else {
				this.refs.message.innerHTML = SunFwString.parse('cookie-law-select-article');
			}
		}
	}
});
