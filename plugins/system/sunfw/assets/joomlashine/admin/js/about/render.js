window.SunFwPaneAbout = React.extendClass('SunFwPaneMixinEditor', {
	getDefaultProps: function () {
		return {
			id: '',
			url: SunFw.urls.ajaxBase + SunFw.urls.getPaneAbout
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
						{ className: 'col-xs-12 col-md-8 col-md-offset-2' },
						React.createElement(
							'div',
							{ className: 'panel panel-default' },
							React.createElement(
								'div',
								{ className: 'panel-body' },
								React.createElement(
									'div',
									{ className: 'sunfw-about-page' },
									React.createElement(
										'div',
										{ className: 'row' },
										React.createElement(
											'div',
											{ className: 'col-sm-6 col-md-6' },
											React.createElement(
												'h2',
												null,
												SunFwString.parse('framework')
											),
											React.createElement(
												'div',
												{ className: 'thumbnail' },
												React.createElement(
													'a',
													{
														href: this.props.doc.refs.footer.state.credits.framework.link,
														target: '_blank',
														rel: 'noopener noreferrer'
													},
													React.createElement('img', { src: this.config.frameworkThumb })
												),
												React.createElement(
													'div',
													{ className: 'caption' },
													React.createElement(
														'h3',
														null,
														React.createElement(
															'a',
															{
																href: this.props.doc.refs.footer.state.credits.framework.link,
																target: '_blank',
																rel: 'noopener noreferrer'
															},
															this.props.doc.refs.footer.state.credits.framework.name
														)
													),
													React.createElement(
														'div',
														{ className: 'about-framework-update' },
														React.createElement(
															'p',
															{ className: 'version sunfw-version-info' },
															SunFwString.parse('version') + ': ' + this.props.doc.refs.footer.state.credits.framework.version,
															'\xA0',
															this.props.doc.refs.update.data.framework.hasUpdate ? React.createElement(
																'span',
																{ className: 'update-available' },
																'(',
																React.createElement(
																	'a',
																	{
																		href: '#',
																		className: 'sunfw-update-link',
																		id: 'sunfw-about-update-framework-link',
																		'data-target': 'framework',
																		onClick: this.props.doc.refs.update.update
																	},
																	SunFwString.parse('update-available')
																),
																')'
															) : React.createElement(
																'span',
																{ className: 'version-latest' },
																'(',
																SunFwString.parse('latest-version'),
																')'
															)
														),
														React.createElement(
															'p',
															{ className: 'about-released-date' },
															SunFwString.parse('release-date') + ': ' + this.config.frameworkRelease
														),
														React.createElement(
															'p',
															{ className: 'about-copyright' },
															SunFwString.parse('copyright-by') + ': ',
															React.createElement(
																'a',
																{ href: 'http://joomlashine.com/' },
																'www.JoomlaShine.com'
															)
														)
													)
												)
											)
										),
										React.createElement(
											'div',
											{ className: 'col-sm-6 col-md-6' },
											React.createElement(
												'h2',
												null,
												SunFwString.parse('template')
											),
											React.createElement(
												'div',
												{ className: 'thumbnail' },
												React.createElement(
													'a',
													{
														href: this.props.doc.refs.footer.state.credits.template.link,
														target: '_blank',
														rel: 'noopener noreferrer'
													},
													React.createElement('img', { src: this.config.templateThumb })
												),
												React.createElement(
													'div',
													{ className: 'caption' },
													React.createElement(
														'h3',
														null,
														React.createElement(
															'a',
															{
																href: this.props.doc.refs.footer.state.credits.template.link,
																target: '_blank',
																rel: 'noopener noreferrer'
															},
															this.props.doc.refs.footer.state.credits.template.name + ' ' + this.props.doc.refs.footer.state.credits.template.edition
														)
													),
													React.createElement(
														'div',
														{ className: 'template-update about-template-update' },
														React.createElement(
															'p',
															{ className: 'version sunfw-version-info' },
															SunFwString.parse('version') + ': ' + this.props.doc.refs.footer.state.credits.template.version,
															'\xA0',
															this.props.doc.refs.update.data.template.hasUpdate ? React.createElement(
																'span',
																{ className: 'update-available' },
																'(',
																React.createElement(
																	'a',
																	{
																		href: '#',
																		className: 'sunfw-update-link',
																		id: 'sunfw-about-update-template-link',
																		'data-target': 'template',
																		onClick: this.props.doc.refs.update.update
																	},
																	SunFwString.parse('update-available')
																),
																')'
															) : React.createElement(
																'span',
																{ className: 'version-latest' },
																'(',
																SunFwString.parse('latest-version'),
																')'
															)
														),
														React.createElement(
															'p',
															{ className: 'about-released-date' },
															SunFwString.parse('release-date') + ': ' + this.config.templateRelease
														),
														React.createElement(
															'p',
															{ className: 'about-copyright' },
															SunFwString.parse('copyright-by') + ': ',
															React.createElement(
																'a',
																{ href: 'http://joomlashine.com/' },
																'www.JoomlaShine.com'
															)
														)
													)
												)
											)
										)
									)
								)
							)
						)
					)
				)
			)
		);
	},
	preloadAssets: function () {
		if (!this._listenedUpdateDataFetched) {
			SunFwEvent.add(this.props.doc, 'UpdateDataFetched', this.update);
			this._listenedUpdateDataFetched = true;
		}
	},
	update: function () {
		this.forceUpdate();
	}
});
