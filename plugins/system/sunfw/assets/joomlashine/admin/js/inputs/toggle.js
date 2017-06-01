window.SunFwInputToggle = React.extendClass('SunFwMixinInput', {
	render: function () {
		var name = this.props.setting,
		    checked = this.state.value == this.props.control.value;
		return React.createElement(
			"div",
			{ className: "form-group" },
			React.createElement(
				"label",
				{ className: "switch", forName: this.props.id },
				React.createElement("input", {
					ref: "control",
					type: "checkbox",
					name: name,
					value: this.props.control.value,
					checked: checked,
					onClick: this.change
				}),
				React.createElement("div", { className: "slider round" }),
				this.label,
				this.tooltip
			)
		);
	}
});