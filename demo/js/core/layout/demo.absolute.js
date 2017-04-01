Demo.AbsoluteLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.button",
                    text: "absolute"
                },
                left: 100,
                top: 100
            }]
        }
    }
});
BI.shortcut("demo.absolute", Demo.AbsoluteLayout);