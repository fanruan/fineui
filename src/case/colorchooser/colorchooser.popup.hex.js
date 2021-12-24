/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/11/10
 */
BI.HexColorChooserPopup = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-color-chooser-popup",
        width: 300,
        recommendColorsGetter: BI.emptyFn, // 推荐色获取接口
        simple: false // 简单模式, popup中没有自动和透明
    },

    render: function () {
        var self = this, o = this.options;
        var hasRecommendColors = BI.isNotNull(o.recommendColorsGetter());
        return [{
            type: "bi.vertical",
            items: [{
                el: {
                    type: "bi.vertical",
                    hgap: 15,
                    items: [BI.extend({
                        type: o.simple ? "bi.simple_hex_color_picker_editor" : "bi.hex_color_picker_editor",
                        value: o.value,
                        height: o.simple ? 36 : 70,
                        listeners: [{
                            eventName: BI.ColorPickerEditor.EVENT_CHANGE,
                            action: function () {
                                self.setValue(this.getValue());
                                self._dealStoreColors();
                                self.fireEvent(BI.ColorChooserPopup.EVENT_VALUE_CHANGE, arguments);
                            }
                        }],
                        ref: function (_ref) {
                            self.colorEditor = _ref;
                        }
                    }, o.editor), {
                        el: {
                            type: "bi.hex_color_picker",
                            cls: "bi-border-bottom bi-border-right",
                            items: [this._digestStoreColors(this._getStoreColors())],
                            height: 22,
                            value: o.value,
                            listeners: [{
                                eventName: BI.ColorPicker.EVENT_CHANGE,
                                action: function () {
                                    self.setValue(this.getValue()[0]);
                                    self._dealStoreColors();
                                    self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
                                }
                            }],
                            ref: function (_ref) {
                                self.storeColors = _ref;
                            }
                        },
                        tgap: 10,
                        height: 22
                    }, {
                        el: hasRecommendColors ? {
                            type: "bi.vertical",
                            items: [{
                                type: "bi.label",
                                text: BI.i18nText("BI-Basic_Recommend_Color"),
                                textAlign: "left",
                                height: 24
                            }, {
                                type: "bi.hex_color_picker",
                                cls: "bi-border-bottom bi-border-right",
                                items: [this._digestStoreColors(o.recommendColorsGetter())],
                                height: 22,
                                value: o.value,
                                listeners: [{
                                    eventName: BI.ColorPicker.EVENT_CHANGE,
                                    action: function () {
                                        self.setValue(this.getValue()[0]);
                                        self._dealStoreColors();
                                        self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
                                    }
                                }],
                                ref: function (_ref) {
                                    self.recommendColors = _ref;
                                }
                            }]
                        } : {type: "bi.layout"},
                        tgap: hasRecommendColors ? 10 : 0,
                        height: hasRecommendColors ? 47 : 0
                    }, {
                        el: {
                            type: "bi.layout",
                            cls: "bi-border-top"
                        },
                        vgap: 10,
                        height: 1
                    }, {
                        type: "bi.absolute",
                        items: [{
                            el: {
                                type: "bi.hex_color_picker",
                                space: true,
                                value: o.value,
                                listeners: [{
                                    eventName: BI.ColorPicker.EVENT_CHANGE,
                                    action: function () {
                                        self.setValue(this.getValue()[0]);
                                        self._dealStoreColors();
                                        self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
                                    }
                                }],
                                ref: function (_ref) {
                                    self.colorPicker = _ref;
                                }
                            },
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 1
                        }],
                        height: 80
                    }]
                }
            }, {
                el: {
                    type: "bi.combo",
                    cls: "bi-border-top",
                    container: null,
                    direction: "right,top",
                    isNeedAdjustHeight: false,
                    el: {
                        type: "bi.text_item",
                        cls: "color-chooser-popup-more bi-list-item",
                        textAlign: "center",
                        height: 24,
                        textLgap: 10,
                        text: BI.i18nText("BI-Basic_More") + "..."
                    },
                    popup: {
                        type: "bi.popup_panel",
                        buttons: [BI.i18nText("BI-Basic_Cancel"), BI.i18nText("BI-Basic_Save")],
                        title: BI.i18nText("BI-Custom_Color"),
                        el: {
                            type: "bi.custom_color_chooser",
                            value: o.value,
                            editor: o.editor,
                            ref: function (_ref) {
                                self.customColorChooser = _ref;
                            }
                        },
                        stopPropagation: false,
                        bgap: -1,
                        rgap: 1,
                        lgap: 1,
                        minWidth: 227,
                        listeners: [{
                            eventName: BI.PopupPanel.EVENT_CLICK_TOOLBAR_BUTTON,
                            action: function (index) {
                                switch (index) {
                                    case 0:
                                        self.more.hideView();
                                        break;
                                    case 1:
                                        var color = self.customColorChooser.getValue();
                                        // farbtastic选择器没有透明和自动选项，点击保存不应该设置透明
                                        if (BI.isNotEmptyString(color)) {
                                            self.setValue(color);
                                            self._dealStoreColors();
                                        }
                                        self.more.hideView();
                                        self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
                                        break;
                                }
                            }
                        }]
                    },
                    listeners: [{
                        eventName: BI.Combo.EVENT_AFTER_POPUPVIEW,
                        action: function () {
                            self.customColorChooser.setValue(self.getValue());
                        }
                    }],
                    ref: function (_ref) {
                        self.more = _ref;
                    }
                },
                tgap: 10,
                height: 24
            }]
        }, {
            type: "bi.absolute",
            items: [{
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
        }];
    },

    // 这里就实现的不好了，setValue里面有个editor，editor的setValue会检测错误然后出bubble提示
    mounted: function () {
        var o = this.options;
        if (BI.isNotNull(o.value)) {
            this.setValue(o.value);
        }
    },

    _setEnable: function (enable) {
        BI.ColorChooserPopup.superclass._setEnable.apply(this, arguments);
        this.mask.setVisible(!enable);
    },

    _dealStoreColors: function () {
        var color = this.getValue();
        var colors = this._getStoreColors();
        var que = new BI.Queue(12);
        que.fromArray(colors);
        que.remove(color);
        que.unshift(color);
        var array = que.toArray();
        BI.Cache.setItem("colors", BI.array2String(array));
        this.setStoreColors(array);
    },

    _digestStoreColors: function (colors) {
        var items = BI.map(colors.slice(0, 12), function (i, color) {
            return {
                value: color
            };
        });
        BI.count(colors.length, 12, function (i) {
            items.push({
                value: "empty",
                disabled: true
            });
        });
        return items;
    },

    _getStoreColors: function () {
        var self = this, o = this.options;
        var colorsArray = BI.string2Array(BI.Cache.getItem("colors") || "");
        return BI.filter(colorsArray, function (idx, color) {
            return o.simple ? self._isRGBColor(color) : true;
        });
    },

    _isRGBColor: function (color) {
        return BI.isNotEmptyString(color) && color !== "transparent";
    },

    setStoreColors: function (colors) {
        if (BI.isArray(colors)) {
            this.storeColors.populate([this._digestStoreColors(colors)]);
            // BI-66973 选中颜色的同时选中历史
            this.storeColors.setValue(this.getValue());
        }
    },

    setValue: function (color) {
        this.colorEditor.setValue(color);
        this.colorPicker.setValue(color);
        this.storeColors.setValue(color);
        this.recommendColors && this.recommendColors.setValue(color);
    },

    getValue: function () {
        return this.colorEditor.getValue();
    }
});
BI.HexColorChooserPopup.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
BI.HexColorChooserPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.hex_color_chooser_popup", BI.HexColorChooserPopup);
