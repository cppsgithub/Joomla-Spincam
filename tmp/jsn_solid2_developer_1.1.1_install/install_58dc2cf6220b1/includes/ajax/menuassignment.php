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
 * Handle Ajax requests from Menu Assignment
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwAjaxMenuAssignment extends SunFwAjax
{
	/**
	 * Save data to database
	 *
	 * @throws Exception
	 */
	public function saveAction()
	{
		$data = $this->input->get('sunfw-menu-assignment', array(), 'array');

		// Detect disabled extension
		$extension = JTable::getInstance('Extension');

		if ($extension->load(array('enabled' => 0, 'type' => 'template', 'element' => $this->templateName, 'client_id' => 0)))
		{
			throw new Exception(JText::_('SUNFW_ERROR_SAVE_DISABLED_TEMPLATE'));

		}

		$user = JFactory::getUser();
		if ($user->authorise('core.edit', 'com_menus'))
		{
			if (!empty($data['assigned']) && is_array($data['assigned']))
			{
				$data['assigned'] = Joomla\Utilities\ArrayHelper::toInteger($data['assigned']);

				// Update the mapping for menu items that this style IS assigned to.
				$query = $this->dbo->getQuery(true)
				->update('#__menu')
				->set('template_style_id = ' . (int) $this->styleID)
				->where('id IN (' . implode(',', $data['assigned']) . ')')
				->where('template_style_id != ' . (int) $this->styleID)
				->where('checked_out IN (0,' . (int) $user->id . ')');
				$this->dbo->setQuery($query);

				try
				{
					$this->dbo->execute();
				}
				catch ( Exception $e )
				{
					throw $e;
				}
			}
			// Remove style mappings for menu items this style is NOT assigned to.
			// If unassigned then all existing maps will be removed

			$query = $this->dbo->getQuery(true)
			->update('#__menu')
			->set('template_style_id = 0');

			if (!empty($data['assigned']))
			{
				$query->where('id NOT IN (' . implode(',', $data['assigned']) . ')');
			}

			$query->where('template_style_id = ' . (int) $this->styleID)
			->where('checked_out IN (0,' . (int) $user->id . ')');
			$this->dbo->setQuery($query);
			$this->dbo->execute();

			try
			{
				$this->dbo->execute();
			}
			catch ( Exception $e )
			{
				throw $e;
			}
		}

		$this->setResponse( array( 'message' => JText::_( 'SUNFW_SAVED_SUCCESSFULLY' ) ) );
		return;
	}

}
