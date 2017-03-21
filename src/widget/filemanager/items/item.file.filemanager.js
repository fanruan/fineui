/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerFileItem
 * @extends BI.Single
 */
BI.FileManagerFileItem = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerFileItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-file-item bi-list-item",
            height: 30
        })
    },

    _init: function () {
        BI.FileManagerFileItem.superclass._init.apply(this, arguments);
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

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.checked,
                width: 36
            }, {
                el: {
                    type: "bi.icon_button",
                    cls: "create-by-me-file-font"
                },
                width: 20
            }, {
                el: {
                    type: "bi.label",
                    textAlign: "left",
                    height: o.height,
                    text: o.text,
                    value: o.value
                }
            }]
        })
    },

    getAllLeaves: function(){
        return [this.options.value];
    },

    isSelected: function () {
        return this.checked.isSelected();
    },

    setSelected: function (v) {
        this.checked.setSelected(v);
    }
});
BI.FileManagerFileItem.EVENT_CHANGE = "FileManagerFileItem.EVENT_CHANGE";
$.shortcut("bi.file_manager_file_item", BI.FileManagerFileItem);