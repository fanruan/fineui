/**
 * 文件管理导航按钮
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerNavButton
 * @extends BI.Widget
 */
BI.FileManagerNavButton = BI.inherit(BI.Widget, {

    _const: {
        normal_color: "#ffffff",
        select_color: "#eff1f4"
    },
    _defaultConfig: function () {
        return BI.extend(BI.FileManagerNavButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-nav-button",
            selected: false,
            height: 40
        })
    },

    _init: function () {
        BI.FileManagerNavButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.button = BI.createWidget({
            type: "bi.text_button",
            cls: "file-manager-nav-button-text bi-card",
            once: true,
            selected: o.selected,
            text: o.text,
            title: o.text,
            value: o.value,
            height: o.height,
            lgap: 20,
            rgap: 10
        });
        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        var svg = BI.createWidget({
            type: "bi.svg",
            cls: "file-manager-nav-button-triangle",
            width: 15,
            height: o.height
        });
        var path = svg.path("M0,0L15,20L0,40").attr({
            "stroke": c.select_color,
            "fill": o.selected ? c.select_color : c.normal_color
        });
        this.button.on(BI.TextButton.EVENT_CHANGE, function () {
            if (this.isSelected()) {
                path.attr("fill", c.select_color);
            } else {
                path.attr("fill", c.normal_color);
            }
        });
        BI.createWidget({
            type: "bi.default",
            element: this,
            items: [this.button]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: svg,
                right: -15,
                top: 0,
                bottom: 0
            }]
        })
    },

    isSelected: function () {
        return this.button.isSelected();
    },

    setValue: function (v) {
        this.button.setValue(v);
    },

    getValue: function () {
        return this.button.getValue();
    },

    populate: function (items) {

    }
});
BI.FileManagerNavButton.EVENT_CHANGE = "FileManagerNavButton.EVENT_CHANGE";
BI.shortcut("bi.file_manager_nav_button", BI.FileManagerNavButton);