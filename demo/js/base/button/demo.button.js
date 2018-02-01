Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [{
            el: {
                type: "bi.button",
                text: "一般按钮",
                level: "common",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示成功状态按钮",
                level: "success",
                height: 30
            }
        },
            {
                el: {
                    type: "bi.button",
                    text: "表示警告状态的按钮",
                    level: "warning",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "表示错误状态的按钮",
                    level: "error",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "表示忽略状态的按钮",
                    level: "ignore",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "普通灰化按钮",
                    disabled: true,
                    level: "success",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "忽略状态灰化按钮",
                    disabled: true,
                    level: "ignore",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "带图标的按钮",
                    // level: 'ignore',
                    iconCls: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "一般按钮",
                    block: true,
                    level: "common",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "表示成功状态按钮",
                    block: true,
                    level: "success",
                    height: 30
                }
            },
            {
                el: {
                    type: "bi.button",
                    text: "表示警告状态的按钮",
                    block: true,
                    level: "warning",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "表示忽略状态的按钮",
                    block: true,
                    level: "ignore",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "普通灰化按钮",
                    block: true,
                    disabled: true,
                    level: "success",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "忽略状态灰化按钮",
                    block: true,
                    disabled: true,
                    level: "ignore",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "带图标的按钮",
                    block: true,
                    // level: 'ignore',
                    iconCls: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "一般按钮",
                    clear: true,
                    level: "common",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "表示成功状态按钮",
                    clear: true,
                    level: "success",
                    height: 30
                }
            },
            {
                el: {
                    type: "bi.button",
                    text: "表示警告状态的按钮",
                    clear: true,
                    level: "warning",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "表示忽略状态的按钮",
                    clear: true,
                    level: "ignore",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "普通灰化按钮",
                    clear: true,
                    disabled: true,
                    level: "success",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "忽略状态灰化按钮",
                    clear: true,
                    disabled: true,
                    level: "ignore",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "带图标的按钮",
                    clear: true,
                    // level: 'ignore',
                    iconCls: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.text_button",
                    text: "文字按钮",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "幽灵按钮（common）",
                    ghost: true,
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "幽灵按钮（common）灰化",
                    disabled: true,
                    ghost: true,
                    height: 30
                }
            }
        ];
        // BI.each(items, function (i, item) {
        //     item.el.handler = function () {
        //         BI.Msg.alert("按钮", this.options.text);
        //     };
        // });
        return {
            type: "bi.left",
            vgap: 100,
            hgap: 20,
            items: items
        };
    }
});
BI.shortcut("demo.button", Demo.Button);