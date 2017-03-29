/**
 * Created by User on 2017/3/29.
 */
Demo.FilterPane = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-filter-pane"
    },

    _createFilter: function () {
        var filter = BI.createWidget({
            type: "bi.filter",
            width: 600,
            height: 300,
            itemCreator: function(item){
                if(item.value === BICst.FILTER_TYPE.EMPTY_CONDITION || item.value === BICst.FILTER_TYPE.EMPTY_FORMULA){
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
        }
    }
});
BI.shortcut("demo.filter_pane", Demo.FilterPane);