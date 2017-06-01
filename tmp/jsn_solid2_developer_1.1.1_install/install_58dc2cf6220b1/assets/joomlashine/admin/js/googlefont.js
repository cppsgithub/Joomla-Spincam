+function ($) {
    'use strict';

    // GOOGLE FONT CLASS DEFINITION
    // ======================

    var font_weight_map = {
        '100': ' Thin 100',
        '100italic': ' Thin 100 Italic',
        '300': ' Light 300',
        '300italic': ' Light 300 Italic',
        'regular': ' Regular 400',
        'italic': ' Regular 400 Italic',
        '500': ' Medium 500',
        '500italic': ' Medium 500 Italic',
        '600': ' Semi-bold 600',
        '600italic': ' Semi-bold 600 Italic',
        '700': ' Bold 700',
        '700italic': ' Bold 700 Italic',
        '800': ' Extra-bold 800',
        '800italic': ' Extra-bold 800 Italic',
        '900': ' Black 900',
        '900italic': ' Black 900 Italic'
    };

    var font_language_map = {};

    var font = "";

    var GoogleFont = function (options) {

        var $this = this;

        var defaults = {
            fonts: [],
            item_height: 252,
            subsets: '',
            font_weight_id: '',
            font_style_id: ''
        }

        var settings = $.extend({}, defaults, options);

        var g_font_show = [];

        var current_page = 0;

        var script_loaded = [];

        // font list
        var g_list_font = this.find('.g-list-font');
        var g_list_face = this.find('.g-list-face');
        var g_font_length = this.find('.g-font-length');

        g_font_length.html(settings.fonts.length);

        // default data categories
        var g_font_categories = [];

        // default data languages
        var g_font_languages = "";

        // default data font search
        var g_font_search = "";

        // action search font
        this.on("keyup", ".g-search", function (e) {
            $this.init();
        });

        // action check categories
        this.on('click', '.g-font-categories input', function (e) {
            $this.init();
        });

        // action choose languages
        this.on('change', '.g-font-languages', function (e) {
            $this.init();
        });

        // Update Content
        this.updateContents = function (page) {
            for (var i = page * 6; i < page * 6 + 6; i++) {
                if (g_font_show[i] != undefined) {
                    $this.updateDOM(i, g_font_show[i]);
                }
            }
        };

        // Update DOM
        this.updateDOM = function (i, font) {

            // check if font available load head don't reload.
            if (check_name(font, script_loaded)) {
                $this.updateHeader(font);
                script_loaded.push(font);
            }

            // append font view
            var html = "";
            html += '<div class="col-sm-4 font-item" style="font-family: ' + font.family + '">';
            html += '<span class="h4 text-danger">"' + font.family + '"</span>';
            html += '<input class="pull-right g-font-choose" name="g-font-choose" value="' + i + '" type="radio">';
            html += '<hr>';
            html += '<p>';
            html += 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias assumenda aut dolor earum, facere fugit inventore libero molestias nam optio praesentium, quisquam quos?';
            html += '</p>';
            html += '<br><br>';
            html += '</div>';

            g_list_face.append(html);
        };

        this.updateHeader = function (font) {
            $('head').append("<link href='https://fonts.googleapis.com/css?family=" + font.family.replace(" ", "+") + "' rel='stylesheet'>");
        }

        // get data categories
        this.getCategories = function () {
            g_font_categories = [];
            $this.find('.g-font-categories input:checked').each(function () {
                g_font_categories.push($(this).val().toLowerCase().replace(" ", "-"));
            });
        };

        // get data languages
        this.getLanguages = function () {
            g_font_languages = $this.find('.g-font-languages').val();
        };

        this.init = function () {

            g_list_face.html("");
            g_list_font.scrollTop(0);
            current_page = 0;

            g_font_search = this.find('.g-search').val();
            $this.getCategories();
            $this.getLanguages();

            // Find by category
            var find_by_categories = [];
            g_font_show = [];
            for (var i = 0; i < settings.fonts.length; i++) {
                if (check_array(settings.fonts[i].category, g_font_categories)) {
                    find_by_categories.push(settings.fonts[i]);
                }
            }

            // Find by Language
            var find_by_languages = [];
            for (var i = 0; i < find_by_categories.length; i++) {

                if (g_font_languages == "all") {
                    find_by_languages.push(find_by_categories[i]);
                } else if (check_array(g_font_languages, find_by_categories[i].subsets)) {
                    find_by_languages.push(find_by_categories[i]);
                }

            }

            // Find by text
            for (var i = 0; i < find_by_languages.length; i++) {

                var str_search = g_font_search.trim().toLowerCase();
                var font_family = find_by_languages[i].family.toLowerCase();

                if ((str_search == "" || font_family.indexOf(str_search) >= 0) && check_name(find_by_languages[i], g_font_show)) {
                    g_font_show.push(find_by_languages[i]);
                }

            }

            g_font_length.html(g_font_show.length);

            var list_height = Math.ceil(g_font_show.length / 3);
            g_list_font.height(settings.item_height * 2);
            g_list_face.height(list_height * settings.item_height);

            // action scoll
            g_list_font.scroll(function () {

                var scolltop = g_list_font.scrollTop();

                var page = Math.ceil(scolltop / (settings.item_height * 2 * 0.7));

                if (current_page < page) {
                    current_page = page;
                    $this.updateContents(current_page);
                }

            });

            this.updateContents(0);

        };

        this.find(".g-font").on('change', function () {
        	
        	var googleFont = $(this).val().split(":");
        	
            font = get_font(googleFont[0], settings.fonts);
            
            if (font != false) {
                $this.updateFontWeightandFontStyle();
                $this.updateHeader(font);
            }

        });

        // action choose font
        $this.on("click", ".g-font-choose", function (e) {

            font = g_font_show[e.target.value];

            $this.updateFontChoose(g_font_show[e.target.value]);

        });

        // update font choose
        this.updateFontChoose = function (font) {

            var font_weight = $this.find(".g-settings .g-font-weight");
            var font_language = $this.find(".g-settings .g-font-language");

            font_weight.html("");
            font_language.html("");

            $this.find(".g-settings-font-name").html(font.family);

            for (var i = 0; i < font.variants.length; i++) {
                font_weight.append(checkbox(font.variants[i], font.variants[i], "checkbox", font_weight_map));
            }

            for (var i = 0; i < font.subsets.length; i++) {
                font_language.append(checkbox(font.subsets[i], font.subsets[i], "checkbox", font_language_map));
            }

            $this.updateFontWeightandFontStyle();

            $this.find(".g-settings").addClass("open");

        }

        // Save setting
        this.on('click', '.g-save', function () {

            var font_weight_load_head = [];

            var g_font_choose_load = $('input[name=g-font-choose]:checked').val();

            var font_choose_load = g_font_show[g_font_choose_load];

            // get font weight choose
            $(this).closest('.modal-content').find('.g-settings .g-font-weight input:checked').each(function () {
                font_weight_load_head.push(this.value);
            });
            
            for (var i =0 ; i< font_weight_load_head.length; i++) {
			if (font_weight_load_head[i] == "regular") {
				font_weight_load_head[i] = "400";
			}
			
			if (font_weight_load_head[i] == "italic") {
				font_weight_load_head[i] = "400i";
			}
			
			font_weight_load_head[i] = font_weight_load_head[i].replace('italic', 'i');

            }
            
            if (font_weight_load_head.length > 0) {
                $this.find(".g-font").val(font_choose_load.family + ":" + font_weight_load_head.join());
            } else {
                $this.find(".g-font").val(font_choose_load.family);
            }

            $this.find(".g-font").trigger('change');

        });

        this.updateFontWeightandFontStyle = function () {

            var a_f_weight = [];
            var a_f_style = false;

            settings.font_weight_id
                .find('option')
                .remove()
                .end();

            settings.font_style_id
                .find('option')
                .remove()
                .end();

            for (var i = 0; i < font.variants.length; i++) {
                // font_weight.append(checkbox(font.variants[i] , font.variants[i], "radio" , font_weight_map) );

                var weight = font.variants[i];

                // Check if italic
                if (font.variants[i].indexOf('italic') > 0) {
                    a_f_style = true;
                    weight = font.variants[i].replace("italic", "");
                }

                if (weight == "regular" || weight == "italic") {
                    weight = "400";
                }

                if (check_array(weight, a_f_weight) == false) {

                    a_f_weight.push(weight);

                    settings.font_weight_id.append($("<option/>", {
                        value: weight,
                        text: weight,
                    }));

                }

            }

            settings.font_style_id.append($("<option/>", {
                value: "normal",
                text: "Normal"
            }));

            if (a_f_style == true) {
                settings.font_style_id.append($("<option/>", {
                    value: "italic",
                    text: "Italic"
                }));
            }

            settings.font_weight_id.trigger('liszt:updated');
            settings.font_style_id.trigger('liszt:updated');

            // $this.find(".g-font").trigger('change');
        }

        // Toggle setting
        this.on("click", ".g-settings .panel-heading", function () {
            $this.find(".g-settings").toggleClass("show");
        });

        this.init();

        return this;

    }

    // Check item in array
    function check_array(str, arr) {

        for (var i = 0; i < arr.length; i++) {
            if (str == arr[i].toString()) {
                return true;
            }
        }

        return false;
    }

    function checkbox(value, label, type = "checkbox", data) {

        var html = "";
        html += '<div class="checkbox">';
        html += '<label>';

        if (type == "radio") {
            html += '<input name="google-choose" type="radio" value="' + value + '">';
        } else {
            html += '<input type="checkbox" value="' + value + '">';
        }

        html += data[value] === undefined ? value : data[value];

        html += '</label>';
        html += '</div>';

        return html;
    }

    // Check font family
    function check_name(font, script_list) {

        for (var i = 0; i < script_list.length; i++) {
            if (font.family == script_list[i].family) {
                return false;
            }
        }

        return true;
    }

    // Get font by Name
    function get_font(font_famyly, fonts) {

        for (var i = 0; i < fonts.length; i++) {
            if (fonts[i].family == font_famyly.trim()) {
                return fonts[i];
            }
        }

        return false;

    }


    // GOOGLE FONT PLUGIN DEFINITION
    // =======================

    var old = $.fn.googlefont;

    $.fn.googlefont = GoogleFont


    // GOOGLE NO CONFLICT
    // =================

    $.fn.googlefont.noConflict = function () {
        $.fn.googlefont = old
        return this
    }

}(jQuery);