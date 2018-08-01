/**
 * Created by Windy on 2017/12/13.
 */
Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },
    render: function () {
        var self = this, id1 = BI.UUID(), id2 = BI.UUID();
        return {
            type: "bi.vertical",
            vgap: 10,
            items: [{
                type: "bi.button",
                text: "create形式创建layer, 遮住当前面板, 返回创建的面板对象",
                height: 30,
                handler: function () {
                    BI.Layers.create(id1, self, {
                        //偏移量
                        offset: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20
                        },
                        type: "bi.center_adapt",
                        cls: "bi-card",
                        items: [{
                            type: "bi.button",
                            text: "点击隐藏",
                            handler: function () {
                                BI.Layers.hide(id1);
                            }
                        }]
                    });
                    BI.Layers.show(id1);
                }
            }, {
                type: "bi.button",
                text: "make形式创建layer,可以指定放到哪个面板内,这里指定当前面板(默认放在body下撑满), 返回创建的面板对象",
                height: 30,
                handler: function () {
                    BI.Layers.make(id2, self, {
                        //偏移量
                        offset: {
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20
                        },
                        type: "bi.center_adapt",
                        cls: "bi-card",
                        items: [{
                            type: "bi.button",
                            text: "点击移除",
                            handler: function () {
                                BI.Layers.remove(id2);
                            }
                        }]
                    });
                    BI.Layers.show(id2);
                }
            }]
        };
    }
});

BI.shortcut("demo.layer", Demo.Func);