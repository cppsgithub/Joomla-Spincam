/**
 * @version    $Id$
 * @package    JSN_PageBuilder2
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

define(
	[
	    'jquery',
	    'jquery.ui'
	],
    function ($) {
        var JSNPageBuilder2Item = function (params) {
            this.params = $.extend({}, params);
            
            this.initialize();
        }

        JSNPageBuilder2Item.prototype = {
            initialize:function () {
                $('#pagebuilder2 .tabs-form').tabs({
                	create: function() {
                		$('#pagebuilder2').removeClass('hide');
                	}
                });
            },
        };

        return JSNPageBuilder2Item;
    }
);