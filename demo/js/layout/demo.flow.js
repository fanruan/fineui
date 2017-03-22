/**
 * Created by User on 2017/3/22.
 */
Demo.FlowLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-flow"
    },
    render: function () {
        return {
            type: "bi.center_adapt",
            items: [{
                type: "bi.left",
                items: [{
                    type: "bi.label",
                    height: 30,
                    text: "Left-1",
                    cls: "layout-bg1",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-2",
                    cls: "layout-bg2",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-3",
                    cls: "layout-bg3",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-4",
                    cls: "layout-bg4",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-5",
                    cls: "layout-bg5",
                    hgap: 20
                }],
                hgap: 20,
                vgap: 20
            }, {
                type: "bi.right",
                items: [{
                    type: "bi.label",
                    height: 30,
                    text: "Right-1",
                    cls: "layout-bg1",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-2",
                    cls: "layout-bg2",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-3",
                    cls: "layout-bg3",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-4",
                    cls: "layout-bg4",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Right-5",
                    cls: "layout-bg5",
                    hgap: 20
                }],
                hgap: 20,
                vgap: 20
            }]
        }
    }
});
$.shortcut("demo.flow", Demo.FlowLayout);