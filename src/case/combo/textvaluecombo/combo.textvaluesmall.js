/**
 * @class BI.SmallTextValueCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.SmallTextValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SmallTextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            width: 100,
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            el: {},
            text: ""
        })
    },

    _init: function () {
        BI.SmallTextValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.small_select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.TextValueComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.SmallTextValueCombo.hideView();
            self.fireEvent(BI.SmallTextValueCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.SmallTextValueCombo = BI.createWidget({
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
        this.SmallTextValueCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.SmallTextValueCombo.superclass.setEnable.apply(this, arguments);
        this.SmallTextValueCombo.setEnable(v);
    },

    getValue: function () {
        return this.SmallTextValueCombo.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.SmallTextValueCombo.populate(items);
    }
});
BI.SmallTextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.small_text_value_combo", BI.SmallTextValueCombo);