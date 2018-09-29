/**
 * 当没有元素时有提示信息的view
 *
 * Created by GUY on 2015/9/8.
 * @class BI.Pane
 * @extends BI.Widget
 * @abstract
 */
BI.Pane = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Pane.superclass._defaultConfig.apply(this, arguments), {
            _baseCls: "bi-pane",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            overlap: true,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.Pane.superclass._init.apply(this, arguments);
        if (this.__async) {
            this.loading();
        }
    },

    _render: function () {
        BI.Pane.superclass._render.apply(this, arguments);
        if (this.__async) {
            this.loaded();
        }
    },

    _assertTip: function () {
        var o = this.options;
        if (!this._tipText) {
            this._tipText = BI.createWidget({
                type: "bi.label",
                cls: "bi-tips",
                text: o.tipText,
                height: 25
            });
            BI.createWidget({
                type: "bi.absolute_center_adapt",
                cls: "no-item-tip-status",
                element: this,
                items: [this._tipText]
            });
        }
    },

    loading: function () {
        var self = this, o = this.options;
        var loadingAnimation = BI.createWidget({
            type: "bi.horizontal",
            cls: "bi-loading-widget" + ((BI.isIE() && BI.getIEVersion() < 10) ? " hack" : ""),
            height: 30,
            width: 30,
            hgap: 5.25,
            vgap: 2.5,
            items: [{
                type: "bi.layout",
                cls: "rect1",
                height: 25,
                width: 3
            }, {
                type: "bi.layout",
                cls: "rect2",
                height: 25,
                width: 3
            }, {
                type: "bi.layout",
                cls: "rect3",
                height: 25,
                width: 3
            }]
        });
        // pane在同步方式下由items决定tipText的显示与否
        // loading的异步情况下由loaded后对面板的populate的时机决定
        this.setTipVisible(false);
        if (o.overlap === true) {
            if (!BI.Layers.has(this.getName())) {
                BI.createWidget({
                    type: "bi.absolute_center_adapt",
                    cls: "loading-container",
                    items: [{
                        el: loadingAnimation
                    }],
                    element: BI.Layers.make(this.getName(), this)
                });
            }
            BI.Layers.show(self.getName());
        } else if (BI.isNull(this._loading)) {
            this._loading = loadingAnimation;
            this._loading.element.css("zIndex", 1);
            BI.createWidget({
                type: "bi.absolute_center_adapt",
                element: this,
                cls: "loading-container",
                items: [{
                    el: this._loading,
                    left: 0,
                    right: 0,
                    top: 0
                }]
            });
        }
        this.element.addClass("loading-status");
    },

    loaded: function () {
        var self = this, o = this.options;
        BI.Layers.remove(self.getName());
        this._loading && this._loading.destroy();
        this._loading && (this._loading = null);
        o.onLoaded();
        self.fireEvent(BI.Pane.EVENT_LOADED);
        this.element.removeClass("loading-status");
    },

    check: function () {
        this.setTipVisible(BI.isEmpty(this.options.items));
    },

    setTipVisible: function (b) {
        if (b === true) {
            this._assertTip();
            this._tipText.setVisible(true);
        } else {
            this._tipText && this._tipText.setVisible(false);
        }
    },

    populate: function (items) {
        this.options.items = items || [];
        this.check();
    },

    empty: function () {

    }
});
BI.Pane.EVENT_LOADED = "EVENT_LOADED";