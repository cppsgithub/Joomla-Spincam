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

window.SunFwMixinBase = {
	componentWillMount: function() {
		// Migrate parent and editor reference.
		this.migrateParentEditorRef();

		// Migrate component state from the passed in properties.
		var state = this.migratePropsToState();

		if ( this.handleComponentWillMount ) {
			state = this.handleComponentWillMount( state ) || state;
		}

		this.setState( state );
	},

	componentDidMount: function() {
		// Init transition, event, etc. after DOM elements is rendered.
		this.afterRender();

		if ( this.handleComponentDidMount ) {
			this.handleComponentDidMount();
		}
	},

	componentWillReceiveProps: function( newProps ) {
		// Migrate component state from the passed in properties.
		var state = this.migratePropsToState( newProps );

		if ( this.handleComponentWillReceiveProps ) {
			state = this.handleComponentWillReceiveProps( newProps, state ) || state;
		}

		this.setState( state );
	},

	shouldComponentUpdate: function( newProps, newState ) {
		if ( this.handleShouldComponentUpdate ) {
			return this.handleShouldComponentUpdate( newProps, newState );
		}

		return true;
	},

	componentWillUpdate: function( newProps, newState ) {
		// Migrate parent and editor reference.
		this.migrateParentEditorRef();

		if ( this.handleComponentWillUpdate ) {
			this.handleComponentWillUpdate( newProps, newState );
		}
	},

	componentDidUpdate: function( oldProps, oldState ) {
		// Init transition, event, etc. after DOM elements is updated.
		this.afterRender();

		if ( this.handleComponentDidUpdate ) {
			this.handleComponentDidUpdate( oldProps, oldState );
		}
	},

	componentWillUnmount: function() {
		if ( this.handleComponentWillUnmount ) {
			this.handleComponentWillUnmount();
		}
	},

	/**
	 * Migrate parent and editor from props to object base.
	 */
	migrateParentEditorRef: function() {
		// Create shortcuts for accessing the editor and parent component.
		if ( this.props.editor ) {
			this.editor = this.props.editor;

			delete this.props.editor;
		}

		if ( this.props.parent ) {
			this.parent = this.props.parent;

			delete this.props.parent;
		}
	},

	/**
	 * Migrate component props to state.
	 */
	migratePropsToState: function( props ) {
		var props = props || this.props, state = {};

		if ( props.data ) {
			// Migrate all values from the 'data' property to component state.
			for ( var p in props.data ) {
				if ( ! this.state || this.state[ p ] != props.data[ p ] ) {
					state[ p ] = props.data[ p ];
				}
			}
		}

		return state;
	},

	/**
	 * Init transition, event, etc. after DOM elements is rendered / updated.
	 */
	afterRender: function() {
		if ( this.initActions ) {
			this.initActions();
		}
	},

	backTopreviouslyActivatedTab: function () {
		var cookieName = 'sunfw-previously-activated-tab-'+document.URL.replace("/", "").replace(":", "").replace("%", "").replace("#", "");
		if (jQuery.cookie(cookieName))
		{
			jQuery( "a[href='"+jQuery.cookie(cookieName)+"']" ).trigger('click');

		}
		else
		{
			jQuery( "a[href=#layout]" ).trigger('click');
		}
		jQuery('#sunfw-nav-tab').removeClass('sunfwhide');
		jQuery('ul.sunfw-right-top-menu li a').removeClass('active');
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

window.SunFwMixinDraggable = {
	dragStart: function( event ) {
		// Set transfer data to event object.
		event.dataTransfer.setData( 'element', this );

		// Store transfer data to the editor.
		this.editor.state.dataTransfer = this;

		// Call drag start handle.
		if ( this.handleDragStart ) {
			this.handleDragStart( event );
		}
	},

	dragEnd: function( event ) {
		// Clear droppable target.
		this.editor.refs.marker.classList.remove( 'drop-target' );
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

window.SunFwMixinDroppable = {
	dragOver: function( event ) {
		// Do not allow the dragging item to be dropped into its current position.
		var that = this.editor.state.dataTransfer;

		if ( typeof that == 'object' && event.target == that.refs.wrapper ) {
			return;
		}

		// Make sure dragging item and target area are in the same view.
		if ( typeof that == 'object' && this.props.view != that.props.view ) {
			return;
		}

		// Make sure the target is droppable.
		var droppable = event.target;

		while ( ! droppable.classList.contains( 'droppable' ) && droppable.nodeName != 'BODY' ) {
			droppable = droppable.parentNode;
		}

		if ( droppable.nodeName == 'BODY' ) {
			return;
		}

		// If the target is inside an offcanvas, make sure the offcanvas is currently visible.
		var parent = droppable.parentNode;

		while ( ! parent.classList.contains( 'offcanvas' ) && parent.nodeName != 'BODY' ) {
			parent = parent.parentNode;
		}

		if ( parent.classList.contains( 'offcanvas' ) && parent.parentNode.className.indexOf( 'open-' ) < 0 ) {
			return;
		}

		// Get the type of the dragging item.
		var type = that.getItemType ? that.getItemType( that ) : 'item';

		// Make sure the droppable target can accept the dragging item.
		if ( type && ! droppable.classList.contains( 'accept-' + type ) ) {
			return;
		}

		// If the droppable target accepts column, make sure it can contain more column.
		if (
			droppable.children.length
			&&
			droppable.children[0].className.match( /col-(lg|md|sm|xs)-\d+/ )
			&&
			( this.editor.currentScreen == 'xs' || droppable.children.length == 12 )
		) {
			return;
		}

		// Get the droppable marker.
		var marker = this.editor.refs.marker,
			scrollT = ( document.body.scrollTop || document.documentElement.scrollTop ),
			scrollL = ( document.body.scrollLeft || document.documentElement.scrollLeft ),
			rect, index, targetItem, bounce;

		// Check if the mouse pointer is over an item?
		if ( event.target.classList.contains( 'draggable-item' ) ) {
			// Get item index.
			index = event.target.getAttribute( 'data-index' );

			// Get the bounding rectangle of the target item.
			rect = event.target.getBoundingClientRect();

			// If target is a column, check the x axis of the mouse pointer.
			if ( event.target.className.match( /col-(lg|md|sm|xs)-\d+/ ) ) {
				marker.classList.add( 'vertical-marker' );
				marker.classList.remove( 'horizontal-marker' );

				marker.style.top = ( rect.top + scrollT ) + 'px';
				marker.style.height = rect.height + 'px';

				if (
					( typeof that == 'object' && event.target.nextElementSibling == that.refs.wrapper )
					||
					event.clientX - rect.left < rect.right - event.clientX
				) {
					/* Do not allow the dragging item to be dropped into its current position.
					if ( typeof that == 'object' && event.target.previousElementSibling == that.refs.wrapper ) {
						return;
					}*/

					// Show droppable marker at the left edge of the target.
					if ( event.target.previousElementSibling ) {
						bounce = event.target.previousElementSibling.getBoundingClientRect().right;
					} else {
						bounce = event.target.parentNode.getBoundingClientRect().left;
					}

					marker.style.left = ( (
						( rect.left - ( rect.left - bounce ) / 2 ) - ( marker.offsetWidth / 2 )
					) + scrollL ) + 'px';

					// Set index for drop in item.
					event.target.parentNode.setAttribute( 'drop-index', index );
				} else if (
					( typeof that == 'object' && event.target.previousElementSibling == that.refs.wrapper )
					||
					event.clientX - rect.left > rect.right - event.clientX
				) {
					/* Do not allow the dragging item to be dropped into its current position.
					if ( typeof that == 'object' && event.target.nextElementSibling == that.refs.wrapper ) {
						return;
					}*/

					// Show droppable marker at the right edge of the target.
					if ( event.target.nextElementSibling ) {
						bounce = event.target.nextElementSibling.getBoundingClientRect().left;
					} else {
						bounce = event.target.parentNode.getBoundingClientRect().right;
					}

					marker.style.left = ( (
						( rect.right + ( bounce - rect.right ) / 2 ) - ( marker.offsetWidth / 2 )
					) + scrollL ) + 'px';

					// Set index for drop in item.
					event.target.parentNode.setAttribute( 'drop-index', parseInt( index ) + 1 );
				} else {
					return;
				}
			}

			// Otherwise, check the y axis of the mouse pointer.
			else {
				marker.classList.add( 'horizontal-marker' );
				marker.classList.remove( 'vertical-marker' );

				marker.style.left = ( rect.left + scrollL ) + 'px';
				marker.style.width = rect.width + 'px';

				if (
					( typeof that == 'object' && event.target.nextElementSibling == that.refs.wrapper )
					||
					event.clientY - rect.top < rect.bottom - event.clientY
				) {
					/* Do not allow the dragging item to be dropped into its current position.
					if ( typeof that == 'object' && event.target.previousElementSibling == that.refs.wrapper ) {
						return;
					}*/

					// Show droppable marker at the top edge of the target.
					if ( event.target.previousElementSibling ) {
						bounce = event.target.previousElementSibling.getBoundingClientRect().bottom;
					} else {
						bounce = event.target.parentNode.getBoundingClientRect().top;
					}

					marker.style.top = (
						( rect.top - ( rect.top - bounce ) / 2 ) - ( marker.offsetHeight / 2 ) + scrollT
					) + 'px';

					// Set index for drop in item.
					event.target.parentNode.setAttribute( 'drop-index', index );
				} else if (
					( typeof that == 'object' && event.target.previousElementSibling == that.refs.wrapper )
					||
					event.clientY - rect.top > rect.bottom - event.clientY
				) {
					/* Do not allow the dragging item to be dropped into its current position.
					if ( typeof that == 'object' && event.target.nextElementSibling == that.refs.wrapper ) {
						return;
					}*/

					// Show droppable marker at the bottom edge of the target.
					if ( event.target.nextElementSibling ) {
						bounce = event.target.nextElementSibling.getBoundingClientRect().top;
					} else {
						if ( event.target.previousElementSibling ) {
							bounce = event.target.previousElementSibling.getBoundingClientRect().bottom;
						} else {
							bounce = droppable.getBoundingClientRect().top;
						}

						bounce = rect.bottom + ( rect.top - bounce );
					}

					marker.style.top = (
						( rect.bottom + ( bounce - rect.bottom ) / 2 ) - ( marker.offsetHeight / 2 ) + scrollT
					) + 'px';

					// Set index for drop in item.
					event.target.parentNode.setAttribute( 'drop-index', parseInt( index ) + 1 );
				} else {
					return;
				}
			}
		}

		// Otherwise, the mouse pointer is over a droppable target.
		else {
			// Check if the droppable target is empty.
			if ( ! droppable.children.length ) {
				// Get the bounding rectangle of the droppable target.
				rect = droppable.getBoundingClientRect();
				bounce = window.getComputedStyle( droppable );
				bounce = {
					top: parseInt( bounce.getPropertyValue( 'padding-top' ) ),
					left: parseInt( bounce.getPropertyValue( 'padding-left' ) ),
					right: parseInt( bounce.getPropertyValue( 'padding-right' ) )
				};

				// Show the marker at the top edge of the droppable target.
				marker.classList.add( 'horizontal-marker' );
				marker.classList.remove( 'vertical-marker' );

				marker.style.top = ( rect.top + bounce.top + scrollT ) + 'px';
				marker.style.left = ( rect.left + bounce.left + scrollL ) + 'px';
				marker.style.width = ( rect.width - bounce.left - bounce.right ) + 'px';

				// Simply set 0 as index for drop in item.
				index = 0;
			}

			// If the droppable target is a row, find the column that is
			// closest to the x axis of the mouse pointer.
			else if ( droppable.children[0].className.match( /col-(lg|md|sm|xs)-\d+/ ) ) {
				for ( index = 0; index < droppable.children.length; index++ ) {
					// Get the bounding rectangle of the current item.
					rect = droppable.children[ index ].getBoundingClientRect();

					if ( event.clientX < rect.left ) {
						targetItem = droppable.children[ index ];

						if ( index > 0 ) {
							// Check if the mouse pointer is closer to the left edge of the previous
							// item than the current one?
							var distance = rect.left - event.clientX;

							rect = droppable.children[ index - 1 ].getBoundingClientRect();

							if ( event.clientX - rect.left < distance ) {
								targetItem = droppable.children[ index - 1 ];

								index--;
							} else {
								rect = droppable.children[ index ].getBoundingClientRect();
							}
						}

						break;
					}
				}

				/* Do not allow the dragging item to be dropped into its current position.
				if (
					typeof that == 'object'
					&&
					(
						droppable.children[ index ] == that.refs.wrapper
						||
						droppable.children[ index ] == that.refs.wrapper.nextElementSibling
						||
						droppable.children[ index ] == that.refs.wrapper.previousElementSibling
					)
				) {
					return;
				}*/

				// Prepare the marker.
				marker.classList.add( 'vertical-marker' );
				marker.classList.remove( 'horizontal-marker' );

				marker.style.top = ( rect.top + scrollT ) + 'px';
				marker.style.height = rect.height + 'px';

				if ( targetItem ) {
					// Show droppable marker at the left edge of the target item.
					if ( targetItem.previousElementSibling ) {
						bounce = targetItem.previousElementSibling.getBoundingClientRect().right;
					} else {
						bounce = droppable.getBoundingClientRect().left;
					}

					marker.style.left = ( (
						( rect.left - ( rect.left - bounce ) / 2 ) - ( marker.offsetWidth / 2 )
					) + scrollL ) + 'px';
				} else {
					// Check if the mouse pointer is closer to the left edge of the last item
					// than the right edge?
					if ( event.clientX - rect.left < rect.right - event.clientX ) {
						// Show droppable marker at the left edge of the last item.
						index--;

						bounce = index > 0
							? droppable.children[ index - 1 ].getBoundingClientRect().right
							: droppable.getBoundingClientRect().left;

						marker.style.left = ( (
							( rect.left - ( rect.left - bounce ) / 2 ) - ( marker.offsetWidth / 2 )
						) + scrollL ) + 'px';
					} else {
						// Show droppable marker at the right edge of the last item.
						bounce = droppable.getBoundingClientRect().right;

						marker.style.left = ( (
							( rect.right + ( bounce - rect.right ) / 2 ) - ( marker.offsetWidth / 2 )
						) + scrollL ) + 'px';
					}
				}
			}

			// Otherwise, find the item that is closest to the y axis of the mouse pointer.
			else {
				for ( index = 0; index < droppable.children.length; index++ ) {
					// Get the bounding rectangle of the current item.
					rect = droppable.children[ index ].getBoundingClientRect();

					if ( event.clientY < rect.top ) {
						targetItem = droppable.children[ index ];

						if ( index > 0 ) {
							// Check if the mouse pointer is closer to the top edge of the previous
							// item than the current one?
							var distance = rect.top - event.clientY;

							rect = droppable.children[ index - 1 ].getBoundingClientRect();

							if ( event.clientY - rect.top < distance ) {
								targetItem = droppable.children[ index - 1 ];

								index--;
							} else {
								rect = droppable.children[ index ].getBoundingClientRect();
							}
						}

						break;
					}
				}

				/* Do not allow the dragging item to be dropped into its current position.
				if (
					typeof that == 'object'
					&&
					(
						droppable.children[ index ] == that.refs.wrapper
						||
						droppable.children[ index ] == that.refs.wrapper.nextElementSibling
						||
						droppable.children[ index ] == that.refs.wrapper.previousElementSibling
					)
				) {
					return;
				}*/

				// Prepare the marker.
				marker.classList.add( 'horizontal-marker' );
				marker.classList.remove( 'vertical-marker' );

				marker.style.left = ( rect.left + scrollL ) + 'px';
				marker.style.width = rect.width + 'px';

				if ( targetItem ) {
					// Show droppable marker at the top edge of the target item.
					if ( targetItem.previousElementSibling ) {
						bounce = targetItem.previousElementSibling.getBoundingClientRect().bottom;
					} else {
						bounce = droppable.getBoundingClientRect().top;
					}

					marker.style.top = (
						( rect.top - ( rect.top - bounce ) / 2 ) - ( marker.offsetHeight / 2 ) + scrollT
					) + 'px';
				} else {
					// Check if the mouse pointer is closer to the top edge of the last item
					// than the bottom edge?
					if ( event.clientY - rect.top < rect.bottom - event.clientY ) {
						// Show droppable marker at the bottom edge of the last item.
						index--;

						bounce = index > 0
							? droppable.children[ index - 1 ].getBoundingClientRect().bottom
							: droppable.getBoundingClientRect().top;

						marker.style.top = (
							( rect.top - ( rect.top - bounce ) / 2 ) - ( marker.offsetHeight / 2 ) + scrollT
						) + 'px';
					} else {
						// Show droppable marker at the bottom edge of the last item.
						rect = droppable.children[ droppable.children.length - 1 ].getBoundingClientRect();

						if ( droppable.children.length - 1 > 0 ) {
							bounce = droppable.children[ droppable.children.length - 2 ].getBoundingClientRect().bottom;
						} else {
							bounce = droppable.getBoundingClientRect().top;
						}

						bounce = rect.bottom + ( rect.top - bounce );

						marker.style.top = (
							( rect.bottom + ( bounce - rect.bottom ) / 2 ) - ( marker.offsetHeight / 2 ) + scrollT
						) + 'px';
					}
				}
			}

			// Set index in the droppable target for drop in item.
			droppable.setAttribute( 'drop-index', index );
		}

		// Make marker visible as a drop target.
		marker.classList.add( 'drop-target' );

		// Prevent default handle to allow drop.
		event.preventDefault();

		return event.stopPropagation();
	},

	/**
	 * Handle drop event to either create a new item at or
	 * move an existing item to the target position.
	 *
	 * @param object event The dispatched drop event object.
	 *
	 * @return void
	 */
	drop: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		// Reset mouse status.
		this.editor.isMouseDown = false;

		// Hide droppable marker.
		this.editor.refs.marker.classList.remove( 'drop-target' );

		// Get the droppable target.
		var droppable = event.target;

		while ( ! droppable.classList.contains( 'droppable' ) && droppable.nodeName != 'BODY' ) {
			droppable = droppable.parentNode;
		}

		if ( droppable.nodeName == 'BODY' ) {
			// Invalid droppable target.
			return;
		}

		// Get the type of the dropped in item.
		var that = this.editor.state.dataTransfer,
			type = that.getItemType ? that.getItemType() : 'item';

		// Transfer data in the editor state is not needed any more. So, delete it.
		delete this.editor.state.dataTransfer;

		// Make sure the droppable target can accept the dragging item.
		if ( ! droppable.classList.contains( 'accept-' + type ) ) {
			return;
		}

		// Get the target position.
		var targetIndex = parseInt( droppable.getAttribute( 'drop-index' ) );

		// Do not allow an item to be dropped into its current position.
		if ( typeof that == 'object' && this == that.parent ) {
			if ( targetIndex == that.props.index || targetIndex == ( that.props.index + 1 ) ) {
				return;
			}
		}

		// Handle drop action.
		if ( this.handleDrop ) {
			var handleDrop = function() {
				this.handleDrop( droppable, targetIndex, that, type );

				// If item type is one-time-item, force updating.
				if ( typeof that == 'string' && this.editor.props.items[ that ] ) {
					if ( this.editor.props.items[ that ].settings['one-time-item'] ) {
						this.editor.refs.items.refs[ 'item_type_' + that ].forceUpdate();
					}
				}
			}.bind( this );

			if ( typeof that == 'string' && this.editor.props.items[ that ] ) {
				// Load item type settings.
				return SunFwHelper.loadItemTypeSettings( this.editor, that, function() {
					// If item type is one-time-item, check if the item type is used.
					if ( this.editor.props.items[ that ].settings['one-time-item'] ) {
						if ( SunFwHelper.isItemTypeUsed( this.editor, that ) ) {
							return bootbox.alert( sunfw.text['one-time-item'].replace( '%ITEM%', that.replace( '-', ' ' ) ) );
						}
					}

					// Handle drop action.
					handleDrop();
				}.bind( this ) );
			}

			// Handle drop action.
			handleDrop();
		}
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

window.SunFwMixinEditor = {
	getData: function() {
		var data = this.data ? JSON.parse( JSON.stringify( this.data ) ) : {},
			defaults = this.getDefaultData ? this.getDefaultData() : {};

		// Apply defaults.
		for ( var p in defaults ) {
			if ( defaults.hasOwnProperty( p ) && data[ p ] === undefined ) {
				data[ p ] = defaults[ p ];
			}
		}

		return data;
	},

	setData: function( data, skip_logging_activity ) {
		this.data = data;

		if ( this.refs.activity && ! skip_logging_activity ) {
			// Whether to log activity or not?
			this.log_activity = true;

			// Then, force the activity component to update and log activity.
			this.refs.activity.forceUpdate();
		}
	},

	selectItem: function( item, skip_logging_activity ) {
		if ( this.editSettings ) {
			setTimeout( function() {
				// Select item for editing.
				this.editSettings( item );

				// Then, force the activity component to update and log activity.
				if ( this.refs.activity && ! skip_logging_activity ) {
					this.refs.activity.forceUpdate();
				}
			}.bind( this ), 5 );
		}
	},

	mousedown: function( event ) {
		this.isMouseDown = true;
	},

	mouseup: function( event ) {
		this.isMouseDown = false;
	},

	keydown: function( event ) {
		var shiftKey = 16, ctrlKey = 17, cmdKey = 91;

		// Check if Shift key is down?
		if ( event.keyCode == shiftKey ) {
			this.isShiftKeyDown = true;
		}

		// Check if either Control key or Command key is down?
		else if ( event.keyCode == ctrlKey || event.keyCode == cmdKey ) {
			this.isControlKeyDown = true;
		}

		// Check if either Backspace, Delete or Z key is pressed?
		var backspaceKey = 8, deleteKey = 46, zKey = 90;

		if ( event.target == document.body ) {
			switch ( event.keyCode ) {
				// If either Backspace or Delete key is pressed, delete the selected item.
				case backspaceKey:
				case deleteKey:
					if ( this.current.editing != '' ) {
						if ( ! this.isControlKeyDown && ! this.isShiftKeyDown && ! event.altKey && ! event.metaKey ) {
							var ref = this.refs[ this.current.editing ];

							if ( ref && ref.deleteItem ) {
								event.preventDefault();

								ref.deleteItem();
							}
						}
					}
				break;

				// If Z key is pressed, either undo or redo depending on key combination.
				case zKey:
					if ( this.refs.activity ) {
						// If both Control/Command and Shift key are down, redo the last undo-ed action.
						if ( this.isControlKeyDown && this.isShiftKeyDown ) {
							event.preventDefault();

							this.refs.activity.redo();
						}

						// Otherwise, if Control/Command key is down, undo the last action.
						else if ( this.isControlKeyDown ) {
							event.preventDefault();

							this.refs.activity.undo();
						}
					}
				break;
			}
		}
	},

	keyup: function( event ) {
		var shiftKey = 16, ctrlKey = 17, cmdKey = 91;

		// Check if Shift key is up?
		if ( event.keyCode == shiftKey ) {
			this.isShiftKeyDown = false;
		}

		// Check if either Control key or Command key is up?
		else if ( event.keyCode == ctrlKey || event.keyCode == cmdKey ) {
			this.isControlKeyDown = false;
		}
	},

	/**
	 * Calculate equal height for columns in workspace.
	 *
	 * @return void
	 */
	equalizeHeight: function() {
		if ( ! this.refs.wrapper ) {
			return;
		}

		// Make columns in workspace equal in height.
		var equal_height_workspace = this.refs.wrapper.querySelector( '.equal-height' );

		if ( equal_height_workspace ) {
			// Make sure app is visible.
			var tab = equal_height_workspace.parentNode;

			while ( ! tab.classList.contains( 'tab-pane' ) && tab.nodeName != 'BODY' ) {
				tab = tab.parentNode;
			}

			var tab_css = window.getComputedStyle( tab );

			if ( tab_css.getPropertyValue( 'display' ) != 'none' ) {
				// Calculate max height for columns in workspace.
				var workspace_rect = equal_height_workspace.getBoundingClientRect(),
					max_height = window.innerHeight - workspace_rect.top;

				// Update workspace's height.
				equal_height_workspace.style.height = max_height + 'px';

				// Check if window has scroll-bar after updating workspace's height.
				var scroll_height = ( document.documentElement || document.body ).scrollHeight,
					client_height = ( document.documentElement || document.body ).clientHeight;

				if ( scroll_height > client_height ) {
					max_height -= ( scroll_height - client_height );

					// Update workspace's height one more time to prevent window from having scroll-bar.
					equal_height_workspace.style.height = max_height + 'px';
				}

				// If there is a main workspace or any offcanvas, enlarge it to fit in column height.
				var main_workspace = equal_height_workspace.querySelector( '.main-workspace' ),
					offcanvas = equal_height_workspace.querySelectorAll( '.offcanvas' );

				if ( main_workspace || offcanvas.length ) {
					var container = equal_height_workspace.querySelector( '.workspace-container' ),
						container_css = window.getComputedStyle( container ),
						container_padding_top = parseInt( container_css.getPropertyValue( 'padding-top' ) ),
						container_padding_bottom = parseInt( container_css.getPropertyValue( 'padding-bottom' ) );

					// Calculate max height for main workspace.
					if ( main_workspace ) {
						var main_workspace_height = max_height - container_padding_top - container_padding_bottom;

						main_workspace.style.height = main_workspace_height + 'px';
						main_workspace.style.minHeight = 'auto';
					}

					// Calculate max height for offcanvas.
					if ( offcanvas.length ) {
						for ( var i = 0; i < offcanvas.length; i++ ) {
							if ( offcanvas[ i ].className.match( /jsn-content-(left|right)/ ) ) {
								var offcanvas_height = max_height - container_padding_top - container_padding_bottom;

								offcanvas[ i ].style.height = offcanvas_height + 'px';
								offcanvas[ i ].style.minHeight = 'auto';
							}
						}
					}
				}
			}
		}
	},

	/**
	 * Do some preparation after component was mounted.
	 *
	 * @return void
	 */
	handleComponentDidMount: function() {
		setTimeout( function() {
			// Make columns in workspace equal in height.
			this.equalizeHeight();

			// Track 'click' event to
			document.addEventListener( 'click', function( event ) {
				if ( event.target.nodeName == 'A' && event.target.getAttribute( 'data-dismiss' ) == 'alert' ) {
					this.equalizeHeight();
				}
			}.bind( this ) );

			// Listen to 'resize' event to re-calculate equalized height for columns in workspace.
			window.addEventListener( 'resize', this.equalizeHeight );

			// Listen to both 'mousedown' and 'mouseup' event to store mouse state to editor.
			document.addEventListener( 'mousedown', this.mousedown );
			document.addEventListener( 'mouseup', this.mouseup );

			// Listen to both 'keydown' and 'keyup' event to execute shortcut actions.
			document.addEventListener( 'keydown', this.keydown );
			document.addEventListener( 'keyup', this.keyup );

			// Pre-load item settings if defined.
			if ( this.props.items ) {
				for ( var item in this.props.items ) {
					if ( ! this.props.items[ item ].settings && this.props.items[ item ].file ) {
						( function( item_type ) {
							SunFwHelper.requestUrl(
								sunfw.sunfw_url + this.props.items[ item_type ].file,
								function( req ) {
									// Store settings definition to the item object.
									this.props.items[ item_type ].settings = JSON.parse( req.responseText );

									// If item type is one-time-item, check if the item type is used.
									if ( this.props.items[ item_type ].settings['one-time-item'] ) {
										// Force updating related element in the list of item type.
										this.refs.items.refs[ 'item_type_' + item_type ].forceUpdate();
									}
								}.bind( this )
							);
						}.bind( this ) )( item );
					}
				}
			}

			// Pre-load editable controls if defined.
			if ( this.props.editable ) {
				for ( var control in this.props.editable ) {
					var ComponentName = SunFwHelper.toCamelCase( control, true );

					if ( ComponentName.indexOf ( 'SunFwInput' ) < 0 ) {
						ComponentName = 'SunFwInput' + ComponentName;
					}

					if ( ! window[ ComponentName ] && this.props.editable[ control ].file ) {
						SunFwHelper.loadScriptFile(
							sunfw.sunfw_url + this.props.editable[ control ].file,
							null,
							'babel'
						);
					}
				}
			}

			// Handle preloading assets.
			if ( this.handlePreloadAssets ) {
				this.handlePreloadAssets();
			}
		}.bind( this ), 500 );
	},

	/**
	 * De-register event handlers when un-mounting component.
	 *
	 * @return void
	 */
	handleComponentWillUnmount: function() {
		// Stop listening 'resize' event.
		window.removeEventListener( 'resize', this.equalizeHeight );

		// Stop listening 'mousedown' and 'mouseup' event.
		document.removeEventListener( 'mousedown', this.mousedown );
		document.removeEventListener( 'mouseup', this.mouseup );

		// Stop listening 'keyup' event.
		document.removeEventListener( 'keydown', this.keydown );
		document.removeEventListener( 'keyup', this.keyup );
	},

	/**
	 * Hide droppable marker.
	 *
	 * @param Event event The dispatched event object.
	 *
	 * @return void
	 */
	dragOver: function( event ) {
		// Hide marker.
		this.refs.marker.classList.remove( 'drop-target' );
	},

	/**
	 * Get an modal object.
	 *
	 * @param   object   state  State to set for modal.
	 * @param   boolean  reuse  Whether or not to reuse existing modal even if it is currently visible?
	 *
	 * @return  object  An instance of SunFwModal component.
	 */
	getModal: function( state, reuse ) {
		// Create a data store to save modal instance.
		if ( ! this.modals ) {
			this.modals = [];
		}

		// Get the last created modal.
		var modal, n = this.modals.length;

		if ( n ) {
			// Find a modal that is not in-use.
			for ( var i = 0; i < n; i++ ) {
				if ( reuse || this.modals[ i ].refs.modal.style.display == 'none' ) {
					modal = this.modals[ i ];

					break;
				}
			}
		}

		// Create an editable modal instance.
		if ( ! modal ) {
			// Create an element to hold the modal.
			var id = SunFwHelper.toId( 'modal', true ),
				element = document.createElement( 'div' );

			element.id = id + '_wrapper';

			this.refs.include.appendChild( element );

			// Then render an instance of the editable component.
			modal = ReactDOM.render(
				<SunFwModal
					id={ id }
					key={ this.props.id + '_' + id }
					parent={ this }
					editor={ this }
				/>,
				element
			);

			this.modals.push( modal );
		}

		// Prepare modal state.
		if ( ! state ) {
			state = {};
		}

		if ( state.show === undefined ) {
			state.show = true;
		}

		// Reset modal width.
		if ( ! state.width ) {
			modal.state.width = '';
		}

		// Reset modal height.
		if ( ! state.height ) {
			modal.state.height = '';
		}

		// Reset modal buttons.
		if ( ! state.buttons ) {
			state.buttons = 'default';
		}

		// Set new modal state.
		modal.setState( state );

		// Return the modal instance.
		return modal;
	},

	/**
	 * Get current settings of an item component.
	 *
	 * @param object item An instance of item component.
	 *
	 * @return object
	 */
	getItemSettings: function( item ) {
		// Handle getting item settings.
		if ( this.handleGetItemSettings ) {
			return this.handleGetItemSettings.apply( this, arguments );
		}
	},

	/**
	 * Save setting change for an item component.
	 *
	 * @param object item   An instance of item component.
	 * @param mixed  values New setting values.
	 *
	 * @return void
	 */
	saveItemSettings: function( item, values ) {
		if ( this.handleSaveItemSettings ) {
			// Save item settings.
			this.handleSaveItemSettings( item, values );
		}
	},

	/**
	 * Save editor data.
	 *
	 * @return void
	 */
	save: function() {
		// Backup current button label.
		var button = ( this.refs.save || this.refs.actions.refs.save );

		button._original_label = button.innerHTML;

		// Set saving status to button.
		button.innerHTML = '<i class="icon-apply icon-white margin-right-5"></i> ' + sunfw.text['saving-data'];

		// Handle save action.
		if ( this.handleSave ) {
			// Prepare arguments.
			var args = [];

			for ( var i = 0, n = arguments.length; i < n; i++ ) {
				args[ i ] = arguments[ i ];
			}

			// Define call-back function.
			args.push( function( success ) {
				if ( success ) {
					button.innerHTML = (this.refs.save || this.refs.actions.refs.save)._original_label;

					// Reset activity logs.
					if ( this.refs.activity ) {
						this.refs.activity.reset();
					}

					// Update action state.
					if ( this.refs.actions ) {
						this.refs.actions.forceUpdate();
					}

					// State that data is saved.
					this.setState( { changed: false } );
				} else {
					button.innerHTML = (this.refs.save || this.refs.actions.refs.save)._original_label;
				}
			}.bind( this ) );

			this.handleSave.apply( this, args );
		} else {
			// Restore the original button label.
			button.innerHTML = (this.refs.save || this.refs.actions.refs.save)._original_label;
		}
	}
}
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

window.SunFwMixinInput = {
	getDefaultProps: function() {
		return {
			id: '',
			value: '',
			setting: '',
			control: {}
		};
	},

	initActions: function() {
		if ( this.handleInitActions ) {
			this.handleInitActions();
		}
	},

	initChosen: function( load_assets, options ) {
		// Whether to load Chosen assets.
		if ( load_assets ) {
			SunFwHelper.loadStylesheetFile( sunfw.sunfw_url + '/../../../media/jui/css/chosen.css' );

			SunFwHelper.loadScriptFile(
				sunfw.sunfw_url + '/../../../media/jui/js/chosen.jquery.min.js',
				this.initActions
			);
		}

		// Initialize Chosen for select box.
		else if ( jQuery.fn.chosen !== undefined ) {
			// Set default Chosen options.
			if ( ! options ) {
				options = {
					disable_search: true
				};
			}

			// Get all select box.
			var selects;

			if ( this.refs.wrapper ) {
				selects = this.refs.wrapper.querySelectorAll( 'select' );
			}

			else if ( this.refs.control || this.refs.field || this.refs.selector ) {
				selects = [ this.refs.control || this.refs.field || this.refs.selector ];
			}

			for ( var i = 0; i < selects.length; i++ ) {
				// Check if Chosen should be re-initialized?
				if ( this.changed && selects[ i ]._initialized_chosen ) {
					jQuery( selects[ i ] ).chosen( 'destroy' );

					delete this.changed;
					delete selects[ i ]._initialized_chosen;
				}

				if ( ! selects[ i ]._initialized_chosen ) {
					jQuery( selects[ i ] ).chosen( options ).on( 'change', function( event, params ) {
						if ( this.change ) {
							this.change( event.target.name, params.selected );
						} else {
							this.parent.change( event.target.name, params.selected );
						}
					}.bind( this ) );

					selects[ i ]._initialized_chosen = true;
				}
			}
		}
	},

	popupForm: function( title ) {
		// Prepare form data.
		var data = this.popupData();

		if ( ! data.form && data.rows ) {
			data = { form: data };
		}

		if ( ! data.ref ) {
			data.ref = this;
		}

		if ( ! data.values ) {
			data.values = this.state.value;
		}

		if ( ! data.form['class'] ) {
			data.form['class'] = 'container-fluid';
		} else {
			data.form['class'] += ' container-fluid';
		}

		// Get modal to show form.
		this.editor.getModal( {
			id: '',
			title: title,
			type: 'form',
			content: { data: data },
			'class': ''
		} );
	},

	resetState: function( event ) {
		if ( this.state.value != '' ) {
			// Update parent state.
			this.parent.change( this.props.setting, '' );
		}
	},

	saveSettings: function( values ) {
		if ( this.handleSaveSettings ) {
			return this.handleSaveSettings( values );
		}

		this.parent.change( this.props.setting, values );
	}
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

window.SunFwMixinItem = {
	mouseover: function( event ) {
		if ( ! this.editor.isMouseDown ) {
			event.stopPropagation();

			( this.refs.wrapper || event.target ).classList.add( 'mouseover' );
		}
	},

	mouseout: function( event ) {
		if ( ! this.editor.isMouseDown ) {
			event.stopPropagation();

			( this.refs.wrapper || event.target ).classList.remove( 'mouseover' );
		}
	},

	/**
	 * Handle click event on the link to edit settings for an item component.
	 *
	 * @param object event The dispatched click event object.
	 *
	 * @return void
	 */
	editItem: function( event ) {
		event.preventDefault();

		if ( this.handleEditItem ) {
			this.handleEditItem( event );
		}
	},

	/**
	 * Handle click event on the link to clone an item component in the workspace.
	 *
	 * @param object event The dispatched click event object.
	 *
	 * @return void
	 */
	cloneItem: function( event ) {
		event.preventDefault();

		// Handle cloning action.
		if ( this.handleCloneItem ) {
			this.handleCloneItem();
		}
	},

	/**
	 * Handle click event on the link to toggle the visibility of an item component.
	 *
	 * @param object event The dispatched click event object.
	 *
	 * @return void
	 */
	toggleItem: function( event ) {
		event.preventDefault();

		// Handle toggling the visibility of an item.
		if ( this.handleToggleItem ) {
			this.handleToggleItem();
		}
	},

	/**
	 * Handle click event on the link to delete an item component in the workspace.
	 *
	 * @param object event The dispatched click event object.
	 *
	 * @return void
	 */
	deleteItem: function( event ) {
		event && event.preventDefault();

		// Handle deleting action.
		if ( this.handleDeleteItem ) {
			this.handleDeleteItem();
		}
	}
};
