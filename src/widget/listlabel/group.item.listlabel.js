/**
 * Created by fay on 2016/9/14.
 */
BI.ListLabelItemGroup = BI.inherit(BI.ButtonGroup, {
    _defaultConfig: function () {
        return BI.extend(BI.ListLabelItemGroup.superclass._defaultConfig.apply(this, arguments), {
            chooseType: BI.Selection.Multi
        });
    },

    _init: function () {
        BI.ListLabelItemGroup.superclass._init.apply(this, arguments);
        this.otherValues = [];
        if (BI.isEmptyArray(this.getValue())) {
            BI.each(this.buttons, function (idx, button) {
                if (button.getValue() === BICst.LIST_LABEL_TYPE.ALL) {
                    button.setSelected(true);
                }
            });
        }
        this._checkBtnStyle();
    },

    _createBtns: function (items) {
        var o = this.options;
        return BI.createWidgets(BI.createItems(items, {
            type: "bi.text_button",
            cls: "list-label-button"
        }));
    },


    _btnsCreator: function (items) {
        var self = this, args = Array.prototype.slice.call(arguments), o = this.options;
        var buttons = this._createBtns(items);
        args[0] = buttons;

        BI.each(this.behaviors, function (i, behavior) {
            behavior.doBehavior.apply(behavior, args);
        });
        BI.each(buttons, function (i, btn) {
            btn.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                if (type === BI.Events.CLICK) {
                    switch (o.chooseType) {
                        case BI.ButtonGroup.CHOOSE_TYPE_MULTI:
                            if (btn.getValue() === BICst.LIST_LABEL_TYPE.ALL) {
                                self.setValue([BICst.LIST_LABEL_TYPE.ALL]);
                            } else {
                                self._checkBtnState();
                            }
                            self._checkBtnStyle();
                            break;
                        case BI.ButtonGroup.CHOOSE_TYPE_SINGLE:
                            self.setValue(btn.getValue());
                            break;
                        case BI.ButtonGroup.CHOOSE_TYPE_NONE:
                            self.setValue([]);
                            break;
                    }
                    self.fireEvent(BI.ButtonGroup.EVENT_CHANGE, value, obj);
                }
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
            btn.on(BI.Events.DESTROY, function () {
                BI.remove(self.buttons, btn);
            });
        });

        return buttons;
    },

    _checkBtnState: function () {
        if (BI.isEmptyArray(this.getValue()) && BI.isEmptyArray(this.otherValues)) {
            this.buttons[0].setSelected(true);
            this.fireEvent(BI.ButtonGroup.EVENT_CHANGE, this.buttons[0].getValue(), this.buttons[0]);
        } else if (this.getValue().length === 1 && BI.isEqual(this.getValue()[0], BICst.LIST_LABEL_TYPE.ALL)) {
            this.buttons[0].setSelected(true);
        }
        else {
            this.buttons[0].setSelected(false);
        }
    },

    _checkBtnStyle: function () {
        BI.each(this.buttons, function (idx, btn) {
            if (btn.isSelected()) {
                btn.doHighLight();
            } else {
                btn.unHighLight();
            }
        });
    },

    removeAllItems: function () {
        var indexes = [];
        for (var i = 1; i < this.buttons.length; i++) {
            indexes.push(i);
        }
        this.removeItemAt(indexes);
    },

    setValue: function (v) {
        var self = this;
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected && item.setSelected(true);
            } else {
                item.setSelected && item.setSelected(false);
            }
        });
        var currentValues = this.getValue();
        this.otherValues = [];
        BI.each(v, function (idx, value) {
            if (currentValues.indexOf(value) === -1) {
                self.otherValues.push(value);
            }
        });
        this._checkBtnState();
        this._checkBtnStyle();

    },

    getValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && item.isSelected && item.isSelected()) {
                v.push(item.getValue());
            }
        });
        v = v.concat(this.otherValues || []);
        return v;
    }
});

$.shortcut('bi.list_label_item_group', BI.ListLabelItemGroup);
