Demo.Main = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-main"
    },
    render: function () {
        return {
            type: "bi.border",
            items: {
                north: {
                    height: 50,
                    el: {
                        type: "demo.north"
                    }
                },
                west: {
                    width: 230,
                    el: {
                        type: "demo.west"
                    }
                },
                center: {
                    el: {
                        type: "demo.center",
                    }
                }
            }
        }
    }
});
$.shortcut("demo.main", Demo.Main);