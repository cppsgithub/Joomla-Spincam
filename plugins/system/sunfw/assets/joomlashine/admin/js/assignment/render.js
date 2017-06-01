window.SunFwPaneAssignmentActions = React.extendClass('SunFwPaneMixinAction', {
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
			SunFwString.parse('save-assignment')
		);
	}
});
window.SunFwPaneAssignment = React.extendClass('SunFwPaneMixinEditor', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getPaneAssignment
		};
	},
	getInitialState: function () {
		return {
			changed: false
		};
	},
	getDefaultData: function () {
		if (!this.lastSaved) {
			this.lastSaved = [];
			this.config.menus.map(menu => {
				menu.links.map(link => {
					if (link.template_style_id == this.config.styleId) {
						this.lastSaved.push(link.value);
					}
				});
			});
		}
		return {
			items: this.lastSaved
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
				className: 'assignment'
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
							SunFwString.parse('assignment')
						)
					),
					React.createElement('div', { className: 'col-xs-4' }),
					React.createElement(
						'div',
						{ className: 'col-xs-4 text-right' },
						React.createElement(SunFwPaneAssignmentActions, {
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
							React.createElement(
								'div',
								{ className: 'row sunfw-menu-assignment' },
								this.config.menus.map((menu, index) => {
									if (menu.links && menu.links.length) {
										return React.createElement(SunFwPaneAssignmentMenu, {
											index: index,
											parent: this,
											editor: this
										});
									}
								})
							)
						)
					)
				)
			)
		);
	}
});
window.SunFwPaneAssignmentMenu = React.extendClass('SunFwPaneMixinBase', {
	propTypes: {
		index: React.PropTypes.string
	},
	getDefaultProps: function () {
		return {
			index: 0
		};
	},
	getInitialState: function () {
		return {
			hidden: []
		};
	},
	render: function () {
		var data = this.editor.getData(),
		    menu = this.editor.config.menus[this.props.index];
		var next, checked, disabled, collapsed;
		return React.createElement(
			"div",
			{
				ref: "wrapper",
				className: "col-xs-3 box"
			},
			React.createElement(
				"div",
				{ className: "content" },
				React.createElement(
					"ul",
					{ id: 'menu-type-' + menu.menutype },
					React.createElement(
						"li",
						{ className: "menu-type-header" },
						React.createElement(
							"label",
							{ className: "checkbox menu-type" },
							React.createElement("input", { type: "checkbox", onChange: this.checkAll }),
							menu.title || menu.menutype
						),
						React.createElement("hr", null)
					),
					menu.links.map((link, i) => {
						next = i < menu.links.length - 1 ? menu.links[i + 1] : null;
						checked = data.items.indexOf(link.value) > -1;
						disabled = parseInt(link.checked_out) && link.checked_out != this.editor.config.userId;
						if (next && next.level > link.level) {
							collapsed = this.state.hidden.indexOf(next.value) > -1;
						}
						return React.createElement(
							"li",
							{
								className: this.state.hidden.indexOf(link.value) > -1 ? 'hidden' : '',
								"data-level": link.level
							},
							React.createElement(
								"label",
								{
									forName: 'link' + link.value,
									className: 'checkbox level' + link.level
								},
								React.createElement("input", {
									id: 'link' + link.value,
									type: "checkbox",
									name: "sunfw-menu-assignment[assigned][]",
									value: link.value,
									checked: checked,
									disabled: disabled,
									className: "menu-item",
									onChange: this.check
								}),
								link.text,
								next && next.level > link.level ? React.createElement(
									"span",
									null,
									"\xA0",
									React.createElement(
										"a",
										{
											href: "javascript:void(0)",
											className: "sunfw-menu-assignment-toggle",
											onClick: this.toggleChildrenSelection
										},
										React.createElement("i", { className: "fa fa-check-square" })
									),
									"\xA0",
									React.createElement(
										"a",
										{
											href: "javascript:void(0)",
											onClick: this.toggleChildrenVisibility
										},
										React.createElement("i", { className: 'sunfw-menu-tree-toggle fa fa-' + (collapsed ? 'plus' : 'minus') })
									)
								) : null
							)
						);
					})
				)
			)
		);
	},
	check: function (event) {
		var data = this.editor.getData();
		if (event.target.checked) {
			data.items.push(event.target.value);
		} else {
			var index = data.items.indexOf(event.target.value);
			data.items.splice(index, 1);
		}
		this.editor.setData(data);
		this.forceUpdate();
	},
	checkAll: function (event) {
		var data = this.editor.getData();
		var links = this.refs.wrapper.querySelectorAll('input[name]'),
		    checking = false;
		for (var i = 0, n = links.length; i < n; i++) {
			if (event.target.checked) {
				checking = true;
				break;
			}
		}
		for (var i = 0, n = links.length; i < n; i++) {
			var index = data.items.indexOf(links[i].value);
			if (checking && index < 0) {
				data.items.push(links[i].value);
			} else if (!checking && index > -1) {
				data.items.splice(index, 1);
			}
		}
		this.editor.setData(data);
		this.forceUpdate();
	},
	toggleChildrenSelection: function (event) {
		var data = this.editor.getData(),
		    current = event.target.parentNode.parentNode.parentNode.parentNode,
		    currentLevel = parseInt(current.getAttribute('data-level')),
		    next = current.nextElementSibling;
		while (next && parseInt(next.getAttribute('data-level')) > currentLevel) {
			var item = next.querySelector('input').value,
			    index = data.items.indexOf(item);
			if (index < 0) {
				data.items.push(item);
			} else {
				data.items.splice(index, 1);
			}
			next = next.nextElementSibling;
		}
		this.editor.setData(data);
		this.forceUpdate();
	},
	toggleChildrenVisibility: function (event) {
		var hidden = this.state.hidden,
		    current = event.target.parentNode.parentNode.parentNode.parentNode,
		    currentLevel = parseInt(current.getAttribute('data-level')),
		    next = current.nextElementSibling,
		    collapsing;
		while (next && parseInt(next.getAttribute('data-level')) > currentLevel) {
			var item = next.querySelector('input').value,
			    index = hidden.indexOf(item);
			if (collapsing === undefined) {
				collapsing = index > -1 ? false : true;
			}
			if (collapsing && index < 0) {
				hidden.push(item);
			} else if (!collapsing && index > -1) {
				hidden.splice(index, 1);
			}
			next = next.nextElementSibling;
		}
		this.setState({
			hidden: hidden
		});
	}
});
