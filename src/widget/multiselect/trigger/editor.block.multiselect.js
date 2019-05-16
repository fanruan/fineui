/**
 * 多选输入框, 选中项将会以块状形式出现, 可以在触发器中删除item
 * @author windy
 * @class BI.MultiSelectBlockEditor
 * @extends Widget
 */
BI.MultiSelectBlockEditor = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-multi-select-block-editor",
        el: {},
        valueFormatter: function (v) {
            return v;
        }
    },

    render: function () {
        var self = this;
        return {
            type: "bi.inline_vertical_adapt",
            scrollx: false,
            items: [{
                type: "bi.button_group",
                cls: "label-wrapper",
                ref: function (_ref) {
                    self.labelWrapper = _ref;
                },
                items: [],
                layouts: [{
                    type: "bi.inline_vertical_adapt",
                    scrollable: false,
                    tagName: "ul",
                    hgap: 5
                }],
                listeners: [{
                    eventName: BI.ButtonGroup.EVENT_CHANGE,
                    action: function () {
                        self.selection = this.getIndexByValue(this.getValue()[0]);
                        self._bindKeyDownEvent();
                    }
                }]
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
                    eventName: BI.SignEditor.EVENT_PAUSE,
                    action: function () {
                        self.fireEvent(BI.MultiSelectBlockEditor.EVENT_PAUSE);
                    }
                }, {
                    eventName: BI.SignEditor.EVENT_STOP,
                    action: function () {
                        self.fireEvent(BI.MultiSelectBlockEditor.EVENT_STOP);
                    }
                }, {
                    eventName: BI.SignEditor.EVENT_FOCUS,
                    action: function () {
                        // self._bindKeyDownEvent();
                    }
                }, {
                    eventName: BI.SignEditor.EVENT_BLUR,
                    action: function () {
                        self._unbindKeyDownEvent();
                    }
                }],
                height: 22
            }]
        };
    },

    _bindKeyDownEvent: function () {
        console.log("bind");
        BI.Widget._renderEngine.createElement(document).unbind("keydown." + this.getName());
        BI.Widget._renderEngine.createElement(document).bind("keydown." + this.getName(), BI.bind(this._dealBlockByKey, this));
    },

    _unbindKeyDownEvent: function () {
        console.log("unbind");
        BI.Widget._renderEngine.createElement(document).unbind("keydown." + this.getName());
    },

    _dealBlockByKey: function (e) {
        switch (e.keyCode) {
            case BI.KeyCode.LEFT:
                this._selectBlock(-1);
                break;
            case BI.KeyCode.RIGHT:
                this._selectBlock(1);
                break;
            case BI.KeyCode.BACKSPACE:
            case BI.KeyCode.DELETE:
                !this.editor.isEditing() && this._deleteBlock();
                break;
            default:
                break;
        }
    },

    _deleteBlock: function () {
        this.fireEvent(BI.MultiSelectBlockEditor.EVENT_DELETE);
    },

    _selectBlock: function (direction) {
        var self = this;
        var length = this._getBlocksLength();
        if (length === 0) {
            this.selection = null;
        } else {
            this.selection = BI.clamp(BI.isNull(this.selection) ? length - 1 : this.selection + direction, 0, length - 1);
        }
        var button = BI.find(this.labelWrapper.getAllButtons(), function (idx) {
            return idx === self.selection;
        });
        BI.isNotNull(button) && this.labelWrapper.setValue(button.getValue());
    },

    _getBlocksLength: function () {
        return this.labelWrapper.getAllButtons().length;
    },

    _checkPosition: function () {
        var width = this.element.width();
        var blockRegionWidth = width - 25 > 0 ? width - 25 : 0;
        var blockWrapWidth = this.labelWrapper.element.width();
        if (blockRegionWidth < blockWrapWidth) {
            this.labelWrapper.element.width(blockRegionWidth);
        }
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setState: function (state) {
        var self = this, o = this.options;
        this.selection = null;
        this.editor.isEditing() ? this._bindKeyDownEvent() : this._unbindKeyDownEvent();
        var values = BI.map(state, function (idx, path) {
            return BI.last(path);
        });
        this.labelWrapper.populate(BI.map(values, function (idx, value) {
            return {
                type: "bi.text_button",
                tagName: "li",
                cls: "bi-border-radius bi-list-item-select",
                text: o.valueFormatter(value),
                value: value,
                stopPropagation: true
            };
        }));
        BI.defer(function () {
            self._checkPosition();
        });
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
BI.MultiSelectBlockEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.MultiSelectBlockEditor.EVENT_STOP = "EVENT_STOP";
BI.MultiSelectBlockEditor.EVENT_DELETE = "EVENT_DELETE";
BI.shortcut("bi.multi_select_block_editor", BI.MultiSelectBlockEditor);
