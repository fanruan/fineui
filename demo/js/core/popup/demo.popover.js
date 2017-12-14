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
                BI.Popovers.create(id, new Demo.ExamplePopoverSection()).open(id);
            }
        };
    }
});

Demo.ExamplePopoverSection = BI.inherit(BI.PopoverSection, {

    rebuildSouth: function (south) {
        var self = this, o = this.options;
        this.sure = BI.createWidget({
            type: 'bi.button',
            text: "确定",
            warningTitle: o.warningTitle,
            height: 30,
            value: 0,
            handler: function (v) {
                self.end();
                self.close(v);
            }
        });
        this.cancel = BI.createWidget({
            type: 'bi.button',
            text: "取消",
            height: 30,
            value: 1,
            level: 'ignore',
            handler: function (v) {
                self.close(v);
            }
        });
        BI.createWidget({
            type: 'bi.right_vertical_adapt',
            element: south,
            lgap: 10,
            items: [this.cancel, this.sure]
        });
    }
});
BI.shortcut("demo.popover", Demo.Func);