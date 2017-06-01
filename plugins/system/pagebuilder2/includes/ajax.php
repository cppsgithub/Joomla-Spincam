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

// Disable error reporting and display.
error_reporting( - 1 );
ini_set( 'display_errors', 'Off' );

/**
 * JSN PageBuilder2 Ajax handler.
 *
 * @package  JSN_PageBuilder2
 * @since    1.0.0
 */
class JSNPageBuilder2Ajax {
	/**
	 * Variable to hold the active Joomla application.
	 *
	 * @var  JApplication
	 */
	protected $app;

	/**
	 * Variable to hold the active Joomla database connector.
	 *
	 * @var  JDatabaseDriver
	 */
	protected $dbo;

	public function __construct() {
		// Get Joomla application.
		$this->app = JFactory::getApplication();

		// Get Joomla database connector.
		$this->dbo = JFactory::getDbo();

		// Check if this is an Ajax request from PageBuilder app.
		if ( $this->app->input->getInt( 'pb2ajax' ) == 1 ) {
			// Get requested task.
			$task = $this->app->input->getCmd( 'task' );

			// If requested task is valid, execute it.
			$data = array();

			if ( method_exists( $this, $task ) ) {
				$data = call_user_func( array( $this, $task ) );
			}

			echo json_encode( $data );

			exit;
		}
	}

	protected function convertFromPb1() {
		$currentContent = ( $this->app->input->getString( 'current', '' ) );
		$article_id     = ( $this->app->input->getInt( 'article_id', 0 ) );
		if ( ( $currentContent != '' ) ) {
			require_once( JPATH_PLUGINS . DS . 'system' . DS . 'pagebuilder2' . DS . 'helpers' . DS . 'convert.php' );
			$helper = new PlgSystemPageBuilder2HelpersConvert();
			$dataV2 = $helper->convertToPbd2( $currentContent, $article_id );
			echo json_encode( $dataV2 );

			return array();
		}
	}

	protected function uploadFile() {
		$d    = $this->app->input->getString( 'dir', '' );
		$root = JPATH_ROOT . '/images/' . $d;
		if ( $_POST['data_uri'] ) {
			$uri  = $root . $_POST['filename'];
			$data = $_POST['data_uri'];
			list( $type, $data ) = explode( ';', $data );
			list( , $data ) = explode( ',', $data );
			$data = base64_decode( $data );
			file_put_contents( $uri, $data );
		}

		return array( "message" => "done", 'uri' => $_POST['filename'] );
	}

	protected function getListImages() {
		//TODO listing images directory...

		$d    = $this->app->input->getString( 'dir', '' );
		$root = JPATH_ROOT . '/images/' . $d;

		$files       = array();
		$dirs        = array();
		$directories = array();
		$last_letter = $root[ strlen( $root ) - 1 ];
		$root        = ( $last_letter == '\\' || $last_letter == '/' ) ? $root : $root . DIRECTORY_SEPARATOR;

		$directories[] = $root;

		while ( sizeof( $directories ) ) {
			$dir = array_pop( $directories );
			if ( $handle = opendir( $dir ) ) {
				$count = 0;
				$ignore = array( 'cgi-bin', '.', '..','._' );
				while ( false !== ( $file = readdir( $handle ) ) ) {
					if (in_array($file,$ignore) || substr($file, 0, 1) == '.') {
						continue;
					}

					$obj       = new stdClass();
					$obj->name = $file;
					$obj->key  = $count ++;
					if ( is_dir( $dir . $file ) ) {
						$obj->type = 'dir';
						$dirs[]    = $obj;
					} else {
						$obj->type = 'file';
						$files[]   = $obj;
					}
				}
				closedir( $handle );
			}
		}

		return array_merge( $dirs, $files );
	}

	/**
	 * Replace link URL from .../administrator/index... to index.... only
	 *
	 * @param string $url
	 *
	 * @since version
	 * @return string
	 */
	private function replaceBaseUrl( $url ) {
		return preg_replace( '/^(.*)(index.php.*)$/i', '$2', $url );
	}

