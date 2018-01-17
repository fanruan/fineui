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
            hgap: 10,
            items: [{
                type: "bi.label",
                whiteSpace: "normal",
                text: "因为大多数场景下都需要垂直居中，所以这个布局一般会被vertical_adapt布局设置scrollx=true取代",
                cls: "layout-bg3",
                width: 500,
                height: 50
            }, {
                type: "bi.label",
                text: "水平布局",
                cls: "layout-bg4",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "水平布局",
                cls: "layout-bg5",
                width: 300,
                height: 30
            }, {
                type: "bi.label",
                text: "水平布局",
                cls: "layout-bg6",
                width: 300,
                height: 30
            }]
        };
    }
});
BI.shortcut("demo.horizontal", Demo.Horizontal);