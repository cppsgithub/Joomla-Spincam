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
 * Widget that list all articles for selection.
 *
 * @package  SUN Framework
 * @since    1.0.0
 */
class SunFwWidgetArticles extends SunFwWidgetBase
{
	public function listAction()
	{
		// Verify token.
		JSession::checkToken('get') or die('Invalid Token');

		// Get current session.
		$this->session = JFactory::getSession();

		// Get request data.
		$state    = $this->input->getString('state', '*');
		$category = $this->input->getString('category', '');
		$access   = $this->input->getString('access', '');
		$author   = $this->input->getString('uauthor', '');
		$language = $this->input->getString('language', '');
		$search   = $this->input->getString('search', '');

		// Store request data to current session.
		$this->session->set('filters.sunfw.widget.articles.list.state', $state);
		$this->session->set('filters.sunfw.widget.articles.list.category', $category);
		$this->session->set('filters.sunfw.widget.articles.list.access', $access);
		$this->session->set('filters.sunfw.widget.articles.list.author', $author);
		$this->session->set('filters.sunfw.widget.articles.list.language', $language);
		$this->session->set('filters.sunfw.widget.articles.list.search', $search);

		// Get list of article based on specified filters.
		$this->articles = $this->getArticleList();

		$this->render('list');
	}

	/**
	 * Render list of article state for filtering.
	 *
	 * @param   string  $selected
	 * @param   string  $name
	 * @param   string  $parameters
	 *
	 * @return  string
	 */
	public function renderArticleStateFilter($selected, $name, $parameters = '')
	{
		// Build the filter options.
		$options = array();

		$options[] = JHtml::_('select.option', '*', JText::_('SUNFW_ANY_STATUS'));
		$options[] = JHtml::_('select.option', '1', JText::_('JPUBLISHED'));
		$options[] = JHtml::_('select.option', '0', JText::_('JUNPUBLISHED'));
		$options[] = JHtml::_('select.option', '2', JText::_('JARCHIVED'));
		$options[] = JHtml::_('select.option', '-2', JText::_('JTRASHED'));

		return JHTML::_('select.genericlist', $options, $name, $parameters, 'value', 'text', $selected);
	}

	/**
	 * Render list of article category for filtering.
	 *
	 * @param   string  $selected
	 * @param   string  $name
	 * @param   string  $parameters
	 *
	 * @return  string
	 */
	public function renderArticleCategoryFilter($selected, $name, $parameters = '')
	{
		// Build the filter options.
		$filters = array();

		if ( $this->session->get('filters.sunfw.widget.articles.list.state') != '*' )
		{
			$filters['filter.published'] = explode( ',', $this->session->get('filters.sunfw.widget.articles.list.state') );
		}

		if ( $this->session->get('filters.sunfw.widget.articles.list.language') != '' )
		{
			$filters['filter.language' ] = explode( ',', $this->session->get('filters.sunfw.widget.articles.list.language') );
		}

		$options = JHtml::_('category.options', 'com_content', $filters);

		// Displays language code if not set to All.
		foreach ($options as $option)
		{
			// Create a new query object.
			$query = $this->dbo->getQuery(true)
				->select('language')
				->where('id = ' . (int) $option->value)
				->from('#__categories');

			$this->dbo->setQuery($query);

			$language = $this->dbo->loadResult();

			if ($language !== '*')
			{
				$option->text = $option->text . ' (' . $language . ')';
			}
		}

		array_unshift( $options, (object) array('text' => JText::_('SUNFW_ANY_CATEGORY'), 'value' => '') );

		return JHTML::_('select.genericlist', $options, $name, $parameters, 'value', 'text', $selected);
	}

	/**
	 * Render list of article access for filtering.
	 *
	 * @param   string  $selected
	 * @param   string  $name
	 * @param   string  $parameters
	 *
	 * @return  string
	 */
	public function renderArticleAccessFilter($selected, $name, $parameters = '')
	{
		// Build the filter options.
		$options = array( (object) array('text' => JText::_('SUNFW_ANY_ACCESS'), 'value' => '') );

		return JHtml::_('access.level', $name, $selected, $parameters, $options);
	}

