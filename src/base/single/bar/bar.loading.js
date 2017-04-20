/**
 * guy
 * 加载条
 * @type {*|void|Object}
 */
BI.LoadingBar = BI.inherit(BI.Single, {
    consts: {
        loadedText: BI.i18nText("BI-Load_More"),
        endText: BI.i18nText("BI-No_More_Data")
    },
    _defaultConfig: function() {
        var conf = BI.LoadingBar.superclass._defaultConfig.apply(this, arguments);
        return BI.extend( conf, {
            baseCls : (conf.baseCls ||"")+' bi-loading-bar bi-tips',
            height: 30,
            handler: BI.emptyFn
        })
    },
    _init : function() {
        BI.LoadingBar.superclass._init.apply(this, arguments);
        var self = this;
        this.loaded = BI.createWidget({
            type: "bi.text_button",
            cls: "loading-text bi-list-item-simple",
            text: this.consts.loadedText,
            width: 120,
            handler: this.options.handler
        })
        this.loaded.on(BI.Controller.EVENT_CHANGE, function(type){
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        })

        this.loading = BI.createWidget({
            type: "bi.layout",
            width: this.options.height,
            height:this.options.height,
            cls: "loading-background cursor-default"
        })
        var loaded = BI.createWidget({
            type: "bi.center_adapt",
            items: [this.loaded]
        })
        var loading = BI.createWidget({
            type: "bi.center_adapt",
            items: [this.loading]
        })
        this.cardLayout = BI.createWidget({
            type: "bi.card",
            element: this,
            items: [{
                el: loaded,
                cardName: "loaded"
            }, {
                el: loading,
                cardName: "loading"
            }]
        })
        this.invisible();
    },

    _reset: function(){
        this.visible();
        this.loaded.setText(this.consts.loadedText);
        this.loaded.enable();
    },

    setLoaded: function(){
        this._reset();
        this.cardLayout.showCardByName("loaded");
    },

    setEnd: function(){
        this.setLoaded();
        this.loaded.setText(this.consts.endText);
        this.loaded.disable();
    },

    setLoading: function(){
        this._reset();
        this.cardLayout.showCardByName("loading");
    }
});

BI.shortcut("bi.loading_bar", BI.LoadingBar);