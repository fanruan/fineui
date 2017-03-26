Demo.Main = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-main"
    },
    render: function () {
        var center;
        return {
            type: "bi.border",
            items: {
                north: {
                    height: 50,
                    el: {
                        type: "demo.north",
                        listeners: [{
                            eventName: Demo.North.EVENT_VALUE_CHANGE,
                            action: function (v) {
                                center.setValue(v);
                            }
                        }]
                    }
                },
                west: {
                    width: 230,
                    el: {
                        type: "demo.west",
                        listeners: [{
                            eventName: Demo.West.EVENT_VALUE_CHANGE,
                            action: function (v) {
                                center.setValue(v);
                            }
                        }]
                    }
                },
                center: {
                    el: {
                        type: "demo.center",
                        ref: function (_ref) {
                            center = _ref;
                        }
                    }
                }
            }
        }
    }
});
$.shortcut("demo.main", Demo.Main);