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
	$.SunFwMenuAssignment = function (params)
	{
		this.params 		= params;
		this.body      		= document.body;
		this.container 		= document.getElementById('style-form');
		this.toggleButton 	= $(document.getElementById('jsn-toggle-menu'));
		this.saveButton 	= $(document.getElementById('sunfw-save-menu-assignment-button'));
		this.checkAllGroup 	= $(this.container.querySelectorAll('input[name="checkAll"]'));

		this.init();
		this.addEvents();
	};

	$.SunFwMenuAssignment.prototype = {
		init: function () {
			var self = this;
			self.addEventChangeToAllElement()

		},

		addEvents: function () {
			this.toggleButton.on('click', $.proxy(this.updateGroupSelection, this));
			this.checkAllGroup.on('change', $.proxy(this.updateMenuSelection, this));
			this.saveButton.on('click', $.proxy(this.save, this));
			var self = this;
            // menu assignment toggle
            $('.sunfw-menu-assignment-toggle').on ('click', function () {
	             self.toggleMenu(this);
            });
            
            // menu tree toggle
            $('.sunfw-menu-tree-toggle').on ('click', function () {
            	   self.toggleTree(this);
            });
		},
		toggleTree: function (e)
		{
            var $this = $(e),
            $parent = $this.parents('label'),
            $parentLi = $parent.parents('li'),
            level = $parent.data('level'),
            status = $this.data('status');
	         $parentLi.nextAll().each (function () {
	         	var label = $(this).find('label');
	            if (label.data('level') > level) {
	                if (status == 'hide') label.removeClass ('hide'); else label.addClass('hide');
	            } else {
	                return false;
	            }
	        });
	        if (status == 'hide') {
	            $this.data('status', 'show');
	            $this.addClass ('fa-minus').removeClass ('fa-plus');
	        } else {
	            $this.data('status', 'hide');
	            $this.removeClass ('fa-minus').addClass ('fa-plus');
	        }			
		},
		toggleMenu: function (e)
		{
            var $this = $(e),
            $parent = $this.parents('label'),
            level = $parent.data('level');             
	        var $parentLi = $parent.parents('li');   
	        $parentLi.nextAll().each (function () {
	     	   var label = $(this).find('label');
	            if (!level || label.data('level') > level) {
	                var check = label.find ('.menu-item');
	                check.prop('checked', !check.prop('checked'));
	            } else {
	                return false;
	            }
	        });			
		},
		
		updateGroupSelection: function (e) {
			this.checkAllGroup.filter(':checked').size() > 0
				? this.checkAllGroup.removeAttr('checked')
				: this.checkAllGroup.attr('checked', 'checked');

			this.checkAllGroup.trigger('change');
		},

		updateMenuSelection: function (e) {
			var
			el = $(e.target),
			parent = el.closest('ul');

			el.attr('checked') === 'checked'
				? parent.find('input.menu-item').attr('checked', 'checked')
				: parent.find('input.menu-item').removeAttr('checked');
		},
		
		save: function (e) {
			var btnSelf 	= $(e.target);
			var token        = document.querySelector( '#jsn-tpl-token' ).value;
			var styleID      = document.querySelector( '#jsn-style-id'  ).value;
			var templateName = document.querySelector( '#jsn-tpl-name'  ).value;
			var el = $(e.target);
			var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=menuassignment&'
				+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=save';	
			
			var icon = el.children();
			
			var postData = [];
			var data = $('#style-form').serializeArray();
			$.each(data, function (index, value) {

				if (value.name != 'module')
				{	
					postData.push(value);
				}
			});
			$( '#sunfw-admin-tab span[data-tab="#menu-assignment"]' ).removeClass('sunfwhide');
			
			//icon.removeClass('fa-floppy-o').addClass('fa-spinner fa-spin');
			$.ajax({
				url: server,
				data: postData,
				type: 'POST',
				dataType: 'html',
				complete: function(data, status) {
					//icon.addClass('fa-check-square-o').removeClass('fa-spinner fa-spin');
					var resp = $.parseJSON(data.responseText);
					
					if (resp.type == 'success') 
					{
			           if (window.show_noty)
			           { 
							noty({
							   text: window.sunfw_menu_assignment.text['save-data-successfully'],
							   theme: 'relax', // or 'relax'
							   layout: 'top',
							    type: 'success',
							    timeout: 2000,
							    animation: {
							        open: 'animated fadeIn', // Animate.css class names
							        close: 'animated fadeOut', // Animate.css class names
							
							    }
							});	
			           }
			           var tab = $('#sunfw-admin-tab').find("a[href='#menu-assignment']");
			           var html = tab.html().trim();
			           tab.html(html.replace(" *", ""));
			           btnSelf.prop("disabled",true);
                    }
					else
					{
						bootbox.alert(resp.data, function() {});
					}
					$( '#sunfw-admin-tab span[data-tab="#menu-assignment"]' ).addClass('sunfwhide');
					window.save_all_is_processing = false;
					window.save_all_step = 7;
					window.assignmentHasChange = true;
				}
			});				
		},
        addEventChangeToAllElement: function () {
        	var self = this;
        	var tab = $('#sunfw-admin-tab').find("a[href='#menu-assignment']");
        	var saveAllButton =  $( '#sunfw-save-all' );
        	$('#menu-assignment').find(':input').on('change', function () {
        		var html = tab.html().trim();
        		tab.html(html.replace(" *", "") + ' *')
        		self.saveButton.prop("disabled",false);
        		saveAllButton.removeClass('disabled');
        		window.assignmentHasChange = true;
        	})
        }		
	};
})(jQuery);
