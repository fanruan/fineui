/**
 * guy
 * 异步树
 * @class BI.TreeView
 * @extends BI.Pane
 */
BI.TreeView = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.TreeView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree",
            paras: {},
            itemsCreator: BI.emptyFn
        })
    },
    _init: function () {
        BI.TreeView.superclass._init.apply(this, arguments);

        this._stop = false;
        this.container = BI.createWidget();

        this._createTree();
        this.tip = BI.createWidget({
            type: "bi.loading_bar",
            invisible: true,
            handler: BI.bind(this._loadMore, this)
        });
        BI.createWidget({
            type: "bi.vertical",
            scrollable: true,
            scrolly: false,
            element: this.element,
            items: [this.container, this.tip]
        });

    },

    _createTree: function () {
        this.id = "bi-tree" + BI.UUID();
        if (this.nodes) {
            this.nodes.destroy();
        }
        if (this.tree) {
            this.tree.destroy();
        }
        this.tree = BI.createWidget({
            type: "bi.layout",
            element: "<ul id='" + this.id + "' class='ztree'></ul>"
        });
        BI.createWidget({
            type: "bi.default",
            element: this.container,
            items: [this.tree]
        });
    },

    //选择节点触发方法
    _selectTreeNode: function (treeId, treeNode) {
        this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, treeNode, this);
        this.fireEvent(BI.TreeView.EVENT_CHANGE, treeNode, this);
    },

    //配置属性
    _configSetting: function () {
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: true,
                url: getUrl,
                autoParam: ["id", "name"],
                otherParam: BI.cjkEncodeDO(paras)
            },
            check: {
                enable: true
            },
            data: {
                key: {
                    title: "title",
                    name: "text"
                },
                simpleData: {
                    enable: true
                }
            },
            view: {
                showIcon: false,
                expandSpeed: "",
                nameIsHTML: true,
                dblClickExpand: false
            },
            callback: {
                beforeExpand: beforeExpand,
                onAsyncSuccess: onAsyncSuccess,
                onAsyncError: onAsyncError,
                beforeCheck: beforeCheck,
                onCheck: onCheck,
                onExpand: onExpand,
                onCollapse: onCollapse,
                onClick: onClick
            }
        };
        var className = "dark", perTime = 100;

        function onClick(event, treeId, treeNode) {
            self.nodes.checkNode(treeNode, !treeNode.checked, true, true);
        }

        function getUrl(treeId, treeNode) {
            var parentNode = self._getParentValues(treeNode);
            treeNode.times = treeNode.times || 1;
            var param = "id=" + treeNode.id
                + "&times=" + (treeNode.times++)
                + "&parent_values= " + window.encodeURIComponent(BI.jsonEncode(parentNode))
                + "&check_state=" + window.encodeURIComponent(BI.jsonEncode(treeNode.getCheckStatus()));

            return BI.servletURL + '?op=' + self.options.op + '&cmd=' + self.options.cmd + "&" + param;
        }

        function beforeExpand(treeId, treeNode) {
            if (!treeNode.isAjaxing) {
                if (!treeNode.children) {
                    treeNode.times = 1;
                    ajaxGetNodes(treeNode, "refresh");
                }
                return true;
            } else {
                BI.Msg.toast("Please Wait。", "warning");
                return false;
            }
        }

        function onAsyncSuccess(event, treeId, treeNode, msg) {
            treeNode.halfCheck = false;
            if (!msg || msg.length === 0 || /^<html>[\s,\S]*<\/html>$/gi.test(msg) || self._stop) {
                return;
            }
            var zTree = self.nodes;
            var totalCount = treeNode.count || 0;

            //尝试去获取下一组节点，若获取值为空数组，表示获取完成
            // TODO by GUY
            if (treeNode.children.length > totalCount) {
                treeNode.count = treeNode.children.length;
                BI.delay(function () {
                    ajaxGetNodes(treeNode);
                }, perTime);
            } else {
                //treeNode.icon = "";
                zTree.updateNode(treeNode);
                zTree.selectNode(treeNode.children[0]);
                //className = (className === "dark" ? "":"dark");
            }
        }

        function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
            var zTree = self.nodes;
            BI.Msg.toast("Error!", "warning");
            //treeNode.icon = "";
            //zTree.updateNode(treeNode);
        }

        function ajaxGetNodes(treeNode, reloadType) {
            var zTree = self.nodes;
            if (reloadType == "refresh") {
                //treeNode.icon = FR.servletURL +"?op=resource&resource=/com/fr/bi/web/css/base/third/ztree/img/loading.gif";
                zTree.updateNode(treeNode);
            }
            zTree.reAsyncChildNodes(treeNode, reloadType, true);
        }

        function beforeCheck(treeId, treeNode) {
            treeNode.halfCheck = false;
            if (treeNode.checked === true) {
                //将展开的节点halfCheck设为false，解决展开节点存在halfCheck=true的情况 guy
                //所有的半选状态都需要取消halfCheck=true的情况
                function track(children) {
                    BI.each(children, function (i, ch) {
                        if (ch.halfCheck === true) {
                            ch.halfCheck = false;
                            track(ch.children);
                        }
                    })
                }

                track(treeNode.children);
                var treeObj = self.nodes;
                var nodes = treeObj.getSelectedNodes();
                $.each(nodes, function (index, node) {
                    node.halfCheck = false;
                })
            }
        }

        function onCheck(event, treeId, treeNode) {
            self._selectTreeNode(treeId, treeNode);
        }

        function onExpand(event, treeId, treeNode) {
            treeNode.halfCheck = false;
        }

        function onCollapse(event, treeId, treeNode) {
        }

        return setting;
    },

    _getParentValues: function (treeNode) {
        if (!treeNode.getParentNode()) {
            return [];
        }
        var parentNode = treeNode.getParentNode();
        var result = this._getParentValues(parentNode);
        result = result.concat([this._getNodeValue(parentNode)]);
        return result;
    },

    _getNodeValue: function (node) {
        //去除标红
        return node.value || node.text.replace(/<[^>]+>/g, "");
    },

    //获取半选框值
    _getHalfSelectedValues: function (map, node) {
        var self = this;
        var checkState = node.getCheckStatus();
        //将未选的去掉
        if (checkState.checked === false && checkState.half === false) {
            return;
        }
        //如果节点已展开,并且是半选
        if (BI.isNotEmptyArray(node.children) && checkState.half === true) {
            var children = node.children;
            BI.each(children, function (i, ch) {
                self._getHalfSelectedValues(map, ch);
            });
            return;
        }
        var parent = node.parentValues || self._getParentValues(node);
        var path = parent.concat(this._getNodeValue(node));
        if (BI.isNotEmptyArray(node.children) || checkState.half === false) {
            this._buildTree(map, path);
            return;
        }
        var storeValues = BI.deepClone(this.options.paras.selected_values);
        var treeNode = this._getTree(storeValues, path);
        this._addTreeNode(map, parent, this._getNodeValue(node), treeNode);
    },

    _getTree: function (map, values) {
        var cur = map;
        BI.any(values, function (i, value) {
            if (cur[value] == null) {
                return true;
            }
            cur = cur[value];
        });
        return cur;
    },

    _addTreeNode: function (map, values, key, value) {
        var cur = map;
        BI.each(values, function (i, value) {
            if (cur[value] == null) {
                cur[value] = {};
            }
            cur = cur[value];
        });
        cur[key] = value;
    },

    //构造树节点
    _buildTree: function (map, values) {
        var cur = map;
        BI.each(values, function (i, value) {
            if (cur[value] == null) {
                cur[value] = {};
            }
            cur = cur[value];
        })
    },

    //获取选中的值
    _getSelectedValues: function () {
        var self = this;
        var hashMap = {};
        var rootNoots = this.nodes.getNodes();
        track(rootNoots);
        function track(nodes) {
            BI.each(nodes, function (i, node) {
                var checkState = node.getCheckStatus();
                if (checkState.checked === true || checkState.half === true) {
                    if (checkState.half === true) {
                        self._getHalfSelectedValues(hashMap, node);
                    } else {
                        var parentValues = node.parentValues || self._getParentValues(node);
                        var values = parentValues.concat([self._getNodeValue(node)]);
                        self._buildTree(hashMap, values);
                    }
                }
            })
        }

        return hashMap;
    },

    //处理节点
    _dealWidthNodes: function (nodes) {
        var self = this, o = this.options;
        //处理标红
        if (BI.isKey(o.paras.keyword)) {
            var keyword = o.paras.keyword;
            var ns = BI.Tree.transformToArrayFormat(nodes);
            BI.each(ns, function (i, n) {
                n.text = $("<div>").__textKeywordMarked__(n.text, keyword, n.py).html();
            });
        }
        return nodes;
    },

    _loadMore: function () {
        var self = this, o = this.options;
        this.tip.setLoading();
        var op = BI.extend({}, o.paras, {
            times: ++this.times
        });
        o.itemsCreator(op, function (res) {
            if (self._stop === true) {
                return;
            }
            var hasNext = !!res.hasNext, nodes = res.items || [];

            if (!hasNext) {
                self.tip.setEnd();
            } else {
                self.tip.setLoaded();
            }
            if (nodes.length > 0) {
                self.nodes.addNodes(null, self._dealWidthNodes(nodes));
            }
        });
    },

    //生成树内部方法
    _initTree: function (setting) {
        var self = this, o = this.options;
        self.fireEvent(BI.Events.INIT);
        this.times = 1;
        var tree = this.tree;
        tree.empty();
        this.loading();
        this.tip.setVisible(false);
        var callback = function (nodes) {
            if (self._stop === true) {
                return;
            }
            self.nodes = $.fn.zTree.init(tree.element, setting, nodes);
        };
        var op = BI.extend({}, o.paras, {
            times: 1,
            type: BICst.TREE.TREE_REQ_TYPE.INIT_DATA
        });

        o.itemsCreator(op, function (res) {
            if (self._stop === true) {
                return;
            }
            var hasNext = !!res.hasNext, nodes = res.items || [];
            if (nodes.length > 0) {
                callback(self._dealWidthNodes(nodes));
            }
            self.setTipVisible(nodes.length <= 0);
            self.loaded();
            if (!hasNext) {
                self.tip.invisible();
            } else {
                self.tip.setLoaded();
            }
            op.times === 1 && self.fireEvent(BI.Events.AFTERINIT);
        });
    },

    //构造树结构，
    initTree: function (nodes, setting) {
        var setting = setting || {
                async: {
                    enable: false
                },
                check: {
                    enable: false
                },
                data: {
                    key: {
                        title: "title",
                        name: "text"
                    },
                    simpleData: {
                        enable: true
                    }
                },
                view: {
                    showIcon: false,
                    expandSpeed: ""
                },
                callback: {}
            };
        this.nodes = $.fn.zTree.init(this.tree.element, setting, nodes);
    },

    start: function () {
        this._stop = false;
    },

    stop: function () {
        this._stop = true;
    },

    //生成树方法
    stroke: function (config) {
        delete this.options.keyword;
        BI.extend(this.options.paras, config);
        var setting = this._configSetting();
        this._createTree();
        this.start();
        this._initTree(setting);
    },

    populate: function () {
        this.stroke.apply(this, arguments);
    },

    hasChecked: function () {
        var treeObj = this.nodes;
        return treeObj.getCheckedNodes(true).length > 0;
    },

    checkAll: function (checked) {
        this.nodes && this.nodes.checkAllNodes(checked);
    },

    expandAll: function (flag) {
        this.nodes && this.nodes.expandAll(flag);
    },

    setValue: function (value, param) {
        this.options.paras.selected_values = value || {};
        this.selected_values = BI.deepClone(value) || {};
        this.checkAll(false);
        this.updateValue(value, param);
        this.refresh();
    },

    updateValue: function (values, param) {
        if (!this.nodes) {
            return;
        }
        param || (param = "value");
        var treeObj = this.nodes;
        BI.each(values, function (v, op) {
            var nodes = treeObj.getNodesByParam(param, v, null);
            BI.each(nodes, function (j, node) {
                BI.extend(node, {checked: true}, op);
                treeObj.updateNode(node);
            })
        });
    },

    refresh: function () {
        this.nodes && this.nodes.refresh();
    },

    getValue: function () {
        if (!this.nodes) {
            return null;
        }
        return this._getSelectedValues();
    },

    empty: function () {
        BI.isNotNull(this.nodes) && this.nodes.destroy();
    },

    destroy: function () {
        this.stop();
        this.nodes && this.nodes.destroy();
        BI.TreeView.superclass.destroy.apply(this, arguments);
    }
});
BI.extend(BI.TreeView, {
    REQ_TYPE_INIT_DATA: 1,
    REQ_TYPE_ADJUST_DATA: 2,
    REQ_TYPE_CALCULATE_SELECT_DATA: 3,
    REQ_TYPE_SELECTED_DATA: 4
});

BI.TreeView.EVENT_CHANGE = "EVENT_CHANGE";
BI.TreeView.EVENT_INIT = BI.Events.INIT;
BI.TreeView.EVENT_AFTERINIT = BI.Events.AFTERINIT;

$.shortcut("bi.tree", BI.TreeView);