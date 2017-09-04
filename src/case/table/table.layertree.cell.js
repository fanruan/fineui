/**
 * Created by GUY on 2016/5/7.
 * @class BI.LayerTreeTableCell
 * @extends BI.Single
 */
BI.LayerTreeTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LayerTreeTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-layer-tree-table-cell",
            layer: 0,
            text: ""
        })
    },

    _init: function () {
        BI.LayerTreeTableCell.superclass._init.apply(this, arguments);
        var o = this.options;
        BI.createWidget({
            type: "bi.label",
            element: this.element,
            textAlign: "left",
            whiteSpace: "nowrap",
            height: o.height,
            text: o.text,
            value: o.value,
            lgap: 5 + 30 * o.layer,
            rgap: 5
        })
    }
});

$.shortcut("bi.layer_tree_table_cell", BI.LayerTreeTableCell);