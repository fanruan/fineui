/**
 * absolute实现的居中布局
 * @class BI.FloatAbsoluteHorizontalLayout
 * @extends BI.Layout
 */
BI.FloatAbsoluteHorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatAbsoluteHorizontalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-h-fl",
            horizontalAlign: BI.HorizontalAlign.Center,
            rowSize: [],
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        var self = this, o = this.options;
        BI.FloatAbsoluteHorizontalLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.vtape",
            horizontalAlign: o.horizontalAlign,
            rowSize: o.rowSize,
            items: this._formatItems(o.items),
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable,
            ref: function (_ref) {
                self.layout = _ref;
            },
            hgap: "50%",
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap
        };
    },

    _formatItems: function (items) {
        if (this.options.horizontalAlign !== BI.HorizontalAlign.Center) {
            return items;
        }
        return BI.map(items, function (i, item) {
            if (!item || BI.isEmptyObject(item)) {
                return item;
            }
            var el = BI.stripEL(item);
            if (BI.isWidget(el)) {
                el.element.addClass("bi-abs-c-x-item");
            } else {
                el.cls = (el.cls || "") + "bi-abs-c-x-item";
            }
            return item;
        });
    },

    resize: function () {
        this.layout.stroke(this._formatItems(this.options.items));
    },

    populate: function (items) {
        this.layout.populate(this._formatItems(items));
    }
});
BI.shortcut("bi.absolute_horizontal_float", BI.FloatAbsoluteHorizontalLayout);
