/**
 * Created by User on 2017/3/22.
 */
Demo.MultiSelectTree = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-multi-select-tree"
    },
    render: function () {
        return {
            type: "bi.vertical",
        }
    }
});
$.shortcut("demo.multi_select_tree", Demo.MultiSelectTree);