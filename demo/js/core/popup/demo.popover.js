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
            type: "bi.text_button",
            text: "点击弹出Popover",
            width: 200,
            height: 80,
            handler: function () {
                BI.Popovers.remove(id);
                BI.Popovers.create(id, {
                    type: "bi.bar_popover",
                    header: {
                        type: "bi.label",
                        text: "这个是header"
                    },
                    body: {
                        type: "bi.label",
                        text: "这个是body"
                    }
                    // footer: {
                    //     type: "bi.label",
                    //     text: "这个是footer"
                    // }
                }).open(id);
            }
        };
    }
});

BI.shortcut("demo.popover", Demo.Func);