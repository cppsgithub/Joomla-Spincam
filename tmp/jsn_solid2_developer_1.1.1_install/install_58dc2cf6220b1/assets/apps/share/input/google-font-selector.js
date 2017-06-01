/**
 * @version    $Id$
 * @package    SUN Framework
 * @subpackage Layout Builder
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

window.SunFwInputGoogleFontSelector = React.createClass({
	mixins: [SunFwMixinBase, SunFwMixinInput],

	getInitialState: function () {
		return {
			fonts: [],
			category: '',
			subset: '',
			search: '',
			page: 1,
			value: {
				family: '',
				subset: ''
			},
		};
	},

	handleComponentWillMount: function (state) {
		if (( state.fonts && state.fonts.length ) || ( this.state.fonts && this.state.fonts.length )) {
			return state;
		}

		// Load Chosen.
		this.initChosen(true);

		// Get template data.
		var token = document.querySelector('#jsn-tpl-token').value,
			styleID = document.querySelector('#jsn-style-id').value,
			templateName = document.querySelector('#jsn-tpl-name').value;

		// Prepare server to load list of Google fonts.
		var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=styles&'
			+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=getGoogleFonts';

		// Send request to load Google fonts data.
		SunFwHelper.requestUrl(
			server,
			function (req) {
				var response;

				try {
					response = JSON.parse(req.responseText);
				} catch (e) {
					response = {
						type: 'error',
						data: req.responseText
					};
				}

				if (response && response.type == 'success') {
					// Update state.
					this.setState({
						fonts: response.data.items
					});
				} else {
					bootbox.alert(response.data);
				}
			}.bind(this)
		);

		return state;
	},

	render: function () {
		// Prepare value for backward compatible.
		if ( typeof this.state.value == 'string' ) {
			this.state.value = {
				family: this.state.value
			}
		}

		// Filter Google fonts by the currently selected subset.
		if ( this.state.value.subset !== undefined ) {
			this.state.subset = this.state.value.subset;
		}

		// Get all available categories and subsets.
		this.total = this.state.fonts.length;

		if (!this.state.categories || !this.state.subsets) {
			this.state.categories = [];
			this.state.subsets = [];
		}

		this.state.fonts.map((font, idx) => {
			// Store available categories.
			if (this.state.categories.indexOf(font.category) < 0) {
				this.state.categories.push(font.category);
			}

			// Store available subsets.
			font.subsets.map((subset) => {
				if (this.state.subsets.indexOf(subset) < 0) {
					this.state.subsets.push(subset);
				}
			});

			// Count the number of font that match current filters.
			this.state.fonts[idx].visible = true;

			if (this.state.category != '') {
				if (font.category != this.state.category) {
					this.total--;

					// State that font is invisible.
					this.state.fonts[idx].visible = false;
				}
			}

			if (this.state.subset != '' && this.state.fonts[idx].visible) {
				if (font.subsets.indexOf(this.state.subset) < 0) {
					this.total--;

					// State that font is invisible.
					this.state.fonts[idx].visible = false;
				}
			}

			if (this.state.search != '' && this.state.fonts[idx].visible) {
				if (font.family.toLowerCase().indexOf(this.state.search.toLowerCase()) < 0) {
					this.total--;

					// State that font is invisible.
					this.state.fonts[idx].visible = false;
				}
			}
		});

		// Generate variant selector.
		var variant_selector = [], selected = this.state.value.family.split(':');

		selected = selected[1] ? selected[1].split(',') : [];

		selected.map((variant) => {
			// Prepare variant label.
			var label = variant;

			if (label.match(/^(\d+)([a-z]+)$/)) {
				label = label.replace(/^(\d+)([a-z]+)$/, '$1 $2');
			}

			// Show only numeric and 'normal' value.
			if (!/[a-zA-Z]/.test(label)) {
				label = SunFwHelper.toCamelCase(label, true, ' ');

				variant_selector.push(
					<option value={ variant } selected={ variant == this.state.value.variant }>
						{ label }
					</option>
				);

			} else if (variant == 'regular') {
				var fontWeight = 'normal';

				variant_selector.push(
					<option value={ fontWeight } selected={ fontWeight == this.state.value.variant }>
						{ sunfw.text['normal'] }
					</option>
				);
			}
		});

		if (variant_selector.length) {
			variant_selector = (
				<div className="form-group">
					<label>{ sunfw.text['google-font-variant'] }</label>

					<select
						ref="selector"
						name="variant"
						onChange={ this.change }
						className="form-control"
					>
						{ variant_selector }
					</select>
				</div>
			);
		}

		return (
			<div
				key={ this.props.id }
				ref="wrapper"
			>
				<div className="form-group">
					<label>
						{ sunfw.text[ this.props.control.label ] || this.props.control.label }
						{ this.parent.tooltip }
					</label>

					<div className="input-group snfw-input-popup">
						<input
							id={ this.props.id }
							ref="field"
							value={
								this.state.value.family + (
									this.state.value.subset
									? ' ' + sunfw.text['google-font-subset'].replace(
										'%s',
										SunFwHelper.toCamelCase(this.state.value.subset, true, ' ')
									)
									: ''
								)
							}
							disabled="disabled"
							className="form-control"
						/>
						<span className="input-group-addon">
							<a href="#" onClick={ this.selectFont }>
								...
							</a>
						</span>
						<span className="input-group-addon">
							<a href="#" onClick={ this.resetState }>
								<i className="fa fa-remove"></i>
							</a>
						</span>
					</div>
				</div>

				{ variant_selector }
			</div>
		);
	},

	handleInitActions: function () {
		if (this.refs.wrapper) {
			// Init Chosen for select box.
			if (this.refs.selector) {
				this.initChosen();
			}

			// Update modal content.
			if (this.modal && this.modal.refs.modal.style.display == 'block') {
				this.modal.setState({
					content: this.renderModal()
				});
			}

			// Detect the visibility of Google font selector.
			var parent = this.refs.wrapper.parentNode, parent_css = window.getComputedStyle(parent), visible = true;

			while (visible && parent.nodeName != 'BODY') {
				if (parent_css.getPropertyValue('display') != 'none') {
					parent = parent.parentNode;
					parent_css = window.getComputedStyle(parent);
				} else {
					visible = false;
				}
			}

			// Whether to automatically open the modal to select Google font.
			if (this.lastVisibility == 'hidden' && visible && this.state.value.family == '') {
				this.selectFont();
			}

			this.lastVisibility = visible ? '' : 'hidden';
		}
	},

	selectFont: function (event) {
		event && event.preventDefault();

		// Backup current state.
		this.last_value = this.last_value || JSON.parse(JSON.stringify(this.state.value));

		// Get a modal to show form.
		this.modal = this.editor.getModal({
			id: 'google_font_selector_modal',
			title: 'google-font-selector',
			height: '90%',
			type: 'html',
			content: this.renderModal(),
			buttons: [
				{
					text: 'ok',
					onClick: function () {
						// Save change.
						this.parent.change(this.props.setting, this.state.value);

						// Clear last value.
						delete this.last_value;

						// Then, close the modal.
						this.closeModal();
					}.bind(this),
					className: 'btn btn-primary'
				},
				{
					text: 'cancel',
					onClick: function () {
						// Reset state.
						this.setState({
							value: this.last_value
						});

						// Then, close modal.
						this.closeModal();
					}.bind(this),
					className: 'btn btn-default'
				}
			],
			'class': 'fixed'
		});

		// Handle scroll event.
		setTimeout(function () {
			var modal_body = this.modal.refs.modal.querySelector('.modal-body');

			if (!modal_body._listened_scroll_event) {
				modal_body.addEventListener('scroll', this.scroll);

				modal_body._listened_scroll_event = true;
			}
		}.bind(this), 100);
	},

	renderModal: function () {
		return (
			<div className="container-fluid">
				<div className="clearfix header-find-font">
					<div className="form-inline pull-left">
						<div className="form-group">
							<select
								name="category"
								onChange={ this.filterGoogleFonts }
								className="form-control"
							>
								<option value="">{ sunfw.text['google-font-categories'] }</option>
								{ this.state.categories.map((category) => {
									return (
										<option
											value={ category }
											selected={ this.state.category == category }
										>
											{ SunFwHelper.toCamelCase(category, true, ' ') }
										</option>
									);
								}) }
							</select>
						</div>
						<div className="form-group">
							<select
								name="subset"
								onChange={ this.filterGoogleFonts }
								className="form-control"
							>
								<option value="">{ sunfw.text['google-font-subsets'] }</option>
								{ this.state.subsets.map((subset) => {
									return (
										<option
											value={ subset }
											selected={ this.state.subset == subset }
										>
											{ SunFwHelper.toCamelCase(subset, true, ' ') }
										</option>
									);
								}) }
							</select>
						</div>
						<span className="total-fonts">
							{ sunfw.text['google-font-total'].replace('%TOTAL%', this.total) }
						</span>
					</div>
					<div className="form-inline pull-right">
						<div className="form-group">
							<input
								name="search"
								value={ this.state.search }
								onChange={ this.filterGoogleFonts }
								className="form-control"
								placeholder={ sunfw.text['google-font-search'] }
							/>
						</div>
					</div>
				</div>
				<div className="row">
					{ this.renderFonts() }
				</div>
			</div>
		);
	},

	renderFonts: function () {
		var fonts = [], count = 0, selected = this.state.value.family.split(':');

		for (var i = 0; i < this.state.fonts.length; i++) {
			var font = this.state.fonts[i];

			if (font.visible) {
				count++;

				// Load font for previewing.
				var name = font.family.replace(/[^a-zA-Z0-9]+/g, ''),
					style = document.getElementById('sunfw-google-font-' + name);


				if (font.files.regular && !style) {
					style = document.createElement('style');
					style.id = 'sunfw-google-font-' + name;
					style.type = 'text/css';
					var font_regular = font.files.regular.replace('http:', '');
					style.textContent = '@font-face { font-family: "' + font.family + '"; src: url(' + font_regular + '); }';

					document.head.appendChild(style);
				}

				// Define preview style.
				var style = {
					'font-family': font.family
				};

				// Render available font variants.
				var variants = [];

				if (selected[0] == font.family) {
					var selected_variants = selected[1] ? selected[1].split(',') : [];

					variants = (
						<div className="font-variants">
							{ font.variants.map((variant) => {
								// Prepare variant label.
								var label = variant;

								if (label.match(/^(\d+)([a-z]+)$/)) {
									label = label.replace(/^(\d+)([a-z]+)$/, '$1 $2');
								}

								label = SunFwHelper.toCamelCase(label, true, ' ');

								// Render variant option.
								return (
									<div className="checkbox">
										<label>
											<input
												name="variants"
												type="checkbox"
												value={ variant }
												checked={ selected_variants.indexOf(variant) > -1 }
												onClick={ this.updateGoogleFontVariants }
											/>
											{ label }
										</label>
									</div>
								);
							}) }
						</div>
					);
				}

				fonts.push(
					<div className="col-xs-3" style={ {clear: count % 4 == 1 ? 'both' : ''} }>
						<div className="radio">
							<label className={ selected[0] == font.family ? 'checked' : '' }>
								<input
									name="family"
									type="radio"
									value={ font.family }
									onClick={ this.change }
									checked={ selected[0] == font.family ? 'checked' : '' }
								/>
								<span style={ style }>{ font.family }</span>
							</label>
						</div>
						<div className="font-preview">
							<p style={ style }>
								The quick brown fox jumps over the lazy dog.
							</p>
						</div>
						{ variants }
					</div>
				);

				if (count >= this.state.page * 30) {
					break;
				}
			}
		}

		return fonts;
	},

	filterGoogleFonts: function (event) {
		// Filter fonts list.
		var state = {from: 0};

		if (event.target.nodeName == 'SELECT') {
			state[event.target.name] = event.target.options[event.target.selectedIndex].value;
		} else {
			state[event.target.name] = event.target.value;
		}

		// Store subset to field value.
		if (event.target.name == 'subset') {
			var value = this.state.value;

			value.subset = event.target.value;

			state.value = value;
		}

		this.setState(state);
	},

	updateGoogleFontVariants: function (event) {
		// Get container.
		var container = event.target.parentNode;

		while (!container.classList.contains('font-variants') && container.nodeName != 'BODY') {
			container = container.parentNode;
		}

		// Find all selected font variants.
		var variants = container.querySelectorAll('input[name="variants"]'),
			value = this.state.value;

		value.family = value.family.split(':')[0];

		for (var i = 0; i < variants.length; i++) {
			if (variants[i].checked) {
				value.family += ( value.family.indexOf(':') > 0 ? ',' : ':' ) + variants[i].value;
			}
		}

		// Force update variant selector.
		this.changed = true;

		// Update state.
		this.setState({
			value: value,
		});
	},

	closeModal: function () {
		var modal_body = this.modal.refs.modal.querySelector('.modal-body');

		if (modal_body._listened_scroll_event) {
			delete modal_body._listened_scroll_event;

			modal_body.removeEventListener('scroll', this.scroll);
		}

		this.modal.close();
	},

	scroll: function (event) {
		// Load more fonts.
		this.timeout && clearTimeout(this.timeout);

		this.timeout = setTimeout(function () {
			this.setState({
				page: this.state.page + 1
			});
		}.bind(this), 1000);
	},

	change: function (event) {
		var value = this.state.value;

		if (arguments[0] == 'variant') {
			value[arguments[0]] = arguments[1];

			// Save change immediately.
			this.parent.change(this.props.setting, this.state.value);
		} else {
			value[event.target.name] = event.target.value;

			// Update state.
			this.setState({
				value: value,
			});
		}
	}
});
