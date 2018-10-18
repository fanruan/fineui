/**
 * Created by Windy on 2017/12/13.
 */
Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var id = BI.UUID();
        var body;
        return {
            type: "bi.vertical",
            vgap: 10,
            items: [{
                type: "bi.text_button",
                text: "点击弹出Popover(normal size & fixed)",
                height: 30,
                handler: function () {
                    BI.Popovers.remove(id);
                    BI.Popovers.create(id, {
                        type: "bi.bar_popover",
                        size: "normal",
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
                text: "点击弹出Popover(small size & fixed)",
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
                text: "点击弹出Popover(big size & fixed)",
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
                text: "点击弹出Popover(normal size & adapt body区域高度是300)",
                height: 30,
                handler: function () {
                    BI.Popovers.remove(id);
                    BI.Popovers.create(id, {
                        type: "bi.bar_popover",
                        size: "normal",
                        logic: {
                            dynamic: true
                        },
                        header: {
                            type: "bi.label",
                            text: "这个是header"
                        },
                        body: {
                            type: "bi.vertical",
                            items: [{
                                type: "bi.button_group",
                                ref: function () {
                                    body = this;
                                },
                                items: BI.map(BI.range(0, 10), function () {
                                    return {
                                        type: "bi.label",
                                        text: "1",
                                        height: 30
                                    };
                                }),
                                layouts: [{
                                    type: "bi.vertical"
                                }]
                            }]
                        }
                    }).open(id);
                }
            }, {
                type: "bi.text_button",
                text: "点击弹出Popover(small size & adapt body区域高度是900)",
                height: 30,
                handler: function () {
                    BI.Popovers.remove(id);
                    BI.Popovers.create(id, {
                        type: "bi.bar_popover",
                        size: "small",
                        logic: {
                            dynamic: true
                        },
                        header: {
                            type: "bi.label",
                            text: "这个是header"
                        },
                        body: {
                            type: "bi.vertical",
                            items: [{
                                type: "bi.button_group",
                                ref: function () {
                                    body = this;
                                },
                                items: BI.map(BI.range(0, 30), function () {
                                    return {
                                        type: "bi.label",
                                        text: "1",
                                        height: 30
                                    };
                                }),
                                layouts: [{
                                    type: "bi.vertical"
                                }]
                            }]
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