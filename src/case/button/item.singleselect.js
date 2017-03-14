/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.SingleSelectItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-item bi-list-item-active",
            hgap: 10,
            height: 25
        })
    },
    _init: function () {
        BI.SingleSelectItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this.element,
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SingleSelectItem.superclass.doClick.apply(this, arguments);
    },

    setSelected: function (v) {
        BI.SingleSelectItem.superclass.setSelected.apply(this, arguments);
    }
});

$.shortcut("bi.single_select_item", BI.SingleSelectItem);