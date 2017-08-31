Demo = {
    version: 1.0
};


BI.servletURL = "";
BI.resourceURL = "resource/";
BI.i18n = {
    "BI-Basic_OK": "确定",
    "BI-Basic_Sure": "确定",
    "BI-Basic_Clears": "清空",
    "BI-Basic_Cancel": "取消",
    "BI-Basic_Time": "时间",
    "BI-Basic_Simple_Sunday": "日",
    "BI-Basic_Simple_Monday": "一",
    "BI-Basic_Simple_Tuesday": "二",
    "BI-Basic_Simple_Wednesday": "三",
    "BI-Basic_Simple_Thursday": "四",
    "BI-Basic_Simple_Friday": "五",
    "BI-Basic_Simple_Saturday": "六",
    "BI-Multi_Date_Year": "年",
    "BI-Multi_Date_Month": "月",
    "BI-Multi_Date_Quarter": "季度",
    "BI-Basic_Unrestricted": "无限制",
    "BI-Quarter_1": "第1季度",
    "BI-Quarter_2": "第2季度",
    "BI-Quarter_3": "第3季度",
    "BI-Quarter_4": "第4季度",
    "BI-Basic_Value": "值",
    "BI-Load_More": "加载更多",
    "BI-Select_All": "全选"
};$(function () {
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
                    iconClass: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '一般按钮',
                    block: true,
                    level: 'common',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示成功状态按钮',
                    block: true,
                    level: 'success',
                    height: 30
                }
            },
            {
                el: {
                    type: 'bi.button',
                    text: '表示警告状态的按钮',
                    block: true,
                    level: 'warning',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示忽略状态的按钮',
                    block: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '普通灰化按钮',
                    block: true,
                    disabled: true,
                    level: 'success',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '忽略状态灰化按钮',
                    block: true,
                    disabled: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '带图标的按钮',
                    block: true,
                    //level: 'ignore',
                    iconClass: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '一般按钮',
                    clear: true,
                    level: 'common',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示成功状态按钮',
                    clear: true,
                    level: 'success',
                    height: 30
                }
            },
            {
                el: {
                    type: 'bi.button',
                    text: '表示警告状态的按钮',
                    clear: true,
                    level: 'warning',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示忽略状态的按钮',
                    clear: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '普通灰化按钮',
                    clear: true,
                    disabled: true,
                    level: 'success',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '忽略状态灰化按钮',
                    clear: true,
                    disabled: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '带图标的按钮',
                    clear: true,
                    //level: 'ignore',
                    iconClass: "close-font",
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
            vgap: 100,
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
                    cls: "close-ha-font",
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
        var editor = BI.createWidget({
            type: "bi.text_editor",
            width: 200,
            height: 30,
            value: "这是复制的内容"
        });
        var clipboard = BI.createWidget({
            type: 'bi.clipboard',
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
                el: clipboard,
                left: 100,
                top: 100
            }]
        })
    }
});
BI.shortcut("demo.clipboard", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
BI.shortcut("demo.complex_canvas", Demo.Func);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.ClearEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        var editor;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.shelter_editor",
                cls: "bi-border",
                ref:function(_ref){
                    editor=_ref;
                },
                width: 300,
                watermark: "这个是带标记的"
            },{
                type:"bi.button",
                text:"setValue",
                width:300,
                handler:function(){
                    editor.setValue("凛冬将至");
                }
            },{
                type:"bi.button",
                text:"doHighLight",
                width:300,
                handler:function(){
                    editor.doHighLight();
                    console.log(editor.getState());
                }
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.shelter_editor", Demo.ClearEditor);/**
 * Created by Dailer on 2017/7/14.
 */
Demo.SignEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.sign_editor",
                //  cls:"layout-bg5",
                value: "123",
                text: "456",
                width: 300
            }],
            vgap: 20

        }
    }
})

BI.shortcut("demo.sign_editor", Demo.SignEditor);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.SignInitialEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    mounted: function () {
        this.editor.setValue({
            value: "123",
            text: "sdga"
        })
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.sign_initial_editor",
                ref: function () {
                    self.editor = this;
                },
                cls: "layout-bg5",
                text: "原始值",
                width: 300
            }],
            vgap: 20

        }
    }
})

BI.shortcut("demo.sign_initial_editor", Demo.SignInitialEditor);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.StateEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.state_editor",
                value: "123",
                text: "456",
                width: 300
            }],
            vgap: 20

        }
    }
})

BI.shortcut("demo.state_editor", Demo.StateEditor);Demo.Func = BI.inherit(BI.Widget, {
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
            single: true,
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
BI.shortcut("demo.center", Demo.Center);Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.tab",
            ref: function () {
                self.tab = this;
            },
            single: true,
            cardCreator: function (v) {
                return {
                    type: v
                }
            }
        };
    },

    mounted: function () {
        var self = this;
        var items = [[{
            "data": [
                {"x": "孙林", "y": 789},
                {"x": "金士鹏", "y": 156},
                {"x": "张珊", "y": 289},
                {"x": "孙阳", "y": 562},
                {"x": "袁成洁", "y": 546},
                {"x": "张颖", "y": 218},
                {"x": "王伟", "y": 541},
                {"x": "张武", "y": 219},
                {"x": "韩文", "y": 345}
            ],
            "name": "测试1",
            stack: 1
        }, {
            "data": [
                {"x": "孙林", "y": 789},
                {"x": "金士鹏", "y": 156},
                {"x": "张珊", "y": 289},
                {"x": "孙阳", "y": 562},
                {"x": "袁成洁", "y": 546},
                {"x": "张颖", "y": 218},
                {"x": "王伟", "y": 541},
                {"x": "张武", "y": 219},
                {"x": "韩文", "y": 345}
            ],
            "name": "测试2",
            stack: 1
        }]];
        var types = ["bi.axis_chart", "bi.line_chart", "bi.bar_chart"];
        var index = 0;
        this.tab.setSelect(types[index]);
        this.tab.populate(BI.deepClone(items));
        this.interval = setInterval(function () {
            index++;
            if (index >= types.length) {
                index = 0;
            }
            self.tab.setSelect(types[index]);
            self.tab.populate(BI.deepClone(items));
        }, 2000)
    },

    destroyed: function () {
        clearInterval(this.interval);
    }
});
BI.shortcut("demo.axis_chart", Demo.Func);
/**
 * guy
 * 二级树
 * @class BI.PlatformLevelTree
 * @extends BI.Select
 */
BI.PlatformLevelTree = BI.inherit(BI.Widget, {
    props: {
        baseCls: "platform-level-tree",
        itemsCreator: BI.emptyFn
    },

    render: function () {
        var self = this, o = this.options;
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: {
                type: "bi.select_tree_expander",
                isDefaultInit: false,
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            },

            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (items) {
                    callback(self._formatItems(items))
                })
            },

            el: {
                type: "bi.loader",
                next: false,
                el: {
                    type: "bi.button_tree",
                    chooseType: 0,
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            }
        });
        this.tree.on(BI.CustomTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.PlatformLevelTree.EVENT_CHANGE, arguments);
        })
    },

    _formatItems: function (nodes) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {};
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.multilayer_select_tree_first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.multilayer_select_tree_last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.multilayer_select_tree_mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.multilayer_single_tree_last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.multilayer_single_tree_mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    populate: function () {
        this.tree.populate();
    },

    getValue: function () {
        return this.tree.getValue();
    }
});
BI.PlatformLevelTree.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.platform_level_tree", BI.PlatformLevelTree);


