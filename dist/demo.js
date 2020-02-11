Demo = {
    version: 1.0
};
BI.$(function () {
    var ref;

    BI.each(Demo.CONFIG, function (index, item) {
        !item.id && (item.id = item.value || item.text);
    });
    var tree = BI.Tree.transformToTreeFormat(Demo.CONFIG);

    var obj = {
        routes: {
            "": "index"
        },
        index: function () {
            Demo.showIndex = "demo.face";
        }
    };

    BI.Tree.traversal(tree, function (index, node) {
        if (!node.children || BI.isEmptyArray(node.children)) {
            obj.routes[node.text] = node.text;
            obj[node.text] = function () {
                Demo.showIndex = node.value;
            };
        }
    });

    var AppRouter = BI.inherit(BI.Router, obj);
    new AppRouter;
    BI.history.start();

    BI.createWidget({
        type: "demo.main",
        ref: function (_ref) {
            console.log(_ref);
            ref = _ref;
        },
        element: "#wrapper"
    });
});Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [{
            el: {
                type: "bi.button",
                text: "一般按钮",
                level: "common",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示成功状态按钮",
                level: "success",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示警告状态的按钮",
                level: "warning",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示错误状态的按钮",
                level: "error",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示忽略状态的按钮",
                level: "ignore",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "普通灰化按钮",
                disabled: true,
                level: "success",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "忽略状态灰化按钮",
                disabled: true,
                level: "ignore",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "带图标的按钮",
                // level: 'ignore',
                iconCls: "close-font",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "一般按钮",
                block: true,
                level: "common",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示成功状态按钮",
                block: true,
                level: "success",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示警告状态的按钮",
                block: true,
                level: "warning",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示忽略状态的按钮",
                block: true,
                level: "ignore",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "普通灰化按钮",
                block: true,
                disabled: true,
                level: "success",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "忽略状态灰化按钮",
                block: true,
                disabled: true,
                level: "ignore",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "带图标的按钮",
                block: true,
                // level: 'ignore',
                iconCls: "close-font",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "一般按钮",
                clear: true,
                level: "common",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示成功状态按钮",
                clear: true,
                level: "success",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示警告状态的按钮",
                clear: true,
                level: "warning",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "表示忽略状态的按钮",
                clear: true,
                level: "ignore",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "普通灰化按钮",
                clear: true,
                disabled: true,
                level: "success",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "忽略状态灰化按钮",
                clear: true,
                disabled: true,
                level: "ignore",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "带图标的按钮",
                clear: true,
                // level: 'ignore',
                iconCls: "close-font",
                height: 30
            }
        }, {
            el: {
                type: "bi.text_button",
                text: "文字按钮",
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "幽灵按钮（common）",
                ghost: true,
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "幽灵按钮（common）灰化",
                disabled: true,
                ghost: true,
                height: 30
            }
        }, {
            el: {
                type: "bi.button",
                text: "弹出bubble",
                bubble: function () {
                    return BI.parseInt(Math.random() * 100) % 10 + "提示"
                },
                handler: function () {
                    BI.Msg.toast("1111");
                },
                height: 30
            }
        }];
        // BI.each(items, function (i, item) {
        //     item.el.handler = function () {
        //         BI.Msg.alert("按钮", this.options.text);
        //     };
        // });
        return {
            type: "bi.left",
            scrolly: true,
            vgap: 100,
            hgap: 20,
            items: items
        };
    }
});
BI.shortcut("demo.button", Demo.Button);Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: "bi.icon_button",
                    cls: "close-ha-font",
                    width: 25,
                    height: 25
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
BI.shortcut("demo.icon_button", Demo.Button);Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: "bi.image_button",
                    src: "http://www.easyicon.net/api/resizeApi.php?id=1206741&size=128",
                    width: 100,
                    height: 100
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
BI.shortcut("demo.image_button", Demo.Button);Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: "bi.text_button",
                    text: "文字按钮",
                    height: 30,
                    keyword: "w"
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
BI.shortcut("demo.text_button", Demo.Button);Demo.Html = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-html"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.html",
                text: "<h1>在bi.html标签中使用html原生标签</h1>"
            }, {
                type: "bi.html",
                text: "<ul>ul列表<li>list item1</li><li>list item2</li></ul>"
            }],
            hgap: 300,
            vgap: 20
        };
    }
});
BI.shortcut("demo.html", Demo.Html);Demo.IconLabel = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-bubble"
    },
    render: function () {
        return {
            type: "bi.default",
            items: [{
                type: "bi.label",
                text: "这是一个icon标签,在加了border之后仍然是居中显示的"
            }, {
                type: "bi.icon_label",
                cls: "date-font bi-border",
                height: 40,
                width: 40
            }]
        };
    }
});
BI.shortcut("demo.icon_label", Demo.IconLabel);Demo.Label = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-label"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                cls: "layout-bg6",
                text: "这是一个label控件，默认居中",
                disabled: true,
                textAlign: "center"
            }, {
                type: "bi.label",
                cls: "layout-bg1",
                text: "这是一个label控件, 高度为30，默认居中",
                textAlign: "center",
                height: 30
            }, {
                type: "bi.label",
                cls: "layout-bg3",
                text: "这是一个label控件，使用水平居左",
                textAlign: "left",
                height: 30
            }, {
                type: "bi.label",
                cls: "layout-bg2",
                text: "这是一个label控件，whiteSpace是normal，不设置高度，为了演示这个是真的是normal的，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                whiteSpace: "normal"
            }, {
                type: "bi.label",
                cls: "layout-bg5",
                text: "这是一个label控件，whiteSpace是默认的nowrap，不设置高度，为了演示这个是真的是nowrap的，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数"
            }, {
                type: "bi.label",
                cls: "layout-bg7",
                text: "这是一个label控件，whiteSpace是默认的nowrap，高度为30，为了演示这个是真的是nowrap的，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                height: 30
            }, {
                type: "bi.label",
                cls: "layout-bg3",
                text: "这是一个label控件，whiteSpace设置为normal，高度为60，为了演示这个是真的是normal的，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                whiteSpace: "normal",
                height: 60
            }, {
                type: "bi.label",
                cls: "layout-bg5",
                text: "这是一个label控件，whiteSpace设置为normal，textHeight控制text的lineHeight，这样可以实现换行效果，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                whiteSpace: "normal",
                textHeight: 30,
                height: 60
            }, {
                type: "bi.label",
                cls: "layout-bg1",
                text: "这是一个label控件，whiteSpace设置为nowrap，textWidth控制text的width",
                textWidth: 200,
                height: 60
            }, {
                type: "bi.label",
                cls: "layout-bg8",
                text: "这是一个label控件，whiteSpace设置为normal，textWidth控制text的width，这样可以实现换行效果，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                whiteSpace: "normal",
                textWidth: 200,
                height: 60
            }, {
                type: "bi.label",
                cls: "layout-bg7",
                text: "whiteSpace为默认的nowrap，高度设置为60，宽度设置为300",
                height: 60,
                width: 300
            }, {
                type: "bi.label",
                cls: "layout-bg6",
                text: "设置了宽度300，高度60，whiteSpace设置为normal",
                whiteSpace: "normal",
                width: 300,
                height: 60
            }, {
                type: "bi.label",
                cls: "layout-bg8",
                text: "textWidth设置为200，textHeight设置为30，width设置300，凑点字数看效果",
                width: 300,
                textWidth: 200,
                textHeight: 30,
                height: 60,
                whiteSpace: "normal"
            }, {
                type: "bi.label",
                cls: "layout-bg1",
                text: "textWidth设置为200，width设置300，看下水平居左的换行效果",
                textAlign: "left",
                width: 300,
                textWidth: 200,
                textHeight: 30,
                height: 60,
                whiteSpace: "normal"
            }, {
                type: "bi.label",
                cls: "layout-bg2",
                text: "使用默认的nowrap，再去设置textHeight，只会有一行的效果",
                textAlign: "left",
                width: 300,
                textWidth: 200,
                textHeight: 30,
                height: 60
            }, {
                type: "bi.left",
                items: [{
                    type: "bi.label",
                    cls: "layout-bg3",
                    text: "在float布局中自适应的,不设高度和宽度，文字多长这个就有多长"
                }],
                height: 30
            }, {
                type: "bi.left",
                items: [{
                    type: "bi.label",
                    cls: "layout-bg4",
                    text: "在float布局中自适应的，设置了宽度200，后面还有",
                    width: 200
                }],
                height: 30
            }, {
                type: "bi.left",
                items: [{
                    type: "bi.label",
                    text: "在float布局中自适应的，设置了高度，文字多长这个就有多长",
                    cls: "layout-bg5",
                    height: 30
                }],
                height: 30
            }],
            hgap: 300,
            vgap: 20
        };
    }
});
BI.shortcut("demo.label", Demo.Label);/**
 * 整理所有label场景
 */
Demo.LabelScene = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-label"
    },
    render: function () {
        var items = [];

        items.push(this.createExpander("1.1.1 文字居中,有宽度和高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg6",
            text: "设置了textWidth,则一定是嵌套结构,因此需要用center_adapt布局容纳一下.为了实现不足一行时文字水平居中,超出一行时左对齐,需要设置maxWidth.",
            whiteSpace: "normal",
            height: 50,
            width: 500,
            textWidth: 200,
            textAlign: "center"
        }));

        items.push(this.createExpander("1.1.2 居中,有宽度和高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg6",
            text: "居中,有宽度高度,有文字宽度,whiteSpace为nowrap,maxWidth会限制文字",
            whiteSpace: "nowrap",
            height: 50,
            width: 500,
            textWidth: 350,
            textAlign: "center"
        }));

        items.push((this.createExpander("1.2.1 居中,有宽度无高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg6",
            text: "居中,有宽度无高度,有文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            width: 500,
            textWidth: 200,
            textAlign: "center"
        })));

        items.push((this.createExpander("1.2.1 居中,有宽度无高度,有文字宽度,whiteSpace为normal,高度被父容器拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg6",
                        text: "此时虽然没有对label设置高度,但由于使用了center_adapt布局,依然会垂直方向居中",
                        whiteSpace: "normal",
                        width: 500,
                        textWidth: 200,
                        textAlign: "center"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.2.2 居中,有宽度无高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg6",
            text: "居中,有宽度无高度,有文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            width: 500,
            textWidth: 350,
            textAlign: "center"
        })));

        items.push((this.createExpander("1.3.1 居中,有宽度和高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,有宽度高度,无文字宽度,whiteSpace为normal,只需用center_adapt布局包一下即可.度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,whiteSpace为normal",
            width: 500,
            whiteSpace: "normal",
            textAlign: "center",
            height: 50
        })));

        items.push((this.createExpander("1.3.2 居中,有宽度无高度,无文字宽度,whiteSpace为normal", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,有宽度无高度,无文字宽度,whiteSpace为normal,只需用center_adapt布局包一下即可.度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,下即可.居中,有宽度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,度,无文字宽度,whiteSpace为normal居中,有宽度,无文字宽度,whiteSpace为normal",
                        width: 500,
                        whiteSpace: "normal",
                        textAlign: "center"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.4 居中,有宽度和高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,有宽度500有高度50,无文字宽度,whiteSpace为nowrap,此处无需两层div,设置text即可,然后设置line-height为传入高度即可实现垂直方向居中",
            width: 500,
            whiteSpace: "nowrap",
            textAlign: "center",
            height: 50
        })));

        items.push((this.createExpander("1.5.1 居中,有宽度无高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,有宽度500无高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            width: 500,
            whiteSpace: "nowrap",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.5.2 居中,有宽度无高度,无文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 50,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,有宽度500无高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        width: 500,
                        whiteSpace: "nowrap",
                        textAlign: "center"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.6.1 居中,无宽度无高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度,有文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            textWidth: 500,
            whiteSpace: "nowrap",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.6.2 居中,无宽度无高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度,有文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            textWidth: 500,
            whiteSpace: "normal",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.6.3 居中,无宽度无,有文字宽度,whiteSpace为normal,被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,无宽度,有文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        textWidth: 500,
                        whiteSpace: "normal",
                        textAlign: "center"
                    },
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.7.1 居中,无宽度无高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度无高度,无文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.7.2 居中,无宽度无高度,无文字宽度,whiteSpace为normal,被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,无宽度无高度,无文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "center"
                    },
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("1.7.3 居中,无宽度有高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度有高度,无文字宽度,whiteSpace为normal,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            height: 50,
            textAlign: "center"
        })));

        items.push((this.createExpander("1.8 居中,无宽度有高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度有高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            height: 50,
            textAlign: "center"
        })));

        items.push((this.createExpander("1.9 居中,无宽度无高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg3",
            text: "居中,无宽度无高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "center"
        })));

        items.push((this.createExpander("1.9.1 居中,无宽度无高度,无文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 50,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "居中,无宽度无高度,无文字宽度,whiteSpace为nowrap,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数,凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "center"
                    },
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("2.1.1 居左,有宽度有高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度有高度,有文字宽度,whiteSpace为normal，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            textWidth: 300,
            height: 50,
            width: 500
        })));

        items.push((this.createExpander("2.1.2 居左,有宽度有高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度有高度,有文字宽度,whiteSpace为normal，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left",
            textWidth: 300,
            height: 50,
            width: 500
        })));

        items.push((this.createExpander("2.2.1 居左,有宽度无高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度无高度,有文字宽度,whiteSpace为normal，不设置高度，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            textWidth: 300,
            width: 500
        })));

        items.push((this.createExpander("2.2.2 居左,有宽度无高度,有文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,有宽度无高度,有文字宽度,whiteSpace为normal，不设置高度，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left",
                        textWidth: 300,
                        width: 500
                    },
                    top: 0,
                    bottom: 0,
                    left: 0
                }
            ]
        })));

        items.push((this.createExpander("2.2.3 居左,有宽度无高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度无高度,有文字宽度,whiteSpace为nowrap，不设置高度，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left",
            textWidth: 300,
            width: 500
        })));

        items.push((this.createExpander("2.2.4 居左,有宽度无高度,有文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,有宽度无高度,有文字宽度,whiteSpace为nowrap，不设置高度，为了演示这个是真的是normal的我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                        textWidth: 300,
                        width: 500
                    },
                    top: 0,
                    bottom: 0,
                    left: 0
                }
            ]
        })));

        items.push((this.createExpander("2.3.1 居左,有宽度有高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度有高度,无文字宽度,whiteSpace为nowrap，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left",
            height: 50,
            vgap: 5,
            width: 500
        })));

        items.push((this.createExpander("2.3.2 居左,有宽度有高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度有高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            height: 50,
            width: 500
        })));

        items.push((this.createExpander("2.4.1 居左,有宽度无高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,有宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            width: 500
        })));

        items.push((this.createExpander("2.4.2 居左,有宽度无高度,无文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg1",
                        text: "居左,有宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left",
                        width: 500
                    },
                    top: 0,
                    left: 0,
                    bottom: 0
                }
            ]
        })));

        items.push((this.createExpander("2.5.1 居左,无宽度无高度,有文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度无高度,有文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            textWidth: 300
        })));

        items.push((this.createExpander("2.5.2 居左,无宽度无高度,有文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,有文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left",
                        textWidth: 300
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.5.3 居左,无宽度无高度,有文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度无高度,有文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left",
            textWidth: 300
        })));

        items.push((this.createExpander("2.5.4 居左,无宽度无高度,有文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,有文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                        textWidth: 300
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.6.1 居左,无宽度有高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度有高度,无文字宽度,whiteSpace为nowrap，注意这个是设置了vgap的,为了实现居中,lineHeight要做计算,才能准确的垂直居中",
            whiteSpace: "nowrap",
            textAlign: "left",
            vgap: 10,
            height: 50
        })));

        items.push((this.createExpander("2.6.2 居左,无宽度有高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度有高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left",
            height: 50
        })));

        items.push((this.createExpander("2.7.1 居左,无宽度无高度,无文字宽度,whiteSpace为normal", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "normal",
            textAlign: "left"
        })));

        items.push((this.createExpander("2.7.2 居左,无宽度无高度,无文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.7.3 居左,无宽度无高度,无文字宽度,whiteSpace为nowrap", {
            type: "bi.label",
            cls: "layout-bg2",
            text: "居左,无宽度无高度,无文字宽度,whiteSpace为nowrap，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
            whiteSpace: "nowrap",
            textAlign: "left"
        })));

        items.push((this.createExpander("2.7.4 居左,无宽度无高度,无文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,无文字宽度,whiteSpace为nowrap，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "left"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.8 居左,无宽度无高度,无文字宽度,whiteSpace为nowrap,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,无文字宽度,whiteSpace为nowrap，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "nowrap",
                        textAlign: "left"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        items.push((this.createExpander("2.8.2 居左,无宽度无高度,无文字宽度,whiteSpace为normal,高度被父级拉满", {
            type: "bi.absolute",
            height: 100,
            items: [
                {
                    el: {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "居左,无宽度无高度,无文字宽度,whiteSpace为normal，我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数,我凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数，凑点字数",
                        whiteSpace: "normal",
                        textAlign: "left"
                    },
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }
            ]
        })));

        return {
            type: "bi.vertical",
            items: items,
            hgap: 300,
            vgap: 20
        };
    },

    createExpander: function (text, popup) {
        return {
            type: "bi.vertical",
            items: [
                {
                    type: "bi.label",
                    cls: "demo-font-weight-bold",
                    textAlign: "left",
                    text: text,
                    height: 30
                }, {
                    el: popup
                }
            ]
        };
    }
});
BI.shortcut("demo.label_scene", Demo.LabelScene);Demo.Message = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-bubble"
    },
    render: function () {
        return {
            type: "bi.center_adapt",
            items: [
                {
                    el: {
                        type: "bi.button",
                        text: "点击我弹出一个消息框",
                        height: 30,
                        handler: function () {
                            BI.Msg.alert("测试消息框", "我是测试消息框的内容");
                        }
                    }
                }
            ]
        };
    }
});
BI.shortcut("demo.message", Demo.Message);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "默认的分页"
            }, {
                type: "bi.pager",
                height: 50,
                pages: 18,
                groups: 5,
                curr: 6,
                first: "首页",
                last: "尾页"
            }, {
                type: "bi.label",
                height: 30,
                text: "显示上一页、下一页、首页、尾页"
            }, {
                type: "bi.pager",
                dynamicShow: false,
                height: 50,
                pages: 18,
                groups: 5,
                curr: 1,
                first: "首页>",
                last: "<尾页"
            }, {
                type: "bi.label",
                height: 30,
                text: "显示上一页、下一页"
            }, {
                type: "bi.pager",
                dynamicShow: false,
                dynamicShowFirstLast: true,
                height: 50,
                pages: 18,
                groups: 5,
                curr: 1,
                first: "首页>",
                last: "<尾页"
            }, {
                type: "bi.label",
                height: 30,
                text: "自定义上一页、下一页"
            }, {
                type: "bi.pager",
                dynamicShow: false,
                height: 50,
                pages: 18,
                groups: 5,
                curr: 6,
                prev: {
                    type: "bi.button",
                    cls: "",
                    text: "上一页",
                    value: "prev",
                    once: false,
                    height: 30,
                    handler: function () {

                    }
                },
                next: {
                    type: "bi.button",
                    cls: "",
                    text: "下一页",
                    value: "next",
                    once: false,
                    handler: function () {

                    }
                }
            }, {
                type: "bi.label",
                height: 30,
                text: "不知道总页数的情况(测试条件 1<=page<=3)"
            }, {
                type: "bi.pager",
                dynamicShow: false,
                height: 50,
                pages: false,
                curr: 1,
                prev: {
                    type: "bi.button",
                    cls: "",
                    text: "上一页",
                    value: "prev",
                    once: false,
                    height: 30,
                    handler: function () {

                    }
                },
                next: {
                    type: "bi.button",
                    cls: "",
                    text: "下一页",
                    value: "next",
                    once: false,
                    handler: function () {

                    }
                },
                hasPrev: function (v) {
                    return v > 1;
                },
                hasNext: function (v) {
                    return v < 3;
                }
            }]
        };
    }
});
BI.shortcut("demo.pager", Demo.Func);Demo.Editor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        var editor1 = BI.createWidget({
            type: "bi.editor",
            cls: "bi-border",
            watermark: "alert信息显示在下面",
            errorText: "字段不可重名!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
            width: 200,
            height: 24
        });
        editor1.on(BI.Editor.EVENT_ENTER, function () {
            editor1.blur();
        });
        var editor2 = BI.createWidget({
            type: "bi.editor",
            cls: "mvc-border",
            watermark: "输入'a'会有错误信息",
            disabled: true,
            errorText: "字段不可重名",
            validationChecker: function (v) {
                if (v == "a") {
                    return false;
                }
                return true;
            },
            allowBlank: true,
            width: 200,
            height: 24
        });
        var editor3 = BI.createWidget({
            type: "bi.editor",
            cls: "mvc-border",
            watermark: "输入'a'会有错误信息且回车键不能退出编辑",
            errorText: "字段不可重名",
            value: "a",
            validationChecker: function (v) {
                if (v == "a") {
                    return false;
                }
                return true;
            },
            quitChecker: function (v) {
                return false;
            },
            allowBlank: true,
            width: 300,
            height: 24
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: editor1,
                left: 0,
                top: 0
            }, {
                el: editor2,
                left: 250,
                top: 30
            }, {
                el: editor3,
                left: 500,
                top: 60
            }, {
                el: {
                    type: "bi.button",
                    text: "disable",
                    handler: function () {
                        editor1.setEnable(false);
                        editor2.setEnable(false);
                        editor3.setEnable(false);
                    },
                    height: 30
                },
                left: 100,
                bottom: 60
            }, {
                el: {
                    type: "bi.button",
                    text: "enable",
                    handler: function () {
                        editor1.setEnable(true);
                        editor2.setEnable(true);
                        editor3.setEnable(true);
                    },
                    height: 30
                },
                left: 200,
                bottom: 60
            }]
        });
    }
});
BI.shortcut("demo.editor", Demo.Editor);Demo.CodeEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.adaptive",
                    cls: "layout-bg1",
                    items: [{
                        type: "bi.multifile_editor",
                        width: 400,
                        height: 300
                    }],
                    width: 400,
                    height: 300
                },
                top: 50,
                left: 50
            }]
        };
    }
});
BI.shortcut("demo.multifile_editor", Demo.CodeEditor);Demo.CodeEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        var editor = BI.createWidget({
            type: "bi.textarea_editor",
            cls: "bi-border",
            width: 600,
            height: 400,
            watermark: "请输入内容"
        });
        editor.on(BI.TextAreaEditor.EVENT_FOCUS, function () {
            BI.Msg.toast("Focus");
        });
        editor.on(BI.TextAreaEditor.EVENT_BLUR, function () {
            BI.Msg.toast("Blur");
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            hgap: 30,
            vgap: 20,
            items: [editor, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(editor.getValue()));
                }
            }, {
                type: "bi.button",
                text: "setValue",
                handler: function () {
                    editor.setValue("测试数据");
                }
            }]
        });
    }
});
BI.shortcut("demo.textarea_editor", Demo.CodeEditor);Demo.Bubble = BI.inherit(BI.Widget, {
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
                    title: "123",
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
BI.shortcut("demo.bubble", Demo.Bubble);Demo.Title = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-title"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                cls: "layout-bg1",
                height: 50,
                title: "title提示",
                text: "移上去有title提示",
                textAlign: "center"
            }, {
                type: "bi.label",
                cls: "layout-bg6",
                height: 50,
                disabled: true,
                warningTitle: "title错误提示",
                text: "移上去有title错误提示",
                textAlign: "center"
            }, {
                type: "bi.label",
                cls: "layout-bg2",
                height: 50,
                disabled: true,
                tipType: "success",
                title: "自定义title提示效果",
                warningTitle: "自定义title提示效果",
                text: "自定义title提示效果",
                textAlign: "center"
            }],
            hgap: 300,
            vgap: 20
        };
    }
});
BI.shortcut("demo.title", Demo.Title);Demo.Toast = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-toast"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: "bi.button",
                    text: "简单Toast测试(success)",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条简单的数据");
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "很长的Toast测试(normal)",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的数据", {
                            level: "normal"
                        });
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "非常长的Toast测试(warning)",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长的数据", {
                            level: "warning",
                            autoClose: false
                        });
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "错误提示Toast测试(error)",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("错误提示Toast测试", {
                            level: "error"
                        });
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "错误提示Toast测试(error), 此toast不会自动消失",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("错误提示Toast测试", {
                            autoClose: false
                        });
                    }
                }
            }
        ];
        BI.createWidget({
            type: "bi.left",
            element: this,
            vgap: 200,
            hgap: 20,
            items: items
        });
    }
});
BI.shortcut("demo.toast", Demo.Toast);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    mounted: function () {
        this.partTree.stroke({
            keyword: "1"
        });
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                type: "bi.label",
                height: 50,
                text: "先初始化一份数据，然后再异步获取数据的树"
            }, {
                type: "bi.part_tree",
                ref: function (_ref) {
                    self.partTree = _ref;
                },
                paras: {
                    selectedValues: {"1": {}, "2": {"1": {}}}
                },
                itemsCreator: function (op, callback) {
                    if (op.type === BI.TreeView.REQ_TYPE_INIT_DATA) {
                        callback({
                            items: [{
                                id: "1",
                                text: 1,
                                isParent: true,
                                open: true
                            }, {
                                id: "11",
                                pId: "1",
                                text: 11,
                                isParent: true,
                                open: true
                            }, {
                                id: "111",
                                pId: "11",
                                text: 111,
                                isParent: true
                            }, {
                                id: "2",
                                text: 2
                            }, {
                                id: "3",
                                text: 3
                            }],
                            hasNext: BI.isNull(op.id)
                        });
                        return;
                    }
                    callback({
                        items: [{
                            id: (op.id || "") + "1",
                            pId: op.id,
                            text: 1,
                            isParent: true
                        }, {
                            id: (op.id || "") + "2",
                            pId: op.id,
                            text: 2
                        }, {
                            id: (op.id || "") + "3",
                            pId: op.id,
                            text: 3
                        }],
                        hasNext: BI.isNull(op.id)
                    });
                }
            }]
        };

    }
});
BI.shortcut("demo.part_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    mounted: function () {
        this.syncTree.stroke({
            keyword: "1"
        });
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                type: "bi.label",
                height: 50,
                text: "可以异步获取数据的树"
            }, {
                type: "bi.async_tree",
                ref: function (_ref) {
                    self.syncTree = _ref;
                },
                paras: {
                    selectedValues: {"1": {}, "2": {"1": {}}}
                },
                itemsCreator: function (op, callback) {
                    callback({
                        items: [{
                            id: (op.id || "") + "1",
                            pId: op.id,
                            text: 1,
                            isParent: true
                        }, {
                            id: (op.id || "") + "2",
                            pId: op.id,
                            text: 2
                        }, {
                            id: (op.id || "") + "3",
                            pId: op.id,
                            text: 3
                        }],
                        hasNext: BI.isNull(op.id)
                    });
                }
            }]
        };

    }
});
BI.shortcut("demo.sync_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createDefaultTree: function () {
        var tree = BI.createWidget({
            type: "bi.tree_view"
        });
        tree.initTree([
            {id: 1, pId: 0, text: "test1", open: true},
            {id: 11, pId: 1, text: "test11"},
            {id: 12, pId: 1, text: "test12"},
            {id: 111, pId: 11, text: "test111"},
            {id: 2, pId: 0, text: "test2", open: true},
            {id: 21, pId: 2, text: "test21"},
            {id: 22, pId: 2, text: "test22"}
        ]);
        return tree;
    },

    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.grid",
            columns: 1,
            rows: 1,
            element: this,
            items: [{
                column: 0,
                row: 0,
                el: {
                    type: "bi.vtape",
                    items: [
                        {
                            el: this._createDefaultTree()
                        },
                        {
                            el: {
                                type: "bi.label",
                                text: "tree.initTree([{\"id\":1, \"pId\":0, \"text\":\"test1\", open:true},{\"id\":11, \"pId\":1, \"text\":\"test11\"},{\"id\":12, \"pId\":1, \"text\":\"test12\"},{\"id\":111, \"pId\":11, \"text\":\"test111\"}])",
                                whiteSpace: "normal"
                            },
                            height: 50
                        }
                    ]
                }
            }]
        });
    }
});
BI.shortcut("demo.tree_view", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this, count = 1;
        var combo1 = BI.createWidget({
            type: "bi.bubble_combo",
            trigger: "click,hover",
            el: {
                type: "bi.button",
                text: "测试",
                height: 24
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.makeArray(100, {
                        type: "bi.text_item",
                        height: 24,
                        text: "item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                maxHeight: 200
            }
        });
        var combo2 = BI.createWidget({
            type: "bi.bubble_combo",
            direction: "right",
            el: {
                type: "bi.button",
                text: "测试",
                height: 24
            },
            popup: {
                type: "bi.text_bubble_bar_popup_view",
                text: "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字",
                ref: function () {
                    self.popup = this;
                }
            },
            listeners: [{
                eventName: BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.popup.populate((count++) % 2 === 1 ? "我的文字变少了" : "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字");
                }
            }]
        });

        var combo3 = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 25
            },
            popup: {
                type: "bi.text_bubble_bar_popup_view",
                text: "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字",
                ref: function () {
                    self.popup = this;
                }
            },
            listeners: [{
                eventName: BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.popup.populate((count++) % 2 === 1 ? "我的文字变少了" : "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字");
                }
            }]
        });

        var combo4 = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 25
            },
            popup: {
                type: "bi.text_bubble_bar_popup_view",
                text: "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字",
                ref: function () {
                    self.popup = this;
                }
            },
            listeners: [{
                eventName: BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.popup.populate((count++) % 2 === 1 ? "我的文字变少了" : "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字");
                }
            }]
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: combo1,
                left: 150,
                top: 10
            }, {
                el: combo2,
                left: 10,
                bottom: 200
            }, {
                el: combo3,
                right: 10,
                bottom: 10
            }, {
                el: combo4,
                right: 10,
                top: 10
            }]
        });
    }
});
BI.shortcut("demo.bubble_combo", Demo.Func);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.editor_icon_check_combo",
                ref: function () {
                    self.combo = this;
                },
                watermark: "默认值",
                width: 200,
                height: 24,
                value: 2,
                items: [{
                    // text: "MVC-1",
                    value: "1"
                }, {
                    // text: "MVC-2",
                    value: "2"
                }, {
                    // text: "MVC-3",
                    value: "3"
                }]
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                text: "setValue为空",
                handler: function () {
                    self.combo.setValue()
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.editor_icon_check_combo", Demo.TextValueCombo);/**
 * Created by Dailer on 2017/7/12.
 */
Demo.IconCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {

        var self = this;


        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.icon_combo",
                container: "body",
                ref: function (_ref) {
                    self.refs = _ref;
                },
                value: "第二项",
                items: [{
                    value: "第一项",
                    iconCls: "close-font"
                }, {
                    value: "第二项",
                    iconCls: "search-font"
                }, {
                    value: "第三项",
                    iconCls: "copy-font"
                }]
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.icon_combo", Demo.IconCombo);/**
 * Created by Windy on 2017/12/13.
 */
Demo.IconTextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.icon_text_value_combo",
                text: "默认值",
                // defaultIconCls: "next-page-h-font",
                width: 300,
                items: [{
                    text: "MVC-1",
                    iconCls: "close-font",
                    value: 1
                }, {
                    text: "MVC-2",
                    iconCls: "date-font",
                    value: 2
                }, {
                    text: "MVC-3",
                    iconCls: "search-close-h-font",
                    value: 3
                }]
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.icon_text_value_combo", Demo.IconTextValueCombo);/**
 * Created by Windy on 2018/2/4.
 */
Demo.SearchTextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var combo, searchCombo;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.search_text_value_combo",
                ref: function () {
                    combo = this;
                },
                warningTitle: "111",
                text: "默认值",
                value: 14,
                width: 300,
                items: [{
                    text: "ABC-1",
                    iconCls: "date-font",
                    value: 1
                }, {
                    text: "BCD-2",
                    iconCls: "search-font",
                    value: 2
                }, {
                    text: "CDE-3",
                    iconCls: "pull-right-font",
                    value: 3
                }, {
                    text: "DEF-3",
                    iconCls: "pull-right-font",
                    value: 4
                }, {
                    text: "FEG-3",
                    iconCls: "pull-right-font",
                    value: 5
                }, {
                    text: "FGH-3",
                    iconCls: "pull-right-font",
                    value: 6
                }, {
                    text: "GHI-3",
                    iconCls: "pull-right-font",
                    value: 7
                }, {
                    text: "HIJ-3",
                    iconCls: "pull-right-font",
                    value: 8
                }, {
                    text: "IJK-3",
                    iconCls: "pull-right-font",
                    value: 9
                }, {
                    text: "JKL-3",
                    iconCls: "pull-right-font",
                    value: 10
                }]
            }, {
                type: "bi.all_value_multi_text_value_combo",
                items: Demo.CONSTANTS.ITEMS,
                text: "提示文本",
                width: 200,
                value: {
                    type: 1,
                    value: ["1", "2", "柳州市城贸金属材料有限责任公司", "3"]
                },
                ref: function () {
                    searchCombo = this;
                },
                listeners: [{
                    eventName: "BI.AllValueMultiTextValueCombo.EVENT_CONFIRM",
                    action: function () {
                        BI.Msg.toast(JSON.stringify(searchCombo.getValue()));
                    }
                }]
            }, {
                type: "bi.button",
                text: "setValue(3)",
                width: 90,
                height: 25,
                handler: function () {
                    combo.setValue(11);
                }
            }, {
                type: "bi.button",
                text: "getValue()",
                width: 90,
                height: 25,
                handler: function () {
                    BI.Msg.toast(JSON.stringify(searchCombo.getValue()));
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.search_text_value_combo", Demo.SearchTextValueCombo);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var combo, wrapper;
        return {
            type: "bi.button_group",
            items: [{
                type: "bi.text_value_combo",
                ref: function () {
                    combo = this;
                },
                text: "默认值",
                value: 22,
                width: 300,
                items: [{
                    text: "MVC-1",
                    iconCls: "date-font",
                    value: 1
                }, {
                    text: "MVC-2",
                    iconCls: "search-font",
                    value: 2
                }, {
                    text: "MVC-3",
                    iconCls: "pull-right-font",
                    value: 3
                }]
            }, {
                type: "bi.search_multi_text_value_combo",
                items: Demo.CONSTANTS.ITEMS,
                width: 200,
                value: {
                    type: 1,
                    value: ["1", "2", "3"]
                }
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                handler: function () {
                    wrapper.populate();
                }
            }, {
                type: 'bi.label',
                height: 1000
            }],
            ref: function () {
                wrapper = this;
            },
            layouts: [{
                type: "bi.vertical",
                vgap: 20
            }]
        };
    }
});

