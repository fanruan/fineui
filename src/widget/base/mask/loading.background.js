/**
 * @class BI.LoadingBackground
 * @extend BI.Widget
 * 正在加载mask层
 */
BI.LoadingBackground = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LoadingBackground.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "",
            backgroundCls: "loading-background-e50"
        })
    },

    _init: function () {
        BI.LoadingBackground.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var mask = BI.Maskers.create(this.getName(), o.masker, {offset: o.offset, container: o.container});
        BI.createWidget({
            type: "bi.center_adapt",
            element: mask,
            cls: "bi-loading-mask " + o.backgroundCls
        });
        BI.Maskers.show(this.getName());
        BI.nextTick(function () {
            BI.Maskers.show(self.getName());
        });
    },

    destroy: function () {
        BI.Maskers.remove(this.getName());
    }
});
$.shortcut("bi.loading_background", BI.LoadingBackground);