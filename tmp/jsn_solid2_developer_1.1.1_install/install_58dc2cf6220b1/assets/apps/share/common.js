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

window.SunFwActivity = React.createClass({
    mixins: [SunFwMixinBase],

    getInitialState: function () {
        return {
            activities: [],
            index: -1,
            count: 0
        };
    },

    render: function () {
        return (
            <div className="display-inline btn-group" role="group">
                <button
                    ref="undo"
                    type="button"
                    disabled="disabled"
                    className="btn btn-default"
                    title={this.state.index + ' changed'}
                >
                    <i className="fa fa-undo" aria-hidden="true"> </i>
                </button>
                <button
                    ref="redo"
                    type="button"
                    disabled="disabled"
                    className="btn btn-default"
                    title={(this.state.activities.length - this.state.index - 1) + ' changed'}
                >
                    <i className="fa fa-repeat" aria-hidden="true"> </i>
                </button>
            </div>
        );
    },

    handleComponentDidMount: function () {
        // Store initial editor state.
        this.state.activities[++this.state.index] = {
            data: this.editor.getData(),
            state: JSON.parse(JSON.stringify(this.editor.state)),
            current: JSON.parse(JSON.stringify(this.editor.current))
        };

        // Setup undo action.
        this.refs.undo.addEventListener('click', this.undo);

        // Setup redo action.
        this.refs.redo.addEventListener('click', this.redo);
    },

    handleComponentDidUpdate: function () {
        if (!this.undoing && !this.redoing) {
            // Get current data.
            var current = {
                data: this.editor.getData(),
                state: JSON.parse(JSON.stringify(this.editor.state)),
                current: JSON.parse(JSON.stringify(this.editor.current))
            };

            // Check if activity should be logged.
            if (this.editor.log_activity == true) {
                // Make sure data is really changed.
                var last = this.state.activities[this.state.index],
                    changed = !last;

                if (last) {
                    for (var p in current.data) {
                        if (current.data.hasOwnProperty(p)) {
                            if (typeof current.data[p] == 'object') {
                                if (JSON.stringify(current.data[p]) != JSON.stringify(last.data[p])) {
                                    changed = true;

                                    break;
                                }
                            }

                            else if (current.data[p] != last.data[p]) {
                                changed = true;

                                break;
                            }
                        }
                    }
                }

                if (changed) {
                    // Truncate activity logs if possible.
                    if (this.state.index + 1 < this.state.activities.length) {
                        this.state.activities.splice(
                            this.state.index + 1,
                            this.state.activities.length - this.state.index - 1
                        );
                    }

                    // Store changed data.
                    this.state.activities.push(current);

                    // Increase current activity index.
                    this.state.index++;

                    if (this.editor.log_activity) {
                        // Clear activity log status.
                        this.editor.log_activity = false;

                        // State that data is changed.
                        if (!this.editor.state.changed) {
                            this.editor.setState({changed: true});
                        }
                    }
                }

                else {
                    this.state.activities[this.state.index] = current;
                }
            }

            else {
                this.state.activities[this.state.index] = current;
            }
        }

        else {
            if (this.undoing) {
                this.undoing = false;
            } else {
                this.redoing = false;
            }
        }

        // Update undo button state.
        this.refs.undo.disabled = !( this.state.index > 0 );


        // Update redo button state.
        this.refs.redo.disabled = !( this.state.index + 1 < this.state.activities.length )

    },

    /**
     * De-register event handlers when un-mounting component.
     *
     * @return void
     */
    handleComponentWillUnmount: function () {
        // Remove undo action.
        this.refs.undo.removeEventListener('click', this.undo);

        // Remove redo action.
        this.refs.redo.removeEventListener('click', this.redo);
    },

    undo: function () {
        if (!this.refs.undo.disabled) {
            this.undoing = true;

            // Decrease the current activity index.
            this.state.index--;

            // Prepare data.
            var activity = JSON.parse(JSON.stringify(this.state.activities[this.state.index]));

            if (this.state.index == 0) {
                activity.state.changed = false;
            }

            this.change(activity);
        }
    },

    redo: function () {
        if (!this.refs.redo.disabled) {
            this.redoing = true;

            // Increase the current activity index.
            this.state.index++;

            // Prepare data.
            var activity = JSON.parse(JSON.stringify(this.state.activities[this.state.index]));

            this.change(activity);
        }
    },

    change: function (activity) {
        // Set editor data.
        this.editor.setData(activity.data);

        // Update editor state.
        this.editor.setState(activity.state);

        // Select last edited item.
        if (this.editor.selectItem && activity.current && activity.current.editing !== undefined) {
            this.editor.selectItem(activity.current.editing, true);
        }
    },

    reset: function () {
        this.setState(this.getInitialState());
    }
});
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