BI.shortcut("demo.text_value_combo", Demo.TextValueCombo);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueDownListCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.text_value_down_list_combo",
                width: 300,
                ref: function (_ref) {
                    self.refs = _ref;
                },
                text: "默认值",
                value: 11,
                items: [[{
                    text: "属于",
                    value: 1,
                    cls: "dot-e-font"
                }, {
                    text: "不属于",
                    value: 2,
                    cls: "dot-e-font"
                }], [{
                    el: {
                        text: "大于",
                        value: 3,
                        iconCls1: "dot-e-font"
                    },
                    value: 3,
                    children: [{
                        text: "固定值",
                        value: 4,
                        cls: "dot-e-font"
                    }, {
                        text: "平均值",
                        value: 5,
                        cls: "dot-e-font"
                    }]
                }]]
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                text: "setValue",
                handler: function () {
                    self.refs.setValue(2);
                }
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                text: "getValue",
                handler: function () {
                    BI.Msg.alert("", JSON.stringify(self.refs.getValue()));
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.text_value_down_list_combo", Demo.TextValueDownListCombo);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueCheckCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.text_value_check_combo",
                ref: function () {
                    self.combo = this;
                },
                text: "默认值",
                //value: 1,
                width: 300,
                items: [{
                    text: "MVC-1",
                    value: 1
                }, {
                    text: "MVC-2",
                    value: 2
                }, {
                    text: "MVC-3",
                    value: 3
                }]
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                handler: function () {
                    BI.Msg.alert("", JSON.stringify(self.combo.getValue()));
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.text_value_check_combo", Demo.TextValueCheckCombo);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        var date = new Date();
        return {
            type: "bi.calendar",
            ref: function () {
                self.calendar = this;
            },
            logic: {
                dynamic: false
            },
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        };
    },

    mounted: function () {
        var date = new Date();
        this.calendar.setValue({
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        });
    }
});
BI.shortcut("demo.calendar", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        return {
            type: "bi.vertical",
            items: BI.createItems([{
                text: "bi-list-item",
                cls: "bi-list-item close-font"
            }, {
                text: "bi-list-item-simple",
                cls: "bi-list-item-simple close-font"
            }, {
                text: "bi-list-item-effect",
                cls: "bi-list-item-effect close-font"
            }, {
                text: "bi-list-item-active",
                cls: "bi-list-item-active close-font"
            }, {
                text: "bi-list-item-active2",
                cls: "bi-list-item-active2 close-font"
            }, {
                text: "bi-list-item-select",
                cls: "bi-list-item-select close-font"
            }, {
                text: "bi-list-item-select2",
                cls: "bi-list-item-select2 close-font"
            }], {
                type: "bi.icon_text_item",
                logic: {
                    dynamic: true
                }
            }),
            vgap: 10
        };
    }
});
BI.shortcut("demo.click_item_effect", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.color_chooser_popup",
                    cls: "bi-card"
                },
                left: 100,
                top: 250
            }, {
                el: {
                    type: "bi.simple_color_chooser_popup",
                    cls: "bi-card"
                },
                left: 400,
                top: 250
            }]
        };
    }
});
BI.shortcut("demo.color_chooser_popup", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.color_chooser",
                    width: 24,
                    height: 24
                },
                left: 100,
                top: 250
            }, {
                el: {
                    type: "bi.simple_color_chooser",
                    width: 30,
                    height: 24
                },
                left: 400,
                top: 250
            }, {
                el: {
                    type: "bi.color_chooser",
                    width: 230,
                    height: 24
                },
                left: 100,
                top: 350
            }]
        };
    }
});
BI.shortcut("demo.color_chooser", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 20,
            hgap: 30,
            items: [{
                type: "bi.segment",
                items: [{
                    text: "1",
                    value: 1
                }, {
                    text: "2",
                    value: 2
                }, {
                    text: "3",
                    value: 3
                }]
            }]
        });
    }
});
BI.shortcut("demo.segment", Demo.Func);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.ClearEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.clear_editor",
                cls: "bi-border",
                width: 300,
                watermark: "这个是带清除按钮的",
                value: 123
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.clear_editor", Demo.ClearEditor);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.ClearEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var editor = BI.createWidget({
            type: "bi.shelter_editor",
            cls: "bi-border",
            validationChecker: function (v) {
                return v != "a";
            },
            watermark: "可以设置标记的输入框",
            value: "这是一个遮罩",
            keyword: "z"
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            hgap: 30,
            vgap: 20,
            bgap: 50,
            items: [editor]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.button",
                    text: "focus",
                    height: 25,
                    handler: function () {
                        editor.focus();
                    }
                },
                right: 10,
                left: 10,
                bottom: 10
            }]
        });
    }
});

BI.shortcut("demo.shelter_editor", Demo.ClearEditor);/**
 * Created by Dailer on 2017/7/14.
 */
Demo.SignEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var editor = BI.createWidget({
            type: "bi.sign_editor",
            cls: "bi-border bi-focus-shadow",
            validationChecker: function (v) {
                return v != "abc";
            },
            watermark: "可以设置标记的输入框",
            text: "这是一个标记，点击它即可进行输入"
        });
        editor.setValue(2);
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            hgap: 30,
            vgap: 20,
            items: [editor]
        });
    }
});

BI.shortcut("demo.sign_editor", Demo.SignEditor);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.SimpleStateEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.simple_state_editor",
                ref: function () {
                    self.editor = this;
                },
                cls: "bi-border",
                width: 300
            }],
            vgap: 20

        };
    },

    mounted: function () {
        var self = this;
        setTimeout(function () {
            self.editor.setState(["*", "*"]);
        }, 1000);
    }
});

BI.shortcut("demo.simple_state_editor", Demo.SimpleStateEditor);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.StateEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.state_editor",
                ref: function () {
                    self.editor = this;
                },
                cls: "bi-border",
                width: 300
            }],
            vgap: 20

        };
    },


    mounted: function () {
        var self = this;
        setTimeout(function () {
            self.editor.setState(["*", "*"]);
        }, 1000);
    }
});

BI.shortcut("demo.state_editor", Demo.StateEditor);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {

        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "复选item"
            }, {
                type: "bi.multi_select_item",
                text: "复选项"
            }],
            hgap: 300
        };
    }
});
BI.shortcut("demo.multi_select_item", Demo.Func);/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Items = BI.inherit(BI.Widget, {

    render: function () {

        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "单选item"
            }, {
                type: "bi.single_select_item",
                text: "单选项"
            }],
            hgap: 300
        };
    }
});


BI.shortcut("demo.single_select_item", Demo.Items);/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Items = BI.inherit(BI.Widget, {

    render: function () {

        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "单选item"
            }, {
                type: "bi.single_select_radio_item",
                text: "单选项"
            }],
            hgap: 300
        };
    }
});


BI.shortcut("demo.single_select_radio_item", Demo.Items);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.lazy_loader",
            element: this,
            el: {
                layouts: [{
                    type: "bi.left",
                    hgap: 5
                }]
            },
            items: BI.createItems(BI.deepClone(Demo.CONSTANTS.ITEMS), {
                type: "bi.button"
            })
        });
    }
});
BI.shortcut("demo.lazy_loader", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.select_list",
            toolbar: {
                type: "bi.multi_select_bar",
                iconWrapperWidth: 26
            },
            element: this,
            el: {
                el: {
                    chooseType: BI.Selection.Multi
                }
            },
            items: BI.createItems(BI.deepClone(Demo.CONSTANTS.SIMPLE_ITEMS), {
                type: "bi.multi_select_item"
            })
        });
    }
});
BI.shortcut("demo.select_list", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        BI.createWidget({
            type: "bi.vertical",
            hgap: 200,
            vgap: 50,
            element: this,
            items: [{
                type: "bi.label",
                height: 30,
                text: " (测试条件：总页数为3)"
            }, {
                type: "bi.all_count_pager",
                pages: 3,
                curr: 1,
                count: 1000
            }]
        });
    }
});
BI.shortcut("demo.all_count_pager", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    mounted: function () {
        this.pager.populate();
    },

    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.vertical",
            hgap: 200,
            vgap: 50,
            element: this,
            items: [{
                type: "bi.direction_pager",
                ref: function (_ref) {
                    self.pager = _ref;
                },
                horizontal: {
                    pages: false, // 总页数
                    curr: 1, // 初始化当前页， pages为数字时可用

                    hasPrev: function (v) {
                        return v > 1;
                    },
                    hasNext: function () {
                        return true;
                    },
                    firstPage: 1
                },
                vertical: {
                    pages: false, // 总页数
                    curr: 1, // 初始化当前页， pages为数字时可用

                    hasPrev: function (v) {
                        return v > 1;
                    },
                    hasNext: function () {
                        return true;
                    },
                    firstPage: 1
                }
            }]
        });
    }
});
BI.shortcut("demo.direction_pager", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.list_pane",
            ref: function () {
                self.pane = this;
            },
            itemsCreator: function (op, callback) {
                setTimeout(function () {
                    callback(BI.createItems(BI.deepClone(Demo.CONSTANTS.ITEMS), {
                        type: "bi.multi_select_item",
                        height: 25
                    }));
                }, 2000);
            },
            el: {
                type: "bi.button_group",
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        };
    },

    mounted: function () {
        this.pane.populate();
    }
});
BI.shortcut("demo.list_pane", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
        };
    }
});
BI.shortcut("demo.multi_popup_view", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.panel",
            title: "title",
            titleButtons: [{
                type: "bi.button",
                text: "操作"
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
        };
    }
});
BI.shortcut("demo.panel", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
                        type: "bi.popup_panel",
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
BI.shortcut("demo.popup_panel", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var tree = BI.createWidget({
            type: "bi.display_tree",
            element: this
        });

        tree.initTree([{
            id: 1,
            text: "第一项",
            open: true
        }, {
            id: 2,
            text: "第二项"
        }, {
            id: 11,
            pId: 1,
            text: "子项1(共2个)",
            open: true
        }, {
            id: 111,
            pId: 11,
            text: "子子项1"
        }, {
            id: 112,
            pId: 11,
            text: "子子项2"
        }, {
            id: 12,
            pId: 1,
            text: "子项2"
        }, {
            id: 13,
            pId: 1,
            text: "子项3"
        }]);
    }
});
BI.shortcut("demo.display_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var tree = BI.createWidget({
            type: "bi.level_tree",
            chooseType: 0,
            items: [{
                id: 1,
                text: "第一项",
                value: 1,
                isParent: true
            }, {
                id: 2,
                text: "第二项",
                value: 2,
                isParent: true
            }, {
                id: 3,
                text: "第三项",
                value: 1,
                isParent: true,
                open: true
            }, {
                id: 4,
                text: "第四项",
                value: 1
            }, {
                id: 11,
                pId: 1,
                text: "子项1",
                value: 11
            }, {
                id: 12,
                pId: 1,
                text: "子项2",
                value: 12
            }, {
                id: 13,
                pId: 1,
                text: "子项3",
                value: 13
            }, {
                id: 21,
                pId: 2,
                text: "子项1",
                value: 21
            }, {
                id: 31,
                pId: 3,
                text: "子项1",
                value: 31
            }, {
                id: 32,
                pId: 3,
                text: "子项2",
                value: 32
            }, {
                id: 33,
                pId: 3,
                text: "子项3",
                value: 33
            }]
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: tree
            }, {
                height: 30,
                el: {
                    type: "bi.button",
                    height: 30,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", tree.getValue());
                    }
                }
            }]
        });
    }
});
BI.shortcut("demo.level_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        // value值一定要是字符串
        var tree = BI.createWidget({
            type: "bi.simple_tree",
            items: [{
                id: 1,
                text: "第一项",
                value: "1"
            }, {
                id: 2,
                text: "第二项",
                value: "2"
            }, {
                id: 3,
                text: "第三项",
                value: "3",
                open: true
            }, {
                id: 11,
                pId: 1,
                text: "子项1",
                value: "11"
            }, {
                id: 12,
                pId: 1,
                text: "子项2",
                value: "12"
            }, {
                id: 13,
                pId: 1,
                text: "子项3",
                value: "13"
            }, {
                id: 31,
                pId: 3,
                text: "子项1",
                value: "31"
            }, {
                id: 32,
                pId: 3,
                text: "子项2",
                value: "32"
            }, {
                id: 33,
                pId: 3,
                text: "子项3",
                value: "33"
            }],
            value: ["31", "32", "33"]
        });

        // tree.populate([{
        //     id: 1,
        //     text: "第一项",
        //     value: "1"
        // }, {
        //     id: 2,
        //     text: "第二项",
        //     value: "2"
        // }, {
        //     id: 3,
        //     text: "第三项",
        //     value: "3",
        //     open: true
        // }, {
        //     id: 11,
        //     pId: 1,
        //     text: "子项1",
        //     value: "11"
        // }, {
        //     id: 12,
        //     pId: 1,
        //     text: "子项2",
        //     value: "12"
        // }, {
        //     id: 13,
        //     pId: 1,
        //     text: "子项3",
        //     value: "13"
        // }, {
        //     id: 31,
        //     pId: 3,
        //     text: "子项1",
        //     value: "31"
        // }, {
        //     id: 32,
        //     pId: 3,
        //     text: "子项2",
        //     value: "32"
        // }, {
        //     id: 33,
        //     pId: 3,
        //     text: "子项3",
        //     value: "33"
        // }], "z");
        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: tree
            }, {
                height: 30,
                el: {
                    type: "bi.button",
                    height: 30,
                    text: "setValue(['31', '32', '33'])",
                    handler: function () {
                        tree.setValue(["31", "32", "33"]);
                    }
                }
            }, {
                height: 30,
                el: {
                    type: "bi.button",
                    height: 30,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", JSON.stringify(tree.getValue()));
                    }
                }
            }]
        });
    }
});
BI.shortcut("demo.simple_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.label",
                text: "输入框加图标的trigger"
            }, {
                type: "bi.editor_trigger",
                watermark: "这是水印",
                width: 200,
                height: 24
            }],
            hgap: 20,
            vgap: 20
        });
    }
});
BI.shortcut("demo.editor_trigger", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.label",
                text: "只有一个图标的trigger"
            }, {
                type: "bi.icon_trigger",
                width: 30,
                height: 24
            }],
            hgap: 20,
            vgap: 20
        });
    }
});
BI.shortcut("demo.icon_trigger", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.label",
                text: "可被选择的trigger"
            }, {
                type: "bi.select_text_trigger",
                text: "这是一个简单的trigger",
                width: 200,
                height: 24
            }],
            hgap: 20,
            vgap: 20
        });
    }
});
BI.shortcut("demo.select_text_trigger", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.label",
                text: "文本加图标的trigger"
            }, {
                type: "bi.text_trigger",
                text: "这是一个简单的trigger",
                width: 200,
                height: 24
            }],
            hgap: 20,
            vgap: 20
        });
    }
});
BI.shortcut("demo.text_trigger", Demo.Func);Demo.Center = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-center"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.tab",
            ref: function () {
                self.tab = this;
            },
            single: true,
            showIndex: Demo.showIndex,
            cardCreator: function (v) {
                return BI.createWidget({
                    type: v
                });
            }
        };
    },

    setValue: function (v) {
        this.tab.setSelect(v);
    }
});
BI.shortcut("demo.center", Demo.Center);Demo.TreeValueChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tree-value-chooser-combo"
    },
    render: function () {

        var widget = BI.createWidget({
            type: "bi.tree_value_chooser_combo",
            width: 300,
            // items: BI.deepClone(Demo.CONSTANTS.TREEITEMS),
            itemsCreator: function (op, callback) {
                callback(BI.deepClone(Demo.CONSTANTS.TREEITEMS));
            }
        });
        return {
            type: "bi.vertical",
            hgap: 200,
            vgap: 10,
            items: [widget]
        };
    }
});
BI.shortcut("demo.tree_value_chooser_combo", Demo.TreeValueChooser);
Demo.TreeValueChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tree-value-chooser"
    },
    render: function () {

        return {
            type: "bi.tree_value_chooser_pane",
            items: BI.deepClone(Demo.CONSTANTS.TREEITEMS)
            // itemsCreator: function (op, callback) {
            //     callback(tree);
            // }
        };
    }
});
BI.shortcut("demo.tree_value_chooser_pane", Demo.TreeValueChooser);
Demo.ValueChooserCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-value-chooser-combo"
    },
    render: function () {
        var widget = BI.createWidget({
            type: "bi.value_chooser_combo",
            itemsCreator: function (op, callback) {
                callback(BI.deepClone(Demo.CONSTANTS.ITEMS));
            }
        });
        return {
            type: "bi.vertical",
            hgap: 200,
            vgap: 10,
            items: [widget]
        };
    }
});
BI.shortcut("demo.value_chooser_combo", Demo.ValueChooserCombo);Demo.ValueChooserPane = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-value-chooser-pane"
    },
    render: function () {
        return {
            type: "bi.value_chooser_pane",
            items: BI.deepClone(Demo.CONSTANTS.ITEMS)
            // itemsCreator: function (op, callback) {
            //     callback(BI.deepClone(Demo.CONSTANTS.ITEMS));
            // }
        };
    }
});
BI.shortcut("demo.value_chooser_pane", Demo.ValueChooserPane);Demo.BASE_CONFIG = [{
    id: 2,
    text: "基础控件",
    open: false
}, {
    pId: 2,
    text: "bi.label",
    value: "demo.label"
},{
    pId: 2,
    text: "bi.label_scene",
    value: "demo.label_scene"
}, {
    pId: 2,
    text: "bi.icon_label",
    value: "demo.icon_label"
}, {
    pId: 2,
    text: "bi.html",
    value: "demo.html"
}, {
    pId: 2,
    text: "title提示",
    value: "demo.title"
}, {
    pId: 2,
    text: "气泡提示",
    value: "demo.bubble"
}, {
    pId: 2,
    text: "toast提示",
    value: "demo.toast"
}, {
    pId: 2,
    id: 201,
    text: "button"
}, {
    pId: 201,
    text: "bi.button",
    value: "demo.button"
}, {
    pId: 201,
    text: "bi.text_button",
    value: "demo.text_button"
}, {
    pId: 201,
    text: "bi.icon_button",
    value: "demo.icon_button"
}, {
    pId: 201,
    text: "bi.image_button",
    value: "demo.image_button"
}, {
    pId: 2,
    id: 202,
    text: "editor"
}, {
    pId: 202,
    text: "bi.editor",
    value: "demo.editor"
}, {
    pId: 202,
    text: "bi.multifile_editor",
    value: "demo.multifile_editor"
}, {
    pId: 202,
    text: "bi.textarea_editor",
    value: "demo.textarea_editor"
}, {
    pId: 2,
    id: 203,
    text: "tree"
}, {
    pId: 203,
    text: "bi.tree_view",
    value: "demo.tree_view"
}, {
    pId: 203,
    text: "bi.async_tree",
    value: "demo.sync_tree"
}, {
    pId: 203,
    text: "bi.part_tree",
    value: "demo.part_tree"
}, {
    pId: 2,
    text: "bi.pager",
    value: "demo.pager"
}];Demo.CASE_CONFIG = [{
    id: 3,
    text: "实例控件",
    open: false
}, {
    pId: 3,
    id: 300,
    text: "按钮"
}, {
    pId: 300,
    text: "bi.multi_select_item",
    value: "demo.multi_select_item"
}, {
    pId: 300,
    text: "bi.single_select_item",
    value: "demo.single_select_item"
}, {
    pId: 300,
    text: "bi.single_select_radio_item",
    value: "demo.single_select_radio_item"
}, {
    pId: 3,
    id: 301,
    text: "editors"
}, {
    pId: 301,
    text: "bi.shelter_editor",
    value: "demo.shelter_editor"
}, {
    pId: 301,
    text: "bi.sign_editor",
    value: "demo.sign_editor"
}, {
    pId: 301,
    text: "bi.state_editor",
    value: "demo.state_editor"
}, {
    pId: 301,
    text: "bi.simple_state_editor",
    value: "demo.simple_state_editor"
}, {
    pId: 301,
    text: "bi.clear_editor",
    value: "demo.clear_editor"
}, {
    pId: 3,
    id: 302,
    text: "列表"
}, {
    pId: 302,
    text: "bi.select_list",
    value: "demo.select_list"
}, {
    pId: 302,
    text: "bi.lazy_loader",
    value: "demo.lazy_loader"
}, {
    pId: 3,
    id: 303,
    text: "面板"
}, {
    pId: 303,
    text: "bi.list_pane",
    value: "demo.list_pane"
}, {
    pId: 303,
    text: "bi.panel",
    value: "demo.panel"
}, {
    pId: 3,
    id: 304,
    text: "popup弹出层"
}, {
    pId: 304,
    text: "bi.multi_popup_view",
    value: "demo.multi_popup_view"
}, {
    pId: 304,
    text: "bi.popup_panel",
    value: "demo.popup_panel"
}, {
    pId: 3,
    id: 305,
    text: "触发器trigger"
}, {
    pId: 305,
    text: "bi.editor_trigger",
    value: "demo.editor_trigger"
}, {
    pId: 305,
    text: "bi.icon_trigger",
    value: "demo.icon_trigger"
}, {
    pId: 305,
    text: "bi.text_trigger",
    value: "demo.text_trigger"
}, {
    pId: 305,
    text: "bi.select_text_trigger",
    value: "demo.select_text_trigger"
}, {
    pId: 3,
    id: 306,
    text: "combo"
}, {
    pId: 306,
    text: "bi.bubble_combo",
    value: "demo.bubble_combo"
}, {
    pId: 306,
    text: "bi.icon_combo",
    value: "demo.icon_combo"
}, {
    pId: 306,
    text: "bi.text_value_combo",
    value: "demo.text_value_combo"
}, {
    pId: 306,
    text: "bi.search_text_value_combo",
    value: "demo.search_text_value_combo"
}, {
    pId: 306,
    text: "bi.icon_text_value_combo",
    value: "demo.icon_text_value_combo"
}, {
    pId: 306,
    text: "bi.text_value_check_combo",
    value: "demo.text_value_check_combo"
}, {
    pId: 306,
    text: "bi.editor_icon_check_combo",
    value: "demo.editor_icon_check_combo"
}, {
    pId: 306,
    text: "bi.text_value_down_list_combo",
    value: "demo.text_value_down_list_combo"
}, {
    pId: 3,
    id: 307,
    text: "tree"
}, {
    pId: 307,
    text: "bi.display_tree",
    value: "demo.display_tree"
}, {
    pId: 307,
    text: "bi.simple_tree",
    value: "demo.simple_tree"
}, {
    pId: 307,
    text: "bi.level_tree",
    value: "demo.level_tree"
}, {
    pId: 3,
    id: 309,
    text: "pager"
}, {
    pId: 309,
    text: "bi.all_count_pager",
    value: "demo.all_count_pager"
}, {
    pId: 309,
    text: "bi.direction_pager",
    value: "demo.direction_pager"
}, {
    pId: 3,
    text: "bi.calendar",
    value: "demo.calendar"
}, {
    pId: 3,
    text: "bi.color_chooser",
    value: "demo.color_chooser"
}, {
    pId: 3,
    text: "bi.color_chooser_popup",
    value: "demo.color_chooser_popup"
}, {
    pId: 3,
    text: "bi.segment",
    value: "demo.segment"
}, {
    pId: 3,
    text: "点击项样式查看",
    value: "demo.click_item_effect"
}];Demo.CATEGORY_CONFIG = [{
    id: 100000,
    text: "专题"
}, {
    pId: 100000,
    text: "可以排序的树",
    value: "demo.sort_tree"
}];/**
 * Created by User on 2017/3/22.
 */
Demo.COMPONENT_CONFIG = [{
    id: 5,
    text: "部件+服务"
}, {
    pId: 5,
    text: "bi.value_chooser_combo",
    value: "demo.value_chooser_combo"
}, {
    pId: 5,
    text: "bi.value_chooser_pane",
    value: "demo.value_chooser_pane"
}, {
    pId: 5,
    text: "bi.tree_value_chooser_combo",
    value: "demo.tree_value_chooser_combo"
}, {
    pId: 5,
    text: "bi.tree_value_chooser_pane",
    value: "demo.tree_value_chooser_pane"
}];Demo.CORE_CONFIG = [{
    id: 1,
    text: "核心控件"
}, {
    id: 101,
    pId: 1,
    text: "布局"
}, {
    pId: 101,
    text: "bi.absolute",
    value: "demo.absolute"
}, {
    pId: 101,
    text: "bi.center_adapt",
    value: "demo.center_adapt"
}, {
    pId: 101,
    text: "bi.vertical_adapt",
    value: "demo.vertical_adapt"
}, {
    pId: 101,
    text: "bi.horizontal_adapt",
    value: "demo.horizontal_adapt"
}, {
    pId: 101,
    text: "bi.horizontal_auto",
    value: "demo.horizontal_auto"
}, {
    pId: 101,
    text: "bi.horizontal_float",
    value: "demo.horizontal_float"
}, {
    pId: 101,
    text: "bi.left_right_vertical_adapt",
    value: "demo.left_right_vertical_adapt"
}, {
    pId: 101,
    text: "bi.center",
    value: "demo.center_layout"
}, {
    pId: 101,
    text: "bi.float_center",
    value: "demo.float_center"
}, {
    pId: 101,
    text: "bi.vertical",
    value: "demo.vertical"
}, {
    pId: 101,
    text: "bi.horizontal",
    value: "demo.horizontal"
}, {
    pId: 101,
    text: "bi.border",
    value: "demo.border"
}, {
    pId: 101,
    text: "bi.left, bi.right",
    value: "demo.flow"
}, {
    pId: 101,
    text: "bi.htape",
    value: "demo.htape"
}, {
    pId: 101,
    text: "bi.vtape",
    value: "demo.vtape"
}, {
    pId: 101,
    text: "bi.grid",
    value: "demo.grid"
}, {
    pId: 101,
    text: "bi.table",
    value: "demo.table_layout"
}, {
    pId: 101,
    text: "bi.td",
    value: "demo.td"
}, {
    pId: 101,
    text: "..."
}, {
    pId: 1,
    id: 102,
    text: "抽象控件"
}, {
    pId: 102,
    text: "bi.button_group",
    value: "demo.button_group"
}, {
    pId: 102,
    text: "bi.button_tree",
    value: "demo.button_tree"
}, {
    pId: 102,
    text: "bi.virtual_group",
    value: "demo.virtual_group"
}, {
    pId: 102,
    text: "bi.custom_tree",
    value: "demo.custom_tree"
}, {
    pId: 102,
    text: "bi.grid_view",
    value: "demo.grid_view"
}, {
    pId: 102,
    text: "bi.collection_view",
    value: "demo.collection_view"
}, {
    pId: 102,
    text: "bi.list_view",
    value: "demo.list_view"
}, {
    pId: 102,
    text: "bi.virtual_list",
    value: "demo.virtual_list"
}, {
    pId: 102,
    id: 10201,
    text: "组合控件"
}, {
    pId: 10201,
    text: "bi.combo",
    value: "demo.combo"
}, {
    pId: 10201,
    text: "bi.combo(各种位置)",
    value: "demo.combo2"
}, {
    pId: 10201,
    text: "bi.combo(內部位置)",
    value: "demo.combo3"
}, {
    pId: 10201,
    text: "bi.expander",
    value: "demo.expander"
}, {
    pId: 10201,
    text: "bi.combo_group",
    value: "demo.combo_group"
}, {
    pId: 10201,
    text: "bi.loader",
    value: "demo.loader"
}, {
    pId: 10201,
    text: "bi.navigation",
    value: "demo.navigation"
}, {
    pId: 10201,
    text: "bi.searcher",
    value: "demo.searcher"
}, {
    pId: 10201,
    text: "bi.switcher",
    value: "demo.switcher"
}, {
    pId: 10201,
    text: "bi.tab",
    value: "demo.tab"
}, {
    pId: 102,
    id: 10202,
    text: "弹出层"
}, {
    pId: 10202,
    text: "layer",
    value: "demo.layer"
}, {
    pId: 10202,
    text: "bi.popover",
    value: "demo.popover"
}, {
    pId: 10202,
    text: "bi.popup_view",
    value: "demo.popup_view"
}, {
    pId: 10202,
    text: "bi.searcher_view",
    value: "demo.searcher_view"
}, {
    pId: 1,
    text: "Widget(继承)",
    value: "demo.widget"
}, {
    pId: 1,
    text: "Single(继承)",
    value: "demo.single"
}, {
    pId: 1,
    text: "BasicButton(继承)",
    value: "demo.basic_button"
}, {
    pId: 1,
    text: "NodeButton(继承)",
    value: "demo.node_button"
}, {
    pId: 1,
    text: "Pane(继承)",
    value: "demo.pane"
}];/**
 * author: young
 * createdDate: 2018/11/30
 * description:
 */
