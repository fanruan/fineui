/**
 * Created by fay on 2016/9/14.
 */
BI.TextLabelItemGroup = BI.inherit(BI.ButtonGroup, {
    _defaultConfig: function () {
        return BI.extend(BI.TextLabelItemGroup.superclass._defaultConfig.apply(this, arguments), {
            chooseType: BI.Selection.Multi
        });
    },

    _init: function () {
        BI.TextLabelItemGroup.superclass._init.apply(this, arguments);
        this._checkBtnStyle();
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
                            if (BI.isEmptyString(btn.getValue())) {
                                self.setValue([]);
                            } else {
                                self._checkBtnStyle();
                            }
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
            })
        });

        return buttons;
    },

    _checkBtnStyle: function () {
        var self = this;
        var flag = BI.isEmptyArray(this.getValue());
        BI.each(this.buttons, function (idx, btn) {
            if (flag && BI.isEmptyString(btn.getValue())) {
                btn.setSelected(true);
                btn.doHighLight();
            }
            if (!flag && BI.isEmptyString(btn.getValue())) {
                btn.setSelected(false);
                btn.unHighLight();
            }
            if (btn.isSelected()) {
                btn.doHighLight();
            } else {
                btn.unHighLight();
            }
        });
    },

    setValue: function (v) {
        BI.TextLabelItemGroup.superclass.setValue.apply(this, arguments);
        this._checkBtnStyle();
    }
});

$.shortcut('bi.text_label_item_group', BI.TextLabelItemGroup);
