Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: "bi.text_button",
                    text: "文字按钮",
                    height: 30,
                    keyword: "w"
                }
            }
        ];
        return {
            type: "bi.left",
            vgap: 200,
            hgap: 20,
            items: items
        };
    }
});
BI.shortcut("demo.text_button", Demo.Button);