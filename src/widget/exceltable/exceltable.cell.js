/**
 *
 * Created by GUY on 2016/3/28.
 * @class BI.ExcelTableCell
 * @extends BI.Widget
 */
BI.ExcelTableCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ExcelTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-excel-table-cell",
            text: ""
        });
    },

    _init: function () {
        BI.ExcelTableCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            whiteSpace: "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value
        })
    }
});
$.shortcut('bi.excel_table_cell', BI.ExcelTableCell);