window.SunFwForm = React.createClass( {
	mixins: [ SunFwMixinBase ],

	getInitialState: function() {
		return {
			ref: null,
			form: {},
			values: {},
			inline: true,
			emptyClass: 'text-center',
			emptyMessage: ( <span className="fa fa-2x fa-circle-o-notch fa-spin"></span> )
		};
	},

	render: function() {
		// Prepare form data.
		if ( this.state.form === undefined ) {
			this.state.form = {};
		}

		// Generate HTML for form controls.
		var form = [], keyName;

		if ( this.state.form.html ) {
			form.push( this.state.form.html );
		}

		else if ( this.state.form.rows ) {
			this.state.form.rows.map( ( row ) => {
				var cols = [], rowClass = 'row ' + ( row['class'] ? row['class'] : '' ), rowTitle;

				if ( row.cols ) {
					row.cols.map( ( col ) => {
						var controls = [], colClass = col['class'] ? col['class'] : '', value, colTitle;

						if ( col.settings ) {
							for ( var setting in col.settings ) {
								keyName = this.state.ref.props.id + '_' + setting;

								if ( this.state.values && this.state.values[ setting ] !== undefined ) {
									value = this.state.values[ setting ];
								} else if ( col.settings[ setting ]['default'] !== undefined ) {
									value = col.settings[ setting ]['default'];
								} else {
									value = '';
								}

								// Render form control.
								controls.push(
									<SunFwFormControl
										id={ keyName }
										key={ this.editor.props.id + '_' + keyName }
										ref={ keyName }
										value={ value }
										parent={ this }
										editor={ this.editor }
										setting={ setting }
										control={ col.settings[ setting ] }
									/>
								);

								// Store detected control value to state.
								this.state.values[ setting ] = value;
							}
						}

						// Render column title.
						if ( col.title ) {
							colTitle = (
								<div className="column-title">
									<h4>
										{ sunfw.text[ col.title ] ? sunfw.text[ col.title ] : col.title }
									</h4>
									<hr />
								</div>
							);
						}

						// Render column.
						cols.push(
							<div className={ colClass + ( this.isVisible( col.requires ) ? '' : ' hidden' ) }>
								{ colTitle }
								{ controls }
							</div>
						);
					} );
				}

				// Render row title.
				if ( row.title ) {
					rowTitle = (
						<div className="col-xs-12 row-title">
							<h4>
								{ sunfw.text[ row.title ] ? sunfw.text[ row.title ] : row.title }
							</h4>
							<hr />
						</div>
					);
				}

				// Render row.
				form.push(
					<div className={ rowClass + ( this.isVisible( row.requires ) ? '' : ' hidden' ) }>
						{ rowTitle }
						{ cols }
					</div>
				);
			} );
		}

		// If form is empty, show a notice message.
		if ( ! form.length ) {
			// Prepare empty form message.
			var message = this.state.emptyMessage;

			if ( sunfw.text[ message ] ) {
				message = sunfw.text[ message ];
			}

			return (
				<div ref="form" className={ this.state.emptyClass }>
					{ message }
				</div>
			);
		}

		// Generate HTML for item toolbar.
		var toolbar;

		if ( this.state.toolbar ) {
			toolbar = (
				<ul className="pull-right list-inline manipulation-actions margin-0 item-action">
					<li>
						<a href="#" onClick={ this.state.ref.toggleItem }>
							<i className="fa fa-eye"></i>
						</a>
					</li>
					<li>
						<a href="#" onClick={ this.state.ref.cloneItem }>
							<i className="fa fa-files-o"></i>
						</a>
					</li>
					<li>
						<a href="#" onClick={ this.state.ref.deleteItem }>
							<i className="fa fa-trash"></i>
						</a>
					</li>
				</ul>
			);
		}

		// Generate HTML for form title.
		var formTitle;

		if ( toolbar || this.state.form.title ) {
			// Prepare form title.
			var className = 'clearfix sidebar-heading border-bottom padding-top-15 padding-bottom-15',
				title = this.state.form.title;

			if ( typeof title  == 'string' ) {
				className += ' ' + title.replace( /[^a-zA-Z0-9\-_]+/g, '-' ).toLowerCase();

				title = (
					<span className="form-title">
						{ sunfw.text[ title ] ? sunfw.text[ title ] : title }
					</span>
				);
			}

			formTitle = (
				<div className={ className }>
					{ title }
					{ toolbar }
				</div>
			);
		}

		// Return HTML for form element.
		return (
			<div ref="form">
				{ formTitle }
				<div className={ this.state.form['class'] ? this.state.form['class'] : '' }>
					{ form }
				</div>
			</div>
		);
	},

	/**
	 * Init interactions.
	 *
	 * @return void
	 */
	initActions: function() {
		// Disable saving settings instantly when typing on text-based field.
		var inputs = this.refs.form.querySelectorAll( 'input, textarea' );

		for ( var i = 0; i < inputs.length; i++ ) {
			var input = inputs[ i ];

			if ( input.nodeName == 'TEXTAREA' || ['number', 'text'].indexOf(input.type) > -1 ) {
				if ( ! input._input_field_initialized ) {
					input.addEventListener( 'focus', this.focus );
					input.addEventListener( 'blur', this.blur );

					input._input_field_initialized = true;
				}
			}
		}
	},

	/**
	 * De-init interactions.
	 *
	 * @return void
	 */
	handleComponentWillUnmount: function() {
		var inputs = this.refs.form.querySelectorAll( 'input, textarea' );

		for ( var i = 0; i < inputs.length; i++ ) {
			var input = inputs[ i ];

			if ( input.nodeName == 'TEXTAREA' || ['number', 'text'].indexOf(input.type) > -1 ) {
				if ( input._input_field_initialized ) {
					input.removeEventListener( 'focus', this.focus );
					input.removeEventListener( 'blur', this.blur );

					delete input._input_field_initialized;
				}
			}
		}
	},

	/**
	 * Handle focus event on input field.
	 *
	 * @return void
	 */
	focus: function( event ) {
		if ( this.state.inline ) {
			// Check if focus is changed?
			if ( this.lastHasFocus && this.lastHasFocus != event.target ) {
				// Allow saving settings instantly.
				this.skipSaving = false;
			} else {
				this.lastHasFocus = event.target;
			}

			if (
				( event.target.type && ['checkbox', 'hidden', 'radio'].indexOf( event.target.type ) < 0 )
				||
				event.target.nodeName == 'TEXTAREA'
			) {
				// Prevent saving settings instantly.
				this.skipSaving = true;
			} else {
				// Allow saving settings instantly.
				this.skipSaving = false;
			}
		}
	},

	/**
	 * Handle blur event on input field.
	 *
	 * @return void
	 */
	blur: function( event ) {
		if ( this.state.inline ) {
			if (
				( event.target.type && ['checkbox', 'hidden', 'radio'].indexOf( event.target.type ) < 0 )
				||
				event.target.nodeName == 'TEXTAREA'
			) {
				// Allow saving settings instantly.
				this.skipSaving = false;

				// Save settings immediately.
				this.saveSettings();
			}
		}
	},

	isVisible: function( requires ) {
		// Check if the visibility of form control depends on any certain setting.
		var visible = true;

		if ( requires ) {
			for ( var p in requires ) {
				if ( ! visible ) {
					return;
				}

				if ( requires.hasOwnProperty( p ) ) {
					if ( ['string', 'number'].indexOf( typeof requires[ p ] ) > -1 ) {
						if ( ! isNaN( parseInt( requires[ p ] ) ) ) {
							if ( parseInt( requires[ p ] ) != parseInt( this.state.values[ p ] ) ) {
								visible = false;
							}
						} else if ( requires[ p ] != this.state.values[ p ] ) {
							visible = false;
						}
					}

					else if ( requires[ p ] instanceof Array ) {
						// Compare value based on the specified operator.
						switch ( requires[ p ][0] ) {
							case '=':
							case '==':
								if ( this.state.values[ p ] != requires[ p ][1] ) {
									visible = false;
								}
							break;

							case '!=':
							case '<>':
								if ( this.state.values[ p ] == requires[ p ][1] ) {
									visible = false;
								}
							break;
						}
					}
				}
			}
		}

		return visible;
	},

	updateState: function( setting, value ) {
		var values = this.state.values;

		// Make sure values is an object.
		if ( ! values || values instanceof Array ) {
			values = {};
		}

		values[ setting ] = value;

		// If the related component has own method to update state, call it.
		if ( this.state.ref.updateState ) {
			this.state.ref.updateState( values );
		}

		// Update form.
		if ( ! this.skipSaving ) {
			this.setState( { values: values } );
		}

		// Save settings immediately if this is an inline form.
		if ( this.state.inline ) {
			this.saveSettings( values );
		}
	},

	saveSettings: function( values, force ) {
		if ( force || ! this.skipSaving ) {
			values = values || this.state.values;

			// If the related component has own method to save settings, call it.
			if ( this.state.ref.saveSettings ) {
				this.state.ref.saveSettings( values );
			}

			// Otherwise, let the editor save settings.
			else {
				this.editor.saveItemSettings( this.state.ref, values );
			}
		}
	}
} );