!(function () {
    var Pane = BI.inherit(BI.LoadingPane, {
        props: {

        },

        render: function () {
            return {
                type: "bi.center_adapt",
                items: [{
                    type: "bi.label",
                    text: "this is pane center"
                }]
            };
        },

        beforeInit: function (callback) {
            setTimeout(function () {
                callback();
            }, 3000);
        }
    });
    BI.shortcut("demo.pane", Pane);
})();Demo.FIX_CONFIG = [{
    id: 7,
    text: "数据流框架fix-2.0"
}, {
    id: 71,
    pId: 7,
    text: "定义响应式数据",
    value: "demo.fix_define"
}, {
    id: 72,
    pId: 7,
    text: "state属性",
    value: "demo.fix_state"
}, {
    id: 73,
    pId: 7,
    text: "计算属性",
    value: "demo.fix_computed"
}, {
    id: 74,
    pId: 7,
    text: "store",
    value: "demo.fix_store"
}, {
    id: 75,
    pId: 7,
    text: "watcher且或表达式",
    value: "demo.fix_watcher"
}, {
    id: 76,
    pId: 7,
    text: "watcher星号表达式",
    value: "demo.fix_global_watcher"
}, {
    id: 77,
    pId: 7,
    text: "context",
    value: "demo.fix_context"
}, {
    id: 78,
    pId: 7,
    text: "一个混合的例子",
    value: "demo.fix"
}, {
    id: 79,
    pId: 7,
    text: "场景",
    value: "demo.fix_scene"
}];Demo.WIDGET_CONFIG = [{
    id: 4,
    text: "详细控件",
    open: true
}, {
    pId: 4,
    id: 401,
    text: "各种小控件"
}, {
    pId: 401,
    text: "各种通用按钮",
    value: "demo.buttons"
}, {
    pId: 401,
    text: "各种提示性信息",
    value: "demo.tips"
}, {
    pId: 401,
    text: "各种items",
    value: "demo.items"
}, {
    pId: 401,
    text: "各种节点node",
    value: "demo.nodes"
}, {
    pId: 401,
    text: "各种segment",
    value: "demo.segments"
}, {
    pId: 4,
    id: 402,
    text: "文本框控件"
}, {
    pId: 402,
    text: "bi.text_editor",
    value: "demo.text_editor"
}, {
    pId: 402,
    text: "bi.search_editor",
    value: "demo.search_editor"
}, {
    pId: 402,
    text: "bi.number_editor",
    value: "demo.number_editor"
}, {
    pId: 4,
    id: 403,
    text: "tree"
}, {
    pId: 403,
    text: "bi.single_level_tree",
    value: "demo.single_level_tree"
}, {
    pId: 403,
    text: "bi.select_level_tree",
    value: "demo.select_level_tree"
}, {
    pId: 403,
    text: "bi.multilayer_single_level_tree",
    value: "demo.multilayer_single_level_tree"
}, {
    pId: 403,
    text: "bi.multilayer_select_level_tree",
    value: "demo.multilayer_select_level_tree"
}, {
    pId: 4,
    id: 405,
    text: "下拉列表"
}, {
    pId: 405,
    text: "bi.down_list_combo",
    value: "demo.down_list"
}, {
    pId: 4,
    id: 421,
    text: "单选下拉框"
}, {
    pId: 421,
    text: "bi.single_select_combo",
    value: "demo.single_select_combo"
}, {
    pId: 4,
    id: 406,
    text: "复选下拉框"
}, {
    pId: 406,
    text: "bi.multi_select_combo",
    value: "demo.multi_select_combo"
}, {
    pId: 406,
    text: "bi.multi_select_list",
    value: "demo.multi_select_list"
}, {
    pId: 4,
    id: 407,
    text: "简单下拉树"
}, {
    pId: 407,
    text: "bi.single_tree_combo",
    value: "demo.single_tree_combo"
}, {
    pId: 4,
    id: 408,
    text: "多层级下拉树"
}, {
    pId: 408,
    text: "bi.multilayer_single_tree_combo",
    value: "demo.multilayer_single_tree_combo"
}, {
    pId: 4,
    id: 409,
    text: "可选下拉树"
}, {
    pId: 409,
    text: "bi.select_tree_combo",
    value: "demo.select_tree_combo"
}, {
    pId: 4,
    id: 410,
    text: "多层级可选下拉树"
}, {
    pId: 410,
    text: "bi.multilayer_select_tree_combo",
    value: "demo.multilayer_select_tree_combo"
}, {
    pId: 4,
    id: 411,
    text: "复选下拉树"
}, {
    pId: 411,
    text: "bi.multi_tree_combo",
    value: "demo.multi_tree_combo"
}, {
    pId: 411,
    text: "bi.multi_select_tree",
    value: "demo.multi_select_tree"
}, {
    pId: 4,
    id: 412,
    text: "日期相关控件"
}, {
    pId: 412,
    text: "bi.year_combo",
    value: "demo.year"
}, {
    pId: 412,
    text: "bi.year_month_combo",
    value: "demo.year_month_combo"
}, {
    pId: 412,
    text: "bi.year_quarter_combo",
    value: "demo.year_quarter_combo"
}, {
    pId: 412,
    text: "bi.date_pane",
    value: "demo.date_pane"
}, {
    pId: 412,
    text: "bi.multidate_combo",
    value: "demo.multidate_combo"
}, {
    pId: 412,
    text: "bi.date_time",
    value: "demo.date_time"
}, {
    pId: 412,
    text: "bi.time_combo",
    value: "demo.time_combo"
}, {
    pId: 412,
    text: "bi.time_interval",
    value: "demo.time_interval"
}, {
    pId: 412,
    text: "bi.year_month_interval",
    value: "demo.year_month_interval"
}, {
    pId: 4,
    id: 413,
    text: "数值区间控件"
}, {
    pId: 413,
    text: "bi.number_interval",
    value: "demo.number_interval"
}, {
    id: 420,
    text: "滚动sliders",
    value: "demo.slider"
}];Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    child: [{
        type: "bi.combo_group",
        el: {
            type: "bi.icon_text_icon_item",
            text: "2010年",
            value: 2010,
            height: 25,
            iconCls: "close-ha-font"
        },
        children: [{
            type: "bi.single_select_item",
            height: 25,
            text: "一月",
            value: 11
        }, {
            type: "bi.icon_text_icon_item",
            height: 25,
            text: "二月",
            value: 12,
            children: [{type: "bi.single_select_item", text: "一号", value: 101, height: 25}]
        }]
    }, {
        text: "2011年", value: 2011
    }, {
        text: "2012年", value: 2012, iconCls: "close-ha-font"
    }, {
        text: "2013年", value: 2013
    }, {
        text: "2014年", value: 2014, iconCls: "close-ha-font"
    }, {
        text: "2015年", value: 2015, iconCls: "close-ha-font"
    }],

    _createBottom: function () {
        var childCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.text_button",
                cls: "button-combo",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.button_tree",
                    items: BI.createItems(BI.deepClone(this.child), {
                        type: "bi.single_select_item",
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });
        childCombo.setValue(BI.deepClone(this.child)[0].children[0].value);

        return BI.createWidget({
            type: "bi.left",
            items: [childCombo],
            hgap: 20,
            vgap: 20
        });
    },

    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 1,
            items: [{
                column: 0,
                row: 0,
                el: this._createBottom()
            }]
        };
    }
});
BI.shortcut("demo.combo_group", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    years: [{
        text: "2010年", value: 2010, iconCls: "close-ha-font"
    }, {
        text: "2011年", value: 2011
    }, {
        text: "2012年", value: 2012, iconCls: "close-ha-font"
    }, {
        text: "2013年", value: 2013
    }, {
        text: "2014年", value: 2014, iconCls: "close-ha-font"
    }, {
        text: "2015年", value: 2015, iconCls: "close-ha-font"
    }, {
        text: "2016年", value: 2016, iconCls: "close-ha-font"
    }, {
        text: "2017年", value: 2017, iconCls: "close-ha-font"
    }],
    child: [{
        type: "bi.combo_group",
        el: {
            type: "bi.icon_text_icon_item",
            text: "2010年",
            value: 2010,
            height: 25,
            iconCls: "close-ha-font"
        },
        children: [{
            type: "bi.single_select_item",
            height: 25,
            text: "一月",
            value: 11
        }, {
            type: "bi.icon_text_icon_item",
            height: 25,
            text: "二月",
            value: 12,
            children: [{type: "bi.single_select_item", text: "一号", value: 101, height: 25}]
        }]
    }, {
        text: "2011年", value: 2011
    }, {
        text: "2012年", value: 2012, iconCls: "close-ha-font"
    }, {
        text: "2013年", value: 2013
    }, {
        text: "2014年", value: 2014, iconCls: "close-ha-font"
    }, {
        text: "2015年", value: 2015, iconCls: "close-ha-font"
    }],

    months: [[{
        el: {
            text: "一月", value: 1
        }
    }, {
        el: {
            text: "二月", value: 2
        }
    }], [{
        el: {
            text: "三月", value: 3
        }
    }, {
        el: {
            text: "四月", value: 4
        }
    }], [{
        el: {
            text: "五月", value: 5
        }
    }, {
        el: {
            text: "六月", value: 6
        }
    }], [{
        el: {
            text: "七月", value: 7
        }
    }, {
        el: {
            text: "八月", value: 8
        }
    }], [{
        el: {
            text: "九月", value: 9
        }
    }, {
        el: {
            text: "十月", value: 10
        }
    }], [{
        el: {
            text: "十一月", value: 11
        }
    }, {
        el: {
            text: "十二月", value: 12
        }
    }]],

    dynamic: [
        {
            text: "2010年", value: 1
        }, {
            text: "20112222年", value: 2
        }, {
            text: "201233333年", value: 3
        }, {
            text: "2013年", value: 4
        }, {
            text: "2012324年", value: 5
        }, {
            text: "2015年", value: 6
        }, {
            text: "2016年", value: 7
        }, {
            text: "201744444444444444444444444444444444444年", value: 8
        }
    ],

    week: [{
        text: "周一", value: 100, iconClsLeft: "close-ha-font", iconClsRight: "close-font"
    }, {
        text: "周二", value: 101, iconClsLeft: "close-ha-font"
    }, {
        text: "周三", value: 102
    }, {
        text: "周四", value: 103, iconClsRight: "close-ha-font"
    }, {
        text: "周五", value: 104, iconClsLeft: "close-ha-font", iconClsRight: "close-font"
    }, {
        text: "周六", value: 105, iconClsLeft: "close-font", iconClsRight: "close-ha-font"
    }, {
        text: "周日", value: 106, iconClsLeft: "close-font"
    }],
    _createTop: function () {
        var self = this;

        var yearCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "简单下拉框",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.createItems(BI.deepClone(this.years), {
                        type: "bi.single_select_radio_item",
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });

        var multiCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "多选下拉框",
                height: 30
            },
            popup: {
                el: {
                    items: BI.createItems(BI.deepClone(this.years), {
                        type: "bi.multi_select_item",
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    chooseType: 1,
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                tool: {
                    type: "bi.label",
                    text: "这是一个下拉框",
                    height: 35
                },
                tabs: [{
                    type: "bi.multi_select_bar",
                    height: 25,
                    text: "全选",
                    onCheck: function (v) {
                        if (v) {
                            multiCombo.setValue(BI.map(BI.deepClone(self.years), "value"));
                        } else {
                            multiCombo.setValue([]);
                        }

                    },
                    isAllCheckedBySelectedValue: function (selectedValue) {
                        return selectedValue.length == self.years.length;
                        //                        return true;
                    }
                }],
                buttons: [{
                    type: "bi.text_button",
                    text: "清空",
                    handler: function () {
                        multiCombo.setValue([]);
                    }
                }, {
                    type: "bi.text_button",
                    text: "确定",
                    handler: function () {
                        BI.Msg.alert("", multiCombo.getValue());
                    }
                }]
            },
            width: 200
        });

        var dynamicPopupCombo = BI.createWidget({
            type: "bi.combo",
            isNeedAdjustWidth: false,
            offsetStyle: "center",
            el: {
                type: "bi.button",
                text: "动态调整宽度",
                height: 30
            },
            popup: {
                el: {
                    items: BI.createItems(BI.deepClone(this.dynamic), {
                        type: "bi.single_select_item",
                        height: 25
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });

        var dynamicCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "搜索",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.loader",
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    },
                    itemsCreator: function (options, popuplate) {
                        var times = options.times;
                        BI.delay(function () {
                            if (times == 3) {
                                popuplate([{
                                    type: "bi.single_select_item",
                                    text: "这是最后一个",
                                    value: "这是最后一个",
                                    py: "zszhyg",
                                    height: 25
                                }]);
                                return;
                            }

                            var map = BI.map(BI.makeArray(3, null), function (i, v) {
                                var val = i + "_" + BI.random(1, 100);
                                return {
                                    type: "bi.single_select_item",
                                    text: val,
                                    value: val,
                                    height: 25
                                };
                            });
                            popuplate(map);

                        }, 1000);

                    },
                    hasNext: function (options) {
                        return options.times < 3;
                    }
                },
                buttons: [{
                    type: "bi.text_button",
                    text: "清空",
                    handler: function () {
                        dynamicCombo.setValue([]);
                    }
                }, {
                    type: "bi.text_button",
                    text: "确定",
                    handler: function () {
                        BI.Msg.alert("", dynamicCombo.getValue());
                    }
                }]
            },
            width: 200
        });

        return BI.createWidget({
            type: "bi.left",
            items: [yearCombo, multiCombo, dynamicPopupCombo, dynamicCombo],
            hgap: 20,
            vgap: 20
        });
    },

    _createBottom: function () {
        var combo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.text_button",
                cls: "button-combo",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.createItems(BI.deepClone(this.years), {
                        type: "bi.single_select_item",
                        iconWidth: 25,
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    chooseType: 1,
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });
        combo.setValue(BI.deepClone(this.years)[0].value);

        var childCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.text_button",
                cls: "button-combo",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.button_tree",
                    items: BI.createItems(BI.deepClone(this.child), {
                        type: "bi.single_select_item",
                        height: 25,
                        handler: function (v) {

                        }
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            },
            width: 200
        });
        childCombo.setValue(BI.deepClone(this.child)[0].children[0].value);

        var monthCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "多层样式下拉框",
                height: 30
            },
            popup: {
                el: {
                    items: BI.createItems(BI.deepClone(this.months), {
                        type: "bi.single_select_item",
                        cls: "button-combo",
                        handler: function (v) {

                        }
                    }),
                    layouts: [{
                        type: "bi.adaptive",
                        items: [{
                            el: {
                                type: "bi.table",
                                columns: 2,
                                rows: 6,
                                columnSize: [0.5, "fill"],
                                rowSize: 30
                            },
                            left: 4,
                            right: 4,
                            top: 2,
                            bottom: 2
                        }]
                    }, {
                        type: "bi.absolute",
                        el: {left: 4, top: 2, right: 4, bottom: 2}
                    }]
                }
            },
            width: 200
        });

        var yearCombo = BI.createWidget({
            type: "bi.combo",
            el: {
                type: "bi.button",
                text: "自定义控件",
                height: 30
            },
            popup: {
                el: {
                    type: "bi.navigation",
                    direction: "bottom",
                    logic: {
                        dynamic: true
                    },
                    tab: {
                        height: 30,
                        items: [{
                            once: false,
                            text: "后退",
                            value: -1,
                            cls: "mvc-button layout-bg3"
                        }, {
                            once: false,
                            text: "前进",
                            value: 1,
                            cls: "mvc-button layout-bg4"
                        }]
                    },
                    cardCreator: function (v) {
                        return BI.createWidget({
                            type: "bi.text_button",
                            whiteSpace: "normal",
                            text: new Date().getFullYear() + v
                        });
                    }
                }
            },
            width: 200
        });

        return BI.createWidget({
            type: "bi.left",
            items: [combo, childCombo, monthCombo, yearCombo],
            hgap: 20,
            vgap: 20
        });
    },

    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 2,
            items: [{
                column: 0,
                row: 0,
                el: this._createTop()
            }, {
                column: 0,
                row: 1,
                el: this._createBottom()
            }]
        };
    }
});
BI.shortcut("demo.combo", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createEl: function () {
        return {
            type: "bi.button",
            height: 25,
            text: "点击"
        };
    },

    oneCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustLength: 5,
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    height: 500
                },
                maxHeight: 400
            }
        });
    },

    twoCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "bottom,left",
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                }
            }
        });
    },

    threeCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustYOffset: 5,
            el: this._createEl(),
            isNeedAdjustHeight: false,
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                }
            }
        });
    },

    fourCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "left",
            el: this._createEl(),
            isNeedAdjustHeight: true,
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                }
            }
        });
    },

    fiveCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "left,top",
            el: this._createEl(),
            isNeedAdjustHeight: true,
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                },
                maxHeight: 2000
            }
        });
    },

    sixCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "top,left",
            el: this._createEl(),
            isNeedAdjustHeight: true,
            popup: {
                el: {
                    type: "bi.layout",
                    height: 1200
                }
            }
        });
    },

    sevenCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "bottom",
            isNeedAdjustWidth: false,
            // isNeedAdjustHeight: false,
            offsetStyle: "center",
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 200,
                    height: 1200
                }
            }
        });
    },

    eightCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            adjustXOffset: 25,
            adjustYOffset: 5,
            direction: "right",
            isNeedAdjustWidth: false,
            // isNeedAdjustHeight: false,
            offsetStyle: "middle",
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 200,
                    height: 200
                }
            }
        });
    },

    render: function () {
        return {
            type: "bi.grid",
            hgap: 10,
            vgap: 5,
            items: [[this.oneCombo(), this.twoCombo(), this.threeCombo()],
                [this.fourCombo(), this.fiveCombo(), this.sixCombo()],
                [this.sevenCombo(), this.eightCombo()]]
        };
    }
});
BI.shortcut("demo.combo2", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createEl: function () {
        return {
            type: "bi.label",
            cls:"bi-border",
            height: "100%",
            text: "点击"
        };
    },

    oneCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            direction: "right,innerRight",
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 200,
                    height: 200
                }
            }
        });
    },

    twoCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            direction: "right,innerRight",
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 1000,
                    height: 200
                }
            }
        });
    },

    threeCombo: function () {
        return BI.createWidget({
            type: "bi.combo",
            direction: "right,innerRight",
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            el: this._createEl(),
            popup: {
                el: {
                    type: "bi.layout",
                    width: 400,
                    height: 200
                }
            }
        });
    },

    render: function () {
        return {
            type: "bi.grid",
            hgap: 10,
            vgap: 5,
            items: [[this.oneCombo()], [this.twoCombo()], [this.threeCombo()]]
        };
    }
});
BI.shortcut("demo.combo3", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.vertical",
            hgap: 30,
            vgap: 20,
            items: [{
                type: "bi.expander",
                el: {
                    type: "bi.icon_text_node",
                    cls: "pull-right-ha-font mvc-border",
                    height: 25,
                    text: "Expander"
                },
                popup: {
                    cls: "mvc-border",
                    items: BI.createItems([{
                        text: "项目1",
                        value: 1
                    }, {
                        text: "项目2",
                        value: 2
                    }, {
                        text: "项目3",
                        value: 3
                    }, {
                        text: "项目4",
                        value: 4
                    }], {
                        type: "bi.single_select_item",
                        height: 25
                    })
                }
            }]
        };
    }
});
BI.shortcut("demo.expander", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var self = this;
        this.all = 0;
        var items = BI.deepClone(Demo.CONSTANTS.ITEMS);
        return {
            type: "bi.loader",
            itemsCreator: function (options, populate) {
                setTimeout(function () {
                    populate(BI.map(items.slice((options.times - 1) * 10, options.times * 10), function (i, v) {
                        return BI.extend(v, {
                            type: "bi.single_select_item",
                            height: 25
                        });
                    }));
                }, 1000);
            },
            hasNext: function (options) {
                return options.times * 10 < items.length;
            }
        };
    }
});
BI.shortcut("demo.loader", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    _createNav: function (v) {
        return BI.createWidget({
            type: "bi.label",
            cls: "layout-bg" + BI.random(1, 8),
            text: "第" + v + "页"
        });
    },

    render: function () {
        return {
            type: "bi.navigation",
            showIndex: 0,
            tab: {
                height: 30,
                items: [{
                    once: false,
                    text: "后退",
                    value: -1,
                    cls: "mvc-button layout-bg3"
                }, {
                    once: false,
                    text: "前进",
                    value: 1,
                    cls: "mvc-button layout-bg4"
                }]
            },
            cardCreator: BI.bind(this._createNav, this)
        };
    }
});
BI.shortcut("demo.navigation", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            height: 25,
            handler: function (v) {

            }
        });
    },

    render: function () {
        var self = this;
        var items = [{
            text: "2010年", value: 2010, py: "2010n", title: "1111111111111111111111111111111111"
        }, {
            text: "2011年", value: 2011, py: "2011n", title: "1111111111111111111111111111111111"
        }, {
            text: "2012年", value: 2012, py: "2012n", title: "1111111111111111111111111111111111"
        }, {
            text: "2013年", value: 2013, py: "2013n", title: "1111111111111111111111111111111111"
        }, {
            text: "2014年", value: 2014, py: "2014n", title: "1111111111111111111111111111111111"
        }, {
            text: "2015年", value: 2015, py: "2015n", title: "1111111111111111111111111111111111"
        }, {
            text: "2016年", value: 2016, py: "2016n", title: "1111111111111111111111111111111111"
        }, {
            text: "2017年", value: 2017, py: "2017n", title: "1111111111111111111111111111111111"
        }];

        var adapter = BI.createWidget({
            type: "bi.button_group",
            cls: "layout-bg1",
            items: this._createItems(items),
            chooseType: 1,
            behaviors: {},
            layouts: [{
                type: "bi.vertical"
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: adapter,
                top: 50,
                left: 50,
                width: 200,
                height: 100
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    width: 200,
                    height: 30,
                    items: [{
                        el: {
                            type: "bi.searcher",
                            adapter: adapter,
                            width: 200,
                            height: 30
                        },
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }]
                },
                top: 100,
                left: 300
            }]
        });
    }
});
BI.shortcut("demo.searcher", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {

        var adapter = BI.createWidget({
            type: "bi.label",
            cls: "layout-bg2",
            text: "将在该处弹出switcher"
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: adapter,
                top: 50,
                left: 20,
                width: 200,
                height: 300
            }]
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            hgap: 30,
            vgap: 20,
            items: [{
                type: "bi.switcher",
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "Switcher"
                },
                popup: {
                    cls: "mvc-border layout-bg5",
                    items: BI.createItems([{
                        text: "项目1",
                        value: 1
                    }, {
                        text: "项目2",
                        value: 2
                    }, {
                        text: "项目3",
                        value: 3
                    }, {
                        text: "项目4",
                        value: 4
                    }], {
                        type: "bi.single_select_item",
                        height: 25
                    })
                },
                adapter: adapter
            }]
        });
    }
});
BI.shortcut("demo.switcher", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createTabs: function (v) {
        switch (v) {
            case 1:
                return BI.createWidget({
                    type: "bi.label",
                    cls: "layout-bg1",
                    text: "面板1"
                });
            case 2:
                return BI.createWidget({
                    type: "bi.label",
                    cls: "layout-bg2",
                    text: "面板2"
                });
        }
    },

    render: function () {
        this.tab = BI.createWidget({
            type: "bi.button_group",
            height: 30,
            items: [{
                text: "Tab1",
                value: 1,
                width: 50,
                cls: "mvc-button layout-bg3"
            }, {
                text: "Tab2",
                value: 2,
                width: 50,
                cls: "mvc-button layout-bg4"
            }],
            layouts: [{
                type: "bi.center_adapt",
                items: [{
                    el: {
                        type: "bi.horizontal",
                        width: 100
                    }
                }]
            }]
        });

        var tab = BI.createWidget({
            direction: "custom",
            type: "bi.tab",
            element: this,
            tab: this.tab,
            cardCreator: BI.bind(this._createTabs, this)
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.tab,
                left: 200,
                top: 200
            }]
        });

        tab.setSelect(2);
    }
});
BI.shortcut("demo.tab", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
BI.shortcut("demo.button_group", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.button_tree",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
            layouts: [{
                type: "bi.vertical"
            }, {
                type: "bi.center_adapt"
            }],
            items: [{
                type: "bi.label",
                text: "0",
                value: 0
            }, {
                type: "bi.button",
                text: "1",
                value: 1
            }]
        };
    }
});
BI.shortcut("demo.button_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var items = [];
        var cellCount = 100;
        for (var i = 0; i < cellCount; i++) {
            items[i] = {
                type: "bi.label",
                text: i
            };
        }
        var grid = BI.createWidget({
            type: "bi.collection_view",
            width: 400,
            height: 300,
            items: items,
            cellSizeAndPositionGetter: function (index) {
                return {
                    x: index % 10 * 50,
                    y: Math.floor(index / 10) * 50,
                    width: 50,
                    height: 50
                };
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: grid,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        });
    }
});
BI.shortcut("demo.collection_view", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createDefaultTree: function () {
        var TREEITEMS = [{id: -1, pId: -2, value: "根目录", open: true, type: "bi.plus_group_node", height: 25},
            {id: 1, pId: -1, value: "第一级目录1", type: "bi.plus_group_node", height: 25},
            {id: 11, pId: 1, value: "第二级文件1", type: "bi.single_select_item", height: 25},
            {id: 12, pId: 1, value: "第二级目录2", type: "bi.plus_group_node", height: 25},
            {id: 121, pId: 12, value: "第三级目录1", type: "bi.plus_group_node", height: 25},
            {id: 122, pId: 12, value: "第三级文件1", type: "bi.single_select_item", height: 25},
            {id: 1211, pId: 121, value: "第四级目录1", type: "bi.plus_group_node", height: 25},
            {id: 12111, pId: 1211, value: "第五级文件1", type: "bi.single_select_item", height: 25},
            {id: 2, pId: -1, value: "第一级目录2", type: "bi.plus_group_node", height: 25},
            {id: 21, pId: 2, value: "第二级目录3", type: "bi.plus_group_node", height: 25},
            {id: 22, pId: 2, value: "第二级文件2", type: "bi.single_select_item", height: 25},
            {id: 211, pId: 21, value: "第三级目录2", type: "bi.plus_group_node", height: 25},
            {id: 212, pId: 21, value: "第三级文件2", type: "bi.single_select_item", height: 25},
            {id: 2111, pId: 211, value: "第四级文件1", type: "bi.single_select_item", height: 25}];
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            el: {
                type: "bi.button_tree",
                chooseType: 0,
                layouts: [{
                    type: "bi.vertical",
                    hgap: 30
                }]
            },
            items: BI.deepClone(TREEITEMS)
        });
        return this.tree;
    },

    _createAsyncTree: function () {
        this.asyncTree = BI.createWidget({
            type: "bi.custom_tree",
            itemsCreator: function (op, callback) {
                if (!op.node) {// 根节点
                    callback([{
                        id: 1,
                        pId: 0,
                        type: "bi.plus_group_node",
                        text: "test1",
                        value: 1,
                        height: 25,
                        isParent: true
                    }, {
                        id: 2,
                        pId: 0,
                        type: "bi.plus_group_node",
                        text: "test2",
                        value: 1,
                        isParent: true,
                        open: true,
                        height: 25
                    }]);
                } else {
                    if (op.node.id == 1) {
                        callback([
                            {
                                id: 11,
                                pId: 1,
                                type: "bi.plus_group_node",
                                text: "test11",
                                value: 11,
                                height: 25,
                                isParent: true
                            },
                            {
                                id: 12,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test12",
                                value: 12,
                                height: 35
                            },
                            {
                                id: 13,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test13",
                                value: 13,
                                height: 35
                            },
                            {
                                id: 14,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test14",
                                value: 14,
                                height: 35
                            },
                            {
                                id: 15,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test15",
                                value: 15,
                                height: 35
                            },
                            {
                                id: 16,
                                pId: 1,
                                type: "bi.single_select_item",
                                text: "test16",
                                value: 16,
                                height: 35
                            },
                            {id: 17, pId: 1, type: "bi.single_select_item", text: "test17", value: 17, height: 35}
                        ]);
                    } else if (op.node.id == 2) {
                        callback([{
                            id: 21,
                            pId: 2,
                            type: "bi.single_select_item",
                            text: "test21",
                            value: 21,
                            height: 35
                        },
                        {
                            id: 22,
                            pId: 2,
                            type: "bi.single_select_item",
                            text: "test22",
                            value: 22,
                            height: 35
                        }]);
                    } else if (op.node.id == 11) {
                        callback([{
                            id: 111,
                            pId: 11,
                            type: "bi.single_select_item",
                            text: "test111",
                            value: 111,
                            height: 35
                        }]);
                    }
                }
            },
            el: {
                type: "bi.loader",
                next: false,
                el: {
                    type: "bi.button_tree",
                    chooseType: 0,
                    layouts: [{
                        type: "bi.vertical",
                        hgap: 30,
                        vgap: 0
                    }]
                }
            }
        });
        return this.asyncTree;
    },

    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.grid",
            columns: 2,
            rows: 1,
            element: this,
            items: [{
                column: 0,
                row: 0,
                el: {
                    type: "bi.vtape",
                    items: [
                        {
                            el: this._createDefaultTree()
                        },
                        {
                            el: {
                                type: "bi.center",
                                hgap: 10,
                                items: [{
                                    type: "bi.text_button",
                                    cls: "mvc-button layout-bg2",
                                    text: "getValue",
                                    height: 30,
                                    handler: function () {
                                        BI.Msg.alert("", JSON.stringify(self.tree.getValue()));
                                    }
                                }, {
                                    type: "bi.text_button",
                                    cls: "mvc-button layout-bg2",
                                    text: "getNodeByValue(第一级目录1)",
                                    height: 30,
                                    handler: function () {
                                        BI.Msg.alert("", "节点名称为: " + self.tree.getNodeByValue("第一级目录1").getValue());
                                    }
                                }]
                            },
                            height: 30
                        }
                    ]
                }
            }, {
                column: 1,
                row: 0,
                el: {
                    type: "bi.vtape",
                    items: [
                        {
                            type: "bi.label",
                            text: "异步加载数据",
                            height: 30
                        },
                        {
                            el: this._createAsyncTree()
                        },
                        {
                            el: {
                                type: "bi.center",
                                hgap: 10,
                                items: [{
                                    type: "bi.text_button",
                                    cls: "mvc-button layout-bg2",
                                    text: "getValue",
                                    height: 30,
                                    handler: function () {
                                        BI.Msg.alert("", JSON.stringify(self.asyncTree.getValue()));
                                    }
                                }, {
                                    type: "bi.text_button",
                                    cls: "mvc-button layout-bg2",
                                    text: "getNodeById(11)",
                                    height: 30,
                                    handler: function () {
                                        BI.Msg.alert("", "节点名称为: " + (self.asyncTree.getNodeById(11) && self.asyncTree.getNodeById(11).getText()));
                                    }
                                }]
                            },
                            height: 30
                        }
                    ]
                }
            }]
        });
    }
});
BI.shortcut("demo.custom_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var items = [];
        var rowCount = 10000, columnCount = 100;
        for (var i = 0; i < rowCount; i++) {
            items[i] = [];
            for (var j = 0; j < columnCount; j++) {
                items[i][j] = {
                    type: "bi.label",
                    text: i + "-" + j
                };
            }
        }
        var grid = BI.createWidget({
            type: "bi.grid_view",
            width: 400,
            height: 300,
            estimatedRowSize: 30,
            estimatedColumnSize: 100,
            items: items,
            scrollTop: 100,
            rowHeightGetter: function () {
                return 30;
            },
            columnWidthGetter: function () {
                return 100;
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.grid",
                    columns: 1,
                    rows: 1,
                    items: [{
                        column: 0,
                        row: 0,
                        el: grid
                    }]
                },
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        });
    }
});
BI.shortcut("demo.grid_view", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.list_view",
            el: {
                type: "bi.left"
            },
            items: BI.map(Demo.CONSTANTS.ITEMS, function (i, item) {
                return BI.extend({}, item, {
                    type: "bi.label",
                    width: 200,
                    height: 200,
                    text: (i + 1) + "." + item.text
                });
            })
        };
    }
});
BI.shortcut("demo.list_view", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createItems: function () {
        var items = BI.map(BI.range(1000), function (i) {
            return {
                type: "demo.virtual_group_item",
                value: i,
                key: i + 1
            };
        });
        return items;
    },

    render: function () {
        var self = this;
        var buttonGroupItems = self._createItems();
        var virtualGroupItems = self._createItems();
        return {
            type: "bi.vertical",
            vgap: 20,
            items: [{
                type: "bi.label",
                cls: "layout-bg5",
                height: 50,
                text: "共1000个元素,演示button_group和virtual_group每次删除第一个元素,打开控制台看输出"
            }, {
                type: "bi.button_group",
                width: 500,
                height: 300,
                ref: function () {
                    self.buttonGroup = this;
                },
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical"
                }],
                items: this._createItems()
            }, {
                type: "bi.button",
                text: "演示button_group的刷新",
                handler: function () {
                    buttonGroupItems.shift();
                    self.buttonGroup.populate(BI.deepClone(buttonGroupItems));
                }
            }, {
                type: "bi.virtual_group",
                width: 500,
                height: 300,
                ref: function () {
                    self.virtualGroup = this;
                },
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical"
                }],
                items: this._createItems()
            }, {
                type: "bi.button",
                text: "演示virtual_group的刷新",
                handler: function () {
                    virtualGroupItems.shift();
                    self.virtualGroup.populate(BI.deepClone(virtualGroupItems));
                }
            }]

        };
    }
});
BI.shortcut("demo.virtual_group", Demo.Func);

