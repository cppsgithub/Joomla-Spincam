window.SunFwPaneLayoutMixinBase = React.extendClass('SunFwPaneMixinBase', {
	initActions: function () {
		if (this.editor) {
			for (var k in this.refs) {
				if (k.match(/^(section|row|column|item)_/)) {
					this.editor.refs[k] = this.refs[k];
					delete this.refs[k];
				}
			}
		}
	}
});
window.SunFwPaneLayoutMixinDroppable = {
	handleDrop: function (droppable, target, that, type) {
		if (this.props.view != 'main') {
			return this.handleDropInOffcanvas(droppable, target, that, type);
		}
		var data = this.editor.getData(),
		    view = data.views[this.props.view],
		    sections = data.sections,
		    rows = data.rows,
		    columns = data.columns,
		    items = data.items,
		    section,
		    row,
		    column,
		    item,
		    label,
		    next = {};
		if (droppable.classList.contains('accept-section') && type == 'section') {
			section = view.sections.splice(that.props.index, 1)[0];
			if (target > that.props.index) {
				view.sections.splice(target - 1, 0, section);
			} else {
				view.sections.splice(target, 0, section);
			}
			this.editor.section_just_added = section;
		}
		else if (droppable.classList.contains('accept-row') && type == 'row') {
				section = sections[view.sections[that.parent.props.index]];
				row = section.rows.splice(that.props.index, 1)[0];
				this.editor.row_just_added = row;
				if (!section.rows.length) {
					delete sections[view.sections[that.parent.props.index]];
					view.sections.splice(that.parent.props.index, 1);
					if (droppable.classList.contains('accept-section') && target > that.parent.props.index) {
						target--;
					}
					if (this.props.type == 'section' && this.props.index > that.parent.props.index) {
						this.props.index--;
					}
					if (!droppable.classList.contains('accept-section')) {
						that.parent.parent.forceUpdate();
					}
				}
				else {
						that.parent.forceUpdate();
					}
				if (droppable.classList.contains('accept-section')) {
					next.section = SunFwStorage.getNextIndex(sections);
					label = SunFwString.parse('section') + ' #' + next.section;
					sections[next.section] = {
						id: 'section_' + SunFwString.toId(label),
						settings: { name: label },
						rows: [row]
					};
					view.sections.splice(target, 0, next.section);
				}
				else {
						sections[view.sections[this.props.index]].rows.splice(target, 0, row);
					}
			}
			else if (droppable.classList.contains('accept-column') && type == 'column') {
					section = sections[view.sections[that.parent.parent.props.index]];
					row = rows[section.rows[that.parent.props.index]];
					column = row.columns.splice(that.props.index, 1)[0];
					this.editor.column_just_added = column;
					if (!row.columns.length) {
						delete rows[section.rows[that.parent.props.index]];
						section.rows.splice(that.parent.props.index, 1);
						if (this.props.type == 'section' && this == that.parent.parent && target > that.parent.props.index) {
							target--;
						}
						if (this.props.type == 'row' && this.parent == that.parent.parent && this.props.index > that.parent.props.index) {
							this.props.index--;
						}
						if (!section.rows.length) {
							delete sections[view.sections[that.parent.parent.props.index]];
							view.sections.splice(that.parent.parent.props.index, 1);
							if (droppable.classList.contains('accept-section') && target > that.parent.parent.props.index) {
								target--;
							}
							if (this.props.type == 'section' && this.props.index > that.parent.parent.props.index) {
								this.props.index--;
							}
							if (this.props.type == 'row' && this.parent.props.index > that.parent.parent.props.index) {
								this.parent.props.index--;
							}
							if (!droppable.classList.contains('accept-section')) {
								that.parent.parent.parent.forceUpdate();
							}
						}
						else {
								that.parent.parent.forceUpdate();
							}
					}
					else {
							columns = this.editor.calcColumnWidth(columns, row.columns);
							that.parent.forceUpdate();
						}
					if (droppable.classList.contains('accept-section')) {
						next.row = SunFwStorage.getNextIndex(rows);
						label = SunFwString.parse('row') + ' #' + next.row;
						rows[next.row] = {
							id: 'row_' + SunFwString.toId(label),
							settings: { name: label },
							columns: [column]
						};
						columns = this.editor.calcColumnWidth(columns, [column]);
						next.section = SunFwStorage.getNextIndex(sections);
						label = SunFwString.parse('section') + ' #' + next.section;
						sections[next.section] = {
							id: 'section_' + SunFwString.toId(label),
							settings: { name: label },
							rows: [next.row]
						};
						view.sections.splice(target, 0, next.section);
					}
					else if (droppable.classList.contains('accept-row')) {
							next.row = SunFwStorage.getNextIndex(rows);
							label = SunFwString.parse('row') + ' #' + next.row;
							rows[next.row] = {
								id: 'row_' + SunFwString.toId(label),
								settings: { name: label },
								columns: [column]
							};
							columns = this.editor.calcColumnWidth(columns, [column]);
							sections[view.sections[this.props.index]].rows.splice(target, 0, next.row);
						}
						else {
								section = sections[view.sections[this.parent.props.index]];
								rows[section.rows[this.props.index]].columns.splice(target, 0, column);
								columns = this.editor.calcColumnWidth(columns, rows[section.rows[this.props.index]].columns);
							}
				}
				else if (type == 'item' && typeof that == 'object') {
						section = sections[view.sections[that.parent.parent.parent.props.index]];
						row = rows[section.rows[that.parent.parent.props.index]];
						column = columns[row.columns[that.parent.props.index]];
						item = column.items.splice(that.props.index, 1)[0];
						if (!column.items.length) {
							delete columns[row.columns[that.parent.props.index]];
							row.columns.splice(that.parent.props.index, 1);
							if (this.props.type == 'row' && this == that.parent.parent && target > that.parent.parent.props.index) {
								target--;
							}
							if (this.props.type == 'column' && this.parent == that.parent.parent && this.props.index > that.parent.props.index) {
								this.props.index--;
							}
							if (!row.columns.length) {
								delete rows[section.rows[that.parent.parent.props.index]];
								section.rows.splice(that.parent.parent.props.index, 1);
								if (this.props.type == 'section' && this == that.parent.parent.parent && target > that.parent.parent.parent.props.index) {
									target--;
								}
								if (this.props.type == 'row' && this.parent == that.parent.parent.parent && this.props.index > that.parent.parent.props.index) {
									this.props.index--;
								}
								if (this.props.type == 'column' && this.parent.parent == that.parent.parent.parent && this.parent.props.index > that.parent.parent.props.index) {
									this.parent.props.index--;
								}
								if (!section.rows.length) {
									delete sections[view.sections[that.parent.parent.parent.props.index]];
									view.sections.splice(that.parent.parent.parent.props.index, 1);
									if (droppable.classList.contains('accept-section') && target > that.parent.parent.parent.props.index) {
										target--;
									}
									if (this.props.type == 'section' && this.props.index > that.parent.parent.parent.props.index) {
										this.props.index--;
									}
									if (this.props.type == 'row' && this.parent.props.index > that.parent.parent.parent.props.index) {
										this.parent.props.index--;
									}
									if (this.props.type == 'column' && this.parent.parent.props.index > that.parent.parent.parent.props.index) {
										this.parent.parent.props.index--;
									}
									if (!droppable.classList.contains('accept-section')) {
										that.parent.parent.parent.parent.forceUpdate();
									}
								}
								else {
										that.parent.parent.parent.forceUpdate();
									}
							}
							else {
									columns = this.editor.calcColumnWidth(columns, row.columns);
									that.parent.parent.forceUpdate();
								}
						}
						else {
								that.parent.forceUpdate();
							}
					} else if (typeof that == 'string') {
						next.item = SunFwStorage.getNextIndex(items);
						label = this.editor.config.items[that].label || SunFwString.parse('item') + ' #' + next.item;
						items[next.item] = {
							id: 'item_' + SunFwString.toId(label),
							type: that,
							settings: { name: label }
						};
						item = next.item;
					}
		if (item !== undefined) {
			this.editor.item_just_added = item;
			if (droppable.classList.contains('accept-section')) {
				next.column = SunFwStorage.getNextIndex(columns);
				label = SunFwString.parse('column') + ' #' + next.column;
				columns[next.column] = {
					id: 'column_' + SunFwString.toId(label),
					width: { lg: this.editor.config.grid },
					settings: { name: label },
					items: [item]
				};
				next.row = SunFwStorage.getNextIndex(rows);
				label = SunFwString.parse('row') + ' #' + next.row;
				rows[next.row] = {
					id: 'row_' + SunFwString.toId(label),
					settings: { name: label },
					columns: [next.column]
				};
				next.section = SunFwStorage.getNextIndex(sections);
				label = SunFwString.parse('section') + ' #' + next.section;
				sections[next.section] = {
					id: 'section_' + SunFwString.toId(label),
					settings: { name: label },
					rows: [next.row]
				};
				view.sections.splice(target, 0, next.section);
			}
			else if (droppable.classList.contains('accept-row')) {
					next.column = SunFwStorage.getNextIndex(columns);
					label = SunFwString.parse('column') + ' #' + next.column;
					columns[next.column] = {
						id: 'column_' + SunFwString.toId(label),
						width: { lg: this.editor.config.grid },
						settings: { name: label },
						items: [item]
					};
					next.row = SunFwStorage.getNextIndex(rows);
					label = SunFwString.parse('row') + ' #' + next.row;
					rows[next.row] = {
						id: 'row_' + SunFwString.toId(label),
						settings: { name: label },
						columns: [next.column]
					};
					sections[view.sections[this.props.index]].rows.splice(target, 0, next.row);
				}
				else if (droppable.classList.contains('accept-column')) {
						next.column = SunFwStorage.getNextIndex(columns);
						label = SunFwString.parse('column') + ' #' + next.column;
						columns[next.column] = {
							id: 'column_' + SunFwString.toId(label),
							settings: { name: label },
							items: [item]
						};
						section = sections[view.sections[this.parent.props.index]];
						rows[section.rows[this.props.index]].columns.splice(target, 0, next.column);
						columns = this.editor.calcColumnWidth(columns, rows[section.rows[this.props.index]].columns);
					}
					else {
							section = sections[view.sections[this.parent.parent.props.index]];
							row = rows[section.rows[this.parent.props.index]];
							columns[row.columns[this.props.index]].items.splice(target, 0, item);
						}
		}
		if (typeof that == 'string' && that == 'menu') {
			this.editor.setData(data, true);
		}
		else {
				this.editor.setData(data);
			}
		this.forceUpdate();
	},
	handleDropInOffcanvas: function (droppable, target, that, type) {
		var data = this.editor.getData(),
		    view = data.views[this.props.view],
		    rows = data.rows,
		    columns = data.columns,
		    items = data.items,
		    row,
		    column,
		    item,
		    label,
		    next = {};
		if (droppable.classList.contains('accept-row') && type == 'row') {
			row = view.rows.splice(that.props.index, 1)[0];
			if (target > that.props.index) {
				view.rows.splice(target - 1, 0, row);
			} else {
				view.rows.splice(target, 0, row);
			}
			this.editor.row_just_added = row;
		}
		else if (droppable.classList.contains('accept-column') && type == 'column') {
				row = rows[view.rows[that.parent.props.index]];
				column = row.columns.splice(that.props.index, 1)[0];
				this.editor.column_just_added = column;
				if (!row.columns.length) {
					delete rows[view.rows[that.parent.props.index]];
					view.rows.splice(that.parent.props.index, 1);
					if (droppable.classList.contains('accept-row') && target > that.parent.props.index) {
						target--;
					}
					if (this.props.type == 'row' && this.props.index > that.parent.props.index) {
						this.props.index--;
					}
					if (!droppable.classList.contains('accept-row')) {
						that.parent.parent.forceUpdate();
					}
				}
				else {
						columns = this.editor.calcColumnWidth(columns, row.columns);
						that.parent.forceUpdate();
					}
				if (droppable.classList.contains('accept-row')) {
					next.row = SunFwStorage.getNextIndex(rows);
					label = SunFwString.parse('row') + ' #' + next.row;
					rows[next.row] = {
						id: 'row_' + SunFwString.toId(label),
						settings: { name: label },
						columns: [column]
					};
					columns = this.editor.calcColumnWidth(columns, [column]);
					view.rows.splice(target, 0, next.row);
				}
				else {
						rows[view.rows[this.props.index]].columns.splice(target, 0, column);
						columns = this.editor.calcColumnWidth(columns, rows[view.rows[this.props.index]].columns);
					}
			}
			else if (type == 'item' && typeof that == 'object') {
					row = rows[view.rows[that.parent.parent.props.index]];
					column = columns[row.columns[that.parent.props.index]];
					item = column.items.splice(that.props.index, 1)[0];
					if (!column.items.length) {
						delete columns[row.columns[that.parent.props.index]];
						row.columns.splice(that.parent.props.index, 1);
						if (this.props.type == 'row' && this == that.parent.parent && target > that.parent.parent.props.index) {
							target--;
						}
						if (this.props.type == 'column' && this.parent == that.parent.parent && this.props.index > that.parent.props.index) {
							this.props.index--;
						}
						if (!row.columns.length) {
							delete rows[view.rows[that.parent.parent.props.index]];
							view.rows.splice(that.parent.parent.props.index, 1);
							if (droppable.classList.contains('accept-row') && target > that.parent.parent.props.index) {
								target--;
							}
							if (this.props.type == 'row' && this.props.index > that.parent.parent.props.index) {
								this.props.index--;
							}
							if (this.props.type == 'column' && this.parent.props.index > that.parent.parent.props.index) {
								this.parent.props.index--;
							}
							if (!droppable.classList.contains('accept-row')) {
								that.parent.parent.parent.forceUpdate();
							}
						}
						else {
								columns = this.editor.calcColumnWidth(columns, row.columns);
								that.parent.parent.forceUpdate();
							}
					}
					else {
							that.parent.forceUpdate();
						}
				} else if (typeof that == 'string') {
					next.item = SunFwStorage.getNextIndex(items);
					label = this.editor.config.items[that].label || SunFwString.parse('item') + ' #' + next.item;
					items[next.item] = {
						id: 'item_' + SunFwString.toId(label),
						type: that,
						settings: { name: label }
					};
					item = next.item;
				}
		if (item !== undefined) {
			this.editor.item_just_added = item;
			if (droppable.classList.contains('accept-row')) {
				next.column = SunFwStorage.getNextIndex(columns);
				label = SunFwString.parse('column') + ' #' + next.column;
				columns[next.column] = {
					id: 'column_' + SunFwString.toId(label),
					width: { lg: this.editor.config.grid },
					settings: { name: label },
					items: [item]
				};
				next.row = SunFwStorage.getNextIndex(rows);
				label = SunFwString.parse('row') + ' #' + next.row;
				rows[next.row] = {
					id: 'row_' + SunFwString.toId(label),
					settings: { name: label },
					columns: [next.column]
				};
				view.rows.splice(target, 0, next.row);
			}
			else if (droppable.classList.contains('accept-column')) {
					next.column = SunFwStorage.getNextIndex(columns);
					label = SunFwString.parse('column') + ' #' + next.column;
					columns[next.column] = {
						id: 'column_' + SunFwString.toId(label),
						settings: { name: label },
						items: [item]
					};
					rows[view.rows[this.props.index]].columns.splice(target, 0, next.column);
					columns = this.editor.calcColumnWidth(columns, rows[view.rows[this.props.index]].columns);
				}
				else {
						row = rows[view.rows[this.parent.props.index]];
						columns[row.columns[this.props.index]].items.splice(target, 0, item);
					}
		}
		this.editor.setData(data);
		this.forceUpdate();
	}
};
window.SunFwPaneLayoutMixinItem = React.extendClass('SunFwPaneLayoutMixinBase', {
	mixins: [SunFwPaneMixinItem],
	componentDidMount: function () {
		SunFw.parent();
		setTimeout(function () {
			if (this.refs.wrapper) {
				this.refs.wrapper.classList.remove('initial');
				this.rendered = true;
			}
		}.bind(this), 10);
	},
	componentDidUpdate: function () {
		SunFw.parent();
		setTimeout(function () {
			if (this.refs.wrapper) {
				this.refs.wrapper.classList.remove('initial');
			}
		}.bind(this), 10);
		var type = this.getItemType(),
		    keyName = type + '_' + this.props[type];
		if (this.editor.current.editing == keyName) {
			this.refs.wrapper.classList.add('editing');
		}
	},
	getItemType: function (item) {
		var item = item || this,
		    type = 'item';
		if (typeof item == 'object' && ['offcanvas', 'section', 'row', 'column'].indexOf(item.props.type) > -1) {
			type = item.props.type;
		}
		return type;
	},
	editItem: function (event) {
		event.stopPropagation();
		if (typeof this.editor.selectItem == 'function') {
			this.editor.selectItem(this.props.id);
		}
	},
	cloneItem: function () {
		var data = this.editor.getData(),
		    view = data.views[this.props.view],
		    sections = data.sections,
		    rows = data.rows,
		    columns = data.columns,
		    items = data.items,
		    section,
		    row,
		    column,
		    item,
		    nested_ids,
		    next,
		    message = [],
		cloneChildren = function (type, children) {
			var ids = [];
			for (var i = 0, n = children.length; i < n; i++) {
				switch (type) {
					case 'row':
						nested_ids = cloneChildren('column', rows[children[i]].columns);
						if (nested_ids.length) {
							item = JSON.parse(JSON.stringify(rows[children[i]]));
							item.columns = nested_ids;
							item.settings.name = item.settings.name + SunFwString.parse('clone-label');
							if (item.settings.name) {
								item.id = 'row_' + SunFwString.toId(item.settings.name, true);
							} else {
								item.id = 'row_' + Math.round(parseInt(new Date().getTime()) * Math.random());
							}
							next = SunFwStorage.getNextIndex(rows);
							rows[next] = item;
							if (nested_ids.length != rows[children[i]].columns.length) {
								columns = this.editor.calcColumnWidth(columns, nested_ids);
							}
							ids.push(next);
						}
						break;
					case 'column':
						nested_ids = cloneChildren('item', columns[children[i]].items);
						if (nested_ids.length) {
							item = JSON.parse(JSON.stringify(columns[children[i]]));
							item.items = nested_ids;
							item.settings.name = item.settings.name + SunFwString.parse('clone-label');
							if (item.settings.name) {
								item.id = 'column_' + SunFwString.toId(item.settings.name, true);
							} else {
								item.id = 'column_' + Math.round(parseInt(new Date().getTime()) * Math.random());
							}
							next = SunFwStorage.getNextIndex(columns);
							columns[next] = item;
							ids.push(next);
						}
						break;
					case 'item':
						if (this.editor.config.items[items[children[i]].type].settings['one-time-item']) {
							message.push(SunFwString.parse('one-time-item').replace('%ITEM%', items[children[i]].type.replace('-', ' ')));
						} else {
							item = JSON.parse(JSON.stringify(items[children[i]]));
							item.id = 'item_' + SunFwString.toId(item.settings.name, true);
							item.settings.name = item.settings.name + SunFwString.parse('clone-label');
							next = SunFwStorage.getNextIndex(items);
							items[next] = item;
							ids.push(next);
						}
						break;
				}
			}
			return ids;
		}.bind(this);
		switch (this.props.type) {
			case 'section':
				nested_ids = cloneChildren('row', sections[view.sections[this.props.index]].rows);
				if (nested_ids.length) {
					item = JSON.parse(JSON.stringify(sections[view.sections[this.props.index]]));
					item.id = 'section_' + SunFwString.toId(item.settings.name, true);
					item.rows = nested_ids;
					item.settings.name = item.settings.name + SunFwString.parse('clone-label');
					next = SunFwStorage.getNextIndex(sections);
					sections[next] = item;
					view.sections.splice(this.props.index + 1, 0, next);
				}
				break;
			case 'row':
				if (this.props.view == 'main') {
					section = sections[view.sections[this.parent.props.index]];
				} else {
					section = view;
				}
				nested_ids = cloneChildren('column', rows[section.rows[this.props.index]].columns);
				if (nested_ids.length) {
					item = JSON.parse(JSON.stringify(rows[section.rows[this.props.index]]));
					item.columns = nested_ids;
					item.settings.name = item.settings.name + SunFwString.parse('clone-label');
					if (item.settings.name) {
						item.id = 'row_' + SunFwString.toId(item.settings.name, true);
					} else {
						item.id = 'row_' + Math.round(parseInt(new Date().getTime()) * Math.random());
					}
					next = SunFwStorage.getNextIndex(rows);
					rows[next] = item;
					section.rows.splice(this.props.index + 1, 0, next);
				}
				break;
			case 'column':
				if (this.props.view == 'main') {
					section = sections[view.sections[this.parent.parent.props.index]];
					row = rows[section.rows[this.parent.props.index]];
				} else {
					row = rows[view.rows[this.parent.props.index]];
				}
				nested_ids = cloneChildren('item', columns[row.columns[this.props.index]].items);
				if (nested_ids.length) {
					item = JSON.parse(JSON.stringify(columns[row.columns[this.props.index]]));
					item.items = nested_ids;
					item.settings.name = item.settings.name + SunFwString.parse('clone-label');
					if (item.settings.name) {
						item.id = 'column_' + SunFwString.toId(item.settings.name, true);
					} else {
						item.id = 'column_' + Math.round(parseInt(new Date().getTime()) * Math.random());
					}
					next = SunFwStorage.getNextIndex(columns);
					columns[next] = item;
					row.columns.splice(this.props.index + 1, 0, next);
					columns = this.editor.calcColumnWidth(columns, row.columns);
				}
				break;
			default:
				if (this.props.view == 'main') {
					section = sections[view.sections[this.parent.parent.parent.props.index]];
					row = rows[section.rows[this.parent.parent.props.index]];
					column = columns[row.columns[this.parent.props.index]];
				} else {
					row = rows[view.rows[this.parent.parent.props.index]];
					column = columns[row.columns[this.parent.props.index]];
				}
				if (this.editor.config.items[items[column.items[this.props.index]].type] && this.editor.config.items[items[column.items[this.props.index]].type].settings['one-time-item']) {
					message.push(SunFwString.parse('one-time-item').replace('%ITEM%', items[column.items[this.props.index]].type.replace('-', ' ')));
				} else {
					item = JSON.parse(JSON.stringify(items[column.items[this.props.index]]));
					item.id = 'item_' + SunFwString.toId(item.settings.name, true);
					item.settings.name = item.settings.name + SunFwString.parse('clone-label');
					next = SunFwStorage.getNextIndex(items);
					items[next] = item;
					column.items.splice(this.props.index + 1, 0, next);
				}
				break;
		}
		if (message.length) {
			bootbox.alert(SunFwString.parse('clone-item-error') + "\n\n- " + message.join("\n-"));
		}
		this.editor.setData(data);
		this.parent.forceUpdate();
	},
	toggleItem: function () {
		var data = this.editor.getData(),
		    view = data.views[this.props.view],
		    sections = data.sections,
		    rows = data.rows,
		    columns = data.columns,
		    items = data.items,
		    section,
		    row,
		    column,
		    settings;
		switch (this.props.type) {
			case 'section':
				settings = sections[view.sections[this.props.index]].settings;
				break;
			case 'row':
				if (this.props.view == 'main') {
					section = sections[view.sections[this.parent.props.index]];
					settings = rows[section.rows[this.props.index]].settings;
				} else {
					settings = rows[view.rows[this.props.index]].settings;
				}
				break;
			case 'column':
				if (this.props.view == 'main') {
					section = sections[view.sections[this.parent.parent.props.index]];
					row = rows[section.rows[this.parent.props.index]];
					settings = columns[row.columns[this.props.index]].settings;
				} else {
					row = rows[view.rows[this.parent.props.index]];
					settings = columns[row.columns[this.props.index]].settings;
				}
				break;
			default:
				if (this.props.view == 'main') {
					section = sections[view.sections[this.parent.parent.parent.props.index]];
					row = rows[section.rows[this.parent.parent.props.index]];
					column = columns[row.columns[this.parent.props.index]];
					settings = items[column.items[this.props.index]].settings;
				} else {
					row = rows[view.rows[this.parent.parent.props.index]];
					column = columns[row.columns[this.parent.props.index]];
					settings = items[column.items[this.props.index]].settings;
				}
				break;
		}
		if (!settings || settings instanceof Array) {
			settings = {};
		}
		settings.disabled = !settings.disabled;
		this.editor.setData(data);
		this.forceUpdate();
	},
	deleteItem: function () {
		var data = this.editor.getData(),
		    view = data.views[this.props.view],
		    sections = data.sections,
		    rows = data.rows,
		    columns = data.columns,
		    items = data.items,
		    section,
		    row,
		    column,
		    updateStyles;
		function deleteChildren(parent, type, children) {
			for (var i = 0, n = children.length; i < n; i++) {
				switch (type) {
					case 'row':
						deleteChildren(parent.editor.refs['row_' + children[i]], 'column', rows[children[i]].columns);
						delete parent.editor.refs['row_' + children[i]];
						delete rows[children[i]];
						break;
					case 'column':
						deleteChildren(parent.editor.refs['column_' + children[i]], 'item', columns[children[i]].items);
						delete parent.editor.refs['column_' + children[i]];
						delete columns[children[i]];
						break;
					case 'item':
						type = items[children[i]].type;
						delete parent.editor.refs['item_' + children[i]];
						delete items[children[i]];
						if (parent.editor.config.items[type].settings['one-time-item']) {
							parent.editor.refs.items.refs['item_type_' + type].forceUpdate();
						}
						if (type == 'menu') {
							updateStyles = true;
						}
						break;
				}
			}
		}
		switch (this.props.type) {
			case 'section':
				deleteChildren(this, 'row', sections[view.sections[this.props.index]].rows);
				delete this.editor.refs[this.props.id];
				delete sections[view.sections[this.props.index]];
				view.sections.splice(this.props.index, 1);
				updateStyles = true;
				break;
			case 'row':
				if (this.props.view == 'main') {
					section = sections[view.sections[this.parent.props.index]];
					if (section.rows.length == 1) {
						return this.parent.deleteItem();
					}
				} else {
					section = view;
				}
				deleteChildren(this, 'column', rows[section.rows[this.props.index]].columns);
				delete this.editor.refs[this.props.id];
				delete rows[section.rows[this.props.index]];
				section.rows.splice(this.props.index, 1);
				break;
			case 'column':
				if (this.props.view == 'main') {
					section = sections[view.sections[this.parent.parent.props.index]];
					row = rows[section.rows[this.parent.props.index]];
				} else {
					row = rows[view.rows[this.parent.props.index]];
				}
				if (row.columns.length == 1) {
					return this.parent.deleteItem();
				}
				deleteChildren(this, 'item', columns[row.columns[this.props.index]].items);
				delete this.editor.refs[this.props.id];
				delete columns[row.columns[this.props.index]];
				row.columns.splice(this.props.index, 1);
				columns = this.editor.calcColumnWidth(columns, row.columns);
				break;
			default:
				if (this.props.view == 'main') {
					section = sections[view.sections[this.parent.parent.parent.props.index]];
					row = rows[section.rows[this.parent.parent.props.index]];
				} else {
					row = rows[view.rows[this.parent.parent.props.index]];
				}
				column = columns[row.columns[this.parent.props.index]];
				if (column.items.length == 1) {
					return this.parent.deleteItem();
				}
				delete this.editor.refs[this.props.id];
				delete items[column.items[this.props.index]];
				column.items.splice(this.props.index, 1);
				if (this.editor.config.items[this.props.type].settings['one-time-item']) {
					this.editor.refs.items.refs['item_type_' + this.props.type].forceUpdate();
				}
				break;
		}
		var timeout = 0;
		if (this.refs.wrapper.classList.contains('layout-builder-section')) {
			this.refs.wrapper.classList.add('initial');
			timeout = 250;
		}
		setTimeout(function () {
			this.editor.setData(data);
			var parent = this.parent;
			while (parent.refs.wrapper.querySelectorAll('.layout-builder-item').length <= 1) {
				parent = parent.parent;
			}
			this.editor.selectItem(parent.props.id);
			this.parent.forceUpdate();
			if (updateStyles) {
				this.editor.props.doc.refs.body.refs.styles.forceUpdate();
			}
		}.bind(this), timeout);
	},
	changeSectionIDForTemplate: function (oldData, newData) {
		if (oldData == newData) {
			return;
		}
		var server = this.editor.props.url + '&action=changeSectionIDForTemplate';
		SunFwAjax.request(server, null, { old_data: oldData, new_data: newData });
	},
	deleteSectionIdInDataBase: function (sid) {
		var server = this.editor.props.url + '&action=deleteSectionIDInAppearance';
		SunFwAjax.request(server, null, { section_id: sid });
	}
});
window.SunFwPaneLayoutColumn = React.extendClass('SunFwPaneLayoutMixinItem', {
	mixins: [SunFwPaneMixinDraggable, SunFwPaneMixinDroppable, SunFwPaneLayoutMixinDroppable],
	getDefaultProps: function () {
		return {
			id: '',
			view: '',
			type: 'column',
			index: 0,
			column: ''
		};
	},
	render: function () {
		var data = this.editor.getData(),
		    settings = this.editor.getItemSettings(this),
		    column = data.columns[this.props.column],
		    width = column.width ? column.width[this.editor.current.screen] || column.width.lg : this.editor.config.grid;
		var className = 'layout-builder-item draggable-item resizable col-layout col-xs-' + width,
		    items = [],
		    keyName;
		if (settings.disabled) {
			className += ' disabled-item';
		}
		if (!this.rendered) {
			className += ' initial';
		}
		column.items.map((itemIndex, index) => {
			if (data.items[itemIndex]) {
				keyName = 'item_' + itemIndex;
				items.push(React.createElement(SunFwPaneLayoutItem, {
					id: keyName,
					key: this.props.id + '_' + keyName,
					ref: keyName,
					item: itemIndex,
					type: data.items[itemIndex].type,
					view: this.props.view,
					index: index,
					parent: this,
					editor: this.editor
				}));
				if (this.editor.item_just_added == itemIndex) {
					this.editor.selectItem(keyName);
				}
			}
		});
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				'data-index': this.props.index,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			React.createElement(
				'div',
				{
					className: 'droppable accept-item',
					onDragOver: this.dragOver,
					onDrop: this.drop
				},
				items
			),
			React.createElement(
				'ul',
				{ className: 'manipulation-actions margin-0 col-action' },
				React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{
							href: '#',
							className: 'draggable',
							draggable: 'true',
							onDragStart: this.dragStart,
							onDragEnd: this.dragEnd
						},
						React.createElement('i', { className: 'fa fa-ellipsis-v' })
					)
				)
			),
			React.createElement('div', { className: 'resizable-handle' })
		);
	}
});
window.SunFwPaneLayoutItem = React.extendClass('SunFwPaneLayoutMixinItem', {
	mixins: [SunFwPaneMixinDraggable],
	getDefaultProps: function () {
		return {
			id: '',
			view: '',
			type: 'item',
			item: '',
			index: 0
		};
	},
	render: function () {
		var data = this.editor.getData(),
		    item = data.items[this.props.item],
		    settings = this.editor.getItemSettings(this),
		    className = 'jsn-item layout-builder-item draggable-item bg-primary ' + this.props.type;
		if (settings.disabled) {
			className += ' disabled-item';
		}
		if (!this.rendered) {
			className += ' initial';
		}
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				'data-index': this.props.index,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			React.createElement(
				'div',
				{ className: 'item-name' },
				React.createElement('i', {
					className: 'fa fa-ellipsis-v draggable',
					draggable: 'true',
					onDragStart: this.dragStart,
					onDragEnd: this.dragEnd
				}),
				React.createElement(
					'span',
					null,
					settings.name
				)
			)
		);
	}
});
window.SunFwPaneLayoutOffcanvas = React.extendClass('SunFwPaneLayoutMixinItem', {
	mixins: [SunFwPaneMixinDroppable, SunFwPaneLayoutMixinDroppable],
	getDefaultProps: function () {
		return {
			id: '',
			view: '',
			type: 'offcanvas',
			label: ''
		};
	},
	render: function () {
		var data = this.editor.getData(),
		    className = 'offcanvas offcanvas-workspace jsn-content-' + this.props.view,
		    rows = [],
		    keyName;
		if (this.props.disabled) {
			className += ' disabled-item';
		}
		if (data.views[this.props.view] && data.views[this.props.view].rows) {
			data.views[this.props.view].rows.map((rowIndex, index) => {
				if (data.rows[rowIndex]) {
					keyName = 'row_' + rowIndex;
					rows.push(React.createElement(SunFwPaneLayoutRow, {
						id: keyName,
						key: this.props.id + '_' + keyName,
						ref: keyName,
						row: rowIndex,
						view: this.props.view,
						index: index,
						parent: this,
						editor: this.editor
					}));
					if (this.editor.row_just_added == rowIndex) {
						this.editor.selectItem(keyName);
						delete this.editor.row_just_added;
					}
				}
			});
		}
		if (!rows.length) {
			className += ' empty-workspace';
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
				{ className: 'jsn-panel' },
				React.createElement(
					'div',
					{ className: 'jsn-panel-heading clearfix text-center' },
					React.createElement(
						'div',
						{ className: 'pull-left' },
						this.props.label
					)
				),
				React.createElement(
					'div',
					{
						className: 'jsn-panel-body droppable accept-row accept-column accept-item',
						onDragOver: this.dragOver,
						onDrop: this.drop
					},
					rows.length ? rows : SunFwString.parse('empty-layout-message')
				)
			)
		);
	}
});
window.SunFwPaneLayoutRow = React.extendClass('SunFwPaneLayoutMixinItem', {
	mixins: [SunFwPaneMixinDraggable, SunFwPaneMixinDroppable, SunFwPaneLayoutMixinDroppable],
	getDefaultProps: function () {
		return {
			id: '',
			row: '',
			view: '',
			type: 'row',
			index: 0
		};
	},
	render: function () {
		var data = this.editor.getData(),
		    row = data.rows[this.props.row],
		    settings = this.editor.getItemSettings(this),
		    className = 'layout-builder-item draggable-item row row-layout',
		    columns = [],
		    keyName;
		if (settings.disabled) {
			className += ' disabled-item';
		}
		if (!this.rendered) {
			className += ' initial';
		}
		row.columns.map((columnIndex, index) => {
			if (data.columns[columnIndex]) {
				keyName = 'column_' + columnIndex;
				columns.push(React.createElement(SunFwPaneLayoutColumn, {
					id: keyName,
					key: this.props.id + '_' + keyName,
					ref: keyName,
					view: this.props.view,
					index: index,
					column: columnIndex,
					parent: this,
					editor: this.editor
				}));
				if (this.editor.column_just_added == columnIndex) {
					this.editor.selectItem(keyName);
					delete this.editor.column_just_added;
				}
			}
		});
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				'data-index': this.props.index,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			React.createElement(
				'div',
				{
					className: 'jsn-panel-body droppable clearfix accept-column accept-item',
					onDragOver: this.dragOver,
					onDrop: this.drop
				},
				columns
			),
			React.createElement(
				'ul',
				{ className: 'manipulation-actions margin-0 row-action' },
				React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{
							href: '#',
							className: 'draggable',
							draggable: 'true',
							onDragStart: this.dragStart,
							onDragEnd: this.dragEnd
						},
						React.createElement('i', { className: 'fa fa-ellipsis-v' })
					)
				)
			)
		);
	},
	initActions: function () {
		SunFw.parent();
		var data = this.editor.getData(),
		    row = data.rows[this.props.row],
		    grid = this.editor.config.grid,
		    cellWidth = 100 / grid;
		row.columns.map((column, index) => {
			var columnRef = this.editor.refs['column_' + column];
			if (columnRef && columnRef.refs && columnRef.refs.wrapper) {
				interact(columnRef.refs.wrapper).resizable({
					preserveAspectRatio: false,
					edges: {
						top: false,
						right: index < row.columns.length - 1,
						bottom: false,
						left: false
					}
				}).on('resizemove', function (event) {
					this.editor.resizing || (this.editor.resizing = true);
					function getPrevSpace(screen, columns, columnsInRow, from) {
						var total = 0;
						for (var i = from; i >= 0; i--) {
							total += columns[columnsInRow[i]].width[screen];
						}
						return total;
					}
					function getNextSpace(screen, columns, columnsInRow, from) {
						var total = 0;
						for (var i = from; i < columnsInRow.length; i++) {
							total += columns[columnsInRow[i]].width[screen];
						}
						return total;
					}
					this.timeout && clearTimeout(this.timeout);
					this.timeout = setTimeout(function () {
						var screen = this.editor.current.screen;
						var data = this.editor.getData(),
						    columns = data.columns,
						    parent = event.target.parentNode.parentNode,
						    newWidth = event.rect.width / parent.offsetWidth * 100,
						    oldWidth = columns[column].width[screen],
						    nextOldWidth = columns[row.columns[index + 1]].width[screen],
						    nextWidth,
						    siblingWidth,
						    total;
						newWidth = Math.round(newWidth / cellWidth);
						nextWidth = oldWidth + nextOldWidth - newWidth;
						if (newWidth < 1) {
							if (index == 0) {
								newWidth = grid;
								nextWidth = oldWidth + nextOldWidth;
							}
							else {
									total = getPrevSpace(screen, columns, row.columns, index - 1);
									if (total % grid) {
										newWidth = oldWidth + total % grid;
										nextWidth = nextOldWidth;
										siblingWidth = columns[row.columns[index - 1]].width[screen];
										columns[row.columns[index - 1]].width[screen] = siblingWidth + grid * Math.ceil(total / grid) - total;
									}
									else {
											newWidth = grid;
											nextWidth = oldWidth + nextOldWidth;
										}
								}
						}
						else if (newWidth < oldWidth) {
								total = getNextSpace(screen, columns, row.columns, index + 1);
								if (total >= grid) {
									total = getPrevSpace(screen, columns, row.columns, index - 1) + newWidth;
									nextWidth = grid * Math.ceil(total / grid) - total;
									if (index + 1 < row.columns.length - 1) {
										total = getNextSpace(screen, columns, row.columns, index + 2);
										columns[row.columns[index + 2]].width[screen] = columns[row.columns[index + 2]].width[screen] + grid * Math.ceil(total / grid) - total;
									}
								}
							}
							else if (nextWidth < 1) {
									if (index + 1 == row.columns.length - 1) {
										nextWidth = grid;
										newWidth = oldWidth + nextOldWidth;
									}
									else {
											total = getNextSpace(screen, columns, row.columns, index + 2);
											if (total % grid) {
												nextWidth = nextOldWidth + total % grid;
												newWidth = oldWidth;
												siblingWidth = columns[row.columns[index + 2]].width[screen];
												columns[row.columns[index + 2]].width[screen] = siblingWidth + grid * Math.ceil(total / grid) - total;
											}
											else {
													nextWidth = grid;
													newWidth = oldWidth + nextOldWidth;
												}
										}
								}
						if (newWidth < oldWidth && screen == 'xs') {
							var numCol = 0;
							for (var i = 0; i < index; i++) {
								if (columns[row.columns[i]].width[screen] < grid) {
									numCol++;
								}
							}
							if (numCol % 2 > 0) {
								return alert(SunFwString.parse('mobile-screen-can-have-only-2-columns-per-row'));
							}
						}
						if (newWidth < 1 || nextWidth < 1 || newWidth > grid || nextWidth > grid) {
							return;
						}
						columns[column].width[screen] = newWidth;
						columns[row.columns[index + 1]].width[screen] = nextWidth;
						this.editor.setData(data);
						this.forceUpdate();
					}.bind(this), 10);
				}.bind(this));
			}
		});
	}
});
window.SunFwPaneLayoutSection = React.extendClass('SunFwPaneLayoutMixinItem', {
	mixins: [SunFwPaneMixinDraggable, SunFwPaneMixinDroppable, SunFwPaneLayoutMixinDroppable],
	getDefaultProps: function () {
		return {
			id: '',
			view: '',
			type: 'section',
			index: 0,
			section: ''
		};
	},
	render: function () {
		var data = this.editor.getData(),
		    section = data.sections[this.props.section],
		    settings = this.editor.getItemSettings(this),
		    className = 'jsn-panel layout-builder-item draggable-item layout-builder-section',
		    rows = [],
		    keyName;
		if (settings.disabled) {
			className += ' disabled-item';
		}
		if (!this.rendered) {
			className += ' initial';
		}
		section.rows.map((rowIndex, index) => {
			if (data.rows[rowIndex]) {
				keyName = 'row_' + rowIndex;
				rows.push(React.createElement(SunFwPaneLayoutRow, {
					id: keyName,
					key: this.props.id + '_' + keyName,
					ref: keyName,
					row: rowIndex,
					view: this.props.view,
					index: index,
					parent: this,
					editor: this.editor
				}));
				if (this.editor.row_just_added == rowIndex) {
					this.editor.selectItem(keyName);
					delete this.editor.row_just_added;
				}
			}
		});
		var sticky;
		if (settings.enable_sticky) {
			sticky = React.createElement('i', { className: 'fa fa-thumb-tack', style: { color: 'orange', 'margin-left': '6px' } });
		}
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				onClick: this.editItem,
				className: className,
				'data-index': this.props.index,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			React.createElement(
				'div',
				{ className: 'jsn-panel-heading text-center clearfix' },
				React.createElement(
					'div',
					{ className: 'pull-left' },
					React.createElement('i', {
						className: 'fa fa-ellipsis-v draggable',
						draggable: 'true',
						onDragStart: this.dragStart,
						onDragEnd: this.dragEnd
					}),
					React.createElement(
						'span',
						null,
						settings.name
					),
					sticky
				)
			),
			React.createElement(
				'div',
				{
					className: 'jsn-panel-body droppable accept-row accept-column accept-item',
					onDragOver: this.dragOver,
					onDrop: this.drop
				},
				rows
			)
		);
	}
});
window.SunFwPaneLayoutActions = React.extendClass('SunFwPaneMixinAction', {
	render: function () {
		return React.createElement(
			"div",
			{ className: "layout-builder-actions" },
			React.createElement(
				"button",
				{
					type: "button",
					onClick: this.select,
					className: "btn btn-default margin-right-10"
				},
				React.createElement("i", { className: "fa fa-columns font-size-14 margin-right-5" }),
				SunFwString.parse('load-prebuilt-layout')
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
					SunFwString.parse('save-layout')
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
							SunFwString.parse('save-prebuilt-layout')
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
				'class': 'load-prebuilt-layout',
				rows: [{
					cols: [{
						'class': 'col-xs-12',
						controls: {
							layout: {
								type: 'select-layout',
								label: ''
							}
						}
					}]
				}]
			},
			values: { 'layout': this.editor.getData().appliedLayout }
		};
		SunFwModal.get({
			id: 'load_layout_modal',
			title: 'load-prebuilt-layout',
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
				'class': 'save-prebuilt-layout',
				rows: [{
					cols: [{
						'class': 'col-xs-12',
						controls: {
							'name': {
								type: 'select-layout',
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
			id: 'load_layout_modal',
			title: 'save-prebuilt-layout',
			type: 'form',
			content: data,
			'class': 'fixed'
		});
	},
	saveSettings: function (settings) {
		if (settings.name && settings.name != '') {
			this.editor.save(true, settings.name);
		}
		else if (settings.layout && settings.layout != '') {
				var data = this.editor.config.prebuilds[settings.layout].settings;
				data.appliedLayout = settings.layout;
				for (var k in this.editor.config.offcanvas) {
					if (data.views[k] && data.views[k].sections) {
						var rows = [];
						data.views[k].sections.map(sectionIndex => {
							if (data.sections[sectionIndex]) {
								data.sections[sectionIndex].rows.map(rowIndex => {
									if (data.rows[rowIndex]) {
										rows.push(rowIndex);
									}
								});
								delete data.sections[sectionIndex];
							}
						});
						data.views[k].rows = rows;
						delete data.views[k].sections;
					} else {
						data.views[k].rows = [];
					}
				}
				if (data.columns) {
					for (var p in data.columns) {
						if (!data.columns[p].width) {
							data.columns[p].width = { lg: this.editor.config.grid };
						} else if (!isNaN(parseInt(data.columns[p].width))) {
							data.columns[p].width = { lg: parseInt(data.columns[p].width) };
						} else if (!isNaN(parseInt(data.columns[p].width.lg))) {
							data.columns[p].width.lg = parseInt(data.columns[p].width.lg);
						}
						if (!isNaN(parseInt(data.columns[p].width.md))) {
							data.columns[p].width.md = parseInt(data.columns[p].width.md);
						} else {
							data.columns[p].width.md = data.columns[p].width.lg;
						}
						if (!isNaN(parseInt(data.columns[p].width.sm))) {
							data.columns[p].width.sm = parseInt(data.columns[p].width.sm);
						} else {
							data.columns[p].width.sm = data.columns[p].width.lg;
						}
						if (!isNaN(parseInt(data.columns[p].width.xs))) {
							data.columns[p].width.xs = parseInt(data.columns[p].width.xs);
						} else {
							data.columns[p].width.xs = this.editor.config.grid;
						}
					}
				}
				this.editor.setData(data);
				this.editor.forceUpdate();
			}
	}
});
window.SunFwPaneLayout = React.extendClass('SunFwPaneMixinEditor', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getPaneLayout
		};
	},
	getInitialState: function () {
		this.current = {
			screen: 'lg',
			editing: ''
		};
		return {
			changed: false
		};
	},
	getDefaultData: function () {
		return {
			appliedLayout: '',
			settings: {
				enable_responsive: 1
			},
			sections: {},
			rows: {},
			columns: {},
			items: {},
			views: {
				main: {
					sections: []
				},
				top: {
					rows: []
				},
				right: {
					rows: []
				},
				bottom: {
					rows: []
				},
				left: {
					rows: []
				}
			}
		};
	},
	render: function () {
		if (this.config === undefined) {
			return null;
		}
		var data = this.getData(),
		    offcanvasAnchors = [],
		    offcanvasContainers = [],
		    keyName;
		for (var k in this.config.offcanvas) {
			keyName = 'offcanvas_' + k;
			offcanvasAnchors.push(React.createElement(
				'div',
				{ onClick: this.openCanvas.bind(this, k), className: k },
				React.createElement('a', { href: '#' }),
				' ',
				React.createElement('i', { className: 'fa fa-angle-down' })
			));
			offcanvasContainers.push(React.createElement(SunFwPaneLayoutOffcanvas, {
				id: keyName,
				key: this.props.id + '_' + keyName,
				ref: keyName,
				view: k,
				label: this.config.offcanvas[k].label,
				parent: this,
				editor: this
			}));
		}
		var boxedLayout = data.settings.enable_boxed_layout,
		    className = 'layout-builder';
		if (boxedLayout && parseInt(boxedLayout)) {
			className += ' boxed-layout';
		}
		return React.createElement(
			'div',
			{
				key: this.props.id,
				ref: 'wrapper',
				className: className,
				onDragOver: this.dragOver
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
							SunFwString.parse('layout-builder')
						)
					),
					React.createElement(
						'div',
						{ className: 'col-xs-3 col-sm-4' },
						React.createElement(SunFwPaneLayoutScreens, {
							key: this.props.id + '_screens',
							ref: 'screens',
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
						React.createElement(SunFwPaneLayoutActions, {
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
							{ className: 'col-xs-1 parent-sidebar border-right padding-top-15 padding-bottom-15 items-list' },
							React.createElement(
								'div',
								{ className: 'jsn-sidebar icon-panel' },
								React.createElement(SunFwPaneItems, {
									key: this.props.id + '_items',
									ref: 'items',
									parent: this,
									editor: this
								})
							)
						),
						React.createElement(
							'div',
							{ className: 'col-xs-8 padding-top-15 padding-bottom-15 workspace-container' },
							React.createElement(
								'div',
								{ className: 'jsn-layout-content' },
								React.createElement(
									'div',
									{ ref: 'canvas', className: 'canvas' },
									offcanvasAnchors
								),
								React.createElement(
									'div',
									{ ref: 'canvasInner', className: 'jsn-content-inner' },
									offcanvasContainers,
									React.createElement(
										'div',
										{
											onClick: this.selectItem,
											className: 'jsn-content-main'
										},
										React.createElement(SunFwPaneLayoutWorkspace, {
											key: this.props.id + '_main_workspace',
											ref: 'main_workspace',
											view: 'main',
											parent: this,
											editor: this
										})
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'col-xs-3 parent-sidebar border-left padding-bottom-15 layout-settings' },
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
			),
			React.createElement('div', { ref: 'marker', className: 'droppable-marker' })
		);
	},
	preloadAssets: function () {
		for (var layout in this.config.prebuilds) {
			if (typeof this.config.prebuilds[layout].settings == 'string') {
				(function (l) {
					SunFwAjax.request(this.config.prebuilds[l].settings, function (req) {
						this.config.prebuilds[l].settings = req.responseJSON;
					}.bind(this));
				}).bind(this)(layout);
			}
		}
	},
	openCanvas: function (position) {
		this.refs.canvas.classList.toggle('open-' + position);
		this.refs.canvasInner.classList.toggle('open-' + position);
		if (this.refs.canvas.classList.contains('open-' + position)) {
			this.selectItem('offcanvas_' + position);
		} else {
			this.selectItem();
		}
	},
	handleSelectItem: function (name) {
		var data = this.getData(),
		    editing = typeof name == 'string' ? name : '',
		    ref = this.refs[editing];
		if (!ref) {
			editing = '';
		} else {
			var type = ref.getItemType(),
			    items = data[type + 's'],
			    itemIndex = ref.props[type];
			if (items && itemIndex && !items[itemIndex]) {
				delete this.refs[editing];
				editing = '';
			} else {
				var type = ref.props.type;
				if (type == 'offcanvas') {
					type = 'offcanvas-' + (['top', 'bottom'].indexOf(ref.props.view) ? 'horizontal' : 'vertical');
				}
				this.showSettings(ref, type, this.getItemSettings(ref), ref.props.type != 'offcanvas');
			}
		}
		if (editing == '') {
			this.showSettings(this, 'page', this.getData().settings, false);
		}
		if (this.current.editing == '') {
			this.refs.main_workspace.refs.wrapper.classList.remove('editing');
		} else if (this.refs[this.current.editing]) {
			if (this.refs[this.current.editing].refs.wrapper) {
				this.refs[this.current.editing].refs.wrapper.classList.remove('editing');
			}
		}
		this.current.editing = editing;
		if (this.current.editing == '') {
			this.refs.main_workspace.refs.wrapper.classList.add('editing');
		} else if (this.refs[this.current.editing]) {
			if (this.refs[this.current.editing].refs.wrapper) {
				this.refs[this.current.editing].refs.wrapper.classList.add('editing');
			}
		}
		if (!this.item_just_added || data.items[this.item_just_added].type != 'menu') {
			this.refs.activity.forceUpdate();
		}
		delete this.item_just_added;
	},
	getItemForm: function (ref) {
		var type = ref.props.type;
		if (type == 'offcanvas') {
			type = 'offcanvas-' + (['top', 'bottom'].indexOf(ref.props.view) ? 'horizontal' : 'vertical');
		}
		var form = JSON.parse(JSON.stringify((this.config.items[type] || this.config).settings));
		form.title = form.title || this.getItemSettings(ref).name;
		var pathway,
		    parent = ref.parent;
		if (ref.props.type && ref.props.type != 'offcanvas') {
			while (parent) {
				if (ref.props.view != 'main' && this == parent) {
					break;
				}
				if (parent.parent) {
					var parent_name = SunFwString.parse('layout-page');
					if (parent.props.type) {
						if (parent.props.type == 'offcanvas') {
							parent_name = parent.props.label;
						} else if (parent.props.type == 'section') {
							parent_name = SunFwString.parse('layout-section').replace('%SECTION%', this.getItemSettings(parent).name);
						} else {
							parent_name = SunFwString.parse('item-' + parent.props.type);
						}
					}
					pathway = React.createElement(
						'li',
						null,
						React.createElement(
							'a',
							{ onClick: this.selectItem.bind(this, parent.props.id) },
							parent_name
						),
						React.createElement(
							'ul',
							null,
							pathway
						)
					);
				}
				parent = parent.parent;
			}
			if (pathway) {
				form.title = React.createElement(
					'div',
					{ className: 'pull-left' },
					React.createElement(
						'div',
						{ className: 'display-inline dropdown pathway' },
						React.createElement(
							'button',
							{
								type: 'button',
								className: 'btn btn-default dropdown-toggle',
								'data-toggle': 'dropdown'
							},
							'...'
						),
						React.createElement(
							'ul',
							{ className: 'dropdown-menu' },
							pathway
						)
					),
					React.createElement(
						'span',
						{ className: 'form-title' },
						SunFwString.parse(form.title)
					)
				);
			}
		}
		if (typeof form.title == 'string') {
			form.title = React.createElement(
				'span',
				{ className: 'form-title' },
				SunFwString.parse(form.title)
			);
		}
		return form;
	},
	saveSettings: function (settings) {
		var data = this.getData(),
		    updateScreens = false,
		    updateStyles = false;
		for (var p in settings) {
			if (p == 'enable_responsive' && data.settings[p] != settings[p]) {
				updateScreens = true;
			}
			if (p == 'enable_boxed_layout' && data.settings[p] != settings[p]) {
				updateStyles = true;
			}
			data.settings[p] = settings[p];
		}
		this.setData(data);
		if (updateScreens) {
			this.refs.screens.forceUpdate();
		}
		if (updateStyles) {
			this.props.doc.refs.body.refs.styles.forceUpdate();
		}
	},
	handleGetItemSettings: function (that) {
		var data = this.getData(),
		    view = data.views[that.props.view],
		    sections = data.sections,
		    rows = data.rows,
		    columns = data.columns,
		    items = data.items,
		    section,
		    row,
		    column,
		    item;
		switch (that.props.type) {
			case 'offcanvas':
				item = view;
				break;
			case 'section':
				item = sections[view.sections[that.props.index]];
				break;
			case 'row':
				if (that.props.view == 'main') {
					section = sections[view.sections[that.parent.props.index]];
					item = rows[section.rows[that.props.index]];
				} else {
					item = rows[view.rows[that.props.index]];
				}
				break;
			case 'column':
				if (that.props.view == 'main') {
					section = sections[view.sections[that.parent.parent.props.index]];
					row = rows[section.rows[that.parent.props.index]];
					item = columns[row.columns[that.props.index]];
				} else {
					row = rows[view.rows[that.parent.props.index]];
					item = columns[row.columns[that.props.index]];
				}
				break;
			default:
				if (that.props.view == 'main') {
					section = sections[view.sections[that.parent.parent.parent.props.index]];
					row = rows[section.rows[that.parent.parent.props.index]];
					column = columns[row.columns[that.parent.props.index]];
					item = items[column.items[that.props.index]];
				} else {
					row = rows[view.rows[that.parent.parent.props.index]];
					column = columns[row.columns[that.parent.props.index]];
					item = items[column.items[that.props.index]];
				}
				break;
		}
		var settings = !item || !item.settings ? {} : item.settings;
		if (item.label && settings.name === undefined) {
			settings.name = item.label;
		}
		if (settings.identification_code === undefined) {
			settings.identification_code = SunFwString.toId('item', true);
		}
		return settings;
	},
	handleSaveItemSettings: function (that, values) {
		var data = this.getData(),
		    view = data.views[that.props.view],
		    sections = data.sections,
		    rows = data.rows,
		    columns = data.columns,
		    items = data.items,
		    section,
		    row,
		    column,
		    item,
		    type,
		    id;
		type = that.getItemType ? that.getItemType() : that.props.type ? that.props.type : 'item';
		if (values.name) {
			id = type + '_' + SunFwString.toId(values.name);
			for (var ref in this.refs) {
				if (ref.indexOf(type + '_') == 0 && this.refs[ref].props.id != that.props.id) {
					item = this.refs[ref].props[type];
					if (data[type + 's'][item] && data[type + 's'][item].id == id) {
						id += '_' + new Date().getTime();
						break;
					}
				}
			}
		}
		switch (type) {
			case 'offcanvas':
				item = view;
				break;
			case 'section':
				item = sections[view.sections[that.props.index]];
				if (id) {
					sections[view.sections[that.props.index]].label = values.name;
					if (item.id != id) {
						that.changeSectionIDForTemplate(item.id, id);
						if (window.SunFwStyle) {
							SunFwStyle.changeSectionID(item.id, id);
						}
					}
				}
				if (values.enable_sticky && parseInt(values.enable_sticky)) {
					for (var s in sections) {
						if (sections[s] && sections[s].id != item.id) {
							if (sections[s].settings && sections[s].settings.enable_sticky) {
								sections[s].settings.enable_sticky = 0;
								this.refs['section_' + s].forceUpdate();
								break;
							}
						}
					}
				}
				break;
			case 'row':
				if (that.props.view == 'main') {
					section = sections[view.sections[that.parent.props.index]];
					item = rows[section.rows[that.props.index]];
				} else {
					item = rows[view.rows[that.props.index]];
				}
				break;
			case 'column':
				if (that.props.view == 'main') {
					section = sections[view.sections[that.parent.parent.props.index]];
					row = rows[section.rows[that.parent.props.index]];
					item = columns[row.columns[that.props.index]];
				} else {
					row = rows[view.rows[that.parent.props.index]];
					item = columns[row.columns[that.props.index]];
				}
				break;
			default:
				if (that.props.view == 'main') {
					section = sections[view.sections[that.parent.parent.parent.props.index]];
					row = rows[section.rows[that.parent.parent.props.index]];
					column = columns[row.columns[that.parent.props.index]];
					item = items[column.items[that.props.index]];
				} else {
					row = rows[view.rows[that.parent.parent.props.index]];
					column = columns[row.columns[that.parent.props.index]];
					item = items[column.items[that.props.index]];
				}
				if (window.SunFwStyle && item.type == 'menu' && id && item.id != id) {
					SunFwStyle.changeMenuID(item.id, id);
				}
				break;
		}
		item.settings = values;
		if (id) {
			item.id = id;
		}
		this.setData(data);
		that.forceUpdate();
	},
	setColWidth: function (column, width) {
		if (typeof column.width != 'object') {
			column.width = {};
		}
		width = parseInt(width);
		for (var screen in this.config.screens) {
			if (screen != 'xs') {
				column.width[screen] = width;
			} else {
				column.width[screen] = this.config.grid;
			}
		}
		return column;
	},
	calcColumnWidth: function (columnsDataArray, columnsInRow) {
		if (this.config.grid % columnsInRow.length == 0) {
			columnsInRow.map(columnIndex => {
				columnsDataArray[columnIndex] = this.setColWidth(columnsDataArray[columnIndex], this.config.grid / columnsInRow.length);
			});
		}
		else {
				var newWidth = Math.floor(this.config.grid / columnsInRow.length);
				columnsInRow.map(columnIndex => {
					columnsDataArray[columnIndex] = this.setColWidth(columnsDataArray[columnIndex], newWidth);
				});
				if (this.config.grid % columnsInRow.length > 0) {
					for (var i = 1, n = this.config.grid % columnsInRow.length; i <= n; i++) {
						columnsDataArray[columnsInRow[columnsInRow.length - i]] = this.setColWidth(columnsDataArray[columnsInRow[columnsInRow.length - i]], newWidth + 1);
					}
				}
			}
		return columnsDataArray;
	},
	handleSave: function (prebuild, name, callback) {
		var server = this.props.url;
		if (prebuild === true) {
			server += '&action=saveAs&layout_name=' + name;
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
			if (response.type == 'success' && prebuild === true) {
				this.config.prebuilds[response.data.name] = {
					label: name,
					settings: data
				};
			}
			callback(response);
		}.bind(this), { data: JSON.stringify(data) });
	}
});
window.SunFwPaneLayoutPreview = React.extendClass('SunFwPaneMixinBase', {
	getDefaultProps: function () {
		return {
			id: '',
			height: 210
		};
	},
	getInitialState: function () {
		return {
			views: {
				main: {
					sections: []
				}
			},
			sections: [],
			rows: [],
			columns: []
		};
	},
	render: function () {
		this.num_row = 0;
		return React.createElement(
			'div',
			{ ref: 'wrapper', className: 'preview-layout', style: {
					height: this.props.height + 'px',
					'overflow-y': 'auto'
				} },
			this.state.views.main.sections.map(sectionIndex => {
				if (this.state.sections[sectionIndex]) {
					return React.createElement(
						'div',
						{ className: 'container-fluid' },
						this.state.sections[sectionIndex].rows.map(rowIndex => {
							if (this.state.rows[rowIndex]) {
								this.num_row++;
								return React.createElement(
									'div',
									{ className: 'row' },
									this.state.rows[rowIndex].columns.map(columnIndex => {
										if (this.state.columns[columnIndex]) {
											if (!this.state.columns[columnIndex].width || typeof this.state.columns[columnIndex].width == 'string') {
												this.state.columns[columnIndex].width = {
													lg: !this.state.columns[columnIndex].width ? this.editor.config.grid : parseInt(this.state.columns[columnIndex].width)
												};
											}
											var className = 'col-xs-' + this.state.columns[columnIndex].width.lg;
											return React.createElement(
												'div',
												{ className: className },
												React.createElement('div', { className: 'preview-column' })
											);
										}
									})
								);
							}
						})
					);
				}
			})
		);
	},
	initActions: function () {
		if (this.refs.wrapper && this.num_row) {
			var preview_css = window.getComputedStyle(this.refs.wrapper),
			    preview_height = this.props.height - parseInt(preview_css.getPropertyValue('border-top-width')) - parseInt(preview_css.getPropertyValue('border-bottom-width')) - parseInt(preview_css.getPropertyValue('padding-top')) - parseInt(preview_css.getPropertyValue('padding-bottom')),
			    row_height = this.refs.wrapper.querySelector('.row').getBoundingClientRect().height;
			if (row_height * this.num_row > preview_height) {
				row_height = preview_height / this.num_row;
				var columns = this.refs.wrapper.querySelectorAll('.preview-column');
				for (var i = 0, n = columns.length; i < n; i++) {
					var row_css = window.getComputedStyle(columns[i].parentNode);
					columns[i].style.height = row_height - parseInt(row_css.getPropertyValue('padding-top')) - parseInt(row_css.getPropertyValue('padding-bottom')) + 'px';
				}
			}
		}
	}
});
window.SunFwPaneLayoutScreens = React.extendClass('SunFwPaneMixinBase', {
	render: function () {
		var screens = [],
		    className;
		for (var screen in this.editor.config.screens) {
			var keyName = 'screen_' + screen,
			    icon;
			className = 'btn btn-default sunfw_popover';
			if (this.editor.current.screen == screen) {
				className += ' active';
			}
			if (screen == 'lg') {
				icon = React.createElement('i', { className: 'fa fa-desktop' });
			} else if (screen == 'md') {
				icon = React.createElement('i', { className: 'fa fa-laptop' });
			} else if (screen == 'sm') {
				icon = React.createElement('i', { className: 'fa fa-tablet' });
			} else if (screen == 'xs') {
				icon = React.createElement('i', { className: 'fa fa-mobile' });
			}
			screens.push(React.createElement(
				'button',
				{
					id: keyName,
					key: this.editor.props.id + '_' + keyName,
					ref: keyName,
					type: 'button',
					onClick: this.changeScreen.bind(this, screen),
					className: className,
					role: 'button',
					'data-content': this.editor.config.screens[screen]
				},
				icon,
				this.editor.config.screens[screen]
			));
		}
		className = 'sunfw-device btn-group';
		var data = this.editor.getData(),
		    enabled = parseInt(data.settings.enable_responsive === undefined ? 1 : data.settings.enable_responsive);
		if (!enabled) {
			className += ' hidden';
		}
		return React.createElement(
			'div',
			{ className: className, role: 'group' },
			screens
		);
	},
	componentDidMount: function () {
		SunFw.parent();
		jQuery('.sunfw_popover').popover({
			trigger: 'hover',
			placement: 'top',
			template: '<div class="popover sunfw-device" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
			container: 'body'
		});
	},
	initActions: function () {
		document.body.className = document.body.className.replace(/ screen-(lg|md|sm|xs)/g, '');
		document.body.classList.add('screen-' + this.editor.current.screen);
	},
	componentWillUnmount: function () {
		jQuery('.sunfw_popover').popover('destroy');
	},
	changeScreen: function (screen) {
		if (this.editor.current.screen == screen) {
			return;
		}
		this.editor.current.screen = screen;
		this.forceUpdate();
		this.editor.refs.main_workspace.forceUpdate();
		this.editor.selectItem(this.editor.current.editing);
	}
});
window.SunFwPaneLayoutWorkspace = React.extendClass('SunFwPaneLayoutMixinItem', {
	mixins: [SunFwPaneMixinDroppable, SunFwPaneLayoutMixinDroppable],
	getDefaultProps: function () {
		return {
			view: ''
		};
	},
	render: function () {
		var data = this.editor.getData(),
		    className = 'layout-builder-workspace main-workspace droppable accept-section accept-row accept-column accept-item',
		    sections = [],
		    keyName;
		data.views[this.props.view].sections.map((sectionIndex, index) => {
			if (data.sections[sectionIndex]) {
				keyName = 'section_' + sectionIndex;
				sections.push(React.createElement(SunFwPaneLayoutSection, {
					id: keyName,
					key: this.props.id + '_' + keyName,
					ref: keyName,
					view: this.props.view,
					index: index,
					parent: this,
					editor: this.editor,
					section: sectionIndex
				}));
				if (this.editor.section_just_added == sectionIndex) {
					this.editor.selectItem(keyName);
					delete this.editor.section_just_added;
				}
			}
		});
		if (!sections.length) {
			className += ' empty-workspace';
		}
		return React.createElement(
			'div',
			{
				ref: 'wrapper',
				className: className,
				onDragOver: this.dragOver,
				onDrop: this.drop,
				onMouseOver: this.mouseover,
				onMouseOut: this.mouseout
			},
			sections.length ? sections : SunFwString.parse('empty-layout-message')
		);
	}
});
