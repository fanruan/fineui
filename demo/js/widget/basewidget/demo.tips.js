/**
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
BI.shortcut("demo.tips", Demo.Tips);