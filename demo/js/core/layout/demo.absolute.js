Demo.AbsoluteLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.absolute",
            scrollx: true,
            items: [{
                el: {
                    type: "bi.label",
                    text: "绝对布局",
                    cls: "layout-bg1",
                    width: 800,
                    height: 200
                },
                right: 100,
                top: 100
            }]
        };
    }
});
BI.shortcut("demo.absolute", Demo.AbsoluteLayout);