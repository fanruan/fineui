/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/1/8
 * 提供节点分页加载方式
 */

!(function () {
    BI.TreeRenderPageService = BI.inherit(BI.OB, {
        _init: function () {
            this.nodeLists = {};
        },

        _getLoadingBar: function(tId) {
            var self = this;
            var tip = BI.createWidget({
                type: "bi.loading_bar",
                height: 25,
                handler: function () {
                    self.refreshNodes(tId);
                }
            });
            tip.setLoaded();
            return tip;
        },

        pushNodeList: function (tId, populate) {
            var self = this, o = this.options;
            var tip = this._getLoadingBar(tId);
            if (!BI.has(this.nodeLists, tId)) {
                this.nodeLists[tId] = {
                    populate: BI.debounce(populate, 0),
                    options: {
                        times: 1
                    },
                    loadWidget: tip
                };
            } else {
                this.nodeLists[tId].loadWidget.destroy();
                this.nodeLists[tId].loadWidget = tip;
            }
            BI.createWidget({
                type: "bi.vertical",
                element: o.subNodeListGetter(tId),
                items: [tip]
            });
        },

        refreshNodes: function (tId) {
            var nodeList = this.nodeLists[tId];
            nodeList.options.times++;
            nodeList.loadWidget.setLoading();
            nodeList.populate({
                times: nodeList.options.times
            });
        },

        removeNodeList: function (tId) {
            this.nodeLists[tId] && this.nodeLists[tId].loadWidget.destroy();
            this.nodeLists[tId] && (this.nodeLists[tId].loadWidget = null);
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
        }
    });

})();