Demo.Item = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-item",
        height: 30
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.label",
            ref: function () {
                self.label = this;
            },
            height: this.options.height,
            text: "key:" + o.key + ",随机数" + BI.UUID()
        };
    },

    shouldUpdate: function (nextProps) {
        var o = this.options;
        return o.type !== nextProps.type || o.key !== nextProps.key || o.value !== nextProps.value;
    },

    update: function (item) {
        this.label.setText(item.value);
        console.log("更新了一项");
        return true;// 返回是不是更新成功
    },

    created: function () {
        console.log("创建了一项");
    },

    destroyed: function () {
        console.log("删除了一项");
    }
});
BI.shortcut("demo.virtual_group_item", Demo.Item);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.virtual_list",
            items: BI.map(Demo.CONSTANTS.ITEMS, function (i, item) {
                return BI.extend({}, item, {
                    type: "bi.label",
                    height: 30,
                    text: (i + 1) + "." + item.text
                });
            })
        };
    }
});
BI.shortcut("demo.virtual_list", Demo.Func);Demo.AbsoluteLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.label",
                    text: "绝对布局",
                    cls: "layout-bg1",
                    width: 300,
                    height: 200
                },
                left: 100,
                top: 100
            }]
        };
    }
});
BI.shortcut("demo.absolute", Demo.AbsoluteLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.BorderLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-border"
    },

    _createNorth: function () {
        return BI.createWidget({
            type: "bi.label",
            text: "North",
            cls: "layout-bg1",
            height: 30
        });
    },

    _createWest: function () {
        return BI.createWidget({
            type: "bi.center",
            cls: "layout-bg2",
            items: [{
                type: "bi.label",
                text: "West",
                whiteSpace: "normal"
            }]
        });
    },

    _createCenter: function () {
        return BI.createWidget({
            type: "bi.center",
            cls: "layout-bg3",
            items: [{
                type: "bi.label",
                text: "Center",
                whiteSpace: "normal"
            }]
        });
    },

    _createEast: function () {
        return BI.createWidget({
            type: "bi.center",
            cls: "layout-bg5",
            items: [{
                type: "bi.label",
                text: "East",
                whiteSpace: "normal"
            }]
        });
    },

    _createSouth: function () {
        return BI.createWidget({
            type: "bi.label",
            text: "South",
            cls: "layout-bg6",
            height: 50
        });
    },

    render: function () {
        return {
            type: "bi.border",
            cls: "",
            items: {
                north: {
                    el: this._createNorth(),
                    height: 30,
                    top: 20,
                    left: 20,
                    right: 20
                },
                south: {
                    el: this._createSouth(),
                    height: 50,
                    bottom: 20,
                    left: 20,
                    right: 20
                },
                west: {
                    el: this._createWest(),
                    width: 200,
                    left: 20
                },
                east: {
                    el: this._createEast(),
                    width: 300,
                    right: 20
                },
                center: this._createCenter()
            }
        };
    }
});
BI.shortcut("demo.border", Demo.BorderLayout);Demo.CenterAdapt = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.center_adapt",
            items: [{
                type: "bi.label",
                text: "水平垂直居中",
                width: 300,
                height: 200,
                cls: "layout-bg1"
            }]
        };
    }
});
BI.shortcut("demo.center_adapt", Demo.CenterAdapt);/**
 * Created by User on 2017/3/22.
 */
Demo.CenterLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-center"
    },
    render: function () {
        return {
            type: "bi.center",
            items: [{
                type: "bi.label",
                text: "其实是一个grid嵌套absolute的实现",
                cls: "layout-bg1",
                whiteSpace: "normal"
            }, {
                type: "bi.label",
                text: "Center 2，为了演示label是占满整个的，用了一个whiteSpace:normal",
                cls: "layout-bg2",
                whiteSpace: "normal"
            }, {
                type: "bi.label",
                text: "Center 3",
                cls: "layout-bg3"
            }, {
                type: "bi.label",
                text: "Center 4",
                cls: "layout-bg5"
            }],
            hgap: 20,
            vgap: 20
        };
    }
});
BI.shortcut("demo.center_layout", Demo.CenterLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.FloatCenterLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-float-center"
    },
    render: function () {
        return {
            type: "bi.float_center",
            items: [{
                type: "bi.label",
                text: "floatCenter与center的不同在于，它可以控制最小宽度和最大宽度",
                cls: "layout-bg1",
                whiteSpace: "normal"
            }, {
                type: "bi.label",
                text: "浮动式的中间布局",
                cls: "layout-bg2",
                whiteSpace: "normal"
            }],
            hgap: 20,
            vgap: 20
        };
    }
});
BI.shortcut("demo.float_center", Demo.FloatCenterLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.FlowLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-flow"
    },
    render: function () {
        return {
            type: "bi.center_adapt",
            items: [{
                type: "bi.left",
                items: [{
                    type: "bi.label",
                    height: 30,
                    text: "Left-1",
                    cls: "layout-bg1"
                    
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-2",
                    cls: "layout-bg2"
                    
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-3",
                    cls: "layout-bg3"
                    
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-4",
                    cls: "layout-bg4"
                    
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-5",
                    cls: "layout-bg5"
                    
                }],
                hgap: 20
            }, {
                type: "bi.right",
                hgap: 20,
                items: [{
                    type: "bi.label",
                    height: 30,
                    text: "Right-1",
                    cls: "layout-bg1"
                    
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-2",
                    cls: "layout-bg2"
                    
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-3",
                    cls: "layout-bg3"
                    
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-4",
                    cls: "layout-bg4"
                    
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-5",
                    cls: "layout-bg5"
                    
                }],
                vgap: 20
            }]
        };
    }
});
BI.shortcut("demo.flow", Demo.FlowLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.GridLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-grid"
    },
    render: function () {
        return {
            type: "bi.grid",
            columns: 5,
            rows: 3,
            items: [{
                column: 0,
                row: 0,
                el: {
                    type: "bi.label",
                    text: "column-0, row-0",
                    cls: "layout-bg1"
                }
            }, {
                column: 1,
                row: 0,
                el: {
                    type: "bi.label",
                    text: "column-1, row-0",
                    cls: "layout-bg2"
                }
            }, {
                column: 2,
                row: 0,
                el: {
                    type: "bi.label",
                    text: "column-2, row-0",
                    cls: "layout-bg6"
                }
            }, {
                column: 3,
                row: 0,
                el: {
                    type: "bi.label",
                    text: "column-3, row-0",
                    cls: "layout-bg3"
                }
            }, {
                column: 4,
                row: 0,
                el: {
                    type: "bi.label",
                    text: "column-4, row-0",
                    cls: "layout-bg4"
                }
            }, {
                column: 0,
                row: 1,
                el: {
                    type: "bi.label",
                    text: "column-0, row-1",
                    cls: "layout-bg5"
                }
            }, {
                column: 1,
                row: 1,
                el: {
                    type: "bi.label",
                    text: "column-1, row-1",
                    cls: "layout-bg6"
                }
            }, {
                column: 2,
                row: 1,
                el: {
                    type: "bi.label",
                    text: "column-2, row-1",
                    cls: "layout-bg7"
                }
            }, {
                column: 3,
                row: 1,
                el: {
                    type: "bi.label",
                    text: "column-3, row-1",
                    cls: "layout-bg1"
                }
            }, {
                column: 4,
                row: 1,
                el: {
                    type: "bi.label",
                    text: "column-4, row-1",
                    cls: "layout-bg3"
                }
            }, {
                column: 0,
                row: 2,
                el: {
                    type: "bi.label",
                    text: "column-0, row-2",
                    cls: "layout-bg2"
                }
            }, {
                column: 1,
                row: 2,
                el: {
                    type: "bi.label",
                    text: "column-1, row-2",
                    cls: "layout-bg3"
                }
            }, {
                column: 2,
                row: 2,
                el: {
                    type: "bi.label",
                    text: "column-2, row-2",
                    cls: "layout-bg4"
                }
            }, {
                column: 3,
                row: 2,
                el: {
                    type: "bi.label",
                    text: "column-3, row-2",
                    cls: "layout-bg5"
                }
            }, {
                column: 4,
                row: 2,
                el: {
                    type: "bi.label",
                    text: "column-4, row-2",
                    cls: "layout-bg6"
                }
            }]
        };
    }
});
BI.shortcut("demo.grid", Demo.GridLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.HorizontalAdapt = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal-adapt"
    },

    _createLayout: function () {
        return BI.createWidget({
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.label",
                text: "例子1:可用做水平居中",
                cls: "layout-bg1",
                width: 300,
                height: 30
            }]
        });
    },

    _createAdaptLayout: function () {
        return BI.createWidget({
            type: "bi.horizontal_adapt",
            columnSize: [300, "fill"],
            items: [{
                type: "bi.label",
                text: "例子2:用于水平适应布局",
                cls: "layout-bg1",
                height: 30
            }, {
                type: "bi.label",
                text: "水平自适应列",
                cls: "layout-bg2",
                height: 30
            }]
        });
    },

    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 2,
            items: [{
                column: 0,
                row: 0,
                el: this._createLayout()
            }, {
                column: 0,
                row: 1,
                el: this._createAdaptLayout()
            }]
        };
    }
});
BI.shortcut("demo.horizontal_adapt", Demo.HorizontalAdapt);/**
 * Created by User on 2017/3/22.
 */
Demo.HorizontalAuto = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal-auto"
    },

    _createLayout: function () {
        return BI.createWidget({
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.label",
                text: "水平居中",
                cls: "layout-bg1",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "水平居中优先使用该布局",
                cls: "layout-bg2",
                width: 300,
                height: 30
            }]
        });
    },
    
    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 2,
            items: [{
                column: 0,
                row: 0,
                el: this._createLayout()
            }]
        };
    }
});
BI.shortcut("demo.horizontal_auto", Demo.HorizontalAuto);/**
 * Created by User on 2017/3/22.
 */
Demo.HorizontalFloat = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal-float"
    },

    render: function () {
        return {
            type: "bi.horizontal_float",
            items: [{
                type: "bi.label",
                text: "浮动式水平居中布局方案，用于宽度未知的情况",
                cls: "layout-bg1",
                height: 30
            }]
        };
    }
});
BI.shortcut("demo.horizontal_float", Demo.HorizontalFloat);/**
 * Created by User on 2017/3/21.
 */
Demo.Horizontal = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal"
    },
    render: function () {
        return {
            type: "bi.vertical",
            vgap: 10,
            items: [{
                type: "bi.horizontal",
                height: 150,
                hgap: 10,
                items: [{
                    type: "bi.label",
                    whiteSpace: "normal",
                    text: "因为大多数场景下都需要垂直居中，所以这个布局一般会被vertical_adapt布局设置scrollx=true取代",
                    cls: "layout-bg3",
                    width: 500,
                    height: 50
                }, {
                    type: "bi.label",
                    text: "水平布局",
                    cls: "layout-bg4",
                    width: 300,
                    height: 30
                }, {
                    type: "bi.label",
                    text: "水平布局",
                    cls: "layout-bg5",
                    width: 300,
                    height: 30
                }, {
                    type: "bi.label",
                    text: "水平布局",
                    cls: "layout-bg6",
                    width: 300,
                    height: 30
                }]
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }, {
                type: "bi.horizontal",
                height: 150,
                verticalAlign: BI.VerticalAlign.Middle,
                horizontalAlign: BI.HorizontalAlign.Left,
                vgap: 10,
                items: [{
                    type: "bi.label",
                    text: "以horizontal实现的vertical_adapt垂直居中",
                    cls: "layout-bg1",
                    width: 300,
                    height: 30
                }, {
                    type: "bi.label",
                    text: "以horizontal实现的vertical_adapt垂直居中",
                    cls: "layout-bg2",
                    width: 300,
                    height: 30
                }]
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }, {
                type: "bi.horizontal",
                height: 150,
                verticalAlign: BI.VerticalAlign.Top,
                horizontalAlign: BI.HorizontalAlign.Center,
                items: [{
                    type: "bi.label",
                    text: "以horizontal代替horizontal_adapt实现的水平居中(单元素)",
                    cls: "layout-bg1",
                    width: 300,
                    height: 30
                }]
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }, {
                type: "bi.horizontal",
                height: 150,
                verticalAlign: BI.VerticalAlign.Top,
                horizontalAlign: BI.HorizontalAlign.Center,
                columnSize: [300, "fill"],
                items: [{
                    type: "bi.label",
                    text: "以horizontal代替horizontal_adapt实现的用于水平适应布局",
                    cls: "layout-bg1",
                    height: 30
                }, {
                    type: "bi.label",
                    text: "以horizontal代替horizontal_adapt实现的水平自适应列",
                    cls: "layout-bg2",
                    height: 30
                }]
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }, {
                type: "bi.center_adapt",
                height: 150,
                verticalAlign: BI.VerticalAlign.Middle,
                horizontalAlign: BI.HorizontalAlign.Center,
                items: [{
                    type: "bi.label",
                    text: "以horizontal代替center_adapt实现的水平垂直居中",
                    width: 300,
                    height: 100,
                    cls: "layout-bg1"
                }]
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }]
        };
    }
});
BI.shortcut("demo.horizontal", Demo.Horizontal);/**
 * Created by User on 2017/3/22.
 */
Demo.HtapeLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-htape"
    },
    render: function () {
        return {
            type: "bi.htape",
            items: [
                {
                    width: 100,
                    el: {
                        type: "bi.label",
                        text: "1",
                        cls: "bi-background"
                    }
                }, {
                    width: 200,
                    el: {
                        type: "bi.label",
                        text: "2",
                        cls: "layout-bg2"
                    }
                }, {
                    width: "fill",
                    el: {
                        type: "bi.label",
                        text: "3",
                        cls: "layout-bg3"
                    }
                }
            ]
        };
    }
});
BI.shortcut("demo.htape", Demo.HtapeLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.LeftRightVerticalAdaptLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-left-right-vertical-adapt"
    },
    render: function () {
        return {
            type: "bi.left_right_vertical_adapt",
            lhgap: 10,
            rhgap: 30,
            items: {
                left: [{
                    type: "bi.label",
                    text: "左边的垂直居中",
                    cls: "layout-bg1",
                    width: 100,
                    height: 30
                }, {
                    type: "bi.label",
                    text: "左边的垂直居中",
                    cls: "layout-bg2",
                    width: 100,
                    height: 30
                }],
                right: [{
                    type: "bi.label",
                    text: "右边的垂直居中",
                    cls: "layout-bg1",
                    width: 100,
                    height: 30
                }, {
                    type: "bi.label",
                    text: "右边的垂直居中",
                    cls: "layout-bg2",
                    width: 100,
                    height: 30
                }]
            }
        };
    }
});
BI.shortcut("demo.left_right_vertical_adapt", Demo.LeftRightVerticalAdaptLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.TableLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-table-layout"
    },

    _createTable1: function () {
        return {
            type: "bi.table",
            items: BI.createItems([
                [
                    {
                        el: {
                            cls: "layout-bg1"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg2"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg3"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg4"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg5"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg6"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg7"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg8"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg1"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg2"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg3"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg4"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg5"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg6"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg7"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg8"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg1"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg2"
                        }
                    }
                ],
                [
                    {
                        el: {
                            cls: "layout-bg6"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg7"
                        }
                    },
                    {
                        el: {
                            cls: "layout-bg8"
                        }
                    }
                ]
            ], {
                type: "bi.layout"
            }),
            columnSize: [100, "fill", 200],
            rowSize: [10, 30, 50, 70, 90, 110, 130],
            hgap: 20,
            vgap: 10
        };
    },

    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 1,
            items: [
                {
                    column: 0,
                    row: 0,
                    el: this._createTable1()
                }
                // , {
                //    column: 0,
                //    row: 1,
                //    el: this._createTable2()
                // }
            ]
        };
    }
});
BI.shortcut("demo.table_layout", Demo.TableLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.TdLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-td"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.td",
                columnSize: [100, 100, ""],
                items: BI.createItems([
                    [{
                        el: {
                            type: "bi.label",
                            text: "这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写",
                            cls: "layout-bg1"
                        }
                    }, {
                        el: {
                            type: "bi.label",
                            text: "这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写",
                            cls: "layout-bg2"
                        }
                    }, {
                        el: {
                            type: "bi.label",
                            text: "这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写",
                            cls: "layout-bg3"
                        }
                    }], [{
                        el: {
                            type: "bi.label",
                            text: "这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写",
                            cls: "layout-bg5"
                        }
                    }, {
                        el: {
                            type: "bi.label",
                            text: "这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写",
                            cls: "layout-bg6"
                        }
                    }, {
                        el: {
                            type: "bi.label",
                            text: "这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写",
                            cls: "layout-bg7"
                        }
                    }]
                ], {
                    whiteSpace: "normal"
                })
            }]
        };
    }
});
BI.shortcut("demo.td", Demo.TdLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.VerticalAdaptLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-vertical-adapt"
    },

    _createLayout: function () {
        return BI.createWidget({
            type: "bi.vertical_adapt",
            vgap: 10,
            items: [{
                type: "bi.label",
                text: "垂直居中",
                cls: "layout-bg1",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "垂直居中",
                cls: "layout-bg2",
                width: 300,
                height: 30
            }]
        });
    },
    
    render: function () {
        return {
            type: "bi.grid",
            columns: 2,
            rows: 1,
            items: [{
                column: 0,
                row: 0,
                el: this._createLayout()
            }]
        };
    }
});
BI.shortcut("demo.vertical_adapt", Demo.VerticalAdaptLayout);/**
 * Created by User on 2017/3/21.
 */
Demo.VerticalLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-vertical"
    },
    render: function () {
        return {
            type: "bi.vertical",
            vgap: 10,
            items: [{
                type: "bi.label",
                cls: "layout-bg3",
                text: "垂直布局",
                height: 30
            }, {
                type: "bi.label",
                cls: "layout-bg4",
                text: "垂直布局",
                height: 30
            }]
        };
    }
});
BI.shortcut("demo.vertical", Demo.VerticalLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.VtapeLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-vtape"
    },
    render: function () {
        return {
            type: "bi.vtape",
            vgap: 10,
            items: [
                {
                    height: 100,
                    el: {
                        type: "bi.label",
                        text: "1",
                        cls: "layout-bg1"
                    },
                    tgap: 10,
                    vgap: 10
                }, {
                    height: 200,
                    el: {
                        type: "bi.label",
                        text: "2",
                        cls: "layout-bg2"
                    }
                }, {
                    height: "fill",
                    el: {
                        type: "bi.label",
                        text: "3",
                        cls: "layout-bg3"
                    }
                }
            ]
        };
    }
});
BI.shortcut("demo.vtape", Demo.VtapeLayout);/**
 * Created by Windy on 2017/12/13.
 */
Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var self = this, id1 = BI.UUID(), id2 = BI.UUID();
        return {
            type: "bi.vertical",
            vgap: 10,
            items: [{
                type: "bi.button",
                text: "create形式创建layer, 遮住当前面板, 返回创建的面板对象",
                height: 30,
                handler: function () {
                    BI.Layers.create(id1, self, {
                        //偏移量
                        offset: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        },
                        type: "bi.center_adapt",
                        cls: "bi-card",
                        items: [{
                            type: "bi.button",
                            text: "点击关闭",
                            handler: function () {
                                BI.Layers.hide(id1);
                            }
                        }]
                    });
                    BI.Layers.show(id1);
                }
            }, {
                type: "bi.button",
                text: "make形式创建layer,可以指定放到哪个面板内,这里指定当前面板(默认放在body下撑满), 返回创建的面板对象",
                height: 30,
                handler: function () {
                    BI.Layers.make(id2, self, {
                        //偏移量
                        offset: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        },
                        type: "bi.center_adapt",
                        cls: "bi-card",
                        items: [{
                            type: "bi.button",
                            text: "点击关闭",
                            handler: function () {
                                BI.Layers.remove(id2);
                            }
                        }]
                    });
                    BI.Layers.show(id2);
                }
            }]
        };
    }
});

BI.shortcut("demo.layer", Demo.Func);/**
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

BI.shortcut("demo.popover", Demo.Func);/**
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
BI.shortcut("demo.popup_view", Demo.Func);/**
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
                    type: "bi.searcher_view",
                    ref: function () {
                        self.searcherView = this;
                    }
                },
                left: 100,
                top: 20,
                width: 230
            }]
        };
    },

    mounted: function () {
        this.searcherView.populate(BI.createItems([{
            text: 2012
        }, {
            text: 2013
        }, {
            text: 2014
        }, {
            text: 2015
        }], {
            type: "bi.label",
            textHeight: 24,
            height: 24
        }), [{
            text: 2
        }], "2");
    }
});
BI.shortcut("demo.searcher_view", Demo.Func);Demo.Face = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-face"
    },

    _createLabel: function (text) {
        return {
            width: 200,
            el: {
                type: "bi.label",
                text: text,
                textAlign: "left",
                hgap: 5,
                height: 40,
                cls: "config-label"
            }
        };
    },

    _createColorPicker: function (ref, action) {
        return {
            el: {
                type: "bi.vertical_adapt",
                items: [{
                    type: "bi.color_chooser",
                    listeners: [{
                        eventName: BI.ColorChooser.EVENT_CHANGE,
                        action: action
                    }],
                    ref: ref,
                    width: 24,
                    height: 24
                }]
            }
        };
    },

    _createBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("背景色："), this._createColorPicker(function () {
                self.backgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        };
    },

    _createFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("字体颜色："), this._createColorPicker(function () {
                self.fontColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        };
    },

    _createActiveFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("激活状态字体颜色："), this._createColorPicker(function () {
                self.activeFontColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.text_button",
                    cls: "bi-list-item-active",
                    text: "测试激活状态",
                }
            }]
        };
    },

    _createSelectFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("选中状态字体颜色："), this._createColorPicker(function () {
                self.selectFontColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.text_button",
                    cls: "bi-list-item-active",
                    text: "测试选中状态",
                }
            }]
        };
    },

    _createGrayFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("tip提示字体颜色："), this._createColorPicker(function () {
                self.grayFontColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.icon_text_item",
                    cls: "bi-tips copy-font",
                    height: 40,
                    text: "测试提示文字"
                }
            }]
        };
    },

    _createDisableFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("灰化字体颜色："), this._createColorPicker(function () {
                self.disabledFontColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.text_button",
                    text: "这个按钮是灰化的",
                    disabled: true
                }
            }]
        };
    },

    _createCardBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("Card背景颜色："), this._createColorPicker(function () {
                self.cardBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        };
    },

    _createHoverBackgroundColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("悬浮状态背景颜色："), this._createColorPicker(function () {
                self.hoverBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.text_button",
                    cls: "bi-list-item-active",
                    text: "测试悬浮状态",
                }
            }]
        };
    },

    _createActiveBackgroundColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("激活状态背景颜色："), this._createColorPicker(function () {
                self.activeBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.text_button",
                    cls: "bi-list-item-active",
                    text: "测试激活状态",
                }
            }]
        };
    },

    _createSelectBackgroundColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("选中状态背景颜色："), this._createColorPicker(function () {
                self.selectBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.text_button",
                    cls: "bi-list-item-active",
                    text: "测试选中状态",
                }
            }]
        };
    },

    _createSlitColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("分割线颜色："), this._createColorPicker(function () {
                self.slitColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        };
    },

    _createBaseConfig: function () {
        return {
            type: "bi.vertical",
            items: [this._createLabel("--通用配色--"),
                this._createBackgroundConfig(),
                this._createCardBackgroundConfig(),
                this._createFontConfig(),
                this._createActiveFontConfig(),
                this._createSelectFontConfig(),
                this._createGrayFontConfig(),
                this._createDisableFontConfig(),
                this._createHoverBackgroundColor(),
                this._createActiveBackgroundColor(),
                this._createSelectBackgroundColor(),
                this._createSlitColor()
            ]
        };
    },


    _createButton1BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("按钮背景色1："), this._createColorPicker(function () {
                self.button1BackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    height: 40,
                    items: [{
                        type: "bi.button",
                        cls: "config-button1",
                        text: "测试按钮"
                    }]
                }
            }]
        };
    },

    _createButton2BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("按钮背景色2："), this._createColorPicker(function () {
                self.button2BackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    height: 40,
                    items: [{
                        type: "bi.button",
                        level: "success",
                        cls: "config-button2",
                        text: "测试按钮"
                    }]
                }
            }]
        };
    },

    _createButton3BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("按钮背景色3："), this._createColorPicker(function () {
                self.button3BackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    height: 40,
                    items: [{
                        type: "bi.button",
                        level: "warning",
                        cls: "config-button3",
                        text: "测试按钮"
                    }]
                }
            }]
        };
    },

    _createButton4BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("按钮背景色4："), this._createColorPicker(function () {
                self.button4BackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    height: 40,
                    items: [{
                        type: "bi.button",
                        level: "ignore",
                        cls: "config-button4",
                        text: "测试按钮"
                    }]
                }
            }]
        };
    },

    _createScrollBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("滚动条底色："), this._createColorPicker(function () {
                self.scrollBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        };
    },

    _createScrollThumbConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("滚动条thumb颜色："), this._createColorPicker(function () {
                self.scrollThumbColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        };
    },

    _createPopupBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("下拉框背景颜色："), this._createColorPicker(function () {
                self.popupBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    items: [{
                        type: "bi.down_list_combo",
                        items: [[{
                            el: {
                                text: "column 1111",
                                iconCls1: "check-mark-e-font",
                                value: 11
                            },
                            children: [
                                {
                                    text: "column 1.1",
                                    value: 21,
                                    cls: "dot-e-font",
                                    selected: true
                                }, {
                                    text: "column 1.222222222222222222222222222222222222",
                                    cls: "dot-e-font",
                                    value: 22
                                }, {
                                    text: "column 1.3",
                                    cls: "dot-e-font",
                                    value: 23
                                }, {
                                    text: "column 1.4",
                                    cls: "dot-e-font",
                                    value: 24
                                }, {
                                    text: "column 1.5",
                                    cls: "dot-e-font",
                                    value: 25
                                }
                            ]
                        }], [
                            {
                                el: {
                                    type: "bi.icon_text_icon_item",
                                    text: "column 2",
                                    iconCls1: "chart-type-e-font",
                                    cls: "dot-e-font",
                                    value: 12
                                },
                                disabled: true,
                                children: [{
                                    type: "bi.icon_text_item",
                                    cls: "dot-e-font",
                                    height: 25,
                                    text: "column 2.1",
                                    value: 11
                                }, {text: "column 2.2", value: 12, cls: "dot-e-font"}]


                            }
                        ], [
                            {
                                text: "column 33333333333333333333333333333333",
                                cls: "style-set-e-font",
                                value: 13
                            }
                        ], [
                            {
                                text: "column 4",
                                cls: "filter-e-font",
                                value: 14
                            }
                        ], [
                            {
                                text: "column 5",
                                cls: "copy-e-font",
                                value: 15

                            }
                        ], [
                            {
                                text: "column 6",
                                cls: "delete-e-font",
                                value: 16
                            }
                        ], [
                            {
                                text: "column 7",
                                cls: "dimension-from-e-font",
                                value: 17,
                                disabled: true
                            }
                        ]]
                    }]
                }
            }]
        };
    },

    _createMaskBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("弹出层蒙版颜色："), this._createColorPicker(function () {
                self.maskBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            }), {
                width: 100,
                el: {
                    type: "bi.vertical_adapt",
                    items: [{
                        type: "bi.button",
                        text: "mask测试",
                        handler: function () {
                            BI.Msg.alert("弹出层", "弹出层面板");
                        }
                    }]
                }
            }]
        };
    },

    _createCommonConfig: function () {
        return {
            type: "bi.vertical",
            items: [this._createLabel("--一般配色--"),
                this._createButton1BackgroundConfig(),
                this._createButton2BackgroundConfig(),
                this._createButton3BackgroundConfig(),
                this._createButton4BackgroundConfig(),
                this._createScrollBackgroundConfig(),
                this._createScrollThumbConfig(),
                this._createPopupBackgroundConfig(),
                this._createMaskBackgroundConfig()
            ]
        };
    },

    render: function () {
        var self = this;
        return {
            type: "bi.grid",
            items: [[{
                el: {
                    type: "bi.vertical",
                    cls: "face-config bi-border-right",
                    items: [this._createBaseConfig(),
                        this._createCommonConfig()]
                }
            }, {
                el: {
                    type: "bi.layout"
                }
            }]]
        };
    },

    _setStyle: function (objects) {
        var result = "";
        BI.each(objects, function (cls, object) {
            result += cls + "{";
            BI.each(object, function (name, value) {
                result += name + ":" + value + ";";
            });
            result += "} ";
        });
        BI.StyleLoaders.removeStyle("style").loadStyle("style", result);
    },

    _runGlobalStyle: function () {
        var backgroundColor = this.backgroundColor.getValue();
        var fontColor = this.fontColor.getValue();
        var activeFontColor = this.activeFontColor.getValue();
        var selectFontColor = this.selectFontColor.getValue();
        var grayFontColor = this.grayFontColor.getValue();
        var disabledFontColor = this.disabledFontColor.getValue();
        var cardBackgroundColor = this.cardBackgroundColor.getValue();
        var hoverBackgroundColor = this.hoverBackgroundColor.getValue();
        var activeBackgroundColor = this.activeBackgroundColor.getValue();
        var selectBackgroundColor = this.selectBackgroundColor.getValue();
        var slitColor = this.slitColor.getValue();

        var button1BackgroundColor = this.button1BackgroundColor.getValue();
        var button2BackgroundColor = this.button2BackgroundColor.getValue();
        var button3BackgroundColor = this.button3BackgroundColor.getValue();
        var button4BackgroundColor = this.button4BackgroundColor.getValue();
        var scrollBackgroundColor = this.scrollBackgroundColor.getValue();
        var scrollThumbColor = this.scrollThumbColor.getValue();
        var popupBackgroundColor = this.popupBackgroundColor.getValue();
        var maskBackgroundColor = this.maskBackgroundColor.getValue();

        this._setStyle({
            "body.bi-background, body .bi-background": {
                "background-color": backgroundColor,
                color: fontColor
            },
            "body .bi-card": {
                "background-color": cardBackgroundColor,
                color: fontColor
            },
            "body .bi-tips": {
                color: grayFontColor
            },
            "div::-webkit-scrollbar,.scrollbar-layout-main": {
                "background-color": scrollBackgroundColor + "!important"
            },
            "div::-webkit-scrollbar-thumb,.public-scrollbar-face:after": {
                "background-color": scrollThumbColor + "!important"
            },
            ".base-disabled": {
                color: disabledFontColor + "!important"
            },
            ".base-disabled .b-font:before": {
                color: disabledFontColor + "!important"
            },
            ".list-view-outer": {
                "background-color": popupBackgroundColor + "!important"
            },
            ".bi-z-index-mask": {
                "background-color": maskBackgroundColor + "!important"
            },
            ".bi-list-item:hover,.bi-list-item-hover:hover,.bi-list-item-active:hover,.bi-list-item-select:hover,.bi-list-item-effect:hover": {
                "background-color": hoverBackgroundColor + "!important"
            },
            ".bi-list-item-active:active,.bi-list-item-select:active,.bi-list-item-effect:active": {
                "background-color": activeBackgroundColor + "!important",
                color: activeFontColor + "!important"
            },
            ".bi-list-item-active.active,.bi-list-item-select.active,.bi-list-item-effect.active": {
                "background-color": selectBackgroundColor + "!important",
                color: selectFontColor + "!important"
            },
            "body .bi-button.button-common": {
                "background-color": button1BackgroundColor,
                "border-color": button1BackgroundColor
            },
            "body .bi-button.button-success": {
                "background-color": button2BackgroundColor,
                "border-color": button2BackgroundColor
            },
            "body .bi-button.button-warning": {
                "background-color": button3BackgroundColor,
                "border-color": button3BackgroundColor
            },
            "body .bi-button.button-ignore": {
                "background-color": button4BackgroundColor
            },
            // 以下是分割线颜色
            "body .bi-border,body .bi-border-top,#wrapper .bi-border-bottom,body .bi-border-left,body .bi-border-right": {
                "border-color": slitColor
            },
            ".bi-collection-table-cell": {
                "border-right-color": slitColor,
                "border-bottom-color": slitColor
            },
            ".bi-collection-table-cell.first-col": {
                "border-left-color": slitColor
            },
            ".bi-collection-table-cell.first-row": {
                "border-top-color": slitColor
            }
        });
    },

    mounted: function () {
        this.backgroundColor.setValue("");
        this.fontColor.setValue("");
        this.activeFontColor.setValue("");
        this.selectFontColor.setValue("");
        this.grayFontColor.setValue("");
        this.disabledFontColor.setValue("");
        this.cardBackgroundColor.setValue("");
        this.hoverBackgroundColor.setValue("");
        this.activeBackgroundColor.setValue("");
        this.selectBackgroundColor.setValue("");

        this.button1BackgroundColor.setValue("");
        this.button2BackgroundColor.setValue("");
        this.button3BackgroundColor.setValue("");
        this.button4BackgroundColor.setValue("");
        this.scrollBackgroundColor.setValue("");
        this.scrollThumbColor.setValue("");
        this.popupBackgroundColor.setValue("");
        this.maskBackgroundColor.setValue("");
        this.slitColor.setValue("");
        this._runGlobalStyle();
    }
});
BI.shortcut("demo.face", Demo.Face);(function () {
    var model = Fix.define({
        name: "原始属性",
        arr: [{
            n: "a"
        }, {
            n: "b"
        }]
    });
    var Computed = BI.inherit(Fix.Model, {
        computed: {
            b: function () {
                return this.name + "-计算属性";
            }
        }
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return new Computed(model);
        },
        watch: {
            b: function () {
                this.button.setText(this.model.b);
            }
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.button",
                        ref: function () {
                            self.button = this;
                        },
                        handler: function () {
                            self.model.name = "这是改变后的属性";
                        },
                        text: this.model.b
                    }
                }]
            };
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix_computed", Demo.Fix);
}());(function () {
    var ParentStore = BI.inherit(Fix.Model, {
        state: function () {
            return {
                context: "默认context"
            };
        },
        childContext: ["context"]
    });

    var ChildStore = BI.inherit(Fix.Model, {
        context: ["context"],
        computed: {
            currContext: function () {
                return this.model.context;
            }
        },
        actions: {
            changeContext: function () {
                this.model.context = "改变后的context";
            }
        }
    });

    var Child = BI.inherit(BI.Widget, {
        _store: function () {
            return new ChildStore();
        },
        watch: {
            currContext: function (val) {
                this.button.setText(val);
            }
        },
        render: function () {
            var self = this;
            return {
                type: "bi.button",
                ref: function () {
                    self.button = this;
                },
                text: this.model.context,
                handler: function () {
                    self.store.changeContext();
                }
            };
        },
        mounted: function () {

        }
    });

    BI.shortcut("demo.fix_context_child", Child);

    var Parent = BI.inherit(BI.Widget, {
        _store: function () {
            return new ParentStore();
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "demo.fix_context_child"
                    }
                }]
            };
        },
        mounted: function () {

        }
    });

    BI.shortcut("demo.fix_context", Parent);
}());(function () {
    var model = Fix.define({
        name: "原始属性",
        arr: [{
            n: "a"
        }, {
            n: "b"
        }]
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return model;
        },
        watch: {
            name: function () {
                this.button.setText(this.model.name);
            }
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.button",
                        ref: function () {
                            self.button = this;
                        },
                        handler: function () {
                            self.model.name = "这是改变后的属性";
                        },
                        text: this.model.name
                    }
                }]
            };
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix_define", Demo.Fix);
}());
(function () {
    var model = Fix.define({
        name: 1,
        arr: [{
            n: "a"
        }, {
            n: 0
        }]
    });
    var Computed = BI.inherit(Fix.Model, {
        computed: {
            b: function () {
                return this.name + 1;
            },
            c: function () {
                return this.arr[1].n + this.b;
            }
        }
    });

    var Store = BI.inherit(Fix.Model, {
        _init: function () {
            this.comp = new Computed(model);
        },
        computed: {
            b: function () {
                return this.comp.c + 1;
            },
            c: function () {
                return this.comp.arr[1].n & 1;
            }
        },
        actions: {
            run: function () {
                this.comp.name++;
                this.comp.arr[1].n++;
            }
        }
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return new Store();
        },
        watch: {
            "b&&(c||b)": function () {
                this.button.setText(this.model.b);
            }
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.button",
                        ref: function () {
                            self.button = this;
                        },
                        handler: function () {
                            self.store.run();
                        },
                        text: this.model.b
                    }
                }]
            };
        },
        mounted: function () {

        }
    });

    BI.shortcut("demo.fix", Demo.Fix);
}());(function () {
    var model = Fix.define({
        name: "原始属性",
        arr: [{
            n: "a"
        }, {
            n: 0
        }]
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return model;
        },
        watch: {
            "*.*.n": function () {
                debugger
            },
            "**": function () {
                debugger
            },
            "arr.1.*": function () {
                this.button.setText(this.model.name + "-" + this.model.arr[1].n);
            }
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.button",
                        ref: function () {
                            self.button = this;
                        },
                        handler: function () {
                            self.model.arr[0].n += 1;
                            self.model.arr[1].n += 1;
                        },
                        text: this.model.name + "-" + this.model.arr[1].n
                    }
                }]
            };
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix_global_watcher", Demo.Fix);
}());/**
 * @Author: Young
 * @CreationDate 2017-11-06 10:32
 * @Description
 */