BI.DemoLevelTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                el: {
                    type: "bi.platform_level_tree",
                    ref: function () {
                        self.tree = this;
                    },
                    itemsCreator: function (op, callback) {
                        if (!op.node) {//根节点
                            callback([{
                                "id": 1,
                                "pId": 0,
                                text: "A",
                                value: 1,
                                isParent: true
                            }, {
                                "id": 2,
                                "pId": 0,
                                "text": "B",
                                value: 2,
                                isParent: true,
                                open: true,
                            }])
                        } else {
                            if (op.node.id == 1) {
                                callback([
                                    {
                                        "id": 11,
                                        "pId": 1,
                                        "text": "test11",
                                        value: 11,
                                        layer: 1,
                                        isParent: true
                                    },
                                    {
                                        "id": 12,
                                        "pId": 1,
                                        "text": "test12",
                                        value: 12,
                                        layer: 1,
                                    },
                                    {
                                        "id": 13,
                                        "pId": 1,
                                        "text": "test13",
                                        value: 13,
                                        layer: 1,
                                    },
                                    {
                                        "id": 14,
                                        "pId": 1,
                                        "text": "test14",
                                        value: 14,
                                        layer: 1,
                                        height: 35
                                    },
                                    {
                                        "id": 15,
                                        "pId": 1,
                                        "text": "test15",
                                        value: 15,
                                        layer: 1,
                                    },
                                    {
                                        "id": 16,
                                        "pId": 1,
                                        "text": "test16",
                                        value: 16,
                                        layer: 1,
                                    },
                                    {"id": 17, "pId": 1, "text": "test17", layer: 1, value: 17}
                                ])
                            } else if (op.node.id == 2) {
                                callback([{
                                    "id": 21,
                                    "pId": 2,
                                    "text": "test21",
                                    value: 21,
                                    layer: 1,
                                },
                                    {
                                        "id": 22,
                                        "pId": 2,
                                        "text": "test22",
                                        value: 22,
                                        layer: 1,
                                    }])
                            } else if (op.node.id == 11) {
                                callback([{
                                    "id": 111,
                                    "pId": 11,
                                    "text": "test111",
                                    value: 111,
                                    layer: 2,
                                }])
                            }
                        }
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "确定",
                    handler: function () {
                        BI.Msg.toast(JSON.stringify(self.tree.getValue()));
                    }
                },
                height: 25
            }]

        }
    },

    mounted: function () {

    }
});
BI.shortcut("demo.platform_level_tree", BI.DemoLevelTree);Demo.TreeValueChooser = BI.inherit(BI.Widget, {
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
            items: BI.deepClone(Demo.CONSTANTS.TREEITEMS),
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
            items: BI.deepClone(Demo.CONSTANTS.ITEMS),
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
    text: "bi.async_tree",
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
    open: false
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
    text: "bi.sign_initial_editor",
    value: "demo.sign_initial_editor"
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
    text: "bi.clipboard",
    value: "demo.clipboard"
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
}];Demo.CHART_CONFIG = [{
    id: 6,
    text: "图表控件"
}, {
    pId: 6,
    text: "柱状图",
    value: "demo.axis_chart"
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
}, {
    pId: 5,
    text: "平台用",
    value: "demo.platform_level_tree"
}];Demo.CORE_CONFIG = [{
    id: 1,
    text: "核心控件",
}, {
    id: 101,
    pId: 1,
    text: "布局"
}, {
    pId: 101,
    text: "自适应居中bi.center_adapt",
    value: "demo.center_adapt"
}, {
    pId: 101,
    text: "自适应垂直居中bi.vertical_adapt",
    value: "demo.vertical_adapt"
}, {
    pId: 101,
    text: "自适应水平居中bi.horizontal_adapt",
    value: "demo.horizontal_adapt"
}, {
    pId: 101,
    text: "margin-auto自适应水平居中bi.horizontal_auto",
    value: "demo.horizontal_auto"
}, {
    pId: 101,
    text: "float水平居中bi.horizontal_float",
    value: "demo.horizontal_float"
}, {
    pId: 101,
    text: "左右垂直居中bi.left_right_vertical_adapt",
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
    text: "垂直流式bi.vertical",
    value: "demo.vertical"
}, {
    pId: 101,
    text: "水平流式bi.horizontal",
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
    text: "详细控件",
    open: true
}, {
    pId: 4,
    id: 420,
    text: '各种小控件',
}, {
    pId: 420,
    text: "各种通用按钮",
    value: "demo.buttons"
}, {
    pId: 420,
    text: "各种提示性信息",
    value: "demo.tips"
}, {
    pId: 420,
    text: "各种items",
    value: "demo.items"
}, {
    pId: 420,
    text: "各种节点node",
    value: "demo.nodes"
}, {
    pId: 420,
    text: "各种segment",
    value: "demo.segments"
}, {
    pId: 420,
    text: "可以切换的树",
    value: "demo.switch_tree"
}, {
    id: 400,
    pId: 4,
    text: "tree"
}, {
    pId: 400,
    text: "bi.multi_tree_combo",
    value: "demo.multi_tree_combo"
}, {
    pId: 400,
    text: "bi.switch_tree",
    value: "demo.switch_tree"
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
    text: "bi.excel_table",
    value: "demo.excel_table"
}, {
    pId: 4,
    id: 402,
    text: "年份控件",
    open: false
}, {
    pId: 402,
    text: "bi.year_combo",
    value: "demo.year"
}, {
    pId: 4,
    id: 403,
    text: "月份控件",
    open: false
}, {
    pId: 403,
    text: "bi.month_combo",
    value: "demo.month"
}, {
    pId: 4,
    id: 404,
    text: "季度控件",
    open: false
}, {
    pId: 404,
    text: "bi.quarter_combo",
    value: "demo.quarter"
}, {
    pId: 4,
    id: 405,
    text: "下拉列表",
    open: false
}, {
    pId: 405,
    text: "bi.down_list_combo",
    value: "demo.down_list"
}, {
    pId: 4,
    id: 406,
    text: "文本框控件",
    open: false
}, {
    pId: 406,
    text: "bi.text_editor",
    value: "demo.text_editor"
}, {
    pId: 406,
    text: "bi.search_editor",
    value: "demo.search_editor"
}, {
    pId: 406,
    text: "bi.clear_editor",
    value: "demo.clear_editor"
}, {
    pId: 4,
    id: 407,
    text: "下拉框控件",
    open: false
}, {
    pId: 407,
    text: "bi.text_value_combo",
    value: "demo.text_value_combo"
}, {
    pId: 407,
    text: "bi.text_value_check_combo",
    value: "demo.text_value_check_combo"
}, {
    pId: 407,
    text: "bi.text_value_down_list_combo",
    value: "demo.text_value_down_list_combo"
}, {
    pId: 407,
    text: "bi.static_combo",
    value: "demo.static_combo"
}, {
    pId: 407,
    text: "bi.icon_combo",
    value: "demo.icon_combo"
}, {
    pId: 407,
    text: "bi.formula_combo",
    value: "demo.formula_combo"
}, {
    pId: 4,
    id: 410,
    text: "数值区间控件"
}, {
    pId: 410,
    text: "bi.numerical_interval",
    value: "demo.numberical_interval"
}, {
    pId: 4,
    id: 411,
    text: "下拉复选框有确定按钮"
}, {
    pId: 411,
    text: "bi.multi_select_combo",
    value: "demo.multi_select_combo"
}, {
    pId: 4,
    id: 412,
    text: "简单日期控件"
}, {
    pId: 412,
    text: "bi.date_combo",
    value: "demo.date"
}, {
    pId: 412,
    text: "bi.date_pane_widget",
    value: "demo.date_pane_widget"
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
    text: "bi.custom_date_time",
    value: "demo.custom_date_time"
}, {
    pId: 4,
    id: 413,
    text: "简单下拉树"
}, {
    pId: 413,
    text: "bi.single_tree_combo",
    value: "demo.single_tree_combo"
}, {
    pId: 413,
    text: "bi.multilayer_single_tree_combo",
    value: "demo.multilayer_single_tree_combo"
}, {
    pId: 4,
    id: 414,
    text: "可选下拉树"
}, {
    pId: 414,
    text: "bi.select_tree_combo",
    value: "demo.select_tree_combo"
}, {
    pId: 414,
    text: "bi.multilayer_select_tree_combo",
    value: "demo.multilayer_select_tree_combo"
}, {
    pId: 4,
    id: 415,
    text: "路径选择"
}, {
    pId: 415,
    text: "bi.path_chooser",
    value: "demo.path_chooser"
}, {
    pId: 415,
    text: "bi.direction_path_chooser",
    value: "demo.direction_path_chooser"
}, {
    pId: 4,
    id: 416,
    text: "关联视图"
}, {
    pId: 416,
    text: "bi.relation_view",
    value: "demo.relation_view"
}, {
    pId: 4,
    id: 417,
    text: "布局"
}, {
    pId: 417,
    text: "bi.adaptive_arrangement",
    value: "demo.adaptive_arrangement"
}, {
    pId: 417,
    text: "bi.interactive_arrangement",
    value: "demo.interactive_arrangement"
}, {
    pId: 4,
    id: 418,
    text: "提示对话框"
}, {
    pId: 418,
    text: "bi.dialog",
    value: "demo.dialog"
}, {
    pId: 4,
    id: 419,
    text: "文件管理"
}, {
    pId: 419,
    text: "bi.file_manager",
    value: "demo.file_manager"
}
];Demo.Func = BI.inherit(BI.Widget, {
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
        var items = [{
            type: "bi.label",
            value: "张三"
        }, {
            type: "bi.label",
            value: "李四"
        }];
        var popup = BI.createWidget({
            type: "bi.button_group",
            cls: "bi-border",
            items: items,
            layouts: [{
                type: "bi.vertical"
            }]
        });
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.searcher",
                    listeners: [{
                        eventName: BI.Searcher.EVENT_STOP,
                        action: function () {
                            popup.populate(items)
                        }
                    }, {
                        eventName: BI.Searcher.EVENT_PAUSE,
                        action: function () {
                            popup.populate(items)
                        }
                    }],
                    adapter: {
                        getItems: function () {
                            return items
                        }
                    },
                    popup: popup,
                    masker: false
                },
                left: 0,
                right: 0,
                top: 0
            }, {
                el: popup,
                left: 0,
                right: 0,
                top: 50,
                bottom: 0
            }]
        }
    }
});
BI.shortcut("demo.searcher", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
            width: 400,
            height: 300,
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
        })
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
                    text: (i + 1) + "." + item.text,
                });
            })
        }
    }
});
BI.shortcut("demo.list_view", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
    render: function () {
        return {
            type: "bi.virtual_list",
            items: BI.map(Demo.CONSTANTS.ITEMS, function (i, item) {
                return BI.extend({}, item, {
                    type: "bi.label",
                    height: 30,
                    text: (i + 1) + "." + item.text,
                });
            })
        }
    }
});
BI.shortcut("demo.virtual_list", Demo.Func);Demo.Func = BI.inherit(BI.Widget, {
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
            cls: "config-item bi-border-bottom",
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
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("字体颜色："), this._createColorPicker(function () {
                self.fontColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
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
            })]
        }
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
            })]
        }
    },

    _createGrayFontConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("灰色字体颜色(用于Card2)："), this._createColorPicker(function () {
                self.grayFontColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
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
                    forceCenter: true,
                    disabled: true
                }
            }]
        }
    },

    _createCard1BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("Card1背景颜色："), this._createColorPicker(function () {
                self.cardBackgroundColor = this;
            }, function () {
                self._runGlobalStyle();
            })]
        }
    },
    _createCard2BackgroundConfig: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("Card2背景颜色：无颜色")]
        }
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
            })]
        }
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
            })]
        }
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
            })]
        }
    },

    _createSlitColor: function () {
        var self = this;
        return {
            type: "bi.htape",
            cls: "config-item bi-border-bottom",
            height: 40,
            items: [this._createLabel("分割线颜色(只对左边的表格有效)："), this._createColorPicker(function () {
                self.slitColor = this;
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
                this._createActiveFontConfig(),
                this._createSelectFontConfig(),
                this._createGrayFontConfig(),
                this._createDisableFontConfig(),
                this._createCard1BackgroundConfig(),
                this._createCard2BackgroundConfig(),
                this._createHoverBackgroundColor(),
                this._createActiveBackgroundColor(),
                this._createSelectBackgroundColor(),
                this._createSlitColor()
            ]
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
                this._createButton1BackgroundConfig(),
                this._createButton2BackgroundConfig(),
                this._createButton3BackgroundConfig(),
                this._createButton4BackgroundConfig(),
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
                    type: "demo.preview"
                }
            }, {
                column: 1,
                row: 0,
                el: {
                    type: "bi.vertical",
                    cls: "face-config bi-border-left",
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
            "#wrapper.bi-background, #wrapper .bi-background": {
                "background-color": backgroundColor,
                "color": fontColor
            },
            "#wrapper .bi-card": {
                "background-color": cardBackgroundColor
            },
            "#wrapper .bi-tips": {
                "color": grayFontColor
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
                "color": activeFontColor + "!important"
            },
            ".bi-list-item-active.active,.bi-list-item-select.active,.bi-list-item-effect.active": {
                "background-color": selectBackgroundColor + "!important",
                "color": selectFontColor + "!important"
            },
            ".bi-button": {
                "background-color": button1BackgroundColor,
                "border-color": button1BackgroundColor
            },
            ".bi-button.button-success": {
                "background-color": button2BackgroundColor,
                "border-color": button2BackgroundColor
            },
            ".bi-button.button-warning": {
                "background-color": button3BackgroundColor,
                "border-color": button3BackgroundColor
            },
            ".bi-button.button-ignore": {
                "background-color": button4BackgroundColor
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
        })
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
BI.shortcut("demo.face", Demo.Face);Demo.Main = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-main bi-background"
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
                            $("html").removeClass("bi-theme-default").addClass("bi-theme-dark");
                        }
                    }, {
                        type: "bi.text_button",
                        text: "典雅白",
                        handler: function () {
                            $("html").removeClass("bi-theme-dark").addClass("bi-theme-default");
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
            type: "bi.absolute",
            cls: "preview-background",
            items: [{
                el: {
                    type: "bi.left",
                    cls: "preview-header bi-tips",
                    height: 40,
                    items: [{
                        type: "bi.label",
                        height: 40,
                        text: "Card2",
                        hgap: 10,
                        textAlign: "left"
                    }, {
                        type: "bi.icon_text_item",
                        cls: "filter-font",
                        text: "测试图标",
                        width: 100,
                        height: 40
                    }]
                },
                left: 60,
                right: 60,
                top: 60
            }, {
                el: {
                    type: "bi.vtape",
                    cls: "preview-card bi-card",
                    items: [{
                        el: {
                            type: "bi.label",
                            cls: "preview-title bi-border-bottom",
                            height: 40,
                            text: "Card1",
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
                top: 160,
                bottom: 60
            }]
        }
    },
    mounted: function () {
    }
});
BI.shortcut("demo.preview", Demo.Preview);Demo.West = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-west bi-border-right bi-card"
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
BI.shortcut("demo.west", Demo.West);Demo.AdaptiveArrangement = BI.inherit(BI.Widget, {

    _createItem: function () {
        var self = this;
        var id = BI.UUID();
        var item = BI.createWidget({
            type: "bi.text_button",
            id: id,
            cls: "layout-bg" + BI.random(1, 8),
            handler: function () {
                self.arrangement.deleteRegion(id);
            }
        });
        item.setValue(item.attr("id"));
        return item;
    },

    render: function () {
        var self = this;
        this.arrangement = BI.createWidget({
            type: "bi.adaptive_arrangement",
            layoutType: BI.Arrangement.LAYOUT_TYPE.ADAPTIVE,
            cls: "mvc-border",
            width: 800,
            height: 400,
            items: []
        });
        var drag = BI.createWidget({
            type: "bi.label",
            cls: "mvc-border",
            width: 100,
            height: 25,
            text: "drag me"
        });

        // drag.element.draggable && 
        drag.element.draggable({
            revert: true,
            cursorAt: {
                left: 0,
                top: 0
            },
            drag: function (e, ui) {
                self.arrangement.setPosition({
                    left: ui.position.left,
                    top: ui.position.top
                }, {
                    width: 300,
                    height: 200
                })
            },
            stop: function (e, ui) {
                self.arrangement.addRegion({
                    el: self._createItem()
                });
            },
            helper: function (e) {
                var helper = self.arrangement.getHelper();
                return helper.element;
            }
        });

        BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: drag,
                left: 30,
                top: 450
            }, {
                el: this.arrangement,
                left: 30,
                top: 30
            }, {
                el: {
                    type: "bi.button",
                    text: "回撤",
                    height: 25,
                    handler: function () {
                        //self.arrangement.revoke();
                    }
                },
                left: 130,
                top: 450
            }, {
                el: {
                    type: "bi.button",
                    text: "getAllRegions",
                    height: 25,
                    handler: function () {
                        var items = [];
                        BI.each(self.arrangement.getAllRegions(), function (i, region) {
                            items.push({
                                id: region.id,
                                left: region.left,
                                top: region.top,
                                width: region.width,
                                height: region.height
                            });
                        });
                        BI.Msg.toast(JSON.stringify(items));
                    }
                },
                left: 230,
                top: 450
            }, {
                el: {
                    type: "bi.button",
                    text: "relayout",
                    height: 25,
                    handler: function () {
                        self.arrangement.relayout();
                    }
                },
                left: 330,
                top: 450
            }]
        });
    }
});

BI.shortcut("demo.adaptive_arrangement", Demo.AdaptiveArrangement);/**
 * Created by User on 2017/3/22.
 */
Demo.RelationView = BI.inherit(BI.Widget, {
    props: {
    },
    render: function () {
        return {
            type: "bi.interactive_arrangement",
        };
    }
});
BI.shortcut("demo.interactive_arrangement", Demo.RelationView);/**
 * Created by Dailer on 2017/7/25.
 */


Demo.Buttons = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [{
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
                    iconClass: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '一般按钮',
                    block: true,
                    level: 'common',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示成功状态按钮',
                    block: true,
                    level: 'success',
                    height: 30
                }
            },
            {
                el: {
                    type: 'bi.button',
                    text: '表示警告状态的按钮',
                    block: true,
                    level: 'warning',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示忽略状态的按钮',
                    block: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '普通灰化按钮',
                    block: true,
                    disabled: true,
                    level: 'success',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '忽略状态灰化按钮',
                    block: true,
                    disabled: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '带图标的按钮',
                    block: true,
                    //level: 'ignore',
                    iconClass: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '一般按钮',
                    clear: true,
                    level: 'common',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示成功状态按钮',
                    clear: true,
                    level: 'success',
                    height: 30
                }
            },
            {
                el: {
                    type: 'bi.button',
                    text: '表示警告状态的按钮',
                    clear: true,
                    level: 'warning',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示忽略状态的按钮',
                    clear: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '普通灰化按钮',
                    clear: true,
                    disabled: true,
                    level: 'success',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '忽略状态灰化按钮',
                    clear: true,
                    disabled: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '带图标的按钮',
                    clear: true,
                    //level: 'ignore',
                    iconClass: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.text_button',
                    text: '文字按钮',
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
            vgap: 100,
            hgap: 20,
            items: items
        }
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
                type: "bi.label",
                height: 30,
                text: "单选item"
            }, {
                type: "bi.single_select_item",
                text: "单选项"
            }, {
                type: "bi.label",
                height: 30,
                text: "复选item"
            }, {
                type: "bi.multi_select_item",
                text: "复选项"
            }],
            hgap: 300
        }
    }
});


BI.shortcut("demo.items", Demo.Items);/**
 * Created by Dailer on 2017/7/25.
 */

