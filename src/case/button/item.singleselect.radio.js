/**
 * guy
 * 单选框item
 * @type {*|void|Object}
 */
BI.SingleSelectRadioItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectRadioItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-radio-item",
            logic: {
                dynamic: false
            },
            height: 24,
            iconWrapperWidth: 16,
            textHgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.SingleSelectRadioItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio"
        });
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.textHgap,
            rgap: o.textHgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", {
                type: "bi.center_adapt",
                items: [this.radio],
                width: o.iconWrapperWidth
            }, this.text)
        }))));
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
