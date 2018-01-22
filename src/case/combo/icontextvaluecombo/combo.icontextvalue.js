/**
 * Created by Windy on 2017/12/12.
 * combo : icon + text + icon, popup : icon + text
 */
BI.IconTextValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.IconTextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            baseClass: "bi-icon-text-value-combo",
            height: 30,
            value: ""
        });
    },

    _init: function () {
        BI.IconTextValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.select_icon_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text,
            value: o.value
        });
        this.popup = BI.createWidget({
            type: "bi.icon_text_value_combo_popup",
            items: o.items,
            value: o.value
        });
        this.popup.on(BI.IconTextValueComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.textIconCombo.hideView();
            self.fireEvent(BI.IconTextValueCombo.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    setValue: function (v) {
        this.textIconCombo.setValue(v);
    },

    getValue: function () {
        var value = this.textIconCombo.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCombo.populate(items);
    }
});
BI.IconTextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_value_combo", BI.IconTextValueCombo);