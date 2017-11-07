Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 20,
            hgap: 30,
            items: [{
                type: "bi.segment",
                items: [{
                    text: "1",
                    value: 1
                }, {
                    text: "2",
                    value: 2
                }, {
                    text: "3",
                    value: 3
                }]
            }]
        })
    }
});
BI.shortcut("demo.segment", Demo.Func);