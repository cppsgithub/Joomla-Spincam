window.SunFwInputRadio = React.extendClass('SunFwMixinInput', {
	render: function () {
		if (this.props.control.options && this.props.control.options instanceof Array) {
			return this.renderMultipleOptions();
		}
		else {
				return renderSingleOption();
			}
	},
	renderMultipleOptions: function () {
		var options = [],
		    name = this.props.setting,
		    className,
		    checked;
		this.props.control.options.map(option => {
			var optionLabel = SunFwString.parse(option.label);
			className = 'radio' + (this.props.control.inline ? '-inline' : '');
			if (!this.props.form.isVisible(option.requires)) {
				className += ' hidden';
			}
			checked = this.state.value == option.value ? true : false;
			var optionTooltip;
			if (option.hint) {
				optionTooltip = React.createElement(SunFwElementTooltip, { hint: SunFwString.parse(option.hint) });
			}
			if (this.props.control.inline) {
				options.push(React.createElement(
					'label',
					{ className: className + (checked ? ' checked' : '') },
					React.createElement('input', {
						id: this.props.id + '_' + option.value,
						type: 'radio',
						name: name,
						value: option.value,
						checked: checked,
						onClick: this.change,
						className: option['class'] ? option['class'] : ''
					}),
					optionLabel,
					optionTooltip
				));
			} else {
				options.push(React.createElement(
					'div',
					{ className: className },
					React.createElement(
						'label',
						{ className: checked ? 'checked' : '' },
						React.createElement('input', {
							id: this.props.id + '_' + option.value,
							type: 'radio',
							name: name,
							value: option.value,
							checked: checked,
							onClick: this.change,
							className: option['class'] ? option['class'] : ''
						}),
						optionLabel,
						optionTooltip
					)
				));
			}
		});
		return React.createElement(
			'div',
			{ className: 'form-group' },
			React.createElement(
				'label',
				null,
				this.label,
				this.tooltip
			),
			React.createElement(
				'div',
				{ className: 'radio-group' },
				options
			)
		);
	},
	renderSingleOption: function () {
		var options = [],
		    name = this.props.setting,
		    className,
		    checked;
		className = 'radio' + (this.props.control.inline ? '-inline' : '');
		if (!this.props.form.isVisible(this.props.control.requires)) {
			className += ' hidden';
		}
		checked = this.state.value == this.props.control.value ? true : false;
		if (this.props.control.inline) {
			options = React.createElement(
				'label',
				{ className: className + (checked ? ' checked' : '') },
				React.createElement('input', {
					ref: 'control',
					type: 'radio',
					name: name,
					value: this.props.control.value,
					checked: checked,
					onClick: this.change
				}),
				this.label,
				this.tooltip
			);
		} else {
			options = React.createElement(
				'div',
				{ className: className },
				React.createElement(
					'label',
					{ className: checked ? 'checked' : '' },
					React.createElement('input', {
						ref: 'control',
						type: 'radio',
						name: name,
						value: this.props.control.value,
						checked: checked,
						onClick: this.change
					}),
					this.label,
					this.tooltip
				)
			);
		}
		return React.createElement(
			'div',
			{ className: 'form-group' },
			options
		);
	}
});