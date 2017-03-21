/**
 * 普通控件
 *
 * @class BI.YearSeasonParamPopupView
 * @extends BI.ParamPopupView
 */
BI.YearSeasonParamPopupView = BI.inherit(BI.ParamPopupView, {

    _defaultConfig: function () {
        return BI.extend(BI.YearSeasonParamPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-year-season-param-popup'
        });
    },

    _init: function () {
        BI.YearSeasonParamPopupView.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            type: "bi.param0_date_item",
            selected: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_QUARTER,
            disabled: true
        }]
    }
});
BI.YearSeasonParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.year_season_param_popup_view', BI.YearSeasonParamPopupView);