{
 "class": "menu",
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
 "menu-type": {
 "type": "menu-type",
 "label": "menu"
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "menu-item": {
 "type": "menu-item",
 "label": "base-item"
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "menu-start-level": {
 "type": "select",
 "label": "start-level",
 "options": [
 { "value": "1", "label": "1" },
 { "value": "2", "label": "2" },
 { "value": "3", "label": "3" },
 { "value": "4", "label": "4" },
 { "value": "5", "label": "5" },
 { "value": "6", "label": "6" },
 { "value": "7", "label": "7" },
 { "value": "8", "label": "8" },
 { "value": "9", "label": "9" },
 { "value": "10", "label": "10" }
 ],
 "default": "1"
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "menu-end-level": {
 "type": "select",
 "label": "end-level",
 "options": [
 { "value": "0", "label": "all" },
 { "value": "1", "label": "1" },
 { "value": "2", "label": "2" },
 { "value": "3", "label": "3" },
 { "value": "4", "label": "4" },
 { "value": "5", "label": "5" },
 { "value": "6", "label": "6" },
 { "value": "7", "label": "7" },
 { "value": "8", "label": "8" },
 { "value": "9", "label": "9" },
 { "value": "10", "label": "10" }
 ],
 "default": "0"
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
 "menu-show-icon": {
 "type": "checkbox",
 "label": "show-icon",
 "value": 1,
 "default": 1
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "menu-show-description": {
 "type": "checkbox",
 "label": "show-description",
 "value": 1,
 "default": 1
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "menu-show-submenu": {
 "type": "checkbox",
 "label": "show-submenu",
 "value": 1,
 "default": 0
 }
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "menu-sub-effect": {
 "type": "select",
 "label": "menu-sub-effect",
 "options": [
 { "value": "1", "label": "none" },
 { "value": "2", "label": "fading" },
 { "value": "3", "label": "slide" }
 ],
 "default": "1"
 }
 },
 "requires": {
 "menu-show-submenu": 1
 }
 },
 {
 "class": "col-xs-12",
 "settings": {
 "menu-mobile-target": {
 "type": "checkbox",
 "label": "mobile-target",
 "value": 1,
 "default": 1
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
