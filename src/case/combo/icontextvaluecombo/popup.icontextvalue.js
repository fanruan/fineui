/**
 * Created by Windy on 2017/12/12.
 */
BI.IconTextValueComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.IconTextValueComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-icon-text-icon-popup"
        });
    },

    _init: function () {
        BI.IconTextValueComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.single_select_icon_text_item",
                height: 30,
                iconHeight: o.iconHeight,
                iconWidth: o.iconWidth
            }),
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.IconTextValueComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.IconTextValueComboPopup.superclass.populate.apply(this, arguments);
        items = BI.createItems(items, {
            type: "bi.single_select_icon_text_item",
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
BI.IconTextValueComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_value_combo_popup", BI.IconTextValueComboPopup);