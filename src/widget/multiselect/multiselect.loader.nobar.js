/**
 * 多选加载数据面板
 * Created by guy on 15/11/2.
 * @class BI.MultiSelectNoBarLoader
 * @extends Widget
 */
BI.MultiSelectNoBarLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectNoBarLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-loader",
            logic: {
                dynamic: true
            },
            el: {
                height: 400
            },
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            itemHeight: 24,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectNoBarLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;

        this.storeValue = opts.value || {};
        this._assertValue(this.storeValue);

        this.button_group = BI.createWidget(BI.extend({
            type: "bi.list_pane",
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
            },
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
        }, opts.el));

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.button_group],
            vgap: 5
        });

        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectNoBarLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            cls: "bi-list-item-active",
            logic: this.options.logic,
            height: this.options.itemHeight,
            iconWrapperWidth: 36
        });
    },

    _scrollToTop: function () {
        var self = this;
        BI.delay(function () {
            self.button_group.element.scrollTop(0);
        }, 30);
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
        this.button_group.setValue(this.storeValue.value);
    },

    getValue: function () {
        return {
            type: BI.Selection.Multi,
            value: this.button_group.getValue()
        };
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        arguments[0] = this._createItems(items);
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.element.css({"max-height": h + "px"});
    },

    resetWidth: function () {

    }
});

BI.MultiSelectNoBarLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_no_bar_loader", BI.MultiSelectNoBarLoader);