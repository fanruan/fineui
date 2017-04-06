/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconCombo
 * @extend BI.Widget
 */
BI.IconCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.IconCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-icon-combo",
            width: 24,
            height: 24,
            iconClass: "",
            el: {},
            popup: {},
            minWidth: 100,
            maxWidth: 'auto',
            maxHeight: 300,
            direction: "bottom",
            adjustLength: 3,//调整的距离
            adjustXOffset: 0,
            adjustYOffset: 0,
            offsetStyle: "left",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        })
    },

    _init: function () {
        BI.IconCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.icon_combo_trigger",
            iconClass: o.iconClass,
            title: o.title,
            items: o.items,
            width: o.width,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        this.popup = BI.createWidget(o.popup, {
            type: "bi.icon_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.IconComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.iconCombo.hideView();
            self.fireEvent(BI.IconCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.iconCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            direction: o.direction,
            adjustLength: o.adjustLength,
            adjustXOffset: o.adjustXOffset,
            adjustYOffset: o.adjustYOffset,
            offsetStyle: o.offsetStyle,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxWidth: o.maxWidth,
                maxHeight: o.maxHeight,
                minWidth: o.minWidth
            }
        });
    },

    showView: function () {
        this.iconCombo.showView();
    },

    hideView: function () {
        this.iconCombo.hideView();
    },

    setValue: function (v) {
        this.iconCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.IconCombo.superclass.setEnable.apply(this, arguments);
        this.iconCombo.setEnable(v);
    },

    getValue: function () {
        return this.iconCombo.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.iconCombo.populate(items);
    }
});
BI.IconCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_combo", BI.IconCombo);