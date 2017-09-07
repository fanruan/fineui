/**
 * 普通控件
 *
 * @class BI.MonthCard
 * @extends BI.MultiDateCard
 */
BI.MonthCard = BI.inherit(BI.MultiDateCard, {
    _defaultConfig: function () {
        return $.extend(BI.MonthCard.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multidate-monthcard'
        });
    },

    _init: function () {
        BI.MonthCard.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            selected: true,
            isEditorExist: true,
            value: BICst.DATE_TYPE.MULTI_DATE_MONTH_PREV,
            text: BI.i18nText("BI-Multi_Date_Month_Prev")
        },
            {
                isEditorExist: true,
                value: BICst.DATE_TYPE.MULTI_DATE_MONTH_AFTER,
                text: BI.i18nText("BI-Multi_Date_Month_Next")
            },
            {
                value: BICst.DATE_TYPE.MULTI_DATE_MONTH_BEGIN,
                isEditorExist: false,
                text: BI.i18nText("BI-Multi_Date_Month_Begin")
            },
            {
                value: BICst.DATE_TYPE.MULTI_DATE_MONTH_END,
                isEditorExist: false,
                text: BI.i18nText("BI-Multi_Date_Month_End")
            }];
    },

    defaultSelectedItem: function () {
        return BICst.DATE_TYPE.MULTI_DATE_MONTH_PREV;
    }
});
BI.MonthCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.monthcard', BI.MonthCard);
