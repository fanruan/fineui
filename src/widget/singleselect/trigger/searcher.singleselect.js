/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.SingleSelectSearcher
 * @extends Widget
 */
BI.SingleSelectSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-searcher",
            itemsCreator: BI.emptyFn,
            el: {},
            popup: {},
            valueFormatter: BI.emptyFn,
            adapter: null,
            masker: {},
            allowNoSelect: false
        });
    },

    _init: function () {
        BI.SingleSelectSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.single_select_editor",
            height: o.height,
            watermark: o.watermark,
            text: o.text,
            listeners: [{
                eventName: BI.SingleSelectEditor.EVENT_FOCUS,
                action: function () {
                    self.fireEvent(BI.SingleSelectSearcher.EVENT_FOCUS);
                }
            }, {
                eventName: BI.SingleSelectEditor.EVENT_BLUR,
                action: function () {
                    self.fireEvent(BI.SingleSelectSearcher.EVENT_BLUR);
                }
            }]
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
                type: "bi.single_select_search_pane",
                allowNoSelect: o.allowNoSelect,
                valueFormatter: o.valueFormatter,
                keywordGetter: function () {
                    return self.editor.getValue();
                },
                itemsCreator: function (op, callback) {
                    var keyword = self.editor.getValue();
                    op.keywords = [keyword];
                    this.setKeyword(keyword);
                    o.itemsCreator(op, callback);
                },
                value: o.value
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.SingleSelectSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.SingleSelectSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.SingleSelectSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectSearcher.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.Searcher.EVENT_SEARCHING, function () {
            var keywords = this.getKeywords();
            self.fireEvent(BI.SingleSelectSearcher.EVENT_SEARCHING, keywords);
        });

        if(BI.isNotNull(o.value)){
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
        return this.editor.getKeyword();
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

    setState: function (v) {
        var o = this.options;
        if (BI.isNull(v)) {
            this.editor.setState(BI.Selection.None);
        } else {
            this.editor.setState(o.valueFormatter(v + "") || (v + ""));
        }
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

BI.SingleSelectSearcher.EVENT_FOCUS = "EVENT_FOCUS";
BI.SingleSelectSearcher.EVENT_BLUR = "EVENT_BLUR";
BI.SingleSelectSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.SingleSelectSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.SingleSelectSearcher.EVENT_START = "EVENT_START";
BI.SingleSelectSearcher.EVENT_STOP = "EVENT_STOP";
BI.SingleSelectSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.SingleSelectSearcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.shortcut("bi.single_select_searcher", BI.SingleSelectSearcher);
