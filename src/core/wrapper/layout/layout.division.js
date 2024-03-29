/**
 * 分隔容器的控件，按照宽度和高度所占比平分整个容器
 *
 * @class BI.DivisionLayout
 * @extends BI.Layout
 */
BI.DivisionLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.DivisionLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-division",
            columns: null,
            rows: null,
            items: []
        });
    },
    render: function () {
        BI.DivisionLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加子组件");
    },

    stroke: function (items) {
        var o = this.options;
        var rows = o.rows || o.items.length, columns = o.columns || ((o.items[0] && o.items[0].length) | 0);
        var map = BI.makeArray(rows), widths = {}, heights = {};

        function firstElement (item, row, col) {
            if (row === 0) {
                item.addClass("first-row");
            }
            if (col === 0) {
                item.addClass("first-col");
            }
            item.addClass(BI.isOdd(row + 1) ? "odd-row" : "even-row");
            item.addClass(BI.isOdd(col + 1) ? "odd-col" : "even-col");
            item.addClass("center-element");
        }

        function firstObject (item, row, col) {
            var cls = "";
            if (row === 0) {
                cls += " first-row";
            }
            if (col === 0) {
                cls += " first-col";
            }
            BI.isOdd(row + 1) ? (cls += " odd-row") : (cls += " even-row");
            BI.isOdd(col + 1) ? (cls += " odd-col") : (cls += " even-col");
            item.cls = (item.cls || "") + cls + " center-element";
        }

        function first (item, row, col) {
            if (item instanceof BI.Widget) {
                firstElement(item.element, row, col);
            } else if (item.el instanceof BI.Widget) {
                firstElement(item.el.element, row, col);
            } else if (item.el) {
                firstObject(item.el, row, col);
            } else {
                firstObject(item, row, col);
            }
        }

        BI.each(map, function (i) {
            map[i] = BI.makeArray(columns);
        });
        BI.each(items, function (i, item) {
            if (BI.isArray(item)) {
                BI.each(item, function (j, el) {
                    widths[i] = (widths[i] || 0) + item.width;
                    heights[j] = (heights[j] || 0) + item.height;
                    map[i][j] = el;
                });
                return;
            }
            widths[item.row] = (widths[item.row] || 0) + item.width;
            heights[item.column] = (heights[item.column] || 0) + item.height;
            map[item.row][item.column] = item;
        });
        for (var i = 0; i < rows; i++) {
            var totalW = 0;
            for (var j = 0; j < columns; j++) {
                if (!map[i][j]) {
                    throw new Error("item(" + i + "" + j + ") 必须", map);
                }
                if (!this.hasWidget(this._getChildName(i + "_" + j))) {
                    var w = BI._lazyCreateWidget(map[i][j]);
                    this.addWidget(this._getChildName(i + "_" + j), w);
                } else {
                    w = this.getWidgetByName(this._getChildName(i + "_" + j));
                }
                var left = totalW * 100 / widths[i];
                w.element.css({position: "absolute", left: left + "%"});
                if (j > 0) {
                    var lastW = this.getWidgetByName(this._getChildName(i + "_" + (j - 1)));
                    lastW.element.css({right: (100 - left) + "%"});
                }
                if (j == o.columns - 1) {
                    w.element.css({right: "0%"});
                }
                first(w, i, j);
                totalW += map[i][j].width;
            }
        }
        for (var j = 0; j < o.columns; j++) {
            var totalH = 0;
            for (var i = 0; i < o.rows; i++) {
                var w = this.getWidgetByName(this._getChildName(i + "_" + j));
                var top = totalH * 100 / heights[j];
                w.element.css({top: top + "%"});
                if (i > 0) {
                    var lastW = this.getWidgetByName(this._getChildName((i - 1) + "_" + j));
                    lastW.element.css({bottom: (100 - top) + "%"});
                }
                if (i == o.rows - 1) {
                    w.element.css({bottom: "0%"});
                }
                totalH += map[i][j].height;
            }
        }
    },

    update: function (opt) {
        return this.forceUpdate(opt);
    },

    populate: function (items) {
        BI.DivisionLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.division", BI.DivisionLayout);
