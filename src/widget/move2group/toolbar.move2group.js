/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/9/25.
 * @class BI.Move2GroupBar
 * @extends BI.Widget
 */
BI.Move2GroupBar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Move2GroupBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-move2group-bar"
        })
    },
    _init: function () {
        BI.Move2GroupBar.superclass._init.apply(this, arguments);
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
            if (this.getValue() !== "") {
                self.fireEvent(BI.Move2GroupBar.EVENT_CHANGE);
            }
        });

        this.search.on(BI.TextEditor.EVENT_EMPTY, function () {
            self.button.invisible();
            self.fireEvent(BI.Move2GroupBar.EVENT_EMPTY);
        });

        this.search.on(BI.TextEditor.EVENT_START, function () {
            self.button.visible();
            self.fireEvent(BI.Move2GroupBar.EVENT_START);
        });

        this.button = BI.createWidget({
            type: "bi.move2group_add_button"
        });

        this.button.on(BI.Move2GroupAddButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.Move2GroupBar.EVENT_CLICK_BUTTON);
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
BI.Move2GroupBar.EVENT_START = "Move2GroupBar.EVENT_START";
BI.Move2GroupBar.EVENT_EMPTY = "Move2GroupBar.EVENT_EMPTY";
BI.Move2GroupBar.EVENT_CHANGE = "Move2GroupBar.EVENT_CHANGE";
BI.Move2GroupBar.EVENT_CLICK_BUTTON = "Move2GroupBar.EVENT_CLICK_BUTTON";
$.shortcut("bi.move2group_bar", BI.Move2GroupBar);