(function () {
    var model = Fix.define({
        groups: [{
            id: "27a9c8bf159e99e",
            name: "功能数据",
            packages: [{
                id: "82a96a4b03ac17e6",
                name: "通信行业",
                type: 1,
                tables: [{
                    id: "品类",
                    name: "品类",
                    connName: "BIDemo",
                    fields: [{
                        id: "sd2ad2f343ca23",
                        name: "类别",
                        type: 32,
                        enable: true,
                        usable: true
                    }, {
                        id: "f34ds34aw2345w",
                        name: "描述",
                        type: 32,
                        enable: true,
                        usable: true
                    }]
                }]
            }]
        }, {
            id: "das2dw24214sa4",
            name: "样式数据",
            packages: [{
                id: "hi23i1o34a34we",
                name: "零售行业",
                type: 1,
                tables: [{
                    id: "销售记录",
                    name: "销售记录",
                    connName: "BIDemo",
                    fields: [{
                        id: "wr213d24t345",
                        name: "分类",
                        type: 16,
                        enable: true,
                        usable: true
                    }, {
                        id: "faw134r24al344",
                        name: "金额",
                        type: 32,
                        enable: true,
                        usable: true
                    }]
                }]
            }, {
                id: "fwr124f3453fa",
                name: "地产行业",
                tables: [{
                    id: "开发商名称",
                    name: "开发商名称",
                    connName: "BIDemo",
                    fields: [{
                        id: "sa13f345fg356",
                        name: "编号",
                        type: 32,
                        enable: true,
                        usable: true
                    }, {
                        id: "ad2r24tt232a22",
                        name: "名称",
                        type: 16,
                        enable: true,
                        usable: true
                    }]
                }, {
                    id: "楼盘",
                    name: "楼盘",
                    connName: "BIDemo",
                    fields: [{
                        id: "hfe3345fg356",
                        name: "编号",
                        type: 32,
                        enable: true,
                        usable: true
                    }, {
                        id: "kl224tt232a22",
                        name: "名称",
                        type: 16,
                        enable: true,
                        usable: true
                    }]
                }]
            }]
        }],
        fineIndexUpdate: {
            needUpdate: false,
            lastUpdate: 1509953199062
        }
    });

    Demo.FixScene = BI.inherit(BI.Widget, {
        constant: {
            TAB1: 1,
            TAB2: 2
        },

        _store: function () {
            return model;
        },

        watch: {
            "groups.*.name": function () {
                this.fineIndexTab.setText("FineIndex更新（******* 分组名变化 需要更新 *******）");
                this.model.fineIndexUpdate.needUpdate = true;
            },
            "groups.*.packages.*.name": function () {
                this.fineIndexTab.setText("FineIndex更新（******* 业务包名变化 需要更新 *******）");
                this.model.fineIndexUpdate.needUpdate = true;
            },
            "groups.*.packages.*.tables.*.name": function () {
                this.fineIndexTab.setText("FineIndex更新（******* 表名变化 需要更新 *******）");
                this.model.fineIndexUpdate.needUpdate = true;
            },
            "groups.*.packages.*.tables.*.fields.*.name": function () {
                this.fineIndexTab.setText("FineIndex更新（******* 字段名变化 需要更新 *******）");
                this.model.fineIndexUpdate.needUpdate = true;
            },
            "fineIndexUpdate.needUpdate": function (needUpdate) {
                !needUpdate && this.fineIndexTab.setText("FineIndex更新");
            }
        },

        render: function () {
            var self = this;
            return {
                type: "bi.tab",
                showIndex: this.constant.TAB1,
                single: true,
                tab: {
                    type: "bi.button_group",
                    items: BI.createItems([{
                        text: "业务包管理",
                        value: this.constant.TAB1
                    }, {
                        text: "FineIndex更新",
                        value: this.constant.TAB2,
                        ref: function (ref) {
                            self.fineIndexTab = ref;
                        }
                    }], {
                        type: "bi.text_button",
                        cls: "bi-list-item-active",
                        height: 50
                    }),
                    height: 50
                },
                cardCreator: BI.bind(this.cardCreator, this)
            };
        },

        cardCreator: function (v) {
            switch (v) {
                case this.constant.TAB1:
                    return {
                        type: "demo.fix_scene_data_manager",
                        data: this.model
                    };
                case this.constant.TAB2:
                    return {
                        type: "demo.fix_scene_fine_index_update"
                    };
            }
        }
    });
    BI.shortcut("demo.fix_scene", Demo.FixScene);

    Demo.FixSceneDataManager = BI.inherit(BI.Widget, {
        _store: function () {
            return this.options.data;
        },

        watch: {
            "*.name": function () {

            }
        },

        render: function () {
            var items = [];
            BI.each(this.model.groups, function (i, group) {
                items.push({
                    type: "demo.fix_scene_group",
                    group: group
                });
            });

            return {
                type: "bi.vertical",
                items: [{
                    type: "bi.left",
                    items: BI.createItems([{
                        text: "分组名"
                    }, {
                        text: "业务包名"
                    }, {
                        text: "表名"
                    }, {
                        text: "字段名"
                    }], {
                        type: "bi.label",
                        cls: "layout-bg1",
                        width: 150
                    })

                }, {
                    type: "bi.vertical",
                    items: items
                }],
                vgap: 20,
                hgap: 20
            };
        }

    });
    BI.shortcut("demo.fix_scene_data_manager", Demo.FixSceneDataManager);

    Demo.FixSceneGroup = BI.inherit(BI.Widget, {
        props: {
            group: {}
        },

        _store: function () {
            return this.options.group;
        },

        render: function () {
            var self = this;
            var items = [];
            BI.each(this.model.packages, function (i, child) {
                items.push({
                    type: "demo.fix_scene_package",
                    pack: child
                });
            });
            return {
                type: "bi.left",
                items: [{
                    type: "bi.sign_editor",
                    cls: "bi-border-bottom",
                    width: 100,
                    height: 30,
                    value: this.model.name,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            self.model.name = this.getValue();
                        }
                    }]
                }, {
                    type: "bi.vertical",
                    items: items
                }],
                hgap: 20
            };
        }
    });
    BI.shortcut("demo.fix_scene_group", Demo.FixSceneGroup);


    Demo.FixScenePackage = BI.inherit(BI.Widget, {
        props: {
            pack: {}
        },

        _store: function () {
            return this.options.pack;
        },

        render: function () {
            var self = this;
            var items = [];
            BI.each(this.model.tables, function (i, child) {
                items.push({
                    type: "demo.fix_scene_table",
                    table: child
                });
            });
            return {
                type: "bi.left",
                items: [{
                    type: "bi.sign_editor",
                    cls: "bi-border-bottom",
                    width: 100,
                    height: 30,
                    value: this.model.name,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            self.model.name = this.getValue();
                        }
                    }]
                }, {
                    type: "bi.vertical",
                    items: items
                }],
                hgap: 20
            };
        }
    });
    BI.shortcut("demo.fix_scene_package", Demo.FixScenePackage);

    Demo.FixSceneTable = BI.inherit(BI.Widget, {
        props: {
            table: {}
        },

        _store: function () {
            return this.options.table;
        },

        render: function () {
            var self = this;
            var items = [];
            BI.each(this.model.fields, function (i, child) {
                items.push({
                    type: "demo.fix_scene_field",
                    field: child
                });
            });
            return {
                type: "bi.left",
                items: [{
                    type: "bi.sign_editor",
                    cls: "bi-border-bottom",
                    width: 100,
                    height: 30,
                    value: this.model.name,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            self.model.name = this.getValue();
                        }
                    }]
                }, {
                    type: "bi.vertical",
                    items: items
                }],
                hgap: 20
            };
        }
    });
    BI.shortcut("demo.fix_scene_table", Demo.FixSceneTable);

    Demo.FixSceneField = BI.inherit(BI.Widget, {
        props: {
            field: {}
        },

        _store: function () {
            return this.options.field;
        },

        render: function () {
            var self = this;
            return {
                type: "bi.center_adapt",
                items: [{
                    type: "bi.sign_editor",
                    cls: "bi-border-bottom",
                    width: 100,
                    height: 30,
                    value: this.model.name,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            self.model.name = this.getValue();
                        }
                    }]
                }]
            };
        }
    });
    BI.shortcut("demo.fix_scene_field", Demo.FixSceneField);

    Demo.FixSceneFineIndexUpdateStore = BI.inherit(Fix.Model, {
        _init: function () {
            this.fineIndexUpdate = model.fineIndexUpdate;
        },
        computed: {
            text: function () {
                return "立即更新（上次更新时间：" + BI.date2Str(new Date(this.fineIndexUpdate.lastUpdate), "yyyy-MM-dd HH:mm:ss") + "）";
            },
            needUpdate: function () {
                return this.fineIndexUpdate.needUpdate;
            }
        },
        actions: {
            updateFineIndex: function () {
                this.fineIndexUpdate.needUpdate = false;
                this.fineIndexUpdate.lastUpdate = new Date().getTime();
            }
        }
    });

    Demo.FixSceneFineIndexUpdate = BI.inherit(BI.Widget, {
        _store: function () {
            return new Demo.FixSceneFineIndexUpdateStore();
        },

        watch: {
            needUpdate: function () {
                this.button.setEnable(this.model.needUpdate);
            },
            text: function () {
                this.button.setText(this.model.text);
            }
        },

        render: function () {
            var self = this;
            return {
                type: "bi.center_adapt",
                items: [{
                    type: "bi.button",
                    text: this.model.text,
                    disabled: !this.model.needUpdate,
                    height: 30,
                    width: 360,
                    handler: function () {
                        self.store.updateFineIndex();
                    },
                    ref: function (ref) {
                        self.button = ref;
                    }
                }]
            };
        }
    });
    BI.shortcut("demo.fix_scene_fine_index_update", Demo.FixSceneFineIndexUpdate);

})();(function () {
    var State = BI.inherit(Fix.Model, {
        state: function () {
            return {
                name: "原始属性"
            };
        },
        computed: {
            b: function () {
                return this.model.name + "-计算属性";
            }
        }
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return new State();
        },
        watch: {
            b: function () {
                this.button.setText(this.model.b);
            }
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.button",
                        ref: function () {
                            self.button = this;
                        },
                        handler: function () {
                            self.model.name = "这是改变后的属性";
                        },
                        text: this.model.b
                    }
                }]
            };
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix_state", Demo.Fix);
}());(function () {
    var model = Fix.define({
        name: "原始属性",
        arr: [{
            n: "a"
        }, {
            n: "b"
        }]
    });

    var Store = BI.inherit(Fix.Model, {
        _init: function () {
        },
        computed: {
            b: function () {
                return model.name + "-计算属性";
            }
        },
        actions: {
            run: function () {
                model.name = "这是改变后的属性";
            }
        }
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return new Store();
        },
        watch: {
            b: function () {
                this.button.setText(this.model.b);
            }
        },
        render: function () {
            var self = this;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.button",
                        ref: function () {
                            self.button = this;
                        },
                        handler: function () {
                            self.store.run();
                        },
                        text: this.model.b
                    }
                }]
            };
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix_store", Demo.Fix);
}());(function () {
    var model = Fix.define({
        name: "原始属性",
        arr: [{
            n: "a"
        }, {
            n: 0
        }]
    });

    Demo.Fix = BI.inherit(BI.Widget, {
        _store: function () {
            return model;
        },
        watch: {
            "name||arr.1.n": function () {
                this.button.setText(this.model.name + "-" + this.model.arr[1].n);
            }
        },
        render: function () {
            var self = this;
            var cnt = 0;
            return {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.button",
                        ref: function () {
                            self.button = this;
                        },
                        handler: function () {
                            if (cnt & 1) {
                                self.model.name += 1;
                            } else {
                                self.model.arr[1].n += 1;
                            }
                            cnt++;
                        },
                        text: this.model.name + "-" + this.model.arr[1].n
                    }
                }]
            };
        },
        mounted: function () {


        }
    });

    BI.shortcut("demo.fix_watcher", Demo.Fix);
}());Demo.Main = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-main bi-background"
    },

    _store: function () {
        return BI.Stores.getStore("demo.store.main");
    },

    watch: {
        activeCard: function (v) {
            this.center.setValue(v);
        }
    },

    beforeInit: function (cb) {
        this.store.init(cb);
    },

    render: function () {
        var self = this;
        return {
            type: "bi.border",
            items: {
                north: {
                    height: 50,
                    el: {
                        type: "demo.north",
                        listeners: [{
                            eventName: Demo.North.EVENT_VALUE_CHANGE,
                            action: function (v) {
                                self.store.handleTreeSelectChange(v);
                            }
                        }]
                    }
                },
                west: {
                    width: 230,
                    el: {
                        type: "demo.west",
                        listeners: [{
                            eventName: Demo.West.EVENT_VALUE_CHANGE,
                            action: function (v) {
                                self.store.handleTreeSelectChange(v);
                            }
                        }]
                    }
                },
                center: {
                    el: {
                        type: "demo.center",
                        ref: function (_ref) {
                            self.center = _ref;
                        }
                    }
                }
            }
        };
    }
});
BI.shortcut("demo.main", Demo.Main);!(function () {
    var Store = BI.inherit(Fix.Model, {
        _init: function () {

        },

        state: function () {
            return {
                activeCard: Demo.showIndex
            };
        },

        computed: {},

        watch: {},

        actions: {
            init: function (cb) {
                var tree = BI.Tree.transformToTreeFormat(Demo.CONFIG);
                var traversal = function (array, callback) {
                    var t = [];
                    BI.some(array, function (i, item) {
                        var match = callback(i, item);
                        if (match) {
                            t.push(item.id);
                        }
                        var b = traversal(item.children, callback);
                        if (BI.isNotEmptyArray(b)) {
                            t = BI.concat([item.id], b);
                        }
                    });
                    return t;
                };
                var paths = traversal(tree, function (index, node) {
                    if (!node.children || BI.isEmptyArray(node.children)) {
                        if (node.value === Demo.showIndex) {
                            return true;
                        }
                    }
                });
                BI.each(Demo.CONFIG, function (index, item) {
                    if (BI.contains(paths, item.id)) {
                        item.open = true;
                    }
                });

                cb();
            },

            handleTreeSelectChange: function (v) {
                this.model.activeCard = v;
                var matched = BI.some(Demo.CONFIG, function (index, item) {
                    if (item.value === v) {
                        BI.history.navigate(item.text, {trigger: true});
                        return true;
                    }
                });
                if (!matched) {
                    BI.history.navigate("", {trigger: true});
                }
            }
        }
    });
    BI.store("demo.store.main", Store);
})();Demo.North = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-north"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.htape",
            items: [{
                width: 230,
                el: {
                    type: "bi.text_button",
                    listeners: [{
                        eventName: BI.Button.EVENT_CHANGE,
                        action: function () {
                            self.fireEvent(Demo.North.EVENT_VALUE_CHANGE, "demo.face");
                        }
                    }],
                    cls: "logo",
                    height: 50,
                    text: "FineUI2.0"
                }
            }, {
                el: {
                    type: "bi.right",
                    hgap: 10,
                    items: [{
                        type: "bi.text_button",
                        text: "星空蓝",
                        handler: function () {
                            BI.$("html").removeClass("bi-theme-default").addClass("bi-theme-dark");
                        }
                    }, {
                        type: "bi.text_button",
                        text: "典雅白",
                        handler: function () {
                            BI.$("html").removeClass("bi-theme-dark").addClass("bi-theme-default");
                        }
                    }]
                }
            }]
        };
    }
});
Demo.North.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
BI.shortcut("demo.north", Demo.North);Demo.Preview = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-preview"
    },
    render: function () {
        var self = this;
        var items = [], header = [], columnSize = [];

        var rowCount = 100, columnCount = 100;
        for (var i = 0; i < 1; i++) {
            header[i] = [];
            for (var j = 0; j < columnCount; j++) {
                header[i][j] = {
                    type: "bi.label",
                    text: "表头" + i + "-" + j
                };
                columnSize[j] = 100;
            }
        }
        for (var i = 0; i < rowCount; i++) {
            items[i] = [];
            for (var j = 0; j < columnCount; j++) {
                items[i][j] = {
                    type: "bi.label",
                    text: (i < 3 ? 0 : i) + "-" + j
                };
            }
        }
        return {
            type: "bi.absolute",
            cls: "preview-background",
            items: [{
                el: {
                    type: "bi.vtape",
                    cls: "preview-card bi-card",
                    items: [{
                        el: {
                            type: "bi.label",
                            cls: "preview-title bi-border-bottom",
                            height: 40,
                            text: "Card",
                            hgap: 10,
                            textAlign: "left"
                        },
                        height: 40
                    }, {
                        type: "bi.center_adapt",
                        scrollable: true,
                        items: [{
                            type: "bi.resizable_table",
                            el: {
                                type: "bi.collection_table"
                            },
                            width: 500,
                            height: 400,
                            isResizeAdapt: true,
                            isNeedResize: true,
                            isNeedMerge: true,
                            mergeCols: [0, 1],
                            mergeRule: function (col1, col2) {
                                return BI.isEqual(col1, col2);
                            },
                            isNeedFreeze: true,
                            freezeCols: [0, 1],
                            columnSize: columnSize,
                            items: items,
                            header: header
                        }]
                    }]
                },
                left: 60,
                right: 60,
                top: 60,
                bottom: 60
            }]
        };
    },
    mounted: function () {
    }
});
BI.shortcut("demo.preview", Demo.Preview);Demo.West = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-west bi-border-right bi-card"
    },

    mounted: function () {
        this.searcher.setAdapter(this.tree);
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                type: "bi.center_adapt",
                items: [{
                    type: "bi.searcher",
                    el: {
                        type: "bi.search_editor",
                        watermark: "简单搜索"
                    },
                    width: 200,
                    isAutoSearch: false,
                    isAutoSync: false,
                    ref: function (ref) {
                        self.searcher = ref;
                    },
                    popup: {
                        type: "bi.multilayer_single_level_tree",
                        cls: "bi-card",
                        listeners: [{
                            eventName: BI.MultiLayerSingleLevelTree.EVENT_CHANGE,
                            action: function (v) {
                                self.fireEvent(Demo.West.EVENT_VALUE_CHANGE, v);
                            }
                        }]
                    },
                    onSearch: function (op, callback) {
                        var result = BI.Func.getSearchResult(Demo.CONFIG, op.keyword, "text");
                        var items = result.match.concat(result.find);
                        callback(items);
                    }
                }],
                height: 40
            }, {
                type: "bi.multilayer_single_level_tree",
                listeners: [{
                    eventName: BI.MultiLayerSingleLevelTree.EVENT_CHANGE,
                    action: function (v) {
                        self.fireEvent(Demo.West.EVENT_VALUE_CHANGE, v);
                    }
                }],
                value: Demo.showIndex,
                items: Demo.CONFIG,
                ref: function (ref) {
                    self.tree = ref;
                }
            }]
        };
    }
});
Demo.West.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
BI.shortcut("demo.west", Demo.West);/**
 * Created by Dailer on 2017/7/25.
 */


Demo.Buttons = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: "bi.button",
                    text: "一般按钮",
                    level: "common",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "带图标的按钮",
                    // level: 'ignore',
                    iconCls: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "一般按钮",
                    block: true,
                    level: "common",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "一般按钮",
                    clear: true,
                    level: "common",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.multi_select_bar",
                    selected: true,
                    halfSelected: true
                }
            }, {
                el: {
                    type: "bi.multi_select_bar",
                    selected: true,
                    halfSelected: false
                }
            }, {
                el: {
                    type: "bi.multi_select_bar",
                    selected: false,
                    halfSelected: true
                }
            }, {
                el: {
                    type: "bi.multi_select_bar"
                }
            }
        ];
        BI.each(items, function (i, item) {
            item.el.handler = function () {
                BI.Msg.alert("按钮", this.options.text);
            };
        });
        return {
            type: "bi.left",
            vgap: 100,
            hgap: 20,
            items: items
        };
    }
});
BI.shortcut("demo.buttons", Demo.Buttons);/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Items = BI.inherit(BI.Widget, {

    render: function () {

        return {
            type: "bi.vertical",
            items: [{
                type: "bi.text_button",
                cls: "bi-list-item-select bi-high-light-border bi-border",
                height: 30,
                level: "warning",
                text: "单选item"
            }, {
                type: "bi.single_select_item",
                text: "单选项"
            }, {
                type: "bi.single_select_radio_item",
                text: "单选项"
            }, {
                type: "bi.label",
                height: 30,
                text: "复选item"
            }, {
                type: "bi.multi_select_item",
                text: "复选项"
            }, {
                type: "bi.switch",
                selected: true
            }],
            hgap: 300
        };
    }
});


BI.shortcut("demo.items", Demo.Items);/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Nodes = BI.inherit(BI.Widget, {

    render: function (vessel) {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "十字形的节点"
            }, {
                type: "bi.plus_group_node",
                text: "十字形的节点"
            }, {
                type: "bi.label",
                height: 30,
                text: "箭头节点"
            }, {
                type: "bi.arrow_group_node",
                text: "箭头节点"
            }, {
                type: "bi.icon_arrow_node",
                iconCls: "search-font",
                text: "箭头图标节点"
            }, {
                type: "bi.multilayer_icon_arrow_node",
                layer: 2
            }]
        };
    }
});

BI.shortcut("demo.nodes", Demo.Nodes);/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Segments = BI.inherit(BI.Widget, {

    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "默认风格"
            }, {
                type: "bi.segment",
                items: [{
                    text: "tab1",
                    value: 1,
                    selected: true
                }, {
                    text: "tab2",
                    value: 2
                }, {
                    text: "tab3 disabled",
                    disabled: true,
                    value: 3
                }]
            }],
            hgap: 50,
            vgap: 20
        };
    }
});

BI.shortcut("demo.segments", Demo.Segments);/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Tips = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tips"
    },
    render: function () {
        var btns = [];
        var bubble = BI.createWidget({
            type: "bi.left",
            items: [{
                el: {
                    type: "bi.button",
                    text: "bubble测试",
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble1", "bubble测试", this);
                        btns.push("singleBubble1");
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "bubble测试(居中显示)",
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble2", "bubble测试", this, {
                            offsetStyle: "center"
                        });
                        btns.push("singleBubble2");
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "bubble测试(右边显示)",
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble3", "bubble测试", this, {
                            offsetStyle: "right"
                        });
                        btns.push("singleBubble3");
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "隐藏所有 bubble",
                    height: 30,
                    cls: "layout-bg2",
                    handler: function () {
                        BI.each(btns, function (index, value) {
                            BI.Bubbles.hide(value);
                        });
                    }
                }
            }],
            hgap: 20
        });

        var title = BI.createWidget({
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                cls: "layout-bg1",
                height: 50,
                title: "title提示",
                text: "移上去有title提示",
                textAlign: "center"
            }, {
                type: "bi.label",
                cls: "layout-bg6",
                height: 50,
                disabled: true,
                warningTitle: "title错误提示",
                text: "移上去有title错误提示",
                textAlign: "center"
            }, {
                type: "bi.label",
                cls: "layout-bg2",
                height: 50,
                disabled: true,
                tipType: "success",
                title: "自定义title提示效果",
                warningTitle: "自定义title提示效果",
                text: "自定义title提示效果",
                textAlign: "center"
            }],
            hgap: 20,
            vgap: 20
        });

        var toast = BI.createWidget({
            type: "bi.vertical",
            items: [{
                el: {
                    type: "bi.button",
                    text: "简单Toast测试",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条简单的数据");
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "很长的Toast测试",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的数据");
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "非常长的Toast测试",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长的数据");
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "错误提示Toast测试",
                    level: "warning",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("错误提示Toast测试", "warning");
                    }
                }
            }],
            vgap: 20
        });

        return {
            type: "bi.horizontal_auto",
            vgap: 20,
            hgap: 20,
            items: [bubble, title, toast]
        };
    }
});
BI.shortcut("demo.tips", Demo.Tips);Demo.DatePane = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-datepane"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.vertical",
                vgap: 10,
                items: [{
                    type: "bi.label",
                    cls: "layout-bg2",
                    text: "bi.date_pane"
                }, {
                    type: "bi.dynamic_date_pane",
                    // value: {
                    //     type: 1,
                    //     value: {
                    //         year: 2017,
                    //         month: 12,
                    //         day: 11
                    //     }
                    // },
                    ref: function (_ref) {
                        self.datepane = _ref;
                    },
                    height: 300
                }, {
                    type: "bi.button",
                    text: "getValue",
                    handler: function () {
                        BI.Msg.toast("date" + JSON.stringify(self.datepane.getValue()));
                    }
                }, {
                    type: "bi.dynamic_date_time_pane",
                    value: {
                        type: 1,
                        value: {
                            year: 2017,
                            month: 12,
                            day: 11,
                            hour: 12,
                            minute: 12,
                            second: 12
                        }
                    },
                    ref: function (_ref) {
                        self.dateTimePane = _ref;
                    },
                    height: 340
                }, {
                    type: "bi.button",
                    text: "getValue",
                    handler: function () {
                        BI.Msg.toast("date" + JSON.stringify(self.dateTimePane.getValue()));
                    }
                }, {
                    type: "bi.button",
                    text: "setValue '2017-12-31'",
                    handler: function () {
                        self.datepane.setValue({
                            year: 2017,
                            month: 12,
                            day: 31
                        });
                    }
                }
                ],
                width: "50%"
            }]
        };
    },

    mounted: function () {
        this.datepane.setValue();// 不设value值表示当前时间
    }
});

BI.shortcut("demo.date_pane", Demo.DatePane);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Date = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-date"
    },

    _init: function () {
        Demo.Date.superclass._init.apply(this, arguments);
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            vgap: 20,
            items: [{
                type: "bi.dynamic_date_combo",
                ref: function () {
                    self.datecombo = this;
                },
                width: 300,
                // allowEdit: false,
                // format: "%Y-%X-%d", // yyyy-MM-dd
                // format: "%Y/%X/%d", // yyyy/MM/dd
                // format: "%Y-%x-%e",  // yyyy-M-d
                // format: "%Y/%x/%e",  // yyyy/M/d
                // format: "%X/%d/%Y",  // MM/dd/yyyy
                // format: "%X/%e/%y",  // MM/d/yy
                // format: "%X.%d.%Y",  // MM.dd.yyyy
                // format: "%X.%e.%Y",  // MM.d.yyyy
                // format: "%X-%e-%y",  // MM.d.yyyy
                value: {
                    type: 1,
                    value: {
                        year: 2018,
                        month: 2,
                        day: 23
                    }
                }
            }, {
                type: "bi.button",
                text: "getValue",
                width: 300,
                handler: function () {
                    BI.Msg.alert("date", JSON.stringify(self.datecombo.getValue()));
                }
            }, {
                type: "bi.dynamic_date_time_combo",
                ref: function () {
                    self.datetimecombo = this;
                },
                width: 300,
                // allowEdit: false,
                // format: "%Y-%X-%d %H:%M:%S", // yyyy-MM-dd HH:mm:ss
                // format: "%Y/%X/%d %H:%M:%S", // yyyy/MM/dd HH:mm:ss
                // format: "%Y-%X-%d %I:%M:%S",  // yyyy-MM-dd hh:mm:ss
                // format: "%Y/%X/%d %I:%M:%S",  // yyyy/MM/dd hh:mm:ss
                // format: "%Y-%X-%d %H:%M:%S %p",  // yyyy-MM-dd HH:mm:ss a
                // format: "Y/%X/%d %H:%M:%S %p",  // yyyy/MM/dd HH:mm:ss a
                // format: "%Y-%X-%d %I:%M:%S %p",  // yyyy-MM-dd hh:mm:ss a
                // format: "%Y/%X/%d %I:%M:%S %p",  // yyyy/MM/dd hh:mm:ss a
                // format: "%X/%d/%Y %I:%M:%S",  // MM/dd/yyyy hh:mm:ss
                // format: "%X/%d/%Y %H:%M:%S",  // MM/dd/yyyy HH:mm:ss
                // format: "%X/%d/%Y %I:%M:%S",  // MM/dd/yyyy hh:mm:ss a
                // format: "%X/%d/%Y %H:%M:%S %p",  // MM/dd/yyyy HH:mm:ss a
                // format: "%X/%d/%Y %I:%M:%S %p",  // MM/dd/yyyy hh:mm:ss a
                // format: "%X/%d/%Y %H:%M:%S %p",  // MM/dd/yyyy HH:mm:ss a
                // format: "%X/%d/%Y %l:%M %p",  // MM/dd/yyyy h:mm a
                // format: "%X-%d-%Y %k:%M %p",  // MM/dd/yyyy H:mm a
                // format: "%Y-%x-%e %l:%M",  // yyyy-M-d h:mm
                // format: "%Y-%x-%e %k:%M",  // yyyy-M-d H:mm
                value: {
                    type: 1,
                    value: {
                        year: 2018,
                        month: 2,
                        day: 23
                    }
                }
            }, {
                type: "bi.button",
                text: "getValue",
                width: 300,
                handler: function () {
                    BI.Msg.alert("date", JSON.stringify(self.datetimecombo.getValue()));
                }
            }, {
                type: "bi.button",
                text: "setValue '2017-12-31'",
                width: 300,
                handler: function () {
                    self.datecombo.setValue({
                        year: 2017,
                        month: 11,
                        day: 31
                    });
                }
            }]
        };
    }
});