window.SunFwFormControl = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: this.props.value
		};
	},

	handleComponentWillReceiveProps: function( newProps, state ) {
		state.value = newProps.value;

		return state;
	},

	handleComponentWillMount: function( state ) {
		if ( this.props.control.type == 'select' ) {
			if ( this.props.control.chosen === undefined || this.props.control.chosen ) {
				// Load Chosen.
				this.initChosen( true );
			}
		}

		return state;
	},

	render: function() {
		// Prepare form control attributes.
		var formControl, label = this.props.control.label, description = this.props.control.description;

		if ( sunfw.text[ label ] ) {
			label = sunfw.text[ label ];
		}

		if ( sunfw.text[ description ] ) {
			description = sunfw.text[ description ];
		}

		// Render tooltip if has.
		this.tooltip = '';

		if ( this.props.control.hint || sunfw.text[ this.props.control.label + '-hint' ] ) {
			this.tooltip = (
				<span className="has-tooltip" data-content={
					this.props.control.hint
					? ( sunfw.text[ this.props.control.hint ] ? sunfw.text[ this.props.control.hint ] : this.props.control.hint )
					: sunfw.text[ this.props.control.label + '-hint' ]
				}>
					<i className="fa fa-question"></i>
				</span>
			);
		}

		// Render form control.
		var control;

		switch ( this.props.control.type ) {
			case 'toggle':
				control = this.renderToggle( label, description );
			break;

			case 'checkbox':
			case 'radio':
				control = this.renderCheckboxRadio( label, description );
			break;

			case 'select':
				control = this.renderSelect( label, description );
			break;

			case 'textarea':
				control = this.renderTextarea( label, description );
			break;

			case 'text':
			default:
				if ( this.props.control.type == 'text' || ! this.editor.props.editable[ this.props.control.type ] ) {
					control = this.renderText( label, description );
				} else {
					control = this.renderCustomControl( label, description );
				}
			break;
		}

		return (
			<div ref="wrapper">
				{ control }
			</div>
		);
	},

	renderToggle: function( label, description ) {
        var name = this.props.setting, checked = this.state.value == this.props.control.value;

		return (
			<div className="form-group">
				<label className="switch" forName={ this.props.id }>
					<input
						id={ this.props.id }
						ref="control"
						type="checkbox"
						name={ name }
						value={ this.props.control.value }
						checked={ checked }
						onClick={ this.change }
					/>
					<div className="slider round"></div>
					{ label }
					{ this.tooltip }
				</label>
			</div>
		);
	},

	renderCheckboxRadio: function( label, description ) {
		var options = [], name = this.props.setting, className, checked;

		// Check if the control has multiple options.
		if ( this.props.control.options && this.props.control.options instanceof Array ) {
			this.props.control.options.map( ( option ) => {
				var optionLabel = sunfw.text[ option.label ] ? sunfw.text[ option.label ] : option.label;

				// Prepare class attribute.
				className = this.props.control.type + ( this.props.control.inline ? '-inline' : '' );

				if ( ! this.parent.isVisible( option.requires ) ) {
					className += ' hidden';
				}

				// Detect 'checked' state.
				if ( this.props.control.type == 'checkbox' ) {
                    checked = this.state.value.indexOf(option.value) > -1;
				} else {
                    checked = this.state.value == option.value;
				}

				// Render tooltip if has.
				var optionTooltip;

				if ( option.hint || sunfw.text[ option.label + '-hint' ] ) {
					optionTooltip = (
						<span className="has-tooltip" data-content={
							option.hint
							? ( sunfw.text[ option.hint ] ? sunfw.text[ option.hint ] : option.hint )
							: sunfw.text[ option.label + '-hint' ]
						}>
							<i className="fa fa-question"></i>
						</span>
					);
				}

				if ( this.props.control.inline ) {
					options.push(
						<label className={ className + ( checked ? ' checked' : '' ) }>
							<input
								id={ this.props.id + '_' + option.value }
								type={ this.props.control.type }
								name={ name + ( this.props.control.type == 'checkbox' ? '[]' : '' ) }
								value={ option.value }
								checked={ checked }
								onClick={ this.change }
								className={ option['class'] ? option['class'] : '' }
							/>
							{ optionLabel }
							{ optionTooltip }
						</label>
					);
				} else {
					options.push(
						<div className={ className }>
							<label className={ checked ? 'checked' : '' }>
								<input
									id={ this.props.id + '_' + option.value }
									type={ this.props.control.type }
									name={ name + ( this.props.control.type == 'checkbox' ? '[]' : '' ) }
									value={ option.value }
									checked={ checked }
									onClick={ this.change }
									className={ option['class'] ? option['class'] : '' }
								/>
								{ optionLabel }
								{ optionTooltip }
							</label>
						</div>
					);
				}
			} );

			return (
				<div className="form-group">
					<label>
						{ label }
						{ this.tooltip }
					</label>
					<div className={ this.props.control.type + '-group' }>
						{ options }
					</div>
				</div>
			);
		}

		// Otherwise, the control has single option.
		else {
			// Prepare class attribute.
			className = this.props.control.type + ( this.props.control.inline ? '-inline' : '' );

			if ( ! this.parent.isVisible( this.props.control.requires ) ) {
				className += ' hidden';
			}

			// Detect 'checked' state.
            checked = this.state.value == this.props.control.value;

			if ( this.props.control.inline ) {
				options = (
					<label className={ className + ( checked ? ' checked' : '' ) }>
						<input
							id={ this.props.id }
							ref="control"
							type={ this.props.control.type }
							name={ name }
							value={ this.props.control.value }
							checked={ checked }
							onClick={ this.change }
						/>
						{ label }
						{ this.tooltip }
					</label>
				);
			} else {
				options = (
					<div className={ className }>
						<label className={ checked ? 'checked' : '' }>
							<input
								id={ this.props.id }
								ref="control"
								type={ this.props.control.type }
								name={ name }
								value={ this.props.control.value }
								checked={ checked }
								onClick={ this.change }
							/>
							{ label }
							{ this.tooltip }
						</label>
					</div>
				);
			}

			return (
				<div className="form-group">
					{ options }
				</div>
			);
		}
	},

	renderSelect: function( label, description ) {
		var name = this.props.setting + ( this.props.control.multiple ? '[]' : '' ),
            multiple = !!this.props.control.multiple,
			options = [], selected;

		// Prepare value.
		if ( this.props.control.multiple && ! this.state.value instanceof Array ) {
			this.state.value = this.state.value == '' ? [] : [ this.state.value ];
		}

		// Render multiple options.
		if ( this.props.control.options instanceof Array ) {
			this.props.control.options.map( ( option ) => {
				var className = option['class'] ? option['class'] : '';

				if ( this.props.control.multiple ) {
                    selected = this.state.value.indexOf(option.value) > -1;
				} else {
                    selected = this.state.value == option.value;
				}

				options.push(
					<option
						value={ option.value }
						selected={ selected }
						className={ className + ( this.parent.isVisible( option.requires ) ? '' : ' hidden' ) }
					>
						{ sunfw.text[ option.label ] ? sunfw.text[ option.label ] : option.label }
					</option>
				);
			} );
		}

		// Render grouped multiple options.
		else if ( typeof this.props.control.options == 'object' ) {
			var optgroups;

			for ( var optgroup in this.props.control.options ) {
				if ( ! this.props.control.options[ optgroup ] instanceof Array ) {
					continue;
				}

				// Reset option group.
				optgroups = [];

				// Generate options for option group.
				this.props.control.options[ optgroup ].map( ( option ) => {
					if ( this.props.control.multiple ) {
                        selected = this.state.value.indexOf(option.value) > -1;
					} else {
                        selected = this.state.value == option.value;
					}

					optgroups.push(
						<option value={ option.value } selected={ selected }>
							{
								sunfw.text[ this.props.control.label ]
									? sunfw.text[ this.props.control.label ]
									: this.props.control.label
							}
						</option>
					);
				} );

				options.push(
					<optgroup label={ optgroup }>
						{ optgroups }
					</optgroup>
				);
			}
		}

		return (
			<div className="form-group">
				<label forName={ this.props.id }>
					{ label }
					{ this.tooltip }
				</label>
				<select
					id={ this.props.id }
					ref="control"
					name={ name }
					multiple={ multiple }
					onChange={ this.change }
					className="form-control"
				>
					{ options }
				</select>
			</div>
		);
	},

	renderTextarea: function( label, description ) {
		return (
			<div className="form-group">
				<label forName={ this.props.id }>
					{ label }
					{ this.tooltip }
				</label>
				<textarea
					id={ this.props.id }
					ref="control"
					rows={ this.props.control.rows ? this.props.control.rows : 10 }
					name={ this.props.setting }
					value={ this.state.value }
					onChange={ this.change }
					className="form-control"
				>
					{ this.state.value }
				</textarea>
			</div>
		);
	},

	renderText: function( label, description ) {
		if ( description ) {
			description = (
				<span classNames={ 'input-group-addon' }>{ description }</span>
			);
		}

		// Check if control has suffix defined.
		if ( this.props.control.suffix ) {
			return (
				<div className="form-group">
					<label forName={ this.props.id }>
						{ label }
						{ this.tooltip }
					</label>
					<div className="input-group">
						<input
							id={ this.props.id }
							ref="control"
							type={ this.props.control.type }
							name={ this.props.setting }
							value={ this.state.value }
							onChange={ this.change }
							className="form-control"
							placeholder={
								sunfw.text[ this.props.control.placeholder ]
									? sunfw.text[ this.props.control.placeholder ]
									: this.props.control.placeholder
							}
						/>
						<div className="input-group-addon">{ this.props.control.suffix }</div>
					</div>
					{ description }
				</div>
			);
		}

		// Control does not have suffix.
		else {
			return (
				<div className="form-group">
					<label forName={ this.props.id }>
						{ label }
						{ this.tooltip }
					</label>
					<input
						id={ this.props.id }
						ref="control"
						type={ this.props.control.type }
						name={ this.props.setting }
						value={ this.state.value }
						onChange={ this.change }
						className="form-control"
						placeholder={
							sunfw.text[ this.props.control.placeholder ]
								? sunfw.text[ this.props.control.placeholder ]
								: this.props.control.placeholder
						}
					/>
					{ description }
				</div>
			);
		}
	},

	renderCustomControl: function( label, description ) {
		// Get custom form control class name.
		var ComponentName = SunFwHelper.toCamelCase( this.props.control.type, true );

		if ( ComponentName.indexOf ( 'SunFwInput' ) < 0 ) {
			ComponentName = 'SunFwInput' + ComponentName;
		}

		// If class not exists, try to load it.
		if ( ! window[ ComponentName ] && this.editor.props.editable[ this.props.control.type ].file ) {
			// Load required script file.
			SunFwHelper.loadScriptFile(
				sunfw.sunfw_url + this.editor.props.editable[ this.props.control.type ].file,
				function() {
					var render = function() {
						if ( ! window[ ComponentName ] || ! document.getElementById( this.props.id ) ) {
							if ( render.retryCount == 10 ) {
								return;
							} else {
								render.retryCount ? render.retryCount++ : ( render.retryCount = 1 );
							}

							return setTimeout( render, 100 );
						}

						// Force updating component.
						this.forceUpdate();
					}.bind( this );

					render();
				}.bind( this ),
				'babel'
			);

			return (
				<div id={ this.props.id } key={ this.props.id }></div>
			);
		}

		// Otherwise, render the custom form control.
		else if ( window[ ComponentName ] ) {
			ComponentName = window[ ComponentName ];

			return (
				<ComponentName
					id={ this.props.id }
					key={ this.props.id }
					ref="control"
					data={ { value: this.state.value } }
					parent={ this }
					editor={ this.editor }
					setting={ this.props.setting }
					control={ this.props.control }
				/>
			);
		}
	},

	handleInitActions: function() {
		if ( this.props.control.type == 'select' && this.refs.control ) {
			if ( this.props.control.chosen === undefined || this.props.control.chosen ) {
				// Init Chosen for select box.
				this.initChosen();
			}
		}

		// Init tooltips.
		if ( this.refs.wrapper ) {
			var tooltips = this.refs.wrapper.querySelectorAll('.has-tooltip');

			for ( var i = 0, n = tooltips.length; i < n; i++ ) {
				if ( ! tooltips[ i ]._initialized_popover ) {
					jQuery( tooltips[ i ] ).popover( {
						trigger: 'hover',
						template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
						placement: 'left',
						container: 'body'
					} ).click( function( event ) {
						event.preventDefault();
						event.stopPropagation();
					} );

					tooltips[ i ]._initialized_popover = true;
				}
			}
		}
	},

	change: function( event ) {
		var setting = this.props.setting, value;

		// If there are 2 arguments and the first one is the setting name, use the second argument as value.
		if ( arguments.length == 2 && arguments[0] == setting ) {
			value = arguments[1];
		}

		// Get changed setting and value.
		else {
			var control = event.target ? event.target : event;

			if ( control.nodeName == 'SELECT' ) {
				if ( control.multiple ) {
					// Get all options.
					var options = control.querySelectorAll( 'option' );

					// Get all selected options.
					value = [];

					for ( var i = 0, n = options.length; i < n; i++ ) {
						if ( options[ i ].selected ) {
							value.push( options[ i ].value );
						}
					}
				}

				else {
					value = control.options[ control.selectedIndex ].value;
				}
			}

			else {
				if ( control.nodeName == 'INPUT' ) {
					if ( control.type == 'checkbox' ) {
						if ( control.name.substr( -2 ) == '[]' ) {
							// Value is array.
							value = [];

							// Find checkboxes container.
							var container = control.parentNode;

							while ( ! container.classList.contains( 'form-group' ) && container.nodeName != 'BODY' ) {
								container = container.parentNode;
							}

							// Get all checkboxes.
							var checkboxes = container.querySelectorAll( 'input' );

							for ( var i = 0, n = checkboxes.length; i < n; i++ ) {
								if ( checkboxes[ i ].checked ) {
									value.push( checkboxes[ i ].value );
								}
							}
						}

						else {
							value = control.checked ? control.value : null;
						}
					}

					else if ( control.type == 'radio' ) {
						value = control.checked ? control.value : null;
					}

					else {
						value = control.value;
					}
				}

				else {
					value = control.value;
				}
			}
		}

		// Prepare setting value.
		if ( typeof value == 'string' && value.match( /^[\[\{].+[\}\]]$/ ) ) {
			value = JSON.parse( value );
		}

		// Update control state.
		if ( this.parent.skipSaving ) {
			this.setState( { value: value } );
		}

		// Update form state.
		this.parent.updateState( setting, value );
	}
} );
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

