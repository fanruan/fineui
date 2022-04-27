/**
 * 使用display:table和display:table-cell实现的horizontal布局
 * @class BI.TableAdaptLayout
 * @extends BI.Layout
 */
BI.TableAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.TableAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-t-a",
            columnSize: [],
            verticalAlign: BI.VerticalAlign.Top,
            horizontalAlign: BI.HorizontalAlign.Left,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.TableAdaptLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        this.$table = BI.Widget._renderEngine.createElement("<div>").css({
            position: "relative",
            display: "table",
            width: (o.horizontalAlign === BI.HorizontalAlign.Center || o.horizontalAlign === BI.HorizontalAlign.Stretch || this._hasFill()) ? "100%" : "auto",
            height: (o.verticalAlign !== BI.VerticalAlign.Top) ? "100%" : "auto",
            "white-space": "nowrap"
        });
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _hasFill: function () {
        var o = this.options;
        if (o.columnSize.length > 0) {
            return o.columnSize.indexOf("fill") >= 0;
        }
        return BI.some(o.items, function (i, item) {
            if (item.width === "fill") {
                return true;
            }
        });
    },

    _addElement: function (i, item) {
        var o = this.options;
        var td, width = "";
        var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
        if (columnSize > 0) {
            width = this._optimiseGap(columnSize + (i === 0 ? o.hgap : 0) + o.hgap + o.lgap + o.rgap);
        }
        if ((BI.isNull(columnSize) || columnSize === "") && this._hasFill()) {
            width = 2;
        }
        if (!this.hasWidget(this._getChildName(i))) {
            var w = BI._lazyCreateWidget(item);
            w.element.css({position: "relative", top: "0", left: "0", margin: "0px auto"});
            td = BI._lazyCreateWidget({
                type: "bi.default",
                width: width,
                items: [w]
            });
            this.addWidget(this._getChildName(i), td);
        } else {
            td = this.getWidgetByName(this._getChildName(i));
            td.element.width(width);
        }
        if (o.verticalAlign === BI.VerticalAlign.Stretch) {
            var top = o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0),
                bottom = o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0);
            w.element.css("height", "calc(100% - " + this._optimiseGap(top + bottom) + ")");
        }
        // 对于表现为td的元素设置最大宽度，有几点需要注意
        // 1、由于直接对td设置最大宽度是在规范中未定义的, 所以要使用类似td:firstChild来迂回实现
        // 2、不能给多个td设置最大宽度，这样只会平分宽度
        // 3、多百分比宽度就算了
        if (columnSize > 0) {
            td.element.css({
                "max-width": width,
                "min-width": width
            });
        }
        if (i === 0) {
            td.element.addClass("first-element");
        }
        td.element.css({
            position: "relative",
            display: "table-cell",
            "vertical-align": o.verticalAlign,
            height: "100%"
        });
        this._handleGap(w, item, i);
        return td;
    },

    appendFragment: function (frag) {
        this.$table.append(frag);
        this.element.append(this.$table);
    },

    populate: function (items) {
        BI.TableAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.table_adapt", BI.TableAdaptLayout);
