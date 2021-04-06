/**
 * author: windy
 * 继承自treeView, 此树的父子节点的勾选状态互不影响, 此树不会有半选节点
 * 返回value格式为[["A"], ["A", "a"]]表示勾选了A且勾选了a
 * @class BI.ListTreeView
 * @extends BI.TreeView
 */
BI.ListTreeView = BI.inherit(BI.TreeView, {

    _constants: {
        SPLIT: "<|>"
    },

    _defaultConfig: function () {
        return BI.extend(BI.ListTreeView.superclass._defaultConfig.apply(this, arguments), {
            value: {}
        });
    },
    _init: function () {
        BI.ListTreeView.superclass._init.apply(this, arguments);
        var o = this.options;
        if(BI.isNotNull(o.value)) {
            this.setSelectedValue(o.value);
        }
    },

    // 配置属性
    _configSetting: function () {
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: false
            },
            check: {
                enable: true,
                chkboxType: {Y: "", N: ""}
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
                onCheck: onCheck,
                onClick: onClick
            }
        };

        function onClick (event, treeId, treeNode) {
            var zTree = BI.$.fn.zTree.getZTreeObj(treeId);
            var checked = treeNode.checked;
            self._checkValue(treeNode, !checked);
            zTree.checkNode(treeNode, !checked, true, true);
        }

        function onCheck (event, treeId, treeNode) {
            self._selectTreeNode(treeId, treeNode);
        }

        return setting;
    },

    _selectTreeNode: function (treeId, treeNode) {
        this._checkValue(treeNode, treeNode.checked);
        BI.ListTreeView.superclass._selectTreeNode.apply(this, arguments);
    },

    _transArrayToMap: function (treeArrays) {
        var self = this;
        var map = {};
        BI.each(treeArrays, function (idx, array) {
            var key = array.join(self._constants.SPLIT);
            map[key] = true;
        });
        return map;
    },

    _transMapToArray: function (treeMap) {
        var self = this;
        var array = [];
        BI.each(treeMap, function (key) {
            var item = key.split(self._constants.SPLIT);
            array.push(item);
        });
        return array;
    },

    _checkValue: function (treeNode, checked) {
        var key = BI.concat(this._getParentValues(treeNode), this._getNodeValue(treeNode)).join(this._constants.SPLIT);
        if(checked) {
            this.storeValue[key] = true;
        } else {
            delete this.storeValue[key];
        }
    },

    setSelectedValue: function (value) {
        this.options.paras.selectedValues = value || [];
        this.storeValue = this._transArrayToMap(value);
    },

    getValue: function () {
        return this._transMapToArray(this.storeValue);
    }
});

BI.shortcut("bi.list_tree_view", BI.ListTreeView);