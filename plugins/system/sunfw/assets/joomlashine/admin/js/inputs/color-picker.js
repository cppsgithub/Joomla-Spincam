window.SunFwInputColorPicker = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value,
			chosen: false
		};
	},
	componentWillMount: function () {
		SunFw.parent();
		this.loadingSpectrumTimer && clearTimeout(this.loadingSpectrumTimer);
		this.loadingSpectrumTimer = setTimeout(function () {
			SunFwAjax.loadStylesheet(SunFw.urls.plugin + '/assets/3rd-party/spectrum/spectrum.css');
			SunFwAjax.loadScript(SunFw.urls.plugin + '/assets/3rd-party/spectrum/spectrum.js', this.forceUpdate.bind(this));
		}.bind(this), 500);
	},
	render: function () {
		var html;
		if (this.props.control.custom_only !== true && ['main', 'sub'].indexOf(this.state.value) > -1) {
			html = React.createElement(
				'select',
				{
					key: this.props.id + '-select-only',
					name: this.props.setting,
					onChange: this.change,
					className: 'form-control'
				},
				React.createElement(
					'option',
					{ value: 'main', selected: this.state.value == 'main' },
					SunFwString.parse('color-picker-main-color')
				),
				React.createElement(
					'option',
					{ value: 'sub', selected: this.state.value == 'sub' },
					SunFwString.parse('color-picker-sub-color')
				),
				React.createElement(
					'option',
					{ value: 'custom' },
					SunFwString.parse('color-picker-custom-color')
				)
			);
		} else {
			var control;
			if (this.props.control.custom_only === true) {
				control = React.createElement('input', {
					type: 'text',
					name: this.props.setting,
					value: this.state.value != '' ? this.state.value : '',
					onChange: this.change,
					className: 'form-control'
				});
			} else {
				control = React.createElement(
					'select',
					{
						key: this.props.id + '-select-with-picker',
						name: this.props.setting,
						onChange: this.change,
						className: 'form-control custom-input'
					},
					React.createElement(
						'option',
						{ value: 'main' },
						SunFwString.parse('color-picker-main-color')
					),
					React.createElement(
						'option',
						{ value: 'sub' },
						SunFwString.parse('color-picker-sub-color')
					),
					React.createElement(
						'option',
						{
							value: this.state.value != '' && this.state.value != 'custom' ? this.state.value : 'custom',
							selected: true
						},
						SunFwString.parse('color-picker-custom-color')
					)
				);
			}
			html = React.createElement(
				'div',
				{ className: 'input-group' },
				control,
				React.createElement(
					'span',
					{ className: 'input-group-addon' },
					React.createElement('input', {
						ref: 'field',
						type: 'hidden',
						name: this.props.setting,
						value: this.state.value != 'custom' ? this.state.value : '',
						onChange: this.change
					})
				)
			);
		}
		return React.createElement(
			'div',
			{
				key: this.props.id,
				className: 'form-group color-picker'
			},
			React.createElement(
				'label',
				{ forName: this.props.id },
				this.label,
				this.tooltip
			),
			html
		);
	},
	initActions: function () {
		SunFw.parent();
		if (this.refs.field && jQuery.fn.spectrum !== undefined) {
			if (this.refs.field.nextElementSibling && this.refs.field.nextElementSibling.classList.contains('sp-replacer')) {
				jQuery(this.refs.field).spectrum('destroy');
				if (this.refs.field.nextElementSibling && this.refs.field.nextElementSibling.classList.contains('sp-replacer')) {
					this.refs.field.nextElementSibling.parentNode.removeChild(this.refs.field.nextElementSibling);
				}
			}
			jQuery(this.refs.field).spectrum({
				color: this.refs.field.value,
				showInput: true,
				showInitial: true,
				allowEmpty: this.props.control.allowempty ? this.props.control.allowempty : true,
				showAlpha: this.props.control.showalpha ? this.props.control.showalpha : true,
				clickoutFiresChange: true,
				preferredFormat: this.props.control.format ? this.props.control.format : 'hex',
				change: function (picker) {
					this.change(this.props.setting, picker ? picker.getAlpha() == 1 ? picker.toHexString() : picker.toRgbString() : '');
				}.bind(this)
			});
		}
	}
});