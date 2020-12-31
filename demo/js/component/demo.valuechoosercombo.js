Demo.ValueChooserCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-value-chooser-combo"
    },
    render: function () {
        var widget = BI.createWidget({
            type: "bi.value_chooser_no_bar_combo",
            itemsCreator: function (op, callback) {
                callback(BI.deepClone(Demo.CONSTANTS.ITEMS));
            },
            listeners: [{
                eventName: "EVENT_CONFIRM",
                action: function () {
                    BI.Msg.toast(widget.getValue());
                }
            }]
        });
        return {
            type: "bi.vertical",
            hgap: 200,
            vgap: 10,
            items: [widget]
        };
    }
});
BI.shortcut("demo.value_chooser_combo", Demo.ValueChooserCombo);