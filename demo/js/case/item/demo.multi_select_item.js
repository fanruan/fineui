Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {

        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "复选item"
            }, {
                type: "bi.multi_select_item",
                text: "复选项"
            }],
            hgap: 300
        }
    }
});
BI.shortcut("demo.multi_select_item", Demo.Func);