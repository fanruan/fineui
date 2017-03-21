(function ($) {

    /**
     * 普通控件
     *
     * @class BI.QuarterCard
     * @extends BI.MultiDateCard
     */
    BI.QuarterCard = BI.inherit(BI.MultiDateCard, {

        _defaultConfig: function () {
            return $.extend(BI.QuarterCard.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-quartercard'
            });
        },

        _init: function () {
            BI.QuarterCard.superclass._init.apply(this, arguments);
        },

        dateConfig: function(){
            return [{
                selected: true,
                value: BICst.MULTI_DATE_QUARTER_PREV,
                isEditorExist: true,
                text: BI.i18nText("BI-Multi_Date_Quarter_Prev")
            },
                {
                    value: BICst.MULTI_DATE_QUARTER_AFTER,
                    isEditorExist: true,
                    text: BI.i18nText("BI-Multi_Date_Quarter_Next")
                },
                {
                    value: BICst.MULTI_DATE_QUARTER_BEGIN,
                    isEditorExist: false,
                    text: BI.i18nText("BI-Multi_Date_Quarter_Begin")
                },
                {
                    value: BICst.MULTI_DATE_QUARTER_END,
                    isEditorExist: false,
                    text: BI.i18nText("BI-Multi_Date_Quarter_End")
                }]
        },

        defaultSelectedItem: function(){
            return BICst.MULTI_DATE_QUARTER_PREV;
        }
    });
    BI.QuarterCard.EVENT_CHANGE = "EVENT_CHANGE";
    $.shortcut('bi.quartercard', BI.QuarterCard);
})(jQuery);