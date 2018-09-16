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
        var tree = [
            // {id: -2, pId: 0, value: "根目录1", text: "根目录1"},
            {id: -1, pId: 0, value: "根目录", text: "根目录"},
            {id: 1, pId: -1, value: "第一级目录1", text: "第一级目录1"},
            {id: 11, pId: 1, value: "第二级文件1", text: "第二级文件1"},
            {id: 12, pId: 1, value: "第二级目录2", text: "第二级目录2"},
            {id: 121, pId: 12, value: "第三级目录1", text: "第三级目录1"},
            {id: 122, pId: 12, value: "第三级文件1", text: "第三级文件1"},
            {id: 1211, pId: 121, value: "第四级目录1", text: "第四级目录1"},
            {id: 2, pId: -1, value: "第一级目录2", text: "第一级目录2"},
            {id: 21, pId: 2, value: "第二级目录3", text: "第二级目录3"},
            {id: 22, pId: 2, value: "第二级文件2", text: "第二级文件2"},
            {id: 211, pId: 21, value: "第三级目录2", text: "第三级目录2"},
            {id: 212, pId: 21, value: "第三级文件2", text: "第三级文件2"},
            {id: 2111, pId: 211, value: "第四级文件1", text: "第四级文件1"},
            {id: 3, pId: -1, value: "第一级目录3", text: "第一级目录3"},
            {id: 31, pId: 3, value: "第二级文件2", text: "第二级文件2"},
            {id: 33, pId: 3, value: "第二级目录3", text: "第二级目录1"},
            {id: 32, pId: 3, value: "第二级文件3", text: "第二级文件3"},
            {id: 331, pId: 33, value: "第三级文件1", text: "第三级文件1"}
        ];
        this.tree.populate(tree);
    }
});

BI.shortcut("demo.multilayer_single_level_tree", Demo.MultiLayerSingleLevelTree);