window.SunFwHelper = {
	/**
	 * Convert given string to a lower-cased string that can be used as element ID.
	 *
	 * @param   string   str     The string to convert to ID.
	 * @param   boolean  unique  Whether to append a random string to make ID unique?
	 *
	 * @return  string
	 */
	toId: function( str, unique ) {
		var id = this.toLatin( str ).replace( /[^a-zA-Z0-9\-]+/g, '-' ).toLowerCase();

		if ( unique ) {
			id += '_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
		}

		return id;
	},

	/**
	 * Convert any string to camelCase format.
	 *
	 * @param   string   str      The string that needs to convert to camelCase.
	 * @param   boolean  ucfirst  If TRUE is provided, the first letter of the string
	 *                            will be converted to uppercase.
	 *
	 * @return  string
	 */
	toCamelCase: function( str, ucfirst, separator ) {
		return str.replace( /(?:^\w|[A-Z]|\b\w)/g, function( letter, index ) {
			return ( ( ucfirst && index == 0 ) || index > 0 ) ? letter.toUpperCase() : letter.toLowerCase();
		} ).replace( /[^a-zA-Z0-9]+/g, separator ? separator : '' );
	},

	/**
	 * Convert Javascript object to query string that can be used directly
	 * in GET request or POST to server.
	 *
	 * @param   object  obj     A Javascript object.
	 * @param   string  prefix  Prefix to prepend to variable in query string.
	 *
	 * @return  string
	 */
	toQueryString: function( obj, prefix ) {
		// Make sure obj is an object.
		if ( typeof obj != 'object' ) {
			return obj;
		}

		// Convert the provided object to query string.
		var str = [];

		for ( var p in obj ) {
			if ( obj.hasOwnProperty( p ) ) {
				var k = prefix ? prefix + '[' + p + ']' : p, v = obj[ p ];

				str.push(
					typeof v == 'object'
						? this.toQueryString( v, k )
						: encodeURIComponent( k ) + '=' + encodeURIComponent( v )
				);
			}
		}

		return str.join( '&' );
	},

	/**
	 * Load remote file content using Ajax.
	 *
	 * @param   string    url       URL to load file content.
	 * @param   function  callback  If specified, this function will be called
	 *                              when file content is loaded.
	 * @param   array     postData  If specified, the data will be POST-ed to the specified URL.
	 *
	 * @return  object The XMLHttpRequest object instantiated to send request.
	 */
	requestUrl: function( url, callback, postData ) {
		// Define function to create a XMLHttpRequest object.
		var XMLHttpFactories = [
			function() { return new XMLHttpRequest() },
			function() { return new ActiveXObject( 'Msxml2.XMLHTTP' ) },
			function() { return new ActiveXObject( 'Msxml3.XMLHTTP' ) },
			function() { return new ActiveXObject( 'Microsoft.XMLHTTP' ) }
		];

		function createXMLHTTPObject() {
			var xmlhttp = false;

			for ( var i = 0; i < XMLHttpFactories.length; i++ ) {
				try {
					xmlhttp = XMLHttpFactories[i]();
				}
				catch (e) {
					continue;
				}

				break;
			}

			return xmlhttp;
		}

		// Create a new XMLHttpRequest object.
		var req = createXMLHTTPObject();

		if ( ! req ) {
			if ( typeof callback == 'function' ) {
				callback( req );
			}

			return false;
		}

		var method = postData ? 'POST' : 'GET';

		req.open( method, url, true );

		if ( postData ) {
			req.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
		}

		req.onreadystatechange = function() {
			if ( req.readyState != 4 ) {
				return;
			}

			if ( parseInt( req.status.toString().substr(0, 1) ) != 2 && req.status != 304 ) {
				var res = {};

				for ( var p in req ) {
					res[ p ] = req[ p ];
				}

				if ( [401, 403].indexOf(req.status) > -1 /*&& sunfw.text['session-expired-message']*/ ) {
					//res.response = res.responseText = sunfw.text['session-expired-message'];
					return window.location.reload();
				} else {
					res.response = res.responseText = req.status + ' ' + req.statusText;
				}
			}

			if ( typeof callback == 'function' ) {
				callback( res || req );
			}
		}

		if ( req.readyState == 4 ) {
			return;
		}

		req.send( this.toQueryString( postData ) );

		return req;
	},

	/**
	 * Dynamically load a stylesheet file.
	 *
	 * @param   string    file      The stylesheet file to load.
	 * @param   function  callback  If specified, this function will be called
	 *                              when the stylesheet is loaded.
	 *
	 * @return  void
	 */
	loadStylesheetFile: function( file, callback ) {
		// Check if stylesheet file was already loaded.
		var loaded = window._sunfw_loaded_stylesheets || [];

		if ( loaded.indexOf( file ) < 0 ) {
			var stylesheet = document.createElement( 'link' );

			stylesheet.rel = 'stylesheet';
			stylesheet.href = file;
			stylesheet.type = 'text/css';
			stylesheet.async = 1;

			stylesheet.onload = function( event ) {
				if ( window._sunfw_loaded_stylesheets ) {
					window._sunfw_loaded_stylesheets.push( file );
				}  else {
					window._sunfw_loaded_stylesheets = [ file ];
				}

				if ( typeof callback == 'function' ) {
					callback( event );
				}
			};

			stylesheet.onreadystatechange = function() {
				if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
					stylesheet.onload();
				}
			};

			stylesheet.onerror = function( event ) {
				console.log( 'Failed to load stylesheet file ' + file, event );
			};

			document.body.appendChild( stylesheet );
		}
	},

	/**
	 * Dynamically load a script file.
	 *
	 * @param   string    file      The script file to load.
	 * @param   function  callback  If specified, this function will be called when file content is loaded.
	 * @param   string    type      If 'babel' is specified, then the content of the script file will
	 *                              be loaded via Ajax then passed to Babel for transpilation.
	 *
	 * @return  void
	 */
	loadScriptFile: function( file, callback, type ) {
		// Check if script file was already loaded.
		if (
			! window._sunfw_loaded_scripts
			||
			window._sunfw_loaded_scripts.indexOf( file ) < 0
		) {
			if ( window._sunfw_loaded_scripts ) {
				window._sunfw_loaded_scripts.push( file );
			}  else {
				window._sunfw_loaded_scripts = [ file ];
			}

			// Define function that handles load event.
			var onload = function() {
				if ( typeof callback == 'function' ) {
					callback();
				}
			};

			if ( type != 'babel' ) {
				var script = document.createElement( 'script' );

				script.src = file;
				script.async = 1;
				script.onload = onload;

				script.onreadystatechange = function() {
					if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
						script.onload();
					}
				};

				script.onerror = function( event ) {
					console.log( 'Failed to load script file ' + file, event );
				};

				document.body.appendChild( script );
			} else {
				// Load the content of the script file via Ajax then let Babel execute it.
				this.requestUrl( file, function( req ) {
					babel.run( req.responseText );
					onload();
				} );
			}
		} else if ( typeof callback == 'function' ) {
			callback();
		}
	},

	downloadFile: function( remote_url, progressBar, callback ) {
		var file_name, file_size, timer,

		progressBarInner = progressBar.querySelector('[role="progressbar"]'),
		progressBarText = progressBar.querySelector('.percentage'),

		check = function() {
			var url = remote_url + (remote_url.indexOf('?') < 0 ? '?' : '&') + 'task=status';

			this.requestUrl( url, function( req ) {
				try {
					var res = JSON.parse( req.responseText );

					if ( res.file != file_name ) {
						return finalize();
					}

					if ( file_size > 0 ) {
						var percentage = Math.round( (parseInt( res.size ) / file_size) * 100 );

						// Update progress bar.
						progressBarInner.style.width = percentage + '%';
						progressBarText.textContent = percentage + '%';

						if ( res.status ) {
							return finalize();
						}
					} else {
						// Update progress bar.
						var current = parseInt( res.size );

						progressBarText.textContent = Math.round( current / 1024 ) + 'KB';

						if ( res.status ) {
							// Update progress bar.
							progressBarInner.style.width = '100%';

							return finalize();
						}
					}

					// Re-check download status after 10ms.
					timer = setTimeout( check, 10 );
				} catch ( e ) {
					return finalize();
				}
			}.bind( this ) );
		}.bind( this ),

		finalize = function() {
			// Stop getting download status.
			if ( timer ) {
				clearTimeout( timer );
			}

			// Finalize download task.
			var url = remote_url + (remote_url.indexOf('?') < 0 ? '?' : '&') + 'task=complete';

			return this.requestUrl( url, function( req ) {
				// Hide progress bar.
				progressBar.classList.add('hidden');

				progressBarInner.className = progressBarInner.className.replace(' progress-bar-striped active', '');

				// Execute call-back function.
				if ( typeof callback == 'function' ) {
					callback( req );
				}
			} );
		}.bind( this );

		// Make progress bar visible.
		progressBarInner.className += ' progress-bar-striped active';
		progressBarInner.style.width = '0%';
		progressBarText.textContent = '0%';

		progressBar.classList.remove('hidden');

		// Send initial request to download file.
		this.requestUrl( remote_url, function( req ) {
			try {
				var res;

				if ( res = req.responseText.match(/\{"[^:]+":.+\}/) ) {
					res = JSON.parse( res[0] );
				} else {
					return finalize();
				}

				if ( res.status ) {
					return finalize();
				}

				if ( res.file ) {
					file_name = res.file;
				}

				if ( res.size ) {
					file_size = res.size;
				}

				if ( ! file_name ) {
					return finalize();
				}

				// Get download status and update progress bar after 50ms.
				timer = setTimeout( check, 50 );
			} catch ( e ) {
				return finalize();
			}
		}.bind( this ) );
	},

	/**
	 * Load settings for an item type.
	 *
	 * @param   object    editor     The editor object.
	 * @param   stirng    item_type  The item type to load settings for.
	 * @param   function  callback   Call back function.
	 *
	 * @return  void
	 */
	loadItemTypeSettings: function( editor, item_type, callback ) {
		// If public settings definition available, simply execute the callback.
		if ( editor.props.items[ item_type ].settings ) {
			if ( callback ) {
				callback();
			}
		}

		// If the item has settings definition file, load it.
		else if ( editor.props.items[ item_type ].file ) {
			SunFwHelper.requestUrl(
				sunfw.sunfw_url + editor.props.items[ item_type ].file,
				function( req ) {
					// Store settings definition to the items object in editor properties.
					editor.props.items[ item_type ].settings = JSON.parse( req.responseText );

					// Execute the callback.
					if ( callback ) {
						callback();
					}
				}.bind( this )
			);
		}
	},

	/**
	 * Check if an item type is used in workspace.
	 *
	 * @param   object  editor     The editor object.
	 * @param   string  item_type  The item type to check.
	 *
	 * @return  boolean
	 */
	isItemTypeUsed: function( editor, item_type ) {
		var data = editor.getData(), used = false;

		for ( var index in data.items ) {
			if ( data.items[ index ] && data.items[ index ].type == item_type ) {
				used = true;

				break;
			}
		}

		return used;
	},

	/**
	 * Get the next index to store item into data store.
	 *
	 * @param   object  items  The data store to get next index for.
	 *
	 * @return  number
	 */
	getNextIndex: function( items ) {
		var max = -1;

		for ( var index in items ) {
			if ( items.hasOwnProperty( index ) && parseInt( index ) > max ) {
				max = index;
			}
		}

		return ++max;
	},

	/**
	 * Convert all Unicode characters to Latin equivalents.
	 *
	 * @param   string  str  Text string to convert.
	 *
	 * @return  string
	 */
	toLatin: function( str ) {
		window.latin_character_map = window.latin_character_map || {'Á':'A','Ă':'A','Ắ':'A','Ặ':'A','Ằ':'A','Ẳ':'A','Ẵ':'A','Ǎ':'A','Â':'A','Ấ':'A','Ậ':'A','Ầ':'A','Ẩ':'A','Ẫ':'A','Ä':'A','Ǟ':'A','Ȧ':'A','Ǡ':'A','Ạ':'A','Ȁ':'A','À':'A','Ả':'A','Ȃ':'A','Ā':'A','Ą':'A','Å':'A','Ǻ':'A','Ḁ':'A','Ⱥ':'A','Ã':'A','Ꜳ':'AA','Æ':'AE','Ǽ':'AE','Ǣ':'AE','Ꜵ':'AO','Ꜷ':'AU','Ꜹ':'AV','Ꜻ':'AV','Ꜽ':'AY','Ḃ':'B','Ḅ':'B','Ɓ':'B','Ḇ':'B','Ƀ':'B','Ƃ':'B','Ć':'C','Č':'C','Ç':'C','Ḉ':'C','Ĉ':'C','Ċ':'C','Ƈ':'C','Ȼ':'C','Ď':'D','Ḑ':'D','Ḓ':'D','Ḋ':'D','Ḍ':'D','Ɗ':'D','Ḏ':'D','ǲ':'D','ǅ':'D','Đ':'D','Ƌ':'D','Ǳ':'DZ','Ǆ':'DZ','É':'E','Ĕ':'E','Ě':'E','Ȩ':'E','Ḝ':'E','Ê':'E','Ế':'E','Ệ':'E','Ề':'E','Ể':'E','Ễ':'E','Ḙ':'E','Ë':'E','Ė':'E','Ẹ':'E','Ȅ':'E','È':'E','Ẻ':'E','Ȇ':'E','Ē':'E','Ḗ':'E','Ḕ':'E','Ę':'E','Ɇ':'E','Ẽ':'E','Ḛ':'E','Ꝫ':'ET','Ḟ':'F','Ƒ':'F','Ǵ':'G','Ğ':'G','Ǧ':'G','Ģ':'G','Ĝ':'G','Ġ':'G','Ɠ':'G','Ḡ':'G','Ǥ':'G','Ḫ':'H','Ȟ':'H','Ḩ':'H','Ĥ':'H','Ⱨ':'H','Ḧ':'H','Ḣ':'H','Ḥ':'H','Ħ':'H','Í':'I','Ĭ':'I','Ǐ':'I','Î':'I','Ï':'I','Ḯ':'I','İ':'I','Ị':'I','Ȉ':'I','Ì':'I','Ỉ':'I','Ȋ':'I','Ī':'I','Į':'I','Ɨ':'I','Ĩ':'I','Ḭ':'I','Ꝺ':'D','Ꝼ':'F','Ᵹ':'G','Ꞃ':'R','Ꞅ':'S','Ꞇ':'T','Ꝭ':'IS','Ĵ':'J','Ɉ':'J','Ḱ':'K','Ǩ':'K','Ķ':'K','Ⱪ':'K','Ꝃ':'K','Ḳ':'K','Ƙ':'K','Ḵ':'K','Ꝁ':'K','Ꝅ':'K','Ĺ':'L','Ƚ':'L','Ľ':'L','Ļ':'L','Ḽ':'L','Ḷ':'L','Ḹ':'L','Ⱡ':'L','Ꝉ':'L','Ḻ':'L','Ŀ':'L','Ɫ':'L','ǈ':'L','Ł':'L','Ǉ':'LJ','Ḿ':'M','Ṁ':'M','Ṃ':'M','Ɱ':'M','Ń':'N','Ň':'N','Ņ':'N','Ṋ':'N','Ṅ':'N','Ṇ':'N','Ǹ':'N','Ɲ':'N','Ṉ':'N','Ƞ':'N','ǋ':'N','Ñ':'N','Ǌ':'NJ','Ó':'O','Ŏ':'O','Ǒ':'O','Ô':'O','Ố':'O','Ộ':'O','Ồ':'O','Ổ':'O','Ỗ':'O','Ö':'O','Ȫ':'O','Ȯ':'O','Ȱ':'O','Ọ':'O','Ő':'O','Ȍ':'O','Ò':'O','Ỏ':'O','Ơ':'O','Ớ':'O','Ợ':'O','Ờ':'O','Ở':'O','Ỡ':'O','Ȏ':'O','Ꝋ':'O','Ꝍ':'O','Ō':'O','Ṓ':'O','Ṑ':'O','Ɵ':'O','Ǫ':'O','Ǭ':'O','Ø':'O','Ǿ':'O','Õ':'O','Ṍ':'O','Ṏ':'O','Ȭ':'O','Ƣ':'OI','Ꝏ':'OO','Ɛ':'E','Ɔ':'O','Ȣ':'OU','Ṕ':'P','Ṗ':'P','Ꝓ':'P','Ƥ':'P','Ꝕ':'P','Ᵽ':'P','Ꝑ':'P','Ꝙ':'Q','Ꝗ':'Q','Ŕ':'R','Ř':'R','Ŗ':'R','Ṙ':'R','Ṛ':'R','Ṝ':'R','Ȑ':'R','Ȓ':'R','Ṟ':'R','Ɍ':'R','Ɽ':'R','Ꜿ':'C','Ǝ':'E','Ś':'S','Ṥ':'S','Š':'S','Ṧ':'S','Ş':'S','Ŝ':'S','Ș':'S','Ṡ':'S','Ṣ':'S','Ṩ':'S','Ť':'T','Ţ':'T','Ṱ':'T','Ț':'T','Ⱦ':'T','Ṫ':'T','Ṭ':'T','Ƭ':'T','Ṯ':'T','Ʈ':'T','Ŧ':'T','Ɐ':'A','Ꞁ':'L','Ɯ':'M','Ʌ':'V','Ꜩ':'TZ','Ú':'U','Ŭ':'U','Ǔ':'U','Û':'U','Ṷ':'U','Ü':'U','Ǘ':'U','Ǚ':'U','Ǜ':'U','Ǖ':'U','Ṳ':'U','Ụ':'U','Ű':'U','Ȕ':'U','Ù':'U','Ủ':'U','Ư':'U','Ứ':'U','Ự':'U','Ừ':'U','Ử':'U','Ữ':'U','Ȗ':'U','Ū':'U','Ṻ':'U','Ų':'U','Ů':'U','Ũ':'U','Ṹ':'U','Ṵ':'U','Ꝟ':'V','Ṿ':'V','Ʋ':'V','Ṽ':'V','Ꝡ':'VY','Ẃ':'W','Ŵ':'W','Ẅ':'W','Ẇ':'W','Ẉ':'W','Ẁ':'W','Ⱳ':'W','Ẍ':'X','Ẋ':'X','Ý':'Y','Ŷ':'Y','Ÿ':'Y','Ẏ':'Y','Ỵ':'Y','Ỳ':'Y','Ƴ':'Y','Ỷ':'Y','Ỿ':'Y','Ȳ':'Y','Ɏ':'Y','Ỹ':'Y','Ź':'Z','Ž':'Z','Ẑ':'Z','Ⱬ':'Z','Ż':'Z','Ẓ':'Z','Ȥ':'Z','Ẕ':'Z','Ƶ':'Z','Ĳ':'IJ','Œ':'OE','ᴀ':'A','ᴁ':'AE','ʙ':'B','ᴃ':'B','ᴄ':'C','ᴅ':'D','ᴇ':'E','ꜰ':'F','ɢ':'G','ʛ':'G','ʜ':'H','ɪ':'I','ʁ':'R','ᴊ':'J','ᴋ':'K','ʟ':'L','ᴌ':'L','ᴍ':'M','ɴ':'N','ᴏ':'O','ɶ':'OE','ᴐ':'O','ᴕ':'OU','ᴘ':'P','ʀ':'R','ᴎ':'N','ᴙ':'R','ꜱ':'S','ᴛ':'T','ⱻ':'E','ᴚ':'R','ᴜ':'U','ᴠ':'V','ᴡ':'W','ʏ':'Y','ᴢ':'Z','á':'a','ă':'a','ắ':'a','ặ':'a','ằ':'a','ẳ':'a','ẵ':'a','ǎ':'a','â':'a','ấ':'a','ậ':'a','ầ':'a','ẩ':'a','ẫ':'a','ä':'a','ǟ':'a','ȧ':'a','ǡ':'a','ạ':'a','ȁ':'a','à':'a','ả':'a','ȃ':'a','ā':'a','ą':'a','ᶏ':'a','ẚ':'a','å':'a','ǻ':'a','ḁ':'a','ⱥ':'a','ã':'a','ꜳ':'aa','æ':'ae','ǽ':'ae','ǣ':'ae','ꜵ':'ao','ꜷ':'au','ꜹ':'av','ꜻ':'av','ꜽ':'ay','ḃ':'b','ḅ':'b','ɓ':'b','ḇ':'b','ᵬ':'b','ᶀ':'b','ƀ':'b','ƃ':'b','ɵ':'o','ć':'c','č':'c','ç':'c','ḉ':'c','ĉ':'c','ɕ':'c','ċ':'c','ƈ':'c','ȼ':'c','ď':'d','ḑ':'d','ḓ':'d','ȡ':'d','ḋ':'d','ḍ':'d','ɗ':'d','ᶑ':'d','ḏ':'d','ᵭ':'d','ᶁ':'d','đ':'d','ɖ':'d','ƌ':'d','ı':'i','ȷ':'j','ɟ':'j','ʄ':'j','ǳ':'dz','ǆ':'dz','é':'e','ĕ':'e','ě':'e','ȩ':'e','ḝ':'e','ê':'e','ế':'e','ệ':'e','ề':'e','ể':'e','ễ':'e','ḙ':'e','ë':'e','ė':'e','ẹ':'e','ȅ':'e','è':'e','ẻ':'e','ȇ':'e','ē':'e','ḗ':'e','ḕ':'e','ⱸ':'e','ę':'e','ᶒ':'e','ɇ':'e','ẽ':'e','ḛ':'e','ꝫ':'et','ḟ':'f','ƒ':'f','ᵮ':'f','ᶂ':'f','ǵ':'g','ğ':'g','ǧ':'g','ģ':'g','ĝ':'g','ġ':'g','ɠ':'g','ḡ':'g','ᶃ':'g','ǥ':'g','ḫ':'h','ȟ':'h','ḩ':'h','ĥ':'h','ⱨ':'h','ḧ':'h','ḣ':'h','ḥ':'h','ɦ':'h','ẖ':'h','ħ':'h','ƕ':'hv','í':'i','ĭ':'i','ǐ':'i','î':'i','ï':'i','ḯ':'i','ị':'i','ȉ':'i','ì':'i','ỉ':'i','ȋ':'i','ī':'i','į':'i','ᶖ':'i','ɨ':'i','ĩ':'i','ḭ':'i','ꝺ':'d','ꝼ':'f','ᵹ':'g','ꞃ':'r','ꞅ':'s','ꞇ':'t','ꝭ':'is','ǰ':'j','ĵ':'j','ʝ':'j','ɉ':'j','ḱ':'k','ǩ':'k','ķ':'k','ⱪ':'k','ꝃ':'k','ḳ':'k','ƙ':'k','ḵ':'k','ᶄ':'k','ꝁ':'k','ꝅ':'k','ĺ':'l','ƚ':'l','ɬ':'l','ľ':'l','ļ':'l','ḽ':'l','ȴ':'l','ḷ':'l','ḹ':'l','ⱡ':'l','ꝉ':'l','ḻ':'l','ŀ':'l','ɫ':'l','ᶅ':'l','ɭ':'l','ł':'l','ǉ':'lj','ſ':'s','ẜ':'s','ẛ':'s','ẝ':'s','ḿ':'m','ṁ':'m','ṃ':'m','ɱ':'m','ᵯ':'m','ᶆ':'m','ń':'n','ň':'n','ņ':'n','ṋ':'n','ȵ':'n','ṅ':'n','ṇ':'n','ǹ':'n','ɲ':'n','ṉ':'n','ƞ':'n','ᵰ':'n','ᶇ':'n','ɳ':'n','ñ':'n','ǌ':'nj','ó':'o','ŏ':'o','ǒ':'o','ô':'o','ố':'o','ộ':'o','ồ':'o','ổ':'o','ỗ':'o','ö':'o','ȫ':'o','ȯ':'o','ȱ':'o','ọ':'o','ő':'o','ȍ':'o','ò':'o','ỏ':'o','ơ':'o','ớ':'o','ợ':'o','ờ':'o','ở':'o','ỡ':'o','ȏ':'o','ꝋ':'o','ꝍ':'o','ⱺ':'o','ō':'o','ṓ':'o','ṑ':'o','ǫ':'o','ǭ':'o','ø':'o','ǿ':'o','õ':'o','ṍ':'o','ṏ':'o','ȭ':'o','ƣ':'oi','ꝏ':'oo','ɛ':'e','ᶓ':'e','ɔ':'o','ᶗ':'o','ȣ':'ou','ṕ':'p','ṗ':'p','ꝓ':'p','ƥ':'p','ᵱ':'p','ᶈ':'p','ꝕ':'p','ᵽ':'p','ꝑ':'p','ꝙ':'q','ʠ':'q','ɋ':'q','ꝗ':'q','ŕ':'r','ř':'r','ŗ':'r','ṙ':'r','ṛ':'r','ṝ':'r','ȑ':'r','ɾ':'r','ᵳ':'r','ȓ':'r','ṟ':'r','ɼ':'r','ᵲ':'r','ᶉ':'r','ɍ':'r','ɽ':'r','ↄ':'c','ꜿ':'c','ɘ':'e','ɿ':'r','ś':'s','ṥ':'s','š':'s','ṧ':'s','ş':'s','ŝ':'s','ș':'s','ṡ':'s','ṣ':'s','ṩ':'s','ʂ':'s','ᵴ':'s','ᶊ':'s','ȿ':'s','ɡ':'g','ᴑ':'o','ᴓ':'o','ᴝ':'u','ť':'t','ţ':'t','ṱ':'t','ț':'t','ȶ':'t','ẗ':'t','ⱦ':'t','ṫ':'t','ṭ':'t','ƭ':'t','ṯ':'t','ᵵ':'t','ƫ':'t','ʈ':'t','ŧ':'t','ᵺ':'th','ɐ':'a','ᴂ':'ae','ǝ':'e','ᵷ':'g','ɥ':'h','ʮ':'h','ʯ':'h','ᴉ':'i','ʞ':'k','ꞁ':'l','ɯ':'m','ɰ':'m','ᴔ':'oe','ɹ':'r','ɻ':'r','ɺ':'r','ⱹ':'r','ʇ':'t','ʌ':'v','ʍ':'w','ʎ':'y','ꜩ':'tz','ú':'u','ŭ':'u','ǔ':'u','û':'u','ṷ':'u','ü':'u','ǘ':'u','ǚ':'u','ǜ':'u','ǖ':'u','ṳ':'u','ụ':'u','ű':'u','ȕ':'u','ù':'u','ủ':'u','ư':'u','ứ':'u','ự':'u','ừ':'u','ử':'u','ữ':'u','ȗ':'u','ū':'u','ṻ':'u','ų':'u','ᶙ':'u','ů':'u','ũ':'u','ṹ':'u','ṵ':'u','ᵫ':'ue','ꝸ':'um','ⱴ':'v','ꝟ':'v','ṿ':'v','ʋ':'v','ᶌ':'v','ⱱ':'v','ṽ':'v','ꝡ':'vy','ẃ':'w','ŵ':'w','ẅ':'w','ẇ':'w','ẉ':'w','ẁ':'w','ⱳ':'w','ẘ':'w','ẍ':'x','ẋ':'x','ᶍ':'x','ý':'y','ŷ':'y','ÿ':'y','ẏ':'y','ỵ':'y','ỳ':'y','ƴ':'y','ỷ':'y','ỿ':'y','ȳ':'y','ẙ':'y','ɏ':'y','ỹ':'y','ź':'z','ž':'z','ẑ':'z','ʑ':'z','ⱬ':'z','ż':'z','ẓ':'z','ȥ':'z','ẕ':'z','ᵶ':'z','ᶎ':'z','ʐ':'z','ƶ':'z','ɀ':'z','ﬀ':'ff','ﬃ':'ffi','ﬄ':'ffl','ﬁ':'fi','ﬂ':'fl','ĳ':'ij','œ':'oe','ﬆ':'st','ₐ':'a','ₑ':'e','ᵢ':'i','ⱼ':'j','ₒ':'o','ᵣ':'r','ᵤ':'u','ᵥ':'v','ₓ':'x'};

		return str.replace( /[^A-Za-z0-9\[\] ]/g, function( a ) {
			return latin_character_map[ a ] || a;
		} );
	},
};
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

