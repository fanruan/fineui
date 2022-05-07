/**
 * guy
 * 同步树
 * @class BI.AsyncTree
 * @extends BI.TreeView
 */
BI.AsyncTree = BI.inherit(BI.TreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.AsyncTree.superclass._defaultConfig.apply(this, arguments), {});
    },
    _init: function () {
        BI.AsyncTree.superclass._init.apply(this, arguments);
        var self = this;
        this.service = new BI.TreeRenderPageService({
            subNodeListGetter: function (tId) {
                // 获取待检测的子节点列表, ztree并没有获取节点列表dom的API, 此处使用BI.$获取
                return BI.$("#" + self.id + " #" + tId + "_ul");
            }
        });
    },

    // 配置属性
    _configSetting: function () {
        var o = this.options;
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: false,  // 很明显这棵树把异步请求关掉了，所有的异步请求都是手动控制的
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
                dblClickExpand: false,
                showLine: o.showLine
            },
            callback: {
                beforeCheck: beforeCheck,
                onCheck: onCheck,
                beforeExpand: beforeExpand,
                onExpand: onExpand,
                onCollapse: onCollapse,
                onClick: onClick
            }
        };

        function onClick (event, treeId, treeNode) {
            if (treeNode.disabled) {
                return false;
            }
            var zTree = BI.$.fn.zTree.getZTreeObj(treeId);
            // 当前点击节点的状态是半选，且为true_part, 则将其改为false_part,使得点击半选后切换到的是全选
            var checked = treeNode.checked;
            var status = treeNode.getCheckStatus();
            if (status.half === true && status.checked === true) {
                checked = false;
            }
            zTree.checkNode(treeNode, !checked, true, true);
        }

        function beforeCheck (treeId, treeNode) {
            if (treeNode.disabled) {
                return false;
            }
            // 下面主动修改了node的halfCheck属性, 节点属性的判断依赖halfCheck，改之前就获取一下
            var status = treeNode.getCheckStatus();
            treeNode.halfCheck = false;
            if (treeNode.checked === true) {
                // 将展开的节点halfCheck设为false，解决展开节点存在halfCheck=true的情况 guy
                // 所有的半选状态都需要取消halfCheck=true的情况
                function track (children) {
                    BI.each(children, function (i, ch) {
                        ch.halfCheck = false;
                        track(ch.children);
                    });
                }

                track(treeNode.children);

                var treeObj = BI.$.fn.zTree.getZTreeObj(treeId);
                var nodes = treeObj.getSelectedNodes();
                BI.each(nodes, function (index, node) {
                    node.halfCheck = false;
                });
            }
            // 当前点击节点的状态是半选，且为true_part, 则将其改为false_part,使得点击半选后切换到的是全选
            if (status.half === true && status.checked === true) {
                treeNode.checked = false;
            }
        }

        function beforeExpand (treeId, treeNode) {
            if (treeNode.disabled) {
                return false;
            }
            self._beforeExpandNode(treeId, treeNode);
        }

        function onCheck (event, treeId, treeNode) {
            if (treeNode.disabled) {
                return false;
            }
            self._selectTreeNode(treeId, treeNode);
        }

        function onExpand (event, treeId, treeNode) {
            if (treeNode.disabled) {
                return false;
            }
            treeNode.halfCheck = false;
        }

        function onCollapse (event, treeId, treeNode) {
            if (treeNode.disabled) {
                return false;
            }
            treeNode.halfCheck = false;
        }

        return setting;
    },

    // 用来更新this.options.paras.selectedValues, 和ztree内部无关
    _selectTreeNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var parentValues = BI.deepClone(treeNode.parentValues || self._getParentValues(treeNode));
        var name = this._getNodeValue(treeNode);
        //        var values = parentValues.concat([name]);
        if (treeNode.checked === true) {
            this._addTreeNode(this.options.paras.selectedValues, parentValues, name, {});
        } else {
            var tNode = treeNode;
            var pNode = this._getTree(this.options.paras.selectedValues, parentValues);
            if (BI.isNotNull(pNode[name])) {
                delete pNode[name];
            }
            while (tNode != null && BI.isEmpty(pNode)) {
                parentValues = parentValues.slice(0, parentValues.length - 1);
                tNode = tNode.getParentNode();
                if (tNode != null) {
                    pNode = this._getTree(this.options.paras.selectedValues, parentValues);
                    name = this._getNodeValue(tNode);
                    delete pNode[name];
                }
            }
            this.options.paras.selectedValues = this._getJoinValue();
        }
        BI.AsyncTree.superclass._selectTreeNode.apply(self, arguments);
    },

    // 展开节点
    _beforeExpandNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var complete = function (d) {
            var nodes = d.items || [];
            if (nodes.length > 0) {
                callback(self._dealWidthNodes(nodes), !!d.hasNext);
            }
        };

        function callback(nodes, hasNext) {
            self.nodes.addNodes(treeNode, nodes);
            if (hasNext) {
                self.service.pushNodeList(treeNode.tId, getNodes);
            } else {
                self.service.removeNodeList(treeNode.tId);
            }

        }

        function getNodes(options) {
            // console.log(times);
            options = options || {};
            var parentValues = treeNode.parentValues || self._getParentValues(treeNode);
            var op = BI.extend({}, o.paras, {
                id: treeNode.id,
                times: options.times,
                parentValues: parentValues.concat(self._getNodeValue(treeNode)),
                checkState: treeNode.getCheckStatus()
            }, options);
            o.itemsCreator(op, complete);
        }

        // 展开节点会将halfCheck置为false以开启自动计算半选, 所以第一次展开节点的时候需要在置为false之前获取配置
        var checkState = treeNode.getCheckStatus();
        if (!treeNode.children) {
            setTimeout(function () {
                getNodes({
                    times: 1,
                    checkState: checkState
                });
            }, 17);
        }
    },

    // a,b 两棵树
    // a->b b->a 做两次校验, 构造一个校验后的map
    // e.g. 以a为基准，如果b没有此节点，则在map中添加。 如b有,且是全选的, 则在map中构造全选（为什么不添加a的值呢？ 因为这次是取并集）, 如果b中也有和a一样的存值，就递归
    _join: function (valueA, valueB) {
        var self = this;
        var map = {};
        track([], valueA, valueB);
        track([], valueB, valueA);

        function track (parent, node, compare) {
            BI.each(node, function (n, item) {
                if (BI.isNull(compare[n])) {
                    self._addTreeNode(map, parent, n, item);
                } else if (BI.isEmpty(compare[n])) {
                    self._addTreeNode(map, parent, n, item);
                } else {
                    track(parent.concat([n]), node[n], compare[n]);
                }
            });
        }

        return map;
    },

    hasChecked: function () {
        return !BI.isEmpty(this.options.paras.selectedValues) || BI.AsyncTree.superclass.hasChecked.apply(this, arguments);
    },

    _getJoinValue: function () {
        if (!this.nodes) {
            return this.options.paras.selectedValues || {};
        }
        var checkedValues = this._getSelectedValues();
        if (BI.isEmpty(checkedValues)) {
            return BI.deepClone(this.options.paras.selectedValues);
        }
        if (BI.isEmpty(this.options.paras.selectedValues)) {
            return checkedValues;
        }
        return this._join(checkedValues, this.options.paras.selectedValues);
    },

    getValue: function () {
        return this._getJoinValue();
    },

    // 生成树方法
    stroke: function (config) {
        delete this.options.keyword;
        this.service.clear();
        BI.extend(this.options.paras, config);
        var setting = this._configSetting();
        this._initTree(setting);
    }
});

BI.shortcut("bi.async_tree", BI.AsyncTree);
