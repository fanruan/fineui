/**
 * Created by Dailer on 2017/7/26.
 */


Demo.MultiLayerSelectLevelTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        var tree = BI.createWidget({
            type: "bi.multilayer_select_level_tree",
            items: BI.deepClone(Demo.CONSTANTS.TREE),
            value: "第五级文件1"
        });

        return {
            type: "bi.vtape",
            items: [{
                el: tree
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", JSON.stringify(tree.getValue()));
                    }
                },
                height: 25
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "setValue (第二级文件1)",
                    handler: function () {
                        tree.setValue(["第二级文件1"]);
                    }
                },
                height: 25
            }],
            width: 500,
            hgap: 300
        };
    }
});

BI.shortcut("demo.multilayer_select_level_tree", Demo.MultiLayerSelectLevelTree);