window.SunFwItems = React.createClass({
	mixins: [ SunFwMixinBase ],

	render: function() {
		var items = [];

		for ( var type in this.editor.props.items ) {
			var keyName = 'item_type_' + type;

			items.push(
				<SunFwItem
					key={ this.editor.props.id + '_' + keyName }
					ref={ keyName }
					type={ type }
					parent={ this }
					editor={ this.editor }
				/>
			);
		}

		return (
			<div ref="wrapper" className="layout-builder-items">
				<ul className="list-unstyled list-modules margin-bottom-0">
					{ items }
				</ul>
			</div>
		);
	}
});

window.SunFwItem = React.createClass({
	mixins: [ SunFwMixinBase, SunFwMixinDraggable ],

	getDefaultProps: function() {
		return {
			type: '',
		};
	},

	render: function() {
		var item = this.editor.props.items[ this.props.type ];

		return (
			<li
				className="draggable"
				draggable="true"
				onDragStart={ this.dragStart }
				onDragEnd={ this.dragEnd }
			>
				<a
					ref="element"
					href="javascript:void(0)"
					title={ item.label }
					data-type={ this.props.type }
				>
					<i className={ item.icon }></i>
					{ item.label }
				</a>
			</li>
		);
	},

	initActions: function() {
		if ( this.refs.element ) {
			setTimeout( function() {
				// Check if item is shown in icon panel.
				if ( this.parent.refs.wrapper.parentNode.classList.contains( 'icon-panel' ) ) {
					// Instantiate 'popover' for displaying item title.
					if ( ! this.refs.element._initialized_popover ) {
						jQuery( this.refs.element ).popover( {
							content: '',
							trigger: 'hover',
							template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
							container: 'body'
						} ).on( 'show.bs.popover', function( event ) {
							var target = event.target;

							// Prepare content for pop-over.
							var content;

							if ( target.parentNode.classList.contains( 'disabled' ) ) {
								content = sunfw.text['used-one-time-item'].replace( '%ITEM%', target.textContent );
							} else {
								content = target.textContent;
							}

							// Set content for popover.
							jQuery( target ).data( 'bs.popover' ).options.content = content;
						}.bind( this ) );

						this.refs.element._initialized_popover = true;
					}
				}

				// If item is one-time-item, check if item is used already.
				SunFwHelper.loadItemTypeSettings( this.editor, this.props.type, function() {
					var item = this.editor.props.items[ this.props.type ];

					if ( item.settings && item.settings['one-time-item'] ) {
						if ( SunFwHelper.isItemTypeUsed( this.editor, this.props.type ) ) {
							this.refs.element.parentNode.classList.add( 'disabled' );
						} else {
							this.refs.element.parentNode.classList.remove( 'disabled' );
						}
					}
				}.bind( this ) );
			}.bind( this ), 5 );
		}
	},

	handleComponentWillUnmount: function() {
		// Check if item is shown in icon panel.
		if ( this.parent.refs.wrapper.parentNode.classList.contains( 'icon-panel' ) ) {
			// Destroy previous 'popover' instance first.
			jQuery( this.refs.element ).off( 'show.bs.popover' ).popover( 'destroy' );

			delete this.refs.element._initialized_popover;
		}
	},

	handleDragStart: function( event ) {
		// Get item type.
		var item_type = event.target.getAttribute( 'data-type' );

		// Make sure item type is not disabled.
		if ( event.target.parentNode.classList.contains( 'disabled' ) ) {
			return bootbox.alert( sunfw.text['one-time-item'].replace( '%ITEM%', item_type.replace( '-', ' ' ) ) );
		}

		// Set transfer data to event object.
		event.dataTransfer.setData( 'element', item_type );

		// Store transfer data to the editor.
		this.editor.state.dataTransfer = item_type;
	}
} );
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

