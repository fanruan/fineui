/**
 * 垂直方向居中容器
 * @class BI.VerticalAdaptLayout
 * @extends BI.Layout
 */
BI.VerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: {
        baseCls: "bi-vertical-adapt-layout",
        columnSize: [],
        horizontalAlign: BI.HorizontalAlign.Left,
        hgap: 0,
        vgap: 0,
        lgap: 0,
        rgap: 0,
        tgap: 0,
        bgap: 0
    },
    render: function () {
        BI.VerticalAdaptLayout.superclass.render.apply(this, arguments);
        var o = this.options;
        this.$table = $("<table>").attr({cellspacing: 0, cellpadding: 0}).css({
            position: "relative",
            width: o.horizontalAlign === BI.HorizontalAlign.Stretch ? "100%" : "auto",
            height: "100%",
            "white-space": "nowrap",
            "border-spacing": "0px",
            border: "none",
            "border-collapse": "separate"
        });
        this.$tr = $("<tr>");
        this.$tr.appendTo(this.$table);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td;
        var width = o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i];
        if (!this.hasWidget(this._getChildName(i))) {
            var w = BI.createWidget(item);
            w.element.css({position: "relative", top: "0", left: "0", margin: "0px auto"});
            td = BI.createWidget({
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

        if (i === 0) {
            td.element.addClass("first-element");
        }
        td.element.css({
            position: "relative",
            height: "100%",
            "vertical-align": "middle",
            margin: "0",
            padding: "0",
            border: "none"
        });
        if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) + "px"
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-left": (i === 0 ? o.hgap : 0) + o.lgap + (item.lgap || 0) + (item.hgap || 0) +"px"
            });
        }
        if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) + "px"
            });
        }
        if (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) + "px"
            });
        }
        return td;
    },

    appendFragment: function (frag) {
        this.$tr.append(frag);
        this.element.append(this.$table);
    },

    _getWrapper: function () {
        return this.$tr;
    },

    resize: function () {
        // console.log("vertical_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.VerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.vertical_adapt", BI.VerticalAdaptLayout);