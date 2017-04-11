Demo = {
    version: 1.0
};

BI.i18n = {
    "BI-Basic_OK": "确定"
};

BI.servletURL = "dist/";
BI.resourceURL = "dist/resource/";
BI.i18n = {};$(function () {
    var ref;
    BI.createWidget({
        type: "demo.main",
        ref: function (_ref) {
            console.log(_ref);
            ref = _ref;
        },
        element: '#wrapper'
    });
    // ref.destroy();
});Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: 'bi.button',
                    text: '一般按钮',
                    level: 'common',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示成功状态按钮',
                    level: 'success',
                    height: 30
                }
            },
            {
                el: {
                    type: 'bi.button',
                    text: '表示警告状态的按钮',
                    level: 'warning',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示忽略状态的按钮',
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '普通灰化按钮',
                    disabled: true,
                    level: 'success',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '忽略状态灰化按钮',
                    disabled: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '带图标的按钮',
                    //level: 'ignore',
                    iconClass: "rename-font",
                    height: 30
                }
            }
        ];
        BI.each(items, function (i, item) {
            item.el.handler = function () {
                BI.Msg.alert('按钮', this.options.text);
            }
        });
        return {
            type: "bi.left",
            vgap: 200,
            hgap: 20,
            items: items
        }
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
                    type: 'bi.icon_button',
                    cls: "rename-font",
                    width: 20,
                    height: 20
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
BI.shortcut("demo.icon_button", Demo.Button);Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: 'bi.image_button',
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
        }
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
                    type: 'bi.text_button',
                    text: '文字按钮',
                    height: 30
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
BI.shortcut("demo.text_button", Demo.Button);Demo.Label = BI.inherit(BI.Widget, {
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
        }
    }
});
BI.shortcut("demo.label", Demo.Label);Demo.Message = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-bubble"
    },
    render: function () {
        return {
            type: "bi.center_adapt",
            items : [
                {
                    el : {
                        type : 'bi.button',
                        text : '点击我弹出一个消息框',
                        height : 30,
                        handler : function() {
                            BI.Msg.alert('测试消息框', '我是测试消息框的内容');
                        }
                    }
                }
            ]
        }
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
        }
    }
});
BI.shortcut("demo.pager", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var svg = BI.createWidget({
            type: "bi.svg",
            width: 500,
            height: 600
        });

        var circle = svg.circle(100, 100, 10);
        circle.animate({fill: "#223fa3", stroke: "#000", "stroke-width": 80, "stroke-opacity": 0.5}, 2000);

        var el = svg.rect(10, 200, 300, 200);
        el.transform("t100,100r45t-100,0");

        svg.path("M10,10L50,50M50,10L10,50")
            .attr({stroke: "red"});

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: svg,
                left: 100,
                top: 50
            }]
        })
    }
});
BI.shortcut("demo.svg", Demo.Func);Demo.CodeEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        var editor = BI.createWidget({
            type: "bi.code_editor",
            cls: "mvc-border",
            width: 600,
            height: 400
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
        })
    }
});
BI.shortcut("demo.code_editor", Demo.CodeEditor);Demo.Editor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        var editor1 = BI.createWidget({
            type: "bi.editor",
            cls: "mvc-border",
            watermark: "alert信息显示在下面",
            errorText: "字段不可重名!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
            width: 200,
            height: 30
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
            height: 30
        });
        var editor3 = BI.createWidget({
            type: "bi.editor",
            cls: "mvc-border",
            watermark: "输入'a'会有错误信息且回车键不能退出编辑",
            errorText: "字段不可重名",
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
            height: 30
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
        })
    }
});
BI.shortcut("demo.editor", Demo.Editor);Demo.CodeEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        this.formula = BI.createWidget({
            type : 'bi.formula_editor',
            width : 300,
            height : 200,
            value : 'SUM(C5, 16, 26)'
        });
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this.formula],
            hgap: 20,
            vgap: 20
        })
    }
});
BI.shortcut("demo.formula_editor", Demo.CodeEditor);Demo.CodeEditor = BI.inherit(BI.Widget, {
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
        }
    }
});
BI.shortcut("demo.multifile_editor", Demo.CodeEditor);Demo.CodeEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        var editor = BI.createWidget({
            type: "bi.textarea_editor",
            cls: "mvc-border",
            width: 600,
            height: 400
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
        })
    }
});
BI.shortcut("demo.textarea_editor", Demo.CodeEditor);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var items = [], header = [], columnSize = [];

        var rowCount = 100, columnCount = 100;
        for (var i = 0; i < 1; i++) {
            header[i] = [];
            for (var j = 0; j < columnCount; j++) {
                header[i][j] = {
                    type: "bi.label",
                    text: "表头" + i + "-" + j
                }
                columnSize[j] = 100;
            }
        }
        for (var i = 0; i < rowCount; i++) {
            items[i] = [];
            for (var j = 0; j < columnCount; j++) {
                items[i][j] = {
                    type: "bi.label",
                    text: (i < 3 ? 0 : i) + "-" + j
                }
            }
        }

        var table = BI.createWidget({
            type: "bi.resizable_table",
            el: {
                type: "bi.collection_table"
            },
            width: 600,
            height: 500,
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
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: table,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
BI.shortcut("demo.collection_table", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var items = [], header = [], columnSize = [];

        var rowCount = 100, columnCount = 100;
        for (var i = 0; i < 1; i++) {
            header[i] = [];
            for (var j = 0; j < columnCount; j++) {
                header[i][j] = {
                    type: "bi.label",
                    text: "表头" + i + "-" + j
                }
                columnSize[j] = 100;
            }
        }
        for (var i = 0; i < rowCount; i++) {
            items[i] = [];
            for (var j = 0; j < columnCount; j++) {
                items[i][j] = {
                    type: "bi.label",
                    text: (i < 3 ? 0 : i) + "-" + j
                }
            }
        }

        var table = BI.createWidget({
            type: "bi.resizable_table",
            el: {
                type: "bi.grid_table",
            },
            width: 600,
            height: 500,
            isResizeAdapt: true,
            isNeedResize: true,
            isNeedFreeze: true,
            freezeCols: [0, 1],
            columnSize: columnSize,
            items: items,
            header: header
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: table,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
BI.shortcut("demo.grid_table", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var items = [], header = [], columnSize = [];

        var rowCount = 100, columnCount = 100;
        for (var i = 0; i < 1; i++) {
            header[i] = [];
            for (var j = 0; j < columnCount; j++) {
                header[i][j] = {
                    type: "bi.label",
                    text: "表头" + i + "-" + j
                }
                columnSize[j] = 100;
            }
        }
        for (var i = 0; i < rowCount; i++) {
            items[i] = [];
            for (var j = 0; j < columnCount; j++) {
                items[i][j] = {
                    type: "bi.label",
                    text: (i < 3 ? 0 : i) + "-" + j
                }
            }
        }

        var table = BI.createWidget({
            type: "bi.resizable_table",
            el: {
                type: "bi.grid_table",
            },
            width: 600,
            height: 500,
            isResizeAdapt: true,
            isNeedResize: true,
            isNeedFreeze: true,
            freezeCols: [0, 1],
            columnSize: columnSize,
            items: items,
            header: header
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: table,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
BI.shortcut("demo.resizable_table", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var items = [[{
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }], [{
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }], [{
            text: "第三行第一列"
        }, {
            text: "第三行第二列"
        }, {
            text: "第三行第三列"
        }], [{
            text: "第四行第一列"
        }, {
            text: "第四行第二列"
        }, {
            text: "第四行第三列"
        }], [{
            text: "第五行第一列"
        }, {
            text: "第五行第二列"
        }, {
            text: "第五行第三列"
        }], [{
            text: "第六行第一列"
        }, {
            text: "第六行第二列"
        }, {
            text: "第六行第三列"
        }], [{
            text: "第七行第一列"
        }, {
            text: "第七行第二列"
        }, {
            text: "第七行第三列"
        }], [{
            text: "第八行第一列"
        }, {
            text: "第八行第二列"
        }, {
            text: "第八行第三列"
        }], [{
            text: "第九行第一列"
        }, {
            text: "第九行第二列"
        }, {
            text: "第九行第三列"
        }], [{
            text: "第十行第一列"
        }, {
            text: "第十行第二列"
        }, {
            text: "第十行第三列"
        }], [{
            text: "第十一行第一列"
        }, {
            text: "第十一行第二列"
        }, {
            text: "第十一行第三列"
        }], [{
            text: "第十二行第一列"
        }, {
            text: "第十二行第二列"
        }, {
            text: "第十二行第三列"
        }], [{
            text: "第十三行第一列"
        }, {
            text: "第十三行第二列"
        }, {
            text: "第十三行第三列"
        }], [{
            text: "第十四行第一列"
        }, {
            text: "第十四行第二列"
        }, {
            text: "第十四行第三列"
        }], [{
            text: "第十五行第一列"
        }, {
            text: "第十五行第二列"
        }, {
            text: "第十五行第三列"
        }], [{
            text: "第十六行第一列"
        }, {
            text: "第十六行第二列"
        }, {
            text: "第十六行第三列"
        }], [{
            text: "第十七行第一列"
        }, {
            text: "第十七行第二列"
        }, {
            text: "第十七行第三列"
        }], [{
            text: "第十八行第一列"
        }, {
            text: "第十八行第二列"
        }, {
            text: "第十八行第三列"
        }]];


        var items2 = [[{
            text: "第一行第一列"
        }, {
            text: "第一行第二列"
        }, {
            text: "第一行第三列"
        }, {
            text: "第一行第四列"
        }, {
            text: "第一行第五列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第二行第二列"
        }, {
            text: "第二行第三列"
        }, {
            text: "第二行第四列"
        }, {
            text: "第二行第五列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第二行第二列"
        }, {
            text: "第三行第三列"
        }, {
            text: "第三行第四列"
        }, {
            text: "第三行第五列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第四行第二列"
        }, {
            text: "第四行第三列"
        }, {
            text: "第四行第四列"
        }, {
            text: "第四行第五列"
        }]


            , [{
                text: "第五行第一列"
            }, {
                text: "第五行第一列"
            }, {
                text: "第五行第三列"
            }, {
                text: "第五行第四列"
            }, {
                text: "第五行第五列"
            }], [{
                text: "第六行第一列"
            }, {
                text: "第六行第一列"
            }, {
                text: "第六行第三列"
            }, {
                text: "第六行第四列"
            }, {
                text: "第六行第五列"
            }], [{
                text: "第七行第一列"
            }, {
                text: "第七行第二列"
            }, {
                text: "第七行第三列"
            }, {
                text: "第七行第四列"
            }, {
                text: "第七行第五列"
            }], [{
                text: "第八行第一列"
            }, {
                text: "第八行第二列"
            }, {
                text: "第八行第三列"
            }, {
                text: "第八行第四列"
            }, {
                text: "第八行第五列"
            }], [{
                text: "第九行第一列"
            }, {
                text: "第九行第二列"
            }, {
                text: "第九行第三列"
            }, {
                text: "第九行第四列"
            }, {
                text: "第九行第五列"
            }], [{
                text: "第十行第一列"
            }, {
                text: "第十行第二列"
            }, {
                text: "第十行第三列"
            }, {
                text: "第十行第四列"
            }, {
                text: "第十行第五列"
            }], [{
                text: "第十一行第一列"
            }, {
                text: "第十一行第二列"
            }, {
                text: "第十一行第三列"
            }, {
                text: "第十一行第四列"
            }, {
                text: "第十一行第五列"
            }], [{
                text: "第十二行第一列"
            }, {
                text: "第十二行第二列"
            }, {
                text: "第十二行第三列"
            }, {
                text: "第十二行第四列"
            }, {
                text: "第十二行第五列"
            }], [{
                text: "第十三行第一列"
            }, {
                text: "第十三行第二列"
            }, {
                text: "第十三行第三列"
            }, {
                text: "第十三行第四列"
            }, {
                text: "第十三行第五列"
            }], [{
                text: "第十四行第一列"
            }, {
                text: "第十四行第二列"
            }, {
                text: "第十四行第三列"
            }, {
                text: "第十四行第四列"
            }, {
                text: "第十四行第五列"
            }]];

        var header = [[{
            text: "表头1"
        }, {
            text: "表头2"
        }, {
            text: "表头3"
        }]];

        var header2 = [[{
            text: "表头1"
        }, {
            text: "表头2"
        }, {
            text: "表头3"
        }, {
            text: "表头4"
        }, {
            text: "表头5"
        }]];

        var table1 = BI.createWidget({
            type: "bi.table_view",
            isNeedResize: true,
            isNeedMerge: true,
            mergeCols: [0, 1],
            columnSize: [100, 200, 300],
            items: items,
            header: header
        });
        var table2 = BI.createWidget({
            type: "bi.table_view",
            isNeedMerge: true,
            isNeedFreeze: true,
            freezeCols: [0, 1],
            mergeCols: [0, 1],
            columnSize: [100, 200, 300, 400, 500],
            items: items2,
            header: header2
        });
        var table3 = BI.createWidget({
            type: "bi.table_view",
            isNeedMerge: true,
            isNeedFreeze: true,
            freezeCols: [4],
            mergeCols: [0, 1],
            columnSize: [100, 200, 300, 400, 100],
            items: items2,
            header: header2
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.grid",
                    columns: 2,
                    rows: 2,
                    items: [{
                        column: 0,
                        row: 0,
                        el: table1
                    }, {
                        column: 1,
                        row: 0,
                        el: table2
                    }, {
                        column: 0,
                        row: 1,
                        el: table3
                    }, {
                        column: 1,
                        row: 1,
                        el: {
                            type: "bi.vertical",
                            items: [{
                                type: "bi.button",
                                text: "第一个表setColumnSize([300, 200, 100])",
                                handler: function () {
                                    table1.setColumnSize([300, 200, 100]);
                                }
                            }, {
                                type: "bi.button",
                                text: "第二个表setColumnSize([50, 100, 150, 200, 250])",
                                handler: function () {
                                    table2.setColumnSize([50, 100, 150, 200, 250]);
                                }
                            }, {
                                type: "bi.button",
                                text: "第三个表setColumnSize([50, 100, 150, 200, 50])",
                                handler: function () {
                                    table3.setColumnSize([50, 100, 150, 200, 50]);
                                }
                            }],
                            vgap: 10
                        }
                    }]
                },
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
BI.shortcut("demo.table_view", Demo.Func);Demo.Bubble = BI.inherit(BI.Widget, {
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
        }
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
                    type: 'bi.button',
                    text: '简单Toast测试',
                    height : 30,
                    handler: function(){
                        BI.Msg.toast("这是一条简单的数据");
                    }
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '很长的Toast测试',
                    height : 30,
                    handler: function(){
                        BI.Msg.toast("这是一条很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的数据")
                    }
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '非常长的Toast测试',
                    height : 30,
                    handler: function(){
                        BI.Msg.toast("这是一条非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长的数据")
                    }
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '错误提示Toast测试',
                    level: "warning",
                    height : 30,
                    handler: function(){
                        BI.Msg.toast("错误提示Toast测试", "warning");
                    }
                }
            }
        ];
        BI.createWidget({
            type: "bi.left",
            element: this,
            vgap : 200,
            hgap : 20,
            items: items
        })
    }
});
BI.shortcut("demo.toast", Demo.Toast);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
    }
});
BI.shortcut("demo.part_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
    }
});
BI.shortcut("demo.sync_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createDefaultTree: function(){
        var tree = BI.createWidget({
            type: "bi.tree_view"
        });
        tree.initTree([
            {"id":1, "pId":0, "text":"test1", open:true},
            {"id":11, "pId":1, "text":"test11"},
            {"id":12, "pId":1, "text":"test12"},
            {"id":111, "pId":11, "text":"test111"},
            {"id":2, "pId":0, "text":"test2", open:true},
            {"id":21, "pId":2, "text":"test21"},
            {"id":22, "pId":2, "text":"test22"}
        ])
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
                                text: 'tree.initTree([{"id":1, "pId":0, "text":"test1", open:true},{"id":11, "pId":1, "text":"test11"},{"id":12, "pId":1, "text":"test12"},{"id":111, "pId":11, "text":"test111"}])',
                                whiteSpace: "normal"
                            },
                            height: 50
                        }
                    ]
                }
            }]
        })
    }
});
BI.shortcut("demo.tree_view", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    _createNav: function(v){
        var m = this.MONTH, y = this.YEAR;
        m += v;
        while(m < 0){
            y--;
            m += 12;
        }
        while(m > 11){
            y++;
            m -= 12;
        }
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: false
            },
            year: y,
            month: m,
            day: this.DAY
        })
        calendar.setValue(this.selectedTime);
        return calendar;
    },

    _stringfyTimeObject: function(timeOb){
        return timeOb.year + "-" + (timeOb.month + 1) + "-" + timeOb.day;
    },

    render: function () {
        var self = this;
        var combo1 = BI.createWidget({
            type: "bi.bubble_combo",
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
BI.shortcut("demo.bubble_combo", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    _createNav: function(v){
        var m = this.MONTH, y = this.YEAR;
        m += v;
        while(m < 0){
            y--;
            m += 12;
        }
        while(m > 11){
            y++;
            m -= 12;
        }
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: false
            },
            year: y,
            month: m,
            day: this.DAY
        })
        calendar.setValue(this.selectedTime);
        return calendar;
    },

    _stringfyTimeObject: function(timeOb){
        return timeOb.year + "-" + (timeOb.month + 1) + "-" + timeOb.day;
    },

    render: function () {
        var self = this, d = new Date();
        this.YEAR = d.getFullYear();
        this.MONTH = d.getMonth();
        this.DAY = d.getDate();

        this.selectedTime = {
            year: this.YEAR,
            month: this.MONTH,
            day: this.DAY
        };

        var tip = BI.createWidget({
            type: "bi.label"
        });

        var nav = BI.createWidget({
            type: "bi.navigation",
            element: this,
            tab: {
                height: 30,
                items: [{
                    once: false,
                    text: "后退",
                    value: -1,
                    cls: "mvc-button layout-bg3"
                },tip, {
                    once: false,
                    text: "前进",
                    value: 1,
                    cls: "mvc-button layout-bg4"
                }]
            },
            cardCreator: BI.bind(this._createNav, this),

            afterCardCreated: function(){

            },

            afterCardShow: function(){
                this.setValue(self.selectedTime);
            }
        })

        nav.on(BI.Navigation.EVENT_CHANGE, function(){
            self.selectedTime = nav.getValue();
            tip.setText(self._stringfyTimeObject(self.selectedTime));
        });
        tip.setText(this._stringfyTimeObject(this.selectedTime));
    }
});
BI.shortcut("demo.calendar", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.color_chooser",
                    width: 30,
                    height: 30
                },
                left: 100,
                top: 250
            }]
        }
    }
});
BI.shortcut("demo.color_chooser", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var canvas = BI.createWidget({
            type: "bi.complex_canvas",
            width: 500,
            height: 600
        });
        canvas.branch(55, 100, 10, 10, 100, 10, 200, 10, {
            offset: 20,
            strokeStyle: "red",
            lineWidth: 2
        });

        canvas.branch(220, 155, 120, 110, 150, 200, {
            offset: 40
        });

        canvas.stroke();

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: canvas,
                left: 100,
                top: 50
            }]
        })
    }
});
BI.shortcut("demo.complex_canvas", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var editor = BI.createWidget({
            type: "bi.text_editor",
            width: 200,
            height: 30,
            value: "这是复制的内容"
        });
        var zclip = BI.createWidget({
            type: 'bi.zero_clip',
            width: 100,
            height: 100,
            cls: 'layout-bg1',
            copy: function () {
                return editor.getValue();
            },

            afterCopy: function () {
                BI.Msg.toast(editor.getValue());
            }
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: editor,
                left: 100,
                top: 50,
            }, {
                el: zclip,
                left: 100,
                top: 100
            }]
        })
    }
});
BI.shortcut("demo.zclip", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var relation = BI.createWidget({
            type: "bi.branch_relation",
            items: [
                {
                    id: -1,
                    value: "根目录",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 1,
                    pId: -1,
                    value: "第一级目录1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 11,
                    pId: 1,
                    value: "第二级文件1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 12,
                    pId: 1,
                    value: "第二级目录1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 121,
                    pId: 12,
                    value: "第三级目录1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 122,
                    pId: 12,
                    value: "第三级文件1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 1211,
                    pId: 121,
                    value: "第四级目录",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 12111,
                    pId: 1211,
                    value: "第五级文件1",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 2,
                    pId: -1,
                    value: "第一级目录2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 21,
                    pId: 2,
                    value: "第二级目录2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 22,
                    pId: 2,
                    value: "第二级文件2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 211,
                    pId: 21,
                    value: "第三级目录2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 212,
                    pId: 21,
                    value: "第三级文件2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                },
                {
                    id: 2111,
                    pId: 211,
                    value: "第四级文件2",
                    type: "bi.text_button",
                    cls: "layout-bg2",
                    width: 180,
                    height: 100
                }
            ],

            direction: BI.Direction.Right,
            align: BI.HorizontalAlign.Right,

            centerOffset: -50
        });
        BI.createWidget({
            type: "bi.adaptive",
            element: this,
            items: [relation]
        })
    }
});
BI.shortcut("demo.branch_relation", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createBranchTree: function () {
        var tree = BI.createWidget({
            type: "bi.branch_tree",
            items: [{
                el: {
                    text: "且",
                    value: "且1",
                    cls: "layout-bg7"
                },
                children: [{
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字1",
                    value: "这里是一段文字1"
                }, {
                    el: {
                        text: "或",
                        value: "或2",
                        cls: "layout-bg7"
                    },
                    children: [{
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字1435",
                        value: "这里是一段文字1435"
                    }, {
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字1xx",
                        value: "这里是一段文字1xx"
                    }, {
                        el: {
                            text: "且",
                            value: "且3",
                            cls: "layout-bg7"
                        },
                        children: [{
                            type: "bi.label",
                            height: 30,
                            textAlign: "left",
                            text: "可以理解为一个条件",
                            value: "可以理解为一个条件"
                        }, {
                            type: "bi.label",
                            height: 30,
                            textAlign: "left",
                            text: "可以理解为一个条件v",
                            value: "可以理解为一个条件v"
                        }]
                    }]
                }, {
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字1xa",
                    value: "这里是一段文字1xa"
                }]
            }]
        });
        return tree;
    },

    _createBranchMapTree: function () {
        var tree = BI.createWidget({
            type: "bi.branch_tree",
            el: {
                type: "bi.virtual_group"
            },
            items: [{
                text: "且",
                value: "且1",
                cls: "layout-bg7",
                children: [{
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字1",
                    value: "这里是一段文字1"
                }, {
                    text: "或",
                    value: "或2",
                    cls: "layout-bg7",
                    children: [{
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字1435",
                        value: "这里是一段文字1435"
                    }, {
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字1xx",
                        value: "这里是一段文字1xx"
                    }, {
                        text: "且",
                        value: "且3",
                        cls: "layout-bg7",
                        children: [{
                            type: "bi.label",
                            height: 30,
                            textAlign: "left",
                            text: "可以理解为一个条件",
                            value: "可以理解为一个条件"
                        }, {
                            type: "bi.label",
                            height: 30,
                            textAlign: "left",
                            text: "可以理解为一个条件v",
                            value: "可以理解为一个条件v"
                        }]
                    }]
                }, {
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字1xa",
                    value: "这里是一段文字1xa"
                }]
            }]
        });
        return tree;
    },

    render: function () {
        var tree = this._createBranchTree();
        var mapTree = this._createBranchMapTree();

        function getItems() {
            return [{
                text: "且",
                value: "且",
                cls: "layout-bg7",
                children: [{
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字",
                    value: "这里是一段文字"
                }, {
                    text: "或",
                    value: "或2",
                    cls: "layout-bg7",
                    children: [{
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字",
                        value: "这里是一段文字"
                    }, {
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字" ,
                        value: "这里是一段文字"
                    }, {
                        text: "且",
                        value: "且3",
                        cls: "layout-bg7",
                        children: [{
                            type: "bi.label",
                            height: 30,
                            textAlign: "left",
                            text: "可以理解为一个条件",
                            value: "可以理解为一个条件"
                        }]
                    }]
                }, {
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字1xa",
                    value: "这里是一段文字1xa"
                }]
            }];
        }

        BI.createWidget({
            type: "bi.center",
            element: this,
            items: [{
                type: "bi.vtape",
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
            }, {
                type: "bi.vtape",
                items: [{
                    el: mapTree
                }, {
                    height: 30,
                    el: {
                        type: "bi.button",
                        height: 30,
                        text: "populate",
                        handler: function () {
                            mapTree.populate(getItems());
                        }
                    }
                }, {
                    height: 30,
                    el: {
                        type: "bi.button",
                        height: 30,
                        text: "getValue",
                        handler: function () {
                            BI.Msg.alert("", mapTree.getValue());
                        }
                    }
                }]
            }]
        })
    }
});
BI.shortcut("demo.branch_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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

    _createHandStandBranchTree: function () {
        var tree = BI.createWidget({
            type: "bi.handstand_branch_tree",
            expander: {},
            el: {
                layouts: [{
                    type: "bi.horizontal_adapt",
                    verticalAlign: BI.VerticalAlign.Top
                }]
            },
            items: [{
                el: {
                    text: "且",
                    value: "且1",
                    cls: "layout-bg7"
                },
                children: [{
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字1",
                    value: "这里是一段文字1"
                }, {
                    el: {
                        text: "或",
                        value: "或2",
                        cls: "layout-bg7"
                    },
                    children: [{
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字1435",
                        value: "这里是一段文字1435"
                    }, {
                        type: "bi.label",
                        height: 30,
                        textAlign: "left",
                        text: "这里是一段文字1xx",
                        value: "这里是一段文字1xx"
                    }, {
                        el: {
                            text: "且",
                            value: "且3",
                            cls: "layout-bg7"
                        },
                        children: [{
                            type: "bi.label",
                            height: 30,
                            textAlign: "left",
                            text: "可以理解为一个条件",
                            value: "可以理解为一个条件"
                        }, {
                            type: "bi.label",
                            height: 30,
                            textAlign: "left",
                            text: "可以理解为一个条件v",
                            value: "可以理解为一个条件v"
                        }]
                    }]
                }, {
                    type: "bi.label",
                    height: 30,
                    textAlign: "left",
                    text: "这里是一段文字1xa",
                    value: "这里是一段文字1xa"
                }]
            }]
        });
        return tree;
    },

    render: function () {
        var tree = this._createHandStandBranchTree();

        BI.createWidget({
            type: "bi.center",
            element: this,
            items: [{
                type: "bi.vtape",
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
            }]
        })
    }
});
BI.shortcut("demo.handstand_branch_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
        })

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
        })
    }
});
BI.shortcut("demo.level_tree", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        //value值一定要是字符串
        var tree = BI.createWidget({
            type: "bi.simple_tree",
            items: []
        });

        tree.populate([{
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
        }], "z");
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
                        tree.setValue(['31', '32', '33']);
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
        })
    }
});
BI.shortcut("demo.simple_tree", Demo.Func);Demo.Center = BI.inherit(BI.Widget, {
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
            defaultShowIndex: "demo.face",
            cardCreator: function (v) {
                return BI.createWidget({
                    type: v
                });
            }
        }
    },

    setValue: function (v) {
        this.tab.setSelect(v);
    }
});
BI.shortcut("demo.center", Demo.Center);Demo.TreeValueChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tree-value-chooser"
    },
    render: function () {

        var tree = [];
        for (var i = 0; i < 21; i++) {
            tree.push({
                value: i + "",
                text: i + "",
                id: i + "",
                pId: null
            });
            for (var j = 0; j < 9; j++) {
                tree.push({
                    value: i + "-" + j,
                    text: j + "",
                    id: i + "-" + j,
                    pId: i + ""
                })
            }
        }
        var widget = BI.createWidget({
            type: "bi.tree_value_chooser_combo",
            width: 300,
            items: tree,
            itemsCreator: function (op, callback) {
                callback(tree);
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
BI.shortcut("demo.tree_value_chooser", Demo.TreeValueChooser);
Demo.ValueChooserCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-value-chooser-combo"
    },
    render: function () {
        var widget = BI.createWidget({
            type: "bi.value_chooser_combo",
            itemsCreator: function (op, callback) {
                callback(BI.deepClone(Demo.MULTI_COMBO_ITEMS));
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
BI.shortcut("demo.value_chooser_combo", Demo.ValueChooserCombo);Demo.BASE_CONFIG = [{
    id: 2,
    text: "基础控件",
    open: true
}, {
    pId: 2,
    text: "bi.label",
    value: "demo.label"
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
    text: "message提示",
    value: "demo.message"
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
    text: "bi.code_editor",
    value: "demo.code_editor"
}, {
    pId: 202,
    text: "bi.multifile_editor",
    value: "demo.multifile_editor"
}, {
    pId: 202,
    text: "bi.textarea_editor",
    value: "demo.textarea_editor"
}, {
    pId: 202,
    text: "bi.formula_editor",
    value: "demo.formula_editor"
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
    text: "bi.sync_tree",
    value: "demo.sync_tree"
}, {
    pId: 203,
    text: "bi.part_tree",
    value: "demo.part_tree"
}, {
    pId: 2,
    id: 204,
    text: "table"
}, {
    pId: 204,
    text: "bi.table_view",
    value: "demo.table_view"
}, {
    pId: 204,
    text: "bi.grid_table",
    value: "demo.grid_table"
}, {
    pId: 204,
    text: "bi.collection_table",
    value: "demo.collection_table"
}, {
    pId: 204,
    text: "bi.resizable_table",
    value: "demo.resizable_table"
}, {
    pId: 2,
    text: "bi.canvas",
    value: "demo.canvas"
}, {
    pId: 2,
    text: "bi.pager",
    value: "demo.pager"
}, {
    pId: 2,
    text: "bi.svg",
    value: "demo.svg"
}];Demo.CASE_CONFIG = [{
    id: 3,
    text: "实例控件",
    open: true,
}, {
    pId: 3,
    id: 301,
    text: "editors"
}, {
    pId: 301,
    text: "bi.record_editor",
    value: "demo.record_editor"
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
    pId: 3,
    id: 302,
    text: "combo"
}, {
    pId: 302,
    text: "bi.bubble_combo",
    value: "demo.bubble_combo"
}, {
    pId: 3,
    id: 303,
    text: "tree"
}, {
    pId: 303,
    text: "bi.branch_tree",
    value: "demo.branch_tree"
}, {
    pId: 303,
    text: "bi.handstand_branch_tree",
    value: "demo.handstand_branch_tree"
}, {
    pId: 303,
    text: "bi.display_tree",
    value: "demo.display_tree"
}, {
    pId: 303,
    text: "bi.simple_tree",
    value: "demo.simple_tree"
}, {
    pId: 303,
    text: "bi.level_tree",
    value: "demo.level_tree"
}, {
    pId: 303,
    text: "bi.branch_relation",
    value: "demo.branch_relation"
}, {
    pId: 3,
    id: 304,
    text: "table"
}, {
    pId: 304,
    text: "bi.adaptive_table",
    value: "demo.adaptive_table"
}, {
    pId: 304,
    text: "bi.tree_table",
    value: "demo.tree_table"
}, {
    pId: 304,
    text: "bi.layer_tree_table",
    value: "demo.layer_tree_table"
}, {
    pId: 3,
    text: "bi.calendar",
    value: "demo.calendar"
}, {
    pId: 3,
    text: "bi.zclip",
    value: "demo.zclip"
}, {
    pId: 3,
    text: "bi.complex_canvas",
    value: "demo.complex_canvas"
}, {
    pId: 3,
    text: "bi.color_chooser",
    value: "demo.color_chooser"
}, {
    pId: 3,
    text: "bi.segment",
    value: "demo.segment"
}];/**
 * Created by User on 2017/3/22.
 */
Demo.COMPONENT_CONFIG = [{
    id: 15,
    text: "部件"
}, {
    pId: 15,
    text: "bi.value_chooser_combo",
    value: "demo.value_chooser_combo"
}, {
    pId: 15,
    text: "bi.tree_value_chooser_combo",
    value: "demo.tree_value_chooser"
}];Demo.CORE_CONFIG = [{
    id: 1,
    text: "核心控件",
}, {
    id: 101,
    pId: 1,
    text: "布局"
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
    text: "bi.inline",
    value: "demo.inline"
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
    id: 10201,
    text: "组合控件"
}, {
    pId: 10201,
    text: "bi.combo",
    value: "demo.combo"
}, {
    pId: 10201,
    text: "bi.expander",
    value: "demo.expander"
}, {
    pId: 10201,
    text: "bi.group_combo",
    value: "demo.group_combo"
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
    text: "bi.layer_float_box",
    value: "demo.layer_float_box"
}, {
    pId: 10202,
    text: "bi.layer_popup",
    value: "demo.layer_popup"
}, {
    pId: 10202,
    text: "bi.layer_searcher",
    value: "demo.layer_searcher"
}, {
    pId: 1,
    text: "widget",
    value: "demo.widget"
}, {
    pId: 1,
    text: "single",
    value: "demo.single"
}, {
    pId: 1,
    text: "BasicButton",
    value: "demo.basic_button"
}, {
    pId: 1,
    text: "NodeButton",
    value: "demo.node_button"
}, {
    pId: 1,
    text: "pane",
    value: "demo.pane"
}];Demo.WIDGET_CONFIG = [{
    id: 4,
    text: "详细控件"
}, {
    id: 401,
    pId: 4,
    text: "table"
}, {
    pId: 401,
    text: "bi.preview_table",
    value: "demo.preview_table"
}, {
    pId: 401,
    text: "bi.responsive_table",
    value: "demo.responsive_table"
}, {
    pId: 401,
    text: "bi.sequence_table",
    value: "demo.sequence_table"
}, {
    pId: 401,
    text: "bi.page_table",
    value: "demo.page_table"
}, {
    pId: 4,
    text: "bi.multi_select_combo",
    value: "demo.multi_select_combo"
}, {
    pId: 4,
    text: "bi.path_chooser",
    value: "demo.path_chooser"
}, {
    pId: 4,
    text: "bi.relation_view",
    value: "demo.relation_view"
}];Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.layout",
        }
    }
});
BI.shortcut("demo.combo", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
                        height: 200,
                    }]
                }],
                items: [{
                    el: {
                        type: "bi.label",
                        text: "button_group是一类具有相同属性或相似属性的抽象, 本案例实现的是布局的嵌套(vertical布局下内嵌center_adapt布局)"
                    },
                    height: 150,
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
                    }])
                }
            }]

        }
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
                type: "bi.center_adapt",
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
        }
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
            items: items,
            cellSizeAndPositionGetter: function (index) {
                return {
                    x: index % 10 * 50,
                    y: Math.floor(index / 10) * 50,
                    width: 50,
                    height: 50
                }
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
        })
    }
});
BI.shortcut("demo.collection_view", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
                }
            }
        }
        var grid = BI.createWidget({
            type: "bi.grid_view",
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
        })
    }
});
BI.shortcut("demo.grid_view", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createItems: function () {
        var items = BI.makeArray(100, {
            type: "demo.virtual_group_item"
        });
        items[0].value = BI.UUID();
        return items;
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vertical",
            vgap: 20,
            items: [{
                type: "bi.virtual_group",
                width: 500,
                height: 300,
                ref: function () {
                    self.buttonMap = this;
                },
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical"
                }, {
                    type: "bi.center_adapt",
                }],
                items: this._createItems()
            }, {
                type: "bi.button",
                text: "点击刷新",
                handler: function () {
                    var items = self._createItems();
                    items.pop();
                    self.buttonMap.populate(items);
                }
            }]

        }
    }
});
BI.shortcut("demo.virtual_group", Demo.Func);

