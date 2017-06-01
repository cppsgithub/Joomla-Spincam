
window.CookieLawActions = React.createClass( {
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
 { sunfw.text[ 'save-cookie-law' ] }
 </button>
 );
 }
} );
window.CookieLaw = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinEditor ],
 getDefaultProps: function() {
 return {
 id: '',
 editable: {},
 style_id: ''
 };
 },
 getInitialState: function() {
 return {
 changed: false
 }
 },
 getDefaultData: function() {
 return {
 style: '',
 message: 'This website uses cookies to ensure you get the best experience on our website.',
 'banner-placement': '',
 'cookie-policy-link': 'http://',
 'accept-button-text': 'Got It!',
 'read-more-button-text': 'More information'
 };
 },
 handleComponentWillMount: function( state ) { var token = document.querySelector( '#jsn-tpl-token' ).value,
 styleID = document.querySelector( '#jsn-style-id' ).value,
 templateName = document.querySelector( '#jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=cookielaw&'
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
 if ( response.type == 'success' ) { delete response.data.changed; this.setData( response.data, true ); this.refs.workspace.forceUpdate(); this.refs.settings.setState( {
 ref: this,
 form: this.refs.workspace.props.settings,
 values: this.getData()
 } );
 } else {
 bootbox.alert( response.data );
 }
 }.bind( this )
 ); jQuery('#sunfw-admin-tab a[href="#cookie-law"]').on( 'shown.bs.tab', function() {
 setTimeout( this.equalizeHeight, 5 );
 }.bind( this ) );
 return state;
 },
 render: function() {
 return (
 <div
 id={ this.props.id }
 key={ this.props.id }
 ref="wrapper"
 className="cookie-law"
 >
 <div className="jsn-pageheader container-fluid padding-top-10 padding-bottom-10">
 <div className="row">
 <div className="col-xs-4">
 <h3 className="margin-0 line-height-30">
 { sunfw.text['cookie-law'] }
 </h3>
 </div>
 <div className="col-xs-4"></div>
 <div className="col-xs-4 text-right">
 <CookieLawActions
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
 <CookieLawWorkspace
 key={ this.props.id + '_workspace' }
 ref="workspace"
 parent={ this }
 editor={ this }
 />
 </div>
 <div className="col-xs-4 parent-sidebar border-left padding-bottom-15 cookie-law-settings">
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
 initActions: function() { var tab = document.querySelector( '#sunfw-admin-tab a[href="#cookie-law"]' ),
 saveAllButton = jQuery( '#sunfw-save-all' );
 if ( this.state.changed === true ) {
 if ( tab.textContent.indexOf( ' *' ) < 0 ) {
 tab.textContent += ' *';
 }
 saveAllButton.removeClass('disabled');
 window.cookieLawHasChange = true;
 } else {
 tab.textContent = tab.textContent.replace( ' *', '' );
 }
 },
 saveSettings: function( settings ) { var data = this.getData();
 for ( var p in settings ) {
 data[ p ] = settings[ p ];
 } this.setData( data ); this.state.changed = true; this.refs.actions.forceUpdate(); this.refs.workspace.forceUpdate();
 },
 handleSave: function( callback ) { var token = document.querySelector( '#jsn-tpl-token' ).value,
 styleID = document.querySelector( '#jsn-style-id' ).value,
 templateName = document.querySelector( '#jsn-tpl-name' ).value; var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=cookielaw&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=save'; var callback = arguments[ arguments.length - 1 ]; var data = JSON.stringify( this.getData() ); SunFwHelper.requestUrl(
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
 theme: 'relax', layout: 'top',
 type: 'success',
 timeout: 2000,
 animation: {
 open: 'animated fadeIn', close: 'animated fadeOut', }
 } );
 }
 } else {
 callback( false );
 bootbox.alert( response.data );
 }
 window.save_all_is_processing = false;
 window.save_all_step = 4;
 window.cookieLawHasChange = false;
 },
 { data: data }
 );
 }
} );
window.CookieLawWorkspace = React.createClass( {
 mixins: [ SunFwMixinBase ],
 getDefaultProps: function() {
 return {
 settings: {
 'class': 'cookie-law-setting',
 title: 'cookie-law-settings',
 rows: [
 {
 cols: [
 {
 'class': 'col-xs-12',
 settings: {
 enabled: {
 type: 'checkbox',
 value: 1,
 label: 'enable-cookie-consent',
 },
 },
 }
 ]
 },
 {
 cols: [
 {
 'class': 'col-xs-12',
 settings: {
 style: {
 label: 'style',
 type: 'select',
 options: [
 {
 label: 'light',
 value: 'light'
 },
 {
 label: 'dark',
 value: 'dark'
 },
 ]
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 'banner-placement': {
 label: 'banner-placement',
 type: 'select',
 options: [
 {
 label: 'top',
 value: 'top'
 },
 {
 label: 'bottom',
 value: 'bottom'
 },
 {
 label: 'floating-right',
 value: 'floating'
 },
 {
 label: 'floating-left',
 value: 'floating-left'
 },
 ]
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 message_type: {
 label: 'message',
 type: 'select',
 'default': 'text',
 options: [
 {
 label: 'text',
 value: 'text'
 },
 {
 label: 'article',
 value: 'article'
 },
 ]
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 message: {
 label: '',
 type: 'textarea',
 rows: 5,
 'default': 'This website uses cookies to ensure you get the best experience on our website.'
 }
 },
 requires: {
 message_type: 'text'
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 article: {
 label: '',
 type: 'article-picker'
 }
 },
 requires: {
 message_type: 'article'
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 'accept-button-text': {
 label: 'accept-button-text',
 type: 'text',
 'default': 'Got It!'
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 'read-more-button-text': {
 label: 'read-more-button-text',
 type: 'text',
 'default': 'More information'
 }
 }
 },
 {
 'class': 'col-xs-12',
 settings: {
 'cookie-policy-link': {
 label: 'cookie-policy-link',
 type: 'text',
 placeholder: 'http://'
 }
 },
 requires: {
 message_type: 'text'
 }
 }
 ],
 requires: {
 enabled: 1
 }
 }
 ]
 }
 }
 },
 render: function() {
 var data = this.editor.getData(), className = '', content;
 if ( data.enabled ) {
 if ( data.style ) {
 className = data.style + ' jsn-panel cookies-law';
 } else {
 className = 'jsn-panel';
 }
 content = (
 <div className="jsn-panel-body cookies-content-preview">
 <p ref="message">
 <span className="fa fa-circle-o-notch fa-spin"></span>
 </p>
 <button className="btn btn-default" type="button">
 {
 ( data['accept-button-text'] )
 ? data['accept-button-text']
 : 'Got It!'
 }
 </button>
 <a href={
 ( data['cookie-policy-link'] )
 ? data['cookie-policy-link']
 : '#'
 }>
 {
 ( data['read-more-button-text'] )
 ? data['read-more-button-text']
 : 'More information'
 }
 </a>
 </div>
 );
 } else {
 className = 'cookie-law-not-enabled';
 }
 return (
 <div ref="wrapper" className={ className }>
 { content ? content : sunfw.text['cookie-law-not-enabled'] }
 </div>
 );
 },
 initActions: function() { var data = this.editor.getData();
 if ( data.enabled ) { if (data.message_type == 'text') {
 if ( this.refs.message.innerHTML != (data.message || sunfw.text['cookie-law-default-message']) ) {
 this.refs.message.innerHTML = data.message || sunfw.text['cookie-law-default-message'];
 }
 } else if (data.article) {
 var info = data.article.split(':');
 if ( ! this.loaded || this.loaded != info[1] ) {
 this.refs.message.innerHTML = sunfw.text['cookie-law-article-message'].replace('%s', info[0]); if (data.message_type == 'article' && data.article != '') {
 var
 styleID = document.getElementById('jsn-style-id').value,
 token = document.getElementById('jsn-tpl-token').value,
 templateName = document.getElementById('jsn-tpl-name').value;
 SunFwHelper.requestUrl(
 'index.php?option=com_ajax&format=json&plugin=sunfw&action=getArticle&style_id=' + styleID + '&' + token + '=1&template_name=' + templateName + '&articleId=' + info[1],
 function( req ) {
 var response = JSON.parse( req.responseText );
 if ( response && response.type == 'success' ) {
 this.refs.message.innerHTML = response.data.introtext;
 this.loaded = info[1];
 }
 }.bind( this )
 );
 }
 }
 } else {
 this.refs.message.innerHTML = sunfw.text['cookie-law-select-article']
 }
 }
 }
} );
