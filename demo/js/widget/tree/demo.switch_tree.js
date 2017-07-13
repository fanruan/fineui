/**
 * Created by Dailer on 2017/7/13.
 */
Demo.SwitchTree = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },
    render: function () {

        var items = BI.deepClone(Demo.CONSTANTS.TREE);
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.switch_tree",
                items: items
            },{
                type:"bi.button",
                text:"getValue"
            }]
        }
    }
})

BI.shortcut("demo.switch_tree", Demo.SwitchTree);