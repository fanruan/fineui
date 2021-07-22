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
            scrolly: true,
            columnSize: [],
            rowSize: 30,  // or [30,30,30]
            hgap: 0,
            vgap: 0,
            items: []
        });
    },
    render: function () {
        BI.TableLayout.superclass.render.apply(this, arguments);
        this.rows = 0;
        this.populate(this.options.items);
    },

    _addElement: function (idx, arr) {
        var o = this.options;
        var abs = [], left = 0, right = 0, i, j;

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

        for (i = 0; i < arr.length; i++) {
            if (BI.isNumber(o.columnSize[i])) {
                first(arr[i], this.rows, i);
                abs.push(BI.extend({
                    top: 0,
                    bottom: 0,
                    left: o.columnSize[i] < 1 ? (left * 100).toFixed(1) + "%" : left,
                    width: o.columnSize[i] < 1 ? (o.columnSize[i] * 100).toFixed(1) + "%" : o.columnSize[i]
                }, arr[i]));
                left += o.columnSize[i] + (o.columnSize[i] < 1 ? 0 : o.hgap);
            } else {
                break;
            }
        }
        for (j = arr.length - 1; j > i; j--) {
            if (BI.isNumber(o.columnSize[j])) {
                first(arr[j], this.rows, j);
                abs.push(BI.extend({
                    top: 0,
                    bottom: 0,
                    right: o.columnSize[j] < 1 ? (right * 100).toFixed(1) + "%" : right,
                    width: o.columnSize[j] < 1 ? (o.columnSize[j] * 100).toFixed(1) + "%" : o.columnSize[j]
                }, arr[j]));
                right += o.columnSize[j] + (o.columnSize[j] < 1 ? 0 : o.hgap);
            } else {
                throw new Error("构造错误", arr);
            }
        }
        if (i >= 0 && i < arr.length) {
            first(arr[i], this.rows, i);
            abs.push(BI.extend({
                top: 0,
                bottom: 0,
                left: left < 1 ? (left * 100).toFixed(1) + "%" : left,
                right: right < 1 ? (right * 100).toFixed(1) + "%" : right
            }, arr[i]));
        }
        var w = BI._lazyCreateWidget({
            type: "bi.absolute",
            height: BI.isArray(o.rowSize) ? o.rowSize[this.rows] : o.rowSize,
            items: abs
        });
        if (this.rows > 0) {
            this.getWidgetByName(this._getChildName(this.rows - 1)).element.css({
                "margin-bottom": o.vgap / BI.pixRatio + BI.pixUnit
            });
        }
        w.element.css({
            position: "relative"
        });
        this.addWidget(this._getChildName(this.rows++), w);
        return w;
    },

    resize: function () {
        // console.log("table布局不需要resize");
    },

    addItem: function (arr) {
        if (!BI.isArray(arr)) {
            throw new Error("必须是数组", arr);
        }
        return BI.TableLayout.superclass.addItem.apply(this, arguments);
    },

    update: function () {
    },

    populate: function (items) {
        BI.TableLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.table", BI.TableLayout);
