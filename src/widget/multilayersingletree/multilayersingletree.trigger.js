/**
 * Created by Windy on 2018/2/2.
 */
BI.MultiLayerSingleTreeTrigger = BI.inherit(BI.Trigger, {

    props: function() {
        return {
            extraCls: "bi-multi-layer-single-tree-trigger bi-border bi-focus-shadow",
            height: 24,
            valueFormatter: function (v) {
                return v;
            },
            itemsCreator: BI.emptyFn,
            watermark: BI.i18nText("BI-Basic_Search"),
            allowSearchValue: false
        };
    },

    render: function () {
        var self = this, o = this.options;
        if(o.itemsCreator === BI.emptyFn) {
            this.tree = new BI.Tree();
            this.tree.initTree(BI.Tree.treeFormat(o.items));
        }
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
                            watermark: o.watermark,
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
                            itemsCreator: o.itemsCreator === BI.emptyFn ? BI.emptyFn : function (op, callback) {
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
                                callback(self._getSearchItems(keyword));
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

    _getSearchItems: function(keyword) {
        var o = this.options;
        var findingText = BI.Func.getSearchResult(o.items, keyword, "text");
        var findingValue = o.allowSearchValue ? BI.Func.getSearchResult(o.items, keyword, "value") : {find: [], match: []};
        var textItems = findingText.find.concat(findingText.match);
        var valueItems = findingValue.find.concat(findingValue.match);
        return this._fillTreeStructure4Search(BI.uniqBy(textItems.concat(valueItems), "id"));
    },

    _createJson: function(node, open) {
        return {
            id: node.id,
            pId: node.pId,
            text: node.text,
            value: node.value,
            isParent: BI.isNotEmptyArray(node.children),
            open: open
        }
    },

    _getChildren: function(node) {
        var self = this;
        node.children = node.children || [];
        var nodes = [];
        BI.each(node.children, function (idx, child) {
            var children = self._getChildren(child);
            nodes = nodes.concat(children);
        });
        return node.children.concat(nodes);
    },

    // 将搜索到的节点进行补充，构造成一棵完整的树
    _fillTreeStructure4Search: function (leaves) {
        var self = this;
        var result = [];
        var queue = [];
        BI.each(leaves, function (idx, node) {
            queue.push({pId: node.pId});
            result.push(node);
            result = result.concat(self._getChildren(node));
        });
        while (BI.isNotEmptyArray(queue)) {
            var node = queue.pop();
            var pNode = this.tree.search(this.tree.getRoot(), node.pId, "id");
            if (pNode != null) {
                pNode.open = true;
                queue.push({pId: pNode.pId});
                result.push(pNode);
            }
        }
        return BI.uniqBy(BI.map(result, function (idx, node) {
            return self._createJson(node, node.open);
        }), "id");
    },

    _digest: function (v) {
        var o = this.options;
        if(o.itemsCreator === BI.emptyFn) {
            var result = BI.find(o.items, function (i, item) {
                return item.value === v;
            });
            return BI.isNotNull(result) ? result.text : o.text;
        }
        return o.valueFormatter(v);

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