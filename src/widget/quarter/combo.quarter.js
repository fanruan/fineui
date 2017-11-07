/**
 * 季度下拉框
 *
 * Created by GUY on 2015/8/28.
 * @class BI.QuarterCombo
 * @extends BI.Widget
 */
BI.QuarterCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.QuarterCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-quarter-combo",
            behaviors: {},
            height: 25
        });
    },
    _init: function () {
        BI.QuarterCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = "";
        this.trigger = BI.createWidget({
            type: "bi.quarter_trigger"
        });

        this.trigger.on(BI.QuarterTrigger.EVENT_FOCUS, function () {
            self.storeValue = this.getKey();
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_STOP, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            if (this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getKey());
            } else if (!this.getKey()) {
                self.setValue();
            }
            self.fireEvent(BI.QuarterCombo.EVENT_CONFIRM);
        });
        this.popup = BI.createWidget({
            type: "bi.quarter_popup",
            behaviors: o.behaviors
        });

        this.popup.on(BI.QuarterPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.QuarterCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                el: this.popup
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.QuarterCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue() || "";
    }
});

BI.QuarterCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.QuarterCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut('bi.quarter_combo', BI.QuarterCombo);