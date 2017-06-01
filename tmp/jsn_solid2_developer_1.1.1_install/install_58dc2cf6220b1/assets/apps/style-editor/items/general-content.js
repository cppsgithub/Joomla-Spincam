{
 "class": "content-settings",
 "rows": [
 {
 "cols": [
 {
 "class": "col-xs-12",
 "settings": {
 "color": {
 "type": "color-picker",
 "label": "color",
 "default": "#000"
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "content-font-type": {
 "type": "select",
 "label": "font-type",
 "options": [
 {
 "label": "standard",
 "value": "standard"
 },
 {
 "label": "google",
 "value": "google"
 },
 {
 "label": "custom",
 "value": "custom"
 }
 ],
 "default": "standard"
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "content-standard-font-family": {
 "type": "select",
 "label": "font-family",
 "options": [
 {
 "label": "Georgia",
 "value": "Georgia, serif",
 "class": "georgia"
 },
 {
 "label": "Palatino Linotype",
 "value": "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
 "class": "palatino-linotype"
 },
 {
 "label": "Times New Roman",
 "value": "'Times New Roman', Times, serif",
 "class": "times-new-roman"
 },
 {
 "label": "Arial",
 "value": "Arial, Helvetica, sans-serif",
 "class": "arial"
 },
 {
 "label": "Arial Black",
 "value": "'Arial Black', Gadget, sans-serif",
 "class": "arial-black"
 },
 {
 "label": "Comic Sans MS",
 "value": "'Comic Sans MS', cursive, sans-serif",
 "class": "comic-sans-ms"
 },
 {
 "label": "Impact",
 "value": "Impact, Charcoal, sans-serif",
 "class": "impact"
 },
 {
 "label": "Lucida Sans Unicode",
 "value": "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
 "class": "lucida-sans-unicode"
 },
 {
 "label": "Tahoma",
 "value": "Tahoma, Geneva, sans-serif",
 "class": "tahoma"
 },
 {
 "label": "Trebuchet MS",
 "value": "'Trebuchet MS', Helvetica, sans-serif",
 "class": "trebuchet-ms"
 },
 {
 "label": "Verdana",
 "value": "Verdana, Geneva, sans-serif",
 "class": "verdana"
 },
 {
 "label": "Courier New",
 "value": "'Courier New', Courier, monospace",
 "class": "courier-new"
 },
 {
 "label": "Lucida Console",
 "value": "'Lucida Console', Monaco, monospace",
 "class": "lucida-console"
 }
 ]
 }
 },
 "requires": {
 "content-font-type": "standard"
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "content-google-font-family": {
 "type": "google-font-selector",
 "label": "font-family"
 }
 },
 "requires": {
 "content-font-type": "google"
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "content-custom-font-file": {
 "type": "custom-font",
 "label": "font-file"
 }
 },
 "requires": {
 "content-font-type": "custom"
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "font-weight": {
 "type": "select",
 "label": "font-weight",
 "options": [
 {
 "label": "font-style-normal",
 "value": "normal"
 },
 {
 "label": "font-weight-bold",
 "value": "bold"
 }
 ]
 }
 },
 "requires": {
 "content-font-type": "standard"
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "font-size-base": {
 "type": "slider",
 "label": "font-size",
 "min": 0,
 "max": 50,
 "step": 1,
 "default": 14,
 "suffix": "px"
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "line-height-base": {
 "type": "slider",
 "label": "line-height",
 "min": 0,
 "max": 5,
 "step": 0.1,
 "default": 1.4,
 "suffix": "em"
 }
 }
 }
 ]
 }
 ]
}
