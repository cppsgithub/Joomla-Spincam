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
    $.SunFwFont = function(params) {
        // Initialize parameters
        this.params = $.extend({}, params);

        // Initialize functionality
        $(document).ready($.proxy(this.init(), this));
    };

    $.SunFwFont.prototype = {
        init : function() {
            var self                    = this;
            var fontType                = $('#' + this.params.fontTypeID);
            
            var fontWeight              = $('#' + this.params.fontWeightID);
            var fontStyle               = $('#' + this.params.fontStyleID);
            var container               = $('#' + this.params.containerID);
            
            var standardFontFamilyFake  = $('#' + this.params.standardFontFamilyFakeID);
            var googleFontFamilyFake    = $('#' + this.params.googleFontFamilyFakeID);
            
            var inputID                 = $('#' + this.params.inputID);
            
            var standardFontFamilyFakeParent    = standardFontFamilyFake.parent();
            var googleFontFamilyFakeParent      = googleFontFamilyFake.parent();
            
            container.googlefont({
                fonts: this.params.googleFontData.items,
                subsets: this.params.subsets,
                font_weight_id: fontWeight,
                font_style_id: fontStyle
            });
            
            /*inputID.on('change', function(e) {           	
            	var el = $(this).closest('.form-group').find('div.standard-font-wrapper').hasClass('sunfwhide');
            	if (!el)
            	{
            		$(this).closest('.form-group').find('div.standard-font-wrapper').children().first().attr('data-value', $(this).val());
            		$(this).closest('.form-group').find('div.standard-font-wrapper').children().first().find('option[value="' + $(this).val() + '"]').prop('selected', true).end().trigger('change').trigger('liszt:updated');
            	}
            	else
            	{            		
            		$(this).closest('.form-group').find('div.google-font-wrapper').children().first().val($(this).val());
            		$(this).closest('.form-group').find('div.google-font-wrapper').children().first().attr('data-value', $(this).val());
            		$(this).closest('.form-group').find('div.google-font-wrapper').children().first().trigger('change');
            	}
            })*/
            googleFontFamilyFake.on('change', function(e) {
            	inputID.val($(this).val());
                inputID.trigger('change');
            });
            
            fontType.on('change', function (e) {
                
                var dataValue = fontType.attr('data-value');
                var value = $(this).val();
                                
                if (value == 'google')
                {
                    standardFontFamilyFakeParent.addClass('sunfwhide');
                    googleFontFamilyFakeParent.removeClass('sunfwhide');
                    
                    googleFontFamilyFake.val(inputID.val());                    
                    googleFontFamilyFake.trigger('change');

                    googleFontFamilyFake.val('');
                    fontWeight.empty();
                    fontStyle.empty();         
                    
                    fontWeight.find('option[value="' + fontWeight.attr('data-value') + '"]').prop('selected', true).end().trigger('change').trigger('liszt:updated');
                    fontStyle.find('option[value="' + fontStyle.attr('data-value') + '"]').prop('selected', true).end().trigger('change').trigger('liszt:updated');
                }
                else
                {
                    standardFontFamilyFakeParent.removeClass('sunfwhide');
                    googleFontFamilyFakeParent.addClass('sunfwhide');
                    
                    standardFontFamilyFake.empty();
                    self.bindDataToStandardFontFamilyFakeElement(standardFontFamilyFake);
                    
                    fontWeight.empty();
                    self.bindDataToFontWeightElement(fontWeight, self.params.fontWeightStandardData);
                    
                    fontStyle.empty();
                    self.bindDataToFontWeightElement(fontStyle, self.params.fontStyleStandardData);
                }   
            });
            
            fontType.find('option[value="' + fontType.attr('data-value') + '"]').prop('selected', true).end().trigger('change').trigger('liszt:updated');
            
            standardFontFamilyFake.on('change', function (e) {
                inputID.val($(this).val());
                inputID.trigger('change');
            });
            
            if (fontType.attr('data-value') == 'google')
            {
            	googleFontFamilyFake.val(googleFontFamilyFake.attr('data-value')).trigger('change');
                fontWeight.find('option[value="' + fontWeight.attr('data-value') + '"]').prop('selected', true).end().trigger('change').trigger('liszt:updated');
                fontStyle.find('option[value="' + fontStyle.attr('data-value') + '"]').prop('selected', true).end().trigger('change').trigger('liszt:updated');
            }   
            else
            {
                standardFontFamilyFake.find('option[value="' + standardFontFamilyFake.attr('data-value') + '"]').prop('selected', true).end().trigger('change').trigger('liszt:updated');
                fontWeight.find('option[value="' + fontWeight.attr('data-value') + '"]').prop('selected', true).end().trigger('change').trigger('liszt:updated');
                fontStyle.find('option[value="' + fontStyle.attr('data-value') + '"]').prop('selected', true).end().trigger('change').trigger('liszt:updated');
            }   
        },
        
        bindDataToStandardFontFamilyFakeElement: function (element)
        {
            var self = this;
            var data = self.params.fontFamilyStandardData;
            
            $.each(data, function(key, item) {
                element.append($("<option/>", {
                    value: item.value,
                    text: item.text,
                }));
            });
            
            element.find('option:first-child').prop('selected', true).end().trigger('liszt:updated');
        },
        
        bindDataToFontWeightElement: function (element, data)
        {
            var self = this;
            
            $.each(data, function(key, item) {
                element.append($("<option/>", {
                    value: item.value,
                    text: item.text,
                }));
            });
            
            element.find('option:first-child').prop('selected', true).end().trigger('liszt:updated');
        },
        
        bindDataToFontStyleElement: function (element, data)
        {
            var self = this;
            
            $.each(data, function(key, item) {
                element.append($("<option/>", {
                    value: item.value,
                    text: item.text,
                }));
            });
            
            element.find('option:first-child').prop('selected', true).end().trigger('liszt:updated');
        }       
    }
})(jQuery);