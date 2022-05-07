/**
 * Created by Windy on 2018/2/2.
 */
BI.MultiLayerSelectTreeTrigger = BI.inherit(BI.Trigger, {

    props: function() {
        return {
            extraCls: "bi-multi-layer-select-tree-trigger",
            height: 24,
            itemsCreator: BI.emptyFn,
            watermark: BI.i18nText("BI-Basic_Search"),
            allowSearchValue: false,
            title: BI.bind(this._getShowText, this)
        };
    },

    render: function () {
        var self = this, o = this.options;
        if(o.itemsCreator === BI.emptyFn) {
            this._initData();
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
                        masker: BI.isNotNull(o.container) ? {
                            offset: {},
                            container: o.container
                        } : {
                            offset: {}
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
                            type: o.allowInsertValue ? "bi.multilayer_select_tree_insert_search_pane" : "bi.multilayer_select_tree_popup",
                            itemsCreator: o.itemsCreator === BI.emptyFn ? BI.emptyFn : function (op, callback) {
                                op.keyword = self.editor.getValue();
                                o.itemsCreator(op, callback);
                            },
                            keywordGetter: function () {
                                return self.editor.getValue();
                            },
                            cls: "bi-card",
                            listeners: [{
                                eventName: BI.MultiLayerSelectTreeInsertSearchPane.EVENT_ADD_ITEM,
                                action: function () {
                                    self.options.text = self.getSearcher().getKeyword();
                                    self.fireEvent(BI.MultiLayerSelectTreeTrigger.EVENT_ADD_ITEM);
                                }
                            }],
                            ref: function (_ref) {
                                self.popup = _ref;
                            }
                        },
                        onSearch: function (obj, callback) {
                            var keyword = obj.keyword;
                            if(o.itemsCreator === BI.emptyFn) {
                                callback(self._getSearchItems(keyword));
                                o.allowInsertValue && self.popup.setKeyword(keyword);
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

    _initData: function() {
        var o = this.options;
        this.tree = new BI.Tree();
        this.nodes = BI.Tree.treeFormat(BI.deepClone(o.items));
        this.tree.initTree(this.nodes);
    },

    _getSearchItems: function(keyword) {
        var self = this, o = this.options;
        // 把数组搜索换成用BI.tree搜索节点, 搜到了就不再往下搜索
        var items = [];
        this.tree.traverse(function (node) {
            var find = BI.Func.getSearchResult(self.tree.isRoot(node) ? [] : BI.concat([node.text], (o.allowSearchValue ? [node.value] : [])), keyword);
            if(find.find.length > 0 || find.match.length > 0) {
                items.push(node);
                return true;
            }
        });
        return this._fillTreeStructure4Search(items, "id");
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
        if (BI.isFunction(o.valueFormatter)) {
            return o.valueFormatter(v);
        }

        if (o.itemsCreator === BI.emptyFn) {
            var result = BI.find(o.items, function (i, item) {
                return item.value === v;
            });

            return BI.isNotNull(result) ? result.text : o.text;
        }

        return v;
    },

    _getShowText: function () {
        return this.editor.getText();
    },

    stopEditing: function () {
        this.searcher.stopSearch();
    },

    getSearcher: function () {
        return this.searcher;
    },

    populate: function (items) {
        this.options.items = items;
        this._initData(items);
    },

    setValue: function (v) {
        this.editor.setState(this._digest(v[0]));
    },

    getValue: function () {
        return this.searcher.getValue();
    },

    focus: function () {
        this.searcher.focus();
    },

    blur: function () {
        this.searcher.blur();
    },

    setWaterMark: function (v) {
        this.searcher.setWaterMark(v);
    }
});

BI.MultiLayerSelectTreeTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiLayerSelectTreeTrigger.EVENT_BLUR = "EVENT_BLUR";
BI.MultiLayerSelectTreeTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiLayerSelectTreeTrigger.EVENT_STOP = "EVENT_STOP";
BI.MultiLayerSelectTreeTrigger.EVENT_START = "EVENT_START";
BI.MultiLayerSelectTreeTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiLayerSelectTreeTrigger.EVENT_ADD_ITEM = "EVENT_ADD_ITEM";
BI.shortcut("bi.multilayer_select_tree_trigger", BI.MultiLayerSelectTreeTrigger);