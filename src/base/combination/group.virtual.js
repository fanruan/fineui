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
        })
    },

    render: function () {
        this.populate(this.options.items);
    },

    _createBtns: function (items) {
        var o = this.options;
        return BI.createItems(items, {
            type: "bi.text_button"
        });
    },

    _packageBtns: function (btns) {
        var o = this.options;

        for (var i = o.layouts.length - 1; i > 0; i--) {
            btns = BI.map(btns, function (k, it) {
                return BI.extend({}, o.layouts[i], {
                    items: [
                        BI.extend({}, o.layouts[i].el, it)
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

    populate: function (items) {
        var self = this;
        items = items || [];
        this.options.items = items;
        items = this._packageItems(items, this._packageBtns(this._createBtns(items)));
        if (!this.layouts) {
            this.layouts = BI.createWidget(BI.extend({element: this}, this._packageLayout(items)));
        } else {
            this.layouts.populate(this._packageLayout(items).items);
        }
    }
});
BI.VirtualGroup.EVENT_CHANGE = "EVENT_CHANGE";

$.shortcut("bi.virtual_group", BI.VirtualGroup);