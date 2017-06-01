window.SunFwInputSpacingSettings = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value || {
				top: '',
				left: '',
				right: '',
				bottom: ''
			}
		};
	},
	render: function () {
		if (typeof this.state.value != 'object' || this.state.value instanceof Array) {
			this.state.value = {};
		}
		if (!this.openingModal) {
			this.value = (this.state.value.top ? this.state.value.top + 'px' : '-') + ' ' + (this.state.value.right ? this.state.value.right + 'px' : '-') + ' ' + (this.state.value.bottom ? this.state.value.bottom + 'px' : '-') + ' ' + (this.state.value.left ? this.state.value.left + 'px' : '-');
		}
		return this.renderPopupInput(this.props.control.label + '-settings');
	},
	popupData: function () {
		return {
			rows: [{
				cols: [{
					'class': 'col-xs-6',
					controls: {
						top: {
							type: 'slider',
							label: this.props.control.label + '-top',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						bottom: {
							type: 'slider',
							label: this.props.control.label + '-bottom',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						left: {
							type: 'slider',
							label: this.props.control.label + '-left',
							suffix: 'px'
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						right: {
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