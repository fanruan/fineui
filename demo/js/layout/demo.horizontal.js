/**
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
$.shortcut("demo.horizontal", Demo.Horizontal);