<?php
/**
 * @copyright   Copyright (C) 2012-2016 Brian Coale. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
 
// no direct access
defined('_JEXEC') or die;
// Set width
if ($fb_width == '') {
	$fb_width = "450";
}

// Set Color
$fb_color = substr($fb_color_scheme,2);

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

//Order by
$fb_comments_order = substr($fb_comments_order_by,2);

// Show Border
if ($fb_border_on !== "1") {
	$fb_border_boolean = "false";
} else {
	$fb_border_boolean = "true";
}

// Show Border Radius
if ($fb_border_radius !== "1") {
	$fb_border_radius_boolean = "false";
} else {
	$fb_border_radius_boolean = "true";
}

// Set Responsive CSS and Add Border Div
$rspsv_style = "";

// Responsive
if ($fb_rspsv !== "1") {
	$fb_rspsv_boolean = "false";
} else {
	$fb_rspsv_boolean = "true";
}
if ($fb_rspsv_boolean == "true") {
	$rspsv_style = "<style type=\"text/css\">.fb_iframe_widget span[style]{width:100% !important;} .fb_border { width: 100%; padding: " . $fb_border_padding . "px; background-color: " . $fb_background_color . "; overflow: hidden; ";
	$fb_width = "100%";
} else {
	$rspsv_style = "<style type=\"text/css\"> .fb_border { width: " . $fb_width . "px; padding: " . $fb_border_padding . "px; background-color: " . $fb_background_color . "; overflow: hidden; ";
}
if ($fb_border_boolean == "true") {
	$rspsv_style .= "border-width: 1px; border-style: solid; border-color: " . $fb_border_color . "; ";
}
if ($fb_border_radius_boolean == "true") {
	$rspsv_style .= "border-radius: " . $fb_border_radius_px . "px; ";
}
$rspsv_style .= "} </style><div class=\"fb_border\">";

// Set Language
$fb_locale = substr($fb_lang, 2);

// Create Facebook Comments Box
//SDK
$mod_data = $rspsv_style . "<div id=\"fb-root\"></div><script>(function(d, s, id) {  var js, fjs = d.getElementsByTagName(s)[0];  if (d.getElementById(id)) return;  js = d.createElement(s); js.id = id;  js.src = \"//connect.facebook.net/" . $fb_locale . "/sdk.js#xfbml=1&version=v2.6&appId=" . $fb_appid . "\";  fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));</script>";

//Plugin
$mod_data .= "<div class=\"fb-comments\" data-href=\"" . $fb_url . "\" data-colorscheme=\"" . $fb_color . "\" data-numposts=\"" . $num_pos . "\" data-order-by=\"" . $fb_comments_order . "\" data-width=\"" . $fb_width . "\"></div></div>";