Demo.Item = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-item",
        height: 30
    },

    render: function () {
        var self = this;
        return {
            type: "bi.label",
            ref: function () {
                self.label = this;
            },
            height: this.options.height,
            text: "这是一个测试项" + BI.UUID()
        }
    },

    update: function (item) {
        this.label.setText(item.value);
        console.log("更新了一项");
        return true;
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
                if (!op.node) {//根节点
                    callback([{
                        "id": 1,
                        "pId": 0,
                        type: "bi.plus_group_node",
                        text: "test1",
                        value: 1,
                        height: 25,
                        isParent: true
                    }, {
                        "id": 2,
                        "pId": 0,
                        type: "bi.plus_group_node",
                        "text": "test2",
                        value: 1,
                        isParent: true,
                        open: true,
                        height: 25
                    }])
                } else {
                    if (op.node.id == 1) {
                        callback([
                            {
                                "id": 11,
                                "pId": 1,
                                type: "bi.plus_group_node",
                                "text": "test11",
                                value: 11,
                                height: 25,
                                isParent: true
                            },
                            {
                                "id": 12,
                                "pId": 1,
                                type: "bi.single_select_item",
                                "text": "test12",
                                value: 12,
                                height: 35
                            },
                            {
                                "id": 13,
                                "pId": 1,
                                type: "bi.single_select_item",
                                "text": "test13",
                                value: 13,
                                height: 35
                            },
                            {
                                "id": 14,
                                "pId": 1,
                                type: "bi.single_select_item",
                                "text": "test14",
                                value: 14,
                                height: 35
                            },
                            {
                                "id": 15,
                                "pId": 1,
                                type: "bi.single_select_item",
                                "text": "test15",
                                value: 15,
                                height: 35
                            },
                            {
                                "id": 16,
                                "pId": 1,
                                type: "bi.single_select_item",
                                "text": "test16",
                                value: 16,
                                height: 35
                            },
                            {"id": 17, "pId": 1, type: "bi.single_select_item", "text": "test17", value: 17, height: 35}
                        ])
                    } else if (op.node.id == 2) {
                        callback([{
                            "id": 21,
                            "pId": 2,
                            type: "bi.single_select_item",
                            "text": "test21",
                            value: 21,
                            height: 35
                        },
                            {
                                "id": 22,
                                "pId": 2,
                                type: "bi.single_select_item",
                                "text": "test22",
                                value: 22,
                                height: 35
                            }])
                    } else if (op.node.id == 11) {
                        callback([{
                            "id": 111,
                            "pId": 11,
                            type: "bi.single_select_item",
                            "text": "test111",
                            value: 111,
                            height: 35
                        }])
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
        })
    }
});
BI.shortcut("demo.custom_tree", Demo.Func);Demo.AbsoluteLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.button",
                    text: "absolute"
                },
                left: 100,
                top: 100
            }]
        }
    }
});
BI.shortcut("demo.absolute", Demo.AbsoluteLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.BorderLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-border"
    },

    _createNorth: function(){
        return BI.createWidget({
            type: "bi.label",
            text: "North",
            cls: "layout-bg1",
            height: 30
        })
    },

    _createWest: function(){
        return BI.createWidget({
            type: "bi.center",
            cls: "layout-bg2",
            items:[{
                type: "bi.label",
                text: "West",
                whiteSpace: "normal"
            }]
        })
    },

    _createCenter: function(){
        return BI.createWidget({
            type: "bi.center",
            cls: "layout-bg3",
            items: [{
                type: "bi.label",
                text: "Center",
                whiteSpace: "normal"
            }]
        })
    },

    _createEast: function(){
        return BI.createWidget({
            type: "bi.center",
            cls: "layout-bg5",
            items: [{
                type: "bi.label",
                text: "East",
                whiteSpace: "normal"
            }]
        })
    },

    _createSouth: function(){
        return BI.createWidget({
            type: "bi.label",
            text: "South",
            cls: "layout-bg6",
            height: 50
        })
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
        }
    }
});
BI.shortcut("demo.border", Demo.BorderLayout);Demo.CenterAdapt = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 2,
            items: [{
                column: 0,
                row: 0,
                el: this._createNoWidth()
            }, {
                column: 0,
                row: 1,
                el: this._createBottom()
            }]
        }
    },

    _createNoWidth: function () {
        return BI.createWidget({
            type: "bi.center_adapt",
            hgap: 10,
            items: [{
                type: "bi.label",
                text: "Center Adapt 1，center adapt布局只会影响容器内部的位置（水平和垂直居中）而不会影响到内部控件本身属性",
                cls: "layout-bg1",
                height: 30
            }, {
                type: "bi.label",
                text: "Center Adapt 2，根据内部控件的宽度的比例来计算",
                cls: "layout-bg2",
                height: 30
            }, {
                type: "bi.label",
                text: "Center Adapt 3，这些label都是没有宽度的",
                cls: "layout-bg3",
                height: 30
            }, {
                type: "bi.label",
                text: "Center Adapt 4",
                cls: "layout-bg5",
                height: 30
            }]
        })
    },

    _createBottom: function () {
        return BI.createWidget({
            type: "bi.center_adapt",
            items: [{
                type: "bi.text_button",
                text: "这个是有宽度和高度的按钮-1",
                height: "100%",
                width: 160,
                cls: "layout-bg1"
            }, {
                type: "bi.text_button",
                text: "这个是有宽度和高度的按钮-2",
                height: 30,
                width: 160,
                cls: "layout-bg2"
            }, {
                type: "bi.text_button",
                text: "这个是有宽度和高度的按钮-3",
                height: 30,
                width: 160,
                cls: "layout-bg3"
            }, {
                type: "bi.text_button",
                text: "这个是有宽度和高度的按钮-4",
                height: 30,
                width: 160,
                cls: "layout-bg5"
            }]
        })
    },
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
                text: "Center 1，这里虽然设置label的高度30，但是最终影响高度的是center布局",
                cls: "layout-bg1",
                whiteSpace: "normal"
            },{
                type: "bi.label",
                text: "Center 2，为了演示label是占满整个的，用了一个whiteSpace:normal",
                cls: "layout-bg2",
                whiteSpace: "normal"
            },{
                type: "bi.label",
                text: "Center 3",
                cls: "layout-bg3"
            },{
                type: "bi.label",
                text: "Center 4",
                cls: "layout-bg5"
            }],
            hgap: 20,
            vgap: 20
        }
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
                text: "floatCenter与center的不同在于，它可以控制最小宽度和最大宽度",
                cls: "layout-bg2",
                whiteSpace: "normal"
            }],
            hgap: 20,
            vgap: 20
        }
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
                    cls: "layout-bg1",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-2",
                    cls: "layout-bg2",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-3",
                    cls: "layout-bg3",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-4",
                    cls: "layout-bg4",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-5",
                    cls: "layout-bg5",
                    hgap: 20
                }],
                hgap: 20,
                vgap: 20
            }, {
                type: "bi.right",
                items: [{
                    type: "bi.label",
                    height: 30,
                    text: "Right-1",
                    cls: "layout-bg1",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-2",
                    cls: "layout-bg2",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-3",
                    cls: "layout-bg3",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-4",
                    cls: "layout-bg4",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-5",
                    cls: "layout-bg5",
                    hgap: 20
                }],
                hgap: 20,
                vgap: 20
            }]
        }
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
        }
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
            vgap: 10,
            items: [{
                type: "bi.label",
                text: "Horizontal Adapt左右自适应",
                cls: "layout-bg1",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "Horizontal Adapt左右自适应",
                cls: "layout-bg2",
                //width: 300,
                height: 30
            }]
        })
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
        }
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
            vgap: 10,
            items: [{
                type: "bi.label",
                text: "Horizontal Auto左右自适应",
                cls: "layout-bg1",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "Horizontal Auto左右自适应",
                cls: "layout-bg2",
                width: 300,
                height: 30
            }]
        })
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
        }
    }
});
BI.shortcut("demo.horizontal_auto", Demo.HorizontalAuto);/**
 * Created by User on 2017/3/22.
 */
