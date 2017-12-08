Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.panel",
            title: "title",
            titleButtons: [{
                type: "bi.button",
                text: "操作"
            }],
            el: {
                type: "bi.button_group",
                layouts: [{
                    type: "bi.vertical"
                }],
                items: BI.createItems(BI.deepClone(Demo.CONSTANTS.ITEMS), {
                    type: "bi.multi_select_item",
                    height: 25
                })
            }
        };
    }
});
BI.shortcut("demo.panel", Demo.Func);