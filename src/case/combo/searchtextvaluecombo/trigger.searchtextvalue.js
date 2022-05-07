/**
 * Created by Windy on 2018/2/2.
 */
BI.SearchTextValueTrigger = BI.inherit(BI.Trigger, {

    props: function () {
        return {
            extraCls: "bi-search-text-value-trigger",
            height: 24,
            watermark: BI.i18nText("BI-Basic_Search")
        };
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.htape",
            items: [
                {
                    el: {
                        type: "bi.searcher",
                        ref: function () {
                            self.searcher = this;
                        },
                        isAutoSearch: false,
                        el: {
                            type: "bi.state_editor",
                            ref: function () {
                                self.editor = this;
                            },
                            watermark: o.watermark,
                            defaultText: o.defaultText,
                            text: this._digest(o.value, o.items),
                            value: o.value,
                            height: o.height,
                            tipText: ""
                        },
                        popup: {
                            type: "bi.search_text_value_combo_popup",
                            cls: "bi-card",
                            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
                            tipText: BI.i18nText("BI-No_Select"),
                        },
                        onSearch: function (obj, callback) {
                            var keyword = obj.keyword;
                            var finding = BI.Func.getSearchResult(o.items, keyword);
                            var matched = finding.match, find = finding.find;
                            callback(matched, find);
                        },
                        listeners: [{
                            eventName: BI.Searcher.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.SearchTextValueTrigger.EVENT_CHANGE);
                            }
                        }]
                    }
                }, {
                    el: {
                        type: "bi.layout",
                        width: 24
                    },
                    width: 24
                }
            ]
        };
    },

    _setState: function (v) {
        this.editor.setState(v);
    },

    _digest: function (vals, items) {
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result = [];
        var formatItems = BI.Tree.transformToArrayFormat(items);
        BI.each(formatItems, function (i, item) {
            if (BI.deepContains(vals, item.value) && !BI.contains(result, item.text || item.value)) {
                result.push(item.text || item.value);
            }
        });

        if (result.length > 0) {
            return result.join(",");
        } else {
            return BI.isFunction(o.text) ? o.text() : o.text;
        }
    },

    stopEditing: function () {
        this.searcher.stopSearch();
    },

    getSearcher: function () {
        return this.searcher;
    },

    populate: function (items) {
        this.options.items = items;
    },

    setValue: function (vals) {
        this._setState(this._digest(vals, this.options.items));
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});
BI.SearchTextValueTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.SearchTextValueTrigger.EVENT_STOP = "EVENT_STOP";
BI.SearchTextValueTrigger.EVENT_START = "EVENT_START";
BI.SearchTextValueTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.search_text_value_trigger", BI.SearchTextValueTrigger);
