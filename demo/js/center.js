Demo.Center = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-center"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.router_view"
        }
    },

    setValue: function (v) {
        // this.tab.setSelect(v);
    }
});
BI.shortcut("demo.center", Demo.Center);