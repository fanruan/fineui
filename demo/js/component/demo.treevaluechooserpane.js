Demo.TreeValueChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tree-value-chooser"
    },
    render: function () {

        var tree = [];
        for (var i = 0; i < 221; i++) {
            tree.push({
                value: "" + i + "",
                text: "" + i + "",
                id: i + "",
                pId: null
            });
            for (var j = 0; j < 9; j++) {
                tree.push({
                    value: i + "-" + j,
                    text: j + "",
                    id: i + "-" + j,
                    pId: i + ""
                })
            }
        }
        return {
            type: "bi.tree_value_chooser_pane",
            width: 300,
            items: tree,
            itemsCreator: function (op, callback) {
                callback(tree);
            }
        };
    }
});
BI.shortcut("demo.tree_value_chooser_pane", Demo.TreeValueChooser);
