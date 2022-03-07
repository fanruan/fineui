/**
 * 靠左对齐的自由浮动布局
 * @class BI.LatticeLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.LatticeLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.LatticeLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-lattice clearfix"
            // columnSize: [0.2, 0.2, 0.6],
        });
    },
    render: function () {
        BI.LatticeLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.LatticeLayout.superclass._addElement.apply(this, arguments);
        if (o.columnSize && o.columnSize[i]) {
            var width = o.columnSize[i] / BI.sum(o.columnSize) * 100 + "%";
        } else {
            var width = 1 / this.options.items.length * 100 + "%";
        }
        w.element.css({position: "relative", float: "left", width: width});
        return w;
    },

    populate: function (items) {
        BI.LatticeLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.lattice", BI.LatticeLayout);
