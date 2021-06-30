/**
 * Created by zcf_1 on 2017/5/2.
 */
BI.MultiSelectInsertNoBarList = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectInsertNoBarList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-insert-list",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            searcherHeight: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
        });
    },
    _init: function () {
        BI.MultiSelectInsertNoBarList.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        this.storeValue = {
            type: BI.Selection.Multi,
            value: o.value || []
        };

        var assertShowValue = function () {
            BI.isKey(self._startValue) && (self.storeValue.type === BI.Selection.All ? BI.remove(self.storeValue.value, self._startValue) : BI.pushDistinct(self.storeValue.value, self._startValue));
            // self.trigger.setValue(self.storeValue);
        };

        this.adapter = BI.createWidget({
            type: "bi.multi_select_no_bar_loader",
            cls: "popup-multi-select-list bi-border-left bi-border-right bi-border-bottom",
            itemsCreator: o.itemsCreator,
            itemHeight: o.itemHeight,
            valueFormatter: o.valueFormatter,
            logic: {
                dynamic: false
            },
            // onLoaded: o.onLoaded,
            el: {},
            value: {
                type: BI.Selection.Multi,
                value: o.value || []
            }
        });
        this.adapter.on(BI.MultiSelectLoader.EVENT_CHANGE, function () {
            self.storeValue = this.getValue();
            assertShowValue();
            self.fireEvent(BI.MultiSelectInsertNoBarList.EVENT_CHANGE);
        });

        this.searcherPane = BI.createWidget({
            type: "bi.multi_select_search_insert_pane",
            cls: "bi-border-left bi-border-right bi-border-bottom",
            valueFormatter: o.valueFormatter,
            keywordGetter: function () {
                return self.trigger.getKeyword();
            },
            itemsCreator: function (op, callback) {
                var keyword = self.trigger.getKeyword();
                if (BI.isNotEmptyString(keyword)) {
                    op.keywords = [keyword];
                    this.setKeyword(op.keywords[0]);
                    o.itemsCreator(op, callback);
                }
            },
        });
        this.searcherPane.setVisible(false);

        this.trigger = BI.createWidget({
            type: "bi.searcher",
            el: {
                type: "bi.select_patch_editor",
                el: {
                    type: "bi.search_editor",
                    watermark: BI.i18nText("BI-Basic_Search_And_Patch_Paste"),
                },
                ref: function (ref) {
                    self.editor = ref;
                },
                height: o.searcherHeight
            },
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            adapter: this.adapter,
            popup: this.searcherPane,
            height: 200,
            masker: false,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    self._setStartValue("");
                    this.setValue(BI.deepClone(self.storeValue));
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    self._setStartValue("");
                    self.adapter.setValue(self.storeValue);
                    // 需要刷新回到初始界面，否则搜索的结果不能放在最前面
                    self.adapter.populate();
                }
            }, {
                eventName: BI.Searcher.EVENT_PAUSE,
                action: function () {
                    var keyword = this.getKeyword();
                    self._join({
                        type: BI.Selection.Multi,
                        value: [keyword]
                    }, function () {
                        if (self.storeValue.type === BI.Selection.Multi) {
                            BI.pushDistinct(self.storeValue.value, keyword);
                        }
                        self._showAdapter();
                        self.adapter.setValue(self.storeValue);
                        self._setStartValue(keyword);
                        assertShowValue();
                        self.adapter.populate();
                        self._setStartValue("");
                        self.fireEvent(BI.MultiSelectInsertNoBarList.EVENT_CHANGE);
                    });
                }
            }, {
                eventName: BI.Searcher.EVENT_SEARCHING,
                action: function () {
                    var keywords = self._getKeywords();
                    var last = BI.last(keywords);
                    keywords = BI.initial(keywords || []);
                    if (keywords.length > 0) {
                        self._joinKeywords(keywords, function () {
                            if (BI.endWith(last, BI.BlankSplitChar)) {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                                self.adapter.populate();
                                self._setStartValue("");
                            } else {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                            }
                            self.fireEvent(BI.MultiSelectInsertNoBarList.EVENT_CHANGE);
                        });
                    }
                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function (value, obj) {
                    if (obj instanceof BI.MultiSelectBar) {
                        self._joinAll(this.getValue(), function () {
                            assertShowValue();
                            self.fireEvent(BI.MultiSelectInsertNoBarList.EVENT_CHANGE);
                        });
                    } else {
                        self._join(this.getValue(), function () {
                            assertShowValue();
                            self.fireEvent(BI.MultiSelectInsertNoBarList.EVENT_CHANGE);
                        });
                    }
                }
            }],
            value: {
                type: BI.Selection.Multi,
                value: o.value || []
            }
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.trigger,
                height: o.searcherHeight
            }, {
                el: this.adapter,
                height: "fill"
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.searcherPane,
                top: o.searcherHeight,
                bottom: 0,
                left: 0,
                right: 0
            }]
        });
    },

    _getKeywords: function () {
        var val = this.editor.getValue();
        var keywords = val.split(/\u200b\s\u200b/);
        if (BI.isEmptyString(keywords[keywords.length - 1])) {
            keywords = keywords.slice(0, keywords.length - 1);
        }
        if (/\u200b\s\u200b$/.test(val)) {
            return keywords.concat([BI.BlankSplitChar]);
        }

        return keywords;
    },

    _showAdapter: function () {
        this.adapter.setVisible(true);
        this.searcherPane.setVisible(false);
    },

    _showSearcherPane: function () {
        this.searcherPane.setVisible(true);
        this.adapter.setVisible(false);
    },

    _defaultState: function () {
        this.trigger.stopEditing();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        // 和复选下拉框同步，allData做缓存是会爆炸的
        digest();

        function digest (items) {
            BI.each(keywords, function (i, val) {
                self.storeValue.type === BI.Selection.Multi ? BI.pushDistinct(self.storeValue.value, val) : BI.remove(self.storeValue.value, val);
            });
            callback();
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        o.itemsCreator({
            type: BI.MultiSelectInsertNoBarList.REQ_GET_ALL_DATA,
            keywords: [self.trigger.getKeyword()]
        }, function (ob) {
            var items = BI.map(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                callback();
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            callback();
        });
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    BI.pushDistinct(self.storeValue.value, v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            callback();
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.adapter.setStartValue(value);
    },

    isAllSelected: function () {
        return this.adapter.isAllSelected();
    },

    resize: function () {
        // this.trigger.getCounter().adjustView();
        // this.trigger.adjustView();
    },
    setValue: function (v) {
        this.storeValue = {
            type: BI.Selection.Multi,
            value: v || []
        };
        this.adapter.setValue(this.storeValue);
        this.trigger.setValue(this.storeValue);
    },

    getValue: function () {
        return BI.deepClone(this.storeValue.value);
    },

    populate: function () {
        this.adapter.populate.apply(this.adapter, arguments);
        this.trigger.populate.apply(this.trigger, arguments);
    }
});

BI.extend(BI.MultiSelectInsertNoBarList, {
    REQ_GET_DATA_LENGTH: 1,
    REQ_GET_ALL_DATA: -1
});

BI.MultiSelectInsertNoBarList.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_insert_no_bar_list", BI.MultiSelectInsertNoBarList);