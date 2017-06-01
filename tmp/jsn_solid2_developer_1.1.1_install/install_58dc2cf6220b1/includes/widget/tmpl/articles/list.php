<?php
/**
 * @version     $Id$
 * @package     JSNExtension
 * @subpackage  JSNTPLFramework
 * @author      JoomlaShine Team <support@joomlashine.com>
 * @copyright   Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license     GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// Get URLs.
$pathOnly = JURI::root(true);
$pathRoot = JURI::root();

// Prepare action link.
$link = 'index.php?sunfwwidget=articles&action=list&rformat=raw&author=joomlashine&style_id=' . $this->input->getInt( 'style_id', 0 )
	. '&' . JSession::getFormToken() . '=1&template_name=' . $this->input->getCmd( 'template_name', '' );
?>
<script src="<?php echo $pathOnly; ?>/media/jui/js/jquery.min.js"></script>

<link rel="stylesheet" href="<?php echo $pathOnly; ?>/plugins/system/sunfw/assets/3rd-party/bootstrap/style.css" />
<link rel="stylesheet" href="<?php echo $pathOnly; ?>/plugins/system/sunfw/assets/3rd-party/font-awesome/css/font-awesome.min.css" />
<link rel="stylesheet" href="<?php echo $pathOnly; ?>/plugins/system/sunfw/assets/joomlashine/admin/css/modules.css" />

<style type="text/css">
	.searchtools-module-container-filters {
		position: fixed;
		height: calc(100% - 10px);
		overflow-y: auto;
	}
</style>

<form method="post" name="adminForm" id="adminForm" class="container-fluid form-select-module" action="<?php echo $link; ?>">
	<div class="row">
		<div class="col-xs-3 searchtools-module-container-filters">
			<div class="searchtools-module-field-filter">
				<i class="fa fa-search" aria-hidden="true" onclick="document.getElementById('adminForm').submit();"></i>
				<input type="text" name="search" class="form-control" value="<?php
					echo $this->session->get('filters.sunfw.widget.articles.list.search', '');
				?>" placeholder="<?php
					echo JText::_( 'SUNFW_SEARCH_FOR' );
				?>" />
			</div>
			<div class="searchtools-module-field-filter">
				<?php echo $this->renderArticleStateFilter($this->session->get('filters.sunfw.widget.articles.list.state'), 'state'); ?>
			</div>
			<div class="searchtools-module-field-filter">
				<?php echo $this->renderArticleCategoryFilter($this->session->get('filters.sunfw.widget.articles.list.category'), 'category'); ?>
			</div>
			<div class="searchtools-module-field-filter">
				<?php echo $this->renderArticleAccessFilter($this->session->get('filters.sunfw.widget.articles.list.access'), 'access'); ?>
			</div>
			<div class="searchtools-module-field-filter">
				<?php echo $this->renderArticleAuthorFilter($this->session->get('filters.sunfw.widget.articles.list.author'), 'uauthor'); ?>
			</div>
			<div class="searchtools-module-field-filter">
				<?php echo $this->renderArticleLanguageFilter($this->session->get('filters.sunfw.widget.articles.list.language'), 'language'); ?>
			</div>
			<div class="clearfix">
				<button type="submit" class="btn btn-default pull-left apply-filters">
					<?php echo JText::_( 'SUNFW_APPLY' ); ?>
				</button>
				<button type="reset" class="btn btn-default pull-right clear-filters">
					<?php echo JText::_( 'SUNFW_CLEAR' ); ?>
				</button>
			</div>
		</div>

		<div class="col-xs-9 col-xs-offset-3 searchtools-module-results">
			<table class="table">
				<thead>
					<tr>
						<th class="col-md-1">
							<?php echo JText::_('JSTATUS'); ?>
						</th>
						<th class="col-md-3 align-left">
							<?php echo JText::_('JGLOBAL_TITLE'); ?>
						</th>
						<th class="col-md-2">
							<?php echo JText::_('JCATEGORY'); ?>
						</th>
						<th class="col-md-2">
							<?php echo JText::_('JGRID_HEADING_ACCESS'); ?>
						</th>
						<th class="col-md-2">
							<?php echo JText::_('JGRID_HEADING_LANGUAGE'); ?>
						</th>
						<th class="col-md-1">
							<?php echo JText::_('JGRID_HEADING_ID'); ?>
						</th>
						<th class="col-md-1">
							<?php echo JText::_('SUNFW_ACTION'); ?>
						</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ($this->articles as $i => $item) : ?>
					<tr class="row<?php echo $i % 2; ?>">
						<td class="center">
							<?php if ($item->state == 1) : ?>
							<i class="fa fa-eye"></i>
							<?php elseif ($item->state == 0) : ?>
							<i class="fa fa-eye-slash"></i>
							<?php elseif ($item->state == 2) : ?>
							<i class="fa fa-archive"></i>
							<?php elseif ($item->state == -2) : ?>
							<i class="fa fa-trash"></i>
							<?php endif; ?>
						</td>
						<td class="align-left">
							<a href="javascript: void(0);" class="select-article" data-id="<?php echo $item->id; ?>">
								<?php echo $item->title; ?>
							</a>
						</td>
						<td>
							<span class="label label-info">
								<?php echo $item->category; ?>
							</span>
						</td>
						<td>
							<?php echo $item->access_level; ?>
						</td>
						<td>
							<?php
							if ($item->language == '')
							{
								echo JText::_('JDEFAULT');
							}
							elseif ($item->language == '*')
							{
								echo JText::alt('JALL', 'language');
							}
							else
							{
								echo $item->language_title ? JHtml::_('image', 'mod_languages/' . $item->language_image . '.gif', $item->language_title, array('title' => $item->language_title), true) . '&nbsp;' . $item->language_title : JText::_('JUNDEFINED');
							}
							?>
						</td>
						<td>
							<?php echo (int) $item->id; ?>
						</td>
						<td>
							<a href="index.php?option=com_content&task=article.edit&id=<?php echo $item->id;?>" target="_blank" rel="noopener noreferrer">
								<i class="fa fa-edit"></i>
							</a>
						</td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	</div>
</form>

<script type="text/javascript">
	jQuery(function($) {
		$('#adminForm button[type="reset"]').click(function() {
			$('#adminForm').find('input, select').val('');
			$('#adminForm').submit();
		});

		$('.select-article').click(function() {
			if (typeof window.parent.sunFwArticlePickerInsert == 'function') {
				window.parent.sunFwArticlePickerInsert( $(this).attr('data-id'), $.trim( $(this).text() ) );
			}

			if (typeof window.parent.sunFwArticlePickerModalClose == 'function') {
				window.parent.sunFwArticlePickerModalClose();
			}
		});
	});
</script>
