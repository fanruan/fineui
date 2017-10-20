Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        var combo1 = BI.createWidget({
            type: "bi.bubble_combo",
            trigger: "click,hover",
            el: {
                type: "bi.button",
                text: "测试",
                height: 25
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.makeArray(100, {
                        type: "bi.text_item",
                        height: 25,
                        text: "item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                maxHeight: 200
            }
        })
        var combo2 = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 25
            },
            popup: {
                type: "bi.bubble_bar_popup_view",
                el: {
                    type: "bi.button_group",
                    items: BI.makeArray(100, {
                        type: "bi.text_item",
                        height: 25,
                        text: "item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                maxHeight: 200,
                minWidth: 600
            }
        })
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: combo1,
                left: 100,
                top: 100
            }, {
                el: combo2,
                left: 100,
                bottom: 100
            }]
        })
    }
});
BI.shortcut("demo.bubble_combo", Demo.Func);