Demo.LoadingMask = BI.inherit(BI.Widget, {

    render: function () {
        var vessel = this;
        var self = this;
        var left = BI.createWidget({
            type: "bi.center_adapt",
            items: [{
                type: "bi.button",
                text: "LoadingMask",
                height: 30,
                handler: function () {
                    var mask = BI.createWidget({
                        type: "bi.loading_mask",
                        masker: vessel,
                        text: "加载中...3s后结束"
                    });
                    setTimeout(function () {
                        mask.destroy();
                    }, 3000);
                }
            }]
        });
        var right = BI.createWidget({
            type: "bi.center_adapt",
            items: [{
                type: "bi.button",
                text: "CancelLoadingMask",
                height: 30,
                handler: function () {
                    var mask = BI.createWidget({
                        type: "bi.loading_cancel_mask",
                        masker: vessel,
                        text: "正在加载数据"
                    });
                    mask.on(BI.LoadingCancelMask.EVENT_VALUE_CANCEL, function () {
                        mask.destroy();
                        BI.Msg.toast("取消加载了...");
                    });
                }
            }]
        });
        BI.createWidget({
            type: "bi.center_adapt",
            element: vessel,
            items: [left, right],
            hgap: 20
        })
    }
});

BI.shortcut("demo.loading_mask", Demo.LoadingMask);/**
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
                text: "三角形的节点"
            }, {
                type: "bi.triangle_group_node",
                text: "三角形的节点"
            }, {
                type: "bi.label",
                height: 30,
                text: "箭头节点"
            }, {
                type: "bi.arrow_group_node",
                text: "箭头节点"
            }]
        }
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
        }
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
                    type: 'bi.button',
                    text: 'bubble测试',
                    height: 30,
                    handler: function () {
                        BI.Bubbles.show("singleBubble1", "bubble测试", this);
                        btns.push("singleBubble1");
                    }
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: 'bubble测试(居中显示)',
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
                    type: 'bi.button',
                    text: 'bubble测试(右边显示)',
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
                    type: 'bi.button',
                    text: '隐藏所有 bubble',
                    height: 30,
                    cls: "layout-bg2",
                    handler: function () {
                        BI.each(btns, function (index, value) {
                            BI.Bubbles.hide(value);
                        })
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
                    type: 'bi.button',
                    text: '简单Toast测试',
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条简单的数据");
                    }
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '很长的Toast测试',
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的数据")
                    }
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '非常长的Toast测试',
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长的数据")
                    }
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '错误提示Toast测试',
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
        }
    }
});
BI.shortcut("demo.tips", Demo.Tips);/**
 * Created by Dailer on 2017/7/12.
 */
Demo.FormulaCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {

        var self = this;


        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.formula_combo",
                fieldItems: [{
                    text: "A",
                    value: "A",
                    fieldType: 16
                }],
                width: 200,
                height: 30
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.formula_combo", Demo.FormulaCombo);/**
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
                ref:function(_ref){
                    self.refs=_ref;
                },
               // iconClass: "pull-down-ha-font",
                items: [{
                    value: "第一项",
                    iconClass: "delete-font"
                }, {
                    value: "第二项",
                    iconClass: "rename-font"
                }, {
                    value: "第三项",
                    iconClass: "move-font"
                }]
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.icon_combo", Demo.IconCombo);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.StaticCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },


    beforeMount: function () {
        this.refs.setValue(2);
    },

    render: function () {

        var self = this;

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.static_combo",
                text: "Value 不变",
                width: 300,
                ref: function (_ref) {
                    self.refs = _ref;
                },
                items: [
                    {
                        text: "MVC-1",
                        value: 1
                    }, {
                        text: "MVC-2",
                        value: 2
                    }, {
                        text: "MVC-3",
                        value: 3
                    }
                ]
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.static_combo", Demo.StaticCombo);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.text_value_combo",
                text: "天气热死了",
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
            },{
                type: "bi.text_value_check_combo",
                text: "天气热死了",
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
            },{
                type: "bi.text_value_combo",
                text: "天气热死了",
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
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.text_value_combo", Demo.TextValueCombo);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueDownListCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },


    beforeMount:function(){
        this.refs.setValue(2);
    },

    render: function () {

        var self = this;

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.label",
                cls: "layout-bg2",
                text: "分组+二级",
                width: 300
            }, {
                type: "bi.text_value_down_list_combo",
                text: "天气热死了",
                width: 300,
                ref: function (_ref) {
                    self.refs = _ref;
                },
                items: [
                    [{
                        el: {
                            text: "MVC-1",
                            value: 1
                        },
                        children: [{
                            text: "MVC-1-1",
                            value: 11
                        }]
                    }],
                    [{
                        text: "MVC-2",
                        value: 2
                    }, {
                        text: "MVC-3",
                        value: 3
                    }]
                ]
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.text_value_down_list_combo", Demo.TextValueDownListCombo);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueCheckCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.text_value_check_combo",
                text: "天气热死了",
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
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.text_value_check_combo", Demo.TextValueCheckCombo);/**
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
            vgap: 10,
            items: [{
                type: "bi.date_combo",
                ref: function () {
                    self.datecombo = this;
                },
                width: 300
            }, {
                type: "bi.button",
                text: "getVlaue",
                width: 300,
                handler: function () {
                    BI.Msg.alert("date", JSON.stringify(self.datecombo.getValue()));
                }
            }, {
                type: "bi.button",
                text: "setVlaue '2017-12-31'",
                width: 300,
                handler: function () {
                    self.datecombo.setValue({
                        year: 2017,
                        month: 11,
                        day: 31
                    })
                }
            }]
        }
    }
})

BI.shortcut("demo.date", Demo.Date);Demo.DatePane = BI.inherit(BI.Widget, {
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
                        text: "bi.date_pane_widget"
                    }, {
                        type: "bi.date_pane_widget",
                        selectedTime: {
                            year: 2017,
                            month: 12,
                            day: 11
                        },
                        ref: function (_ref) {
                            self.datepane = _ref;
                        },
                        height: 300
                    },
                    {
                        type: "bi.button",
                        text: "getValue",
                        handler: function () {
                            BI.Msg.toast("date" + JSON.stringify(self.datepane.getValue()));
                        }
                    }, {
                        type: "bi.button",
                        text: "setVlaue '2017-12-31'",
                        handler: function () {
                            self.datepane.setValue({
                                year: 2017,
                                month: 11,
                                day: 31
                            })
                        }
                    }
                ],
                width: "50%"
            }]
        }
    }
})

BI.shortcut("demo.date_pane_widget", Demo.DatePane);/**
 * Created by Urthur on 2017/7/18.
 */
Demo.CustomDateTime = BI.inherit(BI.Widget, {
    props: {
    },
    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.custom_date_time_combo",
                    ref: function (_ref) {
                        self.customDateTime =  _ref;
                        var value, date, dateStr;
                        self.customDateTime.on(BI.CustomDateTimeCombo.EVENT_CONFIRM, function () {
                            value = this.getValue();
                            date = new Date(value.year,value.month,value.day,value.hour,value.minute,value.second);
                            dateStr = date.print("%Y-%X-%d %H:%M:%S");
                            BI.Msg.alert("日期", dateStr);
                        });
                        self.customDateTime.on(BI.CustomDateTimeCombo.EVENT_CANCEL, function () {
                            value = this.getValue();
                            date = new Date(value.year,value.month,value.day,value.hour,value.minute,value.second);
                            dateStr = date.print("%Y-%X-%d %H:%M:%S");
                            BI.Msg.alert("日期", dateStr);
                        });
                    }
                },
                top: 200,
                left: 200
            }]
        };
    }
});
BI.shortcut("demo.custom_date_time", Demo.CustomDateTime);Demo.DialogView = BI.inherit(BI.Widget, {

    render: function () {
        var items = [{
            el: {
                type: 'bi.button',
                text: '弹出对话框',
                level: 'common',
                height: 30
            }
        }];
        BI.each(items, function (i, item) {
            item.el.handler = function () {
                BI.Msg.alert('提示', "这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写");
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

BI.shortcut("demo.dialog", Demo.DialogView);Demo.Downlist = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-downlist"
    },

    mounted: function () {
        var downlist = this.downlist;
        var label = this.label;
        downlist.on(BI.DownListCombo.EVENT_CHANGE, function (value, fatherValue) {
            label.setValue(JSON.stringify(downlist.getValue()));
        });

        this.downlist.on(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, function (value, fatherValue) {
            label.setValue(JSON.stringify(downlist.getValue()));
        });
    },


    render: function () {
        self = this;
        return {
            type: "bi.horizontal_adapt",
            items: [{
                type: "bi.down_list_combo",
                ref: function (_ref) {
                    self.downlist = _ref;
                },
                cls:"layout-bg3",
                height: 30,
                width: 100,
                items: [
                    [{
                        el: {
                            text: "column 1111",
                            iconCls1: "check-mark-e-font",
                            value: 11
                        },
                        children: [{
                            text: "column 1.1",
                            value: 21,
                            cls: "dot-e-font",
                            selected: true
                        }, {
                            text: "column 1.222222222222222222222222222222222222",
                            cls: "dot-e-font",
                            value: 22,
                        }]
                    }],
                    [{
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
                        }, {
                            text: "column 2.2",
                            value: 12,
                            cls: "dot-e-font"
                        }]
                    }],
                    [{
                            text: "column 8",
                            value: 18,
                            cls: "dot-e-font",
                            selected: true
                        },
                        {

                            text: "column 9",
                            cls: "dot-e-font",
                            value: 19
                        }
                    ],
                    [{
                            text: "column 10",
                            value: 20,
                            cls: "dot-e-font",
                            selected: true
                        },
                        {

                            text: "column 11",
                            cls: "dot-e-font",
                            value: 21
                        },
                        {

                            text: "column 12",
                            cls: "dot-e-font",
                            value: 22
                        },
                        {

                            text: "column 13",
                            cls: "dot-e-font",
                            value: 23
                        },
                        {

                            text: "column 14",
                            cls: "dot-e-font",
                            value: 24
                        },
                        {

                            text: "column 15",
                            cls: "dot-e-font",
                            value: 23
                        }
                    ]

                ]
            }, {
                type: "bi.label",
                text: "显示选择值",
                width:500,
                cls:"layout-bg4",
                ref: function (_ref) {
                    self.label = _ref;
                }
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.down_list", Demo.Downlist);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.AdaptEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },



    //这东西好奇怪,不支持设置宽度,那么渲染出来宽度几乎没有,无奈之下只能假装给他个默认值了
    beforeMount: function () {
        this.refs.setValue("Winter is coming !")
    },

    render: function () {
        var self = this;
        var editor = BI.createWidget({
            type: "bi.adapt_editor",
            cls: "layout-bg5",
            ref: function (_ref) {
                self.refs = _ref;
            }
        })

        var text=["You know nothing! Jon Snow","A Lannister always pays his debts.","Power is a curious thing."]

        return {
            type: "bi.horizontal_auto",
            items: [{
                el: editor
            }, {
                type: "bi.button",
                text: "为了展示长度真的是可变的,每点一下就换一行字",
                handler: function () {
                    var temp=text.shift();
                    editor.setValue(temp);
                    text.push(temp);
                }
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.adapt_editor", Demo.AdaptEditor);/**
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
                watermark: "这个是带清除按钮的"
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.clear_editor", Demo.ClearEditor);/**
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
                watermark:"添加合法性判断",
                errorText: "长度必须大于4",
                validationChecker:function(){
                    return this.getValue().length > 4 ? true : false
                }
            },{
                type: "bi.small_search_editor",
                width: 300,
                watermark:"这个是 small,小一号"
            }],
            vgap:20
        }
    }
})

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
                watermark:"这是水印,watermark",
                width: 300
            },{
                type: "bi.text_editor",
                watermark:"这个不予许空",
                allowBlank: false,
                errorText: "非空!",
                width: 300
            }],
            vgap:20

        }
    }
})

BI.shortcut("demo.text_editor", Demo.TextEditor);/* 文件管理导航
    Created by dailer on 2017 / 7 / 21. 
   */
Demo.FileManager = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var items = [{
            id: "1",
            value: "1",
            text: "根目录",
            lastModify: 1454316355142
        }, {
            id: "11",
            pId: "1",
            value: "11",
            text: "第一级子目录1",
            lastModify: 1454316355142
        }, {
            id: "12",
            pId: "1",
            value: "12",
            text: "第一级子目录2",
            lastModify: 1454316355142
        }, {
            id: "111",
            pId: "11",
            value: "111",
            text: "第二级子目录",
            lastModify: 1454316355142
        }, {
            id: "121",
            pId: "111",
            buildUrl: "www.baidu.com",
            value: "121",
            text: "文件1",
            lastModify: 1454316355142
        }, {
            id: "122",
            pId: "111",
            buildUrl: "www.baidu.com",
            value: "122",
            text: "文件2",
            lastModify: 1454316355142
        }];
        var filemanager = BI.createWidget({
            type: "bi.file_manager",
            items: items
        });
        return {
            type: "bi.vtape",
            items: [{
                el: filemanager,
                height: "fill"
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.alert("", JSON.stringify(filemanager.getValue()));
                },
                height: 25
            }]
        }
    }
});
BI.shortcut("demo.file_manager", Demo.FileManager);/**
 * Created by Dailer on 2017/7/11.
 */
Demo.Month = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.month_combo",
                width: 300,
                ref: function () {
                    self.monthcombo = this;
                }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.monthcombo.getValue()));
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setValue : 11",
                handler: function () {
                    self.monthcombo.setValue(11);
                },
                width: 300
            }, {
                type: "bi.label",
                text: "月份value 范围为0-11,显示范围为1-12",
                width: 300
            }],
            vgap: 10
        }
    }
})

BI.shortcut("demo.month", Demo.Month);/**
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
        var items = Demo.CONSTANTS.ITEMS;
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
                right: "50%",
                top: 10
            }]
        }
    }
});
BI.shortcut("demo.multi_select_combo", Demo.MultiSelectCombo);/**
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
                    
                    
                    callback({
                        items: items
                    });
                },
                width: 300
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.tree.getValue()));
                },
                width: 300
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.multi_tree_combo", Demo.MultiTreeCombo);/**
 * Created by Dailer on 2017/7/12.
 */
