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

(function($){
	$.SunFwAbout = function() {
		// Initialize functionality
		$(document).ready($.proxy(this.init(), this));
	};

	$.SunFwAbout.prototype = {
		init : function() {
			/*$('#sunfw-about-menu').on('click', function(e) {
				e.preventDefault();
				$('.tab-content .tab-pane').addClass('hidden');
				$('.jsn-nav .nav').find('li').removeClass('active');
				$(this).addClass('active');
				$('body').addClass('about-active');
				$('#about').removeClass('hidden');
			});
			
			$('.navbar-nav').find('a:not(#sunfw-show-about)').on('click', function(e) {
				e.preventDefault();
				$('.tab-content .tab-pane').removeClass('hidden');
				$('#sunfw-about-menu').removeClass('active');
				$('body').removeClass('about-active');
				$('#about').addClass('hidden');
			});*/	
			
			$("#sunfw-about-update-template-link").on('click', function (e) {
				$('#sunfwModalAboutPage').modal('hide');
			});
			
			$("#sunfw-about-update-framework-link").on('click', function (e) {
				$('#sunfwModalAboutPage').modal('hide');
			});
		},		
	};
	
	$.initSunFwAbout = function () {
		if ($.__sunfw_admin_about__ === undefined)
			$.__sunfw_admin_about__ = new $.SunFwAbout();
	};
})(jQuery);