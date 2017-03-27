Demo.Message = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-bubble"
    },
    render: function () {
        return {
            type: "bi.center_adapt",
            items : [
                {
                    el : {
                        type : 'bi.button',
                        text : '点击我弹出一个消息框',
                        height : 30,
                        handler : function() {
                            BI.Msg.alert('测试消息框', '我是测试消息框的内容');
                        }
                    }
                }
            ]
        }
    }
});
BI.shortcut("demo.message", Demo.Message);