	/**
	 * Switch content editor.
	 */
	protected function switchEditor() {
		if ( $this->app->isAdmin() ) {
			// Check if whether user wants to switch active editor.
			if ( ( $new_editor = $this->app->input->get( 'editor' ) ) ) {
				// Get list of available editors.
				$editors = JPluginHelper::getPlugin( 'editors' );

				// Set the requested editor as active one for the current user.
				foreach ( $editors as $editor ) {
					if ( $editor->name == $new_editor ) {
						// Get current user.
						$user = JFactory::getUser();

						// Get current user parameters.
						$params = json_decode( $user->get( 'params' ) );

						if ( ! $params ) {
							$params = new stdClass;
						}

						// Set new editor to user parameters.
						$params->editor = $editor->name;

						$user->setParam( 'editor', $editor->name );

						// Save new user parameters.
						$table = $user->getTable();

						$table->load( $user->get( 'id' ) );

						$table->params = json_encode( $params );

						$table->store();
					}
				}
			}
		}
	}

	/**
	 * Get list of PageBuilder template.
	 *
	 * @return  void
	 */
	protected function getPackages() {
		// Import PageBuilder plugins.
		JPluginHelper::importPlugin( 'pagebuilder2' );

		// Get list of PageBuilder element.
		$results  = JEventDispatcher::getInstance()->trigger( 'getElementList' );
		$packages = array();

		foreach ( $results as $result ) {
			$package = array(
				'name'     => isset( $result['name'] ) ? $result['name'] : '',
				'title'    => isset( $result['title'] ) ? $result['title'] : 'Untitled',
				'scripts'  => isset( $result['scripts'] ) ? $result['scripts'] : array(),
				'elements' => isset( $result['elements'] ) ? $result['elements'] : array()
			);

			foreach ( $package['scripts'] as &$path ) {
				$path = JURI::root() . "plugins/pagebuilder2/{$result['name']}/{$path}";
			}

			// Get element templates.
			$package['templates'] = array();

			$this->getTemplates( "{$result['name']}/templates", '', $package['templates'] );

			$packages[] = $package;
		}

		return $packages;
	}

	protected function getModules() {
		// Verify token.
		JSession::checkToken( 'get' ) or jexit( 'Invalid Token' );

		// Prepare request data.
		$module_type = $this->app->input->getCmd( 'type' );
		$filter_text = $this->app->input->getString( 'filter' );

		// Get database object.
		$this->dboo = JFactory::getDbo();

		// Build query.
		$qry = $this->dboo->getQuery( true );

		$qry->select( '*' )->from( '#__modules' )->where( 'client_id = 0' )->where( 'published = 1' );

		if ( ! empty( $module_type ) ) {
			$qry->where( "module LIKE '%{$module_type}%'" );
		}

		if ( ! empty( $filter_text ) ) {
			$qry->where( "title LIKE '%{$filter_text}%'" );
		}

		// Query for results.
		$modules = array();

		if ( $results = $this->dboo->setQuery( $qry )->loadObjectList() ) {
			// Prepare data to return.
			foreach ( $results as $result ) {
				$modules[] = array(
					'id'    => $result->id,
					'type'  => $result->module,
					'title' => $result->title
				);
			}
		}

		return $modules;
	}

