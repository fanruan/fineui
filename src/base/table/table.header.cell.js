/**
 *
 * 表格
 *
 * Created by GUY on 2015/9/22.
 * @class BI.TableHeaderCell
 * @extends BI.Single
 */
BI.TableHeaderCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TableHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table-header-cell",
            text: ""
        });
    },

    _init: function () {
        BI.TableHeaderCell.superclass._init.apply(this, arguments);
        var o = this.options;
        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign || "center",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value,
            lgap: o.lgap,
            rgap: o.rgap,
            hgap: o.hgap || 5
        });
    }
});

BI.shortcut("bi.table_header_cell", BI.TableHeaderCell);