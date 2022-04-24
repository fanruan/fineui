BI.SingleSelectItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-item bi-list-item-active",
            attributes: {
                tabIndex: 1
            },
            textHgap: 10,
            height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            textAlign: "left"
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign,
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap || o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });
    },

    _setEnable: function (enable) {
        BI.SingleSelectItem.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.element.attr("tabIndex", 1);
        } else if (enable === false) {
            this.element.removeAttr("tabIndex");
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SingleSelectItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.SingleSelectItem.EVENT_CHANGE, this.isSelected(), this);
        }
    },

    setSelected: function (v) {
        BI.SingleSelectItem.superclass.setSelected.apply(this, arguments);
    }
});

BI.SingleSelectItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_select_item", BI.SingleSelectItem);
