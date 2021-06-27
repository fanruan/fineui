Demo.Center = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-center"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.router_view"
        }
    }
});
BI.shortcut("demo.center", Demo.Center);