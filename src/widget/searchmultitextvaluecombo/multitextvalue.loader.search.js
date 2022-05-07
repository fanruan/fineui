/**
 * 多选加载数据面板
 * Created by guy on 15/11/2.
 * @class BI.SearchMultiSelectLoader
 * @extends Widget
 */
BI.SearchMultiSelectLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SearchMultiSelectLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-loader",
            logic: {
                dynamic: true
            },
            el: {
                height: 400
            },
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            itemHeight: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.SearchMultiSelectLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;

        this.storeValue = opts.value || {};
        this._assertValue(this.storeValue);

        this.button_group = BI.createWidget({
            type: "bi.select_list",
            element: this,
            logic: opts.logic,
            toolbar: {
                type: "bi.multi_select_bar",
                cls: "bi-list-item-active",
                height: this.options.itemHeight,
                iconWrapperWidth: 36
            },
            el: BI.extend({
                onLoaded: opts.onLoaded,
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
            }, opts.el),
            itemsCreator: function (op, callback) {
                var startValue = self._startValue;
                self.storeValue && (op = BI.extend(op || {}, {
                    selectedValues: BI.isKey(startValue) && self.storeValue.type === BI.Selection.Multi
                        ? self.storeValue.value.concat(startValue) : self.storeValue.value
                }));
                opts.itemsCreator(op, function (ob) {
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && self.storeValue) {
                        var json = BI.map(self.storeValue.value, function (i, v) {
                            var txt = opts.valueFormatter(v) || v;
                            return {
                                text: txt,
                                value: v,
                                title: txt,
                                selected: self.storeValue.type === BI.Selection.Multi
                            };
                        });
                        if (BI.isKey(self._startValue) && !BI.contains(self.storeValue.value, self._startValue)) {
                            var txt = opts.valueFormatter(startValue) || startValue;
                            json.unshift({
                                text: txt,
                                value: startValue,
                                title: txt,
                                selected: true
                            });
                        }
                        firstItems = self._createItems(json);
                    }
                    callback(firstItems.concat(self._createItems(ob.items)), ob.keyword || "");
                    if (op.times === 1 && self.storeValue) {
                        BI.isKey(startValue) && (self.storeValue.type === BI.Selection.All ? BI.remove(self.storeValue.value, startValue) : BI.pushDistinct(self.storeValue.value, startValue));
                        self.setValue(self.storeValue);
                    }
                    (op.times === 1) && self._scrollToTop();
                });
            },
            hasNext: function () {
                return hasNext;
            },
            value: this.storeValue
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.SearchMultiSelectLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            logic: this.options.logic,
            cls: "bi-list-item-active",
            height: this.options.itemHeight,
            selected: this.isAllSelected(),
            iconWrapperWidth: 36
        });
    },

    _scrollToTop: function () {
        var self = this;
        BI.delay(function () {
            self.button_group.element.scrollTop(0);
        }, 30);
    },

    isAllSelected: function () {
        return this.button_group.isAllSelected();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    setStartValue: function (v) {
        this._startValue = v;
    },

    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.button_group.setValue(this.storeValue);
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
        if (BI.isNotNull(items)) {
            arguments[0] = this._createItems(items);
        }
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.SearchMultiSelectLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.search_multi_select_loader", BI.SearchMultiSelectLoader);