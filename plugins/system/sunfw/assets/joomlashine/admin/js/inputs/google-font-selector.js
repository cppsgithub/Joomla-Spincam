window.SunFwInputGoogleFontSelector = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value,
			fonts: [],
			category: '',
			subset: '',
			search: '',
			page: 1
		};
	},
	componentWillMount: function () {
		SunFw.parent();
		var server = SunFw.urls.ajaxBase + '&context=styles&action=getGoogleFonts';
		SunFwAjax.request(server, function (req) {
			var response = req.responseJSON;
			if (response.type == 'success') {
				this.setState({
					fonts: response.data.items
				});
			} else {
				bootbox.alert(response.data);
			}
		}.bind(this));
	},
	render: function () {
		if (typeof this.state.value == 'string') {
			this.state.value = {
				family: this.state.value
			};
		}
		if (this.state.value.subset !== undefined) {
			this.state.subset = this.state.value.subset;
		}
		this.total = this.state.fonts.length;
		if (!this.state.categories || !this.state.subsets) {
			this.state.categories = [];
			this.state.subsets = [];
		}
		this.state.fonts.map((font, idx) => {
			if (this.state.categories.indexOf(font.category) < 0) {
				this.state.categories.push(font.category);
			}
			font.subsets.map(subset => {
				if (this.state.subsets.indexOf(subset) < 0) {
					this.state.subsets.push(subset);
				}
			});
			this.state.fonts[idx].visible = true;
			if (this.state.category != '') {
				if (font.category != this.state.category) {
					this.total--;
					this.state.fonts[idx].visible = false;
				}
			}
			if (this.state.subset != '' && this.state.fonts[idx].visible) {
				if (font.subsets.indexOf(this.state.subset) < 0) {
					this.total--;
					this.state.fonts[idx].visible = false;
				}
			}
			if (this.state.search != '' && this.state.fonts[idx].visible) {
				if (font.family.toLowerCase().indexOf(this.state.search.toLowerCase()) < 0) {
					this.total--;
					this.state.fonts[idx].visible = false;
				}
			}
		});
		var variant_selector = [],
		    selected = this.state.value.family.split(':');
		selected = selected[1] ? selected[1].split(',') : [];
		selected.map(variant => {
			var label = variant;
			if (label.match(/^(\d+)([a-z]+)$/)) {
				label = label.replace(/^(\d+)([a-z]+)$/, '$1 $2');
			}
			if (label.match(/\d+/)) {
				variant_selector.push(React.createElement(
					'option',
					{ value: variant, selected: variant == this.state.value.variant },
					label
				));
			} else if (variant == 'regular') {
				var fontWeight = 'normal';
				variant_selector.push(React.createElement(
					'option',
					{ value: fontWeight, selected: fontWeight == this.state.value.variant },
					SunFwString.parse('normal')
				));
			}
		});
		if (variant_selector.length) {
			variant_selector = React.createElement(
				'div',
				{ className: 'form-group' },
				React.createElement(
					'label',
					null,
					SunFwString.parse('google-font-variant')
				),
				React.createElement(
					'select',
					{
						ref: 'selector',
						name: 'variant',
						onChange: this.change,
						className: 'form-control'
					},
					variant_selector
				)
			);
		}
		return React.createElement(
			'div',
			{
				key: this.props.id,
				ref: 'wrapper'
			},
			React.createElement(
				'div',
				{ className: 'form-group' },
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
						ref: 'field',
						value: this.state.value.family + (this.state.value.subset ? ' ' + SunFwString.parse('google-font-subset').replace('%s', SunFwString.capitalize(this.state.value.subset)) : ''),
						disabled: 'disabled',
						className: 'form-control'
					}),
					React.createElement(
						'span',
						{ className: 'input-group-addon' },
						React.createElement(
							'a',
							{ href: '#', onClick: this.selectFont },
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
				)
			),
			variant_selector
		);
	},
	initActions: function () {
		SunFw.parent();
		if (this.refs.wrapper) {
			if (this.refs.selector) {
				this.initChosen();
			}
			if (this.modal && this.modal.refs.mountedDOMNode.style.display == 'block') {
				this.modal.setState({
					content: this.renderModal()
				});
			}
			var parent = this.refs.wrapper.parentNode,
			    parent_css = window.getComputedStyle(parent),
			    visible = true;
			while (visible && parent.nodeName != 'BODY') {
				if (parent_css.getPropertyValue('display') != 'none') {
					parent = parent.parentNode;
					parent_css = window.getComputedStyle(parent);
				} else {
					visible = false;
				}
			}
			if (this.lastVisibility == 'hidden' && visible && this.state.value.family == '') {
				this.selectFont();
			}
			this.lastVisibility = visible ? '' : 'hidden';
		}
	},
	selectFont: function (event) {
		event && event.preventDefault();
		this.last_value = this.last_value || JSON.parse(JSON.stringify(this.state.value));
		this.modal = SunFwModal.get({
			id: 'google_font_selector_modal',
			title: 'google-font-selector',
			height: '90%',
			type: 'html',
			content: this.renderModal(),
			buttons: [{
				text: 'ok',
				onClick: function () {
					this.change(this.props.setting, this.state.value);
					delete this.last_value;
					this.closeModal();
				}.bind(this),
				className: 'btn btn-primary'
			}, {
				text: 'cancel',
				onClick: function () {
					this.setState({
						value: this.last_value
					});
					this.closeModal();
				}.bind(this),
				className: 'btn btn-default'
			}],
			'class': 'fixed'
		});
		setTimeout(function () {
			var modal_body = this.modal.refs.mountedDOMNode.querySelector('.modal-body');
			if (!modal_body._listened_scroll_event) {
				SunFwEvent.add(modal_body, 'scroll', this.scroll);
				modal_body._listened_scroll_event = true;
			}
		}.bind(this), 100);
	},
	renderModal: function () {
		return React.createElement(
			'div',
			{ className: 'container-fluid' },
			React.createElement(
				'div',
				{ className: 'clearfix header-find-font' },
				React.createElement(
					'div',
					{ className: 'form-inline pull-left' },
					React.createElement(
						'div',
						{ className: 'form-group' },
						React.createElement(
							'select',
							{
								name: 'category',
								onChange: this.filterGoogleFonts,
								className: 'form-control'
							},
							React.createElement(
								'option',
								{ value: '' },
								SunFwString.parse('google-font-categories')
							),
							this.state.categories.map(category => {
								return React.createElement(
									'option',
									{
										value: category,
										selected: this.state.category == category
									},
									SunFwString.capitalize(category)
								);
							})
						)
					),
					React.createElement(
						'div',
						{ className: 'form-group' },
						React.createElement(
							'select',
							{
								name: 'subset',
								onChange: this.filterGoogleFonts,
								className: 'form-control'
							},
							React.createElement(
								'option',
								{ value: '' },
								SunFwString.parse('google-font-subsets')
							),
							this.state.subsets.map(subset => {
								return React.createElement(
									'option',
									{
										value: subset,
										selected: this.state.subset == subset
									},
									SunFwString.capitalize(subset)
								);
							})
						)
					),
					React.createElement(
						'span',
						{ className: 'total-fonts' },
						SunFwString.parse('google-font-total').replace('%TOTAL%', this.total)
					)
				),
				React.createElement(
					'div',
					{ className: 'form-inline pull-right' },
					React.createElement(
						'div',
						{ className: 'form-group' },
						React.createElement('input', {
							name: 'search',
							value: this.state.search,
							onChange: this.filterGoogleFonts,
							className: 'form-control',
							placeholder: SunFwString.parse('google-font-search')
						})
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'row' },
				this.renderFonts()
			)
		);
	},
	renderFonts: function () {
		var fonts = [],
		    count = 0,
		    selected = this.state.value.family.split(':');
		for (var i = 0; i < this.state.fonts.length; i++) {
			var font = this.state.fonts[i];
			if (font.visible) {
				count++;
				var name = font.family.replace(/[^a-zA-Z0-9]+/g, ''),
				    style = document.getElementById('sunfw-google-font-' + name);
				if (font.files.regular && !style) {
					style = document.createElement('style');
					style.id = 'sunfw-google-font-' + name;
					style.type = 'text/css';
					var font_regular = font.files.regular.replace('http:', '');
					style.textContent = '@font-face { font-family: "' + font.family + '"; src: url(' + font_regular + '); }';
					document.head.appendChild(style);
				}
				var style = {
					'font-family': font.family
				};
				var variants = [];
				if (selected[0] == font.family) {
					var selected_variants = selected[1] ? selected[1].split(',') : [];
					variants = React.createElement(
						'div',
						{ className: 'font-variants' },
						font.variants.map(variant => {
							var label = variant;
							if (label.match(/^(\d+)([a-z]+)$/)) {
								label = label.replace(/^(\d+)([a-z]+)$/, '$1 $2');
							}
							label = SunFwString.capitalize(label);
							return React.createElement(
								'div',
								{ className: 'checkbox' },
								React.createElement(
									'label',
									null,
									React.createElement('input', {
										name: 'variants',
										type: 'checkbox',
										value: variant,
										checked: selected_variants.indexOf(variant) > -1,
										onClick: this.updateGoogleFontVariants
									}),
									label
								)
							);
						})
					);
				}
				fonts.push(React.createElement(
					'div',
					{ className: 'col-xs-3', style: { clear: count % 4 == 1 ? 'both' : '' } },
					React.createElement(
						'div',
						{ className: 'radio' },
						React.createElement(
							'label',
							{ className: selected[0] == font.family ? 'checked' : '' },
							React.createElement('input', {
								name: 'family',
								type: 'radio',
								value: font.family,
								onClick: this.change,
								checked: selected[0] == font.family ? 'checked' : ''
							}),
							React.createElement(
								'span',
								{ style: style },
								font.family
							)
						)
					),
					React.createElement(
						'div',
						{ className: 'font-preview' },
						React.createElement(
							'p',
							{ style: style },
							'The quick brown fox jumps over the lazy dog.'
						)
					),
					variants
				));
				if (count >= this.state.page * 30) {
					break;
				}
			}
		}
		return fonts;
	},
	filterGoogleFonts: function (event) {
		var state = { from: 0 };
		if (event.target.nodeName == 'SELECT') {
			state[event.target.name] = event.target.options[event.target.selectedIndex].value;
		} else {
			state[event.target.name] = event.target.value;
		}
		if (event.target.name == 'subset') {
			var value = this.state.value;
			value.subset = event.target.value;
			state.value = value;
		}
		this.setState(state);
	},
	updateGoogleFontVariants: function (event) {
		var container = event.target.parentNode;
		while (!container.classList.contains('font-variants') && container.nodeName != 'BODY') {
			container = container.parentNode;
		}
		var variants = container.querySelectorAll('input[name="variants"]'),
		    value = this.state.value;
		value.family = value.family.split(':')[0];
		for (var i = 0; i < variants.length; i++) {
			if (variants[i].checked) {
				value.family += (value.family.indexOf(':') > 0 ? ',' : ':') + variants[i].value;
			}
		}
		this.changed = true;
		this.setState({
			value: value
		});
	},
	closeModal: function () {
		var modal_body = this.modal.refs.mountedDOMNode.querySelector('.modal-body');
		if (modal_body._listened_scroll_event) {
			delete modal_body._listened_scroll_event;
			SunFwEvent.remove(modal_body, 'scroll', this.scroll);
		}
		this.modal.close();
	},
	scroll: function (event) {
		this.timeout && clearTimeout(this.timeout);
		this.timeout = setTimeout(function () {
			this.setState({
				page: this.state.page + 1
			});
		}.bind(this), 1000);
	},
	change: function (event) {
		var value = this.state.value,
		    name = event.target ? event.target.name : arguments[0];
		if (name == this.props.setting) {
			return SunFw.parent();
		}
		value[name] = event.target ? event.target.value : arguments[1];
		if (name == 'variant') {
			SunFw.parent(this.props.setting, value);
		} else {
			this.setState({
				value: value
			});
		}
	}
});