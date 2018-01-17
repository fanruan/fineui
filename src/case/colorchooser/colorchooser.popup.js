/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooserPopup
 * @extends BI.Widget
 */
BI.ColorChooserPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorChooserPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-chooser-popup",
            width: 200,
            height: 145
        });
    },

    _init: function () {
        BI.ColorChooserPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorEditor = BI.createWidget({
            type: "bi.color_picker_editor",
            value: o.value
        });

        this.colorEditor.on(BI.ColorPickerEditor.EVENT_CHANGE, function () {
            self.setValue(this.getValue());
            self.fireEvent(BI.ColorChooserPopup.EVENT_VALUE_CHANGE, arguments);
        });

        this.storeColors = BI.createWidget({
            type: "bi.color_picker",
            items: [[{
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }]],
            width: 190,
            height: 25,
            value: o.value
        });
        this.storeColors.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.colorPicker = BI.createWidget({
            type: "bi.color_picker",
            width: 190,
            height: 50,
            value: o.value
        });

        this.colorPicker.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.customColorChooser = BI.createWidget({
            type: "bi.custom_color_chooser"
        });

        var panel = BI.createWidget({
            type: "bi.popup_panel",
            buttons: [BI.i18nText("BI-Basic_Cancel"), BI.i18nText("BI-Basic_Save")],
            title: BI.i18nText("BI-Custom_Color"),
            el: this.customColorChooser,
            stopPropagation: false,
            bgap: -1,
            rgap: 1,
            lgap: 1,
            minWidth: 227
        });

        this.more = BI.createWidget({
            type: "bi.combo",
            direction: "right,top",
            isNeedAdjustHeight: false,
            el: {
                type: "bi.text_item",
                cls: "color-chooser-popup-more bi-list-item",
                textAlign: "center",
                height: 20,
                text: BI.i18nText("BI-Basic_More") + "..."
            },
            popup: panel
        });

        this.more.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.customColorChooser.setValue(self.getValue());
        });
        panel.on(BI.PopupPanel.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.more.hideView();
                    break;
                case 1:
                    self.setValue(self.customColorChooser.getValue());
                    self.more.hideView();
                    self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
                    break;
            }
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    cls: "bi-background bi-border-bottom",
                    items: [{
                        el: this.colorEditor,
                        left: 0,
                        right: 0,
                        top: 5
                    }]
                },
                height: 30
            }, {
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.storeColors,
                        left: 5,
                        right: 5,
                        top: 5
                    }]
                },
                height: 30
            }, {
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.colorPicker,
                        left: 5,
                        right: 5,
                        top: 5
                    }]
                },
                height: 65
            }, {
                el: this.more,
                height: 20
            }]
        });
    },

    setStoreColors: function (colors) {
        if (BI.isArray(colors)) {
            var items = BI.map(colors, function (i, color) {
                return {
                    value: color
                };
            });
            BI.count(colors.length, 8, function (i) {
                items.push({
                    value: "",
                    disabled: true
                });
            });
            this.storeColors.populate([items]);
        }
    },

    setValue: function (color) {
        this.colorEditor.setValue(color);
        this.colorPicker.setValue(color);
        this.storeColors.setValue(color);
    },

    getValue: function () {
        return this.colorEditor.getValue();
    }
});
BI.ColorChooserPopup.EVENT_VALUE_CHANGE = "ColorChooserPopup.EVENT_VALUE_CHANGE";
BI.ColorChooserPopup.EVENT_CHANGE = "ColorChooserPopup.EVENT_CHANGE";
BI.shortcut("bi.color_chooser_popup", BI.ColorChooserPopup);