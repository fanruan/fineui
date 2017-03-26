/**
 * Created by zcf on 2016/12/21.
 */
BI.MultiStringListPopup=BI.inherit(BI.Widget,{
    _defaultConfig:function () {
        return BI.extend(BI.MultiStringListPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-list-popup",
            itemsCreator: BI.emptyFn
        });
    },
    _init:function () {
        BI.MultiStringListPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popup = BI.createWidget({
            type: "bi.sync_tree",
            height: 400,
            element:this.element,
            itemsCreator: o.itemsCreator
        });
        this.popup.on(BI.TreeView.EVENT_AFTERINIT, function () {
            self.fireEvent(BI.MultiStringListPopup.EVENT_AFTER_INIT)
        });
        this.popup.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiStringListPopup.EVENT_CHANGE)
        });
    },

    hasChecked: function () {
        return this.popup.hasChecked();
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        v || (v = {});
        this.popup.setValue(v.value);
    },

    populate: function (config) {
        this.popup.stroke(config);
    }

});
BI.MultiStringListPopup.EVENT_AFTER_INIT="BI.MultiStringListPopup.EVENT_AFTER_INIT";
BI.MultiStringListPopup.EVENT_CHANGE="BI.MultiStringListPopup.EVENT_CHANGE";
$.shortcut("bi.multi_tree_list_popup",BI.MultiStringListPopup);