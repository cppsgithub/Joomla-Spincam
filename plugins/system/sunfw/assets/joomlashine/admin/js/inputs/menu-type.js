window.SunFwInputMenuType = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value,
			options: []
		};
	},
	componentWillMount: function () {
		SunFw.parent();
		this.loading = true;
		SunFwAjax.request(SunFw.urls.ajaxBase + '&action=getMenuType', function (req) {
			var response = req.responseJSON;
			this.loading = false;
			if (response.type == 'success') {
				this.setState({ options: response.data });
				if (response.data.length && this.state.value == '') {
					this.change(this.props.setting, response.data[0].value);
				}
			}
		}.bind(this));
	},
	render: function () {
		var options = [],
		    selected;
		if (this.loading) {
			options.push(React.createElement(
				'option',
				{ value: '' },
				SunFwString.parse('loading')
			));
		}
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