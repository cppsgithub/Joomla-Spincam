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
	$.SunFwAppearance = function(params) {
		// Initialize parameters
		this.params = $.extend({}, params);
		this.defaultSectionParams = '{"container-border":"","container-background-background-type":"color","container-background-background-color":"#ffffff","container-background-background-image":"","container-background-background-repeat":"initial","container-background-background-size":"auto","container-background-background-attachment":"initial","container-background-background-position":"center center","heading-inherit":"yes","heading-headings-color":"#000000","heading-headings-font-family":"","heading-headings-font-style":"normal","heading-headings-base-size":"12px","heading-headings-letter-spacing":"","heading-headings-line-height":"1.4","heading-headings-text-transform":"none","heading-headings-text-shadow":"0px 0px 0px #eeeeee","heading-headings-box-shadow":"","content-inherit":"yes","content-font-size-base":"","content-color":"#000000","content-font-weight":"normal","content-letter-spacing":"","content-line-height":"","content-text-shadow":"0px 0px 0px #eeeeee","link-inherit":"yes","link-link-color":"#000000","link-link-color-hover":"#000000","button-btn-inherit":"yes","button-btn-default-padding":"6px 20px 6px 20px","button-btn-default-bg":"#333333","button-btn-default-bg-hover":"#009aca","button-btn-default-border":"1px solid #cccccc","button-btn-default-radius":"3px 3px 3px 3px","button-btn-default-font-style":"normal","button-btn-default-font-weight":"normal","button-btn-default-font-size":"14px","button-btn-default-letter-spacing":"","button-btn-default-color":"#ffffff","button-btn-default-color-hover":"#ffffff","button-btn-default-text-transform":"none","button-btn-default-text-shadow":"0px 0px 0px #cccccc","button-btn-default-box-shadow":"","button-btn-primary-bg":"#009aca","button-btn-primary-bg-hover":"#333333","button-btn-primary-border":"1px solid #cccccc","button-btn-primary-color":"#ffffff","button-btn-primary-color-hover":"#ffffff","button-btn-primary-text-shadow":"0px 0px 0px #cccccc","button-btn-primary-box-shadow":""}';
		// Initialize functionality
		$(document).ready($.proxy(this.init(), this));
	};

	$.SunFwAppearance.prototype = {
			init : function() {
				var self = this;
				self.getLayoutBuilderSectionList();
				var token        = document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      = document.querySelector( '#jsn-style-id'  ).value;
				var templateName = document.querySelector( '#jsn-tpl-name'  ).value;
				
				$('#sunfw_appearance_section_name_chzn').hide();
				$('#sunfw_appearance_module_style_chzn').hide();
				
				$('.jsn-nav').find('a[href="#appearance"]').on('click', function(e) {
					e.preventDefault();
					$("#sunfw_appearance_type option[value='general']").attr("selected", true);
					$('#sunfw_appearance_type').val('general').trigger('liszt:updated');
					$('#sunfw_appearance_type').trigger('change');

					self.getLayoutBuilderSectionList();
				});
		
				$('#sunfw-save-appearance-button').on('click', function(e) {
					e.preventDefault();
					var icon = $(this).children();
					icon.removeClass('fa-floppy-o').addClass('fa-spinner fa-spin');
					var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=appearance&'
						+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=save';
				
					var postData = [];
					var data = $('#style-form').serializeArray();
					$.each(data, function (index, value) {

						if (value.name != 'module')
						{	
							postData.push(value);
						}
					});
					
					$.ajax({
						url: server,
						data: postData,
						type: 'POST',
						dataType: 'html',
						complete: function(data, status) {
							icon.addClass('fa-check-square-o').removeClass('fa-spinner fa-spin');
							var resp = $.parseJSON(data.responseText);
							if (resp.type == 'success') 
							{
								bootbox.alert(window.sunfw_appearance.text['save-data-successfully'], function() {});
                            }
							else
							{
								bootbox.alert(resp.data, function() {});
							}
						}
					});					
				});
				
				$type = $('option:selected', $('#sunfw_appearance_type')).attr('data-type');
				$('#sunfw_appearance_selected_type').val($type);
				$('#appearance-' + $type + '-container').removeClass('sunfwhide');
				$('#appearance-' + $type + '-container-preview').removeClass('sunfwhide');
						
				$('#sunfw_appearance_type').on('change', function(e) {
					e.preventDefault();	
					// Auto save 
					self.autoSave();					
					var that 	= $(this);
					var selected  = that.val();
					
					$('.apperance-type-container').addClass('sunfwhide');
					$('.apperance-preview-container').addClass('sunfwhide');
					$('#sunfw_appearance_section_name').addClass('sunfwhide');
					$('#sunfw_appearance_section_name_chzn').hide();
					
					$('#sunfw_appearance_module_style_chzn').hide();
					$('#sunfw_appearance_module_style').addClass('sunfwhide');	
					
					var type = $('option:selected', this).attr('data-type');	
					$('#sunfw_appearance_selected_type').val(type);
					$('#appearance-' + type + '-container').removeClass('sunfwhide');
					$('#appearance-' + type + '-container-preview').removeClass('sunfwhide');
					if (type == 'section')
					{
						$('#sunfw_appearance_section_name_chzn').show();
						$('#sunfw_appearance_section_name').removeClass('sunfwhide');
						
						if ($('#sunfw_appearance_section_name').children().length > 1)
						{	
							var sectionName = $($('#sunfw_appearance_section_name').children()[1]).val()
							$("#sunfw_appearance_section_name option[value='" + sectionName + "']").attr("selected", true);
							$('#sunfw_appearance_section_name').val(sectionName).trigger('liszt:updated');
							self.selectFirstSection(sectionName);
						}
					}
					
					if (type == 'module')
					{
						$('#sunfw_appearance_module_style_chzn').show();
						$('#sunfw_appearance_module_style').removeClass('sunfwhide');	
						
						if ($('#sunfw_appearance_module_style').children().length > 1)
						{	
							var style = $($('#sunfw_appearance_module_style').children()[1]).val()
							$("#sunfw_appearance_module_style option[value='" + style + "']").attr("selected", true);
							$('#sunfw_appearance_module_style').val(style).trigger('liszt:updated');
							self.selectFirstModuleStyle(style);
						}
					}

					if (type == 'menu') 
					{
						$("#sunfw_appearance_menu_parentmenu_font_size").trigger('change');
						
					}				
				});
				
				$('#sunfw_appearance_section_name').on('change', function(e) {
					e.preventDefault();	
					// Auto save 
					self.autoSave();
					$("#appearance-section :input").not('[type=radio], [type=checkbox], select').val('');
					$("#sunfw_appearance_selected_section_id").val('');
					
					if ($(this).val() == '') return false;
										
					var that 			= $(this);
					$("#sunfw_appearance_selected_section_id").val(that.val());
					
					var link = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=appearance&'
						+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=getSectionData';					
					$.ajax({
						url: link,
						type: 'GET',
						dataType: 'JSON',
						complete: function(data, status) {
							var resp = $.parseJSON(data.responseText);
							if (resp.type == 'success')
							{
								self.previewSection();
								var sectionData = resp.data;
								var hasValue = false;
								$.each(sectionData, function (index, item) {
									
									if (index == that.val())
									{
										hasValue = true;
										$.each(item, function (subIndex, subValue) {
											var tmpSubIndex = subIndex.replace(/-/g, "_"); 
											$('#sunfw_appearance_section_' + tmpSubIndex).val(subValue);											
											$('#sunfw_appearance_section_' + tmpSubIndex).trigger('change');
											$('#sunfw_appearance_section_' + tmpSubIndex).trigger('liszt:updated');
										});
										self.previewSection();
										return false;
									}	
								});
								
								if (!hasValue)
								{
									$.each($.parseJSON(self.defaultSectionParams), function (subIndex, subValue) {
										var tmpSubIndex = subIndex.replace(/-/g, "_"); 
										
										$('#sunfw_appearance_section_' + tmpSubIndex).val(subValue);											
										$('#sunfw_appearance_section_' + tmpSubIndex).trigger('change');
										$('#sunfw_appearance_section_' + tmpSubIndex).trigger('liszt:updated');
									});
									self.previewSection();
									return false;
								}
							}
							else
							{
								alert(resp.data);
							}	
						}
					});	
								
				});
				
				$('#sunfw_appearance_module_style').on('change', function(e) {
					e.preventDefault();
					
					// Auto save 
					self.autoSave();
					
					//$("#appearance-module :input").val('');
					$("#appearance-module :input").not('[type=radio], [type=checkbox], select').val('');
					$("#sunfw_appearance_selected_module_style").val('');
					
					if ($(this).val() == '') return false;
					
					var that 			= $(this);
					$("#sunfw_appearance_selected_module_style").val(that.val());
					
					var link = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=appearance&'
						+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=getModuleStyleData';					
					$.ajax({
						url: link,
						type: 'GET',
						dataType: 'JSON',
						complete: function(data, status) {
							
							var resp = $.parseJSON(data.responseText);
							if (resp.type == 'success')
							{	
								var moduleData = resp.data;
								
								$.each(moduleData, function (index, item) {
									
									if (index == that.val())
									{
										$.each(item, function (subIndex, subValue) {
											var tmpSubIndex = subIndex.replace(/-/g, "_"); 
											
											$('#sunfw_appearance_module_' + tmpSubIndex).val(subValue);
											$('#sunfw_appearance_module_' + tmpSubIndex).trigger('change');
											$('#sunfw_appearance_module_' + tmpSubIndex).trigger('liszt:updated');
										});
										self.previewModule();
										return false;
									}	
								});
							}
							else
							{
								alert(resp.data);
							}	
						}
					});					
				});		
				
				$("#appearance-general-container :input").on('change', function (e)
				{
					self.previewGeneral();
				});
				
				$("#appearance-section-container :input").on('change', function (e)
				{
					if ($('#sunfw_appearance_section_name').val() != '')
					{	
						self.previewSection();
					}
				});	
				
				$("#appearance-module-container :input").on('change', function (e)
				{
					if ($('#sunfw_appearance_module_style').val() != '')
					{
						self.previewModule();
					}
				});	
					
				$("#appearance-menu-container :input").on('change', function (e)
				{
					self.previewMenu();					
				});	

				self.previewGeneral();
				
				// Preset
				$('.sunfw-appearance-preset-container .preset-thumb').on('click', function (e) {
					e.preventDefault();
					$('.sunfw-appearance-preset-container .preset-thumb').removeClass('active');
					$(this).addClass('active');
					self.setPreset(this);
				});			
			},

			previewGeneral: function () {
				var pageData 	= $('#collapseAppearance-generalPage :input').serializeArray();
				var headingData = $('#collapseAppearance-generalHeading :input').serializeArray();
				var contentData = $('#collapseAppearance-generalContent :input').serializeArray();
				var linkData 	= $('#collapseAppearance-generalLink :input').serializeArray();
				var buttonData 	= $('#collapseAppearance-generalButton :input').serializeArray();
				
				var page 	 	= $('.sunfw_appearance_preview_general_page');
				var pageInner 	= $('.sunfw_appearance_preview_general_page_inner', page);				
				var pageOuter 	= $('.sunfw_appearance_preview_general_page_outer', page);
				var heading		= $('.sunfw_appearance_preview_general_heading', page);
				var heading1	= $('h1.sunfw_appearance_preview_general_heading', page);
				var heading2	= $('h2.sunfw_appearance_preview_general_heading', page);
				var heading3	= $('h3.sunfw_appearance_preview_general_heading', page);
				var heading4	= $('h4.sunfw_appearance_preview_general_heading', page);
				var heading5	= $('h5.sunfw_appearance_preview_general_heading', page);
				var heading6	= $('h6.sunfw_appearance_preview_general_heading', page);

				var content 	= $('.sunfw_appearance_preview_general_content', page);
				var link		= $('.sunfw_appearance_preview_general_link', page);
				
				var buttonDefault 	= $('.btn-sunfw-appearance-preview-general-default', page);
				var buttonPrimary 	= $('.btn-sunfw-appearance-preview-general-primary', page);
				var fontType 		= $('#collapseAppearance-generalHeading #sunfw_appearance_general_headings_headings_font_type').val();
				var fontContentType = $('#collapseAppearance-generalContent #sunfw_appearance_general_content_font_type').val();
				
				pageInner.removeAttr('style');
				var URLPattern=/^(http|https)/i;
				
				$.each(pageData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[general-page-page-border]':
							pageInner.css('border', item.value);
							break;
						case 'sunfw-appearance[general-page-page-box-shadow]':
							pageInner.css({"-webkit-box-shadow": item.value, "-moz-box-shadow": item.value, "box-shadow": item.value}); 
							break;
						case 'sunfw-appearance[general-page-background-inner]':
							pageInner.css('background-color', item.value);
							break;						
						case 'sunfw-appearance[general-page-body-bg-background-type]':
								//if (item.value == 'color')
								//{
									var bgOutterColor = $( "input[name='sunfw-appearance[general-page-body-bg-background-color]']").val();
									
									pageOuter.css('background-color', bgOutterColor);
								//}
								//else
								//{
									var bgOutterImage = $( "input[name='sunfw-appearance[general-page-body-bg-background-image]']").val();
									var bgOutterRepeat = $( "select[name='sunfw-appearance[general-page-body-bg-background-repeat]']").val();
									var bgOutterSize = $( "select[name='sunfw-appearance[general-page-body-bg-background-size]']").val();
									var bgOutterAttachment = $( "select[name='sunfw-appearance[general-page-body-bg-background-attachment]']").val();
									var bgOutterPosition = $( "select[name='sunfw-appearance[general-page-body-bg-background-position]']").val();
									//var bgOutterStr = 'url("' + $('#jsn-tpl-root').val() + bgOutterImage + '") ' + bgOutterRepeat + ' ' + bgOutterAttachment + ' ' + bgOutterPosition;
									
									if (!URLPattern.test(bgOutterImage))
									{
										bgOutterImage = $('#jsn-tpl-root').val() + bgOutterImage;
									}	
									
									pageOuter.css({'background-image': 'url("'  + bgOutterImage + '")', 'background-position': bgOutterPosition, 'background-attachment': bgOutterAttachment, 'background-size': bgOutterSize, 'background-repeat': bgOutterRepeat});
								//}	
							break;
						default:
							break;
												
					}
				});
				
				heading.removeAttr('style');
								
				$.each(headingData, function (key, item){
					
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[general-headings-headings-color]':
								heading.css('color', item.value);
							break;
						case 'sunfw-appearance[general-headings-headings-font-family]':
								
								heading.css('font-family', item.value);
							break;
						case 'sunfw-appearance[general-headings-headings-font-style]':
								heading.css('font-style', item.value);
							break;
						case 'sunfw-appearance[general-headings-headings-font-weight]':
								heading.css('font-weight', item.value);
							break;
						case 'sunfw-appearance[general-headings-headings-base-size]':
								var $fontSize = parseInt(item.value);

								heading1.css('font-size', Math.floor($fontSize * 2.6));
								heading1.children().html(Math.floor($fontSize * 2.6)+'px');

								heading2.css('font-size', Math.floor($fontSize * 2.15));
								heading2.children().html(Math.floor($fontSize * 2.15)+'px');

								heading3.css('font-size', Math.ceil($fontSize * 1.7));
								heading3.children().html(Math.ceil($fontSize * 1.7)+'px');

								heading4.css('font-size', Math.ceil($fontSize * 1.25));
								heading4.children().html(Math.ceil($fontSize * 1.25)+'px');

								heading5.css('font-size', item.value);
								heading5.children().html($fontSize+'px');

								heading6.css('font-size', Math.ceil($fontSize * 0.85));
								heading6.children().html(Math.ceil($fontSize * 0.85)+'px');

							break;
						case 'sunfw-appearance[general-headings-headings-letter-spacing]':
								heading.css('letter-spacing', item.value);						
							break;
						case 'sunfw-appearance[general-headings-headings-line-height]':
								heading.css('line-height', item.value);	
							break;
						case 'sunfw-appearance[general-headings-headings-text-transform]':
								heading.css('text-transform', item.value);	
							break;							
						default:
							break;
												
					}
				});	
				
				content.removeAttr('style');
				$.each(contentData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[general-content-text-color]':
								content.css('color', item.value);
							break;
						case 'sunfw-appearance[general-content-font-family-base]':
								content.css('font-family', item.value);
							break;				
						case 'sunfw-appearance[general-content-font-size-base]':
								content.css('font-size', item.value);
							break;
						case 'sunfw-appearance[general-content-font-weight]':
								content.css('font-weight', item.value);
							break;
						case 'sunfw-appearance[general-content-line-height-base]':
								content.css('line-height', item.value);
							break;
						case 'sunfw-appearance[general-content-letter-spacing]':
								content.css('letter-spacing', item.value);						
							break;
							
						default:
							break;
												
					}
				});
				
				link.removeAttr('style');
				$.each(linkData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[general-link-link-color]':
								link.css('color', item.value);
							break;
//						case 'sunfw-appearance[general-link-link-hover-color]':
//								link.css('font-family', item.value);
//							break;
						
						default:
							break;
												
					}
				});	
				link.hover(
						  function() {
						    $( this ).css('color', $('#sunfw_appearance_general_link_link_hover_color').val());
						  }, function() {
						    $( this ).css('color', $('#sunfw_appearance_general_link_link_color').val());
						  }
						);
				buttonDefault.removeAttr('style');
				buttonPrimary.removeAttr('style');
				$.each(buttonData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[general-button-btn-default-padding]':
							buttonDefault.css('padding', item.value);
							buttonPrimary.css('padding', item.value);
							break;

						case 'sunfw-appearance[general-button-btn-default-bg]':
							buttonDefault.css('background-color', item.value);
							break;
//						case 'sunfw-appearance[general-button-btn-default-bg-hover]':
//								link.css('font-family', item.value);
//							break;
						case 'sunfw-appearance[general-button-btn-default-border-all]':
							buttonDefault.css('border', item.value);
							buttonPrimary.css('border', item.value); 
							break;
						case 'sunfw-appearance[general-button-btn-default-radius]':
							buttonDefault.css({'border-radius': item.value, '-moz-border-radius': item.value, '-webkit-border-radius': item.value});
							buttonPrimary.css({'border-radius': item.value, '-moz-border-radius': item.value, '-webkit-border-radius': item.value}); 
							break;
						case 'sunfw-appearance[general-button-btn-default-font-style]':
							buttonDefault.css('font-style', item.value);
							buttonPrimary.css('font-style', item.value);
							break;
						case 'sunfw-appearance[general-button-btn-default-font-weight]':
							buttonDefault.css('font-weight', item.value);
							buttonPrimary.css('font-weight', item.value); 
							break;
						case 'sunfw-appearance[general-button-btn-default-font-size]':
							buttonDefault.css('font-size', item.value);
							buttonPrimary.css('font-size', item.value);
							break;
						case 'sunfw-appearance[general-button-btn-default-letter-spacing]':
							buttonDefault.css('letter-spacing', item.value);
							buttonPrimary.css('letter-spacing', item.value);
							break;
						case 'sunfw-appearance[general-button-btn-default-color]':
							buttonDefault.css('color', item.value);
							break;
						case 'sunfw-appearance[general-button-btn-default-text-transform]':
							buttonDefault.css('text-transform', item.value);
							buttonPrimary.css('text-transform', item.value);
							break;
						case 'sunfw-appearance[general-button-btn-default-text-shadow]':
							buttonDefault.css({"-webkit-text-shadow": item.value, "-moz-text-shadow": item.value, "text-shadow": item.value}); 
							break;
						case 'sunfw-appearance[general-button-btn-default-box-shadow]':
							buttonDefault.css({"-webkit-box-shadow": item.value, "-moz-box-shadow": item.value, "box-shadow": item.value}); 
							break;							
						case 'sunfw-appearance[general-button-btn-primary-bg]':
							buttonPrimary.css('background-color', item.value); 
						break;
						case 'sunfw-appearance[general-button-btn-primary-color]':
							buttonPrimary.css('color', item.value);
							break;
						case 'sunfw-appearance[general-button-btn-primary-text-shadow]':
							buttonPrimary.css({"-webkit-text-shadow": item.value, "-moz-text-shadow": item.value, "text-shadow": item.value}); 
							break;
						case 'sunfw-appearance[general-button-btn-primary-box-shadow]':
							buttonPrimary.css({"-webkit-box-shadow": item.value, "-moz-box-shadow": item.value, "box-shadow": item.value}); 
							break;							
						default:
							break;
					}
				});		
				
				buttonDefault.hover(
						  function() {
						    $( this ).css('background-color', $('#sunfw_appearance_general_button_btn_default_bg_hover').val());
						  }, function() {
						    $( this ).css('background-color', $('#sunfw_appearance_general_button_btn_default_bg').val());
						  }
						);	
				buttonPrimary.hover(
						  function() {
						    $( this ).css('background-color', $('#sunfw_appearance_general_button_btn_primary_bg_hover').val());
						  }, function() {
						    $( this ).css('background-color', $('#sunfw_appearance_general_button_btn_primary_bg').val());
						  }
						);				
			},
			previewSection: function () {

				var parent 	 		= $('.sunfw_appearance_preview_section_wrapper');
				var container 		= $('.sunfw_appearance_preview_section_container', parent);
				var heading 		= $('.sunfw_appearance_preview_section_heading', parent);
				var heading1 		= $('h1.sunfw_appearance_preview_section_heading', parent);
				var heading2 		= $('h2.sunfw_appearance_preview_section_heading', parent);
				var heading3 		= $('h3.sunfw_appearance_preview_section_heading', parent);
				var heading4 		= $('h4.sunfw_appearance_preview_section_heading', parent);
				var heading5 		= $('h5.sunfw_appearance_preview_section_heading', parent);
				var heading6 		= $('h6.sunfw_appearance_preview_section_heading', parent);
				var content	 		= $('.sunfw_appearance_preview_section_content', parent);
				var link			= $('.sunfw_appearance_preview_section_link', parent);
				
				var buttonDefault 	= $('.btn-sunfw-appearance-preview-section-default', parent);
				var buttonPrimary 	= $('.btn-sunfw-appearance-preview-section-primary', parent);
				
				var containerData 	= $('#collapseAppearance-sectionContainer :input').serializeArray();
				var headingData 	= $('#collapseAppearance-sectionHeading').sunFwSerializeAll();
				var contentData 	= $('#collapseAppearance-sectionContent').sunFwSerializeAll();
				
				var linkData 	= $('#collapseAppearance-sectionLink :input').serializeArray();
				
				var buttonData 	= $('#collapseAppearance-sectionButton').sunFwSerializeAll();
				var fontType = $('#collapseAppearance-sectionHeading #sunfw_appearance_section_heading_headings_font_type').val();
				var URLPattern=/^(http|https)/i;
				
				container.removeAttr('style');
				$.each(containerData, function (key, item){
					var name = item.name;
					
					switch (name)
					{
						case 'sunfw-appearance[section-container-border]':
							container.css('border', item.value);
							break;
						case 'sunfw-appearance[section-container-background-background-type]':

							var bgSection = $( "input[name='sunfw-appearance[section-container-background-background-color]']").val();
							container.css('background-color', bgSection);

							var bgSectionImage		= $( "input[name='sunfw-appearance[section-container-background-background-image]']").val();
							var bgSectionRepeat		= $( "select[name='sunfw-appearance[section-container-background-background-repeat]']").val();
							var bgSectionSize		= $( "select[name='sunfw-appearance[section-container-background-background-size]']").val();
							var bgSectionAttachment	= $( "select[name='sunfw-appearance[section-container-background-background-attachment]']").val();
							var bgSectionPosition	= $( "select[name='sunfw-appearance[section-container-background-background-position]']").val();

							if (!URLPattern.test(bgSectionImage))
							{
								bgSectionImage = $('#jsn-tpl-root').val() + bgSectionImage;
							}
							
							container.css({'background-image': 'url("' + bgSectionImage + '")', 'background-position': bgSectionPosition, 'background-attachment': bgSectionAttachment, 'background-size': bgSectionSize, 'background-repeat': bgSectionRepeat});

							break;

						default:
							break;

					}
				});		
				
				var headingInherit = false;
				
				if ($('#sunfw_appearance_section_heading_inherit_yes').is(':checked'))
				{
					headingInherit = true;
				}
				
				heading.removeAttr('style');
				heading.css('font-family', $('#sunfw_appearance_general_headings_headings_font_family').val());
				heading.css('font-style', $('#sunfw_appearance_general_headings_headings_font_style').val());
				heading.css('font-weight', $('#sunfw_appearance_general_headings_headings_font_weight').val());
				
				$.each(headingData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[section-heading-headings-color]':
								if (headingInherit)
								{
									heading.css('color', $('#sunfw_appearance_general_headings_headings_color').val());
								}
								else
								{	
									heading.css('color', item.value);
								}
						break;	
						case 'sunfw-appearance[section-heading-headings-base-size]':
							if (headingInherit)
							{
								var $fontSize = parseInt($('#sunfw_appearance_general_headings_headings_base_size').val());

								heading1.css('font-size', Math.floor($fontSize * 2.6));
								heading1.children().html(Math.floor($fontSize * 2.6)+'px');

								heading2.css('font-size', Math.floor($fontSize * 2.15));
								heading2.children().html(Math.floor($fontSize * 2.15)+'px');

								heading3.css('font-size', Math.ceil($fontSize * 1.7));
								heading3.children().html(Math.ceil($fontSize * 1.7)+'px');

								heading4.css('font-size', Math.ceil($fontSize * 1.25));
								heading4.children().html(Math.ceil($fontSize * 1.25)+'px');

								heading5.css('font-size', $fontSize);
								heading5.children().html($fontSize+'px');

								heading6.css('font-size', Math.ceil($fontSize * 0.85));
								heading6.children().html(Math.ceil($fontSize * 0.85)+'px');
							}
							else
							{
								var $fontSize = parseInt(item.value);

								heading1.css('font-size', Math.floor($fontSize * 2.6));
								heading1.children().html(Math.floor($fontSize * 2.6)+'px');

								heading2.css('font-size', Math.floor($fontSize * 2.15));
								heading2.children().html(Math.floor($fontSize * 2.15)+'px');

								heading3.css('font-size', Math.ceil($fontSize * 1.7));
								heading3.children().html(Math.ceil($fontSize * 1.7)+'px');

								heading4.css('font-size', Math.ceil($fontSize * 1.25));
								heading4.children().html(Math.ceil($fontSize * 1.25)+'px');

								heading5.css('font-size', item.value);
								heading5.children().html(item.value);

								heading6.css('font-size', Math.ceil($fontSize * 0.85));
								heading6.children().html(Math.ceil($fontSize * 0.85)+'px');
							}							

							break;
						case 'sunfw-appearance[section-heading-headings-letter-spacing]':
							if (headingInherit)
							{
								heading.css('letter-spacing', $('#sunfw_appearance_general_headings_headings_letter_spacing').val());
							}
							else
							{
								heading.css('letter-spacing', item.value);
							}					
							break;
						case 'sunfw-appearance[section-heading-headings-line-height]':
							if (headingInherit)
							{
								heading.css('line-height', $('#sunfw_appearance_general_headings_headings_line_height').val());
							}
							else
							{
								heading.css('line-height', item.value);
							}	
							break;
						case 'sunfw-appearance[section-heading-headings-text-transform]':
							if (headingInherit)
							{
								heading.css('text-transform', $('#sunfw_appearance_general_headings_headings_text_transform').val());
							}
							else
							{
								heading.css('text-transform', item.value);
							}							
							break;	
						case 'sunfw-appearance[section-heading-headings-text-shadow]':
								heading.css({"-webkit-text-shadow": item.value, "-moz-text-shadow": item.value, "text-shadow": item.value});
							break;
						case 'sunfw-appearance[section-heading-headings-box-shadow]':
								heading.css({"-webkit-box-shadow": item.value, "-moz-box-shadow": item.value, "box-shadow": item.value});	
							break;						
						default:
							break;
												
					}
				});	
				
				var contentInherit = false;
				
				if ($('#sunfw_appearance_section_content_inherit_yes').is(':checked'))
				{
					contentInherit = true;
				}
				
				content.removeAttr('style');
				content.css('font-family', $('#sunfw_appearance_general_content_font_family_base').val());
				content.css('font-style', $('#sunfw_appearance_general_content_font_style').val());
				$.each(contentData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[section-content-color]':
								if (contentInherit)
								{
									content.css('color', $('#sunfw_appearance_general_content_text_color').val());
								}
								else
								{
									content.css('color', item.value);
								}	
							break;
						case 'sunfw-appearance[section-content-font-size-base]':
							if (contentInherit)
							{
								content.css('font-size', $('#sunfw_appearance_general_content_font_size_base').val());
							}
							else
							{
								content.css('font-size', item.value);
							}	
						break;							
						case 'sunfw-appearance[section-content-font-weight]':
							if (contentInherit)
							{
								content.css('font-weight', $('#sunfw_appearance_general_content_font_weight').val());
							}
							else
							{
								content.css('font-weight', item.value);
							}	
							break;
						case 'sunfw-appearance[section-content-text-shadow]':
								content.css({"-webkit-text-shadow": item.value, "-moz-text-shadow": item.value, "text-shadow": item.value});
							break;;						
						case 'sunfw-appearance[section-content-line-height]':
								if (contentInherit)
								{
									content.css('line-height', $('#sunfw_appearance_general_content_line_height_base').val());
								}
								else
								{
									content.css('line-height', item.value);
								}	
							break;
						case 'sunfw-appearance[section-content-letter-spacing]':
								if (contentInherit)
								{
									content.css('letter-spacing', $('#sunfw_appearance_general_content_letter_spacing').val());	
								}
								else
								{
									content.css('letter-spacing', item.value);	
								}
							break;
							
						default:
							break;
												
					}
				});	

				var linkInherit = false;
				
				if ($('#sunfw_appearance_section_link_inherit_yes').is(':checked'))
				{
					linkInherit = true;
				}
				
				link.removeAttr('style');			
				$.each(linkData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[section-link-link-color]':
							if (linkInherit)
							{	
								link.css('color', $('#sunfw_appearance_general_link_link_color').val());
							}
							else
							{
								link.css('color', item.value);
							}
							break;
						default:
							break;
												
					}
				});		

				link.hover(
						  function() {
							if (linkInherit)
							{
								$( this ).css('color', $('#sunfw_appearance_general_link_link_hover_color').val());
							}
							else
							{
								$( this ).css('color', $('#sunfw_appearance_section_link_link_color_hover').val());
							}	
						  }, function() {
								if (linkInherit)
								{
									$( this ).css('color', $('#sunfw_appearance_general_link_link_color').val());
								}
								else
								{
									$( this ).css('color', $('#sunfw_appearance_section_link_link_color').val());
								}							  
						  }
						);				
				var buttonInherit = false;
				
				if ($('#sunfw_appearance_section_button_btn_inherit_yes').is(':checked'))
				{
					buttonInherit = true;
				}
				
				buttonDefault.removeAttr('style');
				buttonPrimary.removeAttr('style');
				
				$.each(buttonData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[section-button-btn-default-padding]':
							if (buttonInherit)
							{
								buttonDefault.css('padding', $('#sunfw_appearance_general_button_btn_default_padding').val());
								buttonPrimary.css('padding', $('#sunfw_appearance_general_button_btn_default_padding').val());
							}
							else
							{
								buttonDefault.css('padding', item.value);
								buttonPrimary.css('padding', item.value);
							}
							break;
						
						case 'sunfw-appearance[section-button-btn-default-bg]':
							if (buttonInherit)
							{
								buttonDefault.css('background-color', $('#sunfw_appearance_general_button_btn_default_bg').val());
							}
							else
							{	
								buttonDefault.css('background-color', item.value);
							}
							break;
						case 'sunfw-appearance[section-button-btn-default-border]':
							if (buttonInherit)
							{
								var generalButtonBorder = $('#sunfw_appearance_general_button_btn_default_border_all').val();
								buttonDefault.css('border', generalButtonBorder);
								buttonPrimary.css('border', item.value);
							}
							else
							{	
								buttonDefault.css('border', item.value);
								buttonPrimary.css('border', item.value);
							}
							break;
						case 'sunfw-appearance[section-button-btn-default-radius]':
							if (buttonInherit)
							{
								var generalButtonBorderRadius = $('#sunfw_appearance_general_button_btn_default_radius').val();
								buttonDefault.css({'border-radius': generalButtonBorderRadius, '-moz-border-radius': generalButtonBorderRadius, '-webkit-border-radius': generalButtonBorderRadius});
								buttonPrimary.css({'border-radius': generalButtonBorderRadius, '-moz-border-radius': generalButtonBorderRadius, '-webkit-border-radius': generalButtonBorderRadius});
							}
							else
							{	
								buttonDefault.css({'border-radius': item.value, '-moz-border-radius': item.value, '-webkit-border-radius': item.value});
								buttonPrimary.css({'border-radius': item.value, '-moz-border-radius': item.value, '-webkit-border-radius': item.value});
							}
							break;
						case 'sunfw-appearance[section-button-btn-default-font-style]':
							if (buttonInherit)
							{
								var generalButtonFontStyle = $('#sunfw_appearance_general_button_btn_default_font_style').val();
								buttonDefault.css('font-style', generalButtonFontStyle);
								buttonPrimary.css('font-style', generalButtonFontStyle);
							}
							else
							{	
								buttonDefault.css('font-style', item.value);
								buttonPrimary.css('font-style', item.value);
							}
							break;
						case 'sunfw-appearance[section-button-btn-default-font-weight]':
							if (buttonInherit)
							{
								var generalButtonFontWeight = $('#sunfw_appearance_general_button_btn_default_font_weight').val();
								buttonDefault.css('font-weight', generalButtonFontWeight);
								buttonPrimary.css('font-weight', generalButtonFontWeight);
							}
							else
							{	
								buttonDefault.css('font-weight', item.value);
								buttonPrimary.css('font-weight', item.value);
							}
							break;
						case 'sunfw-appearance[section-button-btn-default-font-size]':
							if (buttonInherit)
							{
								var generalButtonFontSize = $('#sunfw_appearance_general_button_btn_default_font_size').val();
								buttonDefault.css('font-size', generalButtonFontSize);
								buttonPrimary.css('font-size', generalButtonFontSize);
							}
							else
							{	
								buttonDefault.css('font-size', item.value);
								buttonPrimary.css('font-size', item.value);
							}							
							break;
						case 'sunfw-appearance[section-button-btn-default-letter-spacing]':
							if (buttonInherit)
							{
								var generalButtonLetterSpacing = $('#sunfw_appearance_general_button_btn_default_letter_spacing').val();
								buttonDefault.css('letter-spacing', generalButtonLetterSpacing);
								buttonPrimary.css('letter-spacing', generalButtonLetterSpacing);
							}
							else
							{	
								buttonDefault.css('letter-spacing', item.value);
								buttonPrimary.css('letter-spacing', item.value);
							}							
							break;
						case 'sunfw-appearance[section-button-btn-default-color]':
							if (buttonInherit)
							{
								var generalButtonColor = $('#sunfw_appearance_general_button_btn_default_color').val();
								buttonDefault.css('color', generalButtonColor);
							}
							else
							{	
								buttonDefault.css('color', item.value);
							}								
							break;
						case 'sunfw-appearance[section-button-btn-default-color-hover]':
							break;
						case 'sunfw-appearance[section-button-btn-default-text-transform]':
							if (buttonInherit)
							{
								var generalButtonColor = $('#sunfw_appearance_general_button_btn_default_text_transform').val();
								buttonDefault.css('text-transform', generalButtonColor);
								buttonPrimary.css('text-transform', generalButtonColor);
							}
							else
							{	
								buttonDefault.css('text-transform', item.value);
								buttonPrimary.css('text-transform', item.value);
							}							
							break;
						case 'sunfw-appearance[section-button-btn-default-text-shadow]':
							buttonDefault.css({"-webkit-text-shadow": item.value, "-moz-text-shadow": item.value, "text-shadow": item.value}); 
							break;
						case 'sunfw-appearance[section-button-btn-default-box-shadow]':
							buttonDefault.css({"-webkit-box-shadow": item.value, "-moz-box-shadow": item.value, "box-shadow": item.value});						
							break;
						case 'sunfw-appearance[section-button-btn-primary-bg]':
							if (buttonInherit)
							{
								var generalPrimaryButtonColor = $('#sunfw_appearance_general_button_btn_primary_bg').val();
								buttonPrimary.css('background-color', generalPrimaryButtonColor);
							}
							else
							{	
								buttonPrimary.css('background-color', item.value);
							}
						case 'sunfw-appearance[section-button-btn-primary-color]':
							if (buttonInherit)
							{
								var generalPrimaryColor = $('#sunfw_appearance_general_button_btn_primary_color').val();
								buttonPrimary.css('color', generalPrimaryColor);
							}
							else
							{	
								buttonPrimary.css('color', item.value);
							}							
							break;
						case 'sunfw-appearance[section-button-btn-primary-text-shadow]':
							buttonPrimary.css({"-webkit-text-shadow": item.value, "-moz-text-shadow": item.value, "text-shadow": item.value});
							break;	
						case 'sunfw-appearance[section-button-btn-primary-box-shadow]':
							buttonPrimary.css({"-webkit-box-shadow": item.value, "-moz-box-shadow": item.value, "box-shadow": item.value});	
							break;						
						default:
							break;
												
					}
				});		
				
				buttonDefault.hover(
						  function() {
							if (buttonInherit)
							{
								$( this ).css('background-color', $('#sunfw_appearance_general_button_btn_default_bg_hover').val());
							}
							else
							{
								$( this ).css('background-color', $('#sunfw_appearance_section_button_btn_default_bg_hover').val());
							}	
						  }, function() {
								if (buttonInherit)
								{
									$( this ).css('background-color', $('#sunfw_appearance_general_button_btn_default_bg').val());
								}
								else
								{
									$( this ).css('background-color', $('#sunfw_appearance_section_button_btn_default_bg').val());
								}							  
						  }
						);
				
				buttonPrimary.hover(
						  function() {
							if (buttonInherit)
							{
								$( this ).css('background-color', $('#sunfw_appearance_general_button_btn_primary_bg_hover').val());
							}
							else
							{
								$( this ).css('background-color', $('#sunfw_appearance_section_button_btn_primary_bg_hover').val());
							}	
						  }, function() {
								if (buttonInherit)
								{
									$( this ).css('background-color', $('#sunfw_appearance_general_button_btn_primary_bg').val());
								}
								else
								{
									$( this ).css('background-color', $('#sunfw_appearance_section_button_btn_primary_bg').val());
								}							  
						  }
						);				
			},
			previewModule: function () {
				var containerData 	= $('#collapseAppearance-moduleContainer :input').serializeArray();
				var titleData 		= $('#collapseAppearance-moduleTitle :input').serializeArray();
				var contentData 	= $('#collapseAppearance-moduleContent :input').serializeArray();
				var linkData 		= $('#collapseAppearance-moduleLink :input').serializeArray();
				var buttonData 		= $('#collapseAppearance-moduleButton :input').serializeArray();

				var parent 	 		= $('.sunfw_appearance_preview_module_wrapper');
				var container 		= $('.sunfw_appearance_preview_module_container', parent);
				var title	 		= $('.sunfw_appearance_preview_module_title', parent);
				var content	 		= $('.sunfw_appearance_preview_module_content', parent);
				var link			= $('.sunfw_appearance_preview_module_link', parent);
				var icon			= $('.sunfw_appearance_preview_module_title_icon', parent);
				
				var buttonDefault 	= $('.btn-sunfw-appearance-preview-module-default', parent);
				var buttonPrimary 	= $('.btn-sunfw-appearance-preview-module-primary', parent);
				var URLPattern		=/^(http|https)/i;
				
				container.removeAttr('style');

				$.each(containerData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[module-container-border]':
							container.css('border', item.value);
							break;
						case 'sunfw-appearance[module-container-border-radius]':
							container.css({'border-radius': item.value, '-moz-border-radius': item.value, '-webkit-border-radius': item.value});
							break;
						case 'sunfw-appearance[module-container-padding]':
							container.css('padding', item.value);
							break;							
						case 'sunfw-appearance[module-container-background-background-type]':

							var bgColor = $( "input[name='sunfw-appearance[module-container-background-background-color]']").val();
							
							container.css('background-color', bgColor);

							var bgImage = $( "input[name='sunfw-appearance[module-container-background-background-image]']").val();
							var bgRepeat = $( "select[name='sunfw-appearance[module-container-background-background-repeat]']").val();
							var bgSize = $( "select[name='sunfw-appearance[module-container-background-background-size]']").val();
							var bgAttachment = $( "select[name='sunfw-appearance[module-container-background-background-attachment]']").val();
							var bgPosition = $( "select[name='sunfw-appearance[module-container-background-background-position]']").val();
							if (!URLPattern.test(bgImage))
							{
								bgImage = $('#jsn-tpl-root').val() + bgImage;
							}
							
							container.css({'background-image': 'url("' + bgImage + '")', 'background-position': bgPosition, 'background-attachment': bgAttachment, 'background-size': bgSize, 'background-repeat': bgRepeat});
						break;							
						default:
							break;
												
					}
				});
				
				title.removeAttr('style');
				title.css('font-family', $('#sunfw_appearance_general_headings_headings_font_family').val());
				title.css('font-style', $('#sunfw_appearance_general_headings_headings_font_style').val());
				title.css('font-weight', $('#sunfw_appearance_general_headings_headings_font_weight').val())
				icon.removeClass("fa-lg fa-2x fa-3x fa-4x fa-5x");
				$.each(titleData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[module-title-border-bottom]':
								title.css('border-bottom', item.value);
							break;
						case 'sunfw-appearance[module-title-bg-color]':
								title.css('background-color', item.value);
							break;
						case 'sunfw-appearance[module-title-font-size]':
							title.css('font-size', item.value);
							break;
						case 'sunfw-appearance[module-title-text-color]':
								title.css('color', item.value);
							break;
						case 'sunfw-appearance[module-title-text-icon-size]':
								icon.addClass(item.value);
							break;						
						case 'sunfw-appearance[module-title-text-icon-color]':
								icon.css('color', item.value);
							break;							
						default:
							break;
												
					}
				});	
				
				content.removeAttr('style');	
				content.css('font-family', $('#sunfw_appearance_general_content_font_family_base').val());
				content.css('font-style', $('#sunfw_appearance_general_content_font_style').val());
				content.css('font-weight', $('#sunfw_appearance_general_content_font_weight').val());
				$.each(contentData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[module-content-color]':
								content.css('color', item.value);
							break;
						case 'sunfw-appearance[module-content-font-size]':
							content.css('font-size', item.value);
							break;
						default:
							break;
												
					}
				});
				
				link.removeAttr('style');
				$.each(linkData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[module-link-link-color]':
								link.css('color', item.value);
							break;						
						default:
							break;
												
					}		
				});	

				link.hover(
						  function() {
						    $( this ).css('color', $('#sunfw_appearance_module_link_link_color_hover').val());
						  }, function() {
						    $( this ).css('color', $('#sunfw_appearance_module_link_link_color').val());
						  }
						);
				
				var buttonInherit	=false;
				
				if ( $('#sunfw_appearance_module_button_btn_inherit_yes' ).is(':checked'))
				{
					buttonInherit = true;
				}
				
				buttonDefault.removeAttr('style');
				buttonPrimary.removeAttr('style');
				$.each(buttonData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[module-button-btn-default-padding]':
							if ( buttonInherit )
							{
								buttonDefault.css('padding', $('#sunfw_appearance_general_button_btn_default_padding').val());
								buttonPrimary.css('padding', $('#sunfw_appearance_general_button_btn_default_padding').val());
							}
							else
							{
								buttonDefault.css('padding', item.value);
								buttonPrimary.css('padding', item.value);	
							}
							break;

						case 'sunfw-appearance[module-button-btn-default-bg]':
							if ( buttonInherit )
							{
								buttonDefault.css('background-color', $('#sunfw_appearance_general_button_btn_default_bg').val());
							}
							else
							{
								buttonDefault.css('background-color', item.value);
							}
							break;
//						case 'sunfw-appearance[general-button-btn-default-bg-hover]':
//								link.css('font-family', item.value);
//							break;
						case 'sunfw-appearance[module-button-btn-default-border-all]':
							if ( buttonInherit )
							{
								var generalButtonBorder = $('#sunfw_appearance_general_button_btn_default_border_all').val();
								buttonDefault.css('border', generalButtonBorder);
								buttonPrimary.css('border', item.value);
							}
							else
							{
								buttonDefault.css('border', item.value);
								buttonPrimary.css('border', item.value);
							}
							break;
						case 'sunfw-appearance[module-button-btn-default-radius]':
							if ( buttonInherit )
							{
								var generalButtonBorderRadius = $('#sunfw_appearance_general_button_btn_default_radius').val();
								buttonDefault.css({'border-radius': generalButtonBorderRadius, '-moz-border-radius': generalButtonBorderRadius, '-webkit-border-radius': generalButtonBorderRadius});
								buttonPrimary.css({'border-radius': generalButtonBorderRadius, '-moz-border-radius': generalButtonBorderRadius, '-webkit-border-radius': generalButtonBorderRadius});
							}
							else
							{
								buttonDefault.css({'border-radius': item.value, '-moz-border-radius': item.value, '-webkit-border-radius': item.value});
								buttonPrimary.css({'border-radius': item.value, '-moz-border-radius': item.value, '-webkit-border-radius': item.value});
							}
							break;
						case 'sunfw-appearance[module-button-btn-default-font-style]':
							if ( buttonInherit )
							{
								var generalButtonFontStyle = $('#sunfw_appearance_general_button_btn_default_font_style').val();
								buttonDefault.css('font-style', generalButtonFontStyle);
								buttonPrimary.css('font-style', generalButtonFontStyle);
							}
							else
							{
								buttonDefault.css('font-style', item.value);
								buttonPrimary.css('font-style', item.value);
							}
							break;
						case 'sunfw-appearance[module-button-btn-default-font-weight]':
							if ( buttonInherit )
							{
								var generalButtonFontWeight = $('#sunfw_appearance_general_button_btn_default_font_weight').val();
								buttonDefault.css('font-weight', generalButtonFontWeight);
								buttonPrimary.css('font-weight', generalButtonFontWeight);
							}
							else
							{
								buttonDefault.css('font-weight', item.value);
								buttonPrimary.css('font-weight', item.value);
							}
							break;
						case 'sunfw-appearance[module-button-btn-default-font-size]':
							if ( buttonInherit )
							{
								var generalButtonFontSize = $('#sunfw_appearance_general_button_btn_default_font_size').val();
								buttonDefault.css('font-size', generalButtonFontSize);
								buttonPrimary.css('font-size', generalButtonFontSize);
							}
							else
							{
								buttonDefault.css('font-size', item.value);
								buttonPrimary.css('font-size', item.value);
							}
							break;
						case 'sunfw-appearance[module-button-btn-default-letter-spacing]':
							if ( buttonInherit )
							{
								var generalButtonLetterSpacing = $('#sunfw_appearance_general_button_btn_default_letter_spacing').val();
								buttonDefault.css('letter-spacing', generalButtonLetterSpacing);
								buttonPrimary.css('letter-spacing', generalButtonLetterSpacing);
							}
							else
							{
								buttonDefault.css('letter-spacing', item.value);
								buttonPrimary.css('letter-spacing', item.value);
							}
							break;
						case 'sunfw-appearance[module-button-btn-default-color]':
							if ( buttonInherit )
							{
								var generalButtonColor = $('#sunfw_appearance_general_button_btn_default_color').val();
								buttonDefault.css('color', generalButtonColor);
							}
							else
							{
								buttonDefault.css('color', item.value);
							}
							break;
						case 'sunfw-appearance[module-button-btn-default-text-transform]':
							if ( buttonInherit )
							{
								var generalButtonColor = $('#sunfw_appearance_general_button_btn_default_text_transform').val();
								buttonDefault.css('text-transform', generalButtonColor);
								buttonPrimary.css('text-transform', generalButtonColor);
							}
							else
							{
								buttonDefault.css('text-transform', item.value);
								buttonPrimary.css('text-transform', item.value);
							}
							break;
						case 'sunfw-appearance[module-button-btn-default-text-shadow]':
							if ( buttonInherit )
							{
								var generalButtonColor = $('#sunfw_appearance_general_button_btn_default_text_shadow').val();
								buttonDefault.css('text-transform', generalButtonColor);
							}
							else
							{
								buttonDefault.css({"-webkit-text-shadow": item.value, "-moz-text-shadow": item.value, "text-shadow": item.value});
							}
							break;
						case 'sunfw-appearance[module-button-btn-default-box-shadow]':
							if ( buttonInherit )
							{
								var generalButtonColor = $('#sunfw_appearance_general_button_btn_default_box_shadow').val();
								buttonDefault.css('text-transform', generalButtonColor);
							}
							else
							{
								buttonDefault.css({"-webkit-box-shadow": item.value, "-moz-box-shadow": item.value, "box-shadow": item.value});
							}
							break;							
						case 'sunfw-appearance[module-button-btn-primary-bg]':
							if ( buttonInherit )
							{
								var generalPrimaryButtonColor = $('#sunfw_appearance_general_button_btn_primary_bg').val();
								buttonPrimary.css('background-color', generalPrimaryButtonColor);
							}
							else
							{
								buttonPrimary.css('background-color', item.value);
							}
						break;
						case 'sunfw-appearance[module-button-btn-primary-color]':
							if ( buttonInherit )
							{
								var generalPrimaryColor = $('#sunfw_appearance_general_button_btn_primary_color').val();
								buttonPrimary.css('color', generalPrimaryColor);
							}
							else
							{
								buttonPrimary.css('color', item.value);
							}
							break;
						case 'sunfw-appearance[module-button-btn-primary-color-hover]':
							break;
						case 'sunfw-appearance[module-button-btn-primary-text-shadow]':
							if ( buttonInherit )
							{
								var generalButtonColor = $('#sunfw_appearance_general_button_btn_primary_text_shadow').val();
								buttonDefault.css('text-transform', generalButtonColor);
							}
							else
							{
								buttonPrimary.css({"-webkit-text-shadow": item.value, "-moz-text-shadow": item.value, "text-shadow": item.value});
							}
							break;
						case 'sunfw-appearance[module-button-btn-primary-box-shadow]':
							if ( buttonInherit )
							{
								var generalButtonColor = $('#sunfw_appearance_general_button_btn_primary_box_shadow').val();
								buttonDefault.css('text-transform', generalButtonColor);
							}
							else
							{
								buttonPrimary.css({"-webkit-box-shadow": item.value, "-moz-box-shadow": item.value, "box-shadow": item.value});
							}
							break;							
						default:
							break;
												
					}
				});	
				
				buttonDefault.hover(
						  function() {
							if (buttonInherit)
							{
								$( this ).css('background-color', $('#sunfw_appearance_general_button_btn_default_bg_hover').val());
							}
							else
							{
								$( this ).css('background-color', $('#sunfw_appearance_module_button_btn_default_bg_hover').val());
							}	
						  }, function() {
								if (buttonInherit)
								{
									$( this ).css('background-color', $('#sunfw_appearance_general_button_btn_default_bg').val());
								}
								else
								{
									$( this ).css('background-color', $('#sunfw_appearance_module_button_btn_default_bg').val());
								}							  
						  }
						);
				
				buttonPrimary.hover(
						  function() {
							if (buttonInherit)
							{
								$( this ).css('background-color', $('#sunfw_appearance_general_button_btn_primary_bg_hover').val());
							}
							else
							{
								$( this ).css('background-color', $('#sunfw_appearance_module_button_btn_primary_bg_hover').val());
							}	
						  }, function() {
								if (buttonInherit)
								{
									$( this ).css('background-color', $('#sunfw_appearance_general_button_btn_primary_bg').val());
								}
								else
								{
									$( this ).css('background-color', $('#sunfw_appearance_module_button_btn_primary_bg').val());
								}							  
						  }
						);
			},

			previewMenu: function() {
				var parentMenuData 	= $('#collapseAppearance-menuParentmenu :input').serializeArray();
				var subMenuData 	= $('#collapseAppearance-menuSubmenu :input').serializeArray();

				var nav 		= $('#sunfw-mainmenu.sunfw_appearance_preview_menu_main_menu');
				var parent_link = $('ul.navbar-nav > li > a',nav);
				var sub_menu	= $('ul.dropdown-menu',nav);
				var sub_link 	= $('li a',sub_menu);

				nav.removeAttr('style');	
				parent_link.removeAttr('style');	
				
				$.each(parentMenuData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[menu-parentmenu-font-size]':
							parent_link.css('font-size', item.value);
							break;
						case 'sunfw-appearance[menu-parentmenu-line-height]':
							parent_link.css('line-height', item.value);
							break;								
						case 'sunfw-appearance[menu-parentmenu-link-color]':
							parent_link.css('color', item.value);
							break;												
						case 'sunfw-appearance[menu-parentmenu-bg]':
							nav.css('background', item.value);
							parent_link.css('background', item.value);
							break;					
						default:
							break;
												
					}
				});
				parent_link.hover(
					function() {
						$( this ).css('color', $('#sunfw_appearance_menu_parentmenu_link_hover_color').val());
						$( this ).css('background', $('#sunfw_appearance_menu_parentmenu_bg_hover').val());
						}, function() {
						$( this ).css('color', $('#sunfw_appearance_menu_parentmenu_link_color').val());
						$( this ).css('background', $('#sunfw_appearance_menu_parentmenu_bg').val());
					}
				);
						
				sub_menu.removeAttr('style');	
				sub_menu.css('display','block');
				sub_link.removeAttr('style');			
				$.each(subMenuData, function (key, item){
					var name = item.name;
					
					switch (name) 
					{
						case 'sunfw-appearance[menu-submenu-submenu-font-size]':
							sub_link.css('font-size', item.value);
							break;
						case 'sunfw-appearance[menu-submenu-submenu-link-color]':
							sub_link.css('color', item.value);
							break;												
						case 'sunfw-appearance[menu-submenu-submenu-bg]':
							sub_menu.css('background', item.value);
							break;					
						default:
							break;
												
					}
				});	
				sub_link.hover(
					function() {
						$( this ).css('color', $('#sunfw_appearance_menu_submenu_submenu_link_hover_color').val());
						$( this ).css('background','transparent');
						}, function() {
						$( this ).css('color', $('#sunfw_appearance_menu_submenu_submenu_link_color').val());
					}
				);							
			},
	        autoSave: function () {
				var token        = document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      = document.querySelector( '#jsn-style-id'  ).value;
				var templateName = document.querySelector( '#jsn-tpl-name'  ).value;	

				var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=appearance&'
					+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=autoSave';
				
				var postData = [];
				var data = $('#style-form').serializeArray();
				$.each(data, function (index, value) {

					if (value.name != 'module')
					{	
						postData.push(value);
					}
				});	
			
				$.ajax({
					
					url: server,
					data: postData,
					type: 'POST',
					dataType: 'html',
					complete: function(data, status) {
					}
				});	
	        },
	        
	        getLayoutBuilderSectionList: function()
	        {
				$('#sunfw_appearance_section_name').empty();
				$('#sunfw_appearance_section_name').find('option:first-child').prop('selected', true).end().trigger('liszt:updated');
				var token        = document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      = document.querySelector( '#jsn-style-id'  ).value;
				var templateName = document.querySelector( '#jsn-tpl-name'  ).value;
				var link = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=appearance&'
					+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=getLayoutBuilderSectionList';					
				$.ajax({
					url: link,
					type: 'GET',
					dataType: 'JSON',
					complete: function(data, status) {
						var resp = $.parseJSON(data.responseText);						
						$.each(resp.data, function(key, item) {
						    $('#sunfw_appearance_section_name').append($("<option/>", {
						        value: item.value,
						        text: item.text,
						    }));
						});
						$('#sunfw_appearance_section_name').find('option:first-child').prop('selected', true).end().trigger('liszt:updated');
					}
				});		        	
	        },
	        setPreset: function (e)
	        {
				var token        = document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      = document.querySelector( '#jsn-style-id'  ).value;
				var templateName = document.querySelector( '#jsn-tpl-name'  ).value;
				var self = this;
				
				bootbox.confirm(window.sunfw_appearance.text['are-you-sure-you-want-to-select-this-preset'], function(result) {
					if (result == true) 
					{
					    var presetKey = $(e).attr('data-preset-key');
						var server = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=appearance&'
							+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=getPreset';
					
						$.ajax({
							url: server,
							data: {
								preset_key: presetKey
							},
							type: 'POST',
							dataType: 'html',
							complete: function(data, status) {
								var resp = $.parseJSON(data.responseText);
								if (resp.type == 'success')
								{	
									var resp = $.parseJSON(data.responseText);	

									$("#sunfw_appearance_type option[value='general']").attr("selected", true);
									$('#sunfw_appearance_type').val('general').trigger('liszt:updated');

									$("#sunfw_appearance_section_name option[value='']").attr("selected", true);
									$('#sunfw_appearance_section_name').val('').trigger('liszt:updated');

									$("#sunfw_appearance_module_style option[value='']").attr("selected", true);
									$('#sunfw_appearance_module_style').val('').trigger('liszt:updated');
									
									$('.apperance-type-container').addClass('sunfwhide');
									$('.apperance-preview-container').addClass('sunfwhide');
									$('#sunfw_appearance_section_name').addClass('sunfwhide');
									$('#sunfw_appearance_section_name_chzn').hide();
									
									$('#sunfw_appearance_module_style_chzn').hide();
									$('#sunfw_appearance_module_style').addClass('sunfwhide');	
																		
									$('#sunfw_appearance_selected_type').val('general');
									$('#appearance-general-container').removeClass('sunfwhide');
									$('#appearance-general-container-preview').removeClass('sunfwhide');
									
									$('#sunfw_appearance_selected_type').val('general');
									$("#sunfw_appearance_selected_section_id").val('');
									$("#sunfw_appearance_selected_module_style").val('');
									
									$.each(resp.data, function (subIndex, subValue) {
										var tmpSubIndex = subIndex.replace(/-/g, "_"); 
										
										$('#sunfw_appearance_general_' + tmpSubIndex).val(subValue);
										$('#sunfw_appearance_general_' + tmpSubIndex).trigger('change');
										$('#sunfw_appearance_general_' + tmpSubIndex).trigger('liszt:updated');
									});
									
									self.previewGeneral();
								}
							}
						});	
					}
				}); 	        	
	        },
	        
	        selectFirstModuleStyle: function (value)
	        {
				var token        = document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      = document.querySelector( '#jsn-style-id'  ).value;
				var templateName = document.querySelector( '#jsn-tpl-name'  ).value;
				
	        	var self = this;
	        	$("#sunfw_appearance_selected_module_style").val(value);
				var link = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=appearance&'
					+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=getModuleStyleData';					
				$.ajax({
					url: link,
					type: 'GET',
					dataType: 'JSON',
					complete: function(data, status) {
						
						var resp = $.parseJSON(data.responseText);
						if (resp.type == 'success')
						{	
							var moduleData = resp.data;
						
							$.each(moduleData, function (index, item) {
								
								if (index == value)
								{
									$.each(item, function (subIndex, subValue) {
										var tmpSubIndex = subIndex.replace(/-/g, "_"); 
										
										$('#sunfw_appearance_module_' + tmpSubIndex).val(subValue);
										$('#sunfw_appearance_module_' + tmpSubIndex).trigger('change');
										$('#sunfw_appearance_module_' + tmpSubIndex).trigger('liszt:updated');
									});
									
									self.previewModule();
									return false;
								}	
							});
						}
						else
						{
							alert(resp.data);
						}	
					}
				});		        	
	        },
	        
	        selectFirstSection: function (value)
	        {
				var token        = document.querySelector( '#jsn-tpl-token' ).value;
				var styleID      = document.querySelector( '#jsn-style-id'  ).value;
				var templateName = document.querySelector( '#jsn-tpl-name'  ).value;
				
	        	var self = this;
	        	$("#sunfw_appearance_selected_section_id").val(value);
				var link = 'index.php?option=com_ajax&format=json&plugin=sunfw&context=appearance&'
					+ token + '=1&style_id=' + styleID + '&template_name=' + templateName + '&action=getSectionData';					
				$.ajax({
					url: link,
					type: 'GET',
					dataType: 'JSON',
					complete: function(data, status) {
						var resp = $.parseJSON(data.responseText);
						if (resp.type == 'success')
						{
							self.previewSection();
							var sectionData = resp.data;
							var hasValue = false;
							$.each(sectionData, function (index, item) {
								if (index == value)
								{
									hasValue = true;
									
									$.each(item, function (subIndex, subValue) {
										var tmpSubIndex = subIndex.replace(/-/g, "_"); 
										$('#sunfw_appearance_section_' + tmpSubIndex).val(subValue);											
										$('#sunfw_appearance_section_' + tmpSubIndex).trigger('change');
										$('#sunfw_appearance_section_' + tmpSubIndex).trigger('liszt:updated');
									});
									self.previewSection();
									return false;
								}	
							});
						
							if (!hasValue)
							{
								$.each($.parseJSON(self.defaultSectionParams), function (subIndex, subValue) {
									var tmpSubIndex = subIndex.replace(/-/g, "_"); 
									$('#sunfw_appearance_section_' + tmpSubIndex).val(subValue);											
									$('#sunfw_appearance_section_' + tmpSubIndex).trigger('change');
									$('#sunfw_appearance_section_' + tmpSubIndex).trigger('liszt:updated');
								});
								self.previewSection();
								return false;
							}	
						}
						else
						{
							alert(resp.data);
						}	
					}
				});		        	
	        }
	        
	        
	}
})(jQuery);