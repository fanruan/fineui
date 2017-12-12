Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        BI.createWidget({
            type: "bi.select_list",
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
BI.shortcut("demo.select_list", Demo.Func);