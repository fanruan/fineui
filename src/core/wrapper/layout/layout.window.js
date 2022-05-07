/**
 *
 * @class BI.WindowLayout
 * @extends BI.Layout
 */
BI.WindowLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.WindowLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-window",
            columns: 3,
            rows: 2,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            columnSize: [],
            rowSize: [],
            items: []
        });
    },
    render: function () {
        BI.WindowLayout.superclass.render.apply(this, arguments);
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
        if (BI.isNumber(o.rowSize)) {
            o.rowSize = BI.makeArray(o.items.length, 1 / o.items.length);
        }
        if (BI.isNumber(o.columnSize)) {
            o.columnSize = BI.makeArray(o.items[0].length, 1 / o.items[0].length);
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

        for (var i = 0; i < o.rows; i++) {
            for (var j = 0; j < o.columns; j++) {
                if (!o.items[i][j]) {
                    throw new Error("构造错误", o.items);
                }
                if (!this.hasWidget(this._getChildName(i + "_" + j))) {
                    var w = BI._lazyCreateWidget(o.items[i][j]);
                    w.element.css({position: "absolute"});
                    this.addWidget(this._getChildName(i + "_" + j), w);
                }
            }
        }
        var left = {}, right = {}, top = {}, bottom = {};
        left[0] = 0;
        top[0] = 0;
        right[o.columns - 1] = 0;
        bottom[o.rows - 1] = 0;
        // 从上到下
        for (var i = 0; i < o.rows; i++) {
            for (var j = 0; j < o.columns; j++) {
                var wi = this.getWidgetByName(this._getChildName(i + "_" + j));
                if (BI.isNull(top[i])) {
                    top[i] = top[i - 1] + (o.rowSize[i - 1] < 1 ? o.rowSize[i - 1] : o.rowSize[i - 1] + o.vgap + o.bgap);
                }
                var t = this._optimiseGap(top[i] + o.vgap + o.tgap), h = "";
                if (BI.isNumber(o.rowSize[i])) {
                    h = this._optimiseGap(o.rowSize[i]);
                }
                wi.element.css({top: t, height: h});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.rowSize[i])) {
                break;
            }
        }
        // 从下到上
        for (var i = o.rows - 1; i >= 0; i--) {
            for (var j = 0; j < o.columns; j++) {
                var wi = this.getWidgetByName(this._getChildName(i + "_" + j));
                if (BI.isNull(bottom[i])) {
                    bottom[i] = bottom[i + 1] + (o.rowSize[i + 1] < 1 ? o.rowSize[i + 1] : o.rowSize[i + 1] + o.vgap + o.tgap);
                }
                var b = this._optimiseGap(bottom[i] + o.vgap + o.bgap), h = "";
                if (BI.isNumber(o.rowSize[i])) {
                    h = this._optimiseGap(o.rowSize[i]);
                }
                wi.element.css({bottom: b, height: h});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.rowSize[i])) {
                break;
            }
        }
        // 从左到右
        for (var j = 0; j < o.columns; j++) {
            for (var i = 0; i < o.rows; i++) {
                var wi = this.getWidgetByName(this._getChildName(i + "_" + j));
                if (BI.isNull(left[j])) {
                    left[j] = left[j - 1] + (o.columnSize[j - 1] < 1 ? o.columnSize[j - 1] : o.columnSize[j - 1] + o.hgap + o.rgap);
                }
                var l = this._optimiseGap(left[j] + o.hgap + o.lgap), w = "";
                if (BI.isNumber(o.columnSize[j])) {
                    w = this._optimiseGap(o.columnSize[j]);
                }
                wi.element.css({left: l, width: w});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.columnSize[j])) {
                break;
            }
        }
        // 从右到左
        for (var j = o.columns - 1; j >= 0; j--) {
            for (var i = 0; i < o.rows; i++) {
                var wi = this.getWidgetByName(this._getChildName(i + "_" + j));
                if (BI.isNull(right[j])) {
                    right[j] = right[j + 1] + (o.columnSize[j + 1] < 1 ? o.columnSize[j + 1] : o.columnSize[j + 1] + o.hgap + o.lgap);
                }
                var r = this._optimiseGap(right[j] + o.hgap + o.rgap), w = "";
                if (BI.isNumber(o.columnSize[j])) {
                    w = this._optimiseGap(o.columnSize[j]);
                }
                wi.element.css({right: r, width: w});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.columnSize[j])) {
                break;
            }
        }
    },

    resize: function () {
        // console.log("window布局不需要resize");
    },

    update: function (opt) {
        return this.forceUpdate(opt);
    },

    populate: function (items) {
        BI.WindowLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.window", BI.WindowLayout);
