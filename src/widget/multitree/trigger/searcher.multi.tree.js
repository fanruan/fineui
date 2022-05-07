/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.MultiTreeSearcher
 * @extends Widget
 */
BI.MultiTreeSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeSearcher.superclass._defaultConfig.apply(this, arguments), {
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
        BI.MultiTreeSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.multi_select_editor",
            watermark: o.watermark,
            height: o.height,
            el: {
                type: "bi.simple_state_editor",
                text: o.text,
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
            self.fireEvent(BI.MultiTreeSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            self.fireEvent(BI.MultiTreeSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiTreeSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiTreeSearcher.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.Searcher.EVENT_SEARCHING, function () {
            var keywords = this.getKeywords();
            self.fireEvent(BI.MultiTreeSearcher.EVENT_SEARCHING, keywords);
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
        ob.value || (ob.value = {});
        var count = 0;
        if (BI.isNumber(ob)) {
            this.editor.setState(ob);
        } else if (BI.size(ob.value) === 0) {
            this.editor.setState(BI.Selection.None);
        } else {
            var text = "";
            var value = ob.value;
            var names = BI.Func.getSortedResult(BI.keys(value));
            BI.each(names, function (idx, name) {
                var childNodes = getChildrenNode(value[name]);
                text += (name === "null" ? "" : (o.valueFormatter(name + "") || name)) + (childNodes === "" ? (BI.isEmptyObject(value[name]) ? "" : ":") : (":" + childNodes)) + "; ";
                if (childNodes === "") {
                    count++;
                }
            });

            if (count > 20) {
                this.editor.setState(BI.Selection.Multi);
            } else {
                this.editor.setState(text);
            }
        }

        function getChildrenNode (ob) {
            var text = "";
            var index = 0, size = BI.size(ob);
            var names = BI.Func.getSortedResult(BI.keys(ob));
            BI.each(names, function (idx, name) {
                index++;
                var childNodes = getChildrenNode(ob[name]);
                text += (name === "null" ? "" : (o.valueFormatter(name + "") || name)) + (childNodes === "" ? "" : (":" + childNodes)) + (index === size ? "" : ",");
                if (childNodes === "") {
                    count++;
                }
            });
            return text;
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

BI.MultiTreeSearcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiTreeSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.MultiTreeSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiTreeSearcher.EVENT_START = "EVENT_START";
BI.MultiTreeSearcher.EVENT_STOP = "EVENT_STOP";
BI.MultiTreeSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.shortcut("bi.multi_tree_searcher", BI.MultiTreeSearcher);
