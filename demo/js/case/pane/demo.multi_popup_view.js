Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.combo",
                    width: 200,
                    height: 30,
                    el: {
                        type: "bi.text_button",
                        text: "点击",
                        cls: "bi-border",
                        height: 30
                    },
                    popup: {
                        type: "bi.multi_popup_view",
                        el: {
                            type: "bi.button_group",
                            layouts: [{
                                type: "bi.vertical"
                            }],
                            items: BI.createItems(BI.deepClone(Demo.CONSTANTS.ITEMS), {
                                type: "bi.multi_select_item",
                                height: 25
                            })
                        }
                    }
                }
            }]
        }
    }
});
BI.shortcut("demo.multi_popup_view", Demo.Func);