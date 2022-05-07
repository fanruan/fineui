!(function () {
    var Widget = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-tree-expander",
            layer: 0,   // 第几层级
            isLastNode: false, //   是不是最后一个
            isFirstNode: false, // 是不是第一个
            selectable: false,
        },

        render: function () {

            var self = this;
            var o = this.options;

            this.trigger = BI.createWidget(o.el, {
                forceNotSelected: !o.selectable,
            });
            this.trigger.on(BI.Controller.EVENT_CHANGE, function (type) {
                o.selectable && self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });

            return {
                type: "bi.expander",
                ref: function (_ref) {
                    self.expander = _ref;
                },
                trigger: o.selectable ? "" : "click",
                el: this.trigger,
                isDefaultInit: o.isDefaultInit,
                popup: {
                    type: "bi.tree_expander.popup",
                    layer: o.layer || o.el.layer,
                    isLastNode: o.isLastNode || o.el.isLastNode,
                    isFirstNode: o.isFirstNode || o.el.isFirstNode,
                    el: o.popup,
                },
                value: o.value,
                listeners: [
                    {
                        eventName: BI.Controller.EVENT_CHANGE,
                        action: function (type) {
                            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                        },
                    },
                ],
            };
        },

        setValue: function (v) {
            if (BI.contains(v, this.trigger.getValue())) {
                this.trigger.setSelected(true);
                this.expander.setValue([]);
            } else {
                this.trigger.setSelected(false);
                this.expander.setValue(v);
            }
        },

        getValue: function () {
            if (this.trigger.isSelected()) {
                return [this.trigger.getValue()];
            }
            return this.expander.getValue();
        },

        populate: function (items) {
            this.expander.populate(items);
        },

        getAllLeaves: function () {
            return this.expander && this.expander.getAllLeaves();
        }
    });

    BI.shortcut("bi.tree_expander", Widget);
}());
