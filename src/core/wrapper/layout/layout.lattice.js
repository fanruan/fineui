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
    _defaultConfig: function () {
        return BI.extend(BI.LatticeLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-lattice-layout clearfix"
            //columnSize: [0.2, 0.2, 0.6],
        });
    },
    _init: function () {
        BI.LatticeLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.LatticeLayout.superclass._addElement.apply(this, arguments);
        if (o.columnSize && o.columnSize[i]) {
            var width = o.columnSize[i] / BI.sum(o.columnSize) * 100 + "%";
        } else {
            var width = 1 / this.options.items.length * 100 + "%"
        }
        w.element.css({"position": "relative", "float": "left", "width": width});
        return w;
    },

    addItem: function (item) {
        var w = BI.LatticeLayout.superclass.addItem.apply(this, arguments);
        this.resize();
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.LatticeLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.lattice', BI.LatticeLayout);