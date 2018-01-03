/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerFolderItem
 * @extends BI.Single
 */
BI.FileManagerFolderItem = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerFolderItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-folder-item bi-list-item bi-border-bottom",
            height: 30
        });
    },

    _init: function () {
        BI.FileManagerFolderItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checked = BI.createWidget({
            type: "bi.multi_select_bar",
            text: "",
            width: 36,
            height: o.height
        });
        this.checked.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button = BI.createWidget({
            type: "bi.text_button",
            textAlign: "left",
            height: o.height,
            text: o.text,
            value: o.value
        });
        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CHANGE, o.value, self);
        });

        this.tree = new BI.Tree();
        this.tree.initTree([{
            id: o.id,
            children: o.children
        }]);
        this.selectValue = [];

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.checked,
                width: 36
            }, {
                el: {
                    type: "bi.icon_button",
                    cls: "create-by-me-folder-font"
                },
                width: 20
            }, {
                el: this.button
            }]
        });
    },

    setAllSelected: function (v) {
        this.checked.setSelected(v);
        this.selectValue = [];
    },

    setHalfSelected: function (v) {
        this.checked.setHalfSelected(v);
        if(!v) {
            this.selectValue = [];
        }
    },

    setValue: function (v) {
        var self = this, o = this.options;
        var isHalf = false;
        var selectValue = [];
        this.tree.traverse(function (node) {
            if (node.isLeaf()) {
                if (BI.contains(v, node.get("data").value)) {
                    selectValue.push(node.get("data").value);
                } else {
                    isHalf = true;
                }
            }
        });
        this.setAllSelected(selectValue.length > 0 && !isHalf);
        this.setHalfSelected(selectValue.length > 0 && isHalf);
        if (this.checked.isHalfSelected()) {
            this.selectValue = selectValue;
        }
    },

    getAllButtons: function () {
        return [this];
    },

    getAllLeaves: function () {
        var o = this.options;
        var res = [];
        this.tree.traverse(function (node) {
            if (node.isLeaf()) {
                res.push(node.get("data").value);
            }
        });
        return res;
    },

    getNotSelectedValue: function () {
        var self = this, o = this.options;
        var res = [];
        var isAllSelected = this.checked.isSelected();
        if (isAllSelected === true) {
            return res;
        }
        var isHalfSelected = this.checked.isHalfSelected();
        this.tree.traverse(function (node) {
            if (node.isLeaf()) {
                var v = node.get("data").value;
                if (isHalfSelected === true) {
                    if (!BI.contains(self.selectValue, node.get("data").value)) {
                        res.push(v);
                    }
                } else {
                    res.push(v);
                }
            }
        });
        return res;
    },

    getValue: function () {
        var res = [];
        if (this.checked.isSelected()) {
            this.tree.traverse(function (node) {
                if (node.isLeaf()) {
                    res.push(node.get("data").value);
                }
            });
            return res;
        }
        if (this.checked.isHalfSelected()) {
            return this.selectValue;
        }
        return [];
    }
});
BI.FileManagerFolderItem.EVENT_CHANGE = "FileManagerFolderItem.EVENT_CHANGE";
BI.shortcut("bi.file_manager_folder_item", BI.FileManagerFolderItem);