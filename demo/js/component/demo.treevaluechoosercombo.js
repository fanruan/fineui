Demo.TreeValueChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tree-value-chooser-combo"
    },
    render: function () {

        var widget = BI.createWidget({
            type: "bi.tree_value_chooser_insert_combo",
            width: 300,
            // items: BI.deepClone(Demo.CONSTANTS.TREEITEMS),
            itemsCreator: function (op, callback) {
                callback(BI.deepClone(Demo.CONSTANTS.TREEITEMS));
            }
        });
        var widget1 = BI.createWidget({
            type: "bi.list_tree_value_chooser_insert_combo",
            itemsCreator: function (op, callback) {
                callback(BI.deepClone(Demo.CONSTANTS.TREEITEMS));
            }
        });
        widget.setValue({
            "中国": {
                "安徽省": {
                    "安庆市": {}
                }
            },
            "newValue": {}
        });
        widget1.setValue([
            ["中国", "安徽省"],
            ["中国", "安徽省", "安庆市"],
            ["newValue"]
        ]);
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.vertical_adapt",
                hgap: 200,
                vgap: 10,
                items: [widget, widget1]
            }]

        };
    }
});
BI.shortcut("demo.tree_value_chooser_combo", Demo.TreeValueChooser);
