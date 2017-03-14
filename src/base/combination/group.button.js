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
            items: [
                {
                    el: {type: "bi.text_button", text: "", value: ""}
                }
            ],
            chooseType: BI.Selection.Single,
            layouts: [{
                type: "bi.center",
                hgap: 0,
                vgap: 0
            }]
        })
    },

    _init: function () {
        BI.ButtonGroup.superclass._init.apply(this, arguments);
        var behaviors = {};
        BI.each(this.options.behaviors, function (key, rule) {
            behaviors[key] = BI.BehaviorFactory.createBehavior(key, {
                rule: rule
            })
        });
        this.behaviors = behaviors;
        this.populate(this.options.items);
    },

    _createBtns: function (items) {
        var o = this.options;
        return BI.createWidgets(BI.createItems(items, {
            type: "bi.text_button"
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

    _packageBtns: function (btns) {
        var o = this.options;

        for (var i = o.layouts.length - 1; i > 0; i--) {
            btns = BI.map(btns, function (k, it) {
                return BI.extend({}, o.layouts[i], {
                    items: [
                        BI.extend({}, o.layouts[i].el, {
                            el: it
                        })
                    ]
                })
            })
        }
        return btns;
    },

    _packageItems: function (items, packBtns) {
        return BI.createItems(BI.makeArrayByArray(items, {}), BI.clone(packBtns));
    },

    _packageLayout: function (items) {
        var o = this.options, layout = BI.deepClone(o.layouts[0]);

        var lay = BI.formatEL(layout).el;
        while (lay && lay.items && !BI.isEmpty(lay.items)) {
            lay = BI.formatEL(lay.items[0]).el;
        }
        lay.items = items;
        return layout;
    },


    doBehavior: function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.buttons);
        BI.each(this.behaviors, function (i, behavior) {
            behavior.doBehavior.apply(behavior, args);
        })
    },

    prependItems: function (items) {
        var o = this.options;
        var btns = this._btnsCreator.apply(this, arguments);
        this.buttons = BI.concat(btns, this.buttons);

        //如果是一个简单的layout
        if (o.layouts.length === 1 && !BI.isNotEmptyArray(o.layouts[0].items)
            && this.layouts && this.layouts.prependItems) {
            this.layouts.prependItems(btns);
            return;
        }

        var items = this._packageItems(items, this._packageBtns(btns));
        BI.createWidget(BI.extend(this._packageLayout(items))).element.children().prependTo(this.element);
    },

    addItems: function (items) {
        var o = this.options;
        var btns = this._btnsCreator.apply(this, arguments);
        this.buttons = BI.concat(this.buttons, btns);

        //如果是一个简单的layout
        if (o.layouts.length === 1 && !BI.isNotEmptyArray(o.layouts[0].items)
            && this.layouts && this.layouts.addItems) {
            this.layouts.addItems(btns);
            return;
        }

        var items = this._packageItems(items, this._packageBtns(btns));
        BI.createWidget(BI.extend(this._packageLayout(items))).element.children().appendTo(this.element);
    },

    removeItemAt: function (indexes) {
        var self = this;
        indexes = BI.isArray(indexes) ? indexes : [indexes];
        var buttons = [];
        BI.each(indexes, function (i, index) {
            buttons.push(self.buttons[index]);
        });
        BI.each(buttons, function (i, btn) {
            btn && btn.destroy();
        })
    },

    removeItems: function (v) {
        v = BI.isArray(v) ? v : [v];
        var indexes = [];
        BI.each(this.buttons, function (i, item) {
            if (BI.deepContains(v, item.getValue())) {
                indexes.push(i);
            }
        });
        this.removeItemAt(indexes);
    },

    populate: function (items) {
        this.options.items = items || [];
        this.empty();

        this.buttons = this._btnsCreator.apply(this, arguments);
        var items = this._packageItems(items, this._packageBtns(this.buttons));

        this.layouts = BI.createWidget(BI.extend({element: this.element}, this._packageLayout(items)));
    },

    setEnable: function (b) {
        BI.ButtonGroup.superclass.setEnable.apply(this, arguments);
        BI.each(this.buttons, function (i, item) {
            item.setEnable(b);
        });
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

    destroy: function () {
        BI.ButtonGroup.superclass.destroy.apply(this, arguments);
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

$.shortcut("bi.button_group", BI.ButtonGroup);
