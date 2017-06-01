window.SunFwInputText = React.extendClass('SunFwMixinInput', {
	render: function () {
		if (this.props.control.suffix) {
			return React.createElement(
				"div",
				{ className: "form-group" },
				React.createElement(
					"label",
					{ forName: this.props.id },
					this.label,
					this.tooltip
				),
				React.createElement(
					"div",
					{ className: "input-group" },
					React.createElement("input", {
						ref: "control",
						type: "text",
						name: this.props.setting,
						value: this.state.value,
						onChange: this.change,
						className: "form-control",
						placeholder: SunFwString.parse(this.props.control.placeholder)
					}),
					React.createElement(
						"div",
						{ className: "input-group-addon" },
						SunFwString.parse(this.props.control.suffix)
					)
				)
			);
		}
		else {
				return React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement(
						"label",
						{ forName: this.props.id },
						this.label,
						this.tooltip
					),
					React.createElement("input", {
						ref: "control",
						type: "text",
						name: this.props.setting,
						value: this.state.value,
						onChange: this.change,
						className: "form-control",
						placeholder: SunFwString.parse(this.props.control.placeholder)
					})
				);
			}
	}
});