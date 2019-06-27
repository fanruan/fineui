/**
 * Created by Dailer on 2017/7/25.
 */

Demo.Items = BI.inherit(BI.Widget, {

    render: function () {

        return {
            type: "bi.vertical",
            items: [{
                type: "bi.text_button",
                cls: "bi-list-item-select bi-high-light-border bi-border",
                height: 30,
                level: "warning",
                text: "单选item"
            }, {
                type: "bi.single_select_item",
                height: 30,
                text: "单选项"
            }, {
                type: "bi.single_select_radio_item",
                height: 30,
                text: "单选项"
            }, {
                type: "bi.label",
                height: 30,
                text: "复选item"
            }, {
                type: "bi.multi_select_item",
                height: 30,
                text: "复选项"
            }, {
                type: "bi.switch",
                selected: true
            }],
            hgap: 300
        };
    }
});


BI.shortcut("demo.items", Demo.Items);