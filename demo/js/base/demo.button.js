Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-face"
    },
    render: function () {
        return {
            type: "bi.vertical",
        }
    }
});
$.shortcut("demo.button", Demo.Button);