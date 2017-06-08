/**
 * 路径选择
 *
 * Created by GUY on 2015/12/4.
 * @class BI.PathChooser
 * @extends BI.Widget
 */
BI.PathChooser = BI.inherit(BI.Widget, {

    _const: {
        lineColor: "#d4dadd",
        selectLineColor: "#3f8ce8"
    },

    _defaultConfig: function () {
        return BI.extend(BI.PathChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-path-chooser",
            items: []
        })
    },

    _init: function () {
        BI.PathChooser.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _createRegions: function (regions) {
        var self = this;
        this.regions = BI.createWidgets(BI.map(regions, function (i, region) {
            return {
                type: "bi.path_region",
                title: self.texts[region] || region
            }
        }));
        this.regionMap = {};
        BI.each(regions, function (i, region) {
            self.regionMap[region] = i;
        });
        this.container = BI.createWidget({
            type: "bi.horizontal",
            verticalAlign: "top",
            scrollx: false,
            scrolly: false,
            hgap: 10,
            items: this.regions
        });
        BI.createWidget({
            type: "bi.vertical_adapt",
            element: this,
            scrollable: true,
            hgap: 10,
            items: [this.container]
        });
    },

    getRegionIndexById: function (id) {
        var node = this.store[id];
        var regionType = node.get("region");
        return this.regionMap[regionType];
    },

    _drawPath: function (start, offset, index) {
        var self = this;
        var starts = [];
        if (BI.contains(this.start, start)) {
            starts = this.start;
        } else {
            starts = [start];
        }

        BI.each(starts, function (i, s) {
            BI.each(self.radios[s], function (i, rad) {
                rad.setSelected(false);
            });
            BI.each(self.lines[s], function (i, line) {
                line.attr("stroke", self._const.lineColor);
            });
            BI.each(self.regionIndexes[s], function (i, idx) {
                self.regions[idx].reset();
            });
        });

        BI.each(this.routes[start][index], function (i, id) {
            var regionIndex = self.getRegionIndexById(id);
            self.regions[regionIndex].setSelect(offset + index, id);
        });
        var current = BI.last(this.routes[start][index]);

        while (current && this.routes[current] && this.routes[current].length === 1) {
            BI.each(this.routes[current][0], function (i, id) {
                var regionIndex = self.getRegionIndexById(id);
                self.regions[regionIndex].setSelect(0, id);
            });
            this.lines[current][0].attr("stroke", self._const.selectLineColor).toFront();
            current = BI.last(this.routes[current][0]);
        }
        this.lines[start][index].attr("stroke", self._const.selectLineColor).toFront();
        this.radios[start] && this.radios[start][index] && this.radios[start][index].setSelected(true);
    },

    _drawRadio: function (start, offset, index, x, y) {
        var self = this;
        var radio = BI.createWidget({
            type: "bi.radio",
            cls: "path-chooser-radio",
            selected: offset + index === 0,
            start: start,
            index: index
        });
        radio.on(BI.Radio.EVENT_CHANGE, function () {
            self._drawPath(start, offset, index);
            self.fireEvent(BI.PathChooser.EVENT_CHANGE, start, index);
        });
        if (!this.radios[start]) {
            this.radios[start] = [];
        }
        this.radios[start].push(radio);
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: [{
                el: radio,
                left: x - 6.5,
                top: y - 6.5
            }]
        })
    },

    _drawLine: function (start, lines) {
        var self = this;
        if (!this.lines[start]) {
            this.lines[start] = [];
        }
        if (!this.pathes[start]) {
            this.pathes[start] = [];
        }
        var startRegionIndex = this.getRegionIndexById(start);
        //start所在的位置，然后接着往下画其他的路径
        var offset = this.regions[startRegionIndex].getIndexByValue(start);
        BI.each(lines, function (i, line) {
            self.pathes[start][i] = [];
            var idx = i + offset;
            var path = "";
            var stop = 47.5 + 29 * idx;
            var sleft = 50 + 100 * startRegionIndex;
            var radioStartX = sleft, radioStartY = stop;
            var etop = stop;
            var endRegionIndex = self.getRegionIndexById(BI.last(line));
            var endOffset = self.regions[endRegionIndex].getIndexByValue(BI.last(line));
            var eleft = 50 + 100 * endRegionIndex;
            if (BI.contains(self.start, start)) {
                radioStartX = sleft - 50;
                path += "M" + (sleft - 50) + "," + stop;
                self.pathes[start][i].push({
                    x: sleft - 50,
                    y: stop
                })
            } else if (idx === 0) {
                radioStartX = sleft + 50;
                path += "M" + sleft + "," + stop;
                self.pathes[start][i].push({
                    x: sleft,
                    y: stop
                })
            } else {
                radioStartX = sleft + 50;
                path += "M" + sleft + "," + 47.5 + "L" + (sleft + 50) + "," + 47.5 + "L" + (sleft + 50) + "," + stop;
                self.pathes[start][i].push({
                    x: sleft,
                    y: 47.5
                });
                self.pathes[start][i].push({
                    x: sleft + 50,
                    y: 47.5
                });
                self.pathes[start][i].push({
                    x: sleft + 50,
                    y: stop
                });
            }
            if (idx > 0) {
                var endY = endOffset * 29 + 47.5;
                path += "L" + (eleft - 50) + "," + etop + "L" + (eleft - 50) + "," + endY + "L" + eleft + "," + endY;
                self.pathes[start][i].push({
                    x: eleft - 50,
                    y: etop
                });
                self.pathes[start][i].push({
                    x: eleft - 50,
                    y: endY
                });
                self.pathes[start][i].push({
                    x: eleft,
                    y: endY
                });
            } else {
                path += "L" + eleft + "," + etop;
                self.pathes[start][i].push({
                    x: eleft,
                    y: etop
                });
            }

            var graph = self.svg.path(path)
                .attr({
                    stroke: idx === 0 ? self._const.selectLineColor : self._const.lineColor,
                    'stroke-dasharray': '-'
                });
            self.lines[start].push(graph);
            if (lines.length > 1) {
                self.lines[start][0].toFront();
            }
            //第一个元素无论有多少个都要显示radio
            if (BI.contains(self.start, start)) {
                self.lines[self.regions[0].getValueByIndex(0)][0].toFront();
            }
            if (lines.length > 1 || BI.contains(self.start, start)) {
                self._drawRadio(start, offset, i, radioStartX, radioStartY);
            }
        });
    },

    _drawLines: function (routes) {
        var self = this;
        this.lines = {};
        this.pathes = {};
        this.radios = {};
        this.regionIndexes = {};
        BI.each(routes, function (k, route) {
            if (!self.regionIndexes[k]) {
                self.regionIndexes[k] = [];
            }
            BI.each(route, function (i, rs) {
                BI.each(rs, function (j, id) {
                    var regionIndex = self.getRegionIndexById(id);
                    if (!BI.contains(self.regionIndexes[k], regionIndex)) {
                        self.regionIndexes[k].push(regionIndex);
                    }
                });
            })
        });
        BI.each(routes, function (k, route) {
            self._drawLine(k, route);
        });
    },

    _pushNodes: function (nodes) {
        var self = this;
        var indexes = [];
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i];
            var index = self.getRegionIndexById(id);
            indexes.push(index);
            var region = self.regions[index];
            if (i === nodes.length - 1) {
                if (!region.hasItem(id)) {
                    region.addItem(id, self.texts[id]);
                }
                break;
            }
            if (i > 0 || BI.contains(self.start, id)) {
                region.addItem(id, self.texts[id]);
            }
        }
        for (var i = BI.first(indexes); i < BI.last(indexes); i++) {
            if (!BI.contains(indexes, i)) {
                self.regions[i].addItem("");
            }
        }
    },

    _createNodes: function () {
        var self = this, o = this.options;
        this.store = {};
        this.texts = {};
        this.start = [];
        this.end = [];
        BI.each(o.items, function (i, item) {
            self.start.push(BI.first(item).value);
            self.end.push(BI.last(item).value);
        });
        this.start = BI.uniq(this.start);
        this.end = BI.uniq(this.end);
        var regions = [];
        var tree = new BI.Tree();
        var branches = {}, max = 0;
        BI.each(o.items, function (i, items) {
            BI.each(items, function (j, item) {
                if (!BI.has(branches, item.value)) {
                    branches[item.value] = 0;
                }
                branches[item.value]++;
                max = Math.max(max, branches[item.value]);
                var prev = {};
                if (j > 0) {
                    prev = items[j - 1];
                }
                var parent = self.store[prev.value || ""];
                var node = self.store[item.value] || new BI.Node(item.value);
                node.set(item);
                self.store[item.value] = node;
                self.texts[item.value] = item.text;
                self.texts[item.region] = item.regionText;
                parent = BI.isNull(parent) ? tree.getRoot() : parent;
                if (parent.getChildIndex(item.value) === -1) {
                    tree.addNode(parent, node);
                }
            })
        });

        //算出区域列表
        tree.traverse(function (node) {
            BI.each(node.getChildren(), function (i, child) {
                if (BI.contains(regions, child.get("region"))) {
                    var index1 = BI.indexOf(regions, node.get("region"));
                    var index2 = BI.indexOf(regions, child.get("region"));
                    //交换区域
                    if (index1 > index2) {
                        var t = regions[index2];
                        for (var j = index2; j < index1; j++) {
                            regions[j] = regions[j + 1];
                        }
                        regions[index1] = t;
                    }
                } else {
                    regions.push(child.get("region"));
                }
            });
        });
        this._createRegions(regions);

        //算出节点
        BI.each(branches, function (k, branch) {
            if (branch < max) {
                delete branches[k];
            }
        });

        //过滤节点
        var nodes = [];
        var n = tree.getRoot();
        while (n && n.getChildrenLength() === 1) {
            if (BI.has(branches, n.getChildren()[0].id)) {
                delete branches[n.getChildren()[0].id];
                n = n.getChildren()[0];
            } else {
                n = null;
            }
        }
        tree.traverse(function (node) {
            if (BI.has(branches, node.id)) {
                nodes.push(node.id);
                delete branches[node.id];
            }
        });

        //填充节点
        var routes = {};
        var s, e;
        for (var i = 0, len = nodes.length; i < len + 1; i++) {
            if (len === 0) {
                s = [];
                BI.each(this.start, function (i, id) {
                    s.push(tree.search(id));
                });
                e = [];
                BI.each(this.end, function (i, id) {
                    e.push(tree.search(id));
                });
            } else if (i === len) {
                s = e;
                e = [];
                BI.each(this.end, function (i, id) {
                    e.push(tree.search(id));
                });
            } else if (i === 0) {
                s = [];
                BI.each(this.start, function (i, id) {
                    s.push(tree.search(id));
                });
                e = [tree.search(nodes[i])];
            } else {
                s = [tree.search(e[0] || tree.getRoot(), nodes[i - 1])];
                e = [tree.search(s[0], nodes[i])];
            }
            BI.each(s, function (i, n) {
                tree._recursion(n, [n.id], function (node, route) {
                    if (BI.contains(e, node)) {
                        if (!routes[n.id]) {
                            routes[n.id] = [];
                        }
                        routes[n.id].push(route);
                        self._pushNodes(route);
                        if (e.length <= 1) {
                            return true;
                        }
                    }
                })
            });
        }
        this.routes = routes;
        this._drawLines(routes);
    },

    _unselectAllPath: function () {
        var self = this;
        BI.each(this.radios, function (idx, rad) {
            BI.each(rad, function (i, r) {
                r.setSelected(false);
            });
        });
        BI.each(this.lines, function (idx, line) {
            BI.each(line, function (i, li) {
                li.attr("stroke", self._const.lineColor);
            });
        });
        BI.each(this.regions, function (idx, region) {
            region.reset();
        });
    },

    populate: function (items) {
        this.options.items = items || [];
        var self = this;
        this.empty();
        if (this.options.items.length <= 0) {
            return;
        }
        this.svg = BI.createWidget({
            type: "bi.svg"
        });
        this._createNodes();
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: [{
                el: this.svg,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }]
        });
    },

    setValue: function (v) {
        this._unselectAllPath();
        var nodes = BI.keys(this.routes), self = this;
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
            var index = BI.findIndex(self.routes[start], function (idx, p) {
                if (BI.isEqual(path, p)) {
                    return true;
                }
            });
            if (index >= 0) {
                var startRegionIndex = self.getRegionIndexById(start);
                var offset = self.regions[startRegionIndex].getIndexByValue(start);
                self._drawPath(start, offset, index);
            }
        });
    },

    getValue: function () {
        var path = [];
        BI.each(this.regions, function (i, region) {
            var val = region.getValue();
            if (BI.isKey(val)) {
                path.push(val);
            }
        });
        return path;
    }
});
BI.PathChooser.EVENT_CHANGE = "PathChooser.EVENT_CHANGE";
BI.shortcut("bi.path_chooser", BI.PathChooser);