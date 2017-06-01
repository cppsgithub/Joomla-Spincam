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

// Import necessary library.
jimport('joomla.filesystem.file');

/**
 * Handle Ajax requests from layout builder.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxAppearance extends SunFwAjax
{
	/**
	 * Save layout builder data to database.
	 *
	 * @throws  Exception
	 */
	private $_scssVars = array();

	/**
	 * Save data to database
	 *
	 * @throws Exception
	 */
    public function saveAction()
    {
        $post 			= $this->input->get('sunfw-appearance', array(), 'array');
        $type 			= $post['selected_type'];
        $sectionID 		= $post['section_id'];
        $moduleStyle 	= $post['module_style'];

        $data 			= array();
		$tmpData 		= array();

        if ( ! count( $post ) || ( $type == 'section' && $sectionID == '' ) || ( $type == 'module' && $moduleStyle == '' ) )
        {
            throw new Exception( 'Invalid Request' );
        }

        foreach ($post as $key => $value)
        {
        	$expKey = explode('-', $key, 3);
        	if (count($expKey) > 1)
        	{
        		if ($expKey[0] == 'section' && ($type == 'section'))
        		{
        			$expKey[0] = $sectionID;
        		}
        		elseif ($expKey[0] == 'module' && ($type == 'module'))
        		{
        			$expKey[0] = $moduleStyle;
        		}
        		else
        		{
        			//do nothing
        		}

        		$data ['appearance'][$expKey[0]][$expKey[1]][$expKey[2]] = $value;
        	}
        	else
        	{
        		$data ['appearance'][$key] = $value;
        	}
        }

        // Build query to save layout builder data.
        $style = SunFwHelper::getSunFwStyle( $this->styleID );
        $query = $this->dbo->getQuery( true );

        if ( count($style) )
        {
        	if ($style->appearance_data != '' && count(json_decode($style->appearance_data)))
        	{
        		$appearanceData = json_decode($style->appearance_data, true);
        		if ($type == 'section')
        		{
        			$appearanceData['appearance']['sections'][$sectionID] = $data['appearance'][$sectionID];
        		}
        		elseif ($type == 'module')
        		{
        			$appearanceData['appearance']['modules'][$moduleStyle] = $data['appearance'][$moduleStyle];
        		}
        		else
        		{
        			$appearanceData['appearance'][$type] = $data['appearance'][$type];
        		}
        		$query
        		->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
        		->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( json_encode($appearanceData) ) )
        		->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
        		->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
        	}
        	else
        	{
        		if ($type == 'section')
        		{
        			$tmpData['appearance']['sections'][$sectionID] = $data['appearance'][$sectionID];
        		}
        		elseif ($type == 'module')
        		{
        			$tmpData['appearance']['modules'][$moduleStyle] = $data['appearance'][$moduleStyle];
        		}
        		else
        		{
        			$tmpData['appearance'][$type] = $data['appearance'][$type];
        		}

        		$query
	                ->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
	                ->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( json_encode($tmpData) ) )
	                ->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
	                ->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
        	}
        }
        else
        {
	        if ($type == 'section')
			{
				$tmpData['appearance']['sections'][$sectionID] = $data['appearance'][$sectionID];
			}
			elseif ($type == 'module')
			{
				$tmpData['appearance']['modules'][$moduleStyle] = $data['appearance'][$moduleStyle];
			}
			else
			{
				$tmpData['appearance'][$type] = $data['appearance'][$type];
			}

        	$columns  = array( 'style_id', 'appearance_data', 'template' );
            $values   = array( intval( $this->styleID ), $this->dbo->quote( json_encode($tmpData) ), $this->dbo->quote( $this->templateName ) );

            $query
                ->insert( $this->dbo->quoteName( '#__sunfw_styles' ) )
                ->columns( $this->dbo->quoteName( $columns ) )
                ->values( implode( ',', $values ) );
        }

        // Execute query to save appearance data.
        try
        {
            $this->dbo->setQuery( $query );
            if ( ! $this->dbo->execute() )
            {
                throw new Exception( $this->dbo->getErrorMsg() );
            }
            else
            {
                $sufwrender = new SunFwScssrender();
                $sufwrender->compile($this->styleID, $this->templateName);

            }
        }
        catch ( Exception $e )
        {
            throw $e;
        }
    }

	/**
	 * Get Section Data
	 *
	 * @throws Exception
	 *
     * @return JSON
	 */
    public function getSectionDataAction()
    {
    	$sectionData 		= array();
    	$result 			= array();
    	$exclusive			= array();
    	$data 	 			= SunFwHelper::getSunFwStyle( $this->styleID );

    	if (!count($data))
    	{
    		$this->setResponse( $sectionData );
    		return true;
    	}

    	$data = json_decode($data->appearance_data, true);

    	if (isset($data['appearance']['sections']))
    	{
    		$data = $data['appearance']['sections'];
    	}

        if (!count($data))
    	{
    		$this->setResponse( $sectionData );
    		return true;
    	}

    	/* Get default Module Styles*/
//     	$defaultModuleStyles = SunFwHelper::getDefaultModuleStyle($this->styleID);
//     	if (count($defaultModuleStyles))
//     	{
// 	    	foreach ($defaultModuleStyles['appearance'] as $key => $value)
// 	    	{
// 	    		$exclusive [] = $key;
// 	    	}
//     	}

//     	$exclusive [] = 'general';

    	foreach ($data as $key => $items)
    	{
    		if (is_array($items) && count($items))
    		{
    			foreach ($items as $subKey => $subItems)
    			{
    				foreach ($subItems as $subSubKey => $subSubItem)
    				{
    					$result['appearance.' . $key . '.params'][$key . '-' . $subKey . '-' . $subSubKey] = $subSubItem;
    				}
    			}
    		}
    		else
    		{
    			$result['appearance.' . $key . '.params'] = $items;
    		}
    	}


    	if (count($result))
    	{
    		foreach ($result as $key => $params)
    		{
    			$expKey = explode('.', $key);
    			//if (!in_array($expKey[1], $exclusive))
    			//{
    			foreach ( $params as $subKey => $param )
    			{
					$newKey = str_replace ( $expKey [1] . '-', '', $subKey );
					$params [$newKey] = $param;
					unset ( $params [$subKey] );
				}

				$sectionData[$expKey[1]] = $params;
    			//}
    		}
    	}

    	$this->setResponse( $sectionData );
    	return true;
    }

    /**
     *
     * Get Module style data
     *
     * @throws Exception
     *
     * @return JSON
     */
    public function getModuleStyleDataAction()
    {
    	$defaultData		= array();
    	$inclusive			= array();
    	$moduleData 		= array();
    	$result 			= array();
    	$style 	 			= SunFwHelper::getSunFwStyle( $this->styleID );
    	$data				= array();

    	if (count($style))
    	{
	    	$data = json_decode($style->appearance_data, true);
	    	if (isset($data['appearance']['modules']))
	    	{
	    		$data = $data['appearance']['modules'];
	    	}
    	}

    	/* Get Default Module Style*/

    	$defaultModuleStyles = SunFwHelper::getDefaultModuleStyle($this->styleID);
    	if (!count($defaultModuleStyles))
    	{
    		throw new Exception( JText::_('SWNFW_HAS_NO_DEFAULT_MODULE_STYLE') );
    	}

    	foreach ($defaultModuleStyles['appearance']['modules'] as $key => $items)
    	{
    		$inclusive [] = $key;
    		foreach ($items as $subkey => $subItems)
    		{
    			foreach ($subItems as $subSubKey => $subSubItems)
    			{
    				$defaultData[$key][$subkey . '-' . $subSubKey] = $subSubItems;
    			}
    		}
    	}

    	/* Get Module Style in database */
    	if (count($data))
    	{
	    	foreach ($data as $key => $items)
	    	{
	    		if (is_array($items) && count($items))
	    		{
	    			foreach ($items as $subKey => $subItems)
	    			{
	    				foreach ($subItems as $subSubKey => $subSubItem)
	    				{
	    					$result['appearance.' . $key . '.params'][$key . '-' . $subKey . '-' . $subSubKey] = $subSubItem;
	    				}
	    			}
	    		}
	    		else
	    		{
	    			$result['appearance.' . $key . '.params'] = $items;
	    		}
	    	}
    	}

    	if (count($result))
    	{
    		foreach ($result as $key => $params)
    		{
    			$expKey = explode('.', $key);
    			if (in_array($expKey[1], $inclusive))
    			{
    				foreach ($params as $subKey => $param)
    				{
    					$newKey = str_replace($expKey[1] . '-', '', $subKey);
    					$params[$newKey] = $param;
    					unset($params[$subKey]);
    				}

    				$moduleData[$expKey[1]] = $params;
    			}
    		}
    	}

		if (!count($moduleData))
		{
			$this->setResponse( $defaultData );
			return true;
		}
		else
		{
			$moduleData = array_merge($defaultData, $moduleData);
			$this->setResponse( $moduleData );
			return true;
		}
    }

    /**
     *
     * Get Data Module Style
     *
     * @throws Exception
     *
     * @return Array
     */

    private function _getModulesVar($appearance)
    {
        $this->styleID      	= $this->input->getInt( 'style_id', 0 );
        $defaultModuleStyles = SunFwHelper::getDefaultModuleStyle($this->styleID);

        if (count($defaultModuleStyles) )
        {
            foreach ($defaultModuleStyles['appearance'] as $key => $items)
            {
                $this->_scssVarsModule[$key] = isset($appearance[$key])  ? $appearance[$key] : array();
            }
        }
    }

    /**
     * Auto save
     * @throws Exception
     */
    public function autoSaveAction()
    {
        $post 			= $this->input->get('sunfw-appearance', array(), 'array');
        $type 			= $post['selected_type'];
        $sectionID 		= $post['selected_section_id'];
        $moduleStyle 	= $post['selected_module_style'];

        $data 			= array();
		$tmpData 		= array();
        $this->styleID      	= $this->input->getInt( 'style_id', 0 );
        $this->templateName 	= $this->input->getString( 'template_name', '' );

        if ( ! $this->styleID || !count($post)|| empty( $this->templateName ) || ($type == 'section' && $sectionID == '') || ($type == 'module' && $moduleStyle == ''))
        {
            throw new Exception( 'Invalid Request' );
        }

        foreach ($post as $key => $value)
        {
        	$expKey = explode('-', $key, 3);
        	if (count($expKey) > 1)
        	{
        		if ($expKey[0] == 'section' && ($type == 'section'))
        		{
        			$expKey[0] = $sectionID;
        		}
        		elseif ($expKey[0] == 'module' && ($type == 'module'))
        		{
        			$expKey[0] = $moduleStyle;
        		}
        		else
        		{
        			//do nothing
        		}

        		$data ['appearance'][$expKey[0]][$expKey[1]][$expKey[2]] = $value;
        	}
        	else
        	{
        		$data ['appearance'][$key] = $value;
        	}
        }

        // Build query to save layout builder data.
        $style = SunFwHelper::getSunFwStyle( $this->styleID );
        $query = $this->dbo->getQuery( true );

        if ( count($style) )
        {
        	if ($style->appearance_data != '' && count(json_decode($style->appearance_data)))
        	{
        		$appearanceData = json_decode($style->appearance_data, true);
        		if ($type == 'section')
        		{
        			$appearanceData['appearance']['sections'][$sectionID] = $data['appearance'][$sectionID];
        		}
        		elseif ($type == 'module')
        		{
        			$appearanceData['appearance']['modules'][$moduleStyle] = $data['appearance'][$moduleStyle];
        		}
        		else
        		{
        			$appearanceData['appearance'][$type] = $data['appearance'][$type];
        		}
        		$query
        		->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
        		->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( json_encode($appearanceData) ) )
        		->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
        		->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
        	}
        	else
        	{
        		if ($type == 'section')
        		{
        			$tmpData['appearance']['sections'][$sectionID] = $data['appearance'][$sectionID];
        		}
        		elseif ($type == 'module')
        		{
        			$tmpData['appearance']['modules'][$moduleStyle] = $data['appearance'][$moduleStyle];
        		}
        		else
        		{
        			$tmpData['appearance'][$type] = $data['appearance'][$type];
        		}

        		$query
	                ->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
	                ->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( json_encode($tmpData) ) )
	                ->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
	                ->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );
        	}
        }
        else
        {
	        if ($type == 'section')
			{
				$tmpData['appearance']['sections'][$sectionID] = $data['appearance'][$sectionID];
			}
			elseif ($type == 'module')
			{
				$tmpData['appearance']['modules'][$moduleStyle] = $data['appearance'][$moduleStyle];
			}
			else
			{
				$tmpData['appearance'][$type] = $data['appearance'][$type];
			}

        	$columns  = array( 'style_id', 'appearance_data', 'template' );
            $values   = array( intval( $this->styleID ), $this->dbo->quote( json_encode($tmpData) ), $this->dbo->quote( $this->templateName ) );

            $query
                ->insert( $this->dbo->quoteName( '#__sunfw_styles' ) )
                ->columns( $this->dbo->quoteName( $columns ) )
                ->values( implode( ',', $values ) );
        }

        // Execute query to save appearance data.
        try
        {
            $this->dbo->setQuery( $query );
            if ( ! $this->dbo->execute() )
            {
                throw new Exception( $this->dbo->getErrorMsg() );
            }
        }
        catch ( Exception $e )
        {
            throw $e;
        }
    }

	/**
	 * Get Layout Builder Section List Action
	 * @return string
	 */
    public function getLayoutBuilderSectionListAction()
    {
    	$data 	 			= SunFwHelper::getSunFwStyle( $this->styleID );
    	$sections			= array();
    	array_unshift($sections , array('text' => '-- ' . JText::_('SUNFW_SELECT_SECTION') . ' --', 'value' => '', 'data-type' => 'section'));

    	if (!count($data))
    	{
    		$this->setResponse( $sections );
    		return true;
    	}


    	if ($data->layout_builder_data != '')
    	{
    		$layoutBuilder		= json_decode($data->layout_builder_data, true);

    		if (isset($layoutBuilder['sections']) && count($layoutBuilder['sections']))
    		{
    			foreach ($layoutBuilder['sections'] as $section)
    			{
    				if (is_array($section))
    				{
	    				$tmp 				= array();
	    				$tmp['text'] 		= $section['label'];
	    				$tmp['value'] 		= $section['id'];
	    				$sections [] 		= $tmp;
    				}
    			}
    		}

    	}

		$this->setResponse( $sections );
    	return true;
    }

    /**
     * Get preset
     */
    public function getPresetAction()
    {
    	$result    = array();
    	$presetKey = $this->input->getString('preset_key', '');

    	if ( empty( $presetKey ) )
    	{
    		throw new Exception( 'Invalid Request' );
    	}

    	$style			= SunFwHelper::getTemplateStyle($this->styleID);
    	$sunStyle		= SunFwHelper::getSunFwStyle($this->styleID);
    	$appearanceData = array();

    	if (count($sunStyle))
    	{
    		if (isset($sunStyle->appearance_data))
    		{
    			if ($sunStyle->appearance_data != '')
    			{
    				$appearanceData = json_decode($sunStyle->appearance_data, true);
    			}
    		}
    	}

    	if ($presetKey != '' && count($style))
    	{
    		$objSunFwPresets 	= new SunFwPresets();
    		$presets 			= $objSunFwPresets->getPresetList($style);


    		if (count($presets))
    		{
    			if (isset($presets[$presetKey]))
    			{
    				$presetData 						= $presets[$presetKey];
    				$tmpAppearanceData['appearance'] 	= (array) $presetData['appearance'];

    				if (count($appearanceData))
    				{
	    				if (isset($appearanceData['appearance']['general']) || !isset($appearanceData['appearance']['general']))
	    				//if (isset($appearanceData['appearance']['general']))
						{
							if (isset($tmpAppearanceData['appearance']['general']))
							{
								$appearanceData['appearance']['general'] = $tmpAppearanceData['appearance']['general'];
							}
						}


						//if (isset($appearanceData['appearance']['sections']) || !isset($appearanceData['appearance']['sections']))
						if (isset($appearanceData['appearance']['sections']))
						{
							if (isset($tmpAppearanceData['appearance']['sections']))
							{
								$sections = $appearanceData['appearance']['sections'];

								foreach ($sections as $skey => $section)
								{
									if (isset($tmpAppearanceData['appearance']['sections'][$skey]))
									{
										$appearanceData['appearance']['sections'][$skey] = $tmpAppearanceData['appearance']['sections'][$skey];
									}
								}
							}
						}

						//if (isset($appearanceData['appearance']['modules']) || !isset($appearanceData['appearance']['modules']))
						if (isset($appearanceData['appearance']['modules']))
						{
							if (isset($tmpAppearanceData['appearance']['modules']))
							{
								$modules = $appearanceData['appearance']['modules'];

								foreach ($modules as $skey => $module)
								{
									if (isset($tmpAppearanceData['appearance']['modules'][$skey]))
									{
										$appearanceData['appearance']['modules'][$skey] = $tmpAppearanceData['appearance']['modules'][$skey];
									}
								}
							}
						}
						else
						{
							$appearanceData['appearance']['modules'] = $tmpAppearanceData['appearance']['modules'];
						}
					}
					else
					{
						$appearanceData['appearance'] = (array) $presetData['appearance'];
					}

					if (count($appearanceData))
					{
						$query = $this->dbo->getQuery( true );
						$query
						->update( $this->dbo->quoteName( '#__sunfw_styles' ) )
						->set( $this->dbo->quoteName( 'appearance_data' ) . '=' . $this->dbo->quote( json_encode($appearanceData) ) )
						->where( $this->dbo->quoteName( 'style_id' ) . '=' . intval( $this->styleID ) )
						->where( $this->dbo->quoteName( 'template' ) . '=' . $this->dbo->quote( $this->templateName ) );

						$this->dbo->setQuery( $query );

						if ( ! $this->dbo->execute() )
						{
							throw new Exception( $this->dbo->getErrorMsg() );
						}

						$data = $appearanceData['appearance']['general'];

						foreach ($data as $key => $items)
						{
							if (is_array($items) && count($items))
							{
								foreach ($items as $subKey => $subItems)
								{
									$result[$key . '-' . $subKey ] = $subItems;
								}
							}

						}

						$this->setResponse($result);
						return;
					}
    				$this->setResponse(array());
    				return;
    			}
    		}
    	}

    	$this->setResponse(array());
    	return;
    }
}
