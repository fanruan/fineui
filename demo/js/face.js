Demo.Face = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-face"
    },

    _createLabel: function (text) {
        return {
            width: 200,
            el: {
                type: "bi.label",
                text: text,
                textAlign: "left",
                hgap: 5,
                height: 40,
                cls: "config-label"
            }
        }
    },

    _createColorPicker: function (ref, action) {
        return {
            el: {
                type: "bi.vertical_adapt",
                items: [{
                    type: "bi.color_chooser",
                    listeners: [{
                        eventName: BI.ColorChooser.EVENT_CHANGE,
                        action: action
                    }],
                    ref: ref,
                    width: 30,
                    height: 30
                }]
            }
        }
    },

    _createBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("背景色："), this._createColorPicker(function () {
                self.backgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("字体颜色："), this._createColorPicker(function () {
                self.fontColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createActiveFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("激活状态字体颜色："), this._createColorPicker(function () {
                self.activeFontColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createSelectFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("选中状态字体颜色："), this._createColorPicker(function () {
                self.selectFontColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createGrayFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("灰色字体颜色(用于Card2)："), this._createColorPicker(function () {
                self.grayFontColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createDisableFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("灰化字体颜色："), this._createColorPicker(function () {
                self.disabledFontColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.text_button",
                    text: "这个按钮是灰化的",
                    forceCenter: true,
                    disabled: true
                }
            }]
        }
    },

    _createCard1BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("Card1背景颜色："), this._createColorPicker(function () {
                self.cardBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },
    _createCard2BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("Card2背景颜色：无颜色")]
        }
    },

    _createHoverBackgroundColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("悬浮状态背景颜色："), this._createColorPicker(function () {
                self.hoverBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createActiveBackgroundColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("激活状态背景颜色："), this._createColorPicker(function () {
                self.activeBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createSelectBackgroundColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("选中状态背景颜色："), this._createColorPicker(function () {
                self.selectBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createSlitColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("分割线颜色(只对左边的表格有效)："), this._createColorPicker(function () {
                self.slitColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createBaseConfig: function () {
        return {
            type: "bi.vertical",
            items: [this._createLabel("--通用配色--"),
                this._createBackgroundConfig(),
                this._createFontConfig(),
                this._createActiveFontConfig(),
                this._createSelectFontConfig(),
                this._createGrayFontConfig(),
                this._createDisableFontConfig(),
                this._createCard1BackgroundConfig(),
                this._createCard2BackgroundConfig(),
                this._createHoverBackgroundColor(),
                this._createActiveBackgroundColor(),
                this._createSelectBackgroundColor(),
                this._createSlitColor()
            ]
        }
    },


    _createButton1BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("按钮背景色1："), this._createColorPicker(function () {
                self.button1BackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    height: 40,
                    items: [{
                        type: "bi.button",
                        cls: "config-button1",
                        text: "测试按钮"
                    }]
                }
            }]
        }
    },

    _createButton2BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("按钮背景色2："), this._createColorPicker(function () {
                self.button2BackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    height: 40,
                    items: [{
                        type: "bi.button",
                        level: "success",
                        cls: "config-button2",
                        text: "测试按钮"
                    }]
                }
            }]
        }
    },

    _createButton3BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("按钮背景色3："), this._createColorPicker(function () {
                self.button3BackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    height: 40,
                    items: [{
                        type: "bi.button",
                        level: "warning",
                        cls: "config-button3",
                        text: "测试按钮"
                    }]
                }
            }]
        }
    },

    _createButton4BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("按钮背景色4："), this._createColorPicker(function () {
                self.button4BackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    height: 40,
                    items: [{
                        type: "bi.button",
                        level: "ignore",
                        cls: "config-button4",
                        text: "测试按钮"
                    }]
                }
            }]
        }
    },

    _createScrollBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("滚动条底色："), this._createColorPicker(function () {
                self.scrollBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createScrollThumbConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("滚动条thumb颜色："), this._createColorPicker(function () {
                self.scrollThumbColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createPopupBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("下拉框背景颜色："), this._createColorPicker(function () {
                self.popupBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    items: [{
                        type: "bi.down_list_combo",
                        items: [[{
                            el: {
                                text: "column 1111",
                                iconCls1: "check-mark-e-font",
                                value: 11
                            },
                            children: [
                                {
                                    text: "column 1.1",
                                    value: 21,
                                    cls: "dot-e-font",
                                    selected: true
                                }, {
                                    text: "column 1.222222222222222222222222222222222222",
                                    cls: "dot-e-font",
                                    value: 22,
                                }, {
                                    text: "column 1.3",
                                    cls: "dot-e-font",
                                    value: 23,
                                }, {
                                    text: "column 1.4",
                                    cls: "dot-e-font",
                                    value: 24,
                                }, {
                                    text: "column 1.5",
                                    cls: "dot-e-font",
                                    value: 25
                                }
                            ]
                        }], [
                            {
                                el: {
                                    type: "bi.icon_text_icon_item",
                                    text: "column 2",
                                    iconCls1: "chart-type-e-font",
                                    cls: "dot-e-font",
                                    value: 12
                                },
                                disabled: true,
                                children: [{
                                    type: "bi.icon_text_item",
                                    cls: "dot-e-font",
                                    height: 25,
                                    text: "column 2.1",
                                    value: 11
                                }, {text: "column 2.2", value: 12, cls: "dot-e-font"}],


                            }
                        ], [
                            {
                                text: "column 33333333333333333333333333333333",
                                cls: "style-set-e-font",
                                value: 13
                            }
                        ], [
                            {
                                text: "column 4",
                                cls: "filter-e-font",
                                value: 14
                            }
                        ], [
                            {
                                text: "column 5",
                                cls: "copy-e-font",
                                value: 15

                            }
                        ], [
                            {
                                text: "column 6",
                                cls: "delete-e-font",
                                value: 16
                            }
                        ], [
                            {
                                text: "column 7",
                                cls: "dimension-from-e-font",
                                value: 17,
                                disabled: true
                            }
                        ]]
                    }]
                }
            }]
        }
    },

    _createMaskBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("弹出层蒙版颜色："), this._createColorPicker(function () {
                self.maskBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    items: [{
                        type: "bi.button",
                        text: "mask测试",
                        handler: function () {
                            BI.Msg.alert("弹出层", "弹出层面板")
                        }
                    }]
                }
            }]
        }
    },

    _createCommonConfig: function () {
        return {
            type: "bi.vertical",
            items: [this._createLabel("--一般配色--"),
                this._createButton1BackgroundConfig(),
                this._createButton2BackgroundConfig(),
                this._createButton3BackgroundConfig(),
                this._createButton4BackgroundConfig(),
                this._createScrollBackgroundConfig(),
                this._createScrollThumbConfig(),
                this._createPopupBackgroundConfig(),
                this._createMaskBackgroundConfig()
            ]
        }
    },

    render: function () {
        var self = this;
        return {
            type: "bi.grid",
            items: [[{
                column: 0,
                row: 0,
                el: {
                    type: "demo.preview"
                }
            }, {
                column: 1,
                row: 0,
                el: {
                    type: "bi.vertical",
                    cls: "face-config bi-border-left",
                    items: [this._createBaseConfig(),
                        this._createCommonConfig()]
                }
            }]]
        }
    },

    _setStyle: function (objects) {
        var result = "";
        BI.each(objects, function (cls, object) {
            result += cls + "{";
            BI.each(object, function (name, value) {
                result += name + ":" + value + ";"
            });
            result += "} ";
        });
        BI.StyleLoaders.removeStyle("style").loadStyle("style", result);
    },

    _runGlobalStyle: function () {
        var backgroundColor = this.backgroundColor.getValue();
        var fontColor = this.fontColor.getValue();
        var activeFontColor = this.activeFontColor.getValue();
        var selectFontColor = this.selectFontColor.getValue();
        var grayFontColor = this.grayFontColor.getValue();
        var disabledFontColor = this.disabledFontColor.getValue();
        var cardBackgroundColor = this.cardBackgroundColor.getValue();
        var hoverBackgroundColor = this.hoverBackgroundColor.getValue();
        var activeBackgroundColor = this.activeBackgroundColor.getValue();
        var selectBackgroundColor = this.selectBackgroundColor.getValue();
        var slitColor = this.slitColor.getValue();

        var button1BackgroundColor = this.button1BackgroundColor.getValue();
        var button2BackgroundColor = this.button2BackgroundColor.getValue();
        var button3BackgroundColor = this.button3BackgroundColor.getValue();
        var button4BackgroundColor = this.button4BackgroundColor.getValue();
        var scrollBackgroundColor = this.scrollBackgroundColor.getValue();
        var scrollThumbColor = this.scrollThumbColor.getValue();
        var popupBackgroundColor = this.popupBackgroundColor.getValue();
        var maskBackgroundColor = this.maskBackgroundColor.getValue();

        this._setStyle({
            "#wrapper.bi-background, #wrapper .bi-background": {
                "background-color": backgroundColor,
                "color": fontColor
            },
            "#wrapper .bi-card": {
                "background-color": cardBackgroundColor
            },
            "#wrapper .bi-tips": {
                "color": grayFontColor
            },
            "div::-webkit-scrollbar,.scrollbar-layout-main": {
                "background-color": scrollBackgroundColor + "!important"
            },
            "div::-webkit-scrollbar-thumb,.public-scrollbar-face:after": {
                "background-color": scrollThumbColor + "!important"
            },
            ".base-disabled": {
                color: disabledFontColor + "!important"
            },
            ".base-disabled .b-font:before": {
                color: disabledFontColor + "!important"
            },
            ".list-view-outer": {
                "background-color": popupBackgroundColor + "!important"
            },
            ".bi-z-index-mask": {
                "background-color": maskBackgroundColor + "!important"
            },
            ".bi-list-item:hover,.bi-list-item-hover:hover,.bi-list-item-active:hover,.bi-list-item-select:hover,.bi-list-item-effect:hover": {
                "background-color": hoverBackgroundColor + "!important"
            },
            ".bi-list-item-active:active,.bi-list-item-select:active,.bi-list-item-effect:active": {
                "background-color": activeBackgroundColor + "!important",
                "color": activeFontColor + "!important"
            },
            ".bi-list-item-active.active,.bi-list-item-select.active,.bi-list-item-effect.active": {
                "background-color": selectBackgroundColor + "!important",
                "color": selectFontColor + "!important"
            },
            ".bi-button": {
                "background-color": button1BackgroundColor,
                "border-color": button1BackgroundColor
            },
            ".bi-button.button-success": {
                "background-color": button2BackgroundColor,
                "border-color": button2BackgroundColor
            },
            ".bi-button.button-warning": {
                "background-color": button3BackgroundColor,
                "border-color": button3BackgroundColor
            },
            ".bi-button.button-ignore": {
                "background-color": button4BackgroundColor
            },
            ".bi-collection-table-cell": {
                "border-right-color": slitColor,
                "border-bottom-color": slitColor
            },
            ".bi-collection-table-cell.first-col": {
                "border-left-color": slitColor
            },
            ".bi-collection-table-cell.first-row": {
                "border-top-color": slitColor
            }
        })
    },

    mounted: function () {
        this.backgroundColor.setValue("");
        this.fontColor.setValue("");
        this.activeFontColor.setValue("");
        this.selectFontColor.setValue("");
        this.grayFontColor.setValue("");
        this.disabledFontColor.setValue("");
        this.cardBackgroundColor.setValue("");
        this.hoverBackgroundColor.setValue("");
        this.activeBackgroundColor.setValue("");
        this.selectBackgroundColor.setValue("");

        this.button1BackgroundColor.setValue("");
        this.button2BackgroundColor.setValue("");
        this.button3BackgroundColor.setValue("");
        this.button4BackgroundColor.setValue("");
        this.scrollBackgroundColor.setValue("");
        this.scrollThumbColor.setValue("");
        this.popupBackgroundColor.setValue("");
        this.maskBackgroundColor.setValue("");
        this.slitColor.setValue("");
        this._runGlobalStyle();
    }
});
BI.shortcut("demo.face", Demo.Face);