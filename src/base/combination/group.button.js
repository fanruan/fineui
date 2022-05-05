/**
 * Created by GUY on 2015/6/26.
 * @class BI.ButtonGroup
 * @extends BI.Widget
 */

BI.ButtonGroup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ButtonGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-button-group",
            behaviors: {},
            items: [],
            value: "",
            chooseType: BI.Selection.Single,
            layouts: [{
                type: "bi.center",
                hgap: 0,
                vgap: 0
            }]
        });
    },

    render: function () {
        var self = this, o = this.options;
        var behaviors = {};
        BI.each(o.behaviors, function (key, rule) {
            behaviors[key] = BI.BehaviorFactory.createBehavior(key, {
                rule: rule
            });
        });
        this.behaviors = behaviors;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
        o.value = BI.isFunction(o.value) ? this.__watch(o.value, function (context, newValue) {
            self.setValue(newValue);
        }) : o.value;
        if (BI.isKey(o.value) || BI.isNotEmptyArray(o.value)) {
            this.setValue(o.value);
        }
    },

    _createBtns: function (items) {
        var o = this.options;
        return BI.createWidgets(BI.createItems(items, {
            type: "bi.text_button"
        }), this);
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
                        case BI.ButtonGroup.CHOOSE_TYPE_SINGLE:
                            self.setValue(btn.getValue());
                            break;
                        case BI.ButtonGroup.CHOOSE_TYPE_NONE:
                            self.setValue([]);
                            break;
                    }
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.fireEvent(BI.ButtonGroup.EVENT_CHANGE, value, obj);
                } else {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                }
            });
            btn.on(BI.Events.DESTROY, function () {
                BI.remove(self.buttons, btn);
            });
        });

        return buttons;
    },

    _packageBtns: function (btns) {
        var o = this.options;
        var layouts = BI.isArray(o.layouts) ? o.layouts : [o.layouts];
        for (var i = layouts.length - 1; i > 0; i--) {
            btns = BI.map(btns, function (k, it) {
                return BI.extend({}, layouts[i], {
                    items: [
                        BI.extend({}, layouts[i].el, {
                            el: it
                        })
                    ]
                });
            });
        }
        return btns;
    },

    _packageSimpleItems: function (btns) {
        var o = this.options;
        return BI.map(o.items, function (i, item) {
            if (BI.stripEL(item) === item) {
                return btns[i];
            }
            return BI.extend({}, item, {
                el: btns[i]
            });
        });
    },

    _packageItems: function (items, packBtns) {
        return BI.createItems(BI.makeArrayByArray(items, {}), BI.clone(packBtns));
    },

    _packageLayout: function (items) {
        var o = this.options, layout = BI.deepClone(BI.isArray(o.layouts) ? o.layouts[0] : o.layouts);

        var lay = BI.formatEL(layout).el;
        while (lay && lay.items && !BI.isEmpty(lay.items)) {
            lay = BI.formatEL(lay.items[0]).el;
        }
        lay.items = items;
        return layout;
    },

    // 如果是一个简单的layout
    _isSimpleLayout: function () {
        var o = this.options;
        return BI.isArray(o.layouts) ? (o.layouts.length === 1 && !BI.isArray(o.items[0])) : true;
    },

    doBehavior: function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.buttons);
        BI.each(this.behaviors, function (i, behavior) {
            behavior.doBehavior.apply(behavior, args);
        });
    },

    prependItems: function (items) {
        var o = this.options;
        var btns = this._btnsCreator.apply(this, arguments);
        this.buttons = BI.concat(btns, this.buttons);

        if (this._isSimpleLayout() && this.layouts && this.layouts.prependItems) {
            this.layouts.prependItems(btns);
            return;
        }

        items = this._packageItems(items, this._packageBtns(btns));
        this.layouts.prependItems(this._packageLayout(items).items);
    },

    addItems: function (items) {
        var o = this.options;
        var btns = this._btnsCreator.apply(this, arguments);
        this.buttons = BI.concat(this.buttons, btns);

        // 如果是一个简单的layout
        if (this._isSimpleLayout() && this.layouts && this.layouts.addItems) {
            this.layouts.addItems(btns);
            return;
        }

        items = this._packageItems(items, this._packageBtns(btns));
        this.layouts.addItems(this._packageLayout(items).items);
    },

    removeItemAt: function (indexes) {
        BI.removeAt(this.buttons, indexes);
        this.layouts.removeItemAt(indexes);
    },

    removeItems: function (values) {
        values = BI.isArray(values) ? values : [values];
        var deleted = [];
        BI.each(this.buttons, function (i, button) {
            if (BI.deepContains(values, button.getValue())) {
                deleted.push(i);
            }
        });
        BI.removeAt(this.buttons, deleted);
        this.layouts.removeItemAt(deleted);
    },

    populate: function (items) {
        items = items || [];
        this.empty();
        this.options.items = items;

        this.buttons = this._btnsCreator.apply(this, arguments);
        if (this._isSimpleLayout()) {
            items = this._packageSimpleItems(this.buttons);
        } else {
            items = this._packageItems(items, this._packageBtns(this.buttons));
        }

        this.layouts = BI.createWidget(BI.extend({element: this}, this._packageLayout(items)));
    },

    setNotSelectedValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected && item.setSelected(false);
            } else {
                item.setSelected && item.setSelected(true);
            }
        });
    },

    setEnabledValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.deepContains(v, item.getValue())) {
                item.setEnable(true);
            } else {
                item.setEnable(false);
            }
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected && item.setSelected(true);
            } else {
                item.setSelected && item.setSelected(false);
            }
        });
    },

    getNotSelectedValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !(item.isSelected && item.isSelected())) {
                v.push(item.getValue());
            }
        });
        return v;
    },

    getValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && item.isSelected && item.isSelected()) {
                v.push(item.getValue());
            }
        });
        return v;
    },

    getAllButtons: function () {
        return this.buttons;
    },

    getAllLeaves: function () {
        return this.buttons;
    },

    getSelectedButtons: function () {
        var btns = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isSelected && item.isSelected()) {
                btns.push(item);
            }
        });
        return btns;
    },

    getNotSelectedButtons: function () {
        var btns = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isSelected && !item.isSelected()) {
                btns.push(item);
            }
        });
        return btns;
    },

    getIndexByValue: function (value) {
        var index = -1;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled() && item.getValue() === value) {
                index = i;
                return true;
            }
        });
        return index;
    },

    getNodeById: function (id) {
        var node;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled() && item.options.id === id) {
                node = item;
                return true;
            }
        });
        return node;
    },

    getNodeByValue: function (value) {
        var node;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled() && item.getValue() === value) {
                node = item;
                return true;
            }
        });
        return node;
    },

    empty: function () {
        BI.ButtonGroup.superclass.empty.apply(this, arguments);
        this.options.items = [];
    },

    destroy: function () {
        BI.ButtonGroup.superclass.destroy.apply(this, arguments);
        this.options.items = [];
    }
});
BI.extend(BI.ButtonGroup, {
    CHOOSE_TYPE_SINGLE: BI.Selection.Single,
    CHOOSE_TYPE_MULTI: BI.Selection.Multi,
    CHOOSE_TYPE_ALL: BI.Selection.All,
    CHOOSE_TYPE_NONE: BI.Selection.None,
    CHOOSE_TYPE_DEFAULT: BI.Selection.Default
});
BI.ButtonGroup.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.button_group", BI.ButtonGroup);
