/**
 *  统一的trigger图标按钮
 *
 * Created by GUY on 2015/9/16.
 * @class BI.TriggerIconButton
 * @extends BI.IconButton
 */
BI.TriggerIconButton = BI.inherit(BI.IconButton, {

    _defaultConfig: function () {
        var conf = BI.TriggerIconButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-trigger-icon-button",
            extraCls: "pull-down-font"
        });
    },

    _init: function () {
        BI.TriggerIconButton.superclass._init.apply(this, arguments);
    },

    doClick: function () {
        BI.TriggerIconButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TriggerIconButton.EVENT_CHANGE, this);
        }
    }
});
BI.TriggerIconButton.EVENT_CHANGE = "TriggerIconButton.EVENT_CHANGE";
$.shortcut("bi.trigger_icon_button", BI.TriggerIconButton);