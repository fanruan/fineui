/**
 * Created by Windy on 2017/12/15.
 */
Demo.SQLEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        var self = this;
        this.formula = BI.createWidget({
            type : 'bi.sql_editor',
            width : 300,
            height : 200,
            value : "select * from DEMO_CONTRACT where 合同类型 = ${长期协议} and 购买数量 = sum([1,2,3,4])"
        });
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this.formula, {
                type: "bi.button",
                height: 24,
                handler: function () {
                    BI.Msg.alert("", self.formula.getValue());
                }

            }],
            hgap: 20,
            vgap: 20
        })
    }
});
BI.shortcut("demo.sql_editor", Demo.SQLEditor);