/**
 * Created by User on 2017/3/22.
 */
Demo.MultiSelectList = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-multi-select-combo"
    },

    mounted: function () {
        this.list.populate();
    },

    _createMultiSelectCombo: function () {
        var self = this;
        var widget = BI.createWidget({
            type: "bi.multi_select_insert_list",
            ref: function (ref) {
                self.list = ref;
            },
            itemsCreator: BI.bind(this._itemsCreator, this),
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
        for (var i = (times - 1) * 10; items[i] && i < times * 10; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * 10 < items.length;
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

    render: function () {
        return {
            type: "bi.absolute",
            scrolly: false,
            items: [{
                el: this._createMultiSelectCombo(),
                top: 50,
                left: 50,
                right: 50,
                bottom: 50
            }]
        };
    }
});
BI.shortcut("demo.multi_select_list", Demo.MultiSelectList);