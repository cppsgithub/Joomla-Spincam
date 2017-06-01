window.SunFwInputModulePosition = React.extendClass('SunFwMixinInput', {
	getInitialState: function () {
		return {
			value: this.props.value,
			options: [],
			position: ''
		};
	},
	componentWillMount: function () {
		SunFw.parent();
		this.loading = true;
		SunFwAjax.request(SunFw.urls.ajaxBase + '&action=getTemplatePosition', function (req) {
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
				option.name
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
				'button',
				{
					type: 'button',
					onClick: this.popupForm.bind(this, 'create-position'),
					className: 'btn btn-default btn-block margin-top-15'
				},
				SunFwString.parse('create-position')
			)
		);
	},
	initActions: function () {
		SunFw.parent();
		if (this.refs.field && this.hasOptions) {
			this.initChosen({ disable_search: false }, true);
		}
	},
	updateState: function (values) {
		this.setState({ position: values.position });
	},
	saveSettings: function (values) {
		SunFwAjax.request(SunFw.urls.ajaxBase + '&action=saveTemplatePosition', function (req) {
			var response = req.responseJSON;
			if (response.type == 'success') {
				var options = this.state.options,
				    position = this.state.position;
				options.push({
					name: this.state.position,
					value: this.state.position
				});
				this.setState({
					options: options,
					position: ''
				});
				delete this.refs.field._initialized_chosen;
				jQuery(this.refs.field).chosen('destroy');
				this.change(this.props.setting, position);
			} else {
				bootbox.alert(response.data);
			}
		}.bind(this), { position: values.position });
	},
	popupData: function () {
		return {
			form: {
				rows: [{
					cols: [{
						'class': 'col-xs-12',
						controls: {
							'position': {
								type: 'text',
								label: 'position-name'
							}
						}
					}]
				}]
			},
			values: { position: this.state.position }
		};
	}
});