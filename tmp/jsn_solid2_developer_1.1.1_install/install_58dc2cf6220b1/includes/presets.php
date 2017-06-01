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

// Import necessary library.
jimport('joomla.filesystem.file');
/**
 * General Utils class.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwPresets
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
	
	public function __construct() 
	{
		$this->app 		= JFactory::getApplication();
		$this->input 	= $this->app->input;
	}
	
	/**
	 * Get the preset list
	 * 
	 * @return array the preset list
	 */
	public function getPresetList($style)
	{
		$presets	= array();
		if (count($style))
		{
			$presetFile = JPath::clean( JPATH_SITE . "/templates/" . $style->template . "/presets/presets.json" );
			if (JFile::exists($presetFile))
			{
				$presetContent 	= file_get_contents($presetFile);
				$presets		= json_decode($presetContent, true);
			}
		}
		
		return $presets;
	}
	
	/**
	 * Render preset in HTML code
	 * 
	 * @return String
	 */
	public function renderPreset()
	{
		$html 		= '';
		$styleID 	= $this->input->getInt('id', 0);
		$style		= SunFwHelper::getTemplateStyle($styleID);
		
		$presets = $this->getPresetList($style);
		
		if (count($presets))
		{
			$html .= '<div class="sunfw-appearance-preset-container">';
			$html .= '<ul class="sunfw-appearance-preset-grid">';
			foreach ($presets as $key => $preset)
			{
				$html .= '<li class="sunfw-appearance-preset-block"><a data-preset-key="' . $key . '" class="preset-thumb" href="#"><img src="' . JUri::root(true) . '/templates/' . $style->template . '/presets/' . $preset['image'] . '"></a><span class="preset-description"> ' . $preset['description'] . '</span></li>';
			}
			$html .= '</ul>';
			$html .= '</div>';
			$html .= '<div class="sunfw-clearbreak"></div>';
		}
		
		return $html;
	}
	
	/**
	 * Update section id in preset file when change section name in layout builder
	 * 
	 * @param int $styleID the style ID
	 * @param string $oldSectionID the old ID
	 * @param string $newSectionID the new ID
	 */
	public function updatePresetSection($styleID, $oldSectionID, $newSectionID)
	{
		$style		= SunFwHelper::getTemplateStyle($styleID);
		$presets 	= $this->getPresetList($style);
		$tmp		= array();
		if (count($presets))
		{
			foreach ($presets as $pkey => $preset) 
			{
				$appearances = $preset['appearance'];
				if (count($appearances))
				{
					foreach ($appearances as $key => $appearance)
					{
						if ($key == 'sections')
						{
							$sections = $appearances[$key];
							if (count($sections))
							{
								foreach ($sections as $skey => $section)
								{
									if ($skey == $oldSectionID)
									{
										$sections[$newSectionID] = $section;
										unset($sections[$oldSectionID]);
									}
								}
								$tmp[$pkey] = $preset;
								$tmp[$pkey]['appearance']['sections'] = $sections;
								
							}
							
							break;
						}
					}
				}
			}
			
			if (count($tmp))
			{
				$jsonString = json_encode($tmp);
				$jsonString = SunFwUltils::indentJSONString($jsonString);
				$presetFile = JPath::clean( JPATH_SITE . "/templates/" . $style->template . "/presets/presets.json" );
				if ( ! JFile::write( $presetFile, $jsonString ) )
				{
					return false;
				}
			}
		}
		return true;
	}
}