Demo.NumericalInterval = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    mounted: function () {
        var numerical = this.numerical;
        var label = this.label;
        numerical.on(BI.NumericalInterval.EVENT_CHANGE, function () {
            var temp = numerical.getValue();
            var res = "大于" + (temp.closemin ? "等于 " : " ") + temp.min + " 小于" + (temp.closemax ? "等于 " : " ") + temp.max;
            label.setValue(res);
        })
    },




    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.numerical_interval",
                ref: function (_ref) {
                    self.numerical = _ref;
                },
                width: 500
            }, {
                type: "bi.label",
                ref: function (_ref) {
                    self.label = _ref;
                },
                text: "显示结果"
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.numberical_interval", Demo.NumericalInterval);


Demo.DirectionPathChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-direction-path-chooser"
    },

    render: function () {
        return {
            type: "bi.center_adapt",
            items: [
                {
                    type: "bi.direction_path_chooser",
                    items: [[{
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
                }
            ]
        }
    }
})

BI.shortcut("demo.direction_path_chooser",Demo.DirectionPathChooser);/**
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
 * Created by Dailer on 2017/7/11.
 */
Demo.Quarter = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.quarter_combo",
                width: 300,
                ref: function () {
                    self.quartercombo = this;
                }
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.quartercombo.getValue()));
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setValue : 3",
                handler: function () {
                    self.quartercombo.setValue(3);
                },
                width: 300
            }],
            vgap: 10
        }
    }
})

BI.shortcut("demo.quarter", Demo.Quarter);/**
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
BI.shortcut("demo.relation_view", Demo.RelationView);/**
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
        }
    }
})

BI.shortcut("demo.multilayer_select_tree_combo", Demo.MultiLayerSelectTreeCombo);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.SelectTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.select_tree_combo",
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
        }
    }
})

BI.shortcut("demo.select_tree_combo", Demo.SelectTreeCombo);/**
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
        }
    }
})

BI.shortcut("demo.multilayer_single_tree_combo", Demo.MultiLayerSingleTreeCombo);/**
 * Created by Dailer on 2017/7/13.
 */
Demo.SingleTreeCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },

    render: function () {
        var self = this;
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.single_tree_combo",
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
        }
    }
})

BI.shortcut("demo.single_tree_combo", Demo.SingleTreeCombo);/**
 * Created by Dailer on 2017/7/12.
 */
Demo.ExcelTable = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-exceltable"
    },
    render: function () {
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.excel_table",
                columnSize: [200,200,200,200,200],
                items: [
                    [{
                        type: "bi.label",
                        cls: "layout-bg1",
                        text: "第一行第一列"
                    }, {
                        type: "bi.label",
                        cls: "layout-bg2",
                        text: "第一行第二列"
                    }],
                    [{
                        type: "bi.label",
                        cls: "layout-bg3",
                        text: "第二行第一列"
                    }, {
                        type: "bi.label",
                        cls: "layout-bg4",
                        text: "第二行第二列"
                    }]
                ]
            }],
            width:500
        }
    }
})

BI.shortcut("demo.excel_table", Demo.ExcelTable);Demo.Func = BI.inherit(BI.Widget, {
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
BI.shortcut("demo.sequence_table", Demo.Func);/**
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
                type: "bi.time_interval",
                ref: function (_ref) {
                    self.interval = _ref;
                },
                width: 300
            }, {
                type: "bi.button",
                text: "getVlaue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.interval.getValue()));
                },
                width: 300
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.time_interval", Demo.TimeInterval);/**
 * Created by Dailer on 2017/7/26.
 */


Demo.SwitchTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        var tree = BI.createWidget({
            type: "bi.switch_tree",
            items: BI.deepClone(Demo.CONSTANTS.TREE)
        });

        return {
            type: "bi.vtape",
            items: [{
                el: tree
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "点击切换",
                    handler: function () {
                        tree.switchSelect();
                    }
                },
                height: 25
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
        }
    }
});

