/**
 * Created by Windy on 2018/2/2.
 */
BI.MultiLayerSingleTreeTrigger = BI.inherit(BI.Trigger, {

    props: {
        extraCls: "bi-multi-layer-single-tree-trigger bi-border bi-focus-shadow",
        height: 24,
        valueFormatter: function (v) {
            return v;
        },
        itemsCreator: BI.emptyFn
    },

    render: function () {
        var self = this, o = this.options;
        var content = {
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
                            text: o.text,
                            value: o.value,
                            height: o.height,
                            tipText: "",
                            listeners: [{
                                eventName: BI.StateEditor.EVENT_FOCUS,
                                action: function () {
                                    self.fireEvent(BI.MultiLayerSingleTreeTrigger.EVENT_FOCUS);
                                }
                            }, {
                                eventName: BI.StateEditor.EVENT_BLUR,
                                action: function () {
                                    self.fireEvent(BI.MultiLayerSingleTreeTrigger.EVENT_BLUR);
                                }
                            }, {
                                eventName: BI.StateEditor.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.MultiLayerSingleTreeTrigger.EVENT_SEARCHING);
                                }
                            }]
                        },
                        popup: {
                            type: "bi.multilayer_single_tree_popup",
                            itemsCreator: function (op, callback) {
                                op.keyword = self.editor.getValue();
                                o.itemsCreator(op, callback);
                            },
                            keywordGetter: function () {
                                return self.editor.getValue();
                            },
                            cls: "bi-card"
                        },
                        onSearch: function (obj, callback) {
                            var keyword = obj.keyword;
                            if(o.itemsCreator === BI.emptyFn) {
                                var finding = BI.Func.getSearchResult(o.items, keyword);
                                var matched = finding.match, find = finding.find;
                                callback(find.concat(matched));
                            } else {
                                callback();
                            }
                        },
                        listeners: [{
                            eventName: BI.Searcher.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.MultiLayerSingleTreeTrigger.EVENT_CHANGE);
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

        return o.allowEdit ? content : {
            type: "bi.absolute",
            items: [{
                el: content,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: {
                    type: "bi.layout"
                },
                left: 0,
                right: 24,
                top: 0,
                bottom: 0
            }]
        };
    },

    mounted: function () {
        var o = this.options;
        if(BI.isKey(o.value)) {
            this.setValue([o.value]);
        }
    },

    _digest: function (v) {
        return this.options.valueFormatter(v);
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

    setValue: function (v) {
        this.editor.setState(this._digest(v[0]));
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});
BI.MultiLayerSingleTreeTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiLayerSingleTreeTrigger.EVENT_BLUR = "EVENT_BLUR";
BI.MultiLayerSingleTreeTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiLayerSingleTreeTrigger.EVENT_STOP = "EVENT_STOP";
BI.MultiLayerSingleTreeTrigger.EVENT_START = "EVENT_START";
BI.MultiLayerSingleTreeTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_trigger", BI.MultiLayerSingleTreeTrigger);