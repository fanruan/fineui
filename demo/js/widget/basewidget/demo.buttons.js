/**
 * Created by Dailer on 2017/7/25.
 */


Demo.Buttons = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-button"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: "bi.button",
                    text: "一般按钮",
                    level: "common",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "带图标的按钮",
                    // level: 'ignore',
                    iconCls: "close-font",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "一般按钮",
                    block: true,
                    level: "common",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "一般按钮",
                    clear: true,
                    level: "common",
                    height: 30
                }
            }, {
                el: {
                    type: "bi.multi_select_bar",
                    selected: true,
                    halfSelected: true
                }
            }, {
                el: {
                    type: "bi.multi_select_bar",
                    selected: true,
                    halfSelected: false
                }
            }, {
                el: {
                    type: "bi.multi_select_bar",
                    selected: false,
                    halfSelected: true
                }
            }, {
                el: {
                    type: "bi.multi_select_bar"
                }
            }
        ];
        BI.each(items, function (i, item) {
            item.el.handler = function () {
                BI.Msg.alert("按钮", this.options.text);
            };
        });
        return {
            type: "bi.left",
            vgap: 100,
            hgap: 20,
            items: items
        };
    }
});
BI.shortcut("demo.buttons", Demo.Buttons);