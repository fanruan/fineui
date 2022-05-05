BI.Collapse = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-collapse",
        items: [],
        value: [],
        trigger: "click",
        accordion: false,
        bordered: true,
        ghost: false,
        isDefaultInit: false,
        openMotion: {
            animation: "bi-slide-up",
            animationDuring: 200
        }
    },

    render: function () {
        var o = this.options;

        var collapseCls = o.ghost ? "" : "bi-background " + (o.bordered ? "bi-border bi-border-radius" : "");

        this.expanders = {};

        return {
            type: "bi.vertical",
            cls: collapseCls,
            items: this._getItems(this.options.items)

        };
    },

    _getItems: function (items) {
        var self = this, o = this.options;

        return BI.map(items, function (index, item) {
            var isActive = BI.contains(self._getCurrentValue(o.value), item.value);
            var cls = o.ghost || index === 0 ? "" : "bi-border-top";

            var el = BI.extend({
                type: "bi.arrow_group_node",
                height: 30,
                text: item.text,
                value: item.value,
                open: isActive
            }, item.el);

            var popup = BI.extend({
                animation: o.openMotion.animation,
                animationDuring: o.openMotion.animationDuring
            }, item.popup);
    
            return BI.extend({
                type: "bi.expander",
                cls: cls,
                isDefaultInit: o.isDefaultInit,
                trigger: o.trigger,
                listeners: [{
                    eventName: BI.Expander.EVENT_EXPAND,
                    action: function () {
                        self._hideOtherExpander(item.value);
                        self.fireEvent(BI.Collapse.EVENT_EXPAND, item.value);
                    }
                }]
            }, item, {
                el: el,
                popup: popup,
                ref: function (_ref) {
                    BI.isFunction(item.ref) && item.ref(_ref);
                    self.expanders[item.value] = _ref;
                }
            });
        });
    },

    _hideOtherExpander: function (expandKey) {
        if (this.options.accordion) {
            BI.each(this.expanders, function (key, expander) {
                key !== (expandKey + "") && expander.hideView();
            });
        }
    },

    _getCurrentValue: function (v) {
        var values = BI.isNotEmptyArray(v) ? v : BI.isKey(v) ? [v] : [];
        
        return this.options.accordion ? values.slice(0, 1) : values;
    },

    getValue: function () {
        var value = [];
        BI.each(this.expanders, function (key, expander) {
            expander.isExpanded() && value.push(key);
        });

        return value;
    },

    setValue: function (v) {
        var values = BI.map(this._getCurrentValue(v), function (idx, value) {return value + "";});
        BI.each(this.expanders, function (key, expander) {
            BI.contains(values, key) ? expander.showView() : expander.hideView();
        });
    }
});

BI.Collapse.EVENT_EXPAND = "EVENT_EXPAND";
BI.shortcut("bi.collapse", BI.Collapse);
