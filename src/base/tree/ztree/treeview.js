/**
 * guy
 * 异步树
 * @class BI.TreeView
 * @extends BI.Pane
 */
BI.TreeView = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.TreeView.superclass._defaultConfig.apply(this, arguments), {
            _baseCls: "bi-tree",
            paras: {
                selectedValues: {}
            },
            itemsCreator: BI.emptyFn
        });
    },
    _init: function () {
        BI.TreeView.superclass._init.apply(this, arguments);
        var o = this.options;
        this._stop = false;

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
            element: this,
            items: [this.tip]
        });
        if(BI.isNotNull(o.value)) {
            this.setSelectedValue(o.value);
        }
        if (BI.isIE9Below && BI.isIE9Below()) {
            this.element.addClass("hack");
        }
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
            element: this.element,
            items: [this.tree]
        });
    },

    // 选择节点触发方法
    _selectTreeNode: function (treeId, treeNode) {
        this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, treeNode, this);
        this.fireEvent(BI.TreeView.EVENT_CHANGE, treeNode, this);
    },

    // 配置属性
    _configSetting: function () {
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: true,
                url: getUrl,
                autoParam: ["id", "name"],  // 节点展开异步请求自动提交id和name
                otherParam: BI.cjkEncodeDO(paras) // 静态参数
            },
            check: {
                enable: true
            },
            data: {
                key: {
                    title: "title",
                    name: "text"    // 节点的name属性替换成text
                },
                simpleData: {
                    enable: true    // 可以穿id,pid属性的对象数组
                }
            },
            view: {
                showIcon: false,
                expandSpeed: "",
                nameIsHTML: true,   // 节点可以用html标签代替
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

        function onClick (event, treeId, treeNode) {
            // 当前点击节点的状态是半选，且为true_part, 则将其改为false_part,使得点击半选后切换到的是全选
            var checked = treeNode.checked;
            var status = treeNode.getCheckStatus();
            if(status.half === true && status.checked === true) {
                checked = false;
            }
            // 更新此node的check状态, 影响父子关联，并调用beforeCheck和onCheck回调
            self.nodes.checkNode(treeNode, !checked, true, true);
        }

        function getUrl (treeId, treeNode) {
            var parentNode = self._getParentValues(treeNode);
            treeNode.times = treeNode.times || 1;
            var param = "id=" + treeNode.id
                + "&times=" + (treeNode.times++)
                + "&parentValues= " + _global.encodeURIComponent(BI.jsonEncode(parentNode))
                + "&checkState=" + _global.encodeURIComponent(BI.jsonEncode(treeNode.getCheckStatus()));

            return "&" + param;
        }

        function beforeExpand (treeId, treeNode) {
            if (!treeNode.isAjaxing) {
                if (!treeNode.children) {
                    treeNode.times = 1;
                    ajaxGetNodes(treeNode, "refresh");
                }
                return true;
            }
            BI.Msg.toast("Please Wait。", "warning"); // 不展开节点，也不触发onExpand事件
            return false;

        }

        function onAsyncSuccess (event, treeId, treeNode, msg) {
            treeNode.halfCheck = false;
            if (!msg || msg.length === 0 || /^<html>[\s,\S]*<\/html>$/gi.test(msg) || self._stop) {
                return;
            }
            var zTree = self.nodes;
            var totalCount = treeNode.count || 0;

            // 尝试去获取下一组节点，若获取值为空数组，表示获取完成
            // TODO by GUY
            if (treeNode.children.length > totalCount) {
                treeNode.count = treeNode.children.length;
                BI.delay(function () {
                    ajaxGetNodes(treeNode);
                }, perTime);
            } else {
                // treeNode.icon = "";
                zTree.updateNode(treeNode);
                zTree.selectNode(treeNode.children[0]);
                // className = (className === "dark" ? "":"dark");
            }
        }

        function onAsyncError (event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
            var zTree = self.nodes;
            BI.Msg.toast("Error!", "warning");
            // treeNode.icon = "";
            // zTree.updateNode(treeNode);
        }

        function ajaxGetNodes (treeNode, reloadType) {
            var zTree = self.nodes;
            if (reloadType == "refresh") {
                zTree.updateNode(treeNode); // 刷新一下当前节点，如果treeNode.xxx被改了的话
            }
            zTree.reAsyncChildNodes(treeNode, reloadType, true); // 强制加载子节点，reloadType === refresh为先清空再加载，否则为追加到现有子节点之后
        }

        function beforeCheck (treeId, treeNode) {
            treeNode.halfCheck = false;
            if (treeNode.checked === true) {
                // 将展开的节点halfCheck设为false，解决展开节点存在halfCheck=true的情况 guy
                // 所有的半选状态都需要取消halfCheck=true的情况
                function track (children) {
                    BI.each(children, function (i, ch) {
                        if (ch.halfCheck === true) {
                            ch.halfCheck = false;
                            track(ch.children);
                        }
                    });
                }

                track(treeNode.children);
                var treeObj = self.nodes;
                var nodes = treeObj.getSelectedNodes();
                BI.$.each(nodes, function (index, node) {
                    node.halfCheck = false;
                });
            }
            var status = treeNode.getCheckStatus();
            // 当前点击节点的状态是半选，且为true_part, 则将其改为false_part,使得点击半选后切换到的是全选
            if(status.half === true && status.checked === true) {
                treeNode.checked = false;
            }
        }

        function onCheck (event, treeId, treeNode) {
            self._selectTreeNode(treeId, treeNode);
        }

        function onExpand (event, treeId, treeNode) {
            treeNode.halfCheck = false;
        }

        function onCollapse (event, treeId, treeNode) {
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
        // 去除标红
        return node.value == null ? BI.replaceAll(node.text.replace(/<[^>]+>/g, ""), "&nbsp;", " ") : node.value;
    },

    // 获取半选框值
    _getHalfSelectedValues: function (map, node) {
        var self = this;
        var checkState = node.getCheckStatus();
        // 将未选的去掉
        if (checkState.checked === false && checkState.half === false) {
            return;
        }
        // 如果节点已展开,并且是半选
        if (BI.isNotEmptyArray(node.children) && checkState.half === true) {
            var children = node.children;
            BI.each(children, function (i, ch) {
                self._getHalfSelectedValues(map, ch);
            });
            return;
        }
        var parent = node.parentValues || self._getParentValues(node);
        var path = parent.concat(this._getNodeValue(node));
        // 当前节点是全选的，因为上面的判断已经排除了不选和半选
        if (BI.isNotEmptyArray(node.children) || checkState.half === false) {
            this._buildTree(map, path);
            return;
        }
        // 剩下的就是半选不展开的节点，因为不知道里面是什么情况，所以借助selectedValues(这个是完整的选中情况)
        var storeValues = BI.deepClone(this.options.paras.selectedValues);
        var treeNode = this._getTree(storeValues, path);
        this._addTreeNode(map, parent, this._getNodeValue(node), treeNode);
    },

    // 获取的是以values最后一个节点为根的子树
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

    // 以values为path一路向里补充map, 并在末尾节点添加key: value节点
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

    // 构造树节点
    _buildTree: function (map, values) {
        var cur = map;
        BI.each(values, function (i, value) {
            if (cur[value] == null) {
                cur[value] = {};
            }
            cur = cur[value];
        });
    },

    // 获取选中的值
    _getSelectedValues: function () {
        var self = this;
        var hashMap = {};
        var rootNoots = this.nodes.getNodes();
        track(rootNoots); // 可以看到这个方法没有递归调用，所以在_getHalfSelectedValues中需要关心全选的节点
        function track (nodes) {
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
            });
        }

        return hashMap;
    },

    // 处理节点
    _dealWidthNodes: function (nodes) {
        var self = this, o = this.options;
        var ns = BI.Tree.arrayFormat(nodes);
        BI.each(ns, function (i, n) {
            n.title = n.title || n.text || n.value;
            n.isParent = n.isParent || n.parent;
            // 处理标红
            if (BI.isKey(o.paras.keyword)) {
                n.text = BI.$("<div>").__textKeywordMarked__(n.text, o.paras.keyword, n.py).html();
            } else {
                n.text = BI.htmlEncode(n.text + "");
            }
        });
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

    // 生成树内部方法
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
            self.nodes = BI.$.fn.zTree.init(tree.element, setting, nodes);
        };
        var op = BI.extend({}, o.paras, {
            times: 1
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

    // 构造树结构，
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
                expandSpeed: "",
                nameIsHTML: true
            },
            callback: {}
        };
        this.nodes = BI.$.fn.zTree.init(this.tree.element, setting, nodes);
    },

    start: function () {
        this._stop = false;
    },

    stop: function () {
        this._stop = true;
    },

    // 生成树方法
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
        function setNode (children) {
            BI.each(children, function (i, child) {
                child.halfCheck = false;
                setNode(child.children);
            });
        }

        if (!this.nodes) {
            return;
        }

        BI.each(this.nodes.getNodes(), function (i, node) {
            node.halfCheck = false;
            setNode(node.children);
        });
        this.nodes.checkAllNodes(checked);
    },

    expandAll: function (flag) {
        this.nodes && this.nodes.expandAll(flag);
    },

    // 设置树节点的状态
    setValue: function (value, param) {
        this.checkAll(false);
        this.updateValue(value, param);
        this.refresh();
    },

    setSelectedValue: function (value) {
        this.options.paras.selectedValues = BI.deepClone(value || {});
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
            });
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

    destroyed: function () {
        this.stop();
        this.nodes && this.nodes.destroy();
    }
});
BI.extend(BI.TreeView, {
    REQ_TYPE_INIT_DATA: 1,
    REQ_TYPE_ADJUST_DATA: 2,
    REQ_TYPE_SELECT_DATA: 3,
    REQ_TYPE_GET_SELECTED_DATA: 4
});

BI.TreeView.EVENT_CHANGE = "EVENT_CHANGE";
BI.TreeView.EVENT_INIT = BI.Events.INIT;
BI.TreeView.EVENT_AFTERINIT = BI.Events.AFTERINIT;

BI.shortcut("bi.tree_view", BI.TreeView);