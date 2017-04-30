Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var items = [{
            type: "bi.label",
            value: "张三"
        }, {
            type: "bi.label",
            value: "李四"
        }];
        var popup = BI.createWidget({
            type: "bi.button_group",
            cls: "bi-border",
            items: items,
            layouts: [{
                type: "bi.vertical"
            }]
        });
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.searcher",
                    listeners: [{
                        eventName: BI.Searcher.EVENT_STOP,
                        action: function () {
                            popup.populate(items)
                        }
                    }, {
                        eventName: BI.Searcher.EVENT_PAUSE,
                        action: function () {
                            popup.populate(items)
                        }
                    }],
                    adapter: {
                        getItems: function () {
                            return items
                        }
                    },
                    popup: popup,
                    masker: false
                },
                left: 0,
                right: 0,
                top: 0
            }, {
                el: popup,
                left: 0,
                right: 0,
                top: 50,
                bottom: 0
            }]
        }
    }
});
BI.shortcut("demo.searcher", Demo.Func);