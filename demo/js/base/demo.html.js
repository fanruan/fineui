Demo.Html = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-html"
    },
    render: function () {
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.html",
                text: "<h1>在bi.html标签中使用html原生标签</h1>"
            }, {
                type: "bi.html",
                text: "<ul>ul列表<li>list item1</li><li>list item2</li></ul>"
            }],
            hgap: 300,
            vgap: 20
        };
    }
});
BI.shortcut("demo.html", Demo.Html);