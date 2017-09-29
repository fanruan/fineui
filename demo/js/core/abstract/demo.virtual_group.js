Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createItems: function () {
        var items = BI.map(BI.range(1000), function (i) {
            return {
                type: "demo.virtual_group_item",
                key: i + 1
            }
        });
        return items;
    },

    render: function () {
        var self = this;
        var buttonGroupItems = self._createItems();
        var virtualGroupItems = self._createItems();
        return {
            type: "bi.vertical",
            vgap: 20,
            items: [{
                type: "bi.label",
                cls: "layout-bg5",
                height: 50,
                text: "共1000个元素，演示button_group和virtual_group每次删除第一个元素"
            }, {
                type: "bi.button_group",
                width: 500,
                height: 300,
                ref: function () {
                    self.buttonGroup = this;
                },
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical"
                }],
                items: this._createItems()
            }, {
                type: "bi.button",
                text: "演示button_group的刷新",
                handler: function () {
                    buttonGroupItems.shift();
                    self.buttonGroup.populate(BI.deepClone(buttonGroupItems));
                }
            }, {
                type: "bi.virtual_group",
                width: 500,
                height: 300,
                ref: function () {
                    self.virtualGroup = this;
                },
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical"
                }],
                items: this._createItems()
            }, {
                type: "bi.button",
                text: "演示virtual_group的刷新",
                handler: function () {
                    virtualGroupItems.shift();
                    self.virtualGroup.populate(BI.deepClone(virtualGroupItems));
                }
            }]

        }
    }
});
BI.shortcut("demo.virtual_group", Demo.Func);

Demo.Item = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-item",
        height: 30
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.label",
            ref: function () {
                self.label = this;
            },
            height: this.options.height,
            text: "key:" + o.key + ",随机数" + BI.UUID()
        }
    },

    update: function (item) {
        this.label.setText(item.value);
        console.log("更新了一项");
        return true;//返回是不是更新成功
    },

    created: function () {
        console.log("创建了一项");
    },

    destroyed: function () {
        console.log("删除了一项");
    }
});
BI.shortcut("demo.virtual_group_item", Demo.Item);