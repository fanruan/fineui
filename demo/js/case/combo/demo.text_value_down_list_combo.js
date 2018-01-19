/**
 * Created by Dailer on 2017/7/11.
 */
Demo.TextValueDownListCombo = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var self = this;
        return {
            type: "bi.horizontal_auto",
            items: [{
                type: "bi.text_value_down_list_combo",
                width: 300,
                ref: function (_ref) {
                    self.refs = _ref;
                },
                text: "默认值",
                value: 11,
                items: [
                    [{
                        el: {
                            text: "层级1",
                            value: 1
                        },
                        children: [{
                            text: "层级1-1",
                            value: 11
                        }]
                    }],
                    [{
                        text: "层级2",
                        value: 2
                    }, {
                        text: "层级3",
                        value: 3
                    }]
                ]
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                text: "setValue",
                handler: function () {
                    self.refs.setValue(2);
                }
            }, {
                type: "bi.button",
                width: 90,
                height: 25,
                text: "getValue",
                handler: function () {
                    BI.Msg.alert("", JSON.stringify(self.refs.getValue()));
                }
            }],
            vgap: 20
        };
    }
});

BI.shortcut("demo.text_value_down_list_combo", Demo.TextValueDownListCombo);