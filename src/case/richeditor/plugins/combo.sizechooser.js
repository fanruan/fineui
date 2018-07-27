/**
 * 字体大小选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.RichEditorSizeChooser
 * @extends BI.RichEditorAction
 */
BI.RichEditorSizeChooser = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(
            BI.RichEditorSizeChooser.superclass._defaultConfig.apply(
                this,
                arguments
            ),
            {
                baseCls: "bi-rich-editor-size-chooser bi-border bi-card",
                command: "FontSize",
                width: 50,
                height: 24
            }
        );
    },

    _items: [
        {
            value: 12,
            text: 12
        },
        {
            value: 13,
            text: 13
        },
        {
            value: 14,
            text: 14
        },
        {
            value: 16,
            text: 16
        },
        {
            value: 18,
            text: 18
        },
        {
            value: 20,
            text: 20
        },
        {
            value: 22,
            text: 22
        },
        {
            value: 24,
            text: 24
        },
        {
            value: 26,
            text: 26
        },
        {
            value: 28,
            text: 28
        },
        {
            value: 30,
            text: 30
        },
        {
            value: 32,
            text: 32
        },
        {
            value: 34,
            text: 34
        },
        {
            value: 36,
            text: 36
        },
        {
            value: 38,
            text: 38
        },
        {
            value: 40,
            text: 40
        },
        {
            value: 64,
            text: 64
        },
        {
            value: 128,
            text: 128
        }
    ],

    _init: function () {
        BI.RichEditorSizeChooser.superclass._init.apply(this, arguments);
        var self = this,
            o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            readonly: true,
            height: o.height,
            triggerWidth: 16,
            text: BI.i18nText("BI-Font_Size")
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            element: this,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                maxWidth: 70,
                minWidth: 70,
                el: {
                    type: "bi.button_group",
                    items: BI.createItems(this._items, {
                        type: "bi.single_select_item"
                    }),
                    layouts: [
                        {
                            type: "bi.vertical"
                        }
                    ]
                }
            }
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            var val = this.getValue()[0];
            self.doAction(val);
            this.hideView();
            this.setValue([]);
        });
    },

    hideIf: function (e) {
        if (!this.combo.element.find(e.target).length > 0) {
            this.combo.hideView();
        }
    },

    doAction: function (fontSize) {
        var editor = this.options.editor.instance;
        var range = editor.getRng();
        var commonSize = 7;
        if (!range.collapsed) {
            this.doCommand(commonSize);
            BI.each(document.getElementsByTagName("font"), function (idx, el) {
                if (
                    BI.contains($(el).parents(), editor.element[0]) &&
                    el["size"] == commonSize
                ) {
                    $(el)
                        .removeAttr("size")
                        .css("font-size", fontSize + "px");
                }
            });
        }
    }
});
BI.shortcut("bi.rich_editor_size_chooser", BI.RichEditorSizeChooser);
