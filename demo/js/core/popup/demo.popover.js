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
                text: "点击弹出Popover",
                height: 30,
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
            }]
        };
    }
});

BI.shortcut("demo.popover", Demo.Func);