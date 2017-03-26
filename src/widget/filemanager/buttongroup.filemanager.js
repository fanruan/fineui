/**
 * 文件管理控件组
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerButtonGroup
 * @extends BI.Widget
 */
BI.FileManagerButtonGroup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerButtonGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-button_group",
            items: []
        })
    },

    _init: function () {
        BI.FileManagerButtonGroup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.button_group = BI.createWidget({
            type: "bi.button_tree",
            element: this,
            chooseType: BI.Selection.Multi,
            items: this._formatItems(o.items),
            layouts: [{
                type: "bi.vertical"
            }]
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    _formatItems: function (items) {
        var self = this, o = this.options;
        BI.each(items, function (i, item) {
            if (item.children && item.children.length > 0) {
                item.type = "bi.file_manager_folder_item";
            } else {
                item.type = "bi.file_manager_file_item";
            }
        });
        return items;
    },

    setValue: function (v) {
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getNotSelectedValue: function () {
        return this.button_group.getNotSelectedValue();
    },

    getAllLeaves: function () {
        return this.button_group.getAllLeaves();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    getSelectedButtons: function () {
        return this.button_group.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.button_group.getNotSelectedButtons();
    },

    populate: function (items) {
        this.button_group.populate(this._formatItems(items));
    }
});
BI.FileManagerButtonGroup.EVENT_CHANGE = "FileManagerButtonGroup.EVENT_CHANGE";
$.shortcut("bi.file_manager_button_group", BI.FileManagerButtonGroup);