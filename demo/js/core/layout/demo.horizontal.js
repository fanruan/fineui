/**
 * Created by User on 2017/3/21.
 */
Demo.Horizontal = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal"
    },
    render: function () {
        return {
            type: "bi.vertical",
            vgap: 10,
            items: [{
                type: "bi.horizontal",
                height: 150,
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
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }, {
                type: "bi.horizontal",
                height: 150,
                verticalAlign: BI.VerticalAlign.Middle,
                horizontalAlign: BI.HorizontalAlign.Left,
                vgap: 10,
                items: [{
                    type: "bi.label",
                    text: "以horizontal实现的vertical_adapt垂直居中",
                    cls: "layout-bg1",
                    width: 300,
                    height: 30
                }, {
                    type: "bi.label",
                    text: "以horizontal实现的vertical_adapt垂直居中",
                    cls: "layout-bg2",
                    width: 300,
                    height: 30
                }]
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }, {
                type: "bi.horizontal",
                height: 150,
                verticalAlign: BI.VerticalAlign.Top,
                horizontalAlign: BI.HorizontalAlign.Center,
                items: [{
                    type: "bi.label",
                    text: "以horizontal代替horizontal_adapt实现的水平居中(单元素)",
                    cls: "layout-bg1",
                    width: 300,
                    height: 30
                }]
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }, {
                type: "bi.horizontal",
                height: 150,
                verticalAlign: BI.VerticalAlign.Top,
                horizontalAlign: BI.HorizontalAlign.Center,
                columnSize: [300, "fill"],
                items: [{
                    type: "bi.label",
                    text: "以horizontal代替horizontal_adapt实现的用于水平适应布局",
                    cls: "layout-bg1",
                    height: 30
                }, {
                    type: "bi.label",
                    text: "以horizontal代替horizontal_adapt实现的水平自适应列",
                    cls: "layout-bg2",
                    height: 30
                }]
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }, {
                type: "bi.center_adapt",
                height: 150,
                verticalAlign: BI.VerticalAlign.Middle,
                horizontalAlign: BI.HorizontalAlign.Center,
                items: [{
                    type: "bi.label",
                    text: "以horizontal代替center_adapt实现的水平垂直居中",
                    width: 300,
                    height: 100,
                    cls: "layout-bg1"
                }]
            }, {
                type: "bi.layout",
                height: 1,
                cls: "bi-border-bottom bi-high-light-border"
            }]
        };
    }
});
BI.shortcut("demo.horizontal", Demo.Horizontal);