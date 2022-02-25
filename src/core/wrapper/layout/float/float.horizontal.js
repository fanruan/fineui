/**
 * 浮动的水平居中布局
 */
BI.FloatHorizontalLayout = BI.inherit(BI.Layout, {

    props: function () {
        return BI.extend(BI.InlineHorizontalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-h-fl",
            horizontalAlign: BI.HorizontalAlign.Center,
            verticalAlign: BI.VerticalAlign.Top,
            rowSize: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        var self = this, o = this.options;
        if (o.verticalAlign === BI.VerticalAlign.Top) {
            return {
                type: "bi.vertical",
                ref: function (_ref) {
                    self.layout = _ref;
                },
                items: this._formatItems(o.items),
                vgap: o.vgap,
                tgap: o.tgap,
                bgap: o.bgap,
                scrollx: o.scrollx,
                scrolly: o.scrolly,
                scrollable: o.scrollable
            };
        }
        return {
            type: "bi.inline",
            items: [{
                el: {
                    type: "bi.vertical",
                    ref: function (_ref) {
                        self.layout = _ref;
                    },
                    items: this._formatItems(o.items),
                    vgap: o.vgap,
                    tgap: o.tgap,
                    bgap: o.bgap
                }
            }],
            horizontalAlign: o.horizontalAlign,
            verticalAlign: o.verticalAlign,
            innerHgap: o.innerHgap,
            innerVgap: o.innerVgap,
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable
        };
    },

    _formatItems: function (items) {
        var o = this.options;
        return BI.map(items, function (i, item) {
            return {
                el: {
                    type: "bi.inline_horizontal_adapt",
                    horizontalAlign: o.horizontalAlign,
                    items: [item],
                    hgap: o.hgap,
                    lgap: o.lgap,
                    rgap: o.rgap
                }
            };
        });
    },

    resize: function () {
        this.layout.stroke(this._formatItems(this.options.items));
    },

    populate: function (items) {
        this.layout.populate(this._formatItems(items));
    }
});
BI.shortcut("bi.horizontal_float", BI.FloatHorizontalLayout);
