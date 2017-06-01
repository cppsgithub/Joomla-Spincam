<?php
/**
 * @version    $Id$
 * @package    SUN Framework
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2016 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');
?>
<div class="container-fluid">
	<div class="row">
	<?php
		if (count($quickstart))
		{
			foreach ($quickstart as $item)
			{
	?>
				<div class="col-sm-6 col-md-4">
					<div class="thumbnail">
						<a href="<?php echo $item['demo'];?>" title="<?php echo $item['name'];?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo $item['thumbnail'];?>" alt="<?php echo $item['name'];?>" />
						</a>
						<div class="caption">
							<h3><?php echo $item['name'];?></h3>
							<p>
								<a data-id="<?php echo $item['id'];?>" href="#" title="<?php echo $item['name'];?>" class="btn btn-primary btn-block btn-sm btn-download-quickstart">download</a>
							</p>
						</div>
					</div>
				</div>
	<?php
			}
		}
	?>
	</div>
</div>