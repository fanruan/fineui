Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.virtual_list",
            items: BI.map(Demo.CONSTANTS.ITEMS, function (i, item) {
                return BI.extend({}, item, {
                    type: "bi.label",
                    height: 30,
                    text: (i + 1) + "." + item.text
                });
            })
        }
    }
});
BI.shortcut("demo.virtual_list", Demo.Func);