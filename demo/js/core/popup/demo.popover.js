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
            }, {
                type: "bi.text_button",
                height: 30,
                text: "弹出一个高度动态的popover层, 此弹出层指定size为small, 但是高度随内容自适应，自适应支持的最大高度为默认为600px",
                handler: function() {
                    var id = "弹出层id1"
                    BI.Popovers.create(id, {
                        // String或者是json都行
                        header: "弹出层标题",
                        logic: {
                            dynamic: true,
                            maxHeight: 700,
                        },
                        size: "small",
                        body: {
                            type: "bi.vertical",
                            items: BI.map(BI.range(0, 50), function(idx, v) {
                                return {
                                    type: "bi.label",
                                    text: "弹出层内容",
                                };
                            }),
                        },
                        footer: {
                            type: "bi.label",
                            text: "这个是footer",
                        },
                    }).open(id);
                },
            }],
        };
    }
});

BI.shortcut("demo.popover", Demo.Func);