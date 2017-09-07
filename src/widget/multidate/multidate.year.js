/**
 * 普通控件
 *
 * @class BI.YearCard
 * @extends BI.MultiDateCard
 */
BI.YearCard = BI.inherit(BI.MultiDateCard, {
    _defaultConfig: function () {
        return $.extend(BI.YearCard.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multidate-yearcard'
        });
    },

    _init: function () {
        BI.YearCard.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            selected: true,
            isEditorExist: true,
            text: BI.i18nText("BI-Multi_Date_Year_Prev"),
            value: BICst.DATE_TYPE.MULTI_DATE_YEAR_PREV
        },
            {
                isEditorExist: true,
                text: BI.i18nText("BI-Multi_Date_Year_Next"),
                value: BICst.DATE_TYPE.MULTI_DATE_YEAR_AFTER
            },
            {
                isEditorExist: false,
                value: BICst.DATE_TYPE.MULTI_DATE_YEAR_BEGIN,
                text: BI.i18nText("BI-Multi_Date_Year_Begin")
            },
            {
                isEditorExist: false,
                value: BICst.DATE_TYPE.MULTI_DATE_YEAR_END,
                text: BI.i18nText("BI-Multi_Date_Year_End")
            }]
    },

    defaultSelectedItem: function () {
        return BICst.DATE_TYPE.MULTI_DATE_YEAR_PREV;
    }
});
BI.YearCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.yearcard', BI.YearCard);
