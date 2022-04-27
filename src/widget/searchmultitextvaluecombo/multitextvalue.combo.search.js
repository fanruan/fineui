/**
 *
 * @class BI.SearchMultiTextValueCombo
 * @extends BI.Single
 */
BI.SearchMultiTextValueCombo = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.SearchMultiTextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-combo bi-search-multi-text-value-combo",
            height: 24,
            items: []
        });
    },

    _init: function () {
        var self = this, o = this.options;
        BI.SearchMultiTextValueCombo.superclass._init.apply(this, arguments);
        var assertShowValue = function () {
            BI.isKey(self._startValue) && (self.storeValue.type === BI.Selection.All ? BI.remove(self.storeValue.value, self._startValue) : BI.pushDistinct(self.storeValue.value, self._startValue));
            self._updateAllValue();
            self._checkError();
            self.trigger.getSearcher().setState(self.storeValue);
            self.trigger.getCounter().setButtonChecked(self.storeValue);
        };
        this.storeValue = BI.deepClone(o.value || {});
        this._updateAllValue();

        this._assertValue(this.storeValue);
        this._checkError();

        // 标记正在请求数据
        this.requesting = false;

        this.trigger = BI.createWidget({
            type: "bi.search_multi_select_trigger",
            text: o.text,
            height: o.height - 2,
            // adapter: this.popup,
            masker: {
                offset: {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT + 1,
                },
            },
            allValueGetter: function () {
                return self.allValue;
            },
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                self._itemsCreator(op, function (res) {
                    if (op.times === 1 && BI.isNotNull(op.keywords)) {
                        // 预防trigger内部把当前的storeValue改掉
                        self.trigger.setValue(BI.deepClone(self.getValue()));
                    }
                    callback.apply(self, arguments);
                });
            },
            value: this.storeValue,
            warningTitle: o.warningTitle
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_START, function () {
            self._setStartValue("");
            this.getSearcher().setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_STOP, function () {
            self._setStartValue("");
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_SEARCHING, function (keywords) {
            var last = BI.last(keywords);
            keywords = BI.initial(keywords || []);
            if (keywords.length > 0) {
                self._joinKeywords(keywords, function () {
                    if (BI.endWith(last, BI.BlankSplitChar)) {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                        self.combo.populate();
                        self._setStartValue("");
                    } else {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                    }
                    self._dataChange = true;
                });
            }
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_CHANGE, function (value, obj) {
            if (obj instanceof BI.MultiSelectBar) {
                self._joinAll(this.getValue(), function () {
                    assertShowValue();
                });
            } else {
                self._join(this.getValue(), function () {
                    assertShowValue();
                });
            }
            self._dataChange = true;
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW, function () {
            this.getCounter().setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            cls: "bi-border bi-border-radius",
            toggle: false,
            container: o.container,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: "bi.search_multi_select_popup_view",
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.MultiSelectPopupView.EVENT_CHANGE,
                    action: function () {
                        self._dataChange = true;
                        self.storeValue = this.getValue();
                        self._adjust(function () {
                            assertShowValue();
                        });
                    }
                }, {
                    eventName: BI.MultiSelectPopupView.EVENT_CLICK_CONFIRM,
                    action: function () {
                        self._defaultState();
                    }
                }, {
                    eventName: BI.MultiSelectPopupView.EVENT_CLICK_CLEAR,
                    action: function () {
                        self._dataChange = true;
                        self.setValue();
                        self._defaultState();
                    }
                }],
                itemsCreator: BI.bind(self._itemsCreator, this),
                valueFormatter: o.valueFormatter,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.combo.adjustWidth();
                        self.combo.adjustHeight();
                        self.trigger.getCounter().adjustView();
                        self.trigger.getSearcher().adjustView();
                    });
                }
            },
            value: o.value,
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
            }
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            if (!this.isViewVisible()) {
                self._dataChange = false;// 标记数据是否发生变化
            }
            this.setValue(self.storeValue);
            BI.nextTick(function () {
                self._populate();
            });
        });
        // 当退出的时候如果还在处理请求，则等请求结束后再对外发确定事件
        this.wants2Quit = false;
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            // important:关闭弹出时又可能没有退出编辑状态
            self.trigger.stopEditing();
            if (self.requesting === true) {
                self.wants2Quit = true;
            } else {
                /**
                 * 在存在标红的情况，如果popover没有发生改变就确认需要同步trigger的值，否则对外value值和trigger样式不统一
                 */
                assertShowValue();
                self._dataChange && self.fireEvent(BI.SearchMultiTextValueCombo.EVENT_CONFIRM);
            }
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "multi-select-trigger-icon-button"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            self.trigger.getCounter().hideView();
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this._checkError();
    },

    _defaultState: function () {
        this.trigger.stopEditing();
        this.combo.hideView();
    },

    _assertValue: function (val) {
        var o = this.options;
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
        BI.remove(val.value, function (idx, value) {
            return !BI.contains(BI.map(o.items, "value"), value);
        });
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        this.requesting = true;
        this._itemsCreator({
            type: BI.SearchMultiTextValueCombo.REQ_GET_ALL_DATA,
            keywords: keywords
        }, function (ob) {
            var values = BI.map(ob.items, "value");
            digest(values);
        });

        function digest (items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.type === BI.Selection.Multi ? BI.pushDistinct(self.storeValue.value, val) : BI.remove(self.storeValue.value, val);
                }
            });
            self._adjust(callback);
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this.requesting = true;
        this._itemsCreator({
            type: BI.SearchMultiTextValueCombo.REQ_GET_ALL_DATA,
            keywords: [this.trigger.getKey()]
        }, function (ob) {
            var items = BI.map(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        self.storeValue.assist && self.storeValue.assist.push(map[v]);
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                self._adjust(callback);
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    self.storeValue.assist && self.storeValue.assist.push(selectedMap[items[i]]);
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    BI.remove(self.storeValue.assist, item);
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            self._adjust(callback);
        });
    },

    _adjust: function (callback) {
        var self = this, o = this.options;
        if (!this._count) {
            this._itemsCreator({
                type: BI.SearchMultiTextValueCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                self._count = res.count;
                adjust();
                callback();
            });
        } else {
            adjust();
            callback();

        }

        function adjust () {
            if (self.storeValue.type === BI.Selection.All && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.Multi,
                    value: []
                };
            } else if (self.storeValue.type === BI.Selection.Multi && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.All,
                    value: []
                };
            }
            self._updateAllValue();
            self._checkError();
            if (self.wants2Quit === true) {
                self._dataChange && self.fireEvent(BI.SearchMultiTextValueCombo.EVENT_CONFIRM);
                self.wants2Quit = false;
            }
            self.requesting = false;
        }
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    BI.remove(self.storeValue.assist, v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    self.storeValue.assist && self.storeValue.assist.push(map[v]);
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            self._adjust(callback);
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.popup.setStartValue(value);
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
        var self = this, o = this.options;
        var items = o.items;
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
        callback({
            items: self._getItemsByTimes(items, options.times),
            hasNext: self._hasNextByTimes(items, options.times)
        });
    },

    _checkError: function () {
        var v = this.storeValue.value || [];
        if(BI.isNotEmptyArray(v)) {
            v = BI.isArray(v) ? v : [v];
            var result = BI.find(this.allValue, function (idx, value) {
                return !BI.contains(v, value);
            });
            if (BI.isNull(result)) {
                BI.isNotNull(this.trigger) && (this.trigger.setTipType("success"));
                this.element.removeClass("combo-error");
            } else {
                BI.isNotNull(this.trigger) && (this.trigger.setTipType("warning"));
                this.element.addClass("combo-error");
            }
        } else {
            if(v.length === this.allValue.length){
                BI.isNotNull(this.trigger) && (this.trigger.setTipType("success"));
                this.element.removeClass("combo-error");
            }else {
                BI.isNotNull(this.trigger) && (this.trigger.setTipType("warning"));
                this.element.addClass("combo-error");
            }
        }
    },

    _updateAllValue: function () {
        this.storeValue = this.storeValue || {};
        this.allValue = BI.deepClone(this.storeValue.value || []);
    },

    setValue: function (v) {
        this.storeValue = BI.deepClone(v || {});
        this._updateAllValue();
        this._assertValue(this.storeValue);
        this.combo.setValue(this.storeValue);
        this._checkError();
    },

    getValue: function () {
        return BI.deepClone(this.storeValue);
    },

    _populate: function () {
        this._count = null;
        this.combo.populate();
    },

    populate: function (items) {
        this.options.items = items;
        this._populate();
    }
});

BI.extend(BI.SearchMultiTextValueCombo, {
    REQ_GET_DATA_LENGTH: 1,
    REQ_GET_ALL_DATA: -1
});

BI.SearchMultiTextValueCombo.EVENT_CONFIRM = "EVENT_CONFIRM";

BI.shortcut("bi.search_multi_text_value_combo", BI.SearchMultiTextValueCombo);
