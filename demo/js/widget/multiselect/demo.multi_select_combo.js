/**
 * Created by User on 2017/3/22.
 */
Demo.MultiSelectCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-multi-select-combo"
    },

    _createMultiSelectCombo: function () {
        var self = this;
        var widget = BI.createWidget({
            type: "bi.multi_select_insert_combo",
            //itemsCreator: BI.bind(this._itemsCreator, this),
            width: 200,
            value: {
                type: 1,
                value: ["柳州市城贸金属材料有限责任公司", "柳州市建福房屋租赁有限公司", "柳州市迅昌数码办公设备有限责任公司"]
            }
        });

        widget.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            BI.Msg.toast(JSON.stringify(this.getValue()));
        });

        return widget;
    },

    _getItemsByTimes: function (items, times) {
        var res = [];
        for (var i = (times - 1) * 100; items[i] && i < times * 100; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * 100 < items.length;
    },

    _itemsCreator: function (options, callback) {
        var self = this;
        var items = Demo.CONSTANTS.ITEMS;
        var keywords = (options.keywords || []).slice();
        if (options.keyword) {
            keywords.push(options.keyword);
        }
        BI.each(keywords, function (i, kw) {
            var search = BI.Func.getSearchResult(items, kw);
            items = search.match.concat(search.find);
        });
        if (options.selectedValues) {// 过滤
            var filter = BI.makeObject(options.selectedValues, true);
            items = BI.filter(items, function (i, ob) {
                return !filter[ob.value];
            });
        }
        if (options.type == BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
            callback({
                items: items
            });
            return;
        }
        if (options.type == BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
            callback({count: items.length});
            return;
        }
        BI.delay(function () {
            callback({
                items: self._getItemsByTimes(items, options.times),
                hasNext: self._hasNextByTimes(items, options.times)
            });
        }, 1000);
    },

    _createTreeCombo: function () {
        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.multi_tree_combo",
            itemsCreator: function (options, callback) {
                // 根据不同的类型处理相应的结果
                switch (options.type) {
                    case BI.TreeView.REQ_TYPE_INIT_DATA:
                        break;
                    case BI.TreeView.REQ_TYPE_ADJUST_DATA:
                        break;
                    case BI.TreeView.REQ_TYPE_SELECT_DATA:
                        break;
                    case BI.TreeView.REQ_TYPE_GET_SELECTED_DATA:
                        break;
                    default :
                        break;
                }
                callback({
                    items: items
                });
            },
            width: 200,
            value: {
                "根目录": {}
            }
        };
    },

    render: function () {
        return {
            type: "bi.absolute",
            scrolly: false,
            items: [{
                el: this._createMultiSelectCombo(),
                right: "40%",
                top: 200
            }, {
                el: this._createTreeCombo(),
                right: "60%",
                top: 200
            }]
        };
    }
});
BI.shortcut("demo.multi_select_combo", Demo.MultiSelectCombo);