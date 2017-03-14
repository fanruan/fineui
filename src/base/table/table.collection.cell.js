/**
 *
 * 表格单元格
 *
 * Created by GUY on 2016/1/12.
 * @class BI.CollectionTableCell
 * @extends BI.Widget
 */
BI.CollectionTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CollectionTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-collection-table-cell",
            width: 0,
            height: 0,
            _left: 0,
            _top: 0,
            cell: {}
        })
    },

    _init: function () {
        BI.CollectionTableCell.superclass._init.apply(this, arguments);
        var o = this.options;
        this.cell = BI.createWidget(BI.extend({
            type: "bi.label"
        }, o.cell, {
            cls: (o.cell.cls || "") + "collection-table-cell-wrapper",
            width: o.width - (o._left === 0 ? 1 : 0) - 1,
            height: o.height - (o._top === 0 ? 1 : 0) - 1
        }));
        BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: this.cell,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    setWidth: function (width) {
        BI.CollectionTableCell.superclass.setWidth.apply(this, arguments);
        var o = this.options;
        this.cell.setWidth(o.width - (o._left === 0 ? 1 : 0) - 1);
    },

    setHeight: function (height) {
        BI.CollectionTableCell.superclass.setHeight.apply(this, arguments);
        var o = this.options;
        this.cell.setHeight(o.height - (o._top === 0 ? 1 : 0) - 1);
    }
});

$.shortcut("bi.collection_table_cell", BI.CollectionTableCell);