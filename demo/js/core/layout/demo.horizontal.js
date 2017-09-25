/**
 * Created by User on 2017/3/21.
 */
Demo.Horizontal = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal"
    },
    render: function () {
        return {
            type: "bi.horizontal",
            items: [{
                type: "bi.label",
                text: "水平布局",
                cls: "layout-bg3",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "水平布局",
                cls: "layout-bg4",
                width: 300,
                height: 30
            }]
        }
    }
});
BI.shortcut("demo.horizontal", Demo.Horizontal);