/**
 * td布局
 * @class BI.TdLayout
 * @extends BI.Layout
 */
BI.TdLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.TdLayout.superclass.props.apply(this, arguments), {
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
    render: function () {
        BI.TdLayout.superclass.render.apply(this, arguments);
        this.$table = $("<table>").attr({"cellspacing": 0, "cellpadding": 0}).css({
            "position": "relative",
            "width": "100%",
            "height": "100%",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        });
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
        this.addWidget(this.getName() + idx, tr);
        return tr;
    },

    _mountChildren: function(){
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$table.append(frag);
            this.element.append(this.$table);
        }
    },

    resize: function () {
        // console.log("td布局不需要resize");
    },

    addItem: function (arr) {
        if (!BI.isArray(arr)) {
            throw new Error("item must be array");
        }
        return BI.TdLayout.superclass.addItem.apply(this, arguments);
    },

    populate: function (items) {
        BI.TdLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.td', BI.TdLayout);