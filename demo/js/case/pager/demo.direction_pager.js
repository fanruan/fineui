Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        BI.createWidget({
            type: "bi.vertical",
            hgap: 200,
            vgap: 50,
            element: this,
            items: [{
                type: "bi.direction_pager"
            }]
        });
    }
});
BI.shortcut("demo.direction_pager", Demo.Func);