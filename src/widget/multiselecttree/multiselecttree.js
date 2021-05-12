/**
 * Created by zcf_1 on 2017/5/11.
 */
BI.MultiSelectTree = BI.inherit(BI.Single, {
    _constant: {
        EDITOR_HEIGHT: 24
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-tree",
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = {value: {}};

        this.adapter = BI.createWidget({
            type: "bi.multi_select_tree_popup",
            itemsCreator: o.itemsCreator,
            showLine: o.showLine
        });
        this.adapter.on(BI.MultiSelectTreePopup.EVENT_CHANGE, function () {
            if (self.searcher.isSearching()) {
                self.storeValue = {value: self.searcherPane.getValue()};
            } else {
                self.storeValue = {value: self.adapter.getValue()};
            }
            self.setSelectedValue(self.storeValue.value);
            self.fireEvent(BI.MultiSelectTree.EVENT_CHANGE);
        });

        // 搜索中的时候用的是parttree，同adapter中的synctree不一样
        this.searcherPane = BI.createWidget({
            type: "bi.multi_tree_search_pane",
            cls: "bi-border-left bi-border-right bi-border-bottom",
            keywordGetter: function () {
                return self.searcher.getKeyword();
            },
            itemsCreator: function (op, callback) {
                op.keyword = self.searcher.getKeyword();
                o.itemsCreator(op, callback);
            }
        });
        this.searcherPane.setVisible(false);

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback({
                    keyword: self.searcher.getKeyword()
                });
            },
            adapter: this.adapter,
            popup: this.searcherPane,
            masker: false,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    // self.storeValue = {value: self.adapter.getValue()};
                    // self.searcherPane.setSelectedValue(self.storeValue.value);
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    // self.storeValue = {value: self.searcherPane.getValue()};
                    // self.adapter.setSelectedValue(self.storeValue.value);
                    BI.nextTick(function () {
                        self.adapter.populate();
                    });
                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function () {
                    if (self.searcher.isSearching()) {
                        self.storeValue = {value: self.searcherPane.getValue()};
                    } else {
                        self.storeValue = {value: self.adapter.getValue()};
                    }
                    self.setSelectedValue(self.storeValue.value);
                    self.fireEvent(BI.MultiSelectTree.EVENT_CHANGE);
                }
            }, {
                eventName: BI.Searcher.EVENT_PAUSE,
                action: function () {
                    self._showAdapter();
                    // BI-64732 pause 和stop一致, 都应该刷新adapter
                    BI.nextTick(function () {
                        self.adapter.populate();
                    });
                }
            }]
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.searcher,
                height: this._constant.EDITOR_HEIGHT
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
                top: this._constant.EDITOR_HEIGHT,
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

    resize: function () {

    },

    setSelectedValue: function (v) {
        this.storeValue.value = v || {};
        this.adapter.setSelectedValue(v);
        this.searcherPane.setSelectedValue(v);
        this.searcher.setValue({
            value: v || {}
        });
    },

    setValue: function (v) {
        this.adapter.setValue(v);
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    updateValue: function (v) {
        this.adapter.updateValue(v);
    },

    getValue: function () {
        return this.storeValue.value;
    },

    populate: function () {
        this.adapter.populate();
    }
});
BI.MultiSelectTree.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_tree", BI.MultiSelectTree);
