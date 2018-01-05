/**
 * 关联视图
 *
 * Created by GUY on 2015/12/22.
 * @class BI.RelationView
 * @extends BI.Widget
 */
BI.RelationView = BI.inherit(BI.Widget, {

    _const: {
        lineColor: "#c4c6c6",
        selectLineColor: "#009de3"
    },

    _defaultConfig: function () {
        return BI.extend(BI.RelationView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-relation-view",
            items: []
        });
    },

    _init: function () {
        BI.RelationView.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _calculateWidths: function () {
        var widths = [];
        BI.each(this.views, function (i, items) {
            BI.each(items, function (j, obj) {
                if (!widths[j]) {
                    widths[j] = BI.MIN;
                }
                widths[j] = Math.max(widths[j], obj.getWidth());
            });
        });
        return widths;
    },

    _calculateHeights: function () {
        var heights = BI.makeArray(BI.size(this.views), BI.MIN);
        BI.each(this.views, function (i, items) {
            BI.each(items, function (j, obj) {
                heights[i] = Math.max(heights[i], obj.getHeight());
            });
        });
        return heights;
    },

    _hoverIn: function (target) {
        var self = this, c = this._const;
        BI.each(this.relations, function (start, rs) {
            BI.each(rs, function (end, relation) {
                if (relation[0].primary.value === target || relation[0].foreign.value === target) {
                    self.lines[start][end].attr("stroke", c.selectLineColor).toFront();
                    self.storeViews[start].setValue(relation[0].primary.value);
                    self.storeViews[end].setValue(relation[0].foreign.value);
                }
            });
        });
    },

    _hoverOut: function (target) {
        var self = this, c = this._const;
        BI.each(this.relations, function (start, rs) {
            BI.each(rs, function (end, relation) {
                if (relation[0].primary.value === target || relation[0].foreign.value === target) {
                    self.lines[start][end].attr("stroke", c.lineColor);
                    self.storeViews[start].setValue([]);
                    self.storeViews[end].setValue([]);
                }
            });
        });
    },

    previewRelationTables: function (relationTables, show) {
        if (!show) {
            BI.each(this.storeViews, function (i, view) {
                view.toggleRegion(true);
                view.setPreviewSelected(false);
            });
            BI.each(this.lines, function (i, lines) {
                BI.each(lines, function (j, line) {
                    line.show();
                });
            });
            return;
        }
        BI.each(this.storeViews, function (id, view) {
            if (!relationTables.contains(id)) {
                view.toggleRegion(false);
            } else {
                view.setPreviewSelected(true);
            }
        });
        BI.each(this.lines, function (id, lines) {
            BI.each(lines, function (cId, line) {
                if (!relationTables.contains(id) || !relationTables.contains(cId)) {
                    line.hide();
                }
            });
        });
    },

    doRedMark: function (keyword) {
        BI.each(this.storeViews, function (idx, view) {
            view.doRedMark(keyword);
        });
    },

    populate: function (items) {
        var self = this, o = this.options, c = this._const;
        o.items = items || [];
        this.empty();
        this.svg = BI.createWidget({
            type: "bi.svg"
        });

        // 算出所有的区域和关联
        var regions = this.regions = {}, relations = this.relations = {};
        BI.each(items, function (i, item) {
            var pr = item.primary.region, fr = item.foreign && item.foreign.region;
            if (pr && !relations[pr]) {
                relations[pr] = {};
            }
            if (pr && fr && !relations[pr][fr]) {
                relations[pr][fr] = [];
            }
            if (pr && !regions[pr]) {
                regions[pr] = [];
            }
            if (fr && !regions[fr]) {
                regions[fr] = [];
            }
            if (pr && !BI.deepContains(regions[pr], item.primary)) {
                regions[pr].push(item.primary);
            }
            if (fr && !BI.deepContains(regions[fr], item.foreign)) {
                regions[fr].push(item.foreign);
            }
            pr && fr && relations[pr][fr].push(item);
        });
        // 求拓扑
        var topology = [];
        var rs = BI.clone(regions), store = {};
        while (!BI.isEmpty(rs)) {
            var clone = BI.clone(rs);
            BI.each(o.items, function (i, item) {
                if (!store[item.primary.region]) {
                    delete clone[item.foreign && item.foreign.region];
                }
            });
            topology.push(BI.keys(clone));
            BI.extend(store, clone);
            BI.each(clone, function (k, v) {
                delete rs[k];
            });
        }
        // 构建视图
        var views = this.views = {}, storeViews = this.storeViews = {}, indexes = this.indexes = {};
        var verticals = [];
        BI.each(topology, function (i, items) {
            if (!views[i]) {
                views[i] = {};
            }
            var horizontal = [];
            BI.each(items, function (j, region) {
                var items = regions[region];
                views[i][j] = storeViews[region] = BI.createWidget({
                    type: "bi.relation_view_region_container",
                    value: region,
                    header: items[0].regionTitle,
                    text: items.length > 0 ? items[0].regionText : "",
                    handler: items.length > 0 ? items[0].regionHandler : BI.emptyFn,
                    items: items,
                    disabled: items[0].disabled,
                    belongPackage: items.length > 0 ? items[0].belongPackage : true
                });
                if (BI.isNotNull(items[0]) && BI.isNotNull(items[0].keyword)) {
                    views[i][j].doRedMark(items[0].keyword);
                }
                views[i][j].on(BI.RelationViewRegionContainer.EVENT_HOVER_IN, function (v) {
                    self._hoverIn(v);
                });
                views[i][j].on(BI.RelationViewRegionContainer.EVENT_HOVER_OUT, function (v) {
                    self._hoverOut(v);
                });
                views[i][j].on(BI.RelationViewRegionContainer.EVENT_PREVIEW, function (v) {
                    self.fireEvent(BI.RelationView.EVENT_PREVIEW, region, v);
                });
                indexes[region] = {i: i, j: j};
                horizontal.push(views[i][j]);
            });
            verticals.push({
                type: "bi.horizontal",
                items: horizontal
            });
        });

        // 求每一行的高度
        var heights = this._calculateHeights();

        // 求每一列的宽度
        var widths = this._calculateWidths();

        // 求相对宽度和高度
        var offsetWidths = [0], offsetHeights = [0];
        BI.each(heights, function (i, h) {
            if (i === 0) {
                return;
            }
            offsetHeights[i] = offsetHeights[i - 1] + heights[i - 1];
        });
        BI.each(widths, function (i, w) {
            if (i === 0) {
                return;
            }
            offsetWidths[i] = offsetWidths[i - 1] + widths[i - 1];
        });

        // 画线
        var lines = this.lines = {};// 缓存所有的线
        BI.each(relations, function (start, rs) {
            BI.each(rs, function (end, relation) {
                var startIndex = indexes[start], endIndex = indexes[end];
                var top = 0, right = 1, bottom = 2, left = 3;
                var startDirection = bottom, endDirection = top;
                // if (startIndex.j > endIndex.j) {
                //     startDirection = left;
                //     endDirection = right;
                // } else if (startIndex.j < endIndex.j) {
                //     startDirection = right;
                //     endDirection = left;
                // } else if (startIndex.i < endIndex.i) {
                //     startDirection = bottom;
                //     endDirection = top;
                // } else if (startIndex.i > endIndex.i) {
                //     startDirection = top;
                //     endDirection = bottom;
                // }
                var draw = function (i, j, direction, isForeign) {
                    var x = offsetWidths[j] + (widths[j] - views[i][j].getWidth()) / 2;
                    var y = offsetHeights[i];
                    var path = "", position;
                    switch (direction) {
                        case top:
                            position = isForeign ? views[i][j].getTopRightPosition() : views[i][j].getTopLeftPosition();
                            x += position.x;
                            y += position.y;
                            path = "M" + x + "," + y + "L" + x + "," + (y - 10);
                            y -= 10;
                            break;
                        case right:
                            position = views[i][j].getRightPosition();
                            x += position.x;
                            y += position.y;
                            path = "M" + x + "," + y + "L" + (x + 10) + "," + y;
                            x += 10;
                            break;
                        case bottom:
                            position = views[i][j].getBottomPosition();
                            x += position.x;
                            y += position.y;
                            path = "M" + x + "," + y + "L" + x + "," + (y + 10);
                            y += 10;
                            break;
                        case left:
                            position = views[i][j].getLeftPosition();
                            x += position.x;
                            y += position.y;
                            path = "M" + x + "," + y + "L" + (x - 10) + "," + y;
                            x -= 10;
                            break;
                    }
                    return {x: x, y: y, path: path};
                };
                var path = "";
                var si = draw(startIndex.i, startIndex.j, startDirection);
                var ei = draw(endIndex.i, endIndex.j, endDirection, true);
                path += si.path + ei.path;
                if (!lines[start]) {
                    lines[start] = {};
                }
                path += "M" + si.x + "," + si.y + "L" + ei.x + "," + ei.y;
                var line = lines[start][end] = self.svg.path(path)
                    .attr({stroke: c.lineColor, "stroke-width": "2"})
                    .hover(function () {
                        line.attr("stroke", c.selectLineColor).toFront();
                        storeViews[start].setValue(relation[0].primary.value);
                        storeViews[end].setValue(relation[0].foreign.value);
                    }, function () {
                        line.attr("stroke", c.lineColor);
                        storeViews[start].setValue([]);
                        storeViews[end].setValue([]);
                    });
            });
        });
        var container = BI.createWidget();
        BI.createWidget({
            type: "bi.vertical",
            element: container,
            items: verticals
        });
        BI.createWidget({
            type: "bi.absolute",
            element: container,
            items: [{
                el: this.svg,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });

        BI.createWidget({
            type: "bi.center_adapt",
            scrollable: true,
            element: this,
            items: [container]
        });
    }
});
BI.RelationView.EVENT_CHANGE = "RelationView.EVENT_CHANGE";
BI.RelationView.EVENT_PREVIEW = "EVENT_PREVIEW";
BI.shortcut("bi.relation_view", BI.RelationView);