window.SunFwInputBoxShadowSettings = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value || {
				blur: '',
				color: '#000000',
				inset: '',
				spread: '',
				'h-shadow': 0,
				'v-shadow': 0
			}
		};
	},
	render: function () {
		if (typeof this.state.value != 'object' || this.state.value instanceof Array) {
			this.state.value = {};
		}
		if (!this.openingModal) {
			this.value = (this.state.value['h-shadow'] ? this.state.value['h-shadow'] + 'px' : '-') + ' ' + (this.state.value['v-shadow'] ? this.state.value['v-shadow'] + 'px' : '-') + ' ' + (this.state.value.blur ? this.state.value.blur + 'px' : '-') + ' ' + (this.state.value.spread ? this.state.value.spread + 'px' : '-') + ' ' + (this.state.value.color ? this.state.value.color : '-') + ' ' + (this.state.value.inset ? this.state.value.inset : '-');
		}
		return this.renderPopupInput();
	},
	popupData: function () {
		return {
			rows: [{
				cols: [{
					'class': 'col-xs-6',
					controls: {
						'h-shadow': {
							type: 'slider',
							label: 'box-shadow-h-shadow',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						'v-shadow': {
							type: 'slider',
							label: 'box-shadow-v-shadow',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						'blur': {
							type: 'slider',
							label: 'box-shadow-blur',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						'spread': {
							type: 'slider',
							label: 'box-shadow-spread',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						'color': {
							type: 'color-picker',
							label: 'box-shadow-color'
						}
					}
				}, {
					'class': 'col-xs-6 box-shadow-setting-inset',
					controls: {
						'inset': {
							type: 'radio',
							label: 'box-shadow-inset',
							inline: true,
							options: [{ label: 'yes', value: 'inset' }, { label: 'no', value: '' }]
						}
					}
				}]
			}]
		};
	}
});