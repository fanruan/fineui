/**
 * 简单的复选下拉框控件, 适用于数据量少的情况
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.ValueChooserCombo
 * @extends BI.Widget
 */
BI.ValueChooserCombo = BI.inherit(BI.Widget, {

    _const: {
        perPage: 10
    },
    _defaultConfig: function () {
        return BI.extend(BI.ValueChooserCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-value-chooser-combo",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.ValueChooserCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }
        this.combo = BI.createWidget({
            type: 'bi.multi_select_combo',
            element: this.element,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: function (v) {
                var text = v;
                if (BI.isNotNull(self.items)) {
                    BI.some(self.items, function (i, item) {
                        if (item.value === v) {
                            text = item.text;
                            return true;
                        }
                    });
                }
                return text;
            },
            width: o.width,
            height: o.height
        });

        this.combo.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.ValueChooserCombo.EVENT_CONFIRM);
        });
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
        function call(items) {
            var keywords = (options.keywords || []).slice();
            if (options.keyword) {
                keywords.push(options.keyword);
            }
            BI.each(keywords, function (i, kw) {
                var search = BI.Func.getSearchResult(items, kw);
                items = search.matched.concat(search.finded);
            });
            if (options.selected_values) {//过滤
                var filter = BI.makeObject(options.selected_values, true);
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
            callback({
                items: self._getItemsByTimes(items, options.times),
                hasNext: self._hasNextByTimes(items, options.times)
            });
        }
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        var val = this.combo.getValue() || {};
        return {
            type: val.type,
            value: val.value
        }
    },

    populate: function () {
        this.combo.populate.apply(this, arguments);
    }
});
BI.ValueChooserCombo.EVENT_CONFIRM = "ValueChooserCombo.EVENT_CONFIRM";
$.shortcut('bi.value_chooser_combo', BI.ValueChooserCombo);