Demo.HorizontalFloat = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal-float"
    },

    _createLayout: function () {
        return BI.createWidget({
            type: "bi.horizontal_float",
            vgap: 10,
            items: [{
                type: "bi.label",
                text: "Horizontal Float左右自适应",
                cls: "layout-bg1",
                width: 100
            }]
        })
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
        }
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
            items: [{
                type: "bi.horizontal",
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: {
                            type: "bi.text_button",
                            cls: "layout-bg1",
                            text: "这里设置了lgap(左边距)，rgap(右边距)，tgap(上边距)，bgap(下边距)这里设置了lgap(左边距)，rgap(右边距)，tgap(上边距)，bgap(下边距)",
                            height: 30
                        },
                        left: 0,
                        right: 0
                    }],
                    width: 100,
                    height: 30
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: {
                            type: "bi.text_button",
                            cls: "layout-bg2",
                            text: "这里设置了lgap(左边距)，rgap(右边距)，tgap(上边距)，bgap(下边距)这里设置了lgap(左边距)，rgap(右边距)，tgap(上边距)，bgap(下边距)",
                            height: 30
                        },
                        left: 0,
                        right: 0
                    }],
                    width: 200,
                    height: 30
                }]
            }],
            lgap: 20,
            rgap: 80,
            tgap: 80,
            bgap: 50
        }
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
            items : [
                {
                    width: 100,
                    el : {
                        type : 'bi.label',
                        text : '1',
                        cls: "layout-bg1"
                    }
                }, {
                    width: 200,
                    el : {
                        type : 'bi.label',
                        text : '2',
                        cls: "layout-bg2"
                    }
                }, {
                    width: 'fill',
                    el : {
                        type : 'bi.label',
                        text : '3',
                        cls: "layout-bg3"
                    }
                }
            ]
        }
    }
});
BI.shortcut("demo.htape", Demo.HtapeLayout);/**
 * Created by User on 2017/3/22.
 */
