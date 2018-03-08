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
            handler: function() {
                BI.Popovers.remove(id);
                BI.Popovers.create(id, {
                    body: {
                        type: "bi.label",
                        text: "这个是body"
                    }
                }).open(id);
            }
        };
    }
});

BI.shortcut("demo.popover", Demo.Func);