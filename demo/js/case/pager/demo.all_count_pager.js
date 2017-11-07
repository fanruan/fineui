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
                type: "bi.label",
                height: 30,
                text: " (测试条件：总页数为3)"
            }, {
                type: "bi.all_count_pager",
                pages: 3,
                curr: 1,
                count: 1000
            }]
        })
    }
});
BI.shortcut("demo.all_count_pager", Demo.Func);