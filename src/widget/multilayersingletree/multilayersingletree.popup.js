/**
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSingleTreePopup
 * @extends BI.Pane
 */

BI.MultiLayerSingleTreePopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-singletree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            isDefaultInit: false,
            itemsCreator: BI.emptyFn,
            items: [],
            onLoaded: BI.emptyFn,
            minHeight: 240
        });
    },

    _init: function () {
        BI.MultiLayerSingleTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: "bi.multilayer_single_level_tree",
            isDefaultInit: o.isDefaultInit,
            items: o.items,
            itemsCreator: o.itemsCreator,
            keywordGetter: o.keywordGetter,
            value: o.value,
            scrollable: null,
            onLoaded: function () {
                self.tree.check();
                o.onLoaded();
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            scrollable: true,
            element: this,
            vgap: 5,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.MultiLayerSingleLevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiLayerSingleTreePopup.EVENT_CHANGE);
        });

        this.tree.css("min-height", o.minHeight - 10);
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        this.tree.populate(items);
    }
});

BI.MultiLayerSingleTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_popup", BI.MultiLayerSingleTreePopup);