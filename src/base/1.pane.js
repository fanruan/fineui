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
            loadingText: "",
            loadingSize: "small",
            overlap: true,
            onLoaded: BI.emptyFn
        });
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
                element: this,
                items: [this._tipText]
            });
        }
    },

    loading: function () {
        var self = this, o = this.options;
        var isIE = BI.isIE();
        var loadingAnimation = BI.createWidget({
            type: "bi.horizontal",
            cls: "bi-loading-widget" + (isIE ? " wave-loading hack" : ""),
            height: this._getSize(60),
            width: this._getSize(60),
            hgap: this._getSize(10),
            vgap: 2.5,
            items: isIE ? [] : [{
                type: "bi.layout",
                cls: "animate-rect rect1",
                height: this._getSize(50),
                width: this._getSize(5),
            }, {
                type: "bi.layout",
                cls: "animate-rect rect2",
                height: this._getSize(50),
                width: this._getSize(5),
            }, {
                type: "bi.layout",
                cls: "animate-rect rect3",
                height: this._getSize(50),
                width: this._getSize(5),
            }]
        });
        // pane在同步方式下由items决定tipText的显示与否
        // loading的异步情况下由loaded后对面板的populate的时机决定
        this.setTipVisible(false);
        if (o.overlap === true) {
            if (!BI.Layers.has(this.getName())) {
                BI.createWidget({
                    type: "bi.center_adapt",
                    cls: "loading-container",
                    items: this._getLoadingTipItems(loadingAnimation),
                    element: BI.Layers.make(this.getName(), this)
                });
            }
            BI.Layers.show(self.getName());
        } else if (BI.isNull(this._loading)) {
            this._loading = loadingAnimation;
            this._loading.element.css("zIndex", 1);
            BI.createWidget({
                type: "bi.center_adapt",
                element: this,
                cls: "loading-container",
                items: this._getLoadingTipItems(this._loading)
            });
        }
        self.fireEvent(BI.Pane.EVENT_LOADING);
        this.element.addClass("loading-status");
    },

    _getSize: function(v) {
        return Math.ceil(v / (this.options.loadingSize === 'small' ? 2 : 1));
    },

    _getLoadingTipItems: function (loadingTip) {
        var o = this.options;
        var loadingTipItems = [{
            type: "bi.horizontal_adapt",
            items: [loadingTip]
        }];
        BI.isNotEmptyString(o.loadingText) && loadingTipItems.push({
            type: "bi.text",
            text: o.loadingText,
            tgap: this._getSize(10),
        });

        return [{
            type: "bi.vertical",
            items: loadingTipItems
        }];
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
BI.Pane.EVENT_LOADING = "EVENT_LOADING";