	protected function getModuleStyles() {
		$moduleStyles = array();

		// Define system template.
		$templates = array(
			( object ) array(
				'element' => 'system',
				'name'    => 'system',
				'enabled' => 1
			)
		);

		// Get active template.
		$dbo = JFactory::getDbo();
		$qry = $dbo->getQuery( true );

		$qry
			->select( 'e.element, e.name, e.enabled' )
			->from( '#__extensions as e' )
			->join( 'inner', '#__template_styles as t ON t.template = e.element' )
			->where( 'e.type = ' . $dbo->quote( 'template' ) )
			->where( 't.client_id = 0' )
			->where( 't.home = 1' );

		$dbo->setQuery( $qry );

		$templates[] = $dbo->loadObject();

		// Get all available module chromes.
		foreach ( $templates as $template ) {
			$modulesFilePath = JPATH_SITE . "/templates/{$template->element}/html/modules.php";

			// Is there modules.php for that template?
			if ( is_file( $modulesFilePath ) ) {
				$modulesFileData = file_get_contents( $modulesFilePath );
				$pattern         = '/function[\s\t]*modChrome\_([a-z0-9\-\_]*)[\s\t]*\(/i';

				if ( preg_match_all( $pattern, $modulesFileData, $styles ) ) {
					$moduleStyles[ $template->element ] = $styles[1];
				}
			}
		}

		return $moduleStyles;
	}

	protected function getModuleHTML() {
		// Get module ID.
		$id = $this->app->input->getCmd( 'moduleID' );

		// Emulate an article to let our load module plugin render the module.
		$article = ( object ) array( 'text' => '{pb2loadmodule ' . $id . '}' );
		$params  = array();

		// Import content plugin.
		JPluginHelper::importPlugin( 'content' );

		// Trigger onContentPrepare event.
		JEventDispatcher::getInstance()->trigger( 'onContentPrepare', array( '', &$article, &$params, 0 ) );

		echo new JResponseJson( array( 'html' => $article->text, 'id' => $id ) );

		exit;
	}

	protected function getArticles() {
		// Load model to get articles.
		include_once JPATH_PLUGINS . '/pagebuilder2/elements/articlelist/models/articles.php';

		$articlesModel = new JSNPbArticlesModel();

		// Prepare attributes to get articles.
		$attributes = array(
			// Filter article by categories.
			'articlelist_filter_categories'       => $this->app->input->get( 'categories', '', 'STRING' ),
			// Filter article by authors
			'articlelist_filter_authors'          => $this->app->input->get( 'authors', '', 'STRING' ),
			// The number of article to retrieve.
			'articlelist_amount'                  => $this->app->input->get( 'limit', 30, 'INTEGER' ),
			// Sort article by: a.ordering, a.id, a.title, fp.ordering, ...
			'articlelist_sort_by'                 => $this->app->input->get( 'sort', 'a.publish_up', 'STRING' ),
			// Order direction: ASC, DESC.
			'articlelist_sort_order'              => $this->app->input->get( 'order', 'DESC', 'STRING' ),
			// Filter article by date.
			'articlelist_filter_date'             => $this->app->input->get( 'date_filter', '', 'STRING' ),
			// Name of date field: a.created, a.modified, a.publish_up
			'articlelist_date_field'              => $this->app->input->get( 'date_field', 'a.publish_up', 'STRING' ),
			// Number of days from the date specified to get articles.
			'articlelist_relative_date'           => $this->app->input->get( 'days', 30, 'NUMBER' ),
			// Get articles from this start date...
			'articlelist_range_date_start'        => $this->app->input->get( 'date_start', '', 'STRING' ),
			// ...to this end date.
			'articlelist_range_date_end'          => $this->app->input->get( 'date_end', '', 'STRING' ),
			// Limit article text to the number of word specified.
			'articlelist_article_text_limitation' => $this->app->input->get( 'text_limit', 100, 'NUMBER' ),
			// Convert article date to the format specified.
			'articlelist_article_date_format'     => $this->app->input->get( 'date_format', 'l, F j, Y', 'STRING' ),
			// strip tags or not.
			'articlelist_article_strip_tags'      => $this->app->input->get( 'strip_tags', 'true', 'STRING' )
		);

		// Get articles based on the specified attributes.
		$results  = $articlesModel->getArticlesByAttributes( $attributes );
		$articles = array();

		if ( ! empty( $results ) ) {
			// Load content helper route.
			if ( ! class_exists( 'ContentHelperRoute' ) ) {
				require_once JPATH_ROOT . '/components/com_content/helpers/route.php';
			}

			foreach ( $results as &$result ) {
				$result['direct_url']          = $this->replaceBaseUrl( JRoute::_( ContentHelperRoute::getArticleRoute( $result['id'], $result['catid'] ) ) );
				$result['category_direct_url'] = $this->replaceBaseUrl( JRoute::_( ContentHelperRoute::getCategoryRoute( $result['catid'] ) ) );


				foreach ( $result as $key => $value ) {
					switch ( $key ) {
						case 'images':
						case 'urls':
						case 'attribs':
						case 'metadata':
							$result[ $key ] = json_decode( $value );
							break;

						case 'text':
						case 'introtext':
						case 'fulltext':
							if ( $attributes['articlelist_article_text_limitation'] > 0 ) {
								// Truncate content.
								$result[ $key ] = $this->truncateText(
									$value,
									$attributes['articlelist_article_text_limitation'],
									$attributes['articlelist_article_strip_tags'] == 'true'
								);
							}
							break;

						case 'created':
						case 'modified':
						case 'publish_up':
							if ( ! empty( $attributes['articlelist_article_date_format'] ) ) {
								$result[ $key ] = date(
									$attributes['articlelist_article_date_format'],
									strtotime( $value )
								);
							}
							break;
					}
				}

				$articles[] = $result;
			}
		}

		return $articles;
	}

