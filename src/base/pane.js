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
            baseCls: "bi-pane",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            overlap: true,
            onLoaded: BI.emptyFn
        })
    },

    _init: function () {
        BI.Pane.superclass._init.apply(this, arguments);
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
                type: "bi.vertical",
                element: this.element,
                items: [this._tipText],
                bgap: 25
            });
        }
    },

    loading: function () {
        var self = this, o = this.options;
        if (o.overlap === true) {
            if (!BI.Maskers.has(this.getName())) {
                BI.createWidget({
                    type: 'bi.vtape',
                    items: [{
                        el: {
                            type: "bi.layout",
                            cls: "loading-background"
                        },
                        height: 30
                    }],
                    element: BI.Maskers.make(this.getName(), this)
                });
            }
            BI.Maskers.show(self.getName());
        } else {
            this._loading = BI.createWidget({
                type: "bi.layout",
                cls: "loading-background",
                height: 30
            });
            this._loading.element.css("zIndex", 1);
            BI.createWidget({
                type: "bi.absolute",
                element: this.element,
                items: [{
                    el: this._loading,
                    left: 0,
                    right: 0,
                    top: 0
                }]
            })
        }
    },

    loaded: function () {
        var self = this, o = this.options;
        BI.Maskers.remove(self.getName());
        this._loading && this._loading.destroy();
        this._loading && (this._loading = null);
        o.onLoaded();
        self.fireEvent(BI.Pane.EVENT_LOADED);
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