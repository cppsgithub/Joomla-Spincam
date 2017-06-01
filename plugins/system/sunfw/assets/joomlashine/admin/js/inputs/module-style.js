window.SunFwInputModuleStyle = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value,
			options: []
		};
	},
	componentWillMount: function () {
		SunFw.parent();
		this.loading = true;
		SunFwAjax.request(SunFw.urls.ajaxBase + '&action=getModuleStyle', function (req) {
			var response = req.responseJSON;
			this.loading = false;
			if (response.type == 'success') {
				this.setState({ options: response.data });
			}
		}.bind(this));
	},
	render: function () {
		var options = [],
		    selected;
		options.push(React.createElement(
			'option',
			{ value: '' },
			SunFwString.parse(this.loading ? 'loading' : 'select-module-style')
		));
		this.state.options.map(option => {
			selected = this.state.value == option.value ? true : false;
			options.push(React.createElement(
				'option',
				{ value: option.value, selected: selected },
				option.text
			));
			this.hasOptions || (this.hasOptions = true);
		});
		return React.createElement(
			'div',
			{
				key: this.props.id,
				className: 'form-group'
			},
			React.createElement(
				'label',
				null,
				this.label,
				this.tooltip
			),
			React.createElement(
				'select',
				{
					ref: 'field',
					name: this.props.setting,
					onChange: this.change,
					className: 'form-control'
				},
				options
			),
			React.createElement(
				'p',
				{ className: 'alert alert-info margin-top-15' },
				SunFwString.parse('module-style-message')
			)
		);
	},
	initActions: function () {
		SunFw.parent();
		if (this.refs.field && this.hasOptions) {
			this.changed = true;
			this.initChosen({ disable_search: false });
		}
	}
});