BI.shortcut("demo.switch_tree", Demo.SwitchTree);/**
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
            items: [{
                type: "bi.year_combo",
                width: 300,
                ref: function () {
                    self.yearcombo = this;
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
        }
    }
})

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
                type: "bi.year_month_combo",
                ref: function (_ref) {
                    self.widget = _ref;
                },
                width: 300
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.widget.getValue()))
                },
                width: 300
            }, {
                type: "bi.button",
                text: "setVlaue '2017-12'",
                width: 300,
                handler: function () {
                    self.widget.setValue({
                        year: 2017,
                        month: 11
                    })
                }
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.year_month_combo", Demo.YearMonthCombo);/**
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
                type: "bi.year_quarter_combo",
                width: 300,
                ref: function (_ref) {
                    self.widget = _ref;
                },
                yearBehaviors: {},
                quarterBehaviors: {},
            }, {
                type: "bi.button",
                text: "getValue",
                handler: function () {
                    BI.Msg.toast(JSON.stringify(self.widget.getValue()))
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
                    })
                }
            }],
            vgap: 20
        }
    }
})

BI.shortcut("demo.year_quarter_combo", Demo.YearQuarterCombo);Demo.CONFIG = Demo.CORE_CONFIG.concat(Demo.BASE_CONFIG).concat(Demo.CASE_CONFIG).concat(Demo.WIDGET_CONFIG).concat(Demo.COMPONENT_CONFIG).concat(Demo.CHART_CONFIG);

Demo.CONSTANTS = {
    ITEMS: BI.map("柳州市城贸金属材料有限责任公司 柳州市建福房屋租赁有限公司 柳州市迅昌数码办公设备有限责任公司 柳州市河海贸易有限责任公司 柳州市花篮制衣厂 柳州市兴溪物资有限公司 柳州市针织总厂 柳州市衡管物资有限公司 柳州市琪成机电设备有限公司 柳州市松林工程机械修理厂 柳州市积玉贸易有限公司 柳州市福运来贸易有限责任公司 柳州市钢义物资有限公司 柳州市洋力化工有限公司 柳州市悦盛贸易有限公司 柳州市雁城钢管物资有限公司 柳州市恒瑞钢材经营部 柳州市科拓电子有限公司 柳州市九方电子有限公司 柳州市桂龙汽车配件厂 柳州市制鞋工厂 柳州市炜力科贸有限公司 柳州市希翼贸易有限公司 柳州市兆金物资有限公司 柳州市和润电子科技有限责任公司 柳州市汇凯贸易有限公司 柳州市好机汇商贸有限公司 柳州市泛源商贸经营部 柳州市利汇达物资有限公司 广西全民药业有限责任公司 柳州超凡物资贸易有限责任公司 柳州市贵宏物资有限责任公司 柳州昊恒贸易有限责任公司 柳州市浦联物资有限公司 柳州市广通园林绿化工程有限责任公司 柳州市松发物资贸易有限责任公司 柳州市奥士达办公设备有限责任公司 柳州市海泰物资有限公司 柳州市金三环针织厂 柳州市钢贸物资有限公司 柳州市明阳纺织有限公司 柳州市世科科技发展有限公司 柳州市禄羊贸易有限公司 柳州市金兆阳商贸有限公司 柳州市汇昌物资经营部 柳州市林泰金属物资供应站 柳州市自来水管道材料设备公司 柳州市丹柳铝板有限公司 柳州市桂冶物资有限公司 柳州市宸业物资经营部 柳州市耀成贸易有限公司 柳州奥易自动化科技有限公司 柳州市萃丰科技有限责任公司 柳州市华储贸易有限责任公司 柳州市黄颜钢材有限责任公司 柳州市银盛物资有限责任公司 柳州市新仪化玻供应站 柳州市晶凯化工有限公司 广西柳州市柳江包装纸厂 柳州市志新物资有限责任公司 柳州市兆钢物资有限公司 柳州市友方科技发展有限责任公司 柳州市缝纫机台板家具总厂 柳州市晖海数码办公设备有限责任公司 柳州市富兰特服饰有限责任公司 柳州市柳北区富兴物资经营部 柳州市柳锌福利厂 柳州市海泉印刷有限责任公司 柳州市乾亨贸易有限公司 柳州市悦宁物资贸易有限公司 柳州市昊天贸易有限公司 广西惠字钢铁有限公司 柳州市名青物资有限公司 柳州市林郝物资有限公司 柳州市民政服装厂 柳州市多维劳保用品厂 柳州市轻工物资供应公司 柳州市程源物资有限责任公司 柳州市寿丰物资贸易有限责任公司 柳州市凯凡物资有限公司 柳州市利晖物资经营部 柳州市恒茂金属物资供应站 柳州市中储物资经营部 柳州市第二医疗器械厂 柳州市来鑫物资经营部 柳州市钢鑫物资贸易有限责任公司 柳州市双合袜业有限责任公司 柳州市茂松经贸有限责任公司 柳州市行行物资贸易有限公司 柳州市方一物资有限公司 柳州成异钢管销售有限公司 柳州广惠佳电脑有限公司 桂林市圣泽鑫物资有限公司柳州分公司 柳州市砼基建材贸易有限公司 柳州市海燕针织厂 上海浦光仪表厂柳州销售处 柳州市能电工贸有限责任公司 柳州市广贸物资有限公司 柳州市柳北区大昌电工灯饰经营部 柳州市金龙印务有限公司 柳州市奇缘婚典服务有限公司 柳州市盛博物资经营部 柳州市项元钢铁贸易有限公司 柳州市虞美人化妆品经营部 柳州市俊彦鞋厂 柳州市聚源特钢有限公司 柳州市迅龙科贸有限责任公司 柳州市恒飞电子有限责任公司 柳州市蓝正现代办公设备有限责任公司 柳州地区农业生产资料公司 柳州华菱钢管销售有限公司 柳州融通物资有限公司 柳州市可仁广告策划有限责任公司 柳州市鸟鑫物资有限责任公司 柳州市五丰钢材供应站 柳州市金江不锈钢有限公司 柳州市美日物资设备有限责任公司 柳州市鑫东物资贸易有限责任公司 柳州地区日用杂品公司 柳州市华纳物资贸易有限公司 柳州乾利金虹物资贸易有限责任公司 柳州市新迈计算机有限公司 柳州市富丽实业发展公司 柳州市石钢金属材料有限公司 柳州市力志传真机销售有限公司 广西宝森投资有限公司 柳州市嵘基商贸有限公司 柳州市景民商贸有限责任公司 柳州市银桥化玻有限责任公司 柳州市宏文糖烟店 柳州市科苑电脑网络有限公司 柳州市两面针旅游用品厂 柳州市立早室内装璜有限责任公司 柳州地化建材有限公司 柳州市涛达贸易有限公司 柳州市兰丰档案服务中心 柳州市惠贸物资有限责任公司 柳州市立文物资有限责任公司 柳州市致和商贸经营部 柳州市金色阳光信息咨询有限公司 柳州市赛利钢材经销部 柳州市日用化工厂 柳州市昆廷物资有限责任公司 柳州市邦盛贸易有限公司 柳州市济华贸易有限公司 柳州昕威橡塑化工经营部 柳州市联业贸易有限公司 柳州市兰钢贸易有限公司 柳州市子欣科技有限公司 柳州市狄龙机电设备有限公司 柳州市方真物资贸易有限公司 柳州市银鸥废旧回收中心 柳州市冠宝贸易有限公司 柳州市鑫盛德商务咨询有限责任公司 柳州市泰汇银通经贸有限公司 广西瀚维智测科技有限公司 柳州市钓鱼郎制衣有限责任公司 柳州溪水物资有限公司 柳州市融峰物资有限责任公司 广西新地科技有限责任公司 柳州市纺织装饰公司 柳州市粤翔冶金炉料有限公司 柳州市远腾贸易有限公司 柳州市东鸿城市改造有限公司 广西丛欣实业有限公司 柳州市服装厂 柳州市立安联合刀片有限公司 广西国扬投资有限责任公司 柳州市铭泰办公设备公司 柳州市桂钢物资供应站 柳州市昱升物资有限责任公司 柳州市鹰飞灿科贸有限公司 柳州市先导科贸有限公司 柳州市金秋建材物资经营部 柳州市童装厂 柳州市民泽物资有限公司 柳州市恒先物资贸易有限公司 柳州市银夏冷气工程有限责任公司 柳州粮食批发有限责任公司 柳州市金银华窗纱制造有限责任公司 柳州市三方贸易有限公司 柳州市丰涛商贸有限责任公司 柳州华智企业管理咨询有限责任公司 柳州市诚正建筑工程施工图审查有限公司 柳州市今科电讯设备营销中心 柳州市闽德电子有限公司 柳州市鑫虹针织厂 柳州市畅通通讯器材有限责任公司 柳州市正钢物资经营部 柳州市新柳饲料有限责任公司 柳州市黄村油库 柳州市天泰电力装饰工程有限公司 柳州市兆吉物资有限责任公司 柳州市八龙纸制品有限责任公司 柳州市巨佳电脑网络科技有限公司 ".match(/[^\s]+/g), function (i, v) {
        return {
            text: v,
            value: v,
            title: v
        }
    }),
    TREEITEMS: [{"pId":"0","id":"0_0","text":"( 共25个 )","value":"","open":true},{"pId":"0_0","id":"0_0_0","text":"安徽省( 共1个 )","value":"安徽省","open":true},{"pId":"0_0_0","id":"0_0_0_0","text":"芜湖市","value":"芜湖市","open":true},{"pId":"0_0","id":"0_0_1","text":"北京市( 共6个 )","value":"北京市","open":true},{"pId":"0_0_1","id":"0_0_1_0","text":"北京市区","value":"北京市区","open":true},{"pId":"0_0_1","id":"0_0_1_1","text":"朝阳区","value":"朝阳区","open":true},{"pId":"0_0_1","id":"0_0_1_2","text":"东城区","value":"东城区","open":true},{"pId":"0_0_1","id":"0_0_1_3","text":"海淀区4内","value":"海淀区4内","open":true},{"pId":"0_0_1","id":"0_0_1_4","text":"海淀区4外","value":"海淀区4外","open":true},{"pId":"0_0_1","id":"0_0_1_5","text":"石景山区","value":"石景山区","open":true},{"pId":"0_0","id":"0_0_2","text":"福建省( 共2个 )","value":"福建省","open":true},{"pId":"0_0_2","id":"0_0_2_0","text":"莆田市","value":"莆田市","open":true},{"pId":"0_0_2","id":"0_0_2_1","text":"泉州市","value":"泉州市","open":true},{"pId":"0_0","id":"0_0_3","text":"甘肃省( 共1个 )","value":"甘肃省","open":true},{"pId":"0_0_3","id":"0_0_3_0","text":"兰州市","value":"兰州市","open":true},{"pId":"0_0","id":"0_0_4","text":"广东省( 共5个 )","value":"广东省","open":true},{"pId":"0_0_4","id":"0_0_4_0","text":"东莞市","value":"东莞市","open":true},{"pId":"0_0_4","id":"0_0_4_1","text":"广州市","value":"广州市","open":true},{"pId":"0_0_4","id":"0_0_4_2","text":"惠州市","value":"惠州市","open":true},{"pId":"0_0_4","id":"0_0_4_3","text":"深圳市","value":"深圳市","open":true},{"pId":"0_0_4","id":"0_0_4_4","text":"珠海市","value":"珠海市","open":true},{"pId":"0_0","id":"0_0_5","text":"广西壮族自治区( 共1个 )","value":"广西壮族自治区","open":true},{"pId":"0_0_5","id":"0_0_5_0","text":"南宁市","value":"南宁市","open":true},{"pId":"0_0","id":"0_0_6","text":"河北省( 共2个 )","value":"河北省","open":true},{"pId":"0_0_6","id":"0_0_6_0","text":"保定市","value":"保定市","open":true},{"pId":"0_0_6","id":"0_0_6_1","text":"邢台市","value":"邢台市","open":true},{"pId":"0_0","id":"0_0_7","text":"河南省( 共1个 )","value":"河南省","open":true},{"pId":"0_0_7","id":"0_0_7_0","text":"郑州市","value":"郑州市","open":true},{"pId":"0_0","id":"0_0_8","text":"黑龙江省( 共7个 )","value":"黑龙江省","open":true},{"pId":"0_0_8","id":"0_0_8_0","text":"大庆市","value":"大庆市","open":true},{"pId":"0_0_8","id":"0_0_8_1","text":"哈尔滨市","value":"哈尔滨市","open":true},{"pId":"0_0_8","id":"0_0_8_2","text":"鸡西市","value":"鸡西市","open":true},{"pId":"0_0_8","id":"0_0_8_3","text":"佳木斯市","value":"佳木斯市","open":true},{"pId":"0_0_8","id":"0_0_8_4","text":"牡丹江市","value":"牡丹江市","open":true},{"pId":"0_0_8","id":"0_0_8_5","text":"齐齐哈尔市","value":"齐齐哈尔市","open":true},{"pId":"0_0_8","id":"0_0_8_6","text":"双鸭山市","value":"双鸭山市","open":true},{"pId":"0_0","id":"0_0_9","text":"湖北省( 共1个 )","value":"湖北省","open":true},{"pId":"0_0_9","id":"0_0_9_0","text":"武汉市","value":"武汉市","open":true},{"pId":"0_0","id":"0_0_10","text":"湖南省( 共3个 )","value":"湖南省","open":true},{"pId":"0_0_10","id":"0_0_10_0","text":"常德市","value":"常德市","open":true},{"pId":"0_0_10","id":"0_0_10_1","text":"长沙市","value":"长沙市","open":true},{"pId":"0_0_10","id":"0_0_10_2","text":"邵阳市","value":"邵阳市","open":true},{"pId":"0_0","id":"0_0_11","text":"吉林省( 共4个 )","value":"吉林省","open":true},{"pId":"0_0_11","id":"0_0_11_0","text":"白山市","value":"白山市","open":true},{"pId":"0_0_11","id":"0_0_11_1","text":"长春市","value":"长春市","open":true},{"pId":"0_0_11","id":"0_0_11_2","text":"松原市","value":"松原市","open":true},{"pId":"0_0_11","id":"0_0_11_3","text":"通化市","value":"通化市","open":true},{"pId":"0_0","id":"0_0_12","text":"江苏省( 共8个 )","value":"江苏省","open":true},{"pId":"0_0_12","id":"0_0_12_0","text":"常州市","value":"常州市","open":true},{"pId":"0_0_12","id":"0_0_12_1","text":"南京市","value":"南京市","open":true},{"pId":"0_0_12","id":"0_0_12_2","text":"南通市","value":"南通市","open":true},{"pId":"0_0_12","id":"0_0_12_3","text":"苏州市","value":"苏州市","open":true},{"pId":"0_0_12","id":"0_0_12_4","text":"宿迁市","value":"宿迁市","open":true},{"pId":"0_0_12","id":"0_0_12_5","text":"泰州市","value":"泰州市","open":true},{"pId":"0_0_12","id":"0_0_12_6","text":"无锡市","value":"无锡市","open":true},{"pId":"0_0_12","id":"0_0_12_7","text":"盐城市","value":"盐城市","open":true},{"pId":"0_0","id":"0_0_13","text":"辽宁省( 共11个 )","value":"辽宁省","open":true},{"pId":"0_0_13","id":"0_0_13_0","text":"鞍山市","value":"鞍山市","open":true},{"pId":"0_0_13","id":"0_0_13_1","text":"本溪市","value":"本溪市","open":true},{"pId":"0_0_13","id":"0_0_13_2","text":"朝阳市","value":"朝阳市","open":true},{"pId":"0_0_13","id":"0_0_13_3","text":"大连市","value":"大连市","open":true},{"pId":"0_0_13","id":"0_0_13_4","text":"抚顺市","value":"抚顺市","open":true},{"pId":"0_0_13","id":"0_0_13_5","text":"葫芦岛市","value":"葫芦岛市","open":true},{"pId":"0_0_13","id":"0_0_13_6","text":"锦州市","value":"锦州市","open":true},{"pId":"0_0_13","id":"0_0_13_7","text":"辽阳市","value":"辽阳市","open":true},{"pId":"0_0_13","id":"0_0_13_8","text":"盘锦市","value":"盘锦市","open":true},{"pId":"0_0_13","id":"0_0_13_9","text":"沈阳市","value":"沈阳市","open":true},{"pId":"0_0_13","id":"0_0_13_10","text":"营口市","value":"营口市","open":true},{"pId":"0_0","id":"0_0_14","text":"内蒙古( 共1个 )","value":"内蒙古","open":true},{"pId":"0_0_14","id":"0_0_14_0","text":"鄂尔多斯市","value":"鄂尔多斯市","open":true},{"pId":"0_0","id":"0_0_15","text":"宁夏回族自治区( 共1个 )","value":"宁夏回族自治区","open":true},{"pId":"0_0_15","id":"0_0_15_0","text":"银川市","value":"银川市","open":true},{"pId":"0_0","id":"0_0_16","text":"山东省( 共7个 )","value":"山东省","open":true},{"pId":"0_0_16","id":"0_0_16_0","text":"济南市","value":"济南市","open":true},{"pId":"0_0_16","id":"0_0_16_1","text":"济宁市","value":"济宁市","open":true},{"pId":"0_0_16","id":"0_0_16_2","text":"聊城市","value":"聊城市","open":true},{"pId":"0_0_16","id":"0_0_16_3","text":"临沂市","value":"临沂市","open":true},{"pId":"0_0_16","id":"0_0_16_4","text":"青岛市","value":"青岛市","open":true},{"pId":"0_0_16","id":"0_0_16_5","text":"烟台市","value":"烟台市","open":true},{"pId":"0_0_16","id":"0_0_16_6","text":"枣庄市","value":"枣庄市","open":true},{"pId":"0_0","id":"0_0_17","text":"山西省( 共1个 )","value":"山西省","open":true},{"pId":"0_0_17","id":"0_0_17_0","text":"太原市","value":"太原市","open":true},{"pId":"0_0","id":"0_0_18","text":"陕西省( 共1个 )","value":"陕西省","open":true},{"pId":"0_0_18","id":"0_0_18_0","text":"西安市","value":"西安市","open":true},{"pId":"0_0","id":"0_0_19","text":"上海市( 共1个 )","value":"上海市","open":true},{"pId":"0_0_19","id":"0_0_19_0","text":"上海市区","value":"上海市区","open":true},{"pId":"0_0","id":"0_0_20","text":"四川省( 共1个 )","value":"四川省","open":true},{"pId":"0_0_20","id":"0_0_20_0","text":"成都市","value":"成都市","open":true},{"pId":"0_0","id":"0_0_21","text":"新疆维吾尔族自治区( 共2个 )","value":"新疆维吾尔族自治区","open":true},{"pId":"0_0_21","id":"0_0_21_0","text":"吐鲁番地区","value":"吐鲁番地区","open":true},{"pId":"0_0_21","id":"0_0_21_1","text":"乌鲁木齐","value":"乌鲁木齐","open":true},{"pId":"0_0","id":"0_0_22","text":"云南省( 共1个 )","value":"云南省","open":true},{"pId":"0_0_22","id":"0_0_22_0","text":"昆明市","value":"昆明市","open":true},{"pId":"0_0","id":"0_0_23","text":"浙江省( 共5个 )","value":"浙江省","open":true},{"pId":"0_0_23","id":"0_0_23_0","text":"杭州市","value":"杭州市","open":true},{"pId":"0_0_23","id":"0_0_23_1","text":"湖州市","value":"湖州市","open":true},{"pId":"0_0_23","id":"0_0_23_2","text":"嘉兴市","value":"嘉兴市","open":true},{"pId":"0_0_23","id":"0_0_23_3","text":"宁波市","value":"宁波市","open":true},{"pId":"0_0_23","id":"0_0_23_4","text":"绍兴市","value":"绍兴市","open":true},{"pId":"0_0","id":"0_0_24","text":"重庆市( 共1个 )","value":"重庆市","open":true},{"pId":"0_0_24","id":"0_0_24_0","text":"重庆市区","value":"重庆市区","open":true},{"pId":"0","id":"0_1","text":"中国( 共34个 )","value":"中国","open":true},{"pId":"0_1","id":"0_1_0","text":"安徽省( 共19个 )","value":"安徽省","open":true},{"pId":"0_1_0","id":"0_1_0_0","text":"安庆市","value":"安庆市","open":true},{"pId":"0_1_0","id":"0_1_0_1","text":"蚌埠市","value":"蚌埠市","open":true},{"pId":"0_1_0","id":"0_1_0_2","text":"亳州市","value":"亳州市","open":true},{"pId":"0_1_0","id":"0_1_0_3","text":"巢湖市","value":"巢湖市","open":true},{"pId":"0_1_0","id":"0_1_0_4","text":"池州市","value":"池州市","open":true},{"pId":"0_1_0","id":"0_1_0_5","text":"滁州市","value":"滁州市","open":true},{"pId":"0_1_0","id":"0_1_0_6","text":"阜阳市","value":"阜阳市","open":true},{"pId":"0_1_0","id":"0_1_0_7","text":"毫州市","value":"毫州市","open":true},{"pId":"0_1_0","id":"0_1_0_8","text":"合肥市","value":"合肥市","open":true},{"pId":"0_1_0","id":"0_1_0_9","text":"淮北市","value":"淮北市","open":true},{"pId":"0_1_0","id":"0_1_0_10","text":"淮南市","value":"淮南市","open":true},{"pId":"0_1_0","id":"0_1_0_11","text":"黄山市","value":"黄山市","open":true},{"pId":"0_1_0","id":"0_1_0_12","text":"六安市","value":"六安市","open":true},{"pId":"0_1_0","id":"0_1_0_13","text":"马鞍山市","value":"马鞍山市","open":true},{"pId":"0_1_0","id":"0_1_0_14","text":"濮阳市","value":"濮阳市","open":true},{"pId":"0_1_0","id":"0_1_0_15","text":"宿州市","value":"宿州市","open":true},{"pId":"0_1_0","id":"0_1_0_16","text":"铜陵市","value":"铜陵市","open":true},{"pId":"0_1_0","id":"0_1_0_17","text":"芜湖市","value":"芜湖市","open":true},{"pId":"0_1_0","id":"0_1_0_18","text":"宣城市","value":"宣城市","open":true},{"pId":"0_1","id":"0_1_1","text":"澳门特别行政区( 共1个 )","value":"澳门特别行政区","open":true},{"pId":"0_1_1","id":"0_1_1_0","text":"澳门","value":"澳门","open":true},{"pId":"0_1","id":"0_1_2","text":"北京市( 共17个 )","value":"北京市","open":true},{"pId":"0_1_2","id":"0_1_2_0","text":"北京市区","value":"北京市区","open":true},{"pId":"0_1_2","id":"0_1_2_1","text":"昌平区","value":"昌平区","open":true},{"pId":"0_1_2","id":"0_1_2_2","text":"朝阳区","value":"朝阳区","open":true},{"pId":"0_1_2","id":"0_1_2_3","text":"大兴区","value":"大兴区","open":true},{"pId":"0_1_2","id":"0_1_2_4","text":"东城区","value":"东城区","open":true},{"pId":"0_1_2","id":"0_1_2_5","text":"房山区","value":"房山区","open":true},{"pId":"0_1_2","id":"0_1_2_6","text":"丰台区","value":"丰台区","open":true},{"pId":"0_1_2","id":"0_1_2_7","text":"海淀区","value":"海淀区","open":true},{"pId":"0_1_2","id":"0_1_2_8","text":"海淀区4内","value":"海淀区4内","open":true},{"pId":"0_1_2","id":"0_1_2_9","text":"海淀区4外","value":"海淀区4外","open":true},{"pId":"0_1_2","id":"0_1_2_10","text":"门头沟区","value":"门头沟区","open":true},{"pId":"0_1_2","id":"0_1_2_11","text":"平谷区","value":"平谷区","open":true},{"pId":"0_1_2","id":"0_1_2_12","text":"石景山区","value":"石景山区","open":true},{"pId":"0_1_2","id":"0_1_2_13","text":"顺义区","value":"顺义区","open":true},{"pId":"0_1_2","id":"0_1_2_14","text":"通州区","value":"通州区","open":true},{"pId":"0_1_2","id":"0_1_2_15","text":"西城区","value":"西城区","open":true},{"pId":"0_1_2","id":"0_1_2_16","text":"西城区  ","value":"西城区  ","open":true},{"pId":"0_1","id":"0_1_3","text":"福建省( 共9个 )","value":"福建省","open":true},{"pId":"0_1_3","id":"0_1_3_0","text":"福州市","value":"福州市","open":true},{"pId":"0_1_3","id":"0_1_3_1","text":"龙岩市","value":"龙岩市","open":true},{"pId":"0_1_3","id":"0_1_3_2","text":"南平市","value":"南平市","open":true},{"pId":"0_1_3","id":"0_1_3_3","text":"宁德市","value":"宁德市","open":true},{"pId":"0_1_3","id":"0_1_3_4","text":"莆田市","value":"莆田市","open":true},{"pId":"0_1_3","id":"0_1_3_5","text":"泉州市","value":"泉州市","open":true},{"pId":"0_1_3","id":"0_1_3_6","text":"三明市","value":"三明市","open":true},{"pId":"0_1_3","id":"0_1_3_7","text":"厦门市","value":"厦门市","open":true},{"pId":"0_1_3","id":"0_1_3_8","text":"漳州市","value":"漳州市","open":true},{"pId":"0_1","id":"0_1_4","text":"甘肃省( 共12个 )","value":"甘肃省","open":true},{"pId":"0_1_4","id":"0_1_4_0","text":"白银市","value":"白银市","open":true},{"pId":"0_1_4","id":"0_1_4_1","text":"嘉峪关市","value":"嘉峪关市","open":true},{"pId":"0_1_4","id":"0_1_4_2","text":"金昌市","value":"金昌市","open":true},{"pId":"0_1_4","id":"0_1_4_3","text":"酒泉市","value":"酒泉市","open":true},{"pId":"0_1_4","id":"0_1_4_4","text":"兰州市","value":"兰州市","open":true},{"pId":"0_1_4","id":"0_1_4_5","text":"陇南市","value":"陇南市","open":true},{"pId":"0_1_4","id":"0_1_4_6","text":"平凉市","value":"平凉市","open":true},{"pId":"0_1_4","id":"0_1_4_7","text":"庆阳市","value":"庆阳市","open":true},{"pId":"0_1_4","id":"0_1_4_8","text":"天津市区","value":"天津市区","open":true},{"pId":"0_1_4","id":"0_1_4_9","text":"天水市","value":"天水市","open":true},{"pId":"0_1_4","id":"0_1_4_10","text":"武威市","value":"武威市","open":true},{"pId":"0_1_4","id":"0_1_4_11","text":"张掖市","value":"张掖市","open":true},{"pId":"0_1","id":"0_1_5","text":"广东省( 共21个 )","value":"广东省","open":true},{"pId":"0_1_5","id":"0_1_5_0","text":"潮州市","value":"潮州市","open":true},{"pId":"0_1_5","id":"0_1_5_1","text":"东莞市","value":"东莞市","open":true},{"pId":"0_1_5","id":"0_1_5_2","text":"佛山市","value":"佛山市","open":true},{"pId":"0_1_5","id":"0_1_5_3","text":"广州市","value":"广州市","open":true},{"pId":"0_1_5","id":"0_1_5_4","text":"河源市","value":"河源市","open":true},{"pId":"0_1_5","id":"0_1_5_5","text":"惠州市","value":"惠州市","open":true},{"pId":"0_1_5","id":"0_1_5_6","text":"江门市","value":"江门市","open":true},{"pId":"0_1_5","id":"0_1_5_7","text":"揭阳市","value":"揭阳市","open":true},{"pId":"0_1_5","id":"0_1_5_8","text":"茂名市","value":"茂名市","open":true},{"pId":"0_1_5","id":"0_1_5_9","text":"梅州市","value":"梅州市","open":true},{"pId":"0_1_5","id":"0_1_5_10","text":"清远市","value":"清远市","open":true},{"pId":"0_1_5","id":"0_1_5_11","text":"汕头市","value":"汕头市","open":true},{"pId":"0_1_5","id":"0_1_5_12","text":"汕尾市","value":"汕尾市","open":true},{"pId":"0_1_5","id":"0_1_5_13","text":"韶关市","value":"韶关市","open":true},{"pId":"0_1_5","id":"0_1_5_14","text":"深圳市","value":"深圳市","open":true},{"pId":"0_1_5","id":"0_1_5_15","text":"阳江市","value":"阳江市","open":true},{"pId":"0_1_5","id":"0_1_5_16","text":"云浮市","value":"云浮市","open":true},{"pId":"0_1_5","id":"0_1_5_17","text":"湛江市","value":"湛江市","open":true},{"pId":"0_1_5","id":"0_1_5_18","text":"肇庆市","value":"肇庆市","open":true},{"pId":"0_1_5","id":"0_1_5_19","text":"中山市","value":"中山市","open":true},{"pId":"0_1_5","id":"0_1_5_20","text":"珠海市","value":"珠海市","open":true},{"pId":"0_1","id":"0_1_6","text":"广西壮族自治区( 共14个 )","value":"广西壮族自治区","open":true},{"pId":"0_1_6","id":"0_1_6_0","text":"百色市","value":"百色市","open":true},{"pId":"0_1_6","id":"0_1_6_1","text":"北海市","value":"北海市","open":true},{"pId":"0_1_6","id":"0_1_6_2","text":"崇左市","value":"崇左市","open":true},{"pId":"0_1_6","id":"0_1_6_3","text":"防城港市","value":"防城港市","open":true},{"pId":"0_1_6","id":"0_1_6_4","text":"桂林市","value":"桂林市","open":true},{"pId":"0_1_6","id":"0_1_6_5","text":"贵港市","value":"贵港市","open":true},{"pId":"0_1_6","id":"0_1_6_6","text":"河池市","value":"河池市","open":true},{"pId":"0_1_6","id":"0_1_6_7","text":"贺州市","value":"贺州市","open":true},{"pId":"0_1_6","id":"0_1_6_8","text":"来宾市","value":"来宾市","open":true},{"pId":"0_1_6","id":"0_1_6_9","text":"柳州市","value":"柳州市","open":true},{"pId":"0_1_6","id":"0_1_6_10","text":"南宁市","value":"南宁市","open":true},{"pId":"0_1_6","id":"0_1_6_11","text":"钦州市","value":"钦州市","open":true},{"pId":"0_1_6","id":"0_1_6_12","text":"梧州市","value":"梧州市","open":true},{"pId":"0_1_6","id":"0_1_6_13","text":"玉林市","value":"玉林市","open":true},{"pId":"0_1","id":"0_1_7","text":"贵州省( 共9个 )","value":"贵州省","open":true},{"pId":"0_1_7","id":"0_1_7_0","text":"安顺市","value":"安顺市","open":true},{"pId":"0_1_7","id":"0_1_7_1","text":"毕节地区","value":"毕节地区","open":true},{"pId":"0_1_7","id":"0_1_7_2","text":"贵阳市","value":"贵阳市","open":true},{"pId":"0_1_7","id":"0_1_7_3","text":"六盘水市","value":"六盘水市","open":true},{"pId":"0_1_7","id":"0_1_7_4","text":"黔东南州","value":"黔东南州","open":true},{"pId":"0_1_7","id":"0_1_7_5","text":"黔南州","value":"黔南州","open":true},{"pId":"0_1_7","id":"0_1_7_6","text":"黔西南市","value":"黔西南市","open":true},{"pId":"0_1_7","id":"0_1_7_7","text":"铜仁地区","value":"铜仁地区","open":true},{"pId":"0_1_7","id":"0_1_7_8","text":"遵义市","value":"遵义市","open":true},{"pId":"0_1","id":"0_1_8","text":"海南省( 共2个 )","value":"海南省","open":true},{"pId":"0_1_8","id":"0_1_8_0","text":"海口市","value":"海口市","open":true},{"pId":"0_1_8","id":"0_1_8_1","text":"三亚市","value":"三亚市","open":true},{"pId":"0_1","id":"0_1_9","text":"河北省( 共12个 )","value":"河北省","open":true},{"pId":"0_1_9","id":"0_1_9_0","text":"保定市","value":"保定市","open":true},{"pId":"0_1_9","id":"0_1_9_1","text":"沧州市","value":"沧州市","open":true},{"pId":"0_1_9","id":"0_1_9_2","text":"承德市","value":"承德市","open":true},{"pId":"0_1_9","id":"0_1_9_3","text":"邯郸市","value":"邯郸市","open":true},{"pId":"0_1_9","id":"0_1_9_4","text":"衡水市","value":"衡水市","open":true},{"pId":"0_1_9","id":"0_1_9_5","text":"廊坊市","value":"廊坊市","open":true},{"pId":"0_1_9","id":"0_1_9_6","text":"秦皇岛市","value":"秦皇岛市","open":true},{"pId":"0_1_9","id":"0_1_9_7","text":"石家庄市","value":"石家庄市","open":true},{"pId":"0_1_9","id":"0_1_9_8","text":"唐山市","value":"唐山市","open":true},{"pId":"0_1_9","id":"0_1_9_9","text":"天津市区","value":"天津市区","open":true},{"pId":"0_1_9","id":"0_1_9_10","text":"邢台市","value":"邢台市","open":true},{"pId":"0_1_9","id":"0_1_9_11","text":"张家口市","value":"张家口市","open":true},{"pId":"0_1","id":"0_1_10","text":"河南省( 共19个 )","value":"河南省","open":true},{"pId":"0_1_10","id":"0_1_10_0","text":"安阳市","value":"安阳市","open":true},{"pId":"0_1_10","id":"0_1_10_1","text":"鹤壁市","value":"鹤壁市","open":true},{"pId":"0_1_10","id":"0_1_10_2","text":"济源市","value":"济源市","open":true},{"pId":"0_1_10","id":"0_1_10_3","text":"焦作市","value":"焦作市","open":true},{"pId":"0_1_10","id":"0_1_10_4","text":"开封市","value":"开封市","open":true},{"pId":"0_1_10","id":"0_1_10_5","text":"廊坊市","value":"廊坊市","open":true},{"pId":"0_1_10","id":"0_1_10_6","text":"洛阳市","value":"洛阳市","open":true},{"pId":"0_1_10","id":"0_1_10_7","text":"漯河市","value":"漯河市","open":true},{"pId":"0_1_10","id":"0_1_10_8","text":"南阳市","value":"南阳市","open":true},{"pId":"0_1_10","id":"0_1_10_9","text":"平顶山市","value":"平顶山市","open":true},{"pId":"0_1_10","id":"0_1_10_10","text":"濮阳市","value":"濮阳市","open":true},{"pId":"0_1_10","id":"0_1_10_11","text":"三门峡市","value":"三门峡市","open":true},{"pId":"0_1_10","id":"0_1_10_12","text":"商丘市","value":"商丘市","open":true},{"pId":"0_1_10","id":"0_1_10_13","text":"新乡市","value":"新乡市","open":true},{"pId":"0_1_10","id":"0_1_10_14","text":"信阳市","value":"信阳市","open":true},{"pId":"0_1_10","id":"0_1_10_15","text":"许昌市","value":"许昌市","open":true},{"pId":"0_1_10","id":"0_1_10_16","text":"郑州市","value":"郑州市","open":true},{"pId":"0_1_10","id":"0_1_10_17","text":"周口市","value":"周口市","open":true},{"pId":"0_1_10","id":"0_1_10_18","text":"驻马店市","value":"驻马店市","open":true},{"pId":"0_1","id":"0_1_11","text":"黑龙江省( 共13个 )","value":"黑龙江省","open":true},{"pId":"0_1_11","id":"0_1_11_0","text":"大庆市","value":"大庆市","open":true},{"pId":"0_1_11","id":"0_1_11_1","text":"大兴安岭地区","value":"大兴安岭地区","open":true},{"pId":"0_1_11","id":"0_1_11_2","text":"大兴安岭市","value":"大兴安岭市","open":true},{"pId":"0_1_11","id":"0_1_11_3","text":"哈尔滨市","value":"哈尔滨市","open":true},{"pId":"0_1_11","id":"0_1_11_4","text":"鹤港市","value":"鹤港市","open":true},{"pId":"0_1_11","id":"0_1_11_5","text":"黑河市","value":"黑河市","open":true},{"pId":"0_1_11","id":"0_1_11_6","text":"佳木斯市","value":"佳木斯市","open":true},{"pId":"0_1_11","id":"0_1_11_7","text":"牡丹江市","value":"牡丹江市","open":true},{"pId":"0_1_11","id":"0_1_11_8","text":"七台河市","value":"七台河市","open":true},{"pId":"0_1_11","id":"0_1_11_9","text":"齐齐哈尔市","value":"齐齐哈尔市","open":true},{"pId":"0_1_11","id":"0_1_11_10","text":"双鸭山市","value":"双鸭山市","open":true},{"pId":"0_1_11","id":"0_1_11_11","text":"绥化市","value":"绥化市","open":true},{"pId":"0_1_11","id":"0_1_11_12","text":"伊春市","value":"伊春市","open":true},{"pId":"0_1","id":"0_1_12","text":"湖北省( 共16个 )","value":"湖北省","open":true},{"pId":"0_1_12","id":"0_1_12_0","text":"鄂州市","value":"鄂州市","open":true},{"pId":"0_1_12","id":"0_1_12_1","text":"恩施土家族苗族自治州","value":"恩施土家族苗族自治州","open":true},{"pId":"0_1_12","id":"0_1_12_2","text":"黄冈市","value":"黄冈市","open":true},{"pId":"0_1_12","id":"0_1_12_3","text":"黄石市","value":"黄石市","open":true},{"pId":"0_1_12","id":"0_1_12_4","text":"荆门市","value":"荆门市","open":true},{"pId":"0_1_12","id":"0_1_12_5","text":"荆州市","value":"荆州市","open":true},{"pId":"0_1_12","id":"0_1_12_6","text":"神农架市","value":"神农架市","open":true},{"pId":"0_1_12","id":"0_1_12_7","text":"十堰市","value":"十堰市","open":true},{"pId":"0_1_12","id":"0_1_12_8","text":"随州市","value":"随州市","open":true},{"pId":"0_1_12","id":"0_1_12_9","text":"天门市","value":"天门市","open":true},{"pId":"0_1_12","id":"0_1_12_10","text":"武汉市","value":"武汉市","open":true},{"pId":"0_1_12","id":"0_1_12_11","text":"咸宁市","value":"咸宁市","open":true},{"pId":"0_1_12","id":"0_1_12_12","text":"襄樊市","value":"襄樊市","open":true},{"pId":"0_1_12","id":"0_1_12_13","text":"襄阳市","value":"襄阳市","open":true},{"pId":"0_1_12","id":"0_1_12_14","text":"孝感市","value":"孝感市","open":true},{"pId":"0_1_12","id":"0_1_12_15","text":"宜昌市","value":"宜昌市","open":true},{"pId":"0_1","id":"0_1_13","text":"湖南省( 共15个 )","value":"湖南省","open":true},{"pId":"0_1_13","id":"0_1_13_0","text":"常德市","value":"常德市","open":true},{"pId":"0_1_13","id":"0_1_13_1","text":"长沙市","value":"长沙市","open":true},{"pId":"0_1_13","id":"0_1_13_2","text":"郴州市","value":"郴州市","open":true},{"pId":"0_1_13","id":"0_1_13_3","text":"衡阳市","value":"衡阳市","open":true},{"pId":"0_1_13","id":"0_1_13_4","text":"怀化市","value":"怀化市","open":true},{"pId":"0_1_13","id":"0_1_13_5","text":"娄底市","value":"娄底市","open":true},{"pId":"0_1_13","id":"0_1_13_6","text":"邵阳市","value":"邵阳市","open":true},{"pId":"0_1_13","id":"0_1_13_7","text":"湘潭市","value":"湘潭市","open":true},{"pId":"0_1_13","id":"0_1_13_8","text":"湘西市","value":"湘西市","open":true},{"pId":"0_1_13","id":"0_1_13_9","text":"湘西土家族苗族自治州","value":"湘西土家族苗族自治州","open":true},{"pId":"0_1_13","id":"0_1_13_10","text":"益阳市","value":"益阳市","open":true},{"pId":"0_1_13","id":"0_1_13_11","text":"永州市","value":"永州市","open":true},{"pId":"0_1_13","id":"0_1_13_12","text":"岳阳市","value":"岳阳市","open":true},{"pId":"0_1_13","id":"0_1_13_13","text":"张家界市","value":"张家界市","open":true},{"pId":"0_1_13","id":"0_1_13_14","text":"株洲市","value":"株洲市","open":true},{"pId":"0_1","id":"0_1_14","text":"吉林省( 共10个 )","value":"吉林省","open":true},{"pId":"0_1_14","id":"0_1_14_0","text":"白城市","value":"白城市","open":true},{"pId":"0_1_14","id":"0_1_14_1","text":"白山市","value":"白山市","open":true},{"pId":"0_1_14","id":"0_1_14_2","text":"长春市","value":"长春市","open":true},{"pId":"0_1_14","id":"0_1_14_3","text":"大庆市","value":"大庆市","open":true},{"pId":"0_1_14","id":"0_1_14_4","text":"吉林市","value":"吉林市","open":true},{"pId":"0_1_14","id":"0_1_14_5","text":"辽源市","value":"辽源市","open":true},{"pId":"0_1_14","id":"0_1_14_6","text":"四平市","value":"四平市","open":true},{"pId":"0_1_14","id":"0_1_14_7","text":"松原市","value":"松原市","open":true},{"pId":"0_1_14","id":"0_1_14_8","text":"通化市","value":"通化市","open":true},{"pId":"0_1_14","id":"0_1_14_9","text":"延边朝鲜族自治州","value":"延边朝鲜族自治州","open":true},{"pId":"0_1","id":"0_1_15","text":"江苏省( 共13个 )","value":"江苏省","open":true},{"pId":"0_1_15","id":"0_1_15_0","text":"常州市","value":"常州市","open":true},{"pId":"0_1_15","id":"0_1_15_1","text":"淮安市","value":"淮安市","open":true},{"pId":"0_1_15","id":"0_1_15_2","text":"连云港市","value":"连云港市","open":true},{"pId":"0_1_15","id":"0_1_15_3","text":"南京市","value":"南京市","open":true},{"pId":"0_1_15","id":"0_1_15_4","text":"南通市","value":"南通市","open":true},{"pId":"0_1_15","id":"0_1_15_5","text":"苏州市","value":"苏州市","open":true},{"pId":"0_1_15","id":"0_1_15_6","text":"宿迁市","value":"宿迁市","open":true},{"pId":"0_1_15","id":"0_1_15_7","text":"泰州市","value":"泰州市","open":true},{"pId":"0_1_15","id":"0_1_15_8","text":"无锡市","value":"无锡市","open":true},{"pId":"0_1_15","id":"0_1_15_9","text":"徐州市","value":"徐州市","open":true},{"pId":"0_1_15","id":"0_1_15_10","text":"盐城市","value":"盐城市","open":true},{"pId":"0_1_15","id":"0_1_15_11","text":"扬州市","value":"扬州市","open":true},{"pId":"0_1_15","id":"0_1_15_12","text":"镇江市","value":"镇江市","open":true},{"pId":"0_1","id":"0_1_16","text":"江西省( 共10个 )","value":"江西省","open":true},{"pId":"0_1_16","id":"0_1_16_0","text":"抚州市","value":"抚州市","open":true},{"pId":"0_1_16","id":"0_1_16_1","text":"赣州市","value":"赣州市","open":true},{"pId":"0_1_16","id":"0_1_16_2","text":"景德镇市","value":"景德镇市","open":true},{"pId":"0_1_16","id":"0_1_16_3","text":"九江市","value":"九江市","open":true},{"pId":"0_1_16","id":"0_1_16_4","text":"南昌市","value":"南昌市","open":true},{"pId":"0_1_16","id":"0_1_16_5","text":"萍乡市","value":"萍乡市","open":true},{"pId":"0_1_16","id":"0_1_16_6","text":"上饶市","value":"上饶市","open":true},{"pId":"0_1_16","id":"0_1_16_7","text":"新余市","value":"新余市","open":true},{"pId":"0_1_16","id":"0_1_16_8","text":"宜春市","value":"宜春市","open":true},{"pId":"0_1_16","id":"0_1_16_9","text":"鹰潭市","value":"鹰潭市","open":true},{"pId":"0_1","id":"0_1_17","text":"辽宁省( 共14个 )","value":"辽宁省","open":true},{"pId":"0_1_17","id":"0_1_17_0","text":"鞍山市","value":"鞍山市","open":true},{"pId":"0_1_17","id":"0_1_17_1","text":"本溪市","value":"本溪市","open":true},{"pId":"0_1_17","id":"0_1_17_2","text":"朝阳市","value":"朝阳市","open":true},{"pId":"0_1_17","id":"0_1_17_3","text":"大连市","value":"大连市","open":true},{"pId":"0_1_17","id":"0_1_17_4","text":"丹东市","value":"丹东市","open":true},{"pId":"0_1_17","id":"0_1_17_5","text":"抚顺市","value":"抚顺市","open":true},{"pId":"0_1_17","id":"0_1_17_6","text":"阜新市","value":"阜新市","open":true},{"pId":"0_1_17","id":"0_1_17_7","text":"葫芦岛市","value":"葫芦岛市","open":true},{"pId":"0_1_17","id":"0_1_17_8","text":"锦州市","value":"锦州市","open":true},{"pId":"0_1_17","id":"0_1_17_9","text":"辽阳市","value":"辽阳市","open":true},{"pId":"0_1_17","id":"0_1_17_10","text":"盘锦市","value":"盘锦市","open":true},{"pId":"0_1_17","id":"0_1_17_11","text":"沈阳市","value":"沈阳市","open":true},{"pId":"0_1_17","id":"0_1_17_12","text":"铁岭市","value":"铁岭市","open":true},{"pId":"0_1_17","id":"0_1_17_13","text":"营口市","value":"营口市","open":true},{"pId":"0_1","id":"0_1_18","text":"内蒙古( 共10个 )","value":"内蒙古","open":true},{"pId":"0_1_18","id":"0_1_18_0","text":"包头市","value":"包头市","open":true},{"pId":"0_1_18","id":"0_1_18_1","text":"赤峰市","value":"赤峰市","open":true},{"pId":"0_1_18","id":"0_1_18_2","text":"鄂尔多斯市","value":"鄂尔多斯市","open":true},{"pId":"0_1_18","id":"0_1_18_3","text":"呼和浩特市","value":"呼和浩特市","open":true},{"pId":"0_1_18","id":"0_1_18_4","text":"呼伦贝尔市","value":"呼伦贝尔市","open":true},{"pId":"0_1_18","id":"0_1_18_5","text":"通辽市","value":"通辽市","open":true},{"pId":"0_1_18","id":"0_1_18_6","text":"乌海市","value":"乌海市","open":true},{"pId":"0_1_18","id":"0_1_18_7","text":"锡林郭勒市","value":"锡林郭勒市","open":true},{"pId":"0_1_18","id":"0_1_18_8","text":"兴安市","value":"兴安市","open":true},{"pId":"0_1_18","id":"0_1_18_9","text":"运城市","value":"运城市","open":true},{"pId":"0_1","id":"0_1_19","text":"宁夏回族自治区( 共5个 )","value":"宁夏回族自治区","open":true},{"pId":"0_1_19","id":"0_1_19_0","text":"固原市","value":"固原市","open":true},{"pId":"0_1_19","id":"0_1_19_1","text":"石嘴山市","value":"石嘴山市","open":true},{"pId":"0_1_19","id":"0_1_19_2","text":"吴忠市","value":"吴忠市","open":true},{"pId":"0_1_19","id":"0_1_19_3","text":"银川市","value":"银川市","open":true},{"pId":"0_1_19","id":"0_1_19_4","text":"中卫市","value":"中卫市","open":true},{"pId":"0_1","id":"0_1_20","text":"青海省( 共4个 )","value":"青海省","open":true},{"pId":"0_1_20","id":"0_1_20_0","text":"海东地区","value":"海东地区","open":true},{"pId":"0_1_20","id":"0_1_20_1","text":"海南藏族自治州","value":"海南藏族自治州","open":true},{"pId":"0_1_20","id":"0_1_20_2","text":"海西蒙古族藏族自治州","value":"海西蒙古族藏族自治州","open":true},{"pId":"0_1_20","id":"0_1_20_3","text":"西宁市","value":"西宁市","open":true},{"pId":"0_1","id":"0_1_21","text":"山东省( 共17个 )","value":"山东省","open":true},{"pId":"0_1_21","id":"0_1_21_0","text":"滨州市","value":"滨州市","open":true},{"pId":"0_1_21","id":"0_1_21_1","text":"德州市","value":"德州市","open":true},{"pId":"0_1_21","id":"0_1_21_2","text":"东营市","value":"东营市","open":true},{"pId":"0_1_21","id":"0_1_21_3","text":"菏泽市","value":"菏泽市","open":true},{"pId":"0_1_21","id":"0_1_21_4","text":"济南市","value":"济南市","open":true},{"pId":"0_1_21","id":"0_1_21_5","text":"济宁市","value":"济宁市","open":true},{"pId":"0_1_21","id":"0_1_21_6","text":"莱芜市","value":"莱芜市","open":true},{"pId":"0_1_21","id":"0_1_21_7","text":"聊城市","value":"聊城市","open":true},{"pId":"0_1_21","id":"0_1_21_8","text":"临沂市","value":"临沂市","open":true},{"pId":"0_1_21","id":"0_1_21_9","text":"青岛市","value":"青岛市","open":true},{"pId":"0_1_21","id":"0_1_21_10","text":"日照市","value":"日照市","open":true},{"pId":"0_1_21","id":"0_1_21_11","text":"泰安市","value":"泰安市","open":true},{"pId":"0_1_21","id":"0_1_21_12","text":"威海市","value":"威海市","open":true},{"pId":"0_1_21","id":"0_1_21_13","text":"潍坊市","value":"潍坊市","open":true},{"pId":"0_1_21","id":"0_1_21_14","text":"烟台市","value":"烟台市","open":true},{"pId":"0_1_21","id":"0_1_21_15","text":"枣庄市","value":"枣庄市","open":true},{"pId":"0_1_21","id":"0_1_21_16","text":"淄博市","value":"淄博市","open":true},{"pId":"0_1","id":"0_1_22","text":"山西省( 共12个 )","value":"山西省","open":true},{"pId":"0_1_22","id":"0_1_22_0","text":"长治市","value":"长治市","open":true},{"pId":"0_1_22","id":"0_1_22_1","text":"大同市","value":"大同市","open":true},{"pId":"0_1_22","id":"0_1_22_2","text":"晋城市","value":"晋城市","open":true},{"pId":"0_1_22","id":"0_1_22_3","text":"晋中市","value":"晋中市","open":true},{"pId":"0_1_22","id":"0_1_22_4","text":"临汾市","value":"临汾市","open":true},{"pId":"0_1_22","id":"0_1_22_5","text":"吕梁市","value":"吕梁市","open":true},{"pId":"0_1_22","id":"0_1_22_6","text":"青岛市","value":"青岛市","open":true},{"pId":"0_1_22","id":"0_1_22_7","text":"朔州市","value":"朔州市","open":true},{"pId":"0_1_22","id":"0_1_22_8","text":"太原市","value":"太原市","open":true},{"pId":"0_1_22","id":"0_1_22_9","text":"忻州市","value":"忻州市","open":true},{"pId":"0_1_22","id":"0_1_22_10","text":"阳泉市","value":"阳泉市","open":true},{"pId":"0_1_22","id":"0_1_22_11","text":"运城市","value":"运城市","open":true},{"pId":"0_1","id":"0_1_23","text":"陕西省( 共9个 )","value":"陕西省","open":true},{"pId":"0_1_23","id":"0_1_23_0","text":"安康市","value":"安康市","open":true},{"pId":"0_1_23","id":"0_1_23_1","text":"宝鸡市","value":"宝鸡市","open":true},{"pId":"0_1_23","id":"0_1_23_2","text":"汉中市","value":"汉中市","open":true},{"pId":"0_1_23","id":"0_1_23_3","text":"商洛市","value":"商洛市","open":true},{"pId":"0_1_23","id":"0_1_23_4","text":"渭南市","value":"渭南市","open":true},{"pId":"0_1_23","id":"0_1_23_5","text":"西安市","value":"西安市","open":true},{"pId":"0_1_23","id":"0_1_23_6","text":"咸阳市","value":"咸阳市","open":true},{"pId":"0_1_23","id":"0_1_23_7","text":"延安市","value":"延安市","open":true},{"pId":"0_1_23","id":"0_1_23_8","text":"榆林市","value":"榆林市","open":true},{"pId":"0_1","id":"0_1_24","text":"上海市( 共19个 )","value":"上海市","open":true},{"pId":"0_1_24","id":"0_1_24_0","text":"宝山区","value":"宝山区","open":true},{"pId":"0_1_24","id":"0_1_24_1","text":"长宁区","value":"长宁区","open":true},{"pId":"0_1_24","id":"0_1_24_2","text":"崇明县","value":"崇明县","open":true},{"pId":"0_1_24","id":"0_1_24_3","text":"奉贤区","value":"奉贤区","open":true},{"pId":"0_1_24","id":"0_1_24_4","text":"虹口区","value":"虹口区","open":true},{"pId":"0_1_24","id":"0_1_24_5","text":"黄浦区","value":"黄浦区","open":true},{"pId":"0_1_24","id":"0_1_24_6","text":"嘉定区","value":"嘉定区","open":true},{"pId":"0_1_24","id":"0_1_24_7","text":"金山区","value":"金山区","open":true},{"pId":"0_1_24","id":"0_1_24_8","text":"静安区","value":"静安区","open":true},{"pId":"0_1_24","id":"0_1_24_9","text":"昆明市","value":"昆明市","open":true},{"pId":"0_1_24","id":"0_1_24_10","text":"闵行区","value":"闵行区","open":true},{"pId":"0_1_24","id":"0_1_24_11","text":"普陀区","value":"普陀区","open":true},{"pId":"0_1_24","id":"0_1_24_12","text":"浦东新区","value":"浦东新区","open":true},{"pId":"0_1_24","id":"0_1_24_13","text":"青浦区","value":"青浦区","open":true},{"pId":"0_1_24","id":"0_1_24_14","text":"上海市区","value":"上海市区","open":true},{"pId":"0_1_24","id":"0_1_24_15","text":"松江区","value":"松江区","open":true},{"pId":"0_1_24","id":"0_1_24_16","text":"徐汇区","value":"徐汇区","open":true},{"pId":"0_1_24","id":"0_1_24_17","text":"杨浦区","value":"杨浦区","open":true},{"pId":"0_1_24","id":"0_1_24_18","text":"闸北区","value":"闸北区","open":true},{"pId":"0_1","id":"0_1_25","text":"四川省( 共21个 )","value":"四川省","open":true},{"pId":"0_1_25","id":"0_1_25_0","text":"阿坝藏族羌族自治州","value":"阿坝藏族羌族自治州","open":true},{"pId":"0_1_25","id":"0_1_25_1","text":"巴中市","value":"巴中市","open":true},{"pId":"0_1_25","id":"0_1_25_2","text":"成都市","value":"成都市","open":true},{"pId":"0_1_25","id":"0_1_25_3","text":"达州市","value":"达州市","open":true},{"pId":"0_1_25","id":"0_1_25_4","text":"德阳市","value":"德阳市","open":true},{"pId":"0_1_25","id":"0_1_25_5","text":"甘孜市","value":"甘孜市","open":true},{"pId":"0_1_25","id":"0_1_25_6","text":"广安市","value":"广安市","open":true},{"pId":"0_1_25","id":"0_1_25_7","text":"广元市","value":"广元市","open":true},{"pId":"0_1_25","id":"0_1_25_8","text":"乐山市","value":"乐山市","open":true},{"pId":"0_1_25","id":"0_1_25_9","text":"凉山市","value":"凉山市","open":true},{"pId":"0_1_25","id":"0_1_25_10","text":"泸州市","value":"泸州市","open":true},{"pId":"0_1_25","id":"0_1_25_11","text":"眉山市","value":"眉山市","open":true},{"pId":"0_1_25","id":"0_1_25_12","text":"绵阳市","value":"绵阳市","open":true},{"pId":"0_1_25","id":"0_1_25_13","text":"南充市","value":"南充市","open":true},{"pId":"0_1_25","id":"0_1_25_14","text":"内江市","value":"内江市","open":true},{"pId":"0_1_25","id":"0_1_25_15","text":"攀枝花市","value":"攀枝花市","open":true},{"pId":"0_1_25","id":"0_1_25_16","text":"遂宁市","value":"遂宁市","open":true},{"pId":"0_1_25","id":"0_1_25_17","text":"雅安市","value":"雅安市","open":true},{"pId":"0_1_25","id":"0_1_25_18","text":"宜宾市","value":"宜宾市","open":true},{"pId":"0_1_25","id":"0_1_25_19","text":"资阳市","value":"资阳市","open":true},{"pId":"0_1_25","id":"0_1_25_20","text":"自贡市","value":"自贡市","open":true},{"pId":"0_1","id":"0_1_26","text":"台湾( 共1个 )","value":"台湾","open":true},{"pId":"0_1_26","id":"0_1_26_0","text":"台北市","value":"台北市","open":true},{"pId":"0_1","id":"0_1_27","text":"天津市( 共1个 )","value":"天津市","open":true},{"pId":"0_1_27","id":"0_1_27_0","text":"天津市区","value":"天津市区","open":true},{"pId":"0_1","id":"0_1_28","text":"西藏自治区( 共2个 )","value":"西藏自治区","open":true},{"pId":"0_1_28","id":"0_1_28_0","text":"阿里市","value":"阿里市","open":true},{"pId":"0_1_28","id":"0_1_28_1","text":"日喀则市","value":"日喀则市","open":true},{"pId":"0_1","id":"0_1_29","text":"香港特别行政区( 共1个 )","value":"香港特别行政区","open":true},{"pId":"0_1_29","id":"0_1_29_0","text":"香港","value":"香港","open":true},{"pId":"0_1","id":"0_1_30","text":"新疆维吾尔族自治区( 共11个 )","value":"新疆维吾尔族自治区","open":true},{"pId":"0_1_30","id":"0_1_30_0","text":"巴音郭楞市","value":"巴音郭楞市","open":true},{"pId":"0_1_30","id":"0_1_30_1","text":"哈密市","value":"哈密市","open":true},{"pId":"0_1_30","id":"0_1_30_2","text":"和田市","value":"和田市","open":true},{"pId":"0_1_30","id":"0_1_30_3","text":"喀什地区","value":"喀什地区","open":true},{"pId":"0_1_30","id":"0_1_30_4","text":"克拉玛依市","value":"克拉玛依市","open":true},{"pId":"0_1_30","id":"0_1_30_5","text":"克孜勒苏柯州","value":"克孜勒苏柯州","open":true},{"pId":"0_1_30","id":"0_1_30_6","text":"石河子市","value":"石河子市","open":true},{"pId":"0_1_30","id":"0_1_30_7","text":"塔城市","value":"塔城市","open":true},{"pId":"0_1_30","id":"0_1_30_8","text":"吐鲁番地区","value":"吐鲁番地区","open":true},{"pId":"0_1_30","id":"0_1_30_9","text":"乌鲁木齐","value":"乌鲁木齐","open":true},{"pId":"0_1_30","id":"0_1_30_10","text":"伊犁市","value":"伊犁市","open":true},{"pId":"0_1","id":"0_1_31","text":"云南省( 共12个 )","value":"云南省","open":true},{"pId":"0_1_31","id":"0_1_31_0","text":"保山市","value":"保山市","open":true},{"pId":"0_1_31","id":"0_1_31_1","text":"楚雄彝族自治州","value":"楚雄彝族自治州","open":true},{"pId":"0_1_31","id":"0_1_31_2","text":"大理白族自治州","value":"大理白族自治州","open":true},{"pId":"0_1_31","id":"0_1_31_3","text":"红河哈尼族彝族自治州","value":"红河哈尼族彝族自治州","open":true},{"pId":"0_1_31","id":"0_1_31_4","text":"昆明市","value":"昆明市","open":true},{"pId":"0_1_31","id":"0_1_31_5","text":"丽江市","value":"丽江市","open":true},{"pId":"0_1_31","id":"0_1_31_6","text":"临沧市","value":"临沧市","open":true},{"pId":"0_1_31","id":"0_1_31_7","text":"曲靖市","value":"曲靖市","open":true},{"pId":"0_1_31","id":"0_1_31_8","text":"思茅市","value":"思茅市","open":true},{"pId":"0_1_31","id":"0_1_31_9","text":"文山市","value":"文山市","open":true},{"pId":"0_1_31","id":"0_1_31_10","text":"玉溪市","value":"玉溪市","open":true},{"pId":"0_1_31","id":"0_1_31_11","text":"昭通市","value":"昭通市","open":true},{"pId":"0_1","id":"0_1_32","text":"浙江省( 共12个 )","value":"浙江省","open":true},{"pId":"0_1_32","id":"0_1_32_0","text":"杭州市","value":"杭州市","open":true},{"pId":"0_1_32","id":"0_1_32_1","text":"湖州市","value":"湖州市","open":true},{"pId":"0_1_32","id":"0_1_32_2","text":"嘉兴市","value":"嘉兴市","open":true},{"pId":"0_1_32","id":"0_1_32_3","text":"金华市","value":"金华市","open":true},{"pId":"0_1_32","id":"0_1_32_4","text":"丽水市","value":"丽水市","open":true},{"pId":"0_1_32","id":"0_1_32_5","text":"宁波市","value":"宁波市","open":true},{"pId":"0_1_32","id":"0_1_32_6","text":"衢州市","value":"衢州市","open":true},{"pId":"0_1_32","id":"0_1_32_7","text":"绍兴市","value":"绍兴市","open":true},{"pId":"0_1_32","id":"0_1_32_8","text":"台州市","value":"台州市","open":true},{"pId":"0_1_32","id":"0_1_32_9","text":"温州市","value":"温州市","open":true},{"pId":"0_1_32","id":"0_1_32_10","text":"浙江省","value":"浙江省","open":true},{"pId":"0_1_32","id":"0_1_32_11","text":"舟山市","value":"舟山市","open":true},{"pId":"0_1","id":"0_1_33","text":"重庆市( 共1个 )","value":"重庆市","open":true},{"pId":"0_1_33","id":"0_1_33_0","text":"重庆市区","value":"重庆市区","open":true}],

    TREE:[{id: -1, pId: -2, value: "根目录", text: "根目录"},
    {id: 1, pId: -1, value: "第一级目录1", text: "第一级目录1"},
    {id: 11, pId: 1, value: "第二级文件1", text: "第二级文件1"},
    {id: 12, pId: 1, value: "第二级目录2", text: "第二级目录2"},
    {id: 121, pId: 12, value: "第三级目录1", text: "第三级目录1"},
    {id: 122, pId: 12, value: "第三级文件1", text: "第三级文件1"},
    {id: 1211, pId: 121, value: "第四级目录1", text: "第四级目录1"},
    {id: 12111, pId: 1211, value: "第五级文件1", text: "第五级文件1"},
    {id: 2, pId: -1, value: "第一级目录2", text: "第一级目录2"},
    {id: 21, pId: 2, value: "第二级目录3", text: "第二级目录3"},
    {id: 22, pId: 2, value: "第二级文件2", text: "第二级文件2"},
    {id: 211, pId: 21, value: "第三级目录2", text: "第三级目录2"},
    {id: 212, pId: 21, value: "第三级文件2", text: "第三级文件2"},
    {id: 2111, pId: 211, value: "第四级文件1", text: "第四级文件1"}]
};

