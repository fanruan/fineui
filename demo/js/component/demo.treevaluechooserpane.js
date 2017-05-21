Demo.TreeValueChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tree-value-chooser"
    },
    render: function () {

        return {
            type: "bi.tree_value_chooser_pane",
            items: BI.deepClone(Demo.CONSTANTS.TREEITEMS),
            // itemsCreator: function (op, callback) {
            //     callback(tree);
            // }
        };
    }
});
BI.shortcut("demo.tree_value_chooser_pane", Demo.TreeValueChooser);
