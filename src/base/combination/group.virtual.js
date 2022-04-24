BI.VirtualGroup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.VirtualGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-virtual-group",
            items: [],
            layouts: [{
                type: "bi.center",
                hgap: 0,
                vgap: 0
            }]
        });
    },

    render: function () {
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
        if (BI.isFunction(o.value)) {
            this.__watch(o.value, function (context, newValue) {
                self.setValue(newValue);
            })
        }
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    _packageBtns: function (items) {
        var o = this.options;
        var map = this.buttonMap = {};
        var layouts = BI.isArray(o.layouts) ? o.layouts : [o.layouts];
        for (var i = layouts.length - 1; i > 0; i--) {
            items = BI.map(items, function (k, it) {
                var el = BI.stripEL(it);
                return BI.extend({}, layouts[i], {
                    items: [
                        BI.extend({}, layouts[i].el, {
                            el: BI.extend({
                                ref: function (_ref) {
                                    if (BI.isKey(map[el.value])) {
                                        map[el.value] = _ref;
                                    }
                                }
                            }, el)
                        })
                    ]
                });
            });
        }
        return items;
    },

    _packageLayout: function (items) {
        var o = this.options;
        var layouts = BI.isArray(o.layouts) ? o.layouts : [o.layouts];
        var layout = BI.deepClone(layouts[0]);

        var lay = BI.formatEL(layout).el;
        while (lay && lay.items && !BI.isEmpty(lay.items)) {
            lay = BI.formatEL(lay.items[0]).el;
        }
        lay.items = items;
        return layout;
    },

    addItems: function (items) {
        this.layouts.addItems(items);
    },

    prependItems: function (items) {
        this.layouts.prependItems(items);
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttonMap, function (key, item) {
            if (item) {
                if (v.deepContains(key)) {
                    item.setSelected && item.setSelected(true);
                } else {
                    item.setSelected && item.setSelected(false);
                }
            }
        });
    },

    getNotSelectedValue: function () {
        var v = [];
        BI.each(this.buttonMap, function (i, item) {
            if (item) {
                if (item.isEnabled() && !(item.isSelected && item.isSelected())) {
                    v.push(item.getValue());
                }
            }
        });
        return v;
    },

    getValue: function () {
        var v = [];
        BI.each(this.buttonMap, function (i, item) {
            if (item) {
                if (item.isEnabled() && item.isSelected && item.isSelected()) {
                    v.push(item.getValue());
                }
            }
        });
        return v;
    },

    populate: function (items) {
        items = items || [];
        this.options.items = items;
        items = this._packageBtns(items);
        if (!this.layouts) {
            this.layouts = BI.createWidget(BI.extend({element: this}, this._packageLayout(items)));
        } else {
            this.layouts.populate(items, {
                context: this
            });
        }
    }
});
BI.VirtualGroup.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.virtual_group", BI.VirtualGroup);
