/**
 * @class BI.TextValueCheckCombo
 * @extend BI.Widget
 * combo : text + icon, popup : check + text
 */
BI.TextValueCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function (config) {
        return BI.extend(BI.TextValueCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-value-check-combo " + (config.simple ? "bi-border-bottom" : "bi-border"),
            width: 100,
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            value: "",
        });
    },

    _init: function () {
        var self = this, o = this.options;
        BI.isNumeric(o.width) && (o.width -= 2);
        BI.isNumeric(o.height) && (o.height -= 2);
        o.value = BI.isFunction(o.value) ? this.__watch(o.value, function (context, newValue) {
            self.setValue(newValue);
        }) : o.value;
        o.items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        BI.TextValueCheckCombo.superclass._init.apply(this, arguments);
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            cls: "text-value-trigger",
            items: o.items,
            height: o.height,
            text: o.text,
            value: o.value
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items,
            value: o.value
        });
        this.popup.on(BI.TextValueCheckComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.textIconCheckCombo.hideView();
            self.fireEvent(BI.TextValueCheckCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCheckCombo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            direction: o.direction,
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

    setTitle: function (title) {
        this.trigger.setTitle(title);
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    setWarningTitle: function (title) {
        this.trigger.setWarningTitle(title);
    },

    getValue: function () {
        var value = this.popup.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCheckCombo.populate(items);
    }
});
BI.TextValueCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_check_combo", BI.TextValueCheckCombo);
