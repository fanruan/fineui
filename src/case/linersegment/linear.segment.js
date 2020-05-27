BI.LinearSegment = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-linear-segment bi-split-bottom",
        items: [],
        layouts: [{
            type: "bi.center"
        }],
        height: 29
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.linear_segment_button",
                height: o.height - 1
            }),
            layouts: o.layouts,
            listeners: [{
                eventName: "__EVENT_CHANGE__",
                action: function () {
                    self.fireEvent("__EVENT_CHANGE__", arguments);
                }
            }, {
                eventName: "EVENT_CHANGE",
                action: function () {
                    self.fireEvent("EVENT_CHANGE");
                }
            }],
            ref: function () {
                self.buttonGroup = this;
            }
        };
    },

    setValue: function (v) {
        this.buttonGroup.setValue(v);
    },

    setEnabledValue: function (v) {
        this.buttonGroup.setEnabledValue(v);
    },


    getValue: function () {
        return this.buttonGroup.getValue();
    }
});
BI.shortcut("bi.linear_segment", BI.LinearSegment);