/**
 * absolute实现的居中布局
 * @class BI.FloatAbsoluteVerticalLayout
 * @extends BI.Layout
 */
BI.FloatAbsoluteVerticalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatAbsoluteVerticalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-h-a",
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
            tgap: o.tgap,
            bgap: o.bgap
        };
    },

    _formatItems: function (items) {
        return BI.map(items, function (i, item) {
            if(!item || BI.isEmptyObject(item)){
                return item;
            }
            var el = BI.stripEL(item);
            if(BI.isWidget(el)){
                el.element.addClass("bi-abs-c-y-item");
            } else {
                el.cls = (el.cls || "") + "bi-abs-c-y-item";
            }
            return item;
        });
    },

    resize: function () {
        // console.log("float_absolute_vertical_adapt布局不需要resize");
    },

    populate: function (items) {
        this.layout.populate.apply(this, arguments);
    }
});
BI.shortcut("bi.float_absolute_vertical_adapt", BI.FloatAbsoluteVerticalLayout);
