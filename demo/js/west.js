Demo.West = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-west"
    },
    render: function () {
        var self = this;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.multilayer_single_level_tree",
                listeners: [{
                    eventName: BI.MultiLayerSingleLevelTree.EVENT_CHANGE,
                    action: function (v) {
                        self.fireEvent(Demo.West.EVENT_VALUE_CHANGE, v);
                    }
                }],
                items: Demo.WIDGET
            }]
        }
    }
});
Demo.West.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
$.shortcut("demo.west", Demo.West);