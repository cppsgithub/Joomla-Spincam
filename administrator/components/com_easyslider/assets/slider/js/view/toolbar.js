void function(e,t,n,r){var i=console.log.bind(console),s=B.Model({style:B.Collection(B.Model({key:"",value:""}))}),o=e.ES_MediumToolbar=ES_PanelView.extend({constructor:function(t){n.bindAll(this,"update","change","select"),this.update=n.debounce(this.update),this.change=n.debounce(this.change),t.model=new s,ES_PanelView.call(this,t)},events:{mousedown:function(e){this.$medium.addClass("medium-toolbar-editing")},"input .classname-input":function(e){var t=this.getTopParentOf(this.lastElementAtCursor);t.className=e.currentTarget.value},"change .tagname-select":function(e){var n=e.currentTarget.value,r=this.getTopParentOf(this.lastElementAtCursor),i=this.medium.utils.changeTag(r,n);t(i).focus().selectText(),this.change(),this.update()},"mousedown .invoke-btn":function(e){this.medium.focus(),this.medium.invokeElement(t(e.currentTarget).data("tag"),{}),this.change(),this.update()},"mousedown .done-btn":function(e){this.close()},"mousedown .insert-fa-btn":function(e){this.rootView.fontAwesomePicker.open({target:e.currentTarget}).select(function(e,t,n){var r=document.createElement("span");r.className="fa",r.innerHTML=n,r.setAttribute("contenteditable",!1),this.medium.focus(),this.medium.insertHtml(r),this.medium.cursor.caretToAfter(r)},this)}},ready:function(){t(window).resize(n.debounce(this.close,100,!0)),t(window).resize(n.debounce(this.update,100)),this.on("close",function(){this.$medium&&this.$medium.removeClass("medium-toolbar-editing").blur()})},inspect:function(e,n){if(this.medium===e)return;this.$medium&&(this.$medium.off("keydown",this.change),this.$medium.off("keypress",this.change),this.$medium.off("mousedown",this.select),this.$medium.off("click",this.select),this.$medium.off("paste",this.change)),window.medium=e,this.medium=e,this.$medium=t(e.element),this.$medium.on("keydown",this.change),this.$medium.on("keypress",this.change),this.$medium.on("mousedown",this.select),this.$medium.on("click",this.select),this.$medium.on("paste",this.change),this.rootView.fontAwesomePicker.close(),this.change(),this.update()},release:function(){this.medium&&(this.medium.lastSelection=this.medium.selection.saveSelection(),this.$medium.off("keydown",this.change),this.$medium.off("keypress",this.change),this.$medium.off("mousedown",this.select),this.$medium.off("click",this.select),this.$medium.off("paste",this.change),this.$medium.deselectText()),delete this.medium,delete this.$medium,this.$el.hide()},update:function(e){if(!this.medium)return;if(!this.lastElementAtCursor||this.lastElementAtCursor===this.medium.element)return this.$el.hide();this.rootView.fontAwesomePicker.close();var t=this.lastElementAtCursor,n=this.getTopParentOf(this.lastElementAtCursor);this.$(".classname-input").val(n.className),this.$(".tagname-select").val(n.tagName),this.open({target:n,direction:"top",background:!1})},change:function(e){if(!this.medium)return;var n=window.getSelection&&window.getSelection();n&&n.rangeCount==0&&t(this.medium.element).children().css("-webkit-user-select","initial"),this.medium.focus(),this.lastElementAtCursor=this.medium.cursor.parent(),this.lastSelection=this.medium.selection.saveSelection(),this.update()},select:function(e){if(!this.medium)return;this.lastElementAtCursor=e.target,this.lastSelection=this.medium.selection.saveSelection(),t(e.target).is(this.medium.element)&&(this.lastElementAtCursor=this.medium.cursor.parent());if(e.type=="mousedown"&&t(e.target).is(".fa")){this.$medium.addClass("medium-toolbar-editing"),this.rootView.mediumToolbar.$el.hide(),this.rootView.fontAwesomePicker.open({target:e.target,activeTarget:!1}).select(function(n,r,i){e.target.innerHTML=i,this.$medium.focus(),this.$medium.removeClass("medium-toolbar-editing"),t(e.target).selectText(),this.update()},this);return}this.update()},getDomHierchy:function(e){var t=e.parentNode,n=e.tagName;while(t!==this.medium.element)n=t.tagName+"."+t.className.replace(/\s+/g,".")+" > "+n,t=t.parentNode;return n},getTopParentOf:function(e){var t=e,n=e;while(t&&t!==this.medium.element)n=t,t=n.parentNode;return n}})}(this,jQuery,_,JSNES_Backbone);