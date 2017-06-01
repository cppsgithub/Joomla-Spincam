void function(e,t,n,r){e.ES_App=B.View.extend({constructor:function(t){n.bindAll(this,"undo","redo","copy","paste","saveSlider","addSlide","removeSlide","addItemBox","moveItems","removeItems","setActive","updateSelected","updateBoundingBox","resizeCanvas","resizeSlider","toggleAnimationPreview","resetAnimationPreview","stopAnimationPreview"),this.updateSelected=n.debounce(this.updateSelected),this.setActive=n.debounce(this.setActive),t||(t={}),B.View.call(this,t),this.model.set({id:t.id,title:t.title}),!t.id&&n.defer(this.model.save)},views:{"itemsView > #items":ES_ItemsView,"globalItemsView collection:items > #global-items":ES_GlobalItemsView,"selectionsView > #selections":ES_SelectionsView,"thumbsView collection:slides > .es-thumbs":ES_ThumbsView,"gridsView model:grid > .es-grids":ES_GridsView,"timelineView > .es-timeline":ES_TimelineView,"layersView > .es-layers":ES_LayersView,"framesView > .es-frames":ES_FramesView,"canvasView > .es-canvas-wrapper":ES_CanvasView,"mediumToolbar > #medium-toolbar":ES_MediumToolbar,"fontAwesomePicker > #font-awesome-picker":ES_FontAwesomePicker,"colorPicker > #color-picker":ES_ColorPicker,"fontsPicker > #fonts-picker":ES_FontsPicker,"boxShadowInspector > #box-shadow-inspector-panel":ES_BoxShadowInspector,"textShadowInspector > #text-shadow-inspector-panel":ES_TextShadowInspector,"thumbMenu > #thumb-menu":ES_InspectorView.extend(),"itemInspector > #item-inspector":ES_ItemInspector,"animationInspector > #animation-inspector":ES_AnimationInspector,"settingsPanel model:$model > #settings-panel":ES_SettingsPanel,"configSizeView model:$model > #quick-setting-panel":ES_QuickSettingsPanel,"configGridView model:grid > #grid-config":ES_PanelView,"customJSEditor model:$model> #custom-js-editor":ES_CustomJSEditor,"customCSSEditor model:$model> #custom-css-editor":ES_CustomCSSEditor,"tooltipView > #tooltip-panel":ES_Tooltip},modelEvents:{"add slides":"setActive","remove slides":"setActive","reset slides":"setActive","change:slides.active":"setActive","change:slides.items.selected":"updateSelected","change:slides.items.style":"updateBoundingBox","change:items.selected":"updateSelected","change:items.style":"updateBoundingBox","add items":"updateSelected","remove items":"updateSelected","change:width":"resizeCanvas","change:height":"resizeCanvas","change:layout":"resizeCanvas","change:origin":"resizeCanvas","change:state":function(){n(this.globalItemsView.subViews).each(function(e){e.__dataBinding.updateView()}),n(this.itemsView.subViews).each(function(e){e.__dataBinding.updateView()}),n(this.selectionsView.subViews).each(function(e){e.__dataBinding.updateView()}),this.updateSelected()},"change:layout.type":"toggleTransitionSetting"},events:{"click .input-color":function(e){this.colorPicker.open({target:e.target})},"click .save-slider-btn":"saveSlider","click .exit-slider-btn":"exitSlider","click .add-item-btn":"addItemBox","click .add-image-btn":"addItemImage","click .add-text-btn":"addItemText","click .add-video-btn":"addItemVideo","click .add-slide-btn":"addSlide","click .remove-slide-btn":"removeSlide","click .duplicate-slide-btn":"duplicateSlide","click .es-overlay":"updateBoundingBox",dragstart:"hideBoundingBox",dragstop:"updateBoundingBox",resizestart:"hideBoundingBox",resizestop:"updateBoundingBox","click .slide-global-btn":"activateGlobalItems","click .edit-slider-bg-btn":function(){t.ES_MediaSelector(n.bind(function(e){this.model.set("background.image.src",e)},this))},"click .edit-slide-bg-btn":function(){t.ES_MediaSelector(n.bind(function(e){this.activeSlide.set("background.image.src",e)},this))},"click .open-advance-settings-btn":function(e){this.settingsPanel.open({})},"click .open-grid-config-panel":function(e){this.configGridView.open({target:e.currentTarget,direction:"left"})},"click .open-js-editor-btn":function(e){this.configSizeView.close(),this.customJSEditor.open()},"click .open-css-editor-btn":function(e){this.configSizeView.close(),this.customCSSEditor.open()},"click .switch-to-mode":function(e){e.stopPropagation();var n=t(e.currentTarget).data("mode"),r=this.model.get("layout."+n);if(n!="desktop"&&!r)return;this.model.set("state.view_mode",n),t(e.currentTarget).addClass("highlight").siblings().removeClass("highlight")},"click .slider-redo-btn":function(e){this.history.redo()},"click .slider-undo-btn":function(e){this.history.undo()},"click .slider-settings-btn":function(e){this.configSizeView.open({target:e.currentTarget,direction:"bottom"})},"click .timeline-toggle-btn":function(e){this.$(".es-layers-wrapper").toggleClass("es-collapsed"),this.$(".timeline-toggle-btn").toggleClass("hidden")},"click .slider-quick-tour-btn":function(e){this.quickToursView.open()},"dragstart .es-canvas-wrapper":function(){this.itemInspector.close(),this.animationInspector.close(),this.hideBoundingBox()},"dragstop .es-canvas-wrapper":function(){this.updateBoundingBox()},"resizestart .es-canvas-wrapper":function(){this.itemInspector.close(),this.animationInspector.close(),this.hideBoundingBox()},"resizestop .es-canvas-wrapper":function(){this.updateBoundingBox()},scroll:function(e){},"mouseenter .es-tooltip":function(e){this.tooltipView.open({target:e.currentTarget})},"mouseleave .es-tooltip":function(e){this.tooltipView.close()},"mouseup .nav.nav-tab li":function(e){}},bindings:[{selector:".open-view-mode-selector-btn",type:"html",attr:"state.view_mode",parse:function(e){switch(e){case"laptop":return'<span class="fa fa-laptop"></span>';case"tablet":return'<span class="fa fa-tablet"></span>';case"mobile":return'<span class="fa fa-mobile"></span>';case"desktop":return'<span class="fa fa-television"></span>';default:return'<span class="fa fa-television"></span>'}}},{selector:".es-canvas .es-canvas-master-bg",type:"style",attr:{backgroundColor:"background.color",backgroundImage:"background.image.src",backgroundPosition:"background.position",backgroundSize:"background.size"},parse:function(e,t){switch(t){case"backgroundImage":return e?"url("+ES_App.getImageURL(e)+")":"";default:return e}}}],initialize:function(e){this.history=new ES_UndoStack(this.model),this.fontsLoader=new ES_Fonts,this.slides=this.model.get("slides"),this.$thumbsWrapper=this.$(".es-thumbs-wrapper"),this.$thumbsLayout=this.$(".es-thumbs-layout"),this.$thumbsCenter=this.$(".es-thumbs-center"),this.$canvasWrapper=this.$(".es-canvas-wrapper"),this.$canvasLayout=this.$(".es-canvas-layout"),this.$canvas=this.$(".es-canvas"),this.$overlays=this.$(".es-overlay"),this.$groups=this.$(".es-items,.es-selections"),this.$layersWrapper=this.$(".es-layers-wrapper"),this.$('.switch-to-mode[data-mode="'+this.model.get("state.view_mode")+'"]').addClass("highlight"),new Medium({element:this.$(".es-header .title-input").get(0),mode:Medium.inlineRichMode}),this.slideAnim=ES_Timeline({align:"normal",duration:4e3}),Object.defineProperties(this.slideAnim,{tweens:{get:n.bind(function(){return n(this.itemsView.subViews).map(function(e){return e.animation})},this)}}),this.listenTo(this.slideAnim,"end",this.stopAnimationPreview),t(window).resize(this.resizeSlider),t("body").on("click",".es-noty-close",function(e){t(e.currentTarget).parents(".noty_bar").parent().slideUp("normal",function(){t(this).remove()})}),Mousetrap.bind("command+s",this.saveSlider),Mousetrap.bind(["shift+up","shift+down","shift+left","shift+right","up","down","left","right"],this.moveItems),Mousetrap.bind(["del","backspace"],this.removeItems),Mousetrap.bind(["command+shift+z"],this.redo),Mousetrap.bind(["command+z"],this.undo),Mousetrap.bind(["ctrl+shift+z"],this.redo),Mousetrap.bind(["ctrl+z"],this.undo),Mousetrap.bind(["esc"],this.stopAnimationPreview),Mousetrap.bind(["space"],this.toggleAnimationPreview),Mousetrap.bind(["command+c"],this.copy),Mousetrap.bind(["command+v"],this.paste),Mousetrap.bind(["ctrl+c"],this.copy),Mousetrap.bind(["ctrl+v"],this.paste)},ready:function(){this.configSizeView.within=".es-canvas-wrapper",this.setActive(),this.resizeCanvas(),this.resizeSlider(),this.history.start(),this.slides.checkEmpty(),this.toggleTransitionSetting(),this.listenTo(this.model,"save:success",this.saveOnSuccess),this.listenTo(this.model,"save:error",this.saveOnError),this.listenTo(this.model,"change",this.onChangeData),this.dataChanged=!1,this.quickToursView=new ES_QuickTours({el:"#quick-tours-panel"}),this.quickToursView.close()},saveOnSuccess:function(e){noty({text:'<div class="activity-item"> <i class="fa fa-check text-success"></i> <div class="activity"> '+e+" </div> </div>",layout:"topRight",type:"success",theme:"relax",timeout:2e3,closeWith:["click"],animation:{open:"animated bounceInRight",close:"animated bounceOutRight"}}),this.dataChanged=!1},saveOnError:function(e){noty({text:'<div class="activity-item"> <i class="fa fa-warning text-error"></i> <div class="activity"> '+e+" </div> </div>",layout:"topRight",type:"error",theme:"relax",timeout:2e3,closeWith:["click"],animation:{open:"animated bounceInRight",close:"animated bounceOutRight"}})},onChangeData:function(e){this.dataChanged=!0},undo:function(e){!e.shiftKey&&this.history.undo()},redo:function(e){e.shiftKey&&this.history.redo()},copy:function(e){var t=this.activeItems.where({selected:!0});if(!t.length)return;this.clipboard=n(t).map(function(e){return e.toJSON()}),noty({text:'<div class="activity-item"> <i class="fa fa-check text-success"></i> <div class="activity"> '+t.length+" item(s) copied. </div> </div>",layout:"topRight",type:"success",theme:"relax",timeout:2e3,closeWith:["click"],animation:{open:"animated bounceInRight",close:"animated bounceOutRight"}})},paste:function(e){if(!this.clipboard)return;this.activeItems.invoke("set","selected",!1),this.activeItems.add(this.clipboard)},getActive:function(){return this.model.get("slides").findWhere({active:!0})},setActive:function(e){var t=this.getActive();if(!t||t==this.activeSlide)return;this.itemsView.activate(),this.globalItemsView.deactivate(),this.activeSlide=t,this.activeItems=t.get("items"),this.canvasView.setModel(this.activeSlide),this.canvasView.setBindingModel(this.activeSlide),this.timelineView.setModel(this.activeSlide),this.timelineView.setBindingModel(this.activeSlide),this.itemsView.setCollection(this.activeItems),this.layersView.setCollection(this.activeItems),this.framesView.setCollection(this.activeItems),this.selectionsView.setCollection(this.activeItems),this.slideAnim.duration=this.activeSlide.get("totalDuration"),this.updateSelected(),this.resizeSlider()},toggleTransitionSetting:function(){var e=t("#slide-setting-transition-tab");switch(this.model.get("layout.type")){case 2:e.hasClass("active")&&e.prev().trigger("click"),e.hide();break;case 1:e.show()}},toggleGlobalItems:function(){return this.globalItemsView.activated?this.deactivateGlobalItems():this.activateGlobalItems(),this.globalItemsView.activated},activateGlobalItems:function(){return this.itemsView.deactivate(),this.globalItemsView.activate(),this.activeItems&&this.activeItems.invoke("set","active",!1),this.activeSlide=null,this.activeItems=this.model.get("items"),this.itemsView.deactivate(),this.layersView.setCollection(this.activeItems),this.framesView.setCollection(this.activeItems),this.selectionsView.setCollection(this.activeItems),this.updateSelected(),this.$(".es-thumb.selected").removeClass("selected"),this.$(".slide-global-btn").addClass("selected"),this},deactivateGlobalItems:function(){return this.globalItemsView.deactivate(),this.itemsView.activate(),this.model.get("items").invoke("set","active",!1),this.activeSlide=null,this.setActive(),this.$(".slide-global-btn").removeClass("selected"),this},updateSelected:function(){this.updateBoundingBox()},hideBoundingBox:function(){this.$(".es-bounding-box").hide()},updateBoundingBox:function(){var e=this.selectionsView.$(".es-selection.selected .selection-offset").getBoundingBox();e.width&&e.height?this.$(".es-bounding-box").show().css(n.pick(e,"top","left","width","height")):this.$(".es-bounding-box").hide();if(!this.activeItems)return;var t=this.activeItems.where({selected:!0});this.animationInspector.close(),t.length&&!this.mediumToolbar._openned?this.itemInspector.inspect(t).open({target:this.$(".es-bounding-box")}):this.itemInspector.close()},resizeCanvas:function(){this.$canvas.add(this.$overlays).width(this.model.get("width")).height(this.model.get("height")),this.$groups.css({top:this.model.get("origin.y")*100+"%",left:this.model.get("origin.x")*100+"%"}),this.gridsView.render()},resizeSlider:function(){this.$canvasLayout.css({minHeight:this.$canvas.outerHeight()+200+"px"}),this.$thumbsLayout.css({minHeight:this.$thumbsCenter.outerHeight()+"px"}),this.canvasView.resize(),this.updateBoundingBox()},addSlide:function(){this.slides.addNew&&(this.slides.addNew(),this.thumbsView.$(".selected").trigger("options"))},removeSlide:function(){if(!this.activeSlide)return;var e=this.activeSlide.get("index"),t=this.thumbsView.$(".selected"),n=t.next(),r=t.prev();this.slides.remove(this.activeSlide),this.defer(function(){(n.length?n:r.length?r:this.thumbsView.$(".selected")).trigger("mousedown")})},duplicateSlide:function(){if(!this.activeSlide)return;var e=this.activeSlide.get("index"),t=this.activeSlide,n=this.activeSlide.toJSON();this.slides.add(n),t.set("active",!1)},addItemBox:function(){if(!this.activeItems)return;n(this.activeItems.where({selected:!0})).invoke("set","selected",!1),this.activeItems.add({type:"box",name:"Box",style_desktop:{visible:!1,offset:{x:-50,y:-30},width:100,height:60,background:{color:"#d6d6d6"}},style_laptop:{visible:!1},style_tablet:{visible:!1},style_mobile:{visible:!1},animation:{"in":ES_Item.DEFAULT_ANIM_IN,out:n.extend({},ES_Item.DEFAULT_ANIM_OUT,{delay:this.activeSlide?this.activeSlide.get("duration"):0})}}).set({selected:!0,style:{visible:!0}}),this.itemInspector.showTab("style"),this.defer(this.exitAnimationPreview)},addItemText:function(){if(!this.activeItems)return;n(this.activeItems.where({selected:!0})).invoke("set","selected",!1),this.activeItems.add({type:"text",content:"<div>Text</div>",style_desktop:{visible:!1,offset:{x:-60,y:-30},width:120,height:60},style_laptop:{visible:!1},style_tablet:{visible:!1},style_mobile:{visible:!1},animation:{"in":ES_Item.DEFAULT_ANIM_IN,out:n.extend({},ES_Item.DEFAULT_ANIM_OUT,{delay:this.activeSlide?this.activeSlide.get("duration"):0})}}).set({selected:!0,style:{visible:!0}}),this.activeItems.models[this.activeItems.models.length-1].itemView.$el.find(".item-content").children().css("-webkit-user-select","initial"),this.itemInspector.showTab("text"),this.defer(this.exitAnimationPreview)},addItemImage:function(){if(!this.activeItems)return;n(this.activeItems.where({selected:!0})).invoke("set","selected",!1),t.ES_MediaSelector(n.bind(function(e){n.loadImage(ES_App.getImageURL(e),function(t){this.activeItems.add({type:"image",name:"Image",aspectRatio:t.width/t.height,style_desktop:{visible:!1,background:{image:{src:e}},offset:{x:-t.width/2,y:-t.height/2},width:t.width,height:t.height},style_laptop:{visible:!1},style_tablet:{visible:!1},style_mobile:{visible:!1},animation:{"in":ES_Item.DEFAULT_ANIM_IN,out:n.extend({},ES_Item.DEFAULT_ANIM_OUT,{delay:this.activeSlide?this.activeSlide.get("duration"):0})}}).set({selected:!0,style:{visible:!0}}),this.itemInspector.showTab("background",!0),this.defer(this.exitAnimationPreview)},this)},this))},addItemVideo:function(){if(!this.activeItems)return;n(this.activeItems.where({selected:!0})).invoke("set","selected",!1),this.activeItems.add({type:"video",name:"Video",style_desktop:{visible:!1,offset:{x:-160,y:-100},width:320,height:200,background:{color:"#000"}},style_laptop:{visible:!1},style_tablet:{visible:!1},style_mobile:{visible:!1},animation:{"in":ES_Item.DEFAULT_ANIM_IN,out:n.extend({},ES_Item.DEFAULT_ANIM_OUT,{delay:this.activeSlide?this.activeSlide.get("duration"):0})}}).set({selected:!0,style:{visible:!0}}),this.itemInspector.showTab("video",!0),this.defer(this.exitAnimationPreview)},moveItems:function(e,n){e&&e.preventDefault(),this.selectionsView.$(".selection-offset.ui-selected").each(function(){var r=t(this).position(),i=e.shiftKey?10:1;switch(n){case"up":case"shift+up":r.top-=i;break;case"down":case"shift+down":r.top+=i;break;case"left":case"shift+left":r.left-=i;break;case"right":case"shift+right":r.left+=i}t(this).css(r).trigger("dragstop",{position:r})})},removeItems:function(e){e&&e.preventDefault();if(!this.activeItems)return;var t=this.activeItems.where({selected:!0});n(t).each(function(e){e.collection.remove(e)}),this.model.trigger("change")},saveSlider:function(e,t){e&&e.preventDefault(),this.model.save(),typeof t=="function"&&t.call()},exitSlider:function(e){if(this.dataChanged){var n="Are you sure you want to leave this page? All unsaved changes will be lost.",r=this;t(".exit-slider-modal").parents(".noty_bar").parent().remove();var n="Your slider's data has been changed! Do you want to save change?";noty({text:'<div class="activity-item"> <i class="fa fa-warning text-error"></i> <div class="activity"> '+n+" </div> </div>",template:'<div class="es-noty-close">&times;</div><div class="noty_message exit-slider-modal"><span class="noty_text"></span></div>',type:"confirm",layout:"center",theme:"relax",dismissQueue:!0,closeWith:["click"],animation:{open:"animated flipInX",close:"animated flipOutX"},buttons:[{addClass:"btn btn-primary",text:"Yes",onClick:function(t){r.saveSlider(e,function(){t.close(),window.location=ES_Config.URL.SLIDERS_VIEW})}},{addClass:"btn btn-danger",text:"No",onClick:function(e){e.close(),window.location=ES_Config.URL.SLIDERS_VIEW}}]}),t(".exit-slider-modal").parents(".noty_bar").parent().clickOutside(function(e){t(".exit-slider-modal").parents(".noty_bar").parent().slideUp("normal",function(){t(this).remove()})})}else window.location=ES_Config.URL.SLIDERS_VIEW},resetAnimationPreview:function(){this.stopAnimationPreview(),this.startAnimationPreview()},toggleAnimationPreview:function(){if(!this.previewIsStarted)return this.startAnimationPreview();if(!this.previewIsPaused)return this.pauseAnimationPreview();if(this.previewIsPaused)return this.resumeAnimationPreview()},enterAnimationPreview:function(){n(this.itemsView.subViews).invoke("enterPreview"),this.$(".timeline-preview-on").removeClass("hidden"),this.$(".timeline-preview-off").addClass("hidden")},exitAnimationPreview:function(){n(this.itemsView.subViews).invoke("exitPreview"),this.$(".timeline-preview-on").addClass("hidden"),this.$(".timeline-preview-off").removeClass("hidden")},startAnimationPreview:function(){this.previewIsStarted=!0,this.slideAnim.start(),this.enterAnimationPreview(),this.$(".timeline-resume-btn").hide(),this.$(".timeline-pause-btn").show()},pauseAnimationPreview:function(){this.previewIsPaused=!0,this.slideAnim.pause(),this.$(".timeline-resume-btn").show(),this.$(".timeline-pause-btn").hide()},resumeAnimationPreview:function(){this.previewIsPaused=!1,this.slideAnim.resume(),this.$(".timeline-resume-btn").hide(),this.$(".timeline-pause-btn").show()},stopAnimationPreview:function(){this.previewIsStarted=!1,this.exitAnimationPreview(),this.slideAnim.stop()}},{getImageURL:function(e){if(e.match(/^(http|https):\/\//))return e;if(e.match(/^\/?image/))return(ES_Config.URL.ROOT+"/"+e).replace(/\/+/,"/")}}),e.ES_UndoStack=n(function(t){if(!t)throw"No Backbone model provided";this.model=t,this.undoStack=[],this.redoStack=[],this.tracking=!1,this.store=n.debounce(this.store,100)}).chain().setPrototypeOf(r.Events).extendPrototype({start:function(){return this.tracking=!0,this.listenTo(this.model,"change",this.store),this.store(),this},stop:function(){return this.tracking=!1,this.stopListening(this.model,"change",this.store),this},store:function(){var e=this.model.changed;if(typeof e["slides.items.selected"]=="undefined"&&this.tracking&&!this.notSave){this.currentStage&&this.undoStack.push(this.currentStage),this.currentStage=this.model.toJSON();while(this.redoStack.length)this.redoStack.pop()}return this.notSave=!1,this},undo:function(){this.notSave=!0;var e=this.tracking;this.stop();var t=this.undoStack.pop();return t&&(this.redoStack.push(this.currentStage),this.currentStage=t,this.model.clear({silent:!0}).set(t)),e&&this.start(),!!t},redo:function(){this.notSave=!0;var e=this.tracking;this.stop();var t=this.redoStack.pop();return t&&(this.undoStack.push(this.currentStage),this.currentStage=t,this.model.clear({silent:!0}).set(t)),e&&this.start(),!!t}}).value()}(this,jQuery,_,JSNES_Backbone);