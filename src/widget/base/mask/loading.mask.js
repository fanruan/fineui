/**
 * @class BI.LoadingMask
 * @extend BI.Widget
 * 正在加载mask层
 */
BI.LoadingMask = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LoadingMask.superclass._defaultConfig.apply(this, arguments), {
            baseCls: ""
        });
    },

    _init: function () {
        BI.LoadingMask.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var mask = BI.Maskers.create(this.getName(), o.masker, {offset: o.offset, container: o.container});
        BI.createWidget({
            type: "bi.absolute",
            element: mask,
            items: [{
                el: {
                    type: "bi.layout",
                    cls: "bi-loading-main-background"
                },
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }, {
                el: {
                    type: "bi.center_adapt",
                    cls: "bi-loading-mask-content",
                    items: [{
                        type: "bi.vertical",
                        items: [{
                            type: "bi.center_adapt",
                            cls: "loading-bar-icon",
                            items: [{
                                type: "bi.icon",
                                width: 208,
                                height: 30
                            }]
                        }, {
                            type: "bi.label",
                            cls: "loading-bar-label",
                            text: o.text,
                            height: 30
                        }]
                    }]
                },
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }]
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
$.shortcut("bi.loading_mask", BI.LoadingMask);