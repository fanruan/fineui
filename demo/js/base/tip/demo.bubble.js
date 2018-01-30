Demo.Bubble = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-bubble"
    },
    render: function () {
        var btns = [];
        var items = [
            {
                el: {
                    ref: function (_ref) {
                        btns.push(_ref);
                    },
                    type: "bi.button",
                    text: "bubble测试(消息)",
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble1", "bubble测试", this, {
                            level: "common"
                        });
                    }
                }
            }, {
                el: {
                    ref: function (_ref) {
                        btns.push(_ref);
                    },
                    type: "bi.button",
                    text: "bubble测试(成功)",
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble2", "bubble测试", this, {
                            offsetStyle: "center",
                            level: "success"
                        });
                    }
                }
            }, {
                el: {
                    ref: function (_ref) {
                        btns.push(_ref);
                    },
                    type: "bi.button",
                    text: "bubble测试(错误)",
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble3", "bubble测试", this, {
                            offsetStyle: "right",
                            level: "error"
                        });
                    }
                }
            }, {
                el: {
                    ref: function (_ref) {
                        btns.push(_ref);
                    },
                    type: "bi.button",
                    text: "bubble测试(警告)",
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble4", "bubble测试", this, {
                            level: "warning"
                        });
                    }
                }
            }
        ];
        return {
            type: "bi.left",
            vgap: 200,
            hgap: 20,
            items: items
        };
    }
});
BI.shortcut("demo.bubble", Demo.Bubble);