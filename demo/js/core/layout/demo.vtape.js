/**
 * Created by User on 2017/3/22.
 */
Demo.VtapeLayout = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-vtape"
    },
    render: function () {
        return {
            type: "bi.vtape",
            vgap: 10,
            items: [
                {
                    height: 100,
                    el: {
                        type: "bi.label",
                        text: "1",
                        cls: "layout-bg1"
                    },
                    tgap: 10,
                    vgap: 10
                }, {
                    height: 200,
                    el: {
                        type: "bi.label",
                        text: "2",
                        cls: "layout-bg2"
                    }
                }, {
                    height: "fill",
                    el: {
                        type: "bi.label",
                        text: "3",
                        cls: "layout-bg3"
                    }
                }
            ]
        };
    }
});
BI.shortcut("demo.vtape", Demo.VtapeLayout);