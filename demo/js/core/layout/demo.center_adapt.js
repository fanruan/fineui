Demo.CenterAdapt = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.center_adapt",
            items: [{
                type: "bi.label",
                text: "水平垂直居中",
                width: 300,
                height: 200,
                cls: "layout-bg1"
            }]
        };
    }
});
BI.shortcut("demo.center_adapt", Demo.CenterAdapt);