	protected function getArticlesFilter() {
		// Verify token.
		//JSession::checkToken( 'get' ) or jexit( 'Invalid Token' );

		// Query data.
		$results = new stdClass();

		$results->categories = $this->getCategories( 'joomla' );
		$results->author     = $this->getActiveAuthors( 'joomla' );

		return $results;
	}

	protected function getK2Items() {
		if ( ! is_file( JPATH_ADMINISTRATOR . '/components/com_k2/models/items.php' ) ) {
			return array();
		}

		// Load model to get K2 items.
		include_once JPATH_ADMINISTRATOR . '/components/com_k2/models/model.php';
		include_once JPATH_ADMINISTRATOR . '/components/com_k2/models/items.php';

		$model = new K2ModelItems();

		// Prepare attributes to get K2 items.
		$this->app->setUserState( 'global.list.limit', $this->app->input->getInt( 'limit', 30 ) );
		$this->app->setUserState( 'com_k2items.limitstart', $this->app->input->getInt( 'limitstart', 0 ) );

		$this->app->setUserState( 'com_k2itemsfilter_order', $this->app->input->getCmd( 'filter_order', 'i.id' ) );
		$this->app->setUserState( 'com_k2itemsfilter_order_Dir', $this->app->input->getWord( 'filter_order_Dir', 'DESC' ) );

		$this->app->setUserState( 'com_k2itemsfilter_trash', $this->app->input->getInt( 'filter_trash', 0 ) );
		$this->app->setUserState( 'com_k2itemsfilter_featured', $this->app->input->getInt( 'filter_featured', - 1 ) );
//        $this->app->setUserState('filter_category', 0);
		$this->app->setUserState( 'com_k2itemsfilter_author', $this->app->input->getInt( 'filter_author', 0 ) );
		$this->app->setUserState( 'com_k2itemsfilter_state', $this->app->input->getInt( 'filter_state', - 1 ) );

		$this->app->setUserState( 'com_k2itemssearch', $this->app->input->getString( 'search', '' ) );
		$this->app->setUserState( 'com_k2itemstag', $this->app->input->getInt( 'tag', 0 ) );
		$this->app->setUserState( 'com_k2itemslanguage', $this->app->input->getString( 'language', '' ) );

		$this->app->setUserState( 'text_limit', $this->app->input->getInt( 'text_limit', 100 ) );
		$this->app->setUserState( 'strip_tags', $this->app->input->getString( 'strip_tags', 'true' ) );
		$this->app->setUserState( 'date_format', $this->app->input->getString( 'date_format', 'l, F j, Y' ) );

		// Get K2 items based on the specified attributes.
		$results  = $model->getData();
		$articles = array();
		$catId    = $this->app->input->getInt( 'filter_cat', 0 );

		if ( ! empty( $results ) ) {
			// Load content helper route.
			if ( ! class_exists( 'K2HelperRoute' ) ) {
				require_once JPATH_ROOT . '/components/com_k2/helpers/route.php';
			}


			foreach ( $results as &$result ) {
				$result->direct_url          = $this->replaceBaseUrl( JRoute::_( K2HelperRoute::getItemRoute( $result->id, $result->catid ) ) );
				$result->category_direct_url = $this->replaceBaseUrl( JRoute::_( K2HelperRoute::getCategoryRoute( $result->catid ) ) );
				//Get K2 intro image.
				if ( JFile::exists( JPATH_SITE . DS . 'media' . DS . 'k2' . DS . 'items' . DS . 'cache' . DS . md5( "Image" . $result->id ) . '_XL.jpg' ) ) {
					$result->images->image_intro = JURI::root() . '/media/k2/items/cache/' . md5( "Image" . $result->id ) . '_XL.jpg';
				}

				foreach ( $result as $key => $value ) {
					switch ( $key ) {
						case 'params':
						case 'metadata':
							$result->{$key} = json_decode( $value );
							break;

						case 'text':
						case 'introtext':
						case 'fulltext':
							if ( $this->app->getUserState( 'text_limit' ) > 0 ) {
								// Truncate content.
								$result->{$key} = $this->truncateText(
									$value,
									$this->app->getUserState( 'text_limit' ),
									$this->app->getUserState( 'strip_tags' ) == 'true'
								);
							}
							break;

						case 'created':
						case 'modified':
						case 'publish_up':
							if ( $this->app->getUserState( 'date_format' ) != '' ) {
								$result->{$key} = date(
									$this->app->getUserState( 'date_format' ),
									strtotime( $value )
								);
							}
							break;
					}
				}

				if ( $catId > 0 ) {
					if ( $result->catid == $catId ) {
						$articles[] = $result;
					}
				} else {
					$articles[] = $result;
				}
			}
		}

		return $articles;
	}

