window.SunFwElementAlert = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		type: React.PropTypes.string,
		data: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			id: '',
			type: 'info',
			data: '',
			onClose: null
		};
	},
	render: function () {
		SunFw.parent();
		return React.createElement(
			'div',
			{
				key: this.props.id,
				className: 'alert alert-' + this.props.type,
				ref: 'mountedDOMNode'
			},
			React.createElement(
				'a',
				{ href: '#', className: 'close', onClick: this.close },
				'\xD7'
			),
			SunFwString.parse(this.props.data)
		);
	},
	close: function (event) {
		event.preventDefault();
		this.refs.mountedDOMNode.classList.add('hidden');
		if (typeof this.props.onClose == 'function') {
			this.props.onClose(this.props.id);
		}
	}
});
window.SunFwElementButton = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		href: React.PropTypes.string,
		type: React.PropTypes.string,
		icon: React.PropTypes.string,
		disabled: React.PropTypes.string,
		className: React.PropTypes.string,
		onClick: React.PropTypes.func
	},
	getDefaultProps: function () {
		return {
			id: '',
			href: '',
			type: '',
			icon: '',
			disabled: false,
			className: '',
			onClick: null
		};
	},
	render: function () {
		SunFw.parent();
		var className = ['btn btn-' + this.props.type];
		if (this.props.className) {
			className.push(this.props.className);
		}
		var icon = SunFwString.parse(this.props.icon);
		if (!this.props.href || this.props.href == '' || this.props.href == '#') {
			return React.createElement(
				'button',
				{
					key: this.props.id,
					disabled: this.props.disabled,
					className: className.join(' '),
					onClick: this.click,
					ref: 'mountedDOMNode'
				},
				typeof icon == 'string' && icon != '' ? React.createElement('i', { className: 'fa fa-' + icon }) : icon,
				this.props.children
			);
		} else {
			return React.createElement(
				SunFwElementLink,
				{
					id: this.props.id,
					href: this.props.href,
					className: className.join(' ') + (this.props.disabled ? ' disabled' : '')
				},
				typeof icon == 'string' && icon != '' ? React.createElement('i', { className: 'fa fa-' + icon }) : icon,
				this.props.children
			);
		}
	},
	click: function (event) {
		event.preventDefault();
		if (typeof this.props.onClick == 'function') {
			this.props.onClick(event);
		} else if (this.refs.mountedDOMNode && this.refs.mountedDOMNode.classList.contains('dropdown-toggle')) {
			if (this.refs.mountedDOMNode.nextElementSibling.classList.contains('dropdown-menu')) {
				this.refs.mountedDOMNode.nextElementSibling.classList.toggle('open');
			}
			if (!document._added_hideDropdownMenu) {
				SunFwEvent.add(document, 'click', this.hideDropdownMenu);
				document._added_hideDropdownMenu = true;
			}
		}
	},
	hideDropdownMenu: function (event) {
		var menus = document.querySelectorAll('.dropdown-menu.open');
		if (menus.length) {
			var parent = event.target;
			while (parent.nodeName != 'HTML' && parent.nodeName != 'BODY' && !parent.classList.contains('dropdown-toggle') && !parent.classList.contains('dropdown-menu')) {
				parent = parent.parentNode;
			}
			for (var i = 0, n = menus.length; i < n; i++) {
				if (parent.classList.contains('dropdown-toggle')) {
					if (menus[i] != parent.nextElementSibling) {
						menus[i].classList.remove('open');
					}
				} else if (menus[i] != parent) {
					menus[i].classList.remove('open');
				}
			}
		}
	},
	componentWillUnmount: function () {
		SunFw.parent();
		if (document._added_hideDropdownMenu) {
			delete document._added_hideDropdownMenu;
			SunFwEvent.remove(document, 'click', this.hideDropdownMenu);
		}
	}
});
window.SunFwElementColumn = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		xs: React.PropTypes.number,
		sm: React.PropTypes.number,
		md: React.PropTypes.number,
		lg: React.PropTypes.number,
		className: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			id: '',
			xs: 0,
			sm: 0,
			md: 0,
			lg: 0,
			className: ''
		};
	},
	render: function () {
		SunFw.parent();
		var className = [];
		if (this.props.xs) {
			className.push('col-xs-' + this.props.xs);
		}
		if (this.props.sm) {
			className.push('col-sm-' + this.props.sm);
		}
		if (this.props.md) {
			className.push('col-md-' + this.props.md);
		}
		if (this.props.lg) {
			className.push('col-lg-' + this.props.lg);
		}
		if (this.props.className) {
			className.push(this.props.className);
		}
		return React.createElement(
			'div',
			{
				key: this.props.id,
				className: className.join(' ')
			},
			this.props.children
		);
	}
});
window.SunFwElementHeading = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		level: React.PropTypes.number,
		className: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			id: '',
			level: 3,
			className: ''
		};
	},
	render: function () {
		SunFw.parent();
		return React.createElement('h' + this.props.level, {
			key: this.props.id,
			className: this.props.className
		}, this.props.children);
	}
});
window.SunFwElementLink = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		href: React.PropTypes.string,
		icon: React.PropTypes.string,
		type: React.PropTypes.string,
		title: React.PropTypes.string,
		target: React.PropTypes.string,
		onClick: React.PropTypes.func,
		className: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			id: '',
			href: '',
			icon: '',
			type: '',
			title: '',
			target: '',
			onClick: null,
			className: ''
		};
	},
	render: function () {
		SunFw.parent();
		return React.createElement(
			'a',
			{
				key: this.props.id,
				className: this.props.className,
				href: this.props.href,
				title: this.props.title,
				target: this.props.target,
				rel: this.props.target == '_blank' ? 'noopener noreferrer' : '',
				onClick: this.click
			},
			this.props.icon != '' ? React.createElement('i', { className: 'fa fa-' + this.props.icon }) : null,
			this.props.children || this.props.title,
			this.props.type == 'external' ? ' ' : null,
			this.props.type == 'external' ? React.createElement('i', { className: 'fa fa-external-link' }) : null
		);
	},
	click: function (event) {
		if (this.props.type == 'trigger-other') {
			event.preventDefault();
			var hrefs = this.props.target.split(',');
			for (var i = 0, n = hrefs.length; i < n; i++) {
				var element = document.querySelector('a[href="' + SunFwString.trim(hrefs[i]) + '"]');
				if (element) {
					element.click();
				}
			}
		} else if (typeof this.props.onClick == 'function') {
			this.props.onClick(event);
		} else if (['sunfw-learn-more', 'sunfw-get-started'].indexOf(this.props.id) > -1) {
			if (this.props.href == '#') {
				event.preventDefault();
				var body = React.findComponent(document.getElementById('sunfw-template-admin-body'));
				if (body) {
					body.get_started.show();
				}
			}
		} else if (this.props.id == 'sunfw-save-as-copy') {
			event.preventDefault();
			SunFwAjax.request(this.props.href, function (req) {
				if (req.responseJSON && req.responseJSON.type == 'success') {
					window.location.href = SunFw.urls.root + '/administrator/index.php?option=com_templates&task=style.edit&id=' + req.responseJSON.data.id;
				} else {
					bootbox.alert(req.responseJSON.data || req.responseText);
				}
			});
		}
	}
});
window.SunFwElementLoading = React.extendClass('SunFwMixinBase', {
  render: function () {
    SunFw.parent();
    return React.createElement(
      "div",
      { className: "sunfw-loading-indicator" },
      React.createElement("i", { className: "fa fa-circle-o-notch fa-3x fa-spin" })
    );
  }
});
window.SunFwElementRow = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		className: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			id: '',
			className: ''
		};
	},
	render: function () {
		SunFw.parent();
		return React.createElement(
			'div',
			{
				key: this.props.id,
				className: 'row ' + this.props.className
			},
			this.props.children
		);
	}
});
window.SunFwElementTooltip = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		hint: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			id: '',
			hint: ''
		};
	},
	render: function () {
		SunFw.parent();
		return React.createElement(
			'span',
			{
				key: this.props.id,
				className: 'has-tooltip',
				ref: 'mountedDOMNode'
			},
			React.createElement('i', { className: 'fa fa-question' })
		);
	},
	componentDidMount: function () {
		SunFw.parent();
		if (this.refs.mountedDOMNode) {
			jQuery(this.refs.mountedDOMNode).popover({
				html: true,
				content: this.props.hint,
				trigger: 'hover',
				template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
				placement: 'auto',
				container: 'body'
			}).click(function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
		}
	},
	componentWillUnmount: function () {
		SunFw.parent();
		if (this.refs.mountedDOMNode) {
			jQuery(this.refs.mountedDOMNode).popover('destroy');
		}
	}
});
window.SunFwComponentAlerts = React.extendClass('SunFwMixinBase', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getComponentAlerts
		};
	},
	getInitialState: function () {
		return {
			items: []
		};
	},
	render: function () {
		SunFw.parent();
		if (!this.state.items.length) {
			return null;
		}
		var closedAlerts = JSON.parse(localStorage.getItem('SunFwClosedAlerts')) || [];
		return React.createElement(
			'div',
			{ className: 'sunfw-alert-container' },
			this.state.items.map(item => {
				if (item && item.id && item.type && item.data && closedAlerts.indexOf(item.id) < 0) {
					return React.createElement(SunFwElementAlert, {
						id: item.id,
						type: item.type,
						data: item.data,
						onClose: this.close.bind(this, item.id)
					});
				}
			})
		);
	},
	componentDidMount: function () {
		SunFw.parent();
		SunFwEvent.add(this.props.doc, 'TokenDataFetched', this.update);
		SunFwEvent.add(this.props.doc, 'UpdateDataFetched', this.update);
	},
	componentDidUpdate: function () {
		SunFw.parent();
		SunFwEvent.trigger(window, 'resize');
	},
	componentWillUnmount: function () {
		SunFwEvent.remove(this.props.doc, 'UpdateDataFetched', this.update);
	},
	update: function (event) {
		var alerts = [];
		if (event.type == 'UpdateDataFetched') {
			var data = this.props.doc.refs.update.data,
			    alerts = [];
			for (var target in data) {
				if (data[target].hasUpdate) {
					alerts.push({
						id: 'update-' + target,
						type: 'danger alert-sunfw-update',
						data: React.createElement(
							'div',
							{ className: 'container-fluid' },
							React.createElement(
								'div',
								{ className: 'pull-left' },
								React.createElement(
									'h4',
									null,
									React.createElement(
										'strong',
										null,
										data[target].message,
										'\xA0',
										React.createElement(
											'span',
											{ className: 'sunfw-new-version' },
											data[target].newVersion
										)
									)
								)
							),
							React.createElement(
								'div',
								{ className: 'pull-right' },
								React.createElement(
									'a',
									{
										href: '#',
										className: 'btn btn-primary sunfw-update-now',
										'data-target': target,
										onClick: this.props.doc.refs.update.update
									},
									SunFwString.parse('update')
								)
							)
						)
					});
				}
			}
		} else if (event.type == 'TokenDataFetched') {
			if (!event.target.config.token || event.target.config.token == '') {
				alerts.push({
					id: 'missing-token',
					type: 'warning alert-sunfw-missing-token',
					data: React.createElement(
						'div',
						{ className: 'container-fluid' },
						React.createElement(
							'div',
							{ className: 'pull-left' },
							React.createElement(
								'h4',
								null,
								React.createElement(
									'strong',
									null,
									SunFwString.parse('missing-token')
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'pull-right' },
							React.createElement(
								'a',
								{
									href: '#',
									className: 'btn btn-primary sunfw-set-token-now',
									onClick: this.props.doc.refs.body.toggleTab.bind(null, 'token-key')
								},
								SunFwString.parse('set-token-key')
							)
						)
					)
				});
			}
		}
		if (alerts.length) {
			var items = this.state.items;
			items = alerts.concat(items);
			this.setState({
				items: items
			});
		}
	},
	close: function (id) {
		var items = this.state.items;
		for (var i = 0, n = items.length; i < n; i++) {
			if (!items[i]) {
				continue;
			}
			if (items[i].id == id) {
				items.splice(i, 1);
				var closedAlerts = JSON.parse(localStorage.getItem('SunFwClosedAlerts')) || [];
				closedAlerts.push(id);
				localStorage.setItem('SunFwClosedAlerts', JSON.stringify(closedAlerts));
			}
		}
		this.setState({
			items: items
		});
	}
});
window.SunFwComponentBody = React.extendClass('SunFwMixinBase', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getComponentBody
		};
	},
	getInitialState: function () {
		return {
			active: localStorage.getItem('SunFwActiveTab')
		};
	},
	componentWillMount: function () {
		if (this.props.url != '') {
			SunFwAjax.request(this.props.url, function (req) {
				if (req.responseJSON) {
					if (req.responseJSON.data.inputs) {
						SunFw.inputs = req.responseJSON.data.inputs;
					}
					delete req.responseJSON.data.inputs;
					this.config = req.responseJSON.data;
					this.loadingPaneComponents = 0;
					var load_panes = function (tabs) {
						for (var i = 0, n = tabs.length; i < n; i++) {
							if (tabs[i].render && tabs[i].render.file) {
								this.loadingPaneComponents++;
								SunFwAjax.loadScript(tabs[i].render.file, function () {
									this.loadingPaneComponents--;
									this.timer && clearTimeout(this.timer);
									this.timer = setTimeout(this.forceUpdate.bind(this), 100);
								}.bind(this));
							} else if (tabs[i].items) {
								load_panes(tabs[i].items);
							}
						}
					}.bind(this);
					load_panes(this.config.tabs);
				}
			}.bind(this));
		}
		var form = document.getElementById('template-admin-form'),
		    fields = form.querySelectorAll('input, select');
		this.form = {
			'class': 'form-inline',
			controls: {}
		};
		for (var i = 0, n = fields.length; i < n; i++) {
			if (!fields[i].name || fields[i].name == '') {
				continue;
			}
			this.form.controls[fields[i].name] = {
				type: fields[i].nodeName == 'INPUT' ? fields[i].type : fields[i].nodeName.toLowerCase(),
				'default': fields[i].nodeName == 'INPUT' ? fields[i].value : fields[i].options[fields[i].selectedIndex].value,
				disabled: fields[i].getAttribute('disabled') ? true : false
			};
			if (fields[i].nodeName == 'SELECT') {
				this.form.controls[fields[i].name].options = [];
				for (var j = 0, m = fields[i].options.length; j < m; j++) {
					this.form.controls[fields[i].name].options.push({
						label: fields[i].options[j].textContent,
						value: fields[i].options[j].value
					});
				}
			}
		}
		form.parentNode.removeChild(form);
	},
	render: function () {
		SunFw.parent();
		if (!this.config) {
			return null;
		}
		return React.createElement(
			'div',
			{
				id: this.props.id,
				ref: 'mountedDOMNode'
			},
			React.createElement(
				'div',
				{
					id: 'sunfw-nav-tab',
					ref: 'navTabs',
					className: 'jsn-nav main-nav container-fluid'
				},
				React.createElement(
					'nav',
					{ className: 'navbar navbar-default' },
					React.createElement(
						'div',
						{ className: 'navbar-form navbar-left' },
						React.createElement(SunFwComponentForm, {
							ref: 'form',
							rel: this,
							form: this.form,
							inline: true,
							emptyMessage: ''
						})
					),
					this.config.tabs.length ? React.createElement(SunFwComponentMenu, {
						id: 'sunfw-admin-tab',
						type: 'tabs',
						items: this.config.tabs,
						className: 'navbar-nav navbar-left'
					}) : null,
					this.config.buttons.length ? React.createElement(SunFwComponentButtons, {
						items: this.config.buttons,
						className: 'navbar-form navbar-right'
					}) : null
				)
			),
			React.createElement(
				'div',
				{
					id: 'sunfw-tab-content',
					ref: 'tabPanes',
					className: 'tab-content'
				},
				this.config.tabs.map(tab => {
					return React.createElement(
						'div',
						{ id: tab.href.substr(1), className: 'tab-pane main-pane' },
						tab.listClass == 'hidden' ? React.createElement(
							'div',
							{ className: 'jsn-nav sub-nav container-fluid' },
							React.createElement(
								'nav',
								{ className: 'navbar navbar-default' },
								React.createElement(
									'div',
									{ className: 'navbar-form navbar-left' },
									React.createElement(
										'h3',
										{ className: 'margin-0 line-height-30' },
										tab.title
									)
								),
								tab.items ? React.createElement(SunFwComponentMenu, {
									type: 'tabs',
									items: tab.items,
									className: 'navbar-nav navbar-left'
								}) : null,
								React.createElement(
									'div',
									{ className: 'navbar-form navbar-right' },
									React.createElement(
										'button',
										{
											type: 'button',
											className: 'btn btn-success text-uppercase',
											onClick: this.toggleTab
										},
										React.createElement('i', { className: 'fa fa-chevron-left font-size-14 margin-right-5' }),
										'\xA0',
										SunFwString.parse('back')
									)
								)
							)
						) : null,
						tab.render && tab.render.name && window[tab.render.name] ? React.createElement(window[tab.render.name], {
							id: tab.href.substr(1),
							ref: tab.href.substr(1),
							doc: this.props.doc
						}) : tab.items ? React.createElement(
							'div',
							{ className: 'tab-content' },
							tab.items.map(sub => {
								return React.createElement(
									'div',
									{ id: sub.href.substr(1), className: 'tab-pane sub-pane' },
									sub.render && sub.render.name && window[sub.render.name] ? React.createElement(window[sub.render.name], {
										id: sub.href.substr(1),
										ref: sub.href.substr(1),
										doc: this.props.doc
									}) : null
								);
							})
						) : null
					);
				})
			)
		);
	},
	componentDidUpdate: function () {
		SunFw.parent();
		this.calculateHeight();
		if (!window._added_calculateHeight) {
			SunFwEvent.add(window, 'resize', this.calculateHeight);
			window._added_calculateHeight = true;
		}
		var navs = this.refs.mountedDOMNode.querySelectorAll('nav .nav a[href^="#"]');
		for (var i = 0, n = navs.length; i < n; i++) {
			if (!navs[i]._added_toggleTab) {
				SunFwEvent.add(navs[i], 'click', this.toggleTab);
				navs[i]._added_toggleTab = true;
			}
		}
		var saveAll = document.getElementById('sunfw-save-all');
		if (saveAll && !saveAll._added_saveAllPane) {
			SunFwEvent.add(saveAll, 'click', this.saveAllPane);
			saveAll._added_saveAllPane = true;
		}
		this.toggleTab(this.state.active);
		if (!this.get_started) {
			var learnMore = document.getElementById('sunfw-learn-more');
			if (learnMore) {
				var helpMenu = [],
				    helpList = learnMore.nextElementSibling.children;
				for (var i = 0, n = helpList.length; i < n; i++) {
					if (helpList[i].children[0].id != 'sunfw-get-started') {
						helpMenu.push(React.createElement(
							'li',
							null,
							React.createElement(SunFwElementLink, {
								href: helpList[i].children[0].href,
								title: helpList[i].textContent,
								target: '_blank'
							})
						));
					}
				}
				this.get_started = SunFwModal.get({
					id: 'get-started',
					title: SunFwString.parse('get-started'),
					type: 'html',
					show: false,
					content: React.createElement(
						'div',
						{ className: 'container-fluid' },
						React.createElement(
							'div',
							{ className: 'col-xs-6' },
							React.createElement(
								'h3',
								null,
								SunFwString.parse('install-sample-data')
							),
							React.createElement(
								'p',
								null,
								SunFwString.parse('install-sample-data-intro')
							),
							React.createElement(
								'ul',
								null,
								React.createElement(
									'li',
									null,
									React.createElement(
										'a',
										{ href: '#', onClick: function () {
												this.toggleTab('sample-data');
												this.get_started.close();
											}.bind(this) },
										SunFwString.parse('install-sample-data')
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'col-xs-6' },
							React.createElement(
								'h3',
								null,
								SunFwString.parse('learn-more')
							),
							React.createElement(
								'p',
								null,
								SunFwString.parse('learn-more-intro')
							),
							React.createElement(
								'ul',
								null,
								helpMenu
							)
						)
					),
					buttons: 'disabled',
					preserve: true
				});
				if (SunFw && !SunFw.hasData) {
					this.get_started.show();
				}
			}
		}
	},
	componentWillUnmount: function () {
		SunFw.parent();
		if (window._added_calculateHeight) {
			delete window._added_calculateHeight;
			SunFwEvent.remove(window, 'resize', this.calculateHeight);
		}
		var navs = this.refs.mountedDOMNode.querySelectorAll('nav .nav a[href^="#"]');
		for (var i = 0, n = navs.length; i < n; i++) {
			if (navs[i]._added_toggleTab) {
				delete navs[i]._added_toggleTab;
				SunFwEvent.remove(navs[i], 'click', this.toggleTab);
			}
		}
		var saveAll = document.getElementById('sunfw-save-all');
		if (saveAll && saveAll._added_saveAllPane) {
			delete saveAll._added_saveAllPane;
			SunFwEvent.remove(saveAll, 'click', this.saveAllPane);
		}
	},
	calculateHeight: function () {
		if (this.refs.tabPanes) {
			setTimeout(function () {
				var container = this.refs.tabPanes,
				    containerTop = container.getBoundingClientRect().top,
				    clientHeight = (document.documentElement || document.body).clientHeight,
				    maxHeight = clientHeight - containerTop;
				container.style.height = maxHeight + 'px';
				var scrollHeight = (document.documentElement || document.body).scrollHeight;
				if (scrollHeight > clientHeight) {
					maxHeight -= scrollHeight - clientHeight;
					container.style.height = maxHeight + 'px';
				}
				var equalHeight = this.refs.tabPanes.querySelector('.tab-pane.active .equal-height');
				if (equalHeight) {
					maxHeight -= equalHeight.getBoundingClientRect().top - containerTop;
					equalHeight.style.height = maxHeight + 'px';
					var mainWorkspace = equalHeight.querySelector('.main-workspace'),
					    workspaceContainer = equalHeight.querySelector('.workspace-container'),
					    workspaceContainerCss = workspaceContainer ? window.getComputedStyle(workspaceContainer) : null;
					if (mainWorkspace) {
						mainWorkspace.style.height = maxHeight - (workspaceContainerCss ? parseInt(workspaceContainerCss.getPropertyValue('padding-top')) + parseInt(workspaceContainerCss.getPropertyValue('padding-bottom')) : 0) + 'px';
					}
				}
			}.bind(this), 10);
			if (!this.loadingPaneComponents) {
				setTimeout(function () {
					var loading = document.getElementById('sunfw-loading');
					if (loading) {
						loading.parentNode.removeChild(loading);
					}
				}, 500);
			}
		}
	},
	toggleTab: function (event) {
		event && event.target && event.preventDefault();
		if (typeof event == 'string') {
			this.state.active = event;
		} else if (event && event.target && event.target.href) {
			this.state.active = event.target.href.substr(event.target.href.indexOf('#') + 1);
		} else {
			var last = localStorage.getItem('SunFwLastActiveTab');
			if (last) {
				this.state.active = last;
			} else {
				this.state.active = this.config.tabs[0].href.substr(this.config.tabs[0].href.indexOf('#') + 1);
			}
		}
		if (this.state.active != '') {
			var navs = this.refs.mountedDOMNode.querySelectorAll('nav .nav a[href^="#"]'),
			    activeTab;
			for (var i = 0, n = navs.length; i < n; i++) {
				if (navs[i].href.indexOf('#' + this.state.active) > -1) {
					this.refs.navTabs.classList.remove('hidden');
					navs[i].parentNode.classList.add('active');
					if (navs[i].parentNode.classList.contains('hidden')) {
						this.refs.navTabs.classList.add('hidden');
					} else {
						var nav = navs[i].parentNode;
						while (['NAV', 'BODY'].indexOf(nav.nodeName) < 0) {
							nav = nav.parentNode;
						}
						if (nav.parentNode.classList.contains('sub-nav')) {
							this.refs.navTabs.classList.add('hidden');
						}
					}
					if (navs[i].parentNode.parentNode.classList.contains('dropdown-menu')) {
						navs[i].parentNode.parentNode.parentNode.classList.add('active');
					}
					activeTab = navs[i];
				} else {
					navs[i].parentNode.classList.remove('active');
					if (navs[i].parentNode.parentNode.classList.contains('dropdown-menu')) {
						navs[i].parentNode.parentNode.parentNode.classList.remove('active');
					}
				}
			}
			var panes = this.refs.tabPanes.querySelectorAll('.tab-pane');
			for (var i = 0, n = panes.length; i < n; i++) {
				if (panes[i].id == this.state.active) {
					panes[i].classList.add('active');
					if (panes[i].classList.contains('sub-pane')) {
						var parent = panes[i].parentNode;
						while (!parent.classList.contains('tab-pane') && parent.nodeName != 'BODY') {
							parent = parent.parentNode;
						}
						if (parent.classList.contains('tab-pane')) {
							parent.classList.add('active');
						}
					}
				} else if (panes[i].classList.contains('active')) {
					panes[i].classList.remove('active');
					if (!(panes[i].firstElementChild && panes[i].firstElementChild.classList.contains('jsn-nav')) && !panes[i].classList.contains('sub-pane')) {
						localStorage.setItem('SunFwLastActiveTab', panes[i].id);
					}
				}
			}
			localStorage.setItem('SunFwActiveTab', this.state.active);
			SunFwEvent.trigger(window, 'resize');
		}
	},
	saveSettings: function (data) {
		SunFwAjax.request(SunFw.urls.ajaxBase + '&context=core&action=saveStyleSettings', null, data);
	},
	saveAllPane: function (event) {
		event.preventDefault();
		var unsaved = this.refs.mountedDOMNode.querySelectorAll('a.toggle-pane.changed');
		for (var i = 0, n = unsaved.length; i < n; i++) {
			var pane = document.getElementById(unsaved[i].href.substr(unsaved[i].href.indexOf('#') + 1));
			if (pane) {
				pane = React.findComponent(pane.firstElementChild);
				if (pane) {
					pane.refs.actions.refs.save.click();
				}
			}
		}
		document.getElementById('sunfw-save-all').disabled = true;
	}
});
window.SunFwComponentButtons = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		items: React.PropTypes.array,
		className: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			id: '',
			items: [],
			className: ''
		};
	},
	render: function () {
		SunFw.parent();
		if (!this.props.items.length) {
			return null;
		}
		return React.createElement(
			'div',
			{ className: this.props.className },
			this.props.items.map(item => {
				if (item instanceof Array) {
					var btns = [];
					item.map(btn => {
						btns.push(React.createElement(
							SunFwElementButton,
							{
								id: btn.id,
								href: btn.href,
								type: btn.type,
								icon: btn.icon,
								disabled: btn.disabled,
								className: btn.className + (btn.menu ? ' dropdown-toggle' : '')
							},
							SunFwString.parse(btn.label),
							btn.menu ? React.createElement('span', { className: 'caret' }) : null
						));
						if (btn.menu) {
							btns.push(React.createElement(SunFwComponentMenu, {
								type: 'dropdown',
								items: btn.menu,
								className: btn.menuClass
							}));
						}
					});
					return React.createElement(
						'div',
						{ className: 'btn-group' },
						btns
					);
				} else {
					return React.createElement(
						SunFwElementButton,
						{
							id: item.id,
							href: item.href,
							type: item.type,
							icon: item.icon,
							disabled: item.disabled,
							className: item.className
						},
						item.label
					);
				}
			})
		);
	}
});
window.SunFwComponentFooter = React.extendClass('SunFwMixinBase', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getComponentFooter
		};
	},
	getInitialState: function () {
		return {
			credits: {
				template: {},
				framework: {}
			},
			others: []
		};
	},
	render: function () {
		SunFw.parent();
		if (!this.state.others.length) {
			return null;
		}
		var data = this.props.doc.refs.update.data;
		return React.createElement(
			'div',
			{ className: 'sunfw-footer container-fluid' },
			React.createElement(
				'div',
				{ className: 'pull-left' },
				React.createElement(
					'div',
					{ className: 'sunfw-copyright' },
					React.createElement(
						'span',
						{ className: 'footer-template-update sunfw-version-info' },
						React.createElement(
							'a',
							{ href: this.state.credits.template.link, target: '_blank', rel: 'noopener noreferrer' },
							this.state.credits.template.name,
							this.state.credits.template.edition
						),
						'\xA0',
						this.state.credits.template.version,
						data && data.template.hasUpdate ? React.createElement(
							'span',
							{ className: 'update-available' },
							'\xA0(',
							React.createElement(
								'a',
								{
									href: '#',
									className: 'sunfw-update-link',
									'data-target': 'template',
									onClick: this.props.doc.refs.update.update
								},
								SunFwString.parse('update-to'),
								'\xA0',
								React.createElement(
									'span',
									{ className: 'sunfw-footer-template-new-version' },
									data.template.newVersion
								)
							),
							')'
						) : null
					),
					'\xA0',
					React.createElement(
						'span',
						{ className: 'footer-framework-update sunfw-version-info' },
						SunFwString.parse('powered-by'),
						'\xA0',
						React.createElement(
							'a',
							{ href: this.state.credits.framework.link, target: '_blank', rel: 'noopener noreferrer' },
							this.state.credits.framework.name
						),
						'\xA0',
						this.state.credits.framework.version,
						data && data.framework.hasUpdate ? React.createElement(
							'span',
							{ className: 'update-available' },
							'\xA0(',
							React.createElement(
								'a',
								{
									href: '#',
									className: 'sunfw-update-link',
									'data-target': 'framework',
									onClick: this.props.doc.refs.update.update
								},
								SunFwString.parse('update-to'),
								'\xA0',
								React.createElement(
									'span',
									{ className: 'sunfw-footer-framework-new-version' },
									data.framework.newVersion
								)
							),
							')'
						) : null
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'pull-right' },
				this.state.others.map(other => {
					return SunFwString.parse('<span className="footer-other-products">' + other + '</span>');
				})
			)
		);
	},
	componentDidMount: function () {
		SunFw.parent();
		SunFwEvent.add(this.props.doc, 'UpdateDataFetched', this.update);
	},
	componentWillUnmount: function () {
		SunFw.parent();
		SunFwEvent.remove(this.props.doc, 'UpdateDataFetched', this.update);
	},
	update: function () {
		this.forceUpdate();
	}
});
window.SunFwComponentForm = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		rel: React.PropTypes.element,
		form: React.PropTypes.object,
		values: React.PropTypes.object,
		inline: React.PropTypes.bool,
		toolbar: React.PropTypes.bool,
		emptyClass: React.PropTypes.string,
		emptyMessage: React.PropTypes.node
	},
	getDefaultProps: function () {
		return {
			id: '',
			rel: null,
			form: {},
			values: {},
			inline: true,
			toolbar: false,
			emptyClass: 'text-center',
			emptyMessage: React.createElement(SunFwElementLoading, null)
		};
	},
	getInitialState: function () {
		return this.props;
	},
	componentWillReceiveProps: function (newProps) {
		SunFw.parent();
		var state;
		for (var p in newProps) {
			if (this.props.hasOwnProperty(p)) {
				if (typeof newProps[p] == 'object') {
					try {
						if (JSON.stringify(this.props[p]) != JSON.stringify(newProps[p])) {
							state = state || {};
							state[p] = newProps[p];
						}
					} catch (e) {
						if (this.props[p] != newProps[p]) {
							state = state || {};
							state[p] = newProps[p];
						}
					}
				} else if (this.props[p] != newProps[p]) {
					state = state || {};
					state[p] = newProps[p];
				}
			}
		}
		if (state) {
			this.setState(state);
		}
	},
	render: function () {
		SunFw.parent();
		var form = [];
		if (this.state.form.html) {
			form.push(this.state.form.html);
		} else {
			delete this.loadingControlComponent;
			for (var p in { rows: '', cols: '', controls: '' }) {
				if (this.state.form[p]) {
					form = form.concat(this[SunFwString.toCamelCase('render ' + p)](this.state.form[p]));
				}
			}
		}
		if (!form.length) {
			return React.createElement(
				'div',
				{
					ref: 'mountedDOMNode',
					className: this.state.emptyClass
				},
				SunFwString.parse(this.state.emptyMessage)
			);
		}
		var toolbar;
		if (this.state.toolbar) {
			toolbar = React.createElement(SunFwComponentMenu, {
				type: 'inline',
				className: 'pull-right item-action manipulation-actions margin-0',
				items: [{
					href: '#',
					icon: 'eye',
					onClick: this.state.rel.toggleItem
				}, {
					href: '#',
					icon: 'files-o',
					onClick: this.state.rel.cloneItem
				}, {
					href: '#',
					icon: 'trash',
					onClick: this.state.rel.deleteItem
				}]
			});
		}
		var formTitle;
		if (toolbar || this.state.form.title) {
			var className = 'clearfix sidebar-heading border-bottom padding-top-15 padding-bottom-15',
			    title = this.state.form.title;
			if (typeof title == 'string') {
				className += ' ' + title.replace(/[^a-zA-Z0-9\-_]+/g, '-').toLowerCase();
				title = React.createElement(
					'span',
					{ className: 'form-title' },
					SunFwString.parse(title)
				);
			}
			formTitle = React.createElement(
				'div',
				{ className: className },
				title,
				toolbar
			);
		}
		return React.createElement(
			'div',
			{ ref: 'mountedDOMNode' },
			formTitle,
			React.createElement(
				'div',
				{ className: this.state.form['class'] ? this.state.form['class'] : null },
				form
			)
		);
	},
	renderRows: function (rows) {
		var elms = [];
		rows.map(row => {
			var columns = [],
			    controls = [];
			if (row.cols) {
				columns = this.renderCols(row.cols);
			}
			if (row.controls) {
				controls = this.renderControls(row.controls);
			}
			if (columns.length || controls.length) {
				elms.push(React.createElement(
					SunFwElementRow,
					{ className: (row['class'] || '') + (this.isVisible(row.requires) ? '' : ' hidden') },
					row.title ? React.createElement(
						SunFwElementColumn,
						{
							xs: 12,
							className: 'row-title'
						},
						React.createElement(
							SunFwElementHeading,
							{ level: '4' },
							SunFwString.parse(row.title)
						),
						React.createElement('hr', null)
					) : null,
					columns,
					controls
				));
			}
		});
		return elms;
	},
	renderCols: function (cols) {
		var elms = [];
		cols.map(col => {
			var rows = [],
			    controls = [];
			if (col.rows) {
				rows = this.renderRows(col.rows);
			}
			if (col.controls) {
				controls = this.renderControls(col.controls);
			}
			if (rows.length || controls.length) {
				elms.push(React.createElement(
					SunFwElementColumn,
					{ className: (col['class'] || '') + (this.isVisible(col.requires) ? '' : ' hidden') },
					col.title ? React.createElement(
						'div',
						{ className: 'column-title' },
						React.createElement(
							SunFwElementHeading,
							{ level: '4' },
							SunFwString.parse(col.title)
						),
						React.createElement('hr', null)
					) : null,
					rows,
					controls
				));
			}
		});
		return elms;
	},
	renderControls: function (controls) {
		var elms = [],
		    keyName,
		    value;
		for (var setting in controls) {
			keyName = (this.state.rel ? this.state.rel.props.id : '') + '_' + setting;
			if (this.state.values && this.state.values[setting] !== undefined) {
				value = this.state.values[setting];
			} else if (controls[setting]['default'] !== undefined) {
				value = controls[setting]['default'];
			} else {
				value = '';
			}
			if (!SunFw.inputs[controls[setting].type]) {
				controls[setting].type = 'text';
			}
			var control = SunFwString.toCamelCase(controls[setting].type, true);
			if (control.indexOf('SunFwInput') < 0) {
				control = 'SunFwInput' + control;
			}
			if (!window[control] && SunFw.inputs[controls[setting].type]) {
				SunFwAjax.loadScript(SunFw.inputs[controls[setting].type]);
				this.loadingControlComponent = this.loadingControlComponent || true;
			}
			else if (window[control]) {
					elms.push(React.createElement(window[control], {
						id: keyName,
						ref: setting,
						form: this,
						value: value,
						setting: setting,
						control: controls[setting]
					}));
				}
			this.state.values[setting] = value;
		}
		if (this.loadingControlComponent) {
			this.loadingControlComponentTimer && clearTimeout(this.loadingControlComponentTimer);
			this.loadingControlComponentTimer = setTimeout(this.forceUpdate.bind(this), 500);
		}
		return elms;
	},
	componentDidUpdate: function () {
		if (!this.loadingControlComponent) {
			var inputs = this.refs.mountedDOMNode.querySelectorAll('input, textarea');
			for (var i = 0, n = inputs.length; i < n; i++) {
				var input = inputs[i];
				if (input.nodeName == 'TEXTAREA' || ['number', 'text'].indexOf(input.type) > -1) {
					if (!input._added_focus_blur) {
						SunFwEvent.add(input, 'focus', this.focus);
						SunFwEvent.add(input, 'blur', this.blur);
						input._added_focus_blur = true;
					}
				}
			}
			SunFwEvent.trigger(this, 'FormRendered');
		}
	},
	componentWillUnmount: function () {
		var inputs = this.refs.mountedDOMNode.querySelectorAll('input, textarea');
		for (var i = 0, n = inputs.length; i < n; i++) {
			var input = inputs[i];
			if (input.nodeName == 'TEXTAREA' || ['number', 'text'].indexOf(input.type) > -1) {
				if (input._added_focus_blur) {
					delete input._added_focus_blur;
					SunFwEvent.remove(input, 'focus', this.focus);
					SunFwEvent.remove(input, 'blur', this.blur);
				}
			}
		}
	},
	focus: function (event) {
		if (this.state.inline) {
			this.skipSaving = true;
		}
	},
	blur: function (event) {
		if (this.state.inline) {
			this.skipSaving = false;
			this.saveSettings();
		}
	},
	isVisible: function (requires) {
		var visible = true;
		if (requires) {
			for (var p in requires) {
				if (!visible) {
					return;
				}
				if (requires.hasOwnProperty(p)) {
					if (['string', 'number'].indexOf(typeof requires[p]) > -1) {
						if (!isNaN(parseInt(requires[p]))) {
							if (parseInt(requires[p]) != parseInt(this.state.values[p])) {
								visible = false;
							}
						} else if (requires[p] != this.state.values[p]) {
							visible = false;
						}
					} else if (requires[p] instanceof Array) {
						switch (requires[p][0]) {
							case '=':
							case '==':
								if (this.state.values[p] != requires[p][1]) {
									visible = false;
								}
								break;
							case '!=':
							case '<>':
								if (this.state.values[p] == requires[p][1]) {
									visible = false;
								}
								break;
						}
					}
				}
			}
		}
		return visible;
	},
	updateState: function (setting, value) {
		var values = this.state.values;
		if (!values || values instanceof Array) {
			values = {};
		}
		values[setting] = value;
		if (this.state.rel && this.state.rel.updateState) {
			this.state.rel.updateState(values);
		}
		if (!this.skipSaving) {
			this.setState({ values: values });
		}
		if (this.state.inline) {
			this.saveSettings(values);
		}
	},
	saveSettings: function (values, force) {
		if (force || !this.skipSaving) {
			values = values || this.state.values;
			if (this.state.rel && this.state.rel.saveSettings) {
				this.state.rel.saveSettings(values);
			}
			else if (this.props.editor) {
					this.props.editor.saveItemSettings(this.state.rel, values);
				}
		}
	}
});
window.SunFwComponentHeader = React.extendClass('SunFwMixinBase', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getComponentHeader
		};
	},
	getInitialState: function () {
		return {
			logo: {
				link: '',
				image: '',
				title: ''
			},
			menu: []
		};
	},
	render: function () {
		SunFw.parent();
		if (this.state.logo.image == '' && this.state.logo.link == '' && !this.state.menu.length) {
			return null;
		}
		return React.createElement(
			'div',
			{ className: 'jsn-topbar sunfw-top' },
			React.createElement(
				'div',
				{ className: 'container-fluid' },
				this.state.logo.image != '' ? React.createElement(
					'span',
					{ className: 'logo' },
					React.createElement('img', { src: this.state.logo.image })
				) : null,
				this.state.logo.link != '' ? React.createElement(SunFwElementLink, {
					type: 'external',
					href: this.state.logo.link,
					title: this.state.logo.title,
					target: '_blank',
					className: 'brand visible-desktop visible-tablet'
				}) : null,
				this.state.menu.length ? React.createElement(SunFwComponentMenu, {
					type: 'inline',
					items: this.state.menu,
					className: 'pull-right margin-bottom-0 top-right-menu sunfw-right-top-menu'
				}) : null
			)
		);
	}
});
window.SunFwComponentMenu = React.extendClass('SunFwMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		type: React.PropTypes.string,
		items: React.PropTypes.array,
		className: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			id: '',
			type: '',
			items: [],
			className: ''
		};
	},
	render: function () {
		SunFw.parent();
		if (!this.props.items.length) {
			return null;
		}
		var className = '';
		switch (this.props.type) {
			case 'tabs':
				className = 'nav';
				break;
			case 'inline':
				className = 'list-inline';
				break;
			case 'dropdown':
				className = 'dropdown-menu';
				break;
		}
		if (this.props.className) {
			className += ' ' + this.props.className;
		}
		return React.createElement(
			'ul',
			{ className: className },
			this.props.items.map(item => {
				var className = [];
				if (item.items) {
					className.push('dropdown');
				}
				if (item.listClass) {
					className.push(item.listClass);
				}
				return React.createElement(
					'li',
					{ className: className.join(' ') },
					React.createElement(SunFwElementLink, {
						id: item.id,
						href: item.href,
						icon: item.icon,
						type: item.type,
						title: item.title,
						target: item.target,
						onClick: item.onClick,
						className: item.className
					}),
					item.suffix ? SunFwString.parse(item.suffix) : null,
					item.items ? React.createElement(SunFwComponentMenu, {
						id: item.dropdownId,
						type: 'dropdown',
						items: item.items,
						className: item.dropdownClass
					}) : null
				);
			})
		);
	}
});
window.SunFwComponentModal = React.extendClass('SunFwMixinBase', {
	getDefaultProps: function () {
		return {
			id: '',
			show: false,
			type: '',
			title: '',
			width: '',
			height: '',
			content: '',
			buttons: [],
			preserve: false,
			className: null,
			centralize: true
		};
	},
	getInitialState: function () {
		return this.props;
	},
	render: function () {
		SunFw.parent();
		var content;
		switch (this.state.type) {
			case 'form':
				if (!this.state.content.parent) {
					this.state.content.parent = this;
				}
				if (this.props.editor && !this.state.content.editor) {
					this.state.content.editor = this.props.editor;
				}
				this.state.content.ref = 'form';
				content = React.createElement(SunFwComponentForm, this.state.content);
				break;
			case 'iframe':
				this.state.content.ref = 'iframe';
				if (this.state.content.src) {
					this.state.content.key = this.state.content.src.replace(/[^a-zA-Z0-9\-_]+/g, '');
				}
				content = React.createElement('iframe', this.state.content);
				break;
			default:
				content = SunFwString.parse(this.state.content);
				break;
		}
		var footer,
		    buttons = [];
		if (this.state.buttons instanceof Array) {
			this.state.buttons.map(button => {
				var button_text = '';
				if (button.text) {
					button_text = SunFwString.parse(button.text);
					delete button.text;
				}
				if (button['class']) {
					button.className = button['class'];
					delete button['class'];
				}
				if (!button.type) {
					button.type = 'button';
				}
				buttons.push(React.createElement('button', button, button_text));
				button.text = button_text;
			});
		}
		if (this.state.buttons != 'disabled' && !buttons.length) {
			buttons = [React.createElement(
				'button',
				{
					id: this.state.id + '-confirm-button',
					type: 'button',
					onClick: this.confirm,
					className: 'btn btn-primary'
				},
				SunFwString.parse('ok')
			), React.createElement(
				'button',
				{
					id: this.state.id + '-cancel-button',
					type: 'button',
					onClick: this.cancel,
					className: 'btn btn-default'
				},
				SunFwString.parse('cancel')
			)];
		}
		if (buttons.length) {
			footer = React.createElement(
				'div',
				{ className: 'modal-footer' },
				buttons
			);
		}
		return React.createElement(
			'div',
			{
				id: this.state.id ? this.state.id : SunFwString.toId('modal'),
				ref: 'mountedDOMNode',
				className: 'modal hidden' + (this.state.className ? ' ' + this.state.className : '')
			},
			React.createElement(
				'div',
				{ className: 'modal-dialog' },
				React.createElement(
					'div',
					{ className: 'modal-content' },
					React.createElement(
						'div',
						{ className: 'modal-header' },
						React.createElement(
							'button',
							{ type: 'button', onClick: this.close, className: 'close' },
							React.createElement(
								'span',
								null,
								'\xD7'
							)
						),
						React.createElement(
							'h4',
							{ className: 'modal-title' },
							SunFwString.parse(this.state.title)
						)
					),
					React.createElement(
						'div',
						{ className: 'modal-body' },
						content
					),
					footer
				)
			)
		);
	},
	initActions: function () {
		if (this.refs.mountedDOMNode) {
			if (this.state.show) {
				this.show();
			}
			if (this.state.type == 'form' && this.refs.form) {
				this.refs.form.setState({
					inline: false
				});
			}
		}
	},
	show: function (event) {
		event && event.preventDefault();
		var self = this;
		if (self.refs.mountedDOMNode) {
			if (self.refs.mountedDOMNode.classList.contains('hidden')) {
				self.refs.mountedDOMNode.classList.remove('hidden');
			}
			self.refs.mountedDOMNode.style.display = 'block';
			self.refs.mountedDOMNode.style.visibility = 'hidden';
			var modal_dialog = self.refs.mountedDOMNode.querySelector('.modal-dialog');
			if (self.state.width) {
				var width = parseInt(self.state.width);
				if (self.state.width.substr(-1) == '%') {
					width = window.innerWidth / 100 * width;
				}
				if (window.innerWidth < width) {
					width = window.innerWidth;
				}
				modal_dialog.style.left = (window.innerWidth - width) / 2 + 'px';
				modal_dialog.style.width = width + 'px';
			}
			var modal_body = self.refs.mountedDOMNode.querySelector('.modal-body'),
			    container_css = window.getComputedStyle(modal_dialog),
			    content_rect = self.refs.mountedDOMNode.querySelector('.modal-content').getBoundingClientRect(),
			    header = self.refs.mountedDOMNode.querySelector('.modal-header'),
			    header_rect = header ? header.getBoundingClientRect() : { top: content_rect.top, height: 0 },
			    footer = self.refs.mountedDOMNode.querySelector('.modal-footer'),
			    footer_rect = footer ? footer.getBoundingClientRect() : { height: 0 },
			    height;
			modal_body.style.overflowX = 'hidden';
			modal_body.style.overflowY = 'auto';
			if (self.state.height) {
				var height = parseInt(self.state.height);
				if (self.state.height.substr(-1) == '%') {
					height = window.innerHeight / 100 * height;
				}
				if (window.innerHeight < height) {
					height = window.innerHeight;
				}
				height -= header_rect.height + footer_rect.height;
				modal_body.style.height = height + 'px';
				modal_body.style.maxHeight = 'initial';
			}
			else {
					height = window.innerHeight - parseInt(container_css.getPropertyValue('margin-top')) - parseInt(container_css.getPropertyValue('margin-bottom')) - (header_rect.top - parseInt(container_css.getPropertyValue('margin-top'))) * 2 - header_rect.height - footer_rect.height;
					modal_body.style.height = 'initial';
					modal_body.style.maxHeight = height + 'px';
				}
			if (self.state.type == 'iframe' && ['auto', '100%'].indexOf(self.state.content.height) > -1) {
				var modal_body_css = window.getComputedStyle(modal_body),
				    iframe_css = window.getComputedStyle(self.refs.iframe);
				self.refs.iframe.style.height = height - parseInt(modal_body_css.getPropertyValue('padding-top')) - parseInt(modal_body_css.getPropertyValue('padding-bottom')) - parseInt(iframe_css.getPropertyValue('border-top-width')) - parseInt(iframe_css.getPropertyValue('border-bottom-width')) + 'px';
				modal_body.style.overflowY = 'hidden';
			}
			if (self.state.centralize) {
				modal_dialog.style.marginTop = Math.floor((window.innerHeight - modal_dialog.getBoundingClientRect().height) / 2) + 'px';
			}
			if (self.refs.form && !self.refs.form._added_update_to_change) {
				SunFwEvent.add(self.refs.form.refs.mountedDOMNode, 'change', self.update);
				self.refs.form._added_update_to_change = true;
			}
			if (self.refs.form && !self.refs.form._added_update_to_FormRendered) {
				SunFwEvent.add(self.refs.form, 'FormRendered', self.update);
				self.refs.form._added_update_to_FormRendered = true;
			}
			if (!self.refs.mountedDOMNode._added_show_to_resize) {
				SunFwEvent.add(window, 'resize', self.show);
				self.refs.mountedDOMNode._added_show_to_resize = true;
			}
			self.refs.mountedDOMNode.style.visibility = 'initial';
		}
	},
	update: function (event) {
		var self = this;
		if (self.state.centralize && !self.state.height && self.state.type == 'form' && self.refs.form) {
			var formHeight = self.refs.form.refs.mountedDOMNode.getBoundingClientRect().height;
			if (self.lastFormHeight != formHeight) {
				self.show();
			}
			self.lastFormHeight = formHeight;
		}
		SunFwEvent.trigger(this, 'ModalUpdated');
	},
	close: function (event) {
		event && event.preventDefault();
		var self = this;
		if (self.refs.mountedDOMNode) {
			self.refs.mountedDOMNode.style.display = 'none';
			if (self.refs.mountedDOMNode._added_show_to_resize) {
				delete self.refs.mountedDOMNode._added_show_to_resize;
				SunFwEvent.remove(window, 'resize', self.show);
			}
			if (self.refs.form && self.refs.form._added_update_to_FormRendered) {
				delete self.refs.form._added_update_to_FormRendered;
				SunFwEvent.remove(self.refs.form, 'FormRendered', self.update);
			}
			if (self.refs.form && self.refs.form._added_update_to_change) {
				delete self.refs.form._added_update_to_change;
				SunFwEvent.remove(self.refs.form.refs.mountedDOMNode, 'change', self.update);
			}
		}
	},
	confirm: function (event) {
		event.preventDefault();
		if (typeof this.state.confirm == 'function') {
			this.state.confirm();
		}
		if (this.props.parent && typeof this.props.parent.confirm == 'function') {
			this.props.parent.confirm();
		}
		if (this.state.type == 'form' && this.refs.form) {
			this.refs.form.saveSettings(null, true);
		}
		this.close();
	},
	cancel: function (event) {
		event.preventDefault();
		if (typeof this.state.cancel == 'function') {
			this.state.cancel();
		}
		if (this.props.parent && typeof this.props.parent.cancel == 'function') {
			this.props.parent.cancel();
		}
		this.close();
	}
});
window.SunFwComponentUpdate = React.extendClass('SunFwMixinBase', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getComponentUpdate
		};
	},
	getInitialState: function () {
		this.data = {
			framework: {
				hasUpdate: false
			},
			template: {
				hasUpdate: false
			}
		};
		return {
			ajaxServer: '',
			widgetServer: '',
			modalTitle: {
				framework: '',
				template: ''
			}
		};
	},
	componentDidUpdate: function () {
		SunFw.parent();
		if (this.state.ajaxServer != '' && !this.fetchedData) {
			SunFwAjax.request(this.state.ajaxServer + 'action=checkUpdate', function (req) {
				if (req.responseJSON && req.responseJSON.type == 'success') {
					this.data = req.responseJSON.data;
					SunFwEvent.trigger(this.props.doc, 'UpdateDataFetched');
				}
			}.bind(this));
			this.fetchedData = true;
		}
	},
	render: function () {
		return React.createElement(SunFwComponentModal, {
			id: this.props.id,
			ref: 'modal',
			type: 'ajax',
			buttons: 'disabled',
			centralize: false
		});
	},
	update: function (event) {
		if (typeof event == 'object' && event.target.getAttribute('data-target')) {
			this.target = event.target.getAttribute('data-target');
		}
		if (!this.target) {
			this.target = 'framework';
		}
		if (this.data[this.target].hasUpdate) {
			var action = typeof event == 'object' ? 'loadConfirmScreen' : event;
			if (typeof this[action] == 'function') {
				this.refs.modal.setState({
					show: true,
					title: this.state.modalTitle[this.target],
					className: 'installation-modal'
				});
				this.showCloseIcon();
				this.container = this.refs.modal.refs.mountedDOMNode.querySelector('.modal-body');
				this.container.innerHTML = '<span class="sunfw-loading-indicator inline">' + '<i class="fa fa-circle-o-notch fa-3x fa-spin"></i>' + '</span>';
				this[action]();
			}
		}
	},
	loadConfirmScreen: function () {
		SunFwAjax.request(this.state.widgetServer + 'action=confirm&target=' + this.target, function (req) {
			var response = req.responseJSON;
			if (response.data == null) {
				return this.update('loadInstallScreen');
			}
			this.container.innerHTML = response.data;
			setTimeout(function () {
				var customerInfoFields = this.container.querySelectorAll('input[name="username"], input[name="password"]'),
				    confirmUpdateButton = this.container.querySelector('#btn-confirm-update'),
				    updateBothButton = this.container.querySelector('#btn-confirm-update-both'),
				    cancelUpdateSetToken = this.container.querySelector('#btn-cancel-update-open-token-page');
				if (customerInfoFields.length == 0) {
					if (confirmUpdateButton) {
						SunFwEvent.add(confirmUpdateButton, 'click', function (event) {
							event.preventDefault();
							confirmUpdateButton.disabled = true;
							this.update('loadInstallScreen');
						}.bind(this));
					}
				} else {
					for (var i = 0, n = customerInfoFields.length; i < n; i++) {
						SunFwEvent.add(customerInfoFields[i], 'keyup', function (event) {
							this.customerInfo = {
								username: this.container.querySelector('input[name="username"]').value,
								password: this.container.querySelector('input[name="password"]').value
							};
							if (this.customerInfo.username != '' && this.customerInfo.password != '') {
								confirmUpdateButton.disabled = false;
								if (event.keyCode == 13) {
									confirmUpdateButton.click();
								}
							} else {
								confirmUpdateButton.disabled = true;
							}
						}.bind(this));
					}
					SunFwEvent.add(confirmUpdateButton, 'click', function (event) {
						event.preventDefault();
						confirmUpdateButton.disabled = false;
						SunFwAjax.request(this.state.ajaxServer + 'action=confirm', function (req) {
							var response = this.parseResponse(req);
							if (response.type == 'success') {
								this.update('loadInstallScreen');
							} else {
								alert(response.data);
							}
						}.bind(this), this.customerInfo);
					}.bind(this));
				}
				if (updateBothButton) {
					SunFwEvent.add(updateBothButton, 'click', function (event) {
						event.preventDefault();
						this.target = 'template';
						this.update('loadConfirmScreen');
					}.bind(this));
				}
				if (cancelUpdateSetToken) {
					SunFwEvent.add(cancelUpdateSetToken, 'click', function (event) {
						event.preventDefault();
						this.refs.modal.close();
						document.querySelector('a[href="#token-key"]').click();
					}.bind(this));
				}
				SunFwEvent.add(this.container.querySelector('#btn-cancel-update'), 'click', function (event) {
					event.preventDefault();
					this.refs.modal.close();
				}.bind(this));
			}.bind(this), 10);
		}.bind(this));
	},
	loadInstallScreen: function () {
		SunFwAjax.request(this.state.widgetServer + 'action=install&target=' + this.target, function (req) {
			var response = req.responseJSON;
			this.container.innerHTML = response.data;
			setTimeout(function () {
				this.btnFinish = this.container.querySelector('#btn-finish-install');
				SunFwEvent.add(this.btnFinish, 'click', function (event) {
					event.preventDefault();
					this.finishUpdate();
				}.bind(this));
				if (this.target == 'framework') {
					this.startInstallFramework();
				} else {
					this.downloadPackage();
				}
			}.bind(this), 10);
		}.bind(this));
	},
	startInstallFramework: function () {
		var downloadPackage = this.container.querySelector('li#sunfw-download-package'),
		    downloadStatus = downloadPackage.querySelector('.status'),
		    installUpdate = this.container.querySelector('li#sunfw-install-update'),
		    installStatus = installUpdate.querySelector('.status'),
		    processingInstall = this.container.querySelector('.processing-installation'),
		    finishedInstall = this.container.querySelector('.finished-installation');
		this.hideCloseIcon();
		SunFwAjax.downloadFile(this.state.ajaxServer + 'action=downloadFramework', downloadPackage.querySelector('.progress'), function (req) {
			var response = req.responseJSON;
			if (response.type == 'success') {
				downloadStatus.classList.add('fa-check');
				installUpdate.classList.remove('hidden');
				installStatus.classList.add('fa-circle-o-notch');
				installStatus.classList.add('fa-spin');
				SunFwAjax.request(this.state.ajaxServer + 'action=installFramework', function (req) {
					var response = req.responseJSON;
					installStatus.classList.remove('fa-spin');
					installStatus.classList.remove('fa-circle-o-notch');
					if (response.type == 'success') {
						installStatus.classList.add('fa-check');
						processingInstall.classList.add('hidden');
						finishedInstall.classList.remove('hidden');
					} else {
						var alert = installUpdate.querySelector('.alert');
						alert.textContent = response.data;
						alert.classList.remove('hidden');
						installStatus.classList.add('fa-times');
					}
					this.stopUpdate();
				}.bind(this));
			} else {
				var alert = downloadPackage.querySelector('.alert');
				alert.textContent = response.data;
				alert.classList.remove('hidden');
				downloadStatus.classList.add('fa-times');
			}
		}.bind(this));
	},
	downloadPackage: function () {
		var liDownload = this.container.querySelector('#sunfw-download-package'),
		    spanStatus = liDownload.querySelector('.status');
		this.hideCloseIcon();
		SunFwAjax.downloadFile(this.state.ajaxServer + 'action=download', liDownload.querySelector('.progress'), function (req) {
			var response = req.responseJSON;
			if (response.type == 'error') {
				var alert = liDownload.querySelector('.alert');
				alert.textContent = response.data;
				alert.classList.remove('hidden');
				spanStatus.classList.add('fa-times');
				this.stopUpdate();
			} else {
				spanStatus.classList.add('fa-check');
				this.checkFilesModification();
			}
		}.bind(this), this.customerInfo);
	},
	checkFilesModification: function () {
		var liCreateList = this.container.querySelector('#sunfw-backup-modified-files'),
		    spanStatus = liCreateList.querySelector('.status'),
		    putOnHold = this.container.querySelector('#sunfw-put-update-on-hold');
		liCreateList.classList.remove('hidden');
		spanStatus.classList.add('fa-circle-o-notch');
		spanStatus.classList.add('fa-spin');
		SunFwAjax.request(this.state.ajaxServer + 'action=checkBeforeUpdate', function (req) {
			var response = req.responseJSON;
			spanStatus.classList.remove('fa-spin');
			spanStatus.classList.remove('fa-circle-o-notch');
			if (response.type == 'success') {
				spanStatus.classList.add('fa-check');
				if (response.data.hasModification == true) {
					this.hasModification = true;
					var warnDownloadBackup = liCreateList.querySelector('#sunfw-download-backup-of-modified-files');
					warnDownloadBackup.classList.remove('hidden');
					SunFwEvent.add(putOnHold.querySelector('#btn-continue-install'), 'click', function (event) {
						event.preventDefault();
						warnDownloadBackup.classList.add('hidden');
						putOnHold.classList.add('hidden');
						this.prepareUpdate();
					}.bind(this));
					SunFwEvent.add(putOnHold.querySelector('#btn-cancel-install'), 'click', function (event) {
						event.preventDefault();
						this.finishUpdate();
					}.bind(this));
					putOnHold.classList.remove('hidden');
					putOnHold.parentNode.classList.remove('hidden');
				} else {
					this.prepareUpdate();
				}
			} else {
				var alert = liCreateList.querySelector('.alert');
				alert.textContent = response.data;
				alert.classList.remove('hidden');
				spanStatus.classList.add('fa-times');
				this.stopUpdate();
			}
		}.bind(this));
	},
	prepareUpdate: function () {
		if (this.data.framework.hasUpdate) {
			var downloadPackage = this.container.querySelector('li#sunfw-download-framework'),
			    downloadStatus = downloadPackage.querySelector('.status'),
			    installUpdate = this.container.querySelector('li#sunfw-install-framework'),
			    installStatus = installUpdate.querySelector('.status');
			downloadPackage.classList.remove('hidden');
			SunFwAjax.downloadFile(this.state.ajaxServer + 'action=downloadFramework', downloadPackage.querySelector('.progress'), function (req) {
				var response = req.responseJSON;
				if (response.type == 'success') {
					downloadStatus.classList.add('fa-check');
					installUpdate.classList.remove('hidden');
					installStatus.classList.add('fa-circle-o-notch');
					installStatus.classList.add('fa-spin');
					SunFwAjax.request(this.state.ajaxServer + 'action=installFramework', function (req) {
						var response = req.responseJSON;
						installStatus.classList.remove('fa-spin');
						installStatus.classList.remove('fa-circle-o-notch');
						if (response.type == 'success') {
							installStatus.classList.add('fa-check');
							this.installUpdate();
						} else {
							var alert = installUpdate.querySelector('.alert');
							alert.textContent = response.data;
							alert.classList.remove('hidden');
							installStatus.classList.add('fa-times');
						}
					}.bind(this));
				} else {
					var alert = downloadPackage.querySelector('.alert');
					alert.textContent = response.data;
					alert.classList.remove('hidden');
					downloadStatus.classList.add('fa-times');
				}
			}.bind(this));
		} else {
			this.installUpdate();
		}
	},
	installUpdate: function () {
		var liInstall = this.container.querySelector('#sunfw-install-update'),
		    spanStatus = liInstall.querySelector('.status'),
		    processingInstall = this.container.querySelector('.processing-installation'),
		    finishedInstall = this.container.querySelector('.finished-installation');
		liInstall.classList.remove('hidden');
		spanStatus.classList.add('fa-circle-o-notch');
		spanStatus.classList.add('fa-spin');
		SunFwAjax.request(this.state.ajaxServer + 'action=installPackage', function (req) {
			var response = req.responseJSON;
			if (response.type == 'success') {
				if (this.hasModification) {
					finishedInstall.querySelector('#sunfw-backup-information').classList.remove('hidden');
				}
				SunFwAjax.request(this.state.ajaxServer + 'action=compileCss', function (req) {
					var response = req.responseJSON;
					spanStatus.classList.remove('fa-spin');
					spanStatus.classList.remove('fa-circle-o-notch');
					spanStatus.classList.add('fa-check');
					processingInstall.classList.add('hidden');
					finishedInstall.classList.remove('hidden');
					this.stopUpdate();
				}.bind(this));
			} else {
				spanStatus.classList.remove('fa-spin');
				spanStatus.classList.remove('fa-circle-o-notch');
				var alert = liInstall.querySelector('.alert');
				alert.textContent = response.data;
				alert.classList.remove('hidden');
				spanStatus.classList.add('fa-times');
				this.stopUpdate();
			}
		}.bind(this));
	},
	showCloseIcon: function () {
		this.refs.modal.refs.mountedDOMNode.querySelector('.modal-header .close').classList.remove('hidden');
	},
	hideCloseIcon: function () {
		this.refs.modal.refs.mountedDOMNode.querySelector('.modal-header .close').classList.add('hidden');
	},
	stopUpdate: function () {
		this.btnFinish.classList.remove('hidden');
		var parent = this.btnFinish.parentNode;
		while (!parent.classList.contains('hidden') && parent.nodeName != 'BODY') {
			parent = parent.parentNode;
		}
		parent.classList.remove('hidden');
	},
	finishUpdate: function () {
		this.btnFinish.disabled = true;
		this.btnFinish.innerHTML = SunFwString.parse('please-wait');
		this.btnFinish.style.cursor = 'wait';
		window.location.reload();
	},
	handleComponentWillUnmount: function () {
		for (var p in { framework: '', template: '' }) {
			var button = document.querySelector('#sunfw-update-' + p + '-now-btn');
			if (button && button._listened_click_event) {
				delete button._listened_click_event;
				SunFwEvent.remove(button, 'click', this.update);
			}
		}
	}
});
window.SunFwTemplateAdmin = React.extendClass('SunFwMixinBase', {
	render: function () {
		SunFw.parent();
		return React.createElement(
			"div",
			{ id: "sunfw-template-admin" },
			React.createElement(SunFwComponentAlerts, {
				id: "sunfw-template-admin-alerts",
				ref: "alerts",
				doc: this
			}),
			React.createElement(SunFwComponentHeader, {
				id: "sunfw-template-admin-header",
				ref: "header",
				doc: this
			}),
			React.createElement(SunFwComponentBody, {
				id: "sunfw-template-admin-body",
				ref: "body",
				doc: this
			}),
			React.createElement(SunFwComponentFooter, {
				id: "sunfw-template-admin-footer",
				ref: "footer",
				doc: this
			}),
			React.createElement(SunFwComponentUpdate, {
				id: "sunfw-template-admin-update",
				ref: "update",
				doc: this
			})
		);
	}
});
