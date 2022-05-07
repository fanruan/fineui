/**
 * @class BI.TextValueCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.TextValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function (config) {
        return BI.extend(BI.TextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-value-combo " + (config.simple ? "bi-border-bottom" : "bi-border"),
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: "",
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
        BI.TextValueCombo.superclass._init.apply(this, arguments);
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            cls: "text-value-trigger",
            items: o.items,
            height: o.height,
            text: o.text,
            value: o.value,
            warningTitle: o.warningTitle
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_combo_popup",
            chooseType: o.chooseType,
            value: o.value,
            items: o.items
        });
        this.popup.on(BI.TextValueComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.textIconCombo.hideView();
            self.fireEvent(BI.TextValueCombo.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCombo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            direction: o.direction,
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 240,
                minHeight: 25
            }
        });
        if(BI.isKey(o.value)) {
            this._checkError(o.value);
        }
    },

    _checkError: function (v) {
        if(BI.isNull(v) || BI.isEmptyArray(v) || BI.isEmptyString(v)) {
            this.trigger.options.tipType = "success";
            this.element.removeClass("combo-error");
        } else {
            v = BI.isArray(v) ? v : [v];
            var result = BI.find(this.options.items, function (idx, item) {
                return BI.contains(v, item.value);
            });
            if (BI.isNull(result)) {
                this.trigger.setTipType("warning");
                this.element.removeClass("combo-error").addClass("combo-error");
            } else {
                this.trigger.setTipType("success");
                this.element.removeClass("combo-error");
            }
        }
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
        this._checkError(v);
    },

    getValue: function () {
        var value = this.popup.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCombo.populate(items);
    }
});
BI.TextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_combo", BI.TextValueCombo);
