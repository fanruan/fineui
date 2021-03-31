/**
 * guy
 * 局部树，两个请求树， 第一个请求构造树，第二个请求获取节点
 * @class BI.ListPartTree
 * @extends BI.AsyncTree
 */
BI.ListPartTree = BI.inherit(BI.ListAsyncTree, {
    _defaultConfig: function () {
        return BI.extend(BI.ListPartTree.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.ListPartTree.superclass._init.apply(this, arguments);
    },

    _loadMore: function () {
        var self = this, o = this.options;
        var op = BI.extend({}, o.paras, {
            type: BI.TreeView.REQ_TYPE_INIT_DATA,
            times: ++this.times
        });
        this.tip.setLoading();
        o.itemsCreator(op, function (d) {
            var hasNext = !!d.hasNext, nodes = d.items || [];
            o.paras.lastSearchValue = d.lastSearchValue;
            if (self._stop === true) {
                return;
            }
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

    _initTree: function (setting, keyword) {
        var self = this, o = this.options;
        this.times = 1;
        var tree = this.tree;
        tree.empty();
        self.tip.setVisible(false);
        this.loading();
        var op = BI.extend({}, o.paras, {
            type: BI.TreeView.REQ_TYPE_INIT_DATA,
            times: this.times
        });
        var complete = function (d) {
            if (self._stop === true || keyword != o.paras.keyword) {
                return;
            }
            var hasNext = !!d.hasNext, nodes = d.items || [];
            o.paras.lastSearchValue = d.lastSearchValue;
            // 没有请求到数据也要初始化空树, 如果不初始化, 树就是上一次构造的树, 节点信息都是过期的
            callback(nodes.length > 0 ? self._dealWidthNodes(nodes) : []);
            self.setTipVisible(nodes.length <= 0);
            self.loaded();
            if (!hasNext) {
                self.tip.invisible();
            } else {
                self.tip.setLoaded();
            }
            self.fireEvent(BI.Events.AFTERINIT);
        };

        function callback (nodes) {
            if (self._stop === true) {
                return;
            }
            self.nodes = BI.$.fn.zTree.init(tree.element, setting, nodes);
        }

        BI.delay(function () {
            o.itemsCreator(op, complete);
        }, 100);
    },

    // 生成树方法
    stroke: function (config) {
        var o = this.options;
        delete o.paras.keyword;
        BI.extend(o.paras, config);
        delete o.paras.lastSearchValue;
        var setting = this._configSetting();
        this._initTree(setting, o.paras.keyword);
    }
});

BI.shortcut("bi.list_part_tree", BI.ListPartTree);