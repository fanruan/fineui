/**
 * 单选combo
 *
 * @class BI.StaticCombo
 * @extend BI.Widget
 */
BI.StaticCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.StaticCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-static-combo",
            height: 30,
            text: "",
            el: {},
            items: [],
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        })
    },

    _init: function () {
        BI.StaticCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.text_icon_item",
            cls: "bi-select-text-trigger pull-down-font",
            text: o.text,
            readonly: true,
            textLgap: 5,
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_combo_popup",
            textAlign: o.textAlign,
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.TextValueComboPopup.EVENT_CHANGE, function () {
            self.combo.hideView();
            self.fireEvent(BI.StaticCombo.EVENT_CHANGE, arguments);
        });
        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });
    },

    populate: function (items) {
        this.combo.populate(items);
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    }
});
BI.StaticCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.static_combo", BI.StaticCombo);