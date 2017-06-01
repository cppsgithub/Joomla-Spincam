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

// No direct access to this file.
defined('_JEXEC') or die('Restricted access');
JHTML::_('behavior.modal'); 
// Load required stylesheets.
JSNHtmlAsset::addStyle( JUri::root( true ) . '/plugins/editors/pagebuilder2/assets/app/app.css' );
JSNHtmlAsset::addStyle( JUri::root( true ) . '/plugins/editors/pagebuilder2/assets/vendor/codemirror.css' );
JSNHtmlAsset::addStyle( JUri::root( true ) . '/plugins/editors/pagebuilder2/assets/vendor/codemirror-theme.css' );
JSNHtmlAsset::addStyle( JUri::root( true ) . '/plugins/editors/pagebuilder2/assets/vendor/semantic/icon.min.css' );
JSNHtmlAsset::addStyle( 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' );

// Load required scripts.
//JSNHtmlAsset::addScriptLibrary( 'sortable-js', 'http://cdnjs.cloudflare.com/ajax/libs/Sortable/1.4.2/Sortable' );
//JSNHtmlAsset::addScriptLibrary( 'babel'      , JUri::root( true ) . '/plugins/editors/pagebuilder2/assets/vendor/babel.min' );
JSNHtmlAsset::addScriptLibrary( 'underscore' , JUri::root( true ) . '/plugins/editors/pagebuilder2/assets/vendor/underscore.min' );
JSNHtmlAsset::addScriptLibrary( 'react'      , JUri::root( true ) . '/plugins/editors/pagebuilder2/assets/vendor/react-with-addons' );
JSNHtmlAsset::addScriptLibrary( 'react-dom'  , JUri::root( true ) . '/plugins/editors/pagebuilder2/assets/vendor/react-dom' );
JSNHtmlAsset::addScriptLibrary( 'jsn-pb-2'   , JUri::root( true ) . '/plugins/editors/pagebuilder2/assets/app/app' );
