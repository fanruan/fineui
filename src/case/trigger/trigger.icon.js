/**
 * 图标按钮trigger
 *
 * Created by GUY on 2015/10/8.
 * @class BI.IconTrigger
 * @extends BI.Trigger
 */
BI.IconTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.IconTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-icon-trigger",
            el: {},
            height: 30
        });
    },
    _init: function () {
        var o = this.options;
        BI.IconTrigger.superclass._init.apply(this, arguments);
        this.iconButton = BI.createWidget(o.el, {
            type: "bi.trigger_icon_button",
            element: this.element,
            width: o.width,
            height: o.height
        });
    }
});
$.shortcut('bi.icon_trigger', BI.IconTrigger);