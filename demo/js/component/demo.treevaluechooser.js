Demo.TreeValueChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tree-value-chooser"
    },
    render: function () {

        var tree = [];
        for (var i = 0; i < 21; i++) {
            tree.push({
                value: i + "",
                text: i + "",
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
        var widget = BI.createWidget({
            type: "bi.tree_value_chooser_combo",
            width: 300,
            items: tree,
            itemsCreator: function (op, callback) {
                callback(tree);
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
$.shortcut("demo.tree_value_chooser", Demo.TreeValueChooser);
