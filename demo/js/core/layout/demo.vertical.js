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
            vgap: 10,
            items: [{
                type: "bi.label",
                cls: "layout-bg3",
                text: "垂直布局",
                height: 30
            }, {
                type: "bi.label",
                cls: "layout-bg4",
                text: "垂直布局",
                height: 30
            }]
        };
    }
});
BI.shortcut("demo.vertical", Demo.VerticalLayout);