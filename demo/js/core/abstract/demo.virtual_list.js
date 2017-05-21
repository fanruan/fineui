Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.virtual_list"
        }
    }
});
BI.shortcut("demo.virtual_list", Demo.Func);