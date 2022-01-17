/**
 * 单选加载数据面板
 * Created by guy on 15/11/2.
 * @class BI.SingleSelectLoader
 * @extends Widget
 */
BI.SingleSelectLoader = BI.inherit(BI.Widget, {

    _constants: {
        itemVgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-loader",
            logic: {
                dynamic: true
            },
            el: {
                height: 400
            },
            allowNoSelect: false,
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;
        this.storeValue = opts.value;
        this.button_group = BI.createWidget({
            type: "bi.single_select_list",
            allowNoSelect: opts.allowNoSelect,
            logic: opts.logic,
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
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
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
                !BI.isUndefined(self.storeValue) && (op = BI.extend(op || {}, {
                    selectedValues: [self.storeValue]
                }));
                opts.itemsCreator(op, function (ob) {
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && !BI.isUndefined(self.storeValue)) {
                        var json = BI.map([self.storeValue], function (i, v) {
                            var txt = opts.valueFormatter(v) || v;
                            return {
                                text: txt,
                                value: v,
                                title: txt,
                                selected: true
                            };
                        });
                        firstItems = self._createItems(json);
                    }
                    callback(firstItems.concat(self._createItems(ob.items)), ob.keyword || "");
                    if (op.times === 1 && self.storeValue) {
                        BI.isKey(startValue) && (self.storeValue = startValue);
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

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.button_group],
            vgap: this._constants.itemVgap
        });

        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SingleSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        var o = this.options;
        return BI.map(items, function (i, item) {
            return BI.extend({
                type: o.allowNoSelect ? "bi.single_select_item" : "bi.single_select_radio_item",
                logic: o.logic,
                cls: "bi-list-item-active",
                height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
                selected: false,
                iconWrapperWidth: 26,
                hgap: o.allowNoSelect ? 10 : 0,
                title: item.title || item.text
            }, item);
        });
    },

    _scrollToTop: function () {
        var self = this;
        BI.delay(function () {
            self.button_group.element.scrollTop(0);
        }, 30);
    },

    _assertValue: function (val) {
    },

    setStartValue: function (v) {
        this._startValue = v;
    },

    setValue: function (v) {
        this.storeValue = v;
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
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h - this._constants.itemVgap * 2);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.SingleSelectLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_select_loader", BI.SingleSelectLoader);