Demo.InlineLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-inline"
    },
    render: function () {
        return {
            type: "bi.inline",
            items: [{
                type: "bi.label",
                height: 30,
                text: "Left-1",
                cls: "layout-bg1",
                hgap: 200
            }, {
                type: "bi.label",
                height: 30,
                text: "Left-2",
                cls: "layout-bg2",
                hgap: 200
            }, {
                type: "bi.label",
                height: 30,
                text: "Left-3",
                cls: "layout-bg3",
                hgap: 200
            }, {
                type: "bi.label",
                height: 30,
                text: "Left-4",
                cls: "layout-bg4",
                hgap: 200
            }, {
                type: "bi.label",
                height: 30,
                text: "Left-5",
                cls: "layout-bg5",
                hgap: 200
            }],
            hgap: 20,
            vgap: 20
        }
    }
});
BI.shortcut("demo.inline", Demo.InlineLayout);/**
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
        }
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
        }
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
                //, {
                //    column: 0,
                //    row: 1,
                //    el: this._createTable2()
                //}
            ]
        }
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
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg1"
                        }
                    }, {
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg2"
                        }
                    }, {
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg3"
                        }
                    }], [{
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg5"
                        }
                    }, {
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg6"
                        }
                    }, {
                        el: {
                            type: 'bi.label',
                            text: '这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写',
                            cls: "layout-bg7"
                        }
                    }]
                ], {
                    whiteSpace: "normal"
                })
            }]
        }
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
                text: "Vertical Adapt上下自适应",
                cls: "layout-bg1",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "Vertical Adapt上下自适应",
                cls: "layout-bg2",
                width: 300,
                height: 30
            }]
        })
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
        }
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
            items: [{
                type: "bi.label",
                cls: "layout-bg1",
                text: "这里设置了hgap(水平间距)，vgap(垂直间距)",
                height: 30
            }, {
                type: "bi.label",
                cls: "layout-bg2",
                text: "这里设置了hgap(水平间距)，vgap(垂直间距)",
                height: 30
            }]
        }
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
            items : [
                {
                    height: 100,
                    el : {
                        type : 'bi.label',
                        text : '1',
                        cls: "layout-bg1"
                    }
                }, {
                    height: 200,
                    el : {
                        type : 'bi.label',
                        text : '2',
                        cls: "layout-bg2"
                    }
                }, {
                    height: 'fill',
                    el : {
                        type : 'bi.label',
                        text : '3',
                        cls: "layout-bg3"
                    }
                }
            ]
        }
    }
});
BI.shortcut("demo.vtape", Demo.VtapeLayout);Demo.Face = BI.inherit(BI.Widget, {
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
        }
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
                    width: 30,
                    height: 30
                }]
            }
        }
    },

    _createBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
            height: 40,
            items: [this._createLabel("背景色："), this._createColorPicker(function () {
                self.backgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
            height: 40,
            items: [this._createLabel("字体颜色："), this._createColorPicker(function () {
                self.fontColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createDisableFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
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
                    forceCenter: true,
                    disabled: true
                }
            }]
        }
    },

    _createCardBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
            height: 40,
            items: [this._createLabel("Card背景颜色："), this._createColorPicker(function () {
                self.cardBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createHoverBackgroundColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
            height: 40,
            items: [this._createLabel("悬浮状态背景颜色："), this._createColorPicker(function () {
                self.hoverBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createActiveBackgroundColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
            height: 40,
            items: [this._createLabel("激活状态背景颜色："), this._createColorPicker(function () {
                self.activeBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createBaseConfig: function () {
        return {
            type: "bi.vertical",
            items: [this._createLabel("--通用配色--"),
                this._createBackgroundConfig(),
                this._createFontConfig(),
                this._createDisableFontConfig(),
                this._createCardBackgroundConfig(),
                this._createHoverBackgroundColor(),
                this._createActiveBackgroundColor()
            ]
        }
    },

    _createScrollBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
            height: 40,
            items: [this._createLabel("滚动条底色："), this._createColorPicker(function () {
                self.scrollBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createScrollThumbConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
            height: 40,
            items: [this._createLabel("滚动条thumb颜色："), this._createColorPicker(function () {
                self.scrollThumbColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },

    _createPopupBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
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
                                    value: 22,
                                }, {
                                    text: "column 1.3",
                                    cls: "dot-e-font",
                                    value: 23,
                                }, {
                                    text: "column 1.4",
                                    cls: "dot-e-font",
                                    value: 24,
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
                                }, {text: "column 2.2", value: 12, cls: "dot-e-font"}],


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
        }
    },

    _createMaskBackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item",
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
                            BI.Msg.alert("弹出层", "弹出层面板")
                        }
                    }]
                }
            }]
        }
    },

    _createCommonConfig: function () {
        return {
            type: "bi.vertical",
            items: [this._createLabel("--一般配色--"),
                this._createScrollBackgroundConfig(),
                this._createScrollThumbConfig(),
                this._createPopupBackgroundConfig(),
                this._createMaskBackgroundConfig()
            ]
        }
    },

    render: function () {
        var self = this;
        return {
            type: "bi.grid",
            items: [[{
                column: 0,
                row: 0,
                el: {
                    type: "demo.preview",
                    cls: "face-config"
                }
            }, {
                column: 1,
                row: 0,
                el: {
                    type: "bi.vertical",
                    items: [this._createBaseConfig(),
                        this._createCommonConfig()]
                }
            }]]
        }
    },

    _setStyle: function (objects) {
        var result = "";
        BI.each(objects, function (cls, object) {
            result += cls + "{";
            BI.each(object, function (name, value) {
                result += name + ":" + value + ";"
            });
            result += "} ";
        });
        BI.StyleLoaders.removeStyle("style").loadStyle("style", result);
    },

    _runGlobalStyle: function () {
        var backgroundColor = this.backgroundColor.getValue();
        var fontColor = this.fontColor.getValue();
        var disabledFontColor = this.disabledFontColor.getValue();
        var cardBackgroundColor = this.cardBackgroundColor.getValue();
        var hoverBackgroundColor = this.hoverBackgroundColor.getValue();
        var activeBackgroundColor = this.activeBackgroundColor.getValue();

        var scrollBackgroundColor = this.scrollBackgroundColor.getValue();
        var scrollThumbColor = this.scrollThumbColor.getValue();
        var popupBackgroundColor = this.popupBackgroundColor.getValue();
        var maskBackgroundColor = this.maskBackgroundColor.getValue();

        $("#wrapper").css({
            backgroundColor: backgroundColor,
            color: fontColor
        });
        $(".demo-west,.preview-card").css({
            backgroundColor: cardBackgroundColor
        });
        this._setStyle({
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
                "background-color": hoverBackgroundColor
            },
            ".bi-list-item-active:active,.bi-list-item-select:active,.bi-list-item-effect:active": {
                "background-color": activeBackgroundColor
            }
        })
    },

    mounted: function () {
        this.backgroundColor.setValue("");
        this.fontColor.setValue("");
        this.disabledFontColor.setValue("");
        this.cardBackgroundColor.setValue("");
        this.hoverBackgroundColor.setValue("");
        this.activeBackgroundColor.setValue("");

        this.scrollBackgroundColor.setValue("");
        this.scrollThumbColor.setValue("");
        this.popupBackgroundColor.setValue("");
        this.maskBackgroundColor.setValue("");
        this._runGlobalStyle();
    }
});
BI.shortcut("demo.face", Demo.Face);Demo.Main = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-main"
    },
    render: function () {
        var center;
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
                                center.setValue(v);
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
                                center.setValue(v);
                            }
                        }]
                    }
                },
                center: {
                    el: {
                        type: "demo.center",
                        ref: function (_ref) {
                            center = _ref;
                        }
                    }
                }
            }
        }
    }
});
BI.shortcut("demo.main", Demo.Main);Demo.North = BI.inherit(BI.Widget, {
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
                            self.fireEvent(Demo.North.EVENT_VALUE_CHANGE, "demo.face")
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
                            $("body").removeClass("bi-theme-default").addClass("bi-theme-dark");
                        }
                    }, {
                        type: "bi.text_button",
                        text: "典雅白",
                        handler: function () {
                            $("body").removeClass("bi-theme-dark").addClass("bi-theme-default");
                        }
                    }]
                }
            }]
        }
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
                }
                columnSize[j] = 100;
            }
        }
        for (var i = 0; i < rowCount; i++) {
            items[i] = [];
            for (var j = 0; j < columnCount; j++) {
                items[i][j] = {
                    type: "bi.label",
                    text: (i < 3 ? 0 : i) + "-" + j
                }
            }
        }
        return {
            type: "bi.center",
            cls: "preview-background",
            hgap: 100,
            vgap: 100,
            items: [{
                type: "bi.vtape",
                cls: "preview-card",
                items: [{
                    el: {
                        type: "bi.label",
                        cls: "preview-title",
                        height: 40,
                        text: "统计组件",
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
            }]
        }
    },
    mounted: function () {
    }
});
BI.shortcut("demo.preview", Demo.Preview);Demo.West = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-west"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.multilayer_single_level_tree",
                listeners: [{
                    eventName: BI.MultiLayerSingleLevelTree.EVENT_CHANGE,
                    action: function (v) {
                        self.fireEvent(Demo.West.EVENT_VALUE_CHANGE, v);
                    }
                }],
                items: Demo.CONFIG
            }]
        }
    }
});
Demo.West.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
BI.shortcut("demo.west", Demo.West);/**
 * Created by User on 2017/3/22.
 */