	protected function getK2ItemsFilter() {
		// Verify token.
		//JSession::checkToken( 'get' ) or jexit( 'Invalid Token' );

		// Query data.
		$results = new stdClass();

		$results->categories = $this->getCategories( 'k2' );
		$results->author     = $this->getActiveAuthors( 'k2' );
		$results->tags       = $this->getK2Tags();

		return $results;
	}

	protected function getEasyBlogPosts() {
		if ( ! is_file( JPATH_ADMINISTRATOR . '/components/com_easyblog/models/blogs.php' ) ) {
			return array();
		}

		// Load model to get EasyBlog posts.
		include_once JPATH_ADMINISTRATOR . '/components/com_easyblog/includes/easyblog.php';
		include_once JPATH_ADMINISTRATOR . '/components/com_easyblog/models/model.php';
		include_once JPATH_ADMINISTRATOR . '/components/com_easyblog/models/blogs.php';

		$model = new EasyBlogModelBlogs();

		// Prepare attributes to get EasyBlog posts.
		$this->app->setUserState( 'com_easyblog.blogs.limit', $this->app->input->getInt( 'limit', 30 ) );
		$this->app->setUserState( 'com_easyblog.blogs.search', $this->app->input->getString( 'search', '' ) );

		$this->app->setUserState( 'com_easyblog.blogs.filter_order', $this->app->input->getCmd( 'filter_order', 'a.id' ) );
		$this->app->setUserState( 'com_easyblog.blogs.filter_order_Dir', $this->app->input->getWord( 'filter_order_Dir', 'DESC' ) );
		$this->app->setUserState( 'com_easyblog.blogs.filter_state', $this->app->input->getWord( 'filter_state', '' ) );
		$this->app->setUserState( 'com_easyblog.blogs.filter_category', $this->app->input->getInt( 'filter_category', 0 ) );
		$this->app->setUserState( 'com_easyblog.blogs.filter_blogger', $this->app->input->getInt( 'filter_blogger', 0 ) );
		$this->app->setUserState( 'com_easyblog.blogs.filter_language', $this->app->input->getString( 'language', '' ) );

		$this->app->setUserState( 'text_limit', $this->app->input->getInt( 'text_limit', 100 ) );
		$this->app->setUserState( 'strip_tags', $this->app->input->getString( 'strip_tags', 'true' ) );
		$this->app->setUserState( 'date_format', $this->app->input->getString( 'date_format', 'l, F j, Y' ) );

		// Get K2 items based on the specified attributes.
		$results  = $model->getData();
		$articles = array();
		$category = $this->getCategories( 'easyblog' );

		if ( ! empty( $results ) ) {
			// Load content helper route.
			if ( ! class_exists( 'EBR' ) ) {
				require_once JPATH_ADMINISTRATOR . '/components/com_easyblog/includes/router.php';
			}

			foreach ( $results as &$result ) {
				if ( preg_match( '/<img [^>]*src="([^"]+)"[^>]*>/i', $result->content, $match ) ) {
					$result->image = $match[1];
				}

				$result->direct_url          = $this->replaceBaseUrl( EBR::_( 'index.php?option=com_easyblog&view=entry&id=' . $result->id ) );
				$result->category_direct_url = $this->replaceBaseUrl( EBR::_( 'index.php?option=com_easyblog&view=categories&layout=listings&id=' . $result->category_id ) );
				foreach ( $category as $k => $v ) {
					if ( $v->id == $result->category_id ) {
						$result->category_title = $v->title;
					} else {
						$result->category_title = 'Uncategorized';
					}
				}

				foreach ( $result as $key => $value ) {
					switch ( $key ) {
						case 'document':
							$result->{$key} = json_decode( $value );
							break;

						case 'content':
						case 'intro':
						case 'excerpt':
							if ( $this->app->getUserState( 'text_limit' ) > 0 ) {
								// Truncate content.
								$result->{$key} = $this->truncateText(
									$value,
									$this->app->getUserState( 'text_limit' ),
									$this->app->getUserState( 'strip_tags' ) == 'true'
								);
							}
							break;

						case 'created':
						case 'modified':
						case 'publish_up':
							if ( $this->app->getUserState( 'date_format' ) != '' ) {
								$result->{$key} = date(
									$this->app->getUserState( 'date_format' ),
									strtotime( $value )
								);
							}
							break;
					}
				}

				$articles[] = $result;
			}
		}

		return $articles;
	}

