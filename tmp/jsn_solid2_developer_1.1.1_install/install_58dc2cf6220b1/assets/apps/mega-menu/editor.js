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

window.MegaMenuMixinBase = {
	/**
	 * Transfer element references in the component instance to the editor.
	 */
	handleAfterRender: function() {
		if ( this.editor ) {
			for ( var k in this.refs ) {
				if (
					k.indexOf( 'row_' ) == 0
					||
					k.indexOf( 'column_' ) == 0
					||
					k.indexOf( 'block_' ) == 0
					||
					k.indexOf( 'item_' ) == 0
				) {
					this.editor.refs[ k ] = this.refs[ k ];

					delete this.refs[ k ];
				}
			}
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

window.MegaMenuMixinDroppable = {
	/**
	 * Method to handle dropping item action.
	 *
	 * @param object  droppable The Element object of the droppable target.
	 * @param integer target    The target position at which the item was dropped in.
	 * @param mixed   that      The dropped in item.
	 * @param string  type      Type of the dropped in item.
	 *
	 * @return object New editor state.
	 */
	handleDrop: function( droppable, target, that, type ) {
		// Get current data from the editor.
		var megamenu = this.editor.state.megamenu,
			rows = this.editor.state.rows,
			columns = this.editor.state.columns,
			blocks = this.editor.state.blocks,
			items = this.editor.state.items,
			root, row, column, block, item, label;

		// Prepare root data.
		if ( ! megamenu[ this.props.root ] ) {
			megamenu[ this.props.root ] = {
				settings: {},
				rows: [],
			};
		} else if ( ! megamenu[ this.props.root ].rows ) {
			megamenu[ this.props.root ].rows = [];
		}

		root = megamenu[ this.props.root ];

		// Check if the droppable target accepts row and the dropped in item is an entire row?
		if ( droppable.classList.contains( 'accept-row' ) && type == 'row' ) {
			// Simply move the dropped in row to the target position.
			row = root.rows.splice( that.props.index, 1 )[0];

			if ( target > that.props.index ) {
				root.rows.splice( target - 1, 0, row );
			} else {
				root.rows.splice( target, 0, row );
			}

			// Update root rows.
			megamenu[ this.props.root ].rows = root.rows;

			return {
				megamenu: megamenu,
			};
		}

		// Check if the droppable target accepts column and the dropped in item is an entire column?
		if ( droppable.classList.contains( 'accept-column' ) && type == 'column' ) {
			// Simply move the dropped in column to the target position.
			row = rows[ root.rows[ that.parent.props.index ] ];
			column = row.columns.splice( that.props.index, 1 )[0];

			// If the original row is empty after moving column, delete it.
			if ( ! row.columns.length ) {
				delete rows[ root.rows[ that.parent.props.index ] ];

				root.rows.splice( that.parent.props.index, 1 );

				// If the droppable target is the workspace, alter the target index if needed.
				if (
					droppable.classList.contains( 'accept-row' )
					&&
					target > that.parent.props.index
				) {
					target--;
				}

				// If the droppable target is a sibling of the removed row, alter its index if needed.
				if (
					this.props.type == 'row'
					&&
					this.props.index > that.parent.props.index
				) {
					this.props.index--;
				}
			}

			// Otherwise, re-calculate columns width for the affected row.
			else {
				columns = this.editor.calcColumnWidth( columns, row.columns );
			}

			// Check if the droppable target also accept row (the workspace itself)?
			if ( droppable.classList.contains( 'accept-row' ) ) {
				// Create a new row automatically to hold the column.
				label = sunfw.text.row + ' #' + ( rows.length + 1 );

				rows.push( {
					id: 'row_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					columns: [ column ],
				} );

				// Add row to the specified index in the workspace.
				root.rows.splice( target, 0, rows.length - 1 );

				// Calculate columns width.
				columns = this.editor.calcColumnWidth( columns, [ column ] );

				// Update root rows.
				megamenu[ this.props.root ].rows = root.rows;

				return {
					megamenu: megamenu,
					rows: rows,
					columns: columns,
				};
			}

			// Otherwise, the droppable target is a row in the workspace.
			else {
				// Add column to the specified index in the row.
				rows[ root.rows[ this.props.index ] ].columns.splice( target, 0, column );

				// Re-calculate columns width.
				columns = this.editor.calcColumnWidth( columns, rows[ root.rows[ this.props.index ] ].columns );

				return {
					rows: rows,
					columns: columns,
				};
			}
		}

		// Check if droppable target accepts block and the dropped in item is an entire block?
		if ( droppable.classList.contains( 'accept-block' ) && type == 'block' ) {
			// Simply move the dropped in block to the target position.
			row = rows[ root.rows[ that.parent.parent.props.index ] ];
			column = columns[ row.columns[ that.parent.props.index ] ];
			block = column.blocks.splice( that.props.index, 1 )[0];

			// If the original column is empty after moving block, delete it.
			if ( ! column.blocks.length ) {
				delete columns[ row.columns[ that.parent.props.index ] ];

				row.columns.splice( that.parent.props.index, 1 );

				// If the droppable target is the parent of the removed column, alter the target index if needed.
				if (
					this.props.type == 'row'
					&&
					this == that.parent.parent
					&&
					target > that.parent.props.index
				) {
					target--;
				}

				// If the droppable target is a sibling of the removed column, alter its index if needed.
				if (
					this.props.type == 'column'
					&&
					this.parent == that.parent.parent
					&&
					this.props.index > that.parent.props.index
				) {
					this.props.index--;
				}

				// If the original row is empty after removing the column, delete it.
				if ( ! row.columns.length ) {
					delete rows[ root.rows[ that.parent.parent.props.index ] ];

					root.rows.splice( that.parent.parent.props.index, 1 );

					// If the droppable target is the workspace itself, alter the target index if needed.
					if (
						droppable.classList.contains( 'accept-row' )
						&&
						target > that.parent.parent.props.index
					) {
						target--;
					}

					// If the droppable target is a sibling of the removed row, alter its index if needed.
					if (
						this.props.type == 'row'
						&&
						this.props.index > that.parent.parent.props.index
					) {
						this.props.index--;
					}
				}
			}

			// Check if the droppable target also accept row (the workspace itself)?
			if ( droppable.classList.contains( 'accept-row' ) ) {
				// Create a new column automatically to hold the block.
				label = sunfw.text.column + ' #' + ( columns.length + 1 );

				columns.push( {
					id: 'column_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					blocks: [ block ],
				} );

				// Create a new row automatically to hold the column.
				label = sunfw.text.row + ' #' + ( rows.length + 1 );

				rows.push( {
					id: 'row_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					columns: [ columns.length - 1 ],
				} );

				// Calculate columns width.
				columns = this.editor.calcColumnWidth( columns, [ columns.length - 1 ] );

				// Add row to the specified index in the workspace.
				root.rows.splice( target, 0, rows.length - 1 );

				// Update root rows.
				megamenu[ this.props.root ].rows = root.rows;

				return {
					megamenu: megamenu,
					rows: rows,
					columns: columns,
				};
			}

			// Check if the droppable target is a row in the workspace?
			else if ( droppable.classList.contains( 'accept-column' ) ) {
				// Create a new column automatically to hold the block.
				label = sunfw.text.column + ' #' + ( columns.length + 1 );

				columns.push( {
					id: 'column_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					blocks: [ block ],
				} );

				// Add column to the specified index in the row.
				rows[ root.rows[ this.props.index ] ].columns.splice( target, 0, columns.length - 1 );

				// Re-calculate columns width.
				columns = this.editor.calcColumnWidth( columns, rows[ root.rows[ this.props.index ] ].columns );

				return {
					rows: rows,
					columns: columns,
				};
			}

			// Otherwise, the droppable target is a column in the workspace?
			else {
				// Add block to the specified index in the column.
				row = rows[ root.rows[ this.parent.props.index ] ];

				columns[ row.columns[ this.props.index ] ].blocks.splice( target, 0, block );

				return {
					columns: columns,
				};
			}
		}

		// Add the dropped in item to the target position.
		if ( type == 'item' && typeof that == 'object' ) {
			// Get and remove the item from its original position.
			row = rows[ root.rows[ that.parent.parent.parent.props.index ] ];
			column = columns[ row.columns[ that.parent.parent.props.index ] ];
			block = blocks[ column.blocks[ that.parent.props.index ] ];
			item = block.items.splice( that.props.index, 1 )[0];

			// If the original block is empty after moving item, delete it.
			if ( ! block.items.length ) {
				delete blocks[ column.blocks[ that.parent.props.index ] ];

				column.blocks.splice( that.parent.props.index, 1 );

				// If the droppable target is the parent of the removed block, alter the target index if needed.
				if (
					this.props.type == 'column'
					&&
					this == that.parent.parent
					&&
					target > that.parent.parent.props.index
				) {
					target--;
				}

				// If the droppable target is a sibling of the removed block, alter its index if needed.
				if (
					this.props.type == 'block'
					&&
					this.parent == that.parent.parent
					&&
					this.props.index > that.parent.props.index
				) {
					this.props.index--;
				}

				// If the original column is empty after removing the block, delete it.
				if ( ! column.blocks.length ) {
					delete columns[ row.columns[ that.parent.parent.props.index ] ];

					row.columns.splice( that.parent.parent.props.index, 1 );

					// If the droppable target is the parent of the removed column, alter the target index if needed.
					if (
						this.props.type == 'row'
						&&
						this == that.parent.parent.parent
						&&
						target > that.parent.parent.parent.props.index
					) {
						target--;
					}

					// If the droppable target is a sibling of the removed column, alter its index if needed.
					if (
						this.props.type == 'column'
						&&
						this.parent == that.parent.parent.parent
						&&
						this.props.index > that.parent.parent.props.index
					) {
						this.props.index--;
					}

					// If the original row is empty after removing the column, delete it.
					if ( ! row.columns.length ) {
						delete rows[ root.rows[ that.parent.parent.parent.props.index ] ];

						root.rows.splice( that.parent.parent.parent.props.index, 1 );

						// If the droppable target is the workspace itself, alter the target index if needed.
						if (
							droppable.classList.contains( 'accept-row' )
							&&
							target > that.parent.parent.parent.props.index
						) {
							target--;
						}

						// If the droppable target is a sibling of the removed row, alter its index if needed.
						if (
							this.props.type == 'row'
							&&
							this.props.index > that.parent.parent.parent.props.index
						) {
							this.props.index--;
						}
					}

					// Otherwise, re-calculate columns width for the affected row.
					else {
						columns = this.editor.calcColumnWidth( columns, row.columns );
					}
				}
			}
		} else if ( typeof that == 'string' ) {
			label = this.editor.props.items[ that ].label || sunfw.text.item + ' #' + ( items.length + 1 );

			items.push( {
				id: 'item_' + SunFwHelper.toId( sunfw.text.item + ' #' + ( items.length + 1 ) ),
				type: that,
				label: label,
				settings: {},
			} );

			item = items.length - 1;
		}

		if ( item !== undefined ) {
			// Check if the droppable target also accept row (the workspace itself)?
			if ( droppable.classList.contains( 'accept-row' ) ) {
				// Create a new block automatically to hold the item.
				label = sunfw.text.block + ' #' + ( blocks.length + 1 );

				blocks.push( {
					id: 'block_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					items: [ item ],
				} );

				// Create a new column automatically to hold the block.
				label = sunfw.text.column + ' #' + ( columns.length + 1 );

				columns.push( {
					id: 'column_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					blocks: [ blocks.length - 1 ],
				} );

				// Create a new row automatically to hold the column.
				label = sunfw.text.row + ' #' + ( rows.length + 1 );

				rows.push( {
					id: 'row_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					columns: [ columns.length - 1 ],
				} );

				// Calculate columns width.
				columns = this.editor.calcColumnWidth( columns, [ columns.length - 1 ] );

				// Add row to the specified index in the workspace.
				root.rows.splice( target, 0, rows.length - 1 );

				// Update root rows.
				megamenu[ this.props.root ].rows = root.rows;

				return {
					megamenu: megamenu,
					rows: rows,
					columns: columns,
					blocks: blocks,
					items: items,
				};
			}

			// Check if the droppable target is a row in the workspace?
			else if ( droppable.classList.contains( 'accept-column' ) ) {
				// Create a new block automatically to hold the item.
				label = sunfw.text.block + ' #' + ( blocks.length + 1 );

				blocks.push( {
					id: 'block_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					items: [ item ],
				} );

				// Create a new column automatically to hold the block.
				label = sunfw.text.column + ' #' + ( columns.length + 1 );

				columns.push( {
					id: 'column_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					blocks: [ blocks.length - 1 ],
				} );

				// Add column to the specified index in the row.
				rows[ root.rows[ this.props.index ] ].columns.splice( target, 0, columns.length - 1 );

				// Calculate columns width.
				columns = this.editor.calcColumnWidth( columns, rows[ root.rows[ this.props.index ] ].columns );

				return {
					rows: rows,
					columns: columns,
					blocks: blocks,
					items: items,
				};
			}

			// Check if the droppable target is a column in the workspace?
			else if ( droppable.classList.contains( 'accept-block' ) ) {
				// Create a new block automatically to hold the item.
				label = sunfw.text.block + ' #' + ( blocks.length + 1 );

				blocks.push( {
					id: 'block_' + SunFwHelper.toId( label ),
					label: label,
					settings: {},
					items: [ item ],
				} );

				// Add block to the specified index in the column.
				row = rows[ root.rows[ this.parent.props.index ] ];

				columns[ row.columns[ this.props.index ] ].blocks.splice( target, 0, blocks.length - 1 );

				return {
					columns: columns,
					blocks: blocks,
					items: items,
				};
			}
			
			// Otherwise, the droppable target is a block in the workspace.
			else {
				// Add item to the specified index in the block.
				row = rows[ root.rows[ this.parent.parent.props.index ] ];
				column = columns[ row.columns[ this.parent.props.index ] ];
				
				if (typeof column == 'undefined')
				{
					column = columns[ row.columns[ (this.parent.props.index - 1) ] ];
				}	
				
				blocks[ column.blocks[ this.props.index ] ].items.splice( target, 0, item );

				return {
					blocks: blocks,
					items: items,
				};
			}
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

window.MegaMenuMixinEditable = {
	/**
	 * Method to get the type of the dragging item.
	 *
	 * @return string
	 */
	getItemType: function( item ) {
		var item = item || this, type = 'item';

		if (
			typeof item == 'object'
			&&
			[ 'row', 'column', 'block' ].indexOf( item.props.type ) > -1
		) {
			type = item.props.type;
		}

		return type;
	},

	/**
	 * Method to handle saving item label.
	 *
	 * @param string label New item label.
	 * @param string id    New item ID.
	 *
	 * @return object New editor state.
	 */
	handleSaveLabel: function( label, id ) {
		// Get data store.
		var root = this.editor.state.megamenu[ this.props.root ],
			rows = this.editor.state.rows,
			columns = this.editor.state.columns,
			blocks = this.editor.state.blocks,
			items = this.editor.state.items;

		switch ( this.props.type ) {
			case 'row':
				rows[ root.rows[ this.props.index ] ].id = id;
				rows[ root.rows[ this.props.index ] ].label = label;
			break;

			case 'column':
				columns[
					rows[
						root.rows[ this.parent.props.index ]
					]
					.columns[ this.props.index ]
				]
				.id = id;

				columns[
					rows[
						root.rows[ this.parent.props.index ]
					]
					.columns[ this.props.index ]
				]
				.label = label;
			break;

			case 'block':
				blocks[
					columns[
						rows[
							root.rows[ this.parent.parent.props.index ]
						]
						.columns[ this.parent.props.index ]
					]
					.blocks[ this.props.index ]
				]
				.id = id;

				blocks[
					columns[
						rows[
							root.rows[ this.parent.parent.props.index ]
						]
						.columns[ this.parent.props.index ]
					]
					.blocks[ this.props.index ]
				]
				.label = label;
			break;

			default:
				items[
					blocks[
						columns[
							rows[
								root.rows[ this.parent.parent.parent.props.index ]
							]
							.columns[ this.parent.parent.props.index ]
						]
						.blocks[ this.parent.props.index ]
					]
					.items[ this.props.index ]
				]
				.id = id;

				items[
					blocks[
						columns[
							rows[
								root.rows[ this.parent.parent.parent.props.index ]
							]
							.columns[ this.parent.parent.props.index ]
						]
						.blocks[ this.parent.props.index ]
					]
					.items[ this.props.index ]
				]
				.label = label;
			break;
		}

		return {
			rows: rows,
			columns: columns,
			blocks: blocks,
			items: items,
		};
	},

	/**
	 * Method to handle cloning an item.
	 *
	 * @return object New editor state.
	 */
	handleCloneItem: function() {
		// Get current data from the editor.
		var root = this.editor.state.megamenu[ this.props.root ],
			rows = this.editor.state.rows,
			columns = this.editor.state.columns,
			blocks = this.editor.state.blocks,
			items = this.editor.state.items,
			item;

		// Define function to clone nested items.
		function cloneChildren( type, children ) {
			var ids = [], nested_ids, item;

			for ( var i = 0, n = children.length; i < n; i++ ) {
				switch ( type ) {
					case 'column':
						// Clone all nested items first.
						nested_ids = cloneChildren( 'block', columns[ children[ i ] ].blocks );

						// Then, clone the current item.
						item = JSON.parse( JSON.stringify( columns[ children[ i ] ] ) );
						item.label = item.label + sunfw.text['clone-label'];
						item.id = 'column_' + SunFwHelper.toId( item.label );
						item.blocks = nested_ids;

						ids.push( columns.length );
						columns.push( item );
					break;

					case 'block':
						// Clone all nested items first.
						nested_ids = cloneChildren( 'item', blocks[ children[ i ] ].items );

						// Then, clone the current item.
						item = JSON.parse( JSON.stringify( blocks[ children[ i ] ] ) );
						item.label = item.label + sunfw.text['clone-label'];
						item.id = 'block_' + SunFwHelper.toId( item.label );
						item.items = nested_ids;

						ids.push( blocks.length );
						blocks.push( item );
					break;

					case 'item':
						item = JSON.parse( JSON.stringify( items[ children[ i ] ] ) );
						item.label = item.label + sunfw.text['clone-label'];
						item.id = 'item_' + SunFwHelper.toId( item.label );

						ids.push( items.length );
						items.push( item );
					break;
				}
			}

			return ids;
		}

		// Clone the current item.
		var nested_ids, item;

		switch ( this.props.type ) {
			case 'row':
				// Clone all nested columns first.
				nested_ids = cloneChildren( 'column', rows[ root.rows[ this.props.index ] ].columns );

				// Then, clone the row.
				item = JSON.parse( JSON.stringify( rows[ root.rows[ this.props.index ] ] ) );
				item.label = item.label + sunfw.text['clone-label'];
				item.id = 'row_' + SunFwHelper.toId( item.label );
				item.columns = nested_ids;

				rows.push( item );

				// Inject the newly created row into the current root.
				this.editor.state.megamenu[ this.props.root ].rows.splice( this.props.index + 1, 0, rows.length - 1 );
			break;

			case 'column':
				// Get the parent row.
				var row = rows[ root.rows[ this.parent.props.index ] ];

				// Clone all nested blocks first.
				nested_ids = cloneChildren( 'block', columns[ row.columns[ this.props.index ] ].blocks );

				// Then, clone the column.
				item = JSON.parse( JSON.stringify( columns[ row.columns[ this.props.index ] ] ) );
				item.label = item.label + sunfw.text['clone-label'];
				item.id = 'column_' + SunFwHelper.toId( item.label );
				item.blocks = nested_ids;

				columns.push( item );

				// Inject the newly created column into the parent row.
				row.columns.splice( this.props.index + 1, 0, columns.length - 1 );

				rows[ root.rows[ this.parent.props.index ] ] = row;

				// Re-calculate column width for the affected row.
				columns = this.editor.calcColumnWidth( columns, row.columns );
			break;

			case 'block':
				// Get the parent column.
				var column = columns[
					rows[
						root.rows[ this.parent.parent.props.index ]
					]
					.columns[ this.parent.props.index ]
				];

				// Clone all nested items first.
				nested_ids = cloneChildren( 'item', blocks[ column.blocks[ this.props.index ] ].items );

				// Then, clone the block.
				item = JSON.parse( JSON.stringify( blocks[ column.blocks[ this.props.index ] ] ) );
				item.label = item.label + sunfw.text['clone-label'];
				item.id = 'block_' + SunFwHelper.toId( item.label );
				item.items = nested_ids;

				blocks.push( item );

				// Inject the newly created block into the parent column.
				column.blocks.splice( this.props.index + 1, 0, blocks.length - 1 );

				columns[
					rows[
						root.rows[ this.parent.parent.props.index ]
					]
					.columns[ this.parent.props.index ]
				] = column;
			break;

			default:
				// Get the parent block.
				var block = blocks[
					columns[
						rows[
							root.rows[ this.parent.parent.parent.props.index ]
						]
						.columns[ this.parent.parent.props.index ]
					]
					.blocks[ this.parent.props.index ]
				];

				// Clone the item.
				item = JSON.parse( JSON.stringify( items[ block.items[ this.props.index ] ] ) );
				item.label = item.label + sunfw.text['clone-label'];
				item.id = 'item_' + SunFwHelper.toId( item.label );

				items.push( item );

				// Inject the newly created item into the parent block.
				block.items.splice( this.props.index + 1, 0, items.length - 1 );

				blocks[
					columns[
						rows[
							root.rows[ this.parent.parent.parent.props.index ]
						]
						.columns[ this.parent.parent.props.index ]
					]
					.blocks[ this.parent.props.index ]
				] = block;
			break;
		}

		return {
			rows: rows,
			columns: columns,
			blocks: blocks,
			items: items,
		};
	},

	/**
	 * Method to handle toggling the visibility of an item.
	 *
	 * @return object New editor state.
	 */
	handleToggleItem: function() {
		// Get current data from the editor.
		var root = this.editor.state.megamenu[ this.props.root ],
			rows = this.editor.state.rows,
			columns = this.editor.state.columns,
			blocks = this.editor.state.blocks,
			items = this.editor.state.items,
			item;

		// Toggle visibility state for the item.
		switch ( this.props.type ) {
			case 'row':
				rows[ root.rows[ this.props.index ] ].settings.disabled
					= ! rows[ root.rows[ this.props.index ] ].settings.disabled;
			break;

			case 'column':
				// Get the parent row.
				var row = rows[ root.rows[ this.parent.props.index ] ];

				columns[ row.columns[ this.props.index ] ].settings.disabled
					= ! columns[ row.columns[ this.props.index ] ].settings.disabled;
			break;

			case 'block':
				// Get the parent column.
				var column = columns[
					rows[
						root.rows[ this.parent.parent.props.index ]
					]
					.columns[ this.parent.props.index ]
				];

				blocks[ column.blocks[ this.props.index ] ].settings.disabled
					= ! blocks[ column.blocks[ this.props.index ] ].settings.disabled;
			break;

			default:
				// Get the parent block.
				var block = blocks[
					columns[
						rows[
							root.rows[ this.parent.parent.parent.props.index ]
						]
						.columns[ this.parent.parent.props.index ]
					]
					.blocks[ this.parent.props.index ]
				];

				items[ block.items[ this.props.index ] ].settings.disabled
					= ! items[ block.items[ this.props.index ] ].settings.disabled;
			break;
		}

		return {
			rows: rows,
			columns: columns,
			blocks: blocks,
			items: items,
		};
	},

	/**
	 * Method to handle deleting an item.
	 *
	 * @return object New editor state.
	 */
	handleDeleteItem: function() {
		// Get current data from the editor.
		var megamenu = this.editor.state.megamenu,
			root = megamenu[ this.props.root ],
			rows = this.editor.state.rows,
			columns = this.editor.state.columns,
			blocks = this.editor.state.blocks,
			items = this.editor.state.items;

		// Define function to delete nested items.
		function deleteChildren( type, children ) {
			for ( var i = 0, n = children.length; i < n; i++ ) {
				switch ( type ) {
					case 'column':
						// Delete all nested items first.
						deleteChildren( 'block', columns[ children[ i ] ].blocks );

						// Then, delete the current item.
						delete columns[ children[ i ] ];
					break;

					case 'block':
						// Delete all nested items first.
						deleteChildren( 'item', blocks[ children[ i ] ].items );

						// Then, delete the current item.
						delete blocks[ children[ i ] ];
					break;

					case 'item':
						delete items[ children[ i ] ];
					break;
				}
			}
		}

		// Delete the current item.
		switch ( this.props.type ) {
			case 'row':
				// Delete all nested columns first.
				deleteChildren( 'column', rows[ root.rows[ this.props.index ] ].columns );

				// Then, delete the row.
				delete rows[ root.rows[ this.props.index ] ];

				// Remove the row from the current root.
				megamenu[ this.props.root ].rows.splice( this.props.index, 1 );
			break;

			case 'column':
				// Get the parent row.
				var row = rows[ root.rows[ this.parent.props.index ] ];

				// If the column being deleted is the last one in the row, then delete the row instead.
				if ( row.columns.length == 1 ) {
					return this.editor.refs[ row.id ].deleteItem();
				}

				// Otherwise, delete all nested blocks first.
				deleteChildren( 'block', columns[ row.columns[ this.props.index ] ].blocks );

				// Then, delete the column.
				delete columns[ row.columns[ this.props.index ] ];

				// Remove the deleted column from the parent row.
				row.columns.splice( this.props.index, 1 );

				rows[ root.rows[ this.parent.props.index ] ] = row;

				// Re-calculate columns width for the parent row.
				columns = this.editor.calcColumnWidth( columns, row.columns );
			break;

			case 'block':
				var column = columns[
					rows[
						root.rows[ this.parent.parent.props.index ]
					]
					.columns[ this.parent.props.index ]
				];

				// If the block being deleted is the last one in the column, then delete the column instead.
				if ( column.blocks.length == 1 ) {
					return this.editor.refs[ column.id ].deleteItem();
				}

				// Otherwise, delete all nested items first.
				deleteChildren( 'item', blocks[ column.blocks[ this.props.index ] ].items );

				// Then, delete the block.
				delete blocks[ column.blocks[ this.props.index ] ];

				// Remove the deleted block from the parent column.
				block = blocks[ column.blocks.splice( this.props.index, 1 )[0] ];

				columns[
					rows[
						root.rows[ this.parent.parent.props.index ]
					]
					.columns[ this.parent.props.index ]
				] = column;
			break;

			default:
				// Get the parent block.
				var block = blocks[
					columns[
						rows[
							root.rows[ this.parent.parent.parent.props.index ]
						]
						.columns[ this.parent.parent.props.index ]
					]
					.blocks[ this.parent.props.index ]
				];

				// If the item being deleted is the last one in the block, then delete the block instead.
				if ( block.items.length == 1 ) {
					return this.editor.refs[ block.id ].deleteItem();
				}

				// Otherwise, delete the item.
				delete items[ block.items[ this.props.index ] ];

				// Remove the deleted item from the parent block.
				block.items.splice( this.props.index, 1 );

				blocks[
					columns[
						rows[
							root.rows[ this.parent.parent.parent.props.index ]
						]
						.columns[ this.parent.parent.props.index ]
					]
					.blocks[ this.parent.props.index ]
				] = block;
			break;
		}

		return {
			megamenu: megamenu,
			rows: rows,
			columns: columns,
			blocks: blocks,
			items: items,
		};
	},
}
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

window.MegaMenu = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinEditor ],

	getDefaultProps: function() {
		return {
			id: '',
			menus: {},
			items: {},
			generals: {},
			options: {},
			editable: {},
		};
	},

	getInitialState: function() {
		return {
			currentLang: '*',
			currentMenu: '',
			currentRoot: '',
			generals: {},
			options: {},
			rows: [],
			columns: [],
			blocks: [],
			items: [],
			megamenu: {},
		};
	},

	render: function() {
		// Prepare current menu.
		if ( this.state.currentMenu == '' ) {
			for ( var v in this.props.menus ) {
				if ( this.props.menus[ v ].language == this.state.currentLang ) {
					this.state.currentMenu = v;

					break;
				}
			}
		}

		// Prepare current root item.
		if ( this.state.currentRoot == '' ) {
			this.state.currentRoot = this.props.menus[ this.state.currentMenu ].items[0].id;
		}

		return (
			<div
				id={ this.props.id }
				key={ this.props.id }
				ref="wrapper"
				className="mega-menu"
				onDragOver={ this.dragOver }
			>
				<div className="jsn-pageheader padding-top-20 padding-bottom-20">
					<div className="container-fluid text-center">
						<div className="pull-left"><h3 className="margin-0 line-height-30">
							{ sunfw.text['navigation'] }
						</h3></div>

						<SunFwActivity
							id="activity"
							key={ this.props.id + '_activity' }
							ref="activity"
							parent={ this }
							editor={ this }
						/>

						<div className="pull-right">
							<button
								ref="save"
								type="button"
								onClick={ this.save }
								className="btn btn-warning text-uppercase"
							>
								<i className="fa fa-floppy-o font-size-14 margin-right-5"></i>
								{ sunfw.text[ 'save-menu' ] }
							</button>
						</div>
					</div>
				</div>

				<div className="jsn-main-content">
					<div className="container-fluid">
						<div className="row">
							<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
								<div className="jsn-navigation-header padding-top-25 padding-bottom-20">
									<div className="row">
										<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 general">
											<legend>{ sunfw.text[ 'general' ] }</legend>
											<SunFwOptions
												id="options"
												key={ this.props.id + '_generals' }
												ref="options"
												parent={ this }
												editor={ this }
												options={ this.props.generals }
												namespace="generals"
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mega-menu">
											<legend>{ sunfw.text[ 'megamenu' ] }</legend>
											<MegaMenuSelector
												id="selector"
												key={ this.props.id + '_selector' }
												ref="selector"
												menus={ this.props.menus }
												parent={ this }
												editor={ this }
											/>
											<div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 options">
												<SunFwOptions
													id="options"
													key={ this.props.id + '_options' }
													ref="options"
													parent={ this }
													editor={ this }
													options={ this.props.options }
													namespace="options"
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="jsn-menu-content">
									<div className="row list-menu">
										<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
											<MegaMenuRoots
												id="roots"
												key={ this.props.id + '_roots' }
												ref="roots"
												roots={ this.props.menus[ this.state.currentMenu ].items }
												parent={ this }
												editor={ this }
											/>
										</div>
									</div>
									<div className="row nav-config-megamenu">
										<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
											<MegaMenuRootSettings
												id="root_settings"
												key={ this.props.id + '_root_settings' }
												ref="root_settings"
												root={ this.state.currentRoot }
												parent={ this }
												editor={ this }
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="row megamenu-content-cf">
							<div className="col-right">
								<div className="jsn-content-inner">
									<div className="jsn-content-main">
										<MegaMenuWorkspace
											id="workspace"
											key={ this.props.id + '_workspace' }
											ref="workspace"
											root={ this.state.currentRoot }
											parent={ this }
											editor={ this }
											rows={
												this.state.megamenu[ this.state.currentRoot ]
													? ( this.state.megamenu[ this.state.currentRoot ].rows
														? this.state.megamenu[ this.state.currentRoot ].rows
														: []
													) : []
											}
										/>
									</div>
								</div>
							</div>

							<div className="col-left border-left parent-sidebar">
								<div className="jsn-sidebar">
									<SunFwItems
										id="items"
										key={ this.props.id + '_items' }
										ref="items"
										items={ this.props.items }
										parent={ this }
										editor={ this }
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div ref="marker" className="droppable-marker"></div>

				<div ref="include"></div>
			</div>
		);
	},

	/**
	 * Calculate width for a newly added column and all its siblings or
	 * re-calculate width after a column is removed.
	 *
	 * @param array columnsDataArray The columns data array.
	 * @param array columnsInRow     Array of columns in the row that needs to calculate column width.
	 *
	 * @return void
	 */
	calcColumnWidth: function( columnsDataArray, columnsInRow ) {
		// Get the current screen.
		var screen = this.state.currentScreen;

		// It's easiest if the 12 columns grid can split equally.
		if ( 12 % columnsInRow.length == 0 ) {
			columnsInRow.map( ( columnIndex ) => {
				columnsDataArray[ columnIndex ].width = 12 / columnsInRow.length;
			} );
		}

		// It's rather complex if the 12 columns grid cannot split equally.
		else {
			var newWidth = Math.floor( 12 / columnsInRow.length );

			columnsInRow.map( ( columnIndex ) => {
				columnsDataArray[ columnIndex ].width = newWidth;
			} );

			// If the total width is less than 12 columns, expand each column 1 unit until fit.
			if ( 12 % columnsInRow.length > 0 ) {
				for ( var i = 1, n = 12 % columnsInRow.length; i <= n; i++ ) {
					columnsDataArray[ columnsInRow[ columnsInRow.length - i ] ].width += 1;
				}
			}
		}

		return columnsDataArray;
	},

	/**
	 * Get and return settings for an item.
	 *
	 * @param object item An instance of item component.
	 *
	 * @return object
	 */
	handleGetItemSettings: function( item ) {
		// Get data store.
		var root = this.state.megamenu[ item.props.root ],
			rows = this.state.rows,
			columns = this.state.columns,
			blocks = this.state.blocks,
			items = this.state.items;

		switch ( item.props.type ) {
			case 'offcanvas':
				return root.settings;
			break;

			case 'row':
				return rows[ root.rows[ item.props.index ] ].settings;
			break;

			case 'column':
				return columns[
					rows[
						root.rows[ item.parent.props.index ]
					]
					.columns[ item.props.index ]
				]
				.settings;
			break;

			case 'block':
				return blocks[
					columns[
						rows[
							root.rows[ item.parent.parent.props.index ]
						]
						.columns[ item.parent.props.index ]
					]
					.blocks[ item.props.index ]
				]
				.settings;
			break;

			default:
				return items[
					blocks[
						columns[
							rows[
								root.rows[ item.parent.parent.parent.props.index ]
							]
							.columns[ item.parent.parent.props.index ]
						]
						.blocks[ item.parent.props.index ]
					]
					.items[ item.props.index ]
				]
				.settings;
			break;
		}
	},

	/**
	 * Save setting change for an item component.
	 *
	 * @param object item   An instance of item component.
	 * @param mixed  values New setting values.
	 *
	 * @return object New editor state.
	 */
	handleSaveItemSettings: function( item, values ) {
		// Get data store.
		var root = this.state.megamenu[ item.props.root ],
			rows = this.state.rows,
			columns = this.state.columns,
			blocks = this.state.blocks,
			items = this.state.items;

		switch ( item.props.type ) {
			case 'offcanvas':
				this.state.megamenu[ item.props.root ].settings = values;
			break;

			case 'row':
				rows[ root.rows[ item.props.index ] ].settings = values;
			break;

			case 'column':
				columns[
					rows[
						root.rows[ item.parent.props.index ]
					]
					.columns[ item.props.index ]
				]
				.settings = values;
			break;

			case 'block':
				blocks[
					columns[
						rows[
							root.rows[ item.parent.parent.props.index ]
						]
						.columns[ item.parent.props.index ]
					]
					.blocks[ item.props.index ]
				]
				.settings = values;
			break;

			default:
				items[
					blocks[
						columns[
							rows[
								root.rows[ item.parent.parent.parent.props.index ]
							]
							.columns[ item.parent.parent.props.index ]
						]
						.blocks[ item.parent.props.index ]
					]
					.items[ item.props.index ]
				]
				.settings = values;
			break;
		}

		return {
			rows: rows,
			columns: columns,
			blocks: blocks,
			items: items,
		};
	},

	/**
	 * Save mega menu data.
	 *
	 * @param function callback Call back function to finalize the save action.
	 *
	 * @return void
	 */
	handleSave: function( callback ) {
		// Get template data.
		var token        = document.querySelector( '#jsn-tpl-token' ).value;
		var styleID      = document.querySelector( '#jsn-style-id'  ).value;
		var templateName = document.querySelector( '#jsn-tpl-name'  ).value;

		// Prepare server to save layout.
		var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=megamenu&action=save&'
			+ token + '=1&style_id=' + styleID + '&template_name=' + templateName;

		// Get call back function.
		var callback = arguments[ arguments.length - 1 ];

		// Send request to save layout data.
		SunFwHelper.requestUrl(
			server,
			function( req ) {
				try {
					var response = JSON.parse( req.responseText );
				} catch ( e ) {
					// Do nothing.
				}
				if ( response && response.type == 'success' ) {
					callback( true );
					bootbox.alert(window.sunfw.text['save-success'], function() {});
				} else {
					callback( false );

					bootbox.alert( ( response && response.data ) ? response.data : req.responseText );
				}
			},
			{ data: JSON.stringify( this.state ) }
		);
	},
} );
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

window.MegaMenuRootSettings = React.createClass( {
	mixins: [ SunFwMixinBase ],

	getDefaultProps: function() {
		return {
			root: null,
		};
	},

	render: function() {
		// Get data for the specified root item.
		var settings = {};

		if (
			this.props.root
			&&
			this.editor.state.megamenu[ this.props.root ]
			&&
			this.editor.state.megamenu[ this.props.root ].settings
		) {
			settings = this.editor.state.megamenu[ this.props.root ].settings;
		}

		// Generate data for editable component.
		var data = {
			ref: this,
			form: {
				rows: [
					{
						'class': 'content-cf',
						cols: [
							{
								'class': 'item-setting on-off',
								settings: {
									enabled: {
										type: 'toggle',
										value: 1,
										label: 'mega-menu',
									},
								},
							},
							{
								'class': 'item-setting submenu-w',
								settings: {
									width: {
										type: 'text',
										label: 'submenu-width',
										description: 'px',
									},
								},
							},
							{
								'class': 'item-setting on-off',
								settings: {
									full: {
										type: 'toggle',
										value: 1,
										label: 'Full Width',
									},
								},
							},
							{
								'class': 'item-setting submenu-align',
								settings: {
									align: {
										type: 'radio',
										label: 'submenu-align',
										options: [
											{
												'class': 'hidden',
												label: ( <i className="fa fa-align-left"></i> ),
												value: 'left',
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-align-center"></i> ),
												value: 'center',
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-align-right"></i> ),
												value: 'right',
											},
										],
									},
								},
							},
							{
								'class': 'item-setting',
								settings: {
									icon: {
										type: 'icon-picker',
										label: 'submenu-icon',
									},
								},
							},
							{
								'class': 'item-setting',
								settings: {
									desc: {
										type: 'text',
										label: 'submenu-desc',
									},
								},
							},
						],
					},
				],
			},
			values: settings,
			inline: true,
		};

		return (
			<SunFwEditable
				key={ this.props.root + '_settings' }
				data={ data }
				parent={ this }
				editor={ this.editor }
			/>
		);
	},

	handleSettingChange: function( settings ) {
		if ( this.props.root ) {
			// Get root item data.
			var megamenu = this.editor.state.megamenu;

			megamenu[ this.props.root ] = megamenu[ this.props.root ] || { settings: {} };

			// Prepare root item settings.
			if ( megamenu[ this.props.root ].settings instanceof Array ) {
				megamenu[ this.props.root ].settings = {};
			}

			// Set new settings.
			for ( var p in settings ) {
				megamenu[ this.props.root ].settings[ p ] = settings[ p ];
			}

			// Set new editor state.
			this.editor.setState( { megamenu: megamenu } );
		}
	},
} );
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

window.MegaMenuRoots = React.createClass( {
	mixins: [ SunFwMixinBase ],

	getDefaultProps: function() {
		return {
			id: '',
			roots: [],
		};
	},

	render: function() {
		var roots = [], className;

		this.props.roots.map( ( root ) => {
			className = root.id == this.editor.state.currentRoot ? 'active' : '';

			roots.push(
				<li className={ className }>
					<a href="#" onClick={ this.changeRoot } data-value={ root.id }>
						{ root.title }
					</a>
				</li>
			);
		} );

		return (
			<ul className="nav navbar-nav">
				{ roots }
			</ul>
		);
	},

	changeRoot: function( event ) {
		event.preventDefault();

		this.editor.setState( {
			currentRoot: event.target.getAttribute( 'data-value' ),
		} );
	},
} );
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

window.MegaMenuSelector = React.createClass( {
	mixins: [ SunFwMixinBase ],

	getDefaultProps: function() {
		return {
			menus: {},
		}
	},

	render: function() {
		var langs = [], menus = [], menu, className, selected;

		for ( var v in this.props.menus ) {
			menu = this.props.menus[ v ];
			className = menu.language == this.editor.state.currentLang ? '' : 'hidden';
			selected = v == this.editor.state.currentMenu ? true : false;

			menus.push(
				<option
					value={ v }
					selected={ selected }
					className={ className }
				>
					{ menu.text }
				</option>
			);

			if ( langs.indexOf( menu.language ) < 0 ) {
				langs.push( menu.language );
			}
		}

		langs.map( ( lang, index ) => {
			selected = lang == this.editor.state.currentLang ? true : false;

			langs[ index ] = (
				<option value={ lang } selected={ selected }>
					{ sunfw.text[ 'language-' + lang ] ? sunfw.text[ 'language-' + lang ] : lang }
				</option>
			);
		} );

		return (
			<div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
				<div className="item-setting">
					<div className="title-label display-inline margin-right-5">
						{ sunfw.text.language }
					</div>
					<select
						ref="language_selector"
						name="language"
						className="form-control"
						onChange={ this.changeLanguage }
					>
						{ langs }
					</select>
				</div>
				<div className="item-setting">
					<div className="title-label display-inline margin-right-5">
						{ sunfw.text.menu }
					</div>
					<select
						ref="menu_selector"
						name="language"
						className="form-control"
						onChange={ this.changeMenu }
					>
						{ menus }
					</select>
				</div>
			</div>
		);
	},

	changeLanguage: function( event ) {
		event.preventDefault();

		this.editor.setState( {
			currentLang: event.target.options[ event.target.selectedIndex ].value,
			currentMenu: '',
		} );
	},

	changeMenu: function( event ) {
		event.preventDefault();

		this.editor.setState( {
			currentMenu: event.target.options[ event.target.selectedIndex ].value,
			currentRoot: '',
		} );
	},
} );
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

window.MegaMenuWorkspace = React.createClass( {
	mixins: [ SunFwMixinBase, MegaMenuMixinBase, SunFwMixinDroppable, MegaMenuMixinDroppable ],

	getDefaultProps: function() {
		return {
			root: '',
			rows: [],
		};
	},

	render: function() {
		var rows = [], row;

		this.props.rows.map( ( rowIndex, index ) => {
			row = this.editor.state.rows[ rowIndex ];

			if ( row ) {
				rows.push(
					<MegaMenuRow
						id={ row.id }
						key={ this.editor.props.id + '_' + rowIndex }
						ref= { row.id }
						root={ this.props.root }
						label={ row.label }
						index={ index }
						parent={ this }
						editor={ this.editor }
						columns={ row.columns }
						disabled={
							( row.settings && row.settings.disabled )
								? row.settings.disabled
								: false
						}
					/>
				);
			}
		} );

		return (
			<div
				className="mega-menu-workspace droppable accept-row accept-column accept-block accept-item"
				onDragOver={ this.dragOver }
				onDrop={ this.drop }
			>
				{ rows }
			</div>
		);
	},
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

window.MegaMenuBlock = React.createClass( {
	mixins: [
		SunFwMixinBase,
		MegaMenuMixinBase,
		SunFwMixinEditable,
		MegaMenuMixinEditable,
		SunFwMixinDraggable,
		SunFwMixinDroppable,
		MegaMenuMixinDroppable,
	],

	getDefaultProps: function() {
		return {
			id: '',
			root: '',
			type: 'block',
			label: '',
			index: 0,
			items: [],
			settings: {
				'class': 'form-horizontal',
				rows: [
					{
						'class': 'margin-top-right',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'margin-top': {
										type: 'text',
										label: sunfw.text['margin-top'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'margin-right': {
										type: 'text',
										label: sunfw.text['margin-right'],
									},
								},
							},
						],
					},
					{
						'class': 'margin-bottom-left',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'margin-left': {
										type: 'text',
										label: sunfw.text['margin-left'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'margin-bottom': {
										type: 'text',
										label: sunfw.text['margin-bottom'],
									},
								},
							},
						],
					},
					{
						'class': 'padding-top-right',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'padding-top': {
										type: 'text',
										label: sunfw.text['padding-top'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'padding-right': {
										type: 'text',
										label: sunfw.text['padding-right'],
									},
								},
							},
						],
					},
					{
						'class': 'padding-bottom-left',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'padding-left': {
										type: 'text',
										label: sunfw.text['padding-left'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'padding-bottom': {
										type: 'text',
										label: sunfw.text['padding-bottom'],
									},
								},
							},
						],
					},
				],
			},
		};
	},

	render: function() {
		var className = 'mega-menu-item draggable-item',
			items = [], item;

		if ( this.props.disabled ) {
			className += ' disabled-item';
		}

		this.props.items.map( ( itemIndex, index ) => {
			item = this.editor.state.items[ itemIndex ];

			if ( item ) {
				items.push(
					<MegaMenuItem
						id={ item.id }
						key={ this.editor.props.id + '_' + itemIndex }
						ref= { item.id }
						root={ this.props.root }
						type={ item.type }
						label={ item.label }
						index={ index }
						parent={ this }
						editor={ this.editor }
						disabled={
							( item.settings && item.settings.disabled )
							? item.settings.disabled
							: false
						}
					/>
				);
			}
		} );

		return (
			<div ref="wrapper" className={ className } data-index={ this.props.index }>
				<div className="jsn-panel-heading clearfix text-center">
					<div className="pull-left">
						{ this.renderLabel() }
					</div>
					{ this.renderActions( 'block-action' ) }
				</div>
				<div
					className="jsn-panel-body droppable accept-item"
					onDragOver={ this.dragOver }
					onDrop={ this.drop }
				>
					{ items }
				</div>
			</div>
		);
	},
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

window.MegaMenuColumn = React.createClass( {
	mixins: [
		SunFwMixinBase,
		MegaMenuMixinBase,
		SunFwMixinEditable,
		MegaMenuMixinEditable,
		SunFwMixinDraggable,
		SunFwMixinDroppable,
		MegaMenuMixinDroppable,
	],

	getDefaultProps: function() {
		return {
			id: '',
			root: '',
			type: 'column',
			label: '',
			index: 0,
			width: 12,
			blocks: [],
			settings: {
				'class': 'form-horizontal',
				rows: [
					{
						'class': 'margin-top-right',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'margin-top': {
										type: 'text',
										label: sunfw.text['margin-top'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'margin-right': {
										type: 'text',
										label: sunfw.text['margin-right'],
									},
								},
							},
						],
					},
					{
						'class': 'margin-bottom-left',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'margin-left': {
										type: 'text',
										label: sunfw.text['margin-left'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'margin-bottom': {
										type: 'text',
										label: sunfw.text['margin-bottom'],
									},
								},
							},
						],
					},
					{
						'class': 'padding-top-right',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'padding-top': {
										type: 'text',
										label: sunfw.text['padding-top'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'padding-right': {
										type: 'text',
										label: sunfw.text['padding-right'],
									},
								},
							},
						],
					},
					{
						'class': 'padding-bottom-left',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'padding-left': {
										type: 'text',
										label: sunfw.text['padding-left'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'padding-bottom': {
										type: 'text',
										label: sunfw.text['padding-bottom'],
									},
								},
							},
						],
					},
				],
			},
		};
	},

	render: function() {
		// Prepare class for the column.
		var className = 'mega-menu-item draggable-item resizable col-layout col-xs-' + this.props.width,
			blocks = [], block;

		if ( this.props.disabled ) {
			className += ' disabled-item';
		}

		this.props.blocks.map( ( blockIndex, index ) => {
			block = this.editor.state.blocks[ blockIndex ];

			if ( block ) {
				blocks.push(
					<MegaMenuBlock
						id={ block.id }
						key={ this.editor.props.id + '_' + blockIndex }
						ref= { block.id }
						root={ this.props.root }
						items={ block.items }
						label={ block.label }
						index={ index }
						parent={ this }
						editor={ this.editor }
						disabled={
							( block.settings && block.settings.disabled )
							? block.settings.disabled
							: false
						}
					/>
				);
			}
		} );

		return (
			<div ref="wrapper" className={ className } data-index={ this.props.index }>
				<div
					className="droppable accept-block accept-item"
					onDragOver={ this.dragOver }
					onDrop={ this.drop }
				>
					{ blocks }
				</div>
				{ this.renderActions( 'col-action' ) }
			</div>
		);
	},
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

window.MegaMenuItem = React.createClass( {
	mixins: [
		SunFwMixinBase,
		SunFwMixinItem,
		SunFwMixinEditable,
		MegaMenuMixinEditable,
		SunFwMixinDraggable,
	],

	getDefaultProps: function() {
		return {
			id: '',
			root: '',
			type: 'item',
			label: '',
			index: 0,
		};
	},

	render: function() {
		var className = 'jsn-item mega-menu-item draggable-item bg-primary ' + this.props.type;

		if ( this.props.disabled ) {
			className += ' disabled-item';
		}

		return (
			<div ref="wrapper" className={ className } data-index={ this.props.index }>
				<div
					className="text-right clearfix draggable"
					draggable="true"
					onDragStart={ this.dragStart }
					onDragEnd={ this.dragEnd }
				>
					<div className="pull-left">
						<i className="fa fa-ellipsis-v"></i>
						{ this.renderLabel() }
					</div>
					{ this.renderActions( 'item-action' ) }
				</div>
			</div>
		);
	},
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

window.MegaMenuRow = React.createClass( {
	mixins: [
		SunFwMixinBase,
		MegaMenuMixinBase,
		SunFwMixinEditable,
		MegaMenuMixinEditable,
		SunFwMixinDraggable,
		SunFwMixinDroppable,
		MegaMenuMixinDroppable,
	],

	getDefaultProps: function() {
		return {
			id: '',
			root: '',
			type: 'row',
			label: '',
			index: 0,
			columns: [],
			settings: {
				'class': 'form-horizontal',
				rows: [
					{
						'class': 'margin-top-right',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'margin-top': {
										type: 'text',
										label: sunfw.text['margin-top'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'margin-right': {
										type: 'text',
										label: sunfw.text['margin-right'],
									},
								},
							},
						],
					},
					{
						'class': 'margin-bottom-left',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'margin-left': {
										type: 'text',
										label: sunfw.text['margin-left'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'margin-bottom': {
										type: 'text',
										label: sunfw.text['margin-bottom'],
									},
								},
							},
						],
					},
					{
						'class': 'padding-top-right',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'padding-top': {
										type: 'text',
										label: sunfw.text['padding-top'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'padding-right': {
										type: 'text',
										label: sunfw.text['padding-right'],
									},
								},
							},
						],
					},
					{
						'class': 'padding-bottom-left',
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'padding-left': {
										type: 'text',
										label: sunfw.text['padding-left'],
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'padding-bottom': {
										type: 'text',
										label: sunfw.text['padding-bottom'],
									},
								},
							},
						],
					},
				],
			},
		};
	},

	render: function() {
		var columns = [], column, className = 'jsn-panel mega-menu-item draggable-item row-layout';

		if ( this.props.disabled ) {
			className += ' disabled-item';
		}

		this.props.columns.map( ( columnIndex, index ) => {
			column = this.editor.state.columns[ columnIndex ];

			if ( column ) {
				columns.push(
					<MegaMenuColumn
						id={ column.id }
						key={ this.editor.props.id + '_' + columnIndex }
						ref= { column.id }
						root={ this.props.root }
						label={ column.label }
						index={ index }
						width={ column.width }
						blocks={ column.blocks }
						parent={ this }
						editor={ this.editor }
						disabled={
							( column.settings && column.settings.disabled )
							? column.settings.disabled
							: false
						}
					/>
				);
			}
		} );

		return (
			<div ref="wrapper" className={ className } data-index={ this.props.index }>
				<i
					className="fa-h row-drag draggable"
					draggable="true"
					onDragStart={ this.dragStart }
					onDragEnd={ this.dragEnd }
				></i>
				<div
					className="jsn-panel-body droppable clearfix accept-column accept-block accept-item row"
					onDragOver={ this.dragOver }
					onDrop={ this.drop }
				>
					{ columns }
				</div>
			</div>
		);
	},

	handleComponentDidMount: function() {
		this.refs.wrapper.style.animationName     = 'row-animation';
		this.refs.wrapper.style.animationDuration = '.5s';
	},

	// Init resizable for all columns in the row.
	initInteractions: function() {
		var cellWidth = 100 / 12;

		this.props.columns.map( ( column, index ) => {
			var columnRef = this.editor.refs[ this.editor.state.columns[ column ].id ];

			if ( columnRef && columnRef.refs && columnRef.refs.wrapper ) {
				interact( columnRef.refs.wrapper ).resizable( {
					preserveAspectRatio: false,
					edges: {
						top: false,
						right: index < ( this.props.columns.length - 1 ),
						bottom: false,
						left: false,
					}
				} ).on( 'resizemove', function( event ) {
					// Clear existing timeout.
					this._update_timeout && clearTimeout( this._update_timeout );

					// Get new width.
					var screen = this.editor.state.currentScreen,
						columns = this.editor.state.columns,
						row = event.target.parentNode.parentNode,
						newWidth = ( event.rect.width / row.offsetWidth ) * 100,
						oldWidth = parseInt( columns[ column ].width ),
						nextWidth, tmpIndex;
		
					// Snap new width to 12-column grid.
					newWidth = Math.round( newWidth / cellWidth );
					tmpIndex = parseInt(columnRef.refs.wrapper.getAttribute("data-index"));
					
					// Calculate new width for the next column.
					nextWidth = (
						oldWidth + parseInt( columns[ this.props.columns[ tmpIndex + 1 ] ].width )
					) - newWidth;
					
					// Make sure width is at least 1 cell.
					if ( newWidth < 1 || nextWidth < 1 ) {
						return;
					}

					// Set new width for the column.
			
					columns[ column ].width = newWidth;

					// Update width for the next column.
					columns[ this.props.columns[ tmpIndex + 1 ] ].width= nextWidth;

					// Schedule setting new state after 20ms.
					this._update_timeout = setTimeout( function() {
						// Set new data state to the editor.
						this.editor.setState( { columns: columns } );
					}.bind( this ), 5 );
				}.bind( this ) );
			}
		} );
	},
} );
