/**
 * @class BI.SingleTreePopup
 * @extends BI.Pane
 */

BI.SingleTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-tree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            items: []
        });
    },

    _init: function () {
        BI.SingleTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: 'bi.level_tree',
            expander: {
                isDefaultInit: true
            },
            items: o.items,
            chooseType: BI.Selection.Single
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleTreePopup.EVENT_CHANGE);
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
        BI.SingleTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.SingleTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_tree_popup", BI.SingleTreePopup);