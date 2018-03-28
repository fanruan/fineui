/**
 * Created by Urthur on 2017/12/21.
 */
!(function () {
    BI.constant("bi.constant.component.filter", {
        FORMULA_COMBO: [{
            text: BI.i18nText("BI-Conf_Formula_And"),
            value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND
        }, {
            text: BI.i18nText("BI-Conf_Formula_Or"),
            value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR
        }],
        CONDITION_COMBO: [{
            text: BI.i18nText("BI-Conf_Condition_And"),
            value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND
        }, {
            text: BI.i18nText("BI-Conf_Condition_Or"),
            value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR
        }]
    });
}());