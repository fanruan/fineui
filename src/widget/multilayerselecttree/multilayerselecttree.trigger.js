/**
 * Created by Windy on 2018/2/2.
 */
BI.MultiLayerSelectTreeTrigger = BI.inherit(BI.Trigger, {

    props: {
        extraCls: "bi-multi-layer-select-tree-trigger bi-border bi-focus-shadow",
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
                            defaultText: o.text,
                            text: this._digest(o.value),
                            value: o.value,
                            height: o.height,
                            tipText: "",
                            listeners: [{
                                eventName: BI.StateEditor.EVENT_FOCUS,
                                action: function () {
                                    self.fireEvent(BI.MultiLayerSelectTreeTrigger.EVENT_FOCUS);
                                }
                            }, {
                                eventName: BI.StateEditor.EVENT_BLUR,
                                action: function () {
                                    self.fireEvent(BI.MultiLayerSelectTreeTrigger.EVENT_BLUR);
                                }
                            }, {
                                eventName: BI.StateEditor.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.MultiLayerSelectTreeTrigger.EVENT_SEARCHING);
                                }
                            }]
                        },
                        popup: {
                            type: "bi.multilayer_select_tree_popup",
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
                                self.fireEvent(BI.MultiLayerSelectTreeTrigger.EVENT_CHANGE);
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

    _digest: function (v) {
        var o = this.options;
        return o.valueFormatter(v) || o.text;
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

BI.MultiLayerSelectTreeTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiLayerSelectTreeTrigger.EVENT_BLUR = "EVENT_BLUR";
BI.MultiLayerSelectTreeTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiLayerSelectTreeTrigger.EVENT_STOP = "EVENT_STOP";
BI.MultiLayerSelectTreeTrigger.EVENT_START = "EVENT_START";
BI.MultiLayerSelectTreeTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_select_tree_trigger", BI.MultiLayerSelectTreeTrigger);