/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectSearcher
 * @extends Widget
 */
BI.MultiSelectSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-searcher",
            itemsCreator: BI.emptyFn,
            el: {},
            popup: {},
            valueFormatter: BI.emptyFn,
            adapter: null,
            masker: {},
            text: BI.i18nText("BI-Basic_Please_Select"),
            itemHeight: 24
        });
    },

    _init: function () {
        BI.MultiSelectSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.multi_select_editor",
            height: o.height,
            text: o.text,
            watermark: o.watermark,
            listeners: [{
                eventName: BI.MultiSelectEditor.EVENT_FOCUS,
                action: function () {
                    self.fireEvent(BI.MultiSelectSearcher.EVENT_FOCUS);
                }
            }, {
                eventName: BI.MultiSelectEditor.EVENT_BLUR,
                action: function () {
                    self.fireEvent(BI.MultiSelectSearcher.EVENT_BLUR);
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
                itemHeight: o.itemHeight,
                value: o.value
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.MultiSelectSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.MultiSelectSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiSelectSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectSearcher.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.Searcher.EVENT_SEARCHING, function () {
            var keywords = this.getKeywords();
            self.fireEvent(BI.MultiSelectSearcher.EVENT_SEARCHING, keywords);
        });
        if (BI.isNotNull(o.value)) {
            this.setState(o.value);
        }
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
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

    setState: function (ob) {
        var o = this.options;
        ob || (ob = {});
        ob.value || (ob.value = []);
        if (ob.type === BI.Selection.All) {
            if (ob.value.length === 0) {
                this.editor.setState(BI.Selection.All);
            } else if (BI.size(ob.assist) <= 20) {
                var state = "";
                BI.each(ob.assist, function (i, v) {
                    if (i === 0) {
                        state += "" + (v === null ? "" : (o.valueFormatter(v + "") || v));
                    } else {
                        state += "," + (v === null ? "" : (o.valueFormatter(v + "") || v));
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
                        state += "" + (v === null ? "" : (o.valueFormatter(v + "") || v));
                    } else {
                        state += "," + (v === null ? "" : (o.valueFormatter(v + "") || v));
                    }
                });
                this.editor.setState(state);
            } else {
                this.editor.setState(BI.Selection.Multi);
            }
        }
    },

    getState: function () {
        return this.editor.getState();
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

BI.MultiSelectSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.MultiSelectSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectSearcher.EVENT_START = "EVENT_START";
BI.MultiSelectSearcher.EVENT_STOP = "EVENT_STOP";
BI.MultiSelectSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.MultiSelectSearcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiSelectSearcher.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiSelectSearcher.EVENT_BLUR = "EVENT_BLUR";
BI.shortcut("bi.multi_select_searcher", BI.MultiSelectSearcher);