Demo.MultiSelectCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-multi-select-combo"
    },

    _createMultiSelectCombo: function () {
        var self = this;
        var widget = BI.createWidget({
            type: 'bi.multi_select_combo',
            itemsCreator: BI.bind(this._itemsCreator, this),
            width: 200
        });

        widget.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            BI.Msg.toast(JSON.stringify(this.getValue()));
        });

        return widget;
    },

    _getItemsByTimes: function (items, times) {
        var res = [];
        for (var i = (times - 1) * 3; items[i] && i < times * 3; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * 3 < items.length;
    },

    _itemsCreator: function (options, callback) {
        var self = this;
        var items = Demo.MULTI_COMBO_ITEMS;
        var keywords = (options.keywords || []).slice();
        if (options.keyword) {
            keywords.push(options.keyword);
        }
        BI.each(keywords, function (i, kw) {
            var search = BI.Func.getSearchResult(items, kw);
            items = search.matched.concat(search.finded);
        });
        if (options.selected_values) {//过滤
            var filter = BI.makeObject(options.selected_values, true);
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
            type: 'bi.absolute',
            scrolly: false,
            items: [{
                el: this._createMultiSelectCombo(),
                right: 10,
                top: 10
            }]
        }
    }
});
BI.shortcut("demo.multi_select_combo", Demo.MultiSelectCombo);/**
 * Created by User on 2017/3/22.
 */
