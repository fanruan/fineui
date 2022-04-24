/**
 * 带加载的多选下拉面板
 * @class BI.MultiSelectPopupView
 * @extends Widget
 */
BI.MultiSelectNoBarPopupView = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectNoBarPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-popup-view",
            maxWidth: "auto",
            minWidth: 135,
            maxHeight: 400,
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            itemHeight: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectNoBarPopupView.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;

        this.loader = BI.createWidget({
            type: "bi.multi_select_no_bar_loader",
            itemsCreator: opts.itemsCreator,
            itemHeight: opts.itemHeight,
            valueFormatter: opts.valueFormatter,
            onLoaded: opts.onLoaded,
            value: opts.value
        });

        this.popupView = BI.createWidget({
            type: "bi.multi_popup_view",
            stopPropagation: false,
            maxWidth: opts.maxWidth,
            minWidth: opts.minWidth,
            maxHeight: opts.maxHeight,
            element: this,
            buttons: [BI.i18nText("BI-Basic_Clears"), BI.i18nText("BI-Basic_OK")],
            el: this.loader,
            value: opts.value
        });

        this.popupView.on(BI.MultiPopupView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectNoBarPopupView.EVENT_CHANGE);
        });
        this.popupView.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.fireEvent(BI.MultiSelectNoBarPopupView.EVENT_CLICK_CLEAR);
                    break;
                case 1:
                    self.fireEvent(BI.MultiSelectNoBarPopupView.EVENT_CLICK_CONFIRM);
                    break;
            }
        });
    },

    setStartValue: function (v) {
        this.loader.setStartValue(v);
    },

    setValue: function (v) {
        this.popupView.setValue(v);
    },

    getValue: function () {
        return this.popupView.getValue();
    },

    populate: function (items) {
        this.popupView.populate.apply(this.popupView, arguments);
    },

    resetHeight: function (h) {
        this.popupView.resetHeight(h);
    },

    resetWidth: function (w) {
        this.popupView.resetWidth(w);
    },

    setDirection: function (direction, position) {
        this.popupView.setDirection(direction, position);
    },
});

BI.MultiSelectNoBarPopupView.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectNoBarPopupView.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiSelectNoBarPopupView.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";


BI.shortcut("bi.multi_select_no_bar_popup_view", BI.MultiSelectNoBarPopupView);
