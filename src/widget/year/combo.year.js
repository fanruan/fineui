/**
 * 年份下拉框
 *
 * Created by GUY on 2015/8/28.
 * @class BI.YearCombo
 * @extends BI.Widget
 */
BI.YearCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-combo",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 25
        });
    },
    _init: function () {
        BI.YearCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = "";
        this.trigger = BI.createWidget({
            type: "bi.year_trigger",
            min: o.min,
            max: o.max
        });
        this.trigger.on(BI.YearTrigger.EVENT_FOCUS, function () {
            self.storeValue = this.getKey();
        });
        this.trigger.on(BI.YearTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.YearTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.YearTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.YearTrigger.EVENT_CONFIRM, function () {
            if(self.combo.isViewVisible()) {
                return;
            }
            if (this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getKey());
            } else if (!this.getKey()) {
                self.setValue();
            }
            self.fireEvent(BI.YearCombo.EVENT_CONFIRM);
        });

        this.popup = BI.createWidget({
            type: "bi.year_popup",
            min: o.min,
            max: o.max
        });

        this.popup.on(BI.YearPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.YearCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: this.popup
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            var value = self.trigger.getKey();
            if (BI.isNotNull(value)) {
                self.popup.setValue(value);
            } else if(!value && value !== self.storeValue){
                self.popup.setValue(self.storeValue);
            }else {
                self.setValue();
            }
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.YearCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut('bi.year_combo', BI.YearCombo);