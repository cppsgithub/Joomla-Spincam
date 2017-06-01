window.SunFwInputTextarea = React.extendClass('SunFwMixinInput', {
	render: function () {
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
				"textarea",
				{
					ref: "control",
					rows: this.props.control.rows ? this.props.control.rows : 10,
					cols: this.props.control.cols ? this.props.control.cols : '100%',
					name: this.props.setting,
					value: this.state.value,
					onChange: this.change,
					className: "form-control"
				},
				this.state.value
			)
		);
	}
});