window.SunFwLoading = React.createClass( {
	mixins: [ SunFwMixinBase ],

	render: function() {
		return (
			<div ref="wrapper" className="sunfw-loading">
				<span className="fa fa-3x fa-circle-o-notch fa-spin"></span>
			</div>
		);
	}
} );
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

window.SunFwModal = React.createClass( {
	mixins: [ SunFwMixinBase ],

	getDefaultProps: function() {
		return {
			id: '',
			show: false,
			type: '',
			title: '',
			width: '',
			height: '',
			content: '',
			buttons: [],
			'class': null,
			centralize: true
		};
	},

	getInitialState: function() {
		return this.props;
	},

	render: function() {
		// Render modal content.
		var content;

		switch ( this.state.type ) {
			case 'form':
				// Prepare attributes.
				if ( ! this.state.content.parent ) {
					this.state.content.parent = this;
				}

				if ( ! this.state.content.editor ) {
					this.state.content.editor = this.editor;
				}

				// Render form.
				this.state.content.ref = 'form';

				content = React.createElement( SunFwForm, this.state.content );
			break;

			case 'iframe':
				this.state.content.ref = 'iframe';
				this.state.content.key = this.state.content.src.replace(/[^a-zA-Z0-9\-_]+/g, '');

				content = React.createElement( 'iframe', this.state.content );
			break;

			default:
				if ( sunfw.text[ this.state.content ] ) {
					content = sunfw.text[ this.state.content ];
				} else {
					content = this.state.content;
				}
			break;
		}

		// Render modal footer.
		var footer, buttons = [];

		if ( this.state.buttons instanceof Array ) {
			this.state.buttons.map( ( button ) => {
				// Prepare button text.
				var button_text = '';

				if ( button.text ) {
					button_text = sunfw.text[ button.text ] ? sunfw.text[ button.text ] : button.text;

					delete button.text;
				}

				// Prepare button class.
				if ( button['class'] ) {
					button.className = button['class'];

					delete button['class'];
				}

				// Finalize required attributes.
				if ( ! button.type ) {
					button.type = 'button';
				}

				// Generate button element.
				buttons.push( React.createElement( 'button', button, button_text ) );

				// Restore button text for later reference.
				button.text = button_text;
			} );
		}

		// Generate default buttons if no one provided.
		if ( this.state.buttons != 'disabled' && ! buttons.length ) {
			buttons = [
				(
					<button
						id={ this.state.id + '-confirm-button' }
						type="button"
						onClick={ this.confirm }
						className="btn btn-primary"
					>
						{ sunfw.text.ok }
					</button>
				),
				(
					<button
						id={ this.state.id + '-cancel-button' }
						type="button"
						onClick={ this.cancel }
						className="btn btn-default"
					>
						{ sunfw.text.cancel }
					</button>
				)
			];
		}

		if ( buttons.length ) {
			footer = (
				<div className="modal-footer">
					{ buttons }
				</div>
			);
		}

		// Return HTML for modal element.
		return (
			<div
				id={ this.state.id ? this.state.id : SunFwHelper.toId( 'modal' ) }
				ref="modal"
				className={ 'modal sunfwhide' + (this.state['class'] ? ' ' + this.state['class'] : '') }
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" onClick={ this.close } className="close" >
								<span>&times;</span>
							</button>

							<h4 className="modal-title">
								{ sunfw.text[ this.state.title ] ? sunfw.text[ this.state.title ] : this.state.title }
							</h4>
						</div>

						<div className="modal-body">
							{ content }
						</div>

						{ footer }
					</div>
				</div>
			</div>
		);
	},

	/**
	 * Init interactions.
	 *
	 * @return void
	 */
	initActions: function() {
		if ( this.refs.modal ) {
			// Show the modal if specified.
			if ( this.state.show ) {
				this.show();
			}

			// If content type is form, skip saving settings instantly.
			if ( this.state.type == 'form' && this.refs.form ) {
				this.refs.form.setState( {
					inline: false
				} );
			}
		}
	},

	/**
	 * Show modal.
	 *
	 * @return void
	 */
	show: function( event ) {
		event && event.preventDefault();

		// Localize 'this' context.
		var self = this;

		if ( self.refs.modal ) {
			// Show the modal but make it invisible.
			if (self.refs.modal.classList.contains('sunfwhide')) {
				self.refs.modal.classList.remove('sunfwhide');
			}

			self.refs.modal.style.display = 'block';
			self.refs.modal.style.visibility = 'hidden';

			// Set width for the modal.
			var modal_dialog = self.refs.modal.querySelector( '.modal-dialog' );

			if ( self.state.width ) {
				var width = parseInt(self.state.width);

				if ( self.state.width.substr(-1) == '%' ) {
					width = (window.innerWidth / 100) * width;
				}

				if ( window.innerWidth < width ) {
					width = window.innerWidth;
				}

				modal_dialog.style.left  = ( (window.innerWidth - width) / 2 ) + 'px';
				modal_dialog.style.width = width + 'px';
			}

			// Set height for the modal.
			var modal_body = self.refs.modal.querySelector( '.modal-body' ),
				container_css = window.getComputedStyle( modal_dialog ),
				content_rect = self.refs.modal.querySelector( '.modal-content' ).getBoundingClientRect(),
				header = self.refs.modal.querySelector( '.modal-header' ),
				header_rect = header ? header.getBoundingClientRect() : { top: content_rect.top, height: 0 },
				footer = self.refs.modal.querySelector( '.modal-footer' ),
				footer_rect = footer ? footer.getBoundingClientRect() : { height: 0 },
				height;

			modal_body.style.overflowX = 'hidden';
			modal_body.style.overflowY = 'auto';

			if ( self.state.height ) {
				var height = parseInt(self.state.height);

				if ( self.state.height.substr(-1) == '%' ) {
					height = (window.innerHeight / 100) * height;
				}

				if ( window.innerHeight < height ) {
					height = window.innerHeight;
				}

				height -= header_rect.height + footer_rect.height;

				// Set modal height.
				modal_body.style.height = height + 'px';
				modal_body.style.maxHeight = 'initial';
			}

			// Calculate max height for the modal.
			else {
				height = window.innerHeight
					- parseInt( container_css.getPropertyValue( 'margin-top' ) )
					- parseInt( container_css.getPropertyValue( 'margin-bottom' ) )
					- ( ( header_rect.top - parseInt( container_css.getPropertyValue( 'margin-top' ) ) ) * 2 )
					- header_rect.height - footer_rect.height;

				// Set max modal height.
				modal_body.style.height = 'initial';
				modal_body.style.maxHeight = height + 'px';
			}

			// Fine-tune height for iframe content.
			if ( self.state.type == 'iframe' && ['auto', '100%'].indexOf( self.state.content.height ) > -1 ) {
				var modal_body_css = window.getComputedStyle( modal_body ),
					iframe_css = window.getComputedStyle( self.refs.iframe );

				self.refs.iframe.style.height = (
					height
					- parseInt( modal_body_css.getPropertyValue( 'padding-top' ) )
					- parseInt( modal_body_css.getPropertyValue( 'padding-bottom' ) )
					- parseInt( iframe_css.getPropertyValue( 'border-top-width' ) )
					- parseInt( iframe_css.getPropertyValue( 'border-bottom-width' ) )
				) + 'px';

				modal_body.style.overflowY = 'hidden';
			}

			// Centralize the modal if needed.
			if ( self.props.centralize ) {
				modal_dialog.style.marginTop = Math.floor(
					(window.innerHeight - modal_dialog.getBoundingClientRect().height) / 2
				) + 'px';
			}

			// Make the modal visible.
			self.refs.modal.style.visibility = 'initial';

			// Handle 'resize' event.
			if ( ! self.refs.modal._listened_resize_event ) {
				window.addEventListener( 'resize', self.show );

				self.refs.modal._listened_resize_event = true;
			}

			// If a form is displayed inside modal, track form change.
			if ( ! self.state.height && self.state.type == 'form' && self.refs.form && ! self.refs.form._listened_change_event ) {
				self.refs.form.refs.form.addEventListener('change', self.update);

				self.refs.form._listened_change_event = true;
			}
		}
	},

	/**
	 * Update modal presentation.
	 */
	update: function() {
		// Localize 'this' context.
		var self = this;

		if ( ! self.state.height && self.state.type == 'form' && self.refs.form ) {
			var formHeight = self.refs.form.refs.form.getBoundingClientRect().height;

			if (self.lastFormHeight != formHeight) {
				self.show();
			}

			self.lastFormHeight = formHeight;
		}
	},

	/**
	 * Close modal.
	 *
	 * @return void
	 */
	close: function( event ) {
		event && event.preventDefault();

		// Localize 'this' context.
		var self = this;

		if ( self.refs.modal ) {
			// Hide the modal.
			self.refs.modal.style.display = 'none';

			// Remove 'resize' event handler.
			delete self.refs.modal._listened_resize_event;

			window.removeEventListener( 'resize', self.show );

			// Remove 'change' event handler.
			if ( ! self.state.height && self.state.type == 'form' && self.refs.form && self.refs.form._listened_change_event ) {
				delete self.refs.form._listened_change_event;

				self.refs.form.refs.form.removeEventListener('change', self.update);
			}
		}
	},

	/**
	 * Handle confirm action.
	 *
	 * @return void
	 */
	confirm: function( event ) {
		event.preventDefault();

		// If confirm action handler was provided, call it.
		if ( typeof this.state.confirm == 'function' ) {
			this.state.confirm();
		}

		// If parent component has confirm action handler, call it.
		if ( this.parent && typeof this.parent.confirm == 'function' ) {
			this.parent.confirm();
		}

		// If content type is form, save settings.
		if ( this.state.type == 'form' && this.refs.form ) {
			this.refs.form.saveSettings( null, true );
		}

		// Close modal.
		this.close();
	},

	/**
	 * Handle cancel action.
	 *
	 * @return void
	 */
	cancel: function( event ) {
		event.preventDefault();

		// If cancel action handler was provided, call it.
		if ( typeof this.state.cancel == 'function' ) {
			this.state.cancel();
		}

		// If parent component has cancel action handler, call it.
		if ( this.parent && typeof this.parent.cancel == 'function' ) {
			this.parent.cancel();
		}

		// Close modal.
		this.close();
	}
} );
