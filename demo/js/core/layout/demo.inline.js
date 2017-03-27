/**
 * Created by User on 2017/3/22.
 */
Demo.InlineLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-inline"
    },
    render: function () {
        return {
            type: "bi.inline",
            items: [{
                type: "bi.label",
                height: 30,
                text: "Left-1",
                cls: "layout-bg1",
                hgap: 200
            }, {
                type: "bi.label",
                height: 30,
                text: "Left-2",
                cls: "layout-bg2",
                hgap: 200
            }, {
                type: "bi.label",
                height: 30,
                text: "Left-3",
                cls: "layout-bg3",
                hgap: 200
            }, {
                type: "bi.label",
                height: 30,
                text: "Left-4",
                cls: "layout-bg4",
                hgap: 200
            }, {
                type: "bi.label",
                height: 30,
                text: "Left-5",
                cls: "layout-bg5",
                hgap: 200
            }],
            hgap: 20,
            vgap: 20
        }
    }
});
BI.shortcut("demo.inline", Demo.InlineLayout);