window.SunFwInputSelect = React.extendClass('SunFwMixinInput', {
	render: function () {
		var name = this.props.setting + (this.props.control.multiple ? '[]' : ''),
		    options = [],
		    selected;
		if (this.props.control.multiple && !this.state.value instanceof Array) {
			this.state.value = this.state.value == '' ? [] : [this.state.value];
		}
		if (this.props.control.options instanceof Array) {
			this.props.control.options.map(option => {
				var className = option['class'] ? option['class'] : '';
				if (this.props.control.multiple) {
					selected = this.state.value.indexOf(option.value) > -1 ? true : false;
				} else {
					selected = this.state.value == option.value ? true : false;
				}
				options.push(React.createElement(
					'option',
					{
						value: option.value,
						selected: selected,
						className: className + (this.props.form.isVisible(option.requires) ? '' : ' hidden')
					},
					SunFwString.parse(option.label)
				));
			});
		}
		else if (typeof this.props.control.options == 'object') {
				var optgroups;
				for (var optgroup in this.props.control.options) {
					if (!this.props.control.options[optgroup] instanceof Array) {
						continue;
					}
					optgroups = [];
					this.props.control.options[optgroup].map(option => {
						if (this.props.control.multiple) {
							selected = this.state.value.indexOf(option.value) > -1 ? true : false;
						} else {
							selected = this.state.value == option.value ? true : false;
						}
						optgroups.push(React.createElement(
							'option',
							{ value: option.value, selected: selected },
							SunFwString.parse(this.label)
						));
					});
					options.push(React.createElement(
						'optgroup',
						{ label: optgroup },
						optgroups
					));
				}
			}
		return React.createElement(
			'div',
			{ className: 'form-group' },
			React.createElement(
				'label',
				{ forName: this.props.id },
				this.label,
				this.tooltip
			),
			React.createElement(
				'select',
				{
					ref: 'control',
					name: name,
					multiple: !!this.props.control.multiple,
					onChange: this.change,
					className: 'form-control',
					disabled: this.props.control.disabled && this.props.control.disabled == true
				},
				options
			)
		);
	}
});