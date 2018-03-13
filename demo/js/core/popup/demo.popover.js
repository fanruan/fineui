/**
 * Created by Windy on 2017/12/13.
 */
Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var id = BI.UUID();
        return {
            type: "bi.vertical",
            vgap: 10,
            items: [{
                type: "bi.text_button",
                text: "点击弹出Popover(normal size)",
                height: 30,
                handler: function () {
                    BI.Popovers.remove(id);
                    BI.Popovers.create(id, {
                        type: "bi.bar_popover",
                        size: "big",
                        header: {
                            type: "bi.label",
                            text: "这个是header"
                        },
                        body: {
                            type: "bi.label",
                            text: "这个是body"
                        }
                    }).open(id);
                }
            }, {
                type: "bi.text_button",
                text: "点击弹出Popover(small size)",
                height: 30,
                handler: function () {
                    BI.Popovers.remove(id);
                    BI.Popovers.create(id, {
                        type: "bi.bar_popover",
                        size: "small",
                        header: {
                            type: "bi.label",
                            text: "这个是header"
                        },
                        body: {
                            type: "bi.label",
                            text: "这个是body"
                        }
                    }).open(id);
                }
            }, {
                type: "bi.text_button",
                text: "点击弹出Popover(big size)",
                height: 30,
                handler: function () {
                    BI.Popovers.remove(id);
                    BI.Popovers.create(id, {
                        type: "bi.bar_popover",
                        size: "big",
                        header: {
                            type: "bi.label",
                            text: "这个是header"
                        },
                        body: {
                            type: "bi.label",
                            text: "这个是body"
                        }
                    }).open(id);
                }
            }, {
                type: "bi.text_button",
                text: "点击弹出Popover(custom)",
                height: 30,
                handler: function () {
                    BI.Popovers.remove(id);
                    BI.Popovers.create(id, {
                        width: 400,
                        height: 300,
                        header: {
                            type: "bi.label",
                            text: "这个是header"
                        },
                        body: {
                            type: "bi.label",
                            text: "这个是body"
                        },
                        footer: {
                            type: "bi.label",
                            text: "这个是footer"
                        }
                    }).open(id);
                }
            }]
        };
    }
});

BI.shortcut("demo.popover", Demo.Func);