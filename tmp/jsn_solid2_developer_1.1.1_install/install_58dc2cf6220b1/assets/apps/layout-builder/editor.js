
window.LayoutBuilderMixinBase= {
initActions: function() {
if ( this.editor ) {
for ( var k in this.refs ) {
if ( k.match( /^(section|row|column|item)_/ ) ) {
this.editor.refs[ k ] = this.refs[ k ];
delete this.refs[ k ];
}
}
}
if ( this.handleInitActions ) {
this.handleInitActions();
}
}
};
window.LayoutBuilderMixinDroppable= {
handleDrop: function( droppable, target, that, type ) {if ( this.props.view != 'main' ) {
return this.handleDropInOffcanvas( droppable, target, that, type );
}var data = this.editor.getData(),
view = data.views[ this.props.view ],
sections = data.sections,
rows = data.rows,
columns = data.columns,
items = data.items,
section, row, column, item, label,
next = {};if ( droppable.classList.contains( 'accept-section' ) && type == 'section' ) {section = view.sections.splice( that.props.index, 1 )[0];
if ( target > that.props.index ) {
view.sections.splice( target - 1, 0, section );
} else {
view.sections.splice( target, 0, section );
}this.editor.section_just_added = section;
}else if ( droppable.classList.contains( 'accept-row' ) && type == 'row' ) {section = sections[ view.sections[ that.parent.props.index ] ];
row = section.rows.splice( that.props.index, 1 )[0];this.editor.row_just_added = row;if ( ! section.rows.length ) {
delete sections[ view.sections[ that.parent.props.index ] ];
view.sections.splice( that.parent.props.index, 1 );if (
droppable.classList.contains( 'accept-section' )
&&
target > that.parent.props.index
) {
target--;
}if (
this.props.type == 'section'
&&
this.props.index > that.parent.props.index
) {
this.props.index--;
}if ( ! droppable.classList.contains( 'accept-section' ) ) {
that.parent.parent.forceUpdate();
}
}else {
that.parent.forceUpdate();
}if ( droppable.classList.contains( 'accept-section' ) ) {next.section = SunFwHelper.getNextIndex( sections );
label = sunfw.text.section + ' #' + next.section;
sections[ next.section ] = {
id: 'section_' + SunFwHelper.toId( label ),
settings: { name: label },
rows: [ row ],
};view.sections.splice( target, 0, next.section );
}else {sections[ view.sections[ this.props.index ] ].rows.splice( target, 0, row );
}
}else if ( droppable.classList.contains( 'accept-column' ) && type == 'column' ) {section = sections[ view.sections[ that.parent.parent.props.index ] ];
row = rows[ section.rows[ that.parent.props.index ] ];
column = row.columns.splice( that.props.index, 1 )[0];this.editor.column_just_added = column;if ( ! row.columns.length ) {
delete rows[ section.rows[ that.parent.props.index ] ];
section.rows.splice( that.parent.props.index, 1 );if (
this.props.type == 'section'
&&
this == that.parent.parent
&&
target > that.parent.props.index
) {
target--;
}if (
this.props.type == 'row'
&&
this.parent == that.parent.parent
&&
this.props.index > that.parent.props.index
) {
this.props.index--;
}if ( ! section.rows.length ) {
delete sections[ view.sections[ that.parent.parent.props.index ] ];
view.sections.splice( that.parent.parent.props.index, 1 );if (
droppable.classList.contains( 'accept-section' )
&&
target > that.parent.parent.props.index
) {
target--;
}if (
this.props.type == 'section'
&&
this.props.index > that.parent.parent.props.index
) {
this.props.index--;
}if (
this.props.type == 'row'
&&
this.parent.props.index > that.parent.parent.props.index
) {
this.parent.props.index--;
}if ( ! droppable.classList.contains( 'accept-section' ) ) {
that.parent.parent.parent.forceUpdate();
}
}else {
that.parent.parent.forceUpdate();
}
}else {
columns = this.editor.calcColumnWidth( columns, row.columns );that.parent.forceUpdate();
}if ( droppable.classList.contains( 'accept-section' ) ) {next.row = SunFwHelper.getNextIndex( rows );
label = sunfw.text.row + ' #' + next.row;
rows[ next.row ] = {
id: 'row_' + SunFwHelper.toId( label ),
settings: { name: label },
columns: [ column ],
};columns = this.editor.calcColumnWidth( columns, [ column ] );next.section = SunFwHelper.getNextIndex( sections );
label = sunfw.text.section + ' #' + next.section;
sections[ next.section ] = {
id: 'section_' + SunFwHelper.toId( label ),
settings: { name: label },
rows: [ next.row ],
};view.sections.splice( target, 0, next.section );
}else if ( droppable.classList.contains( 'accept-row' ) ) {next.row = SunFwHelper.getNextIndex( rows );
label = sunfw.text.row + ' #' + next.row;
rows[ next.row ] = {
id: 'row_' + SunFwHelper.toId( label ),
settings: { name: label },
columns: [ column ],
};columns = this.editor.calcColumnWidth( columns, [ column ] );sections[ view.sections[ this.props.index ] ].rows.splice( target, 0, next.row );
}else {section = sections[ view.sections[ this.parent.props.index ] ];
rows[ section.rows[ this.props.index ] ].columns.splice( target, 0, column );columns = this.editor.calcColumnWidth( columns, rows[ section.rows[ this.props.index ] ].columns );
}
}else if ( type == 'item' && typeof that == 'object' ) {section = sections[ view.sections[ that.parent.parent.parent.props.index ] ];
row = rows[ section.rows[ that.parent.parent.props.index ] ];
column = columns[ row.columns[ that.parent.props.index ] ];
item = column.items.splice( that.props.index, 1 )[0];if ( ! column.items.length ) {
delete columns[ row.columns[ that.parent.props.index ] ];
row.columns.splice( that.parent.props.index, 1 );if (
this.props.type == 'row'
&&
this == that.parent.parent
&&
target > that.parent.parent.props.index
) {
target--;
}if (
this.props.type == 'column'
&&
this.parent == that.parent.parent
&&
this.props.index > that.parent.props.index
) {
this.props.index--;
}if ( ! row.columns.length ) {
delete rows[ section.rows[ that.parent.parent.props.index ] ];
section.rows.splice( that.parent.parent.props.index, 1 );if (
this.props.type == 'section'
&&
this == that.parent.parent.parent
&&
target > that.parent.parent.parent.props.index
) {
target--;
}if (
this.props.type == 'row'
&&
this.parent == that.parent.parent.parent
&&
this.props.index > that.parent.parent.props.index
) {
this.props.index--;
}if (
this.props.type == 'column'
&&
this.parent.parent == that.parent.parent.parent
&&
this.parent.props.index > that.parent.parent.props.index
) {
this.parent.props.index--;
}if ( ! section.rows.length ) {
delete sections[ view.sections[ that.parent.parent.parent.props.index ] ];
view.sections.splice( that.parent.parent.parent.props.index, 1 );if (
droppable.classList.contains( 'accept-section' )
&&
target > that.parent.parent.parent.props.index
) {
target--;
}if (
this.props.type == 'section'
&&
this.props.index > that.parent.parent.parent.props.index
) {
this.props.index--;
}// of the removed section, alter the sibling index.
if (
this.props.type == 'row'
&&
this.parent.props.index > that.parent.parent.parent.props.index
) {
this.parent.props.index--;
}// of the removed section, alter the sibling index.
if (
this.props.type == 'column'
&&
this.parent.parent.props.index > that.parent.parent.parent.props.index
) {
this.parent.parent.props.index--;
}if ( ! droppable.classList.contains( 'accept-section' ) ) {
that.parent.parent.parent.parent.forceUpdate();
}
}else {
that.parent.parent.parent.forceUpdate();
}
}else {
columns = this.editor.calcColumnWidth( columns, row.columns );that.parent.parent.forceUpdate();
}
}else {
that.parent.forceUpdate();
}
} else if ( typeof that == 'string' ) {
next.item = SunFwHelper.getNextIndex( items );
label = this.editor.props.items[ that ].label || sunfw.text.item + ' #' + next.item;
items[ next.item ] = {
id: 'item_' + SunFwHelper.toId( label ),
type: that,
settings: { name: label },
};
item = next.item;
}
if ( item !== undefined ) {this.editor.item_just_added = item;if ( droppable.classList.contains( 'accept-section' ) ) {next.column = SunFwHelper.getNextIndex( columns );
label = sunfw.text.column + ' #' + next.column;
columns[ next.column ] = {
id: 'column_' + SunFwHelper.toId( label ),
width: { lg: this.editor.props.grid },
settings: { name: label },
items: [ item ],
};next.row = SunFwHelper.getNextIndex( rows );
label = sunfw.text.row + ' #' + next.row;
rows[ next.row ] = {
id: 'row_' + SunFwHelper.toId( label ),
settings: { name: label },
columns: [ next.column ],
};next.section = SunFwHelper.getNextIndex( sections );
label = sunfw.text.section + ' #' + next.section;
sections[ next.section ] = {
id: 'section_' + SunFwHelper.toId( label ),
settings: { name: label },
rows: [ next.row ],
};view.sections.splice( target, 0, next.section );
}else if ( droppable.classList.contains( 'accept-row' ) ) {next.column = SunFwHelper.getNextIndex( columns );
label = sunfw.text.column + ' #' + next.column;
columns[ next.column ] = {
id: 'column_' + SunFwHelper.toId( label ),
width: { lg: this.editor.props.grid },
settings: { name: label },
items: [ item ],
};next.row = SunFwHelper.getNextIndex( rows );
label = sunfw.text.row + ' #' + next.row;
rows[ next.row ] = {
id: 'row_' + SunFwHelper.toId( label ),
settings: { name: label },
columns: [ next.column ],
};sections[ view.sections[ this.props.index ] ].rows.splice( target, 0, next.row );
}else if ( droppable.classList.contains( 'accept-column' ) ) {next.column = SunFwHelper.getNextIndex( columns );
label = sunfw.text.column + ' #' + next.column;
columns[ next.column ] = {
id: 'column_' + SunFwHelper.toId( label ),
settings: { name: label },
items: [ item ],
};section = sections[ view.sections[ this.parent.props.index ] ];
rows[ section.rows[ this.props.index ] ].columns.splice( target, 0, next.column );columns = this.editor.calcColumnWidth( columns, rows[ section.rows[ this.props.index ] ].columns );
}else {section = sections[ view.sections[ this.parent.parent.props.index ] ];
row = rows[ section.rows[ this.parent.props.index ] ];
columns[ row.columns[ this.props.index ] ].items.splice( target, 0, item );
}
}// so skip logging activity at this time to prevent duplicating activity log.
if ( typeof that == 'string' && that == 'menu' ) {
this.editor.setData( data, true );
}else {
this.editor.setData( data );
}this.forceUpdate();
},
handleDropInOffcanvas: function( droppable, target, that, type ) {var data = this.editor.getData(),
view = data.views[ this.props.view ],
rows = data.rows,
columns = data.columns,
items = data.items,
row, column, item, label,
next = {};if ( droppable.classList.contains( 'accept-row' ) && type == 'row' ) {row = view.rows.splice( that.props.index, 1 )[0];
if ( target > that.props.index ) {
view.rows.splice( target - 1, 0, row );
} else {
view.rows.splice( target, 0, row );
}this.editor.row_just_added = row;
}else if ( droppable.classList.contains( 'accept-column' ) && type == 'column' ) {row = rows[ view.rows[ that.parent.props.index ] ];
column = row.columns.splice( that.props.index, 1 )[0];this.editor.column_just_added = column;if ( ! row.columns.length ) {
delete rows[ view.rows[ that.parent.props.index ] ];
view.rows.splice( that.parent.props.index, 1 );if (
droppable.classList.contains( 'accept-row' )
&&
target > that.parent.props.index
) {
target--;
}if (
this.props.type == 'row'
&&
this.props.index > that.parent.props.index
) {
this.props.index--;
}if ( ! droppable.classList.contains( 'accept-row' ) ) {
that.parent.parent.forceUpdate();
}
}else {
columns = this.editor.calcColumnWidth( columns, row.columns );that.parent.forceUpdate();
}if ( droppable.classList.contains( 'accept-row' ) ) {next.row = SunFwHelper.getNextIndex( rows );
label = sunfw.text.row + ' #' + next.row;
rows[ next.row ] = {
id: 'row_' + SunFwHelper.toId( label ),
settings: { name: label },
columns: [ column ],
};columns = this.editor.calcColumnWidth( columns, [ column ] );view.rows.splice( target, 0, next.row );
}else {rows[ view.rows[ this.props.index ] ].columns.splice( target, 0, column );columns = this.editor.calcColumnWidth( columns, rows[ view.rows[ this.props.index ] ].columns );
}
}else if ( type == 'item' && typeof that == 'object' ) {row = rows[ view.rows[ that.parent.parent.props.index ] ];
column = columns[ row.columns[ that.parent.props.index ] ];
item = column.items.splice( that.props.index, 1 )[0];if ( ! column.items.length ) {
delete columns[ row.columns[ that.parent.props.index ] ];
row.columns.splice( that.parent.props.index, 1 );if (
this.props.type == 'row'
&&
this == that.parent.parent
&&
target > that.parent.parent.props.index
) {
target--;
}if (
this.props.type == 'column'
&&
this.parent == that.parent.parent
&&
this.props.index > that.parent.props.index
) {
this.props.index--;
}if ( ! row.columns.length ) {
delete rows[ view.rows[ that.parent.parent.props.index ] ];
view.rows.splice( that.parent.parent.props.index, 1 );if (
droppable.classList.contains( 'accept-row' )
&&
target > that.parent.parent.props.index
) {
target--;
}if (
this.props.type == 'row'
&&
this.props.index > that.parent.parent.props.index
) {
this.props.index--;
}if (
this.props.type == 'column'
&&
this.parent.props.index > that.parent.parent.props.index
) {
this.parent.props.index--;
}if ( ! droppable.classList.contains( 'accept-row' ) ) {
that.parent.parent.parent.forceUpdate();
}
}else {
columns = this.editor.calcColumnWidth( columns, row.columns );that.parent.parent.forceUpdate();
}
}else {
that.parent.forceUpdate();
}
} else if ( typeof that == 'string' ) {
next.item = SunFwHelper.getNextIndex( items );
label = this.editor.props.items[ that ].label || sunfw.text.item + ' #' + next.item;
items[ next.item ] = {
id: 'item_' + SunFwHelper.toId( label ),
type: that,
settings: { name: label },
};
item = next.item;
}
if ( item !== undefined ) {this.editor.item_just_added = item;if ( droppable.classList.contains( 'accept-row' ) ) {next.column = SunFwHelper.getNextIndex( columns );
label = sunfw.text.column + ' #' + next.column;
columns[ next.column ] = {
id: 'column_' + SunFwHelper.toId( label ),
width: { lg: this.editor.props.grid },
settings: { name: label },
items: [ item ],
};next.row = SunFwHelper.getNextIndex( rows );
label = sunfw.text.row + ' #' + next.row;
rows[ next.row ] = {
id: 'row_' + SunFwHelper.toId( label ),
settings: { name: label },
columns: [ next.column ],
};view.rows.splice( target, 0, next.row );
}else if ( droppable.classList.contains( 'accept-column' ) ) {next.column = SunFwHelper.getNextIndex( columns );
label = sunfw.text.column + ' #' + next.column;
columns[ next.column ] = {
id: 'column_' + SunFwHelper.toId( label ),
settings: { name: label },
items: [ item ],
};rows[ view.rows[ this.props.index ] ].columns.splice( target, 0, next.column );columns = this.editor.calcColumnWidth( columns, rows[ view.rows[ this.props.index ] ].columns );
}else {row = rows[ view.rows[ this.parent.props.index ] ];
columns[ row.columns[ this.props.index ] ].items.splice( target, 0, item );
}
}this.editor.setData( data );this.forceUpdate();
}
};
window.LayoutBuilderMixinItem= {
handleComponentDidMount: function() {setTimeout( function() {
if (this.refs.wrapper) {
this.refs.wrapper.classList.remove('initial');this.rendered = true;
}
}.bind( this ), 10 );
},
handleComponentDidUpdate: function() {setTimeout( function() {
if (this.refs.wrapper) {
this.refs.wrapper.classList.remove('initial');
}
}.bind( this ), 10 );var type = this.getItemType(), keyName = type + '_' + this.props[ type ];
if ( this.editor.current.editing == keyName ) {
this.refs.wrapper.classList.add('editing');
}
},
getItemType: function( item ) {
var item = item || this, type = 'item';
if (
typeof item == 'object'
&&
[ 'offcanvas', 'section', 'row', 'column' ].indexOf( item.props.type ) > -1
) {
type = item.props.type;
}
return type;
},
handleEditItem: function( event ) {
event.stopPropagation();
this.editor.selectItem( this.props.id );
},
handleCloneItem: function() {var data = this.editor.getData(),
view = data.views[ this.props.view ],
sections = data.sections,
rows = data.rows,
columns = data.columns,
items = data.items,
section, row, column, item, nested_ids, next,
message = [],cloneChildren = function( type, children ) {
var ids = [];
for ( var i = 0, n = children.length; i < n; i++ ) {
switch ( type ) {
case 'row':nested_ids = cloneChildren( 'column', rows[ children[ i ] ].columns );
if ( nested_ids.length ) {item = JSON.parse( JSON.stringify( rows[ children[ i ] ] ) );
item.columns = nested_ids;
item.settings.name = item.settings.name + sunfw.text['clone-label'];
if ( item.settings.name ) {
item.id = 'row_' + SunFwHelper.toId( item.settings.name, true );
} else {
item.id = 'row_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
}next = SunFwHelper.getNextIndex( rows );
rows[ next ] = item;if ( nested_ids.length != rows[ children[ i ] ].columns.length ) {
columns = this.editor.calcColumnWidth( columns, nested_ids );
}ids.push( next );
}
break;
case 'column':nested_ids = cloneChildren( 'item', columns[ children[ i ] ].items );
if ( nested_ids.length ) {item = JSON.parse( JSON.stringify( columns[ children[ i ] ] ) );
item.items = nested_ids;
item.settings.name = item.settings.name + sunfw.text['clone-label'];
if ( item.settings.name ) {
item.id = 'column_' + SunFwHelper.toId( item.settings.name, true );
} else {
item.id = 'column_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
}next = SunFwHelper.getNextIndex( columns );
columns[ next ] = item;ids.push( next );
}
break;
case 'item':
if ( this.editor.props.items[ items[ children[ i ] ].type ].settings['one-time-item'] ) {message.push(
sunfw.text['one-time-item'].replace(
'%ITEM%',
items[ children[ i ] ].type.replace( '-', ' ' )
)
);
} else {
item = JSON.parse( JSON.stringify( items[ children[ i ] ] ) );
item.id = 'item_' + SunFwHelper.toId( item.settings.name, true );
item.settings.name = item.settings.name + sunfw.text['clone-label'];next = SunFwHelper.getNextIndex( items );
items[ next ] = item;ids.push( next );
}
break;
}
}
return ids;
}.bind( this );switch ( this.props.type ) {
case 'section':nested_ids = cloneChildren( 'row', sections[ view.sections[ this.props.index ] ].rows );
if ( nested_ids.length ) {item = JSON.parse( JSON.stringify( sections[ view.sections[ this.props.index ] ] ) );
item.id = 'section_' + SunFwHelper.toId( item.settings.name, true );
item.rows = nested_ids;
item.settings.name = item.settings.name + sunfw.text['clone-label'];next = SunFwHelper.getNextIndex( sections );
sections[ next ] = item;view.sections.splice( this.props.index + 1, 0, next );
}
break;
case 'row':if ( this.props.view == 'main' ) {
section = sections[ view.sections[ this.parent.props.index ] ];
} else {
section = view;
}nested_ids = cloneChildren( 'column', rows[ section.rows[ this.props.index ] ].columns );
if ( nested_ids.length ) {item = JSON.parse( JSON.stringify( rows[ section.rows[ this.props.index ] ] ) );
item.columns = nested_ids;
item.settings.name = item.settings.name + sunfw.text['clone-label'];
if ( item.settings.name ) {
item.id = 'row_' + SunFwHelper.toId( item.settings.name, true );
} else {
item.id = 'row_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
}next = SunFwHelper.getNextIndex( rows );
rows[ next ] = item;section.rows.splice( this.props.index + 1, 0, next );
}
break;
case 'column':if ( this.props.view == 'main' ) {
section = sections[ view.sections[ this.parent.parent.props.index ] ];
row = rows[ section.rows[ this.parent.props.index ] ];
} else {
row = rows[ view.rows[ this.parent.props.index ] ];
}nested_ids = cloneChildren( 'item', columns[ row.columns[ this.props.index ] ].items );
if ( nested_ids.length ) {item = JSON.parse( JSON.stringify( columns[ row.columns[ this.props.index ] ] ) );
item.items = nested_ids;
item.settings.name = item.settings.name + sunfw.text['clone-label'];
if ( item.settings.name ) {
item.id = 'column_' + SunFwHelper.toId( item.settings.name, true );
} else {
item.id = 'column_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
}next = SunFwHelper.getNextIndex( columns );
columns[ next ] = item;row.columns.splice( this.props.index + 1, 0, next );columns = this.editor.calcColumnWidth( columns, row.columns );
}
break;
default:if ( this.props.view == 'main' ) {
section = sections[ view.sections[ this.parent.parent.parent.props.index ] ];
row = rows[ section.rows[ this.parent.parent.props.index ] ];
column = columns[ row.columns[ this.parent.props.index ] ];
} else {
row = rows[ view.rows[ this.parent.parent.props.index ] ];
column = columns[ row.columns[ this.parent.props.index ] ];
}
if (
this.editor.props.items[ items[ column.items[ this.props.index ] ].type ]
&&
this.editor.props.items[ items[ column.items[ this.props.index ] ].type ].settings['one-time-item']
) {message.push(
sunfw.text['one-time-item'].replace(
'%ITEM%',
items[ column.items[ this.props.index ] ].type.replace( '-', ' ' )
)
);
} else {item = JSON.parse( JSON.stringify( items[ column.items[ this.props.index ] ] ) );
item.id = 'item_' + SunFwHelper.toId( item.settings.name, true );
item.settings.name = item.settings.name + sunfw.text['clone-label'];next = SunFwHelper.getNextIndex( items );
items[ next ] = item;column.items.splice( this.props.index + 1, 0, next );
}
break;
}
if ( message.length ) {
bootbox.alert( sunfw.text['clone-item-error'] + "\n\n- " + message.join( "\n-" ) );
}this.editor.setData( data );this.parent.forceUpdate();
},
handleToggleItem: function() {var data = this.editor.getData(),
view = data.views[ this.props.view ],
sections = data.sections,
rows = data.rows,
columns = data.columns,
items = data.items,
section, row, column, settings;switch ( this.props.type ) {
case 'section':
settings = sections[ view.sections[ this.props.index ] ].settings;
break;
case 'row':if ( this.props.view == 'main' ) {
section = sections[ view.sections[ this.parent.props.index ] ];
settings = rows[ section.rows[ this.props.index ] ].settings;
} else {
settings = rows[ view.rows[ this.props.index ] ].settings;
}
break;
case 'column':if ( this.props.view == 'main' ) {
section = sections[ view.sections[ this.parent.parent.props.index ] ];
row = rows[ section.rows[ this.parent.props.index ] ];
settings = columns[ row.columns[ this.props.index ] ].settings;
} else {
row = rows[ view.rows[ this.parent.props.index ] ];
settings = columns[ row.columns[ this.props.index ] ].settings;
}
break;
default:if ( this.props.view == 'main' ) {
section = sections[ view.sections[ this.parent.parent.parent.props.index ] ];
row = rows[ section.rows[ this.parent.parent.props.index ] ];
column = columns[ row.columns[ this.parent.props.index ] ];
settings = items[ column.items[ this.props.index ] ].settings;
} else {
row = rows[ view.rows[ this.parent.parent.props.index ] ];
column = columns[ row.columns[ this.parent.props.index ] ];
settings = items[ column.items[ this.props.index ] ].settings;
}
break;
}if ( ! settings || settings instanceof Array ) {
settings = {};
}
settings.disabled = ! settings.disabled;this.editor.setData( data );this.forceUpdate();
},
handleDeleteItem: function() {var data = this.editor.getData(),
view = data.views[ this.props.view ],
sections = data.sections,
rows = data.rows,
columns = data.columns,
items = data.items,
section, row, column;function deleteChildren( parent, type, children ) {
for ( var i = 0, n = children.length; i < n; i++ ) {
switch ( type ) {
case 'row':deleteChildren( parent.editor.refs[ 'row_' + children[ i ] ], 'column', rows[ children[ i ] ].columns );delete parent.editor.refs[ 'row_' + children[ i ] ];
delete rows[ children[ i ] ];
break;
case 'column':deleteChildren( parent.editor.refs[ 'column_' + children[ i ] ], 'item', columns[ children[ i ] ].items );delete parent.editor.refs[ 'column_' + children[ i ] ];
delete columns[ children[ i ] ];
break;
case 'item':type = items[ children[ i ] ].type;
delete parent.editor.refs[ 'item_' + children[ i ] ];
delete items[ children[ i ] ];if ( parent.editor.props.items[ type ].settings['one-time-item'] ) {parent.editor.refs.items.refs[ 'item_type_' + type ].forceUpdate();
}
break;
}
}
}switch ( this.props.type ) {
case 'section':deleteChildren( this, 'row', sections[ view.sections[ this.props.index ] ].rows );delete this.editor.refs[ this.props.id ];
delete sections[ view.sections[ this.props.index ] ];view.sections.splice( this.props.index, 1 );
break;
case 'row':if ( this.props.view == 'main' ) {
section = sections[ view.sections[ this.parent.props.index ] ];if ( section.rows.length == 1 ) {
return this.parent.deleteItem();
}
} else {
section = view;
}deleteChildren( this, 'column', rows[ section.rows[ this.props.index ] ].columns );delete this.editor.refs[ this.props.id ];
delete rows[ section.rows[ this.props.index ] ];section.rows.splice( this.props.index, 1 );
break;
case 'column':if ( this.props.view == 'main' ) {
section = sections[ view.sections[ this.parent.parent.props.index ] ];
row = rows[ section.rows[ this.parent.props.index ] ];
} else {
row = rows[ view.rows[ this.parent.props.index ] ];
}if ( row.columns.length == 1 ) {
return this.parent.deleteItem();
}deleteChildren( this, 'item', columns[ row.columns[ this.props.index ] ].items );delete this.editor.refs[ this.props.id ];
delete columns[ row.columns[ this.props.index ] ];row.columns.splice( this.props.index, 1 );columns = this.editor.calcColumnWidth( columns, row.columns );
break;
default:if ( this.props.view == 'main' ) {
section = sections[ view.sections[ this.parent.parent.parent.props.index ] ];
row = rows[ section.rows[ this.parent.parent.props.index ] ];
} else {
row = rows[ view.rows[ this.parent.parent.props.index ] ];
}column = columns[ row.columns[ this.parent.props.index ] ];if ( column.items.length == 1 ) {
return this.parent.deleteItem();
}delete this.editor.refs[ this.props.id ];
delete items[ column.items[ this.props.index ] ];column.items.splice( this.props.index, 1 );if ( this.editor.props.items[ this.props.type ].settings['one-time-item'] ) {this.editor.refs.items.refs[ 'item_type_' + this.props.type ].forceUpdate();
}
break;
}var timeout = 0;
if ( this.refs.wrapper.classList.contains('layout-builder-section') ) {
this.refs.wrapper.classList.add('initial');
timeout = 250;
}
setTimeout( function() {this.editor.setData( data );var parent = this.parent;
while ( parent.refs.wrapper.querySelectorAll('.layout-builder-item').length <= 1 ) {
parent = parent.parent;
}this.editor.selectItem( parent.props.id );this.parent.forceUpdate();
}.bind( this ), timeout );
},
changeSectionIDForTemplate: function( oldData, newData ) {
if (oldData == newData)
{
return;
}var self = this,
token = document.querySelector( '#jsn-tpl-token' ).value,
styleID = document.querySelector( '#jsn-style-id' ).value,
templateName = document.querySelector( '#jsn-tpl-name' ).value;var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=layout&'
+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=changeSectionIDForTemplate';SunFwHelper.requestUrl(
server,
null,
{ old_data: oldData, new_data: newData }
);
},
deleteSectionIdInDataBase: function( sid ) {var self = this;
var token = document.querySelector( '#jsn-tpl-token' ).value;
var styleID = document.querySelector( '#jsn-style-id' ).value;
var templateName = document.querySelector( '#jsn-tpl-name' ).value;var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=layout&'
+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=deleteSectionIDInAppearance';SunFwHelper.requestUrl(
server,
null,
{ section_id: sid }
);
}
};
window.LayoutBuilderActions= React.createClass({
mixins: [SunFwMixinBase],
render: function () {
return (
<div className="layout-builder-actions">
<button
type="button"
onClick={ this.select }
className="btn btn-default margin-right-10"
>
<i className="fa fa-columns font-size-14 margin-right-5"></i>
{ sunfw.text['load-prebuilt-layout'] }
</button>
<div className="btn-group">
<button
ref="save"
type="button"
onClick={ this.editor.save }
disabled={ !this.editor.state.changed }
className="btn btn-success text-uppercase"
>
<i className="icon-apply icon-white margin-right-5"></i>
{ sunfw.text['save-layout'] }
</button>
<button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
<span className="caret"></span>
</button>
<ul className="dropdown-menu pull-right">
<li>
<a href="#" onClick={ this.saveAs }>
{ sunfw.text['save-prebuilt-layout'] }
</a>
</li>
</ul>
</div>
</div>
);
},
select: function (event) {
event.preventDefault();var data = {
ref: this,
form: {
'class': 'load-prebuilt-layout',
rows: [
{
cols: [
{
'class': 'col-xs-12',
settings: {
layout: {
type: 'select-layout',
label: ''
}
}
}
]
}
]
},
values: {'layout': this.editor.getData().appliedLayout}
};this.editor.getModal({
id: 'load_layout_modal',
title: 'load-prebuilt-layout',
type: 'form',
content: {
data: data
},
'class': 'fixed'
});
},
saveAs: function (event) {
event.preventDefault();var data = {
ref: this,
form: {
'class': 'save-prebuilt-layout',
rows: [
{
cols: [
{
'class': 'col-xs-12',
settings: {
'name': {
type: 'select-layout',
label: '',
action: 'save'
}
}
}
]
}
]
},
values: []
};this.editor.getModal({
id: 'load_layout_modal',
title: 'save-prebuilt-layout',
type: 'form',
content: {
data: data
},
'class': 'fixed'
});
},
saveSettings: function (settings) {if (settings.name && settings.name != '') {
this.editor.save(true, settings.name);
}else if (settings.layout && settings.layout != '') {var data = this.editor.props.layouts[settings.layout].data;
data.appliedLayout = settings.layout;for (var k in this.editor.props.offcanvas) {
if (data.views[k] && data.views[k].sections) {
var rows = [];
data.views[k].sections.map((sectionIndex) => {
if (data.sections[sectionIndex]) {
data.sections[sectionIndex].rows.map((rowIndex) => {
if (data.rows[rowIndex]) {
rows.push(rowIndex);
}
});
delete data.sections[sectionIndex];
}
});
data.views[k].rows = rows;
delete data.views[k].sections;
} else {
data.views[k].rows = [];
}
}if ( data.columns ) {
for ( var p in data.columns ) {
if ( ! data.columns[ p ].width ) {
data.columns[ p ].width = { lg: this.editor.props.grid };
}
else if ( ! isNaN( parseInt( data.columns[ p ].width ) ) ) {
data.columns[ p ].width = { lg: parseInt( data.columns[ p ].width ) };
}
else if ( ! isNaN( parseInt( data.columns[ p ].width.lg ) ) ) {
data.columns[ p ].width.lg = parseInt( data.columns[ p ].width.lg );
}
if ( ! isNaN( parseInt( data.columns[ p ].width.md ) ) ) {
data.columns[ p ].width.md = parseInt( data.columns[ p ].width.md );
} else {
data.columns[ p ].width.md = data.columns[ p ].width.lg;
}
if ( ! isNaN( parseInt( data.columns[ p ].width.sm ) ) ) {
data.columns[ p ].width.sm = parseInt( data.columns[ p ].width.sm );
} else {
data.columns[ p ].width.sm = data.columns[ p ].width.lg;
}
if ( ! isNaN( parseInt( data.columns[ p ].width.xs ) ) ) {
data.columns[ p ].width.xs = parseInt( data.columns[ p ].width.xs );
} else {
data.columns[ p ].width.xs = this.editor.props.grid;
}
}
}this.editor.setData(data);this.editor.forceUpdate();
}
}
});
window.LayoutBuilder= React.createClass( {
mixins: [ SunFwMixinBase, SunFwMixinEditor ],
getDefaultProps: function() {
return {
id: '',
grid: 12,
items: {},
screens: {},
layouts: {},
editable: {},
offcanvas: {},
style_id: '',
settings: {
'class': 'page-settings',
title: sunfw.text['page-settings'],
rows: [
{
cols: [
{
'class': 'col-xs-12',
settings: {
enable_responsive: {
type: 'checkbox',
label: 'enable-responsive',
value: 1,
'default': 1
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12',
settings: {
show_desktop_switcher: {
type: 'checkbox',
label: 'desktop-switcher',
value: 1,
'default': 1
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12',
settings: {
enable_boxed_layout: {
type: 'checkbox',
label: 'boxed-layout',
value: 1,
'default': 0
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12',
settings: {
width_boxed_layout: {
type: 'box-layout',
label: 'boxed-layout-width',
suffix: 'px',
'default': 960
}
}
}
],
requires: {
enable_boxed_layout: 1
}
},
{
"class": "separator-after",
cols: [
{
'class': 'col-xs-12',
settings: {
margin: {
type: 'spacing-settings',
label: 'margin',
suffix: 'px'
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12',
settings: {
go_to_top: {
type: 'checkbox',
label: 'show-go-to-top',
value: 1,
'default': 0
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12 settingIcon-go-top',
settings: {
icon_go_to_top: {
type: 'radio',
label: 'icon',
inline: true,
options: [
{
'class': 'hidden',
label: ( <i className="fa fa-arrow-circle-o-up fa-2x"></i> ),
value: 'fa fa-arrow-circle-o-up'
},
{
'class': 'hidden',
label: ( <i className="fa fa-arrow-up fa-2x"></i> ),
value: 'fa fa-arrow-up'
},
{
'class': 'hidden',
label: ( <i className="fa fa-long-arrow-up fa-2x"></i> ),
value: 'fa-long-arrow-up'
},
{
'class': 'hidden',
label: ( <i className="fa fa-ban fa-2x"></i> ),
value: 'fa-ban'
}
],
'default': 'fa-ban'
}
}
},
{
'class': 'col-xs-12',
settings: {
text_go_to_top: {
type: 'text',
label: 'text',
'default': 'Go to top'
}
}
},
{
'class': 'col-xs-12',
settings: {
color_go_to_top: {
type: 'color-picker',
label: 'text-color'
}
}
},
{
'class': 'col-xs-12',
settings: {
bg_go_to_top: {
type: 'color-picker',
label: 'background-color'
}
}
},
{
'class': 'col-xs-12',
settings: {
ps_go_to_top: {
type: 'select',
label: 'positions',
options: [
{
label: 'right',
value: 'right'
},
{
label: 'center',
value: 'center'
},
{
label: 'left',
value: 'left'
},
]
}
}
}
],
requires: {
go_to_top: 1
}
}
]
}
};
},
getInitialState: function() {
this.current = {
screen: 'lg',
editing: ''
};
return {
changed: false
}
},
getDefaultData: function() {
return {
appliedLayout: '',
settings: {
enable_responsive: 1
},
sections: {},
rows: {},
columns: {},
items: {},
views: {
main: {
sections: []
},
top: {
rows: []
},
right: {
rows: []
},
bottom: {
rows: []
},
left: {
rows: []
}
}
};
},
handleComponentWillMount: function( state ) {var token = document.querySelector( '#jsn-tpl-token' ).value,
styleID = document.querySelector( '#jsn-style-id' ).value,
templateName = document.querySelector( '#jsn-tpl-name' ).value;var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=layout&'
+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=get';SunFwHelper.requestUrl(
server,
function( req ) {
var response;
try {
response = JSON.parse( req.responseText );
if ( ! response.data ) {
response.data = {};
}
} catch ( e ) {
response = {
type: 'success',
data: {}
};
}
if ( response.type == 'success' ) {var data = response.data;
if ( JSON.stringify( data ).length > 2 ) {for ( var k in this.props.offcanvas ) {
if ( ! data.views[ k ] ) {
data.views[ k ] = {};
}
if ( data.views[ k ].sections ) {
var rows = [];
data.views[ k ].sections.map( ( sectionIndex ) => {
if ( data.sections[ sectionIndex ] ) {
data.sections[ sectionIndex ].rows.map( ( rowIndex ) => {
if ( data.rows[ rowIndex ] ) {
rows.push( rowIndex );
}
} );
delete data.sections[ sectionIndex ];
}
} );
data.views[ k ].rows = rows;
delete data.views[ k ].sections;
} else {
data.views[ k ].rows = data.views[ k ].rows || [];
}
}var prepared_data = {};
for ( var p in data ) {
if ( p == 'sections' || p == 'rows' || p == 'columns' || p == 'items' ) {
if ( data[ p ] instanceof Array ) {
prepared_data[ p ] = {};
for ( var i = 0; i < data[ p ].length; i++ ) {
prepared_data[ p ][ i ] = data[ p ][ i ];
}
continue;
}
} else if ( p == 'options' ) {
prepared_data.settings = data.options;
continue;
}
prepared_data[ p ] = data[ p ];
}if ( prepared_data.columns ) {
for ( var p in prepared_data.columns ) {
if ( ! prepared_data.columns[ p ] ) {
continue;
}
if ( ! prepared_data.columns[ p ].width ) {
prepared_data.columns[ p ].width = { lg: this.props.grid };
}
else if ( ! isNaN( parseInt( prepared_data.columns[ p ].width ) ) ) {
prepared_data.columns[ p ].width = { lg: parseInt( prepared_data.columns[ p ].width ) };
}
else if ( ! isNaN( parseInt( prepared_data.columns[ p ].width.lg ) ) ) {
prepared_data.columns[ p ].width.lg = parseInt( prepared_data.columns[ p ].width.lg );
}
if ( ! isNaN( parseInt( prepared_data.columns[ p ].width.md ) ) ) {
prepared_data.columns[ p ].width.md = parseInt( prepared_data.columns[ p ].width.md );
} else {
prepared_data.columns[ p ].width.md = prepared_data.columns[ p ].width.lg;
}
if ( ! isNaN( parseInt( prepared_data.columns[ p ].width.sm ) ) ) {
prepared_data.columns[ p ].width.sm = parseInt( prepared_data.columns[ p ].width.sm );
} else {
prepared_data.columns[ p ].width.sm = prepared_data.columns[ p ].width.lg;
}
if ( ! isNaN( parseInt( prepared_data.columns[ p ].width.xs ) ) ) {
prepared_data.columns[ p ].width.xs = parseInt( prepared_data.columns[ p ].width.xs );
} else {
prepared_data.columns[ p ].width.xs = this.props.grid;
}
}
}if ( ! prepared_data.settings || prepared_data.settings instanceof Array ) {
prepared_data.settings = {};
}delete prepared_data.changed;for ( var p in this.current ) {
if ( data.hasOwnProperty( p ) ) {
this.current[ p ] = data[ p ];
delete data[ p ];
}
}
data = prepared_data;
}this.setData( data, true );this.forceUpdate();this.selectItem( this.current.editing );
} else {
bootbox.alert( ( response && response.data ) ? response.data : req.responseText );
}
}.bind( this )
);jQuery('#sunfw-admin-tab a[href="#layout"]').on( 'shown.bs.tab', function() {
setTimeout( this.equalizeHeight, 5 );
}.bind( this ) );
return state;
},
render: function() {
if ( this.data === undefined ) {
return (
<SunFwLoading />
);
}var data = this.getData(), offcanvasAnchors = [], offcanvasContainers = [], keyName;
for ( var k in this.props.offcanvas ) {
keyName = 'offcanvas_' + k;offcanvasAnchors.push(
<div onClick={ this.openCanvas.bind( this, k ) } className={ k }>
<a href="#"></a> <i className="fa fa-angle-down"></i>
</div>
);offcanvasContainers.push(
<LayoutBuilderOffcanvas
id={ keyName }
key={ this.props.id + '_' + keyName }
ref={ keyName }
view={ k }
label={ this.props.offcanvas[ k ] }
parent={ this }
editor={ this }
/>
);
}var boxedLayout = data.settings.enable_boxed_layout, className = 'layout-builder';
if ( boxedLayout && parseInt( boxedLayout ) ) {
className += ' boxed-layout';
}
return (
<div
id={ this.props.id }
key={ this.props.id }
ref="wrapper"
className={ className }
onDragOver={ this.dragOver }
>
<div className="jsn-pageheader container-fluid padding-top-10 padding-bottom-10">
<div className="row">
<div className="col-xs-1">
<h3 className="margin-0 line-height-30">
{ sunfw.text['layout-builder'] }
</h3>
</div>
<div className="col-xs-3 col-sm-4">
<LayoutBuilderScreens
key={ this.props.id + '_screens' }
ref="screens"
parent={ this }
editor={ this }
/>
</div>
<div className="col-xs-4 col-sm-3 text-center">
<SunFwActivity
key={ this.props.id + '_activity' }
ref="activity"
parent={ this }
editor={ this }
/>
</div>
<div className="col-xs-4 col-sm-4 text-right">
<LayoutBuilderActions
key={ this.props.id + '_actions' }
ref="actions"
parent={ this }
editor={ this }
/>
</div>
</div>
</div>
<div className="jsn-main-content">
<div className="container-fluid">
<div className="row equal-height">
<div className="col-xs-1 parent-sidebar border-right padding-top-15 padding-bottom-15 items-list">
<div className="jsn-sidebar icon-panel">
<SunFwItems
key={ this.props.id + '_items' }
ref="items"
parent={ this }
editor={ this }
/>
</div>
</div>
<div className="col-xs-8 padding-top-15 padding-bottom-15 workspace-container">
<div className="jsn-layout-content">
<div ref="canvas" className="canvas">
{ offcanvasAnchors }
</div>
<div ref="canvasInner" className="jsn-content-inner">
{ offcanvasContainers }
<div
onClick={ this.selectItem }
className="jsn-content-main"
>
<LayoutBuilderWorkspace
key={ this.props.id + '_main_workspace' }
ref="main_workspace"
view="main"
parent={ this }
editor={ this }
/>
</div>
</div>
</div>
</div>
<div className="col-xs-3 parent-sidebar border-left padding-bottom-15 layout-settings">
<div className="jsn-sidebar settings-panel">
<SunFwForm
key={ this.props.id + '_settings' }
ref="settings"
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
initActions: function() {if (this.refs.include && ! this.get_started) {
var helpMenu = [], helpLinks = document.getElementById('sunfw-learn-more').children;
for (var i = 0, n = helpLinks.length; i < n; i++) {
if (helpLinks[i].children[0].id != 'sunfw-get-started') {
helpMenu.push(
<li>
<a href={ helpLinks[i].children[0].href } target="_blank">
{ helpLinks[i].textContent }
</a>
</li>
);
}
}
this.get_started = this.getModal({
id: 'get-started',
title: sunfw.text['get-started'],
type: 'html',
show: false,
content: (
<div className="container-fluid">
<div className="col-xs-6">
<h3>{ sunfw.text['install-sample-data'] }</h3>
<p>{ sunfw.text['install-sample-data-intro'] }</p>
<ul>
<li>
<a href="javascript:void(0)" onClick={ function() {
jQuery('#data-data-sample-data').trigger('click');
} }>
{ sunfw.text['install-sample-data'] }
</a>
</li>
</ul>
</div>
<div className="col-xs-6">
<h3>{ sunfw.text['learn-more'] }</h3>
<p>{ sunfw.text['learn-more-intro'] }</p>
<ul>
{ helpMenu }
</ul>
</div>
</div>
),
buttons: 'disabled'
});
if (sunfw && ! sunfw.has_data) {
this.get_started.show();
}
}var tab = document.querySelector( '#sunfw-admin-tab a[href="#layout"]' ),
saveAllButton = jQuery( '#sunfw-save-all' );
if ( this.state.changed === true ) {
if ( tab.textContent.indexOf( ' *' ) < 0 ) {
tab.textContent += ' *';
}
saveAllButton.removeClass('disabled');
window.layoutBuilderHasChange = true;
} else {
tab.textContent = tab.textContent.replace( ' *', '' );
}
},
handlePreloadAssets: function() {for ( var layout in this.props.layouts ) {
if ( ! this.props.layouts[ layout ].data && this.props.layouts[ layout ].file ) {
( function( l ) {
SunFwHelper.requestUrl(
sunfw.base_url + this.props.layouts[ l ].file,
function( req ) {this.props.layouts[ l ].data = JSON.parse( req.responseText );
}.bind( this )
);
}.bind( this ) )( layout );
}
}
},
openCanvas: function( position ) {
this.refs.canvas.classList.toggle( 'open-' + position );
this.refs.canvasInner.classList.toggle( 'open-' + position );
if ( this.refs.canvas.classList.contains( 'open-' + position ) ) {
this.selectItem( 'offcanvas_' + position );
} else {
this.selectItem();
}
},
editSettings: function( name ) {
var data = this.getData(),
editing = typeof name == 'string' ? name : '',
ref = this.refs[ editing ];
if ( ! ref ) {
editing = '';
} else {var type = ref.getItemType(),
items = data[ type + 's' ],
itemIndex = ref.props[ type ];
if ( items && itemIndex && ! items[ itemIndex ] ) {
delete this.refs[ editing ];
editing = '';
} else {
if ( ref.props.settings ) {this.refs.settings.setState( {
ref: ref,
form: this.getItemForm( ref ),
values: this.getItemSettings( ref ),
toolbar: ref.props.type != 'offcanvas'
} );
}
else if ( ref.props.type && this.props.items[ ref.props.type ] ) {SunFwHelper.loadItemTypeSettings( this, ref.props.type, function() {this.props.items[ ref.props.type ].settings.title = this.props.items[ ref.props.type ].label;this.refs.settings.setState( {
ref: ref,
form: this.getItemForm( ref ),
values: this.getItemSettings( ref ),
toolbar: true
} );
}.bind( this ) );
}
else {this.refs.settings.setState( {
ref: ref,
form: this.getItemForm( ref ),
values: {},
toolbar: true
} );
}
}
}
if ( editing == '' ) {this.refs.settings.setState( {
ref: this,
form: this.props.settings,
values: this.getData().settings,
toolbar: false
} );
}if ( this.current.editing == '' ) {
this.refs.main_workspace.refs.wrapper.classList.remove( 'editing' );
} else if ( this.refs[ this.current.editing ] ) {
if ( this.refs[ this.current.editing ].refs.wrapper ) {
this.refs[ this.current.editing ].refs.wrapper.classList.remove( 'editing' );
}
}this.current.editing = editing;
if ( this.current.editing == '' ) {
this.refs.main_workspace.refs.wrapper.classList.add( 'editing' );
} else if ( this.refs[ this.current.editing ] ) {
if ( this.refs[ this.current.editing ].refs.wrapper ) {
this.refs[ this.current.editing ].refs.wrapper.classList.add( 'editing' );
}
}if ( ! this.item_just_added || data.items[ this.item_just_added ].type != 'menu' ) {
this.refs.activity.forceUpdate();
}
delete this.item_just_added;
},
getItemForm: function( ref ) {var form = JSON.parse( JSON.stringify(
ref.props.settings ? ref.props.settings : this.props.items[ ref.props.type ].settings
) );var pathway, parent = ref.parent;
if ( ref.props.type && ref.props.type != 'offcanvas' ) {
while ( parent ) {
if ( ref.props.view != 'main' && this == parent ) {
break;
}
if ( parent.props.settings ) {
var parent_name = sunfw.text['layout-page'];
if ( parent.props.type ) {
if ( parent.props.type == 'offcanvas' ) {
parent_name = parent.props.label;
} else if ( parent.props.type == 'section' ) {
parent_name = sunfw.text['layout-section'].replace(
'%SECTION%',
this.getItemSettings( parent ).name
);
} else {
parent_name = sunfw.text[ 'item-' + parent.props.type ];
}
}
pathway = (
<li>
<a onClick={
this.selectItem.bind( this, parent.props.id )
}>
{ parent_name }
</a>
<ul>
{ pathway }
</ul>
</li>
);
}
parent = parent.parent;
}
if ( pathway ) {
form.title = (
<div className="pull-left">
<div className="display-inline dropdown pathway">
<button
type="button"
className="btn btn-default dropdown-toggle"
data-toggle="dropdown"
>
...
</button>
<ul className="dropdown-menu">
{ pathway }
</ul>
</div>
<span className="form-title">
{ sunfw.text[ form.title ] ? sunfw.text[ form.title ] : form.title }
</span>
</div>
);
}
}if ( typeof form.title == 'string' ) {
form.title = (
<span className="form-title">
{ sunfw.text[ form.title ] ? sunfw.text[ form.title ] : form.title }
</span>
);
}return form;
},
saveSettings: function( settings ) {
var data = this.getData(), updateScreens = false;
for ( var p in settings ) {
if (p == 'enable_responsive' && data.settings[ p ] != settings[ p ]) {
updateScreens = true;
}
data.settings[ p ] = settings[ p ];
}
this.setData( data );if (updateScreens) {
this.refs.screens.forceUpdate();
}
},
handleGetItemSettings: function( that ) {var data = this.getData(),
view = data.views[ that.props.view ],
sections = data.sections,
rows = data.rows,
columns = data.columns,
items = data.items,
section, row, column, item;
switch ( that.props.type ) {
case 'offcanvas':
item = view;
break;
case 'section':
item = sections[ view.sections[ that.props.index ] ];
break;
case 'row':
if ( that.props.view == 'main' ) {
section = sections[ view.sections[ that.parent.props.index ] ];
item = rows[ section.rows[ that.props.index ] ];
} else {
item = rows[ view.rows[ that.props.index ] ];
}
break;
case 'column':
if ( that.props.view == 'main' ) {
section = sections[ view.sections[ that.parent.parent.props.index ] ];
row = rows[ section.rows[ that.parent.props.index ] ];
item = columns[ row.columns[ that.props.index ] ];
} else {
row = rows[ view.rows[ that.parent.props.index ] ];
item = columns[ row.columns[ that.props.index ] ];
}
break;
default:
if ( that.props.view == 'main' ) {
section = sections[ view.sections[ that.parent.parent.parent.props.index ] ];
row = rows[ section.rows[ that.parent.parent.props.index ] ];
column = columns[ row.columns[ that.parent.props.index ] ];
item = items[ column.items[ that.props.index ] ];
} else {
row = rows[ view.rows[ that.parent.parent.props.index ] ];
column = columns[ row.columns[ that.parent.props.index ] ];
item = items[ column.items[ that.props.index ] ];
}
break;
}var settings = ( ! item || ! item.settings ) ? {} : item.settings;
if ( item.label && settings.name === undefined ) {
settings.name = item.label;
}if ( settings.identification_code === undefined ) {
settings.identification_code = SunFwHelper.toId( 'item', true );
}
return settings;
},
handleSaveItemSettings: function( that, values ) {var data = this.getData(),
view = data.views[ that.props.view ],
sections = data.sections,
rows = data.rows,
columns = data.columns,
items = data.items,
section, row, column, item, type, id;type = that.getItemType ? that.getItemType() : ( that.props.type ? that.props.type : 'item' );
if ( values.name ) {
id = type + '_' + SunFwHelper.toId( values.name );for ( var ref in this.refs ) {
if ( ref.indexOf( type + '_' ) == 0 && this.refs[ ref ].props.id != that.props.id ) {
item = this.refs[ ref ].props[ type ];
if ( data[ type + 's' ][ item ] && data[ type + 's' ][ item ].id == id ) {
id += '_' + ( new Date() ).getTime();
break;
}
}
}
}
switch ( type ) {
case 'offcanvas':
item = view;
break;
case 'section':
item = sections[ view.sections[ that.props.index ] ];if ( id ) {sections[ view.sections[ that.props.index ] ].label = values.name;
if ( item.id != id ) {that.changeSectionIDForTemplate( item.id, id );if ( window.SunFwStyle ) {
SunFwStyle.changeSectionID( item.id, id );
}
}
}if ( values.enable_sticky && parseInt( values.enable_sticky ) ) {for ( var s in sections ) {
if ( sections[ s ] && sections[ s ].id != item.id ) {
if ( sections[ s ].settings.enable_sticky ) {
sections[ s ].settings.enable_sticky = 0;this.refs[ 'section_' + s ].forceUpdate();
break;
}
}
}
}
break;
case 'row':
if ( that.props.view == 'main' ) {
section = sections[ view.sections[ that.parent.props.index ] ];
item = rows[ section.rows[ that.props.index ] ];
} else {
item = rows[ view.rows[ that.props.index ] ]
}
break;
case 'column':
if ( that.props.view == 'main' ) {
section = sections[ view.sections[ that.parent.parent.props.index ] ];
row = rows[ section.rows[ that.parent.props.index ] ];
item = columns[ row.columns[ that.props.index ] ];
} else {
row = rows[ view.rows[ that.parent.props.index ] ];
item = columns[ row.columns[ that.props.index ] ];
}
break;
default:
if ( that.props.view == 'main' ) {
section = sections[ view.sections[ that.parent.parent.parent.props.index ] ];
row = rows[ section.rows[ that.parent.parent.props.index ] ];
column = columns[ row.columns[ that.parent.props.index ] ];
item = items[ column.items[ that.props.index ] ];
} else {
row = rows[ view.rows[ that.parent.parent.props.index ] ];
column = columns[ row.columns[ that.parent.props.index ] ];
item = items[ column.items[ that.props.index ] ];
}if ( window.SunFwStyle && item.type == 'menu' && id && item.id != id ) {
SunFwStyle.changeMenuID( item.id, id );
}
break;
}item.settings = values;if ( id ) {
item.id = id;
}this.setData( data );that.forceUpdate();
},
setColWidth: function( column, width ) {if ( typeof column.width != 'object' ) {
column.width = {}
}width = parseInt( width );
for ( var screen in this.props.screens ) {
if ( screen != 'xs' ) {
column.width[ screen ] = width;
} else {
column.width[ screen ] = this.props.grid;
}
}
return column;
},
calcColumnWidth: function( columnsDataArray, columnsInRow ) {if ( this.props.grid % columnsInRow.length == 0 ) {
columnsInRow.map( ( columnIndex ) => {
columnsDataArray[ columnIndex ] = this.setColWidth(
columnsDataArray[ columnIndex ],
this.props.grid / columnsInRow.length
);
} );
}else {
var newWidth = Math.floor( this.props.grid / columnsInRow.length );
columnsInRow.map( ( columnIndex ) => {
columnsDataArray[ columnIndex ] = this.setColWidth(
columnsDataArray[ columnIndex ],
newWidth
);
} );if ( this.props.grid % columnsInRow.length > 0 ) {
for ( var i = 1, n = this.props.grid % columnsInRow.length; i <= n; i++ ) {
columnsDataArray[ columnsInRow[ columnsInRow.length - i ] ] = this.setColWidth(
columnsDataArray[ columnsInRow[ columnsInRow.length - i ] ],
newWidth + 1
);
}
}
}
return columnsDataArray;
},
handleSave: function( prebuild, name, callback ) {var token = document.querySelector( '#jsn-tpl-token' ).value,
styleID = document.querySelector( '#jsn-style-id' ).value,
templateName = document.querySelector( '#jsn-tpl-name' ).value;var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=layout&'
+ token + '=1&style_id=' + styleID + '&template_name=' + templateName;
if ( prebuild === true ) {
server += '&action=saveAs&layout_name=' + name;
} else {
server += '&action=save';
}var callback = arguments[ arguments.length - 1 ];var data = this.getData();
for ( var p in this.current ) {
if ( this.current.hasOwnProperty( p ) ) {
data[ p ] = this.current[ p ];
}
}jQuery( '#sunfw-admin-tab span[data-tab="#layout"]' ).removeClass('sunfwhide');
SunFwHelper.requestUrl(
server,
function( req ) {
var response;
try {
response = JSON.parse( req.responseText );
} catch ( e ) {
response = {
type: 'error',
data: req.responseText
};
}
if ( response.type == 'success' ) {
callback( true );
if ( window.show_noty ) {
noty( {
text: sunfw.text['save-success'],
theme: 'relax',layout: 'top',
type: 'success',
timeout: 2000,
animation: {
open: 'animated fadeIn',close: 'animated fadeOut',}
} );
}if ( prebuild === true ) {
this.props.layouts[ response.data ] = {
data: data,
label: name
};
}
} else {
callback( false );
bootbox.alert( response.data );
}
jQuery( '#sunfw-admin-tab span[data-tab="#layout"]' ).addClass('sunfwhide');
window.save_all_is_processing = false;
window.save_all_step = 2;
window.layoutBuilderHasChange = false;
}.bind( this ),
{ data: JSON.stringify( data ) }
);
}
});
window.LayoutBuilderPreview= React.createClass( {
mixins: [ SunFwMixinBase ],
getDefaultProps: function() {
return {
id: '',
height: 210
};
},
getInitialState: function() {
return {
views: {
main: {
sections: [],
},
},
sections: [],
rows: [],
columns: [],
};
},
render: function() {this.num_row = 0;
return (
<div ref="wrapper" className="preview-layout" style={ {
height: this.props.height + 'px',
'overflow-y': 'auto'
} }>
{ this.state.views.main.sections.map( ( sectionIndex ) => {
if ( this.state.sections[ sectionIndex ] ) {
return (
<div className="container-fluid">
{ this.state.sections[ sectionIndex ].rows.map( ( rowIndex ) => {
if ( this.state.rows[ rowIndex ] ) {
this.num_row++;
return (
<div className="row">
{ this.state.rows[ rowIndex ].columns.map( ( columnIndex ) => {
if ( this.state.columns[ columnIndex ] ) {if (
! this.state.columns[ columnIndex ].width
||
typeof this.state.columns[ columnIndex ].width == 'string'
) {
this.state.columns[ columnIndex ].width = {
lg: ! this.state.columns[ columnIndex ].width
? this.editor.props.grid
: parseInt( this.state.columns[ columnIndex ].width )
};
}
var className = 'col-xs-' + this.state.columns[ columnIndex ].width.lg;
return (
<div className={ className }>
<div className="preview-column"></div>
</div>
);
}
} ) }
</div>
);
}
} ) }
</div>
);
}
} ) }
</div>
);
},
initActions: function() {
if (this.refs.wrapper && this.num_row) {var preview_css = window.getComputedStyle(this.refs.wrapper),
preview_height = this.props.height
- parseInt( preview_css.getPropertyValue('border-top-width') )
- parseInt( preview_css.getPropertyValue('border-bottom-width') )
- parseInt( preview_css.getPropertyValue('padding-top') )
- parseInt( preview_css.getPropertyValue('padding-bottom') ),
row_height = this.refs.wrapper.querySelector('.row').getBoundingClientRect().height;
if (row_height * this.num_row > preview_height) {
row_height = preview_height / this.num_row;var columns = this.refs.wrapper.querySelectorAll('.preview-column');
for (var i = 0, n = columns.length; i < n; i++) {
var row_css = window.getComputedStyle(columns[i].parentNode);
columns[i].style.height = (
row_height
- parseInt( row_css.getPropertyValue('padding-top') )
- parseInt( row_css.getPropertyValue('padding-bottom') )
) + 'px';
}
}
}
}
});
window.LayoutBuilderScreens= React.createClass( {
mixins: [ SunFwMixinBase ],
render: function() {
var screens = [], className;
for ( var screen in this.editor.props.screens ) {
var keyName = 'screen_' + screen, icon;
className = 'btn btn-default sunfw_popover';
if ( this.editor.current.screen == screen ) {
className += ' active';
}
if ( screen == 'lg' ) {
icon = ( <i className="fa fa-desktop"></i> );
} else if ( screen == 'md' ) {
icon = ( <i className="fa fa-laptop"></i> );
} else if ( screen == 'sm' ) {
icon = ( <i className="fa fa-tablet"></i> );
} else if ( screen == 'xs') {
icon = ( <i className="fa fa-mobile"></i> );
}
screens.push(
<button
id={ keyName }
key={ this.editor.props.id + '_' + keyName }
ref={ keyName }
type="button"
onClick={ this.changeScreen.bind( this, screen ) }
className={ className }
role="button"
data-content={ this.editor.props.screens[ screen ] }
>
{ icon }
{ this.editor.props.screens[ screen ] }
</button>
);
}className = 'sunfw-device btn-group';var data = this.editor.getData(),
enabled = parseInt(
data.settings.enable_responsive === undefined ? 1 : data.settings.enable_responsive
);
if ( ! enabled ) {
className += ' hidden';
}
return (
<div className={ className } role="group">
{ screens }
</div>
);
},
handleComponentDidMount: function() {
jQuery( '.sunfw_popover' ).popover({
trigger: 'hover',
placement: 'top',
template: '<div class="popover sunfw-device" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>',
container: 'body'
});
},
initActions: function() {
document.body.className = document.body.className.replace( / screen-(lg|md|sm|xs)/g, '' );
document.body.classList.add( 'screen-' + this.editor.current.screen );
},
changeScreen: function( screen ) {
if (this.editor.current.screen == screen) {
return;
}this.editor.current.screen = screen;this.forceUpdate();this.editor.refs.main_workspace.forceUpdate();this.editor.selectItem( this.editor.current.editing );
}
});
window.LayoutBuilderWorkspace= React.createClass( {
mixins: [
SunFwMixinBase,
LayoutBuilderMixinBase,
SunFwMixinItem,
SunFwMixinDroppable,
LayoutBuilderMixinDroppable
],
getDefaultProps: function() {
return {
view: ''
}
},
render: function() {
var data = this.editor.getData(),
className = 'layout-builder-workspace main-workspace droppable accept-section accept-row accept-column accept-item',
sections = [], keyName;
data.views[ this.props.view ].sections.map( ( sectionIndex, index ) => {
if ( data.sections[ sectionIndex ] ) {
keyName = 'section_' + sectionIndex;
sections.push(
<LayoutBuilderSection
id={ keyName }
key={ this.props.id + '_' + keyName }
ref={ keyName }
view={ this.props.view }
index={ index }
parent={ this }
editor={ this.editor }
section={ sectionIndex }
/>
);if ( this.editor.section_just_added == sectionIndex ) {
this.editor.selectItem( keyName );
delete this.editor.section_just_added;
}
}
} );
if ( ! sections.length ) {
className += ' empty-layout-workspace';
}
return (
<div
ref="wrapper"
className={ className }
onDragOver={ this.dragOver }
onDrop={ this.drop }
onMouseOver={ this.mouseover }
onMouseOut={ this.mouseout }
>
{ sections.length ? sections : sunfw.text['empty-layout-message'] }
</div>
);
}
});
window.LayoutBuilderColumn= React.createClass( {
mixins: [
SunFwMixinBase,
LayoutBuilderMixinBase,
SunFwMixinItem,
LayoutBuilderMixinItem,
SunFwMixinDraggable,
SunFwMixinDroppable,
LayoutBuilderMixinDroppable
],
getDefaultProps: function() {
return {
id: '',
view: '',
type: 'column',
index: 0,
column: '',
settings: {
'class': 'column-settings',
title: sunfw.text['column-settings'],
rows: [
{
cols: [
{
'class': 'col-xs-12',
settings: {
margin: {
type: 'spacing-settings',
label: 'margin'
}
}
},
{
'class': 'col-xs-12',
settings: {
padding: {
type: 'spacing-settings',
label: 'padding'
}
}
}
]
},
{
'class': 'separator-before',
cols: [
{
'class': 'col-xs-12 display-in-layout',
settings: {
visible_in: {
type: 'checkbox',
label: sunfw.text['display-in-layout'],
options: [
{ value: 'lg', label: sunfw.text['desktop'] },
{ value: 'md', label: sunfw.text['latop'] },
{ value: 'sm', label: sunfw.text['tablet'] },
{ value: 'xs', label: sunfw.text['smartphone'] }
],
'default': [ 'lg', 'md', 'sm', 'xs' ]
}
}
}
]
},
{
'class': 'separator-before',
cols: [
{
'class': 'col-xs-12',
settings: {
'class': {
type: 'text',
label: 'custom-classes'
}
}
}
]
}
]
}
};
},
render: function() {var data = this.editor.getData(),
column = data.columns[ this.props.column ],
width = column.width[ this.editor.current.screen ],
settings = this.editor.getItemSettings( this );var className = 'layout-builder-item draggable-item resizable col-layout col-xs-' + width,
items = [], keyName;
if ( settings.disabled ) {
className += ' disabled-item';
}
if ( ! this.rendered ) {
className += ' initial';
}
column.items.map( ( itemIndex, index ) => {
if ( data.items[ itemIndex ] ) {
keyName = 'item_' + itemIndex;
items.push(
<LayoutBuilderItem
id={ keyName }
key={ this.props.id + '_' + keyName }
ref={ keyName }
item={ itemIndex }
type={ data.items[ itemIndex ].type }
view={ this.props.view }
index={ index }
parent={ this }
editor={ this.editor }
/>
);if ( this.editor.item_just_added == itemIndex ) {
this.editor.selectItem( keyName );
}
}
} );
return (
<div
ref="wrapper"
onClick={ this.editItem }
className={ className }
data-index={ this.props.index }
onMouseOver={ this.mouseover }
onMouseOut={ this.mouseout }
>
<div
className="droppable accept-item"
onDragOver={ this.dragOver }
onDrop={ this.drop }
>
{ items }
</div>
<ul className="manipulation-actions margin-0 col-action">
<li>
<a
href="#"
className="draggable"
draggable="true"
onDragStart={ this.dragStart }
onDragEnd={ this.dragEnd }
>
<i className="fa fa-ellipsis-v"></i>
</a>
</li>
</ul>
<div className="resizable-handle"></div>
</div>
);
}
});
window.LayoutBuilderItem= React.createClass( {
mixins: [
SunFwMixinBase,
SunFwMixinItem,
LayoutBuilderMixinItem,
SunFwMixinDraggable
],
getDefaultProps: function() {
return {
id: '',
view: '',
type: 'item',
item: '',
index: 0
};
},
render: function() {
var data = this.editor.getData(),
item = data.items[ this.props.item ],
settings = this.editor.getItemSettings( this ),
className = 'jsn-item layout-builder-item draggable-item bg-primary ' + this.props.type;
if ( settings.disabled ) {
className += ' disabled-item';
}
if ( ! this.rendered ) {
className += ' initial';
}
return (
<div
ref="wrapper"
onClick={ this.editItem }
className={ className }
data-index={ this.props.index }
onMouseOver={ this.mouseover }
onMouseOut={ this.mouseout }
>
<div className="item-name">
<i
className="fa fa-ellipsis-v draggable"
draggable="true"
onDragStart={ this.dragStart }
onDragEnd={ this.dragEnd }
></i>
<span>
{ settings.name }
</span>
</div>
</div>
);
}
});
window.LayoutBuilderOffcanvas= React.createClass( {
mixins: [
SunFwMixinBase,
LayoutBuilderMixinBase,
SunFwMixinItem,
LayoutBuilderMixinItem,
SunFwMixinDroppable,
LayoutBuilderMixinDroppable
],
getDefaultProps: function() {
return {
id: '',
view: '',
type: 'offcanvas',
label: '',
settings: {}
};
},
handleInitActions: function() {
if ( this.props.view == 'top' || this.props.view == 'bottom' ) {
this.props.settings = {
'class': 'offcanvas-settings',
title: 'offcanvas-settings',
rows: [
{
cols: [
{
'class': 'col-xs-12',
settings: {
height: {
type: 'slider',
label: 'height',
default: 300,
max: 500,
min: 50,
suffix: 'px'
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12',
settings: {
padding: {
type: 'spacing-settings',
label: 'padding'
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12',
settings: {
'anchor-position': {
type: 'select',
label: 'toggle-position',
value: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'center' : 'middle',
options: [
{
label: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'left' : 'top',
value: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'left' : 'top'
},
{
label: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'center' : 'middle',
value: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'center' : 'middle'
},
{
label: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'right' : 'bottom',
value: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'right' : 'bottom'
}
]
}
}
},
{
'class': 'col-xs-12',
settings: {
'effect': {
type: 'select',
label: 'effect',
options: [
{ "value" : "effect-" + this.props.view + "-push", "label": "push" },
{ "value" : "effect-" + this.props.view + "-slide", "label": "slide" }
]
}
}
}
]
},
{
'class': 'separator-before',
cols: [
{
'class': 'col-xs-12',
settings: {
'class-prefix': {
type: 'text',
label: 'custom-classes'
}
}
}
]
},
{
'class': 'separator-before',
cols: [
{
'class': 'col-xs-12 display-in-layout',
settings: {
visible_in: {
type: 'checkbox',
label: sunfw.text['display-in-layout'],
options: [
{ value: 'lg', label: sunfw.text['desktop'] },
{ value: 'md', label: sunfw.text['latop'] },
{ value: 'sm', label: sunfw.text['tablet'] },
{ value: 'xs', label: sunfw.text['smartphone'] }
],
'default': [ 'lg', 'md', 'sm', 'xs' ]
}
}
}
]
}
]
};
} else {
this.props.settings = {
'class': 'section-settings',
title: 'container-settings',
rows: [
{
cols: [
{
'class': 'col-xs-12',
settings: {
width: {
type: 'slider',
label: 'width',
default: 300,
max: 500,
min: 50,
suffix: 'px'
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12',
settings: {
padding: {
type: 'spacing-settings',
label: 'padding'
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12',
settings: {
'anchor-position': {
type: 'select',
label: 'toggle-position',
value: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'center' : 'middle',
options: [
{
label: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'left' : 'top',
value: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'left' : 'top'
},
{
label: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'center' : 'middle',
value: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'center' : 'middle'
},
{
label: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'right' : 'bottom',
value: ( this.props.view == 'top' || this.props.view == 'bottom' ) ? 'right' : 'bottom'
}
]
}
}
},
{
'class': 'col-xs-12',
settings: {
'effect': {
type: 'select',
label: 'effect',
options: [
{ "value" : "effect-" + this.props.view + "-push", "label": "push" },
{ "value" : "effect-" + this.props.view + "-slide", "label": "slide" }
]
}
}
}
]
},
{
'class': 'separator-before',
cols: [
{
'class': 'col-xs-12',
settings: {
'class-prefix': {
type: 'text',
label: 'custom-classes'
}
}
}
]
},
{
'class': 'separator-before',
cols: [
{
'class': 'col-xs-12 display-in-layout',
settings: {
visible_in: {
type: 'checkbox',
label: sunfw.text['display-in-layout'],
options: [
{ value: 'lg', label: sunfw.text['desktop'] },
{ value: 'md', label: sunfw.text['latop'] },
{ value: 'sm', label: sunfw.text['tablet'] },
{ value: 'xs', label: sunfw.text['smartphone'] }
],
'default': [ 'lg', 'md', 'sm', 'xs' ]
}
}
}
]
}
]
};
}
},
render: function() {
var data = this.editor.getData(),
className = 'offcanvas offcanvas-workspace jsn-content-' + this.props.view,
rows = [], keyName;
if ( this.props.disabled ) {
className += ' disabled-item';
}
data.views[ this.props.view ].rows.map( ( rowIndex, index ) => {
if ( data.rows[ rowIndex ] ) {
keyName = 'row_' + rowIndex;
rows.push(
<LayoutBuilderRow
id={ keyName }
key={ this.props.id + '_' + keyName }
ref={ keyName }
row={ rowIndex }
view={ this.props.view }
index={ index }
parent={ this }
editor={ this.editor }
/>
);if ( this.editor.row_just_added == rowIndex ) {
this.editor.selectItem( keyName );
delete this.editor.row_just_added;
}
}
} );
if ( ! rows.length ) {
className += ' empty-layout-workspace';
}
return (
<div
ref="wrapper"
onClick={ this.editItem }
className={ className }
onMouseOver={ this.mouseover }
onMouseOut={ this.mouseout }
>
<div className="jsn-panel">
<div className="jsn-panel-heading clearfix text-center">
<div className="pull-left">
{ this.props.label }
</div>
</div>
<div
className="jsn-panel-body droppable accept-row accept-column accept-item"
onDragOver={ this.dragOver }
onDrop={ this.drop }
>
{ rows.length ? rows : sunfw.text['empty-layout-message'] }
</div>
</div>
</div>
);
}
});
window.LayoutBuilderRow= React.createClass( {
mixins: [
SunFwMixinBase,
LayoutBuilderMixinBase,
SunFwMixinItem,
LayoutBuilderMixinItem,
SunFwMixinDraggable,
SunFwMixinDroppable,
LayoutBuilderMixinDroppable
],
getDefaultProps: function() {
return {
id: '',
row: '',
view: '',
type: 'row',
index: 0,
settings: {
'class': 'row-settings',
title: sunfw.text['row-settings'],
rows: [
{
cols: [
{
'class': 'col-xs-12',
settings: {
margin: {
type: 'spacing-settings',
label: 'margin'
}
}
},
{
'class': 'col-xs-12',
settings: {
padding: {
type: 'spacing-settings',
label: 'padding'
}
}
}
]
},
{
'class': 'separator-before',
cols: [
{
'class': 'col-xs-12',
settings: {
'class': {
type: 'text',
label: 'custom-classes'
}
}
}
]
}
]
}
};
},
render: function() {
var data = this.editor.getData(),
row = data.rows[ this.props.row ],
settings = this.editor.getItemSettings( this ),
className = 'layout-builder-item draggable-item row row-layout',
columns = [], keyName;
if ( settings.disabled ) {
className += ' disabled-item';
}
if ( ! this.rendered ) {
className += ' initial';
}
row.columns.map( ( columnIndex, index ) => {
if ( data.columns[ columnIndex ] ) {
keyName = 'column_' + columnIndex;
columns.push(
<LayoutBuilderColumn
id={ keyName }
key={ this.props.id + '_' + keyName }
ref={ keyName }
view={ this.props.view }
index={ index }
column={ columnIndex }
parent={ this }
editor={ this.editor }
/>
);if ( this.editor.column_just_added == columnIndex ) {
this.editor.selectItem( keyName );
delete this.editor.column_just_added;
}
}
} );
return (
<div
ref="wrapper"
onClick={ this.editItem }
className={ className }
data-index={ this.props.index }
onMouseOver={ this.mouseover }
onMouseOut={ this.mouseout }
>
<div
className="jsn-panel-body droppable clearfix accept-column accept-item"
onDragOver={ this.dragOver }
onDrop={ this.drop }
>
{ columns }
</div>
<ul className="manipulation-actions margin-0 row-action">
<li>
<a
href="#"
className="draggable"
draggable="true"
onDragStart={ this.dragStart }
onDragEnd={ this.dragEnd }
>
<i className="fa fa-ellipsis-v"></i>
</a>
</li>
</ul>
</div>
);
},handleInitActions: function() {
var data = this.editor.getData(),
row = data.rows[ this.props.row ],
grid = this.editor.props.grid, cellWidth = 100 / grid;
row.columns.map( ( column, index ) => {
var columnRef = this.editor.refs[ 'column_' + column ];
if ( columnRef && columnRef.refs && columnRef.refs.wrapper ) {
interact( columnRef.refs.wrapper ).resizable( {
preserveAspectRatio: false,
edges: {
top: false,
right: index < ( row.columns.length - 1 ),
bottom: false,
left: false,
}
} ).on( 'resizemove', function( event ) {this.editor.resizing || ( this.editor.resizing = true );function getPrevSpace( screen, columns, columnsInRow, from ) {
var total = 0;
for ( var i = from; i >= 0; i-- ) {
total += columns[ columnsInRow[ i ] ].width[ screen ];
}
return total;
}function getNextSpace( screen, columns, columnsInRow, from ) {
var total = 0;
for ( var i = from; i < columnsInRow.length; i++ ) {
total += columns[ columnsInRow[ i ] ].width[ screen ];
}
return total;
}this.timeout && clearTimeout( this.timeout );
this.timeout = setTimeout( function() {var screen = this.editor.current.screen;var data = this.editor.getData(),
columns = data.columns,
parent = event.target.parentNode.parentNode,
newWidth = ( event.rect.width / parent.offsetWidth ) * 100,
oldWidth = columns[ column ].width[ screen ],
nextOldWidth = columns[ row.columns[ index + 1 ] ].width[ screen ],
nextWidth, siblingWidth, total;newWidth = Math.round( newWidth / cellWidth );nextWidth = ( oldWidth + nextOldWidth ) - newWidth;// allow the resizing column to take the entire grid.
if ( newWidth < 1 ) {if ( index == 0 ) {
newWidth = grid;nextWidth = oldWidth + nextOldWidth;
}else {// allow the column to take the space of its previous sibling.
total = getPrevSpace( screen, columns, row.columns, index - 1 );
if ( total % grid ) {
newWidth = oldWidth + total % grid;
nextWidth = nextOldWidth;siblingWidth = columns[ row.columns[ index - 1 ] ].width[ screen ];
columns[ row.columns[ index - 1 ] ].width[ screen ]
= siblingWidth + ( grid * Math.ceil( total / grid ) ) - total;
}else {
newWidth = grid;nextWidth = oldWidth + nextOldWidth;
}
}
}else if ( newWidth < oldWidth ) {// push the next column to the same 'virtual' row with the resizing column.
total = getNextSpace( screen, columns, row.columns, index + 1 );
if ( total >= grid ) {total = getPrevSpace( screen, columns, row.columns, index - 1 ) + newWidth;
nextWidth = ( grid * Math.ceil( total / grid ) ) - total;if ( index + 1 < row.columns.length - 1 ) {
total = getNextSpace( screen, columns, row.columns, index + 2 );
columns[ row.columns[ index + 2 ] ].width[ screen ] = (
columns[ row.columns[ index + 2 ] ].width[ screen ]
) + ( grid * Math.ceil( total / grid ) ) - total;
}
}
}else if ( nextWidth < 1 ) {if ( index + 1 == row.columns.length - 1 ) {
nextWidth = grid;newWidth = oldWidth + nextOldWidth;
}else {// allow the next column to take the space of its next sibling.
total = getNextSpace( screen, columns, row.columns, index + 2 );
if ( total % grid ) {
nextWidth = nextOldWidth + total % grid;
newWidth = oldWidth;siblingWidth = columns[ row.columns[ index + 2 ] ].width[ screen ];
columns[ row.columns[ index + 2 ] ].width[ screen ]
= siblingWidth + ( grid * Math.ceil( total / grid ) ) - total;
}else {
nextWidth = grid;newWidth = oldWidth + nextOldWidth;
}
}
}if ( newWidth < oldWidth && screen == 'xs' ) {
var numCol = 0;
for ( var i = 0; i < index; i++ ) {
if ( columns[ row.columns[ i ] ].width[ screen ] < grid ) {
numCol++;
}
}
if ( numCol % 2 > 0 ) {
return alert( sunfw.text['mobile-screen-can-have-only-2-columns-per-row'] );
}
}// or greater than the maximum allowed width.
if ( newWidth < 1 || nextWidth < 1 || newWidth > grid || nextWidth > grid ) {
return;
}columns[ column ].width[ screen ] = newWidth;columns[ row.columns[ index + 1 ] ].width[ screen ] = nextWidth;this.editor.setData( data );this.forceUpdate();
}.bind( this ), 10 );
}.bind( this ) );
}
} );
}
});
window.LayoutBuilderSection= React.createClass( {
mixins: [
SunFwMixinBase,
LayoutBuilderMixinBase,
SunFwMixinItem,
LayoutBuilderMixinItem,
SunFwMixinDraggable,
SunFwMixinDroppable,
LayoutBuilderMixinDroppable
],
getDefaultProps: function() {
return {
id: '',
view: '',
type: 'section',
index: 0,
section: '',
settings: {
'class': 'section-settings',
title: sunfw.text['section-settings'],
rows: [
{
'class': 'separator-after',
cols: [
{
'class': 'col-xs-12',
settings: {
name: {
type: "text",
label: "name"
}
}
}
]
},
{
'class': 'separator-after',
cols: [
{
'class': 'col-xs-12',
settings: {
full_width: {
type: 'checkbox',
label: 'enable-full-width',
value: 1,
'default': 1
}
}
},
{
'class': 'col-xs-12',
settings: {
enable_sticky: {
type: 'checkbox',
label: 'enable-sticky',
value: 1,
'default': 0
}
}
}
]
},
{
cols: [
{
'class': 'col-xs-12',
settings: {
margin: {
type: 'spacing-settings',
label: 'margin'
}
}
},
{
'class': 'col-xs-12',
settings: {
padding: {
type: 'spacing-settings',
label: 'padding'
}
}
}
]
},
{
'class': 'separator-before',
cols: [
{
'class': 'col-xs-12',
settings: {
'class': {
type: 'text',
label: 'custom-classes'
}
}
}
]
}
]
}
};
},
render: function() {
var data = this.editor.getData(),
section = data.sections[ this.props.section ],
settings = this.editor.getItemSettings( this ),
className = 'jsn-panel layout-builder-item draggable-item layout-builder-section',
rows = [], keyName;
if ( settings.disabled ) {
className += ' disabled-item';
}
if ( ! this.rendered ) {
className += ' initial';
}
section.rows.map( ( rowIndex, index ) => {
if ( data.rows[ rowIndex ] ) {
keyName = 'row_' + rowIndex;
rows.push(
<LayoutBuilderRow
id={ keyName }
key={ this.props.id + '_' + keyName }
ref={ keyName }
row={ rowIndex }
view={ this.props.view }
index={ index }
parent={ this }
editor={ this.editor }
/>
);if ( this.editor.row_just_added == rowIndex ) {
this.editor.selectItem( keyName );
delete this.editor.row_just_added;
}
}
} );var sticky;
if ( settings.enable_sticky ) {
sticky = ( <i className="fa fa-thumb-tack" style={ { color: 'orange', 'margin-left': '6px' } }></i> );
}
return (
<div
ref="wrapper"
onClick={ this.editItem }
className={ className }
data-index={ this.props.index }
onMouseOver={ this.mouseover }
onMouseOut={ this.mouseout }
>
<div className="jsn-panel-heading text-center clearfix">
<div className="pull-left">
<i
className="fa fa-ellipsis-v draggable"
draggable="true"
onDragStart={ this.dragStart }
onDragEnd={ this.dragEnd }
></i>
<span>
{ settings.name }
</span>
{ sticky }
</div>
</div>
<div
className="jsn-panel-body droppable accept-row accept-column accept-item"
onDragOver={ this.dragOver }
onDrop={ this.drop }
>
{ rows }
</div>
</div>
);
}
});
