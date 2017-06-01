{
 "class": "social-icon",
 "rows": [
 {
 "class": "separator-after",
 "cols": [
 {
 "class": "col-xs-12",
 "settings": {
 "name": {
 "type": "text",
 "label": "name"
 }
 }
 }
 ]
 },
 {
 "cols": [
 {
 "class": "col-xs-12",
 "settings": {
 "items": {
 "type": "social-icons",
 "label": "icons"
 }
 }
 }
 ]
 },
 {
 "class": "separator-before",
 "cols": [
 {
 "class": "col-xs-12",
 "settings": {
 "color": {
 "type": "color-picker",
 "label": "icon-color"
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "size": {
 "type": "slider",
 "label": "icon-size",
 "default": 14,
 "suffix": "px"
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "target": {
 "type": "select",
 "label": "link-target",
 "options": [
 {"value": "_blank", "label" : "Blank"},
 {"value": "_parent", "label" : "Parent"},
 {"value": "_self", "label" : "Self"},
 {"value": "_top", "label" : "Top"}
 ]
 }
 }
 }
 ]
 },
 {
 "class": "separator-before",
 "cols": [
 {
 "class": "col-xs-12 display-in-layout",
 "settings": {
 "visible_in": {
 "type": "checkbox",
 "label": "display-in-layout",
 "options": [
 { "value": "lg", "label": "desktop" },
 { "value": "md", "label": "latop" },
 { "value": "sm", "label": "tablet" },
 { "value": "xs", "label": "smartphone" }
 ],
 "default": [ "lg", "md", "sm", "xs" ]
 }
 }
 }
 ]
 },
 {
 "class": "separator-before",
 "cols": [
 {
 "class": "col-xs-12",
 "settings": {
 "class": {
 "type": "text",
 "label": "custom-classes"
 }
 }
 }
 ]
 }
 ]
}
