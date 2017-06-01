window.SunFwInputHidden = React.extendClass('SunFwMixinInput', {
	render: function () {
		return React.createElement("input", {
			ref: "control",
			type: "hidden",
			name: this.props.setting,
			value: this.state.value,
			onChange: this.change
		});
	}
});