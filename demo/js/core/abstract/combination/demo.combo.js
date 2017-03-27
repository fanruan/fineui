Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.layout",
        }
    }
});
BI.shortcut("demo.combo", Demo.Func);