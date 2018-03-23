/**
 * Created by Dailer on 2017/7/26.
 */


Demo.MultiLayerSingleLevelTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        this.tree = BI.createWidget({
            type: "bi.multilayer_single_level_tree",
            items: [],
            value: "第二级文件1"
        });

        return {
            type: "bi.vtape",
            items: [{
                el: this.tree
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "getValue",
                    handler: function () {
                        BI.Msg.alert("", JSON.stringify(self.tree.getValue()));
                    }
                },
                height: 25
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "setValue (第二级文件1)",
                    handler: function () {
                        self.tree.setValue(["第二级文件1"]);
                    }
                },
                height: 25
            }],
            width: 500,
            hgap: 300
        };
    },

    mounted: function () {
        this.tree.populate(BI.deepClone(Demo.CONSTANTS.TREE));
    }
});

BI.shortcut("demo.multilayer_single_level_tree", Demo.MultiLayerSingleLevelTree);