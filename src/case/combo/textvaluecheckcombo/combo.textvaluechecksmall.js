/**
 * @class BI.SmallTextValueCheckCombo
 * @extend BI.Widget
 * combo : text + icon, popup : check + text
 */
BI.SmallTextValueCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SmallTextValueCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            width: 100,
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: ""
        });
    },

    _init: function () {
        BI.SmallTextValueCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.small_select_text_trigger",
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
            self.SmallTextIconCheckCombo.hideView();
            self.fireEvent(BI.SmallTextValueCheckCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.SmallTextIconCheckCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setValue: function (v) {
        this.SmallTextIconCheckCombo.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.SmallTextIconCheckCombo.populate(items);
    }
});
BI.SmallTextValueCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.small_text_value_check_combo", BI.SmallTextValueCheckCombo);