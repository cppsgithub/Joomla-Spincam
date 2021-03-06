window.SunFwInputRadiusSettings = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value || {
				'top-left': '',
				'bottom-left': '',
				'top-right': '',
				'bottom-right': ''
			}
		};
	},
	render: function () {
		if (typeof this.state.value != 'object' || this.state.value instanceof Array) {
			this.state.value = {};
		}
		if (!this.openingModal) {
			this.value = (this.state.value['top-left'] ? this.state.value['top-left'] + 'px' : '-') + ' ' + (this.state.value['top-right'] ? this.state.value['top-right'] + 'px' : '-') + ' ' + (this.state.value['bottom-right'] ? this.state.value['bottom-right'] + 'px' : '-') + ' ' + (this.state.value['bottom-left'] ? this.state.value['bottom-left'] + 'px' : '-');
		}
		return this.renderPopupInput();
	},
	popupData: function () {
		return {
			rows: [{
				cols: [{
					'class': 'col-xs-6',
					controls: {
						'top-left': {
							type: 'slider',
							label: this.props.control.label + '-top',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						'bottom-right': {
							type: 'slider',
							label: this.props.control.label + '-bottom',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						'bottom-left': {
							type: 'slider',
							label: this.props.control.label + '-left',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						'top-right': {
							type: 'slider',
							label: this.props.control.label + '-right',
							suffix: 'px'
						}
					}
				}]
			}]
		};
	}
});