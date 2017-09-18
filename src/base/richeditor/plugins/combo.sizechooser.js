/**
 * 字体大小选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorSizeChooser
 * @extends BI.RichEditorAction
 */
BI.RichEditorSizeChooser = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorSizeChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-rich-editor-size-chooser bi-border bi-card",
            command: "FontSize",
            width: 50,
            height: 20
        });
    },

    _items: [{
        value: 1,
        text: "1(8pt)"
    }, {
        value: 2,
        text: "2(10pt)"
    }, {
        value: 3,
        text: "3(12pt)"
    }, {
        value: 4,
        text: "4(14pt)"
    }, {
        value: 5,
        text: "5(18pt)"
    }, {
        value: 6,
        text: "6(24pt)"
    }],

    _init: function () {
        BI.RichEditorSizeChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            readonly: true,
            height: o.height,
            triggerWidth: 12,
            text: BI.i18nText("BI-Font_Size")
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                maxWidth: o.width,
                minWidth: o.width,
                el: {
                    type: "bi.button_group",
                    items: BI.createItems(this._items, {
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
        })
    }
});
BI.shortcut('bi.rich_editor_size_chooser', BI.RichEditorSizeChooser);