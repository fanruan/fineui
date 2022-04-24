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
            iconCls: "",
            width: 24,
            height: 24,
            isShowDown: true,
            value: ""
        });
    },

    _init: function () {
        BI.IconComboTrigger.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        var iconCls = "";
        if(BI.isKey(o.value)){
            iconCls = this._digest(o.value, o.items);
        }
        this.button = BI.createWidget(o.el, {
            type: "bi.icon_change_button",
            cls: "icon-combo-trigger-icon",
            iconCls: iconCls,
            disableSelected: true,
            width: o.isShowDown ? o.width - 12 : o.width,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight,
            selected: BI.isNotEmptyString(iconCls)
        });
        this.down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font font-size-12",
            width: 12,
            height: 8,
            selected: BI.isNotEmptyString(iconCls),
            invisible: !o.isShowDown
        });
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
                right: 3,
                bottom: 0
            }]
        });
    },

    _digest: function (v, items) {
        var iconCls = "";
        v = BI.isArray(v) ? v[0] : v;
        BI.any(items, function (i, item) {
            if (v === item.value) {
                iconCls = item.iconCls;
                return true;
            }
        });
        return iconCls;
    },

    populate: function (items) {
        var o = this.options;
        this.options.items = items || [];
        this.button.setIcon(o.iconCls);
        this.button.setSelected(false);
        this.down.setSelected(false);
    },

    setValue: function (v) {
        BI.IconComboTrigger.superclass.setValue.apply(this, arguments);
        var o = this.options;
        var iconCls = this._digest(v, this.options.items);
        v = BI.isArray(v) ? v[0] : v;
        if (BI.isNotEmptyString(iconCls)) {
            this.button.setIcon(iconCls);
            this.button.setSelected(true);
            this.down.setSelected(true);
        } else {
            this.button.setIcon(o.iconCls);
            this.button.setSelected(false);
            this.down.setSelected(false);
        }
    }
});
BI.IconComboTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_combo_trigger", BI.IconComboTrigger);
