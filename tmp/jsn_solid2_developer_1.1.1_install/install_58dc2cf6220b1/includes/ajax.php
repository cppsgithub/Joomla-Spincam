<?php
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');

/**
 * Handle Ajax requests.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjax
{
	/**
	 * Application instance.
	 *
	 * @var JApplication
	 */
	protected $app;

	/**
	 * Input object.
	 *
	 * @var JInput
	 */
	protected $input;

	/**
	 * Database object.
	 *
	 * @var JDatabase
	 */
	protected $dbo;

	/**
	 * Session handler.
	 *
	 * @var JSession
	 */
	protected $session;

	/**
	 * Language management library.
	 *
	 * @var JLanguage
	 */
	protected $language;

	/**
	 * Template details.
	 *
	 * @var array
	 */
	protected $template;

	/**
	 * Response content.
	 *
	 * @var mixed
	 */
	protected $responseContent;

	/**
	 * Constructor.
	 *
	 * @return  void
	 */
	public function __construct()
	{
		// Get necessary objects.
		$this->app      = JFactory::getApplication();
		$this->input    = $this->app->input;
		$this->dbo      = JFactory::getDBO();
		$this->session  = JFactory::getSession();
		$this->language = JFactory::getLanguage();

		// Prepare input data.
		$this->styleID      = $this->input->getInt( 'style_id', 0 );
		$this->templateName = $this->input->getString( 'template_name', '' );

		if ( ! $this->styleID || empty( $this->templateName ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Load template language file.
		$this->language->load( 'tpl_' . $this->input->getCmd( 'template_name', '' ), JPATH_ROOT );
		$this->language->load( 'lib_joomla' );

		$this->_parseTemplateInfo( $this->input->getCmd( 'template_name', '' ) );
	}

	/**
	 * Set response content.
	 *
	 * @param   mixed  $content  Content will be sent to client
	 * @return  void
	 */
	public function setResponse( $content )
	{
		$this->responseContent = $content;
	}

	/**
	 * Get response content.
	 *
	 * @return mixed
	 */
	public function getResponse()
	{
		return $this->responseContent;
	}

	/**
	 * Get module position from template's manifest file.
	 *
	 * @return  void
	 */
	public function getTemplatePositionAction()
	{
		$manifest = SunFwHelper::getManifest( $this->templateName );

		// Get module positions.
		$positions = array();

		foreach ( $manifest->xpath( 'positions/position' ) as $position )
		{
			$positions[] = array( 'name' => ( string ) $position, 'value' => ( string ) $position );
		}

		$this->setResponse( $positions );
	}

	/**
	 * Save a new module position to template's mainifest file.
	 *
	 * @throws  Exception
	 */
	public function saveTemplatePositionAction()
	{
		// Prepare input data.
		$position = $this->input->getString( 'position', '' );

		if ( empty( $position ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		// Prepare template's XML manifest data.
		$manifest = SunFwHelper::getManifest( $this->templateName, true );

		foreach ( $manifest->xpath( 'positions/position' ) as $pos )
		{
			if ( ( string ) $pos == $position )
			{
				throw new Exception( JText::_('SUNFW_POSITION_IS_EXISTED') );
			}
		}

		// Add new position then save updated XML data to manifest file.
		$manifest->positions->addChild( 'position', $position );

		try
		{
			SunFwHelper::updateManifest( $this->templateName, $manifest );
		}
		catch ( Exception $e )
		{
			throw $e;
		}

		$this->setResponse( array( 'message' => JText::_( 'SUNFW_SAVED_SUCCESSFULLY' ) ) );
	}

	/**
	 * Get all available menu items.
	 *
	 * @return  void
	 */
	public function getMenuItemsAction()
	{
		foreach ( SunFwHelper::getAllAvailableMenus( true, 10 ) as $menu )
		{
			$menus[ $menu->value ] = $menu;
		}

		$this->setResponse( is_array( $menus ) ? $menus : array() );
	}

	/**
	 * Get menu type.
	 *
	 * @return  void
	 */
	public function getMenuTypeAction()
	{
		// Get all available menus.
		$menus = SunFwHelper::getAllAvailableMenus();

		$this->setResponse( is_array( $menus ) ? $menus : array() );
	}

	/**
	 * Execute the requested Ajax action.
	 *
	 * @return  boolean
	 */
	public static function execute()
	{
		// Get Joomla's application instance.
		$app = JFactory::getApplication();

		// Prepare to execute Ajax action.
		$context = $app->input->getCmd( 'context', '' );
		$action  = $app->input->getCmd( 'action', null );
		$rformat = $app->input->getCmd( 'rformat', 'json' );

		if ( empty( $action ) )
		{
			return false;
		}

		try
		{
			// Verify token.
			if ( ! JSession::checkToken( 'get' ) )
			{
				throw new Exception( 'Invalid Token' );
			}

			// Checking user permission.
			if ( ! JFactory::getUser()->authorise( 'core.manage', 'com_templates' ) )
			{
				throw new Exception( 'JERROR_ALERTNOAUTHOR' );
			}

			// Generate context class.
			$contextClass = 'SunFwAjax' . ucfirst( $context );

			if ( ! class_exists( $contextClass ) )
			{
				throw new Exception( "The requested context {$context} is invalid" );
			}

			// Create a new instance of the request context.
			$contextObject = new $contextClass;

			// Generate method name.
			$method = str_replace( '-', '', $action ) . 'Action';

			if ( method_exists( $contextObject, $method ) )
			{
				call_user_func( array( $contextObject, $method ) );
			}
			elseif ( method_exists( $contextObject, 'invoke' ) )
			{
				call_user_func( array( $contextObject, 'invoke'), $action );
			}
			else
			{
				throw new Exception( "The requested action {$action} is invalid" );
			}

			// Send response back.
			if ( $rformat == 'raw' )
			{
				echo $contextObject->getResponse();
			}
			else
			{
				//header('Content-type: application/json');
				echo json_encode(
					array(
						'type' => 'success',
						'data' => $contextObject->getResponse(),
					)
				);
			}
		}
		catch ( Exception $e )
		{
			//header('Content-type: application/json');
			echo json_encode(
				array(
					'type' => $e->getCode() == 99 ? 'outdate' : 'error',
					'data' => $e->getMessage(),
				)
			);
		}

		return true;
	}
	/**
	 * Get Module style .
	 *
	 * @return  void
	 */

	public function getModuleStyleAction()
	{
		$moduleStyle = array();
		$defaultModuleStyles = SunFwHelper::getDefaultModuleStyle($this->styleID);

		if ( count( $defaultModuleStyles ) )
		{
			foreach ($defaultModuleStyles['appearance']['modules'] as $key => $value)
			{
				$tmp = array();
				$tmp ['text'] 	= ucfirst(str_replace('-', ' ', $key));
				$tmp ['value'] 	= $key;
				$moduleStyle [] = $tmp;
			}
		}

		$this->setResponse( is_array( $moduleStyle ) ? $moduleStyle : array() );
	}
	/**
	 * Retrieve template detailed information and store
	 * it in the memory
	 *
	 * @param   string  $name  The template name
	 * @return  void
	 */
	private function _parseTemplateInfo ($name)
	{
		if ( ! ($details = SunFwRecognization::detect($name)))
		{
			$this->app->enqueueMessage("The template {$name} is not a valid our template!");
		}

		$this->template = array(
				'name'		=> $name,
				'realName'	=> JText::_($name),
				'id'		=> SunFwHelper::getTemplateIdentifiedName($name),
				'edition'	=> SunFwHelper::getTemplateEdition($name),
				'version'	=> SunFwHelper::getTemplateVersion($name)
		);
	}

	/**
	 * Install Structure of template
	 *
	 * @throws Exception
	 */
	public function installStructureAction()
	{
		$structureID = $this->input->getString( 'structure_id', '' );

		if ( empty( $structureID ) )
		{
			throw new Exception( 'Invalid Request' );
		}

		$path = JPATH_ROOT . '/templates/' . $this->templateName .'/structures/' . $structureID . '.json';

		if (is_file($path))
		{
			// Read template parameters in file
			$params = file_get_contents($path);

			if ( ! $params)
			{
				throw new Exception(JText::_('SUNFW_READ_FILE_FAIL'));
			}
		}
		else
		{
			$tmpSystemData = json_encode(array("niche-style" => $structureID));

			$tmpObj = new stdClass();
			$tmpObj->id = '999999';
			$tmpObj->style_id = '999999';
			$tmpObj->template = $this->templateName;
			$tmpObj->layout_builder_data = '';
			$tmpObj->appearance_data = '';
			$tmpObj->system_data = $tmpSystemData;
			$tmpObj->mega_menu_data = '';

			$params = json_encode($tmpObj);
		}


		if (substr($params, 0, 1) != '{' OR substr($params, -1) != '}')
		{
			throw new Exception(JText::_('SUNFW_INVALID_FILE_CONTENT'));
		}

		$style = SunFwHelper::getSunFwStyle( $this->styleID );

		$params 			= json_decode($params, true);
		unset($params['id']);
		$params				= (object) $params;
		$params->id			= null;
		$params->style_id	= $this->styleID;
		$params->template 	= $this->templateName;
		$params->mega_menu_data = '';

		if (count($style))
		{
			try
			{
				$result = $this->dbo->updateObject('#__sunfw_styles', $params, 'style_id');

				// re-compile Sass
				$sufwrender = new SunFwScssrender();
				$sufwrender->compile($this->styleID, $this->templateName);
				$sufwrender->compile($this->styleID, $this->templateName, "layout");
			}
			catch (Exception $e)
			{
				throw $e;
			}
		}
		else
		{
			$params = (array) $params;
			// Clear previous ID and home status.
			unset( $params['id'] );

			// Build insert query.
			$q = $this->dbo->getQuery( true );

			$q
			->insert( '#__sunfw_styles' )
			->columns( array_keys( $params ) )
			->values( implode( ',', array_values( $this->dbo->quote($params) )));
			$this->dbo->setQuery( $q );

			try
			{
				$this->dbo->execute();
				// re-compile Sass
				$sufwrender = new SunFwScssrender();
				$sufwrender->compile($this->styleID, $this->templateName);
				$sufwrender->compile($this->styleID, $this->templateName, "layout");
			}
			catch (Exception $e)
			{
				throw $e;
			}
		}

		$this->setResponse(JText::_('SUNFW_INSTALL_STRUCTURE_SUCCESS'));
	}
	/**
	 * Verify Token key
	 */
	public function verifyTokenAction()
	{
		// Check token
		if (!JSession::checkToken('get'))
		{
			exit(json_encode(array('message' => 'Invalid Token', 'result' => 'error')));
		}

		$token = $this->input->getString( 'token', '' );

		if ($token == '')
		{
			exit(json_encode(array('message' => JText::_('SUNFW_TOKEN_CANNOT_BE_BLANK'), 'result' => 'error')));
		}

		$isAllowedUser = JFactory::getUser()->authorise('core.admin');

		if (!$isAllowedUser)
		{
			exit(json_encode(array('message' => JText::_('JGLOBAL_AUTH_ACCESS_DENIED'), 'result' => 'error')));
		}


		$randCode		= SunFwUltils::generateRandString();
		$domain			= JURI::root();

		preg_match('@^(?:http://www\.|http://|www\.|http:|https://www\.|https://|www\.|https:)?([^/]+)@i', $domain, $domainFilter);
		$domain 		= $domainFilter[1];

		$secretKey 		= md5($randCode . $domain);

		$query 		= array();
		$query[] 	= 'rand_code=' . urlencode($randCode);
		$query[] 	= 'domain=' . urlencode($domain);
		$query[] 	= 'secret_key=' . urlencode($secretKey);
		$query[] 	= 'token=' . urlencode($token);
		$url 		= SUNFW_CHECK_TOKEN_URL . '&' . implode('&', $query);

		// Get results
		try
		{
			$result = SunFwHttpRequest::get($url);

			// JSON-decode the result
			$result = json_decode($result['body']);

			if (is_null($result))
			{
				exit(json_encode(array('message' => JText::_('SUNFW_ERROR_FAILED_TO_CONNECT_OUR_SERVER'), 'result' => 'error')));
			}

			if ((string) $result->result == 'error')
			{
				exit(json_encode(array('message' => JText::_('SUNFW_LIGHTCART_TOKEN_ERROR_' . $result->message), 'result' => 'error')));
			}

			// Store installed sample data package.
			SunFwHelper::updateExtensionParams(
					array(
							'token' => $token ,
					),
					'plugin',
					'sunfw',
					'system'
			);

			require_once JPATH_ROOT . '/plugins/system/sunfw/includes/client/client.php';

			try
			{
				// Post client information
				SunFwClientInformation::postClientInformation($token);
			}
			catch (Exception $e)
			{
				exit(json_encode(array('message' => JText::_('SUNFW_TOKEN_IS_VALID'), 'result' => 'success')));
			}

			exit(json_encode(array('message' => JText::_('SUNFW_TOKEN_IS_VALID'), 'result' => 'success')));
		}
		catch (Exception $e)
		{
			exit(json_encode(array('message' => JText::_('SUNFW_ERROR_FAILED_TO_CONNECT_OUR_SERVER'), 'type' => 'error')));
		}
	}

	/**
	 * Verify Token key
	 */
	public function getTokenAction()
	{
		// Check token
		if (!JSession::checkToken('get'))
		{
			exit(json_encode(array('message' => 'Invalid Token', 'result' => 'error')));
		}

		$method = $this->input->getMethod();

		// Checking customer information
		$username = $this->input->getUsername('username', '');
		$password = $this->input->$method->get('password', '', 'RAW');

		if ($username == '' || $password == '')
		{
			exit(json_encode(array('message' => JText::_('SUNFW_LIGHTCART_ERROR_TOKEN_ERR01'), 'result' => 'error')));
		}

		$isAllowedUser = JFactory::getUser()->authorise('core.admin');

		if (!$isAllowedUser)
		{
			exit(json_encode(array('message' => JText::_('JGLOBAL_AUTH_ACCESS_DENIED'), 'result' => 'error')));
		}


		$randCode		= SunFwUltils::generateRandString();
		$domain			= JURI::root();

		preg_match('@^(?:http://www\.|http://|www\.|http:|https://www\.|https://|www\.|https:)?([^/]+)@i', $domain, $domainFilter);
		$domain 		= $domainFilter[1];
		$secretKey 		= md5($randCode . $domain);
		$query 			= array();

		$query['rand_code'] 	= $randCode;
		$query['domain'] 		= $domain;
		$query['secret_key'] 	= $secretKey;
		$query['username'] 		= $username;
		$query['password'] 		= $password;

		$url						= SUNFW_GET_TOKEN_URL;
		$arguments					= array();
		$arguments["RequestMethod"] = "POST";
		$arguments["PostValues"] 	= $query;
		// Get results
		try
		{
			$result = SunFwHttpRequest::get($url, '', true, $arguments);

			// JSON-decode the result
			$result = json_decode($result['body']);

			if (is_null($result))
			{
				exit(json_encode(array('message' => JText::_('SUNFW_ERROR_FAILED_TO_CONNECT_OUR_SERVER'), 'result' => 'error')));
			}

			if ((string) $result->result == 'error')
			{
				exit(json_encode(array('message' => JText::_('SUNFW_LIGHTCART_ERROR_' . $result->message), 'result' => 'error')));
			}

			// Store installed sample data package.
			SunFwHelper::updateExtensionParams(
					array(
							'token' => $result->token ,
					),
					'plugin',
					'sunfw',
					'system'
			);

			require_once JPATH_ROOT . '/plugins/system/sunfw/includes/client/client.php';

			try
			{
				// Post client information
				SunFwClientInformation::postClientInformation($result->token);
			}
			catch (Exception $e)
			{
				exit(json_encode(array('message' => JText::_('SUNFW_TOKEN_IS_VALID'), 'result' => 'success', 'token' => $result->token)));
			}

			exit(json_encode(array('message' => JText::_('SUNFW_TOKEN_IS_VALID'), 'result' => 'success', 'token' => $result->token)));
		}
		catch (Exception $e)
		{
			exit(json_encode(array('message' => JText::_('SUNFW_ERROR_FAILED_TO_CONNECT_OUR_SERVER'), 'type' => 'error')));
		}
	}

	/**
	 * Get an article.
	 *
	 * @return  void
	 */
	public function getArticleAction() {
		// Get default language if multi-language is enabled.
		$lang = '';

		jimport('');

		if ( JLanguageMultilang::isEnabled() ) {
			$lang = JComponentHelper::getParams('com_languages')->get('site', 'en-GB');
		}

		// Get requested article.
		$id = $this->input->getInt('articleId');

		if ( ! $id ) {
			throw new Exception('Invalid Request');
		}

		$article = SunFwSiteHelper::getArticle($id, $lang);

		$this->setResponse($article);
	}
}
