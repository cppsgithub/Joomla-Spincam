<?php
/**
 * @version    $Id$
 * @package    JSN_PageBuilder2
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * JSN PageBuilder2 system plugin.
 *
 * @package  JSN_PageBuilder2
 * @since    1.0.0
 */
class PlgSystemPageBuilder2 extends JPlugin {
	/**
	 * Define PageBuilder signatures.
	 *
	 * @var  string
	 */
	public static $start_html = '<!-- Start PageBuilder HTML -->';
	public static $end_html = '<!-- End PageBuilder HTML -->';
	public static $start_data = '<!-- Start PageBuilder Data|';
	public static $end_data = '|End PageBuilder Data -->';
	/**
	 * The PageBuilder 2 component.
	 *
	 * @var  string
	 */
	protected static $ext = 'com_pagebuilder2';
	/**
	 * Joomla application object.
	 *
	 * @var  object
	 */
	protected $app;
	protected $isNew = false;

	/**
	 * Register onAfterInitialise event handler.
	 *
	 * @return  void
	 */
	public function onAfterInitialise() {
		// Get application object.
		$this->app = JFactory::getApplication();

		// Get active language.
		$lang = JFactory::getLanguage();

		// Check if language file exists for active language.
		if ( ! file_exists( JPATH_ROOT . '/administrator/language/' . $lang->get( 'tag' ) . '/' . $lang->get( 'tag' ) . '.plg_system_pagebuilder2.ini' ) ) {
			// Load language file from plugin directory.
			$lang->load( 'plg_system_pagebuilder2', dirname( __FILE__ ), null, true );
		} else {
			$lang->load( 'plg_system_pagebuilder2', JPATH_ADMINISTRATOR, null, true );
		}

		// Initialize Ajax handler for PageBuilder app.
		require_once dirname( __FILE__ ) . '/includes/ajax.php';

		// Override Joomla's JEditor class declaration.
		JLoader::register( 'JEditor', dirname( __FILE__ ) . '/includes/editor.php' );
	}

