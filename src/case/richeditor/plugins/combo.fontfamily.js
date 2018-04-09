BI.RichEditorFontChooser = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorFontChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-rich-editor-font-chooser bi-border bi-card",
            command: "FontName",
            width: 50,
            height: 20
        });
    },

    _init: function () {
        BI.RichEditorSizeChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            readonly: true,
            height: o.height,
            triggerWidth: 16,
            text: BI.i18nText("BI-Font_Family")
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                maxWidth: 70,
                minWidth: 70,
                el: {
                    type: "bi.button_group",
                    items: BI.createItems([{
                        value: "Microsoft YaHei",
                        text: BI.i18nText("BI-Microsoft_YaHei")
                    }, {
                        value: "PingFangSC-Light !important",
                        text: BI.i18nText("BI-Apple_Light")
                    }, {
                        value: "arial",
                        text: "Arial"
                    }, {
                        value: "Verdana",
                        text: "Verdana"
                    }], {
                        type: "bi.single_select_item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            }
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            var val = this.getValue()[0];
            self.doCommand(val);
            this.hideView();
            this.setValue([]);
        });
    },

    hideIf: function (e) {
        if(!this.combo.element.find(e.target).length > 0) {
            this.combo.hideView();
        }
    }
});
BI.shortcut("bi.rich_editor_font_chooser", BI.RichEditorFontChooser);