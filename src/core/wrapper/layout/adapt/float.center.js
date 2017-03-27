/**
 * 浮动的居中布局
 */
BI.FloatCenterAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatCenterAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-float-center-adapt-layout",
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
        BI.FloatCenterAdaptLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("float_center_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("cannot be added")
    },

    mounted: function () {
        var width = this.left.element.outerWidth(),
            height = this.left.element.outerHeight();
        this.left.element.width(width).height(height).css("float", "none");
        BI.createWidget({
            type: "bi.center_adapt",
            element: this,
            items: [this.left]
        });
        this.removeWidget(this.container.getName());
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.left = BI.createWidget({
            type: "bi.vertical",
            items: items,
            hgap: o.hgap,
            vgap: o.vgap,
            tgap: o.tgap,
            bgap: o.bgap,
            lgap: o.lgap,
            rgap: o.rgap
        });

        this.container = BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this.left]
        });

    },

    populate: function (items) {
        BI.FloatCenterAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.float_center_adapt', BI.FloatCenterAdaptLayout);