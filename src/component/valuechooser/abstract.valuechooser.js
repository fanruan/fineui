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
        if (this.options.valueFormatter) {
            return this.options.valueFormatter(v);
        }
        if (BI.isNotNull(this.items)) {
            BI.some(this.items, function (i, item) {
                // 把value都换成字符串
                if (item.value === v || item.value + "" === v) {
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
            var resultItems = items;
            if(BI.isNotEmptyArray(keywords)) {
                resultItems = [];
                BI.each(keywords, function (i, kw) {
                    var search = BI.Func.getSearchResult(items, kw);
                    resultItems = resultItems.concat(search.match).concat(search.find);
                });
                resultItems = BI.uniq(resultItems);
            }
            if (options.selectedValues) {// 过滤
                var filter = BI.makeObject(options.selectedValues, true);
                resultItems = BI.filter(resultItems, function (i, ob) {
                    return !filter[ob.value];
                });
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
                callback({
                    items: resultItems
                });
                return;
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
                callback({count: resultItems.length});
                return;
            }
            callback({
                items: self._getItemsByTimes(resultItems, options.times),
                hasNext: self._hasNextByTimes(resultItems, options.times)
            });
        }
    },

    _assertValue: function (v) {
        v = v || {};
        var value = v;
        if (v.type === BI.Selection.Multi && BI.isNotNull(this.items)) {
            var isAllSelect = BI.difference(BI.map(this.items, "value"), v.value).length === 0;
            if (isAllSelect) {
                value = {
                    type: BI.Selection.All,
                    value: [],
                };
            }
        }
        return value;
    },
});