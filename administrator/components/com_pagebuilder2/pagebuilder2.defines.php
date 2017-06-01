<?php
/**
 * 1.1.6    $Id$
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

define('JSN_PAGEBUILDER2_DEPENDENCY', '[{"type":"plugin","folder":"system","name":"jsnframework","identified_name":"ext_framework","client":"site","publish":"1","lock":"1","title":"JSN Extension Framework System Plugin"},{"type":"plugin","folder":"system","name":"pagebuilder2","dir":"plugins\/system\/pagebuilder2","client":"site","publish":"1","lock":"1","title":"JSN PageBuilder2 System Plugin"},{"type":"plugin","folder":"content","name":"pb2loadmodule","dir":"plugins\/content\/pb2loadmodule","client":"site","publish":"1","lock":"1","title":"JSN PageBuilder2 Load Module Plugin"},{"type":"plugin","folder":"editors","name":"pagebuilder2","dir":"plugins\/editors\/pagebuilder2","client":"site","publish":"1","lock":"1","title":"JSN PageBuilder2 Editor Plugin"},{"type":"plugin","folder":"pagebuilder2","name":"elements","dir":"plugins\/pagebuilder2\/elements","client":"site","publish":"1","lock":"1","title":"JSN PageBuilder2 Elements Plugin"},{"type":"plugin","folder":"pagebuilder2","name":"templates","dir":"plugins\/pagebuilder2\/templates","client":"site","publish":"1","lock":"1","title":"JSN PageBuilder2 Templates Plugin"}]');

// Define product identified name and version
define('JSN_PAGEBUILDER2_IDENTIFIED_NAME', 'ext_pagebuilder2');
define('JSN_PAGEBUILDER2_VERSION', '1.1.6');
define('JSN_PAGEBUILDER2_EDITION', 'FREE');

// Define required Joomla version
define('JSN_PAGEBUILDER2_REQUIRED_JOOMLA_VER', '3.0');

// Only define below constant if product has multiple edition
// define('JSN_PAGEBUILDER2_EDITION', 'free');

// Define some necessary links
define('JSN_PAGEBUILDER2_INFO_LINK',   'http://www.joomlashine.com/joomla-extensions/jsn-pagebuilder2.html');
define('JSN_PAGEBUILDER2_DOC_LINK',    'http://www.joomlashine.com/joomla-extensions/jsn-pagebuilder2-docs.zip');
define('JSN_PAGEBUILDER2_REVIEW_LINK', 'http://www.joomlashine.com/joomla-extensions/jsn-pagebuilder2-on-jed.html');
define('JSN_PAGEBUILDER2_UPDATE_LINK', 'index.php?option=com_pagebuilder2&view=update');

// If product has multiple edition, define upgrade link also
define('JSN_PAGEBUILDER2_UPGRADE_LINK', 'index.php?option=com_pagebuilder2&view=upgrade');
// If product is commercial, define buy link too
define('JSN_PAGEBUILDER2_BUY_LINK', 'http://www.joomlashine.com/joomla-extensions/jsn-pagebuilder2-buy-now.html');