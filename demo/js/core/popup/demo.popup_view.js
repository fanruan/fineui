/**
 * Created by Windy on 2017/12/13.
 */
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
                        type: "bi.popup_view",
                        ref: function (_ref) {
                            self.popupView = _ref;
                        },
                        tabs: [{
                            type: "bi.text_button",
                            value: "tab1",
                            cls: "bi-border",
                            handler: function () {
                                BI.Msg.alert("", "点击tab1");
                            }
                        }, {
                            type: "bi.text_button",
                            value: "tab2",
                            cls: "bi-border",
                            handler: function () {
                                BI.Msg.alert("", "点击tab2");
                            }
                        }],
                        logic: {
                            dynamic: true
                        },
                        tools: true,
                        buttons: [{
                            type: "bi.text_button",
                            value: "getValue",
                            handler: function () {
                                BI.Msg.alert("getValue", JSON.stringify(self.popupView.getValue()));
                            }
                        }],
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
        };
    }
});
BI.shortcut("demo.popup_view", Demo.Func);