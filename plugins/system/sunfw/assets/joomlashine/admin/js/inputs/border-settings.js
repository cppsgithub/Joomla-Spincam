window.SunFwInputBorderSettings = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value || {
				universal: '1',
				width: '',
				style: '',
				color: '',
				'top-width': '',
				'top-style': '',
				'top-color': '',
				'right-width': '',
				'right-style': '',
				'right-color': '',
				'bottom-width': '',
				'bottom-style': '',
				'bottom-color': '',
				'left-width': '',
				'left-style': '',
				'left-color': ''
			}
		};
	},
	render: function () {
		if (typeof this.state.value != 'object' || this.state.value instanceof Array) {
			this.state.value = {
				universal: '1'
			};
		}
		if (!this.openingModal) {
			this.value = (this.state.value.width ? this.state.value.width + 'px' : '-') + ' ' + (this.state.value.style ? this.state.value.style : '-') + ' ' + (this.state.value.color ? this.state.value.color : '-');
		}
		return this.renderPopupInput();
	},
	popupData: function () {
		var popup = {
			rows: [{
				'class': 'separator-after',
				cols: [{
					'class': 'col-xs-12',
					controls: {
						universal: {
							type: 'radio',
							inline: true,
							options: [{
								label: 'universal-settings',
								value: 1
							}, {
								label: 'individual-settings',
								value: 0
							}]
						}
					}
				}]
			}, {
				cols: [{
					'class': 'col-xs-4',
					controls: {
						width: {
							type: 'number',
							label: 'border-width',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-4',
					controls: {
						style: {
							type: 'select',
							chosen: false,
							label: 'border-style',
							options: [{ label: 'initial', value: 'initial' }, { label: 'none', value: 'none' }, { label: 'hidden', value: 'hidden' }, { label: 'dotted', value: 'dotted' }, { label: 'dashed', value: 'dashed' }, { label: 'solid', value: 'solid' }, { label: 'double', value: 'double' }, { label: 'groove', value: 'groove' }, { label: 'ridge', value: 'ridge' }, { label: 'inset', value: 'inset' }, { label: 'outset', value: 'outset' }, { label: 'inherit', value: 'inherit' }]
						}
					}
				}, {
					'class': 'col-xs-4',
					controls: {
						color: {
							type: 'color-picker',
							label: 'border-color'
						}
					}
				}],
				requires: {
					universal: 1
				}
			}]
		};
		['top', 'right', 'bottom', 'left'].map(pos => {
			var width = {},
			    style = {},
			    color = {};
			width[pos + '-width'] = {
				type: 'number',
				label: 'border-width',
				suffix: 'px'
			};
			style[pos + '-style'] = {
				type: 'select',
				chosen: false,
				label: 'border-style',
				options: [{ label: 'initial', value: 'initial' }, { label: 'none', value: 'none' }, { label: 'hidden', value: 'hidden' }, { label: 'dotted', value: 'dotted' }, { label: 'dashed', value: 'dashed' }, { label: 'solid', value: 'solid' }, { label: 'double', value: 'double' }, { label: 'groove', value: 'groove' }, { label: 'ridge', value: 'ridge' }, { label: 'inset', value: 'inset' }, { label: 'outset', value: 'outset' }, { label: 'inherit', value: 'inherit' }]
			};
			color[pos + '-color'] = {
				type: 'color-picker',
				label: 'border-color'
			};
			popup.rows.push({
				title: 'border-' + pos,
				cols: [{
					'class': 'col-xs-4',
					controls: width
				}, {
					'class': 'col-xs-4',
					controls: style
				}, {
					'class': 'col-xs-4',
					controls: color
				}],
				requires: {
					universal: 0
				}
			});
		});
		return popup;
	}
});