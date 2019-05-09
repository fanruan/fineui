/**
 * 多选输入框, 选中项将会以块状形式出现, 可以在触发器中删除item
 * @author windy
 * @class BI.MultiSelectBlockEditor
 * @extends Widget
 */
BI.MultiSelectBlockEditor = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-multi-select-block-editor",
        el: {}
    },

    render: function () {
        var self = this;
        return {
            type: "bi.inline_vertical_adapt",
            scrollx: false,
            items: [{
                el: {
                    type: "bi.inline_vertical_adapt",
                    tagName: "ul",
                    cls: "label-wrapper",
                    ref: function (_ref) {
                        self.labelWrapper = _ref;
                    },
                    items: [],
                    hgap: 5
                }
            }, {
                type: "bi.sign_editor",
                allowBlank: true,
                cls: "search-editor",
                ref: function (_ref) {
                    self.editor = _ref;
                },
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.Controller.EVENT_CHANGE);
                    }
                }, {
                    eventName: BI.Editor.EVENT_PAUSE,
                    action: function () {
                        self.fireEvent(BI.MultiSelectBlockEditor.EVENT_PAUSE);
                    }
                }],
                height: 22
            }]
        };
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setState: function (state) {
        var values = BI.map(state, function (idx, path) {
            return BI.last(path);
        });
        this.labelWrapper.populate(BI.map(values, function (idx, value) {
            return {
                type: "bi.text_button",
                tagName: "li",
                cls: "bi-border-radius bi-list-item-select label-item",
                text: value
            };
        }));
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        var v = this.editor.getState();
        if (BI.isArray(v) && v.length > 0) {
            return v[v.length - 1];
        }
        return "";
    },

    getKeywords: function () {
        var val = this.editor.getLastValidValue();
        var keywords = val.match(/[\S]+/g);
        if (BI.isEndWithBlank(val)) {
            return keywords.concat([" "]);
        }
        return keywords;
    },

    populate: function (items) {

    }
});
BI.MultiSelectBlockEditor.EVENT_PAUSE = "MultiSelectBlockEditor.EVENT_PAUSE";
BI.shortcut("bi.multi_select_block_editor", BI.MultiSelectBlockEditor);
