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
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_NONE,
                layouts: [{
                    type: "bi.vertical",
                    items: [{
                        type: "bi.vtape",
                        height: 200
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
                        text: "1"
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
                            text: "2"
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