Demo.PathChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-path-chooser"
    },
    render: function () {
        var pathchooser = BI.createWidget({
            type: "bi.path_chooser",
            width: 800,
            height: 400,
            items: //    [
            //    [{region: "区域X", value: "X1"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E"},
            //        {region: "区域G", value: "G"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E"},
            //        {region: "区域G", value: "G"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        //{region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E"},
            //        {region: "区域G", value: "G"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E1"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E1"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域E", value: "E1"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域F", value: "F"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X"},
            //        {region: "区域Q", value: "Q"},
            //        {region: "区域A", value: "A"},
            //        {region: "区域B", value: "B"},
            //        {region: "区域C", value: "C"},
            //        {region: "区域D", value: "D"},
            //        {region: "区域F", value: "F"},
            //        {region: "区域H", value: "H"},
            //        {region: "区域I", value: "I"},
            //        {region: "区域J", value: "J"}],
            //    [{region: "区域X", value: "X", text: "X"},
            //        {region: "区域Q", value: "Q", text: "Q"},
            //        {region: "区域A", value: "A", text: "A"},
            //        {region: "区域C", value: "C", text: "C"},
            //        {region: "区域D", value: "D", text: "D"},
            //        {region: "区域F", value: "F", text: "F"},
            //        {region: "区域H", value: "H", text: "H"},
            //        {region: "区域I", value: "I", text: "I"},
            //        {region: "区域J", value: "J", text: "J"}]
            //]
                [[{
                    "region": "8c4460bc3605685e",
                    "regionText": "采购订单XXX",
                    "text": "ID",
                    "value": "1"
                }, {
                    "region": "0fbd0dc648f41e97",
                    "regionText": "采购订单",
                    "text": "学号",
                    "value": "3"
                }, {
                    "region": "c6d72d6c7e19a667",
                    "regionText": "供应商基本信息",
                    "text": "ID",
                    "value": "5"
                }], [{
                    "region": "ed013e18cc7c8637",
                    "regionText": "采购订单XXX",
                    "text": "ID",
                    "value": "1"
                }, {
                    "region": "153d75878431f8ee",
                    "regionText": "A3",
                    "text": "学号",
                    "value": "2"
                }, {
                    "region": "3861fb024c7d7825",
                    "regionText": "采购订单",
                    "text": "学号",
                    "value": "3"
                }, {
                    "region": "88e3e5071bd10bc5",
                    "regionText": "供应商",
                    "text": "ID",
                    "value": "4"
                }, {
                    "region": "8476c77ab5c147e0",
                    "regionText": "供应商基本信息",
                    "text": "ID",
                    "value": "5"
                }], [{
                    "region": "f00f67fbb9fba6fe",
                    "regionText": "采购订单XXX",
                    "text": "ID",
                    "value": "1"
                }, {
                    "region": "1e8badf5d5793408",
                    "regionText": "A3",
                    "text": "学号",
                    "value": "2"
                }, {
                    "region": "de1ebd3d0986a294",
                    "regionText": "供应商基本信息",
                    "text": "ID",
                    "value": "5"
                }]]
        });
        pathchooser.setValue();
        return {
            type: "bi.absolute",
            items: [{
                el: pathchooser,
                left: 100,
                top: 100
            }, {
                el: {
                    type: "bi.button",
                    text: "getValue",
                    handler: function () {
                        BI.Msg.toast(JSON.stringify(pathchooser.getValue()));
                    }
                },
                left: 100,
                bottom: 10
            }]
        }
    }
});
BI.shortcut("demo.path_chooser", Demo.PathChooser);/**
 * Created by User on 2017/3/22.
 */
