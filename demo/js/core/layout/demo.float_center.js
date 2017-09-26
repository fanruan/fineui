/**
 * Created by User on 2017/3/22.
 */
Demo.FloatCenterLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-float-center"
    },
    render: function () {
        return {
            type: "bi.float_center",
            items: [{
                type: "bi.label",
                text: "floatCenter与center的不同在于，它可以控制最小宽度和最大宽度",
                cls: "layout-bg1",
                whiteSpace: "normal"
            }, {
                type: "bi.label",
                text: "浮动式的中间布局",
                cls: "layout-bg2",
                whiteSpace: "normal"
            }],
            hgap: 20,
            vgap: 20
        }
    }
});
BI.shortcut("demo.float_center", Demo.FloatCenterLayout);