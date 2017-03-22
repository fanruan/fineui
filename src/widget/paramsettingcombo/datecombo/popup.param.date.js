/**
 * 普通控件
 *
 * @class BI.DateParamPopupView
 * @extends BI.ParamPopupView
 */
BI.DateParamPopupView = BI.inherit(BI.ParamPopupView, {

    _defaultConfig: function () {
        return BI.extend(BI.DateParamPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-date-param-popup'
        });
    },

    _init: function () {
        BI.DateParamPopupView.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            type: "bi.param3_date_item",
            value: BICst.YEAR,
            selected: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_QUARTER,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_MONTH,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_WEEK,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_DAY,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.MONTH_WEEK,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.MONTH_DAY,
            disabled: true
        }]
    }
});
BI.DateParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.date_param_popup_view', BI.DateParamPopupView);