BI.shortcut("demo.multidate_combo", Demo.Date);/**
 * Created by Urthur on 2017/7/18.
 */
Demo.CustomDateTime = BI.inherit(BI.Widget, {
    props: {},
    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.date_time_combo",
                    listeners: [{
                        eventName: BI.DateTimeCombo.EVENT_CONFIRM,
                        action: function () {
                            var value = this.getValue();
                            var date = new Date(value.year, value.month - 1, value.day, value.hour, value.minute, value.second);
                            var dateStr = BI.print(date, "%Y-%X-%d %H:%M:%S");
                            BI.Msg.alert("日期", dateStr);
                        }
                    }, {
                        eventName: BI.DateTimeCombo.EVENT_CANCEL,
                        action: function () {
                        }
                    }],
                    value: {
                        year: 2017,
                        month: 2,
                        day: 23,
                        hour: 12,
                        minute: 11,
                        second: 1
                    }
                },
                top: 200,
                left: 200
            }]
        };
    }
});
BI.shortcut("demo.date_time", Demo.CustomDateTime);Demo.Downlist = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-downlist"
    },

    mounted: function () {
        var downlist = this.downlist;
        var label = this.label;
        this.downlist.setValue([{
            value: [11, 6],
            childValue: 67
        }]);
        downlist.on(BI.DownListCombo.EVENT_CHANGE, function (value, fatherValue) {
            label.setValue(JSON.stringify(downlist.getValue()));
        });

        this.downlist.on(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, function (value, fatherValue) {
            label.setValue(JSON.stringify(downlist.getValue()));
        });
    },


    render: function () {
        var self = this;
        // test
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.down_list_combo",
                ref: function (_ref) {
                    self.downlist = _ref;
                },
                // value: [{"childValue":22,"value":11},{"value":18},{"value":20}],
                height: 30,
                width: 100,
                items: [
                    [{
                        el: {
                            text: "column 1111",
                            iconCls1: "dot-e-font",
                            value: 12
                        },
                        children: [{
                            text: "column 1.1",
                            value: 21,
                            cls: "dot-e-font"
                        }, {
                            text: "column 1.2",
                            value: 22,
                            cls: "dot-e-font"
                        }]
                    }],
                    [{
                        el: {
                            text: "column 1111",
                            iconCls1: "dot-e-font",
                            value: 11
                        },
                        children: [{
                            text: "column 1.1",
                            value: 21,
                            cls: "dot-e-font"
                        }, {
                            text: "column 1.2",
                            value: 22,
                            cls: "dot-e-font"
                        }]
                        // children: [{
                        //     text: BI.i18nText("BI-Basic_None"),
                        //     cls: "dot-e-font",
                        //     value: 1
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Calculate_Same_Period"),
                        //     cls: "dot-e-font",
                        //     value: 2
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Calculate_Same_Ring"),
                        //     cls: "dot-e-font",
                        //     value: 3
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Calculate_Same_Period_Rate"),
                        //     cls: "dot-e-font",
                        //     value: 4
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Calculate_Same_Ring_Rate"),
                        //     cls: "dot-e-font",
                        //     value: 5
                        // }, {
                        //     el: {
                        //         text: BI.i18nText("BI-Basic_Rank"),
                        //         iconCls1: "dot-e-font",
                        //         value: 6
                        //     },
                        //     children: [{
                        //         text: "test1",
                        //         cls: "dot-e-font",
                        //         value: 67
                        //     }, {
                        //         text: "test2",
                        //         cls: "dot-e-font",
                        //         value: 68
                        //     }]
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Rank_In_Group"),
                        //     cls: "dot-e-font",
                        //     value: 7
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Sum_Of_All"),
                        //     cls: "dot-e-font",
                        //     value: 8
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Sum_Of_All_In_Group"),
                        //     cls: "dot-e-font",
                        //     value: 9
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Sum_Of_Above"),
                        //     cls: "dot-e-font",
                        //     value: 10
                        // }, {
                        //     text: BI.i18nText("BI-Basic_Sum_Of_Above_In_Group"),
                        //     cls: "dot-e-font",
                        //     value: 11
                        // }, {
                        //     text: BI.i18nText("BI-Design_Current_Dimension_Percent"),
                        //     cls: "dot-e-font",
                        //     value: 12
                        // }, {
                        //     text: BI.i18nText("BI-Design_Current_Target_Percent"),
                        //     cls: "dot-e-font",
                        //     value: 13
                        // }]
                    }]

                ]
            }, {
                type: "bi.multi_layer_down_list_combo",
                ref: function (_ref) {
                    self.downlist = _ref;
                },
                // value: [{"childValue":22,"value":11},{"value":18},{"value":20}],
                height: 30,
                width: 100,
                items: [
                    [{
                        el: {
                            text: "column 1111",
                            iconCls1: "dot-e-font",
                            value: 12
                        },
                        children: [{
                            text: "column 1.1",
                            value: 21,
                            cls: "dot-e-font"
                        }, {
                            text: "column 1.2",
                            value: 22,
                            cls: "dot-e-font"
                        }]
                    }],
                    [{
                        el: {
                            text: "column 1111",
                            iconCls1: "dot-e-font",
                            value: 11
                        },
                        children: [{
                            text: "column 1.1",
                            value: 21,
                            cls: "dot-e-font"
                        }, {
                            text: "column 1.2",
                            value: 22,
                            cls: "dot-e-font"
                        }]
                    }]

                ]

            }, {
                type: "bi.label",
                text: "显示选择值",
                width: 500,
                cls: "layout-bg3",
                ref: function (_ref) {
                    self.label = _ref;
                }
            }],
            vgap: 20
        };
    },
});

BI.shortcut("demo.down_list", Demo.Downlist);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.SearchEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.search_editor",
                width: 300,
                watermark: "添加合法性判断",
                errorText: "长度必须大于4",
                validationChecker: function () {
                    return this.getValue().length > 4;
                }
            }, {
                type: "bi.small_search_editor",
                width: 300,
                watermark: "这个是 small,小一号"
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.search_editor", Demo.SearchEditor);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.text_editor",
                watermark: "这是水印,watermark",
                width: 300
            }, {
                type: "bi.text_editor",
                watermark: "这个不予许空",
                allowBlank: false,
                errorText: "非空!",
                width: 300
            }],
            vgap: 20

        };
    }
});

BI.shortcut("demo.text_editor", Demo.TextEditor);/**
 * Created by User on 2017/3/22.
 */
Demo.MultiSelectCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-multi-select-combo"
    },

    _createMultiSelectCombo: function () {
        var self = this;
        var widget = BI.createWidget({
            type: "bi.multi_select_insert_combo",
            // allowEdit: false,
            itemsCreator: BI.bind(this._itemsCreator, this),
            width: 200,
            value: {
                type: 1,
                value: ["柳州市城贸金属材料有限责任公司", "柳州市建福房屋租赁有限公司", "柳州市迅昌数码办公设备有限责任公司"]
            }
        });

        widget.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            BI.Msg.toast(JSON.stringify(this.getValue()));
        });

        return widget;
    },

    _getItemsByTimes: function (items, times) {
        var res = [];
        for (var i = (times - 1) * 100; items[i] && i < times * 100; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * 100 < items.length;
    },

    _itemsCreator: function (options, callback) {
        var self = this;
        var items = Demo.CONSTANTS.ITEMS;
        var keywords = (options.keywords || []).slice();
        if (options.keyword) {
            keywords.push(options.keyword);
        }
        BI.each(keywords, function (i, kw) {
            var search = BI.Func.getSearchResult(items, kw);
            items = search.match.concat(search.find);
        });
        if (options.selectedValues) {// 过滤
            var filter = BI.makeObject(options.selectedValues, true);
            items = BI.filter(items, function (i, ob) {
                return !filter[ob.value];
            });
        }
        if (options.type == BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
            callback({
                items: items
            });
            return;
        }
        if (options.type == BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
            callback({count: items.length});
            return;
        }
        BI.delay(function () {
            callback({
                items: self._getItemsByTimes(items, options.times),
                hasNext: self._hasNextByTimes(items, options.times)
            });
        }, 1000);
    },

    render: function () {
        return {
            type: "bi.absolute",
            scrolly: false,
            items: [{
                el: this._createMultiSelectCombo(),
                right: "50%",
                top: 10
            }]
        };
    }
});
BI.shortcut("demo.multi_select_combo", Demo.MultiSelectCombo);/**
 * Created by User on 2017/3/22.
 */
Demo.MultiSelectList = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-multi-select-combo"
    },

    mounted: function () {
        this.list.populate();
    },

    _createMultiSelectCombo: function () {
        var self = this;
        var widget = BI.createWidget({
            type: "bi.multi_select_insert_list",
            ref: function (ref) {
                self.list = ref;
            },
            itemsCreator: BI.bind(this._itemsCreator, this),
            value: {
                type: 1,
                value: ["柳州市城贸金属材料有限责任公司", "柳州市建福房屋租赁有限公司", "柳州市迅昌数码办公设备有限责任公司"]
            }
        });

        widget.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            BI.Msg.toast(JSON.stringify(this.getValue()));
        });

        return widget;
    },

    _getItemsByTimes: function (items, times) {
        var res = [];
        for (var i = (times - 1) * 10; items[i] && i < times * 10; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * 10 < items.length;
    },

    _itemsCreator: function (options, callback) {
        var self = this;
        var items = Demo.CONSTANTS.ITEMS;
        var keywords = (options.keywords || []).slice();
        if (options.keyword) {
            keywords.push(options.keyword);
        }
        BI.each(keywords, function (i, kw) {
            var search = BI.Func.getSearchResult(items, kw);
            items = search.match.concat(search.find);
        });
        if (options.selectedValues) {// 过滤
            var filter = BI.makeObject(options.selectedValues, true);
            items = BI.filter(items, function (i, ob) {
                return !filter[ob.value];
            });
        }
        if (options.type == BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
            callback({
                items: items
            });
            return;
        }
        if (options.type == BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
            callback({count: items.length});
            return;
        }
        BI.delay(function () {
            callback({
                items: self._getItemsByTimes(items, options.times),
                hasNext: self._hasNextByTimes(items, options.times)
            });
        }, 1000);
    },

    render: function () {
        return {
            type: "bi.absolute",
            scrolly: false,
            items: [{
                el: this._createMultiSelectCombo(),
                top: 50,
                left: 50,
                right: 50,
                bottom: 50
            }]
        };
    }
});
BI.shortcut("demo.multi_select_list", Demo.MultiSelectList);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.MultiTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.multi_tree_combo",
                ref: function (_ref) {
                    self.tree = _ref;
                },
                itemsCreator: function (options, callback) {
                    console.log(options);
                    // 根据不同的类型处理相应的结果
                    switch (options.type) {
                        case BI.TreeView.REQ_TYPE_INIT_DATA:
                            break;
                        case BI.TreeView.REQ_TYPE_ADJUST_DATA:
                            break;
                        case BI.TreeView.REQ_TYPE_SELECT_DATA:
                            break;
                        case BI.TreeView.REQ_TYPE_GET_SELECTED_DATA:
                            break;
                        default :
                            break;
                    }
                    callback({
                        items: items
                    });
                },
                width: 300,
                value: {
                    "根目录": {}
                }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.tree.getValue()));
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.multi_tree_combo", Demo.MultiTreeCombo);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.MultiTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    mounted: function () {
        this.tree.populate();
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.multi_select_tree",
                    ref: function (_ref) {
                        self.tree = _ref;
                    },
                    itemsCreator: function (options, callback) {
                        console.log(options);
                        // 根据不同的类型处理相应的结果
                        switch (options.type) {
                            case BI.TreeView.REQ_TYPE_INIT_DATA:
                                break;
                            case BI.TreeView.REQ_TYPE_ADJUST_DATA:
                                break;
                            case BI.TreeView.REQ_TYPE_SELECT_DATA:
                                break;
                            case BI.TreeView.REQ_TYPE_GET_SELECTED_DATA:
                                break;
                            default :
                                break;
                        }
                        callback({
                            items: BI.deepClone(items)
                        });
                    },
                    width: 300,
                    value: {
                        "根目录": {}
                    }
                },
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }, {
                el: {
                    type: "bi.button",
                    height: 30,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.toast(JSON.stringify(self.tree.getValue()));
                    }
                },
                left: 50,
                right: 50,
                bottom: 20
            }]
        };
    }
});

BI.shortcut("demo.multi_select_tree", Demo.MultiTreeCombo);/* 文件管理导航
 Created by dailer on 2017 / 7 / 21.
 */
Demo.FileManager = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var editor = BI.createWidget({
            type: "bi.number_editor",
            validationChecker: function (v) {
                return BI.parseFloat(v) <= 100 && BI.parseFloat(v) >= 0;
            },
            height: 24,
            width: 150,
            errorText: "hahah"
        });
        editor.on(BI.NumberEditor.EVENT_CHANGE, function () {
            if (BI.parseFloat(this.getValue()) < 1) {
                editor.setDownEnable(false);
            } else {
                editor.setDownEnable(true);
            }
            BI.Msg.toast(editor.getValue());
        });
        return {
            type: "bi.vertical",
            items: [{
                el: editor,
                height: 24
            }]
        };
    }
});
BI.shortcut("demo.number_editor", Demo.FileManager);/**
 * Created by Dailer on 2017/7/12.
 */
Demo.NumericalInterval = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    mounted: function () {
        var numerical = this.numerical;
        var label = this.label;
        numerical.on(BI.NumberInterval.EVENT_CONFIRM, function () {
            var temp = numerical.getValue();
            var res = "大于" + (temp.closemin ? "等于 " : " ") + temp.min + " 小于" + (temp.closemax ? "等于 " : " ") + temp.max;
            label.setValue(res);
        });
    },


    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.number_interval",
                ref: function (_ref) {
                    self.numerical = _ref;
                },
                width: 500,
                value: {
                    max: 300,
                    closeMax: true,
                    closeMin: false
                }
            }, {
                type: "bi.label",
                ref: function (_ref) {
                    self.label = _ref;
                },
                text: "显示结果"
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.number_interval", Demo.NumericalInterval);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.MultiLayerSelectTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.multilayer_select_tree_combo",
                ref: function (_ref) {
                    self.tree = _ref;
                },
                text: "默认值",
                items: items,
                width: 300,
                value: ["第五级文件1"]
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(self.tree.getValue()[0]);
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setVlaue (第二级文件1)",
                handler: function () {
                    self.tree.setValue(["第二级文件1"]);
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.multilayer_select_tree_combo", Demo.MultiLayerSelectTreeCombo);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.SelectTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.LEVELTREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.select_tree_combo",
                ref: function (_ref) {
                    self.tree = _ref;
                },
                value: "11",
                text: "默认值",
                items: items,
                width: 300
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(self.tree.getValue()[0]);
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setVlaue (第二级文件1)",
                handler: function () {
                    self.tree.setValue(["2"]);
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.select_tree_combo", Demo.SelectTreeCombo);/**
 * Created by User on 2017/3/22.
 */
Demo.SingleSelectCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-single-select-combo"
    },

    _createSingleSelectCombo: function () {
        var self = this;
        var widget = BI.createWidget({
            type: "bi.single_select_insert_combo",
            itemsCreator: BI.bind(this._itemsCreator, this),
            width: 200,
            ref: function () {
                self.SingleSelectCombo = this;
            },
            value: "柳州市针织总厂"
        });

        widget.populate();

        widget.on(BI.SingleSelectCombo.EVENT_CONFIRM, function () {
            BI.Msg.toast(JSON.stringify(this.getValue()));
        });

        return widget;
    },

    _getItemsByTimes: function (items, times) {
        var res = [];
        for (var i = (times - 1) * 100; items[i] && i < times * 100; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * 100 < items.length;
    },

    _itemsCreator: function (options, callback) {
        var self = this;
        var items = Demo.CONSTANTS.ITEMS;
        var keywords = (options.keywords || []).slice();
        if (options.keyword) {
            keywords.push(options.keyword);
        }
        BI.each(keywords, function (i, kw) {
            var search = BI.Func.getSearchResult(items, kw);
            items = search.match.concat(search.find);
        });
        if (options.selectedValues) {// 过滤
            var filter = BI.makeObject(options.selectedValues, true);
            items = BI.filter(items, function (i, ob) {
                return !filter[ob.value];
            });
        }
        if (options.type == BI.SingleSelectCombo.REQ_GET_ALL_DATA) {
            callback({
                items: items
            });
            return;
        }
        if (options.type == BI.SingleSelectCombo.REQ_GET_DATA_LENGTH) {
            callback({count: items.length});
            return;
        }
        BI.delay(function () {
            callback({
                items: self._getItemsByTimes(items, options.times),
                hasNext: self._hasNextByTimes(items, options.times)
            });
        }, 1000);
    },

    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            scrolly: false,
            items: [{
                el: this._createSingleSelectCombo(),
                right: "50%",
                top: 10
            }, {
                el: {

                    type: "bi.button",
                    text: "setValue(\"柳州市针织总厂\")",
                    handler: function () {
                        self.SingleSelectCombo.setValue("柳州市针织总厂");
                    }
                }
            }]
        };
    }
});
BI.shortcut("demo.single_select_combo", Demo.SingleSelectCombo);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.MultiLayerSingleTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.multilayer_single_tree_combo",
                ref: function (_ref) {
                    self.tree = _ref;
                },
                text: "默认值",
                items: items,
                width: 300
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(self.tree.getValue()[0]);
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setVlaue (第二级文件1)",
                handler: function () {
                    self.tree.setValue(["第二级文件1"]);
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.multilayer_single_tree_combo", Demo.MultiLayerSingleTreeCombo);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.SingleTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.LEVELTREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.single_tree_combo",
                ref: function (_ref) {
                    self.tree = _ref;
                },
                text: "默认值",
                items: items,
                width: 300,
                value: "11"
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(self.tree.getValue()[0]);
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setVlaue (第二级文件1)",
                handler: function () {
                    self.tree.setValue(["2"]);
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.single_tree_combo", Demo.SingleTreeCombo);/**
 * Created by Urthur on 2017/9/4.
 */
Demo.Slider = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-slider",
        width: 300,
        height: 50,
        min: 0,
        max: 100
    },

    render: function () {
        var self = this, o = this.options;
        var singleSlider = BI.createWidget({
            type: "bi.single_slider",
            digit: 0,
            width: o.width,
            height: o.height,
            cls: "layout-bg-white"
        });

        singleSlider.setMinAndMax({
            min: 10,
            max: o.max
        });

        singleSlider.setValue(30);
        singleSlider.populate();
        singleSlider.on(BI.SingleSlider.EVENT_CHANGE, function () {
            console.log(this.getValue());
        });

        var normalSingleSlider = BI.createWidget({
            type: "bi.single_slider_normal",
            width: o.width,
            height: 30,
            cls: "layout-bg-white"
        });
        normalSingleSlider.setMinAndMax({
            min: o.min,
            max: o.max
        });
        normalSingleSlider.setValue(10);
        normalSingleSlider.populate();

        var singleSliderLabel = BI.createWidget({
            type: "bi.single_slider_label",
            width: o.width,
            height: o.height,
            digit: 0,
            unit: "个",
            cls: "layout-bg-white"
        });
        singleSliderLabel.setMinAndMax({
            min: o.min,
            max: o.max
        });
        singleSliderLabel.setValue(10);
        singleSliderLabel.populate();

        var intervalSlider = BI.createWidget({
            type: "bi.interval_slider",
            width: o.width,
            digit: 0,
            cls: "layout-bg-white"
        });
        intervalSlider.setMinAndMax({
            min: o.min,
            max: o.max
        });
        intervalSlider.setValue({
            min: 10,
            max: 120
        });
        intervalSlider.populate();

        var intervalSliderLabel = BI.createWidget({
            type: "bi.interval_slider",
            width: o.width,
            unit: "px",
            cls: "layout-bg-white",
            digit: 1
        });
        intervalSliderLabel.setMinAndMax({
            min: 0,
            max: 120
        });
        intervalSliderLabel.setValue({
            min: 10,
            max: 120
        });
        intervalSliderLabel.populate();


        return {
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.center_adapt",
                items: [{
                    el: singleSlider
                }]
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: normalSingleSlider
                }]
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: singleSliderLabel
                }]
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: intervalSlider
                }]
            }, {
                type: "bi.center_adapt",
                items: [{
                    el: intervalSliderLabel
                }]
            }],
            vgap: 20
        };
    }
});
BI.shortcut("demo.slider", Demo.Slider);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.TimeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.time_combo",
                ref: function (_ref) {
                    self.timeCombo = _ref;
                },
                // allowEdit: true,
                // format: "%H:%M:%S",  // HH:mm:ss
                // format: "%I:%M:%S",  // hh:mm:ss
                // format: "%l:%M:%S",  // h:mm:ss
                // format: "%k:%M:%S",  // H:mm:ss
                // format: "%l:%M:%S %p",  // h:mm:ss a
                // format: "%l:%M",  // h:mm
                // format: "%k:%M",  // H:mm
                // format: "%I:%M",  // hh:mm
                // format: "%H:%M",  // HH:mm
                // format: "%M:%S",  // mm:ss
                value: {
                    hour: 12,
                    minute: 0,
                    second: 0
                },
                width: 300
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.timeCombo.getValue()));
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.time_combo", Demo.TimeCombo);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.TimeInterval = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.date_interval",
                ref: function (_ref) {
                    self.dateInterval = _ref;
                },
                value: {
                    start: {
                        type: 2,
                        value: {
                            year: -1,
                            position: 2
                        }
                    },
                    end: {
                        type: 1,
                        value: {
                            year: 2018,
                            month: 1,
                            day: 12
                        }
                    }
                },
                width: 300
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.dateInterval.getValue()));
                },
                width: 300
            }, {
                type: "bi.time_interval",
                ref: function (_ref) {
                    self.interval = _ref;
                },
                value: {
                    start: {
                        type: 2,
                        value: {
                            year: -1,
                            position: 2
                        }
                    },
                    end: {
                        type: 1,
                        value: {
                            year: 2018,
                            month: 1,
                            day: 12
                        }
                    }
                },
                width: 400
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.interval.getValue()));
                },
                width: 300
            }, {
                type: "bi.time_periods",
                value: {
                    start: {
                        hour: 7,
                        minute: 23,
                        second: 14
                    },
                    end: {
                        hour: 23,
                        minute: 34,
                        second: 32
                    }
                },
                ref: function (_ref) {
                    self.periods = _ref;
                },
                width: 180
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.periods.getValue()));
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.time_interval", Demo.TimeInterval);/**
 * Created by Dailer on 2017/7/26.
 */


Demo.MultiLayerSelectLevelTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        var tree = BI.createWidget({
            type: "bi.multilayer_select_level_tree",
            items: BI.deepClone(Demo.CONSTANTS.TREE),
            value: "第五级文件1"
        });

        return {
            type: "bi.vtape",
            items: [{
                el: tree
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", JSON.stringify(tree.getValue()));
                    }
                },
                height: 25
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "setValue (第二级文件1)",
                    handler: function () {
                        tree.setValue(["第二级文件1"]);
                    }
                },
                height: 25
            }],
            width: 500,
            hgap: 300
        };
    }
});

BI.shortcut("demo.multilayer_select_level_tree", Demo.MultiLayerSelectLevelTree);/**
 * Created by Dailer on 2017/7/26.
 */


Demo.MultiLayerSingleLevelTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        this.tree = BI.createWidget({
            type: "bi.multilayer_single_level_tree",
            items: [],
            value: "第二级文件1"
        });

        return {
            type: "bi.vtape",
            items: [{
                el: this.tree
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", JSON.stringify(self.tree.getValue()));
                    }
                },
                height: 25
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "setValue (第二级文件1)",
                    handler: function () {
                        self.tree.setValue(["第二级文件1"]);
                    }
                },
                height: 25
            }],
            width: 500,
            hgap: 300
        };
    },

    mounted: function () {
        var tree = [
            // {id: -2, pId: 0, value: "根目录1", text: "根目录1"},
            {id: -1, pId: 0, value: "根目录", text: "根目录"},
            {id: 1, pId: -1, value: "第一级目录1", text: "第一级目录1"},
            {id: 11, pId: 1, value: "第二级文件1", text: "第二级文件1"},
            {id: 12, pId: 1, value: "第二级目录2", text: "第二级目录2"},
            {id: 121, pId: 12, value: "第三级目录1", text: "第三级目录1"},
            {id: 122, pId: 12, value: "第三级文件1", text: "第三级文件1"},
            {id: 1211, pId: 121, value: "第四级目录1", text: "第四级目录1"},
            {id: 2, pId: -1, value: "第一级目录2", text: "第一级目录2"},
            {id: 21, pId: 2, value: "第二级目录3", text: "第二级目录3"},
            {id: 22, pId: 2, value: "第二级文件2", text: "第二级文件2"},
            {id: 211, pId: 21, value: "第三级目录2", text: "第三级目录2"},
            {id: 212, pId: 21, value: "第三级文件2", text: "第三级文件2"},
            {id: 2111, pId: 211, value: "第四级文件1", text: "第四级文件1"},
            {id: 3, pId: -1, value: "第一级目录3", text: "第一级目录3"},
            {id: 31, pId: 3, value: "第二级文件2", text: "第二级文件2"},
            {id: 33, pId: 3, value: "第二级目录3", text: "第二级目录1"},
            {id: 32, pId: 3, value: "第二级文件3", text: "第二级文件3"},
            {id: 331, pId: 33, value: "第三级文件1", text: "第三级文件1"}
        ];
        this.tree.populate(tree);
    }
});

BI.shortcut("demo.multilayer_single_level_tree", Demo.MultiLayerSingleLevelTree);/**
 * Created by Dailer on 2017/7/26.
 */


Demo.SelectLevelTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        var tree = BI.createWidget({
            type: "bi.select_level_tree",
            items: BI.deepClone(Demo.CONSTANTS.LEVELTREE),
            value: "11"
        });

        return {
            type: "bi.vtape",
            items: [{
                el: tree
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", JSON.stringify(tree.getValue()));
                    }
                },
                height: 25
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "setValue (第二级文件1)",
                    handler: function () {
                        tree.setValue(["2"]);
                    }
                },
                height: 25
            }],
            width: 500,
            hgap: 300
        };
    }
});

BI.shortcut("demo.select_level_tree", Demo.SelectLevelTree);/**
 * Created by Dailer on 2017/7/26.
 */


Demo.SingleLevelTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        var tree = BI.createWidget({
            type: "bi.single_level_tree",
            items: BI.deepClone(Demo.CONSTANTS.LEVELTREE),
            value: "11"
        });

        return {
            type: "bi.vtape",
            items: [{
                el: tree
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", JSON.stringify(tree.getValue()));
                    }
                },
                height: 25
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "setValue (第二级文件1)",
                    handler: function () {
                        tree.setValue(["2"]);
                    }
                },
                height: 25
            }],
            width: 500,
            hgap: 300
        };
    }
});

BI.shortcut("demo.single_level_tree", Demo.SingleLevelTree);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Year = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            vgap: 10,
            items: [{
                type: "bi.dynamic_year_combo",
                width: 300,
                ref: function () {
                    self.yearcombo = this;
                },
                value: {
                    type: 1,
                    value: {
                        year: 2017
                    }
                }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.yearcombo.getValue()));
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setValue : 2018",
                handler: function () {
                    self.yearcombo.setValue(2018);
                },
                width: 300
            }],
            vgap: 10
        };
    }
});

