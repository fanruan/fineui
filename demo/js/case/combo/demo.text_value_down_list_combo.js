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
                items: [[{
                    text: "属于",
                    value: 1,
                    cls: "dot-e-font"
                }, {
                    text: "不属于",
                    value: 2,
                    cls: "dot-e-font"
                }], [{
                    el: {
                        text: "大于",
                        value: 3,
                        iconCls1: "dot-e-font"
                    },
                    value: 3,
                    children: [{
                        text: "固定值",
                        value: 4,
                        cls: "dot-e-font"
                    }, {
                        text: "平均值",
                        value: 5,
                        cls: "dot-e-font"
                    }]
                }]]
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