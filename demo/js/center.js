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

Demo.Router = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-router"
    },
    render: function () {
        var self = this;
        var params = BI.Router.$router.history.current.params;
        return {
            type: params.componentId
        }
    }
});
BI.shortcut("demo.router", Demo.Router);
