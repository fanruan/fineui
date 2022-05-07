BI.SearchMultiSelectSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SearchMultiSelectSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-searcher",
            itemsCreator: BI.emptyFn,
            el: {},
            popup: {},
            valueFormatter: BI.emptyFn,
            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.SearchMultiSelectSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.multi_select_editor",
            height: o.height,
            text: o.text,
            tipType: o.tipType,
            warningTitle: o.warningTitle
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            element: this,
            height: o.height,
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            el: this.editor,

            popup: BI.extend({
                type: "bi.multi_select_search_pane",
                valueFormatter: o.valueFormatter,
                keywordGetter: function () {
                    return self.editor.getValue();
                },
                itemsCreator: function (op, callback) {
                    var keyword = self.editor.getValue();
                    op.keywords = [keyword];
                    o.itemsCreator(op, callback);
                },
                value: o.value
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.SearchMultiSelectSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.SearchMultiSelectSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.SearchMultiSelectSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SearchMultiSelectSearcher.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.Searcher.EVENT_SEARCHING, function () {
            var keywords = this.getKeywords();
            self.fireEvent(BI.SearchMultiSelectSearcher.EVENT_SEARCHING, keywords);
        });
        if(BI.isNotNull(o.value)) {
            this.setState(o.value);
        }
    },

    adjustView: function () {
        this.searcher.adjustView();
    },

    isSearching: function () {
        return this.searcher.isSearching();
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    getKeyword: function () {
        return this.editor.getValue();
    },

    hasMatched: function () {
        return this.searcher.hasMatched();
    },

    hasChecked: function () {
        return this.searcher.getView() && this.searcher.getView().hasChecked();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    setState: function (obj) {
        var o = this.options;
        var ob = {};
        ob.type = obj.type;
        ob.value = o.allValueGetter() || [];
        ob.assist = obj.assist;
        if (ob.type === BI.Selection.All) {
            if (ob.value.length === 0) {
                this.editor.setState(BI.Selection.All);
            } else if (BI.size(ob.assist) <= 20) {
                var state = "";
                BI.each(ob.assist, function (i, v) {
                    if (i === 0) {
                        state += "" + (o.valueFormatter(v + "") || v);
                    } else {
                        state += "," + (o.valueFormatter(v + "") || v);
                    }
                });
                this.editor.setState(state);
            } else {
                this.editor.setState(BI.Selection.Multi);
            }
        } else {
            if (ob.value.length === 0) {
                this.editor.setState(BI.Selection.None);
            } else if (BI.size(ob.value) <= 20) {
                var state = "";
                BI.each(ob.value, function (i, v) {
                    if (i === 0) {
                        state += "" + (o.valueFormatter(v + "") || v);
                    } else {
                        state += "," + (o.valueFormatter(v + "") || v);
                    }
                });
                this.editor.setState(state);
            } else {
                this.editor.setState(BI.Selection.Multi);
            }
        }
    },

    setTipType: function (v) {
        this.editor.setTipType(v);
    },

    setValue: function (ob) {
        this.setState(ob);
        this.searcher.setValue(ob);
    },

    getKey: function () {
        return this.editor.getValue();
    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function (items) {
        this.searcher.populate.apply(this.searcher, arguments);
    }
});

BI.SearchMultiSelectSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.SearchMultiSelectSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.SearchMultiSelectSearcher.EVENT_START = "EVENT_START";
BI.SearchMultiSelectSearcher.EVENT_STOP = "EVENT_STOP";
BI.SearchMultiSelectSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.SearchMultiSelectSearcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.shortcut("bi.search_multi_select_searcher", BI.SearchMultiSelectSearcher);
