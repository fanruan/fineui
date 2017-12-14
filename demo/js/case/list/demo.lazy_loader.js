Demo.Func = BI.inherit(BI.Widget, {
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
BI.shortcut("demo.lazy_loader", Demo.Func);