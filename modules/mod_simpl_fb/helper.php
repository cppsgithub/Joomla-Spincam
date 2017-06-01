<?php
/**
 * @copyright    Copyright (C) 2012-2016 Brian Coale. All rights reserved.
 * @license      GNU General Public License version 2 or later; see LICENSE.txt
 */
// no direct access
defined('_JEXEC') or die;
// Simpl Facebook Module Helper Class
abstract class modSimplFBHelper {
    public static function getFBPlugin(&$params) {
         
		 // Initialize variable
         $fb_data = array();
		 
		 // Get basic parameters
		 $fb_type = $params->get('type');
		 $fb_url = $params->get('fb_url');
		 $fb_width = $params->get('width');
		 $fb_height = $params->get('height');
		 $fb_color_scheme = $params->get('color_scheme');
		 $fb_faces = $params->get('fb_faces');
		 $fb_verb = $params->get('verb');
		 $fb_font = $params->get('font');
		 $fb_rspsv = $params->get('fb_rspsv');
		 $fb_border_on = $params->get('fb_border_on');
		 $fb_border_color = $params->get('fb_border_color');
		 $fb_border_radius = $params->get('fb_border_rounded');
		 $fb_border_radius_px = $params->get('fb_border_rounded_px');
		 $fb_background_color = $params->get('fb_background_color');
		 $fb_border_padding = $params->get('fb_border_padding');
		 $fb_appid = $params->get('fb_appid');
		 $fb_lang = $params->get('lang');	
		 
		 // Determine plugin type
		 if ($fb_type == 'a.like_btn') {
			
			// Get Like Button Options
			$fb_like_btn_layout = $params->get('like_btn_layout');
			$fb_send = $params->get('fb_send');	
			$fb_kid_directed_site = $params->get('fb_kid_directed_site');
			$fb_ref = $params->get('fb_ref');
			
			// Include plugin
			include_once("plugins/like_btn.php");
			
		 } elseif ($fb_type == "a.subscribe_btn") {
			 
			 // Get Subscribe Button Options
			$fb_like_btn_layout = $params->get('like_btn_layout');
			$fb_kid_directed_site = $params->get('fb_kid_directed_site');	
			 
			 // Include plugin
			include_once("plugins/subscribe_btn.php");			
		 
		 } elseif ($fb_type == "a.send_btn") {
			 
			$fb_kid_directed_site = $params->get('fb_kid_directed_site');
			$fb_ref = $params->get('fb_ref');
			
			 // Include plugin
			include_once("plugins/send_btn.php");
		 
		 } elseif ($fb_type == "a.pages") {
			 
			 // Get Pages Options
			 $fb_page_title = $params->get('fb_page_title');
			 $fb_show_streams = $params->get('fb_show_streams');
			 $fb_show_header = $params->get('fb_show_header');
			 $fb_small_header = $params->get('fb_small_header');
			 $fb_hide_cta = $params->get('fb_hide_cta');	
			 
			 // Include plugin
			include("plugins/pages.php");
			
		 } elseif ($fb_type == "a.comments") {
			 
			 // Get Comments Options
			 $num_pos = $params->get('num_pos');
			 $fb_comments_order_by = $params->get('fb_comments_order_by');
			 
			 // Include plugin
			include_once("plugins/comments.php");
			
		 } elseif ($fb_type == "a.follow_btn") {
			 
			 // Get Follow Button Options
			 $fb_follow_icn = $params->get('fb_follow_icn');
			 $fb_cust_img = $params->get('cust_img');
			 
			 // Include plugin
			include_once("plugins/follow_btn.php");
                        
         } else {
			 $mod_data = "No plugin selected!";	
		 }
		 
		 return $mod_data;
	}
}