Demo.Filter = BI.inherit(BI.Widget, {
    props: {},
    _createFilter: function () {
        var filter = BI.createWidget({
            type: "bi.filter",
            width: 600,
            height: 300,
            items: [{
                id: "3beb41be9c67d80d",
                value: 81,
                children: [{
                    id: 1,
                    type: "bi.label",
                    value: "节点1"
                }, {
                    id: "74cf470c15a7cb23",
                    value: 80,
                    children: [{
                        id: 2,
                        type: "bi.label",
                        value: "节点2"
                    }, {
                        id: 3,
                        type: "bi.label",
                        value: "节点3"
                    }]
                }, {
                    id: 4,
                    type: "bi.label",
                    value: "节点4"
                }]
            }],
            itemCreator: function (item) {
                if(item.value === BI.Filter.FILTER_TYPE.EMPTY_FORMULA || item.value === BI.Filter.FILTER_TYPE.EMPTY_CONDITION) {
                    item.type = "bi.label";
                    item.value = "这是一个新添的数据";
                }
            }
        });

        return filter;
    },

    render: function () {

        var filter = this._createFilter();

        return {
            type: "bi.vertical",
            hgap: 30,
            vgap: 20,
            items: [{
                el: filter
            }, {
                type: "bi.button",
                text: "过滤结构getValue()",
                height: 30,
                handler: function () {
                    BI.Msg.alert("过滤结构", JSON.stringify(filter.getValue()));
                }
            }]
        };
    }
});
BI.shortcut("demo.filter", Demo.Filter);