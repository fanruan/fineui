/**
 * 普通控件
 *
 * @class BI.YearMonthParamPopupView
 * @extends BI.ParamPopupView
 */
BI.YearMonthParamPopupView = BI.inherit(BI.ParamPopupView, {

    _defaultConfig: function () {
        return BI.extend(BI.YearMonthParamPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-year-month-param-popup'
        });
    },

    _init: function () {
        BI.YearMonthParamPopupView.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            type: "bi.param0_date_item",
            selected: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_MONTH,
            disabled: true
        }]
    }
});
BI.YearMonthParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.year_month_param_popup_view', BI.YearMonthParamPopupView);