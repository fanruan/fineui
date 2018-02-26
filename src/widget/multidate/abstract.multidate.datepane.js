/**
 * 普通控件
 *
 * @class BI.MultiDateCard
 * @extends BI.Widget
 * @abstract
 */
BI.MultiDateCard = BI.inherit(BI.Widget, {

    constants: {
        lgap: 80,
        itemHeight: 35,
        defaultEditorValue: "1"
    },

    _defaultConfig: function () {
        return $.extend(BI.MultiDateCard.superclass._defaultConfig.apply(this, arguments), {});
    },

    dateConfig: function () {

    },

    defaultSelectedItem: function () {

    },

    _init: function () {
        BI.MultiDateCard.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;

        this.label = BI.createWidget({
            type: "bi.label",
            height: this.constants.itemHeight,
            textAlign: "left",
            text: BI.i18nText("BI-Multi_Date_Relative_Current_Time"),
            cls: "bi-multidate-inner-label bi-tips"
        });
        this.radioGroup = BI.createWidget({
            type: "bi.button_group",
            chooseType: 0,
            items: BI.createItems(this.dateConfig(), {
                type: "bi.multidate_segment",
                height: this.constants.itemHeight
            }),
            layouts: [{
                type: "bi.vertical"
            }]
        });

        this.radioGroup.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CONFIRM) {
                self.fireEvent(BI.MultiDateCard.EVENT_CHANGE);
            }
        });
        this.radioGroup.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.MultiDateCard.EVENT_CHANGE);
        });
        BI.createWidget({
            element: this,
            type: "bi.center_adapt",
            lgap: this.constants.lgap,
            items: [{
                type: "bi.vertical",
                items: [this.label, this.radioGroup]
            }]
        });
    },

    getValue: function () {
        var button = this.radioGroup.getSelectedButtons()[0];
        var type = button.getValue(), value = button.getInputValue();
        return {
            type: type,
            value: value
        };
    },

    _isTypeAvaliable: function (type) {
        var res = false;
        BI.find(this.dateConfig(), function (i, item) {
            if (item.value === type) {
                res = true;
                return true;
            }
        });
        return res;
    },

    setValue: function (v) {
        var self = this;
        if (BI.isNotNull(v) && this._isTypeAvaliable(v.type)) {
            this.radioGroup.setValue(v.type);
            BI.each(this.radioGroup.getAllButtons(), function (i, button) {
                if (button.isEditorExist() === true && button.isSelected()) {
                    button.setInputValue(v.value);
                } else {
                    button.setInputValue(self.constants.defaultEditorValue);
                }
            });
        } else {
            this.radioGroup.setValue(this.defaultSelectedItem());
            BI.each(this.radioGroup.getAllButtons(), function (i, button) {
                button.setInputValue(self.constants.defaultEditorValue);
            });
        }
    },

    getCalculationValue: function () {
        var valueObject = this.getValue();
        var type = valueObject.type, value = valueObject.value;
        switch (type) {
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_DAY_PREV:
                return BI.getDate().getOffsetDate(-1 * value);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_DAY_AFTER:
                return BI.getDate().getOffsetDate(value);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_DAY_TODAY:
                return BI.getDate();
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_MONTH_PREV:
                return BI.getDate().getBeforeMultiMonth(value);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_MONTH_AFTER:
                return BI.getDate().getAfterMultiMonth(value);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_MONTH_BEGIN:
                return BI.getDate(BI.getDate().getFullYear(), BI.getDate().getMonth(), 1);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_MONTH_END:
                return BI.getDate(BI.getDate().getFullYear(), BI.getDate().getMonth(), (BI.getDate().getLastDateOfMonth()).getDate());
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_QUARTER_PREV:
                return BI.getDate().getBeforeMulQuarter(value);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_QUARTER_AFTER:
                return BI.getDate().getAfterMulQuarter(value);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_QUARTER_BEGIN:
                return BI.getDate().getQuarterStartDate();
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_QUARTER_END:
                return BI.getDate().getQuarterEndDate();
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_WEEK_PREV:
                return BI.getDate().getOffsetDate(-7 * value);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_WEEK_AFTER:
                return BI.getDate().getOffsetDate(7 * value);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_YEAR_PREV:
                return BI.getDate((BI.getDate().getFullYear() - 1 * value), BI.getDate().getMonth(), BI.getDate().getDate());
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_YEAR_AFTER:
                return BI.getDate((BI.getDate().getFullYear() + 1 * value), BI.getDate().getMonth(), BI.getDate().getDate());
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_YEAR_BEGIN:
                return BI.getDate(BI.getDate().getFullYear(), 0, 1);
            case BI.MultiDateCombo.DATE_TYPE.MULTI_DATE_YEAR_END:
                return BI.getDate(BI.getDate().getFullYear(), 11, 31);
        }
    }
});
BI.MultiDateCard.EVENT_CHANGE = "EVENT_CHANGE";
