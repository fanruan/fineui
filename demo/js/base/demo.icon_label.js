Demo.IconLabel = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-bubble"
    },
    render: function () {
        return {
            type: "bi.default",
            items: [{
                type: "bi.label",
                text: "这是一个icon标签,在加了border之后仍然是居中显示的"
            }, {
                type: "bi.icon_label",
                cls: "date-font bi-border",
                height: 40,
                width: 40
            }]
        };
    }
});
BI.shortcut("demo.icon_label", Demo.IconLabel);