
window.StyleEditorMixinItem = {
 initActions: function() {
 if ( this.editor && this.editor.current.group ) {
 if ( this.props['settings-key'] ) {
 this.editor.refs[ this.editor.current.group + '_' + this.props['settings-key'] ] = this;
 } else if ( this.props.type ){
 this.editor.refs[ this.editor.current.group + '_' + this.props.type ] = this;
 }
 }
 if ( this.handleInitActions ) {
 this.handleInitActions();
 }
 },
 handleEditItem: function( event ) {
 event.preventDefault();
 event.stopPropagation();
 this.editor.selectItem( this.props['settings-key'] ? this.props['settings-key'] : this.props.type );
 },
};
window.StyleEditorActions = React.createClass( {
 mixins: [ SunFwMixinBase ],
 render: function() {
 return (
 <div className="style-editor-actions">
 <button
 type="button"
 onClick={ this.select }
 className="btn btn-default margin-right-10"
 >
 <i className="fa fa-columns font-size-14 margin-right-5"></i>
 { sunfw.text['load-style-preset'] }
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
 { sunfw.text[ 'save-style' ] }
 </button>
 <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
 <span className="caret"></span>
 </button>
 <ul className="dropdown-menu pull-right">
 <li>
 <a href="#" onClick={ this.saveAs }>
 { sunfw.text['save-style-preset'] }
 </a>
 </li>
 </ul>
 </div>
 </div>
 );
 },
 select: function( event ) {
 event.preventDefault(); var data = {
 ref: this,
 form: {
 'class': 'load-style-preset',
 rows: [
 {
 cols: [
 {
 'class': 'col-xs-12',
 settings: {
 style: {
 type: 'select-style',
 label: ''
 }
 }
 }
 ]
 }
 ]
 },
 values: { 'style': this.editor.state.appliedStyle }
 }; this.editor.getModal( {
 id: 'load_style_modal',
 title: 'load-style-preset',
 type: 'form',
 content: {
 data: data
 },
 'class': 'fixed'
 } );
 },
 saveAs: function( event ) {
 event.preventDefault(); var data = {
 ref: this,
 form: {
 'class': 'save-style-preset',
 rows: [
 {
 cols: [
 {
 'class': 'col-xs-12',
 settings: {
 'name': {
 type: 'select-style',
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
 }; this.editor.getModal( {
 id: 'load_style_modal',
 title: 'save-style-preset',
 type: 'form',
 content: {
 data: data
 },
 'class': 'fixed'
 } );
 },
 saveSettings: function( settings ) { if ( settings.name && settings.name != '' ) {
 this.editor.save( true, settings.name );
 } else if ( settings.style && settings.style != '' ) { var data = this.editor.props.styles[ settings.style ].data;
 data.appliedStyle = settings.style; this.editor.setData( data ); this.editor.forceUpdate();
 }
 }
} );
window.StyleEditor = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinEditor ],
 getDefaultProps: function() {
 return {
 id: '',
 items: {},
 styles: {},
 editable: {},
 style_id: '',
 groups: {
 general: sunfw.text['general-settings-button'],
 sections: sunfw.text['section-settings-button'],
 module: sunfw.text['module-settings-button'],
 menu: sunfw.text['menu-settings-button']
 }
 };
 },
 getInitialState: function() {
 this.current = {
 group: 'general',
 editing: 'page'
 };
 return {
 changed: false
 };
 },
 getDefaultData: function() {
 return {
 appliedStyle: '',
 general: {},
 sections: {},
 module: {},
 menu: {}
 };
 },
 handleComponentWillMount: function( state ) { var token = document.querySelector( '#jsn-tpl-token' ).value,
 styleID = document.querySelector( '#jsn-style-id' ).value,
 templateName = document.querySelector( '#jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=styles&'
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
 if ( JSON.stringify( data ).length > 2 ) { delete data.changed; for ( var p in this.current ) {
 if ( data.hasOwnProperty( p ) ) {
 this.current[ p ] = data[ p ];
 delete data[ p ];
 }
 }
 if ( data.currentGroup ) {
 this.current.group = data.currentGroup;
 }
 } this.setData( data, true ); this.forceUpdate(); this.selectItem( this.current.editing );
 } else {
 bootbox.alert( response.data );
 }
 }.bind( this )
 ); jQuery('#sunfw-admin-tab a[href="#styles"]').on( 'shown.bs.tab', function() {
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
 className="style-editor"
 >
 <div className="jsn-pageheader container-fluid padding-top-10 padding-bottom-10">
 <div className="row">
 <div className="col-xs-1">
 <h3 className="margin-0 line-height-30">
 { sunfw.text['style-editor'] }
 </h3>
 </div>
 <div className="col-xs-3 col-sm-4 sunfw-style-group">
 <StyleEditorSettings
 key={ this.props.id + '_setting_groups' }
 ref="setting_groups"
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
 <StyleEditorActions
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
 <div className="col-xs-8 padding-top-15 padding-bottom-15 workspace-container">
 <div className="jsn-layout-content">
 <div className="jsn-content-inner">
 <div className="jsn-content-main">
 <StyleEditorWorkspace
 key={ this.props.id + '_workspace' }
 ref="workspace"
 parent={ this }
 editor={ this }
 />
 </div>
 </div>
 </div>
 </div>
 <div className="col-xs-4 parent-sidebar border-left padding-bottom-15 style-settings">
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
 <div ref="include"></div>
 </div>
 );
 },
 initActions: function() { var tab = document.querySelector( '#sunfw-admin-tab a[href="#styles"]' ),
 saveAllButton = jQuery( '#sunfw-save-all' );
 if ( this.state.changed === true ) {
 if ( tab.textContent.indexOf( ' *' ) < 0 ) {
 tab.textContent += ' *';
 }
 saveAllButton.removeClass('disabled');
 window.styleBuilderHasChange = true;
 } else {
 tab.textContent = tab.textContent.replace( ' *', '' );
 }
 },
 handlePreloadAssets: function() { for ( var style in this.props.styles ) {
 if ( ! this.props.styles[ style ].data && this.props.styles[ style ].file ) {
 ( function( s ) {
 SunFwHelper.requestUrl(
 sunfw.base_url + this.props.styles[ s ].file,
 function( req ) { this.props.styles[ s ].data = JSON.parse( req.responseText );
 }.bind( this )
 );
 }.bind( this ) )( style );
 }
 }
 },
 editSettings: function( name ) {
 var editing = typeof name == 'string' ? name : '',
 ref = this.refs[ this.current.group + '_' + editing ];
 if ( ! ref ) {
 for ( var p in this.refs ) {
 if ( p.indexOf(this.current.group + '_') > -1 ) {
 editing = p.replace(this.current.group + '_', '');
 ref = this.refs[ p ];
 break;
 }
 }
 }
 if ( ref ) { if ( ! ref.props.settings && ! this.props.items[ ref.props.type ].settings ) {
 return SunFwHelper.loadItemTypeSettings( this, ref.props.type, function() {
 this.forceUpdate();
 }.bind( this ) );
 }
 ref.props.settings = this.props.items[ ref.props.type ].settings; var title,
 subTitle = ref.props['settings-key']
 ? ref.props['settings-key'].split( '::' ).pop()
 : ref.props.type.split( '::' ).pop();
 switch ( this.current.group ) {
 case 'sections':
 if ( ref.props.type == 'section' ) {
 title = sunfw.text['section-title'].replace(
 '%SECTION%',
 ref.props.section.settings.name || ref.props.section.label
 );
 } else {
 title = sunfw.text['section-title'].replace(
 '%SECTION%',
 ref.parent.props.section.settings.name || ref.parent.props.section.label
 );
 }
 break;
 case 'module':
 if ( ref.props.type == 'module' ) {
 title = SunFwHelper.toCamelCase(
 ref.props['module-style'], true, ' '
 );
 } else {
 title = SunFwHelper.toCamelCase(
 ref.parent.props['module-style'], true, ' '
 );
 }
 break;
 case 'menu':
 if ( ref.props.type == 'main-menu' ) {
 title = sunfw.text['menu-title'].replace(
 '%MENU%',
 ref.props.menu.settings
 ? ref.props.menu.settings.name
 : ref.props.menu.label
 );
 } else {
 title = sunfw.text['menu-title'].replace(
 '%MENU%',
 ref.parent.props.menu.settings
 ? ref.parent.props.menu.settings.name
 : ref.parent.props.menu.label
 );
 }
 break;
 default:
 title = this.props.groups[ this.current.group ];
 break;
 }
 if ( subTitle == 'page' ) {
 subTitle = sunfw.text['outer-page'];
 }
 else if ( subTitle == 'page-inner' ) {
 subTitle = sunfw.text['inner-page'];
 }
 ref.props.settings.title = title + ' > ' + SunFwHelper.toCamelCase( subTitle, true, ' ' ); this.refs.settings.setState( {
 ref: ref,
 form: ref.props.settings,
 values: this.getItemSettings( ref )
 } ); if ( this.refs[ this.current.group + '_' + this.current.editing ] ) {
 if ( this.refs[ this.current.group + '_' + this.current.editing ].refs.wrapper ) {
 this.refs[ this.current.group + '_' + this.current.editing ].refs.wrapper.classList.remove( 'editing' );
 }
 } this.current.editing = editing;
 if ( this.refs[ this.current.group + '_' + this.current.editing ] ) {
 if ( this.refs[ this.current.group + '_' + this.current.editing ].refs.wrapper ) {
 this.refs[ this.current.group + '_' + this.current.editing ].refs.wrapper.classList.add( 'editing' );
 }
 }
 }
 },
 handleGetItemSettings: function( item ) {
 var group, key; if ( arguments.length == 2 ) {
 group = arguments[0];
 key = arguments[1];
 } else {
 group = this.current.group;
 if ( ! item.props['settings-key'] ) {
 item.props['settings-key'] = item.props.type;
 }
 key = item.props['settings-key'];
 } var settings = this.getData()[ group ],
 path = key.split( '::' );
 for ( var i = 0; i < path.length; i++ ) {
 if ( ! settings[ path[ i ] ] ) {
 settings[ path[ i ] ] = {};
 }
 settings = settings[ path[ i ] ];
 } if (JSON.stringify(settings).length == 2) {
 if (typeof item != 'object') {
 item = this.refs[group + '_' + key];
 }
 if ( item && this.props.items[item.props.type] ) { function hasCustom(form) {
 if (form.rows || form.cols) {
 var sub = form.rows || form.cols;
 for (var i = 0, n = sub.length; i < n; i++) {
 if ( hasCustom(sub[i]) ) {
 return true;
 }
 }
 } else if (form.settings && form.settings.custom) {
 return true;
 }
 }
 if ( this.props.items[item.props.type].settings && hasCustom(this.props.items[item.props.type].settings) ) {
 settings.custom = 0;
 }
 }
 }
 if ( settings.hasOwnProperty('custom') ) {
 var type = path.pop(), parent_settings = this.getItemSettings('general', type);
 if ( settings.custom ) {
 for (var p in settings) {
 if ( settings.hasOwnProperty(p) ) {
 parent_settings[p] = settings[p];
 }
 }
 settings = parent_settings;
 } else {
 for (var p in parent_settings) {
 if ( parent_settings.hasOwnProperty(p) ) {
 settings[p] = parent_settings[p];
 }
 }
 }
 }
 return settings;
 },
 getItemSettingsForPreview: function( item ) { var settings = this.getItemSettings.apply( this, arguments ); var colors = this.getItemSettings( 'general', 'color' ); for ( var p in settings ) {
 if ( p.indexOf( 'color' ) > -1 || p.indexOf( 'bg' ) > -1 ) {
 switch ( settings[ p ] ) {
 case 'main' :
 settings[ p ] = colors['main-color'];
 break;
 case 'sub' :
 settings[ p ] = colors['sub-color'];
 break;
 case 'custom' :
 settings[ p ] = '';
 break;
 }
 }
 }
 return settings;
 },
 handleSaveItemSettings: function( that, values ) { if ( ! that.props['settings-key'] ) {
 that.props['settings-key'] = that.props.type;
 } var data = this.getData(),
 path = that.props['settings-key'].split( '::' ),
 keys = '', test;
 if ( ! data[ this.current.group ] || data[ this.current.group ] instanceof Array ) {
 data[ this.current.group ] = {};
 }
 for ( var i = 0; i < path.length; i++ ) {
 keys += '["' + path[ i ] + '"]'; eval( 'test = data[ this.current.group ]' + keys + ';' );
 if ( ! test ) {
 eval( 'data[ this.current.group ]' + keys + ' = {};' );
 }
 } eval( 'data[ this.current.group ]' + keys + ' = values;' ); this.setData( data ); that.forceUpdate();
 },
 handleSave: function( preset, name, callback ) { var token = document.querySelector( '#jsn-tpl-token' ).value,
 styleID = document.querySelector( '#jsn-style-id' ).value,
 templateName = document.querySelector( '#jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=styles&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName;
 if ( preset === true ) {
 server += '&action=saveAs&style_name=' + name;
 } else {
 server += '&action=save';
 } var callback = arguments[ arguments.length - 1 ]; var data = this.getData();
 for ( var p in this.current ) {
 if ( this.current.hasOwnProperty( p ) ) {
 data[ p ] = this.current[ p ];
 }
 } jQuery( '#sunfw-admin-tab span[data-tab="#styles"]' ).removeClass('sunfwhide');
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
 }
 }
 if ( response.type == 'success' ) {
 callback( true );
 if ( window.show_noty ) {
 noty( {
 text: window.sunfw.text['save-success'],
 theme: 'relax', layout: 'top',
 type: 'success',
 timeout: 2000,
 animation: {
 open: 'animated fadeIn', close: 'animated fadeOut', }
 } );
 } if ( preset === true ) {
 this.props.styles[ response.data ] = {
 data: data,
 label: name
 }
 }
 } else {
 callback( false );
 bootbox.alert( response.data );
 }
 jQuery( '#sunfw-admin-tab span[data-tab="#styles"]' ).addClass('sunfwhide');
 window.save_all_is_processing = false;
 window.save_all_step = 3;
 window.styleBuilderHasChange = false;
 }.bind( this ),
 { data: JSON.stringify( data ) }
 );
 },
 changeSectionID: function( oldID, newID ) {
 var data = this.getData();
 if ( ! data.sections ) {
 data.sections = {};
 }
 if ( data.sections[ oldID ] ) {
 data.sections[ newID ] = data.sections[ oldID ];
 delete data.sections[ oldID ];
 this.setData( data );
 }
 },
 changeMenuID: function( oldID, newID ) {
 var data = this.getData();
 if ( ! data.menu ) {
 data.menu = {};
 }
 if ( data.menu[ oldID ] ) {
 data.menu[ newID ] = data.menu[ oldID ];
 delete data.menu[ oldID ];
 this.setData( data );
 }
 }
} );
window.StyleEditorPreview = React.createClass( {
 mixins: [ SunFwMixinBase ],
 getDefaultProps: function() {
 return {
 id: ''
 };
 },
 getInitialState: function() {
 return {
 general: {},
 sections: {},
 module: {},
 menu: {}
 };
 },
 render: function() { var main_color = this.get( 'general::color::main-color', '#E70200' ), sub_color = this.get( 'general::color::sub-color', '#F86201' ), page_color = this.get( 'general::page::outer-background-color', '#fff' ), heading_color = this.get( 'general::heading::headings-color', '#000' ), content_color = this.get( 'general::content::text-color', '#000' ), default_btn_color = this.get( 'general::default-button::btn-default-bg', '#fff' ), primary_btn_color = this.get( 'general::primary-button::btn-primary-bg', '#699AD4' );
 return (
 <div id={ this.props.id } ref="wrapper" className="preview-style">
 <div className="container-fluid">
 <div className="row">
 <div className="col-xs-6 main-color">
 <div className="preview-column" style={ {
 'background-color': main_color
 } }></div>
 </div>
 <div className="col-xs-6 sub-color">
 <div className="preview-column" style={ {
 'background-color': sub_color
 } }></div>
 </div>
 </div>
 <div className="row bg-style" style={ {
 'background-color': page_color
 } }>
 <div className="col-xs-12 heading-color">
 <h3 style={ {
 'color': heading_color
 } }>
 Heading 3
 </h3>
 </div>
 <div className="col-xs-12 content-color">
 <p style={ {
 'color': content_color
 } }>
 Lorem Ipsum is simply dummy text of the printing and typesetting industry.
 </p>
 </div>
 <div className="col-xs-3 default-btn-color">
 <div className="preview-column pull-left" style={ {
 'background-color': default_btn_color
 } }></div>
 </div>
 <div className="col-xs-3 primary-btn-color">
 <div className="preview-column pull-left" style={ {
 'background-color': primary_btn_color
 } }></div>
 </div>
 </div>
 </div>
 </div>
 );
 },
 get: function( keys, defaultVal ) {
 var keys = keys.split( '::' ), value = this.state;
 for ( var i = 0; i < keys.length; i++ ) {
 if ( value[ keys[ i ] ] ) {
 value = value[ keys[ i ] ];
 } else {
 value = defaultVal;
 break;
 }
 }
 return value;
 }
} );
window.StyleEditorSettings = React.createClass( {
 mixins: [ SunFwMixinBase ],
 render: function() {
 var groups = [];
 for ( var group in this.editor.props.groups ) {
 var keyName = 'settings_' + group, className = 'btn btn-default sunfw_popover', icon;
 if ( this.editor.current.group == group ) {
 className += ' active';
 }
 if ( group == 'general') {
 icon = 'icon-doc';
 } else if ( group == 'sections') {
 icon = 'icon-doc-text';
 } else if ( group == 'module') {
 icon = 'icon-th-large-outline';
 } else if ( group == 'menu') {
 icon = 'icon-menu';
 }
 groups.push(
 <button
 id={ keyName }
 key={ this.editor.props.id + '_' + keyName }
 ref={ keyName }
 type="button"
 onClick={ this.changeGroup.bind( this, group ) }
 className={ className }
 role="button"
 data-content={ this.editor.props.groups[ group ] }
 >
 <i className={ 'demo-icon ' + icon }></i>
 { this.editor.props.groups[ group ] }
 </button>
 );
 }
 return (
 <div className="btn-group" role="group">
 { groups }
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
 changeGroup: function( group ) {
 if (this.editor.current.group == group) {
 return;
 } this.editor.current.group = group;
 this.editor.current.editing = ''; this.forceUpdate(); this.editor.refs.workspace.forceUpdate();
 }
} );
window.StyleEditorWorkspace = React.createClass( {
 mixins: [ SunFwMixinBase ],
 render: function() {
 var group = this.editor.current.group,
 keyName = 'settings_' + group,
 ComponentName = window[ 'StyleEditorSettings' + SunFwHelper.toCamelCase( group, true ) ];
 return (
 <ComponentName
 id={ keyName }
 key={ this.editor.props.id + '_' + keyName }
 ref={ keyName }
 parent={ this }
 editor={ this.editor }
 />
 );
 },
 initActions: function() { this.editor.selectItem( this.editor.current.editing );
 }
} );
window.StyleEditorItemButton = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 type: 'button',
 variant: 'default',
 'settings-key': null
 };
 },
 render: function() {
 var
 className = 'display-inline style-editor-item preview-' + this.props.variant + '-button-settings',
 previewContent = '',
 styleButton = {},
 settings = this.editor.getItemSettingsForPreview( this );
 for ( var p in settings ) {
 if ( ! settings[ p ] ) {
 continue;
 }
 switch ( p ) {
 case ('btn-' + this.props.variant + '-padding') :
 for ( var s in settings[ p ] ) {
 styleButton[ 'padding-' + s ] = settings[ p ][ s ];
 }
 break;
 case ('btn-' + this.props.variant + '-bg') :
 styleButton[ 'background' ] = settings[ p ];
 break;
 case ('btn-' + this.props.variant + '-border-all') :
 var universal = ( settings[p].universal && parseInt( settings[p].universal ) ) ? true : false;
 for ( var s in settings[ p ] ) {
 if ( s == 'universal' ) {
 continue;
 }
 if ( settings[p].universal == true && ! s.match( /(top|right|bottom|left)/ ) ) {
 styleButton[ 'border-' + s ] = settings[ p ][ s ];
 }
 else if ( settings[p].universal == false && s.match( /(top|right|bottom|left)/ )) {
 styleButton[ 'border-' + s ] = settings[ p ][ s ];
 }
 }
 break;
 case ('btn-' + this.props.variant + '-radius') :
 for ( var s in settings[ p ] ) {
 styleButton[ 'border-' + s + '-radius' ] = settings[ p ][ s ];
 }
 break;
 case ('btn-' + this.props.variant + '-box-shadow') :
 var objBoxShadow = {'h-shadow': '0','v-shadow': '0',blur: '0',spread: '0', color: '', inset: ''},
 vBoxShadow = '';
 for ( var s in settings[ p ] ) {
 objBoxShadow[ s ] = settings[ p ][ s ];
 }
 for ( var b in objBoxShadow ) {
 if ( ! isNaN( objBoxShadow[ b ] ) && objBoxShadow[ b ] != '' ) {
 vBoxShadow = vBoxShadow.concat( objBoxShadow[ b ] + 'px ' );
 } else {
 if ( typeof objBoxShadow[ b ] == 'function' ) {
 objBoxShadow[ b ] = '';
 }
 vBoxShadow = vBoxShadow.concat( objBoxShadow[ b ] + ' ' );
 }
 }
 styleButton['box-shadow'] = vBoxShadow;
 styleButton['-webkit-box-shadow'] = vBoxShadow;
 break;
 case ('btn-' + this.props.variant + '-color') :
 styleButton['color'] = settings[ p ];
 break;
 case ('btn-' + this.props.variant + '-font-weight') :
 styleButton['font-weight'] = settings[ p ];
 break;
 case ('btn-' + this.props.variant + '-font-style') :
 styleButton['font-style'] = settings[ p ];
 break;
 case ('btn-' + this.props.variant + '-text-transform') :
 styleButton['text-transform'] = settings[ p ];
 break;
 case ('btn-' + this.props.variant + '-base-size') :
 styleButton['font-size'] = settings[ p ];
 break;
 case ('btn-' + this.props.variant + '-letter-spacing') :
 styleButton['letter-spacing'] = settings[ p ];
 break;
 case ('btn-' + this.props.variant + '-text-shadow') :
 var styleTextshadow = '',
 hShadow = settings[ p ]['h-shadow'],
 vShadow = settings[ p ]['v-shadow'],
 blur = settings[ p ].blur,
 color = settings[ p ].color;
 if ( hShadow ) {
 styleTextshadow = styleTextshadow.concat( hShadow + 'px ' );
 } else {
 styleTextshadow = styleTextshadow.concat( '0px ' );
 }
 if ( vShadow ) {
 styleTextshadow = styleTextshadow.concat( vShadow + 'px ' );
 } else {
 styleTextshadow = styleTextshadow.concat( '0px ' );
 }
 if ( blur ) {
 styleTextshadow = styleTextshadow.concat( blur + 'px ' );
 }
 if ( color ) {
 styleTextshadow = styleTextshadow.concat( color );
 }
 styleButton['text-shadow'] = styleTextshadow;
 break;
 }
 }
 previewContent = (
 <button style={ styleButton } className={ 'btn btn-' + this.props.variant }>
 { SunFwHelper.toCamelCase(this.props.variant, true) + ' Button' }
 </button>
 );
 return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 { previewContent }
 </div>
 );
 }
} );
window.StyleEditorItemColor = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 type: 'color',
 'settings-key': null
 };
 },
 render: function() {
 var className = 'style-editor-item preview-color-settings', previewContent = ''; var styleMainColor = {}, styleSubColor = {}, settings = this.editor.getItemSettings( this );
 for ( var p in settings ) {
 if ( ! settings[ p ] ) {
 continue;
 }
 switch ( p ) {
 case 'main-color':
 styleMainColor[ 'background' ] = settings[ p ];
 break;
 case 'sub-color':
 styleSubColor[ 'background' ] = settings[ p ];
 break;
 }
 }
 previewContent = (
 <div>
 <div className="mainColor"><h4>Main Color</h4><span style={ styleMainColor }></span></div>
 <div className="subColor"><h4>Sub Color</h4><span style={ styleSubColor }></span></div>
 </div>
 );
 return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 { previewContent }
 </div>
 );
 },
} );
window.StyleEditorItemContent = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 type: 'content',
 'settings-key': null
 };
 },
 render: function() {
 var
 className = 'style-editor-item preview-content-settings',
 previewContent = '',
 styleContent = {},
 settings = this.editor.getItemSettingsForPreview( this ); for ( var p in settings ) {
 if ( ! settings[ p ] || p == 'content-font-type' ) {
 continue;
 }
 switch ( p ) {
 case 'content-standard-font-family':
 case 'content-google-font-family':
 case 'content-custom-font-file':
 if ( settings['content-font-type'] == 'standard' && p == 'content-standard-font-family' ) {
 styleContent['font-family'] = settings[ p ];
 } else if ( settings['content-font-type'] == 'google' && p == 'content-google-font-family' ) {
 if ( settings[ p ].family ) {
 styleContent['font-family'] = settings[ p ].family.split( ':' )[0]; SunFwHelper.loadStylesheetFile(
 'https://fonts.googleapis.com/css?family=' + settings[ p ].family
 + ( settings[ p ].subset ? '&subset=' + settings[ p ].subset : '' )
 );
 }
 if ( settings[ p ].variant ) {
 if ( settings[ p ].variant.match( /^\d+$/ ) ) {
 styleContent['font-weight'] = parseInt( settings[ p ].variant );
 } else {
 styleContent['font-weight'] = settings[ p ].variant;
 }
 }
 } else if ( settings['content-font-type'] == 'custom' && p == 'content-custom-font-file' ) {
 if ( settings[ p ] ) { var url = sunfw.base_url + '/' + settings[ p ],
 sheet = document.styleSheets[ document.styleSheets.length - 1 ],
 fontFamily = url.match( /\/([^\/\.]+)\.(eot|otf|ttf|woff|woff2)$/ ),
 cssRules = {
 '@font-face':
 'font-family: "' + fontFamily[1] + '"; src: url("' + url + '");',
 };
 for ( var selector in cssRules ) {
 if ( sheet.insertRule && typeof sheet.cssRules != 'undefined'
 && sheet.cssRules != null && typeof sheet.cssRules.length != 'undefined' )
 {
 sheet.insertRule( selector + " {" + cssRules[ selector ] + "}", sheet.cssRules.length );
 } else if (sheet.addRule) {
 sheet.addRule( selector, cssRules[ selector ] );
 }
 }
 styleContent['font-family'] = '"' + fontFamily[1] + '"';
 }
 }
 break;
 case 'color':
 case 'text-color':
 styleContent['color'] = settings[ p ];
 break;
 case 'content-font-family':
 styleContent[ 'font-family' ] = settings[ p ];
 break;
 case 'font-size-base':
 styleContent[ 'font-size' ] = settings[ p ];
 break;
 case 'line-height':
 case 'line-height-base':
 styleContent[ 'line-height' ] = settings[ p ] + 'em';
 break;
 default:
 styleContent[ p ] = settings[ p ];
 break;
 }
 }
 previewContent = (
 <p style={ styleContent }>
 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 Nulla aliquam imperdiet vestibulum.
 Sed nunc lectus, pretium ac libero vitae, porta tempus lectus.
 Phasellus faucibus dolor sit amet volutpat aliquam.
 Maecenas dictum tortor orci, et scelerisque arcu condimentum in.
 Quisque tristique fringilla aliquet.
 Quisque malesuada quam finibus nunc lobortis dictum.
 Quisque dapibus risus neque, vel fringilla nisl feugiat fermentum.
 Fusce ac purus non turpis dignissim efficitur.
 Cras et nibh elementum, tincidunt diam nec, hendrerit risus.
 </p>
 );
 return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 { previewContent }
 </div>
 );
 },
 handleInitActions: function() {
 if ( ! this.refs.wrapper ) {
 return;
 } var settings = this.editor.getItemSettingsForPreview( this );
 if ( settings['content-font-type'] == 'google' && settings['content-google-font-family'] && settings['content-google-font-family']['variant'] ) {
 var elm = this.refs.wrapper.querySelector('p');
 elm.style.fontWeight = settings['content-google-font-family']['variant'].match( /^\d+$/ )
 ? parseInt( settings['content-google-font-family']['variant'] )
 : settings['content-google-font-family']['variant'];
 }
 }
} );
window.StyleEditorItemDropdownMenu = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 type: 'dropdown-menu',
 'settings-key': null
 };
 },
 render: function() {
 var className = 'dropdown-menu style-editor-item preview-dropdown-menu-settings'; var styleMenu = {}, styleItem = {}, styleActive = {}, settings = this.editor.getItemSettingsForPreview( this );
 for ( var p in settings ) {
 if ( ! settings[ p ] ) {
 continue;
 }
 switch ( p ) {
 case 'link-color-hover':
 styleActive['color'] = settings[ p ];
 break;
 case 'background-color-hover':
 styleActive['background'] = settings[ p ];
 break;
 case 'width-dropdown':
 styleMenu['width'] = settings[ p ];
 break;
 default:
 styleItem[ p ] = styleActive[ p ] = settings[ p ];
 break;
 }
 }
 if ( settings['background-color'] ) {
 styleMenu['background'] = styleItem['background'] = styleItem['background-color'];
 }
 return (
 <div className="show-menu">
 <ul
 ref="wrapper"
 style={ styleMenu }
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 <li><a style={ styleItem } href="#">Apps</a></li>
 <li><a style={ styleItem } href="#">Games</a></li>
 <li className="active"><a style={ styleActive } href="#">Movies</a></li>
 <li><a style={ styleItem } href="#">Books</a></li>
 <li><a style={ styleItem } href="#">Newspapers</a></li>
 </ul>
 </div>
 );
 }
} );
window.StyleEditorItemHeading = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 type: 'heading',
 'settings-key': null
 };
 },
 render: function() {
 var
 className = 'style-editor-item preview-heading-settings',
 headings = [],
 previewContent = '',
 styleHeading = {},
 settings = this.editor.getItemSettingsForPreview( this ),
 fontSizeH1 = 32,
 fontSizeH2 = 26,
 fontSizeH3 = 21,
 fontSizeH4 = 15,
 fontSizeH5 = 12,
 fontSizeH6 = 11; for ( var p in settings ) {
 if ( ! settings[ p ] || p == 'headings-font-type' ) {
 continue;
 }
 switch ( p ) {
 case 'headings-standard-font-family':
 case 'headings-google-font-family':
 case 'headings-custom-font-file':
 if ( settings['headings-font-type'] == 'standard' && p == 'headings-standard-font-family' ) {
 styleHeading['font-family'] = settings[ p ];
 } else if ( settings['headings-font-type'] == 'google' && p == 'headings-google-font-family' ) {
 if ( settings[ p ].family ) {
 styleHeading['font-family'] = settings[ p ].family.split( ':' )[0]; SunFwHelper.loadStylesheetFile(
 'https://fonts.googleapis.com/css?family=' + settings[ p ].family
 + ( settings[ p ].subset ? '&subset=' + settings[ p ].subset : '' )
 );
 }
 if ( settings[ p ].variant ) {
 if ( settings[ p ].variant.match( /^\d+$/ ) ) {
 styleHeading['font-weight'] = parseInt( settings[ p ].variant );
 } else {
 styleHeading['font-weight'] = settings[ p ].variant;
 }
 }
 } else if ( settings['headings-font-type'] == 'custom' && p == 'headings-custom-font-file' ) {
 if ( settings[ p ] ) { var url = sunfw.base_url + '/' + settings[ p ],
 sheet = document.styleSheets[ document.styleSheets.length - 1 ],
 fontFamily = url.match( /\/([^\/\.]+)\.(eot|otf|ttf|woff|woff2)$/ ),
 cssRules = {
 '@font-face':
 'font-family: "' + fontFamily[1] + '"; src: url("' + url + '");',
 };
 for ( var selector in cssRules ) {
 if ( sheet.insertRule && typeof sheet.cssRules != 'undefined'
 && sheet.cssRules != null && typeof sheet.cssRules.length != 'undefined' )
 {
 sheet.insertRule( selector + " {" + cssRules[ selector ] + "}", sheet.cssRules.length );
 } else if (sheet.addRule) {
 sheet.addRule( selector, cssRules[ selector ] );
 }
 }
 styleHeading['font-family'] = '"' + fontFamily[1] + '"';
 }
 }
 break;
 case 'headings-font-weight':
 if ( settings['headings-font-type'] == 'standard' ) {
 styleHeading['font-weight'] = settings[ p ];
 }
 break;
 case 'headings-text-shadow':
 styleHeading['text-shadow']
 = ( settings[ p ]['h-shadow'] ? settings[ p ]['h-shadow'] : 0 ) + 'px '
 + ( settings[ p ]['v-shadow'] ? settings[ p ]['v-shadow'] : 0 ) + 'px '
 + ( settings[ p ].blur ? settings[ p ].blur + 'px ' : '' )
 + ( settings[ p ].color ? settings[ p ].color : '' );
 break;
 case 'headings-base-size':
 styleHeading['font-size'] = fontSizeH5 = settings[ p ];
 fontSizeH1 = Math.ceil( settings[ p ] * 2.6 );
 fontSizeH2 = Math.ceil( settings[ p ] * 2.15 );
 fontSizeH3 = Math.ceil( settings[ p ] * 1.7 );
 fontSizeH4 = Math.ceil( settings[ p ] * 1.25 );
 fontSizeH6 = Math.ceil( settings[ p ] * 0.85 );
 break;
 case 'headings-line-height':
 styleHeading['line-height'] = settings[ p ] + 'em';
 break;
 case 'headings-letter-spacing':
 styleHeading['letter-spacing'] = settings[ p ] + 'px';
 break;
 default:
 styleHeading[ p.replace( 'headings-', '' ) ] = settings[ p ];
 break;
 }
 }
 var
 style1 = this.cloneObject( styleHeading, 2.6 ),
 style2 = this.cloneObject( styleHeading, 2.15 ),
 style3 = this.cloneObject( styleHeading, 1.7 ),
 style4 = this.cloneObject( styleHeading, 1.25 ),
 style6 = this.cloneObject( styleHeading, 0.85 );
 previewContent = (
 <div>
 <h1 style={ style1 }>Heading 1 <span className="pull-right">{ fontSizeH1 } px</span></h1>
 <h2 style={ style2 }>Heading 2 <span className="pull-right">{ fontSizeH2 } px</span></h2>
 <h3 style={ style3 }>Heading 3 <span className="pull-right">{ fontSizeH3 } px</span></h3>
 <h4 style={ style4 }>Heading 4 <span className="pull-right">{ fontSizeH4 } px</span></h4>
 <h5 style={ styleHeading }>Heading 5 <span className="pull-right">{ fontSizeH5 } px</span></h5>
 <h6 style={ style6 }>Heading 6 <span className="pull-right">{ fontSizeH6 } px</span></h6>
 </div>
 );
 return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 { previewContent }
 </div>
 );
 },
 cloneObject: function (obj, fontSize) {
 var self = this;
 if (obj === null || typeof obj !== 'object') {
 return obj;
 } var temp = obj.constructor();
 for (var key in obj) {
 if (key == 'font-size') {
 temp[key] = Math.ceil(self.cloneObject(obj[key]) * fontSize);
 } else {
 temp[key] = self.cloneObject(obj[key]);
 }
 }
 return temp;
 },
 handleInitActions: function() {
 if ( ! this.refs.wrapper ) {
 return;
 } var settings = this.editor.getItemSettingsForPreview( this );
 if ( settings['headings-font-type'] == 'google' && settings['headings-google-font-family'] && settings['headings-google-font-family']['variant'] ) {
 var elms = this.refs.wrapper.querySelectorAll('h1, h2, h3, h4, h5, h6');
 for ( var i = 0, n = elms.length; i < n; i++ ) {
 elms[ i ].style.fontWeight = settings['headings-google-font-family']['variant'].match( /^\d+$/ )
 ? parseInt( settings['headings-google-font-family']['variant'] )
 : settings['headings-google-font-family']['variant'];
 }
 }
 }
} );
window.StyleEditorItemLink = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 type: 'link',
 'settings-key': null
 };
 },
 render: function() {
 var
 className = 'display-inline style-editor-item preview-link-settings',
 previewContent = '',
 styleLinkColor = {},
 settings = this.editor.getItemSettingsForPreview( this ), $linkColor = settings[ 'link-color' ],
 $linkColorHover = settings[ 'link-hover-color' ];
 if ( $linkColor ) {
 styleLinkColor[ 'color' ] = $linkColor;
 }
 previewContent = (
 <a href="#" style={ styleLinkColor }>Link</a>
 );
 return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 { previewContent }
 </div>
 );
 }
} );
window.StyleEditorItemMainMenu = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 id: '',
 type: 'main-menu',
 'settings-key': null
 };
 },
 render: function() {
 var className = 'style-editor-item preview-menu-settings clearfix'; var styleMenu = {}, styleItem = {}, styleActive = {}, settings = this.editor.getItemSettingsForPreview( this );
 for ( var p in settings ) {
 if ( ! settings[ p ] ) {
 continue;
 }
 switch ( p ) {
 case 'link-color-hover':
 styleActive['color'] = settings[ p ];
 break;
 case 'background-color-hover':
 styleActive['background'] = settings[ p ];
 break;
 default:
 styleItem[ p ] = styleActive[ p ] = settings[ p ];
 break;
 }
 }
 if ( settings['background-color'] ) {
 styleMenu['background'] = styleItem['background'] = styleItem['background-color'];
 }
 if ( this.props.menu.settings['menu-show-submenu'] && parseInt( this.props.menu.settings['menu-show-submenu'] ) ) {
 return (
 <div className="menu-with-dropdown">
 <nav
 ref="wrapper"
 style={ styleMenu }
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 <ul className="nav navbar-nav">
 <li><a style={ styleItem } href="#">Apps</a></li>
 <li><a style={ styleItem } href="#">Games</a></li>
 <li className="dropdown open clearfix">
 <a style={ styleActive } href="#">Movies</a>
 <StyleEditorItemDropdownMenu
 key={ this.editor.props.id + '_' + this.props.id + '_dropdown_menu' }
 ref="dropdown_menu"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props.menu.id + '::dropdown' }
 />
 </li>
 <li><a style={ styleItem } href="#">Books</a></li>
 <li><a style={ styleItem } href="#">Newspapers</a></li>
 </ul>
 </nav>
 <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
 </div>
 );
 }
 return (
 <div className="menu-without-dropdown">
 <nav
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 <ul className="display-inline list-inline">
 <li><a style={ styleItem } href="#">Apps</a></li>
 <li><a style={ styleItem } href="#">Games</a></li>
 <li className="active"><a style={ styleActive } href="#">Movies</a></li>
 <li><a style={ styleItem } href="#">Books</a></li>
 <li><a style={ styleItem } href="#">Newspapers</a></li>
 </ul>
 </nav>
 </div>
 );
 }
} );
window.StyleEditorItemModule = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 id: '',
 type: 'module',
 'module-style': '',
 'settings-key': null
 };
 },
 render: function() {
 var className = 'jsn-panel style-editor-item preview-module-settings'; var previewContent = [
 (
 <div className="jsn-panel-heading">
 <StyleEditorItemTitle
 key={ this.editor.props.id + '_' + this.props.id + '_title' }
 ref="title"
 parent={ this }
 editor={ this.editor }
 title={ SunFwHelper.toCamelCase( this.props['module-style'], true, ' ' ) }
 settings-key={ this.props['module-style'] + '::title' }
 />
 </div>
 ),
 (
 <div className="jsn-panel-body">
 <StyleEditorItemContent
 key={ this.editor.props.id + '_' + this.props.id + '_content' }
 ref="content"
 type="module-content"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props['module-style'] + '::content' }
 />
 <StyleEditorItemButton
 key={ this.editor.props.id + '_' + this.props.id + '_default_button' }
 ref="default_button"
 type="module-default-button"
 variant="default"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props['module-style'] + '::default-button' }
 />
 <StyleEditorItemButton
 key={ this.editor.props.id + '_' + this.props.id + '_primary_button' }
 ref="primary_button"
 type="module-primary-button"
 variant="primary"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props['module-style'] + '::primary-button' }
 />
 <StyleEditorItemLink
 key={ this.editor.props.id + '_' + this.props.id + '_link' }
 ref="link"
 type="link"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props['module-style'] + '::link' }
 />
 </div>
 )
 ];
 var
 containerStyle = {},
 inner_style = {},
 settings = this.editor.getItemSettingsForPreview( this );
 for ( var p in settings ) {
 if ( ! settings[ p ] ) {
 continue;
 }
 switch ( p ) {
 case 'background-image-settings':
 if ( settings['background-image'] ) {
 for ( var s in settings[ p ] ) {
 containerStyle[ 'background-' + s ] = settings[ p ][ s ];
 }
 }
 break;
 case 'padding':
 for ( var s in settings[ p ] ) {
 containerStyle[ 'padding-' + s ] = settings[ p ][ s ] + 'px';
 }
 break;
 case 'border':
 var universal = ( settings[p].universal && parseInt( settings[p].universal ) ) ? true : false;
 for ( var s in settings[ p ] ) {
 if ( s == 'universal' ) {
 continue;
 }
 if ( settings[p].universal == true && ! s.match( /(top|right|bottom|left)/ ) ) {
 containerStyle[ 'border-' + s ] = settings[ p ][ s ];
 }
 else if ( settings[p].universal == false && s.match( /(top|right|bottom|left)/ )) {
 containerStyle[ 'border-' + s ] = settings[ p ][ s ];
 }
 }
 break;
 case 'background-image':
 var URLPattern = /^(http|https)/i;
 if ( ! URLPattern.test( settings[ p ] ) ) {
 settings[ p ] = document.getElementById('jsn-tpl-root').value + settings[ p ];
 }
 containerStyle[ 'background-image' ] = 'url(' + settings[ p ] + ')';
 break;
 default:
 containerStyle[ p ] = settings[ p ];
 break;
 }
 }
 if ( settings['background-color'] && ! settings['background-image'] ) {
 containerStyle['background'] = containerStyle['background-color'];
 }
 previewContent = (
 <div className="content-module row" style={ containerStyle }>
 { previewContent }
 </div>
 );
 return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 { previewContent }
 </div>
 );
 }
} );
window.StyleEditorItemPageInner = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 type: 'page-inner',
 'settings-key': null
 };
 },
 render: function() {
 var
 className = 'jsn-panel style-editor-item preview-page-inner-settings',
 inner_style = {},
 settings = this.editor.getItemSettingsForPreview( this ); for ( var p in settings ) {
 if ( ! settings[ p ] ) {
 continue;
 }
 if ( p.indexOf( 'inner-' ) > -1 ) {
 switch ( p ) {
 case 'inner-background-color':
 inner_style[ 'background-color'] = settings[ p ];
 break;
 case 'inner-border':
 var universal = ( settings[p].universal && parseInt( settings[p].universal ) ) ? true : false;
 for ( var s in settings[ p ] ) {
 if ( s == 'universal' ) {
 continue;
 }
 if ( settings[p].universal == true && ! s.match( /(top|right|bottom|left)/ ) ) {
 inner_style[ 'border-' + s ] = settings[ p ][ s ];
 }
 else if ( settings[p].universal == false && s.match( /(top|right|bottom|left)/ )) {
 inner_style[ 'border-' + s ] = settings[ p ][ s ];
 }
 }
 break;
 case 'inner-box-shadow':
 var styleBoxshadow = '';
 var hShadow = settings[ p ]['h-shadow'];
 var vShadow = settings[ p ]['v-shadow'];
 var blur = settings[ p ].blur;
 var spread = settings[ p ].spread;
 var color = settings[ p ].color;
 var inset = settings[ p ].inset;
 if (hShadow) {
 styleBoxshadow = styleBoxshadow.concat(hShadow + 'px ');
 } else {
 styleBoxshadow = styleBoxshadow.concat('0px ');
 }
 if (vShadow) {
 styleBoxshadow = styleBoxshadow.concat(vShadow + 'px ');
 } else {
 styleBoxshadow = styleBoxshadow.concat('0px ');
 }
 if (blur) {
 styleBoxshadow = styleBoxshadow.concat(blur + 'px ');
 }
 if (spread) {
 styleBoxshadow = styleBoxshadow.concat(spread + 'px ');
 }
 if (color) {
 styleBoxshadow = styleBoxshadow.concat(color);
 }
 if (inset) {
 styleBoxshadow = styleBoxshadow.concat(inset);
 }
 inner_style[ 'box-shadow' ] = styleBoxshadow;
 inner_style[ '-webkit-box-shadow' ] = styleBoxshadow;
 break;
 default:
 inner_style[ p.replace( 'inner-', '' ) ] = settings[ p ];
 break;
 }
 }
 }
 if ( settings['inner-background-color'] ) {
 inner_style['background'] = inner_style['background-color'];
 }
 return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 <div className="jsn-panel-body">
 <div className="inner" style={ inner_style }>
 { this.props.children }
 </div>
 </div>
 </div>
 );
 }
} );
window.StyleEditorItemPage = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 type: 'page',
 'settings-key': null
 };
 },
 render: function() {
 var className = 'jsn-panel style-editor-item preview-page-settings'; var outer_style = {}, inner_style = {}, settings = this.editor.getItemSettingsForPreview( this );
 for ( var p in settings ) {
 if ( ! settings[ p ] ) {
 continue;
 }
 if ( p.indexOf( 'outer-' ) > -1 ) {
 switch ( p ) {
 case 'outer-background-image-settings':
 for ( var s in settings[ p ] ) {
 outer_style[ 'background-' + s ] = settings[ p ][ s ];
 }
 break;
 case 'outer-background-image':
 if ( ! settings[ p ].match( /^(http|https)/i ) ) {
 settings[ p ] = document.getElementById('jsn-tpl-root').value + settings[ p ];
 }
 outer_style[ 'background-image' ] = 'url("'+ settings[ p ] +'")';
 break;
 default:
 outer_style[ p.replace( 'outer-', '' ) ] = settings[ p ];
 break;
 }
 }
 }
 if ( settings['outer-background-color'] && ! settings['outer-background-image'] ) {
 outer_style['background'] = outer_style['background-color'];
 } var previewContent = [
 (
 <StyleEditorItemColor
 key={ this.editor.props.id + '_settings_color' }
 ref="settings_color"
 type="general-color"
 parent={ this }
 editor={ this.editor }
 settings-key="color"
 />
 ),
 (
 <StyleEditorItemHeading
 key={ this.editor.props.id + '_settings_heading' }
 ref="settings_heading"
 type="general-heading"
 parent={ this }
 editor={ this.editor }
 settings-key="heading"
 />
 ),
 (
 <StyleEditorItemContent
 key={ this.editor.props.id + '_settings_content' }
 ref="settings_content"
 type="general-content"
 parent={ this }
 editor={ this.editor }
 settings-key="content"
 />
 ),
 (
 <StyleEditorItemButton
 key={ this.editor.props.id + '_settings_default_button' }
 ref="settings_default_button"
 type="default-button"
 variant="default"
 parent={ this }
 editor={ this.editor }
 />
 ),
 (
 <StyleEditorItemButton
 key={ this.editor.props.id + '_settings_primary_button' }
 ref="settings_primary_button"
 type="primary-button"
 variant="primary"
 parent={ this }
 editor={ this.editor }
 />
 ),
 (
 <StyleEditorItemLink
 key={ this.editor.props.id + '_settings_link' }
 ref="settings_link"
 type="link"
 parent={ this }
 editor={ this.editor }
 />
 )
 ]; var layout = window.SunFwLayout ? SunFwLayout.getData() : null;
 if ( layout && layout.settings.enable_boxed_layout && parseInt( layout.settings.enable_boxed_layout ) ) {
 previewContent = (
 <div className="outer row" style={ outer_style }>
 <StyleEditorItemPageInner
 key={ this.editor.props.id + '_settings_inner' }
 ref="settings_inner"
 parent={ this }
 editor={ this.editor }
 >
 { previewContent }
 </StyleEditorItemPageInner>
 </div>
 );
 }
 else {
 previewContent = (
 <div className="outer row" style={ outer_style }>
 { previewContent }
 </div>
 );
 }
 return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 <div className="jsn-panel-body">
 { previewContent }
 </div>
 </div>
 );
 }
} );
window.StyleEditorItemSection = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 id: '',
 type: 'section',
 section: {},
 'settings-key': null
 };
 },
 render: function() {
 var className = 'jsn-panel style-editor-item preview-section-settings'; var previewContent = (
 <div className="jsn-panel-body">
 <StyleEditorItemHeading
 key={ this.editor.props.id + '_' + this.props.id + '_settings_heading' }
 ref="settings_heading"
 type="section-heading"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props.section.id + '::heading' }
 />
 <StyleEditorItemContent
 key={ this.editor.props.id + '_' + this.props.id + '_settings_content' }
 ref="settings_content"
 type="section-content"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props.section.id + '::content' }
 />
 <StyleEditorItemButton
 key={ this.editor.props.id + '_' + this.props.id + '_settings_default_button' }
 ref="settings_default_button"
 type="section-default-button"
 variant="default"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props.section.id + '::default-button' }
 />
 <StyleEditorItemButton
 key={ this.editor.props.id + '_' + this.props.id + '_settings_primary_button' }
 ref="settings_primary_button"
 type="section-primary-button"
 variant="primary"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props.section.id + '::primary-button' }
 />
 <StyleEditorItemLink
 key={ this.editor.props.id + '_' + this.props.id + '_settings_link' }
 ref="settings_link"
 type="section-link"
 parent={ this }
 editor={ this.editor }
 settings-key={ this.props.section.id + '::link' }
 />
 </div>
 );
 var containerStyle = {}, inner_style = {}, settings = this.editor.getItemSettingsForPreview( this );
 for ( var p in settings ) {
 if ( ! settings[ p ] ) {
 continue;
 }
 switch ( p ) {
 case 'background-image-settings':
 if ( settings['background-image'] ) {
 for ( var s in settings[ p ] ) {
 containerStyle[ 'background-' + s ] = settings[ p ][ s ];
 }
 }
 break;
 case 'padding':
 for ( var s in settings[ p ] ) {
 containerStyle[ 'padding-' + s ] = settings[ p ][ s ] + 'px';
 }
 break;
 case 'border':
 var universal = ( settings[p].universal && parseInt( settings[p].universal ) ) ? true : false;
 for ( var s in settings[ p ] ) {
 if ( s == 'universal' ) {
 continue;
 }
 if ( settings[p].universal == true && ! s.match( /(top|right|bottom|left)/ ) ) {
 containerStyle[ 'border-' + s ] = settings[ p ][ s ];
 }
 else if ( settings[p].universal == false && s.match( /(top|right|bottom|left)/ )) {
 containerStyle[ 'border-' + s ] = settings[ p ][ s ];
 }
 }
 break;
 case 'background-image':
 var URLPattern = /^(http|https)/i;
 if ( ! URLPattern.test(settings[ p ]) )
 {
 settings[ p ] = document.getElementById('jsn-tpl-root').value + settings[ p ];
 }
 containerStyle[ 'background-image' ] = 'url(' + settings[ p ] + ')';
 break;
 default:
 containerStyle[ p ] = settings[ p ];
 break;
 }
 }
 if ( settings['background-color'] && ! settings['background-image'] ) {
 containerStyle['background'] = containerStyle['background-color'];
 } return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 <div className="jsn-panel-heading">
 { this.props.section.settings.name }
 </div>
 <div className="content-section row" style={ containerStyle }>
 { previewContent }
 </div>
 </div>
 );
 }
} );
window.StyleEditorItemTitle = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinItem, StyleEditorMixinItem ],
 getDefaultProps: function() {
 return {
 type: 'title',
 'settings-key': null
 };
 },
 render: function() {
 var className = 'style-editor-item preview-title-settings'; var previewContent = '';
 var styleTitle = {}, settings = this.editor.getItemSettingsForPreview( this );
 for ( var p in settings ) {
 if ( ! settings[ p ] ) {
 continue;
 }
 switch ( p ) {
 case 'bg-color':
 styleTitle[ 'background' ] = settings[ p ];
 break;
 case 'text-color':
 styleTitle[ 'color' ] = settings[ p ];
 break;
 default:
 styleTitle[ p ] = settings[ p ];
 break;
 }
 }
 previewContent = (
 <h3 style={ styleTitle }>{ this.props.title ? this.props.title : 'Title' }</h3>
 );
 return (
 <div
 ref="wrapper"
 onClick={ this.editItem }
 className={ className }
 onMouseOver={ this.mouseover }
 onMouseOut={ this.mouseout }
 >
 { previewContent }
 </div>
 );
 }
} );
window.StyleEditorSettingsGeneral = React.createClass( {
 mixins: [ SunFwMixinBase ],
 render: function() {
 var keyName = 'settings_page'; if ( this.editor.current.editing == '' ) {
 this.editor.current.editing = 'page';
 }
 return (
 <StyleEditorItemPage
 key={ this.editor.props.id + '_' + keyName }
 ref={ keyName }
 parent={ this }
 editor={ this.editor }
 />
 );
 }
} );
window.StyleEditorSettingsMenu = React.createClass( {
 mixins: [ SunFwMixinBase ],
 getDefaultProps: function() {
 return {
 group: 'menu',
 }
 },
 render: function() {
 var layout = window.SunFwLayout ? SunFwLayout.getData() : null,
 menus = [], keyName;
 if ( layout && layout.views.main && layout.views.main.sections ) {
 for ( var s = 0; s < layout.views.main.sections.length; s++ ) {
 var section = layout.sections[ layout.views.main.sections[ s ] ];
 if ( ! section ) {
 continue;
 }
 for ( var r = 0; r < section.rows.length; r++ ) {
 var row = layout.rows[ section.rows[ r ] ];
 if ( ! row ) {
 continue;
 }
 for ( var c = 0; c < row.columns.length; c++ ) {
 var column = layout.columns[ row.columns[ c ] ];
 if ( ! column ) {
 continue;
 }
 for ( var i = 0; i < column.items.length; i++ ) {
 var item = layout.items[ column.items[ i ] ];
 if ( ! item ) {
 continue;
 }
 if ( item.type == 'menu' ) {
 keyName = 'settings_' + item.id; if ( this.editor.current.editing == '' ) {
 this.editor.current.editing = item.id + '::root';
 } var style = {},
 settings = this.editor.handleGetItemSettings( 'sections', section.id + '::container' );
 if ( settings.border ) {
 style['border'] = settings.border.width + 'px ' + settings.border.style + ' ' + settings.border.color;
 }
 if ( settings['background-color'] ) {
 style['background-color'] = settings['background-color'];
 }
 menus.push(
 <div className="jsn-panel" style={ style }>
 <div className="jsn-panel-body">
 <StyleEditorItemMainMenu
 id={ keyName }
 key={ this.editor.props.id + '_' + keyName }
 ref={ keyName }
 group={ this.editor.current.group }
 parent={ this }
 editor={ this.editor }
 menu={ item }
 settings-key={ item.id + '::root' }
 />
 </div>
 </div>
 );
 }
 }
 }
 }
 }
 }
 return (
 <div
 ref="wrapper"
 className={ menus.length ? '' : 'no-section-found'}
 >
 { menus.length ? menus : sunfw.text['no-menu-found'] }
 </div>
 );
 },
 handleClick: function(event) {
 if ( event.target.nodeName == 'A' ) {
 event.target.blur();
 }
 },
 initActions: function() {
 if ( this.refs.wrapper && ! this.refs.wrapper._listened_click_event ) {
 this.refs.wrapper.addEventListener('click', this.handleClick);
 this.refs.wrapper._listened_click_event = true;
 }
 },
 handleComponentWillUnmount: function() {
 if ( this.refs.wrapper._listened_click_event ) {
 delete this.refs.wrapper._listened_click_event;
 this.refs.wrapper.removeEventListener('click', this.handleClick);
 }
 }
} );
window.StyleEditorSettingsModule = React.createClass( {
 mixins: [ SunFwMixinBase ],
 getDefaultProps: function() {
 return {
 group: 'module',
 }
 },
 getInitialState: function() {
 return {
 styles: []
 };
 },
 handleComponentWillMount: function( state ) {
 if ( ! this.editor.props.items.module.styles ) { var token = document.querySelector( '#jsn-tpl-token' ).value,
 styleID = document.querySelector( '#jsn-style-id' ).value,
 templateName = document.querySelector( '#jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=styles&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=getModuleStyles'; SunFwHelper.requestUrl(
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
 if ( response.type == 'success' ) { this.editor.props.items.module.styles = response.data;
 this.editor.forceUpdate();
 } else {
 bootbox.alert( response.data );
 }
 }.bind( this )
 );
 }
 return state;
 },
 render: function() {
 var modules = [], keyName;
 if ( this.editor.props.items.module.styles ) {
 this.editor.props.items.module.styles.map( ( style ) => {
 keyName = 'settings_' + style; if ( this.editor.current.editing == '' ) {
 this.editor.current.editing = style + '::container';
 }
 modules.push(
 <div className="col-xs-6" style={ { 'margin-bottom': '15px' } }>
 <StyleEditorItemModule
 id={ keyName }
 key={ this.editor.props.id + '_' + keyName }
 ref={ keyName }
 group={ this.editor.current.group }
 parent={ this }
 editor={ this.editor }
 module-style={ style }
 settings-key={ style + '::container' }
 />
 </div>
 );
 } );
 }
 return (
 <div ref="wrapper" className="row" style={ { 'margin-bottom': '-15px' } }>
 { modules }
 </div>
 );
 }
} );
window.StyleEditorSettingsSections = React.createClass( {
 mixins: [ SunFwMixinBase ],
 getDefaultProps: function() {
 return {
 group: 'sections',
 }
 },
 render: function() {
 var layout = window.SunFwLayout ? SunFwLayout.getData() : null,
 sections = [], keyName;
 if ( layout && layout.views.main && layout.views.main.sections ) {
 for ( var s = 0; s < layout.views.main.sections.length; s++ ) {
 var section = layout.sections[ layout.views.main.sections[ s ] ];
 if ( ! section ) {
 continue;
 }
 keyName = 'settings_' + section.id; if ( this.editor.current.editing == '' ) {
 this.editor.current.editing = section.id + '::container';
 }
 sections.push(
 <StyleEditorItemSection
 id={ keyName }
 key={ this.editor.props.id + '_' + keyName }
 ref={ keyName }
 group={ this.editor.current.group }
 parent={ this }
 editor={ this.editor }
 section={ section }
 settings-key={ section.id + '::container' }
 />
 );
 }
 }
 return (
 <div
 ref="wrapper"
 className={ sections.length ? '' : 'no-section-found'}
 >
 { sections.length ? sections : sunfw.text['no-section-found'] }
 </div>
 );
 }
} );
