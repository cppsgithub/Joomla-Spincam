<?php

/**
 * @package		 Joomla.Site
 * @subpackage	 mod_simpl_fb
 * @copyright    Copyright (C) 2012-2016 Brian Coale. All rights reserved.
 * @license      GNU General Public License version 2 or later; see LICENSE.txt
 */

// no direct access
defined('_JEXEC') or die;

// Set URL
if ($fb_url == '') {
	$protocol = strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https')
       === FALSE ? 'http' : 'https';
	$host     = $_SERVER['HTTP_HOST'];
	$uri   = $_SERVER['REQUEST_URI'];
	$fb_url = $protocol . '://' . $host . $uri;
}

//Set App ID
if ($fb_appid == "") {
	$fb_appid = "480580252049577";
}

// Show Faces
$fb_faces = $fb_faces;
if ($fb_faces !== '0') {
	$fb_faces_boolean = 'true';
} else {
	$fb_faces_boolean = 'false';
}

// Responsive
if ($fb_rspsv == "0") {
	$fb_rspsv_boolean = "false";
} else {
	$fb_rspsv_boolean = "true";
}

// Set Color
$fb_color = substr($fb_color_scheme, 2);

// Show Stream
$fb_streams = $fb_show_streams;
if ($fb_streams !== '0') {
	$fb_streams_boolean = 'true';
} else {
	$fb_streams_boolean = 'false';
}

// Show Header
$fb_header = $fb_show_header;
if ($fb_header !== '1') {
	$fb_header_boolean = 'true';
} else {
	$fb_header_boolean = 'false';
}

// Show Border
$fb_border = $fb_border_on;
if ($fb_border !== '0') {
	$fb_border_boolean = 'true';
} else {
	$fb_border_boolean = 'false';
}

// Show Border Radius
$fb_border_radius = $fb_border_radius;
if ($fb_border_radius !== '0') {
	$fb_border_radius_boolean = 'true';
} else {
	$fb_border_radius_boolean = 'false';
}

// Set Width
if ($fb_width == "") {
	$fb_width = "450";
	$fb_width_px = " width:450px;";
}
$fb_width_px = " width:" . $fb_width . "px;";

// Set Height
if ($fb_height == "") {
	$fb_height = "595";
}
$fb_height_px = " height:" . $fb_height . "px;";

// Show small header
if ($fb_small_header == "0") {
	$fb_small_header_boolean = "false";
} else {
	$fb_small_header_boolean = "true";
}

// Facebook page name
$fb_page_title = stripslashes($fb_page_title);

// Hide CTA
if ($fb_hide_cta == "0") {
	$fb_hide_cta_boolean = "false";
} else {
	$fb_hide_cta_boolean = "true";
}

// Set Responsive CSS and Add Border Div
$rspsv_style = "";

if ($fb_rspsv_boolean == "true") {
	// Load JQuery
	JHtml::_('jquery.framework');
	
	// Add responsive functions
	$document = JFactory::getDocument();
	$document->addScriptDeclaration( "
var jQuery = jQuery.noConflict();
function runFB() {	
    var FbWidth = document.getElementById('fb_border').clientWidth; 
    jQuery(window).resize( function() {
	jQuery('#FbPagePlugin').html('<div class=\"fb-page\" data-href=\"" . $fb_url . "\" data-width=\"'+FbWidth+'\" data-height=\"" . $fb_height . "\" data-small-header=\"" . $fb_small_header_boolean . "\" data-adapt-container-width=\"true\" data-hide-cover=\"" . $fb_header_boolean . "\" data-show-facepile=\"" . $fb_faces_boolean . "\" data-show-posts=\"" . $fb_streams_boolean . "\" data-hide-cta=\"" . $fb_hide_cta_boolean . "\"><div class=\"fb-xfbml-parse-ignore\"><blockquote cite=\"" . $fb_url . "\"><a href=\"" . $fb_url . "\">" . $fb_page_title . "</a></ blockquote></div></div>');
	window.FB.XFBML.parse();
    });
};

function newFB() {
	var FbWidth = document.getElementById('fb_border').clientWidth;
	jQuery('#FbPagePlugin').html('<div class=\"fb-page\" data-href=\"" . $fb_url . "\" data-width=\"'+FbWidth+'\" data-height=\"" . $fb_height . "\" data-small-header=\"" . $fb_small_header_boolean . "\" data-adapt-container-width=\"true\" data-hide-cover=\"" . $fb_header_boolean . "\" data-show-facepile=\"" . $fb_faces_boolean . "\" data-show-posts=\"" . $fb_streams_boolean . "\" data-hide-cta=\"" . $fb_hide_cta_boolean . "\"><div class=\"fb-xfbml-parse-ignore\"><blockquote cite=\"" . $fb_url . "\"><a href=\"" . $fb_url . "\">" . $fb_page_title . "</a></ blockquote></div></div>');
	window.FB.XFBML.parse();
}

window.fbAsyncInit = function() {
	new newFB();
	new runFB();
}");
	$rspsv_style = "<style type=\"text/css\"> div#FbPagePlugin { text-align: center !important; } .fb-page .fb_iframe_widget {width: 100%;} #fb_border { width: 100%; padding: " . $fb_border_padding . "px; background-color: " . $fb_background_color . "; overflow: hidden; ";
	$fb_width = "";
} else {
	$rspsv_style = "<style type=\"text/css\"> #fb_border { width: " . $fb_width . "px; padding: " . $fb_border_padding . "px; background-color: " . $fb_background_color . "; overflow: hidden; ";
}

if ($fb_border_boolean == "true") {
	$rspsv_style .= "border-width: 1px; border-style: solid; border-color: " . $fb_border_color . "; ";
}

if ($fb_border_radius_boolean == "true") {
	$rspsv_style .= "border-radius: " . $fb_border_radius_px . "px; ";
}

$rspsv_style .= "} </style>\n<div id=\"fb_border\">";

// Set Language
$fb_locale = substr($fb_lang, 2);

// Create Facebook Like Box
// SDK
$mod_data = $rspsv_style . "<div id=\"fb-root\"></div><script>(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = \"//connect.facebook.net/" . $fb_locale . "/sdk.js#xfbml=1&version=v2.6&appId=" . $fb_appid . "\"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));</script>";

// Plugin
if ($fb_rspsv_boolean == "true") {
	$mod_data .= "<div id=\"FbPagePlugin\"></div></div>";
} else {
	$mod_data .= "<div class=\"fb-page\" data-href=\"" . $fb_url . "\" data-width=\"" . $fb_width . "\" data-height=\"" . $fb_height . "\" data-small-header=\"" . $fb_small_header_boolean . "\" data-adapt-container-width=\"" . $fb_rspsv_boolean . "\" data-hide-cover=\"" . $fb_header_boolean . "\" data-show-facepile=\"" . $fb_faces_boolean . "\" data-show-posts=\"" . $fb_streams_boolean . "\" data-hide-cta=\"" . $fb_hide_cta_boolean . "\"><div class=\"fb-xfbml-parse-ignore\"><blockquote cite=\"" . $fb_url . "\"><a href=\"" . $fb_url . "\">" . $fb_page_title . "</a></blockquote></div></div></div>";
}