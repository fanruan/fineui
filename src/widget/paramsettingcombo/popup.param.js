/**
 * 普通控件
 *
 * @class BI.ParamPopupView
 * @extends BI.Widget
 * @abstract
 */
BI.ParamPopupView = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ParamPopupView.superclass._defaultConfig.apply(this, arguments), {});
    },

    dateConfig: function(){

    },

    _init: function () {
        BI.ParamPopupView.superclass._init.apply(this, arguments);
        var self = this;

        this.radioGroup = BI.createWidget({
            type: "bi.button_group",
            chooseType: 0,
            items: this.dateConfig(),
            layouts: [{
                type: "bi.vertical",
                items: [{
                    type: "bi.vertical",
                    vgap: 5
                }],
                vgap: 5,
                hgap: 5
            }]
        });

        this.radioGroup.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.ParamPopupView.EVENT_CHANGE);
        });
        this.popup = BI.createWidget({
            type: 'bi.multi_popup_view',
            element: this,
            el: this.radioGroup,
            minWidth: 310,
            stopPropagation: false
        });

        this.popup.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function () {
            self.fireEvent(BI.ParamPopupView.EVENT_CONFIRM);
        });

    },

    setValue: function (v) {
        this.radioGroup.setValue(v.type);
        BI.each(this.radioGroup.getAllButtons(), function (i, button) {
            if (button.isSelected()) {
                button.setEnable(true);
                button.setInputValue(v.value);
            } else {
                button.setEnable(false);
            }
        });
    },

    getValue: function () {
        var button = this.radioGroup.getSelectedButtons()[0];
        var type = button.getValue(), value = button.getInputValue();
        return {
            type: type,
            value: value
        }
    },

    getCalculationValue: function () {
        var valueObject = this.getValue();
        var type = valueObject.type, value = valueObject.value;
        var fPrevOrAfter = value.foffset === 0 ? -1 : 1;
        var sPrevOrAfter = value.soffset === 0 ? -1 : 1;
        var start, end;
        start = end = new Date();
        var ydate = new Date((new Date().getFullYear() + fPrevOrAfter * value.fvalue), new Date().getMonth(), new Date().getDate());
        switch (type) {
            case BICst.YEAR:
                start = new Date((new Date().getFullYear() + fPrevOrAfter * value.fvalue), 0, 1);
                end = new Date(start.getFullYear(), 11, 31);
                break;
            case BICst.YEAR_QUARTER:
                ydate = new Date().getOffsetQuarter(ydate, sPrevOrAfter * value.svalue);
                start = ydate.getQuarterStartDate();
                end = ydate.getQuarterEndDate();
                break;
            case BICst.YEAR_MONTH:
                ydate = new Date().getOffsetMonth(ydate, sPrevOrAfter * value.svalue);
                start = new Date(ydate.getFullYear(), ydate.getMonth(), 1);
                end  = new Date(ydate.getFullYear(), ydate.getMonth(), (ydate.getLastDateOfMonth()).getDate());
                break;
            case BICst.YEAR_WEEK:
                start = ydate.getOffsetDate(sPrevOrAfter * 7 * value.svalue);
                end = start.getOffsetDate(7);
                break;
            case BICst.YEAR_DAY:
                start = ydate.getOffsetDate(sPrevOrAfter * value.svalue);
                end = start.getOffsetDate(1);
                break;
            case BICst.MONTH_WEEK:
                var mdate = new Date().getOffsetMonth(new Date(), fPrevOrAfter * value.fvalue);
                start = mdate.getOffsetDate(sPrevOrAfter * 7 * value.svalue);
                end = start.getOffsetDate(7);
                break;
            case BICst.MONTH_DAY:
                var mdate = new Date().getOffsetMonth(new Date(), fPrevOrAfter * value.fvalue);
                start = mdate.getOffsetDate(sPrevOrAfter * value.svalue);
                end = start.getOffsetDate(1);
                break;
        }
        return {
            start: start,
            end: end
        };
    },

    resetWidth: function(w){
        this.popup.resetWidth(w);
    },

    resetHeight: function(h){
        this.popup.resetHeight(h);
    }
});
BI.ParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
BI.ParamPopupView.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.param_popup_view", BI.ParamPopupView);