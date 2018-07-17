Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        return {
            type: "bi.vertical",
            items: BI.createItems([{
                text: "bi-list-item",
                cls: "bi-list-item close-font"
            }, {
                text: "bi-list-item-simple",
                cls: "bi-list-item-simple close-font"
            }, {
                text: "bi-list-item-effect",
                cls: "bi-list-item-effect close-font"
            }, {
                text: "bi-list-item-active",
                cls: "bi-list-item-active close-font"
            }, {
                text: "bi-list-item-active2",
                cls: "bi-list-item-active2 close-font"
            }, {
                text: "bi-list-item-active3",
                cls: "bi-list-item-active3 close-font"
            }, {
                text: "bi-list-item-select",
                cls: "bi-list-item-select close-font"
            }], {
                type: "bi.icon_text_item",
                disabled: true,
                logic: {
                    dynamic: true
                }
            }),
            vgap: 10
        };
    }
});
BI.shortcut("demo.click_item_effect", Demo.Func);