/**
 * Created by User on 2017/3/22.
 */
Demo.HorizontalFloat = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-horizontal-float"
    },

    render: function () {
        return {
            type: "bi.horizontal_float",
            items: [{
                type: "bi.label",
                text: "浮动式水平居中布局方案，用于宽度未知的情况",
                cls: "layout-bg1",
                height: 30
            }]
        }
    }
});
BI.shortcut("demo.horizontal_float", Demo.HorizontalFloat);