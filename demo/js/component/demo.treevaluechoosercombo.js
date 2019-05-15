Demo.TreeValueChooser = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-tree-value-chooser-combo"
    },
    render: function () {

        this.widget = BI.createWidget({
            type: "bi.list_tree_value_chooser_insert_combo",
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
            items: [this.widget]
        };
    },

    mounted: function () {
        this.widget.setValue([
            ["中国", "安徽省"],
            ["中国", "澳门特别行政区"],
            ["中国", "北京市"],
            ["中国", "福建省"],
            ["中国", "甘肃省"]
        ]);
    }
});
BI.shortcut("demo.tree_value_chooser_combo", Demo.TreeValueChooser);
