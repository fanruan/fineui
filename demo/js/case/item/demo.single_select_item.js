/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Items = BI.inherit(BI.Widget, {

    render: function () {

        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                height: 30,
                text: "单选item"
            }, {
                type: "bi.single_select_item",
                text: "单选项"
            }],
            hgap: 300
        };
    }
});


BI.shortcut("demo.single_select_item", Demo.Items);