Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    years: [{
        text: "2010年", value: 2010, iconCls: "close-ha-font"
    }, {
        text: "2011年", value: 2011
    }, {
        text: "2012年", value: 2012, iconCls: "close-ha-font"
    }, {
        text: "2013年", value: 2013
    }, {
        text: "2014年", value: 2014, iconCls: "close-ha-font"
    }, {
        text: "2015年", value: 2015, iconCls: "close-ha-font"
    }, {
        text: "2016年", value: 2016, iconCls: "close-ha-font"
    }, {
        text: "2017年", value: 2017, iconCls: "close-ha-font"
    }],
    child: [{
        type: "bi.combo_group",
        el: {
            type: "bi.icon_text_icon_item",
            text: "2010年",
            value: 2010,
            height: 25,
            iconCls1: "close-ha-font",
            iconCls2: "close-ha-font"
        },
        children: [{
            type: "bi.single_select_item",
            height: 25,
            text: "一月",
            value: 11
        }, {
            type: "bi.icon_text_icon_item",
            height: 25,
            text: "二月",
            value: 12,
            iconCls1: "close-ha-font",
            iconCls2: "close-ha-font",
            children: [{ type: "bi.single_select_item", text: "一号", value: 101, height: 25 }]
        }]
    }, {
        text: "2011年", value: 2011
    }, {
        text: "2012年", value: 2012, iconCls: "close-ha-font"
    }, {
        text: "2013年", value: 2013
    }, {
        text: "2014年", value: 2014, iconCls: "close-ha-font"
    }, {
        text: "2015年", value: 2015, iconCls: "close-ha-font"
    }],

    months: [[{
        el: {
            text: "一月", value: 1
        }
    }, {
        el: {
            text: "二月", value: 2
        }
    }], [{
        el: {
            text: "三月", value: 3
        }
    }, {
        el: {
            text: "四月", value: 4
        }
    }], [{
        el: {
            text: "五月", value: 5
        }
    }, {
        el: {
            text: "六月", value: 6
        }
    }], [{
        el: {
            text: "七月", value: 7
        }
    }, {
        el: {
            text: "八月", value: 8
        }
    }], [{
        el: {
            text: "九月", value: 9
        }
    }, {
        el: {
            text: "十月", value: 10
        }
    }], [{
        el: {
            text: "十一月", value: 11
        }
    }, {
        el: {
            text: "十二月", value: 12
        }
    }]],

    dynamic: [
        {
            text: "2010年", value: 1
        }, {
            text: "20112222年", value: 2
        }, {
            text: "201233333年", value: 3
        }, {
            text: "2013年", value: 4
        }, {
            text: "2012324年", value: 5
        }, {
            text: "2015年", value: 6
        }, {
            text: "2016年", value: 7
        }, {
            text: "201744444444444444444444444444444444444年", value: 8
        }
    ],

    week: [{
        text: "周一", value: 100, iconClsLeft: "close-ha-font", iconClsRight: "close-font"
    }, {
        text: "周二", value: 101, iconClsLeft: "close-ha-font"
    }, {
        text: "周三", value: 102
    }, {
        text: "周四", value: 103, iconClsRight: "close-ha-font"
    }, {
        text: "周五", value: 104, iconClsLeft: "close-ha-font", iconClsRight: "close-font"
    }, {
        text: "周六", value: 105, iconClsLeft: "close-font", iconClsRight: "close-ha-font"
    }, {
        text: "周日", value: 106, iconClsLeft: "close-font"
    }],
    _createTop: function () {
        var self = this;

        var yearCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "简单下拉框",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.createItems(BI.deepClone(this.years), {
                        type: "bi.single_select_radio_item",
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });

        var multiCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "多选下拉框",
                height: 30
            },
            popup: {
                el: {
                    items: BI.createItems(BI.deepClone(this.years), {
                        type: "bi.multi_select_item",
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    chooseType: 1,
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                tool: {
                    type: "bi.label",
                    text: "这是一个下拉框",
                    height: 35
                },
                tabs: [{
                    type: "bi.multi_select_bar",
                    height: 25,
                    text: "全选",
                    onCheck: function (v) {
                        if (v) {
                            multiCombo.setValue(BI.map(BI.deepClone(self.years), "value"));
                        } else {
                            multiCombo.setValue([]);
                        }

                    },
                    isAllCheckedBySelectedValue: function (selectedValue) {
                        return selectedValue.length == self.years.length;
                        //                        return true;
                    }
                }],
                buttons: [{
                    type: "bi.text_button",
                    text: "清空",
                    handler: function () {
                        multiCombo.setValue([]);
                    }
                }, {
                    type: "bi.text_button",
                    text: "确定",
                    handler: function () {
                        BI.Msg.alert("", multiCombo.getValue());
                    }
                }]
            },
            width: 200
        });

        var dynamicPopupCombo = BI.createWidget({
            type: "bi.combo",
            isNeedAdjustWidth: false,
            offsetStyle: "center",
            el: {
                type: "bi.button",
                text: "动态调整宽度",
                height: 30
            },
            popup: {
                el: {
                    items: BI.createItems(BI.deepClone(this.dynamic), {
                        type: "bi.single_select_item",
                        height: 25
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });

        var dynamicCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "搜索",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.loader",
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    },
                    itemsCreator: function (options, popuplate) {
                        var times = options.times;
                        BI.delay(function () {
                            if (times == 3) {
                                popuplate([{
                                    type: "bi.single_select_item",
                                    text: "这是最后一个",
                                    value: "这是最后一个",
                                    py: "zszhyg",
                                    height: 25
                                }]);
                                return;
                            }

                            var map = BI.map(BI.makeArray(3, null), function (i, v) {
                                var val = i + "_" + BI.random(1, 100);
                                return {
                                    type: "bi.single_select_item",
                                    text: val,
                                    value: val,
                                    height: 25
                                };
                            });
                            popuplate(map);

                        }, 1000);

                    },
                    hasNext: function (options) {
                        return options.times < 3;
                    }
                },
                buttons: [{
                    type: "bi.text_button",
                    text: "清空",
                    handler: function () {
                        dynamicCombo.setValue([]);
                    }
                }, {
                    type: "bi.text_button",
                    text: "确定",
                    handler: function () {
                        BI.Msg.alert("", dynamicCombo.getValue());
                    }
                }]
            },
            width: 200
        });

        return BI.createWidget({
            type: "bi.left",
            items: [yearCombo, multiCombo, dynamicPopupCombo, dynamicCombo],
            hgap: 20,
            vgap: 20
        });
    },

    _createBottom: function () {
        var combo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.text_button",
                cls: "button-combo",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.createItems(BI.deepClone(this.years), {
                        type: "bi.single_select_item",
                        iconWidth: 25,
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    chooseType: 1,
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });
        combo.setValue(BI.deepClone(this.years)[0].value);

        var childCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.text_button",
                cls: "button-combo",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.button_tree",
                    items: BI.createItems(BI.deepClone(this.child), {
                        type: "bi.single_select_item",
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });
        childCombo.setValue(BI.deepClone(this.child)[0].children[0].value);

        var monthCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "多层样式下拉框",
                height: 30
            },
            popup: {
                el: {
                    items: BI.createItems(BI.deepClone(this.months), {
                        type: "bi.single_select_item",
                        cls: "button-combo",
                        handler: function (v) {

                        }
                    }),
                    layouts: [{
                        type: "bi.adaptive",
                        items: [{
                            el: {
                                type: "bi.table",
                                columns: 2,
                                rows: 6,
                                columnSize: [0.5, "fill"],
                                rowSize: 30
                            },
                            left: 4,
                            right: 4,
                            top: 2,
                            bottom: 2
                        }]
                    }, {
                        type: "bi.absolute",
                        el: { left: 4, top: 2, right: 4, bottom: 2 }
                    }]
                }
            },
            width: 200
        });

        var yearCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "自定义控件",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.navigation",
                    direction: "bottom",
                    logic: {
                        dynamic: true
                    },
                    tab: {
                        height: 30,
                        items: [{
                            once: false,
                            text: "后退",
                            value: -1,
                            cls: "mvc-button layout-bg3"
                        }, {
                            once: false,
                            text: "前进",
                            value: 1,
                            cls: "mvc-button layout-bg4"
                        }]
                    },
                    cardCreator: function (v) {
                        return BI.createWidget({
                            type: "bi.text_button",
                            whiteSpace: "normal",
                            text: new Date().getFullYear() + v
                        });
                    }
                }
            },
            width: 200
        });

        return BI.createWidget({
            type: "bi.left",
            items: [combo, childCombo, monthCombo, yearCombo],
            hgap: 20,
            vgap: 20
        });
    },

    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 2,
            items: [{
                column: 0,
                row: 0,
                el: this._createTop()
            }, {
                column: 0,
                row: 1,
                el: this._createBottom()
            }]
        };
    }
});
BI.shortcut("demo.combo", Demo.Func);
