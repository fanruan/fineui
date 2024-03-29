/**
 * 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应
 *
 * @class BI.BorderLayout
 * @extends BI.Layout
 */
BI.GridLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.GridLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-grid",
            columns: null,
            rows: null,
            items: []
        });
    },
    render: function () {
        BI.GridLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    addItem: function () {
        // do nothing
        throw new Error("不能添加子组件");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        var rows = o.rows || o.items.length, columns = o.columns || ((o.items[0] && o.items[0].length) | 0);
        var width = 100 / columns, height = 100 / rows;
        var els = [];
        for (var i = 0; i < rows; i++) {
            els[i] = [];
        }

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

        BI.each(items, function (i, item) {
            if (BI.isArray(item)) {
                BI.each(item, function (j, el) {
                    els[i][j] = BI._lazyCreateWidget(el);
                });
                return;
            }
            els[item.row][item.column] = BI._lazyCreateWidget(item);
        });
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (!els[i][j]) {
                    els[i][j] = BI._lazyCreateWidget({
                        type: "bi.layout"
                    });
                }
                first(els[i][j], i, j);
                els[i][j].element.css({
                    position: "absolute",
                    top: height * i + "%",
                    left: width * j + "%",
                    right: (100 - (width * (j + 1))) + "%",
                    bottom: (100 - (height * (i + 1))) + "%"
                });
                this.addWidget(this._getChildName(i + "_" + j), els[i][j]);
            }
        }
    },

    resize: function () {
        // console.log("grid布局不需要resize")
    },

    update: function (opt) {
        return this.forceUpdate(opt);
    },

    populate: function (items) {
        BI.GridLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.grid", BI.GridLayout);
