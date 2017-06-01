
window.MenuBuilderMixinBase = {
 initActions: function() {
 if ( this.editor ) {
 for ( var k in this.refs ) {
 if ( k.match( /^(row|column|block|item)_/ ) ) {
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
window.MenuBuilderMixinDroppable = {
 handleDrop: function( droppable, target, that, type ) { var data = this.editor.getData(),
 rows = data.rows,
 columns = data.columns,
 blocks = data.blocks,
 items = data.items,
 root, row, column, block, item, label,
 next = {}; if ( ! data.megamenu[ this.editor.current.root ] ) {
 data.megamenu[ this.editor.current.root ] = {
 settings: {},
 rows: [],
 };
 } else if ( ! data.megamenu[ this.editor.current.root ].rows ) {
 data.megamenu[ this.editor.current.root ].rows = [];
 }
 root = data.megamenu[ this.editor.current.root ]; if ( droppable.classList.contains( 'accept-row' ) && type == 'row' ) { row = view.rows.splice( that.props.index, 1 )[0];
 if ( target > that.props.index ) {
 view.rows.splice( target - 1, 0, row );
 } else {
 view.rows.splice( target, 0, row );
 } this.editor.row_just_added = row;
 } else if ( droppable.classList.contains( 'accept-column' ) && type == 'column' ) { row = rows[ root.rows[ that.parent.props.index ] ];
 column = row.columns.splice( that.props.index, 1 )[0]; this.editor.column_just_added = column; if ( ! row.columns.length ) {
 delete rows[ root.rows[ that.parent.props.index ] ];
 root.rows.splice( that.parent.props.index, 1 ); if (
 droppable.classList.contains( 'accept-row' )
 &&
 target > that.parent.props.index
 ) {
 target--;
 } if (
 this.props.type == 'row'
 &&
 this.props.index > that.parent.props.index
 ) {
 this.props.index--;
 } if ( ! droppable.classList.contains( 'accept-row' ) ) {
 that.parent.parent.forceUpdate();
 }
 } else {
 columns = this.editor.calcColumnWidth( columns, row.columns ); that.parent.forceUpdate();
 } if ( droppable.classList.contains( 'accept-row' ) ) { next.row = SunFwHelper.getNextIndex( rows );
 label = sunfw.text.row + ' #' + next.row;
 rows[ next.row ] = {
 id: 'row_' + SunFwHelper.toId( label ),
 settings: { name: label },
 columns: [ column ],
 }; columns = this.editor.calcColumnWidth( columns, [ column ] ); root.rows.splice( target, 0, next.row );
 } else { rows[ root.rows[ this.props.index ] ].columns.splice( target, 0, column ); columns = this.editor.calcColumnWidth( columns, rows[ root.rows[ this.props.index ] ].columns );
 }
 } else if ( droppable.classList.contains( 'accept-block' ) && type == 'block' ) { row = rows[ root.rows[ that.parent.parent.props.index ] ];
 column = columns[ row.columns[ that.parent.props.index ] ];
 block = column.blocks.splice( that.props.index, 1 )[0]; this.editor.block_just_added = block; if ( ! column.blocks.length ) {
 delete columns[ row.columns[ that.parent.props.index ] ];
 row.columns.splice( that.parent.props.index, 1 ); if (
 this.props.type == 'row'
 &&
 this == that.parent.parent
 &&
 target > that.parent.props.index
 ) {
 target--;
 } if (
 this.props.type == 'column'
 &&
 this.parent == that.parent.parent
 &&
 this.props.index > that.parent.props.index
 ) {
 this.props.index--;
 } if ( ! row.columns.length ) {
 delete rows[ root.rows[ that.parent.parent.props.index ] ];
 root.rows.splice( that.parent.parent.props.index, 1 ); if (
 droppable.classList.contains( 'accept-row' )
 &&
 target > that.parent.parent.props.index
 ) {
 target--;
 } if (
 this.props.type == 'row'
 &&
 this.props.index > that.parent.parent.props.index
 ) {
 this.props.index--;
 } if (
 this.props.type == 'column'
 &&
 this.parent.props.index > that.parent.parent.props.index
 ) {
 this.parent.props.index--;
 } if ( ! droppable.classList.contains( 'accept-row' ) ) {
 that.parent.parent.parent.forceUpdate();
 }
 } else {
 that.parent.parent.forceUpdate();
 }
 } else {
 that.parent.forceUpdate();
 } if ( droppable.classList.contains( 'accept-row' ) ) { next.column = SunFwHelper.getNextIndex( columns );
 label = sunfw.text.column + ' #' + next.column;
 columns[ next.column ] = {
 id: 'column_' + SunFwHelper.toId( label ),
 settings: { name: label },
 blocks: [ block ],
 }; next.row = SunFwHelper.getNextIndex( rows );
 label = sunfw.text.row + ' #' + next.row;
 rows[ next.row ] = {
 id: 'row_' + SunFwHelper.toId( label ),
 settings: { name: label },
 columns: [ next.column ],
 }; columns = this.editor.calcColumnWidth( columns, [ next.column ] ); root.rows.splice( target, 0, next.row );
 } else if ( droppable.classList.contains( 'accept-column' ) ) { next.column = SunFwHelper.getNextIndex( columns );
 label = sunfw.text.column + ' #' + next.column;
 columns[ next.column ] = {
 id: 'column_' + SunFwHelper.toId( label ),
 settings: { name: label },
 blocks: [ block ],
 }; rows[ root.rows[ this.props.index ] ].columns.splice( target, 0, next.column );
 } else { row = rows[ root.rows[ this.parent.props.index ] ];
 columns[ row.columns[ this.props.index ] ].blocks.splice( target, 0, block );
 }
 } else if ( type == 'item' && typeof that == 'object' ) { row = rows[ root.rows[ that.parent.parent.parent.props.index ] ];
 column = columns[ row.columns[ that.parent.parent.props.index ] ];
 block = blocks[ column.blocks[ that.parent.props.index ] ];
 item = block.items.splice( that.props.index, 1 )[0]; if ( ! block.items.length ) {
 delete blocks[ column.blocks[ that.parent.props.index ] ];
 column.blocks.splice( that.parent.props.index, 1 ); if (
 this.props.type == 'column'
 &&
 this == that.parent.parent
 &&
 target > that.parent.parent.props.index
 ) {
 target--;
 } if (
 this.props.type == 'block'
 &&
 this.parent == that.parent.parent
 &&
 this.props.index > that.parent.props.index
 ) {
 this.props.index--;
 } if ( ! column.blocks.length ) {
 delete columns[ row.columns[ that.parent.parent.props.index ] ];
 row.columns.splice( that.parent.parent.props.index, 1 ); if (
 this.props.type == 'row'
 &&
 this == that.parent.parent.parent
 &&
 target > that.parent.parent.parent.props.index
 ) {
 target--;
 } if (
 this.props.type == 'column'
 &&
 this.parent == that.parent.parent.parent
 &&
 this.props.index > that.parent.parent.props.index
 ) {
 this.props.index--;
 } if (
 this.props.type == 'block'
 &&
 this.parent.parent == that.parent.parent.parent
 &&
 this.parent.props.index > that.parent.parent.props.index
 ) {
 this.parent.props.index--;
 } if ( ! row.columns.length ) {
 delete rows[ root.rows[ that.parent.parent.parent.props.index ] ];
 root.rows.splice( that.parent.parent.parent.props.index, 1 ); if (
 droppable.classList.contains( 'accept-row' )
 &&
 target > that.parent.parent.parent.props.index
 ) {
 target--;
 } if (
 this.props.type == 'row'
 &&
 this.props.index > that.parent.parent.parent.props.index
 ) {
 this.props.index--;
 } if (
 this.props.type == 'column'
 &&
 this.parent.props.index > that.parent.parent.parent.props.index
 ) {
 this.parent.props.index--;
 } if (
 this.props.type == 'block'
 &&
 this.parent.parent.props.index > that.parent.parent.parent.props.index
 ) {
 this.parent.parent.props.index--;
 } if ( ! droppable.classList.contains( 'accept-row' ) ) {
 that.parent.parent.parent.parent.forceUpdate();
 }
 } else {
 columns = this.editor.calcColumnWidth( columns, row.columns ); that.parent.parent.parent.forceUpdate();
 }
 } else {
 that.parent.parent.forceUpdate();
 }
 } else {
 that.parent.forceUpdate();
 }
 } else if ( typeof that == 'string' ) {
 next.item = SunFwHelper.getNextIndex( items );
 label = this.editor.props.items[ that ].label || sunfw.text.item + ' #' + next.item;
 items[ next.item ] = {
 id: 'item_' + SunFwHelper.toId( sunfw.text.item + ' #' + next.item ),
 type: that,
 settings: { name: label },
 };
 item = next.item;
 }
 if ( item !== undefined ) { this.editor.item_just_added = item; if ( droppable.classList.contains( 'accept-row' ) ) { next.block = SunFwHelper.getNextIndex( blocks );
 label = sunfw.text.block + ' #' + next.block;
 blocks[ next.block ] = {
 id: 'block_' + SunFwHelper.toId( label ),
 settings: { name: label },
 items: [ item ],
 }; next.column = SunFwHelper.getNextIndex( columns );
 label = sunfw.text.column + ' #' + next.column;
 columns[ next.column ] = {
 id: 'column_' + SunFwHelper.toId( label ),
 width: this.editor.props.grid,
 settings: { name: label },
 blocks: [ next.block ],
 }; next.row = SunFwHelper.getNextIndex( rows );
 label = sunfw.text.row + ' #' + next.row;
 rows[ next.row ] = {
 id: 'row_' + SunFwHelper.toId( label ),
 settings: { name: label },
 columns: [ next.column ],
 }; root.rows.splice( target, 0, next.row );
 } else if ( droppable.classList.contains( 'accept-column' ) ) { next.block = SunFwHelper.getNextIndex( blocks );
 label = sunfw.text.block + ' #' + next.block;
 blocks[ next.block ] = {
 id: 'block_' + SunFwHelper.toId( label ),
 settings: { name: label },
 items: [ item ],
 }; next.column = SunFwHelper.getNextIndex( columns );
 label = sunfw.text.column + ' #' + next.column;
 columns[ next.column ] = {
 id: 'column_' + SunFwHelper.toId( label ),
 settings: { name: label },
 blocks: [ next.block ],
 }; rows[ root.rows[ this.props.index ] ].columns.splice( target, 0, next.column ); columns = this.editor.calcColumnWidth( columns, rows[ root.rows[ this.props.index ] ].columns );
 } else if ( droppable.classList.contains( 'accept-block' ) ) { next.block = SunFwHelper.getNextIndex( blocks );
 label = sunfw.text.block + ' #' + next.block;
 blocks[ next.block ] = {
 id: 'block_' + SunFwHelper.toId( label ),
 settings: { name: label },
 items: [ item ],
 }; row = rows[ root.rows[ this.parent.props.index ] ];
 columns[ row.columns[ this.props.index ] ].blocks.splice( target, 0, next.block );
 } else { row = rows[ root.rows[ this.parent.parent.props.index ] ];
 column = columns[ row.columns[ this.parent.props.index ] ];
 blocks[ column.blocks[ this.props.index ] ].items.splice( target, 0, item );
 }
 } this.editor.setData( data ); this.forceUpdate();
 }
};
window.MenuBuilderMixinItem = {
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
 handleEditItem: function( event ) {
 event.stopPropagation();
 this.editor.selectItem( this.props.id );
 },
 handleCloneItem: function() { var data = this.editor.getData(),
 root = data.megamenu[ this.editor.current.root ],
 rows = data.rows,
 columns = data.columns,
 blocks = data.blocks,
 items = data.items,
 row, column, block, item, nested_ids, next, cloneChildren = function( type, children ) {
 var ids = [];
 for ( var i = 0, n = children.length; i < n; i++ ) {
 switch ( type ) {
 case 'column': nested_ids = cloneChildren( 'block', columns[ children[ i ] ].blocks ); item = JSON.parse( JSON.stringify( columns[ children[ i ] ] ) );
 item.blocks = nested_ids;
 item.settings.name = item.settings.name + sunfw.text['clone-label'];
 if ( item.settings.name ) {
 item.id = 'column_' + SunFwHelper.toId( item.settings.name, true );
 } else {
 item.id = 'column_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
 } next = SunFwHelper.getNextIndex( columns );
 columns[ next ] = item; ids.push( next );
 break;
 case 'block': nested_ids = cloneChildren( 'item', blocks[ children[ i ] ].items ); item = JSON.parse( JSON.stringify( blocks[ children[ i ] ] ) );
 item.items = nested_ids;
 item.settings.name = item.settings.name + sunfw.text['clone-label'];
 if ( item.settings.name ) {
 item.id = 'block_' + SunFwHelper.toId( item.settings.name, true );
 } else {
 item.id = 'block_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
 } next = SunFwHelper.getNextIndex( blocks );
 blocks[ next ] = item; ids.push( next );
 break;
 case 'item':
 item = JSON.parse( JSON.stringify( items[ children[ i ] ] ) );
 item.id = 'item_' + SunFwHelper.toId( item.settings.name, true );
 item.settings.name = item.settings.name + sunfw.text['clone-label']; next = SunFwHelper.getNextIndex( items );
 items[ next ] = item; ids.push( next );
 break;
 }
 }
 return ids;
 }.bind( this ); switch ( this.props.type ) {
 case 'row': nested_ids = cloneChildren( 'column', rows[ root.rows[ this.props.index ] ].columns );
 if ( nested_ids.length ) { item = JSON.parse( JSON.stringify( rows[ root.rows[ this.props.index ] ] ) );
 item.columns = nested_ids;
 item.settings.name = item.settings.name + sunfw.text['clone-label'];
 if ( item.settings.name ) {
 item.id = 'row_' + SunFwHelper.toId( item.settings.name, true );
 } else {
 item.id = 'row_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
 } next = SunFwHelper.getNextIndex( rows );
 rows[ next ] = item; root.rows.splice( this.props.index + 1, 0, next );
 }
 break;
 case 'column': row = rows[ root.rows[ this.parent.props.index ] ]; nested_ids = cloneChildren( 'block', columns[ row.columns[ this.props.index ] ].blocks );
 if ( nested_ids.length ) { item = JSON.parse( JSON.stringify( columns[ row.columns[ this.props.index ] ] ) );
 item.blocks = nested_ids;
 item.settings.name = item.settings.name + sunfw.text['clone-label'];
 if ( item.settings.name ) {
 item.id = 'column_' + SunFwHelper.toId( item.settings.name, true );
 } else {
 item.id = 'column_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
 } next = SunFwHelper.getNextIndex( columns );
 columns[ next ] = item; row.columns.splice( this.props.index + 1, 0, next ); columns = this.editor.calcColumnWidth( columns, row.columns );
 }
 break;
 case 'block': row = rows[ root.rows[ this.parent.parent.props.index ] ];
 column = columns[ row.columns[ this.parent.props.index ] ]; nested_ids = cloneChildren( 'item', blocks[ column.blocks[ this.props.index ] ].items ); item = JSON.parse( JSON.stringify( blocks[ column.blocks[ this.props.index ] ] ) );
 item.items = nested_ids;
 item.settings.name = item.settings.name + sunfw.text['clone-label'];
 if ( item.settings.name ) {
 item.id = 'block_' + SunFwHelper.toId( item.settings.name, true );
 } else {
 item.id = 'block_' + Math.round( parseInt( ( new Date() ).getTime() ) * Math.random() );
 } next = SunFwHelper.getNextIndex( blocks );
 blocks[ next ] = item; column.blocks.splice( this.props.index + 1, 0, next );
 break;
 default: row = rows[ root.rows[ this.parent.parent.parent.props.index ] ];
 column = columns[ row.columns[ this.parent.parent.props.index ] ];
 block = blocks[ column.blocks[ this.parent.props.index ] ]; item = JSON.parse( JSON.stringify( items[ block.items[ this.props.index ] ] ) );
 item.id = 'item_' + SunFwHelper.toId( item.settings.name, true );
 item.settings.name = item.settings.name + sunfw.text['clone-label']; next = SunFwHelper.getNextIndex( items );
 items[ next ] = item; block.items.splice( this.props.index + 1, 0, next );
 break;
 } this.editor.setData( data ); this.parent.forceUpdate();
 },
 handleToggleItem: function() { var data = this.editor.getData(),
 root = data.megamenu[ this.editor.current.root ],
 rows = data.rows,
 columns = data.columns,
 blocks = data.blocks,
 items = data.items,
 row, column, block, settings; switch ( this.props.type ) {
 case 'row':
 settings = rows[ root.rows[ this.props.index ] ].settings;
 break;
 case 'column': row = rows[ root.rows[ this.parent.props.index ] ];
 settings = columns[ row.columns[ this.props.index ] ].settings;
 break;
 case 'block': row = rows[ root.rows[ this.parent.parent.props.index ] ];
 column = columns[ row.columns[ this.parent.props.index ] ];
 settings = blocks[ column.blocks[ this.props.index ] ].settings;
 break;
 default: row = rows[ root.rows[ this.parent.parent.parent.props.index ] ];
 column = columns[ row.columns[ this.parent.parent.props.index ] ];
 block = blocks[ column.blocks[ this.parent.props.index ] ];
 settings = items[ block.items[ this.props.index ] ].settings;
 break;
 } if ( ! settings || settings instanceof Array ) {
 settings = {};
 }
 settings.disabled = ! settings.disabled; this.editor.setData( data ); this.forceUpdate();
 },
 handleDeleteItem: function() { var data = this.editor.getData(),
 root = data.megamenu[ this.editor.current.root ],
 rows = data.rows,
 columns = data.columns,
 blocks = data.blocks,
 items = data.items,
 row, column, block; if ( this.editor.current.editing == this.props.id ) {
 this.editor.selectItem();
 } function deleteChildren( parent, type, children ) {
 for ( var i = 0, n = children.length; i < n; i++ ) {
 switch ( type ) {
 case 'column': deleteChildren( parent.editor.refs[ 'column_' + children[ i ] ], 'block', columns[ children[ i ] ].blocks ); delete parent.editor.refs[ 'column_' + children[ i ] ];
 delete columns[ children[ i ] ];
 break;
 case 'block': deleteChildren( parent.editor.refs[ 'block_' + children[ i ] ], 'item', blocks[ children[ i ] ].items ); delete parent.editor.refs[ 'block_' + children[ i ] ];
 delete blocks[ children[ i ] ];
 break;
 case 'item':
 delete parent.editor.refs[ 'item_' + children[ i ] ];
 delete items[ children[ i ] ];
 break;
 }
 }
 } switch ( this.props.type ) {
 case 'row': deleteChildren( this, 'column', rows[ root.rows[ this.props.index ] ].columns ); delete this.editor.refs[ this.props.id ];
 delete rows[ root.rows[ this.props.index ] ]; data.megamenu[ this.editor.current.root ].rows.splice( this.props.index, 1 );
 break;
 case 'column': row = rows[ root.rows[ this.parent.props.index ] ]; if ( row.columns.length == 1 ) {
 return this.parent.deleteItem();
 } deleteChildren( this, 'block', columns[ row.columns[ this.props.index ] ].blocks ); delete this.editor.refs[ this.props.id ];
 delete columns[ row.columns[ this.props.index ] ]; row.columns.splice( this.props.index, 1 ); columns = this.editor.calcColumnWidth( columns, row.columns );
 break;
 case 'block': row = rows[ root.rows[ this.parent.parent.props.index ] ];
 column = columns[ row.columns[ this.parent.props.index ] ]; if ( column.blocks.length == 1 ) {
 return this.parent.deleteItem();
 } deleteChildren( this, 'item', blocks[ column.blocks[ this.props.index ] ].items ); delete this.editor.refs[ this.props.id ];
 delete blocks[ column.blocks[ this.props.index ] ]; column.blocks.splice( this.props.index, 1 );
 break;
 default: row = rows[ root.rows[ this.parent.parent.parent.props.index ] ];
 column = columns[ row.columns[ this.parent.parent.props.index ] ];
 block = blocks[ column.blocks[ this.parent.props.index ] ]; if ( block.items.length == 1 ) {
 return this.parent.deleteItem();
 } delete this.editor.refs[ this.props.id ];
 delete items[ block.items[ this.props.index ] ]; block.items.splice( this.props.index, 1 );
 break;
 } this.editor.setData( data ); this.parent.forceUpdate();
 }
};
window.MenuBuilderActions = React.createClass( {
 mixins: [ SunFwMixinBase ],
 render: function() {
 return (
 <button
 ref="save"
 type="button"
 onClick={ this.editor.save }
 disabled={ !this.editor.state.changed }
 className="btn btn-success text-uppercase"
 >
 <i className="icon-apply icon-white margin-right-5"></i>
 { sunfw.text[ 'save-megamenu' ] }
 </button>
 );
 }
} );
window.MenuBuilder = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinEditor ],
 getDefaultProps: function() {
 return {
 id: '',
 grid: 12,
 menus: {},
 items: {},
 editable: {},
 style_id: '',
 settings: {
 'class': 'container-settings',
 title: sunfw.text['container-settings'],
 rows: [
 {
 'class': 'separator-after',
 cols: [
 {
 'class': 'col-xs-12',
 settings: {
 full: {
 type: 'checkbox',
 value: 1,
 label: 'fixed-width'
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 width: {
 type: 'text',
 label: 'submenu-width',
 suffix: 'px',
 'default': 600
 }
 },
 requires: {
 'full': 1
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 align: {
 type: 'select',
 label: 'submenu-align',
 options: [
 {
 label: 'left',
 value: 'left'
 },
 {
 label: 'center',
 value: 'center'
 },
 {
 label: 'right',
 value: 'right'
 }
 ]
 }
 },
 requires: {
 'full': 1
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
 backgroundColor: {
 type: 'color-picker',
 label: 'background-color',
 format: 'rgb'
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 backgroundImage: {
 type: 'choose-image',
 label: 'background-image'
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 backgroundImageSettings: {
 type: 'background-image-settings',
 label: 'background-image-settings'
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 border: {
 type: 'border-settings',
 label: 'border'
 }
 }
 }
 ]
 }
 ]
 }
 };
 },
 getInitialState: function() {
 this.current = {
 lang: '*',
 menu: '',
 root: '',
 editing: ''
 };
 return {
 changed: false
 }
 },
 getDefaultData: function() {
 return {
 rows: {},
 columns: {},
 blocks: {},
 items: {},
 megamenu: {}
 };
 },
 handleComponentWillMount: function( state ) { var token = document.querySelector( '#jsn-tpl-token' ).value,
 styleID = document.querySelector( '#jsn-style-id' ).value,
 templateName = document.querySelector( '#jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=navigation&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=get'; SunFwHelper.requestUrl(
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
 if ( response.type == 'success' ) { var data = response.data;
 if ( JSON.stringify( data ).length > 2 ) { var prepared_data = {};
 for ( var p in data ) {
 if ( p == 'rows' || p == 'columns' || p == 'blocks' || p == 'items' ) {
 if ( data[ p ] instanceof Array ) {
 prepared_data[ p ] = {};
 for ( var i = 0; i < data[ p ].length; i++ ) {
 prepared_data[ p ][ i ] = data[ p ][ i ];
 }
 continue;
 }
 }
 prepared_data[ p ] = data[ p ];
 } delete prepared_data.changed; for ( var p in this.current ) {
 if ( data.hasOwnProperty( p ) ) {
 this.current[ p ] = data[ p ];
 delete data[ p ];
 }
 }
 data = prepared_data;
 } this.setData( data, true ); this.forceUpdate(); this.selectItem( this.current.editing );
 } else {
 bootbox.alert( ( response && response.data ) ? response.data : req.responseText );
 }
 }.bind( this )
 ); jQuery('#sunfw-admin-tab a[href="#navigation"]').on( 'shown.bs.tab', function() {
 setTimeout( this.equalizeHeight, 5 );
 }.bind( this ) );
 return state;
 },
 render: function() {
 if ( this.data === undefined ) {
 return (
 <SunFwLoading />
 );
 }
 return (
 <div
 id={ this.props.id }
 key={ this.props.id }
 ref="wrapper"
 className="menu-builder"
 onDragOver={ this.dragOver }
 >
 <div className="jsn-pageheader container-fluid padding-top-10 padding-bottom-10">
 <div className="row">
 <div className="col-xs-1">
 <h3 className="margin-0 line-height-30">
 { sunfw.text['megamenu'] }
 </h3>
 </div>
 <div className="col-xs-4">
 <MenuBuilderSelector
 key={ this.props.id + '_selector' }
 ref="selector"
 parent={ this }
 editor={ this }
 />
 </div>
 <div className="col-xs-3 text-center">
 <SunFwActivity
 key={ this.props.id + '_activity' }
 ref="activity"
 parent={ this }
 editor={ this }
 />
 </div>
 <div className="col-xs-4 text-right">
 <MenuBuilderActions
 key={ this.props.id + '_actions' }
 ref="actions"
 parent={ this }
 editor={ this }
 />
 </div>
 </div>
 </div>
 <div className="jsn-main-content sunfw-menu-builder-container">
 <div className="">
 <div className="row">
 <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
 <div className="jsn-menu-content">
 <div className="row list-menu">
 <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
 <MenuBuilderRoots
 key={ this.props.id + '_roots' }
 ref="roots"
 parent={ this }
 editor={ this }
 />
 </div>
 </div>
 </div>
 </div>
 </div>
 <div className="equal-height" id="menu-builder-container">
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
 <div
 className="col-xs-8 workspace-container padding-top-15 padding-bottom-15"
 onClick={ this.selectItem }
 >
 <MenuBuilderWorkspace
 key={ this.props.id + '_workspace' }
 ref="workspace"
 parent={ this }
 editor={ this }
 />
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
 initActions: function() { var tab = document.querySelector( '#sunfw-admin-tab a[href="#navigation"]' ),
 saveAllButton = jQuery( '#sunfw-save-all' );
 if ( this.state.changed === true ) {
 if ( tab.textContent.indexOf( ' *' ) < 0 ) {
 tab.textContent += ' *';
 }
 saveAllButton.removeClass('disabled');
 window.menuBuilderHasChange = true;
 } else {
 tab.textContent = tab.textContent.replace( ' *', '' );
 }
 },
 editSettings: function( name ) {
 var data = this.getData(),
 editing = typeof name == 'string' ? name : '',
 ref = this.refs[ editing ];
 if ( ! ref ) {
 editing = '';
 } else { var type = ref.getItemType(),
 items = data[ type + 's' ],
 itemIndex = ref.props[ type ];
 if ( ! items[ itemIndex ] ) {
 delete this.refs[ editing ];
 editing = '';
 } else {
 if ( ref.props.settings ) { this.refs.settings.setState( {
 ref: ref,
 form: this.getItemForm( ref ),
 values: this.getItemSettings( ref ),
 toolbar: true
 } );
 }
 else if ( ref.props.type && this.props.items[ ref.props.type ] ) { SunFwHelper.loadItemTypeSettings( this, ref.props.type, function() { this.props.items[ ref.props.type ].settings.title = this.props.items[ ref.props.type ].label; this.refs.settings.setState( {
 ref: ref,
 form: this.getItemForm( ref ),
 values: this.getItemSettings( ref ),
 toolbar: true
 } );
 }.bind( this ) );
 }
 else { this.refs.settings.setState( {
 ref: ref,
 form: this.getItemForm( ref ),
 values: {},
 toolbar: true,
 emptyMessage: 'no-settings'
 } );
 }
 }
 }
 if ( editing == '' ) { var form_data = {
 ref: this,
 toolbar: false
 };
 if (
 ! data.megamenu[ this.current.root ]
 ||
 ! data.megamenu[ this.current.root ].rows
 ||
 ! data.megamenu[ this.current.root ].rows.length
 ) {
 form_data.form = {};
 form_data.emptyClass = 'megamenu-is-not-activated';
 form_data.emptyMessage = 'megamenu-is-not-activated';
 } else {
 form_data.form = this.props.settings;
 form_data.values = this.getItemSettings( 'root' );
 } this.refs.settings.setState( form_data );
 } if ( this.current.editing == '' ) {
 this.refs.workspace.refs.wrapper.classList.remove( 'editing' );
 } else if ( this.refs[ this.current.editing ] ) {
 if ( this.refs[ this.current.editing ].refs.wrapper ) {
 this.refs[ this.current.editing ].refs.wrapper.classList.remove( 'editing' );
 }
 } this.current.editing = editing;
 if ( this.current.editing == '' ) {
 this.refs.workspace.refs.wrapper.classList.add( 'editing' );
 } else if ( this.refs[ this.current.editing ] ) {
 if ( this.refs[ this.current.editing ].refs.wrapper ) {
 this.refs[ this.current.editing ].refs.wrapper.classList.add( 'editing' );
 }
 } this.refs.activity.forceUpdate();
 },
 getItemForm: function( ref ) { var form = JSON.parse( JSON.stringify(
 ref.props.settings ? ref.props.settings : this.props.items[ ref.props.type ].settings
 ) ); var pathway = [], parent = ref.parent;
 while ( parent ) {
 if ( parent.props.type && parent.props.type != 'block' && parent.props.settings ) {
 var parent_name = 'item-' + parent.props.type;
 if ( parent.props.type == 'navigation' ) {
 pathway.unshift(
 <li>
 <a onClick={
 parent.parent.selectItem
 }>
 { sunfw.text[ parent_name ] ? sunfw.text[ parent_name ] : parent_name }
 </a>
 </li>
 );
 } else {
 pathway.unshift(
 <li>
 <a onClick={
 this.selectItem.bind( this, parent.props.id )
 }>
 { sunfw.text[ parent_name ] ? sunfw.text[ parent_name ] : parent_name }
 </a>
 </li>
 );
 }
 }
 parent = parent.parent;
 }
 if ( pathway.length ) {
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
 } if ( typeof form.title == 'string' ) {
 form.title = (
 <span className="form-title">
 { sunfw.text[ form.title ] ? sunfw.text[ form.title ] : form.title }
 </span>
 );
 } return form;
 },
 saveSettings: function( settings ) { var data = this.getData(); if ( ! data.megamenu[ this.current.root ] ) {
 data.megamenu[ this.current.root ] = { settings: {} };
 }
 if ( data.megamenu[ this.current.root ].settings instanceof Array ) {
 data.megamenu[ this.current.root ].settings = {};
 } for ( var p in settings ) {
 data.megamenu[ this.current.root ].settings[ p ] = settings[ p ];
 } this.setData( data );
 },
 handleGetItemSettings: function( that ) { var data = this.getData(),
 root = data.megamenu[ this.current.root ];
 if ( that == 'root' ) {
 item = root;
 } else {
 var rows = data.rows,
 columns = data.columns,
 blocks = data.blocks,
 items = data.items,
 row, column, block, item;
 switch ( that.props.type ) {
 case 'row':
 item = rows[ root.rows[ that.props.index ] ];
 break;
 case 'column':
 row = rows[ root.rows[ that.parent.props.index ] ];
 item = columns[ row.columns[ that.props.index ] ];
 break;
 case 'block':
 row = rows[ root.rows[ that.parent.parent.props.index ] ];
 column = columns[ row.columns[ that.parent.props.index ] ];
 item = blocks[ column.blocks[ that.props.index ] ];
 break;
 default:
 row = rows[ root.rows[ that.parent.parent.parent.props.index ] ];
 column = columns[ row.columns[ that.parent.parent.props.index ] ];
 block = blocks[ column.blocks[ that.parent.props.index ] ];
 item = items[ block.items[ that.props.index ] ];
 break;
 }
 } var settings = ( ! item || ! item.settings ) ? {} : item.settings;
 if ( item && item.label && settings.name === undefined ) {
 settings.name = item.label;
 }
 return settings;
 },
 handleSaveItemSettings: function( that, values ) { var data = this.getData(),
 root = data.megamenu[ this.current.root ],
 rows = data.rows,
 columns = data.columns,
 blocks = data.blocks,
 items = data.items,
 row, column, block, item;
 switch ( that.props.type ) {
 case 'row':
 item = rows[ root.rows[ that.props.index ] ];
 break;
 case 'column':
 row = rows[ root.rows[ that.parent.props.index ] ];
 item = columns[ row.columns[ that.props.index ] ];
 break;
 case 'block':
 row = rows[ root.rows[ that.parent.parent.props.index ] ];
 column = columns[ row.columns[ that.parent.props.index ] ];
 item = blocks[ column.blocks[ that.props.index ] ];
 break;
 default:
 row = rows[ root.rows[ that.parent.parent.parent.props.index ] ];
 column = columns[ row.columns[ that.parent.parent.props.index ] ];
 block = blocks[ column.blocks[ that.parent.props.index ] ];
 item = items[ block.items[ that.props.index ] ];
 break;
 } item.settings = values; this.setData( data ); that.forceUpdate();
 },
 calcColumnWidth: function( columnsDataArray, columnsInRow ) { if ( this.props.grid % columnsInRow.length == 0 ) {
 columnsInRow.map( ( columnIndex ) => {
 columnsDataArray[ columnIndex ].width = this.props.grid / columnsInRow.length;
 } );
 } else {
 var newWidth = Math.floor( this.props.grid / columnsInRow.length );
 columnsInRow.map( ( columnIndex ) => {
 columnsDataArray[ columnIndex ].width = newWidth;
 } ); if ( this.props.grid % columnsInRow.length > 0 ) {
 for ( var i = 1, n = this.props.grid % columnsInRow.length; i <= n; i++ ) {
 columnsDataArray[ columnsInRow[ columnsInRow.length - i ] ].width += 1;
 }
 }
 }
 return columnsDataArray;
 },
 handleSave: function( callback ) { var token = document.querySelector( '#jsn-tpl-token' ).value,
 styleID = document.querySelector( '#jsn-style-id' ).value,
 templateName = document.querySelector( '#jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=navigation&action=save&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName; var callback = arguments[ arguments.length - 1 ]; var data = this.getData();
 for ( var p in this.current ) {
 if ( this.current.hasOwnProperty( p ) ) {
 data[ p ] = this.current[ p ];
 }
 } jQuery( '#sunfw-admin-tab span[data-tab="#navigation"]' ).removeClass('sunfwhide');
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
 noty({
 text: window.sunfw.text['save-success'],
 theme: 'relax', layout: 'top',
 type: 'success',
 timeout: 2000,
 animation: {
 open: 'animated fadeIn', close: 'animated fadeOut', }
 });
 }
 } else {
 callback( false );
 bootbox.alert( response.data );
 }
 jQuery( '#sunfw-admin-tab span[data-tab="#navigation"]' ).addClass('sunfwhide');
 window.save_all_is_processing = false;
 window.save_all_step = 5;
 window.menuBuilderHasChange = false;
 }.bind( this ),
 { data: JSON.stringify( data ) }
 );
 }
} );
window.MenuBuilderRoots = React.createClass( {
 mixins: [ SunFwMixinBase ],
 render: function() {
 var data = this.editor.getData(),
 root_data = this.editor.props.menus[ this.editor.current.menu ].items,
 roots = [], ismega, className;
 root_data.map( ( root ) => { if ( this.editor.current.root == '' ) {
 this.editor.current.root = root.id;
 } className = ( root.id == this.editor.current.root ) ? 'active' : '';
 if ( data.megamenu && data.megamenu[ root.id ] && data.megamenu[ root.id ]['rows'] ) {
 if ( data.megamenu[ root.id ]['rows'].length ) {
 className += ' has-mega-menu';
 }
 }
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
 if ( this.editor.current.root == event.target.getAttribute( 'data-value' ) ) {
 return;
 } this.editor.current.root = event.target.getAttribute( 'data-value' ); this.forceUpdate(); this.editor.refs.workspace.forceUpdate(); this.editor.selectItem();
 }
} );
window.MenuBuilderSelector = React.createClass( {
 mixins: [ SunFwMixinBase ],
 render: function() {
 var classNameLanguageSelector = 'item-setting choose-language item-setting pull-left',
 langs = [], langTexts = [], menus = [], menu, className, selected;
 for ( var m in this.editor.props.menus ) {
 menu = this.editor.props.menus[ m ];
 className = ( menu.language == this.editor.current.lang ) ? '' : 'hidden';
 if ( ! menu.items.length ) {
 continue;
 } if ( this.editor.current.menu == '' && className == '' ) {
 this.editor.current.menu = m;
 } selected = ( m == this.editor.current.menu ) ? true : false;
 menus.push(
 <option
 value={ m }
 selected={ selected }
 className={ className }
 >
 { menu.text }
 </option>
 );
 if ( langs.indexOf( menu.language ) < 0 ) {
 var objLang = {
 id: menu.language,
 text: menu.language_text
 };
 if ( menu.language != '*' ) {
 langTexts.push( objLang );
 }
 langs.push( menu.language );
 }
 }
 if ( langs.length == 1 ) {
 if ( langs[0] == '*' ) {
 classNameLanguageSelector += ' sunfwhide';
 }
 }
 langs.map( ( lang, index ) => {
 var languageText = sunfw.text[ 'language-' + lang ] ? sunfw.text[ 'language-' + lang ] : lang;
 langTexts.map( ( item, subIndex ) => {
 if ( item.id == lang ) {
 languageText = item.text;
 return;
 }
 } );
 selected = lang == this.editor.current.lang ? true : false;
 langs[ index ] = (
 <option value={ lang } selected={ selected }>
 { languageText }
 </option>
 );
 } );
 return (
 <div className="pull-left">
 <div className={ classNameLanguageSelector }>
 <select
 ref="language_selector"
 name="language"
 className="form-control"
 onChange={ this.changeLanguage }
 >
 { langs }
 </select>
 </div>
 <div className="item-setting choose-menu item-setting pull-right">
 <select
 ref="menu_selector"
 name="language"
 className="form-control "
 onChange={ this.changeMenu }
 >
 { menus }
 </select>
 </div>
 </div>
 );
 },
 changeLanguage: function( event ) {
 event.preventDefault(); this.editor.current.lang = event.target.options[ event.target.selectedIndex ].value; for ( var m in this.editor.props.menus ) {
 if ( this.editor.props.menus[ m ].language == this.editor.current.lang ) {
 if ( this.editor.props.menus[ m ].items.length ) {
 this.editor.current.menu = m;
 this.editor.current.root = this.editor.props.menus[ m ].items[0].id;
 break;
 }
 }
 }
 this.updateGUI();
 },
 changeMenu: function( event ) {
 event.preventDefault(); this.editor.current.menu = event.target.options[ event.target.selectedIndex ].value; if ( this.editor.props.menus[ this.editor.current.menu ].items.length ) {
 this.editor.current.root = this.editor.props.menus[ this.editor.current.menu ].items[0].id;
 }
 this.updateGUI();
 },
 updateGUI: function() { this.forceUpdate(); this.editor.refs.roots.forceUpdate(); this.editor.refs.workspace.forceUpdate(); this.editor.selectItem();
 }
} );
window.MenuBuilderWorkspace = React.createClass( {
 mixins: [
 SunFwMixinBase,
 MenuBuilderMixinBase,
 SunFwMixinItem,
 SunFwMixinDroppable,
 MenuBuilderMixinDroppable
 ],
 getDefaultProps: function() {
 return {
 settings: {},
 type: 'navigation'
 };
 },
 render: function() {
 var className = 'jsn-panel menu-builder-workspace droppable accept-row accept-column accept-block accept-item',
 data = this.editor.getData(), rows = [], keyName; var data_rows = [];
 if ( data.megamenu[ this.editor.current.root ] && data.megamenu[ this.editor.current.root ].rows ) {
 data_rows = data.megamenu[ this.editor.current.root ].rows;
 }
 data_rows.map( ( rowIndex, index ) => {
 if ( data.rows[ rowIndex ] ) {
 keyName = 'row_' + rowIndex;
 rows.push(
 <MenuBuilderRow
 id={ keyName }
 key={ this.editor.props.id + '_' + keyName }
 ref= { keyName }
 row={ rowIndex }
 index={ index }
 parent={ this }
 editor={ this.editor }
 />
 ); if ( this.editor.row_just_added == rowIndex ) {
 this.editor.selectItem( keyName );
 delete this.editor.row_just_added;
 }
 }
 } );
 if ( ! rows.length ) {
 className += ' empty-menu-workspace';
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
 { rows.length ? rows : sunfw.text['empty-menu-message'] }
 </div>
 );
 }
} );
window.MenuBuilderBlock = React.createClass( {
 mixins: [
 SunFwMixinBase,
 MenuBuilderMixinBase,
 SunFwMixinItem,
 MenuBuilderMixinItem,
 SunFwMixinDraggable,
 SunFwMixinDroppable,
 MenuBuilderMixinDroppable
 ],
 getDefaultProps: function() {
 return {
 id: '',
 type: 'block',
 index: 0,
 block: '',
 settings: {
 'class': 'block-settings',
 title: sunfw.text['block-settings'],
 rows: [
 {
 cols: [
 {
 'class': 'col-xs-6',
 settings: {
 'margin-top': {
 type: 'text',
 label: sunfw.text['margin-top']
 }
 }
 },
 {
 'class': 'col-xs-6',
 settings: {
 'margin-right': {
 type: 'text',
 label: sunfw.text['margin-right']
 }
 }
 }
 ],
 },
 {
 cols: [
 {
 'class': 'col-xs-6',
 settings: {
 'margin-left': {
 type: 'text',
 label: sunfw.text['margin-left']
 }
 }
 },
 {
 'class': 'col-xs-6',
 settings: {
 'margin-bottom': {
 type: 'text',
 label: sunfw.text['margin-bottom']
 }
 }
 }
 ]
 },
 {
 cols: [
 {
 'class': 'col-xs-6',
 settings: {
 'padding-top': {
 type: 'text',
 label: sunfw.text['padding-top']
 }
 }
 },
 {
 'class': 'col-xs-6',
 settings: {
 'padding-right': {
 type: 'text',
 label: sunfw.text['padding-right']
 }
 }
 }
 ]
 },
 {
 cols: [
 {
 'class': 'col-xs-6',
 settings: {
 'padding-left': {
 type: 'text',
 label: sunfw.text['padding-left']
 }
 }
 },
 {
 'class': 'col-xs-6',
 settings: {
 'padding-bottom': {
 type: 'text',
 label: sunfw.text['padding-bottom']
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
 block = data.blocks[ this.props.block ],
 settings = this.editor.getItemSettings( this ),
 className = 'menu-builder-item draggable-item',
 items = [], keyName;
 if ( settings.disabled ) {
 className += ' disabled-item';
 }
 block.items.map( ( itemIndex, index ) => {
 if ( data.items[ itemIndex ] ) {
 keyName = 'item_' + itemIndex;
 items.push(
 <MenuBuilderItem
 id={ keyName }
 key={ this.editor.props.id + '_' + keyName }
 ref= { keyName }
 item={ itemIndex }
 type={ data.items[ itemIndex ].type }
 index={ index }
 parent={ this }
 editor={ this.editor }
 />
 ); if ( this.editor.item_just_added == itemIndex ) {
 this.editor.selectItem( keyName );
 delete this.editor.item_just_added;
 }
 }
 } );
 return (
 <div ref="wrapper" className={ className } data-index={ this.props.index }>
 <div
 className="jsn-panel-body droppable accept-item"
 onDragOver={ this.dragOver }
 onDrop={ this.drop }
 >
 { items }
 </div>
 </div>
 );
 }
} );
window.MenuBuilderColumn = React.createClass( {
 mixins: [
 SunFwMixinBase,
 MenuBuilderMixinBase,
 SunFwMixinItem,
 MenuBuilderMixinItem,
 SunFwMixinDraggable,
 SunFwMixinDroppable,
 MenuBuilderMixinDroppable
 ],
 getDefaultProps: function() {
 return {
 id: '',
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
 'margin': {
 type: 'spacing-settings',
 label: 'margin'
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 'padding': {
 type: 'spacing-settings',
 label: 'padding'
 }
 }
 }
 ]
 },
 {
 'class': "separator-before",
 cols: [
 {
 'class': "col-xs-12",
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
 render: function() { var data = this.editor.getData(),
 column = data.columns[ this.props.column ],
 width = column.width || this.editor.props.grid,
 settings = this.editor.getItemSettings( this ),
 className = 'menu-builder-item draggable-item resizable col-layout col-xs-' + width,
 blocks = [], keyName;
 if ( settings.disabled ) {
 className += ' disabled-item';
 }
 column.blocks.map( ( blockIndex, index ) => {
 keyName = 'block_' + blockIndex;
 if ( data.blocks[ blockIndex ] ) {
 blocks.push(
 <MenuBuilderBlock
 id={ keyName }
 key={ this.editor.props.id + '_' + keyName }
 ref= { keyName }
 index={ index }
 block={ blockIndex }
 parent={ this }
 editor={ this.editor }
 />
 ); if ( this.editor.block_just_added == blockIndex ) {
 this.editor.selectItem( keyName );
 delete this.editor.block_just_added;
 }
 }
 } );
 return (
 <div
 ref="wrapper"
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 onClick={ this.editItem }
 data-index={ this.props.index }
 >
 <div
 className="droppable accept-block accept-item"
 onDragOver={ this.dragOver }
 onDrop={ this.drop }
 >
 { blocks }
 </div>
 <ul className="display-inline list-inline manipulation-actions margin-0 col-action">
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
} );
window.MenuBuilderItem = React.createClass( {
 mixins: [
 SunFwMixinBase,
 SunFwMixinItem,
 MenuBuilderMixinItem,
 SunFwMixinDraggable,
 ],
 getDefaultProps: function() {
 return {
 id: '',
 type: 'item',
 item: '',
 index: 0
 };
 },
 render: function() {
 var data = this.editor.getData(),
 item = data.items[ this.props.item ],
 settings = this.editor.getItemSettings( this ),
 className = 'jsn-item menu-builder-item draggable-item bg-primary ' + this.props.type;
 if ( settings.disabled ) {
 className += ' disabled-item';
 }
 return (
 <div
 ref="wrapper"
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 onClick={ this.editItem }
 data-index={ this.props.index }
 >
 <div className="text-right clearfix">
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
 </div>
 );
 }
} );
window.MenuBuilderRow = React.createClass( {
 mixins: [
 SunFwMixinBase,
 MenuBuilderMixinBase,
 SunFwMixinItem,
 MenuBuilderMixinItem,
 SunFwMixinDraggable,
 SunFwMixinDroppable,
 MenuBuilderMixinDroppable,
 ],
 getDefaultProps: function() {
 return {
 id: '',
 row: '',
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
 'margin': {
 type: 'spacing-settings',
 label: 'margin'
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 'padding': {
 type: 'spacing-settings',
 label: 'padding'
 }
 }
 }
 ],
 },
 {
 "class": "separator-before",
 cols: [
 {
 "class": "col-xs-12",
 "settings": {
 "class": {
 "type": "text",
 "label": "custom-classes"
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
 className = 'jsn-panel menu-builder-item draggable-item row-layout',
 columns = [], keyName;
 if ( settings.disabled ) {
 className += ' disabled-item';
 }
 row.columns.map( ( columnIndex, index ) => {
 if ( data.columns[ columnIndex ] ) {
 keyName = 'column_' + columnIndex;
 columns.push(
 <MenuBuilderColumn
 id={ keyName }
 key={ this.editor.props.id + '_' + keyName }
 ref= { keyName }
 index={ index }
 column={ columnIndex }
 parent={ this }
 editor={ this.editor }
 />
 ); if ( this.editor.column_just_added == columnIndex ) {
 this.editor.selectItem( keyName );
 delete this.editor.column_just_added;
 }
 }
 } );
 return (
 <div ref="wrapper"
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 onClick={ this.editItem }
 data-index={ this.props.index }
 >
 <div
 className="jsn-panel-body droppable clearfix accept-column accept-block accept-item"
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
 }, handleInitActions: function() {
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
 } ).on( 'resizemove', function( event ) { this.editor.resizing || ( this.editor.resizing = true ); this.timeout && clearTimeout( this.timeout );
 this.timeout = setTimeout( function() { var data = this.editor.getData(),
 columns = data.columns,
 parent = event.target.parentNode.parentNode,
 newWidth = ( event.rect.width / parent.offsetWidth ) * 100,
 oldWidth = parseInt( columns[ column ].width ),
 nextWidth, tmpIndex; newWidth = Math.round( newWidth / cellWidth ); nextWidth = (
 oldWidth + parseInt( columns[ row.columns[ index + 1 ] ].width )
 ) - newWidth; if ( newWidth < 1 || nextWidth < 1 ) {
 return;
 } columns[ column ].width = newWidth; columns[ row.columns[ index + 1 ] ].width= nextWidth; this.editor.setData( data ); this.forceUpdate();
 }.bind( this ), 10 );
 }.bind( this ) );
 }
 } );
 }
} );
