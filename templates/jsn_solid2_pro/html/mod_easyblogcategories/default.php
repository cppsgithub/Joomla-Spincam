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
<div id="fd" class="eb eb-mod mod_easyblogcategories <?php echo $params->get('moduleclass_sfx') ?>">
    <?php if ($layoutType == 'toggle') { ?>

    <ul class="sportnew-cat">
        <?php foreach ($results as $category) { ?>
            <li>
                <a href="<?php echo EB::_('index.php?option=com_easyblog&view=categories&layout=listings&id=' . $category->id); ?>">

                    <i class="fa fa-folder-o" aria-hidden="true"></i>

                    <?php echo $category->title; ?>

                    <?php if ($params->get('showcount', true)) { ?>
                        <span class="mod-muted">(<?php echo $category->cnt; ?>)</span>
                    <?php } ?>

                </a>

                <?php if ($category->childs) { ?>
                    <i class="fa fa-chevron-down"></i>
                <?php } ?>

                <?php if ($category->childs) { ?>
                    <?php echo modEasyBlogCategoriesHelper::accessNestedToggleCategories($category, $params);?>
                <?php } ?>

            </li>
        <?php } ?>
    </ul>

    <?php } ?>
</div>
