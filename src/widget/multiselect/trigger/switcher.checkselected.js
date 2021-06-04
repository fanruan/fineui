/**
 * 查看已选switcher
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectCheckSelectedSwitcher
 * @extends Widget
 */
BI.MultiSelectCheckSelectedSwitcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckSelectedSwitcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-check-selected-switcher",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            el: {},
            popup: {},
            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiSelectCheckSelectedSwitcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.button = BI.createWidget(o.el, {
            type: "bi.multi_select_check_selected_button",
            itemsCreator: o.itemsCreator,
            value: o.value
        });
        this.button.on(BI.Events.VIEW, function () {
            self.fireEvent(BI.Events.VIEW, arguments);
        });
        this.switcher = BI.createWidget({
            type: "bi.switcher",
            toggle: false,
            element: this,
            el: this.button,
            popup: BI.extend({
                type: "bi.multi_select_check_pane",
                valueFormatter: o.valueFormatter,
                itemsCreator: o.itemsCreator,
                onClickContinueSelect: function () {
                    self.switcher.hideView();
                },
                ref: function (_ref) {
                    self.checkPane = _ref;
                },
                value: o.value
            }, o.popup),
            adapter: o.adapter,
            masker: o.masker
        });
        this.switcher.on(BI.Switcher.EVENT_TRIGGER_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE);
        });
        this.switcher.on(BI.Switcher.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW);
        });
        this.switcher.on(BI.Switcher.EVENT_AFTER_HIDEVIEW, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedSwitcher.EVENT_AFTER_HIDEVIEW);
        });
        this.switcher.on(BI.Switcher.EVENT_AFTER_POPUPVIEW, function () {
            var me = this;
            BI.nextTick(function () {
                me._populate();
            });
        });
    },

    adjustView: function () {
        this.switcher.adjustView();
    },

    hideView: function () {
        this.switcher.empty();
        this.switcher.hideView();
    },

    setAdapter: function (adapter) {
        this.switcher.setAdapter(adapter);
    },

    setValue: function (v) {
        this.switcher.setValue(v);
    },

    // 与setValue的区别是只更新查看已选面板的的selectedValue, 不会更新按钮的计数
    updateSelectedValue: function (v) {
        this.checkPane.setValue(v);
    },

    setButtonChecked: function (v) {
        this.button.setValue(v);
    },

    getValue: function () {

    },

    populate: function (items) {
        this.switcher.populate.apply(this.switcher, arguments);
    },

    populateSwitcher: function () {
        this.button.populate.apply(this.button, arguments);
    }
});

BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.MultiSelectCheckSelectedSwitcher.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";
BI.shortcut("bi.multi_select_check_selected_switcher", BI.MultiSelectCheckSelectedSwitcher);