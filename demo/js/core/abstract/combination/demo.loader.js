Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var self = this;
        this.all = 0;
        var items = BI.deepClone(Demo.CONSTANTS.ITEMS);
        return {
            type: "bi.loader",
            itemsCreator: function (options, populate) {
                setTimeout(function () {
                    populate(BI.map(items.slice((options.times - 1) * 10, options.times * 10), function (i, v) {
                        return BI.extend(v, {
                            type: "bi.single_select_item",
                            height: 25
                        })
                    }))
                }, 1000);
            },
            hasNext: function (options) {
                return options.times * 10 < items.length;
            }
        }
    }
});
BI.shortcut("demo.loader", Demo.Func);