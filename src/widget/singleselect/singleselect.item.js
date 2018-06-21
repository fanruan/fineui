/**
 * guy
 * 单选框item
 * @type {*|void|Object}
 */
BI.SingleSelectComboItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectComboItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-radio-item",
            logic: {
                dynamic: false
            },
            height: 24
        });
    },
    _init: function () {
        BI.SingleSelectComboItem.superclass._init.apply(this, arguments);
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
            hgap: o.hgap,
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
                width: 26
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
        BI.SingleSelectComboItem.superclass.doClick.apply(this, arguments);
        this.radio.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.SingleSelectComboItem.superclass.setSelected.apply(this, arguments);
        this.radio.setSelected(v);

    }
});

BI.shortcut("bi.single_select_combo.item", BI.SingleSelectComboItem);