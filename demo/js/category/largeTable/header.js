/**
 * Created by Young's on 2016/4/15.
 */
BI.DetailTableHeader = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DetailTableHeader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-detail-table-header"
        })
    },

    _init: function () {
        BI.DetailTableHeader.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var dId = o.dId;
        var name = o.text;
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.label",
                    text: name,
                    title: name,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    lgap: 5,
                    height: o.height
                }
            }]
        });

        //表格样式
        if (BI.isNotNull(o.styles) && BI.isObject(o.styles)) {
            this.element.css(o.styles);
        }
    }
});
BI.shortcut("bi.detail_table_header", BI.DetailTableHeader);