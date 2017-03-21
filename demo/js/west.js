Demo.West = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-west"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.vertical",
                items: []
            }]
        }
    }
});
$.shortcut("demo.west", Demo.West);