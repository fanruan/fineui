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
            }, {
                type: "bi.single_select_radio_item",
                text: "单选项"
            }, {
                type: "bi.label",
                height: 30,
                text: "复选item"
            }, {
                type: "bi.multi_select_item",
                text: "复选项"
            }],
            hgap: 300
        }
    }
});


BI.shortcut("demo.items", Demo.Items);