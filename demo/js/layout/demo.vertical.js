/**
 * Created by User on 2017/3/21.
 */
Demo.VerticalLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-vertical"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                cls: "layout-bg1",
                text: "这里设置了hgap(水平间距)，vgap(垂直间距)",
                height: 30
            }, {
                type: "bi.label",
                cls: "layout-bg2",
                text: "这里设置了hgap(水平间距)，vgap(垂直间距)",
                height: 30
            }]
        }
    }
});
$.shortcut("demo.vertical", Demo.VerticalLayout);