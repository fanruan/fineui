/**
 * Created by User on 2017/3/22.
 */
Demo.CenterLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-center"
    },
    render: function () {
        return {
            type: "bi.center",
            items: [{
                type: "bi.label",
                text: "Center 1，这里虽然设置label的高度30，但是最终影响高度的是center布局",
                cls: "layout-bg1",
                whiteSpace: "normal"
            },{
                type: "bi.label",
                text: "Center 2，为了演示label是占满整个的，用了一个whiteSpace:normal",
                cls: "layout-bg2",
                whiteSpace: "normal"
            },{
                type: "bi.label",
                text: "Center 3",
                cls: "layout-bg3"
            },{
                type: "bi.label",
                text: "Center 4",
                cls: "layout-bg5"
            }],
            hgap: 20,
            vgap: 20
        }
    }
});
$.shortcut("demo.center_layout", Demo.CenterLayout);