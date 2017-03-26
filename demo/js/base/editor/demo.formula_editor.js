Demo.CodeEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        this.formula = BI.createWidget({
            type : 'bi.formula_editor',
            width : 300,
            height : 200,
            value : 'SUM(C5, 16, 26)'
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
$.shortcut("demo.formula_editor", Demo.CodeEditor);