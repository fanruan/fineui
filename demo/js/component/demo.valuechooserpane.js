Demo.ValueChooserPane = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-value-chooser-pane"
    },
    render: function () {
        return {
            type: "bi.value_chooser_pane",
            items: BI.deepClone(Demo.CONSTANTS.ITEMS),
            itemsCreator: function (op, callback) {
                callback(BI.deepClone(Demo.CONSTANTS.ITEMS));
            }
        };
    }
});
BI.shortcut("demo.value_chooser_pane", Demo.ValueChooserPane);