BI.TextValueCheckComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueCheckComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-icon-popup",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.TextValueCheckComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: this._formatItems(o.items),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }]
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.TextValueCheckComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });
    },

    _formatItems: function (items) {
        return BI.map(items, function (i, item) {
            return BI.extend({
                type: "bi.icon_text_item",
                cls: "item-check-font bi-list-item",
                height: 30
            }, item);
        });
    },

    populate: function (items) {
        BI.TextValueCheckComboPopup.superclass.populate.apply(this, arguments);
        this.popup.populate(this._formatItems(items));
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.TextValueCheckComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.text_value_check_combo_popup", BI.TextValueCheckComboPopup);