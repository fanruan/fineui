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
            baseCls: "bi-icon-trigger",
            extraCls: "pull-down-font",
            el: {},
            height: 24
        });
    },
    _init: function () {
        var o = this.options;
        BI.IconTrigger.superclass._init.apply(this, arguments);
        this.iconButton = BI.createWidget(o.el, {
            type: "bi.trigger_icon_button",
            element: this,
            width: o.width,
            height: o.height,
            extraCls: o.extraCls
        });
    }
});
BI.shortcut("bi.icon_trigger", BI.IconTrigger);