/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/1/8
 * 提供节点滚动加载方式
 */

!(function () {
    BI.TreeRenderScrollService = BI.inherit(BI.OB, {
        _init: function () {
            this.nodeLists = {};

            this.id = this.options.id;
            // renderService是否已经注册了滚动
            this.hasBinded = false;

            this.container = this.options.container;
        },

        _getNodeListBounds: function (tId) {
            var nodeList = this.options.subNodeListGetter(tId)[0];
            return {
                top: nodeList.offsetTop,
                left: nodeList.offsetLeft,
                width: nodeList.offsetWidth,
                height: nodeList.offsetHeight
            }
        },

        _getTreeContainerBounds: function () {
            var nodeList = this.container[0];
            if (BI.isNotNull(nodeList)) {
                return {
                    top: nodeList.offsetTop + nodeList.scrollTop,
                    left: nodeList.offsetLeft + nodeList.scrollLeft,
                    width: nodeList.offsetWidth,
                    height: nodeList.offsetHeight
                };
            }
            return {};
        },

        _canNodePopulate: function (tId) {
            if (this.nodeLists[tId].locked) {
                return false;
            }
            // 获取ul, 即子节点列表的bounds
            // 是否需要继续加载，只需要看子节点列表的下边界与container是否无交集
            var bounds = this._getNodeListBounds(tId);
            var containerBounds = this._getTreeContainerBounds(tId);
            // ul底部是不是漏出来了
            if (bounds.top + bounds.height < containerBounds.top + containerBounds.height) {
                return true;
            }
            return false;
        },

        _isNodeInVisible: function (tId) {
            var nodeList = this.options.subNodeListGetter(tId);
            return nodeList.length === 0 || nodeList.css("display") === "none";
        },

        pushNodeList: function (tId, populate) {
            var self = this;
            if (!BI.has(this.nodeLists, tId)) {
                this.nodeLists[tId] = {
                    populate: BI.debounce(populate, 0),
                    options: {
                        times: 1
                    },
                    // 在上一次请求返回前, 通过滚动再次触发加载的时候, 不应该认为是下一次分页, 需要等待上次请求返回
                    // 以保证顺序和请求次数的完整
                    locked: false
                };
            } else {
                this.nodeLists[tId].locked = false;
            }
            if(!this.hasBinded) {
                // console.log("绑定事件");
                this.hasBinded = true;
                this.container && this.container.on("scroll", BI.debounce(function () {
                    self.refreshAllNodes();
                }, 30));
            }
        },

        refreshAllNodes: function () {
            var self = this;
            BI.each(this.nodeLists, function (tId) {
                // 不展开的节点就不看了
                !self._isNodeInVisible(tId) && self.refreshNodes(tId);
            });
        },

        refreshNodes: function (tId) {
            if (this._canNodePopulate(tId)) {
                var nodeList = this.nodeLists[tId];
                nodeList.options.times++;
                nodeList.locked = true;
                nodeList.populate({
                    times: nodeList.options.times
                });
            }
        },

        removeNodeList: function (tId) {
            delete this.nodeLists[tId];
            if (BI.size(this.nodeLists) === 0) {
                this.clear();
            }
        },

        clear: function () {
            var self = this;
            BI.each(this.nodeLists, function (tId) {
                self.removeNodeList(tId);
            });
            this.nodeLists = {};
            // console.log("解绑事件");
            this.container.off("scroll");
            this.hasBinded = false;
        }
    });
})();