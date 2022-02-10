Demo.Toast = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-toast"
    },
    render: function () {
        var items = [
            {
                el: {
                    type: "bi.button",
                    text: "简单Toast测试(success)",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条简单的数据", {
                            level: "success"
                        });
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "很长的Toast测试(normal)",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的数据", {

                        });
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "非常长的Toast测试(warning)",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("这是一条非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长非常长的数据", {
                            level: "warning",
                            autoClose: false
                        });
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "错误提示Toast测试(error)",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("错误提示Toast测试", {
                            level: "error"
                        });
                    }
                }
            }, {
                el: {
                    type: "bi.button",
                    text: "错误提示Toast测试(error), 此toast不会自动消失",
                    height: 30,
                    handler: function () {
                        BI.Msg.toast("错误提示Toast测试", {
                            autoClose: false
                        });
                    }
                }
            }
        ];
        BI.createWidget({
            type: "bi.left",
            element: this,
            vgap: 200,
            hgap: 20,
            items: items
        });
    }
});
BI.shortcut("demo.toast", Demo.Toast);