	protected function getEasyBlogPostsFilter() {
		// Verify token.
		//JSession::checkToken( 'get' ) or jexit( 'Invalid Token' );

		// Query data.
		$results = new stdClass();

		$results->categories = $this->getCategories( 'easyblog' );
		$results->author     = $this->getActiveAuthors( 'easyblog' );

		return $results;
	}

	protected function getTemplates( $root, $path, &$array ) {
		$fullPath = JPATH_PLUGINS . "/pagebuilder2/{$root}{$path}";

		if ( ! file_exists( $fullPath ) ) {
			return;
		}

		if ( $handle = opendir( $fullPath ) ) {
			while ( false !== ( $entry = readdir( $handle ) ) ) {
				if ( $entry != '.' && $entry != '..' && is_dir( "{$fullPath}/{$entry}" ) ) {
					$array[] = array(
						'type' => 'dir',
						'path' => $path,
						'name' => $entry,
					);

					$this->getTemplates( $root, "{$path}/{$entry}", $array );
				} else {
					$file_parts = pathinfo( "{$fullPath}/{$entry}" );

					switch ( $file_parts['extension'] ) {
						case 'json':
							$data = file_get_contents( "{$fullPath}/{$entry}" );

							$array[] = array(
								'type' => 'file',
								'path' => $path,
								'name' => str_replace( '.json', '', $entry ),
								'data' => json_decode( $data )
							);
							break;
					}
				}
			}

			closedir( $handle );
		}
	}

