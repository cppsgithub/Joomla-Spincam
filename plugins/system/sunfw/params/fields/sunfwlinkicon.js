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

(function ($) {
	$.SunFwIconSelector = function (params)
	{
		this.params 		= params;
		this.body      		= document.body;
		this.init();
	};

	$.SunFwIconSelector.prototype = {
		init: function () {
			var self 			= this;
			this.container 		= $('#sunfw-show-icon-container');
			this.category		= $('#sunfw_font_category');
			this.quicksearch	= $("#sunfw-quicksearch-icon");
			this.selectBtn		= $("#select-icon-btn");
			var oldIconFilter 	= "";
			this.containerResultsFilter = $("<ul/>", {"class":"sunfw-items-list"});
			this.container.append(this.containerResultsFilter);
			
			this.quicksearch.val('');
			this.category.on('change', function () {
				self.quicksearch.val('');
				self.renderIconList();
			});
			
			this.quicksearch.keyup(function(el) {
				if ($(this).val() != oldIconFilter) 
				{
                    oldIconFilter = $(this).val();
                    self.filterResults($(this).val(), self.containerResultsFilter);					
				}
			});
			
			this.selectBtn.on('click', function(){
				self.selectIcon();
			});
			
			this.renderIconList();
		},
        filterResults:function (value, resultsFilter) {
            $(resultsFilter).find("li").hide();
            if (value != "") 
            {
                $(resultsFilter).find("li").each(function () 
                {
                    var textField = $(this).find("a").attr("data-value").toLowerCase();
                    if (textField.search(value.toLowerCase()) == -1) 
                    {
                        $(this).hide();
                    } 
                    else 
                    {
                        $(this).fadeIn(100);
                    }
                });
            } 
            else 
            {
                $(resultsFilter).find("li").each(function () {
                    $(this).fadeIn(100);
                });
            }
        },		
		renderIconList: function () {
			var self 		= this;
			var classActive = {"class":"sunfw-item"};
			var category 	= this.category.val();
			if (category	== 'all-icons')
			{
				var icons 		= jQuery.parseJSON( this.params.allIcons );
				self.containerResultsFilter.html('');
		    	$.each(icons, function (value, title) {
		    		self.containerResultsFilter.append( 
		    				$("<li/>", classActive).append(
		    						$("<a/>", {"href":"javascript:void(0)", "class":"icons-item", "data-value": value, "title": title}).append($("<i/>", {"class":"fa " + value})).click(function () {
		                                self.activeSelectedIcon(this);
		                            })
		    				)
		    		);
		    	})				
			}
			else
			{	
				var icons 		= jQuery.parseJSON( this.params.icons );
				$.each(icons, function(index, items) {
				    if (index == category)
				    {
				    	self.containerResultsFilter.html('');
				    	$.each(items, function (value, title) {
				    		self.containerResultsFilter.append( 
				    				$("<li/>", classActive).append(
				    						$("<a/>", {"href":"javascript:void(0)", "class":"icons-item", "data-value": value, "title": title}).append($("<i/>", {"class":"fa " + value})).click(function () {
				    							self.activeSelectedIcon(this);
				                            })
				    				)
				    		);
				    	})
				    }	
				}); 
			}		
		},
		activeSelectedIcon: function (e)
		{
			$(e).parents(".sunfw-items-list").find(".active").removeClass("active");
			$(e).parent().addClass("active");
			$('#sunfw-selected-icon').val($(e).attr("data-value"))
		},
		selectIcon: function () {
			var icon = 'fa ' + $('#sunfw-selected-icon').val();
			$('#jform_params_sunfw_link_icon').val(icon);
			$('#sunfw-preview-icon').removeAttr('class').addClass(icon);
			$("#sunFwModalIcon").modal("hide");
		}
		
	};
})(jQuery);
