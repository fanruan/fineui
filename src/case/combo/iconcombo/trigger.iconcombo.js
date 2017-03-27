/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconComboTrigger
 * @extend BI.Widget
 */
BI.IconComboTrigger = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        return BI.extend(BI.IconComboTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-icon-combo-trigger",
            el: {},
            items: [],
            iconClass: "",
            width: 25,
            height: 25,
            isShowDown: true
        });
    },

    _init: function () {
        BI.IconComboTrigger.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.button = BI.createWidget(o.el, {
            type: "bi.icon_change_button",
            cls: "icon-combo-trigger-icon " + o.iconClass,
            disableSelected: true,
            width: o.width,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        this.down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font",
            width: 12,
            height: 8
        });
        this.down.setVisible(o.isShowDown);
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.button,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: this.down,
                right: 0,
                bottom: 0
            }]
        });
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    populate: function (items) {
        var o = this.options;
        this.options.items = items || [];
        this.button.setIcon(o.iconClass);
        this.button.setSelected(false);
        this.down.setSelected(false);
    },

    setValue: function (v) {
        BI.IconComboTrigger.superclass.setValue.apply(this, arguments);
        var o = this.options;
        var iconClass = "";
        v = BI.isArray(v) ? v[0] : v;
        if (BI.any(this.options.items, function (i, item) {
                if (v === item.value) {
                    iconClass = item.iconClass;
                    return true;
                }
            })) {
            this.button.setIcon(iconClass);
            this.button.setSelected(true);
            this.down.setSelected(true);
        } else {
            this.button.setIcon(o.iconClass);
            this.button.setSelected(false);
            this.down.setSelected(false);
        }
    }
});
BI.IconComboTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_combo_trigger", BI.IconComboTrigger);