window.SunFwPaneTokenKey = React.extendClass('SunFwPaneMixinEditor', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getPaneTokenKey
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
				className: 'token-key'
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
									{ className: 'padding-bottom-5' },
									React.createElement('div', { ref: 'message', className: 'sunfw-token-message alert hidden' })
								),
								React.createElement(
									'div',
									{ className: 'row' },
									React.createElement(
										'div',
										{ className: 'col-xs-4' },
										React.createElement(
											'label',
											{ forName: 'sunfw-token-key-username' },
											this.config.usernameLabel + ': '
										),
										React.createElement('input', {
											ref: 'username',
											type: 'text',
											className: 'form-control',
											id: 'sunfw-token-key-username'
										})
									),
									React.createElement(
										'div',
										{ className: 'col-xs-4' },
										React.createElement(
											'label',
											{ forName: 'sunfw-token-key-password' },
											this.config.passwordLabel + ': '
										),
										React.createElement('input', {
											ref: 'password',
											type: 'password',
											className: 'form-control',
											id: 'sunfw-token-key-password'
										})
									),
									React.createElement(
										'div',
										{ className: 'col-xs-4' },
										React.createElement(
											'button',
											{
												id: 'sunfw-get-token-key-btn',
												type: 'button',
												className: 'btn btn-block btn-default',
												onClick: this.getTokenKey
											},
											React.createElement('i', {
												ref: 'status',
												className: 'fa fa-key'
											}),
											'\xA0',
											this.config.getTokenLabel
										)
									)
								),
								React.createElement('hr', null),
								React.createElement(
									'div',
									{ className: 'current-token-key' },
									React.createElement(
										'label',
										null,
										this.config.currentTokenLabel + ': '
									),
									React.createElement('input', {
										ref: 'token',
										type: 'text',
										className: 'form-control',
										value: this.config.token,
										placeholder: this.config.tokenInputPlaceholder,
										readonly: true
									})
								)
							)
						)
					)
				)
			)
		);
	},
	preloadAssets: function () {
		SunFwEvent.trigger(this, 'TokenDataFetched');
	},
	getTokenKey: function () {
		this.refs.message.classList.add('hidden');
		this.refs.message.innerHTML = '';
		this.refs.status.classList.remove('fa-key');
		this.refs.status.className += ' fa-spinner fa-spin';
		SunFwAjax.request(this.props.url + '&action=getTokenKey', function (req) {
			if (req.responseJSON) {
				this.refs.message.innerHTML = req.responseJSON.message;
				if (req.responseJSON.result == 'success') {
					this.refs.message.classList.remove('alert-danger');
					this.refs.message.classList.add('alert-success');
					this.refs.token.value = req.responseJSON.token;
					this.refs.username.value = '';
					this.refs.password.value = '';
					this.config.token = req.responseJSON.token;
					var alert = document.querySelector('#missing-token a.close');
					if (alert) {
						alert.click();
					}
				} else {
					this.refs.message.classList.remove('alert-success');
					this.refs.message.classList.add('alert-danger');
				}
				this.refs.message.classList.remove('hidden');
				this.refs.status.className = this.refs.status.className.replace(' fa-spinner fa-spin', '');
				this.refs.status.classList.add('fa-key');
			}
		}.bind(this), {
			username: this.refs.username.value,
			password: this.refs.password.value
		});
	}
});
