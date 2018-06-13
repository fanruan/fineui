/**
 *  统一的trigger图标按钮
 *
 * Created by GUY on 2015/9/16.
 * @class BI.TriggerIconButton
 * @extends BI.IconButton
 *
 * attention: 不要加invisible, 不要单独拿出去用
 */
BI.TriggerIconButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.TriggerIconButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-trigger-icon-button"
        });
    },

    _init: function () {
        BI.TriggerIconButton.superclass._init.apply(this, arguments);
        BI.createWidget({
            type: "bi.center_adapt",
            element: this,
            items: [{
                type: "bi.icon_button",
                cls: "pull-down-font trigger-down"
            }, {
                type: "bi.icon_button",
                cls: "pull-up-font trigger-up"
            }]
        });
    },

    doClick: function () {
        BI.TriggerIconButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TriggerIconButton.EVENT_CHANGE, this);
        }
    }
});
BI.TriggerIconButton.EVENT_CHANGE = "TriggerIconButton.EVENT_CHANGE";
BI.shortcut("bi.trigger_icon_button", BI.TriggerIconButton);