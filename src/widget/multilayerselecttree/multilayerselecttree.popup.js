/**
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSelectTreePopup
 * @extends BI.Pane
 */

BI.MultiLayerSelectTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSelectTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-select-tree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            isDefaultInit: false,
            itemsCreator: BI.emptyFn,
            items: []
        });
    },

    _init: function () {
        BI.MultiLayerSelectTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: 'bi.multilayer_select_level_tree',
            isDefaultInit: o.isDefaultInit,
            items: o.items,
            itemsCreator: o.itemsCreator
        });

        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            scrollable: true,
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.MultiLayerSelectLevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiLayerSelectTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.MultiLayerSelectTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.MultiLayerSelectTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_select_tree_popup", BI.MultiLayerSelectTreePopup);