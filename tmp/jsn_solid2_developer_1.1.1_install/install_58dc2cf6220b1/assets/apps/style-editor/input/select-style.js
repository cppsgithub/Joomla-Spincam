
window.SunFwInputSelectStyle = React.createClass( {
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
 new_style: ''
 };
 },
 render: function() {
 var classContainer = 'row style-selector', styles = [], className, keyName;
 for ( var style in this.editor.props.styles ) {
 className = 'thumbnail ' + ( style == this.state.value ? 'selected' : '' );
 keyName = 'preview_' + style; if ( this.editor.props.styles[ style ].data ) {
 var action = [];
 if ( this.props.control.action == 'save' ) {
 action = (
 <input
 type="radio"
 name={ this.props.setting }
 value={ style }
 checked={ style == this.state.value ? true : false }
 onClick={ this.select }
 />
 );
 }
 styles.push(
 <div className="pull-left">
 <a
 href="#"
 onClick={ this.select }
 className={ className }
 data-value={ style }
 >
 <StyleEditorPreview
 key={ this.editor.props.id + '_' + keyName }
 ref={ keyName }
 data={ this.editor.props.styles[ style ].data }
 parent={ this }
 editor={ this.editor }
 />
 <div className="caption clearfix">
 { action }
 { this.editor.props.styles[ style ].label }
 <a
 href="#"
 onClick={ this.remove }
 className="pull-right"
 data-value={ style }
 >
 <i className="fa fa-trash"></i>
 </a>
 </div>
 </a>
 </div>
 );
 } else if ( this.editor.props.styles[ style ].file ) {
 layouts.push(
 <div className="pull-left">
 { this.editor.props.styles[ style ].label }
 </div>
 );
 ( function( s ) {
 SunFwHelper.requestUrl(
 this.editor.props.styles[ s ].file,
 function( req ) { this.editor.props.styles[ s ].data = JSON.parse( req.responseText ); this.forceUpdate();
 }.bind( this )
 );
 }.bind( this ) )( style );
 }
 } var input = [];
 if ( this.props.control.action == 'save' ) {
 input = (
 <div className="row new-style">
 <div className="col-xs-12">
 <div className="radio">
 <label>
 <input
 type="radio"
 name={ this.props.setting }
 value={ this.state.new_style }
 checked={ this.state.new_style == this.state.value ? true : false }
 onClick={ this.select }
 />
 { sunfw.text['new-style'] }
 </label>
 </div>
 <div className="form-group">
 <input
 type="text"
 name={ this.props.setting }
 value={ this.state.new_style }
 className="form-control"
 placeholder={ sunfw.text['style-preset-name'] }
 onChange={ this.select }
 />
 </div>
 </div>
 </div>
 );
 }
 if ( ! styles.length && this.props.control.action != 'save' ) {
 classContainer += ' empty-prestyle';
 }
 return (
 <div ref="wrapper">
 <div className={ classContainer }>
 <div className="style-list">
 <input
 ref="field"
 type="hidden"
 name={ this.props.setting }
 value={ this.state.value ? this.state.value : this.props.value }
 onChange={ this.parent.change }
 />
 { ( ! styles.length && this.props.control.action != 'save' ) ? sunfw.text['no-pre-style'] : styles }
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
 } setTimeout( function() { var previews = this.refs.wrapper.querySelectorAll( '.preview-style' ),
 preview_css,
 width = 0,
 height = 0;
 if ( ! previews.length ) {
 this.refs.wrapper.querySelector( '.style-list' ).style.width = '100%';
 return false;
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
 } var list = this.refs.wrapper.querySelector( '.style-list' ),
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
 this.setState( { new_style: target.value } );
 }
 } else { while ( target.nodeName != 'A' && target.nodeName != 'BODY' ) {
 target = target.parentNode;
 } value = target.getAttribute( 'data-value' );
 } this.parent.change( this.props.setting, value );
 },
 remove: function( event ) { var token = document.querySelector( '#jsn-tpl-token' ).value,
 styleID = document.querySelector( '#jsn-style-id' ).value,
 templateName = document.querySelector( '#jsn-tpl-name' ).value; var target = event.target;
 while ( target.nodeName != 'A' && target.nodeName != 'BODY' ) {
 target = target.parentNode;
 } var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=styles&'
 + token + '=1&style_id=' + styleID + '&template_name=' + templateName
 + '&action=remove&style_name=' + target.getAttribute( 'data-value' ); target.firstElementChild.className = 'fa fa-circle-o-notch fa-spin'; SunFwHelper.requestUrl(
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
 if ( response.type == 'success' ) { delete this.editor.props.styles[ target.getAttribute( 'data-value' ) ]; this.setState( this.state );
 } else { bootbox.alert( response.data );
 }
 }.bind( this )
 );
 }
} );
