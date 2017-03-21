/**
 * 普通控件
 *
 * @class BI.DateIntervalParamPopupView
 * @extends BI.ParamPopupView
 */
BI.DateIntervalParamPopupView = BI.inherit(BI.ParamPopupView, {

    _defaultConfig: function () {
        return BI.extend(BI.DateIntervalParamPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-date-interval-param-popup'
        });
    },

    _init: function () {
        BI.DateIntervalParamPopupView.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            type: "bi.param0_date_item",
            value: BICst.YEAR,
            selected: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_QUARTER,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_MONTH,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_WEEK,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_DAY,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.MONTH_WEEK,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.MONTH_DAY,
            disabled: true
        }]
    }
});
BI.DateIntervalParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.date_interval_param_popup_view', BI.DateIntervalParamPopupView);