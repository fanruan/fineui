/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.TableLayout
 * @extends BI.Layout
 */
BI.TableLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.TableLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-t",
            // scrolly: true,
            columnSize: [],
            rowSize: [],
            horizontalAlign: BI.HorizontalAlign.Stretch,
            verticalAlign: BI.VerticalAlign.Stretch,
            // rowSize: 30,  // or [30,30,30]
            hgap: 0,
            vgap: 0,
            items: []
        });
    },
    render: function () {
        BI.TableLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;

        var columnSize = o.columnSize.length > 0 ? o.columnSize : BI.range(items[0].length).fill("");

        if (columnSize.length > 0) {
            var template = [];
            for (var i = 0; i < columnSize.length; i++) {
                if (columnSize[i] === "") {
                    template.push("auto");
                } else if (columnSize[i] === "fill") {
                    template.push("1fr");
                } else {
                    template.push(this._optimiseGap(columnSize[i]));
                }
            }
            this.element.css({
                "grid-template-columns": template.join(" "),
                "grid-template-rows": BI.isArray(o.rowSize) ? BI.map(o.rowSize, function (i, size) {
                    return self._optimiseGap(size);
                }).join(" ") : BI.range(o.items.length).fill(this._optimiseGap(o.rowSize)).join(" "),
                "grid-row-gap": this._optimiseGap(o.vgap),
                "grid-column-gap": this._optimiseGap(o.hgap)
            });
        }
        return {
            type: "bi.default",
            ref: function (_ref) {
                self.layout = _ref;
            },
            items: this._formatItems(items)
        };
    },

    _formatItems: function (items) {
        var o = this.options;

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
            return item;
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
            return item;
        }

        function first (item, row, col) {
            if (item instanceof BI.Widget) {
                return firstElement(item.element, row, col);
            } else if (item.el instanceof BI.Widget) {
                return firstElement(item.el.element, row, col);
            } else if (item.el) {
                return firstObject(item.el, row, col);
            } else {
                return firstObject(item, row, col);
            }
        }

        function wrapLayout (item) {
            return {
                type: "bi.horizontal_fill",
                columnSize: ["fill"],
                horizontalAlign: o.horizontalAlign,
                verticalAlign: o.verticalAlign,
                items: [BI.formatEL(item)]
            };
        }

        return BI.reduce(items, function (row, result, i) {
            return result.concat(BI.map(row, function (j, item) {
                if (BI.isEmpty(item)) {
                    return first(wrapLayout({
                        type: "bi.layout"
                    }), i, j);
                }
                return first(wrapLayout(item), i, j);
            }));
        }, []);
    },

    resize: function () {
        // console.log("table布局不需要resize");
    },

    populate: function (items) {
        this.layout.populate(this._formatItems(items));
    }
});
BI.shortcut("bi.table", BI.TableLayout);
