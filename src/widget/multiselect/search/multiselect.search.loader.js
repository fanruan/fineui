/**
 * 多选加载数据搜索loader面板
 * Created by guy on 15/11/4.
 * @class BI.MultiSelectSearchLoader
 * @extends Widget
 */
BI.MultiSelectSearchLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearchLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-search-loader",
            itemsCreator: BI.emptyFn,
            keywordGetter: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            itemHeight: 24
        });
    },

    _init: function () {
        BI.MultiSelectSearchLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;
        this.storeValue = BI.deepClone(opts.value);
        this.button_group = BI.createWidget({
            type: "bi.select_list",
            toolbar: {
                type: "bi.multi_select_bar",
                cls: "bi-list-item-active",
                iconWrapperWidth: 36
            },
            element: this,
            logic: {
                dynamic: false
            },
            value: opts.value,
            el: {
                tipText: BI.i18nText("BI-No_Select"),
                el: {
                    type: "bi.loader",
                    isDefaultInit: false,
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            },
            itemsCreator: function (op, callback) {
                self.storeValue && (op = BI.extend(op || {}, {
                    selectedValues: self.storeValue.value
                }));
                opts.itemsCreator(op, function (ob) {
                    var keyword = ob.keyword = opts.keywordGetter();
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && self.storeValue) {
                        var json = self._filterValues(self.storeValue);
                        firstItems = self._createItems(json);
                    }
                    var context = {
                        tipText: ob.tipText,
                    };
                    callback(firstItems.concat(self._createItems(ob.items)), keyword, context);
                    if (op.times === 1 && self.storeValue) {
                        self.setValue(self.storeValue);
                    }
                });
            },
            hasNext: function () {
                return hasNext;
            }
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectSearchLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            logic: {
                dynamic: false
            },
            height: this.options.itemHeight || BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            selected: this.isAllSelected(),
            cls: "bi-list-item-active",
            iconWrapperWidth: 36
        });
    },

    isAllSelected: function () {
        return this.button_group.isAllSelected();
    },

    _filterValues: function (src) {
        var o = this.options;
        var keyword = o.keywordGetter();
        var values = BI.deepClone(src.value) || [];
        var newValues = BI.map(values, function (i, v) {
            return {
                text: o.valueFormatter(v) || v,
                value: v
            };
        });
        if (BI.isKey(keyword)) {
            var search = BI.Func.getSearchResult(newValues, keyword);
            values = search.match.concat(search.find);
        }
        return BI.map(values, function (i, v) {
            return {
                text: v.text,
                title: v.text,
                value: v.value,
                selected: src.type === BI.Selection.All
            };
        });
    },

    setValue: function (v) {
        // 暂存的值一定是新的值，不然v改掉后，storeValue也跟着改了
        this.storeValue = BI.deepClone(v);
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.MultiSelectSearchLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_search_loader", BI.MultiSelectSearchLoader);