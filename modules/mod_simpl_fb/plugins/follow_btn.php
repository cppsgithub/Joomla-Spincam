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

// Responsive
if ($fb_rspsv !== "1") {
	$fb_rspsv_boolean = "false";
} else {
	$fb_rspsv_boolean = "true";
}

// Set Responsive CSS and Add Border Div
$rspsv_style = "";
if ($fb_rspsv_boolean == "true") {
	$rspsv_style = "<style type=\"text/css\">#fb-root {display: none;} .fb_iframe_widget, .fb_iframe_widget span, .fb_iframe_widget span iframe[style] {width: 100% !important; } .fb_border { width: 100%; padding: " . $fb_border_padding . "px; background-color: " . $fb_background_color . "; overflow: hidden; ";
	$fb_width = "";
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

// Set URL
if ($fb_url == '') {
	$protocol = strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https')
       === FALSE ? 'http' : 'https';
	$host     = $_SERVER['HTTP_HOST'];
	$uri   = $_SERVER['REQUEST_URI'];
	$fb_url = $protocol . '://' . $host . $uri;
}

// Encode URL (deprecated)
/*
$spec_char = array(':', '/', '#');
$html_ent = array('%3A', '%2F', '%23');
$fb_url_dec = str_replace($spec_char, $html_ent, $fb_url);
*/

// Create Facebook Follow Us Icon
if ($fb_follow_icn == 'a.ic_fb_29') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-f-Logo__blue_29.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.ic_fb_50') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-f-Logo__blue_50.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.ic_fb_72') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-f-Logo__blue_72.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.ic_fb_100') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-f-Logo__blue_100.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.ic_fb_w_29') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-f-Logo__white_29.png\" /></a></div>";	
} elseif ($fb_follow_icn == 'a.ic_fb_w_50') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-f-Logo__white_50.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.ic_fb_w_72') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-f-Logo__white_72.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.ic_fb_w_100') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-f-Logo__white_100.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.btn_fb_72') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-FindUsonFacebook-online-72.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.btn_fb_100') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-FindUsonFacebook-online-100.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.btn_fb_512') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-FindUsonFacebook-online-512.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.btn_fb_1024') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"modules/mod_simpl_fb/plugins/images/follow_btn/FB-FindUsonFacebook-online-1024.png\" /></a></div>";
} elseif ($fb_follow_icn == 'a.btn_fb_cust') {
	$mod_data = $rspsv_style . "<a href=\"" . $fb_url . "\" target=\"_blank\"><img src=\"" . $fb_cust_img . "\" /></a></div>";        
} else {
        echo "error: missing options. Please check module settings.";
}