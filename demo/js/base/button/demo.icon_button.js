Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: 'bi.icon_button',
                    cls: "rename-font",
                    width: 20,
                    height: 20
                }
            }
        ];
        return {
            type: "bi.left",
            vgap: 200,
            hgap: 20,
            items: items
        }
    }
});
BI.shortcut("demo.icon_button", Demo.Button);