Demo.RelationView = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-relation-view"
    },
    render: function () {
        var relationview = BI.createWidget({
            type: "bi.relation_view",
            items: [
                {
                    primary: {
                        region: "B", regionText: "比", regionTitle: "bbb", regionHandler: function () {
                            alert("a")
                        },


                        title: "b2...",
                        value: "b2", text: "b2字段",
                        handler: function () {
                            alert("d")
                        }
                    },
                    foreign: {region: "C", value: "c1", text: "c1字段"}
                },
                {
                    primary: {region: "A", value: "a1", text: "a1字段"},
                    foreign: {region: "C", value: "c2", text: "c2字段"}
                },
                {
                    primary: {region: "C", value: "c3", text: "c3字段"},
                    foreign: {region: "D", value: "d1", text: "d1字段"}
                },
                {
                    primary: {region: "A", value: "a1", text: "a1字段"},
                    foreign: {region: "B", value: "b1", text: "b1字段"}
                },

                {
                    primary: {region: "X", value: "x1", text: "x1字段"},
                    foreign: {region: "Y", value: "y1", text: "y1字段"}
                },
                {
                    primary: {region: "X", value: "x2", text: "x2字段"},
                    foreign: {region: "Z", value: "z1", text: "z1字段"}
                },
                {
                    primary: {region: "X", value: "x2", text: "x2字段"},
                    foreign: {region: "B", value: "b1", text: "b1字段"}
                },
                {
                    primary: {region: "X33", value: "x233", text: "x233字段"},
                }
            ]
        });
        return {
            type: "bi.float_center_adapt",
            items: [{
                el: relationview
            }]
        }
    }
});
BI.shortcut("demo.relation_view", Demo.RelationView);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var items = [{
            children: [{
                type: "bi.page_table_cell",
                text: "node1",
                children: [{
                    type: "bi.page_table_cell",
                    text: "childnode1",
                    values: [{type: "bi.page_table_cell", text: 101}, {
                        type: "bi.page_table_cell",
                        text: 102
                    }, {type: "bi.page_table_cell", text: 101}, {
                        type: "bi.page_table_cell",
                        text: 102
                    }, {type: "bi.page_table_cell", text: 101}]
                }, {
                    type: "bi.page_table_cell",
                    text: "childnode2",
                    values: [{type: "bi.page_table_cell", text: 201}, {
                        type: "bi.page_table_cell",
                        text: 202
                    }, {type: "bi.page_table_cell", text: 201}, {
                        type: "bi.page_table_cell",
                        text: 202
                    }, {type: "bi.page_table_cell", text: 201}]
                }],
                values: [{type: "bi.page_table_cell", text: 1001}, {
                    type: "bi.page_table_cell",
                    text: 1002
                }, {type: "bi.page_table_cell", text: 1001}, {
                    type: "bi.page_table_cell",
                    text: 1002
                }, {type: "bi.page_table_cell", text: 1001}]
            }], values: [{type: "bi.page_table_cell", text: 12001}, {
                type: "bi.page_table_cell",
                text: 12002
            }, {type: "bi.page_table_cell", text: 12001}, {
                type: "bi.page_table_cell",
                text: 12002
            }, {type: "bi.page_table_cell", text: 12001}]
        }];

        var header = [{
            type: "bi.page_table_cell",
            text: "header1"
        }, {
            type: "bi.page_table_cell",
            text: "header2"
        }, {
            type: "bi.page_table_cell",
            text: "jine",
            tag: 1
        }, {
            type: "bi.page_table_cell",
            text: "jine",
            tag: 2
        }, {
            type: "bi.page_table_cell",
            text: "jine",
            tag: 3
        }, {
            type: "bi.page_table_cell",
            text: "金额汇总",
            tag: 4
        }, {
            type: "bi.page_table_cell",
            text: "金额汇总2",
            tag: 5
        }];

        var crossHeader = [{
            type: "bi.page_table_cell",
            text: "cross1"
        }, {
            type: "bi.page_table_cell",
            text: "cross2"
        }];

        var crossItems = [{
            children: [{
                type: "bi.page_table_cell",
                text: "node1",
                values: [1, 2, 3]
            }, {
                type: "bi.page_table_cell",
                text: "node3",
                values: [1, 2]
            }],
            //values: [1, 2]
        }];

        var table1 = BI.createWidget({
            type: "bi.page_table",
            el: {
                type: "bi.sequence_table",
                showSequence: true,
                el: {
                    type: "bi.dynamic_summary_tree_table",
                    el: {
                        type: "bi.adaptive_table",
                        el: {
                            type: "bi.resizable_table",
                            el: {
                                type: "bi.collection_table"
                            }
                        }
                    },
                },
                sequence: {
                    type: "bi.sequence_table_dynamic_number"
                }
            },
            summaryCellStyleGetter: function (isLast) {
                return isLast ? {
                    backgroundColor: "#6495ED",
                    color: "#ffffff"
                } : {
                    backgroundColor: "#B0C4DE",
                    color: "#ffffff"
                }
            },
            sequenceCellStyleGetter: function (index) {
                return {
                    backgroundColor: "#87CEEB",
                    color: "#ffffff"
                }
            },
            headerCellStyleGetter: function () {
                return {
                    backgroundColor: "#6495ED",
                    color: "#ffffff"
                }
            },
            pager: {
                horizontal: {
                    pages: false, //总页数
                    curr: 1, //初始化当前页， pages为数字时可用

                    hasPrev: function (page) {
                        return page > 1;
                    },
                    hasNext: function (page) {
                        return page < 3;
                    }
                },
                vertical: {
                    pages: false, //总页数
                    curr: 1, //初始化当前页， pages为数字时可用

                    hasPrev: function (page) {
                        return page > 1;
                    },
                    hasNext: function (page) {
                        return page < 3;
                    }
                }
            },
            itemsCreator: function (op, populate) {
                var vpage = op.vpage || "";
                var hpage = op.hpage || "";
                BI.each(header, function (i, h) {
                    h.text = h.text + "V" + vpage + "H" + hpage;
                });
                populate(items, header, crossItems, crossHeader);
            },
            width: 600,
            height: 400,
            columnSize: [100, 100, 100, 100, 100, 100, 100],
            minColumnSize: [100, 100, 100, 100, 100, 100, 100],
            isNeedMerge: true,
            isNeedFreeze: true,
            mergeCols: [0, 1],
            mergeRule: function (col1, col2) {
                if (col1 === col2) {
                    return true;
                }
                if (col1.tag && col2.tag) {
                    return col1.tag === col2.tag;
                }
                return col1 === col2;
            },
            freezeCols: [0, 1],
            header: header,
            items: items,
            crossHeader: crossHeader,
            crossItems: crossItems
        });
        // table1.populate(items, header, crossItems, crossHeader);
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.grid",
                    columns: 1,
                    rows: 1,
                    items: [[{
                        el: table1
                    }]]
                },
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
BI.shortcut("demo.page_table", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var items = [[{
            text: "第一行第一列"
        }, {
            text: "第一行第二列"
        }, {
            text: "第一行第三列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第二行第二列"
        }, {
            text: "第二行第三列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第三行第二列"
        }, {
            text: "第三行第三列"
        }], [{
            text: "第二行第一列"
        }, {
            text: "第四行第二列"
        }, {
            text: "第四行第三列"
        }], [{
            text: "第五行第一列"
        }, {
            text: "第五行第二列"
        }, {
            text: "第五行第三列"
        }], [{
            text: "第六行第一列"
        }, {
            text: "第六行第二列"
        }, {
            text: "第六行第三列"
        }], [{
            text: "第七行第一列"
        }, {
            text: "第七行第二列"
        }, {
            text: "第七行第三列"
        }], [{
            text: "第八行第一列"
        }, {
            text: "第八行第二列"
        }, {
            text: "第八行第三列"
        }], [{
            text: "第九行第一列"
        }, {
            text: "第九行第二列"
        }, {
            text: "第九行第三列"
        }], [{
            text: "第十行第一列"
        }, {
            text: "第十行第二列"
        }, {
            text: "第十行第三列"
        }], [{
            text: "第十一行第一列"
        }, {
            text: "第十一行第二列"
        }, {
            text: "第十一行第三列"
        }], [{
            text: "第十二行第一列"
        }, {
            text: "第十二行第二列"
        }, {
            text: "第十二行第三列"
        }], [{
            text: "第十三行第一列"
        }, {
            text: "第十三行第二列"
        }, {
            text: "第十三行第三列"
        }], [{
            text: "第十四行第一列"
        }, {
            text: "第十四行第二列"
        }, {
            text: "第十四行第三列"
        }], [{
            text: "第十五行第一列"
        }, {
            text: "第十五行第二列"
        }, {
            text: "第十五行第三列"
        }], [{
            text: "第十六行第一列"
        }, {
            text: "第十六行第二列"
        }, {
            text: "第十六行第三列"
        }], [{
            text: "第十七行第一列"
        }, {
            text: "第十七行第二列"
        }, {
            text: "第十七行第三列"
        }], [{
            text: "第十八行第一列"
        }, {
            text: "第十八行第二列"
        }, {
            text: "第十八行第三列"
        }]];

        var header = [[{
            text: "表头1"
        }, {
            text: "表头2"
        }, {
            text: "表头3"
        }]];

        var table1 = BI.createWidget({
            type: "bi.preview_table",
            columnSize: ["", "", ""],
            header: header,
            items: items
        });
        var table2 = BI.createWidget({
            type: "bi.preview_table",
            header: header,
            columnSize: [100, "", 50],
            items: items
        });
        var table3 = BI.createWidget({
            type: "bi.preview_table",
            header: header,
            columnSize: [0.2, 0.4, 0.4],
            headerRowSize: 30,
            items: items
        });
        var table4 = BI.createWidget({
            type: "bi.preview_table",
            header: header,
            isNeedFreeze: true,
            freezeCols: [0, 1],
            columnSize: [0.2, "", 0.4],
            items: items
        });
        var table5 = BI.createWidget({
            type: "bi.preview_table",
            header: header,
            isNeedFreeze: true,
            freezeCols: [0, 1],
            columnSize: [200, 100, ""],
            items: items
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.grid",
                    columns: 3,
                    rows: 2,
                    items: [[{
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table1,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table2,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table3,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }], [{
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table4,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: table5,
                                left: 5,
                                right: 5,
                                top: 5,
                                bottom: 5
                            }]
                        }
                    }]]
                },
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
BI.shortcut("demo.preview_table", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var items = [[{
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }], [{
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }, {
            text: "第一行第一列"
        }], [{
            text: "第三行第一列"
        }, {
            text: "第三行第二列"
        }, {
            text: "第三行第三列"
        }], [{
            text: "第四行第一列"
        }, {
            text: "第四行第二列"
        }, {
            text: "第四行第三列"
        }], [{
            text: "第五行第一列"
        }, {
            text: "第五行第二列"
        }, {
            text: "第五行第三列"
        }], [{
            text: "第六行第一列"
        }, {
            text: "第六行第二列"
        }, {
            text: "第六行第三列"
        }], [{
            text: "第七行第一列"
        }, {
            text: "第七行第二列"
        }, {
            text: "第七行第三列"
        }], [{
            text: "第八行第一列"
        }, {
            text: "第八行第二列"
        }, {
            text: "第八行第三列"
        }], [{
            text: "第九行第一列"
        }, {
            text: "第九行第二列"
        }, {
            text: "第九行第三列"
        }], [{
            text: "第十行第一列"
        }, {
            text: "第十行第二列"
        }, {
            text: "第十行第三列"
        }], [{
            text: "第十一行第一列"
        }, {
            text: "第十一行第二列"
        }, {
            text: "第十一行第三列"
        }], [{
            text: "第十二行第一列"
        }, {
            text: "第十二行第二列"
        }, {
            text: "第十二行第三列"
        }], [{
            text: "第十三行第一列"
        }, {
            text: "第十三行第二列"
        }, {
            text: "第十三行第三列"
        }], [{
            text: "第十四行第一列"
        }, {
            text: "第十四行第二列"
        }, {
            text: "第十四行第三列"
        }], [{
            text: "第十五行第一列"
        }, {
            text: "第十五行第二列"
        }, {
            text: "第十五行第三列"
        }], [{
            text: "第十六行第一列"
        }, {
            text: "第十六行第二列"
        }, {
            text: "第十六行第三列"
        }], [{
            text: "第十七行第一列"
        }, {
            text: "第十七行第二列"
        }, {
            text: "第十七行第三列"
        }], [{
            text: "第十八行第一列"
        }, {
            text: "第十八行第二列"
        }, {
            text: "第十八行第三列"
        }]];


        var header = [[{
            text: "表头1"
        }, {
            text: "表头2"
        }, {
            text: "表头3"
        }]];


        var table1 = BI.createWidget({
            type: "bi.responsive_table",
            isNeedMerge: true,
            isNeedFreeze: true,
            mergeCols: [0, 1],
            columnSize: ["", "", ""],
            items: items,
            header: header
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.grid",
                    columns: 2,
                    rows: 2,
                    items: [{
                        column: 0,
                        row: 0,
                        el: table1
                    }]
                },
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }]
        })
    }
});
BI.shortcut("demo.responsive_table", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var items = [{
            children: [{
                text: "节点1",
                children: [{
                    text: "子节点1",
                    children: [{
                        text: "叶节点1",
                        values: [{text: 11}, {text: 12}, {text: 11}, {text: 12}, {text: 11}, {text: 12}, {text: 112}]
                    }, {
                        text: "叶节点2",
                        values: [{text: 21}, {text: 22}, {text: 21}, {text: 22}, {text: 21}, {text: 22}, {text: 122}]
                    }],
                    values: [{text: 101}, {text: 102}, {text: 101}, {text: 102}, {text: 101}, {text: 102}, {text: 1102}]
                }, {
                    text: "子节点2",
                    children: [{
                        text: "叶节点3",
                        values: [{text: 31}, {text: 32}, {text: 31}, {text: 32}, {text: 31}, {text: 32}, {text: 132}]
                    }, {
                        text: "叶节点4",
                        values: [{text: 41}, {text: 42}, {text: 41}, {text: 42}, {text: 41}, {text: 42}, {text: 142}]
                    }],
                    values: [{text: 201}, {text: 202}, {text: 201}, {text: 202}, {text: 201}, {text: 202}, {text: 1202}]
                }, {
                    text: "子节点3",
                    children: [{
                        text: "叶节点5",
                        values: [{text: 51}, {text: 52}, {text: 51}, {text: 52}, {text: 51}, {text: 52}, {text: 152}]
                    }],
                    values: [{text: 301}, {text: 302}, {text: 301}, {text: 302}, {text: 301}, {text: 302}, {text: 1302}]
                }],
                values: [{text: 1001}, {text: 1002}, {text: 1001}, {text: 1002}, {text: 1001}, {text: 1002}, {text: 11002}]
            }, {
                text: "节点2",
                values: [{text: 2001}, {text: 2002}, {text: 2001}, {text: 2002}, {text: 2001}, {text: 2002}, {text: 12002}]
            }],
            values: [{text: 12001}, {text: 12002}, {text: 12001}, {text: 12002}, {text: 12001}, {text: 12002}, {text: 112002}]
        }];

        var header = [{
            text: "header1"
        }, {
            text: "header2"
        }, {
            text: "header3"
        }, {
            text: "金额",
            tag: 1
        }, {
            text: "金额",
            tag: 2
        }, {
            text: "金额",
            tag: 3
        }, {
            text: "金额",
            tag: 4
        }, {
            text: "金额",
            tag: 5
        }, {
            text: "金额",
            tag: 6
        }, {
            text: "金额",
            tag: 7
        }];

        var crossHeader = [{
            text: "cross1"
        }, {
            text: "cross2"
        }];

        var crossItems = [{
            children: [{
                text: "节点1",
                children: [{
                    text: "子节点1"
                }, {
                    text: "子节点2"
                }],
                values: [0]
            }, {
                text: "节点2",
                children: [{
                    text: "子节点3"
                }, {
                    text: "子节点4"
                }],
                values: [0]
            }],
            values: [0]
        }];
        var table = BI.createWidget({
            type: "bi.sequence_table",
            el: {
                type: "bi.tree_table",
                el: {
                    type: "bi.adaptive_table",
                    el: {
                        type: "bi.resizable_table",
                        el: {
                            type: "bi.collection_table"
                        }
                    }
                },
            },
            sequence: {
                type: "bi.sequence_table_tree_number"
            },
            showSequence: true,
            width: 600,
            height: 400,
            isNeedResize: true,
            isNeedMerge: true,
            mergeRule: function (row1, row2) {
                return row1 === row2;
            },
            columnSize: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            minColumnSize: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            isNeedFreeze: true,
            freezeCols: [0, 1, 2],
            mergeCols: [0, 1, 2],
            header: header,
            items: items,
            crossHeader: crossHeader,
            crossItems: crossItems
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
                        el: table
                    }]
                },
                left: 10,
                right: 10,
                top: 10,
                bottom: 50
            }]
        })
    }
});
BI.shortcut("demo.sequence_table", Demo.Func);Demo.CONFIG = Demo.CORE_CONFIG.concat(Demo.BASE_CONFIG).concat(Demo.CASE_CONFIG).concat(Demo.WIDGET_CONFIG).concat(Demo.COMPONENT_CONFIG);
Demo.stringsForMultiCombo = "    柳州市城贸金属材料有限责任公司      柳州市建福房屋租赁有限公司      柳州市迅昌数码办公设备有限责任公司      柳州市河海贸易有限责任公司      柳州市花篮制衣厂      柳州市兴溪物资有限公司      柳州市针织总厂      柳州市衡管物资有限公司      柳州市琪成机电设备有限公司      柳州市松林工程机械修理厂      柳州市积玉贸易有限公司      柳州市福运来贸易有限责任公司      柳州市钢义物资有限公司      柳州市洋力化工有限公司      柳州市悦盛贸易有限公司      柳州市雁城钢管物资有限公司      柳州市恒瑞钢材经营部      柳州市科拓电子有限公司      柳州市九方电子有限公司      柳州市桂龙汽车配件厂      柳州市制鞋工厂      柳州市炜力科贸有限公司      柳州市希翼贸易有限公司      柳州市兆金物资有限公司      柳州市和润电子科技有限责任公司      柳州市汇凯贸易有限公司      柳州市好机汇商贸有限公司      柳州市泛源商贸经营部      柳州市利汇达物资有限公司      广西全民药业有限责任公司      柳州超凡物资贸易有限责任公司      柳州市贵宏物资有限责任公司      柳州昊恒贸易有限责任公司      柳州市浦联物资有限公司      柳州市广通园林绿化工程有限责任公司      柳州市松发物资贸易有限责任公司      柳州市奥士达办公设备有限责任公司      柳州市海泰物资有限公司      柳州市金三环针织厂      柳州市钢贸物资有限公司      柳州市明阳纺织有限公司      柳州市世科科技发展有限公司      柳州市禄羊贸易有限公司      柳州市金兆阳商贸有限公司      柳州市汇昌物资经营部      柳州市林泰金属物资供应站      柳州市自来水管道材料设备公司      柳州市丹柳铝板有限公司      柳州市桂冶物资有限公司      柳州市宸业物资经营部      柳州市耀成贸易有限公司      柳州奥易自动化科技有限公司      柳州市萃丰科技有限责任公司      柳州市华储贸易有限责任公司      柳州市黄颜钢材有限责任公司      柳州市银盛物资有限责任公司      柳州市新仪化玻供应站      柳州市晶凯化工有限公司      广西柳州市柳江包装纸厂      柳州市志新物资有限责任公司      柳州市兆钢物资有限公司      柳州市友方科技发展有限责任公司      柳州市缝纫机台板家具总厂      柳州市晖海数码办公设备有限责任公司      柳州市富兰特服饰有限责任公司      柳州市柳北区富兴物资经营部      柳州市柳锌福利厂      柳州市海泉印刷有限责任公司      柳州市乾亨贸易有限公司      柳州市悦宁物资贸易有限公司      柳州市昊天贸易有限公司      广西惠字钢铁有限公司      柳州市名青物资有限公司      柳州市林郝物资有限公司      柳州市民政服装厂      柳州市多维劳保用品厂      柳州市轻工物资供应公司      柳州市程源物资有限责任公司      柳州市寿丰物资贸易有限责任公司      柳州市凯凡物资有限公司      柳州市利晖物资经营部      柳州市恒茂金属物资供应站      柳州市中储物资经营部      柳州市第二医疗器械厂      柳州市来鑫物资经营部      柳州市钢鑫物资贸易有限责任公司      柳州市双合袜业有限责任公司      柳州市茂松经贸有限责任公司      柳州市行行物资贸易有限公司      柳州市方一物资有限公司      柳州成异钢管销售有限公司      柳州广惠佳电脑有限公司      桂林市圣泽鑫物资有限公司柳州分公司      柳州市砼基建材贸易有限公司      柳州市海燕针织厂      上海浦光仪表厂柳州销售处      柳州市能电工贸有限责任公司      柳州市广贸物资有限公司      柳州市柳北区大昌电工灯饰经营部      柳州市金龙印务有限公司      柳州市奇缘婚典服务有限公司      柳州市盛博物资经营部      柳州市项元钢铁贸易有限公司      柳州市虞美人化妆品经营部      柳州市俊彦鞋厂      柳州市聚源特钢有限公司      柳州市迅龙科贸有限责任公司      柳州市恒飞电子有限责任公司      柳州市蓝正现代办公设备有限责任公司      柳州地区农业生产资料公司      柳州华菱钢管销售有限公司      柳州融通物资有限公司      柳州市可仁广告策划有限责任公司      柳州市鸟鑫物资有限责任公司      柳州市五丰钢材供应站      柳州市金江不锈钢有限公司      柳州市美日物资设备有限责任公司      柳州市鑫东物资贸易有限责任公司      柳州地区日用杂品公司      柳州市华纳物资贸易有限公司      柳州乾利金虹物资贸易有限责任公司      柳州市新迈计算机有限公司      柳州市富丽实业发展公司      柳州市石钢金属材料有限公司      柳州市力志传真机销售有限公司      广西宝森投资有限公司      柳州市嵘基商贸有限公司      柳州市景民商贸有限责任公司      柳州市银桥化玻有限责任公司      柳州市宏文糖烟店      柳州市科苑电脑网络有限公司      柳州市两面针旅游用品厂      柳州市立早室内装璜有限责任公司      柳州地化建材有限公司      柳州市涛达贸易有限公司      柳州市兰丰档案服务中心      柳州市惠贸物资有限责任公司      柳州市立文物资有限责任公司      柳州市致和商贸经营部      柳州市金色阳光信息咨询有限公司      柳州市赛利钢材经销部      柳州市日用化工厂      柳州市昆廷物资有限责任公司      柳州市邦盛贸易有限公司      柳州市济华贸易有限公司      柳州昕威橡塑化工经营部      柳州市联业贸易有限公司      柳州市兰钢贸易有限公司      柳州市子欣科技有限公司      柳州市狄龙机电设备有限公司      柳州市方真物资贸易有限公司      柳州市银鸥废旧回收中心      柳州市冠宝贸易有限公司      柳州市鑫盛德商务咨询有限责任公司      柳州市泰汇银通经贸有限公司      广西瀚维智测科技有限公司      柳州市钓鱼郎制衣有限责任公司      柳州溪水物资有限公司      柳州市融峰物资有限责任公司      广西新地科技有限责任公司      柳州市纺织装饰公司      柳州市粤翔冶金炉料有限公司      柳州市远腾贸易有限公司      柳州市东鸿城市改造有限公司      广西丛欣实业有限公司      柳州市服装厂      柳州市立安联合刀片有限公司      广西国扬投资有限责任公司      柳州市铭泰办公设备公司      柳州市桂钢物资供应站      柳州市昱升物资有限责任公司      柳州市鹰飞灿科贸有限公司      柳州市先导科贸有限公司      柳州市金秋建材物资经营部      柳州市童装厂      柳州市民泽物资有限公司      柳州市恒先物资贸易有限公司      柳州市银夏冷气工程有限责任公司      柳州粮食批发有限责任公司      柳州市金银华窗纱制造有限责任公司      柳州市三方贸易有限公司      柳州市丰涛商贸有限责任公司      柳州华智企业管理咨询有限责任公司      柳州市诚正建筑工程施工图审查有限公司      柳州市今科电讯设备营销中心      柳州市闽德电子有限公司      柳州市鑫虹针织厂      柳州市畅通通讯器材有限责任公司      柳州市正钢物资经营部      柳州市新柳饲料有限责任公司      柳州市黄村油库      柳州市天泰电力装饰工程有限公司      柳州市兆吉物资有限责任公司      柳州市八龙纸制品有限责任公司      柳州市巨佳电脑网络科技有限公司      ";
Demo.MULTI_COMBO_ITEMS = BI.map(Demo.stringsForMultiCombo.match(/[^\s]+/g), function (i, v) {
    return {
        text: v,
        value: v,
        title: v
    }
});
