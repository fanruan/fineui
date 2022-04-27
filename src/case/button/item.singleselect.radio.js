/**
 * guy
 * 单选框item
 * @type {*|void|Object}
 */
BI.SingleSelectRadioItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectRadioItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-radio-item",
            attributes: {
                tabIndex: 1
            },
            logic: {
                dynamic: false
            },
            height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            iconWrapperWidth: 16,
            textHgap: 10,
        });
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vertical_adapt",
            columnSize: [o.iconWrapperWidth || o.height, "fill"],
            items: [{
                type: "bi.center_adapt",
                items: [{
                    type: "bi.radio",
                    ref: function (_ref) {
                        self.radio = _ref;
                    },
                }]
            }, {
                el: {
                    type: "bi.label",
                    ref: function (_ref) {
                        self.text = _ref;
                    },
                    cls: "list-item-text",
                    textAlign: "left",
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
                }
            }]
        };
    },

    _setEnable: function (enable) {
        BI.SingleSelectRadioItem.superclass._setEnable.apply(this, arguments);
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
        BI.SingleSelectRadioItem.superclass.doClick.apply(this, arguments);
        this.radio.setSelected(this.isSelected());
        if (this.isValid()) {
            this.fireEvent(BI.SingleSelectRadioItem.EVENT_CHANGE, this.isSelected(), this);
        }
    },

    setSelected: function (v) {
        BI.SingleSelectRadioItem.superclass.setSelected.apply(this, arguments);
        this.radio.setSelected(v);

    }
});

BI.SingleSelectRadioItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_select_radio_item", BI.SingleSelectRadioItem);
