Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createItems: function () {
        var items = BI.makeArray(1000, {
            type: "demo.virtual_group_item"
        });
        items[0].value = BI.UUID();
        return items;
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vertical",
            vgap: 20,
            items: [{
                type: "bi.button_group",
                width: 500,
                height: 300,
                ref: function () {
                    self.buttonGroup = this;
                },
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical"
                }, {
                    type: "bi.center_adapt",
                }],
                items: this._createItems()
            }, {
                type: "bi.button",
                text: "演示button_group的刷新",
                handler: function () {
                    var items = self._createItems();
                    items.pop();
                    self.buttonGroup.populate(items);
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
                }, {
                    type: "bi.center_adapt",
                }],
                items: this._createItems()
            }, {
                type: "bi.button",
                text: "演示virtual_group的刷新",
                handler: function () {
                    var items = self._createItems();
                    items.pop();
                    self.virtualGroup.populate(items);
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
        var self = this;
        return {
            type: "bi.label",
            ref: function () {
                self.label = this;
            },
            height: this.options.height,
            text: "这是一个测试项" + BI.UUID()
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