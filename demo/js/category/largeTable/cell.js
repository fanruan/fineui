/**
 * Created by roy on 16/5/23.
 */
BI.DetailTableCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.DetailTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-detail-table-cell",
            dId: "",
            text: ""
        })
    },

    _init: function () {
        BI.DetailTableCell.superclass._init.apply(this, arguments);
        this._createItem();
    },

    _createItem: function () {
        var self = this, o = this.options;
        var type = this.options.dimensionType;
        var item = BI.createWidget({
            type: "bi.label",
            height: o.height,
            text: o.text,
            title: o.text,
            lgap: 5,
            rgap: 5
        });

        if (BI.isNotEmptyString(o.color)) {
            this.element.css("color", o.color);
        }

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [item]
        })

        //表格样式
        if (BI.isNotNull(o.styles) && BI.isObject(o.styles)) {
            this.element.css(o.styles);
        }
    },
});
BI.shortcut("bi.detail_table_cell", BI.DetailTableCell);