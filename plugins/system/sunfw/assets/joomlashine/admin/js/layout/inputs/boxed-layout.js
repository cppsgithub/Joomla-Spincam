window.SunFwInputBoxedLayout = React.extendClass('SunFwMixinInput', {
	render: function () {
		SunFw.parent();
		return React.createElement(
			"div",
			{
				key: this.props.id,
				ref: "wrapper",
				className: "form-group"
			},
			React.createElement(
				"label",
				null,
				SunFwString.parse(this.props.control.label)
			),
			React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement("input", {
					ref: "field",
					name: this.props.setting,
					value: this.state.value,
					className: "form-control",
					type: "text",
					onBlur: this.blur,
					onChange: this.change
				}),
				React.createElement(
					"div",
					{ className: "input-group-addon" },
					this.props.control.suffix
				)
			)
		);
	},
	blur: function () {
		if (isNaN(this.state.value) || this.state.value < 768) {
			bootbox.alert(SunFwString.parse('box-layout-min-width'));
			this.setState({ value: 768 });
			this.change(this.props.setting, 768);
		}
	}
});