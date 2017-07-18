Demo.DialogView = BI.inherit(BI.Widget, {

    render: function () {
        var items = [{
            el: {
                type: 'bi.button',
                text: '弹出对话框',
                level: 'common',
                height: 30
            }
        }];
        BI.each(items, function (i, item) {
            item.el.handler = function () {
                BI.Msg.alert('提示', "这是一段可以换行的文字，为了使它换行我要多写几个字，但是我又凑不够这么多的字，万般焦急下，只能随便写写");
            }
        });

        return {
            type: "bi.left",
            vgap: 200,
            hgap: 20,
            items: items
        }
    }
});

BI.shortcut("demo.dialog", Demo.DialogView);