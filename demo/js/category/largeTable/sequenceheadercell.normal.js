/**
 * created by young
 * 默认风格表格——表头
 */
BI.NormalSequenceHeaderCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.NormalSequenceHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-normal-sequence-header-cell",
        })
    },

    _init: function () {
        BI.NormalSequenceHeaderCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            forceCenter: true,
            hgap: 5,
            text: BI.i18nText("BI-Number_Index")
        });
        this._digestStyle();
    },

    _digestStyle: function () {
        var o = this.options;
        var style = o.styleGetter();
        if (style) {
            this.element.css(style);
        }
    },

    populate: function () {
        this._digestStyle();
    }
});
BI.NormalSequenceHeaderCell.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.normal_sequence_header_cell", BI.NormalSequenceHeaderCell);