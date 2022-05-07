/**
 * Created by GUY on 2015/8/10.
 */

BI.ComboGroup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ComboGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-combo-group bi-list-item",

            // 以下这些属性对每一个combo都是公用的
            trigger: "click,hover",
            direction: "right",
            adjustLength: 0,
            isDefaultInit: false,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,

            el: {type: "bi.text_button", text: "", value: ""},
            items: [],

            popup: {
                el: {
                    type: "bi.button_tree",
                    chooseType: 0,
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            }
        });
    },

    render: function () {
        this._populate(this.options.el);
    },

    _populate: function (item) {
        var self = this, o = this.options;
        var children = o.items;
        if (BI.isEmpty(children)) {
            throw new Error("ComboGroup构造错误");
        }
        BI.each(children, function (i, ch) {
            var son = BI.formatEL(ch).el.children;
            ch = BI.formatEL(ch).el;
            if (!BI.isEmpty(son)) {
                ch.el = BI.clone(ch);
                ch.items = son;
                ch.type = "bi.combo_group";
                ch.action = o.action;
                ch.height = o.height;
                ch.direction = o.direction;
                ch.isDefaultInit = o.isDefaultInit;
                ch.isNeedAdjustHeight = o.isNeedAdjustHeight;
                ch.isNeedAdjustWidth = o.isNeedAdjustWidth;
                ch.adjustLength = o.adjustLength;
                ch.popup = o.popup;
            }
        });
        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            container: o.container,
            height: o.height,
            trigger: o.trigger,
            direction: o.direction,
            isDefaultInit: o.isDefaultInit,
            isNeedAdjustWidth: o.isNeedAdjustWidth,
            isNeedAdjustHeight: o.isNeedAdjustHeight,
            adjustLength: o.adjustLength,
            el: item,
            popup: BI.extend({}, o.popup, {
                el: BI.extend({
                    items: children
                }, o.popup.el)
            })
        });
        this.combo.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.ComboGroup.EVENT_CHANGE, obj);
            }
        });
    },

    getValue: function () {
        return this.combo.getValue();
    },

    setValue: function (v) {
        this.combo.setValue(v);
    }
});
BI.ComboGroup.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.combo_group", BI.ComboGroup);
