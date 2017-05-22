Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.virtual_list",
            items: BI.map(BI.makeArray(200, 0), function (i, item) {
                return {
                    type: "bi.label",
                    height: 30,
                    text: i
                };
            })
        }
    }
});
BI.shortcut("demo.virtual_list", Demo.Func);