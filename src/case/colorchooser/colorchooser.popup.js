/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooserPopup
 * @extends BI.Widget
 */
BI.ColorChooserPopup = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-color-chooser-popup",
        width: 230,
        height: 145
    },

    render: function () {
        var self = this, o = this.options;
        this.colorEditor = BI.createWidget(o.editor, {
            type: "bi.color_picker_editor",
            value: o.value,
            cls: "bi-background bi-border-bottom",
            height: 30
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
            width: 210,
            height: 24,
            value: o.value
        });
        this.storeColors.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.colorPicker = BI.createWidget({
            type: "bi.color_picker",
            width: 210,
            height: 50,
            value: o.value
        });

        this.colorPicker.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.customColorChooser = BI.createWidget({
            type: "bi.custom_color_chooser",
            editor: o.editor
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
            container: null,
            direction: "right,top",
            isNeedAdjustHeight: false,
            el: {
                type: "bi.text_item",
                cls: "color-chooser-popup-more bi-list-item",
                textAlign: "center",
                height: 24,
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

        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vtape",
                    items: [this.colorEditor, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: this.storeColors,
                                left: 10,
                                right: 10,
                                top: 5
                            }]
                        },
                        height: 29
                    }, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: this.colorPicker,
                                left: 10,
                                right: 10,
                                top: 5,
                                bottom: 5
                            }]
                        },
                        height: 60
                    }, {
                        el: this.more,
                        height: 24
                    }]
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: {
                    type: "bi.layout",
                    cls: "disable-mask",
                    invisible: !o.disabled,
                    ref: function () {
                        self.mask = this;
                    }
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        };
    },

    mounted: function () {
        var self = this;
        var o = this.options;
        if (BI.isNotNull(o.value)) {
            this.setValue(o.value);
        }
    },

    _setEnable: function (enable) {
        BI.ColorChooserPopup.superclass._setEnable.apply(this, arguments);
        this.mask.setVisible(!enable);
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