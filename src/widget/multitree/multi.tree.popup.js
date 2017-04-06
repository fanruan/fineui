/**
 * 带加载的多选下拉面板
 * @class BI.MultiTreePopup
 * @extends BI.Pane
 */
BI.MultiTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-tree-popup',
            maxWidth: 'auto',
            minWidth: 100,
            maxHeight: 400,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreePopup.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.selected_values = {};

        this.tree = BI.createWidget({
            type: "bi.sync_tree",
            height: 400,
            cls:"popup-view-tree",
            itemsCreator: opts.itemsCreator,
            onLoaded: opts.onLoaded
        });

        this.popupView = BI.createWidget({
            type: "bi.multi_popup_view",
            element: this,
            stopPropagation: false,
            maxWidth: opts.maxWidth,
            minWidth: opts.minWidth,
            maxHeight: opts.maxHeight,
            buttons: [BI.i18nText('BI-Basic_Clears'), BI.i18nText('BI-Basic_Sure')],
            el: this.tree
        });

        this.popupView.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.fireEvent(BI.MultiTreePopup.EVENT_CLICK_CLEAR);
                    break;
                case 1:
                    self.fireEvent(BI.MultiTreePopup.EVENT_CLICK_CONFIRM);
                    break;
            }
        });

        this.tree.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiTreePopup.EVENT_CHANGE);
        });

        this.tree.on(BI.TreeView.EVENT_AFTERINIT, function () {
            self.fireEvent(BI.MultiTreePopup.EVENT_AFTERINIT);
        });

    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v || (v = {});
        this.tree.setSelectedValue(v.value);
    },

    populate: function (config) {
        this.tree.stroke(config);
    },

    hasChecked: function () {
        return this.tree.hasChecked();
    },

    setEnable: function (arg) {
        this.popupView.setEnable(arg);
    },

    resetHeight: function (h) {
        this.popupView.resetHeight(h);
    },

    resetWidth: function (w) {
        this.popupView.resetWidth(w);
    }
});

BI.MultiTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiTreePopup.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiTreePopup.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";
BI.MultiTreePopup.EVENT_AFTERINIT = "EVENT_AFTERINIT";


BI.shortcut('bi.multi_tree_popup_view', BI.MultiTreePopup);