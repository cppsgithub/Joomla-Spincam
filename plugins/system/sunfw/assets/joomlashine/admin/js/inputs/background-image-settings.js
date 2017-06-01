window.SunFwInputBackgroundImageSettings = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value || {
				size: '',
				repeat: '',
				position: '',
				attachment: ''
			}
		};
	},
	render: function () {
		if (typeof this.state.value != 'object' || this.state.value instanceof Array) {
			this.state.value = {};
		}
		if (!this.openingModal) {
			this.value = (this.state.value.position ? this.state.value.position : '-') + ' ' + (this.state.value.size ? (this.state.value.position != '' ? '/' : '') + this.state.value.size : '-') + ' ' + (this.state.value.repeat ? this.state.value.repeat : '-') + ' ' + (this.state.value.attachment ? this.state.value.attachment : '-');
		}
		return this.renderPopupInput();
	},
	popupData: function () {
		return {
			rows: [{
				cols: [{
					'class': 'col-xs-6',
					controls: {
						repeat: {
							type: 'select',
							chosen: false,
							label: 'background-repeat',
							options: [{ label: 'initial', value: 'initial' }, { label: 'repeat', value: 'repeat' }, { label: 'repeat-x', value: 'repeat-x' }, { label: 'repeat-y', value: 'repeat-y' }, { label: 'no-repeat', value: 'no-repeat' }, { label: 'inherit', value: 'inherit' }]
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						size: {
							type: 'select',
							chosen: false,
							label: 'background-size',
							options: [{ label: 'initial', value: 'initial' }, { label: 'auto', value: 'auto' }, { label: 'cover', value: 'cover' }, { label: 'contain', value: 'contain' }, { label: 'inherit', value: 'inherit' }]
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						attachment: {
							type: 'select',
							chosen: false,
							label: 'background-attachment',
							options: [{ label: 'initial', value: 'initial' }, { label: 'scroll', value: 'scroll' }, { label: 'fixed', value: 'fixed' }, { label: 'local', value: 'local' }, { label: 'inherit', value: 'inherit' }]
						}
					}
				}, {
					'class': 'col-xs-6',
					controls: {
						position: {
							type: 'select',
							chosen: false,
							label: 'background-position',
							options: [{ label: 'initial', value: 'initial' }, { label: 'left top', value: 'left top' }, { label: 'left center', value: 'left center' }, { label: 'left bottom', value: 'left bottom' }, { label: 'right top', value: 'right top' }, { label: 'right center', value: 'right center' }, { label: 'right bottom', value: 'right bottom' }, { label: 'center top', value: 'center top' }, { label: 'center center', value: 'center center' }, { label: 'center bottom', value: 'center bottom' }, { label: 'inherit', value: 'inherit' }]
						}
					}
				}]
			}]
		};
	}
});