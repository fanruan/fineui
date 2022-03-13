/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconComboPopup
 * @extend BI.Pane
 */
BI.IconComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.IconComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi.icon-combo-popup",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.IconComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.single_select_icon_text_item",
            }),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.IconComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 5,
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.IconComboPopup.superclass.populate.apply(this, arguments);
        items = BI.createItems(items, {
            type: "bi.single_select_icon_text_item",
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
BI.IconComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_combo_popup", BI.IconComboPopup);