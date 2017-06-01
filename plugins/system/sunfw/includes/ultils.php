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

// No direct access to this file.
defined('_JEXEC') or die('Restricted access');

/**
 * General Utils class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwUltils
{
	public static function jsonValidate($string)
	{
		// decode the JSON data
		$result = json_decode($string);
		$error = '';
		// switch and check possible JSON errors
		switch (json_last_error()) {
			case JSON_ERROR_NONE:
				$error = ''; // JSON is valid // No error has occurred
				break;
			case JSON_ERROR_DEPTH:
				$error = 'The maximum stack depth has been exceeded.';
				break;
			case JSON_ERROR_STATE_MISMATCH:
				$error = 'Invalid or malformed JSON.';
				break;
			case JSON_ERROR_CTRL_CHAR:
				$error = 'Control character error, possibly incorrectly encoded.';
				break;
			case JSON_ERROR_SYNTAX:
				$error = 'Syntax error, malformed JSON.';
				break;
				// PHP >= 5.3.3
			case JSON_ERROR_UTF8:
				$error = 'Malformed UTF-8 characters, possibly incorrectly encoded.';
				break;
			default:
				$error = 'Unknown JSON error occured.';
				break;
		}

		if ($error !== '') {
			// throw the Exception or exit // or whatever :)
			return false;
		}

		// everything is OK
		return true;
	}

	/**
	 * Check if SH404Sef is installed or not.
	 *
	 * @return  boolean
	 */
	public static function checkSH404SEF()
	{
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		$query->clear();
		$query->select('COUNT(*)');
		$query->from('#__extensions');
		$query->where('type = ' . $db->quote('component') . ' AND element = ' . $db->quote('com_sh404sef'));
		$db->setQuery($query);
		return (int) $db->loadResult();
	}

	/**
	 * Format JSON string
	 * @param string $json JSON string
	 */
	public static function indentJSONString($json) {
		$result = '';
		$pos = 0;
		$strLen = strlen ( $json );
		$indentStr = "\t";
		$newLine = "\n";

		for($i = 0; $i < $strLen; $i ++) {
			// Grab the next character in the string.
			$char = $json [$i];

			// Are we inside a quoted string?
			if ($char == '"') {
				// search for the end of the string (keeping in mind of the escape sequences)
				if (! preg_match ( '`"(\\\\\\\\|\\\\"|.)*?"`s', $json, $m, null, $i ))
					return $json;

					// add extracted string to the result and move ahead
					$result .= $m [0];
					$i += strLen ( $m [0] ) - 1;
					continue;
			} else if ($char == '}' || $char == ']') {
				$result .= $newLine;
				$pos --;
				$result .= str_repeat ( $indentStr, $pos );
			}

			// Add the character to the result string.
			$result .= $char;

			// If the last character was the beginning of an element,
			// output a new line and indent the next line.
			if ($char == ',' || $char == '{' || $char == '[') {
				$result .= $newLine;
				if ($char == '{' || $char == '[') {
					$pos ++;
				}

				$result .= str_repeat ( $indentStr, $pos );
			}
		}

		return $result;
	}

	/**
	 * Check item menu is the last menu
	 *
	 */
	public static function isLastMenu($item)
	{
		if(isset($item->tree[0]) && isset($item->tree[1])) {
			$db	= JFactory::getDbo();
			$q	= $db->getQuery(true);

			$q->select('lft, rgt');
			$q->from('#__menu');
			$q->where('id = ' . (int) $item->tree[0], 'OR');
			$q->where('id = ' . (int) $item->tree[1]);

			$db->setQuery($q);

			$results = $db->loadObjectList();

			if ($results[1]->rgt == ((int) $results[0]->rgt - 1) && $item->deeper)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}

	/**
	 * generate a randon string
	 * @return string
	 */
	public static function generateRandString()
	{
		$length			= 4;
		$chars		  = 'abcdefghijklmnopqrstuvwxyz';
		$chars_length = (strlen($chars) - 1);
		$string		 	= $chars{rand(0, $chars_length)};
		for ($i = 1; $i < $length; $i = strlen($string))
		{
			$r = $chars{rand(0, $chars_length)};
			if ($r != $string{$i - 1})
			{
				$string .= $r;
			}
		}

		$fullString = dechex(time() + mt_rand(0, 10000000)) . $string;
		$result	  	= strtoupper(substr($fullString, 2, 10));
		return $result;
	}

	/**
	 * Check System Minimum Requirements
	 *
	 * @return multitype:Ambigous <string, string, mixed>
	 */
	public static function checkSystemRequirements()
	{
		$msg	 			= array();
		$requirementFile 	= SUNFW_PATH . '/requirements.json';

		if (file_exists($requirementFile))
		{
			$content = file_get_contents($requirementFile);
			$content = json_decode($content, true);

			if (count($content) && isset($content['system']))
			{
				//check PHP
				if (isset($content['system']['php']))
				{
					if (version_compare(PHP_VERSION, $content['system']['php']['minimum_version']) < 0)
					{
						$msg [] = JText::sprintf('SUNFW_SYSTEM_REQUIRMENT_PHP', $content['system']['php']['minimum_version']);
					}
				}
			}
		}
		return $msg;

	}

	/**
	 * Check Browser Minimum Requirements
	 *
	 * @return multitype:Ambigous <string, string, mixed>
	 */
	public static function checkBrowserRequirements()
	{
		$jbrowser 	= JBrowser::getInstance();
		$version 	= $jbrowser->getVersion();
		$browser 	= $jbrowser->getBrowser();
		$agent 		= $jbrowser->getAgentString();

		if ($browser == 'mozilla')
		{
			// fix bug for JBrowser
			if (preg_match('|Firefox[/ ]([0-9.]+)|', $agent, $tmpVersion))
			{
				$browser = 'firefox';
				list ($majorVersion, $minorVersion) = explode('.', $tmpVersion[1]);
				$version = $majorVersion . '.' . $minorVersion;
			}
		}
		elseif ($browser == 'chrome')
		{
			// Fix for joomla 3.5
			if (preg_match('|OPR[/ ]([0-9.]+)|', $agent, $tmpVersion))
			{
				$browser = 'opera';
				list ($majorVersion, $minorVersion) = explode('.', $tmpVersion[1]);
				$version = $majorVersion . '.' . $minorVersion;
			}
			elseif (preg_match('|Edge[/ ]([0-9.]+)|', $agent, $tmpVersion))
			{
				$browser = 'edge';
				list ($majorVersion, $minorVersion) = explode('.', $tmpVersion[1]);
				$version = $majorVersion . '.' . $minorVersion;

				return array();
			}
		}

		$msg	 			= array();
		$requirementFile 	= SUNFW_PATH . '/requirements.json';

		if (file_exists($requirementFile))
		{
			$content = file_get_contents($requirementFile);
			$content = json_decode($content, true);
			if (count($content) && isset($content['browsers']))
			{
				if (isset($content['browsers'][$browser]))
				{
					$minimumVersion = $content['browsers'][$browser]['minimum_version'];
					if (version_compare($version, $minimumVersion) < 0)
					{
						$msg [] = JText::_('SUNFW_SYSTEM_REQUIRMENT_BROWSER');
					}
				}
			}
		}

		return $msg;
	}
}