BI.shortcut("demo.year", Demo.Year);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.YearMonthCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.dynamic_year_month_combo",
                ref: function (_ref) {
                    self.widget = _ref;
                },
                width: 300,
                // value: {
                //     type: 1,
                //     value: {
                //         year: 2018,
                //         month: 1
                //     }
                // }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.widget.getValue()));
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setValue '2017-12'",
                width: 300,
                handler: function () {
                    self.widget.setValue({
                        year: 2017,
                        month: 12
                    });
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.year_month_combo", Demo.YearMonthCombo);Demo.YearMonthInterval = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.year_month_interval",
                ref: function (_ref) {
                    self.interval = _ref;
                },
                value: {
                    start: {
                        type: 2,
                        value: {
                            year: -1,
                            month: 1
                        }
                    },
                    end: {
                        type: 1,
                        value: {
                            year: 2018,
                            month: 1
                        }
                    }
                },
                width: 400
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.interval.getValue()));
                },
                width: 300
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.year_month_interval", Demo.YearMonthInterval);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.YearQuarterCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.dynamic_year_quarter_combo",
                width: 300,
                ref: function (_ref) {
                    self.widget = _ref;
                },
                yearBehaviors: {},
                quarterBehaviors: {},
                value: {
                    type: 1,
                    value: {
                        year: 2018,
                        quarter: 1
                    }
                }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.widget.getValue()));
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setVlaue '2017 季度3'",
                width: 300,
                handler: function () {
                    self.widget.setValue({
                        year: 2017,
                        quarter: 3
                    });
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.year_quarter_combo", Demo.YearQuarterCombo);Demo.CONFIG = Demo.CORE_CONFIG.concat(Demo.BASE_CONFIG).concat(Demo.CASE_CONFIG).concat(Demo.WIDGET_CONFIG).concat(Demo.COMPONENT_CONFIG).concat(Demo.FIX_CONFIG);

Demo.CONSTANTS = {
    SIMPLE_ITEMS: BI.map("柳州市城贸金属材料有限责任公司 柳州市建福房屋租赁有限公司 柳州市迅昌数码办公设备有限责任公司 柳州市河海贸易有限责任公司 柳州市花篮制衣厂 柳州市兴溪物资有限公司 柳州市针织总厂 柳州市衡管物资有限公司 柳州市琪成机电设备有限公司 柳州市松林工程机械修理厂".match(/[^\s]+/g), function (i, v) {
        return {
            text: v,
            value: v,
            title: v
        };
    }),
    ITEMS: BI.map("柳州市城贸金属材料有限责任公司 柳州市建福房屋租赁有限公司 柳州市迅昌数码办公设备有限责任公司 柳州市河海贸易有限责任公司 柳州市花篮制衣厂 柳州市兴溪物资有限公司 柳州市针织总厂 柳州市衡管物资有限公司 柳州市琪成机电设备有限公司 柳州市松林工程机械修理厂 柳州市积玉贸易有限公司 柳州市福运来贸易有限责任公司 柳州市钢义物资有限公司 柳州市洋力化工有限公司 柳州市悦盛贸易有限公司 柳州市雁城钢管物资有限公司 柳州市恒瑞钢材经营部 柳州市科拓电子有限公司 柳州市九方电子有限公司 柳州市桂龙汽车配件厂 柳州市制鞋工厂 柳州市炜力科贸有限公司 柳州市希翼贸易有限公司 柳州市兆金物资有限公司 柳州市和润电子科技有限责任公司 柳州市汇凯贸易有限公司 柳州市好机汇商贸有限公司 柳州市泛源商贸经营部 柳州市利汇达物资有限公司 广西全民药业有限责任公司 柳州超凡物资贸易有限责任公司 柳州市贵宏物资有限责任公司 柳州昊恒贸易有限责任公司 柳州市浦联物资有限公司 柳州市广通园林绿化工程有限责任公司 柳州市松发物资贸易有限责任公司 柳州市奥士达办公设备有限责任公司 柳州市海泰物资有限公司 柳州市金三环针织厂 柳州市钢贸物资有限公司 柳州市明阳纺织有限公司 柳州市世科科技发展有限公司 柳州市禄羊贸易有限公司 柳州市金兆阳商贸有限公司 柳州市汇昌物资经营部 柳州市林泰金属物资供应站 柳州市自来水管道材料设备公司 柳州市丹柳铝板有限公司 柳州市桂冶物资有限公司 柳州市宸业物资经营部 柳州市耀成贸易有限公司 柳州奥易自动化科技有限公司 柳州市萃丰科技有限责任公司 柳州市华储贸易有限责任公司 柳州市黄颜钢材有限责任公司 柳州市银盛物资有限责任公司 柳州市新仪化玻供应站 柳州市晶凯化工有限公司 广西柳州市柳江包装纸厂 柳州市志新物资有限责任公司 柳州市兆钢物资有限公司 柳州市友方科技发展有限责任公司 柳州市缝纫机台板家具总厂 柳州市晖海数码办公设备有限责任公司 柳州市富兰特服饰有限责任公司 柳州市柳北区富兴物资经营部 柳州市柳锌福利厂 柳州市海泉印刷有限责任公司 柳州市乾亨贸易有限公司 柳州市悦宁物资贸易有限公司 柳州市昊天贸易有限公司 广西惠字钢铁有限公司 柳州市名青物资有限公司 柳州市林郝物资有限公司 柳州市民政服装厂 柳州市多维劳保用品厂 柳州市轻工物资供应公司 柳州市程源物资有限责任公司 柳州市寿丰物资贸易有限责任公司 柳州市凯凡物资有限公司 柳州市利晖物资经营部 柳州市恒茂金属物资供应站 柳州市中储物资经营部 柳州市第二医疗器械厂 柳州市来鑫物资经营部 柳州市钢鑫物资贸易有限责任公司 柳州市双合袜业有限责任公司 柳州市茂松经贸有限责任公司 柳州市行行物资贸易有限公司 柳州市方一物资有限公司 柳州成异钢管销售有限公司 柳州广惠佳电脑有限公司 桂林市圣泽鑫物资有限公司柳州分公司 柳州市砼基建材贸易有限公司 柳州市海燕针织厂 上海浦光仪表厂柳州销售处 柳州市能电工贸有限责任公司 柳州市广贸物资有限公司 柳州市柳北区大昌电工灯饰经营部 柳州市金龙印务有限公司 柳州市奇缘婚典服务有限公司 柳州市盛博物资经营部 柳州市项元钢铁贸易有限公司 柳州市虞美人化妆品经营部 柳州市俊彦鞋厂 柳州市聚源特钢有限公司 柳州市迅龙科贸有限责任公司 柳州市恒飞电子有限责任公司 柳州市蓝正现代办公设备有限责任公司 柳州地区农业生产资料公司 柳州华菱钢管销售有限公司 柳州融通物资有限公司 柳州市可仁广告策划有限责任公司 柳州市鸟鑫物资有限责任公司 柳州市五丰钢材供应站 柳州市金江不锈钢有限公司 柳州市美日物资设备有限责任公司 柳州市鑫东物资贸易有限责任公司 柳州地区日用杂品公司 柳州市华纳物资贸易有限公司 柳州乾利金虹物资贸易有限责任公司 柳州市新迈计算机有限公司 柳州市富丽实业发展公司 柳州市石钢金属材料有限公司 柳州市力志传真机销售有限公司 广西宝森投资有限公司 柳州市嵘基商贸有限公司 柳州市景民商贸有限责任公司 柳州市银桥化玻有限责任公司 柳州市宏文糖烟店 柳州市科苑电脑网络有限公司 柳州市两面针旅游用品厂 柳州市立早室内装璜有限责任公司 柳州地化建材有限公司 柳州市涛达贸易有限公司 柳州市兰丰档案服务中心 柳州市惠贸物资有限责任公司 柳州市立文物资有限责任公司 柳州市致和商贸经营部 柳州市金色阳光信息咨询有限公司 柳州市赛利钢材经销部 柳州市日用化工厂 柳州市昆廷物资有限责任公司 柳州市邦盛贸易有限公司 柳州市济华贸易有限公司 柳州昕威橡塑化工经营部 柳州市联业贸易有限公司 柳州市兰钢贸易有限公司 柳州市子欣科技有限公司 柳州市狄龙机电设备有限公司 柳州市方真物资贸易有限公司 柳州市银鸥废旧回收中心 柳州市冠宝贸易有限公司 柳州市鑫盛德商务咨询有限责任公司 柳州市泰汇银通经贸有限公司 广西瀚维智测科技有限公司 柳州市钓鱼郎制衣有限责任公司 柳州溪水物资有限公司 柳州市融峰物资有限责任公司 广西新地科技有限责任公司 柳州市纺织装饰公司 柳州市粤翔冶金炉料有限公司 柳州市远腾贸易有限公司 柳州市东鸿城市改造有限公司 广西丛欣实业有限公司 柳州市服装厂 柳州市立安联合刀片有限公司 广西国扬投资有限责任公司 柳州市铭泰办公设备公司 柳州市桂钢物资供应站 柳州市昱升物资有限责任公司 柳州市鹰飞灿科贸有限公司 柳州市先导科贸有限公司 柳州市金秋建材物资经营部 柳州市童装厂 柳州市民泽物资有限公司 柳州市恒先物资贸易有限公司 柳州市银夏冷气工程有限责任公司 柳州粮食批发有限责任公司 柳州市金银华窗纱制造有限责任公司 柳州市三方贸易有限公司 柳州市丰涛商贸有限责任公司 柳州华智企业管理咨询有限责任公司 柳州市诚正建筑工程施工图审查有限公司 柳州市今科电讯设备营销中心 柳州市闽德电子有限公司 柳州市鑫虹针织厂 柳州市畅通通讯器材有限责任公司 柳州市正钢物资经营部 柳州市新柳饲料有限责任公司 柳州市黄村油库 柳州市天泰电力装饰工程有限公司 柳州市兆吉物资有限责任公司 柳州市八龙纸制品有限责任公司 柳州市巨佳电脑网络科技有限公司 ".match(/[^\s]+/g), function (i, v) {
        return {
            text: v,
            value: v,
            title: v
        };
    }),
    TREEITEMS: [{pId: "0", id: "0_0", text: "( 共25个 )", value: "", open: true}, {
        pId: "0_0",
        id: "0_0_0",
        text: "安徽省( 共1个 )",
        value: "安徽省",
        open: true
    }, {pId: "0_0_0", id: "0_0_0_0", text: "芜湖市", value: "芜湖市", open: true}, {
        pId: "0_0",
        id: "0_0_1",
        text: "北京市( 共6个 )",
        value: "北京市",
        open: true
    }, {pId: "0_0_1", id: "0_0_1_0", text: "北京市区", value: "北京市区", open: true}, {
        pId: "0_0_1",
        id: "0_0_1_1",
        text: "朝阳区",
        value: "朝阳区",
        open: true
    }, {pId: "0_0_1", id: "0_0_1_2", text: "东城区", value: "东城区", open: true}, {
        pId: "0_0_1",
        id: "0_0_1_3",
        text: "海淀区4内",
        value: "海淀区4内",
        open: true
    }, {pId: "0_0_1", id: "0_0_1_4", text: "海淀区4外", value: "海淀区4外", open: true}, {
        pId: "0_0_1",
        id: "0_0_1_5",
        text: "石景山区",
        value: "石景山区",
        open: true
    }, {pId: "0_0", id: "0_0_2", text: "福建省( 共2个 )", value: "福建省", open: true}, {
        pId: "0_0_2",
        id: "0_0_2_0",
        text: "莆田市",
        value: "莆田市",
        open: true
    }, {pId: "0_0_2", id: "0_0_2_1", text: "泉州市", value: "泉州市", open: true}, {
        pId: "0_0",
        id: "0_0_3",
        text: "甘肃省( 共1个 )",
        value: "甘肃省",
        open: true
    }, {pId: "0_0_3", id: "0_0_3_0", text: "兰州市", value: "兰州市", open: true}, {
        pId: "0_0",
        id: "0_0_4",
        text: "广东省( 共5个 )",
        value: "广东省",
        open: true
    }, {pId: "0_0_4", id: "0_0_4_0", text: "东莞市", value: "东莞市", open: true}, {
        pId: "0_0_4",
        id: "0_0_4_1",
        text: "广州市",
        value: "广州市",
        open: true
    }, {pId: "0_0_4", id: "0_0_4_2", text: "惠州市", value: "惠州市", open: true}, {
        pId: "0_0_4",
        id: "0_0_4_3",
        text: "深圳市",
        value: "深圳市",
        open: true
    }, {pId: "0_0_4", id: "0_0_4_4", text: "珠海市", value: "珠海市", open: true}, {
        pId: "0_0",
        id: "0_0_5",
        text: "广西壮族自治区( 共1个 )",
        value: "广西壮族自治区",
        open: true
    }, {pId: "0_0_5", id: "0_0_5_0", text: "南宁市", value: "南宁市", open: true}, {
        pId: "0_0",
        id: "0_0_6",
        text: "河北省( 共2个 )",
        value: "河北省",
        open: true
    }, {pId: "0_0_6", id: "0_0_6_0", text: "保定市", value: "保定市", open: true}, {
        pId: "0_0_6",
        id: "0_0_6_1",
        text: "邢台市",
        value: "邢台市",
        open: true
    }, {pId: "0_0", id: "0_0_7", text: "河南省( 共1个 )", value: "河南省", open: true}, {
        pId: "0_0_7",
        id: "0_0_7_0",
        text: "郑州市",
        value: "郑州市",
        open: true
    }, {pId: "0_0", id: "0_0_8", text: "黑龙江省( 共7个 )", value: "黑龙江省", open: true}, {
        pId: "0_0_8",
        id: "0_0_8_0",
        text: "大庆市",
        value: "大庆市",
        open: true
    }, {pId: "0_0_8", id: "0_0_8_1", text: "哈尔滨市", value: "哈尔滨市", open: true}, {
        pId: "0_0_8",
        id: "0_0_8_2",
        text: "鸡西市",
        value: "鸡西市",
        open: true
    }, {pId: "0_0_8", id: "0_0_8_3", text: "佳木斯市", value: "佳木斯市", open: true}, {
        pId: "0_0_8",
        id: "0_0_8_4",
        text: "牡丹江市",
        value: "牡丹江市",
        open: true
    }, {pId: "0_0_8", id: "0_0_8_5", text: "齐齐哈尔市", value: "齐齐哈尔市", open: true}, {
        pId: "0_0_8",
        id: "0_0_8_6",
        text: "双鸭山市",
        value: "双鸭山市",
        open: true
    }, {pId: "0_0", id: "0_0_9", text: "湖北省( 共1个 )", value: "湖北省", open: true}, {
        pId: "0_0_9",
        id: "0_0_9_0",
        text: "武汉市",
        value: "武汉市",
        open: true
    }, {pId: "0_0", id: "0_0_10", text: "湖南省( 共3个 )", value: "湖南省", open: true}, {
        pId: "0_0_10",
        id: "0_0_10_0",
        text: "常德市",
        value: "常德市",
        open: true
    }, {pId: "0_0_10", id: "0_0_10_1", text: "长沙市", value: "长沙市", open: true}, {
        pId: "0_0_10",
        id: "0_0_10_2",
        text: "邵阳市",
        value: "邵阳市",
        open: true
    }, {pId: "0_0", id: "0_0_11", text: "吉林省( 共4个 )", value: "吉林省", open: true}, {
        pId: "0_0_11",
        id: "0_0_11_0",
        text: "白山市",
        value: "白山市",
        open: true
    }, {pId: "0_0_11", id: "0_0_11_1", text: "长春市", value: "长春市", open: true}, {
        pId: "0_0_11",
        id: "0_0_11_2",
        text: "松原市",
        value: "松原市",
        open: true
    }, {pId: "0_0_11", id: "0_0_11_3", text: "通化市", value: "通化市", open: true}, {
        pId: "0_0",
        id: "0_0_12",
        text: "江苏省( 共8个 )",
        value: "江苏省",
        open: true
    }, {pId: "0_0_12", id: "0_0_12_0", text: "常州市", value: "常州市", open: true}, {
        pId: "0_0_12",
        id: "0_0_12_1",
        text: "南京市",
        value: "南京市",
        open: true
    }, {pId: "0_0_12", id: "0_0_12_2", text: "南通市", value: "南通市", open: true}, {
        pId: "0_0_12",
        id: "0_0_12_3",
        text: "苏州市",
        value: "苏州市",
        open: true
    }, {pId: "0_0_12", id: "0_0_12_4", text: "宿迁市", value: "宿迁市", open: true}, {
        pId: "0_0_12",
        id: "0_0_12_5",
        text: "泰州市",
        value: "泰州市",
        open: true
    }, {pId: "0_0_12", id: "0_0_12_6", text: "无锡市", value: "无锡市", open: true}, {
        pId: "0_0_12",
        id: "0_0_12_7",
        text: "盐城市",
        value: "盐城市",
        open: true
    }, {pId: "0_0", id: "0_0_13", text: "辽宁省( 共11个 )", value: "辽宁省", open: true}, {
        pId: "0_0_13",
        id: "0_0_13_0",
        text: "鞍山市",
        value: "鞍山市",
        open: true
    }, {pId: "0_0_13", id: "0_0_13_1", text: "本溪市", value: "本溪市", open: true}, {
        pId: "0_0_13",
        id: "0_0_13_2",
        text: "朝阳市",
        value: "朝阳市",
        open: true
    }, {pId: "0_0_13", id: "0_0_13_3", text: "大连市", value: "大连市", open: true}, {
        pId: "0_0_13",
        id: "0_0_13_4",
        text: "抚顺市",
        value: "抚顺市",
        open: true
    }, {pId: "0_0_13", id: "0_0_13_5", text: "葫芦岛市", value: "葫芦岛市", open: true}, {
        pId: "0_0_13",
        id: "0_0_13_6",
        text: "锦州市",
        value: "锦州市",
        open: true
    }, {pId: "0_0_13", id: "0_0_13_7", text: "辽阳市", value: "辽阳市", open: true}, {
        pId: "0_0_13",
        id: "0_0_13_8",
        text: "盘锦市",
        value: "盘锦市",
        open: true
    }, {pId: "0_0_13", id: "0_0_13_9", text: "沈阳市", value: "沈阳市", open: true}, {
        pId: "0_0_13",
        id: "0_0_13_10",
        text: "营口市",
        value: "营口市",
        open: true
    }, {pId: "0_0", id: "0_0_14", text: "内蒙古( 共1个 )", value: "内蒙古", open: true}, {
        pId: "0_0_14",
        id: "0_0_14_0",
        text: "鄂尔多斯市",
        value: "鄂尔多斯市",
        open: true
    }, {pId: "0_0", id: "0_0_15", text: "宁夏回族自治区( 共1个 )", value: "宁夏回族自治区", open: true}, {
        pId: "0_0_15",
        id: "0_0_15_0",
        text: "银川市",
        value: "银川市",
        open: true
    }, {pId: "0_0", id: "0_0_16", text: "山东省( 共7个 )", value: "山东省", open: true}, {
        pId: "0_0_16",
        id: "0_0_16_0",
        text: "济南市",
        value: "济南市",
        open: true
    }, {pId: "0_0_16", id: "0_0_16_1", text: "济宁市", value: "济宁市", open: true}, {
        pId: "0_0_16",
        id: "0_0_16_2",
        text: "聊城市",
        value: "聊城市",
        open: true
    }, {pId: "0_0_16", id: "0_0_16_3", text: "临沂市", value: "临沂市", open: true}, {
        pId: "0_0_16",
        id: "0_0_16_4",
        text: "青岛市",
        value: "青岛市",
        open: true
    }, {pId: "0_0_16", id: "0_0_16_5", text: "烟台市", value: "烟台市", open: true}, {
        pId: "0_0_16",
        id: "0_0_16_6",
        text: "枣庄市",
        value: "枣庄市",
        open: true
    }, {pId: "0_0", id: "0_0_17", text: "山西省( 共1个 )", value: "山西省", open: true}, {
        pId: "0_0_17",
        id: "0_0_17_0",
        text: "太原市",
        value: "太原市",
        open: true
    }, {pId: "0_0", id: "0_0_18", text: "陕西省( 共1个 )", value: "陕西省", open: true}, {
        pId: "0_0_18",
        id: "0_0_18_0",
        text: "西安市",
        value: "西安市",
        open: true
    }, {pId: "0_0", id: "0_0_19", text: "上海市( 共1个 )", value: "上海市", open: true}, {
        pId: "0_0_19",
        id: "0_0_19_0",
        text: "上海市区",
        value: "上海市区",
        open: true
    }, {pId: "0_0", id: "0_0_20", text: "四川省( 共1个 )", value: "四川省", open: true}, {
        pId: "0_0_20",
        id: "0_0_20_0",
        text: "成都市",
        value: "成都市",
        open: true
    }, {pId: "0_0", id: "0_0_21", text: "新疆维吾尔族自治区( 共2个 )", value: "新疆维吾尔族自治区", open: true}, {
        pId: "0_0_21",
        id: "0_0_21_0",
        text: "吐鲁番地区",
        value: "吐鲁番地区",
        open: true
    }, {pId: "0_0_21", id: "0_0_21_1", text: "乌鲁木齐", value: "乌鲁木齐", open: true}, {
        pId: "0_0",
        id: "0_0_22",
        text: "云南省( 共1个 )",
        value: "云南省",
        open: true
    }, {pId: "0_0_22", id: "0_0_22_0", text: "昆明市", value: "昆明市", open: true}, {
        pId: "0_0",
        id: "0_0_23",
        text: "浙江省( 共5个 )",
        value: "浙江省",
        open: true
    }, {pId: "0_0_23", id: "0_0_23_0", text: "杭州市", value: "杭州市", open: true}, {
        pId: "0_0_23",
        id: "0_0_23_1",
        text: "湖州市",
        value: "湖州市",
        open: true
    }, {pId: "0_0_23", id: "0_0_23_2", text: "嘉兴市", value: "嘉兴市", open: true}, {
        pId: "0_0_23",
        id: "0_0_23_3",
        text: "宁波市",
        value: "宁波市",
        open: true
    }, {pId: "0_0_23", id: "0_0_23_4", text: "绍兴市", value: "绍兴市", open: true}, {
        pId: "0_0",
        id: "0_0_24",
        text: "重庆市( 共1个 )",
        value: "重庆市",
        open: true
    }, {pId: "0_0_24", id: "0_0_24_0", text: "重庆市区", value: "重庆市区", open: true}, {
        pId: "0",
        id: "0_1",
        text: "中国( 共34个 )",
        value: "中国",
        open: true
    }, {pId: "0_1", id: "0_1_0", text: "安徽省( 共19个 )", value: "安徽省", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_0",
        text: "安庆市",
        value: "安庆市",
        open: true
    }, {pId: "0_1_0", id: "0_1_0_1", text: "蚌埠市", value: "蚌埠市", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_2",
        text: "亳州市",
        value: "亳州市",
        open: true
    }, {pId: "0_1_0", id: "0_1_0_3", text: "巢湖市", value: "巢湖市", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_4",
        text: "池州市",
        value: "池州市",
        open: true
    }, {pId: "0_1_0", id: "0_1_0_5", text: "滁州市", value: "滁州市", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_6",
        text: "阜阳市",
        value: "阜阳市",
        open: true
    }, {pId: "0_1_0", id: "0_1_0_7", text: "毫州市", value: "毫州市", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_8",
        text: "合肥市",
        value: "合肥市",
        open: true
    }, {pId: "0_1_0", id: "0_1_0_9", text: "淮北市", value: "淮北市", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_10",
        text: "淮南市",
        value: "淮南市",
        open: true
    }, {pId: "0_1_0", id: "0_1_0_11", text: "黄山市", value: "黄山市", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_12",
        text: "六安市",
        value: "六安市",
        open: true
    }, {pId: "0_1_0", id: "0_1_0_13", text: "马鞍山市", value: "马鞍山市", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_14",
        text: "濮阳市",
        value: "濮阳市",
        open: true
    }, {pId: "0_1_0", id: "0_1_0_15", text: "宿州市", value: "宿州市", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_16",
        text: "铜陵市",
        value: "铜陵市",
        open: true
    }, {pId: "0_1_0", id: "0_1_0_17", text: "芜湖市", value: "芜湖市", open: true}, {
        pId: "0_1_0",
        id: "0_1_0_18",
        text: "宣城市",
        value: "宣城市",
        open: true
    }, {pId: "0_1", id: "0_1_1", text: "澳门特别行政区( 共1个 )", value: "澳门特别行政区", open: true}, {
        pId: "0_1_1",
        id: "0_1_1_0",
        text: "澳门",
        value: "澳门",
        open: true
    }, {pId: "0_1", id: "0_1_2", text: "北京市( 共17个 )", value: "北京市", open: true}, {
        pId: "0_1_2",
        id: "0_1_2_0",
        text: "北京市区",
        value: "北京市区",
        open: true
    }, {pId: "0_1_2", id: "0_1_2_1", text: "昌平区", value: "昌平区", open: true}, {
        pId: "0_1_2",
        id: "0_1_2_2",
        text: "朝阳区",
        value: "朝阳区",
        open: true
    }, {pId: "0_1_2", id: "0_1_2_3", text: "大兴区", value: "大兴区", open: true}, {
        pId: "0_1_2",
        id: "0_1_2_4",
        text: "东城区",
        value: "东城区",
        open: true
    }, {pId: "0_1_2", id: "0_1_2_5", text: "房山区", value: "房山区", open: true}, {
        pId: "0_1_2",
        id: "0_1_2_6",
        text: "丰台区",
        value: "丰台区",
        open: true
    }, {pId: "0_1_2", id: "0_1_2_7", text: "海淀区", value: "海淀区", open: true}, {
        pId: "0_1_2",
        id: "0_1_2_8",
        text: "海淀区4内",
        value: "海淀区4内",
        open: true
    }, {pId: "0_1_2", id: "0_1_2_9", text: "海淀区4外", value: "海淀区4外", open: true}, {
        pId: "0_1_2",
        id: "0_1_2_10",
        text: "门头沟区",
        value: "门头沟区",
        open: true
    }, {pId: "0_1_2", id: "0_1_2_11", text: "平谷区", value: "平谷区", open: true}, {
        pId: "0_1_2",
        id: "0_1_2_12",
        text: "石景山区",
        value: "石景山区",
        open: true
    }, {pId: "0_1_2", id: "0_1_2_13", text: "顺义区", value: "顺义区", open: true}, {
        pId: "0_1_2",
        id: "0_1_2_14",
        text: "通州区",
        value: "通州区",
        open: true
    }, {pId: "0_1_2", id: "0_1_2_15", text: "西城区", value: "西城区", open: true}, {
        pId: "0_1_2",
        id: "0_1_2_16",
        text: "西城区  ",
        value: "西城区  ",
        open: true
    }, {pId: "0_1", id: "0_1_3", text: "福建省( 共9个 )", value: "福建省", open: true}, {
        pId: "0_1_3",
        id: "0_1_3_0",
        text: "福州市",
        value: "福州市",
        open: true
    }, {pId: "0_1_3", id: "0_1_3_1", text: "龙岩市", value: "龙岩市", open: true}, {
        pId: "0_1_3",
        id: "0_1_3_2",
        text: "南平市",
        value: "南平市",
        open: true
    }, {pId: "0_1_3", id: "0_1_3_3", text: "宁德市", value: "宁德市", open: true}, {
        pId: "0_1_3",
        id: "0_1_3_4",
        text: "莆田市",
        value: "莆田市",
        open: true
    }, {pId: "0_1_3", id: "0_1_3_5", text: "泉州市", value: "泉州市", open: true}, {
        pId: "0_1_3",
        id: "0_1_3_6",
        text: "三明市",
        value: "三明市",
        open: true
    }, {pId: "0_1_3", id: "0_1_3_7", text: "厦门市", value: "厦门市", open: true}, {
        pId: "0_1_3",
        id: "0_1_3_8",
        text: "漳州市",
        value: "漳州市",
        open: true
    }, {pId: "0_1", id: "0_1_4", text: "甘肃省( 共12个 )", value: "甘肃省", open: true}, {
        pId: "0_1_4",
        id: "0_1_4_0",
        text: "白银市",
        value: "白银市",
        open: true
    }, {pId: "0_1_4", id: "0_1_4_1", text: "嘉峪关市", value: "嘉峪关市", open: true}, {
        pId: "0_1_4",
        id: "0_1_4_2",
        text: "金昌市",
        value: "金昌市",
        open: true
    }, {pId: "0_1_4", id: "0_1_4_3", text: "酒泉市", value: "酒泉市", open: true}, {
        pId: "0_1_4",
        id: "0_1_4_4",
        text: "兰州市",
        value: "兰州市",
        open: true
    }, {pId: "0_1_4", id: "0_1_4_5", text: "陇南市", value: "陇南市", open: true}, {
        pId: "0_1_4",
        id: "0_1_4_6",
        text: "平凉市",
        value: "平凉市",
        open: true
    }, {pId: "0_1_4", id: "0_1_4_7", text: "庆阳市", value: "庆阳市", open: true}, {
        pId: "0_1_4",
        id: "0_1_4_8",
        text: "天津市区",
        value: "天津市区",
        open: true
    }, {pId: "0_1_4", id: "0_1_4_9", text: "天水市", value: "天水市", open: true}, {
        pId: "0_1_4",
        id: "0_1_4_10",
        text: "武威市",
        value: "武威市",
        open: true
    }, {pId: "0_1_4", id: "0_1_4_11", text: "张掖市", value: "张掖市", open: true}, {
        pId: "0_1",
        id: "0_1_5",
        text: "广东省( 共21个 )",
        value: "广东省",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_0", text: "潮州市", value: "潮州市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_1",
        text: "东莞市",
        value: "东莞市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_2", text: "佛山市", value: "佛山市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_3",
        text: "广州市",
        value: "广州市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_4", text: "河源市", value: "河源市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_5",
        text: "惠州市",
        value: "惠州市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_6", text: "江门市", value: "江门市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_7",
        text: "揭阳市",
        value: "揭阳市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_8", text: "茂名市", value: "茂名市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_9",
        text: "梅州市",
        value: "梅州市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_10", text: "清远市", value: "清远市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_11",
        text: "汕头市",
        value: "汕头市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_12", text: "汕尾市", value: "汕尾市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_13",
        text: "韶关市",
        value: "韶关市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_14", text: "深圳市", value: "深圳市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_15",
        text: "阳江市",
        value: "阳江市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_16", text: "云浮市", value: "云浮市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_17",
        text: "湛江市",
        value: "湛江市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_18", text: "肇庆市", value: "肇庆市", open: true}, {
        pId: "0_1_5",
        id: "0_1_5_19",
        text: "中山市",
        value: "中山市",
        open: true
    }, {pId: "0_1_5", id: "0_1_5_20", text: "珠海市", value: "珠海市", open: true}, {
        pId: "0_1",
        id: "0_1_6",
        text: "广西壮族自治区( 共14个 )",
        value: "广西壮族自治区",
        open: true
    }, {pId: "0_1_6", id: "0_1_6_0", text: "百色市", value: "百色市", open: true}, {
        pId: "0_1_6",
        id: "0_1_6_1",
        text: "北海市",
        value: "北海市",
        open: true
    }, {pId: "0_1_6", id: "0_1_6_2", text: "崇左市", value: "崇左市", open: true}, {
        pId: "0_1_6",
        id: "0_1_6_3",
        text: "防城港市",
        value: "防城港市",
        open: true
    }, {pId: "0_1_6", id: "0_1_6_4", text: "桂林市", value: "桂林市", open: true}, {
        pId: "0_1_6",
        id: "0_1_6_5",
        text: "贵港市",
        value: "贵港市",
        open: true
    }, {pId: "0_1_6", id: "0_1_6_6", text: "河池市", value: "河池市", open: true}, {
        pId: "0_1_6",
        id: "0_1_6_7",
        text: "贺州市",
        value: "贺州市",
        open: true
    }, {pId: "0_1_6", id: "0_1_6_8", text: "来宾市", value: "来宾市", open: true}, {
        pId: "0_1_6",
        id: "0_1_6_9",
        text: "柳州市",
        value: "柳州市",
        open: true
    }, {pId: "0_1_6", id: "0_1_6_10", text: "南宁市", value: "南宁市", open: true}, {
        pId: "0_1_6",
        id: "0_1_6_11",
        text: "钦州市",
        value: "钦州市",
        open: true
    }, {pId: "0_1_6", id: "0_1_6_12", text: "梧州市", value: "梧州市", open: true}, {
        pId: "0_1_6",
        id: "0_1_6_13",
        text: "玉林市",
        value: "玉林市",
        open: true
    }, {pId: "0_1", id: "0_1_7", text: "贵州省( 共9个 )", value: "贵州省", open: true}, {
        pId: "0_1_7",
        id: "0_1_7_0",
        text: "安顺市",
        value: "安顺市",
        open: true
    }, {pId: "0_1_7", id: "0_1_7_1", text: "毕节地区", value: "毕节地区", open: true}, {
        pId: "0_1_7",
        id: "0_1_7_2",
        text: "贵阳市",
        value: "贵阳市",
        open: true
    }, {pId: "0_1_7", id: "0_1_7_3", text: "六盘水市", value: "六盘水市", open: true}, {
        pId: "0_1_7",
        id: "0_1_7_4",
        text: "黔东南州",
        value: "黔东南州",
        open: true
    }, {pId: "0_1_7", id: "0_1_7_5", text: "黔南州", value: "黔南州", open: true}, {
        pId: "0_1_7",
        id: "0_1_7_6",
        text: "黔西南市",
        value: "黔西南市",
        open: true
    }, {pId: "0_1_7", id: "0_1_7_7", text: "铜仁地区", value: "铜仁地区", open: true}, {
        pId: "0_1_7",
        id: "0_1_7_8",
        text: "遵义市",
        value: "遵义市",
        open: true
    }, {pId: "0_1", id: "0_1_8", text: "海南省( 共2个 )", value: "海南省", open: true}, {
        pId: "0_1_8",
        id: "0_1_8_0",
        text: "海口市",
        value: "海口市",
        open: true
    }, {pId: "0_1_8", id: "0_1_8_1", text: "三亚市", value: "三亚市", open: true}, {
        pId: "0_1",
        id: "0_1_9",
        text: "河北省( 共12个 )",
        value: "河北省",
        open: true
    }, {pId: "0_1_9", id: "0_1_9_0", text: "保定市", value: "保定市", open: true}, {
        pId: "0_1_9",
        id: "0_1_9_1",
        text: "沧州市",
        value: "沧州市",
        open: true
    }, {pId: "0_1_9", id: "0_1_9_2", text: "承德市", value: "承德市", open: true}, {
        pId: "0_1_9",
        id: "0_1_9_3",
        text: "邯郸市",
        value: "邯郸市",
        open: true
    }, {pId: "0_1_9", id: "0_1_9_4", text: "衡水市", value: "衡水市", open: true}, {
        pId: "0_1_9",
        id: "0_1_9_5",
        text: "廊坊市",
        value: "廊坊市",
        open: true
    }, {pId: "0_1_9", id: "0_1_9_6", text: "秦皇岛市", value: "秦皇岛市", open: true}, {
        pId: "0_1_9",
        id: "0_1_9_7",
        text: "石家庄市",
        value: "石家庄市",
        open: true
    }, {pId: "0_1_9", id: "0_1_9_8", text: "唐山市", value: "唐山市", open: true}, {
        pId: "0_1_9",
        id: "0_1_9_9",
        text: "天津市区",
        value: "天津市区",
        open: true
    }, {pId: "0_1_9", id: "0_1_9_10", text: "邢台市", value: "邢台市", open: true}, {
        pId: "0_1_9",
        id: "0_1_9_11",
        text: "张家口市",
        value: "张家口市",
        open: true
    }, {pId: "0_1", id: "0_1_10", text: "河南省( 共19个 )", value: "河南省", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_0",
        text: "安阳市",
        value: "安阳市",
        open: true
    }, {pId: "0_1_10", id: "0_1_10_1", text: "鹤壁市", value: "鹤壁市", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_2",
        text: "济源市",
        value: "济源市",
        open: true
    }, {pId: "0_1_10", id: "0_1_10_3", text: "焦作市", value: "焦作市", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_4",
        text: "开封市",
        value: "开封市",
        open: true
    }, {pId: "0_1_10", id: "0_1_10_5", text: "廊坊市", value: "廊坊市", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_6",
        text: "洛阳市",
        value: "洛阳市",
        open: true
    }, {pId: "0_1_10", id: "0_1_10_7", text: "漯河市", value: "漯河市", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_8",
        text: "南阳市",
        value: "南阳市",
        open: true
    }, {pId: "0_1_10", id: "0_1_10_9", text: "平顶山市", value: "平顶山市", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_10",
        text: "濮阳市",
        value: "濮阳市",
        open: true
    }, {pId: "0_1_10", id: "0_1_10_11", text: "三门峡市", value: "三门峡市", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_12",
        text: "商丘市",
        value: "商丘市",
        open: true
    }, {pId: "0_1_10", id: "0_1_10_13", text: "新乡市", value: "新乡市", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_14",
        text: "信阳市",
        value: "信阳市",
        open: true
    }, {pId: "0_1_10", id: "0_1_10_15", text: "许昌市", value: "许昌市", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_16",
        text: "郑州市",
        value: "郑州市",
        open: true
    }, {pId: "0_1_10", id: "0_1_10_17", text: "周口市", value: "周口市", open: true}, {
        pId: "0_1_10",
        id: "0_1_10_18",
        text: "驻马店市",
        value: "驻马店市",
        open: true
    }, {pId: "0_1", id: "0_1_11", text: "黑龙江省( 共13个 )", value: "黑龙江省", open: true}, {
        pId: "0_1_11",
        id: "0_1_11_0",
        text: "大庆市",
        value: "大庆市",
        open: true
    }, {pId: "0_1_11", id: "0_1_11_1", text: "大兴安岭地区", value: "大兴安岭地区", open: true}, {
        pId: "0_1_11",
        id: "0_1_11_2",
        text: "大兴安岭市",
        value: "大兴安岭市",
        open: true
    }, {pId: "0_1_11", id: "0_1_11_3", text: "哈尔滨市", value: "哈尔滨市", open: true}, {
        pId: "0_1_11",
        id: "0_1_11_4",
        text: "鹤港市",
        value: "鹤港市",
        open: true
    }, {pId: "0_1_11", id: "0_1_11_5", text: "黑河市", value: "黑河市", open: true}, {
        pId: "0_1_11",
        id: "0_1_11_6",
        text: "佳木斯市",
        value: "佳木斯市",
        open: true
    }, {pId: "0_1_11", id: "0_1_11_7", text: "牡丹江市", value: "牡丹江市", open: true}, {
        pId: "0_1_11",
        id: "0_1_11_8",
        text: "七台河市",
        value: "七台河市",
        open: true
    }, {pId: "0_1_11", id: "0_1_11_9", text: "齐齐哈尔市", value: "齐齐哈尔市", open: true}, {
        pId: "0_1_11",
        id: "0_1_11_10",
        text: "双鸭山市",
        value: "双鸭山市",
        open: true
    }, {pId: "0_1_11", id: "0_1_11_11", text: "绥化市", value: "绥化市", open: true}, {
        pId: "0_1_11",
        id: "0_1_11_12",
        text: "伊春市",
        value: "伊春市",
        open: true
    }, {pId: "0_1", id: "0_1_12", text: "湖北省( 共16个 )", value: "湖北省", open: true}, {
        pId: "0_1_12",
        id: "0_1_12_0",
        text: "鄂州市",
        value: "鄂州市",
        open: true
    }, {pId: "0_1_12", id: "0_1_12_1", text: "恩施土家族苗族自治州", value: "恩施土家族苗族自治州", open: true}, {
        pId: "0_1_12",
        id: "0_1_12_2",
        text: "黄冈市",
        value: "黄冈市",
        open: true
    }, {pId: "0_1_12", id: "0_1_12_3", text: "黄石市", value: "黄石市", open: true}, {
        pId: "0_1_12",
        id: "0_1_12_4",
        text: "荆门市",
        value: "荆门市",
        open: true
    }, {pId: "0_1_12", id: "0_1_12_5", text: "荆州市", value: "荆州市", open: true}, {
        pId: "0_1_12",
        id: "0_1_12_6",
        text: "神农架市",
        value: "神农架市",
        open: true
    }, {pId: "0_1_12", id: "0_1_12_7", text: "十堰市", value: "十堰市", open: true}, {
        pId: "0_1_12",
        id: "0_1_12_8",
        text: "随州市",
        value: "随州市",
        open: true
    }, {pId: "0_1_12", id: "0_1_12_9", text: "天门市", value: "天门市", open: true}, {
        pId: "0_1_12",
        id: "0_1_12_10",
        text: "武汉市",
        value: "武汉市",
        open: true
    }, {pId: "0_1_12", id: "0_1_12_11", text: "咸宁市", value: "咸宁市", open: true}, {
        pId: "0_1_12",
        id: "0_1_12_12",
        text: "襄樊市",
        value: "襄樊市",
        open: true
    }, {pId: "0_1_12", id: "0_1_12_13", text: "襄阳市", value: "襄阳市", open: true}, {
        pId: "0_1_12",
        id: "0_1_12_14",
        text: "孝感市",
        value: "孝感市",
        open: true
    }, {pId: "0_1_12", id: "0_1_12_15", text: "宜昌市", value: "宜昌市", open: true}, {
        pId: "0_1",
        id: "0_1_13",
        text: "湖南省( 共15个 )",
        value: "湖南省",
        open: true
    }, {pId: "0_1_13", id: "0_1_13_0", text: "常德市", value: "常德市", open: true}, {
        pId: "0_1_13",
        id: "0_1_13_1",
        text: "长沙市",
        value: "长沙市",
        open: true
    }, {pId: "0_1_13", id: "0_1_13_2", text: "郴州市", value: "郴州市", open: true}, {
        pId: "0_1_13",
        id: "0_1_13_3",
        text: "衡阳市",
        value: "衡阳市",
        open: true
    }, {pId: "0_1_13", id: "0_1_13_4", text: "怀化市", value: "怀化市", open: true}, {
        pId: "0_1_13",
        id: "0_1_13_5",
        text: "娄底市",
        value: "娄底市",
        open: true
    }, {pId: "0_1_13", id: "0_1_13_6", text: "邵阳市", value: "邵阳市", open: true}, {
        pId: "0_1_13",
        id: "0_1_13_7",
        text: "湘潭市",
        value: "湘潭市",
        open: true
    }, {pId: "0_1_13", id: "0_1_13_8", text: "湘西市", value: "湘西市", open: true}, {
        pId: "0_1_13",
        id: "0_1_13_9",
        text: "湘西土家族苗族自治州",
        value: "湘西土家族苗族自治州",
        open: true
    }, {pId: "0_1_13", id: "0_1_13_10", text: "益阳市", value: "益阳市", open: true}, {
        pId: "0_1_13",
        id: "0_1_13_11",
        text: "永州市",
        value: "永州市",
        open: true
    }, {pId: "0_1_13", id: "0_1_13_12", text: "岳阳市", value: "岳阳市", open: true}, {
        pId: "0_1_13",
        id: "0_1_13_13",
        text: "张家界市",
        value: "张家界市",
        open: true
    }, {pId: "0_1_13", id: "0_1_13_14", text: "株洲市", value: "株洲市", open: true}, {
        pId: "0_1",
        id: "0_1_14",
        text: "吉林省( 共10个 )",
        value: "吉林省",
        open: true
    }, {pId: "0_1_14", id: "0_1_14_0", text: "白城市", value: "白城市", open: true}, {
        pId: "0_1_14",
        id: "0_1_14_1",
        text: "白山市",
        value: "白山市",
        open: true
    }, {pId: "0_1_14", id: "0_1_14_2", text: "长春市", value: "长春市", open: true}, {
        pId: "0_1_14",
        id: "0_1_14_3",
        text: "大庆市",
        value: "大庆市",
        open: true
    }, {pId: "0_1_14", id: "0_1_14_4", text: "吉林市", value: "吉林市", open: true}, {
        pId: "0_1_14",
        id: "0_1_14_5",
        text: "辽源市",
        value: "辽源市",
        open: true
    }, {pId: "0_1_14", id: "0_1_14_6", text: "四平市", value: "四平市", open: true}, {
        pId: "0_1_14",
        id: "0_1_14_7",
        text: "松原市",
        value: "松原市",
        open: true
    }, {pId: "0_1_14", id: "0_1_14_8", text: "通化市", value: "通化市", open: true}, {
        pId: "0_1_14",
        id: "0_1_14_9",
        text: "延边朝鲜族自治州",
        value: "延边朝鲜族自治州",
        open: true
    }, {pId: "0_1", id: "0_1_15", text: "江苏省( 共13个 )", value: "江苏省", open: true}, {
        pId: "0_1_15",
        id: "0_1_15_0",
        text: "常州市",
        value: "常州市",
        open: true
    }, {pId: "0_1_15", id: "0_1_15_1", text: "淮安市", value: "淮安市", open: true}, {
        pId: "0_1_15",
        id: "0_1_15_2",
        text: "连云港市",
        value: "连云港市",
        open: true
    }, {pId: "0_1_15", id: "0_1_15_3", text: "南京市", value: "南京市", open: true}, {
        pId: "0_1_15",
        id: "0_1_15_4",
        text: "南通市",
        value: "南通市",
        open: true
    }, {pId: "0_1_15", id: "0_1_15_5", text: "苏州市", value: "苏州市", open: true}, {
        pId: "0_1_15",
        id: "0_1_15_6",
        text: "宿迁市",
        value: "宿迁市",
        open: true
    }, {pId: "0_1_15", id: "0_1_15_7", text: "泰州市", value: "泰州市", open: true}, {
        pId: "0_1_15",
        id: "0_1_15_8",
        text: "无锡市",
        value: "无锡市",
        open: true
    }, {pId: "0_1_15", id: "0_1_15_9", text: "徐州市", value: "徐州市", open: true}, {
        pId: "0_1_15",
        id: "0_1_15_10",
        text: "盐城市",
        value: "盐城市",
        open: true
    }, {pId: "0_1_15", id: "0_1_15_11", text: "扬州市", value: "扬州市", open: true}, {
        pId: "0_1_15",
        id: "0_1_15_12",
        text: "镇江市",
        value: "镇江市",
        open: true
    }, {pId: "0_1", id: "0_1_16", text: "江西省( 共10个 )", value: "江西省", open: true}, {
        pId: "0_1_16",
        id: "0_1_16_0",
        text: "抚州市",
        value: "抚州市",
        open: true
    }, {pId: "0_1_16", id: "0_1_16_1", text: "赣州市", value: "赣州市", open: true}, {
        pId: "0_1_16",
        id: "0_1_16_2",
        text: "景德镇市",
        value: "景德镇市",
        open: true
    }, {pId: "0_1_16", id: "0_1_16_3", text: "九江市", value: "九江市", open: true}, {
        pId: "0_1_16",
        id: "0_1_16_4",
        text: "南昌市",
        value: "南昌市",
        open: true
    }, {pId: "0_1_16", id: "0_1_16_5", text: "萍乡市", value: "萍乡市", open: true}, {
        pId: "0_1_16",
        id: "0_1_16_6",
        text: "上饶市",
        value: "上饶市",
        open: true
    }, {pId: "0_1_16", id: "0_1_16_7", text: "新余市", value: "新余市", open: true}, {
        pId: "0_1_16",
        id: "0_1_16_8",
        text: "宜春市",
        value: "宜春市",
        open: true
    }, {pId: "0_1_16", id: "0_1_16_9", text: "鹰潭市", value: "鹰潭市", open: true}, {
        pId: "0_1",
        id: "0_1_17",
        text: "辽宁省( 共14个 )",
        value: "辽宁省",
        open: true
    }, {pId: "0_1_17", id: "0_1_17_0", text: "鞍山市", value: "鞍山市", open: true}, {
        pId: "0_1_17",
        id: "0_1_17_1",
        text: "本溪市",
        value: "本溪市",
        open: true
    }, {pId: "0_1_17", id: "0_1_17_2", text: "朝阳市", value: "朝阳市", open: true}, {
        pId: "0_1_17",
        id: "0_1_17_3",
        text: "大连市",
        value: "大连市",
        open: true
    }, {pId: "0_1_17", id: "0_1_17_4", text: "丹东市", value: "丹东市", open: true}, {
        pId: "0_1_17",
        id: "0_1_17_5",
        text: "抚顺市",
        value: "抚顺市",
        open: true
    }, {pId: "0_1_17", id: "0_1_17_6", text: "阜新市", value: "阜新市", open: true}, {
        pId: "0_1_17",
        id: "0_1_17_7",
        text: "葫芦岛市",
        value: "葫芦岛市",
        open: true
    }, {pId: "0_1_17", id: "0_1_17_8", text: "锦州市", value: "锦州市", open: true}, {
        pId: "0_1_17",
        id: "0_1_17_9",
        text: "辽阳市",
        value: "辽阳市",
        open: true
    }, {pId: "0_1_17", id: "0_1_17_10", text: "盘锦市", value: "盘锦市", open: true}, {
        pId: "0_1_17",
        id: "0_1_17_11",
        text: "沈阳市",
        value: "沈阳市",
        open: true
    }, {pId: "0_1_17", id: "0_1_17_12", text: "铁岭市", value: "铁岭市", open: true}, {
        pId: "0_1_17",
        id: "0_1_17_13",
        text: "营口市",
        value: "营口市",
        open: true
    }, {pId: "0_1", id: "0_1_18", text: "内蒙古( 共10个 )", value: "内蒙古", open: true}, {
        pId: "0_1_18",
        id: "0_1_18_0",
        text: "包头市",
        value: "包头市",
        open: true
    }, {pId: "0_1_18", id: "0_1_18_1", text: "赤峰市", value: "赤峰市", open: true}, {
        pId: "0_1_18",
        id: "0_1_18_2",
        text: "鄂尔多斯市",
        value: "鄂尔多斯市",
        open: true
    }, {pId: "0_1_18", id: "0_1_18_3", text: "呼和浩特市", value: "呼和浩特市", open: true}, {
        pId: "0_1_18",
        id: "0_1_18_4",
        text: "呼伦贝尔市",
        value: "呼伦贝尔市",
        open: true
    }, {pId: "0_1_18", id: "0_1_18_5", text: "通辽市", value: "通辽市", open: true}, {
        pId: "0_1_18",
        id: "0_1_18_6",
        text: "乌海市",
        value: "乌海市",
        open: true
    }, {pId: "0_1_18", id: "0_1_18_7", text: "锡林郭勒市", value: "锡林郭勒市", open: true}, {
        pId: "0_1_18",
        id: "0_1_18_8",
        text: "兴安市",
        value: "兴安市",
        open: true
    }, {pId: "0_1_18", id: "0_1_18_9", text: "运城市", value: "运城市", open: true}, {
        pId: "0_1",
        id: "0_1_19",
        text: "宁夏回族自治区( 共5个 )",
        value: "宁夏回族自治区",
        open: true
    }, {pId: "0_1_19", id: "0_1_19_0", text: "固原市", value: "固原市", open: true}, {
        pId: "0_1_19",
        id: "0_1_19_1",
        text: "石嘴山市",
        value: "石嘴山市",
        open: true
    }, {pId: "0_1_19", id: "0_1_19_2", text: "吴忠市", value: "吴忠市", open: true}, {
        pId: "0_1_19",
        id: "0_1_19_3",
        text: "银川市",
        value: "银川市",
        open: true
    }, {pId: "0_1_19", id: "0_1_19_4", text: "中卫市", value: "中卫市", open: true}, {
        pId: "0_1",
        id: "0_1_20",
        text: "青海省( 共4个 )",
        value: "青海省",
        open: true
    }, {pId: "0_1_20", id: "0_1_20_0", text: "海东地区", value: "海东地区", open: true}, {
        pId: "0_1_20",
        id: "0_1_20_1",
        text: "海南藏族自治州",
        value: "海南藏族自治州",
        open: true
    }, {pId: "0_1_20", id: "0_1_20_2", text: "海西蒙古族藏族自治州", value: "海西蒙古族藏族自治州", open: true}, {
        pId: "0_1_20",
        id: "0_1_20_3",
        text: "西宁市",
        value: "西宁市",
        open: true
    }, {pId: "0_1", id: "0_1_21", text: "山东省( 共17个 )", value: "山东省", open: true}, {
        pId: "0_1_21",
        id: "0_1_21_0",
        text: "滨州市",
        value: "滨州市",
        open: true
    }, {pId: "0_1_21", id: "0_1_21_1", text: "德州市", value: "德州市", open: true}, {
        pId: "0_1_21",
        id: "0_1_21_2",
        text: "东营市",
        value: "东营市",
        open: true
    }, {pId: "0_1_21", id: "0_1_21_3", text: "菏泽市", value: "菏泽市", open: true}, {
        pId: "0_1_21",
        id: "0_1_21_4",
        text: "济南市",
        value: "济南市",
        open: true
    }, {pId: "0_1_21", id: "0_1_21_5", text: "济宁市", value: "济宁市", open: true}, {
        pId: "0_1_21",
        id: "0_1_21_6",
        text: "莱芜市",
        value: "莱芜市",
        open: true
    }, {pId: "0_1_21", id: "0_1_21_7", text: "聊城市", value: "聊城市", open: true}, {
        pId: "0_1_21",
        id: "0_1_21_8",
        text: "临沂市",
        value: "临沂市",
        open: true
    }, {pId: "0_1_21", id: "0_1_21_9", text: "青岛市", value: "青岛市", open: true}, {
        pId: "0_1_21",
        id: "0_1_21_10",
        text: "日照市",
        value: "日照市",
        open: true
    }, {pId: "0_1_21", id: "0_1_21_11", text: "泰安市", value: "泰安市", open: true}, {
        pId: "0_1_21",
        id: "0_1_21_12",
        text: "威海市",
        value: "威海市",
        open: true
    }, {pId: "0_1_21", id: "0_1_21_13", text: "潍坊市", value: "潍坊市", open: true}, {
        pId: "0_1_21",
        id: "0_1_21_14",
        text: "烟台市",
        value: "烟台市",
        open: true
    }, {pId: "0_1_21", id: "0_1_21_15", text: "枣庄市", value: "枣庄市", open: true}, {
        pId: "0_1_21",
        id: "0_1_21_16",
        text: "淄博市",
        value: "淄博市",
        open: true
    }, {pId: "0_1", id: "0_1_22", text: "山西省( 共12个 )", value: "山西省", open: true}, {
        pId: "0_1_22",
        id: "0_1_22_0",
        text: "长治市",
        value: "长治市",
        open: true
    }, {pId: "0_1_22", id: "0_1_22_1", text: "大同市", value: "大同市", open: true}, {
        pId: "0_1_22",
        id: "0_1_22_2",
        text: "晋城市",
        value: "晋城市",
        open: true
    }, {pId: "0_1_22", id: "0_1_22_3", text: "晋中市", value: "晋中市", open: true}, {
        pId: "0_1_22",
        id: "0_1_22_4",
        text: "临汾市",
        value: "临汾市",
        open: true
    }, {pId: "0_1_22", id: "0_1_22_5", text: "吕梁市", value: "吕梁市", open: true}, {
        pId: "0_1_22",
        id: "0_1_22_6",
        text: "青岛市",
        value: "青岛市",
        open: true
    }, {pId: "0_1_22", id: "0_1_22_7", text: "朔州市", value: "朔州市", open: true}, {
        pId: "0_1_22",
        id: "0_1_22_8",
        text: "太原市",
        value: "太原市",
        open: true
    }, {pId: "0_1_22", id: "0_1_22_9", text: "忻州市", value: "忻州市", open: true}, {
        pId: "0_1_22",
        id: "0_1_22_10",
        text: "阳泉市",
        value: "阳泉市",
        open: true
    }, {pId: "0_1_22", id: "0_1_22_11", text: "运城市", value: "运城市", open: true}, {
        pId: "0_1",
        id: "0_1_23",
        text: "陕西省( 共9个 )",
        value: "陕西省",
        open: true
    }, {pId: "0_1_23", id: "0_1_23_0", text: "安康市", value: "安康市", open: true}, {
        pId: "0_1_23",
        id: "0_1_23_1",
        text: "宝鸡市",
        value: "宝鸡市",
        open: true
    }, {pId: "0_1_23", id: "0_1_23_2", text: "汉中市", value: "汉中市", open: true}, {
        pId: "0_1_23",
        id: "0_1_23_3",
        text: "商洛市",
        value: "商洛市",
        open: true
    }, {pId: "0_1_23", id: "0_1_23_4", text: "渭南市", value: "渭南市", open: true}, {
        pId: "0_1_23",
        id: "0_1_23_5",
        text: "西安市",
        value: "西安市",
        open: true
    }, {pId: "0_1_23", id: "0_1_23_6", text: "咸阳市", value: "咸阳市", open: true}, {
        pId: "0_1_23",
        id: "0_1_23_7",
        text: "延安市",
        value: "延安市",
        open: true
    }, {pId: "0_1_23", id: "0_1_23_8", text: "榆林市", value: "榆林市", open: true}, {
        pId: "0_1",
        id: "0_1_24",
        text: "上海市( 共19个 )",
        value: "上海市",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_0", text: "宝山区", value: "宝山区", open: true}, {
        pId: "0_1_24",
        id: "0_1_24_1",
        text: "长宁区",
        value: "长宁区",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_2", text: "崇明县", value: "崇明县", open: true}, {
        pId: "0_1_24",
        id: "0_1_24_3",
        text: "奉贤区",
        value: "奉贤区",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_4", text: "虹口区", value: "虹口区", open: true}, {
        pId: "0_1_24",
        id: "0_1_24_5",
        text: "黄浦区",
        value: "黄浦区",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_6", text: "嘉定区", value: "嘉定区", open: true}, {
        pId: "0_1_24",
        id: "0_1_24_7",
        text: "金山区",
        value: "金山区",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_8", text: "静安区", value: "静安区", open: true}, {
        pId: "0_1_24",
        id: "0_1_24_9",
        text: "昆明市",
        value: "昆明市",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_10", text: "闵行区", value: "闵行区", open: true}, {
        pId: "0_1_24",
        id: "0_1_24_11",
        text: "普陀区",
        value: "普陀区",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_12", text: "浦东新区", value: "浦东新区", open: true}, {
        pId: "0_1_24",
        id: "0_1_24_13",
        text: "青浦区",
        value: "青浦区",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_14", text: "上海市区", value: "上海市区", open: true}, {
        pId: "0_1_24",
        id: "0_1_24_15",
        text: "松江区",
        value: "松江区",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_16", text: "徐汇区", value: "徐汇区", open: true}, {
        pId: "0_1_24",
        id: "0_1_24_17",
        text: "杨浦区",
        value: "杨浦区",
        open: true
    }, {pId: "0_1_24", id: "0_1_24_18", text: "闸北区", value: "闸北区", open: true}, {
        pId: "0_1",
        id: "0_1_25",
        text: "四川省( 共21个 )",
        value: "四川省",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_0", text: "阿坝藏族羌族自治州", value: "阿坝藏族羌族自治州", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_1",
        text: "巴中市",
        value: "巴中市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_2", text: "成都市", value: "成都市", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_3",
        text: "达州市",
        value: "达州市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_4", text: "德阳市", value: "德阳市", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_5",
        text: "甘孜市",
        value: "甘孜市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_6", text: "广安市", value: "广安市", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_7",
        text: "广元市",
        value: "广元市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_8", text: "乐山市", value: "乐山市", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_9",
        text: "凉山市",
        value: "凉山市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_10", text: "泸州市", value: "泸州市", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_11",
        text: "眉山市",
        value: "眉山市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_12", text: "绵阳市", value: "绵阳市", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_13",
        text: "南充市",
        value: "南充市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_14", text: "内江市", value: "内江市", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_15",
        text: "攀枝花市",
        value: "攀枝花市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_16", text: "遂宁市", value: "遂宁市", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_17",
        text: "雅安市",
        value: "雅安市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_18", text: "宜宾市", value: "宜宾市", open: true}, {
        pId: "0_1_25",
        id: "0_1_25_19",
        text: "资阳市",
        value: "资阳市",
        open: true
    }, {pId: "0_1_25", id: "0_1_25_20", text: "自贡市", value: "自贡市", open: true}, {
        pId: "0_1",
        id: "0_1_26",
        text: "台湾( 共1个 )",
        value: "台湾",
        open: true
    }, {pId: "0_1_26", id: "0_1_26_0", text: "台北市", value: "台北市", open: true}, {
        pId: "0_1",
        id: "0_1_27",
        text: "天津市( 共1个 )",
        value: "天津市",
        open: true
    }, {pId: "0_1_27", id: "0_1_27_0", text: "天津市区", value: "天津市区", open: true}, {
        pId: "0_1",
        id: "0_1_28",
        text: "西藏自治区( 共2个 )",
        value: "西藏自治区",
        open: true
    }, {pId: "0_1_28", id: "0_1_28_0", text: "阿里市", value: "阿里市", open: true}, {
        pId: "0_1_28",
        id: "0_1_28_1",
        text: "日喀则市",
        value: "日喀则市",
        open: true
    }, {pId: "0_1", id: "0_1_29", text: "香港特别行政区( 共1个 )", value: "香港特别行政区", open: true}, {
        pId: "0_1_29",
        id: "0_1_29_0",
        text: "香港",
        value: "香港",
        open: true
    }, {
        pId: "0_1",
        id: "0_1_30",
        text: "新疆维吾尔族自治区( 共11个 )",
        value: "新疆维吾尔族自治区",
        open: true
    }, {pId: "0_1_30", id: "0_1_30_0", text: "巴音郭楞市", value: "巴音郭楞市", open: true}, {
        pId: "0_1_30",
        id: "0_1_30_1",
        text: "哈密市",
        value: "哈密市",
        open: true
    }, {pId: "0_1_30", id: "0_1_30_2", text: "和田市", value: "和田市", open: true}, {
        pId: "0_1_30",
        id: "0_1_30_3",
        text: "喀什地区",
        value: "喀什地区",
        open: true
    }, {pId: "0_1_30", id: "0_1_30_4", text: "克拉玛依市", value: "克拉玛依市", open: true}, {
        pId: "0_1_30",
        id: "0_1_30_5",
        text: "克孜勒苏柯州",
        value: "克孜勒苏柯州",
        open: true
    }, {pId: "0_1_30", id: "0_1_30_6", text: "石河子市", value: "石河子市", open: true}, {
        pId: "0_1_30",
        id: "0_1_30_7",
        text: "塔城市",
        value: "塔城市",
        open: true
    }, {pId: "0_1_30", id: "0_1_30_8", text: "吐鲁番地区", value: "吐鲁番地区", open: true}, {
        pId: "0_1_30",
        id: "0_1_30_9",
        text: "乌鲁木齐",
        value: "乌鲁木齐",
        open: true
    }, {pId: "0_1_30", id: "0_1_30_10", text: "伊犁市", value: "伊犁市", open: true}, {
        pId: "0_1",
        id: "0_1_31",
        text: "云南省( 共12个 )",
        value: "云南省",
        open: true
    }, {pId: "0_1_31", id: "0_1_31_0", text: "保山市", value: "保山市", open: true}, {
        pId: "0_1_31",
        id: "0_1_31_1",
        text: "楚雄彝族自治州",
        value: "楚雄彝族自治州",
        open: true
    }, {pId: "0_1_31", id: "0_1_31_2", text: "大理白族自治州", value: "大理白族自治州", open: true}, {
        pId: "0_1_31",
        id: "0_1_31_3",
        text: "红河哈尼族彝族自治州",
        value: "红河哈尼族彝族自治州",
        open: true
    }, {pId: "0_1_31", id: "0_1_31_4", text: "昆明市", value: "昆明市", open: true}, {
        pId: "0_1_31",
        id: "0_1_31_5",
        text: "丽江市",
        value: "丽江市",
        open: true
    }, {pId: "0_1_31", id: "0_1_31_6", text: "临沧市", value: "临沧市", open: true}, {
        pId: "0_1_31",
        id: "0_1_31_7",
        text: "曲靖市",
        value: "曲靖市",
        open: true
    }, {pId: "0_1_31", id: "0_1_31_8", text: "思茅市", value: "思茅市", open: true}, {
        pId: "0_1_31",
        id: "0_1_31_9",
        text: "文山市",
        value: "文山市",
        open: true
    }, {pId: "0_1_31", id: "0_1_31_10", text: "玉溪市", value: "玉溪市", open: true}, {
        pId: "0_1_31",
        id: "0_1_31_11",
        text: "昭通市",
        value: "昭通市",
        open: true
    }, {pId: "0_1", id: "0_1_32", text: "浙江省( 共12个 )", value: "浙江省", open: true}, {
        pId: "0_1_32",
        id: "0_1_32_0",
        text: "杭州市",
        value: "杭州市",
        open: true
    }, {pId: "0_1_32", id: "0_1_32_1", text: "湖州市", value: "湖州市", open: true}, {
        pId: "0_1_32",
        id: "0_1_32_2",
        text: "嘉兴市",
        value: "嘉兴市",
        open: true
    }, {pId: "0_1_32", id: "0_1_32_3", text: "金华市", value: "金华市", open: true}, {
        pId: "0_1_32",
        id: "0_1_32_4",
        text: "丽水市",
        value: "丽水市",
        open: true
    }, {pId: "0_1_32", id: "0_1_32_5", text: "宁波市", value: "宁波市", open: true}, {
        pId: "0_1_32",
        id: "0_1_32_6",
        text: "衢州市",
        value: "衢州市",
        open: true
    }, {pId: "0_1_32", id: "0_1_32_7", text: "绍兴市", value: "绍兴市", open: true}, {
        pId: "0_1_32",
        id: "0_1_32_8",
        text: "台州市",
        value: "台州市",
        open: true
    }, {pId: "0_1_32", id: "0_1_32_9", text: "温州市", value: "温州市", open: true}, {
        pId: "0_1_32",
        id: "0_1_32_10",
        text: "浙江省",
        value: "浙江省",
        open: true
    }, {pId: "0_1_32", id: "0_1_32_11", text: "舟山市", value: "舟山市", open: true}, {
        pId: "0_1",
        id: "0_1_33",
        text: "重庆市( 共1个 )",
        value: "重庆市",
        open: true
    }, {pId: "0_1_33", id: "0_1_33_0", text: "重庆市区", value: "重庆市区", open: true}],

    TREE: [{id: -1, pId: -2, value: "根目录", text: "根目录"},
        {id: 1, pId: -1, value: "第一级目录1", text: "第一级目录1"},
        {id: 11, pId: 1, value: "第二级文件1", text: "第二级文件1"},
        {id: 12, pId: 1, value: "第二级目录2", text: "第二级目录2"},
        {id: 121, pId: 12, value: "第三级目录1", text: "第三级目录1"},
        {id: 122, pId: 12, value: "第三级文件1", text: "第三级文件1"},
        {id: 1211, pId: 121, value: "第四级目录1", text: "第四级目录1"},
        {
            id: 12111,
            pId: 1211,
            value: "第五级文件1",
            text: "第五级文件111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
        },
        {id: 2, pId: -1, value: "第一级目录2", text: "第一级目录2"},
        {id: 21, pId: 2, value: "第二级目录3", text: "第二级目录3"},
        {id: 22, pId: 2, value: "第二级文件2", text: "第二级文件2"},
        {id: 211, pId: 21, value: "第三级目录2", text: "第三级目录2"},
        {id: 212, pId: 21, value: "第三级文件2", text: "第三级文件2"},
        {id: 2111, pId: 211, value: "第四级文件1", text: "第四级文件1"}],
    LEVELTREE: [{
        id: 1,
        text: "第一项",
        value: "1"
    }, {
        id: 2,
        text: "第二项",
        value: "2"
    }, {
        id: 3,
        text: "第三项",
        value: "3",
        open: true
    }, {
        id: 11,
        pId: 1,
        text: "子项1",
        value: "11"
    }, {
        id: 12,
        pId: 1,
        text: "子项2",
        value: "12"
    }, {
        id: 13,
        pId: 1,
        text: "子项3",
        value: "13"
    }, {
        id: 31,
        pId: 3,
        text: "子项1",
        value: "31"
    }, {
        id: 32,
        pId: 3,
        text: "子项2",
        value: "32"
    }, {
        id: 33,
        pId: 3,
        text: "子项3",
        value: "33"
    }]
};


//# sourceMappingURL=demo.js.map