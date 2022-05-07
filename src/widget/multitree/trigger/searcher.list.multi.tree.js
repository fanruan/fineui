/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.MultiListTreeSearcher
 * @extends Widget
 */
BI.MultiListTreeSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiListTreeSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-searcher",
            itemsCreator: BI.emptyFn,
            valueFormatter: function (v) {
                return v;
            },
            popup: {},

            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiListTreeSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.multi_select_editor",
            height: o.height,
            text: o.text,
            watermark: o.watermark,
            el: {
                type: "bi.simple_state_editor",
                height: o.height
            },
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
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback({
                    keyword: self.editor.getValue()
                });
            },
            el: this.editor,

            popup: BI.extend({
                type: "bi.multi_tree_search_pane",
                keywordGetter: function () {
                    return self.editor.getValue();
                },
                itemsCreator: function (op, callback) {
                    op.keyword = self.editor.getValue();
                    o.itemsCreator(op, callback);
                },
                value: o.value
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.MultiListTreeSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.MultiListTreeSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiListTreeSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiListTreeSearcher.EVENT_CHANGE, arguments);
        });
        if (BI.isNotNull(o.value)) {
            this.setState(o.value);
        }
    },

    adjustView: function () {
        this.searcher.adjustView();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
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

    setState: function (ob) {
        var o = this.options;
        ob || (ob = {});
        ob.value || (ob.value = []);
        var count = 0;
        if (BI.isNumber(ob)) {
            this.editor.setState(ob);
        } else if (BI.size(ob.value) === 0) {
            this.editor.setState(BI.Selection.None);
        } else {
            var text = "";
            BI.each(ob.value, function (idx, path) {
                var childValue = BI.last(path);
                text += (path === "null" ? "" : (o.valueFormatter(childValue + "") || childValue) + "; ");
                count++;
            });

            if (count > 20) {
                this.editor.setState(BI.Selection.Multi);
            } else {
                this.editor.setState(text);
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
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setWaterMark: function (v) {
        this.editor.setWaterMark(v);
    }
});

BI.MultiListTreeSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.MultiListTreeSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiListTreeSearcher.EVENT_START = "EVENT_START";
BI.MultiListTreeSearcher.EVENT_STOP = "EVENT_STOP";
BI.MultiListTreeSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.shortcut("bi.multi_list_tree_searcher", BI.MultiListTreeSearcher);
