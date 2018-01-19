/**
 * 表关联树
 *
 * Created by GUY on 2015/12/15.
 * @class BI.BranchRelation
 * @extends BI.Widget
 */
BI.BranchRelation = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.BranchRelation.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-branch-relation-tree",
            items: [],

            centerOffset: 0, // 重心偏移量
            direction: BI.Direction.Bottom,
            align: BI.VerticalAlign.Top
        });
    },

    _init: function () {
        BI.BranchRelation.superclass._init.apply(this, arguments);
    },

    mounted: function () {
        this.populate(this.options.items);
    },

    // 树分层
    _stratification: function () {
        var levels = [];
        this.tree.recursion(function (node, route) {
            // node.isRoot = route.length <= 1;
            node.leaf = node.isLeaf();
            if (!levels[route.length - 1]) {
                levels[route.length - 1] = [];
            }
            levels[route.length - 1].push(node);
        });
        return levels;
    },

    // 计算所有节点的叶子结点个数
    _calculateLeaves: function () {
        var count = 0;

        function track (node) {
            var c = 0;
            if (node.isLeaf()) {
                return 1;
            }
            BI.each(node.getChildren(), function (i, child) {
                c += track(child);
            });
            node.set("leaves", c);
            return c;
        }

        count = track(this.tree.getRoot());
        return count;
    },

    // 树平移
    _translate: function (levels) {
        var adjust = [];
        var maxLevel = levels.length;
        BI.each(levels, function (i, nodes) {
            if (!adjust[i]) {
                adjust[i] = [];
            }
            BI.each(nodes, function (j, node) {
                if (node.isLeaf() && i < maxLevel - 1) {
                    var newNode = new BI.Node(BI.UUID());
                    // newNode.isEmptyRoot = node.isRoot || node.isEmptyRoot;
                    newNode.isNew = true;
                    // 把node向下一层移
                    var tar = 0;
                    if (j > 0) {
                        var c = nodes[j - 1].getLastChild();
                        tar = levels[i + 1].indexOf(c) + 1;
                    }
                    levels[i + 1].splice(tar, 0, node);
                    // 新增一个临时树节点
                    var index = node.parent.getChildIndex(node.id);
                    node.parent.removeChildByIndex(index);
                    node.parent.addChild(newNode, index);
                    newNode.addChild(node);
                    adjust[i].push(newNode);
                    nodes[j] = newNode;
                } else {
                    adjust[i].push(node);
                }
            });
        });
        return adjust;
    },

    // 树补白
    _fill: function (levels) {
        var adjust = [];
        var maxLevel = levels.length;
        BI.each(levels, function (i, nodes) {
            if (!adjust[i]) {
                adjust[i] = [];
            }
            BI.each(nodes, function (j, node) {
                if (node.isLeaf() && i < maxLevel - 1) {
                    var newNode = new BI.Node(BI.UUID());
                    newNode.leaf = true;
                    newNode.width = node.width;
                    newNode.height = node.height;
                    newNode.isNew = true;
                    // 把node向下一层移
                    var tar = 0;
                    if (j > 0) {
                        var c = nodes[j - 1].getLastChild();
                        tar = levels[i + 1].indexOf(c) + 1;
                    }
                    levels[i + 1].splice(tar, 0, newNode);
                    // 新增一个临时树节点
                    node.addChild(newNode);
                }
                adjust[i].push(node);
            });
        });
        return adjust;
    },

    // 树调整
    _adjust: function (adjust) {
        while (true) {
            var isAllNeedAjust = false;
            BI.backEach(adjust, function (i, nodes) {
                BI.each(nodes, function (j, node) {
                    if (!node.isNew) {
                        var needAdjust = true;
                        BI.any(node.getChildren(), function (k, n) {
                            if (!n.isNew) {
                                needAdjust = false;
                                return true;
                            }
                        });
                        if (!node.isLeaf() && needAdjust === true) {
                            var allChilds = [];
                            BI.each(node.getChildren(), function (k, n) {
                                allChilds = allChilds.concat(n.getChildren());
                            });
                            node.removeAllChilds();
                            BI.each(allChilds, function (k, c) {
                                node.addChild(c);
                            });
                            var newNode = new BI.Node(BI.UUID());
                            // newNode.isEmptyRoot = node.isRoot || node.isEmptyRoot;
                            newNode.isNew = true;
                            var index = node.parent.getChildIndex(node.id);
                            node.parent.removeChildByIndex(index);
                            node.parent.addChild(newNode, index);
                            newNode.addChild(node);
                            isAllNeedAjust = true;
                        }
                    }
                });
            });
            if (isAllNeedAjust === false) {
                break;
            } else {// 树重构
                adjust = this._stratification();
            }
        }
        return adjust;
    },

    _calculateWidth: function () {
        var o = this.options;
        var width = 0;

        function track1 (node) {
            var w = 0;
            if (node.isLeaf()) {
                return node.width;
            }
            BI.each(node.getChildren(), function (i, child) {
                w += track1(child);
            });
            return w;
        }

        function track2 (node) {
            var w = 0;
            if (node.isLeaf()) {
                return node.height;
            }
            BI.each(node.getChildren(), function (i, child) {
                w += track2(child);
            });
            return w;
        }

        if (this._isVertical()) {
            width = track1(this.tree.getRoot());
        } else {
            width = track2(this.tree.getRoot());
        }

        return width;
    },

    _isVertical: function () {
        var o = this.options;
        return o.direction === BI.Direction.Top || o.direction === BI.Direction.Bottom;
    },

    _calculateHeight: function () {
        var o = this.options;
        var height = 0;

        function track1 (node) {
            var h = 0;
            BI.each(node.getChildren(), function (i, child) {
                h = Math.max(h, track1(child));
            });
            return h + (node.height || 0);
        }

        function track2 (node) {
            var h = 0;
            BI.each(node.getChildren(), function (i, child) {
                h = Math.max(h, track2(child));
            });
            return h + (node.width || 0);
        }

        if (this._isVertical()) {
            height = track1(this.tree.getRoot());
        } else {
            height = track2(this.tree.getRoot());
        }
        return height;
    },

    _calculateXY: function (levels) {
        var o = this.options;
        var width = this._calculateWidth();
        var height = this._calculateHeight();
        var levelCount = levels.length;
        var allLeavesCount = this._calculateLeaves();
        // 计算坐标
        var xy = {};
        var levelHeight = height / levelCount;
        BI.each(levels, function (i, nodes) {
            // 计算权重
            var weights = [];
            BI.each(nodes, function (j, node) {
                weights[j] = (node.get("leaves") || 1) / allLeavesCount;
            });
            BI.each(nodes, function (j, node) {
                // 求前j个元素的权重
                var weight = BI.sum(weights.slice(0, j));
                // 求坐标
                var x = weight * width + weights[j] * width / 2;
                var y = i * levelHeight + levelHeight / 2;
                xy[node.id] = {x: x, y: y};
            });
        });
        return xy;
    },

    _stroke: function (levels, xy) {
        var height = this._calculateHeight();
        var levelCount = levels.length;
        var levelHeight = height / levelCount;
        var self = this, o = this.options;
        switch (o.direction) {
            case BI.Direction.Top:
                BI.each(levels, function (i, nodes) {
                    BI.each(nodes, function (j, node) {
                        if (node.getChildrenLength() > 0 && !node.leaf) {
                            var path = "";
                            var start = xy[node.id];
                            var split = start.y + levelHeight / 2;
                            path += "M" + start.x + "," + (start.y + o.centerOffset) + "L" + start.x + "," + split;
                            var end = [];
                            BI.each(node.getChildren(), function (t, c) {
                                var e = end[t] = xy[c.id];
                                path += "M" + e.x + "," + (e.y + o.centerOffset) + "L" + e.x + "," + split;
                            });
                            if (end.length > 0) {
                                path += "M" + BI.first(end).x + "," + split + "L" + BI.last(end).x + "," + split;
                            }
                            self.svg.path(path).attr("stroke", "#d4dadd");
                        }
                    });
                });
                break;
            case BI.Direction.Bottom:
                BI.each(levels, function (i, nodes) {
                    BI.each(nodes, function (j, node) {
                        if (node.getChildrenLength() > 0 && !node.leaf) {
                            var path = "";
                            var start = xy[node.id];
                            var split = start.y - levelHeight / 2;
                            path += "M" + start.x + "," + (start.y - o.centerOffset) + "L" + start.x + "," + split;
                            var end = [];
                            BI.each(node.getChildren(), function (t, c) {
                                var e = end[t] = xy[c.id];
                                path += "M" + e.x + "," + (e.y - o.centerOffset) + "L" + e.x + "," + split;
                            });
                            if (end.length > 0) {
                                path += "M" + BI.first(end).x + "," + split + "L" + BI.last(end).x + "," + split;
                            }
                            self.svg.path(path).attr("stroke", "#d4dadd");
                        }
                    });
                });
                break;
            case BI.Direction.Left:
                BI.each(levels, function (i, nodes) {
                    BI.each(nodes, function (j, node) {
                        if (node.getChildrenLength() > 0 && !node.leaf) {
                            var path = "";
                            var start = xy[node.id];
                            var split = start.y + levelHeight / 2;
                            path += "M" + (start.y + o.centerOffset) + "," + start.x + "L" + split + "," + start.x;
                            var end = [];
                            BI.each(node.getChildren(), function (t, c) {
                                var e = end[t] = xy[c.id];
                                path += "M" + (e.y + o.centerOffset) + "," + e.x + "L" + split + "," + e.x;
                            });
                            if (end.length > 0) {
                                path += "M" + split + "," + BI.first(end).x + "L" + split + "," + BI.last(end).x;
                            }
                            self.svg.path(path).attr("stroke", "#d4dadd");
                        }
                    });
                });
                break;
            case BI.Direction.Right:
                BI.each(levels, function (i, nodes) {
                    BI.each(nodes, function (j, node) {
                        if (node.getChildrenLength() > 0 && !node.leaf) {
                            var path = "";
                            var start = xy[node.id];
                            var split = start.y - levelHeight / 2;
                            path += "M" + (start.y - o.centerOffset) + "," + start.x + "L" + split + "," + start.x;
                            var end = [];
                            BI.each(node.getChildren(), function (t, c) {
                                var e = end[t] = xy[c.id];
                                path += "M" + (e.y - o.centerOffset) + "," + e.x + "L" + split + "," + e.x;
                            });
                            if (end.length > 0) {
                                path += "M" + split + "," + BI.first(end).x + "L" + split + "," + BI.last(end).x;
                            }
                            self.svg.path(path).attr("stroke", "#d4dadd");
                        }
                    });
                });
                break;
        }
    },

    _createBranches: function (levels) {
        var self = this, o = this.options;
        if (o.direction === BI.Direction.Bottom || o.direction === BI.Direction.Right) {
            levels = levels.reverse();
        }
        var xy = this._calculateXY(levels);
        // 画图
        this._stroke(levels, xy);
    },

    _isNeedAdjust: function () {
        var o = this.options;
        return o.direction === BI.Direction.Top && o.align === BI.VerticalAlign.Bottom || o.direction === BI.Direction.Bottom && o.align === BI.VerticalAlign.Top
            || o.direction === BI.Direction.Left && o.align === BI.HorizontalAlign.Right || o.direction === BI.Direction.Right && o.align === BI.HorizontalAlign.Left;
    },

    setValue: function (value) {

    },

    getValue: function () {

    },

    _transformToTreeFormat: function (sNodes) {
        var i, l;
        if (!sNodes) {
            return [];
        }

        if (BI.isArray(sNodes)) {
            var r = [];
            var tmpMap = [];
            for (i = 0, l = sNodes.length; i < l; i++) {
                tmpMap[sNodes[i].id] = sNodes[i];
            }
            for (i = 0, l = sNodes.length; i < l; i++) {
                if (tmpMap[sNodes[i].pId] && sNodes[i].id != sNodes[i].pId) {
                    if (!tmpMap[sNodes[i].pId].children) {
                        tmpMap[sNodes[i].pId].children = [];
                    }
                    tmpMap[sNodes[i].pId].children.push(sNodes[i]);
                } else {
                    r.push(sNodes[i]);
                }
            }
            return r;
        }
        return [sNodes];

    },

    populate: function (items) {
        var self = this, o = this.options;
        o.items = items || [];
        this.empty();
        items = this._transformToTreeFormat(o.items);
        this.tree = new BI.Tree();
        this.tree.initTree(items);

        this.svg = BI.createWidget({
            type: "bi.svg"
        });

        // 树分层
        var levels = this._stratification();

        if (this._isNeedAdjust()) {
            // 树平移
            var adjust = this._translate(levels);
            // 树调整
            adjust = this._adjust(adjust);

            this._createBranches(adjust);
        } else {
            var adjust = this._fill(levels);

            this._createBranches(adjust);
        }

        var container = BI.createWidget({
            type: "bi.layout",
            width: this._isVertical() ? this._calculateWidth() : this._calculateHeight(),
            height: this._isVertical() ? this._calculateHeight() : this._calculateWidth()
        });
        BI.createWidget({
            type: "bi.absolute",
            element: container,
            items: [{
                el: this.svg,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }]
        });
        if (this._isVertical()) {
            items = [{
                type: "bi.handstand_branch_tree",
                expander: {
                    direction: o.direction
                },
                el: {
                    layouts: [{
                        type: "bi.horizontal_adapt",
                        verticalAlign: o.align
                    }]
                },
                items: items
            }];
        } else {
            items = [{
                type: "bi.branch_tree",
                expander: {
                    direction: o.direction
                },
                el: {
                    layouts: [{
                        type: "bi.vertical"
                    }, {
                        type: o.align === BI.HorizontalAlign.Left ? "bi.left" : "bi.right"
                    }]
                },
                items: items
            }];
        }
        BI.createWidget({
            type: "bi.adaptive",
            element: container,
            items: items
        });
        BI.createWidget({
            type: "bi.center_adapt",
            scrollable: true,
            element: this,
            items: [container]
        });
    }
});
BI.BranchRelation.EVENT_CHANGE = "BranchRelation.EVENT_CHANGE";
BI.shortcut("bi.branch_relation", BI.BranchRelation);