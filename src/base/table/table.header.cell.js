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
        })
    },

    _init: function () {
        BI.TableHeaderCell.superclass._init.apply(this, arguments);
        BI.createWidget({
            type: "bi.label",
            element: this.element,
            textAlign: "center",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value
        })
    }
});

$.shortcut("bi.table_header_cell", BI.TableHeaderCell);