<?php
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

// No direct access to this file.
defined('_JEXEC') or die('Restricted access');

$inputID 		= $this->id;
$btnModalID 	= $this->id . '_btn_shadow_modal';
$modalTarget 	= $this->id . '_shadow_modal_target';
$wapID          = $inputID . "_wap";
$modelID        = $inputID . "_modal";
$fontWeightID 	= str_replace('-', '_', $this->parentName . "-" . $this->fontWeight);
$fontStyleID  	= str_replace('-', '_', $this->parentName . "-" . $this->fontStyle);
$fontTypeID  	= str_replace('-', '_', $this->parentName . "-" . $this->fontType);
$standardFontFamilyFakeID 	= $this->id . '_standard_font_family_fake';
$googleFontFamilyFakeID 	= $this->id . '_google_font_family_fake';

?>
<script type="text/javascript">
    (function($) {
        $(document).ready(function() {
			var objSunFwFont = new $.SunFwFont({
				'fontFamilyStandardData': <?php echo json_encode($this->fontFamilyStandardData);?>,
				'fontWeightStandardData': <?php echo json_encode($this->fontWeightStandardData);?>,
				'fontStyleStandardData': <?php echo json_encode($this->fontStyleStandardData);?>,
				'containerID': '<?php echo $wapID; ?>',
				'fontWeightID': '<?php echo $fontWeightID; ?>',
				'fontTypeID': '<?php echo $fontTypeID; ?>',
				'fontStyleID': '<?php echo $fontStyleID; ?>',
				'standardFontFamilyFakeID': '<?php echo $standardFontFamilyFakeID; ?>',
				'googleFontFamilyFakeID': '<?php echo $googleFontFamilyFakeID; ?>',
				'inputID': '<?php echo $inputID; ?>',
				'googleFontData': <?php echo $this->googleFontData; ?>,
				'subsets': <?php echo json_encode($this->subsets);?>
			});
        });
    })(jQuery);
</script>
<div id="<?php echo $wapID; ?>">

    <div class="form-group">
        <div class="control-label"><label>Font Type</label></div>
       	<?php echo JHTML::_('select.genericlist', $this->fontTypeData, $this->parentName. "[" . $this->fontType . "]", 'class="form-control font-type" data-value="' . (isset($this->data[(string) $this->fontType]) ? $this->data[(string) $this->fontType] : 'google') . '"' , 'value', 'text', isset($this->data[(string) $this->fontType]) ? $this->data[(string) $this->fontType] : 'standard', $fontTypeID); ?>
    </div>
    <div class="form-group">
        <div class="control-label"><label>Font Family</label></div>
		<input type="hidden" name="<?php echo $this->name;?>" value="<?php echo $this->value;?>" id="<?php echo $this->id;?>" />
        <div class="standard-font-wrapper sunfwhide">
        	<select id="<?php echo $standardFontFamilyFakeID; ?>" data-value="<?php echo isset($this->data[(string) $this->fontFamily]) ? $this->data[(string) $this->fontFamily] : '';?>" name="" class="form-control"></select>
		</div>
        <div class="input-group google-font-wrapper sunfwhide">
	        <input name="" id="<?php echo $googleFontFamilyFakeID; ?>" data-value="<?php echo isset($this->data[(string) $this->fontFamily]) ? $this->data[(string) $this->fontFamily] : '';?>" class="form-control g-font">
	        <span class="input-group-btn">
	            <button class="btn btn-default line-height-20" data-toggle="modal" href="#<?php echo $modelID?>" type="button"><i class="fa fa-font" aria-hidden="true"></i></button>
	        </span>
	    </div>
    </div>

    <div class="form-group">
        <div class="control-label"><label>Font Weight</label></div>
        <select data-value="<?php echo isset($this->data[(string) $this->fontWeight]) ? $this->data[(string) $this->fontWeight] : 'normal';?>" id="<?php echo $fontWeightID ; ?>" name="<?php echo $this->parentName. "[" . $this->fontWeight . "]"; ?>" name="<?php echo $this->parentName. "[" . $this->fontWeight . "]"; ?>" class="form-control"></select>
    </div>
    <div class="form-group">
        <div class="control-label"><label>Font Style</label></div>
        <select data-value="<?php echo isset($this->data[(string) $this->fontStyle]) ? $this->data[(string) $this->fontStyle] : 'normal';?>" id="<?php echo $fontStyleID; ?>" name="<?php echo $this->parentName. "[" . $this->fontStyle . "]"; ?>" class="form-control"></select>
    </div>


    <div class="modal fade" id="<?php echo $modelID?>">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Google Fonts</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="btn-group">
                                <button type="button" class="btn btn-danger">Categories</button>
                                <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                    <span class="caret"></span>
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <div class="dropdown-menu g-font-categories" style="padding: 15px;">

                                    <div class="checkbox">
                                        <label>
                                            <input type="checkbox" value="Serif" checked="">
                                            Serif
                                        </label>
                                    </div>

                                    <div class="checkbox disabled">
                                        <label>
                                            <input type="checkbox" value="Sans Serif" checked="">
                                            Sans Serif
                                        </label>
                                    </div>

                                    <div class="checkbox ">
                                        <label>
                                            <input type="checkbox" value="Display">
                                            Display
                                        </label>
                                    </div>

                                    <div class="checkbox ">
                                        <label>
                                            <input type="checkbox" value="Handwriting" >
                                            Handwriting
                                        </label>
                                    </div>

                                    <div class="checkbox ">
                                        <label>
                                            <input type="checkbox" value="Monospace">
                                            Monospace
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <select class="form-control g-font-languages">
                                <option value="all">All language</option>
                                <?php foreach ($subsets as $key => $value) { ?>
                                    <option value="<?php echo $value; ?>"><?php echo $value; ?></option>
                                <?php } ?>
                            </select>
                        </div>
                        <div class="col-sm-4">
                            <input type="text" class="form-control g-search" placeholder="Search for...">
                        </div>
                    </div>

                    <hr>
                    <span class="g-font-length">0</span> fonts
                    <hr>

                    <div class="container-fluid g-list-font">
                        <div class="row g-list-face">
                        </div>
                    </div>

                    <div class="g-settings">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h3 class="panel-title"><span class="g-settings-font-name">Panel title</span> <i class="fa fa-minus pull-right" aria-hidden="true"></i></h3>
                            </div>
                            <div class="panel-body">
                                <p><span class="label label-danger"> <span class="g-settings-font-name">Font name </span>  <i class="fa fa-times" aria-hidden="true"></i></span></p>
                                <div class="row">
                                    <div class="col-xs-6">
                                        <span class="h4">Font Weight</span>
                                        <div class="g-font-weight">
                                        </div>
                                    </div>

                                    <div class="col-xs-6 hidden">
                                        <span class="h4">Languages</span>
                                        <div class="g-font-language">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary g-save" data-dismiss="modal">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</div>