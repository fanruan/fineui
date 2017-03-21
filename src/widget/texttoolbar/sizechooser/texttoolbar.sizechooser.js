/**
 * 字体大小选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbarSizeChooser
 * @extends BI.Widget
 */
BI.TextToolbarSizeChooser = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextToolbarSizeChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-toolbar-size-chooser",
            width: 50,
            height: 20
        });
    },

    _items: [{
        value: 12
    }, {
        value: 14,
        selected: true
    }, {
        value: 16
    }, {
        value: 18
    }, {
        value: 20
    }, {
        value: 22
    }, {
        value: 24
    }, {
        value: 26
    }, {
        value: 28
    }, {
        value: 30
    }, {
        value: 32
    }, {
        value: 34
    }, {
        value: 36
    }, {
        value: 38
    }, {
        value: 40
    }, {
        value: 64
    }, {
        value: 128
    }],

    _init: function () {
        BI.TextToolbarSizeChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.editor_trigger",
            cls: "text-toolbar-size-chooser-editor-trigger",
            height: o.height,
            triggerWidth: 12,
            validationChecker: function (size) {
                return BI.isInteger(size) && size > 0;
            },
            value: 14
        });
        this.trigger.on(BI.EditorTrigger.EVENT_CHANGE, function () {
            self.setValue(BI.parseInt(this.getValue()));
            self.fireEvent(BI.TextToolbarSizeChooser.EVENT_CHANGE, arguments);
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
            this.hideView();
            self.fireEvent(BI.TextToolbarSizeChooser.EVENT_CHANGE, arguments);
        })
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return BI.parseInt(this.trigger.getValue());
    }
});
BI.TextToolbarSizeChooser.EVENT_CHANGE = "BI.TextToolbarSizeChooser.EVENT_CHANGE";
$.shortcut('bi.text_toolbar_size_chooser', BI.TextToolbarSizeChooser);