BI.LinearSegment = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-linear-segment",
        items: [],
        layouts: [{
            type: "bi.center"
        }],
        height: 30
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.linear_segment_button",
                height: o.height
            }),
            layouts: o.layouts,
            value: o.value,
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
