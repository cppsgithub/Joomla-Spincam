

/* FILE: /plugins/jsnimageshow/themeslider/assets/js/jsn_is_conflict.js */
if (typeof jQuery.noConflict() == 'function') {	
	var jsnThemeSliderjQuery = jQuery.noConflict();
}
try {
	if (JSNISjQueryBefore && JSNISjQueryBefore.fn.jquery) {
		jQuery = JSNISjQueryBefore;
	}
} catch (e) {
	console.log(e);
};
