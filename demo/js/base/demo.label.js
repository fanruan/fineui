Demo.Label = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-label"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                text: "1"
            }]
        };
    }
});
BI.shortcut("demo.label", Demo.Label);