Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this, count = 1;
        var combo1 = BI.createWidget({
            type: "bi.bubble_combo",
            trigger: "click,hover",
            el: {
                type: "bi.button",
                text: "测试",
                height: 24
            },
            popup: {
                el: {
                    type: "bi.button_group",
                    items: BI.makeArray(100, {
                        type: "bi.text_item",
                        height: 24,
                        text: "item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                },
                maxHeight: 200
            }
        });
        var combo2 = BI.createWidget({
            type: "bi.bubble_combo",
            direction: "right",
            el: {
                type: "bi.button",
                text: "测试",
                height: 24
            },
            popup: {
                type: "bi.text_bubble_bar_popup_view",
                text: "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字",
                ref: function () {
                    self.popup = this;
                }
            },
            listeners: [{
                eventName: BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.popup.populate((count++) % 2 === 1 ? "我的文字变少了" : "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字");
                }
            }]
        });

        var combo3 = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 25
            },
            popup: {
                type: "bi.text_bubble_bar_popup_view",
                text: "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字",
                ref: function () {
                    self.popup = this;
                }
            },
            listeners: [{
                eventName: BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.popup.populate((count++) % 2 === 1 ? "我的文字变少了" : "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字");
                }
            }]
        });

        var combo4 = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.button",
                text: "测试",
                height: 25
            },
            popup: {
                type: "bi.text_bubble_bar_popup_view",
                text: "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字",
                ref: function () {
                    self.popup = this;
                }
            },
            listeners: [{
                eventName: BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW,
                action: function () {
                    self.popup.populate((count++) % 2 === 1 ? "我的文字变少了" : "我有很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字很多文字");
                }
            }]
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: combo1,
                left: 150,
                top: 10
            }, {
                el: combo2,
                left: 10,
                bottom: 200
            }, {
                el: combo3,
                right: 10,
                bottom: 10
            }, {
                el: combo4,
                right: 10,
                top: 10
            }]
        });
    }
});
BI.shortcut("demo.bubble_combo", Demo.Func);