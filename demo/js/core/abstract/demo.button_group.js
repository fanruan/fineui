Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var ref;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.button_group",
                ref: function (_ref) {
                    ref = _ref;
                },
                behaviors: {
                    highlight: function () {
                        return true;
                    }
                },
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                listeners: [{
                    eventName: BI.ButtonGroup.EVENT_CHANGE,
                    action: function (value) {
                        var content = "传递的参数为：" + value + "  getValue方法得到的值为：" + this.getValue();
                        BI.Msg.alert("", content);
                    }
                }],
                layouts: [{
                    type: "bi.vertical",
                    items: [{
                        type: "bi.vtape",
                        height: 300
                    }]
                }],
                items: [{
                    el: {
                        type: "bi.label",
                        text: "button_group是一类具有相同属性或相似属性的抽象, 本案例实现的是布局的嵌套(vertical布局下内嵌center_adapt布局)"
                    },
                    height: 150
                }, {
                    el: {
                        type: "bi.button",
                        value: "button1"
                    },
                    height: 50
                }, {
                    el: {
                        type: "bi.button",
                        value: "button2"
                    },
                    height: 50
                }, {
                    el: {
                        type: "bi.button",
                        value: "button3"
                    }
                }]
            }, {
                type: "bi.button",
                text: "populate",
                handler: function () {
                    ref.populate([{
                        el: {
                            type: "bi.label",
                            text: "1"
                        },
                        height: 50
                    }, {
                        el: {
                            type: "bi.button",
                            value: "2"
                        },
                        height: 50
                    }, {
                        el: {
                            type: "bi.label",
                            text: "3"
                        }
                    }]);
                }
            }]

        };
    }
});
BI.shortcut("demo.button_group", Demo.Func);