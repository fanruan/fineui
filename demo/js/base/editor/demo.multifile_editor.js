Demo.CodeEditor = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-editor"
    },
    render: function () {
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.adaptive",
                    cls: "layout-bg1",
                    items: [{
                        type: "bi.multifile_editor",
                        width: 400,
                        height: 300
                    }],
                    width: 400,
                    height: 300
                },
                top: 50,
                left: 50
            }]
        }
    }
});
$.shortcut("demo.multifile_editor", Demo.CodeEditor);