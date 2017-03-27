/**
 * @class BI.TextValueCheckCombo
 * @extend BI.Widget
 * combo : text + icon, popup : check + text
 */
BI.TextValueCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            baseClass: "bi-text-value-check-combo",
            width: 100,
            height: 30,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: ""
        })
    },

    _init: function () {
        BI.TextValueCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items
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
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setTitle: function (title) {
        this.trigger.setTitle(title);
    },

    setValue: function (v) {
        this.textIconCheckCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.TextValueCheckCombo.superclass.setEnable.apply(this, arguments);
        this.textIconCheckCombo.setEnable(v);
    },

    setWarningTitle: function (title) {
        this.trigger.setWarningTitle(title);
    },

    getValue: function () {
        return this.textIconCheckCombo.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCheckCombo.populate(items);
    }
});
BI.TextValueCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_check_combo", BI.TextValueCheckCombo);