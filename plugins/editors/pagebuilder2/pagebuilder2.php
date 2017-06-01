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
defined('_JEXEC') or die('Restricted access');

/**
 * JSN PageBuilder2 editor plugin.
 *
 * @package  JSN_PageBuilder2
 * @since    1.0.0
 */
class PlgEditorPageBuilder2 extends JPlugin
{
	/**
	 * Affects constructor behavior. If true, language files will be loaded automatically.
	 *
	 * @var    boolean
	 * @since  12.3
	 */
	protected $autoloadLanguage = true;

	/**
	 * Initialises the Editor.
	 *
	 * @return  void
	 */
	public function onInit()
	{
		static $initialized;

		// Initialize the editor only once.
		if ( ! $initialized )
		{
			// PageBuilder shall have its own group of plugins to modify and extend its behavior.
			$plugins    = JPluginHelper::importPlugin( 'pagebuilder2' );
			$dispatcher = JEventDispatcher::getInstance();

			// Trigger an event to allow 3rd-party plugins do pre-init actions.
			$dispatcher->trigger( 'onPageBuilderBeforeInit', array( &$this->params ) );

			$displayData = ( object ) array( 'params' => $this->params );

			// We need to do output buffering here because layouts may actually 'echo' things which we do not want.
			ob_start();

			JLayoutHelper::render( 'editors.pagebuilder2.init', $displayData, __DIR__ . '/layouts' );

			ob_end_clean();

			// We need to do output buffering here because layouts may actually 'echo' things which we do not want.
			ob_start();

			JLayoutHelper::render( 'editors.pagebuilder2.styles', $displayData, __DIR__ . '/layouts' );

			ob_end_clean();

			// Trigger an event to allow 3rd-party plugins do post-init actions.
			$dispatcher->trigger( 'onPageBuilderAfterInit', array( &$this->params ) );

			// State that the editor is initialized.
			$initialized = true;
		}
	}

	/**
	 * Copy editor content to form field.
	 *
	 * @param   string  $id  The id of the editor field.
	 *
	 * @return  string  Javascript
	 */
	public function onSave( $id )
	{
		return;
	}

	/**
	 * Get the editor content.
	 *
	 * @param   string  $id  The id of the editor field.
	 *
	 * @return  string  Javascript
	 */
	public function onGetContent( $id )
	{
		return sprintf(
			'Joomla.editors.instances[%1$s].page.dataJSON.b64encode();',
			json_encode( ( string ) $id )
		);
	}

	/**
	 * Set the editor content.
	 *
	 * @param   string  $id       The id of the editor field.
	 * @param   string  $content  The content to set.
	 *
	 * @return  string  Javascript
	 */
	public function onSetContent( $id, $content )
	{
		return sprintf(
			'Joomla.editors.instances[%1$s].initEditor(%2$s);',
			json_encode( ( string ) $id ),
			json_encode( ( string ) $content )
		);
	}

	/**
	 * Adds the editor specific insert method.
	 *
	 * @return  boolean
	 */
	public function onGetInsertMethod()
	{
		static $initialized;

		// Initialize the insert method only once.
		if ( ! $initialized )
		{
			JFactory::getDocument()->addScriptDeclaration(
				';function jInsertEditorText(text, editor) { Joomla.editors.instances[editor].replaceSelection(text); }'
			);

			// State that the insert method is initialized.
			$initialized = true;
		}

		return true;
	}

	/**
	 * Display the editor area.
	 *
	 * @param   string   $name     The control name.
	 * @param   string   $content  The contents of the text area.
	 * @param   string   $width    The width of the text area (px or %).
	 * @param   string   $height   The height of the text area (px or %).
	 * @param   int      $col      The number of columns for the textarea.
	 * @param   int      $row      The number of rows for the textarea.
	 * @param   boolean  $buttons  True and the editor buttons will be displayed.
	 * @param   string   $id       An optional ID for the textarea (note: since 1.6). If not supplied the name is used.
	 * @param   string   $asset    Not used.
	 * @param   object   $author   Not used.
	 * @param   array    $params   Associative array of editor parameters.
	 *
	 * @return  string  HTML
	 */
	public function onDisplay( $name, $content, $width, $height, $col, $row, $buttons = true, $id = null, $asset = null, $author = null, $params = array() )
	{
		$id = empty( $id ) ? $name : $id;

		// Must pass the field id to the buttons in this editor.
		$buttons = $this->displayButtons( $id, $buttons, $asset, $author );

		// Options for the CodeMirror constructor.
		$options = new stdClass;

		$displayData = ( object ) array(
			'id'      => $id,
			'name'    => $name,
			'cols'    => $col,
			'rows'    => $row,
			'params'  => $this->params,
			'options' => $options,
			'buttons' => $buttons,
			'content' => $content
		);

		// Get event dispatcher.
		$dispatcher = JEventDispatcher::getInstance();

		// Trigger an event to allow 3rd-party plugins to customize display data.
		$results = $dispatcher->trigger( 'onPageBuilderBeforeDisplay', array( &$displayData ) );

		// Render the editor.
		$results[] = JLayoutHelper::render( 'editors.pagebuilder2.element', $displayData, __DIR__ . '/layouts', array( 'debug' => JDEBUG ) );

		foreach ( $dispatcher->trigger( 'onPageBuilderAfterDisplay', array( &$displayData ) ) as $result )
		{
			$results[] = $result;
		}

		return implode( "\n", $results );
	}

	/**
	 * Displays the editor buttons.
	 *
	 * @param   string  $name     Button name.
	 * @param   mixed   $buttons  [array with button objects | boolean true to display buttons]
	 * @param   mixed   $asset    Unused.
	 * @param   mixed   $author   Unused.
	 *
	 * @return  string  HTML
	 */
	protected function displayButtons( $name, $buttons, $asset, $author )
	{
		$return = '';

		$args = array(
			'name'  => $name,
			'event' => 'onGetInsertMethod'
		);

		$results = ( array ) $this->update( $args );

		if ( $results )
		{
			foreach ( $results as $result )
			{
				if ( is_string( $result ) && trim( $result ) )
				{
					$return .= $result;
				}
			}
		}

		if ( is_array( $buttons ) || ( is_bool( $buttons ) && $buttons ) )
		{
			$buttons = $this->_subject->getButtons( $name, $buttons, $asset, $author );

			$return .= JLayoutHelper::render( 'joomla.editors.buttons', $buttons );
		}

		return $return;
	}
}
