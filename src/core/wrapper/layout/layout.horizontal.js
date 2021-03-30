/**
 * 水平布局
 * @class BI.HorizontalLayout
 * @extends BI.Layout
 */
BI.HorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-h",
            verticalAlign: BI.VerticalAlign.Top,
            horizontalAlign: BI.HorizontalAlign.Left,
            columnSize: [],
            scrollx: true,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        var o = this.options;
        BI.HorizontalLayout.superclass.render.apply(this, arguments);
        this.$table = BI.Widget._renderEngine.createElement("<table>").attr({cellspacing: 0, cellpadding: 0}).css({
            position: "relative",
            "white-space": "nowrap",
            width: (o.horizontalAlign === BI.HorizontalAlign.Center || o.horizontalAlign === BI.HorizontalAlign.Stretch) ? "100%" : "auto",
            height: (o.verticalAlign === BI.VerticalAlign.Middle || o.verticalAlign === BI.VerticalAlign.Stretch) ? "100%" : "auto",
            "border-spacing": "0px",
            border: "none",
            "border-collapse": "separate"
        });
        this.$tr = BI.Widget._renderEngine.createElement("<tr>");
        this.$tr.appendTo(this.$table);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] === "" ? "" : (o.columnSize[i] <= 1 ? ((o.columnSize[i] * 100).toFixed(1) + "%") : (i === 0 ? o.hgap : 0) + o.hgap + o.lgap + o.rgap + o.columnSize[i]);
        if (!this.hasWidget(this._getChildName(i))) {
            var w = BI._lazyCreateWidget(item);
            w.element.css({position: "relative", margin: "0px auto"});
            td = BI._lazyCreateWidget({
                type: "bi.default",
                tagName: "td",
                attributes: {
                    width: width
                },
                items: [w]
            });
            this.addWidget(this._getChildName(i), td);
        } else {
            td = this.getWidgetByName(this._getChildName(i));
            td.element.attr("width", width);
        }
        // 对于表现为td的元素设置最大宽度，有几点需要注意
        // 1、由于直接对td设置最大宽度是在规范中未定义的, 所以要使用类似td:firstChild来迂回实现
        // 2、不能给多个td设置最大宽度，这样只会平分宽度
        // 3、多百分比宽度就算了
        td.element.css({"max-width": BI.isNumber(o.columnSize[i]) ? (o.columnSize[i] <= 1 ? width : width / BI.pixRatio + BI.pixUnit) : width});
        if (i === 0) {
            td.element.addClass("first-element");
        }
        td.element.css({
            position: "relative",
            "vertical-align": o.verticalAlign,
            margin: "0",
            padding: "0",
            border: "none"
        });

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
        return td;
    },

    appendFragment: function (frag) {
        this.$tr.append(frag);
        this.element.append(this.$table);
    },

    resize: function () {
        // console.log("horizontal layout do not need to resize");
    },

    _getWrapper: function () {
        return this.$tr;
    },

    populate: function (items) {
        BI.HorizontalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.horizontal", BI.HorizontalLayout);

/**
 * 水平布局
 * @class BI.HorizontalCellLayout
 * @extends BI.Layout
 */
BI.HorizontalCellLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalCellLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-horizontal-cell-layout",
            scrollable: true,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.HorizontalCellLayout.superclass.render.apply(this, arguments);
        this.element.css({display: "table", "vertical-align": "top"});
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.HorizontalCellLayout.superclass._addElement.apply(this, arguments);
        w.element.css({position: "relative", display: "table-cell", "vertical-align": "middle"});
        if (o.hgap + o.lgap > 0) {
            w.element.css({
                "margin-left": (o.hgap + o.lgap) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.rgap > 0) {
            w.element.css({
                "margin-right": (o.hgap + o.rgap) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.vgap + o.tgap > 0) {
            w.element.css({
                "margin-top": (o.vgap + o.tgap) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.vgap + o.bgap > 0) {
            w.element.css({
                "margin-bottom": (o.vgap + o.bgap) / BI.pixRatio + BI.pixUnit
            });
        }
        return w;
    },

    resize: function () {
        // console.log("horizontal do not need to resize");
    },

    populate: function (items) {
        BI.HorizontalCellLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.horizontal_cell", BI.HorizontalCellLayout);
