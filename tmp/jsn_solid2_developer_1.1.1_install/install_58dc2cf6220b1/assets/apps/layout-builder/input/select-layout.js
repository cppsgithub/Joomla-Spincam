
window.SunFwInputSelectLayout = React.createClass( {
 mixins: [ SunFwMixinBase ],
 getDefaultProps: function() {
 return {
 value: '',
 setting: '',
 control: {}
 };
 },
 getInitialState: function() {
 return {
 value: '',
 new_layout: ''
 };
 },
 render: function() {
 var classContainer = 'row layout-selector', layouts = [], className, keyName;
 for ( var layout in this.editor.props.layouts ) {
 className = 'thumbnail ' + ( layout == this.state.value ? 'selected' : '' );
 keyName = 'preview_' + layout; if ( this.editor.props.layouts[ layout ].data ) {
 var action = [];
 if ( this.props.control.action == 'save' ) {
 action = (
 <input
 type="radio"
 name={ this.props.setting }
 value={ layout }
 checked={ layout == this.state.value ? true : false }
 onClick={ this.select }
 />
 );
 }
 layouts.push(
 <div className="pull-left">
 <a
 href="#"
 onClick={ this.select }
 className={ className }
 data-value={ layout }
 >
 <LayoutBuilderPreview
 key={ this.editor.props.id + '_' + keyName }
 ref={ keyName }
 data={ this.editor.props.layouts[ layout ].data }
 parent={ this }
 editor={ this.editor }
 />
 <div className="caption clearfix">
 { action }
 { this.editor.props.layouts[ layout ].label }
 <a
 href="#"
 onClick={ this.remove }
 className="pull-right"
 data-value={ layout }
 >
 <i className="fa fa-trash"></i>
 </a>
 </div>
 </a>
 </div>
 );
 } else if ( this.editor.props.layouts[ layout ].file ) {
 layouts.push(
 <div className="pull-left">
 { this.editor.props.layouts[ layout ].label }
 </div>
 );
 ( function( l ) {
 SunFwHelper.requestUrl(
 this.editor.props.layouts[ l ].file,
 function( req ) { this.editor.props.layouts[ l ].data = JSON.parse( req.responseText ); this.forceUpdate();
 }.bind( this )
 );
 }.bind( this ) )( layout );
 }
 } var input = [];
 if ( this.props.control.action == 'save' ) {
 input = (
 <div className="row new-layout">
 <div className="col-xs-12">
 <div className="radio">
 <label>
 <input
 type="radio"
 name={ this.props.setting }
 value={ this.state.new_layout }
 checked={ this.state.new_layout == this.state.value ? true : false }
 onClick={ this.select }
 />
 { sunfw.text['new-layout'] }
 </label>
 </div>
 <div className="form-group">
 <input
 type="text"
 name={ this.props.setting }
 value={ this.state.new_layout }
 className="form-control"
 placeholder={ sunfw.text['prebuilt-layout-name'] }
 onChange={ this.select }
 />
 </div>
 </div>
 </div>
 );
 }
 if ( ! layouts.length && this.props.control.action != 'save' ) {
 classContainer += ' empty-prelayout';
 }
 return (
 <div ref="wrapper">
 <div className={ classContainer }>
 <div className="layout-list">
 <input
 ref="field"
 type="hidden"
 name={ this.props.setting }
 value={ this.state.value }
 onChange={ this.parent.change }
 />
 { ( ! layouts.length && this.props.control.action != 'save' ) ? sunfw.text['no-pre-layout'] : layouts }
 </div>
 </div>
 { input }
 </div>
 );
 },
 initActions: function() { if ( this.lastChecked === undefined ) {
 this.lastChecked = this.state.value ? this.state.value : this.props.value;
 }
 if ( this.lastChecked != this.state.value ) {
 this.lastChecked = this.state.value;
 setTimeout( function() {
 this.setState( this.state );
 }.bind( this ), 5 );
 } setTimeout( function() { var previews = this.refs.wrapper.querySelectorAll( '.preview-layout' ),
 preview_css,
 width = 0,
 height = 0;
 if ( ! previews.length ) {
 this.refs.wrapper.querySelector( '.layout-list' ).style.width = '100%';
 return;
 }
 for ( var i = 0; i < previews.length; i++ ) {
 if ( height < previews[ i ].offsetHeight ) {
 height = previews[ i ].offsetHeight;
 }
 } for ( var i = 0; i < previews.length; i++ ) {
 previews[ i ].style.height = height + 'px'; preview_css = window.getComputedStyle( previews[ i ].parentNode.parentNode );
 width += previews[ i ].parentNode.parentNode.offsetWidth
 + parseInt( preview_css.getPropertyValue( 'margin-left' ) )
 + parseInt( preview_css.getPropertyValue( 'margin-right' ) );
 } var list = this.refs.wrapper.querySelector( '.layout-list' ),
 list_css = window.getComputedStyle( list );
 list.style.width = ( width
 + parseInt( list_css.getPropertyValue( 'padding-left' ) )
 + parseInt( list_css.getPropertyValue( 'padding-right' ) )
 ) + 'px';
 list.style.height = preview_css.getPropertyValue( 'height' );
 }.bind( this ), 5 );
 },
 select: function( event ) {
 event.preventDefault(); var target = event.target, value = this.state.value;
 if ( target.nodeName == 'INPUT' ) { value = target.value;
 if ( target.type == 'text' ) {
 this.setState( { new_layout: target.value } );
 }
 } else {
 while ( target.nodeName != 'A' && target.nodeName != 'BODY' ) {
 target = target.parentNode;
 } value = target.getAttribute( 'data-value' );
 } this.parent.change( this.props.setting, value );
 },
 remove: function( event ) { var token = document.querySelector( '#jsn-tpl-token' ).value,
 styleID = document.querySelector( '#jsn-style-id' ).value,
 templateName = document.querySelector( '#jsn-tpl-name' ).value; var target = event.target;
 while ( target.nodeName != 'A' && target.nodeName != 'BODY' ) {
 target = target.parentNode;
 } var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=layout&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName
 + '&action=remove&layout=' + target.getAttribute( 'data-value' ); target.firstElementChild.className = 'fa fa-circle-o-notch fa-spin'; SunFwHelper.requestUrl(
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
 } target.firstElementChild.className = 'fa fa-trash';
 if ( response.type == 'success' ) { delete this.editor.props.layouts[ target.getAttribute( 'data-value' ) ]; this.setState( this.state );
 } else { bootbox.alert( response.data );
 }
 }.bind( this )
 );
 }
} );