	/**
	 * Register onBeforeRender event handler.
	 *
	 * @return  void
	 */
	public function onBeforeRender() {
		// Generate button to switch editor.
		if ( defined( 'JSNPB2_EDITOR_AVAILABLE' ) ) {
			JSNMenuHelper::addEntry(
				'jsn-pb2-editor-switcher',   // Button ID.
				JText::_( 'SWITCH_EDITOR' ), // Button text.
				'javascript:void(0)',        // Button link.
				false,                       // Active state.
				'',                          // Button icon.
				'toolbar',                   // Button parent.
				'pb2-editor-switcher hidden' // Button class.
			);

			$this->isNew = $this->isNewContent();

			// Get active editor.
			$active = JFactory::getConfig()->get( 'editor' );

			// Get list of available editors.
			$editors = JPluginHelper::getPlugin( 'editors' );

			if ( count( $editors ) > 1 ) {
				foreach ( $editors as $editor ) {
					if ( $editor->name != $active ) {
						// Prepare button text.
						$text = JText::_( 'SWITCH_TO_' . strtoupper( $editor->name ) );

						if ( 0 === strpos( $text, 'SWITCH_TO_' ) ) {
							$text = ucfirst( $editor->name );
						}

						JSNMenuHelper::addEntry(
							"switch-to-{$editor->name}", // Button ID.
							$text,                       // Button text.
							"#{$editor->name}",          // Button link.
							false,                       // Active state.
							'',                          // Button icon.
							'jsn-pb2-editor-switcher',   // Button parent.
							''                           // Button class.
						);
					}
				}
			}

			// Load assets for editor switcher.
			$doc = JFactory::getDocument();

			$jversion = new JVersion();
			$ver      = $jversion->getShortVersion();

			$isJoomla37 = version_compare( $ver, '3.7', '>=' );

			$doc->addStyleSheet( JUri::root( true ) . '/plugins/system/pagebuilder2/assets/editor-switcher.css' );
			$doc->addScript( JUri::root( true ) . '/plugins/system/pagebuilder2/assets/editor-switcher.js' );

			$doc->addScriptDeclaration( '
			window.pb2_editor_switcher = ' . json_encode( array(
					'switching_label' => JText::_( 'SWITCHING_EDITOR' ),
					'current_editor'  => $active,
					'isNewContent'    => $this->isNew,
					'isJoomla37'      => $isJoomla37
				) ) . ';' );
		}

		if ( $this->app->isSite() ) {
			JHTML::_( 'behavior.modal' );
		}
	}

	private function isNewContent() {
		// check whether user is editing from non content/module edit, we don't support it yet
		if ( ( ! isset( $_GET['id'] ) && ! isset( $_GET['cid'] ) && ! isset( $_GET['a_id'] ) ) || ! isset( $_GET['option'] ) || ( ! empty( $_GET['option'] ) ) && ( $_GET['option'] !== 'com_content' && $_GET['option'] !== 'com_modules' ) ) {
			return true;
		}
		$dbo    = JFactory::getDbo();
		$option = ! empty( $_GET['option'] ) ? $_GET['option'] : '';
		$type   = $option == 'com_modules' ? 'modules' : ( $option == 'com_content' ? 'content' : '' );
		$target = $type == 'modules' ? 'content' : 'introtext';
		$query  = $dbo->getQuery( true );
		$query
			->select( $dbo->quoteName( $target ) )
			->from( $dbo->quoteName( "#__$type" ) )
			->where( $dbo->quoteName( 'id' ) . ' = ' . $_GET['id'] );
		$dbo->setQuery( $query );
		$content = (string) $dbo->loadColumn()[0];

		return strlen( $content ) < 1;
	}

	/**
	 * Register onAfterRender event handler.
	 *
	 * @return  void
	 */
	public function onAfterRender() {
		// Get the current response body.
		$body = JResponse::getBody();

//		if ( ! $this->isNew ) {
//			if ( $this->app->isAdmin() && false === strpos( $body, 'Start PageBuilder HTML' ) && false === strpos( $body, 'End PageBuilder HTML' ) && ! isset( $_GET['switchFrom'] ) && isset( $_GET['id'] ) && JFactory::getConfig()->get( 'editor' ) == 'pagebuilder2' ) {
//				//TODO switch back non pb2 editor
//				$this->setEditor( 'tinymce' );
//
//			} elseif ( $this->app->isAdmin() && false !== strpos( $body, 'Start PageBuilder HTML' ) && false !== strpos( $body, 'End PageBuilder HTML' ) && ! isset( $_GET['switchFrom'] ) && isset( $_GET['id'] ) && JFactory::getConfig()->get( 'editor' ) != 'pagebuilder2' ) {
//				$this->setEditor( 'pagebuilder2' );
//			}
//		}
		// Render PageBuilder content if has.
		self::renderPageBuilderContent( $body );

		//Conflict with JSN PowerAdmin: plgSystemJsnpoweradmin line 312
		if ( $this->app->isAdmin() && JComponentHelper::isEnabled( 'com_poweradmin', true ) !== false ) {
			$body = str_replace( "{* ", "{", $body );
		}

//		Check valid Base tag if site has been move to other place(eg: localhost to RC)
//		$valid_base = (string) 'base href="' . JUri::base() . '" /';
//		// TODO refactor hot fix for jsn uniform conflict
//		if ( preg_match_all( '<base (.*?) />', $body, $matches ) ) {
//			foreach ( $matches[0] as $match ) {
//				if ( JComponentHelper::isEnabled( 'com_uniform', true ) !== false ) {
//					$arr = array_reverse( explode( '/', $_SERVER['REQUEST_URI'] ) );
//					if ( $arr[1] == 'submission' ) {
//						break;
//					}
//				}
//				if ( $match != $valid_base && strpos( $match, 'base href="' ) !== false ) {
//					$body = str_replace( $match, $valid_base, $body );
//				}
//			}
//		}


		// Check if <base> tag exists in document body.
//		if ( false !== strpos( $body, '<base href=', strpos( $body, '<body ' ) ) ) {
//			// Get the base URL of the current request.
//			$base      = JUri::base( true );
//			$path_base = preg_replace( "(^https?:)", "", JUri::base() );
//
//
//			if ( $this->app->isAdmin() ) {
//				// Replace all relative link with absolute URL.
//				if ( preg_match_all( '#href="(index\.php[^"]*)"#', $body, $matches, PREG_SET_ORDER ) ) {
//					foreach ( $matches as $match ) {
//						$match[1] = "{$base}/{$match[1]}";
//
//						$body = str_replace( $match[0], 'href="' . $match[1] . '"', $body );
//					}
//				}
//			} else {
//				// Replace all relative links with absolute URLs in HTML tags.
//				if ( preg_match_all( '/(href|src)="([^"]+)"/', $body, $matches, PREG_SET_ORDER ) ) {
//					foreach ( $matches as $match ) {
//
//						//Fix wrong style url when upload to other site domain (rc)
//						if ( strpos( $match[0], 'plugins/pagebuilder2/elements/build/core/grid.css' ) !== false ) {
//							$body = str_replace( $match[0], 'href="' . $base . '/plugins/pagebuilder2/elements/build/core/grid.css"', $body );
//						}
//						if ( strpos( $match[0], 'plugins/pagebuilder2/elements/build/core/frontend.css' ) !== false ) {
//							$body = str_replace( $match[0], 'href="' . $base . '/plugins/pagebuilder2/elements/build/core/frontend.css"', $body );
//						}
//
//						if ( strpos( $match[0], 'src="' . $path_base . 'http' ) !== false ) {
//							preg_match( '/(https?:\/\/[^\s]+)/', $match[0], $text );
//							$body = str_replace( $match[0], 'src="' . $text[0] . '"', $body );
//						}
//						//Fix broken image link.
//						if ( $match[0] == 'src="' . $path_base . '"' ) {
//							$body = str_replace( $match[0], 'src="//placeholdit.imgix.net/~text?txtsize=33&txt=No%20Image%20Available&w=350&h=350"', $body );
//						}
//						// If link is relative, convert it to absolute.
//						if ( ! preg_match( '/^([a-zA-Z0-9]+:|\/|#)/', $match[2] ) ) {
//							$match[2] = "{$base}/{$match[2]}";
//
//							$body = str_replace( $match[0], $match[1] . '="' . $match[2] . '"', $body );
//						}
//					}
//				}
//
//				// Replace all relative links with absolute URLs in CSS rules.
//				unset( $matches );
//
//				if ( preg_match_all( '/url\(\s*[\'"]*([^\)]+)[\'"]*\s*\)/', $body, $matches, PREG_SET_ORDER ) ) {
//					foreach ( $matches as $match ) {
//						// If link is relative, convert it to absolute.
//						$match[1] = trim( $match[1], '\'"' );
//
//						if ( ! preg_match( '/^([a-zA-Z0-9]+:|\/|#)/', $match[1] ) ) {
//							$match[1] = "{$base}/{$match[1]}";
//
//							$body = str_replace( $match[0], 'url("' . $match[1] . '")', $body );
//						}
//					}
//				}
//			}
//		}


		// Set new response body.
		JResponse::setBody( $body );
	}

	private function setEditor( $name ) {
		// Get current user.
		$user = JFactory::getUser();

		// Get current user parameters.
		$params = json_decode( $user->get( 'params' ) );

		if ( ! $params ) {
			$params = new stdClass;
		}

		// Set new editor to user parameters.
		$params->editor = $name;

		$user->setParam( 'editor', $name );

		// Save new user parameters.
		$table = $user->getTable();

		$table->load( $user->get( 'id' ) );

		$table->params = json_encode( $params );

		$table->store();
		header( "Refresh:0" );
		die;
	}

	/**
	 * Method to render PageBuilder content.
	 *
	 * @param   string &$content Content to render.
	 *
	 * @return  void
	 */
	protected static function renderPageBuilderContent( &$content ) {
		// Parse PageBuilder content.
		if ( false !== strpos( $content, self::$start_html ) && false !== strpos( $content, self::$end_html ) ) {
			/**
			 * MinhPT on April 4, 2017: in some website joomla auto add some strange '</>' to our pb content
			 * so we need to remove it
			 */
			$content = str_replace( '</>', '', $content );

			// Look for PageBuilder content (at deepest level first) based on defined signatures.
			$temp = explode( self::$end_html, $content, 2 );
			$from = strpos( $temp[0], self::$start_html );
			$html = substr( $temp[0], $from + strlen( self::$start_html ) );

			// get the base64 data
			$fromData = strpos( $temp[1], self::$start_data ) + strlen( self::$start_data );
			$data     = substr( $temp[1], $fromData, strpos( $temp[1], self::$end_data ) - $fromData );

			// Render PageBuilder data.
			$page = json_decode( base64_decode( $data ) );
			$temp = $html;
			$attr = array();

			if ( $page ) {
				// Load PageBuilder helper class.
				if ( ! class_exists( 'JSNPageBuilder2ContentHelper' ) ) {
					require_once JPATH_ROOT . '/administrator/components/' . self::$ext . '/helpers/content.php';
				}

				foreach ( $page->items as $id => $element ) {
					if ( ! isset( $element->dataSource ) ) {
						continue;
					}

					if ( isset( $element->dataSource->type ) ) {
						switch ( $element->dataSource->type ) {
							case 'articles':
								$attr[ $id ] = JSNPageBuilder2ContentHelper::getArticles( $element->dataSource->params );
								break;
						}
					}

					if ( isset( $element->dataSource->url ) && ! empty( $element->dataSource->url ) ) {
						$url = $element->dataSource->url;
						$url = preg_match( '/^http/is', $url ) ? $url : JUri::base() . $url;
						$res = JSNPageBuilder2ContentHelper::fetchHttp( $url );


						$attr[ $id ] = json_decode( $res );
						// Check if current element is JArticles?
						if ( $element->type == 'Joomla_Articles' ) {
							// Exclude active article from list
							$input = JFactory::getApplication()->input;

							if ( $input->getCmd( 'option' ) == 'com_content' && $input->getCmd( 'view' ) == 'article' ) {
								foreach ( $attr[ $id ] as $k => $v ) {
									if ( $input->getInt( 'id' ) == ( int ) $v->id ) {
										unset( $attr[ $id ][ $k ] );
									}
								}

								reset( $attr[ $id ] );
							}
						}

						if ( isset( $element->children ) && ( $len = count( $element->children ) ) ) {
							$attr[ $id ] = array_slice( $attr[ $id ], 0, $len );
						}
					}
				}

				if ( count( $attr ) ) {

					// Load Mustache template engine.
					if ( ! class_exists( 'Mustache_Engine' ) ) {
						require_once JPATH_ROOT . '/administrator/components/' . self::$ext . '/libraries/3rd-party/mustache/mustache.php';
					}
					$mustache = new Mustache_Engine;

					$temp = $mustache->render( $temp, $attr );
				}
			}


			// Render all {pb2loadmodule} tags that are not rendered.
			if ( false !== strpos( $temp, '{pb2loadmodule' ) ) {
				// Instantiate PB2 Load Module plugin.
				if ( class_exists( 'PlgContentPB2LoadModule' ) || JPluginHelper::importPlugin( 'content', 'pb2loadmodule', false ) ) {
					// Get Joomla event dispatcher.
					$dispatcher = JEventDispatcher::getInstance();

					// Load the plugin from the database.
					$plugin = JPluginHelper::getPlugin( 'content', 'pb2loadmodule' );

					// Instantiate the plugin.
					$plugin = new PlgContentPB2LoadModule( $dispatcher, ( array ) $plugin );

					// Emulate an article.
					$article = ( object ) array( 'text' => $temp );
					$params  = array();

					// Trigger onContentPrepare event to let the PB2 Load Module plugin render all {pb2loadmodule} tags.
					$dispatcher->trigger( 'onContentPrepare', array( '', &$article, &$params, 0 ) );

					$temp = $article->text;
				}
			}
			// Re-build content.
			$content = str_replace(
				self::$start_html . $html . self::$end_html . self::$start_data . $data . self::$end_data,
				$temp,
				$content
			);


			$base      = JUri::base( true );
			$path_base = preg_replace( "(^https?:)", "", JUri::base() );
			// Replace all relative links with absolute URLs in HTML tags.
			if ( preg_match_all( '/(href|src)="([^"]+)"/', $content, $matches, PREG_SET_ORDER ) ) {
				foreach ( $matches as $match ) {
//					Fix wrong style url when upload to other site domain (rc)
					if ( ($pos = strpos( $match[0], 'plugins/pagebuilder2/elements/build/' )) !== false ) {
						$content = str_replace($match[0], 'href="'.$base.'/'.substr($match[0], $pos), $content);
					}
					if ( strpos( $match[0], 'src="' . $path_base . 'http' ) !== false ) {
						preg_match( '/(https?:\/\/[^\s]+)/', $match[0], $text );
						$content = str_replace( $match[0], 'src="' . $text[0] . '"', $content );
					}
					//Fix broken image link.
					if ( $match[0] == 'src="' . $path_base . '"' ) {
						$content = str_replace( $match[0], 'src="//placeholdit.imgix.net/~text?txtsize=33&txt=No%20Image%20Available&w=350&h=350"', $content );
					}
					// If link is relative, convert it to absolute.
					if ( ! preg_match( '/^([a-zA-Z0-9]+:|\/|#)/', $match[2] ) ) {
						$match[2] = "{$base}/{$match[2]}";

						$content = str_replace( $match[0], $match[1] . '="' . $match[2] . '"', $content );
					}
				}
			}

			// Replace all relative links with absolute URLs in CSS rules.
			unset( $matches );

			if ( preg_match_all( '/url\(\s*[\'"]*([^\)]+)[\'"]*\s*\)/', $content, $matches, PREG_SET_ORDER ) ) {
				foreach ( $matches as $match ) {
					// If link is relative, convert it to absolute.
					$match[1] = trim( $match[1], '\'"' );

					if ( ! preg_match( '/^([a-zA-Z0-9]+:|\/|#)/', $match[1] ) ) {
						$match[1] = "{$base}/{$match[1]}";

						$content = str_replace( $match[0], 'url("' . $match[1] . '")', $content );
					}
				}
			}

			// Continue render remaining PageBuilder content.
			self::renderPageBuilderContent( $content );
		}
	}
}
