/**
 * 带有方向的pathchooser
 *
 * Created by GUY on 2016/4/21.
 * @class BI.DirectionPathChooser
 * @extends BI.Widget
 */
BI.DirectionPathChooser = BI.inherit(BI.Widget, {

    _const: {
        lineColor: "#808080",
        selectLineColor: "#009de3"
    },

    _defaultConfig: function () {
        return BI.extend(BI.DirectionPathChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-excel-table",
            items: []
        });
    },

    _init: function () {
        BI.DirectionPathChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.pathChooser = BI.createWidget({
            type: "bi.path_chooser",
            element: this,
            items: o.items
        });
        this.pathChooser.on(BI.PathChooser.EVENT_CHANGE, function (start, index) {
            //self._unselectAllArrows();
            self._setValue(start, index);
            self.fireEvent(BI.DirectionPathChooser.EVENT_CHANGE);
        });
        this._drawArrows();

    },

    _unselectAllArrows: function () {
        var self = this, lineColor = this._const.lineColor;
        BI.each(this.arrows, function (region, rs) {
            BI.each(rs, function (idx, arrows) {
                BI.each(arrows, function (i, arrow) {
                    arrow.attr({fill: lineColor, stroke: lineColor});
                });
            });
        });
    },

    _drawOneArrow: function (dot, direction) {
        //0,1,2,3  上右下左
        var lineColor = this._const.lineColor;
        var selectLineColor = this._const.selectLineColor;
        var svg = this.pathChooser.svg;
        var path = "";
        switch (direction) {
            case 0:
                path = "M" + dot.x + "," + dot.y
                    + "L" + (dot.x - 3) + "," + (dot.y + 5)
                    + "L" + (dot.x + 3) + "," + (dot.y + 5)
                    + "L" + dot.x + "," + dot.y;
                break;
            case 1:
                path = "M" + dot.x + "," + dot.y
                    + "L" + (dot.x - 5) + "," + (dot.y - 3)
                    + "L" + (dot.x - 5) + "," + (dot.y + 3)
                    + "L" + dot.x + "," + dot.y;
                break;
            case 2:
                path = "M" + dot.x + "," + dot.y
                    + "L" + (dot.x - 3) + "," + (dot.y - 5)
                    + "L" + (dot.x + 3) + "," + (dot.y - 5)
                    + "L" + dot.x + "," + dot.y;
                break;
            case 3:
                path = "M" + dot.x + "," + dot.y
                    + "L" + (dot.x + 5) + "," + (dot.y - 3)
                    + "L" + (dot.x + 5) + "," + (dot.y + 3)
                    + "L" + dot.x + "," + dot.y;
                break;
        }
        return svg.path(path).attr({fill: lineColor, stroke: lineColor});
    },

    _drawArrows: function () {
        var self = this, o = this.options;
        var routes = this.pathChooser.routes;
        var pathes = this.pathChooser.pathes;
        var store = this.pathChooser.store;
        this.arrows = {};
        BI.each(routes, function (region, ps) {
            self.arrows[region] = [];
            BI.each(ps, function (idx, path) {
                self.arrows[region][idx] = [];
                var dots = pathes[region][idx];
                BI.each(dots, function (i, dot) {
                    if (i > 0 && i < dots.length - 1) {
                        var arrow;
                        if (dot.y === dots[i - 1].y) {
                            if (dots[i + 1].y != dot.y) {
                                if (store[path[path.length - 2]].direction === -1) {
                                    if (i - 1 > 0) {
                                        arrow = self._drawOneArrow(dots[i - 1], 3);
                                    }
                                } else {
                                    arrow = self._drawOneArrow(dots[i], 1);
                                }
                            }
                        } else if (dot.x === dots[i - 1].x) {
                            if (dot.y > dots[i - 1].y) {
                                if (store[BI.first(path)].direction === -1) {
                                    arrow = self._drawOneArrow(dots[i - 1], 0);
                                } else {
                                    arrow = self._drawOneArrow(dot, 2);
                                }
                            } else {
                                if (store[path[path.length - 2]].direction === -1) {
                                    arrow = self._drawOneArrow(dots[i - 1], 2);
                                } else {
                                    arrow = self._drawOneArrow(dot, 0);
                                }
                            }
                        }
                        if (arrow) {
                            self.arrows[region][idx].push(arrow);
                        }
                    }
                });
                BI.each(path, function (i, node) {
                    if (i !== 0) {
                        var arrow;
                        var from = path[i - 1];
                        if (store[from].direction === -1) {
                            var regionIndex = self.pathChooser.getRegionIndexById(from);
                            var x = getXoffsetByRegionIndex(regionIndex, -1);
                            var y = getYByXoffset(dots, x);
                            arrow = self._drawOneArrow({x: x, y: y}, 3);
                        } else {
                            var regionIndex = self.pathChooser.getRegionIndexById(node);
                            var x = getXoffsetByRegionIndex(regionIndex);
                            var y = getYByXoffset(dots, x);
                            arrow = self._drawOneArrow({x: x, y: y}, 1);
                        }
                        if (arrow) {
                            self.arrows[region][idx].push(arrow);
                        }
                    }
                });
            })
        });

        function getXoffsetByRegionIndex(regionIndex, diregion) {
            if (diregion === -1) {
                return 100 * (regionIndex + 1) - 20;
            }
            return 100 * regionIndex + 20;
        }

        function getYByXoffset(dots, xoffset) {
            var finded = BI.find(dots, function (i, dot) {
                if (i > 0) {
                    if (dots[i - 1].x < xoffset && dots[i].x > xoffset) {
                        return true;
                    }
                }
            });
            return finded.y;
        }
    },

    _setValue: function (start, index) {
        var self = this;
        var lineColor = this._const.lineColor;
        var selectLineColor = this._const.selectLineColor;
        var routes = this.pathChooser.routes;
        var starts = this.pathChooser.start;
        var each = [start];
        if (starts.contains(start)) {
            each = starts;
        }
        BI.each(each, function (i, s) {
            BI.each(self.arrows[s], function (j, arrows) {
                BI.each(arrows, function (k, arrow) {
                    arrow.attr({fill: lineColor, stroke: lineColor}).toFront();
                });
            });
        });
        BI.each(this.arrows[start][index], function (i, arrow) {
            arrow.attr({fill: selectLineColor, stroke: selectLineColor}).toFront();
        });
        var current = BI.last(routes[start][index]);
        while (current && routes[current] && routes[current].length === 1) {
            BI.each(self.arrows[current][0], function (i, arrow) {
                arrow.attr({fill: selectLineColor, stroke: selectLineColor}).toFront();
            });
            current = BI.last(routes[current][0]);
        }
    },

    setValue: function (v) {
        this.pathChooser.setValue(v);
        this._unselectAllArrows();
        var routes = this.pathChooser.routes;
        var nodes = BI.keys(routes), self = this;
        var result = [], array = [];
        BI.each(v, function (i, val) {
            if (BI.contains(nodes, val)) {
                if (array.length > 0) {
                    array.push(val);
                    result.push(array);
                    array = [];
                }
            }
            array.push(val);
        });
        if (array.length > 0) {
            result.push(array);
        }
        //画这n条路径
        BI.each(result, function (idx, path) {
            var start = path[0];
            var index = BI.findIndex(routes[start], function (idx, p) {
                if (BI.isEqual(path, p)) {
                    return true;
                }
            });
            if (index >= 0) {
                self._setValue(start, index);
            }
        });
    },

    getValue: function () {
        return this.pathChooser.getValue();
    },

    populate: function (items) {
        this.pathChooser.populate(items);
        this._drawArrows();
    }
});
BI.DirectionPathChooser.EVENT_CHANGE = "DirectionPathChooser.EVENT_CHANGE";
BI.shortcut('bi.direction_path_chooser', BI.DirectionPathChooser);