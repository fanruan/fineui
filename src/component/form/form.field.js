/**
 * @author windy
 * @version 2.0
 * Created by windy on 2022/1/11
 */
 BI.FormField = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-form-field",
        label: "",
        el: {},
        labelAlign: "right", // 文字默认右对齐
        validate: function () {
            return true;
        } // 默认返回true
    },

    render: function () {
        var self = this, o = this.options;

        var field = {
            type: "bi.absolute",
            items: [{
                el: BI.extend({}, o.el, {
                    ref: function (_ref) {
                        self.field = _ref;
                        o.el.ref && o.el.ref.call(this, _ref);
                    },
                    height: o.el.height || 28,
                    listeners: BI.concat(o.el.listeners, [{
                        eventName: "EVENT_CHANGE",
                        action: function () {
                            self.fireEvent("EVENT_CHANGE");
                        }
                    }, {
                        eventName: "EVENT_CONFIRM",
                        action: function () {
                            self.fireEvent("EVENT_CONFIRM");
                        }
                    }])
                }),
                left: 0,
                bottom: 0,
                right: 0,
                top: 0
            }, {
                el: {
                    type: "bi.label",
                    cls: "error-tip bi-error",
                    ref: function (_ref) {
                        self.error = _ref;
                    },
                    invisible: true
                },
                bottom: -20,
                left: 0,
                right: 0,
                height: 20
            }]
        };

        return {
            type: "bi.vertical_adapt",
            columnSize: ["auto", "fill"],
            verticalAlign: BI.VerticalAlign.Stretch,
            items: BI.isKey(o.label) ? [{
                el: {
                    type: "bi.label",
                    textAlign: o.labelAlign,
                    text: o.label,
                    width: o.labelWidth,
                    rgap: 20 // 表单文字与右侧输入间距均为20px
                }
            }, field] : [field]
        };
    },

    getValue: function () {
        return this.field.getValue();
    },

    validate: function () {
        var isValid = this.validateWithNoTip();
        !isValid && this.error.setText(this.options.tip(this.field.getValue(), this.field));
        this.error.setVisible(!isValid);
        this.field.element[isValid ? "removeClass" : "addClass"]("bi-error");

        return isValid;
    },

    validateWithNoTip: function () {
        return this.options.validate(this.field.getValue(), this.field);
    }
});

BI.shortcut("bi.form_field", BI.FormField);