	protected function getCategories( $source = 'joomla' ) {
		try {
			$qry = $this->dbo->getQuery( true );

			switch ( $source ) {
				case 'k2' :
					$qry->select( 'id, name AS title' )->from( '#__k2_categories' );
					break;

				case 'easyblog' :
					$qry->select( 'id, title' )->from( '#__easyblog_category' );
					break;

				case 'joomla' :
				default :
					$qry->select( 'id, title' )->from( '#__categories' )->where( 'extension = "com_content"' );
					break;
			}

			$qry->where( 'published = 1' )->order( 'title' );

			$this->dbo->setQuery( $qry );

			$results = $this->dbo->loadObjectList();
		}
		catch ( Exception $e ) {
			$results = array();
		}

		return $results;
	}

	protected function getActiveAuthors( $source = 'joomla' ) {
		try {
			$qry = $this->dbo->getQuery( true );

			$qry->select( 'id, name, username' )->from( '#__users' );

			switch ( $source ) {
				case 'k2' :
					$table = '#__k2_items';
					break;

				case 'easyblog' :
					$table = '#__easyblog_post';
					break;

				case 'joomla' :
				default :
					$table = '#__content';
					break;
			}

			$sub = $this->dbo->getQuery( true )->select( 'distinct(created_by)' )->from( $table );

			$qry->where( 'id IN (' . $sub . ')' )->order( 'name' );

			$this->dbo->setQuery( $qry );

			$results = $this->dbo->loadAssocList( 'id' );
		}
		catch ( Exception $e ) {
			$results = array();
		}

		return $results;
	}

	protected function getK2Tags() {
		try {
			$qry = $this->dbo->getQuery( true );

			$qry->select( 'id, name AS tag' )->from( '#__k2_tags' )->where( 'published = 1' )->order( 'name' );

			$this->dbo->setQuery( $qry );

			$results = $this->dbo->loadObjectList();
		}
		catch ( Exception $e ) {
			$results = array();
		}

		return $results;
	}

	protected function truncateText( $text, $limit, $stripTags ) {
		// Clear all <!-- ... --> comment tags.
		$parts = explode( '<!--', $text );
		$text  = $parts[0];

		for ( $i = 1, $n = count( $parts ); $i < $n; $i ++ ) {
			$tempo = explode( '-->', $parts[ $i ] );
			$text .= $tempo[1];
		}

		// Clear all <style> tag.
		$parts = explode( '<style', $text );
		$text  = $parts[0];

		for ( $i = 1, $n = count( $parts ); $i < $n; $i ++ ) {
			$tempo = explode( '</style>', $parts[ $i ] );
			$text .= $tempo[1];
		}

		// Clear all <script> tag.
		$parts = explode( '<script', $text );
		$text  = $parts[0];

		for ( $i = 1, $n = count( $parts ); $i < $n; $i ++ ) {
			$tempo = explode( '</script>', $parts[ $i ] );
			$text .= $tempo[1];
		}

		// Insert a space between sibling close and open HTML tag.
		$text = preg_replace( '#(</[^>]+>)(<[^\>]+>)#', '\\1 \\2', trim( $text ) );

		// Truncate text.
		$text = \Joomla\String\StringHelper::substr( strip_tags( $text ), 0, $limit );

//		$text = JSNUtilsText::truncate( trim( JSNUtilsText::truncate( $text, strlen( $text ), $stripTags ) ), "{$limit}c" );

		return $text;
	}
}

// Instantiate Ajax handler for PageBuilder app.
new JSNPageBuilder2Ajax;
