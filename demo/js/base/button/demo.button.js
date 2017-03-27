Demo.Button = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: 'bi.button',
                    text: '一般按钮',
                    level: 'common',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示成功状态按钮',
                    level: 'success',
                    height: 30
                }
            },
            {
                el: {
                    type: 'bi.button',
                    text: '表示警告状态的按钮',
                    level: 'warning',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '表示忽略状态的按钮',
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '普通灰化按钮',
                    disabled: true,
                    level: 'success',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '忽略状态灰化按钮',
                    disabled: true,
                    level: 'ignore',
                    height: 30
                }
            }, {
                el: {
                    type: 'bi.button',
                    text: '带图标的按钮',
                    //level: 'ignore',
                    iconClass: "rename-font",
                    height: 30
                }
            }
        ];
        BI.each(items, function (i, item) {
            item.el.handler = function () {
                BI.Msg.alert('按钮', this.options.text);
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
BI.shortcut("demo.button", Demo.Button);