	/**
	 * Render list of article author for filtering.
	 *
	 * @param   string  $selected
	 * @param   string  $name
	 * @param   string  $parameters
	 *
	 * @return  string
	 */
	public function renderArticleAuthorFilter($selected, $name, $parameters = '')
	{
		// Build the filter options.
		$query = $this->dbo->getQuery(true)
			->select('u.id AS value, u.name AS text')
			->from('#__users AS u')
			->join('INNER', '#__content AS c ON c.created_by = u.id')
			->group('u.id, u.name')
			->order('u.name');

		$this->dbo->setQuery($query);

		if ( ! ( $options = $this->dbo->loadObjectList() ) )
		{
			$options = array();
		}

		array_unshift( $options, (object) array('text' => JText::_('SUNFW_ANY_AUTHOR'), 'value' => '') );

		return JHTML::_('select.genericlist', $options, $name, $parameters, 'value', 'text', $selected);
	}

	/**
	 * Render list of article language for filtering.
	 *
	 * @param   string  $selected
	 * @param   string  $name
	 * @param   string  $parameters
	 *
	 * @return  string
	 */
	public function renderArticleLanguageFilter($selected, $name, $parameters = '')
	{
		// Build the filter options.
		if ( $options = JHtml::_('contentlanguage.existing') )
		{
			array_unshift( $options, (object) array('text' => JText::_('SUNFW_ANY_LANGUAGE'), 'value' => '') );
		}
		else
		{
			$options = array( (object) array('text' => JText::_('SUNFW_ANY_LANGUAGE'), 'value' => '') );
		}

		return JHTML::_('select.genericlist', $options, $name, $parameters, 'value', 'text', $selected);
	}

	/**
	 * Get query to retrieve all articles based on specified filters.
	 *
	 * @return  string
	 */
	public function getArticleListQuery()
	{
		// Create a new query object.
		$query = $this->dbo->getQuery(true);

		// Select from content table.
		$query
			->select('a.id, a.title, a.state')
			->from('#__content AS a');

		// Join with categories table.
		$query
			->select('c.title AS category')
			->join('LEFT', '#__categories AS c ON c.extension = "com_content" AND c.id = a.catid');

		// And languages table.
		$query
			->select('l.title AS language_title, l.image AS language_image')
			->join('LEFT', '#__languages AS l ON l.lang_code = a.language');

		// And users table.
		$query
			->select('u.name AS author')
			->join('LEFT', '#__users AS u ON u.id = a.created_by');

		// And view levels table.
		$query
			->select('ag.title AS access_level')
			->join('LEFT', '#__viewlevels AS ag ON ag.id = a.access');

		// Filter by article state.
		if ( is_numeric( $state = $this->session->get('filters.sunfw.widget.articles.list.state') ) )
		{
			$query->where('a.state = ' . (int) $state);
		}

		// Filter by article category.
		if ( ! empty( $category = $this->session->get('filters.sunfw.widget.articles.list.category') ) )
		{
			$query->where('a.catid = ' . (int) $category);
		}

		// Filter by access level.
		if ( ! empty( $access = $this->session->get('filters.sunfw.widget.articles.list.access') ) )
		{
			$query->where('a.access = ' . (int) $access);
		}

		// Filter by author.
		if ( ! empty( $author = $this->session->get('filters.sunfw.widget.articles.list.author') ) )
		{
			$query->where('a.created_by = ' . (int) $author);
		}

		// Filter on the language.
		if ( ! empty( $language = $this->session->get('filters.sunfw.widget.articles.list.language') ) )
		{
			if ($language === 'current')
			{
				$query->where('a.language IN (' . $this->dbo->quote( JFactory::getLanguage()->getTag() ) . ', ' . $this->dbo->quote('*') . ')');
			}
			else
			{
				$query->where( 'a.language = ' . $this->dbo->quote($language) );
			}
		}

		// Filter by keyword.
		if ( ! empty( $search = $this->session->get('filters.sunfw.widget.articles.list.search') ) )
		{
			if (stripos($search, 'id:') === 0)
			{
				$query->where( 'a.id = ' . (int) substr($search, 3) );
			}
			else
			{
				$search = $this->dbo->quote('%' . strtolower($search) . '%');

				$query->where('(LOWER(a.title) LIKE ' . $search . ' OR LOWER(a.introtext) LIKE ' . $search . ')');
			}
		}

		return $query;
	}

	/**
	 * Get article list based on specified filters.
	 *
	 * @return  array
	 */
	public function getArticleList()
	{
		$this->dbo->setQuery( $this->getArticleListQuery() );

		return $this->dbo->loadObjectList();
	}
}
