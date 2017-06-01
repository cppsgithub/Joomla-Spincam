window.SunFwInputSocialIcons = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value || []
		};
	},
	componentWillMount: function () {
		SunFw.parent();
		this.loadingSortableTimer && clearTimeout(this.loadingSortableTimer);
		this.loadingSortableTimer = setTimeout(function () {
			SunFwAjax.loadScript(SunFw.urls.plugin + '/assets/3rd-party/Sortable/Sortable.min.js', this.forceUpdate.bind(this));
		}.bind(this), 500);
	},
	render: function () {
		var list = [],
		    keyName = this.props.id + '_items_';
		this.state.value.map((item, index) => {
			keyName += index + ':' + item.text;
			list.push(React.createElement(
				'li',
				{
					onClick: this.editItem,
					className: 'list-group-item clearfix',
					'data-index': index
				},
				React.createElement('i', { className: 'fa-h draggable' }),
				React.createElement('i', { className: item.icon }),
				'\xA0',
				item.title != '' && typeof item.title != 'undefined' ? item.title : item.text,
				React.createElement(
					'ul',
					{ className: 'pull-right display-inline list-inline manipulation-actions margin-0' },
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ href: '#', onClick: this.cloneItem },
							React.createElement('i', { className: 'fa fa-files-o' })
						)
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ href: '#', onClick: this.deleteItem },
							React.createElement('i', { className: 'fa fa-trash' })
						)
					)
				)
			));
		});
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
				{ className: 'social-icons' },
				React.createElement('input', {
					ref: 'field',
					type: 'text',
					name: this.props.setting,
					value: this.state.value ? this.state.value : this.props.value,
					onChange: this.change,
					className: 'hidden'
				}),
				React.createElement(
					'ul',
					{
						key: keyName,
						ref: 'list',
						className: 'list-group'
					},
					list
				),
				React.createElement(
					'button',
					{ className: 'btn btn-block btn-default', type: 'button', onClick: this.addItem },
					SunFwString.parse('add-social-icon')
				)
			)
		);
	},
	initActions: function () {
		SunFw.parent();
		if (this.refs.list && window.Sortable !== undefined) {
			Sortable.create(this.refs.list, {
				handle: '.fa-h',
				onUpdate: function () {
					var items = [];
					for (var i = 0; i < this.refs.list.children.length; i++) {
						var item = this.refs.list.children[i];
						items.push(this.state.value[parseInt(item.getAttribute('data-index'))]);
					}
					this.saveItems(items);
				}.bind(this)
			});
		}
	},
	saveItems: function (items) {
		this.setState({ value: items });
		this.change(this.props.setting, items);
	},
	saveSettings: function (item) {
		var items = this.state.value,
		    editing = this.state.editing;
		items[editing] = item;
		this.saveItems(items);
	},
	addItem: function (event) {
		event.preventDefault();
		var items = this.state.value;
		items.push({
			icon: 'fa fa-facebook',
			text: 'Facebook',
			title: 'Facebook'
		});
		this.saveItems(items);
		this.editItem(event, items.length - 1);
	},
	editItem: function (event, index) {
		event.preventDefault();
		var target = event.target;
		if (index === undefined) {
			while (!target.classList.contains('list-group-item') && target.nodeName != 'BODY') {
				target = target.parentNode;
			}
			index = target.getAttribute('data-index');
		}
		var data = {
			rel: this,
			form: {
				'class': 'social-icon-settings',
				rows: [{
					cols: [{
						'class': 'col-xs-6',
						controls: {
							'text': {
								type: 'select',
								chosen: false,
								label: 'social-network',
								options: [{
									value: 'Facebook',
									label: 'Facebook'
								}, {
									value: 'Twitter',
									label: 'Twitter'
								}, {
									value: 'Instagram',
									label: 'Instagram'
								}, {
									value: 'Pinterest',
									label: 'Pinterest'
								}, {
									value: 'YouTube',
									label: 'YouTube'
								}, {
									value: 'Google+',
									label: 'Google+'
								}, {
									value: 'Linkedin',
									label: 'Linkedin'
								}, {
									value: 'Dribbble',
									label: 'Dribbble'
								}, {
									value: 'Behance',
									label: 'Behance'
								}, {
									value: 'Flickr',
									label: 'Flickr'
								}, {
									value: 'Skype',
									label: 'Skype'
								}, {
									value: 'VK',
									label: 'VK'
								}]
							}
						}
					}, {
						'class': 'col-xs-6',
						controls: {
							'icon': {
								type: 'radio',
								label: 'social-icon',
								inline: true,
								options: [{
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-facebook fa-2x' }),
									value: 'fa fa-facebook',
									requires: {
										text: 'Facebook'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-facebook-official fa-2x' }),
									value: 'fa fa-facebook-official',
									requires: {
										text: 'Facebook'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-facebook-square fa-2x' }),
									value: 'fa fa-facebook-square',
									requires: {
										text: 'Facebook'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-twitter fa-2x' }),
									value: 'fa fa-twitter',
									requires: {
										text: 'Twitter'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-twitter-square fa-2x' }),
									value: 'fa fa-twitter-square',
									requires: {
										text: 'Twitter'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-instagram fa-2x' }),
									value: 'fa fa-instagram',
									requires: {
										text: 'Instagram'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-pinterest fa-2x' }),
									value: 'fa fa-pinterest',
									requires: {
										text: 'Pinterest'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-pinterest-p fa-2x' }),
									value: 'fa fa-pinterest-p',
									requires: {
										text: 'Pinterest'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-pinterest-square fa-2x' }),
									value: 'fa fa-pinterest-square',
									requires: {
										text: 'Pinterest'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-youtube-play fa-2x' }),
									value: 'fa fa-youtube-play',
									requires: {
										text: 'YouTube'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-youtube fa-2x' }),
									value: 'fa fa-youtube',
									requires: {
										text: 'YouTube'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-youtube-square fa-2x' }),
									value: 'fa fa-youtube-square',
									requires: {
										text: 'YouTube'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-google-plus fa-2x' }),
									value: 'fa fa-google-plus',
									requires: {
										text: 'Google+'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-google-plus-square fa-2x' }),
									value: 'fa fa-google-plus-square',
									requires: {
										text: 'Google+'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-linkedin fa-2x' }),
									value: 'fa fa-linkedin',
									requires: {
										text: 'Linkedin'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-linkedin-square fa-2x' }),
									value: 'fa fa-linkedin-square',
									requires: {
										text: 'Linkedin'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-dribbble fa-2x' }),
									value: 'fa fa-dribbble',
									requires: {
										text: 'Dribbble'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-behance fa-2x' }),
									value: 'fa fa-behance',
									requires: {
										text: 'Behance'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-behance-square fa-2x' }),
									value: 'fa fa-behance-square',
									requires: {
										text: 'Behance'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-flickr fa-2x' }),
									value: 'fa fa-flickr',
									requires: {
										text: 'Flickr'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-skype fa-2x' }),
									value: 'fa fa-skype',
									requires: {
										text: 'Skype'
									}
								}, {
									'class': 'hidden',
									label: React.createElement('i', { className: 'fa fa-vk fa-2x' }),
									value: 'fa fa-vk',
									requires: {
										text: 'VK'
									}
								}]
							}
						}
					}]
				}, {
					cols: [{
						'class': 'col-xs-12',
						controls: {
							title: {
								type: 'text',
								label: 'social-title',
								suffix: ''
							}
						}
					}, {
						'class': 'col-xs-12',
						controls: {
							'link': {
								type: 'text',
								label: 'profile-link',
								placeholder: 'http://'
							}
						}
					}]
				}]
			},
			values: this.state.value[index]
		};
		var modal = SunFwModal.get({
			id: 'social_icon_settings_modal',
			title: 'social-icon-setting',
			type: 'form',
			content: data,
			className: 'fixed'
		});
		this.setState({ editing: index });
	},
	cloneItem: function (event) {
		event.preventDefault();
		event.stopPropagation();
		var target = event.target;
		while (!target.classList.contains('list-group-item') && target.nodeName != 'BODY') {
			target = target.parentNode;
		}
		var items = this.state.value,
		    index = parseInt(target.getAttribute('data-index')),
		    item = {
			icon: items[index].icon,
			text: items[index].text,
			link: items[index].link,
			title: items[index].text + SunFwString.parse('clone-label')
		};
		items.splice(index + 1, 0, item);
		this.saveItems(items);
	},
	deleteItem: function (event) {
		event.preventDefault();
		event.stopPropagation();
		var target = event.target;
		while (!target.classList.contains('list-group-item') && target.nodeName != 'BODY') {
			target = target.parentNode;
		}
		var items = this.state.value,
		    index = parseInt(target.getAttribute('data-index'));
		items.splice(index, 1);
		this.saveItems(items);
	}
});