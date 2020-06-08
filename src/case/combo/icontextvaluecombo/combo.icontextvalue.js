/**
 * Created by Windy on 2017/12/12.
 * combo : icon + text + icon, popup : icon + text
 */
BI.IconTextValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.IconTextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-icon-text-value-combo",
            height: 24,
            iconHeight: null,
            iconWidth: null,
            value: "",
            attributes: {
                tabIndex: 0
            }
        });
    },

    _init: function () {
        BI.IconTextValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_icon_text_trigger",
            cls: "icon-text-value-trigger",
            items: o.items,
            height: o.height,
            text: o.text,
            iconCls: o.iconCls,
            value: o.value,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            iconWrapperWidth: o.iconWrapperWidth,
            title: o.title,
            warningTitle: o.warningTitle
        });
        this.popup = BI.createWidget({
            type: "bi.icon_text_value_combo_popup",
            items: o.items,
            value: o.value,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            iconWrapperWidth: o.iconWrapperWidth
        });
        this.popup.on(BI.IconTextValueComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.textIconCombo.hideView();
            self.fireEvent(BI.IconTextValueCombo.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            container: o.container,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 240,
                minHeight: 25
            }
        });
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    _checkError: function (v) {
        if(BI.isNull(v) || BI.isEmptyArray(v)) {
            this.trigger.options.tipType = "success";
            this.element.removeClass("combo-error");
        } else {
            v = BI.isArray(v) ? v : [v];
            var result = BI.find(this.options.items, function (idx, item) {
                return BI.contains(v, item.value);
            });
            if (BI.isNull(result)) {
                this.trigger.options.tipType = "warning";
                this.element.removeClass("combo-error").addClass("combo-error");
            } else {
                this.trigger.options.tipType = "success";
                this.element.removeClass("combo-error");
            }
        }
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
        this._checkError(v);
    },

    getValue: function () {
        var value = this.popup.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCombo.populate(items);
    }
});
BI.IconTextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_value_combo", BI.IconTextValueCombo);
