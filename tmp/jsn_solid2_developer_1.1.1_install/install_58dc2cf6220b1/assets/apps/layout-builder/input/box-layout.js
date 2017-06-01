
window.SunFwInputBoxLayout = React.createClass( {
 mixins: [ SunFwMixinBase, SunFwMixinInput ],
 getInitialState: function() {
 return {
 value: '',
 };
 },
 render: function() {
 return (
 <div
 key={ this.props.id }
 ref="wrapper"
 className="form-group"
 >
 <label>{ sunfw.text[ this.props.control.label ] }</label>
 <div className="input-group">
 <input
 id={ this.props.id }
 ref="field"
 name={ this.props.setting }
 value= { this.state.value }
 className="form-control"
 type="text"
 onBlur={ this.blur}
 onChange={ this.parent.change}
 />
 <div className="input-group-addon">{ this.props.control.suffix }</div>
 </div>
 </div>
 );
 },
 blur: function () {
 if ( isNaN( this.state.value ) || this.state.value < 768 ) {
 bootbox.alert( sunfw.text['box-layout-min-width'] ); this.setState( { value: 768 } ); this.parent.change( this.props.setting, 768 );
 }
 }
} );
