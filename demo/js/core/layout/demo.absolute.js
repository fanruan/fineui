Demo.AbsoluteLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.label",
                    text: "绝对布局",
                    cls: "layout-bg1",
                    width: 300,
                    height: 200
                },
                left: 100,
                top: 100
            }]
        }
    }
});
BI.shortcut("demo.absolute", Demo.AbsoluteLayout);