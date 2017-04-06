/**
 *
 * Created by GUY on 2016/3/28.
 * @class BI.ExcelTableHeaderCell
 * @extends BI.Widget
 */
BI.ExcelTableHeaderCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ExcelTableHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-excel-table-header-cell",
            text: ""
        });
    },

    _init: function () {
        BI.ExcelTableHeaderCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: BI.HorizontalAlign.Center,
            whiteSpace: "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value
        })
    }
});
BI.shortcut('bi.excel_table_header_cell', BI.ExcelTableHeaderCell);