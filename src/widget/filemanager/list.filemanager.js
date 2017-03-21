/**
 * 文件管理控件列表
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerList
 * @extends BI.Widget
 */
BI.FileManagerList = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-list",
            el: {},
            items: []
        })
    },

    _init: function () {
        BI.FileManagerList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.list = BI.createWidget({
            type: "bi.select_list",
            element: this,
            items: o.items,
            toolbar: {
                type: "bi.multi_select_bar",
                height: 40,
                text: ""
            },
            el: {
                type: "bi.list_pane",
                el: BI.isWidget(o.el) ? o.el : BI.extend({
                    type: "bi.file_manager_button_group"
                }, o.el)
            }
        });
        this.list.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    setValue: function (v) {
        this.list.setValue({
            value: v
        });
    },

    getValue: function () {
        return this.list.getValue();
    },

    populate: function (items) {
        this.list.populate(items);
        this.list.setToolBarVisible(true);
    }
});
BI.FileManagerList.EVENT_CHANGE = "FileManagerList.EVENT_CHANGE";
$.shortcut("bi.file_manager_list", BI.FileManagerList);