/**
 * 带加载的单选下拉面板
 * @class BI.SingleSelectPopupView
 * @extends Widget
 */
BI.SingleSelectPopupView = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-popup-view",
            allowNoSelect: false,
            maxWidth: "auto",
            minWidth: 135,
            maxHeight: 400,
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.SingleSelectPopupView.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;

        this.loader = BI.createWidget({
            type: "bi.single_select_loader",
            allowNoSelect: opts.allowNoSelect,
            itemsCreator: opts.itemsCreator,
            valueFormatter: opts.valueFormatter,
            onLoaded: opts.onLoaded,
            value: opts.value
        });

        this.popupView = BI.createWidget({
            type: "bi.popup_view",
            stopPropagation: false,
            maxWidth: opts.maxWidth,
            minWidth: opts.minWidth,
            maxHeight: opts.maxHeight,
            element: this,
            el: this.loader,
            value: opts.value
        });

        this.popupView.on(BI.MultiPopupView.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleSelectPopupView.EVENT_CHANGE);
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

BI.SingleSelectPopupView.EVENT_CHANGE = "EVENT_CHANGE";


BI.shortcut("bi.single_select_popup_view", BI.SingleSelectPopupView);
