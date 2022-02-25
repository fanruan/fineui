/**
 * absolute实现的居中布局
 * @class BI.FloatAbsoluteVerticalLayout
 * @extends BI.Layout
 */
BI.FloatAbsoluteVerticalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatAbsoluteVerticalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-h-fl",
            verticalAlign: BI.VerticalAlign.Middle,
            columnSize: [],
            hgap: 0,
            lgap: 0,
            rgap: 0
        });
    },

    render: function () {
        var self = this, o = this.options;
        BI.FloatAbsoluteVerticalLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.htape",
            verticalAlign: o.verticalAlign,
            columnSize: o.columnSize,
            items: this._formatItems(o.items),
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable,
            ref: function (_ref) {
                self.layout = _ref;
            },
            vgap: "50%",
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.rgap,
            // tgap和bgap不传的话内部不会设置top和bottom
            tgap: o.tgap,
            bgap: o.bgap,
            innerHgap: o.innerHgap,
            innerVgap: o.innerVgap,
        };
    },

    _formatItems: function (items) {
        var o = this.options;
        if (o.verticalAlign === BI.VerticalAlign.Top) {
            return items;
        }
        var cls = o.verticalAlign === BI.VerticalAlign.Bottom ? "bi-abs-b-y-item" : "bi-abs-c-y-item";
        return BI.map(items, function (i, item) {
            if (!item || BI.isEmptyObject(item)) {
                return item;
            }
            var el = BI.stripEL(item);
            if (BI.isWidget(el)) {
                el.element.addClass(cls);
            } else {
                el.cls = (el.cls || "") + cls;
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
BI.shortcut("bi.absolute_vertical_float", BI.FloatAbsoluteVerticalLayout);
