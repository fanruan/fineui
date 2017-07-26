/**
 * Created by Dailer on 2017/7/26.
 */


Demo.SwitchTree = BI.inherit(BI.Widget, {

    render: function () {
        var self = this;
        var tree = BI.createWidget({
            type: "bi.switch_tree",
            items: BI.deepClone(Demo.CONSTANTS.TREE)
        });

        return {
            type: "bi.vtape",
            items: [{
                el: tree
            }, {
                el: {
                    type: "bi.button",
                    height: 25,
                    text: "点击切换",
                    handler: function () {
                        tree.switchSelect();
                    }
                },
                height: 25
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
        }
    }
});

BI.shortcut("demo.switch_tree", Demo.SwitchTree);