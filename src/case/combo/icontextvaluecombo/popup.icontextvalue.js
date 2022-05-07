/**
 * Created by Windy on 2017/12/12.
 */
BI.IconTextValueComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.IconTextValueComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-icon-text-icon-popup",
            behaviors: {
                redmark: function () {
                    return true;
                }
            }
        });
    },

    _init: function () {
        BI.IconTextValueComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.single_select_icon_text_item",
                iconHeight: o.iconHeight,
                iconWidth: o.iconWidth,
                iconWrapperWidth: o.iconWrapperWidth
            }),
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            layouts: [{
                type: "bi.vertical"
            }],
            behaviors: o.behaviors,
            value: o.value
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.IconTextValueComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        this.check();

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 5,
            items: [this.popup]
        });
    },

    populate: function (items, keyword) {
        BI.IconTextValueComboPopup.superclass.populate.apply(this, arguments);
        var o = this.options;
        items = BI.createItems(items, {
            type: "bi.single_select_icon_text_item",
            iconWrapperWidth: o.iconWrapperWidth,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
        });
        this.popup.populate(items, keyword);
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
