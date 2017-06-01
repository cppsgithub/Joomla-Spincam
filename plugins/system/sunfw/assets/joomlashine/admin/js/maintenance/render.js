window.SunFwPaneMaintenance = React.extendClass('SunFwPaneMixinEditor', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getPaneMaintenance
		};
	},
	render: function () {
		if (this.config === undefined) {
			return null;
		}
		return React.createElement(
			'div',
			{
				key: this.props.id,
				ref: 'wrapper',
				className: 'maintenance'
			},
			React.createElement(
				'div',
				{ className: 'jsn-main-content' },
				React.createElement(
					'div',
					{ className: 'container-fluid padding-top-20' },
					React.createElement(
						'div',
						{ className: 'col-xs-12 col-md-6 col-md-offset-3' },
						React.createElement(
							'div',
							{ className: 'panel panel-default' },
							React.createElement(
								'div',
								{ className: 'panel-body' },
								React.createElement(
									'p',
									null,
									this.config.description
								),
								React.createElement(
									'div',
									{ className: 'text-center' },
									React.createElement(
										'a',
										{
											href: '#',
											className: 'btn btn-default',
											onClick: this.importData
										},
										React.createElement('i', { className: 'fa fa-upload' }),
										'\xA0',
										this.config.importLabel
									),
									'\xA0',
									React.createElement(
										'a',
										{
											href: this.props.url + '&action=export',
											className: 'btn btn-default'
										},
										React.createElement('i', { className: 'fa fa-download' }),
										'\xA0',
										this.config.exportLabel
									)
								)
							)
						)
					)
				)
			)
		);
	},
	importData: function () {
		var form = document.getElementById('sunfw-maintenance-form'),
		    input = form.querySelector('input[type="file"]');
		if (!input._added_change_handler) {
			SunFwEvent.add(input, 'change', function () {
				var iframe = document.getElementById('sunfw-hidden-iframe');
				if (!iframe._added_load_handler) {
					SunFwEvent.add(iframe, 'load', function (event) {
						var response = event.target.contentDocument.body.textContent.match(/\{"type":[^,]+,"data":[^\}]+\}/);
						if (response) {
							response = JSON.parse(response[0]);
						} else {
							response = {
								type: 'failure',
								data: event.target.contentDocument.body.textContent
							};
						}
						if (response.type == 'success') {
							alert(response.data);
							window.location.reload();
						} else {
							alert(response.data);
						}
					});
					iframe._added_load_handler = true;
				}
				form.action = this.props.url + '&action=import';
				form.submit();
			}.bind(this));
			input._added_change_handler = true;
		}
		input.click();
	}
});
