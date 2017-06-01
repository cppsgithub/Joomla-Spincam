window.SunFwPaneStylesMixinItem = React.extendClass('SunFwPaneMixinBase', {
	mixins: [SunFwPaneMixinItem],
	initActions: function () {
		if (this.editor && this.editor.current.group) {
			if (this.props['settings-key']) {
				this.editor.refs[this.editor.current.group + '_' + this.props['settings-key']] = this;
			} else if (this.props.type) {
				this.editor.refs[this.editor.current.group + '_' + this.props.type] = this;
			}
		}
	},
	editItem: function (event) {
		event.preventDefault();
		event.stopPropagation();
		this.editor.selectItem(this.props['settings-key'] ? this.props['settings-key'] : this.props.type);
	}
});
window.SunFwPaneStylesItemButton = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			type: 'button',
			variant: 'default',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'display-inline style-editor-item preview-' + this.props.variant + '-button-settings',
		    previewContent = '',
		    styleButton = {},
		    settings = this.editor.getItemSettingsForPreview(this);
		for (var p in settings) {
			if (!settings[p]) {
				continue;
			}
			switch (p) {
				case 'btn-' + this.props.variant + '-padding':
					for (var s in settings[p]) {
						styleButton['padding-' + s] = settings[p][s];
					}
					break;
				case 'btn-' + this.props.variant + '-bg':
					styleButton['background'] = settings[p];
					break;
				case 'btn-' + this.props.variant + '-border-all':
					var universal = settings[p].universal && parseInt(settings[p].universal) ? true : false;
					for (var s in settings[p]) {
						if (s == 'universal') {
							continue;
						}
						if (settings[p].universal == true && !s.match(/(top|right|bottom|left)/)) {
							styleButton['border-' + s] = settings[p][s];
						} else if (settings[p].universal == false && s.match(/(top|right|bottom|left)/)) {
							styleButton['border-' + s] = settings[p][s];
						}
					}
					break;
				case 'btn-' + this.props.variant + '-radius':
					for (var s in settings[p]) {
						styleButton['border-' + s + '-radius'] = settings[p][s];
					}
					break;
				case 'btn-' + this.props.variant + '-box-shadow':
					var objBoxShadow = { 'h-shadow': '0', 'v-shadow': '0', blur: '0', spread: '0', color: '', inset: '' },
					    vBoxShadow = '';
					for (var s in settings[p]) {
						objBoxShadow[s] = settings[p][s];
					}
					for (var b in objBoxShadow) {
						if (!isNaN(objBoxShadow[b]) && objBoxShadow[b] != '') {
							vBoxShadow = vBoxShadow.concat(objBoxShadow[b] + 'px ');
						} else {
							if (typeof objBoxShadow[b] == 'function') {
								objBoxShadow[b] = '';
							}
							vBoxShadow = vBoxShadow.concat(objBoxShadow[b] + ' ');
						}
					}
					styleButton['box-shadow'] = vBoxShadow;
					styleButton['-webkit-box-shadow'] = vBoxShadow;
					break;
				case 'btn-' + this.props.variant + '-color':
					styleButton['color'] = settings[p];
					break;
				case 'btn-' + this.props.variant + '-font-weight':
					styleButton['font-weight'] = settings[p];
					break;
				case 'btn-' + this.props.variant + '-font-style':
					styleButton['font-style'] = settings[p];
					break;
				case 'btn-' + this.props.variant + '-text-transform':
					styleButton['text-transform'] = settings[p];
					break;
				case 'btn-' + this.props.variant + '-base-size':
					styleButton['font-size'] = settings[p];
					break;
				case 'btn-' + this.props.variant + '-letter-spacing':
					styleButton['letter-spacing'] = settings[p];
					break;
				case 'btn-' + this.props.variant + '-text-shadow':
					var styleTextshadow = '',
					    hShadow = settings[p]['h-shadow'],
					    vShadow = settings[p]['v-shadow'],
					    blur = settings[p].blur,
					    color = settings[p].color;
					if (hShadow) {
						styleTextshadow = styleTextshadow.concat(hShadow + 'px ');
					} else {
						styleTextshadow = styleTextshadow.concat('0px ');
					}
					if (vShadow) {
						styleTextshadow = styleTextshadow.concat(vShadow + 'px ');
					} else {
						styleTextshadow = styleTextshadow.concat('0px ');
					}
					if (blur) {
						styleTextshadow = styleTextshadow.concat(blur + 'px ');
					}
					if (color) {
						styleTextshadow = styleTextshadow.concat(color);
					}
					styleButton['text-shadow'] = styleTextshadow;
					break;
			}
		}
		previewContent = React.createElement(
			'button',
			{ style: styleButton, className: 'btn btn-' + this.props.variant },
			SunFwString.capitalize(this.props.variant) + ' Button'
		);
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			previewContent
		);
	}
});
window.SunFwPaneStylesItemColor = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			type: 'color',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'style-editor-item preview-color-settings',
		    previewContent = '';
		var styleMainColor = {},
		    styleSubColor = {},
		    settings = this.editor.getItemSettings(this);
		for (var p in settings) {
			if (!settings[p]) {
				continue;
			}
			switch (p) {
				case 'main-color':
					styleMainColor['background'] = settings[p];
					break;
				case 'sub-color':
					styleSubColor['background'] = settings[p];
					break;
			}
		}
		previewContent = React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ className: 'mainColor' },
				React.createElement(
					'h4',
					null,
					'Main Color'
				),
				React.createElement('span', { style: styleMainColor })
			),
			React.createElement(
				'div',
				{ className: 'subColor' },
				React.createElement(
					'h4',
					null,
					'Sub Color'
				),
				React.createElement('span', { style: styleSubColor })
			)
		);
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			previewContent
		);
	}
});
window.SunFwPaneStylesItemContent = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			type: 'content',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'style-editor-item preview-content-settings',
		    previewContent = '',
		    styleContent = {},
		    settings = this.editor.getItemSettingsForPreview(this);
		for (var p in settings) {
			if (!settings[p] || p == 'content-font-type') {
				continue;
			}
			switch (p) {
				case 'content-standard-font-family':
				case 'content-google-font-family':
				case 'content-custom-font-file':
					if (settings['content-font-type'] == 'standard' && p == 'content-standard-font-family') {
						styleContent['font-family'] = settings[p];
					} else if (settings['content-font-type'] == 'google' && p == 'content-google-font-family') {
						if (settings[p].family) {
							styleContent['font-family'] = settings[p].family.split(':')[0];
							SunFwAjax.loadStylesheet('https://fonts.googleapis.com/css?family=' + settings[p].family + (settings[p].subset ? '&subset=' + settings[p].subset : ''));
						}
						if (settings[p].variant) {
							if (settings[p].variant.match(/^\d+$/)) {
								styleContent['font-weight'] = parseInt(settings[p].variant);
							} else {
								styleContent['font-weight'] = settings[p].variant;
							}
						}
					} else if (settings['content-font-type'] == 'custom' && p == 'content-custom-font-file') {
						if (settings[p]) {
							var url = SunFw.urls.root + '/' + settings[p],
							    sheet = document.styleSheets[document.styleSheets.length - 1],
							    fontFamily = url.match(/\/([^\/\.]+)\.(eot|otf|ttf|woff|woff2)$/),
							    cssRules = {
								'@font-face': 'font-family: "' + fontFamily[1] + '"; src: url("' + url + '");'
							};
							for (var selector in cssRules) {
								if (sheet.insertRule && typeof sheet.cssRules != 'undefined' && sheet.cssRules != null && typeof sheet.cssRules.length != 'undefined') {
									sheet.insertRule(selector + " {" + cssRules[selector] + "}", sheet.cssRules.length);
								} else if (sheet.addRule) {
									sheet.addRule(selector, cssRules[selector]);
								}
							}
							styleContent['font-family'] = '"' + fontFamily[1] + '"';
						}
					}
					break;
				case 'color':
				case 'text-color':
					styleContent['color'] = settings[p];
					break;
				case 'content-font-family':
					styleContent['font-family'] = settings[p];
					break;
				case 'font-size-base':
					styleContent['font-size'] = settings[p];
					break;
				case 'line-height':
				case 'line-height-base':
					styleContent['line-height'] = settings[p] + 'em';
					break;
				default:
					styleContent[p] = settings[p];
					break;
			}
		}
		previewContent = React.createElement(
			'p',
			{ style: styleContent },
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla aliquam imperdiet vestibulum. Sed nunc lectus, pretium ac libero vitae, porta tempus lectus. Phasellus faucibus dolor sit amet volutpat aliquam. Maecenas dictum tortor orci, et scelerisque arcu condimentum in. Quisque tristique fringilla aliquet. Quisque malesuada quam finibus nunc lobortis dictum. Quisque dapibus risus neque, vel fringilla nisl feugiat fermentum. Fusce ac purus non turpis dignissim efficitur. Cras et nibh elementum, tincidunt diam nec, hendrerit risus.'
		);
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			previewContent
		);
	},
	initActions: function () {
		if (!this.refs.wrapper) {
			return;
		}
		SunFw.parent();
		var settings = this.editor.getItemSettingsForPreview(this);
		if (settings['content-font-type'] == 'google' && settings['content-google-font-family'] && settings['content-google-font-family']['variant']) {
			var elm = this.refs.wrapper.querySelector('p');
			elm.style.fontWeight = settings['content-google-font-family']['variant'].match(/^\d+$/) ? parseInt(settings['content-google-font-family']['variant']) : settings['content-google-font-family']['variant'];
		}
	}
});
window.SunFwPaneStylesItemDropdownMenu = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			type: 'dropdown-menu',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'dropdown-menu style-editor-item preview-dropdown-menu-settings';
		var styleMenu = {},
		    styleItem = {},
		    styleActive = {},
		    settings = this.editor.getItemSettingsForPreview(this);
		for (var p in settings) {
			if (!settings[p]) {
				continue;
			}
			switch (p) {
				case 'link-color-hover':
					styleActive['color'] = settings[p];
					break;
				case 'background-color-hover':
					styleActive['background'] = settings[p];
					break;
				case 'width-dropdown':
					styleMenu['width'] = settings[p];
					break;
				default:
					styleItem[p] = styleActive[p] = settings[p];
					break;
			}
		}
		if (settings['background-color']) {
			styleMenu['background'] = styleItem['background'] = styleItem['background-color'];
		}
		return React.createElement(
			'div',
			{ className: 'show-menu' },
			React.createElement(
				'ul',
				{
					ref: 'wrapper',
					style: styleMenu,
					onClick: this.editItem,
					className: className,
					onMouseOver: this.mouseover,
					onMouseOut: this.mouseout
				},
				React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{ style: styleItem, href: '#' },
						'Apps'
					)
				),
				React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{ style: styleItem, href: '#' },
						'Games'
					)
				),
				React.createElement(
					'li',
					{ className: 'active' },
					React.createElement(
						'a',
						{ style: styleActive, href: '#' },
						'Movies'
					)
				),
				React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{ style: styleItem, href: '#' },
						'Books'
					)
				),
				React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{ style: styleItem, href: '#' },
						'Newspapers'
					)
				)
			)
		);
	}
});
window.SunFwPaneStylesItemHeading = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			type: 'heading',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'style-editor-item preview-heading-settings',
		    headings = [],
		    previewContent = '',
		    styleHeading = {},
		    settings = this.editor.getItemSettingsForPreview(this),
		    fontSizeH1 = 32,
		    fontSizeH2 = 26,
		    fontSizeH3 = 21,
		    fontSizeH4 = 15,
		    fontSizeH5 = 12,
		    fontSizeH6 = 11;
		for (var p in settings) {
			if (!settings[p] || p == 'headings-font-type') {
				continue;
			}
			switch (p) {
				case 'headings-standard-font-family':
				case 'headings-google-font-family':
				case 'headings-custom-font-file':
					if (settings['headings-font-type'] == 'standard' && p == 'headings-standard-font-family') {
						styleHeading['font-family'] = settings[p];
					} else if (settings['headings-font-type'] == 'google' && p == 'headings-google-font-family') {
						if (settings[p].family) {
							styleHeading['font-family'] = settings[p].family.split(':')[0];
							SunFwAjax.loadStylesheet('https://fonts.googleapis.com/css?family=' + settings[p].family + (settings[p].subset ? '&subset=' + settings[p].subset : ''));
						}
						if (settings[p].variant) {
							if (settings[p].variant.match(/^\d+$/)) {
								styleHeading['font-weight'] = parseInt(settings[p].variant);
							} else {
								styleHeading['font-weight'] = settings[p].variant;
							}
						}
					} else if (settings['headings-font-type'] == 'custom' && p == 'headings-custom-font-file') {
						if (settings[p]) {
							var url = SunFw.urls.root + '/' + settings[p],
							    sheet = document.styleSheets[document.styleSheets.length - 1],
							    fontFamily = url.match(/\/([^\/\.]+)\.(eot|otf|ttf|woff|woff2)$/),
							    cssRules = {
								'@font-face': 'font-family: "' + fontFamily[1] + '"; src: url("' + url + '");'
							};
							for (var selector in cssRules) {
								if (sheet.insertRule && typeof sheet.cssRules != 'undefined' && sheet.cssRules != null && typeof sheet.cssRules.length != 'undefined') {
									sheet.insertRule(selector + " {" + cssRules[selector] + "}", sheet.cssRules.length);
								} else if (sheet.addRule) {
									sheet.addRule(selector, cssRules[selector]);
								}
							}
							styleHeading['font-family'] = '"' + fontFamily[1] + '"';
						}
					}
					break;
				case 'headings-font-weight':
					if (settings['headings-font-type'] == 'standard') {
						styleHeading['font-weight'] = settings[p];
					}
					break;
				case 'headings-text-shadow':
					styleHeading['text-shadow'] = (settings[p]['h-shadow'] ? settings[p]['h-shadow'] : 0) + 'px ' + (settings[p]['v-shadow'] ? settings[p]['v-shadow'] : 0) + 'px ' + (settings[p].blur ? settings[p].blur + 'px ' : '') + (settings[p].color ? settings[p].color : '');
					break;
				case 'headings-base-size':
					styleHeading['font-size'] = fontSizeH5 = settings[p];
					fontSizeH1 = Math.ceil(settings[p] * 2.6);
					fontSizeH2 = Math.ceil(settings[p] * 2.15);
					fontSizeH3 = Math.ceil(settings[p] * 1.7);
					fontSizeH4 = Math.ceil(settings[p] * 1.25);
					fontSizeH6 = Math.ceil(settings[p] * 0.85);
					break;
				case 'headings-line-height':
					styleHeading['line-height'] = settings[p] + 'em';
					break;
				case 'headings-letter-spacing':
					styleHeading['letter-spacing'] = settings[p] + 'px';
					break;
				default:
					styleHeading[p.replace('headings-', '')] = settings[p];
					break;
			}
		}
		var style1 = this.cloneObject(styleHeading, 2.6),
		    style2 = this.cloneObject(styleHeading, 2.15),
		    style3 = this.cloneObject(styleHeading, 1.7),
		    style4 = this.cloneObject(styleHeading, 1.25),
		    style6 = this.cloneObject(styleHeading, 0.85);
		previewContent = React.createElement(
			'div',
			null,
			React.createElement(
				'h1',
				{ style: style1 },
				'Heading 1 ',
				React.createElement(
					'span',
					{ className: 'pull-right' },
					fontSizeH1,
					' px'
				)
			),
			React.createElement(
				'h2',
				{ style: style2 },
				'Heading 2 ',
				React.createElement(
					'span',
					{ className: 'pull-right' },
					fontSizeH2,
					' px'
				)
			),
			React.createElement(
				'h3',
				{ style: style3 },
				'Heading 3 ',
				React.createElement(
					'span',
					{ className: 'pull-right' },
					fontSizeH3,
					' px'
				)
			),
			React.createElement(
				'h4',
				{ style: style4 },
				'Heading 4 ',
				React.createElement(
					'span',
					{ className: 'pull-right' },
					fontSizeH4,
					' px'
				)
			),
			React.createElement(
				'h5',
				{ style: styleHeading },
				'Heading 5 ',
				React.createElement(
					'span',
					{ className: 'pull-right' },
					fontSizeH5,
					' px'
				)
			),
			React.createElement(
				'h6',
				{ style: style6 },
				'Heading 6 ',
				React.createElement(
					'span',
					{ className: 'pull-right' },
					fontSizeH6,
					' px'
				)
			)
		);
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			previewContent
		);
	},
	cloneObject: function (obj, fontSize) {
		var self = this;
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}
		var temp = obj.constructor();
		for (var key in obj) {
			if (key == 'font-size') {
				temp[key] = Math.ceil(self.cloneObject(obj[key]) * fontSize);
			} else {
				temp[key] = self.cloneObject(obj[key]);
			}
		}
		return temp;
	},
	initActions: function () {
		if (!this.refs.wrapper) {
			return;
		}
		SunFw.parent();
		var settings = this.editor.getItemSettingsForPreview(this);
		if (settings['headings-font-type'] == 'google' && settings['headings-google-font-family'] && settings['headings-google-font-family']['variant']) {
			var elms = this.refs.wrapper.querySelectorAll('h1, h2, h3, h4, h5, h6');
			for (var i = 0, n = elms.length; i < n; i++) {
				elms[i].style.fontWeight = settings['headings-google-font-family']['variant'].match(/^\d+$/) ? parseInt(settings['headings-google-font-family']['variant']) : settings['headings-google-font-family']['variant'];
			}
		}
	}
});
window.SunFwPaneStylesItemLink = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			type: 'link',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'display-inline style-editor-item preview-link-settings',
		    previewContent = '',
		    styleLinkColor = {},
		    settings = this.editor.getItemSettingsForPreview(this),
		$linkColor = settings['link-color'],
		    $linkColorHover = settings['link-hover-color'];
		if ($linkColor) {
			styleLinkColor['color'] = $linkColor;
		}
		previewContent = React.createElement(
			'a',
			{ href: '#', style: styleLinkColor },
			'Link'
		);
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			previewContent
		);
	}
});
window.SunFwPaneStylesItemMainMenu = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			id: '',
			type: 'main-menu',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'style-editor-item preview-menu-settings clearfix';
		var styleMenu = {},
		    styleItem = {},
		    styleActive = {},
		    settings = this.editor.getItemSettingsForPreview(this);
		for (var p in settings) {
			if (!settings[p]) {
				continue;
			}
			switch (p) {
				case 'link-color-hover':
					styleActive['color'] = settings[p];
					break;
				case 'background-color-hover':
					styleActive['background'] = settings[p];
					break;
				default:
					styleItem[p] = styleActive[p] = settings[p];
					break;
			}
		}
		if (settings['background-color']) {
			styleMenu['background'] = styleItem['background'] = styleItem['background-color'];
		}
		if (this.props.menu.settings['menu-show-submenu'] && parseInt(this.props.menu.settings['menu-show-submenu'])) {
			return React.createElement(
				'div',
				{ className: 'menu-with-dropdown' },
				React.createElement(
					'nav',
					{
						ref: 'wrapper',
						style: styleMenu,
						onClick: this.editItem,
						className: className,
						onMouseOver: this.mouseover,
						onMouseOut: this.mouseout
					},
					React.createElement(
						'ul',
						{ className: 'nav navbar-nav' },
						React.createElement(
							'li',
							null,
							React.createElement(
								'a',
								{ style: styleItem, href: '#' },
								'Apps'
							)
						),
						React.createElement(
							'li',
							null,
							React.createElement(
								'a',
								{ style: styleItem, href: '#' },
								'Games'
							)
						),
						React.createElement(
							'li',
							{ className: 'dropdown open clearfix' },
							React.createElement(
								'a',
								{ style: styleActive, href: '#' },
								'Movies'
							),
							React.createElement(SunFwPaneStylesItemDropdownMenu, {
								key: this.editor.props.id + '_' + this.props.id + '_dropdown_menu',
								ref: 'dropdown_menu',
								parent: this,
								editor: this.editor,
								'settings-key': this.props.menu.id + '::dropdown'
							})
						),
						React.createElement(
							'li',
							null,
							React.createElement(
								'a',
								{ style: styleItem, href: '#' },
								'Books'
							)
						),
						React.createElement(
							'li',
							null,
							React.createElement(
								'a',
								{ style: styleItem, href: '#' },
								'Newspapers'
							)
						)
					)
				),
				React.createElement('br', null),
				React.createElement('br', null),
				React.createElement('br', null),
				React.createElement('br', null),
				React.createElement('br', null),
				React.createElement('br', null),
				React.createElement('br', null),
				React.createElement('br', null),
				React.createElement('br', null),
				React.createElement('br', null)
			);
		}
		return React.createElement(
			'div',
			{ className: 'menu-without-dropdown' },
			React.createElement(
				'nav',
				{
					ref: 'wrapper',
					onClick: this.editItem,
					className: className,
					onMouseOver: this.mouseover,
					onMouseOut: this.mouseout
				},
				React.createElement(
					'ul',
					{ className: 'display-inline list-inline' },
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ style: styleItem, href: '#' },
							'Apps'
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ style: styleItem, href: '#' },
							'Games'
						)
					),
					React.createElement(
						'li',
						{ className: 'active' },
						React.createElement(
							'a',
							{ style: styleActive, href: '#' },
							'Movies'
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ style: styleItem, href: '#' },
							'Books'
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ style: styleItem, href: '#' },
							'Newspapers'
						)
					)
				)
			)
		);
	}
});
window.SunFwPaneStylesItemModule = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			id: '',
			type: 'module',
			'module-style': '',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'jsn-panel style-editor-item preview-module-settings';
		var previewContent = [React.createElement(
			'div',
			{ className: 'jsn-panel-heading' },
			React.createElement(SunFwPaneStylesItemTitle, {
				key: this.editor.props.id + '_' + this.props.id + '_title',
				ref: 'title',
				parent: this,
				editor: this.editor,
				title: SunFwString.capitalize(this.props['module-style']),
				'settings-key': this.props['module-style'] + '::title'
			})
		), React.createElement(
			'div',
			{ className: 'jsn-panel-body' },
			React.createElement(SunFwPaneStylesItemContent, {
				key: this.editor.props.id + '_' + this.props.id + '_content',
				ref: 'content',
				type: 'module-content',
				parent: this,
				editor: this.editor,
				'settings-key': this.props['module-style'] + '::content'
			}),
			React.createElement(SunFwPaneStylesItemButton, {
				key: this.editor.props.id + '_' + this.props.id + '_default_button',
				ref: 'default_button',
				type: 'module-default-button',
				variant: 'default',
				parent: this,
				editor: this.editor,
				'settings-key': this.props['module-style'] + '::default-button'
			}),
			React.createElement(SunFwPaneStylesItemButton, {
				key: this.editor.props.id + '_' + this.props.id + '_primary_button',
				ref: 'primary_button',
				type: 'module-primary-button',
				variant: 'primary',
				parent: this,
				editor: this.editor,
				'settings-key': this.props['module-style'] + '::primary-button'
			}),
			React.createElement(SunFwPaneStylesItemLink, {
				key: this.editor.props.id + '_' + this.props.id + '_link',
				ref: 'link',
				type: 'link',
				parent: this,
				editor: this.editor,
				'settings-key': this.props['module-style'] + '::link'
			})
		)];
		var containerStyle = {},
		    inner_style = {},
		    settings = this.editor.getItemSettingsForPreview(this);
		for (var p in settings) {
			if (!settings[p]) {
				continue;
			}
			switch (p) {
				case 'background-image-settings':
					if (settings['background-image']) {
						for (var s in settings[p]) {
							containerStyle['background-' + s] = settings[p][s];
						}
					}
					break;
				case 'padding':
					for (var s in settings[p]) {
						containerStyle['padding-' + s] = settings[p][s] + 'px';
					}
					break;
				case 'border':
					var universal = settings[p].universal && parseInt(settings[p].universal) ? true : false;
					for (var s in settings[p]) {
						if (s == 'universal') {
							continue;
						}
						if (settings[p].universal == true && !s.match(/(top|right|bottom|left)/)) {
							containerStyle['border-' + s] = settings[p][s];
						} else if (settings[p].universal == false && s.match(/(top|right|bottom|left)/)) {
							containerStyle['border-' + s] = settings[p][s];
						}
					}
					break;
				case 'background-image':
					var URLPattern = /^(http|https)/i;
					if (!URLPattern.test(settings[p])) {
						settings[p] = document.getElementById('jsn-tpl-root').value + settings[p];
					}
					containerStyle['background-image'] = 'url(' + settings[p] + ')';
					break;
				default:
					containerStyle[p] = settings[p];
					break;
			}
		}
		if (settings['background-color'] && !settings['background-image']) {
			containerStyle['background'] = containerStyle['background-color'];
		}
		previewContent = React.createElement(
			'div',
			{ className: 'content-module row', style: containerStyle },
			previewContent
		);
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			previewContent
		);
	}
});
window.SunFwPaneStylesItemPageInner = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			type: 'page-inner',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'jsn-panel style-editor-item preview-page-inner-settings',
		    inner_style = {},
		    settings = this.editor.getItemSettingsForPreview(this);
		for (var p in settings) {
			if (!settings[p]) {
				continue;
			}
			if (p.indexOf('inner-') > -1) {
				switch (p) {
					case 'inner-background-color':
						inner_style['background-color'] = settings[p];
						break;
					case 'inner-border':
						var universal = settings[p].universal && parseInt(settings[p].universal) ? true : false;
						for (var s in settings[p]) {
							if (s == 'universal') {
								continue;
							}
							if (settings[p].universal == true && !s.match(/(top|right|bottom|left)/)) {
								inner_style['border-' + s] = settings[p][s];
							} else if (settings[p].universal == false && s.match(/(top|right|bottom|left)/)) {
								inner_style['border-' + s] = settings[p][s];
							}
						}
						break;
					case 'inner-box-shadow':
						var styleBoxshadow = '';
						var hShadow = settings[p]['h-shadow'];
						var vShadow = settings[p]['v-shadow'];
						var blur = settings[p].blur;
						var spread = settings[p].spread;
						var color = settings[p].color;
						var inset = settings[p].inset;
						if (hShadow) {
							styleBoxshadow = styleBoxshadow.concat(hShadow + 'px ');
						} else {
							styleBoxshadow = styleBoxshadow.concat('0px ');
						}
						if (vShadow) {
							styleBoxshadow = styleBoxshadow.concat(vShadow + 'px ');
						} else {
							styleBoxshadow = styleBoxshadow.concat('0px ');
						}
						if (blur) {
							styleBoxshadow = styleBoxshadow.concat(blur + 'px ');
						}
						if (spread) {
							styleBoxshadow = styleBoxshadow.concat(spread + 'px ');
						}
						if (color) {
							styleBoxshadow = styleBoxshadow.concat(color);
						}
						if (inset) {
							styleBoxshadow = styleBoxshadow.concat(inset);
						}
						inner_style['box-shadow'] = styleBoxshadow;
						inner_style['-webkit-box-shadow'] = styleBoxshadow;
						break;
					default:
						inner_style[p.replace('inner-', '')] = settings[p];
						break;
				}
			}
		}
		if (settings['inner-background-color']) {
			inner_style['background'] = inner_style['background-color'];
		}
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			React.createElement(
				'div',
				{ className: 'jsn-panel-body' },
				React.createElement(
					'div',
					{ className: 'inner', style: inner_style },
					this.props.children
				)
			)
		);
	}
});
window.SunFwPaneStylesItemPage = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			type: 'page',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'jsn-panel style-editor-item preview-page-settings';
		var outer_style = {},
		    inner_style = {},
		    settings = this.editor.getItemSettingsForPreview(this);
		for (var p in settings) {
			if (!settings[p]) {
				continue;
			}
			if (p.indexOf('outer-') > -1) {
				switch (p) {
					case 'outer-background-image-settings':
						for (var s in settings[p]) {
							outer_style['background-' + s] = settings[p][s];
						}
						break;
					case 'outer-background-image':
						if (!settings[p].match(/^(http|https)/i)) {
							settings[p] = document.getElementById('jsn-tpl-root').value + settings[p];
						}
						outer_style['background-image'] = 'url("' + settings[p] + '")';
						break;
					default:
						outer_style[p.replace('outer-', '')] = settings[p];
						break;
				}
			}
		}
		if (settings['outer-background-color'] && !settings['outer-background-image']) {
			outer_style['background'] = outer_style['background-color'];
		}
		var previewContent = [React.createElement(SunFwPaneStylesItemColor, {
			key: this.editor.props.id + '_settings_color',
			ref: 'settings_color',
			type: 'general-color',
			parent: this,
			editor: this.editor,
			'settings-key': 'color'
		}), React.createElement(SunFwPaneStylesItemHeading, {
			key: this.editor.props.id + '_settings_heading',
			ref: 'settings_heading',
			type: 'general-heading',
			parent: this,
			editor: this.editor,
			'settings-key': 'heading'
		}), React.createElement(SunFwPaneStylesItemContent, {
			key: this.editor.props.id + '_settings_content',
			ref: 'settings_content',
			type: 'general-content',
			parent: this,
			editor: this.editor,
			'settings-key': 'content'
		}), React.createElement(SunFwPaneStylesItemButton, {
			key: this.editor.props.id + '_settings_default_button',
			ref: 'settings_default_button',
			type: 'default-button',
			variant: 'default',
			parent: this,
			editor: this.editor
		}), React.createElement(SunFwPaneStylesItemButton, {
			key: this.editor.props.id + '_settings_primary_button',
			ref: 'settings_primary_button',
			type: 'primary-button',
			variant: 'primary',
			parent: this,
			editor: this.editor
		}), React.createElement(SunFwPaneStylesItemLink, {
			key: this.editor.props.id + '_settings_link',
			ref: 'settings_link',
			type: 'link',
			parent: this,
			editor: this.editor
		})];
		var layout = this.editor.props.doc.refs.body.refs.layout ? this.editor.props.doc.refs.body.refs.layout.getData() : null;
		if (layout && layout.settings.enable_boxed_layout && parseInt(layout.settings.enable_boxed_layout)) {
			previewContent = React.createElement(
				'div',
				{ className: 'outer row', style: outer_style },
				React.createElement(
					SunFwPaneStylesItemPageInner,
					{
						key: this.editor.props.id + '_settings_inner',
						ref: 'settings_inner',
						parent: this,
						editor: this.editor
					},
					previewContent
				)
			);
		} else {
			previewContent = React.createElement(
				'div',
				{ className: 'outer row', style: outer_style },
				previewContent
			);
		}
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			React.createElement(
				'div',
				{ className: 'jsn-panel-body' },
				previewContent
			)
		);
	}
});
window.SunFwPaneStylesItemSection = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			id: '',
			type: 'section',
			section: {},
			'settings-key': null
		};
	},
	render: function () {
		var className = 'jsn-panel style-editor-item preview-section-settings';
		var previewContent = React.createElement(
			'div',
			{ className: 'jsn-panel-body' },
			React.createElement(SunFwPaneStylesItemHeading, {
				key: this.editor.props.id + '_' + this.props.id + '_settings_heading',
				ref: 'settings_heading',
				type: 'section-heading',
				parent: this,
				editor: this.editor,
				'settings-key': this.props.section.id + '::heading'
			}),
			React.createElement(SunFwPaneStylesItemContent, {
				key: this.editor.props.id + '_' + this.props.id + '_settings_content',
				ref: 'settings_content',
				type: 'section-content',
				parent: this,
				editor: this.editor,
				'settings-key': this.props.section.id + '::content'
			}),
			React.createElement(SunFwPaneStylesItemButton, {
				key: this.editor.props.id + '_' + this.props.id + '_settings_default_button',
				ref: 'settings_default_button',
				type: 'section-default-button',
				variant: 'default',
				parent: this,
				editor: this.editor,
				'settings-key': this.props.section.id + '::default-button'
			}),
			React.createElement(SunFwPaneStylesItemButton, {
				key: this.editor.props.id + '_' + this.props.id + '_settings_primary_button',
				ref: 'settings_primary_button',
				type: 'section-primary-button',
				variant: 'primary',
				parent: this,
				editor: this.editor,
				'settings-key': this.props.section.id + '::primary-button'
			}),
			React.createElement(SunFwPaneStylesItemLink, {
				key: this.editor.props.id + '_' + this.props.id + '_settings_link',
				ref: 'settings_link',
				type: 'section-link',
				parent: this,
				editor: this.editor,
				'settings-key': this.props.section.id + '::link'
			})
		);
		var containerStyle = {},
		    inner_style = {},
		    settings = this.editor.getItemSettingsForPreview(this);
		for (var p in settings) {
			if (!settings[p]) {
				continue;
			}
			switch (p) {
				case 'background-image-settings':
					if (settings['background-image']) {
						for (var s in settings[p]) {
							containerStyle['background-' + s] = settings[p][s];
						}
					}
					break;
				case 'padding':
					for (var s in settings[p]) {
						containerStyle['padding-' + s] = settings[p][s] + 'px';
					}
					break;
				case 'border':
					var universal = settings[p].universal && parseInt(settings[p].universal) ? true : false;
					for (var s in settings[p]) {
						if (s == 'universal') {
							continue;
						}
						if (settings[p].universal == true && !s.match(/(top|right|bottom|left)/)) {
							containerStyle['border-' + s] = settings[p][s];
						} else if (settings[p].universal == false && s.match(/(top|right|bottom|left)/)) {
							containerStyle['border-' + s] = settings[p][s];
						}
					}
					break;
				case 'background-image':
					var URLPattern = /^(http|https)/i;
					if (!URLPattern.test(settings[p])) {
						settings[p] = document.getElementById('jsn-tpl-root').value + settings[p];
					}
					containerStyle['background-image'] = 'url(' + settings[p] + ')';
					break;
				default:
					containerStyle[p] = settings[p];
					break;
			}
		}
		if (settings['background-color'] && !settings['background-image']) {
			containerStyle['background'] = containerStyle['background-color'];
		}
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			React.createElement(
				'div',
				{ className: 'jsn-panel-heading' },
				this.props.section.settings.name
			),
			React.createElement(
				'div',
				{ className: 'content-section row', style: containerStyle },
				previewContent
			)
		);
	}
});
window.SunFwPaneStylesItemTitle = React.extendClass('SunFwPaneStylesMixinItem', {
	getDefaultProps: function () {
		return {
			type: 'title',
			'settings-key': null
		};
	},
	render: function () {
		var className = 'style-editor-item preview-title-settings';
		var previewContent = '';
		var styleTitle = {},
		    settings = this.editor.getItemSettingsForPreview(this);
		for (var p in settings) {
			if (!settings[p]) {
				continue;
			}
			switch (p) {
				case 'bg-color':
					styleTitle['background'] = settings[p];
					break;
				case 'text-color':
					styleTitle['color'] = settings[p];
					break;
				default:
					styleTitle[p] = settings[p];
					break;
			}
		}
		previewContent = React.createElement(
			'h3',
			{ style: styleTitle },
			this.props.title ? this.props.title : 'Title'
		);
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			previewContent
		);
	}
});
window.SunFwPaneStylesGroupGeneral = React.extendClass('SunFwPaneMixinBase', {
	render: function () {
		var keyName = 'settings_page';
		if (this.editor.current.editing == '') {
			this.editor.current.editing = 'page';
		}
		return React.createElement(SunFwPaneStylesItemPage, {
			key: this.editor.props.id + '_' + keyName,
			ref: keyName,
			parent: this,
			editor: this.editor
		});
	}
});
window.SunFwPaneStylesGroupMenu = React.extendClass('SunFwPaneMixinBase', {
	getDefaultProps: function () {
		return {
			group: 'menu'
		};
	},
	render: function () {
		var menus = [],
		    keyName,
		    layout = this.editor.props.doc.refs.body.refs.layout ? this.editor.props.doc.refs.body.refs.layout.getData() : null;
		if (!this.editor.props.doc.refs.body.refs.layout.config) {
			setTimeout(function () {
				this.editor.forceUpdate();
			}.bind(this), 100);
		} else if (layout && layout.views.main && layout.views.main.sections) {
			for (var s = 0; s < layout.views.main.sections.length; s++) {
				var section = layout.sections[layout.views.main.sections[s]];
				if (!section) {
					continue;
				}
				for (var r = 0; r < section.rows.length; r++) {
					var row = layout.rows[section.rows[r]];
					if (!row) {
						continue;
					}
					for (var c = 0; c < row.columns.length; c++) {
						var column = layout.columns[row.columns[c]];
						if (!column) {
							continue;
						}
						for (var i = 0; i < column.items.length; i++) {
							var item = layout.items[column.items[i]];
							if (!item) {
								continue;
							}
							if (item.type == 'menu') {
								keyName = 'settings_' + item.id;
								if (this.editor.current.editing == '') {
									this.editor.current.editing = item.id + '::root';
								}
								var style = {},
								    settings = this.editor.handleGetItemSettings('sections', section.id + '::container');
								if (settings.border) {
									style['border'] = settings.border.width + 'px ' + settings.border.style + ' ' + settings.border.color;
								}
								if (settings['background-color']) {
									style['background-color'] = settings['background-color'];
								}
								menus.push(React.createElement(
									'div',
									{ className: 'jsn-panel', style: style },
									React.createElement(
										'div',
										{ className: 'jsn-panel-body' },
										React.createElement(SunFwPaneStylesItemMainMenu, {
											id: keyName,
											key: this.editor.props.id + '_' + keyName,
											ref: keyName,
											group: this.editor.current.group,
											parent: this,
											editor: this.editor,
											menu: item,
											'settings-key': item.id + '::root'
										})
									)
								));
							}
						}
					}
				}
			}
		}
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				className: 'main-workspace' + (menus.length ? '' : ' empty-workspace')
			},
			menus.length ? menus : SunFwString.parse('no-menu-found')
		);
	},
	handleClick: function (event) {
		if (event.target.nodeName == 'A') {
			event.target.blur();
		}
	},
	initActions: function () {
		if (this.refs.wrapper) {
			setTimeout(function () {
				if (this.refs.wrapper.classList.contains('empty-workspace')) {
					this.editor.refs.settings.setState({
						form: {},
						emptyClass: 'empty-workspace',
						emptyMessage: SunFwString.parse('settings-not-available')
					});
				}
			}.bind(this), 100);
			if (!this.refs.wrapper._listened_click_event) {
				SunFwEvent.add(this.refs.wrapper, 'click', this.handleClick);
				this.refs.wrapper._listened_click_event = true;
			}
		}
	},
	componentWillUnmount: function () {
		if (this.refs.wrapper._listened_click_event) {
			delete this.refs.wrapper._listened_click_event;
			SunFwEvent.remove(this.refs.wrapper, 'click', this.handleClick);
		}
	}
});
window.SunFwPaneStylesGroupModule = React.extendClass('SunFwPaneMixinBase', {
	getDefaultProps: function () {
		return {
			group: 'module'
		};
	},
	getInitialState: function () {
		return {
			styles: []
		};
	},
	componentWillMount: function () {
		SunFw.parent();
		if (!this.editor.config.items.module.styles) {
			var server = this.editor.props.url + '&action=getModuleStyles';
			SunFwAjax.request(server, function (req) {
				var response = req.responseJSON;
				if (response.type == 'success') {
					this.editor.config.items.module.styles = response.data;
					this.editor.forceUpdate();
				} else {
					bootbox.alert(response.data);
				}
			}.bind(this));
		}
	},
	render: function () {
		var modules = [],
		    keyName;
		if (this.editor.config.items.module.styles) {
			for (var i = 0, n = this.editor.config.items.module.styles.length; i < n; i += 2) {
				var module = [];
				for (var j = 0; j < 2; j++) {
					var style = this.editor.config.items.module.styles[i + j];
					keyName = 'settings_' + style;
					if (this.editor.current.editing == '') {
						this.editor.current.editing = style + '::container';
					}
					module.push(React.createElement(
						'div',
						{ className: 'col-xs-6' },
						React.createElement(SunFwPaneStylesItemModule, {
							id: keyName,
							key: this.editor.props.id + '_' + keyName,
							ref: keyName,
							group: this.editor.current.group,
							parent: this,
							editor: this.editor,
							'module-style': style,
							'settings-key': style + '::container'
						})
					));
				}
				modules.push(React.createElement(
					'div',
					{ className: 'row' },
					module
				));
			}
		}
		return React.createElement(
			'div',
			{ ref: 'wrapper' },
			modules
		);
	}
});
window.SunFwPaneStylesGroupSections = React.extendClass('SunFwPaneMixinBase', {
	getDefaultProps: function () {
		return {
			group: 'sections'
		};
	},
	render: function () {
		var sections = [],
		    keyName,
		    layout = this.editor.props.doc.refs.body.refs.layout ? this.editor.props.doc.refs.body.refs.layout.getData() : null;
		if (!this.editor.props.doc.refs.body.refs.layout.config) {
			setTimeout(function () {
				this.editor.forceUpdate();
			}.bind(this), 100);
		} else if (layout && layout.views.main && layout.views.main.sections) {
			for (var s = 0; s < layout.views.main.sections.length; s++) {
				var section = layout.sections[layout.views.main.sections[s]];
				if (!section) {
					continue;
				}
				keyName = 'settings_' + section.id;
				if (this.editor.current.editing == '') {
					this.editor.current.editing = section.id + '::container';
				}
				sections.push(React.createElement(SunFwPaneStylesItemSection, {
					id: keyName,
					key: this.editor.props.id + '_' + keyName,
					ref: keyName,
					group: this.editor.current.group,
					parent: this,
					editor: this.editor,
					section: section,
					'settings-key': section.id + '::container'
				}));
			}
		}
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				className: 'main-workspace' + (sections.length ? '' : ' empty-workspace')
			},
			sections.length ? sections : SunFwString.parse('no-section-found')
		);
	},
	initActions: function () {
		if (this.refs.wrapper) {
			setTimeout(function () {
				if (this.refs.wrapper.classList.contains('empty-workspace')) {
					this.editor.refs.settings.setState({
						form: {},
						emptyClass: 'empty-workspace',
						emptyMessage: SunFwString.parse('settings-not-available')
					});
				}
			}.bind(this), 100);
		}
	}
});
window.SunFwPaneStylesActions = React.extendClass('SunFwPaneMixinAction', {
	render: function () {
		return React.createElement(
			"div",
			{ className: "style-editor-actions" },
			React.createElement(
				"button",
				{
					type: "button",
					onClick: this.select,
					className: "btn btn-default margin-right-10"
				},
				React.createElement("i", { className: "fa fa-columns font-size-14 margin-right-5" }),
				SunFwString.parse('load-style-preset')
			),
			React.createElement(
				"div",
				{ className: "btn-group" },
				React.createElement(
					"button",
					{
						ref: "save",
						type: "button",
						onClick: this.editor.save,
						disabled: !this.editor.state.changed,
						className: "btn btn-success text-uppercase"
					},
					React.createElement("i", { className: "icon-apply icon-white margin-right-5" }),
					SunFwString.parse('save-style')
				),
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-success dropdown-toggle", "data-toggle": "dropdown" },
					React.createElement("span", { className: "caret" })
				),
				React.createElement(
					"ul",
					{ className: "dropdown-menu pull-right" },
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: "#", onClick: this.saveAs },
							SunFwString.parse('save-style-preset')
						)
					)
				)
			)
		);
	},
	select: function (event) {
		event.preventDefault();
		var data = {
			rel: this,
			form: {
				'class': 'load-style-preset',
				rows: [{
					cols: [{
						'class': 'col-xs-12',
						controls: {
							style: {
								type: 'select-style',
								label: ''
							}
						}
					}]
				}]
			},
			values: { 'style': this.editor.state.appliedStyle }
		};
		SunFwModal.get({
			id: 'load_style_modal',
			title: 'load-style-preset',
			type: 'form',
			content: data,
			'class': 'fixed'
		});
	},
	saveAs: function (event) {
		event.preventDefault();
		var data = {
			rel: this,
			form: {
				'class': 'save-style-preset',
				rows: [{
					cols: [{
						'class': 'col-xs-12',
						controls: {
							'name': {
								type: 'select-style',
								label: '',
								action: 'save'
							}
						}
					}]
				}]
			},
			values: []
		};
		SunFwModal.get({
			id: 'load_style_modal',
			title: 'save-style-preset',
			type: 'form',
			content: data,
			'class': 'fixed'
		});
	},
	saveSettings: function (settings) {
		if (settings.name && settings.name != '') {
			this.editor.save(true, settings.name);
		}
		else if (settings.style && settings.style != '') {
				var data = this.editor.config.presets[settings.style].settings;
				data.appliedStyle = settings.style;
				this.editor.setData(data);
				this.editor.forceUpdate();
			}
	}
});
window.SunFwPaneStylesGroups = React.extendClass('SunFwPaneMixinBase', {
	render: function () {
		var groups = [];
		for (var group in this.editor.config.groups) {
			var keyName = 'settings_' + group,
			    className = 'btn btn-default sunfw_popover',
			    icon;
			if (this.editor.current.group == group) {
				className += ' active';
			}
			if (group == 'general') {
				icon = 'icon-doc';
			} else if (group == 'sections') {
				icon = 'icon-doc-text';
			} else if (group == 'module') {
				icon = 'icon-th-large-outline';
			} else if (group == 'menu') {
				icon = 'icon-menu';
			}
			groups.push(React.createElement(
				'button',
				{
					id: keyName,
					key: this.editor.props.id + '_' + keyName,
					ref: keyName,
					type: 'button',
					onClick: this.changeGroup.bind(this, group),
					className: className,
					role: 'button',
					'data-content': this.editor.config.groups[group]
				},
				React.createElement('i', { className: 'demo-icon ' + icon }),
				this.editor.config.groups[group]
			));
		}
		return React.createElement(
			'div',
			{ className: 'btn-group', role: 'group' },
			groups
		);
	},
	componentDidMount: function () {
		jQuery('.sunfw_popover').popover({
			trigger: 'hover',
			placement: 'top',
			template: '<div class="popover sunfw-device" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
			container: 'body'
		});
	},
	componentWillUnmount: function () {
		jQuery('.sunfw_popover').popover('destroy');
	},
	changeGroup: function (group) {
		if (this.editor.current.group == group) {
			return;
		}
		this.editor.current.group = group;
		this.editor.current.editing = '';
		this.forceUpdate();
		this.editor.refs.workspace.forceUpdate();
		SunFwEvent.trigger(window, 'resize');
	}
});
window.SunFwPaneStyles = React.extendClass('SunFwPaneMixinEditor', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getPaneStyles
		};
	},
	getInitialState: function () {
		this.current = {
			group: 'general',
			editing: 'page'
		};
		return {
			changed: false
		};
	},
	getDefaultData: function () {
		return {
			appliedStyle: '',
			general: {},
			sections: {},
			module: {},
			menu: {}
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
				className: 'style-editor'
			},
			React.createElement(
				'div',
				{ className: 'jsn-pageheader container-fluid padding-top-10 padding-bottom-10' },
				React.createElement(
					'div',
					{ className: 'row' },
					React.createElement(
						'div',
						{ className: 'col-xs-1' },
						React.createElement(
							'h3',
							{ className: 'margin-0 line-height-30' },
							SunFwString.parse('style-editor')
						)
					),
					React.createElement(
						'div',
						{ className: 'col-xs-3 col-sm-4 sunfw-style-group' },
						React.createElement(SunFwPaneStylesGroups, {
							key: this.props.id + '_setting_groups',
							ref: 'setting_groups',
							parent: this,
							editor: this
						})
					),
					React.createElement(
						'div',
						{ className: 'col-xs-4 col-sm-3 text-center' },
						React.createElement(SunFwPaneActivity, {
							key: this.props.id + '_activity',
							ref: 'activity',
							parent: this,
							editor: this
						})
					),
					React.createElement(
						'div',
						{ className: 'col-xs-4 col-sm-4 text-right' },
						React.createElement(SunFwPaneStylesActions, {
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
							React.createElement(
								'div',
								{ className: 'jsn-layout-content' },
								React.createElement(
									'div',
									{ className: 'jsn-content-inner' },
									React.createElement(
										'div',
										{ className: 'jsn-content-main' },
										React.createElement(SunFwPaneStylesWorkspace, {
											key: this.props.id + '_workspace',
											ref: 'workspace',
											parent: this,
											editor: this
										})
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'col-xs-4 parent-sidebar border-left padding-bottom-15 style-settings' },
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
		for (var style in this.config.presets) {
			if (typeof this.config.presets[style].settings == 'string') {
				(function (s) {
					SunFwAjax.request(this.config.presets[s].settings, function (req) {
						this.config.presets[s].settings = req.responseJSON;
					}.bind(this));
				}).bind(this)(style);
			}
		}
		SunFwEvent.add(document.querySelector('a[href="#' + this.props.id + '"]'), 'click', function () {
			this.forceUpdate();
		}.bind(this));
	},
	handleSelectItem: function (name) {
		var editing = typeof name == 'string' ? name : '',
		    ref = this.refs[this.current.group + '_' + editing];
		if (!ref) {
			for (var p in this.refs) {
				if (p.indexOf(this.current.group + '_') > -1) {
					editing = p.replace(this.current.group + '_', '');
					ref = this.refs[p];
					break;
				}
			}
		}
		if (ref) {
			this.showSettings(ref, ref.props.type, this.getItemSettings(ref), false);
			if (this.refs[this.current.group + '_' + this.current.editing]) {
				if (this.refs[this.current.group + '_' + this.current.editing].refs.wrapper) {
					this.refs[this.current.group + '_' + this.current.editing].refs.wrapper.classList.remove('editing');
				}
			}
			this.current.editing = editing;
			if (this.refs[this.current.group + '_' + this.current.editing]) {
				if (this.refs[this.current.group + '_' + this.current.editing].refs.wrapper) {
					this.refs[this.current.group + '_' + this.current.editing].refs.wrapper.classList.add('editing');
				}
			}
		}
	},
	getItemForm: function (ref) {
		var type = ref.props.type,
		    form = JSON.parse(JSON.stringify((this.config.items[type] || this.config).settings));
		var title,
		    subTitle = ref.props['settings-key'] ? ref.props['settings-key'].split('::').pop() : ref.props.type.split('::').pop();
		switch (this.current.group) {
			case 'sections':
				if (ref.props.type == 'section') {
					title = SunFwString.parse('section-title').replace('%SECTION%', ref.props.section.settings.name || ref.props.section.label);
				} else {
					title = SunFwString.parse('section-title').replace('%SECTION%', ref.parent.props.section.settings.name || ref.parent.props.section.label);
				}
				break;
			case 'module':
				if (ref.props.type == 'module') {
					title = SunFwString.capitalize(ref.props['module-style']);
				} else {
					title = SunFwString.capitalize(ref.parent.props['module-style']);
				}
				break;
			case 'menu':
				if (ref.props.type == 'main-menu') {
					title = SunFwString.parse('menu-title').replace('%MENU%', ref.props.menu.settings ? ref.props.menu.settings.name : ref.props.menu.label);
				} else {
					title = SunFwString.parse('menu-title').replace('%MENU%', ref.parent.props.menu.settings ? ref.parent.props.menu.settings.name : ref.parent.props.menu.label);
				}
				break;
			default:
				title = this.config.groups[this.current.group];
				break;
		}
		if (subTitle == 'page') {
			subTitle = SunFwString.parse('outer-page');
		} else if (subTitle == 'page-inner') {
			subTitle = SunFwString.parse('inner-page');
		}
		form.title = title + ' > ' + SunFwString.capitalize(subTitle);
		return form;
	},
	handleGetItemSettings: function (item) {
		var group, key;
		if (arguments.length == 2) {
			group = arguments[0];
			key = arguments[1];
		}
		else {
				group = this.current.group;
				if (!item.props['settings-key']) {
					item.props['settings-key'] = item.props.type;
				}
				key = item.props['settings-key'];
			}
		var settings = this.getData()[group],
		    path = key.split('::');
		for (var i = 0; i < path.length; i++) {
			if (!settings[path[i]]) {
				settings[path[i]] = {};
			}
			settings = settings[path[i]];
		}
		if (JSON.stringify(settings).length == 2) {
			if (typeof item != 'object') {
				item = this.refs[group + '_' + key];
			}
			if (item && this.config.items[item.props.type]) {
				function hasCustom(form) {
					if (form.rows || form.cols) {
						var sub = form.rows || form.cols;
						for (var i = 0, n = sub.length; i < n; i++) {
							if (hasCustom(sub[i])) {
								return true;
							}
						}
					} else if (form.settings && form.settings.custom) {
						return true;
					}
				}
				if (this.config.items[item.props.type].settings && hasCustom(this.config.items[item.props.type].settings)) {
					settings.custom = 0;
				}
			}
		}
		if (settings.hasOwnProperty('custom')) {
			var type = path.pop(),
			    parent_settings = this.getItemSettings('general', type);
			if (settings.custom) {
				for (var p in settings) {
					if (settings.hasOwnProperty(p)) {
						parent_settings[p] = settings[p];
					}
				}
				settings = parent_settings;
			} else {
				for (var p in parent_settings) {
					if (parent_settings.hasOwnProperty(p)) {
						settings[p] = parent_settings[p];
					}
				}
			}
		}
		return settings;
	},
	getItemSettingsForPreview: function (item) {
		var settings = this.getItemSettings.apply(this, arguments);
		var colors = this.getItemSettings('general', 'color');
		var inherit = function (data) {
			for (var p in data) {
				if (typeof data[p] == 'object') {
					data[p] = inherit(data[p]);
				} else if (p.match(/(bg|background[-_]*color|color)/i)) {
					switch (data[p]) {
						case 'main':
							data[p] = colors['main-color'];
							break;
						case 'sub':
							data[p] = colors['sub-color'];
							break;
						case 'custom':
							data[p] = '';
							break;
					}
				}
			}
			return data;
		};
		settings = inherit(settings);
		return settings;
	},
	handleSaveItemSettings: function (that, values) {
		if (!that.props['settings-key']) {
			that.props['settings-key'] = that.props.type;
		}
		var data = this.getData(),
		    path = that.props['settings-key'].split('::'),
		    keys = '',
		    test;
		if (!data[this.current.group] || data[this.current.group] instanceof Array) {
			data[this.current.group] = {};
		}
		for (var i = 0; i < path.length; i++) {
			keys += '["' + path[i] + '"]';
			eval('test = data[ this.current.group ]' + keys + ';');
			if (!test) {
				eval('data[ this.current.group ]' + keys + ' = {};');
			}
		}
		eval('data[ this.current.group ]' + keys + ' = values;');
		this.setData(data);
		that.forceUpdate();
	},
	handleSave: function (preset, name, callback) {
		var server = this.props.url;
		if (preset === true) {
			server += '&action=saveAs&style_name=' + name;
		} else {
			server += '&action=save';
		}
		var callback = arguments[arguments.length - 1];
		var data = this.getData();
		for (var p in this.current) {
			if (this.current.hasOwnProperty(p)) {
				data[p] = this.current[p];
			}
		}
		SunFwAjax.request(server, function (req) {
			var response = req.responseJSON;
			if (response.type == 'success' && preset === true) {
				this.config.presets[response.data.name] = {
					label: name,
					settings: data
				};
			}
			callback(response);
		}.bind(this), { data: JSON.stringify(data) });
	},
	changeSectionID: function (oldID, newID) {
		var data = this.getData();
		if (!data.sections) {
			data.sections = {};
		}
		if (data.sections[oldID]) {
			data.sections[newID] = data.sections[oldID];
			delete data.sections[oldID];
			this.setData(data);
		}
	},
	changeMenuID: function (oldID, newID) {
		var data = this.getData();
		if (!data.menu) {
			data.menu = {};
		}
		if (data.menu[oldID]) {
			data.menu[newID] = data.menu[oldID];
			delete data.menu[oldID];
			this.setData(data);
		}
	}
});
window.SunFwPaneStylesPreview = React.extendClass('SunFwPaneMixinBase', {
	getDefaultProps: function () {
		return {
			id: ''
		};
	},
	getInitialState: function () {
		return {
			general: {},
			sections: {},
			module: {},
			menu: {}
		};
	},
	render: function () {
		var main_color = this.get('general::color::main-color', '#E70200'),
		sub_color = this.get('general::color::sub-color', '#F86201'),
		page_color = this.get('general::page::outer-background-color', '#fff'),
		heading_color = this.get('general::heading::headings-color', '#000'),
		content_color = this.get('general::content::text-color', '#000'),
		default_btn_color = this.get('general::default-button::btn-default-bg', '#fff'),
		primary_btn_color = this.get('general::primary-button::btn-primary-bg', '#699AD4');
		return React.createElement(
			'div',
			{ id: this.props.id, ref: 'wrapper', className: 'preview-style' },
			React.createElement(
				'div',
				{ className: 'container-fluid' },
				React.createElement(
					'div',
					{ className: 'row' },
					React.createElement(
						'div',
						{ className: 'col-xs-6 main-color' },
						React.createElement('div', { className: 'preview-column', style: {
								'background-color': main_color
							} })
					),
					React.createElement(
						'div',
						{ className: 'col-xs-6 sub-color' },
						React.createElement('div', { className: 'preview-column', style: {
								'background-color': sub_color
							} })
					)
				),
				React.createElement(
					'div',
					{ className: 'row bg-style', style: {
							'background-color': page_color
						} },
					React.createElement(
						'div',
						{ className: 'col-xs-12 heading-color' },
						React.createElement(
							'h3',
							{ style: {
									'color': heading_color
								} },
							'Heading 3'
						)
					),
					React.createElement(
						'div',
						{ className: 'col-xs-12 content-color' },
						React.createElement(
							'p',
							{ style: {
									'color': content_color
								} },
							'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
						)
					),
					React.createElement(
						'div',
						{ className: 'col-xs-3 default-btn-color' },
						React.createElement('div', { className: 'preview-column pull-left', style: {
								'background-color': default_btn_color
							} })
					),
					React.createElement(
						'div',
						{ className: 'col-xs-3 primary-btn-color' },
						React.createElement('div', { className: 'preview-column pull-left', style: {
								'background-color': primary_btn_color
							} })
					)
				)
			)
		);
	},
	get: function (keys, defaultVal) {
		var keys = keys.split('::'),
		    value = this.state;
		for (var i = 0; i < keys.length; i++) {
			if (value[keys[i]]) {
				value = value[keys[i]];
			} else {
				value = defaultVal;
				break;
			}
		}
		return value;
	}
});
window.SunFwPaneStylesWorkspace = React.extendClass('SunFwPaneMixinBase', {
	render: function () {
		var group = this.editor.current.group,
		    keyName = 'settings_' + group,
		    ComponentName = window['SunFwPaneStylesGroup' + SunFwString.toCamelCase(group, true)];
		return React.createElement(ComponentName, {
			id: keyName,
			key: this.editor.props.id + '_' + keyName,
			ref: keyName,
			parent: this,
			editor: this.editor
		});
	},
	initActions: function () {
		var group = this.editor.current.group,
		    keyName = 'settings_' + group;
		if (this.refs[keyName] && (!this.refs[keyName].refs.wrapper || !this.refs[keyName].refs.wrapper.classList.contains('empty-workspace'))) {
			this.editor.selectItem(this.editor.current.editing);
		}
	}
});
