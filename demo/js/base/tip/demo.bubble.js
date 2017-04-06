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
                    type: 'bi.button',
                    text: 'bubble测试',
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble1", "bubble测试", this);
                    }
                }
            }, {
                el: {
                    ref: function (_ref) {
                        btns.push(_ref);
                    },
                    type: 'bi.button',
                    text: 'bubble测试(居中显示)',
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble2", "bubble测试", this, {
                            offsetStyle: "center"
                        });
                    }
                }
            }, {
                el: {
                    ref: function (_ref) {
                        btns.push(_ref);
                    },
                    type: 'bi.button',
                    text: 'bubble测试(右边显示)',
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble3", "bubble测试", this, {
                            offsetStyle: "right"
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
        }
    }
});
BI.shortcut("demo.bubble", Demo.Bubble);