window.SunFwInputMenuItem = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value,
			options: {}
		};
	},
	componentWillMount: function () {
		SunFw.parent();
		this.loading = true;
		SunFwAjax.request(SunFw.urls.ajaxBase + '&action=getMenuItems', function (req) {
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
			SunFwString.parse(this.loading ? 'loading' : 'select-menu-item')
		));
		for (var menu_type in this.state.options) {
			options.push(React.createElement(
				'optgroup',
				{ label: this.state.options[menu_type].text },
				this.state.options[menu_type].items.map(option => {
					selected = this.state.value == option.id ? true : false;
					return React.createElement(
						'option',
						{ value: option.id, selected: selected },
						(option.level > 1 ? ' - '.repeat(option.level) : '') + option.title
					);
				})
			));
			this.hasOptions || (this.hasOptions = true);
		}
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