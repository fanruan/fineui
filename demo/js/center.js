Demo.Center = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-center"
    },
    beforeCreate: function () {
        console.log("beforeCreate");
    },
    render: function () {
        return {
            type: "bi.vertical",
            hgap: 50,
            vgap: 20,
            items: [{
                type: "bi.label",
                text: "栅格布局",
                height: 50
            }, {
                type: "bi.lattice",
                columnSize: [0.1, 0.1, 0.3, 0.4, 0.1],
                items: [{
                    type: "bi.label",
                    height: 30,
                    text: "Left-1",
                    cls: "layout-bg1 lattice-item",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-2",
                    cls: "layout-bg2 lattice-item",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-3",
                    cls: "layout-bg3 lattice-item",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-4",
                    cls: "layout-bg4 lattice-item",
                    hgap: 20
                }, {
                    type: "bi.label",
                    height: 30,
                    text: "Left-5",
                    cls: "layout-bg5 lattice-item",
                    hgap: 20
                }]
            }]
        }
    },
    created: function () {
        console.log("created");
    },
    mounted: function () {
        console.log("mounted");
    }
});
$.shortcut("demo.center", Demo.Center);