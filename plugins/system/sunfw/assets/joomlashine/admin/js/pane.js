window.SunFwItem = {
	loadSettingsForm: function (editor, type, callback) {
		if (editor.config.items[type]) {
			if (typeof editor.config.items[type].settings == 'string') {
				SunFwAjax.request(editor.config.items[type].settings, function (req) {
					if (req.responseJSON) {
						editor.config.items[type].settings = req.responseJSON;
						if (typeof callback == 'function') {
							callback();
						}
					}
				});
			} else {
				if (typeof callback == 'function') {
					callback();
				}
			}
		}
	},
	isUsed: function (editor, type) {
		var data = editor.getData(),
		    used = false;
		for (var index in data.items) {
			if (data.items[index] && data.items[index].type == type) {
				used = true;
				break;
			}
		}
		return used;
	}
};
window.SunFwPaneMixinBase = React.createClass({
	displayName: 'SunFwPaneMixinBase',
	componentWillMount: function () {
		this.migrateParentEditorRef();
		var state = this.migratePropsToState();
		if (state) {
			this.setState(state);
		}
	},
	render: function () {
		return null;
	},
	componentDidMount: function () {
		if (typeof this.initActions == 'function') {
			this.initActions();
		}
	},
	componentWillReceiveProps: function (newProps) {
		var state = this.migratePropsToState(newProps);
		if (state) {
			this.setState(state);
		}
	},
	componentWillUpdate: function (newProps, newState) {
		this.migrateParentEditorRef();
	},
	componentDidUpdate: function () {
		if (typeof this.initActions == 'function') {
			this.initActions();
		}
	},
	migrateParentEditorRef: function () {
		if (this.props.editor) {
			this.editor = this.props.editor;
			delete this.props.editor;
		}
		if (this.props.parent) {
			this.parent = this.props.parent;
			delete this.props.parent;
		}
	},
	migratePropsToState: function (props) {
		var props = props || this.props,
		    state;
		if (props.data) {
			for (var p in props.data) {
				if (!this.state || this.state[p] != props.data[p]) {
					state = state || {};
					state[p] = props.data[p];
				}
			}
		}
		return state;
	}
});
window.SunFwPaneMixinAction = React.extendClass('SunFwPaneMixinBase', {
	initActions: function () {
		var tab = document.querySelector('a[href="#' + this.editor.props.id + '"]'),
		    saveAllButton = document.getElementById('sunfw-save-all');
		if (this.editor.state.changed == true) {
			if (tab && tab.textContent.indexOf(' *') < 0) {
				tab.classList.add('changed');
				if (tab.parentNode.parentNode.classList.contains('dropdown-menu')) {
					if (tab.parentNode.parentNode.previousElementSibling.textContent.indexOf(' *') < 0) {
						tab.parentNode.parentNode.previousElementSibling.textContent += ' *';
					}
				} else {
					tab.textContent += ' *';
				}
			}
			if (saveAllButton) {
				saveAllButton.disabled = false;
			}
		} else if (tab) {
			tab.classList.remove('changed');
			if (tab.parentNode.parentNode.classList.contains('dropdown-menu')) {
				tab.parentNode.parentNode.previousElementSibling.textContent = tab.parentNode.parentNode.previousElementSibling.textContent.replace(' *', '');
			} else {
				tab.textContent = tab.textContent.replace(' *', '');
			}
		}
	}
});
window.SunFwPaneMixinDraggable = {
	dragStart: function (event) {
		event.dataTransfer.setData('element', this);
		this.editor.state.dataTransfer = this;
		if (this.handleDragStart) {
			this.handleDragStart(event);
		}
	},
	dragEnd: function (event) {
		this.editor.refs.marker.classList.remove('drop-target');
	}
};
window.SunFwPaneMixinDroppable = {
	dragOver: function (event) {
		var that = this.editor.state.dataTransfer;
		if (typeof that == 'object' && event.target == that.refs.wrapper) {
			return;
		}
		if (typeof that == 'object' && this.props.view != that.props.view) {
			return;
		}
		var droppable = event.target;
		while (!droppable.classList.contains('droppable') && droppable.nodeName != 'BODY') {
			droppable = droppable.parentNode;
		}
		if (droppable.nodeName == 'BODY') {
			return;
		}
		var parent = droppable.parentNode;
		while (!parent.classList.contains('offcanvas') && parent.nodeName != 'BODY') {
			parent = parent.parentNode;
		}
		if (parent.classList.contains('offcanvas') && parent.parentNode.className.indexOf('open-') < 0) {
			return;
		}
		var type = that.getItemType ? that.getItemType(that) : 'item';
		if (type && !droppable.classList.contains('accept-' + type)) {
			return;
		}
		if (droppable.children.length && droppable.children[0].className.match(/col-(lg|md|sm|xs)-\d+/) && (this.editor.currentScreen == 'xs' || droppable.children.length == 12)) {
			return;
		}
		var marker = this.editor.refs.marker,
		    scrollT = document.body.scrollTop || document.documentElement.scrollTop,
		    scrollL = document.body.scrollLeft || document.documentElement.scrollLeft,
		    rect,
		    index,
		    targetItem,
		    bounce;
		if (event.target.classList.contains('draggable-item')) {
			index = event.target.getAttribute('data-index');
			rect = event.target.getBoundingClientRect();
			if (event.target.className.match(/col-(lg|md|sm|xs)-\d+/)) {
				marker.classList.add('vertical-marker');
				marker.classList.remove('horizontal-marker');
				marker.style.top = rect.top + scrollT + 'px';
				marker.style.height = rect.height + 'px';
				if (typeof that == 'object' && event.target.nextElementSibling == that.refs.wrapper || event.clientX - rect.left < rect.right - event.clientX) {
					if (event.target.previousElementSibling) {
						bounce = event.target.previousElementSibling.getBoundingClientRect().right;
					} else {
						bounce = event.target.parentNode.getBoundingClientRect().left;
					}
					marker.style.left = rect.left - (rect.left - bounce) / 2 - marker.offsetWidth / 2 + scrollL + 'px';
					event.target.parentNode.setAttribute('drop-index', index);
				} else if (typeof that == 'object' && event.target.previousElementSibling == that.refs.wrapper || event.clientX - rect.left > rect.right - event.clientX) {
					if (event.target.nextElementSibling) {
						bounce = event.target.nextElementSibling.getBoundingClientRect().left;
					} else {
						bounce = event.target.parentNode.getBoundingClientRect().right;
					}
					marker.style.left = rect.right + (bounce - rect.right) / 2 - marker.offsetWidth / 2 + scrollL + 'px';
					event.target.parentNode.setAttribute('drop-index', parseInt(index) + 1);
				} else {
					return;
				}
			}
			else {
					marker.classList.add('horizontal-marker');
					marker.classList.remove('vertical-marker');
					marker.style.left = rect.left + scrollL + 'px';
					marker.style.width = rect.width + 'px';
					if (typeof that == 'object' && event.target.nextElementSibling == that.refs.wrapper || event.clientY - rect.top < rect.bottom - event.clientY) {
						if (event.target.previousElementSibling) {
							bounce = event.target.previousElementSibling.getBoundingClientRect().bottom;
						} else {
							bounce = event.target.parentNode.getBoundingClientRect().top;
						}
						marker.style.top = rect.top - (rect.top - bounce) / 2 - marker.offsetHeight / 2 + scrollT + 'px';
						event.target.parentNode.setAttribute('drop-index', index);
					} else if (typeof that == 'object' && event.target.previousElementSibling == that.refs.wrapper || event.clientY - rect.top > rect.bottom - event.clientY) {
						if (event.target.nextElementSibling) {
							bounce = event.target.nextElementSibling.getBoundingClientRect().top;
						} else {
							if (event.target.previousElementSibling) {
								bounce = event.target.previousElementSibling.getBoundingClientRect().bottom;
							} else {
								bounce = droppable.getBoundingClientRect().top;
							}
							bounce = rect.bottom + (rect.top - bounce);
						}
						marker.style.top = rect.bottom + (bounce - rect.bottom) / 2 - marker.offsetHeight / 2 + scrollT + 'px';
						event.target.parentNode.setAttribute('drop-index', parseInt(index) + 1);
					} else {
						return;
					}
				}
		}
		else {
				if (!droppable.children.length) {
					rect = droppable.getBoundingClientRect();
					bounce = window.getComputedStyle(droppable);
					bounce = {
						top: parseInt(bounce.getPropertyValue('padding-top')),
						left: parseInt(bounce.getPropertyValue('padding-left')),
						right: parseInt(bounce.getPropertyValue('padding-right'))
					};
					marker.classList.add('horizontal-marker');
					marker.classList.remove('vertical-marker');
					marker.style.top = rect.top + bounce.top + scrollT + 'px';
					marker.style.left = rect.left + bounce.left + scrollL + 'px';
					marker.style.width = rect.width - bounce.left - bounce.right + 'px';
					index = 0;
				}
				else if (droppable.children[0].className.match(/col-(lg|md|sm|xs)-\d+/)) {
						for (index = 0; index < droppable.children.length; index++) {
							rect = droppable.children[index].getBoundingClientRect();
							if (event.clientX < rect.left) {
								targetItem = droppable.children[index];
								if (index > 0) {
									var distance = rect.left - event.clientX;
									rect = droppable.children[index - 1].getBoundingClientRect();
									if (event.clientX - rect.left < distance) {
										targetItem = droppable.children[index - 1];
										index--;
									} else {
										rect = droppable.children[index].getBoundingClientRect();
									}
								}
								break;
							}
						}
						marker.classList.add('vertical-marker');
						marker.classList.remove('horizontal-marker');
						marker.style.top = rect.top + scrollT + 'px';
						marker.style.height = rect.height + 'px';
						if (targetItem) {
							if (targetItem.previousElementSibling) {
								bounce = targetItem.previousElementSibling.getBoundingClientRect().right;
							} else {
								bounce = droppable.getBoundingClientRect().left;
							}
							marker.style.left = rect.left - (rect.left - bounce) / 2 - marker.offsetWidth / 2 + scrollL + 'px';
						} else {
							if (event.clientX - rect.left < rect.right - event.clientX) {
								index--;
								bounce = index > 0 ? droppable.children[index - 1].getBoundingClientRect().right : droppable.getBoundingClientRect().left;
								marker.style.left = rect.left - (rect.left - bounce) / 2 - marker.offsetWidth / 2 + scrollL + 'px';
							} else {
								bounce = droppable.getBoundingClientRect().right;
								marker.style.left = rect.right + (bounce - rect.right) / 2 - marker.offsetWidth / 2 + scrollL + 'px';
							}
						}
					}
					else {
							for (index = 0; index < droppable.children.length; index++) {
								rect = droppable.children[index].getBoundingClientRect();
								if (event.clientY < rect.top) {
									targetItem = droppable.children[index];
									if (index > 0) {
										var distance = rect.top - event.clientY;
										rect = droppable.children[index - 1].getBoundingClientRect();
										if (event.clientY - rect.top < distance) {
											targetItem = droppable.children[index - 1];
											index--;
										} else {
											rect = droppable.children[index].getBoundingClientRect();
										}
									}
									break;
								}
							}
							marker.classList.add('horizontal-marker');
							marker.classList.remove('vertical-marker');
							marker.style.left = rect.left + scrollL + 'px';
							marker.style.width = rect.width + 'px';
							if (targetItem) {
								if (targetItem.previousElementSibling) {
									bounce = targetItem.previousElementSibling.getBoundingClientRect().bottom;
								} else {
									bounce = droppable.getBoundingClientRect().top;
								}
								marker.style.top = rect.top - (rect.top - bounce) / 2 - marker.offsetHeight / 2 + scrollT + 'px';
							} else {
								if (event.clientY - rect.top < rect.bottom - event.clientY) {
									index--;
									bounce = index > 0 ? droppable.children[index - 1].getBoundingClientRect().bottom : droppable.getBoundingClientRect().top;
									marker.style.top = rect.top - (rect.top - bounce) / 2 - marker.offsetHeight / 2 + scrollT + 'px';
								} else {
									rect = droppable.children[droppable.children.length - 1].getBoundingClientRect();
									if (droppable.children.length - 1 > 0) {
										bounce = droppable.children[droppable.children.length - 2].getBoundingClientRect().bottom;
									} else {
										bounce = droppable.getBoundingClientRect().top;
									}
									bounce = rect.bottom + (rect.top - bounce);
									marker.style.top = rect.bottom + (bounce - rect.bottom) / 2 - marker.offsetHeight / 2 + scrollT + 'px';
								}
							}
						}
				droppable.setAttribute('drop-index', index);
			}
		marker.classList.add('drop-target');
		event.preventDefault();
		return event.stopPropagation();
	},
	drop: function (event) {
		event.preventDefault();
		event.stopPropagation();
		this.editor.isMouseDown = false;
		this.editor.refs.marker.classList.remove('drop-target');
		var droppable = event.target;
		while (!droppable.classList.contains('droppable') && droppable.nodeName != 'BODY') {
			droppable = droppable.parentNode;
		}
		if (droppable.nodeName == 'BODY') {
			return;
		}
		var that = this.editor.state.dataTransfer,
		    type = that.getItemType ? that.getItemType() : 'item';
		delete this.editor.state.dataTransfer;
		if (!droppable.classList.contains('accept-' + type)) {
			return;
		}
		var targetIndex = parseInt(droppable.getAttribute('drop-index'));
		if (typeof that == 'object' && this == that.parent) {
			if (targetIndex == that.props.index || targetIndex == that.props.index + 1) {
				return;
			}
		}
		if (this.handleDrop) {
			var handleDrop = function () {
				this.handleDrop(droppable, targetIndex, that, type);
				if (typeof that == 'string' && this.editor.config.items[that]) {
					if (this.editor.config.items[that].settings['one-time-item']) {
						this.editor.refs.items.refs['item_type_' + that].forceUpdate();
					}
				}
			}.bind(this);
			if (typeof that == 'string' && this.editor.config.items[that]) {
				return SunFwItem.loadSettingsForm(this.editor, that, function () {
					if (this.editor.config.items[that].settings['one-time-item']) {
						if (SunFwItem.isUsed(this.editor, that)) {
							return bootbox.alert(SunFwString.parse('one-time-item').replace('%ITEM%', that.replace('-', ' ')));
						}
					}
					handleDrop();
				}.bind(this));
			}
			handleDrop();
		}
	}
};
window.SunFwPaneMixinEditor = React.extendClass('SunFwPaneMixinBase', {
	propTypes: {
		id: React.PropTypes.string,
		url: React.PropTypes.string
	},
	componentWillMount: function () {
		SunFw.parent();
		if (this.props.url != '') {
			SunFwAjax.request(this.props.url, function (req) {
				if (req.responseJSON) {
					if (req.responseJSON.data.data) {
						for (var p in this.current) {
							if (req.responseJSON.data.data.hasOwnProperty(p)) {
								this.current[p] = req.responseJSON.data.data[p];
								delete req.responseJSON.data.data[p];
							}
						}
						this.data = req.responseJSON.data.data;
						delete req.responseJSON.data.data;
					}
					if (req.responseJSON.data.inputs) {
						for (var input in req.responseJSON.data.inputs) {
							SunFw.inputs[input] = req.responseJSON.data.inputs[input];
						}
						delete req.responseJSON.data.inputs;
					}
					this.config = req.responseJSON.data;
					this.forceUpdate();
					if (this.config.items) {
						this.selectItem(this.current ? this.current.editing : '');
					}
					if (this.preloadAssets) {
						this.preloadAssets();
					}
				}
			}.bind(this));
		}
	},
	componentDidMount: function () {
		SunFw.parent();
		SunFwEvent.add(document, 'mousedown', this.mousedown);
		SunFwEvent.add(document, 'mouseup', this.mouseup);
		SunFwEvent.add(document, 'keydown', this.keydown);
		SunFwEvent.add(document, 'keyup', this.keyup);
	},
	componentDidUpdate: function () {
		SunFw.parent();
		SunFwEvent.trigger(window, 'resize');
	},
	componentWillUnmount: function () {
		SunFwEvent.remove(document, 'mousedown', this.mousedown);
		SunFwEvent.remove(document, 'mouseup', this.mouseup);
		SunFwEvent.remove(document, 'keydown', this.keydown);
		SunFwEvent.remove(document, 'keyup', this.keyup);
	},
	mousedown: function (event) {
		this.isMouseDown = true;
	},
	mouseup: function (event) {
		this.isMouseDown = false;
	},
	keydown: function (event) {
		var shiftKey = 16,
		    ctrlKey = 17,
		    cmdKey = 91;
		if (event.keyCode == shiftKey) {
			this.isShiftKeyDown = true;
		}
		else if (event.keyCode == ctrlKey || event.keyCode == cmdKey) {
				this.isControlKeyDown = true;
			}
		var backspaceKey = 8,
		    deleteKey = 46,
		    zKey = 90;
		if (this.refs.wrapper && event.target == document.body) {
			var pane = this.refs.wrapper.parentNode;
			if (!pane.classList.contains('tab-pane') && pane.nodeName != 'BODY') {
				pane = pane.parentNode;
			}
			if (!pane.classList.contains('active')) {
				return;
			}
			switch (event.keyCode) {
				case backspaceKey:
				case deleteKey:
					if (this.config.items && this.current.editing != '') {
						if (!this.isControlKeyDown && !this.isShiftKeyDown && !event.altKey && !event.metaKey) {
							var ref = this.refs[this.current.editing];
							if (ref && ref.deleteItem) {
								event.preventDefault();
								ref.deleteItem();
							}
						}
					}
					break;
				case zKey:
					if (this.refs.activity) {
						if (this.isControlKeyDown && this.isShiftKeyDown) {
							event.preventDefault();
							this.refs.activity.redo();
						}
						else if (this.isControlKeyDown) {
								event.preventDefault();
								this.refs.activity.undo();
							}
					}
					break;
			}
		}
	},
	keyup: function (event) {
		var shiftKey = 16,
		    ctrlKey = 17,
		    cmdKey = 91;
		if (event.keyCode == shiftKey) {
			this.isShiftKeyDown = false;
		}
		else if (event.keyCode == ctrlKey || event.keyCode == cmdKey) {
				this.isControlKeyDown = false;
			}
	},
	dragOver: function (event) {
		this.refs.marker.classList.remove('drop-target');
	},
	getData: function () {
		var data = this.data ? JSON.parse(JSON.stringify(this.data)) : {},
		    defaults = this.getDefaultData ? this.getDefaultData() : {};
		for (var p in defaults) {
			if (defaults.hasOwnProperty(p) && data[p] === undefined) {
				data[p] = defaults[p];
			}
		}
		return data;
	},
	setData: function (data, skip_logging_activity) {
		this.data = data;
		if (this.refs.activity) {
			this.log_activity = skip_logging_activity ? false : true;
			this.refs.activity.forceUpdate();
		}
		this.state.changed = true;
		if (this.refs.actions) {
			this.refs.actions.forceUpdate();
		}
	},
	selectItem: function (item, skip_logging_activity) {
		if (this.handleSelectItem) {
			setTimeout(function () {
				this.handleSelectItem(item);
				if (this.refs.activity && !skip_logging_activity) {
					this.refs.activity.forceUpdate();
				}
			}.bind(this), 5);
		}
	},
	showSettings: function (ref, type, data, toolbar, state) {
		if (this.refs.settings) {
			var form = (this.config.items[type] || this.config).settings;
			var state = state || {};
			state.rel = ref;
			state.form = typeof form == 'object' ? this.getItemForm(ref) : form;
			state.values = data;
			state.toolbar = toolbar;
			this.refs.settings.setState(state);
			if (typeof form == 'string') {
				SunFwAjax.request(form, function (req) {
					if (req.responseJSON) {
						(this.config.items[type] || this.config).settings = req.responseJSON;
						this.refs.settings.setState({
							form: this.getItemForm(ref)
						});
					}
				}.bind(this));
			}
		}
	},
	getItemSettings: function (item) {
		if (this.handleGetItemSettings) {
			return this.handleGetItemSettings.apply(this, arguments);
		}
	},
	saveItemSettings: function (item, values) {
		if (this.handleSaveItemSettings) {
			this.handleSaveItemSettings(item, values);
		}
	},
	save: function () {
		var button = this.refs.actions.refs.save;
		if (button) {
			button._original_label = button.innerHTML;
			button.innerHTML = '<i class="icon-apply icon-white margin-right-5"></i> ' + SunFwString.parse('saving-data');
			button.disabled = true;
		}
		var tab = document.querySelector('a[href="#' + this.props.id + '"]');
		if (tab.parentNode.parentNode.classList.contains('dropdown-menu')) {
			tab = tab.parentNode.parentNode.previousElementSibling;
		}
		if (tab) {
			var loading = document.createElement('span');
			loading.className = 'sunfw-loading';
			tab.appendChild(loading);
		}
		var callback = function (res) {
			var response = res.responseJSON || res;
			if (response.type == 'success') {
				noty({
					text: response.data && response.data.message ? response.data.message : SunFwString.parse('save-success'),
					theme: 'relax',
					layout: 'top',
					type: 'success',
					timeout: 2000,
					animation: {
						open: 'animated fadeIn',
						close: 'animated fadeOut'
					}
				});
				this.state.changed = false;
				if (this.refs.activity) {
					this.refs.activity.reset();
				}
				if (this.refs.actions) {
					this.refs.actions.forceUpdate();
				}
			} else {
				bootbox.alert(response.data);
			}
			button.innerHTML = button._original_label;
			try {
				tab.removeChild(loading);
			} catch (e) {
			}
		}.bind(this);
		if (this.handleSave) {
			var args = [];
			for (var i = 0, n = arguments.length; i < n; i++) {
				args[i] = arguments[i];
			}
			args.push(callback);
			this.handleSave.apply(this, args);
		} else {
			var data = this.getData();
			if (this.current) {
				for (var p in this.current) {
					if (this.current.hasOwnProperty(p)) {
						data[p] = this.current[p];
					}
				}
			}
			SunFwAjax.request(this.props.url + '&action=save', callback, { data: JSON.stringify(data) });
		}
	}
});
window.SunFwPaneMixinItem = {
	mouseover: function (event) {
		if (!this.editor.isMouseDown) {
			event.stopPropagation();
			(this.refs.wrapper || event.target).classList.add('mouseover');
		}
	},
	mouseout: function (event) {
		if (!this.editor.isMouseDown) {
			event.stopPropagation();
			(this.refs.wrapper || event.target).classList.remove('mouseover');
		}
	}
};
window.SunFwPaneActivity = React.extendClass('SunFwPaneMixinBase', {
	getInitialState: function () {
		return {
			activities: [],
			index: -1,
			count: 0
		};
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "display-inline btn-group", role: "group" },
			React.createElement(
				"button",
				{
					ref: "undo",
					type: "button",
					disabled: "disabled",
					className: "btn btn-default",
					title: this.state.index + ' changed'
				},
				React.createElement(
					"i",
					{ className: "fa fa-undo", "aria-hidden": "true" },
					" "
				)
			),
			React.createElement(
				"button",
				{
					ref: "redo",
					type: "button",
					disabled: "disabled",
					className: "btn btn-default",
					title: this.state.activities.length - this.state.index - 1 + ' changed'
				},
				React.createElement(
					"i",
					{ className: "fa fa-repeat", "aria-hidden": "true" },
					" "
				)
			)
		);
	},
	componentDidMount: function () {
		this.state.activities[++this.state.index] = {
			data: this.editor.getData(),
			state: JSON.parse(JSON.stringify(this.editor.state)),
			current: JSON.parse(JSON.stringify(this.editor.current))
		};
		SunFwEvent.add(this.refs.undo, 'click', this.undo);
		SunFwEvent.add(this.refs.redo, 'click', this.redo);
	},
	componentDidUpdate: function () {
		if (!this.undoing && !this.redoing) {
			var current = {
				data: this.editor.getData(),
				state: JSON.parse(JSON.stringify(this.editor.state)),
				current: JSON.parse(JSON.stringify(this.editor.current))
			};
			if (this.editor.log_activity == true) {
				var last = this.state.activities[this.state.index],
				    changed = !last;
				if (last) {
					for (var p in current.data) {
						if (current.data.hasOwnProperty(p)) {
							if (typeof current.data[p] == 'object') {
								if (JSON.stringify(current.data[p]) != JSON.stringify(last.data[p])) {
									changed = true;
									break;
								}
							} else if (current.data[p] != last.data[p]) {
								changed = true;
								break;
							}
						}
					}
				}
				if (changed) {
					if (this.state.index + 1 < this.state.activities.length) {
						this.state.activities.splice(this.state.index + 1, this.state.activities.length - this.state.index - 1);
					}
					this.state.activities.push(current);
					this.state.index++;
				} else {
					this.state.activities[this.state.index] = current;
				}
			} else {
				this.state.activities[this.state.index] = current;
			}
		} else {
			if (this.undoing) {
				this.undoing = false;
			} else {
				this.redoing = false;
			}
		}
		this.refs.undo.disabled = !(this.state.index > 0);
		this.refs.redo.disabled = !(this.state.index + 1 < this.state.activities.length);
	},
	componentWillUnmount: function () {
		SunFwEvent.remove(this.refs.undo, 'click', this.undo);
		SunFwEvent.remove(this.refs.redo, 'click', this.redo);
	},
	undo: function () {
		if (!this.refs.undo.disabled) {
			this.undoing = true;
			this.state.index--;
			var activity = JSON.parse(JSON.stringify(this.state.activities[this.state.index]));
			if (this.state.index == 0) {
				activity.state.changed = false;
			}
			this.change(activity);
		}
	},
	redo: function () {
		if (!this.refs.redo.disabled) {
			this.redoing = true;
			this.state.index++;
			var activity = JSON.parse(JSON.stringify(this.state.activities[this.state.index]));
			this.change(activity);
		}
	},
	change: function (activity) {
		this.editor.setData(activity.data);
		this.editor.setState(activity.state);
		if (this.editor.selectItem && activity.current && activity.current.editing !== undefined) {
			this.editor.selectItem(activity.current.editing, true);
		}
	},
	reset: function () {
		this.setState(this.getInitialState());
	}
});
window.SunFwPaneItems = React.extendClass('SunFwPaneMixinBase', {
	render: function () {
		var items = [];
		for (var type in this.editor.config.items) {
			var keyName = 'item_type_' + type;
			items.push(React.createElement(SunFwPaneItem, {
				key: this.editor.props.id + '_' + keyName,
				ref: keyName,
				type: type,
				parent: this,
				editor: this.editor
			}));
		}
		return React.createElement(
			'div',
			{ ref: 'wrapper', className: 'layout-builder-items' },
			React.createElement(
				'ul',
				{ className: 'list-unstyled list-modules margin-bottom-0' },
				items
			)
		);
	}
});
window.SunFwPaneItem = React.extendClass('SunFwPaneMixinBase', {
	mixins: [SunFwPaneMixinDraggable],
	getDefaultProps: function () {
		return {
			type: ''
		};
	},
	componentWillMount: function () {
		SunFw.parent();
		SunFwItem.loadSettingsForm(this.editor, this.props.type, this.forceUpdate.bind(this));
	},
	render: function () {
		var item = this.editor.config.items[this.props.type];
		if (typeof item.settings == 'string' || item.settings['hidden-in-panel']) {
			return null;
		}
		return React.createElement(
			'li',
			{
				className: 'draggable',
				draggable: 'true',
				onDragStart: this.dragStart,
				onDragEnd: this.dragEnd
			},
			React.createElement(
				'a',
				{
					ref: 'element',
					href: '#',
					title: item.label,
					'data-type': this.props.type
				},
				React.createElement('i', { className: item.icon }),
				item.label
			)
		);
	},
	initActions: function () {
		if (this.refs.element) {
			if (!this.refs.element._initialized_popover) {
				jQuery(this.refs.element).popover({
					content: '',
					trigger: 'hover',
					template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
					container: 'body'
				}).on('show.bs.popover', function (event) {
					var target = event.target;
					var content;
					if (target.parentNode.classList.contains('disabled')) {
						content = SunFwString.parse('used-one-time-item').replace('%ITEM%', target.textContent);
					} else {
						content = target.textContent;
					}
					jQuery(target).data('bs.popover').options.content = content;
				}.bind(this));
				this.refs.element._initialized_popover = true;
			}
		}
		var item = this.editor.config.items[this.props.type];
		if (item.settings && item.settings['one-time-item']) {
			if (SunFwItem.isUsed(this.editor, this.props.type)) {
				this.refs.element.parentNode.classList.add('disabled');
			} else {
				this.refs.element.parentNode.classList.remove('disabled');
			}
		}
	},
	componentWillUnmount: function () {
		if (this.refs.element._initialized_popover) {
			delete this.refs.element._initialized_popover;
			jQuery(this.refs.element).off('show.bs.popover').popover('destroy');
		}
	},
	handleDragStart: function (event) {
		var item_type = event.target.getAttribute('data-type');
		if (event.target.parentNode.classList.contains('disabled')) {
			return bootbox.alert(SunFwString.parse('one-time-item').replace('%ITEM%', item_type.replace('-', ' ')));
		}
		event.dataTransfer.setData('element', item_type);
		this.editor.state.dataTransfer = item_type;
	}
});
