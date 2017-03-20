Demo.Main = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-main"
    },
    render: function () {
        return {
            type: "bi.button_group",
            layouts: [{
                type: "bi.vertical"
            }],
            items: [{
                type: "bi.button",
                text: 1
            }]
        }
    }
});
$.shortcut("demo.main", Demo.Main);