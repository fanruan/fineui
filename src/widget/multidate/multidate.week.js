;
(function ($) {

    /**
     * 普通控件
     *
     * @class BI.WeekCard
     * @extends BI.MultiDateCard
     */
    BI.WeekCard = BI.inherit(BI.MultiDateCard, {
        _defaultConfig: function () {
            return $.extend(BI.WeekCard.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-weekcard'
            });
        },

        _init: function () {
            BI.WeekCard.superclass._init.apply(this, arguments);
        },

        dateConfig: function(){
            return [{
                selected: true,
                isEditorExist: true,
                text: BI.i18nText("BI-Multi_Date_Week_Prev"),
                value: BICst.MULTI_DATE_WEEK_PREV
            },
                {
                    isEditorExist: true,
                    text: BI.i18nText("BI-Multi_Date_Week_Next"),
                    value: BICst.MULTI_DATE_WEEK_AFTER
                }];
        },

        defaultSelectedItem: function(){
            return BICst.MULTI_DATE_WEEK_PREV;
        }
    });
    BI.WeekCard.EVENT_CHANGE = "EVENT_CHANGE";
    $.shortcut('bi.weekcard', BI.WeekCard);
})(jQuery);