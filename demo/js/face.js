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
            cls: "config-item",
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
            cls: "config-item",
            height: 40,
            items: [this._createLabel("字体颜色："), this._createColorPicker(function () {
                self.fontColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createDisableFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
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

    _createCardBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
            height: 40,
            items: [this._createLabel("Card背景颜色："), this._createColorPicker(function () {
                self.cardBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createHoverBackgroundColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
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
            cls: "config-item",
            height: 40,
            items: [this._createLabel("激活状态背景颜色："), this._createColorPicker(function () {
                self.activeBackgroundColor = this;
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
                this._createDisableFontConfig(),
                this._createCardBackgroundConfig(),
                this._createHoverBackgroundColor(),
                this._createActiveBackgroundColor()
            ]
        }
    },

    _createScrollBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
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
            cls: "config-item",
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
            cls: "config-item",
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
            cls: "config-item",
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
                    type: "demo.preview",
                    cls: "face-config"
                }
            }, {
                column: 1,
                row: 0,
                el: {
                    type: "bi.vertical",
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
        var disabledFontColor = this.disabledFontColor.getValue();
        var cardBackgroundColor = this.cardBackgroundColor.getValue();
        var hoverBackgroundColor = this.hoverBackgroundColor.getValue();
        var activeBackgroundColor = this.activeBackgroundColor.getValue();

        var scrollBackgroundColor = this.scrollBackgroundColor.getValue();
        var scrollThumbColor = this.scrollThumbColor.getValue();
        var popupBackgroundColor = this.popupBackgroundColor.getValue();
        var maskBackgroundColor = this.maskBackgroundColor.getValue();

        $("#wrapper").css({
            backgroundColor: backgroundColor,
            color: fontColor
        });
        $(".demo-west,.preview-card").css({
            backgroundColor: cardBackgroundColor
        });
        this._setStyle({
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
                "background-color": hoverBackgroundColor
            },
            ".bi-list-item-active:active,.bi-list-item-select:active,.bi-list-item-effect:active": {
                "background-color": activeBackgroundColor
            }
        })
    },

    mounted: function () {
        this.backgroundColor.setValue("");
        this.fontColor.setValue("");
        this.disabledFontColor.setValue("");
        this.cardBackgroundColor.setValue("");
        this.hoverBackgroundColor.setValue("");
        this.activeBackgroundColor.setValue("");

        this.scrollBackgroundColor.setValue("");
        this.scrollThumbColor.setValue("");
        this.popupBackgroundColor.setValue("");
        this.maskBackgroundColor.setValue("");
        this._runGlobalStyle();
    }
});
BI.shortcut("demo.face", Demo.Face);