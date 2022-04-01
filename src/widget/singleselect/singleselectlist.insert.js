/**
 * @author: Teller
 * @createdAt: 2018/3/28
 * @Description
*/
BI.SingleSelectInsertList = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectInsertList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-insert-list",
            allowNoSelect: false,
            itemsCreator: BI.emptyFn,
            itemWrapper: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            searcherHeight: 24,
        });
    },
    _init: function () {
        BI.SingleSelectInsertList.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        this.storeValue = o.value;

        var assertShowValue = function () {
            BI.isKey(self._startValue) && (self.storeValue = self._startValue);
            // self.trigger.setValue(self.storeValue);
        };

        this.adapter = BI.createWidget({
            type: "bi.single_select_loader",
            allowNoSelect: o.allowNoSelect,
            cls: "popup-single-select-list bi-border-left bi-border-right bi-border-bottom",
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            itemWrapper: o.itemWrapper,
            logic: {
                dynamic: true
            },
            // onLoaded: o.onLoaded,
            el: {},
            value: o.value
        });
        this.adapter.on(BI.SingleSelectLoader.EVENT_CHANGE, function () {
            self.storeValue = this.getValue();
            assertShowValue();
            self.fireEvent(BI.SingleSelectInsertList.EVENT_CHANGE);
        });

        this.searcherPane = BI.createWidget({
            type: "bi.single_select_search_insert_pane",
            allowNoSelect: o.allowNoSelect,
            cls: "bi-border-left bi-border-right bi-border-bottom",
            valueFormatter: o.valueFormatter,
            keywordGetter: function () {
                return self.trigger.getKeyword();
            },
            itemsCreator: function (op, callback) {
                op.keywords = [self.trigger.getKeyword()];
                this.setKeyword(op.keywords[0]);
                o.itemsCreator(op, callback);
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
                height: o.searcherHeight,
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
            value: o.value,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    self._setStartValue();
                    this.setValue(BI.deepClone(self.storeValue));
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    self._setStartValue();
                    self.adapter.setValue(self.storeValue);
                    // 需要刷新回到初始界面，否则搜索的结果不能放在最前面
                    self.adapter.populate();
                }
            }, {
                eventName: BI.Searcher.EVENT_PAUSE,
                action: function () {
                    var keyword = this.getKeyword();
                    self.storeValue = keyword;
                    self._showAdapter();
                    self.adapter.setValue(self.storeValue);
                    self._setStartValue(keyword);
                    assertShowValue();
                    self.adapter.populate();
                    self._setStartValue();
                    self.fireEvent(BI.SingleSelectInsertList.EVENT_CHANGE);

                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function () {
                    self.storeValue = this.getValue();
                    self.fireEvent(BI.SingleSelectInsertList.EVENT_CHANGE);
                }
            }]
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.trigger,
                height: 24
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
                top: 24,
                bottom: 0,
                left: 0,
                right: 0
            }]
        });
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

    _assertValue: function () {},

    _makeMap: function (values) {
        return BI.makeObject(values || []);
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
        this.storeValue = v;
        this.adapter.setValue(this.storeValue);
        this.trigger.setValue(this.storeValue);
    },

    getValue: function () {
        return BI.deepClone(this.storeValue);
    },

    populate: function () {
        this._count = null;
        this._allData = null;
        this.adapter.populate.apply(this.adapter, arguments);
        this.trigger.populate.apply(this.trigger, arguments);
    }
});

BI.extend(BI.SingleSelectInsertList, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.SingleSelectInsertList.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_select_insert_list", BI.SingleSelectInsertList);
