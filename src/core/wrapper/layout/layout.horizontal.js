/**
 * 水平布局
 * @class BI.HorizontalLayout
 * @extends BI.Layout
 */
BI.HorizontalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-horizontal-layout",
            verticalAlign: "middle",
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
    _init: function () {
        BI.HorizontalLayout.superclass._init.apply(this, arguments);
        var table = BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            attribute: {"cellspacing": 0, "cellpadding": 0}
        });
        table.element.css({
            "position": "relative",
            "white-space": "nowrap",
            "border-spacing": "0px",
            "border": "none",
            "border-collapse": "separate"
        }).appendTo(this.element);
        this.tr = BI.createWidget({
            type: "bi.layout",
            tagName: "tr"
        });
        this.tr.element.appendTo(table.element);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this.getName() + i)) {
            var w = BI.createWidget(item);
            w.element.css({"position": "relative", "margin": "0px auto"});
            td = BI.createWidget({
                type: "bi.default",
                tagName: "td",
                attributes: {
                    width: width
                },
                items: [w]
            });
            this.addWidget(this.getName() + i, td);
        } else {
            td = this.getWidgetByName(this.getName() + i);
            td.element.attr("width", width);
        }

        if (i === 0) {
            td.element.addClass("first-element");
        }
        td.element.css({
            "position": "relative",
            "vertical-align": o.verticalAlign,
            "margin": "0",
            "padding": "0",
            "border": "none"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return td;
    },

    render: function () {
        if (!BI.isEmpty(this.widgets)) {
            this.tr.element.append(this.hang());
        }
        return this;
    },

    clear: function () {
        this.hang();
        this.widgets = {};
        this.tr.empty();
    },

    empty: function () {
        BI.each(this.widgets, function (i, wi) {
            wi.destroy();
        });
        this.widgets = {};
        this.tr.empty();
    },

    resize: function () {
        // console.log("horizontal layout do not need to resize");
    },

    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.tr.element);
        return w;
    },

    populate: function (items) {
        BI.HorizontalLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.horizontal', BI.HorizontalLayout);

/**
 * 水平布局
 * @class BI.HorizontalCellLayout
 * @extends BI.Layout
 */
BI.HorizontalCellLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalCellLayout.superclass._defaultConfig.apply(this, arguments), {
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
    _init: function () {
        BI.HorizontalCellLayout.superclass._init.apply(this, arguments);
        this.element.css({"display": "table", "vertical-align": "top"});
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.HorizontalCellLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", "display": "table-cell", "vertical-align": "middle"});
        if (o.hgap + o.lgap > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + "px"
            })
        }
        if (o.hgap + o.rgap > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + "px"
            })
        }
        if (o.vgap + o.tgap > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + "px"
            })
        }
        if (o.vgap + o.bgap > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + "px"
            })
        }
        return w;
    },

    resize: function () {
        // console.log("horizontal do not need to resize");
    },

    populate: function (items) {
        BI.HorizontalCellLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.horizontal_cell', BI.HorizontalCellLayout);