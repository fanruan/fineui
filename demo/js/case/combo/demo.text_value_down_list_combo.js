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
                    text: BI.i18nText("BI-Basic_Number_IN"),
                    value: 1,
                    cls: "dot-e-font"
                }, {
                    text: BI.i18nText("BI-Basic_Not_Number_In"),
                    value: 2,
                    cls: "dot-e-font"
                }], [{
                    el: {
                        text: BI.i18nText("BI-Basic_More_Than"),
                        value: 3,
                        cls: "dot-e-font"
                    },
                    value: 3,
                    children: [{
                        text: BI.i18nText("BI-Basic_Settled_Value"),
                        value: 4,
                        cls: "dot-e-font"
                    }, {
                        text: BI.i18nText("BI-Basic_Average_Value"),
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