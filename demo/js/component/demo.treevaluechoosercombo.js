Demo.TreeValueChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tree-value-chooser-combo"
    },
    render: function () {

        var widget = BI.createWidget({
            type: "bi.tree_value_chooser_combo",
            width: 300,
            // items: BI.deepClone(Demo.CONSTANTS.TREEITEMS),
            itemsCreator: function (op, callback) {
                callback(BI.deepClone(Demo.CONSTANTS.TREEITEMS));
            }
        });
        return {
            type: "bi.vertical",
            hgap: 200,
            vgap: 10,
            items: [widget]
        };
    }
});
BI.shortcut("demo.tree_value_chooser_combo", Demo.TreeValueChooser);
