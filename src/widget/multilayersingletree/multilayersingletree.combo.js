/**
 * 多层级下拉单选树
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSingleTreeCombo
 * @extends BI.Widget
 */
BI.MultiLayerSingleTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-singletree-combo",
            isDefaultInit: false,
            height: 24,
            text: "",
            itemsCreator: BI.emptyFn,
            items: [],
            value: ""
        });
    },

    _init: function () {
        BI.MultiLayerSingleTreeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items,
            value: o.value
        });

        this.popup = BI.createWidget({
            type: "bi.multilayer_single_tree_popup",
            isDefaultInit: o.isDefaultInit,
            itemsCreator: o.itemsCreator,
            items: o.items,
            value: o.value
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });

        this.combo.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.popup.on(BI.MultiLayerSingleTreePopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.combo.populate(items);
    }
});

BI.MultiLayerSingleTreeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_combo", BI.MultiLayerSingleTreeCombo);