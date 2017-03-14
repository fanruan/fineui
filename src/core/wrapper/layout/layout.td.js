/**
 * td布局
 * @class BI.TdLayout
 * @extends BI.Layout
 */
BI.TdLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.TdLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-td-layout",
            columnSize: [200, 200, 200],
            hgap: 0,
            vgap: 0,
            items: [[
                {
                    el: {text: 'label1'}
                },
                {
                    el: {text: 'label2'}
                },
                {
                    el: {text: 'label3'}
                }
            ]]
        });
    },
    _init: function () {
        BI.TdLayout.superclass._init.apply(this, arguments);
        this.table = BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            attribute: {"cellspacing": 0, "cellpadding": 0}
        });
        this.table.element.css({
            "position": "relative",
            "width": "100%",
            "height": "100%",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        }).appendTo(this.element);
        this.rows = 0;
        this.populate(this.options.items);
    },

    _addElement: function (idx, arr) {
        var o = this.options;

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

        var tr = BI.createWidget({
            type: "bi.default",
            tagName: "tr"
        });

        for (var i = 0; i < arr.length; i++) {
            var w = BI.createWidget(arr[i]);
            w.element.css({"position": "relative", "top": "0", "left": "0", "margin": "0px auto"});
            first(w, this.rows++, i);
            var td = BI.createWidget({
                type: 'bi.default',
                attributes: {
                    width: o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i]
                },
                tagName: 'td',
                items: [w]
            });
            td.element.css({
                "position": "relative",
                "vertical-align": "middle",
                "margin": "0",
                "padding": "0",
                "border": "none"
            });
            tr.addItem(td);
        }
        this.table.element.append(tr.element);
        return tr;
    },

    resize: function () {
        // console.log("td布局不需要resize");
    },

    addItem: function (arr) {
        if (!BI.isArray(arr)) {
            throw new Error("item 必须是数组");
        }
        return BI.TdLayout.superclass.addItem.apply(this, arguments);
    },

    populate: function (items) {
        BI.TdLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.td', BI.TdLayout);