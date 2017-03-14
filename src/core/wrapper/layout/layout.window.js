/**
 *
 * @class BI.WindowLayout
 * @extends BI.Layout
 */
BI.WindowLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.WindowLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-window-layout",
            columns: 3,
            rows: 2,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            columnSize: [100, "fill", 200],
            rowSize: [100, "fill"],
            items: [[
                {
                    el: {type: 'bi.button', text: 'button1'}
                },
                {
                    el: {type: 'bi.button', text: 'button2'}
                },
                {
                    el: {type: 'bi.button', text: 'button3'}
                }
            ]]
        });
    },
    _init: function () {
        BI.WindowLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var o = this.options;
        if (BI.isNumber(o.rowSize)) {
            o.rowSize = BI.makeArray(o.items.length, 1 / o.items.length);
        }
        if (BI.isNumber(o.columnSize)) {
            o.columnSize = BI.makeArray(o.items[0].length, 1 / o.items[0].length);
        }
        function firstElement(item, row, col) {
            if (row === 0) {
                item.addClass("first-row")
            }
            if (col === 0) {
                item.addClass("first-col");
            }
            item.addClass(BI.isOdd(row + 1) ? "odd-row" : "even-row");
            item.addClass(BI.isOdd(col + 1) ? "odd-col" : "even-col");
            item.addClass("center-element");
        }

        function firstObject(item, row, col) {
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

        function first(item, row, col) {
            if (item instanceof BI.Widget) {
                firstElement(item.element, row, col);
            } else if (item.el instanceof BI.Widget) {
                firstElement(item.el.element, row, col);
            } else if (item.el) {
                firstObject(item.el, row, col)
            } else {
                firstObject(item, row, col);
            }
        }

        for (var i = 0; i < o.rows; i++) {
            for (var j = 0; j < o.columns; j++) {
                if (!o.items[i][j]) {
                    throw new Error("缺少item项");
                }
                if (!this.hasWidget(this.getName() + i + "_" + j)) {
                    var w = BI.createWidget(o.items[i][j]);
                    w.element.css({"position": "absolute"});
                    this.addWidget(this.getName() + i + "_" + j, w);
                }
            }
        }
        var left = {}, right = {}, top = {}, bottom = {};
        left[0] = 0;
        top[0] = 0;
        right[o.columns - 1] = 0;
        bottom[o.rows - 1] = 0;
        //从上到下
        for (var i = 0; i < o.rows; i++) {
            for (var j = 0; j < o.columns; j++) {
                var wi = this.getWidgetByName(this.getName() + i + "_" + j);
                if (BI.isNull(top[i])) {
                    top[i] = top[i - 1] + (o.rowSize[i - 1] < 1 ? o.rowSize[i - 1] : o.rowSize[i - 1] + o.vgap + o.bgap);
                }
                var t = top[i] <= 1 ? top[i] * 100 + "%" : top[i] + o.vgap + o.tgap + "px", h = "";
                if (BI.isNumber(o.rowSize[i])) {
                    h = o.rowSize[i] <= 1 ? o.rowSize[i] * 100 + "%" : o.rowSize[i] + "px";
                }
                wi.element.css({"top": t, height: h});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.rowSize[i])) {
                break;
            }
        }
        //从下到上
        for (var i = o.rows - 1; i >= 0; i--) {
            for (var j = 0; j < o.columns; j++) {
                var wi = this.getWidgetByName(this.getName() + i + "_" + j);
                if (BI.isNull(bottom[i])) {
                    bottom[i] = bottom[i + 1] + (o.rowSize[i + 1] < 1 ? o.rowSize[i + 1] : o.rowSize[i + 1] + o.vgap + o.tgap);
                }
                var b = bottom[i] <= 1 ? bottom[i] * 100 + "%" : bottom[i] + o.vgap + o.bgap + "px", h = "";
                if (BI.isNumber(o.rowSize[i])) {
                    h = o.rowSize[i] <= 1 ? o.rowSize[i] * 100 + "%" : o.rowSize[i] + "px";
                }
                wi.element.css({"bottom": b, height: h});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.rowSize[i])) {
                break;
            }
        }
        //从左到右
        for (var j = 0; j < o.columns; j++) {
            for (var i = 0; i < o.rows; i++) {
                var wi = this.getWidgetByName(this.getName() + i + "_" + j);
                if (BI.isNull(left[j])) {
                    left[j] = left[j - 1] + (o.columnSize[j - 1] < 1 ? o.columnSize[j - 1] : o.columnSize[j - 1] + o.hgap + o.rgap);
                }
                var l = left[j] <= 1 ? left[j] * 100 + "%" : left[j] + o.hgap + o.lgap + "px", w = "";
                if (BI.isNumber(o.columnSize[j])) {
                    w = o.columnSize[j] <= 1 ? o.columnSize[j] * 100 + "%" : o.columnSize[j] + "px";
                }
                wi.element.css({"left": l, width: w});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.columnSize[j])) {
                break;
            }
        }
        //从右到左
        for (var j = o.columns - 1; j >= 0; j--) {
            for (var i = 0; i < o.rows; i++) {
                var wi = this.getWidgetByName(this.getName() + i + "_" + j);
                if (BI.isNull(right[j])) {
                    right[j] = right[j + 1] + (o.columnSize[j + 1] < 1 ? o.columnSize[j + 1] : o.columnSize[j + 1] + o.hgap + o.lgap)
                }
                var r = right[j] <= 1 ? right[j] * 100 + "%" : right[j] + o.hgap + o.rgap + "px", w = "";
                if (BI.isNumber(o.columnSize[j])) {
                    w = o.columnSize[j] <= 1 ? o.columnSize[j] * 100 + "%" : o.columnSize[j] + "px";
                }
                wi.element.css({"right": r, width: w});
                first(wi, i, j);
            }
            if (!BI.isNumber(o.columnSize[j])) {
                break;
            }
        }
    },

    populate: function (items) {
        BI.WindowLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.window', BI.WindowLayout);