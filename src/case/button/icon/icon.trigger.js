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
            baseCls: (conf.baseCls || "") + " bi-trigger-icon-button overflow-hidden",
            extraCls: "pull-down-font"
        });
    }
});
BI.TriggerIconButton.EVENT_CHANGE = BI.IconButton.EVENT_CHANGE;
BI.shortcut("bi.trigger_icon_button", BI.TriggerIconButton);
