window.SunFwPaneSampleData = React.extendClass('SunFwPaneMixinEditor', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getPaneSampleData
		};
	},
	getInitialState: function () {
		return {
			actionToDo: '',
			processing: -1
		};
	},
	render: function () {
		if (this.config === undefined) {
			return null;
		}
		var samples = [],
		    action,
		    className,
		    title,
		    label;
		this.config.packages.map((sample, index) => {
			action = this.config.lastInstalled == sample.id ? 'uninstall' : 'install';
			className = 'thumbnail' + (action == 'uninstall' ? ' active' : '');
			var buttons;
			if (action == 'uninstall') {
				buttons = React.createElement(
					'p',
					null,
					React.createElement(
						'a',
						{
							ref: sample.id,
							href: '#',
							title: SunFwString.parse('reinstall-sample').replace('%s', sample.name),
							onClick: this.install,
							className: 'btn btn-warning btn-sm reinstall-sample',
							'data-index': index
						},
						SunFwString.parse('reinstall-label')
					),
					React.createElement(
						'a',
						{
							ref: sample.id,
							href: '#',
							title: SunFwString.parse('uninstall-sample').replace('%s', sample.name),
							onClick: this.uninstall,
							className: 'btn btn-primary btn-sm uninstall-sample  margin-left-10',
							'data-index': index
						},
						SunFwString.parse('uninstall-label')
					)
				);
			} else {
				buttons = React.createElement(
					'p',
					null,
					React.createElement(
						'a',
						{
							ref: sample.id,
							href: '#',
							title: SunFwString.parse('install-sample').replace('%s', sample.name),
							onClick: this.install,
							className: 'btn btn-primary btn-sm install-sample',
							'data-index': index
						},
						SunFwString.parse('install-label')
					)
				);
			}
			samples.push(React.createElement(
				'div',
				{ className: 'item' },
				React.createElement(
					'div',
					{ className: 'thumbnail' },
					React.createElement(
						'a',
						{
							href: sample.demo,
							title: SunFwString.parse('preview-sample').replace('%s', sample.name),
							target: '_blank',
							rel: 'noopener noreferrer',
							className: className
						},
						React.createElement(
							'span',
							{ className: 'sunfw-loading-indicator' },
							React.createElement('i', { className: 'fa fa-circle-o-notch fa-3x fa-spin' })
						),
						React.createElement('img', { src: sample.thumbnail, alt: sample.name })
					),
					React.createElement(
						'div',
						{ className: 'caption content-sample' },
						React.createElement(
							'h3',
							null,
							sample.name
						),
						buttons
					)
				)
			));
		});
		return React.createElement(
			'div',
			{
				key: this.props.id,
				ref: 'wrapper',
				className: 'sample-data'
			},
			React.createElement(
				'div',
				{ className: 'jsn-main-content sample-data-item' },
				React.createElement(
					'div',
					{ className: 'container-fluid padding-top-20' },
					React.createElement(
						'div',
						{ className: 'row' },
						React.createElement(
							'div',
							{ className: 'items' },
							samples
						)
					)
				)
			),
			React.createElement(SunFwComponentModal, {
				key: this.props.id + '_modal',
				ref: 'modal',
				parent: this,
				editor: this,
				buttons: 'disabled',
				centralize: false
			})
		);
	},
	initActions: function () {
		if (this.state.actionToDo == 'install' || this.state.actionToDo == 'uninstall') {
			var title, html;
			if (this.state.actionToDo == 'install') {
				title = 'install-sample-data';
				html = React.createElement(SunFwPaneSampleDataInstall, {
					id: this.props.id + '_installer',
					parent: this,
					editor: this,
					sample: this.config.packages[this.state.processing]
				});
			} else {
				title = 'uninstall-sample-data';
				html = React.createElement(SunFwPaneSampleDataUninstall, {
					id: this.props.id + '_installer',
					parent: this,
					editor: this,
					sample: this.config.packages[this.state.processing]
				});
			}
			this.refs.modal.setState({
				show: true,
				title: title,
				content: html,
				className: 'installation-modal'
			});
		}
	},
	install: function (event) {
		event.preventDefault();
		var idx = parseInt(event.target.getAttribute('data-index'));
		this.setState({
			actionToDo: 'install',
			processing: idx
		});
	},
	uninstall: function (event) {
		event.preventDefault();
		var idx = parseInt(event.target.getAttribute('data-index')),
		    pkg = this.config.packages[idx];
		if (this.config.lastInstalled == pkg.id) {
			this.setState({
				actionToDo: 'uninstall',
				processing: idx
			});
		}
	}
});
window.SunFwPaneSampleDataInstall = React.extendClass('SunFwPaneMixinBase', {
	getDefaultProps: function () {
		return {
			sample: {}
		};
	},
	getInitialState: function () {
		return {
			step: 'confirm',
			installationType: 'sampledata',
			success: [],
			failure: {},
			confirmed: false,
			attention: [],
			installing: '',
			extensions: [],
			selectedPackage: '',
			ignoredExtension: {},
			showExtensionDesc: {}
		};
	},
	render: function () {
		if (typeof this.hasUpdate == 'undefined') {
			var update_labels = document.querySelectorAll('.update-availabel');
			this.hasUpdate = false;
			for (var i = 0, n = update_labels.length; i < n; i++) {
				if (!update_labels[i].classList.contains('sunfwhide')) {
					this.hasUpdate = update_labels[i];
					break;
				}
			}
		}
		if (this.hasUpdate) {
			return React.createElement(
				'div',
				{ ref: 'wrapper', key: this.props.id, id: 'install_sample_data_modal' },
				React.createElement(
					'p',
					null,
					SunFwString.parse('sample-data-unavailable-due-to-product-outdated')
				),
				React.createElement(
					'div',
					{ className: 'modal-footer' },
					React.createElement(
						'div',
						{ className: 'actions' },
						React.createElement(
							'button',
							{ type: 'button', className: 'btn btn-primary', onClick: function () {
									this.parent.refs.modal.close();
									jQuery(this.hasUpdate).find('a').trigger('click');
								}.bind(this) },
							SunFwString.parse('update-product')
						),
						React.createElement(
							'button',
							{ ref: 'close', type: 'button', onClick: this.cancel, className: 'btn btn-default' },
							SunFwString.parse('cancel')
						)
					)
				)
			);
		}
		var extensions = [];
		if (this.hasError('extensions') == 'hidden') {
			this.total_extensions = 0;
			this.state.extensions.map(ext => {
				var children = [];
				if (this.state.step != 'extensions' || this.state.installing != '') {
					if (this.state.ignoredExtension[ext.identifiedname]) {
						return;
					}
				}
				if (ext.depends instanceof Array && ext.depends.length) {
					ext.depends.map(child => {
						if (child.state != 'installed') {
							children.push(React.createElement(
								'li',
								{ className: 'extension' },
								React.createElement(
									'label',
									{ className: 'checkbox-inline extension-label title' },
									React.createElement('input', {
										ref: child.identifiedname,
										type: 'checkbox',
										value: child.identifiedname,
										checked: this.state.ignoredExtension[ext.identifiedname] ? false : true,
										disabled: 'disabled'
									}),
									child.description,
									React.createElement('span', { className: 'fa fa-' + this.getIcon(child.identifiedname) })
								),
								React.createElement(
									'span',
									{ className: 'label label-' + (child.state == 'install' ? 'success' : 'warning') + (this.state.installing == '' ? '' : ' hidden') },
									SunFwString.parse(child.state == 'install' ? 'new-installation' : 'update')
								),
								React.createElement(
									'div',
									{ ref: child.identifiedname + '_progress', className: 'progress hidden' },
									React.createElement(
										'div',
										{ className: 'progress-bar', role: 'progressbar' },
										React.createElement(
											'span',
											{ className: 'percentage' },
											'0%'
										)
									)
								),
								React.createElement(
									'div',
									{ ref: child.identifiedname + '_alert', className: 'alert alert-danger ' + this.hasError(child.identifiedname) },
									this.state.failure[child.identifiedname] ? this.state.failure[child.identifiedname] : null
								)
							));
							this.total_extensions++;
						}
					});
				}
				if (children.length || ext.state != 'installed') {
					extensions.push(React.createElement(
						'li',
						{ className: 'extension' },
						React.createElement(
							'label',
							{ className: 'checkbox-inline jsn-extension-label jsn-title' },
							React.createElement('input', {
								ref: ext.identifiedname,
								type: 'checkbox',
								value: ext.identifiedname,
								checked: this.state.ignoredExtension[ext.identifiedname] ? false : true,
								disabled: ext.state != 'install' || this.state.installing != '' ? true : false,
								onChange: this.toggleExtension.bind(this, ext.identifiedname)
							}),
							ext.description,
							React.createElement('span', { className: 'fa fa-' + this.getIcon(ext.identifiedname) })
						),
						React.createElement(
							'a',
							{
								href: 'javascript:void(0)',
								onClick: this.toggleExtensionDesc.bind(this, ext.identifiedname),
								className: 'extension-details'
							},
							React.createElement('i', { className: 'fa fa-' + (this.state.showExtensionDesc[ext.identifiedname] ? 'minus' : 'plus') + (this.state.installing == '' ? '' : ' hidden') })
						),
						React.createElement(
							'span',
							{ className: 'label label-' + (ext.state == 'install' ? 'success' : 'warning') + (this.state.installing == '' ? '' : ' hidden') },
							SunFwString.parse(ext.state == 'install' ? 'new-installation' : 'update')
						),
						React.createElement(
							'p',
							{ className: 'extension-desc' + (this.state.showExtensionDesc[ext.identifiedname] ? '' : ' hidden') + (this.state.installing == '' ? '' : ' hidden') },
							ext.productdesc,
							React.createElement(
								'a',
								{ href: ext.producturl, target: '_blank', rel: 'noopener noreferrer', className: 'read-more' },
								SunFwString.parse('read-more')
							)
						),
						React.createElement(
							'div',
							{ ref: ext.identifiedname + '_progress', className: 'progress hidden' },
							React.createElement(
								'div',
								{ className: 'progress-bar', role: 'progressbar' },
								React.createElement(
									'span',
									{ className: 'percentage' },
									'0%'
								)
							)
						),
						React.createElement(
							'div',
							{ ref: ext.identifiedname + '_alert', className: 'alert alert-danger ' + this.hasError(ext.identifiedname) },
							this.state.failure[ext.identifiedname] ? this.state.failure[ext.identifiedname] : null
						),
						React.createElement(
							'ul',
							null,
							children
						)
					));
					this.total_extensions++;
				}
			});
		}
		if (this.state.step == 'extensions') {
			if (extensions.length) {
				extensions = React.createElement(
					'ul',
					null,
					extensions
				);
			} else {
				this.state.success.push('extensions');
				this.state.step = 'import';
			}
		}
		var attention = [];
		if (this.state.attention instanceof Array && this.state.attention.length) {
			this.state.attention.map(ext => {
				if (ext.display === undefined || ext.display) {
					var message = SunFwString.parse('notice-for-unchecked-extension'),
					    textBtn = SunFwString.parse('get-it-now'),
					    link = '',
					    missing = '',
					    skipped = false;
					for (var p in this.state.ignoredExtension) {
						if (p.indexOf(ext.id) > -1) {
							skipped = true;
						}
					}
					if (!skipped) {
						if (ext.author == '3rd') {
							if (ext.commercial == 'true') {
								message = SunFwString.parse('notice-for-commercial-extention');
								textBtn = SunFwString.parse('learn-more');
							} else {
								message = SunFwString.parse('notice-for-free-extention');
								textBtn = SunFwString.parse('download-it');
							}
						}
					}
					if (ext.url) {
						link = React.createElement(
							'a',
							{ href: ext.url, target: '_blank', rel: 'noopener noreferrer' },
							textBtn
						);
					}
					if (ext.missing) {
						missing = React.createElement(
							'ul',
							null,
							ext.missing.map(m => {
								return React.createElement(
									'li',
									null,
									React.createElement(
										'strong',
										null,
										m
									)
								);
							})
						);
					}
					attention.push(React.createElement(
						'li',
						null,
						React.createElement(
							'strong',
							null,
							ext.name
						),
						' ',
						ext.version ? '(' + ext.version + ')' : null,
						React.createElement('br', null),
						ext.missing || ext.outdate ? ext.message : message,
						' ',
						missing,
						' ',
						link,
						'.'
					));
				}
			});
		}
		if (attention.length) {
			attention = React.createElement(
				'ul',
				null,
				attention
			);
		}
		return React.createElement(
			'div',
			{ ref: 'wrapper', key: this.props.id, id: 'install_sample_data_modal' },
			React.createElement(
				'div',
				{ className: this.state.step == 'confirm' ? '' : 'hidden' },
				React.createElement(
					'div',
					{ className: 'alert alert-warning' },
					React.createElement(
						'span',
						{ className: 'label label-danger' },
						SunFwString.parse('important-notice')
					),
					React.createElement(
						'ul',
						null,
						React.createElement('li', { ref: 'notice' }),
						React.createElement(
							'li',
							null,
							SunFwString.parse('install-sample-notice-2')
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'radio' },
					React.createElement(
						'label',
						null,
						React.createElement('input', { type: 'radio', checked: this.state.installationType === 'sampledata', onClick: this.selectInstallationType, name: 'typeInstallation', value: 'sampledata' }),
						SunFwString.parse('install-sample-notice-3')
					),
					React.createElement('br', null),
					React.createElement(
						'label',
						null,
						React.createElement('input', { type: 'radio', checked: this.state.installationType === 'structure', onClick: this.selectInstallationType, name: 'typeInstallation', value: 'structure' }),
						SunFwString.parse('install-sample-notice-4')
					)
				)
			),
			React.createElement(
				'div',
				{ className: this.state.step != 'confirm' && this.state.installationType == 'sampledata' ? '' : 'hidden' },
				React.createElement(
					'p',
					{ className: this.state.step == 'success' ? 'hidden' : '' },
					SunFwString.parse('install-sample-processing')
				),
				React.createElement(
					'ul',
					{ className: this.state.step == 'success' ? 'hidden' : '' },
					React.createElement(
						'li',
						null,
						React.createElement(
							'span',
							{ className: 'title' },
							SunFwString.parse('download-sample-package')
						),
						React.createElement('span', { className: 'fa fa-' + this.getIcon('download') }),
						React.createElement(
							'div',
							{ ref: 'download_progress', className: 'progress hidden' },
							React.createElement(
								'div',
								{ className: 'progress-bar', role: 'progressbar' },
								React.createElement(
									'span',
									{ className: 'percentage' },
									'0%'
								)
							)
						),
						React.createElement(
							'div',
							{ ref: 'download_alert', className: 'alert alert-danger ' + this.hasError('download') },
							this.state.failure['download'] ? this.state.failure['download'] : null
						)
					),
					React.createElement(
						'li',
						{ className: this.isVisible('upload') },
						React.createElement(
							'span',
							{ className: 'title' },
							SunFwString.parse('upload-sample-package')
						),
						React.createElement('span', { className: 'fa fa-' + this.getIcon('upload') }),
						React.createElement(
							'div',
							{ ref: 'upload_alert', className: 'alert alert-danger ' + this.hasError('upload') },
							this.state.failure['upload'] ? this.state.failure['upload'] : null
						)
					),
					React.createElement(
						'li',
						{ className: this.isVisible('extensions') },
						React.createElement(
							'span',
							{ className: 'title' },
							SunFwString.parse(!extensions.length || this.state.installing != '' ? 'install-extensions' : 'recommend-extensions')
						),
						React.createElement('span', { className: 'fa fa-' + this.getIcon('extensions') }),
						React.createElement(
							'div',
							{ ref: 'extensions_progress', className: 'progress hidden' },
							React.createElement(
								'div',
								{ className: 'progress-bar', role: 'progressbar' },
								React.createElement(
									'span',
									{ className: 'percentage' },
									'0%'
								)
							)
						),
						extensions,
						React.createElement(
							'div',
							{ ref: 'extensions_alert', className: 'alert alert-danger ' + this.hasError('extensions') },
							this.state.failure['extensions'] ? this.state.failure['extensions'] : null
						)
					),
					React.createElement(
						'li',
						{ className: this.isVisible('import') },
						React.createElement(
							'span',
							{ className: 'title' },
							SunFwString.parse('install-sample-package')
						),
						React.createElement('span', { className: 'fa fa-' + this.getIcon('import') }),
						React.createElement(
							'div',
							{ ref: 'import_alert', className: 'alert alert-danger ' + this.hasError('import') },
							this.state.failure['import'] ? this.state.failure['import'] : null
						)
					)
				),
				React.createElement(
					'div',
					{ className: this.isVisible('manual') },
					React.createElement(
						'form',
						{
							ref: 'form',
							method: 'post',
							target: 'upload-sample-data',
							encType: 'multipart/form-data'
						},
						React.createElement(
							'ol',
							null,
							React.createElement(
								'li',
								null,
								SunFwString.parse('download-sample-package-m'),
								React.createElement(
									'a',
									{ href: this.props.sample.download, className: 'btn btn-default', target: '_blank', rel: 'noopener noreferrer' },
									SunFwString.parse('download-file')
								)
							),
							React.createElement(
								'li',
								null,
								SunFwString.parse('select-sample-package'),
								React.createElement('input', {
									name: 'package',
									type: 'file',
									onChange: this.selectPackage,
									defaultValue: this.state.selectedPackage
								}),
								React.createElement('br', null),
								React.createElement(
									'div',
									{ className: 'alert alert-danger ' + this.hasError('manual') },
									this.state.failure['manual'] ? this.state.failure['manual'] : null
								)
							)
						)
					),
					React.createElement('iframe', { ref: 'iframe', src: 'about:blank', name: 'upload-sample-data', className: 'hidden' })
				),
				React.createElement(
					'div',
					{ className: 'success-message ' + (this.isVisible('success') == 'hidden' || !(attention instanceof Array) ? 'hidden' : '') },
					React.createElement(
						'p',
						null,
						SunFwString.parse('install-sample-success')
					)
				),
				React.createElement(
					'div',
					{ className: 'notice-message ' + (this.isVisible('success') == '' && !(attention instanceof Array) ? '' : 'hidden') },
					React.createElement(
						'p',
						null,
						SunFwString.parse('install-sample-attention')
					),
					attention
				),
				React.createElement(
					'div',
					{ className: 'failure-message ' + this.isVisible('failure') },
					React.createElement(
						'p',
						null,
						SunFwString.parse('install-sample-failure')
					)
				)
			),
			React.createElement(
				'div',
				{ className: this.state.step != 'confirm' && this.state.installationType == 'structure' ? '' : 'hidden' },
				React.createElement(
					'p',
					{ className: this.state.step == 'success' ? 'hidden' : '' },
					SunFwString.parse('install-structure-processing')
				),
				React.createElement(
					'ul',
					{ className: this.state.step == 'success' ? 'hidden' : '' },
					React.createElement(
						'li',
						null,
						React.createElement(
							'span',
							{ className: 'title' },
							SunFwString.parse('install-structure-data')
						),
						React.createElement('span', { className: 'fa fa-' + this.getIcon('apply') }),
						React.createElement(
							'div',
							{ ref: 'apply_alert', className: 'alert alert-danger ' + this.hasError('apply') },
							this.state.failure['apply'] ? this.state.failure['apply'] : null
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'success-message ' + this.isVisible('success') },
					React.createElement(
						'p',
						null,
						SunFwString.parse('install-sample-success')
					)
				),
				React.createElement(
					'div',
					{ className: 'failure-message ' + this.isVisible('failure') },
					React.createElement(
						'p',
						null,
						SunFwString.parse('install-sample-failure')
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'modal-footer' + (this.state.step == 'confirm' || this.state.step == 'manual' || this.state.step == 'extensions' && this.state.installing == '' || this.state.step == 'success' || this.state.step == 'failure' ? '' : ' hidden') },
				React.createElement(
					'div',
					{ className: this.state.step == 'confirm' ? 'checkbox' : 'checkbox hidden' },
					React.createElement(
						'label',
						null,
						React.createElement('input', {
							ref: 'confirm',
							type: 'checkbox',
							name: 'agree',
							value: '1',
							onClick: this.confirm
						}),
						SunFwString.parse('install-sample-confirm')
					)
				),
				React.createElement(
					'div',
					{ className: 'actions' + (this.state.step == 'confirm' || this.state.step == 'manual' || this.state.step == 'extensions' && this.state.installing == '' || this.state.step == 'success' || this.state.step == 'failure' ? '' : ' hidden') },
					React.createElement(
						'button',
						{
							type: 'button',
							onClick: this.next,
							disabled: this.state.confirmed ? false : true,
							className: 'btn btn-primary' + (this.state.step == 'success' || this.state.step == 'failure' ? ' hidden' : '')
						},
						SunFwString.parse('continue')
					),
					React.createElement(
						'button',
						{
							ref: 'close',
							type: 'button',
							onClick: this.cancel,
							className: 'btn btn-default'
						},
						SunFwString.parse(this.state.step == 'success' ? 'start-editing' : this.state.step == 'failure' ? 'close' : 'cancel')
					)
				)
			)
		);
	},
	initActions: function () {
		if (this.hasUpdate) {
			return;
		}
		this.refs.notice.innerHTML = SunFw.text['install-sample-notice-1'].replace('%1$s', this.props.sample.demo).replace('%2$s', this.props.sample.name);
		if (!this.state.confirmed) {
			this.refs.confirm.checked = false;
		}
		if (this.state.installationType == 'sampledata') {
			if (this.state.confirmed) {
				var server = this.editor.props.url + '&sample_package=' + this.props.sample.id;
				switch (this.state.step) {
					case 'download':
						SunFwAjax.downloadFile(server + '&action=downloadPackage', this.refs.download_progress, function (req) {
							var response = req.responseJSON;
							if (response.type == 'success') {
								var success = this.state.success;
								success.push('download');
								this.setState({
									success: success,
									step: 'extensions',
									extensions: response.data
								});
							} else {
								var failure = this.state.failure,
								    step = 'manual';
								failure['download'] = response.data.replace('OUTDATED: ', '');
								if ([401, 403].indexOf(req.status) > -1 || response.data.indexOf('OUTDATED: ') > -1) {
									step = 'failure';
								}
								this.setState({
									failure: failure,
									step: step
								});
							}
						}.bind(this));
						break;
					case 'upload':
						if (!this.refs.iframe._listened_load_event) {
							SunFwEvent.add(this.refs.iframe, 'load', function (event) {
								var responseText = event.target.contentWindow.document.body.textContent,
								    response;
								try {
									response = JSON.parse(responseText);
								} catch (e) {
									response = {
										type: 'error',
										data: responseText
									};
								}
								if (response.type == 'success') {
									var success = this.state.success;
									success.push('upload');
									this.setState({
										success: success,
										step: 'extensions',
										extensions: response.data
									});
								} else {
									var failure = this.state.failure;
									failure['upload'] = response.data;
									this.setState({
										failure: failure,
										step: 'failure'
									});
								}
							}.bind(this));
							this.refs.iframe._listened_load_event = true;
						}
						this.refs.form.setAttribute('action', server + '&action=uploadPackage');
						this.refs.form.submit();
						break;
					case 'extensions':
						if (this.state.installing != '') {
							this.refs.extensions_progress.classList.remove('hidden');
							SunFwAjax.downloadFile(server + '&action=installExtension&tool_redirect=0&id=' + this.state.installing, this.refs[this.state.installing + '_progress'], function (req) {
								this.installed_extensions ? this.installed_extensions++ : this.installed_extensions = 1;
								var percentage = Math.round(this.installed_extensions / this.total_extensions * 100);
								this.refs.extensions_progress.querySelector('[role="progressbar"]').style.width = percentage + '%';
								this.refs.extensions_progress.querySelector('.percentage').textContent = percentage + '%';
								var next = this.next(),
								    success = this.state.success,
								    failure = this.state.failure,
								    response = req.responseJSON || {
									type: 'error',
									data: req.responseText
								};
								if (response.type == 'success') {
									success.push(this.state.installing);
									if (next) {
										this.setState({
											success: success,
											installing: next
										});
									}
								} else {
									if ([401, 403].indexOf(req.status) > -1) {
										failure['extensions'] = response.data;
										return this.setState({
											failure: failure,
											step: 'failure'
										});
									}
									failure[this.state.installing] = response.data;
									this.hasExtensionNotInstalled || (this.hasExtensionNotInstalled = true);
									if (next) {
										this.setState({
											failure: failure,
											installing: next
										});
									}
								}
								if (!next) {
									if (this.hasExtensionNotInstalled) {
										failure['extensions'] = SunFwString.parse('failed-to-install-some-extensions');
									} else {
										success.push('extensions');
									}
									this.setState({
										success: success,
										failure: failure,
										step: 'import'
									});
									this.refs.extensions_progress.classList.add('hidden');
									this.refs.extensions_progress.querySelector('[role="progressbar"]').style.width = '0%';
									this.refs.extensions_progress.querySelector('.percentage').textContent = '0%';
								}
							}.bind(this));
						}
						break;
					case 'import':
						setTimeout(function () {
							SunFwAjax.request(server + '&action=importPackage', function (req) {
								var response = req.responseJSON;
								if (response.type == 'success') {
									var success = this.state.success;
									success.push('import');
									this.setState({
										success: success,
										step: 'success',
										attention: response.data.attention,
										styleId: response.data.styleId
									});
								} else {
									var failure = this.state.failure;
									failure['import'] = response.data;
									this.setState({
										failure: failure,
										step: 'failure'
									});
								}
							}.bind(this));
						}.bind(this), 10000);
						break;
					case 'success':
						if (this.parent.config.lastInstalled != this.props.sample.id) {
							this.parent.setState({
								lastInstalled: this.props.sample.id
							});
						}
						localStorage.removeItem('SunFwActiveTab');
						localStorage.removeItem('SunFwLastActiveTab');
						break;
				}
			}
		} else if (this.state.installationType === 'structure') {
			if (this.state.confirmed && this.state.step == 'structure') {
				var structureID = this.props.sample.id;
				var server = SunFw.urls.ajaxBase + '&structure_id=' + structureID;
				SunFwAjax.request(server + '&action=installStructure', function (req) {
					var response = req.responseJSON;
					if (response.type == 'success') {
						var success = this.state.success;
						success.push('apply');
						this.setState({
							success: success,
							step: 'success'
						});
						localStorage.removeItem('SunFwActiveTab');
						localStorage.removeItem('SunFwLastActiveTab');
					} else {
						var failure = this.state.failure;
						failure['apply'] = response.data;
						this.setState({
							failure: failure,
							step: 'failure'
						});
					}
				}.bind(this));
			}
		}
	},
	confirm: function (event) {
		this.setState({
			confirmed: event.target.checked
		});
	},
	next: function (event) {
		this.parent.refs.modal.refs.mountedDOMNode.querySelector('.modal-header .close').classList.add('hidden');
		if (this.state.step == 'confirm') {
			if (this.state.installationType === 'sampledata') {
				this.setState({
					step: 'download'
				});
			} else {
				this.setState({
					step: 'structure'
				});
			}
		} else if (this.state.step == 'manual') {
			this.setState({
				step: 'upload'
			});
		} else if (this.state.step == 'extensions') {
			var installing;
			for (var i = 0, n = this.state.extensions.length; i < n; i++) {
				if (this.state.extensions[i].state != 'installed' && this.refs[this.state.extensions[i].identifiedname] && this.refs[this.state.extensions[i].identifiedname].checked && this.state.installing != this.state.extensions[i].identifiedname && this.state.success.indexOf(this.state.extensions[i].identifiedname) < 0 && this.state.failure[this.state.extensions[i].identifiedname] === undefined) {
					installing = this.state.extensions[i].identifiedname;
				} else if (this.state.extensions[i].depends instanceof Array && this.state.extensions[i].depends.length) {
					for (var i2 = 0, n2 = this.state.extensions[i].depends.length; i2 < n2; i2++) {
						if (this.state.extensions[i].depends[i2].state != 'installed' && this.refs[this.state.extensions[i].depends[i2].identifiedname] && this.refs[this.state.extensions[i].depends[i2].identifiedname].checked && this.state.installing != this.state.extensions[i].depends[i2].identifiedname && this.state.success.indexOf(this.state.extensions[i].depends[i2].identifiedname) < 0 && this.state.failure[this.state.extensions[i].depends[i2].identifiedname] === undefined) {
							installing = this.state.extensions[i].depends[i2].identifiedname;
							break;
						}
					}
				}
				if (installing) {
					break;
				}
			}
			if (event) {
				if (installing) {
					this.setState({
						installing: installing
					});
				} else {
					var success = this.state.success;
					success.push('extensions');
					this.setState({
						success: success,
						step: 'import'
					});
				}
			} else {
				return installing;
			}
		}
	},
	cancel: function (event) {
		if (this.state.step == 'success') {
			this.refs.close.disabled = true;
			this.refs.close.innerHTML = SunFwString.parse('please-wait');
			this.refs.close.style.cursor = 'wait';
			var styleId = document.getElementById('jsn-style-id').value;
			if (this.state.styleId && this.state.styleId != styleId) {
				window.location.href = window.location.href.replace(styleId, this.state.styleId);
			} else {
				window.location.reload();
			}
			return;
		} else {
			this.setState({
				step: 'confirm',
				installationType: 'sampledata',
				success: [],
				failure: {},
				confirmed: false,
				attention: [],
				installing: '',
				extensions: [],
				selectedPackage: '',
				ignoredExtension: {},
				showExtensionDesc: {}
			});
		}
		this.parent.refs.modal.close();
	},
	isVisible: function (step) {
		if (this.state.step == step || this.state.success.indexOf(step) > -1 || this.state.failure[step] !== undefined) {
			return '';
		}
		return 'hidden';
	},
	getIcon: function (step) {
		if (this.state.success.indexOf(step) > -1) {
			return 'check';
		} else if (this.state.failure[step] !== undefined) {
			return 'times';
		}
		if (step == 'extensions' && this.state.installing == '') {
			return '';
		}
		if (['apply', 'import', 'upload'].indexOf(step) > -1) {
			return 'circle-o-notch fa-spin';
		}
		return '';
	},
	hasError: function (step) {
		if (this.state.failure[step] !== undefined) {
			return '';
		}
		return 'hidden';
	},
	selectPackage: function (event) {
		this.setState({
			selectedPackage: event.target.value.split(/(\\|\/)/g).pop()
		});
	},
	toggleExtension: function (id) {
		var ignoredExtension = this.state.ignoredExtension;
		if (ignoredExtension[id]) {
			delete ignoredExtension[id];
		} else {
			ignoredExtension[id] = true;
		}
		this.setState({
			ignoredExtension: ignoredExtension
		});
	},
	toggleExtensionDesc: function (id) {
		var showExtensionDesc = this.state.showExtensionDesc;
		if (showExtensionDesc[id]) {
			delete showExtensionDesc[id];
		} else {
			showExtensionDesc[id] = true;
		}
		this.setState({
			showExtensionDesc: showExtensionDesc
		});
	},
	selectInstallationType: function (event) {
		this.setState({
			installationType: event.target.value
		});
	}
});
window.SunFwPaneSampleDataUninstall = React.extendClass('SunFwPaneMixinBase', {
	getDefaultProps: function () {
		return {
			sample: {}
		};
	},
	getInitialState: function () {
		return {
			step: 'confirm',
			success: [],
			failure: {},
			confirmed: false
		};
	},
	render: function () {
		return React.createElement(
			'div',
			{ ref: 'wrapper', key: this.props.id, id: 'uninstall_sample_data_modal' },
			React.createElement(
				'div',
				{ className: this.state.step == 'confirm' ? '' : 'hidden' },
				React.createElement(
					'div',
					{ className: 'alert alert-warning' },
					React.createElement(
						'span',
						{ className: 'label label-danger' },
						SunFwString.parse('important-notice')
					),
					React.createElement(
						'ul',
						null,
						React.createElement(
							'li',
							null,
							SunFwString.parse('uninstall-sample-notice')
						)
					)
				)
			),
			React.createElement(
				'div',
				{ className: this.state.step != 'confirm' ? '' : 'hidden' },
				React.createElement(
					'p',
					{ className: this.state.step == 'success' ? 'hidden' : '' },
					SunFwString.parse('uninstall-sample-processing')
				),
				React.createElement(
					'ul',
					{ className: this.state.step == 'success' ? 'hidden' : '' },
					React.createElement(
						'li',
						null,
						React.createElement(
							'span',
							{ className: 'title' },
							SunFwString.parse('restore-backed-up-data')
						),
						React.createElement('span', { className: 'fa fa-' + this.getIcon('restore') }),
						React.createElement('div', { ref: 'restore_alert', className: 'alert alert-danger ' + this.hasError('restore') })
					)
				),
				React.createElement(
					'div',
					{ className: 'success-message ' + this.isVisible('success') },
					React.createElement(
						'p',
						null,
						SunFwString.parse('uninstall-sample-success')
					)
				),
				React.createElement(
					'div',
					{ className: 'failure-message ' + this.isVisible('failure') },
					React.createElement(
						'p',
						null,
						SunFwString.parse('uninstall-sample-failure')
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'modal-footer' + (this.state.step == 'confirm' || this.state.step == 'success' || this.state.step == 'failure' ? '' : ' hidden') },
				React.createElement(
					'div',
					{ className: this.state.step == 'confirm' ? 'checkbox' : 'checkbox hidden' },
					React.createElement(
						'label',
						null,
						React.createElement('input', {
							type: 'checkbox',
							name: 'agree',
							value: '1',
							onClick: this.confirm
						}),
						SunFwString.parse('uninstall-sample-confirm')
					)
				),
				React.createElement(
					'div',
					{ className: 'actions' + (this.state.step == 'confirm' || this.state.step == 'success' || this.state.step == 'failure' ? '' : ' hidden') },
					React.createElement(
						'button',
						{
							type: 'button',
							onClick: this.uninstall,
							disabled: this.state.confirmed ? false : true,
							className: 'btn btn-primary' + (this.state.step == 'success' || this.state.step == 'failure' ? ' hidden' : '')
						},
						SunFwString.parse('continue')
					),
					React.createElement(
						'button',
						{
							ref: 'close',
							type: 'button',
							onClick: this.cancel,
							className: 'btn btn-default'
						},
						SunFwString.parse(this.state.step == 'success' || this.state.step == 'failure' ? 'close' : 'cancel')
					)
				)
			)
		);
	},
	initActions: function () {
		if (this.state.confirmed) {
			var server = this.editor.props.url + '&sample_package=' + this.props.sample.id;
			switch (this.state.step) {
				case 'restore':
					SunFwAjax.request(server + '&action=restoreBackup', function (req) {
						var response = req.responseJSON;
						if (response.type == 'success') {
							var success = this.state.success;
							success.push('restore');
							this.setState({
								success: success,
								step: 'success',
								lastInstalled: response.data
							});
						} else {
							var failure = this.state.failure;
							failure['restore'] = response.data;
							this.setState({
								failure: failure,
								step: 'failure'
							});
						}
					}.bind(this));
					break;
				case 'success':
					if (this.parent.config.lastInstalled != this.state.lastInstalled) {
						this.parent.config.lastInstalled = this.state.lastInstalled;
						this.parent.forceUpdate();
					}
					break;
			}
			for (var step in this.state.failure) {
				this.refs[step + '_alert'].innerHTML = this.state.failure[step];
			}
		}
	},
	confirm: function (event) {
		this.setState({
			confirmed: event.target.checked
		});
	},
	uninstall: function (event) {
		this.parent.refs.modal.refs.mountedDOMNode.querySelector('.modal-header .close').classList.add('hidden');
		this.setState({
			step: 'restore'
		});
	},
	cancel: function (event) {
		if (this.state.step == 'success') {
			this.refs.close.disabled = true;
			this.refs.close.innerHTML = SunFwString.parse('please-wait');
			this.refs.close.style.cursor = 'wait';
			window.location.href = window.location.href.substr(0, window.location.href.indexOf('&view='));
			return;
		}
		this.parent.refs.modal.close();
	},
	isVisible: function (step) {
		if (this.state.step == step || this.state.success.indexOf(step) > -1 || this.state.failure[step] !== undefined) {
			return '';
		}
		return 'hidden';
	},
	getIcon: function (step, isExt) {
		if (this.state.success.indexOf(step) > -1) {
			return 'check';
		} else if (this.state.failure[step] !== undefined) {
			return 'times';
		}
		if (step == 'extensions' && this.state.installing == '') {
			return '';
		}
		if (isExt) {
			return this.state.installing == step ? 'circle-o-notch fa-spin' : '';
		}
		return 'circle-o-notch fa-spin';
	},
	hasError: function (step) {
		if (this.state.failure[step] !== undefined) {
			return '';
		}
		return 'hidden';
	}
});
