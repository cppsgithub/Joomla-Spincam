<?php
/**
* @package      EasyBlog
* @copyright    Copyright (C) 2010 - 2015 Stack Ideas Sdn Bhd. All rights reserved.
* @license      GNU/GPL, see LICENSE.php
* EasyBlog is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/
defined('_JEXEC') or die('Restricted access');
?>

<ul class="sportnew-cat submenu cat-<?php echo $category->id; ?>" class="collapse">
    <?php foreach ($category->childs as $child) { ?>
        <li>
            <a href="<?php echo EB::_('index.php?option=com_easyblog&view=categories&layout=listings&id=' . $child->id); ?>">
                <i class="fa fa-folder-o" aria-hidden="true"></i>
                <?php echo $child->title; ?>
                <?php if ($showCount) { ?>
                    <span class="mod-muted">(<?php echo isset($child->cnt) ? $child->cnt : '-'; ?>)</span>
                <?php } ?>
            </a>

            <?php if ($child->childs) { ?>
                <a class="mod-cell cell-tight mod-muted" data-bp-toggle="collapse" href="#cat-<?php echo $child->id; ?>">
                    <i class="fa fa-chevron-down"></i>
                </a>
            <?php } ?>

            <?php if ($child->childs) { ?>
                <?php echo modEasyBlogCategoriesHelper::accessNestedToggleCategories($child); ?>
            <?php } ?>

        </li>
    <?php } ?>
</ul>

