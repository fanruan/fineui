BI.TextValueComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-icon-popup",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.TextValueComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.single_select_item",
                textAlign: o.textAlign,
                height: 30
            }),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }]
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.TextValueComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.TextValueComboPopup.superclass.populate.apply(this, arguments);
        items = BI.createItems(items, {
            type: "bi.single_select_item",
            height: 30
        });
        this.popup.populate(items);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.TextValueComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_combo_popup", BI.TextValueComboPopup);