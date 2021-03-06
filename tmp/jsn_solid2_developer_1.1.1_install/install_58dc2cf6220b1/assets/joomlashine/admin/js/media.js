
function appearanceInsertFieldValue(e, i) {
    var t = jQuery.noConflict(),
        n = t("#" + i).val();
    if (n != e) {
        var r = t("#" + i);
        r.val(e), r.trigger("change"), "function" == typeof r.get(0).onchange && r.get(0).onchange(), jMediaRefreshPreview(i)
    }
}

function jMediaRefreshPreview(e) {
    var i = jQuery.noConflict(),
        t = i("#" + e).val(),
        n = i("#" + e + "_preview"),
        r = i("#" + e).data("basepath");
    n.length && (t ? (n.attr("src", r + t), i("#" + e + "_preview_empty").hide(), i("#" + e + "_preview_img").show()) : (n.attr("src", ""), i("#" + e + "_preview_empty").show(), i("#" + e + "_preview_img").hide()))
}

function jMediaRefreshPreviewTip(e) {
    var i = jQuery.noConflict(),
        t = i(e),
        n = t.find("img.media-preview");
    n.each(function() {
        t.find("div.tip").css("max-width", "none");
        var e = i(this).attr("id");
        e = e.substring(0, e.length - "_preview".length), jMediaRefreshPreview(e), t.show(this)
    })
}

function jMediaRefreshImgpathTip(e, i) {
    var t = jQuery.noConflict(),
        n = t(e);
    n.css("max-width", "none");
    var r = t(i).val();
    t("#TipImgpath").html(r), r.length ? n.show() : n.hide()
}

function appearanceModalClose () {
	 var t = jQuery.noConflict();
	t('.modal').modal('hide');
};