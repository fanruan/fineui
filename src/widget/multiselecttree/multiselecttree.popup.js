/**
 * Created by zcf on 2016/12/21.
 */
BI.MultiSelectTreePopup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-tree-popup bi-border-left bi-border-right bi-border-bottom",
            itemsCreator: BI.emptyFn
        });
    },
    _init: function () {
        BI.MultiSelectTreePopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popup = BI.createWidget({
            type: "bi.async_tree",
            showLine: o.showLine,
            element: this,
            itemsCreator: o.itemsCreator
        });
        this.popup.on(BI.TreeView.EVENT_AFTERINIT, function () {
            self.fireEvent(BI.MultiSelectTreePopup.EVENT_AFTER_INIT);
        });
        this.popup.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectTreePopup.EVENT_CHANGE);
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
        this.popup.setValue(v);
    },

    setSelectedValue: function (v) {
        v || (v = {});
        this.popup.setSelectedValue(v);
    },

    updateValue: function (v) {
        this.popup.updateValue(v);
        this.popup.refresh();
    },

    populate: function (config) {
        this.popup.stroke(config);
    }

});
BI.MultiSelectTreePopup.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";
BI.MultiSelectTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_tree_popup", BI.MultiSelectTreePopup);