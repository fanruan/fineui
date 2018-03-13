Demo.West = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-west bi-border-right bi-card"
    },
    mounted: function () {
        this.searcher.setAdapter(this.tree);
    },
    render: function () {
        var self = this;
        return {
            type: "bi.vtape",
            items: [{
                type: "bi.center_adapt",
                items: [{
                    type: "bi.searcher",
                    el: {
                        type: "bi.search_editor",
                        watermark: "简单搜索"
                    },
                    width: 200,
                    isAutoSearch: false,
                    isAutoSync: false,
                    ref: function (ref) {
                        self.searcher = ref;
                    },
                    popup: {
                        type: "bi.multilayer_single_level_tree",
                        cls: "bi-card",
                        listeners: [{
                            eventName: BI.MultiLayerSingleLevelTree.EVENT_CHANGE,
                            action: function (v) {
                                self.fireEvent(Demo.West.EVENT_VALUE_CHANGE, v);
                            }
                        }]
                    },
                    onSearch: function (op, callback) {
                        var result = BI.Func.getSearchResult(Demo.CONFIG, op.keyword, "text");
                        var items = result.match.concat(result.find);
                        callback(items);
                    }
                }],
                height: 40
            }, {
                type: "bi.multilayer_single_level_tree",
                listeners: [{
                    eventName: BI.MultiLayerSingleLevelTree.EVENT_CHANGE,
                    action: function (v) {
                        self.fireEvent(Demo.West.EVENT_VALUE_CHANGE, v);
                    }
                }],
                items: Demo.CONFIG,
                ref: function (ref) {
                    self.tree = ref;
                }
            }]
        };
    }
});
Demo.West.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
BI.shortcut("demo.west", Demo.West);