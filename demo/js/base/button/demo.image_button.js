Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: 'bi.image_button',
                    src: "http://www.easyicon.net/api/resizeApi.php?id=1206741&size=128",
                    width: 100,
                    height: 100
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
BI.shortcut("demo.image_button", Demo.Button);