Demo.Main = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-main bi-background"
    },

    _store: function () {
        return BI.Stores.getStore("demo.store.main");
    },

    beforeInit: function (cb) {
        this.store.init(cb);
    },

    render: function () {
        var self = this;
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
                                self.store.handleTreeSelectChange(v);
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
                                self.store.handleTreeSelectChange(v);
                            }
                        }]
                    }
                },
                center: {
                    el: {
                        type: "demo.center",
                        ref: function (_ref) {
                            self.center = _ref;
                        }
                    }
                }
            }
        };
    }
});
BI.shortcut("demo.main", Demo.Main);