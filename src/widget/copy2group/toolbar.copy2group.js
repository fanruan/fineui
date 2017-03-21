/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/9/25.
 * @class BI.Copy2GroupBar
 * @extends BI.Widget
 */
BI.Copy2GroupBar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Copy2GroupBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-copy2group-bar"
        })
    },
    _init: function () {
        BI.Copy2GroupBar.superclass._init.apply(this, arguments);
        var self = this;
        this.search = BI.createWidget({
            type: "bi.text_editor",
            watermark: BI.i18nText("BI-Search_And_Create_Group"),
            allowBlank: true
        });

        this.search.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });


        this.search.on(BI.TextEditor.EVENT_CHANGE, function () {
            self.button.setValue(this.getValue());
            if(this.getValue() !== "") {
                self.fireEvent(BI.Copy2GroupBar.EVENT_CHANGE);
            }
        });

        this.search.on(BI.TextEditor.EVENT_EMPTY, function () {
            self.button.invisible();
            self.fireEvent(BI.Copy2GroupBar.EVENT_EMPTY);
        });

        this.search.on(BI.TextEditor.EVENT_START, function () {
            self.button.visible();
            self.fireEvent(BI.Copy2GroupBar.EVENT_START);
        });

        this.button = BI.createWidget({
            type: "bi.copy2group_add_button"
        });

        this.button.on(BI.Copy2GroupAddButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.Copy2GroupBar.EVENT_CLICK_BUTTON);
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 5,
            hgap: 5,
            items: [this.search, this.button]
        });

        this.button.invisible();
    },

    blur: function(){
        this.search.blur();
    },

    setButtonVisible: function (b) {
        this.button.setVisible(b);
    },

    getValue: function () {
        return this.search.getValue();
    },

    setValue: function (v) {
        this.search.setValue(v);
        this.button.setValue(v);
    }
});
BI.Copy2GroupBar.EVENT_CHANGE = "Copy2GroupBar.EVENT_CHANGE";
BI.Copy2GroupBar.EVENT_START = "Copy2GroupBar.EVENT_START";
BI.Copy2GroupBar.EVENT_EMPTY = "Copy2GroupBar.EVENT_EMPTY";
BI.Copy2GroupBar.EVENT_CLICK_BUTTON = "Copy2GroupBar.EVENT_CLICK_BUTTON";
$.shortcut("bi.copy2group_bar", BI.Copy2GroupBar);