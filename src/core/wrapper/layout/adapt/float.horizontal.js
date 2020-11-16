/**
 * 浮动的水平居中布局
 */
BI.FloatHorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatHorizontalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-float-horizontal-adapt-layout",
            items: [],
            hgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0,
            lgap: 0,
            rgap: 0
        });
    },
    render: function () {
        BI.FloatHorizontalLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("float_horizontal_adapt布局不需要resize");
    },

    mounted: function () {
        var self = this;
        var width = this.left.element.width(),
            height = this.left.element.height();
        this.left.element.width(width).height(height).css("float", "none");
        BI.remove(this._children, function (i, wi) {
            if (wi === self.container) {
                delete self._children[i];
            }
        });
        BI._lazyCreateWidget({
            type: "bi.horizontal_auto",
            element: this,
            items: [this.left]
        });
    },

    _addElement: function (i, item) {
        var self = this, o = this.options;
        this.left = BI._lazyCreateWidget({
            type: "bi.vertical",
            items: [item],
            hgap: o.hgap,
            vgap: o.vgap,
            tgap: o.tgap,
            bgap: o.bgap,
            lgap: o.lgap,
            rgap: o.rgap
        });

        this.container = BI._lazyCreateWidget({
            type: "bi.left",
            element: this,
            items: [this.left]
        });

        return this.left;
    },

    populate: function (items) {
        BI.HorizontalAutoLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.horizontal_float", BI.FloatHorizontalLayout);
