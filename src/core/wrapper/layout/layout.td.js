/**
 * td布局
 * @class BI.TdLayout
 * @extends BI.Layout
 */
BI.TdLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.TdLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-td",
            columnSize: [],
            rowSize: [],
            verticalAlign: BI.VerticalAlign.Middle,
            horizontalAlign: BI.HorizontalAlign.Stretch,
            hgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0,
            lgap: 0,
            rgap: 0,
            items: []
        });
    },
    render: function () {
        BI.TdLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        this.$table = BI.Widget._renderEngine.createElement("<table>").attr({cellspacing: 0, cellpadding: 0}).css({
            position: "relative",
            width: (o.horizontalAlign === BI.HorizontalAlign.Center || o.horizontalAlign === BI.HorizontalAlign.Stretch) ? "100%" : "auto",
            height: (o.verticalAlign !== BI.VerticalAlign.Top) ? "100%" : "auto",
            "border-spacing": "0px",
            border: "none",
            "border-collapse": "separate"
        });
        this.rows = 0;
        this.populate(this.options.items);
    },

    _addElement: function (idx, arr) {
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

        var height = o.rowSize[idx] === "" ? "" : (o.rowSize[idx] < 1 ? ((o.rowSize[idx] * 100).toFixed(1) + "%") : o.rowSize[idx]);
        var rowHeight = BI.isNumber(o.rowSize[idx]) ? (o.rowSize[idx] <= 1 ? height : height / BI.pixRatio + BI.pixUnit) : height;
        var tr = BI._lazyCreateWidget({
            type: "bi.default",
            tagName: "tr",
            height: height,
            css: {
                "max-height": rowHeight,
                "min-height": rowHeight
            }
        });

        for (var i = 0; i < arr.length; i++) {
            var w = BI._lazyCreateWidget(arr[i]);
            if (o.verticalAlign === BI.VerticalAlign.Stretch) {
                var top = o.vgap + o.tgap + (arr[i].tgap || 0) + (arr[i].vgap || 0),
                    bottom = o.vgap + o.bgap + (arr[i].bgap || 0) + (arr[i].vgap || 0);
                w.element.css("height", "calc(100% - " + ((top + bottom) / BI.pixRatio + BI.pixUnit) + ")");
            }
            w.element.css({position: "relative", top: "0", left: "0", margin: "0px auto"});
            var item = arr[i];
            if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
                w.element.css({
                    "margin-top": (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
                });
            }
            if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
                w.element.css({
                    "margin-left": ((i === 0 ? o.hgap : 0) + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
                });
            }
            if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
                w.element.css({
                    "margin-right": (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
                });
            }
            if (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
                w.element.css({
                    "margin-bottom": (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
                });
            }
            first(w, this.rows++, i);
            var width = "";
            var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
            if (columnSize > 0) {
                width = columnSize < 1 ?
                    ((columnSize * 100).toFixed(1) + "%")
                    : (columnSize + (i === 0 ? o.hgap : 0) + o.hgap + o.lgap + o.rgap);
            }
            function hasFill() {
                if (o.columnSize.length > 0) {
                    return o.columnSize.indexOf("fill") >= 0;
                }
                return BI.some(arr, function (i, item) {
                    if (item.width === "fill") {
                        return true;
                    }
                });
            }
            if ((BI.isNull(columnSize) || columnSize === "") && hasFill()) {
                width = 2;
            }
            var td = BI._lazyCreateWidget({
                type: "bi.default",
                width: width,
                tagName: "td",
                items: [w]
            });
            // 对于表现为td的元素设置最大宽度，有几点需要注意
            // 1、由于直接对td设置最大宽度是在规范中未定义的, 所以要使用类似td:firstChild来迂回实现
            // 2、不能给多个td设置最大宽度，这样只会平分宽度
            // 3、多百分比宽度就算了
            if (columnSize > 0) {
                columnSize = columnSize < 1 ? width : width / BI.pixRatio + BI.pixUnit;
                td.element.css({
                    "max-width": columnSize,
                    "min-width": columnSize
                });
            }
            td.element.css({
                position: "relative",
                "vertical-align": o.verticalAlign,
                margin: "0",
                padding: "0",
                border: "none"
            });
            tr.addItem(td);
        }
        this.addWidget(this._getChildName(idx), tr);
        return tr;
    },

    appendFragment: function (frag) {
        this.$table.append(frag);
        this.element.append(this.$table);
    },

    resize: function () {
        // console.log("td布局不需要resize");
    },

    update: function (opt) {
        return this.forceUpdate(opt);
    },

    populate: function (items) {
        BI.TdLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.td", BI.TdLayout);
