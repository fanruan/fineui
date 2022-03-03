/**
 * @author windy
 * @version 2.0
 * Created by windy on 2022/1/11
 */
 BI.Form = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-form",
        labelAlign: "right",
        layout: {
            type: "bi.vertical",
            vgap: 20
        },
        items: [{
            validate: BI.emptyFn,
            tip: BI.emptyFn,
            label: "",
            el: {}
        }],
        labelWidth: ""
    },

    render: function () {
        var self = this, o = this.options;

        return {
            type: "bi.button_group",
            items: this._createItems(),
            layouts: [o.layout],
            ref: function (ref) {
                self.group = ref;
            }
        };
    },

    _createItems: function () {
        var self = this;
        var o = this.options;

        return BI.map(o.items, function (idx, item) {
            return {
                type: "bi.form_field",
                height: item.el.height || 28,
                labelAlign: o.labelAlign,
                labelWidth: o.labelWidth,
                el: item.el,
                label: item.label,
                tip: item.tip,
                validate: item.validate,
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.fireEvent(BI.Form.EVENT_CHANGE, this.validate());
                    }
                }]
            };
        });
    },

    isAllValid: function () {
        return !BI.some(this.validateWithNoTip(), function (idx, v) {
            return !v;
        });
    },

    validateWithNoTip: function () {
        var validInfo = [];
        BI.each(this.group.getAllButtons(), function (idx, button) {
            validInfo.push(button.validateWithNoTip());
        });

        return validInfo;
    },

    validate: function () {
        var validInfo = [];
        BI.each(this.group.getAllButtons(), function (idx, button) {
            validInfo.push(button.validate());
        });

        return validInfo;
    },

    getValue: function () {
        return !this.isAllValid() ? null : BI.map(this.group.getAllButtons(), function (idx, button) {
            return button.getValue();
        });
    }
});

BI.Form.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.custom_form", BI.Form);
