Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        return {
            type: "bi.list_view",
            el: {
                type: "bi.left"
            },
            items: BI.map(Demo.CONSTANTS.ITEMS, function (i, item) {
                return BI.extend({}, item, {
                    type: "bi.label",
                    width: 200,
                    height: 200,
                    text: (i + 1) + "." + item.text
                });
            })
        }
    }
});
BI.shortcut("demo.list_view", Demo.Func);