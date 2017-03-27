Demo.Title = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-title"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                cls: "layout-bg1",
                height: 50,
                title: "title提示",
                text: "移上去有title提示",
                textAlign: "center"
            }, {
                type: "bi.label",
                cls: "layout-bg6",
                height: 50,
                disabled: true,
                warningTitle: "title错误提示",
                text: "移上去有title错误提示",
                textAlign: "center"
            }, {
                type: "bi.label",
                cls: "layout-bg2",
                height: 50,
                disabled: true,
                tipType: "success",
                title: "自定义title提示效果",
                warningTitle: "自定义title提示效果",
                text: "自定义title提示效果",
                textAlign: "center"
            }],
            hgap: 300,
            vgap: 20
        }
    }
});
BI.shortcut("demo.title", Demo.Title);