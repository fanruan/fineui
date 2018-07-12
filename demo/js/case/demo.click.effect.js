Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        return {
            type: "bi.vertical",
            items: BI.createItems([{
                text: "bi-list-item",
                cls: "bi-list-item"
            }, {
                text: "bi-list-item-simple",
                cls: "bi-list-item-simple"
            }, {
                text: "bi-list-item-effect",
                cls: "bi-list-item-effect"
            }, {
                text: "bi-list-item-active",
                cls: "bi-list-item-active"
            }, {
                text: "bi-list-item-active2",
                cls: "bi-list-item-active2"
            }, {
                text: "bi-list-item-active3",
                cls: "bi-list-item-active3"
            }, {
                text: "bi-list-item-select",
                cls: "bi-list-item-select"
            }], {
                type: "bi.text_item"
            }),
            vgap: 10
        };
    }
});
BI.shortcut("demo.click_item_effect", Demo.Func);