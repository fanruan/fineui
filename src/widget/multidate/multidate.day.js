(function ($) {
    /**
     * 普通控件
     *
     * @class BI.DayCard
     * @extends BI.MultiDateCard
     */
    BI.DayCard = BI.inherit(BI.MultiDateCard, {

        _defaultConfig: function () {
            return $.extend(BI.DayCard.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-daycard'
            });
        },

        _init: function () {
            BI.DayCard.superclass._init.apply(this, arguments);
        },

        dateConfig: function(){
            return [{
                isEditorExist: true,
                selected: true,
                text: BI.i18nText("BI-Multi_Date_Day_Prev"),
                value: BICst.MULTI_DATE_DAY_PREV
            },
                {
                    isEditorExist: true,
                    text: BI.i18nText("BI-Multi_Date_Day_Next"),
                    value: BICst.MULTI_DATE_DAY_AFTER
                },
                {
                    isEditorExist: false,
                    value: BICst.MULTI_DATE_DAY_TODAY,
                    text: BI.i18nText("BI-Multi_Date_Today")
                }];
        },

        defaultSelectedItem: function(){
            return BICst.MULTI_DATE_DAY_PREV
        }
    });
    BI.DayCard.EVENT_CHANGE = "EVENT_CHANGE";
    $.shortcut('bi.daycard', BI.DayCard);
})(jQuery);