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

window.SunFwInputSocialIcons = React.createClass( {
	mixins: [ SunFwMixinBase, SunFwMixinInput ],

	getInitialState: function() {
		return {
			value: [],
		};
	},

	handleComponentWillMount: function( state ) {
		// Load Sortable.
		SunFwHelper.loadScriptFile(
			sunfw.sunfw_url + '/assets/3rd-party/Sortable/Sortable.min.js',
			this.initActions
		);

		return state;
	},

	render: function() {
		// Create presentation for the list.
		var list = [], keyName = this.props.id + '_items_';

		this.state.value.map( ( item, index ) => {
			keyName += index + ':' + item.text;

			list.push(
				<li
					onClick={ this.editItem }
					className="list-group-item clearfix"
					data-index={ index }
				>
					<i className="fa-h draggable"></i>
					<i className={ item.icon }></i>
					&nbsp;
					{ (item.title != '' && typeof item.title != 'undefined') ? item.title : item.text }

					<ul className="pull-right display-inline list-inline manipulation-actions margin-0">
						<li>
							<a href="#" onClick={ this.cloneItem }>
								<i className="fa fa-files-o"></i>
							</a>
						</li>
						<li>
							<a href="#" onClick={ this.deleteItem }>
								<i className="fa fa-trash"></i>
							</a>
						</li>
					</ul>
				</li>
			);
		} );

		return (
			<div
				key={ this.props.id }
				ref="wrapper"
				className="form-group"
			>
				<label>
					{ sunfw.text[ this.props.control.label ] || this.props.control.label }
					{ this.parent.tooltip }
				</label>

				<div className="social-icons">
					<input
						id={ this.props.id }
						ref="field"
						type="text"
						name={ this.props.setting }
						value={ this.state.value ? this.state.value : this.props.value }
						onChange={ this.parent.change }
			 			className="hidden"
					/>

					<ul
						key={ keyName }
						ref="list"
						className="list-group"
					>
						{ list }
					</ul>

					<button className="btn btn-block btn-default" ref="add" type="button" onClick={ this.addItem }>
						{ sunfw.text['add-social-icon'] }
					</button>
				</div>
			</div>
		);
	},

	handleInitActions: function() {
		if ( this.refs.list && window.Sortable !== undefined ) {
			// Make the list sortable.
			Sortable.create( this.refs.list, {
				handle: '.fa-h',
				onUpdate: function() {
					// Update items' order.
					var items = [];

					for ( var i = 0; i < this.refs.list.children.length; i++ ) {
						var item = this.refs.list.children[ i ];

						items.push( this.state.value[ parseInt( item.getAttribute( 'data-index' ) ) ] );
					}

					this.saveItems( items );
				}.bind( this )
			} );
		}
	},

	saveItems: function( items ) {
		// Update component state.
		this.setState( { value: items } );

		// Update parent settings.
		this.parent.change( this.props.setting, items );
	},

	handleSaveSettings: function( item ) {
		// Get editing item.
		var items = this.state.value, editing = this.state.editing;

		// Update item setting.
		items[ editing ] = item;

		// Update state.
		this.saveItems( items );
	},

	addItem: function( event ) {
		event.preventDefault();

		// Create a new list item.
		var items = this.state.value;

		items.push( {
			icon: 'fa fa-facebook',
			text: 'Facebook',
			title: 'Facebook',
		} );

		// Update state.
		this.saveItems( items );

		// Open modal to edit item.
		this.editItem( event, items.length - 1 );
	},

	editItem: function( event, index ) {
		event.preventDefault();

		// Get the item being edited.
		var target = event.target;

		if ( index === undefined ) {
			while ( ! target.classList.contains( 'list-group-item' ) && target.nodeName != 'BODY' ) {
				target = target.parentNode;
			}

			// Generate data to pass to editable instance.
			index = target.getAttribute( 'data-index' );
		}

		var data = {
			ref: this,
			form: {
				'class': 'social-icon-settings',
				rows: [
					{
						cols: [
							{
								'class': 'col-xs-6',
								settings: {
									'text': {
										type: 'select',
										chosen: false,
										label: 'social-network',
										options: [
											{
												value: 'Facebook',
												label: 'Facebook'
											},
											{
												value: 'Twitter',
												label: 'Twitter'
											},
											{
												value: 'Instagram',
												label: 'Instagram'
											},
											{
												value: 'Pinterest',
												label: 'Pinterest'
											},
											{
												value: 'YouTube',
												label: 'YouTube'
											},
											{
												value: 'Google+',
												label: 'Google+'
											},
											{
												value: 'Linkedin',
												label: 'Linkedin'
											},
											{
												value: 'Dribbble',
												label: 'Dribbble'
											},
											{
												value: 'Behance',
												label: 'Behance'
											},
											{
												value: 'Flickr',
												label: 'Flickr'
											},
											{
												value: 'Skype',
												label: 'Skype'
											},
											{
												value: 'VK',
												label: 'VK'
											}
										]
									},
								},
							},
							{
								'class': 'col-xs-6',
								settings: {
									'icon': {
										type: 'radio',
										label: 'social-icon',
										inline: true,
										options: [
											{
												'class': 'hidden',
												label: ( <i className="fa fa-facebook fa-2x"></i> ),
												value: 'fa fa-facebook',
												requires: {
													text: 'Facebook'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-facebook-official fa-2x"></i> ),
												value: 'fa fa-facebook-official',
												requires: {
													text: 'Facebook'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-facebook-square fa-2x"></i> ),
												value: 'fa fa-facebook-square',
												requires: {
													text: 'Facebook'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-twitter fa-2x"></i> ),
												value: 'fa fa-twitter',
												requires: {
													text: 'Twitter'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-twitter-square fa-2x"></i> ),
												value: 'fa fa-twitter-square',
												requires: {
													text: 'Twitter'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-instagram fa-2x"></i> ),
												value: 'fa fa-instagram',
												requires: {
													text: 'Instagram'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-pinterest fa-2x"></i> ),
												value: 'fa fa-pinterest',
												requires: {
													text: 'Pinterest'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-pinterest-p fa-2x"></i> ),
												value: 'fa fa-pinterest-p',
												requires: {
													text: 'Pinterest'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-pinterest-square fa-2x"></i> ),
												value: 'fa fa-pinterest-square',
												requires: {
													text: 'Pinterest'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-youtube-play fa-2x"></i> ),
												value: 'fa fa-youtube-play',
												requires: {
													text: 'YouTube'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-youtube fa-2x"></i> ),
												value: 'fa fa-youtube',
												requires: {
													text: 'YouTube'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-youtube-square fa-2x"></i> ),
												value: 'fa fa-youtube-square',
												requires: {
													text: 'YouTube'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-google-plus fa-2x"></i> ),
												value: 'fa fa-google-plus',
												requires: {
													text: 'Google+'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-google-plus-square fa-2x"></i> ),
												value: 'fa fa-google-plus-square',
												requires: {
													text: 'Google+'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-linkedin fa-2x"></i> ),
												value: 'fa fa-linkedin',
												requires: {
													text: 'Linkedin'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-linkedin-square fa-2x"></i> ),
												value: 'fa fa-linkedin-square',
												requires: {
													text: 'Linkedin'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-dribbble fa-2x"></i> ),
												value: 'fa fa-dribbble',
												requires: {
													text: 'Dribbble'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-behance fa-2x"></i> ),
												value: 'fa fa-behance',
												requires: {
													text: 'Behance'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-behance-square fa-2x"></i> ),
												value: 'fa fa-behance-square',
												requires: {
													text: 'Behance'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-flickr fa-2x"></i> ),
												value: 'fa fa-flickr',
												requires: {
													text: 'Flickr'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-skype fa-2x"></i> ),
												value: 'fa fa-skype',
												requires: {
													text: 'Skype'
												}
											},
											{
												'class': 'hidden',
												label: ( <i className="fa fa-vk fa-2x"></i> ),
												value: 'fa fa-vk',
												requires: {
													text: 'VK'
												}
											}
										]
									},
								},
							},
						],
					},
					{
						cols: [
							{
								'class': 'col-xs-12',
								settings: {
									title: {
										type: 'text',
										label: 'social-title',
										suffix: '',
									},
								},
							},
							{
								'class': 'col-xs-12',
								settings: {
									'link': {
										type: 'text',
										label: 'profile-link',
										placeholder: 'http://'
									},
								},
							},
						],
					},
				],
			},
			values: this.state.value[ index ]
		};

		// Show form in a modal.
		this.editor.getModal( {
			id: 'social_icon_settings_modal',
			title: 'social-icon-setting',
			type: 'form',
			content: {
				data: data
			},
			'class': 'fixed'
		} );

		// Set editing state.
		this.setState( { editing: index } );
	},

	cloneItem: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		// Get target.
		var target = event.target;

		while ( ! target.classList.contains( 'list-group-item' ) && target.nodeName != 'BODY' ) {
			target = target.parentNode;
		}

		// Clone a list item.
		var items = this.state.value,
			index = parseInt( target.getAttribute( 'data-index' ) ),
			item = {
				icon: items[ index ].icon,
				text: items[ index ].text,
				link: items[ index ].link,
				title: items[ index ].text + sunfw.text['clone-label'],
			};

		// Insert the cloned item right below the original item in the list.
		items.splice( index + 1, 0, item );

		// Update state.
		this.saveItems( items );
	},

	deleteItem: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		// Get target.
		var target = event.target;

		while ( ! target.classList.contains( 'list-group-item' ) && target.nodeName != 'BODY' ) {
			target = target.parentNode;
		}

		// Delete a list item.
		var items = this.state.value,
			index = parseInt( target.getAttribute( 'data-index' ) );

		items.splice( index, 1 );

		// Update state.
		this.saveItems( items );
	}
} );
