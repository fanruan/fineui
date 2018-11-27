/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Nodes = BI.inherit(BI.Widget, {

    render: function (vessel) {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "十字形的节点"
            }, {
                type: "bi.plus_group_node",
                text: "十字形的节点"
            }, {
                type: "bi.label",
                height: 30,
                text: "箭头节点"
            }, {
                type: "bi.arrow_group_node",
                text: "箭头节点"
            }, {
                type: "bi.icon_arrow_node",
                iconCls: "search-font",
                text: "箭头图标节点"
            }, {
                type: "bi.multilayer_icon_arrow_node",
                layer: 2
            }]
        };
    }
});

BI.shortcut("demo.nodes", Demo.Nodes);