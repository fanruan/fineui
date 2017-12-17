/**
 * Created by Windy on 2017/12/15.
 */
Demo.SQLEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        this.formula = BI.createWidget({
            type : 'bi.sql_editor',
            width : 300,
            height : 200,
            value : 'select * from DEMO_CONTRACT'
        });
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this.formula],
            hgap: 20,
            vgap: 20
        })
    }
});
BI.shortcut("demo.sql_editor", Demo.SQLEditor);