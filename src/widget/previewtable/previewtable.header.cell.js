/**
 * 预览表
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTableHeaderCell
 * @extends BI.Widget
 */
BI.PreviewTableHeaderCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTableHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table-header-cell",
            text: ""
        });
    },

    _init: function () {
        BI.PreviewTableHeaderCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign || "left",
            whiteSpace: o.whiteSpace || "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value,
            lgap: o.lgap,
            rgap: o.rgap,
            hgap: o.hgap || 5
        });
    }
});
BI.shortcut("bi.preview_table_header_cell", BI.PreviewTableHeaderCell);