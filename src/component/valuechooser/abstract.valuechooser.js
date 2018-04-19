/**
 * 简单的复选下拉框控件, 适用于数据量少的情况
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AbstractValueChooser
 * @extends BI.Widget
 */
BI.AbstractValueChooser = BI.inherit(BI.Widget, {

    _const: {
        perPage: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AbstractValueChooser.superclass._defaultConfig.apply(this, arguments), {
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _valueFormatter: function (v) {
        var text = v;
        if (BI.isNotNull(this.items)) {
            BI.some(this.items, function (i, item) {
                // 把value都换成字符串
                if (item.value + "" === v) {
                    text = item.text;
                    return true;
                }
            });
        }
        return text;
    },

    _getItemsByTimes: function (items, times) {
        var res = [];
        for (var i = (times - 1) * this._const.perPage; items[i] && i < times * this._const.perPage; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * this._const.perPage < items.length;
    },

    _itemsCreator: function (options, callback) {
        var self = this, o = this.options;
        if (!o.cache || !this.items) {
            o.itemsCreator({}, function (items) {
                self.items = items;
                call(items);
            });
        } else {
            call(this.items);
        }
        function call (items) {
            var keywords = (options.keywords || []).slice();
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
            if (options.type === BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
                callback({
                    items: items
                });
                return;
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
                callback({count: items.length});
                return;
            }
            callback({
                items: self._getItemsByTimes(items, options.times),
                hasNext: self._hasNextByTimes(items, options.times)
            });
        }
    }
});