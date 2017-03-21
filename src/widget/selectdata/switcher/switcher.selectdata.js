/**
 * 切换业务包
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SelectDataSwitcher
 * @extends BI.Widget
 */
BI.SelectDataSwitcher = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataSwitcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-switcher",
            packages: [],
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataSwitcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.combo = BI.createWidget({
            type: "bi.single_tree_combo",
            height: 25,
            items: o.packages
        });
        this.combo.on(BI.SingleTreeCombo.EVENT_CHANGE, function () {
            self.tree.populate();
            self.fireEvent(BI.SelectDataSwitcher.EVENT_CHANGE, arguments);
        });

        this.tree = BI.createWidget({
            type: "bi.select_data_tree",
            itemsCreator: function () {
                var args = Array.prototype.slice.call(arguments, 0);
                args[0].packageId = self.getPackageId();
                o.itemsCreator.apply(self, args);
            }
        });
        this.tree.on(BI.SelectDataTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSwitcher.EVENT_CLICK_ITEM, arguments);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    hgap: 10,
                    items: [{
                        el: this.combo
                    }]
                },
                height: 30
            }, {
                el: this.tree
            }]
        });
    },

    setEnable: function (v) {
        BI.SelectDataSwitcher.superclass.setEnable.apply(this, arguments);
        this.tree.setEnable(v)
    },


    setPackage: function (pId) {
        this.combo.setValue([pId]);
        this.tree.populate();
    },

    getPackageId: function () {
        return this.combo.getValue()[0];
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        return this.tree.getValue();
    },

    populate: function () {
        this.tree.populate.apply(this.tree, arguments);
    },

    populatePackages: function (pacakges) {
        this.options.packages = pacakges;
        var pId = this.getPackageId();
        this.combo.populate(pacakges);
        if (BI.isKey(pId)) {
            this.combo.setValue(pId);
        }
    }
});
BI.SelectDataSwitcher.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.SelectDataSwitcher.EVENT_CHANGE = "SelectDataSwitcher.EVENT_CHANGE";
$.shortcut('bi.select_data_switcher', BI.SelectDataSwitcher);