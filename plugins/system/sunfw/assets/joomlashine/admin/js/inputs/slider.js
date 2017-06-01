window.SunFwInputSlider = React.extendClass('SunFwMixinInput', {
	render: function () {
		var suffix;
		if (this.props.control.suffix) {
			suffix = React.createElement(
				'span',
				{ className: 'input-group-addon', style: { padding: '6px 12px' } },
				SunFwString.parse(this.props.control.suffix)
			);
		}
		var value = this.state.value;
		if (!value || value == '') {
			value = this.props.control['default'];
			if (!value || value == '') {
				value = 0;
			}
		}
		return React.createElement(
			'div',
			{
				key: this.props.id,
				className: 'form-group'
			},
			React.createElement(
				'label',
				{ forName: this.props.id },
				this.label,
				this.tooltip
			),
			React.createElement(
				'div',
				{ className: 'container-fluid' },
				React.createElement(
					'div',
					{ className: 'row sunfw-slider' },
					React.createElement(
						'div',
						{ className: 'col-xs-8', style: { 'padding-left': 0 } },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement('input', {
								ref: 'field',
								min: this.props.control.min ? this.props.control.min : 0,
								max: this.props.control.max ? this.props.control.max : 100,
								step: this.props.control.step ? this.props.control.step : 1,
								type: 'range',
								name: this.props.setting,
								value: value,
								onChange: this.change,
								className: 'form-control'
							})
						)
					),
					React.createElement(
						'div',
						{ className: 'col-xs-4', style: { padding: 0 } },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement(
								'div',
								{ className: 'input-group' },
								React.createElement('input', {
									min: this.props.control.min ? this.props.control.min : 0,
									max: this.props.control.max ? this.props.control.max : 100,
									step: this.props.control.step ? this.props.control.step : 1,
									type: 'number',
									name: this.props.setting,
									value: value,
									style: { 'padding-right': 0 },
									onChange: this.change,
									className: 'form-control'
								}),
								suffix
							)
						)
					)
				)
			)
		);
	}
});