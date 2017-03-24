Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    _createItems: function () {
        var items = BI.makeArray(100, {
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
                type: "bi.virtual_group",
                width: 200,
                height: 300,
                ref: function () {
                    self.buttonMap = this;
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
                text: "点击刷新",
                handler: function () {
                    self.buttonMap.populate(self._createItems());
                }
            }]

        }
    }
});
$.shortcut("demo.virtual_group", Demo.Func);

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
        return true;
    },

    created: function () {
        console.log("创建了一项");
    }
});
$.shortcut("demo.virtual_group_item", Demo.Item);